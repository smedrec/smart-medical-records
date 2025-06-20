/**
 * AuditLogEvent
 *
 * @example
 *
 * Use from other apps/packages:
 *
 * ```ts
 * import { AuditLogEvent } from '@repo/audit'
 *
 * AuditLogEvent()
 * ```
 */
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

/**
 * Logs an audit event to the console.
 * In a real application, this would likely send logs to a dedicated audit service or secure log storage.
 * @param eventDetails Partial details of the event. Timestamp is added automatically.
 */
export function logAuditEvent(eventDetails: Omit<AuditLogEvent, 'timestamp'>): void {
	if (!eventDetails.action || !eventDetails.status) {
		throw new Error("Missing required properties: 'action' and/or 'status'")
	}
	const event: AuditLogEvent = {
		...eventDetails,
		timestamp: new Date().toISOString(),
	}

	// For now, logging as JSON string to console.
	// In a worker environment, console.log/info often go to the Cloudflare dashboard or configured log destinations.
	console.info(JSON.stringify(event))
}

// Example Usage (for illustration, not part of the actual file logic):
/*
logAuditEvent({
  principalId: 'user-123',
  action: 'fhirPatientReadAttempt',
  targetResourceType: 'Patient',
  targetResourceId: 'pat-456',
  status: 'attempt',
});

logAuditEvent({
  principalId: 'user-123',
  action: 'fhirPatientReadSuccess',
  targetResourceType: 'Patient',
  targetResourceId: 'pat-456',
  status: 'success',
  outcomeDescription: 'Successfully read Patient resource',
  dataSize: 1024 // Example of additional context
});

logAuditEvent({
  principalId: 'user-123',
  action: 'fhirPatientReadFailure',
  targetResourceType: 'Patient',
  targetResourceId: 'pat-456',
  status: 'failure',
  outcomeDescription: 'FHIR server returned 404',
  errorCode: 404
});
*/
