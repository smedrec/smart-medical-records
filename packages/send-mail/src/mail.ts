import { Queue } from 'bullmq'
import { BullMQOtel } from 'bullmq-otel'
import { Redis } from 'ioredis'

import type { RedisOptions } from 'ioredis'
import type { SendMailEvent } from './types.js'

/**
 * Retrieves an environment variable from Cloudflare Workers or Node.js process.env.
 * This function checks `process.env` for Node.js environments
 * and `env` for Cloudflare Workers environments.
 *
 * @param variableName - The name of the environment variable to retrieve.
 * @returns The value of the environment variable, or `undefined` if not found.
 */
function getEnv(variableName: string): string | undefined {
	// Check Cloudflare Workers env
	// @ts-expect-error Hides `Cannot find name 'env'.` when not in CF Worker context.
	if (typeof env !== 'undefined' && env[variableName]) {
		// @ts-expect-error
		return env[variableName]
	}
	// Check Node.js process.env
	if (typeof process !== 'undefined' && process.env && process.env[variableName]) {
		return process.env[variableName]
	}

	return undefined
}

/**
 * Represents a client for sending mail tasks to a BullMQ queue.
 * This class encapsulates the connection to Redis and the BullMQ queue,
 * providing a simple interface to enqueue mail sending events.
 */
export class SendMail {
	/**
	 * The IORedis connection instance.
	 * @private
	 */
	private connection: Redis
	/**
	 * The name of the BullMQ queue used for mail events.
	 * @private
	 */
	private queueName: string
	/**
	 * The BullMQ Queue instance.
	 * @private
	 */
	private bullmq_queue: Queue

	/**
	 * Constructs a new `SendMail` instance.
	 *
	 * @param queueName - The name of the BullMQ queue to interact with.
	 * @param redisUrl - Optional. The Redis connection URL.
	 *                   If not provided, the constructor will attempt to retrieve it from the
	 *                   `MAIL_REDIS_URL` environment variable.
	 * @param redisConnectionOptions - Optional. Additional options to pass to the IORedis connection.
	 *                                 These options will be merged with default options.
	 * @throws {Error} If the Redis URL is not provided and cannot be found in the environment variables.
	 * @throws {Error} If there is an issue establishing the initial Redis connection (though most connection errors are handled by ioredis internally and emitted as 'error' events).
	 */
	constructor(queueName: string, redisUrl?: string, redisConnectionOptions?: RedisOptions) {
		this.queueName = queueName
		const effectiveRedisUrl = redisUrl || getEnv('MAIL_REDIS_URL')

		if (!effectiveRedisUrl) {
			throw new Error(
				`[SendMailService] Initialization failed: Redis URL was not provided directly and could not be found in the environment variable 'MAIL_REDIS_URL'.`
			)
		}

		const defaultOptions: RedisOptions = {
			maxRetriesPerRequest: null, // Important for BullMQ: allows BullMQ to handle retries
			// Enable auto-resend of commands during reconnection.
			// This is generally safe for BullMQ as it uses commands that are idempotent or managed by BullMQ's logic.
			enableAutoPipelining: true,
		}

		try {
			this.connection = new Redis(effectiveRedisUrl, {
				...defaultOptions,
				...redisConnectionOptions,
			})
		} catch (err) {
			// This catch block might only capture immediate instantiation errors from ioredis,
			// most connection issues are asynchronous.
			console.error(
				`[SendMailService] Failed to create Redis instance for queue ${this.queueName}:`,
				err
			)
			throw new Error(
				`[SendMailService] Failed to initialize Redis connection for queue ${this.queueName}. Please check Redis configuration and availability. Error: ${err instanceof Error ? err.message : String(err)}`
			)
		}

		this.bullmq_queue = new Queue(this.queueName, {
			connection: this.connection,
			// Assuming BullMQOtel is correctly configured and its version is stable.
			// '0.1.0' could be dynamic or sourced from package.json if needed.
			telemetry: new BullMQOtel(this.queueName, '0.1.0'), // TODO: Consider making telemetry optional or configurable
		})

		this.connection.on('connect', () => {
			console.info(`[SendMailService] Successfully connected to Redis for queue ${this.queueName}.`)
		})

		this.connection.on('error', (err: Error) => {
			// Log Redis connection errors. These errors are typically handled by ioredis automatically (e.g., reconnection attempts).
			// Avoid throwing here as it could crash the application if not handled by the consumer.
			// The application should ideally have its own monitoring for Redis health.
			console.error(
				`[SendMailService] Redis connection error for queue '${this.queueName}': ${err.message}. Attempting to reconnect...`,
				err
			)
			// TODO: Consider adding a status flag or emitting an event that consuming applications can listen to
			// if they need to react to Redis unavailability (e.g., disable features).
		})

		this.connection.on('close', () => {
			console.info(`[SendMailService] Redis connection closed for queue ${this.queueName}.`)
		})

		this.connection.on('reconnecting', () => {
			console.info(`[SendMailService] Reconnecting to Redis for queue ${this.queueName}...`)
		})
	}

