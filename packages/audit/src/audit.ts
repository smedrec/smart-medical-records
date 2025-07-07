/**
 * AuditLogEvent
 *
 * @example
 *
 * Use from other apps/packages:
 *
 * ```ts
 * import { Audit } from '@repo/audit'
 *
 * const audit = new Audit(queueName)
 * ```
 */
import { Queue } from 'bullmq'
import { Redis } from 'ioredis'

import type { RedisOptions } from 'ioredis'
import type { AuditLogEvent } from './types.js'

function getEnv(variableName: string): string | undefined {
	// Check Node.js process.env
	if (typeof process !== 'undefined' && process.env && process.env[variableName]) {
		return process.env[variableName]
	}
	return undefined
}

export class Audit {
	private connection: Redis
	private queueName: string
	private bullmq_queue: Queue

	/**
	 * Constructs an Audit instance.
	 * @param queueName The name of the BullMQ queue.
	 * @param redisUrl Optional. The Redis connection URL. If not provided, it attempts to use
	 *                 `env.AUDIT_REDIS_URL` (for Cloudflare Workers) or `process.env.AUDIT_REDIS_URL` (for Node.js).
	 * @param redisConnectionOptions Optional. Additional options for IORedis connection.
	 */
	constructor(queueName: string, redisUrl?: string, redisConnectionOptions?: RedisOptions) {
		this.queueName = queueName
		const effectiveRedisUrl = redisUrl || getEnv('AUDIT_REDIS_URL')

		if (!effectiveRedisUrl) {
			throw new Error(
				'Audit Service: Redis URL not provided and could not be found in environment variables (AUDIT_REDIS_URL).'
			)
		}

		const defaultOptions: RedisOptions = { maxRetriesPerRequest: null }
		this.connection = new Redis(effectiveRedisUrl, {
			...defaultOptions,
			...redisConnectionOptions,
		})

		this.bullmq_queue = new Queue(this.queueName, { connection: this.connection })

		this.connection.on('error', (err) => {
			// It's good to log this, but throwing here might be too disruptive for client apps.
			// Consider a more robust error handling or status reporting mechanism.
			console.error(`[AuditPackage] Redis connection error for queue ${this.queueName}:`, err)
		})
	}

	/**
	 * Logs an audit event to the queue.
	 * In a real application, this would likely send logs to a dedicated audit service or secure log storage.
	 * @param eventDetails Partial details of the event. Timestamp is added automatically.
	 */
	async log(eventDetails: Omit<AuditLogEvent, 'timestamp'>): Promise<void> {
		if (!eventDetails.action || !eventDetails.status) {
			throw new Error("Missing required properties: 'action' and/or 'status'")
		}
		const timestamp = new Date().toISOString()
		const event: AuditLogEvent = {
			timestamp,
			action: eventDetails.action,
			status: eventDetails.status,
			...eventDetails,
		}

		// Use the queueName passed in the constructor for adding jobs
		await this.bullmq_queue.add(this.queueName, event, {
			removeOnComplete: true, // These could also be configurable
			removeOnFail: true,
		})
	}

	/**
	 * Closes the Redis connection.
	 * Call this when the application using the Audit service is shutting down.
	 */
	async closeConnection(): Promise<void> {
		if (this.connection && this.connection.status === 'ready') {
			await this.connection.quit()
		}
	}
}
