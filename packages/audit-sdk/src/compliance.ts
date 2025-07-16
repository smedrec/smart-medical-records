import type { AuditLogEvent } from '@repo/audit'
import type { ComplianceConfig, ComplianceRule } from './types.js'

/**
 * Validates an audit event against compliance requirements
 */
export function validateCompliance(
	event: Partial<AuditLogEvent>,
	complianceType: string,
	config: ComplianceConfig
): void {
	switch (complianceType.toLowerCase()) {
		case 'hipaa':
			validateHIPAA(event, config.hipaa)
			break
		case 'gdpr':
			validateGDPR(event, config.gdpr)
			break
		default: {
			// Check custom compliance rules
			const customRule = config.custom?.find((rule) => rule.name === complianceType)
			if (customRule) {
				validateCustom(event, customRule.rules)
			}
		}
	}
}

/**
 * Validates HIPAA compliance requirements
 */
function validateHIPAA(
	event: Partial<AuditLogEvent>,
	hipaaConfig?: ComplianceConfig['hipaa']
): void {
	if (!hipaaConfig?.enabled) return

	const requiredFields = hipaaConfig.requiredFields || [
		'principalId', // Who
		'action', // What
		'targetResourceType', // What resource
		'targetResourceId', // Which resource
		'timestamp', // When
		'sessionContext', // Where from
	]

	// Check required fields
	for (const field of requiredFields) {
		if (!event[field as keyof AuditLogEvent]) {
			throw new Error(`HIPAA Compliance Error: Required field '${field}' is missing`)
		}
	}

	// Validate PHI data classification
	if (event.targetResourceType && isPHIResource(event.targetResourceType)) {
		if (event.dataClassification !== 'PHI') {
			throw new Error(
				'HIPAA Compliance Error: PHI resources must have dataClassification set to "PHI"'
			)
		}
	}

	// Validate session context for PHI access
	if (event.dataClassification === 'PHI' && !event.sessionContext) {
		throw new Error('HIPAA Compliance Error: PHI access events must include sessionContext')
	}

	// Validate retention policy
	if (event.dataClassification === 'PHI' && !event.retentionPolicy) {
		event.retentionPolicy = `hipaa-${hipaaConfig.retentionYears || 6}-years`
	}
}

/**
 * Validates GDPR compliance requirements
 */
function validateGDPR(event: Partial<AuditLogEvent>, gdprConfig?: ComplianceConfig['gdpr']): void {
	if (!gdprConfig?.enabled) return

	// Set retention policy for all events
	if (!event.retentionPolicy && gdprConfig.retentionDays) {
		event.retentionPolicy = `gdpr-${gdprConfig.retentionDays}-days`
	}

	// Check for personal data processing
	if (isPersonalDataProcessing(event)) {
		// Require legal basis
		if (!event.gdprContext?.legalBasis) {
			if (gdprConfig.defaultLegalBasis) {
				event.gdprContext = {
					...event.gdprContext,
					legalBasis: gdprConfig.defaultLegalBasis,
				}
			} else {
				throw new Error('GDPR Compliance Error: Legal basis required for personal data processing')
			}
		}

		// Require data subject identification for certain actions
		if (isDataSubjectRightsAction(event.action)) {
			if (!event.gdprContext?.dataSubjectId) {
				throw new Error(
					'GDPR Compliance Error: Data subject ID required for rights-related actions'
				)
			}
		}
	}
}

/**
 * Validates custom compliance rules
 */
function validateCustom(event: Partial<AuditLogEvent>, rules: ComplianceRule[]): void {
	for (const rule of rules) {
		const value = event[rule.field as keyof AuditLogEvent]

		// Check required fields
		if (rule.required && (value === undefined || value === null)) {
			throw new Error(`Custom Compliance Error: Required field '${rule.field}' is missing`)
		}

		// Run custom validator
		if (rule.validator && value !== undefined && !rule.validator(value)) {
			throw new Error(
				rule.message || `Custom Compliance Error: Field '${rule.field}' failed validation`
			)
		}
	}
}

/**
 * Checks if a resource type contains PHI
 */
function isPHIResource(resourceType: string): boolean {
	const phiResources = [
		'Patient',
		'Observation',
		'Condition',
		'Procedure',
		'MedicationRequest',
		'MedicationStatement',
		'AllergyIntolerance',
		'DiagnosticReport',
		'DocumentReference',
		'Encounter',
		'ImagingStudy',
		'Immunization',
		'CarePlan',
		'CareTeam',
		'Goal',
	]

	return phiResources.includes(resourceType)
}

