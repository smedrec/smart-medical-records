export type AuditEventStatus = 'attempt' | 'success' | 'failure'

export interface AuditLogEvent {
	timestamp: string
	ttl?: string
	principalId?: string
	organizationId?: string
	action: string // e.g., fhirPatientRead, cerbosAuthCheck
	targetResourceType?: string // e.g., Patient, Practitioner, CerbosResource
	targetResourceId?: string
	status: AuditEventStatus
	outcomeDescription?: string // e.g., "Successfully read Patient resource", "Authorization denied by Cerbos", "FHIR API error"
	// Additional context specific to the event
	[key: string]: any
}
