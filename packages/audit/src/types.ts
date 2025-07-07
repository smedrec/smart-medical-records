/**
 * Defines the possible statuses for an audit event.
 * - `attempt`: An action was attempted.
 * - `success`: An action was successfully completed.
 * - `failure`: An action failed to complete.
 */
export type AuditEventStatus = 'attempt' | 'success' | 'failure'

/**
 * Interface representing the structure of an audit log event.
 * This event captures details about an action performed within the system.
 */
export interface AuditLogEvent {
	/**
	 * ISO 8601 timestamp indicating when the event occurred.
	 * Automatically generated when the event is logged.
	 * @example "2023-10-26T10:30:00.000Z"
	 */
	timestamp: string

	/**
	 * Optional Time-To-Live for the audit event, if applicable (e.g., for data retention policies).
	 * Could be a duration string or a specific expiry timestamp.
	 * @example "30d" (30 days)
	 * @example "2024-10-26T10:30:00.000Z"
	 */
	ttl?: string

	/**
	 * Optional identifier for the user or system principal that initiated the action.
	 * @example "user-12345"
	 * @example "system-service-abc"
	 */
	principalId?: string

	/**
	 * Optional identifier for the organization associated with the event, useful in multi-tenant systems.
	 * @example "org-67890"
	 */
	organizationId?: string

	/**
	 * A string describing the action performed.
	 * Should be concise and standardized (e.g., using verbNoun format).
	 * @example "fhirPatientRead"
	 * @example "userLogin"
	 * @example "cerbosAuthCheck"
	 * @example "documentCreate"
	 */
	action: string

	/**
	 * Optional type of the target resource involved in the action.
	 * @example "Patient"
	 * @example "Practitioner"
	 * @example "CerbosResource"
	 * @example "Document"
	 */
	targetResourceType?: string

	/**
	 * Optional identifier of the target resource involved in the action.
	 * @example "pat-abc-123"
	 * @example "doc-xyz-789"
	 */
	targetResourceId?: string

	/**
	 * The status of the attempted action.
	 */
	status: AuditEventStatus

	/**
	 * Optional description of the outcome of the action.
	 * Provides more context than the `status` alone.
	 * @example "Successfully read Patient resource with ID pat-abc-123"
	 * @example "Authorization denied by Cerbos for principal user-12345 on Patient/pat-abc-123"
	 * @example "FHIR API returned 404 for Patient/pat-def-456"
	 * @example "User login failed due to invalid credentials"
	 */
	outcomeDescription?: string

	/**
	 * Allows for arbitrary additional key-value pairs to provide more context specific to the event.
	 * Use this for structured data relevant to the particular action being audited.
	 * @example { "ipAddress": "192.168.1.100", "userAgent": "Mozilla/5.0" }
	 * @example { "cerbosRequest": { "resource": "Patient", "action": "read" } }
	 */
	[key: string]: any
}
