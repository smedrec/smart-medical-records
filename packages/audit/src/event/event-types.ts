/**
 * Comprehensive audit event types and interfaces
 * Provides specific event interfaces for each audit category and factory functions
 */

import { isAuthAction, isDataAction, isFHIRAction, isSystemAction } from './event-categorization.js'

import type {
	AuditEventStatus,
	AuditLogEvent,
	AuthAuditAction,
	DataAuditAction,
	DataClassification,
	FHIRAuditAction,
	SystemAuditAction,
} from '../types.js'

/**
 * Base interface for all categorized audit events
 */
interface BaseAuditEvent extends AuditLogEvent {
	category: 'system' | 'auth' | 'data' | 'fhir'
	subcategory?: string
}

/**
 * System audit event interface
 * For system-level operations like startup, shutdown, configuration changes
 */
export interface SystemAuditEvent extends BaseAuditEvent {
	category: 'system'
	action: SystemAuditAction
	systemComponent?: string
	configurationChanges?: Record<string, { old: any; new: any }>
	maintenanceDetails?: {
		type: 'scheduled' | 'emergency' | 'routine'
		duration?: number
		affectedServices?: string[]
	}
	backupDetails?: {
		type: 'full' | 'incremental' | 'differential'
		size?: number
		location?: string
	}
}

/**
 * Authentication audit event interface
 * For authentication and authorization operations
 */
export interface AuthAuditEvent extends BaseAuditEvent {
	category: 'auth'
	action: AuthAuditAction
	authMethod?: 'password' | 'mfa' | 'sso' | 'api_key' | 'oauth'
	failureReason?: string
	sessionDuration?: number
	mfaDetails?: {
		method: 'totp' | 'sms' | 'email' | 'hardware'
		verified: boolean
	}
	passwordPolicy?: {
		complexity: boolean
		length: boolean
		history: boolean
	}
}

/**
 * Data audit event interface
 * For data access and manipulation operations
 */
export interface DataAuditEvent extends BaseAuditEvent {
	category: 'data'
	action: DataAuditAction
	dataType?: string
	recordCount?: number
	dataSize?: number
	exportFormat?: 'json' | 'csv' | 'xml' | 'pdf'
	shareRecipient?: string
	anonymizationMethod?: 'pseudonymization' | 'generalization' | 'suppression'
	queryDetails?: {
		filters?: Record<string, any>
		sortBy?: string
		limit?: number
		offset?: number
	}
}

/**
 * FHIR audit event interface
 * For FHIR-specific operations following healthcare standards
 */
export interface FHIRAuditEvent extends BaseAuditEvent {
	category: 'fhir'
	action: FHIRAuditAction
	fhirResourceType?: string
	fhirResourceId?: string
	fhirVersion?: string
	bundleType?: 'document' | 'message' | 'transaction' | 'batch' | 'collection'
	bundleSize?: number
	operationOutcome?: {
		severity: 'information' | 'warning' | 'error' | 'fatal'
		code: string
		details?: string
	}
	patientId?: string
	practitionerId?: string
}

/**
 * Union type for all specific audit event types
 */
export type CategorizedAuditEvent =
	| SystemAuditEvent
	| AuthAuditEvent
	| DataAuditEvent
	| FHIRAuditEvent

/**
 * Event factory configuration
 */
export interface EventFactoryConfig {
	generateTimestamp?: boolean
	generateCorrelationId?: boolean
	defaultDataClassification?: DataClassification
	defaultRetentionPolicy?: string
	defaultEventVersion?: string
}

/**
 * Default factory configuration
 */
export const DEFAULT_FACTORY_CONFIG: EventFactoryConfig = {
	generateTimestamp: true,
	generateCorrelationId: false,
	defaultDataClassification: 'INTERNAL',
	defaultRetentionPolicy: 'standard',
	defaultEventVersion: '1.0',
}

/**
 * Generates a correlation ID for event tracking
 */
