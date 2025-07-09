import { Queue } from 'bullmq'
import { Redis as RedisInstance } from 'ioredis' // Renamed to avoid conflict
import type { RedisOptions, Redis as RedisType } from 'ioredis' // RedisType for type usage
import { getSharedRedisConnection } from '@repo/redis-client'
import type { AuditLogEvent } from './types.js'

// The getEnv function is removed as REDIS_URL is now primarily handled by @repo/redis-client
// However, AUDIT_REDIS_URL can still be used for overrides if a direct connection is made.

/**
 * The `Audit` class provides a mechanism to log audit events to a BullMQ queue,
 * which is backed by Redis. It can use a shared Redis connection provided by `@repo/redis-client`
 * or establish its own if connection details are explicitly provided.
 *
 * @example
 * ```typescript
 * import { Audit } from '@repo/audit';
 *
 * // Recommended: Initialize with just a queue name to use the shared Redis connection
 * const auditService = new Audit('user-activity-queue');
 *
 * // Advanced: Initialize with specific Redis URL (e.g., for a different Redis instance)
 * // const auditServiceSpecific = new Audit('user-activity-queue', 'redis://specific-redis:6379');
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
 * // Call to clean up queue resources.
 * // await auditService.closeConnection(); // Note: This no longer closes the shared Redis connection.
 * ```
 */
export class Audit {
	private connection: RedisType
	private queueName: string
	private bullmq_queue: Queue<AuditLogEvent, any, string>
	private isSharedConnection: boolean

