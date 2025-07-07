import { Queue } from 'bullmq'
import { Redis } from 'ioredis'

import type { RedisOptions } from 'ioredis'
import type { AuditLogEvent } from './types.js'

/**
 * Retrieves an environment variable.
 * This function attempts to read environment variables from `process.env` (Node.js).
 * Note: In non-Node.js environments (like Cloudflare Workers), environment variables might be accessed differently (e.g., directly from `env`).
 * This implementation prioritizes `process.env`.
 *
 * @param variableName The name of the environment variable to retrieve.
 * @returns The value of the environment variable if found, otherwise `undefined`.
 */
function getEnv(variableName: string): string | undefined {
	// Check Node.js process.env
	if (typeof process !== 'undefined' && process.env && process.env[variableName]) {
		return process.env[variableName]
	}
	// In other environments (e.g., Cloudflare Workers), `env` might be a global or passed object.
	// This basic version doesn't assume a global `env` object to maintain broader compatibility
	// and avoid potential ReferenceErrors if `env` is not defined.
	// Consumers in such environments should pass the redisUrl directly or ensure `AUDIT_REDIS_URL` is accessible.
	return undefined
}

/**
 * The `Audit` class provides a mechanism to log audit events to a BullMQ queue,
 * which is backed by Redis. It handles the connection to Redis and the queuing of audit messages.
 *
 * @example
 * ```typescript
 * import { Audit } from '@repo/audit';
 *
 * // Initialize with a queue name and optional Redis URL (or set AUDIT_REDIS_URL env var)
 * const auditService = new Audit('user-activity-queue');
 *
 * async function recordUserLogin(userId: string, success: boolean) {
 *   await auditService.log({
 *     principalId: userId,
 *     action: 'userLogin',
 *     status: success ? 'success' : 'failure',
 *     outcomeDescription: success ? 'User logged in successfully.' : 'User login failed.',
 *     requestDetails: { ipAddress: '192.168.1.100' } // Example of additional context
 *   });
 * }
 *
 * // Call when your application is shutting down
 * // await auditService.closeConnection();
 * ```
 */
export class Audit {
	private connection: Redis
	private queueName: string
	private bullmq_queue: Queue<AuditLogEvent, any, string>

	/**
	 * Constructs an `Audit` instance, sets up the Redis connection, and initializes the BullMQ queue.
	 *
	 * @param queueName The name of the BullMQ queue to be used for audit logs.
	 *                  This name will be used when adding jobs to the queue.
	 * @param redisUrl Optional. The Redis connection URL (e.g., "redis://localhost:6379").
	 *                 If not provided, the constructor attempts to use the `AUDIT_REDIS_URL`
	 *                 environment variable retrieved via `getEnv`.
	 * @param redisConnectionOptions Optional. Additional options to be passed to the IORedis constructor.
	 *                               These options will be merged with default settings.
	 *                               Refer to IORedis documentation for available options.
	 * @throws Error if `redisUrl` is not provided and `AUDIT_REDIS_URL` cannot be found in the environment.
	 */
	constructor(queueName: string, redisUrl?: string, redisConnectionOptions?: RedisOptions) {
		this.queueName = queueName
		const effectiveRedisUrl = redisUrl || getEnv('AUDIT_REDIS_URL')

		if (!effectiveRedisUrl) {
			throw new Error(
				'[AuditService] Initialization Error: Redis URL was not provided and could not be found in environment variables (AUDIT_REDIS_URL). Please provide it directly or set the environment variable.'
			)
		}

		const defaultOptions: RedisOptions = {
			maxRetriesPerRequest: null, // Important for BullMQ, means commands are not retried by ioredis itself.
			// enableReadyCheck: false, // Can be useful in some environments, but BullMQ handles its own readiness.
		}
		this.connection = new Redis(effectiveRedisUrl, {
			...defaultOptions,
			...redisConnectionOptions,
		})

		// Initialize the BullMQ queue with the established Redis connection.
		// The queue name used here is the one jobs will be added to via `this.bullmq_queue.add(this.queueName, ...)`
		// but BullMQ internally uses `bull:<queueName>:` as prefix for its Redis keys.
		this.bullmq_queue = new Queue(this.queueName, { connection: this.connection })

		this.connection.on('error', (err: Error) => {
			// Log Redis connection errors.
			// In a production system, you might want more sophisticated monitoring or alerting here.
			// For this package, console.error is a reasonable default.
			// It's important not to throw here as it could crash the application using this audit client.
			console.error(
				`[AuditService] Redis Connection Error for queue "${this.queueName}": ${err.message}`,
				err
			)
		})

		this.connection.on('connect', () => {
			console.log(`[AuditService] Successfully connected to Redis for queue "${this.queueName}".`)
		})

		this.connection.on('ready', () => {
			console.log(`[AuditService] Redis connection ready for queue "${this.queueName}".`)
		})

		this.connection.on('close', () => {
			console.log(`[AuditService] Redis connection closed for queue "${this.queueName}".`)
		})

		this.connection.on('reconnecting', () => {
			console.log(`[AuditService] Reconnecting to Redis for queue "${this.queueName}"...`)
		})
	}

