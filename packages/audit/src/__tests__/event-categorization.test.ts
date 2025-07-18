/**
 * Unit tests for event categorization and validation logic
 */

import { describe, expect, it } from 'vitest'

import {
	getActionCategory,
	getActionsForCategory,
	getRecommendedFields,
	getRequiredFields,
	isAuthAction,
	isDataAction,
	isFHIRAction,
	isSystemAction,
	isValidAuditAction,
	validateCategorizedEvent,
} from '../event/event-categorization.js'
import {
	createAuthAuditEvent,
	createDataAuditEvent,
	createFHIRAuditEvent,
	createSystemAuditEvent,
} from '../event/event-types.js'

import type {
	AuthAuditEvent,
	DataAuditEvent,
	FHIRAuditEvent,
	SystemAuditEvent,
} from '../event/event-types.js'

describe('Event Categorization', () => {
	describe('Type Guards', () => {
		describe('isSystemAction', () => {
			it('should return true for valid system actions', () => {
				expect(isSystemAction('system.startup')).toBe(true)
				expect(isSystemAction('system.shutdown')).toBe(true)
				expect(isSystemAction('system.configuration.change')).toBe(true)
				expect(isSystemAction('system.backup.created')).toBe(true)
				expect(isSystemAction('system.backup.restored')).toBe(true)
				expect(isSystemAction('system.maintenance.started')).toBe(true)
				expect(isSystemAction('system.maintenance.completed')).toBe(true)
			})

			it('should return false for non-system actions', () => {
				expect(isSystemAction('auth.login.success')).toBe(false)
				expect(isSystemAction('data.read')).toBe(false)
				expect(isSystemAction('fhir.patient.read')).toBe(false)
				expect(isSystemAction('unknown.action')).toBe(false)
			})
		})

		describe('isAuthAction', () => {
			it('should return true for valid auth actions', () => {
				expect(isAuthAction('auth.login.attempt')).toBe(true)
				expect(isAuthAction('auth.login.success')).toBe(true)
				expect(isAuthAction('auth.login.failure')).toBe(true)
				expect(isAuthAction('auth.logout')).toBe(true)
				expect(isAuthAction('auth.password.change')).toBe(true)
				expect(isAuthAction('auth.mfa.enabled')).toBe(true)
				expect(isAuthAction('auth.mfa.disabled')).toBe(true)
				expect(isAuthAction('auth.session.expired')).toBe(true)
			})

			it('should return false for non-auth actions', () => {
				expect(isAuthAction('system.startup')).toBe(false)
				expect(isAuthAction('data.read')).toBe(false)
				expect(isAuthAction('fhir.patient.read')).toBe(false)
				expect(isAuthAction('unknown.action')).toBe(false)
			})
		})

		describe('isDataAction', () => {
			it('should return true for valid data actions', () => {
				expect(isDataAction('data.read')).toBe(true)
				expect(isDataAction('data.create')).toBe(true)
				expect(isDataAction('data.update')).toBe(true)
				expect(isDataAction('data.delete')).toBe(true)
				expect(isDataAction('data.export')).toBe(true)
				expect(isDataAction('data.import')).toBe(true)
				expect(isDataAction('data.share')).toBe(true)
				expect(isDataAction('data.anonymize')).toBe(true)
			})

			it('should return false for non-data actions', () => {
				expect(isDataAction('system.startup')).toBe(false)
				expect(isDataAction('auth.login.success')).toBe(false)
				expect(isDataAction('fhir.patient.read')).toBe(false)
				expect(isDataAction('unknown.action')).toBe(false)
			})
		})

		describe('isFHIRAction', () => {
			it('should return true for valid FHIR actions', () => {
				expect(isFHIRAction('fhir.patient.read')).toBe(true)
				expect(isFHIRAction('fhir.patient.create')).toBe(true)
				expect(isFHIRAction('fhir.patient.update')).toBe(true)
				expect(isFHIRAction('fhir.practitioner.read')).toBe(true)
				expect(isFHIRAction('fhir.observation.create')).toBe(true)
				expect(isFHIRAction('fhir.bundle.process')).toBe(true)
			})

			it('should return false for non-FHIR actions', () => {
				expect(isFHIRAction('system.startup')).toBe(false)
				expect(isFHIRAction('auth.login.success')).toBe(false)
				expect(isFHIRAction('data.read')).toBe(false)
				expect(isFHIRAction('unknown.action')).toBe(false)
			})
		})
	})

	describe('getActionCategory', () => {
		it('should return correct category for system actions', () => {
			expect(getActionCategory('system.startup')).toBe('system')
			expect(getActionCategory('system.configuration.change')).toBe('system')
		})

		it('should return correct category for auth actions', () => {
			expect(getActionCategory('auth.login.success')).toBe('auth')
			expect(getActionCategory('auth.password.change')).toBe('auth')
		})

		it('should return correct category for data actions', () => {
			expect(getActionCategory('data.read')).toBe('data')
			expect(getActionCategory('data.export')).toBe('data')
		})

		it('should return correct category for FHIR actions', () => {
			expect(getActionCategory('fhir.patient.read')).toBe('fhir')
			expect(getActionCategory('fhir.bundle.process')).toBe('fhir')
		})

		it('should return unknown for invalid actions', () => {
			expect(getActionCategory('unknown.action')).toBe('unknown')
			expect(getActionCategory('invalid')).toBe('unknown')
		})
	})

	describe('isValidAuditAction', () => {
		it('should return true for valid actions', () => {
			expect(isValidAuditAction('system.startup')).toBe(true)
			expect(isValidAuditAction('auth.login.success')).toBe(true)
			expect(isValidAuditAction('data.read')).toBe(true)
			expect(isValidAuditAction('fhir.patient.read')).toBe(true)
		})

		it('should return false for invalid actions', () => {
			expect(isValidAuditAction('unknown.action')).toBe(false)
			expect(isValidAuditAction('invalid')).toBe(false)
		})
	})

	describe('getActionsForCategory', () => {
		it('should return system actions for system category', () => {
			const actions = getActionsForCategory('system')
			expect(actions).toContain('system.startup')
			expect(actions).toContain('system.shutdown')
			expect(actions).toContain('system.configuration.change')
			expect(actions.length).toBe(7)
		})

		it('should return auth actions for auth category', () => {
			const actions = getActionsForCategory('auth')
			expect(actions).toContain('auth.login.attempt')
			expect(actions).toContain('auth.login.success')
			expect(actions).toContain('auth.logout')
			expect(actions.length).toBe(8)
		})

		it('should return data actions for data category', () => {
			const actions = getActionsForCategory('data')
			expect(actions).toContain('data.read')
			expect(actions).toContain('data.create')
			expect(actions).toContain('data.export')
			expect(actions.length).toBe(8)
		})

		it('should return FHIR actions for FHIR category', () => {
			const actions = getActionsForCategory('fhir')
			expect(actions).toContain('fhir.patient.read')
			expect(actions).toContain('fhir.practitioner.read')
			expect(actions).toContain('fhir.bundle.process')
			expect(actions.length).toBe(6)
		})
	})

	describe('validateCategorizedEvent', () => {
		describe('System Event Validation', () => {
			it('should validate valid system event', () => {
				const event = createSystemAuditEvent('system.startup', {
					status: 'success',
					principalId: 'system-service',
				})

				const result = validateCategorizedEvent(event)
				expect(result.isValid).toBe(true)
				expect(result.category).toBe('system')
				expect(result.errors).toHaveLength(0)
			})

			it('should warn about missing system component for configuration change', () => {
				const event = createSystemAuditEvent('system.configuration.change', {
					status: 'success',
					principalId: 'admin-user',
				})

				const result = validateCategorizedEvent(event)
				expect(result.isValid).toBe(true)
				expect(result.warnings).toContain('System component not specified for system action')
			})

			it('should warn about missing configuration changes', () => {
				const event = createSystemAuditEvent('system.configuration.change', {
					status: 'success',
					principalId: 'admin-user',
					systemComponent: 'database',
				})

				const result = validateCategorizedEvent(event)
				expect(result.isValid).toBe(true)
				expect(result.warnings).toContain(
					'Configuration changes not documented for configuration change event'
				)
			})

			it('should warn about missing backup details', () => {
				const event = createSystemAuditEvent('system.backup.created', {
					status: 'success',
					principalId: 'backup-service',
				})

				const result = validateCategorizedEvent(event)
				expect(result.isValid).toBe(true)
				expect(result.warnings).toContain('Backup details not provided for backup-related event')
			})

			it('should warn about missing maintenance details', () => {
				const event = createSystemAuditEvent('system.maintenance.started', {
					status: 'success',
					principalId: 'maintenance-system',
				})

				const result = validateCategorizedEvent(event)
				expect(result.isValid).toBe(true)
				expect(result.warnings).toContain('Maintenance details not provided for maintenance event')
			})
		})

		describe('Auth Event Validation', () => {
			it('should validate valid auth event', () => {
				const event = createAuthAuditEvent('auth.login.success', {
					status: 'success',
					principalId: 'user-123',
				})

				const result = validateCategorizedEvent(event)
				expect(result.isValid).toBe(true)
				expect(result.category).toBe('auth')
				expect(result.errors).toHaveLength(0)
			})

			it('should warn about missing principal ID', () => {
				const event = createAuthAuditEvent('auth.login.success', {
					status: 'success',
				})

				const result = validateCategorizedEvent(event)
				expect(result.isValid).toBe(true)
				expect(result.warnings).toContain('Principal ID not specified for authentication event')
			})

			it('should warn about missing failure reason for failed auth', () => {
				const event = createAuthAuditEvent('auth.login.failure', {
					status: 'failure',
					principalId: 'user-123',
				})

				const result = validateCategorizedEvent(event)
				expect(result.isValid).toBe(true)
				expect(result.warnings).toContain(
					'Failure reason not provided for failed authentication event'
				)
			})

			it('should warn about missing MFA details', () => {
				const event = createAuthAuditEvent('auth.mfa.enabled', {
					status: 'success',
					principalId: 'user-123',
				})

				const result = validateCategorizedEvent(event)
				expect(result.isValid).toBe(true)
				expect(result.warnings).toContain('MFA details not provided for MFA-related event')
			})

			it('should warn about missing session context for login events', () => {
				const event = createAuthAuditEvent('auth.login.attempt', {
					status: 'attempt',
					principalId: 'user-123',
				})

				const result = validateCategorizedEvent(event)
				expect(result.isValid).toBe(true)
				expect(result.warnings).toContain('Session context not provided for login event')
			})
		})

		describe('Data Event Validation', () => {
			it('should validate valid data event', () => {
				const event = createDataAuditEvent('data.read', {
					status: 'success',
					principalId: 'user-123',
					targetResourceType: 'Patient',
					targetResourceId: 'patient-456',
				})

				const result = validateCategorizedEvent(event)
				expect(result.isValid).toBe(true)
				expect(result.category).toBe('data')
				expect(result.errors).toHaveLength(0)
			})

			it('should warn about incomplete target resource information', () => {
				const event = createDataAuditEvent('data.read', {
					status: 'success',
					principalId: 'user-123',
				})

				const result = validateCategorizedEvent(event)
				expect(result.isValid).toBe(true)
				expect(result.warnings).toContain(
					'Target resource information incomplete for data operation'
				)
			})

			it('should warn about missing export format', () => {
				const event = createDataAuditEvent('data.export', {
					status: 'success',
					principalId: 'user-123',
				})

				const result = validateCategorizedEvent(event)
				expect(result.isValid).toBe(true)
				expect(result.warnings).toContain('Export format not specified for data export event')
			})

			it('should warn about missing share recipient', () => {
				const event = createDataAuditEvent('data.share', {
					status: 'success',
					principalId: 'user-123',
				})

				const result = validateCategorizedEvent(event)
				expect(result.isValid).toBe(true)
				expect(result.warnings).toContain('Share recipient not specified for data sharing event')
			})

			it('should warn about missing anonymization method', () => {
				const event = createDataAuditEvent('data.anonymize', {
					status: 'success',
					principalId: 'user-123',
				})

				const result = validateCategorizedEvent(event)
				expect(result.isValid).toBe(true)
				expect(result.warnings).toContain(
					'Anonymization method not specified for data anonymization event'
				)
			})

			it('should warn about missing outcome description for PHI operations', () => {
				const event = createDataAuditEvent('data.export', {
					status: 'success',
					principalId: 'user-123',
					dataClassification: 'PHI',
				})

				const result = validateCategorizedEvent(event)
				expect(result.isValid).toBe(true)
				expect(result.warnings).toContain('Outcome description recommended for PHI data operations')
			})
		})

		describe('FHIR Event Validation', () => {
			it('should validate valid FHIR event', () => {
				const event = createFHIRAuditEvent('fhir.patient.read', {
					status: 'success',
					principalId: 'practitioner-123',
					fhirResourceType: 'Patient',
					fhirResourceId: 'patient-456',
					patientId: 'patient-456',
				})

				const result = validateCategorizedEvent(event)
				expect(result.isValid).toBe(true)
				expect(result.category).toBe('fhir')
				expect(result.errors).toHaveLength(0)
			})

			it('should warn about incomplete FHIR resource information', () => {
				const event = createFHIRAuditEvent('fhir.patient.read', {
					status: 'success',
					principalId: 'practitioner-123',
				})

				const result = validateCategorizedEvent(event)
				expect(result.isValid).toBe(true)
				expect(result.warnings).toContain('FHIR resource information incomplete')
			})

			it('should warn about missing bundle details', () => {
				const event = createFHIRAuditEvent('fhir.bundle.process', {
					status: 'success',
					principalId: 'system-service',
				})

				const result = validateCategorizedEvent(event)
				expect(result.isValid).toBe(true)
				expect(result.warnings).toContain('Bundle type not specified for bundle processing event')
				expect(result.warnings).toContain('Bundle size not specified for bundle processing event')
			})

			it('should warn about missing patient ID for patient operations', () => {
				const event = createFHIRAuditEvent('fhir.patient.read', {
					status: 'success',
					principalId: 'practitioner-123',
				})

				const result = validateCategorizedEvent(event)
				expect(result.isValid).toBe(true)
				expect(result.warnings).toContain(
					'Patient ID not specified for patient-related FHIR operation'
				)
			})

			it('should warn about missing practitioner ID for practitioner operations', () => {
				const event = createFHIRAuditEvent('fhir.practitioner.read', {
					status: 'success',
					principalId: 'admin-user',
				})

				const result = validateCategorizedEvent(event)
				expect(result.isValid).toBe(true)
				expect(result.warnings).toContain(
					'Practitioner ID not specified for practitioner-related FHIR operation'
				)
			})

			it('should warn about non-PHI classification for FHIR events', () => {
				const event = createFHIRAuditEvent('fhir.patient.read', {
					status: 'success',
					principalId: 'practitioner-123',
					dataClassification: 'INTERNAL',
				})

				const result = validateCategorizedEvent(event)
				expect(result.isValid).toBe(true)
				expect(result.warnings).toContain('FHIR events should typically be classified as PHI')
			})

			it('should warn about missing operation outcome for failed operations', () => {
				const event = createFHIRAuditEvent('fhir.patient.read', {
					status: 'failure',
					principalId: 'practitioner-123',
				})

				const result = validateCategorizedEvent(event)
				expect(result.isValid).toBe(true)
				expect(result.warnings).toContain(
					'Operation outcome not provided for failed FHIR operation'
				)
			})
		})

		describe('Category Mismatch Validation', () => {
			it('should error on action category mismatch', () => {
				// Create a malformed event with mismatched category and action
				const event = {
					category: 'system',
					action: 'auth.login.success',
					status: 'success',
					timestamp: '2024-01-15T10:30:00.000Z',
				} as any

				const result = validateCategorizedEvent(event)
				expect(result.isValid).toBe(false)
				expect(result.errors).toContain(
					"Action category mismatch: action 'auth.login.success' does not match declared category 'system'"
				)
			})

			it('should error on unknown action', () => {
				const event = {
					category: 'system',
					action: 'unknown.action',
					status: 'success',
					timestamp: '2024-01-15T10:30:00.000Z',
				} as any

				const result = validateCategorizedEvent(event)
				expect(result.isValid).toBe(false)
				expect(result.errors).toContain('Unknown audit action: unknown.action')
			})
		})
	})

	describe('getRecommendedFields', () => {
		it('should return recommended fields for system category', () => {
			const fields = getRecommendedFields('system')
			expect(fields).toContain('systemComponent')
			expect(fields).toContain('configurationChanges')
			expect(fields).toContain('maintenanceDetails')
			expect(fields).toContain('backupDetails')
		})

		it('should return recommended fields for auth category', () => {
			const fields = getRecommendedFields('auth')
			expect(fields).toContain('authMethod')
			expect(fields).toContain('failureReason')
			expect(fields).toContain('sessionContext')
			expect(fields).toContain('mfaDetails')
		})

		it('should return recommended fields for data category', () => {
			const fields = getRecommendedFields('data')
			expect(fields).toContain('dataType')
			expect(fields).toContain('recordCount')
			expect(fields).toContain('targetResourceType')
			expect(fields).toContain('targetResourceId')
			expect(fields).toContain('exportFormat')
		})

		it('should return recommended fields for fhir category', () => {
			const fields = getRecommendedFields('fhir')
			expect(fields).toContain('fhirResourceType')
			expect(fields).toContain('fhirResourceId')
			expect(fields).toContain('patientId')
			expect(fields).toContain('practitionerId')
			expect(fields).toContain('operationOutcome')
		})
	})

	describe('getRequiredFields', () => {
		it('should return base required fields for system category', () => {
			const fields = getRequiredFields('system')
			expect(fields).toContain('timestamp')
			expect(fields).toContain('action')
			expect(fields).toContain('status')
		})

		it('should return required fields including principalId for auth category', () => {
			const fields = getRequiredFields('auth')
			expect(fields).toContain('timestamp')
			expect(fields).toContain('action')
			expect(fields).toContain('status')
			expect(fields).toContain('principalId')
		})

		it('should return required fields including principalId for data category', () => {
			const fields = getRequiredFields('data')
			expect(fields).toContain('timestamp')
			expect(fields).toContain('action')
			expect(fields).toContain('status')
			expect(fields).toContain('principalId')
		})

		it('should return required fields including principalId for fhir category', () => {
			const fields = getRequiredFields('fhir')
			expect(fields).toContain('timestamp')
			expect(fields).toContain('action')
			expect(fields).toContain('status')
			expect(fields).toContain('principalId')
		})
	})
})