	/**
	 * Constructs an `Audit` instance.
	 * It initializes a BullMQ queue and connects to Redis.
	 *
	 * If `redisOrUrl` is a string (Redis URL) or if `redisConnectionOptions` are provided,
	 * a new Redis connection will be created specifically for this instance.
	 * The URL can also be sourced from the `AUDIT_REDIS_URL` environment variable if `redisOrUrl` is not given.
	 *
	 * If `redisOrUrl` is an existing `Redis` instance, it will be used.
	 *
	 * If no connection details (`redisOrUrl` or `redisConnectionOptions`) are provided,
	 * it defaults to using the shared Redis connection from `@repo/redis-client`.
	 *
	 * @param queueName The name of the BullMQ queue for audit logs.
	 * @param redisOrUrlOrOptions Optional. Can be:
	 *                          - A Redis connection URL (string).
	 *                          - An existing IORedis connection instance.
	 *                          - An object with `url` and/or `options` for IORedis.
	 *                          If a URL string is provided, `redisConnectionOptions` can also be passed as the third argument.
	 * @param directConnectionOptions Optional. IORedis options, used if creating a new direct connection.
	 *                                Merged with default options. Ignored if `redisOrUrl` is an IORedis instance
	 *                                or if using the shared connection.
	 * @throws Error if a direct Redis URL is required (e.g., `AUDIT_REDIS_URL`) but cannot be resolved,
	 *         or if there's an error during direct Redis client instantiation.
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
			this.isSharedConnection = false // Assume externally managed, could be shared or not
			console.log(`[AuditService] Using provided Redis instance for queue "${this.queueName}".`)
		} else if (
			typeof redisOrUrlOrOptions === 'string' ||
			(typeof redisOrUrlOrOptions === 'object' && (redisOrUrlOrOptions.url || redisOrUrlOrOptions.options)) ||
			directConnectionOptions
		) {
			// Scenario 2: URL string, options object, or directConnectionOptions are provided for a direct connection
			this.isSharedConnection = false
			let url: string | undefined
			let options: RedisOptions = { ...defaultDirectOptions, ...directConnectionOptions }

			if (typeof redisOrUrlOrOptions === 'string') {
				url = redisOrUrlOrOptions
			} else if (typeof redisOrUrlOrOptions === 'object' && (redisOrUrlOrOptions.url || redisOrUrlOrOptions.options)) {
				// Check this condition specifically for object with url/options
				url = redisOrUrlOrOptions.url
				options = { ...options, ...redisOrUrlOrOptions.options }
			}
			// Note: directConnectionOptions are already merged into options

			const envUrl = process.env['AUDIT_REDIS_URL']
			const finalUrl = url || envUrl // Prioritize explicitly passed URL/options object over env var

			if (finalUrl) {
				// If any URL (explicit, from object, or env) is found, attempt direct connection
				try {
					console.log(
						`[AuditService] Creating new direct Redis connection to ${finalUrl.split('@').pop()} for queue "${this.queueName}".`
					)
					this.connection = new RedisInstance(finalUrl, options)
				} catch (err) {
					console.error(
						`[AuditService] Failed to create direct Redis instance for queue ${this.queueName}:`,
						err
					)
					throw new Error(
						`[AuditService] Failed to initialize direct Redis connection for queue ${this.queueName}. Error: ${err instanceof Error ? err.message : String(err)}`
					)
				}
			} else if (url || redisOrUrlOrOptions || directConnectionOptions) {
				// This case means an attempt for direct connection was made (e.g. empty string URL, or empty options object)
				// but resulted in no usable URL, and AUDIT_REDIS_URL was also not set.
				console.warn(
					`[AuditService] Attempted direct Redis connection for queue "${this.queueName}" but no valid URL could be determined (explicitly or via AUDIT_REDIS_URL). Falling back to shared connection.`
				)
				this.connection = getSharedRedisConnection()
				this.isSharedConnection = true
			} else {
				// Scenario 3: No explicit direct connection info at all, and no env var, use the shared connection
				console.log(
					`[AuditService] Using shared Redis connection for queue "${this.queueName}".`
				)
				this.connection = getSharedRedisConnection()
				this.isSharedConnection = true
			}
		} else if (process.env['AUDIT_REDIS_URL']) {
			// Scenario 2b: Only AUDIT_REDIS_URL is provided (no redisOrUrlOrOptions or directConnectionOptions)
			this.isSharedConnection = false
			const envUrl = process.env['AUDIT_REDIS_URL']
			const options: RedisOptions = { ...defaultDirectOptions } // directConnectionOptions is undefined here
			try {
				console.log(
					`[AuditService] Creating new direct Redis connection using AUDIT_REDIS_URL to ${envUrl.split('@').pop()} for queue "${this.queueName}".`
				)
				this.connection = new RedisInstance(envUrl, options)
			} catch (err) {
				console.error(
					`[AuditService] Failed to create direct Redis instance using AUDIT_REDIS_URL for queue ${this.queueName}:`,
					err
				)
				throw new Error(
					`[AuditService] Failed to initialize direct Redis connection using AUDIT_REDIS_URL for queue ${this.queueName}. Error: ${err instanceof Error ? err.message : String(err)}`
				)
			}
		} else {
			// Scenario 3: No specific connection info at all, use the shared connection
			console.log(
				`[AuditService] Using shared Redis connection for queue "${this.queueName}".`
			)
			this.connection = getSharedRedisConnection()
			this.isSharedConnection = true
		}

		this.bullmq_queue = new Queue(this.queueName, { connection: this.connection })

		// Attach listeners only if this instance created the connection (not shared and not provided externally)
		// The shared connection manages its own listeners.
		// If an external instance is provided, it's assumed its listeners are managed elsewhere.
		if (!this.isSharedConnection && !(redisOrUrlOrOptions && typeof redisOrUrlOrOptions === 'object' && 'status' in redisOrUrlOrOptions)) {
			this.connection.on('error', (err: Error) => {
				console.error(
					`[AuditService] Redis Connection Error (direct connection for queue "${this.queueName}"): ${err.message}`,
					err
				)
			})
			this.connection.on('connect', () => {
				console.log(
					`[AuditService] Successfully connected to Redis (direct connection for queue "${this.queueName}").`
				)
			})
			this.connection.on('ready', () => {
				console.log(
					`[AuditService] Redis connection ready (direct connection for queue "${this.queueName}").`
				)
			})
			this.connection.on('close', () => {
				console.log(
					`[AuditService] Redis connection closed (direct connection for queue "${this.queueName}").`
				)
			})
			this.connection.on('reconnecting', () => {
				console.log(
					`[AuditService] Reconnecting to Redis (direct connection for queue "${this.queueName}")...`
				)
			})
		}
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
			throw new Error(
				"[AuditService] Log Error: Missing required event properties. 'action' and 'status' must be provided."
			)
		}
		if (!this.bullmq_queue) {
			throw new Error('[AuditService] Cannot log event: BullMQ queue is not initialized.')
		}
		// Check connection status before logging.
		// Note: this.connection.status might not be perfectly up-to-date if using a shared connection
		// whose state changes rapidly. The shared client has its own logging for connection events.
		if (
			!this.connection ||
			(this.connection.status !== 'ready' &&
				this.connection.status !== 'connecting' &&
				this.connection.status !== 'reconnecting')
		) {
			console.warn(
				`[AuditService] Attempting to log event for queue "${this.queueName}" while Redis connection status is '${this.connection?.status || 'unknown'}'. This might fail if Redis is unavailable.`
			)
		}

		const timestamp = new Date().toISOString()
		const event: AuditLogEvent = {
			timestamp,
			action: eventDetails.action,
			status: eventDetails.status,
			...eventDetails,
		}

		try {
			await this.bullmq_queue.add(this.queueName, event, {
				removeOnComplete: true,
				removeOnFail: false, // Consider a dead-letter queue for production.
			})
		} catch (error) {
			console.error(
				`[AuditService] Failed to add event to BullMQ queue "${this.queueName}":`,
				error
			)
			// Rethrow to allow the caller to handle the failure (e.g., retry, log differently).
			throw new Error(
				`[AuditService] Failed to log audit event to queue '${this.queueName}'. Error: ${error instanceof Error ? error.message : String(error)}`
			)
		}
	}

	/**
	 * Closes the BullMQ queue associated with this Audit instance.
	 * If a direct Redis connection was created by this instance, it will also be closed.
	 * If a shared Redis connection is being used, this method WILL NOT close the shared connection.
	 * The shared connection's lifecycle should be managed globally (e.g., via `closeSharedRedisConnection` at app shutdown).
	 *
	 * @returns A Promise that resolves once cleanup is complete.
	 */
	async closeConnection(): Promise<void> {
		if (this.bullmq_queue) {
			try {
				await this.bullmq_queue.close()
				console.info(`[AuditService] BullMQ queue '${this.queueName}' closed successfully.`)
			} catch (err) {
				console.error(
					`[AuditService] Error closing BullMQ queue '${this.queueName}':`,
					err
				)
			}
		}

		if (this.connection && !this.isSharedConnection) {
			console.info(
				`[AuditService] Closing direct Redis connection for queue '${this.queueName}'.`
			)
			if ((this.connection.status as string) !== 'end') {
				try {
					await this.connection.quit()
					console.info(
						`[AuditService] Direct Redis connection for queue '${this.queueName}' quit gracefully.`
					)
				} catch (err) {
					console.error(
						`[AuditService] Error quitting direct Redis connection for queue '${this.queueName}':`,
						err
					)
					if (this.connection.status !== 'end') {
						await this.connection.disconnect()
						console.info(
							`[AuditService] Direct Redis connection for queue '${this.queueName}' disconnected forcefully.`
						)
					}
				}
			}
		} else if (this.isSharedConnection) {
			console.info(
				`[AuditService] Using a shared Redis connection for queue '${this.queueName}'. Connection will not be closed by this instance.`
			)
		}
		// Nullify the connection if it was managed by this instance and is now closed.
		if (!this.isSharedConnection) {
			// @ts-expect-error Making connection undefined after close
			this.connection = undefined;
		}
	}
}
