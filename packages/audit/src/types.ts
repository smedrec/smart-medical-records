/**
 * Defines the possible statuses for an audit event.
 * - `attempt`: An action was attempted.
 * - `success`: An action was successfully completed.
 * - `failure`: An action failed to complete.
 */
export type AuditEventStatus = 'attempt' | 'success' | 'failure'

/**
 * Data classification levels for audit events
 */
export type DataClassification = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'PHI'

/**
 * Session context information for audit events
 */
export interface SessionContext {
	sessionId: string
	ipAddress: string
	userAgent: string
	geolocation?: string
}

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
	 * Cryptographic hash for immutability verification
	 * Generated automatically using SHA-256 algorithm
	 * @example "a1b2c3d4e5f6..."
	 */
	hash?: string

	/**
	 * Hash algorithm used for integrity verification
	 * Standardized to SHA-256 for consistency
	 * @default "SHA-256"
	 */
	hashAlgorithm?: 'SHA-256'

	/**
	 * Cryptographic signature for additional security
	 * Generated using HMAC-SHA256 with secret key
	 * @example "x1y2z3a4b5c6..."
	 */
	signature?: string

	/**
	 * Event schema version for compatibility tracking
	 * @example "1.0"
	 * @default "1.0"
	 */
	eventVersion?: string

	/**
	 * Correlation ID for tracking related events
	 * @example "corr-12345-abcde"
	 */
	correlationId?: string

	/**
	 * Session context information for the audit event
	 */
	sessionContext?: SessionContext

	/**
	 * Data classification level for compliance and security
	 * @default "INTERNAL"
	 */
	dataClassification?: DataClassification

	/**
	 * Retention policy identifier for data lifecycle management
	 * @example "standard"
	 * @example "extended"
	 * @example "minimal"
	 */
	retentionPolicy?: string

	/**
	 * Processing latency in milliseconds for performance monitoring
	 */
	processingLatency?: number

	/**
	 * Queue depth at time of processing for system monitoring
	 */
	queueDepth?: number

	/**
	 * Allows for arbitrary additional key-value pairs to provide more context specific to the event.
	 * Use this for structured data relevant to the particular action being audited.
	 * @example { "ipAddress": "192.168.1.100", "userAgent": "Mozilla/5.0" }
	 * @example { "cerbosRequest": { "resource": "Patient", "action": "read" } }
	 */
	[key: string]: any
}

/**
 * System-wide audit event types
 */
export type SystemAuditAction =
	| 'system.startup'
	| 'system.shutdown'
	| 'system.configuration.change'
	| 'system.backup.created'
	| 'system.backup.restored'
	| 'system.maintenance.started'
	| 'system.maintenance.completed'

/**
 * Authentication audit events
 */
export type AuthAuditAction =
	| 'auth.login.attempt'
	| 'auth.login.success'
	| 'auth.login.failure'
	| 'auth.logout'
	| 'auth.password.change'
	| 'auth.mfa.enabled'
	| 'auth.mfa.disabled'
	| 'auth.session.expired'

/**
 * Data access audit events
 */
export type DataAuditAction =
	| 'data.read'
	| 'data.create'
	| 'data.update'
	| 'data.delete'
	| 'data.export'
	| 'data.import'
	| 'data.share'
	| 'data.anonymize'

/**
 * FHIR-specific audit events
 */
export type FHIRAuditAction =
	| 'fhir.patient.read'
	| 'fhir.patient.create'
	| 'fhir.patient.update'
	| 'fhir.practitioner.read'
	| 'fhir.observation.create'
	| 'fhir.bundle.process'

/**
 * Practitioner-specific audit event types for license verification and management
 */
export type PractitionerAuditAction =
	| 'practitionerLicenseStatusChange'
	| 'practitionerRoleModification'
	| 'practitionerLicenseVerificationAttempt'
	| 'practitionerLicenseVerificationSuccess'
	| 'practitionerLicenseVerificationFailure'
	| 'practitionerOnboardingInitiated'
	| 'practitionerApprovalGranted'
	| 'practitionerApprovalRejected'
	| 'practitionerCertificateUploaded'
	| 'practitionerOCRProcessing'
	| 'practitionerManualReview'
	| 'practitionerComplianceExport'

/**
 * Union type of all audit action types for extensibility
 */
export type AuditAction =
	| SystemAuditAction
	| AuthAuditAction
	| DataAuditAction
	| FHIRAuditAction
	| PractitionerAuditAction
	| string

/**
 * Extended audit event interface specifically for practitioner management
 * Includes additional fields required for HIPAA compliance and regulatory auditing
 */
export interface PractitionerAuditEvent extends AuditLogEvent {
	action: PractitionerAuditAction
	practitionerId?: string
	licenseNumber?: string
	jurisdiction?: string
	oldStatus?: string
	newStatus?: string
	oldRole?: string
	newRole?: string
	verificationProvider?: string
	apiResponse?: Record<string, any>
	ocrConfidence?: number
	reviewedBy?: string
	reason?: string
	ipAddress?: string
	userAgent?: string
	sessionId?: string
	/**
	 * Cryptographic hash for immutability verification
	 * Generated automatically when the event is processed
	 */
	hash?: string
}
