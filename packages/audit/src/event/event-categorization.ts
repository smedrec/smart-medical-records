/**
 * Event type validation and categorization logic
 * Provides utilities to validate and categorize audit events
 */

import type {
	AuditAction,
	AuthAuditAction,
	DataAuditAction,
	FHIRAuditAction,
	SystemAuditAction,
} from '../types.js'
import type { CategorizedAuditEvent } from './event-types.js'

/**
 * System audit actions for validation
 */
const SYSTEM_ACTIONS: readonly SystemAuditAction[] = [
	'system.startup',
	'system.shutdown',
	'system.configuration.change',
	'system.backup.created',
	'system.backup.restored',
	'system.maintenance.started',
	'system.maintenance.completed',
] as const

/**
 * Authentication audit actions for validation
 */
const AUTH_ACTIONS: readonly AuthAuditAction[] = [
	'auth.login.attempt',
	'auth.login.success',
	'auth.login.failure',
	'auth.logout',
	'auth.password.change',
	'auth.mfa.enabled',
	'auth.mfa.disabled',
	'auth.session.expired',
] as const

/**
 * Data audit actions for validation
 */
const DATA_ACTIONS: readonly DataAuditAction[] = [
	'data.read',
	'data.create',
	'data.update',
	'data.delete',
	'data.export',
	'data.import',
	'data.share',
	'data.anonymize',
] as const

/**
 * FHIR audit actions for validation
 */
const FHIR_ACTIONS: readonly FHIRAuditAction[] = [
	'fhir.patient.read',
	'fhir.patient.create',
	'fhir.patient.update',
	'fhir.practitioner.read',
	'fhir.observation.create',
	'fhir.bundle.process',
] as const

/**
 * Type guards for audit action categorization
 */

/**
 * Checks if an action is a system audit action
 */
export function isSystemAction(action: string): action is SystemAuditAction {
	return SYSTEM_ACTIONS.includes(action as SystemAuditAction)
}

/**
 * Checks if an action is an authentication audit action
 */
export function isAuthAction(action: string): action is AuthAuditAction {
	return AUTH_ACTIONS.includes(action as AuthAuditAction)
}

/**
 * Checks if an action is a data audit action
 */
export function isDataAction(action: string): action is DataAuditAction {
	return DATA_ACTIONS.includes(action as DataAuditAction)
}

/**
 * Checks if an action is a FHIR audit action
 */
export function isFHIRAction(action: string): action is FHIRAuditAction {
	return FHIR_ACTIONS.includes(action as FHIRAuditAction)
}

/**
 * Determines the category of an audit action
 */
export function getActionCategory(action: string): 'system' | 'auth' | 'data' | 'fhir' | 'unknown' {
	if (isSystemAction(action)) return 'system'
	if (isAuthAction(action)) return 'auth'
	if (isDataAction(action)) return 'data'
	if (isFHIRAction(action)) return 'fhir'
	return 'unknown'
}

/**
 * Validates if an action is a known audit action type
 */
export function isValidAuditAction(action: string): boolean {
	return getActionCategory(action) !== 'unknown'
}

/**
 * Gets all valid actions for a specific category
 */
export function getActionsForCategory(
	category: 'system' | 'auth' | 'data' | 'fhir'
): readonly string[] {
	switch (category) {
		case 'system':
			return SYSTEM_ACTIONS
		case 'auth':
			return AUTH_ACTIONS
		case 'data':
			return DATA_ACTIONS
		case 'fhir':
			return FHIR_ACTIONS
		default:
			return []
	}
}

/**
 * Event validation result interface
 */
export interface EventValidationResult {
	isValid: boolean
	category: 'system' | 'auth' | 'data' | 'fhir' | 'unknown'
	errors: string[]
	warnings: string[]
}

/**
 * Validates a categorized audit event
 */
export function validateCategorizedEvent(event: CategorizedAuditEvent): EventValidationResult {
	const errors: string[] = []
	const warnings: string[] = []

	// Validate action matches category
	const actionCategory = getActionCategory(event.action)
	if (actionCategory === 'unknown') {
		errors.push(`Unknown audit action: ${event.action}`)
	} else if (actionCategory !== event.category) {
		errors.push(
			`Action category mismatch: action '${event.action}' does not match declared category '${event.category}'`
		)
	}

	// Category-specific validations
	switch (event.category) {
		case 'system':
			validateSystemEvent(event as any, errors, warnings)
			break
		case 'auth':
			validateAuthEvent(event as any, errors, warnings)
			break
		case 'data':
			validateDataEvent(event as any, errors, warnings)
			break
		case 'fhir':
			validateFHIREvent(event as any, errors, warnings)
			break
	}

	return {
		isValid: errors.length === 0,
		category: actionCategory,
		errors,
		warnings,
	}
}

/**
 * Validates system-specific event fields
 */