function generateCorrelationId(): string {
	return `corr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Factory function for creating system audit events
 */
export function createSystemAuditEvent(
	action: SystemAuditAction,
	details: Partial<SystemAuditEvent> & {
		status: AuditEventStatus
		principalId?: string
		organizationId?: string
	},
	config: EventFactoryConfig = DEFAULT_FACTORY_CONFIG
): SystemAuditEvent {
	const baseEvent: SystemAuditEvent = {
		category: 'system',
		action,
		timestamp: config.generateTimestamp ? new Date().toISOString() : details.timestamp || '',
		eventVersion: config.defaultEventVersion,
		hashAlgorithm: 'SHA-256',
		dataClassification: details.dataClassification || config.defaultDataClassification,
		retentionPolicy: details.retentionPolicy || config.defaultRetentionPolicy,
		...details,
	}

	if (config.generateCorrelationId && !baseEvent.correlationId) {
		baseEvent.correlationId = generateCorrelationId()
	}

	return baseEvent
}

/**
 * Factory function for creating authentication audit events
 */
export function createAuthAuditEvent(
	action: AuthAuditAction,
	details: Partial<AuthAuditEvent> & {
		status: AuditEventStatus
		principalId?: string
		organizationId?: string
	},
	config: EventFactoryConfig = DEFAULT_FACTORY_CONFIG
): AuthAuditEvent {
	const baseEvent: AuthAuditEvent = {
		category: 'auth',
		action,
		timestamp: config.generateTimestamp ? new Date().toISOString() : details.timestamp || '',
		eventVersion: config.defaultEventVersion,
		hashAlgorithm: 'SHA-256',
		dataClassification: details.dataClassification || config.defaultDataClassification,
		retentionPolicy: details.retentionPolicy || config.defaultRetentionPolicy,
		...details,
	}

	if (config.generateCorrelationId && !baseEvent.correlationId) {
		baseEvent.correlationId = generateCorrelationId()
	}

	return baseEvent
}

/**
 * Factory function for creating data audit events
 */
export function createDataAuditEvent(
	action: DataAuditAction,
	details: Partial<DataAuditEvent> & {
		status: AuditEventStatus
		principalId?: string
		organizationId?: string
	},
	config: EventFactoryConfig = DEFAULT_FACTORY_CONFIG
): DataAuditEvent {
	const baseEvent: DataAuditEvent = {
		category: 'data',
		action,
		timestamp: config.generateTimestamp ? new Date().toISOString() : details.timestamp || '',
		eventVersion: config.defaultEventVersion,
		hashAlgorithm: 'SHA-256',
		dataClassification: details.dataClassification || config.defaultDataClassification,
		retentionPolicy: details.retentionPolicy || config.defaultRetentionPolicy,
		...details,
	}

	if (config.generateCorrelationId && !baseEvent.correlationId) {
		baseEvent.correlationId = generateCorrelationId()
	}

	return baseEvent
}

/**
 * Factory function for creating FHIR audit events
 */
export function createFHIRAuditEvent(
	action: FHIRAuditAction,
	details: Partial<FHIRAuditEvent> & {
		status: AuditEventStatus
		principalId?: string
		organizationId?: string
	},
	config: EventFactoryConfig = DEFAULT_FACTORY_CONFIG
): FHIRAuditEvent {
	const baseEvent: FHIRAuditEvent = {
		category: 'fhir',
		action,
		timestamp: config.generateTimestamp ? new Date().toISOString() : details.timestamp || '',
		eventVersion: config.defaultEventVersion,
		hashAlgorithm: 'SHA-256',
		dataClassification: details.dataClassification || 'PHI', // Default to PHI for FHIR events
		retentionPolicy: details.retentionPolicy || config.defaultRetentionPolicy,
		...details,
	}

	if (config.generateCorrelationId && !baseEvent.correlationId) {
		baseEvent.correlationId = generateCorrelationId()
	}

	return baseEvent
}

/**
 * Generic factory function that routes to specific factories based on action type
 */
export function createAuditEvent(
	action: SystemAuditAction | AuthAuditAction | DataAuditAction | FHIRAuditAction,
	details: Partial<CategorizedAuditEvent> & {
		status: AuditEventStatus
		principalId?: string
		organizationId?: string
	},
	config: EventFactoryConfig = DEFAULT_FACTORY_CONFIG
): CategorizedAuditEvent {
	// Determine category based on action type
	if (isSystemAction(action)) {
		return createSystemAuditEvent(
			action,
			details as Partial<SystemAuditEvent> & { status: AuditEventStatus },
			config
		)
	} else if (isAuthAction(action)) {
		return createAuthAuditEvent(
			action,
			details as Partial<AuthAuditEvent> & { status: AuditEventStatus },
			config
		)
	} else if (isDataAction(action)) {
		return createDataAuditEvent(
			action,
			details as Partial<DataAuditEvent> & { status: AuditEventStatus },
			config
		)
	} else if (isFHIRAction(action)) {
		return createFHIRAuditEvent(
			action,
			details as Partial<FHIRAuditEvent> & { status: AuditEventStatus },
			config
		)
	} else {
		throw new Error(`Unknown audit action type: ${action}`)
	}
}