	/**
	 * Logs an audit event by adding it to the BullMQ queue.
	 * The timestamp for the event is automatically generated at the time of logging.
	 *
	 * @param eventDetails An object containing the details of the audit event,
	 *                     excluding the `timestamp` which will be added by this method.
	 *                     Requires `action` and `status` properties.
	 * @returns A Promise that resolves when the event has been successfully added to the queue.
	 * @throws Error if `eventDetails.action` or `eventDetails.status` are missing.
	 *
	 * @example
	 * ```typescript
	 * await auditService.log({
	 *   principalId: 'user-xyz',
	 *   action: 'itemUpdate',
	 *   targetResourceType: 'Item',
	 *   targetResourceId: 'item-123',
	 *   status: 'success',
	 *   outcomeDescription: 'Item updated successfully.',
	 *   changes: { oldValue: 'A', newValue: 'B' }
	 * });
	 * ```
	 */
	async log(eventDetails: Omit<AuditLogEvent, 'timestamp'>): Promise<void> {
		if (!eventDetails.action || !eventDetails.status) {
			// It's crucial that action and status are present for meaningful audit logs.
			throw new Error(
				"[AuditService] Log Error: Missing required event properties. 'action' and 'status' must be provided."
			)
		}
		const timestamp = new Date().toISOString()
		const event: AuditLogEvent = {
			timestamp,
			action: eventDetails.action, // Ensuring these are explicitly assigned
			status: eventDetails.status, // from the validated input
			...eventDetails,
		}

		try {
			// The first argument to `add` is the job name (can be different from queue name, but often the same for simplicity).
			// Here, using this.queueName as the job name as well.
			await this.bullmq_queue.add(this.queueName, event, {
				removeOnComplete: true, // Remove job from queue once processed successfully.
				removeOnFail: true, // Remove job from queue if it fails (consider dead-letter queue for production).
				// Other BullMQ job options could be exposed or configured if needed.
			})
		} catch (error) {
			// Handle potential errors during adding to the queue (e.g., if Redis is suddenly unavailable despite initial connect)
			console.error(
				`[AuditService] Failed to add event to BullMQ queue "${this.queueName}":`,
				error
			)
			// Rethrow or handle more gracefully depending on desired behavior.
			// For now, rethrowing allows the caller to be aware of the failure to log.
			throw error
		}
	}

	/**
	 * Closes the Redis connection associated with this Audit instance.
	 * This method should be called when the application using the Audit service
	 * is shutting down to ensure graceful disconnection from Redis.
	 *
	 * It checks if the connection exists and is in a 'ready' or 'connecting' state before attempting to quit.
	 *
	 * @returns A Promise that resolves once the connection has been closed, or immediately if no action was needed.
	 */
	async closeConnection(): Promise<void> {
		if (
			this.connection &&
			(this.connection.status === 'ready' ||
				this.connection.status === 'connect' ||
				this.connection.status === 'reconnecting')
		) {
			try {
				await this.connection.quit()
				console.log(
					`[AuditService] Successfully closed Redis connection for queue "${this.queueName}".`
				)
			} catch (err) {
				console.error(
					`[AuditService] Error while closing Redis connection for queue "${this.queueName}":`,
					err
				)
				// Depending on the error, you might want to throw or handle it.
				// For a close operation, logging might be sufficient.
			}
		} else if (this.connection) {
			console.log(
				`[AuditService] Redis connection for queue "${this.queueName}" was not in a closable state (current status: ${this.connection.status}). No action taken.`
			)
		}
	}
}
