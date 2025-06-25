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
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

// Helper to try and get env variables from Cloudflare Workers or Node.js process.env
function getEnv(variableName: string): string | undefined {
	// Check Cloudflare Workers env
	// @ts-expect-error Hides `Cannot find name 'env'.` when not in CF Worker context.
	if (typeof env !== 'undefined' && env[variableName]) {
		// @ts-expect-error
		return env[variableName];
	}
	// Check Node.js process.env
	if (typeof process !== 'undefined' && process.env && process.env[variableName]) {
		return process.env[variableName];
	}
	return undefined;
}


export type AuditEventStatus = 'attempt' | 'success' | 'failure';

export interface AuditLogEvent {
	timestamp: string
	ttl?: string
	principalId?: string
	action: string // e.g., fhirPatientRead, cerbosAuthCheck
	targetResourceType?: string // e.g., Patient, Practitioner, CerbosResource
	targetResourceId?: string
	status: AuditEventStatus
	outcomeDescription?: string // e.g., "Successfully read Patient resource", "Authorization denied by Cerbos", "FHIR API error"
	// Additional context specific to the event
	[key: string]: any
}

export class Audit {
	private connection: IORedis
	private connection: IORedis;
	private queueName: string;
	private bullmq_queue: Queue; // Renamed to avoid conflict with constructor param

	/**
	 * Constructs an Audit instance.
	 * @param queueName The name of the BullMQ queue.
	 * @param redisUrl Optional. The Redis connection URL. If not provided, it attempts to use
	 *                 `env.AUDIT_REDIS_URL` (for Cloudflare Workers) or `process.env.AUDIT_REDIS_URL` (for Node.js).
	 * @param redisConnectionOptions Optional. Additional options for IORedis connection.
	 */
	constructor(
		queueName: string,
		redisUrl?: string,
		redisConnectionOptions?: IORedis.RedisOptions,
	) {
		this.queueName = queueName;
		const effectiveRedisUrl = redisUrl || getEnv('AUDIT_REDIS_URL');

		if (!effectiveRedisUrl) {
			throw new Error(
				'Audit Service: Redis URL not provided and could not be found in environment variables (AUDIT_REDIS_URL).'
			);
		}

		const defaultOptions: IORedis.RedisOptions = { maxRetriesPerRequest: null };
		this.connection = new IORedis(effectiveRedisUrl, {
			...defaultOptions,
			...redisConnectionOptions,
		});

		this.bullmq_queue = new Queue(this.queueName, { connection: this.connection });

		this.connection.on('error', (err) => {
			// It's good to log this, but throwing here might be too disruptive for client apps.
			// Consider a more robust error handling or status reporting mechanism.
			console.error(`[AuditPackage] Redis connection error for queue ${this.queueName}:`, err);
		});
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
		const event: AuditLogEvent = {
			timestamp: new Date().toISOString(),
			...eventDetails,
		};

		// Use the queueName passed in the constructor for adding jobs
		await this.bullmq_queue.add(this.queueName, event, {
			removeOnComplete: true, // These could also be configurable
			removeOnFail: true,
		});
	}

	/**
	 * Closes the Redis connection.
	 * Call this when the application using the Audit service is shutting down.
	 */
	async closeConnection(): Promise<void> {
		if (this.connection && this.connection.status === 'ready') {
			await this.connection.quit();
		}
	}
}
// Example Usage (for illustration, not part of the actual file logic):
/*
import { auditResource } from '@repo/audit'

const audit = new AuditResource('audit')
audit.log({
  principalId: 'user-123',
  action: 'fhirPatientReadAttempt',
  targetResourceType: 'Patient',
  targetResourceId: 'pat-456',
  status: 'attempt',
})

audit.log({
  principalId: 'user-123',
  action: 'fhirPatientReadSuccess',
  targetResourceType: 'Patient',
  targetResourceId: 'pat-456',
  status: 'success',
  outcomeDescription: 'Successfully read Patient resource',
  dataSize: 1024 // Example of additional context
});

audit.log({
  principalId: 'user-123',
  action: 'fhirPatientReadFailure',
  targetResourceType: 'Patient',
  targetResourceId: 'pat-456',
  status: 'failure',
  outcomeDescription: 'FHIR server returned 404',
  errorCode: 404
});
*/