	/**
	 * Sends an email event to the BullMQ queue.
	 * The event details will be added as a job to the queue.
	 *
	 * @param eventDetails - The details of the email event to send.
	 *                       This should conform to the `SendMailEvent` interface.
	 * @returns A Promise that resolves when the job has been successfully added to the queue.
	 * @throws {Error} If adding the job to the queue fails.
	 */
	async send(eventDetails: SendMailEvent): Promise<void> {
		if (!this.bullmq_queue) {
			throw new Error('[SendMailService] Cannot send event: BullMQ queue is not initialized.')
		}
		if (
			!this.connection ||
			(this.connection.status !== 'ready' &&
				this.connection.status !== 'connecting' &&
				this.connection.status !== 'reconnecting')
		) {
			// While ioredis handles reconnections, sending a command when not 'ready' (or in a state that will soon be ready)
			// might lead to errors if maxRetriesPerRequest is not null or if the connection is truly down.
			// BullMQ itself also has robustness, so this is an additional safeguard/log.
			console.warn(
				`[SendMailService] Attempting to send mail while Redis connection status is '${this.connection.status}' for queue ${this.queueName}. This might fail if Redis is unavailable.`
			)
		}
		try {
			// These job options could also be made configurable if needed.
			await this.bullmq_queue.add(this.queueName, eventDetails, {
				removeOnComplete: true,
				removeOnFail: true, // Consider if failed jobs should be kept for inspection
			})
		} catch (error) {
			console.error(`[SendMailService] Failed to add job to queue '${this.queueName}':`, error)
			throw new Error(
				`[SendMailService] Failed to send mail event to queue '${this.queueName}'. Error: ${error instanceof Error ? error.message : String(error)}`
			)
		}
	}

	/**
	 * Closes the Redis connection gracefully.
	 * This method should be called when the application using the `SendMail` service
	 * is shutting down to ensure all pending operations are completed and resources are released.
	 *
	 * @returns A Promise that resolves when the Redis connection has been successfully closed.
	 */
	async closeConnection(): Promise<void> {
		if (this.bullmq_queue) {
			try {
				await this.bullmq_queue.close() // Close the queue first
				console.info(`[SendMailService] BullMQ queue '${this.queueName}' closed successfully.`)
			} catch (err) {
				console.error(`[SendMailService] Error closing BullMQ queue '${this.queueName}':`, err)
				// Decide if to rethrow or just log. For shutdown, logging might be sufficient.
			}
		}
		if (this.connection) {
			// Check if status is 'ready' or any other state that allows 'quit'
			// 'quit' waits for pending commands to be processed, 'disconnect' is immediate.
			if ((this.connection.status as string) !== 'end') {
				try {
					await this.connection.quit()
					console.info(
						`[SendMailService] Redis connection for queue '${this.queueName}' quit gracefully.`
					)
				} catch (err) {
					console.error(
						`[SendMailService] Error quitting Redis connection for queue '${this.queueName}':`,
						err
					)
					// Fallback to disconnect if quit fails or times out (ioredis default timeout is 2s for quit)
					if (this.connection.status !== 'end') {
						await this.connection.disconnect()
						console.info(
							`[SendMailService] Redis connection for queue '${this.queueName}' disconnected forcefully after quit error.`
						)
					}
				}
			}
		}
	}
}