/**
 * Checks if an event involves personal data processing
 */
function isPersonalDataProcessing(event: Partial<AuditLogEvent>): boolean {
	// Check if action involves personal data
	const personalDataActions = [
		'data.create',
		'data.read',
		'data.update',
		'data.delete',
		'data.export',
		'data.share',
		'fhir.patient',
		'user.profile',
	]

	return personalDataActions.some((action) =>
		event.action?.toLowerCase().includes(action.toLowerCase())
	)
}

/**
 * Checks if an action relates to data subject rights
 */
function isDataSubjectRightsAction(action?: string): boolean {
	if (!action) return false

	const rightsActions = [
		'data.export', // Right to portability
		'data.delete', // Right to erasure
		'data.rectify', // Right to rectification
		'data.access', // Right to access
		'consent.withdraw', // Right to withdraw consent
	]

	return rightsActions.some((rightsAction) =>
		action.toLowerCase().includes(rightsAction.toLowerCase())
	)
}

/**
 * Generate compliance report data
 */
export function generateComplianceData(
	events: AuditLogEvent[],
	complianceType: 'hipaa' | 'gdpr'
): any {
	switch (complianceType) {
		case 'hipaa':
			return generateHIPAAReport(events)
		case 'gdpr':
			return generateGDPRReport(events)
		default:
			throw new Error(`Unsupported compliance type: ${complianceType}`)
	}
}

/**
 * Generate HIPAA compliance report
 */
function generateHIPAAReport(events: AuditLogEvent[]) {
	const phiEvents = events.filter((event) => event.dataClassification === 'PHI')

	return {
		reportType: 'HIPAA Audit Log',
		generatedAt: new Date().toISOString(),
		totalEvents: events.length,
		phiEvents: phiEvents.length,
		summary: {
			accessEvents: phiEvents.filter((e) => e.action.includes('read')).length,
			modificationEvents: phiEvents.filter(
				(e) =>
					e.action.includes('create') || e.action.includes('update') || e.action.includes('delete')
			).length,
			failedAttempts: phiEvents.filter((e) => e.status === 'failure').length,
		},
		events: phiEvents.map((event) => ({
			timestamp: event.timestamp,
			user: event.principalId,
			action: event.action,
			resource: `${event.targetResourceType}/${event.targetResourceId}`,
			outcome: event.status,
			description: event.outcomeDescription,
			ipAddress: event.sessionContext?.ipAddress,
		})),
	}
}

/**
 * Generate GDPR compliance report
 */
function generateGDPRReport(events: AuditLogEvent[]) {
	const personalDataEvents = events.filter(
		(event) => isPersonalDataProcessing(event) || event.gdprContext
	)

	return {
		reportType: 'GDPR Processing Activities',
		generatedAt: new Date().toISOString(),
		totalEvents: events.length,
		personalDataEvents: personalDataEvents.length,
		legalBasisBreakdown: getLegalBasisBreakdown(personalDataEvents),
		dataSubjectRights: getDataSubjectRightsEvents(personalDataEvents),
		events: personalDataEvents.map((event) => ({
			timestamp: event.timestamp,
			processor: event.principalId,
			activity: event.action,
			legalBasis: event.gdprContext?.legalBasis,
			dataSubject: event.gdprContext?.dataSubjectId,
			purpose: event.gdprContext?.processingPurpose,
			categories: event.gdprContext?.dataCategories,
		})),
	}
}

/**
 * Get legal basis breakdown for GDPR report
 */
function getLegalBasisBreakdown(events: AuditLogEvent[]) {
	const breakdown: Record<string, number> = {}

	events.forEach((event) => {
		const basis = event.gdprContext?.legalBasis || 'unspecified'
		breakdown[basis] = (breakdown[basis] || 0) + 1
	})

	return breakdown
}

/**
 * Get data subject rights events for GDPR report
 */
function getDataSubjectRightsEvents(events: AuditLogEvent[]) {
	return events
		.filter((event) => isDataSubjectRightsAction(event.action))
		.map((event) => ({
			timestamp: event.timestamp,
			right: event.action,
			dataSubject: event.gdprContext?.dataSubjectId,
			outcome: event.status,
		}))
}