function validateSystemEvent(event: any, errors: string[], warnings: string[]): void {
	// Validate system component for certain actions
	if (
		[
			'system.configuration.change',
			'system.maintenance.started',
			'system.maintenance.completed',
		].includes(event.action)
	) {
		if (!event.systemComponent) {
			warnings.push('System component not specified for system action')
		}
	}

	// Validate configuration changes
	if (event.action === 'system.configuration.change' && !event.configurationChanges) {
		warnings.push('Configuration changes not documented for configuration change event')
	}

	// Validate backup details
	if (
		['system.backup.created', 'system.backup.restored'].includes(event.action) &&
		!event.backupDetails
	) {
		warnings.push('Backup details not provided for backup-related event')
	}

	// Validate maintenance details
	if (
		['system.maintenance.started', 'system.maintenance.completed'].includes(event.action) &&
		!event.maintenanceDetails
	) {
		warnings.push('Maintenance details not provided for maintenance event')
	}
}

/**
 * Validates authentication-specific event fields
 */
function validateAuthEvent(event: any, errors: string[], warnings: string[]): void {
	// Validate principal ID for auth events
	if (!event.principalId && !['auth.session.expired'].includes(event.action)) {
		warnings.push('Principal ID not specified for authentication event')
	}

	// Validate failure reason for failed auth events
	if (event.status === 'failure' && !event.failureReason) {
		warnings.push('Failure reason not provided for failed authentication event')
	}

	// Validate MFA details
	if (['auth.mfa.enabled', 'auth.mfa.disabled'].includes(event.action) && !event.mfaDetails) {
		warnings.push('MFA details not provided for MFA-related event')
	}

	// Validate session context for login events
	if (
		['auth.login.attempt', 'auth.login.success', 'auth.login.failure'].includes(event.action) &&
		!event.sessionContext
	) {
		warnings.push('Session context not provided for login event')
	}
}

/**
 * Validates data-specific event fields
 */
function validateDataEvent(event: any, errors: string[], warnings: string[]): void {
	// Validate target resource for data operations
	if (['data.read', 'data.update', 'data.delete'].includes(event.action)) {
		if (!event.targetResourceType || !event.targetResourceId) {
			warnings.push('Target resource information incomplete for data operation')
		}
	}

	// Validate export format for export events
	if (event.action === 'data.export' && !event.exportFormat) {
		warnings.push('Export format not specified for data export event')
	}

	// Validate share recipient for share events
	if (event.action === 'data.share' && !event.shareRecipient) {
		warnings.push('Share recipient not specified for data sharing event')
	}

	// Validate anonymization method
	if (event.action === 'data.anonymize' && !event.anonymizationMethod) {
		warnings.push('Anonymization method not specified for data anonymization event')
	}

	// Validate data classification for sensitive operations
	if (['data.export', 'data.share'].includes(event.action) && event.dataClassification === 'PHI') {
		if (!event.outcomeDescription) {
			warnings.push('Outcome description recommended for PHI data operations')
		}
	}
}

/**
 * Validates FHIR-specific event fields
 */
function validateFHIREvent(event: any, errors: string[], warnings: string[]): void {
	// Validate FHIR resource information
	if (
		[
			'fhir.patient.read',
			'fhir.patient.create',
			'fhir.patient.update',
			'fhir.practitioner.read',
		].includes(event.action)
	) {
		if (!event.fhirResourceType || !event.fhirResourceId) {
			warnings.push('FHIR resource information incomplete')
		}
	}

	// Validate bundle details for bundle processing
	if (event.action === 'fhir.bundle.process') {
		if (!event.bundleType) {
			warnings.push('Bundle type not specified for bundle processing event')
		}
		if (!event.bundleSize) {
			warnings.push('Bundle size not specified for bundle processing event')
		}
	}

	// Validate patient ID for patient-related operations
	if (event.action.includes('patient') && !event.patientId) {
		warnings.push('Patient ID not specified for patient-related FHIR operation')
	}

	// Validate practitioner ID for practitioner-related operations
	if (event.action.includes('practitioner') && !event.practitionerId) {
		warnings.push('Practitioner ID not specified for practitioner-related FHIR operation')
	}

	// Ensure PHI classification for FHIR events
	if (event.dataClassification !== 'PHI') {
		warnings.push('FHIR events should typically be classified as PHI')
	}

	// Validate operation outcome for failed operations
	if (event.status === 'failure' && !event.operationOutcome) {
		warnings.push('Operation outcome not provided for failed FHIR operation')
	}
}

/**
 * Gets recommended fields for a specific event category
 */
export function getRecommendedFields(category: 'system' | 'auth' | 'data' | 'fhir'): string[] {
	switch (category) {
		case 'system':
			return ['systemComponent', 'configurationChanges', 'maintenanceDetails', 'backupDetails']
		case 'auth':
			return ['authMethod', 'failureReason', 'sessionContext', 'mfaDetails']
		case 'data':
			return ['dataType', 'recordCount', 'targetResourceType', 'targetResourceId', 'exportFormat']
		case 'fhir':
			return [
				'fhirResourceType',
				'fhirResourceId',
				'patientId',
				'practitionerId',
				'operationOutcome',
			]
		default:
			return []
	}
}

/**
 * Gets required fields for a specific event category
 */
export function getRequiredFields(category: 'system' | 'auth' | 'data' | 'fhir'): string[] {
	// Base required fields for all events
	const baseRequired = ['timestamp', 'action', 'status']

	switch (category) {
		case 'system':
			return [...baseRequired]
		case 'auth':
			return [...baseRequired, 'principalId']
		case 'data':
			return [...baseRequired, 'principalId']
		case 'fhir':
			return [...baseRequired, 'principalId']
		default:
			return baseRequired
	}
}
