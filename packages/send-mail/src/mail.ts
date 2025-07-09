import { Queue } from 'bullmq'
// import { BullMQOtel } from 'bullmq-otel' // BullMQOtel can be added if telemetry is configured
import { Redis as RedisInstance } from 'ioredis' // Renamed to avoid conflict
import type { RedisOptions, Redis as RedisType } from 'ioredis' // RedisType for type usage
import { getSharedRedisConnection } from '@repo/redis-client'
import type { SendMailEvent } from './types.js'

// The getEnv function is removed as REDIS_URL is now primarily handled by @repo/redis-client
// However, MAIL_REDIS_URL can still be used for overrides if a direct connection is made.

/**
 * Represents a client for sending mail tasks to a BullMQ queue.
 * This class encapsulates the connection to Redis and the BullMQ queue,
 * providing a simple interface to enqueue mail sending events.
 * It can use a shared Redis connection or establish its own.
 */
export class SendMail {
	private connection: RedisType
	private queueName: string
	private bullmq_queue: Queue
	private isSharedConnection: boolean

	/**
	 * Constructs a new `SendMail` instance.
	 *
	 * If `redisOrUrlOrOptions` is a string (Redis URL) or if `directConnectionOptions` are provided,
	 * a new Redis connection will be created. The URL can also be from `MAIL_REDIS_URL` env var.
	 * If `redisOrUrlOrOptions` is an existing `Redis` instance, it will be used.
	 * Otherwise, it defaults to using the shared Redis connection from `@repo/redis-client`.
	 *
	 * @param queueName The name of the BullMQ queue.
	 * @param redisOrUrlOrOptions Optional. Can be:
	 *                          - A Redis connection URL (string).
	 *                          - An existing IORedis connection instance.
	 *                          - An object with `url` and/or `options` for IORedis.
	 * @param directConnectionOptions Optional. IORedis options for a new direct connection.
	 * @throws Error if a direct Redis URL is required but not found, or on Redis instantiation failure.
	 */
	constructor(
		queueName: string,
		redisOrUrlOrOptions?: string | RedisType | { url?: string; options?: RedisOptions },
		directConnectionOptions?: RedisOptions
	) {
		this.queueName = queueName
		this.isSharedConnection = false

		const defaultDirectOptions: RedisOptions = {
			maxRetriesPerRequest: null,
			enableAutoPipelining: true,
		}

		if (redisOrUrlOrOptions && typeof redisOrUrlOrOptions === 'object' && 'status' in redisOrUrlOrOptions) {
			// Scenario 1: An existing ioredis instance is provided
			this.connection = redisOrUrlOrOptions
			this.isSharedConnection = false // Assume externally managed
			console.log(`[SendMailService] Using provided Redis instance for queue "${this.queueName}".`)
		} else if (
			typeof redisOrUrlOrOptions === 'string' ||
			(typeof redisOrUrlOrOptions === 'object' && (redisOrUrlOrOptions.url || redisOrUrlOrOptions.options)) ||
			directConnectionOptions
		) {
			// Scenario 2: URL string, options object, or directConnectionOptions provided for a direct connection
			this.isSharedConnection = false
			let url: string | undefined
			let options: RedisOptions = { ...defaultDirectOptions, ...directConnectionOptions }

			if (typeof redisOrUrlOrOptions === 'string') {
				url = redisOrUrlOrOptions
			} else if (typeof redisOrUrlOrOptions === 'object') {
				url = redisOrUrlOrOptions.url
				options = { ...options, ...redisOrUrlOrOptions.options }
			}

			const finalUrl = url || process.env['MAIL_REDIS_URL'] // Legacy env var for direct connections

			if (!finalUrl) {
				console.warn(
					`[SendMailService] Attempting direct Redis connection for queue "${this.queueName}" but no URL specified and MAIL_REDIS_URL not set. Falling back to shared connection.`
				)
				this.connection = getSharedRedisConnection()
				this.isSharedConnection = true
			} else {
				try {
					console.log(
						`[SendMailService] Creating new direct Redis connection to ${finalUrl.split('@').pop()} for queue "${this.queueName}".`
					)
					this.connection = new RedisInstance(finalUrl, options)
				} catch (err) {
					console.error(
						`[SendMailService] Failed to create direct Redis instance for queue ${this.queueName}:`,
						err
					)
					throw new Error(
						`[SendMailService] Failed to initialize direct Redis connection. Error: ${err instanceof Error ? err.message : String(err)}`
					)
				}
			}
		} else {
			// Scenario 3: No specific connection info, use the shared connection
			console.log(
				`[SendMailService] Using shared Redis connection for queue "${this.queueName}".`
			)
			this.connection = getSharedRedisConnection()
			this.isSharedConnection = true
		}

		this.bullmq_queue = new Queue(this.queueName, {
			connection: this.connection,
			// TODO: Telemetry (e.g., BullMQOtel) could be added here if needed and made configurable.
			// Example: telemetry: new BullMQOtel(this.queueName, 'package-version'),
		})

		// Attach listeners only if this instance created the connection
		if (!this.isSharedConnection && !(redisOrUrlOrOptions && typeof redisOrUrlOrOptions === 'object' && 'status' in redisOrUrlOrOptions)) {
			this.connection.on('connect', () => {
				console.info(
					`[SendMailService] Successfully connected to Redis (direct connection for queue "${this.queueName}").`
				)
			})
			this.connection.on('ready', () => {
				console.log(
					`[SendMailService] Redis connection ready (direct connection for queue "${this.queueName}").`
				)
			})
			this.connection.on('error', (err: Error) => {
				console.error(
					`[SendMailService] Redis connection error (direct for queue '${this.queueName}'): ${err.message}.`,
					err
				)
			})
			this.connection.on('close', () => {
				console.info(
					`[SendMailService] Redis connection closed (direct for queue ${this.queueName}).`
				)
			})
			this.connection.on('reconnecting', () => {
				console.info(
					`[SendMailService] Reconnecting to Redis (direct for queue ${this.queueName})...`
				)
			})
		}
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
				removeOnFail: false, // Consider if failed jobs should be kept for inspection
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
