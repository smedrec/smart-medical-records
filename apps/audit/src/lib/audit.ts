import { Queue } from 'bullmq'
import IORedis from 'ioredis'

export type AuditEventStatus = 'attempt' | 'success' | 'failure'

export interface AuditLogEvent {
	timestamp: string
	principalId?: string
	action: string // e.g., fhirPatientRead, cerbosAuthCheck
	targetResourceType?: string // e.g., Patient, Practitioner, CerbosResource
	targetResourceId?: string
	status: AuditEventStatus
	outcomeDescription?: string // e.g., "Successfully read Patient resource", "Authorization denied by Cerbos", "FHIR API error"
	// Additional context specific to the event
	[key: string]: any
}

export class AuditResource {
	private connection: IORedis
	private queue: string
	private q

	constructor(queue: string) {
		this.queue = queue
		this.connection = new IORedis({ maxRetriesPerRequest: null })
		this.q = new Queue(this.queue)

		//this.connection.connect().catch(console.error)
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
			...eventDetails,
			timestamp: new Date().toISOString(),
		}

		await this.q.add('audit', event, { removeOnComplete: true, removeOnFail: true })
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
