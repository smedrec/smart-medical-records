/**
 * Unit tests for audit event types and factory functions
 */

import { beforeEach, describe, expect, it } from 'vitest'

import {
	createAuditEvent,
	createAuthAuditEvent,
	createDataAuditEvent,
	createFHIRAuditEvent,
	createSystemAuditEvent,
	DEFAULT_FACTORY_CONFIG,
} from '../event/event-types.js'

import type {
	AuthAuditEvent,
	DataAuditEvent,
	EventFactoryConfig,
	FHIRAuditEvent,
	SystemAuditEvent,
} from '../event/event-types.js'
import type { AuditEventStatus } from '../types.js'

describe('Event Factory Functions', () => {
	let mockTimestamp: string
	let originalDateNow: typeof Date.now

	beforeEach(() => {
		mockTimestamp = '2024-01-15T10:30:00.000Z'
		originalDateNow = Date.now
		Date.now = () => new Date(mockTimestamp).getTime()
		// Mock Date constructor to return consistent timestamp
		global.Date = class extends Date {
			constructor(...args: any[]) {
				if (args.length === 0) {
					super(mockTimestamp)
				} else {
					super(...args)
				}
			}
		} as any
	})

	afterEach(() => {
		Date.now = originalDateNow
	})

	describe('createSystemAuditEvent', () => {
		it('should create a basic system audit event', () => {
			const event = createSystemAuditEvent('system.startup', {
				status: 'success',
				principalId: 'system-service',
				organizationId: 'org-123',
			})

			expect(event).toMatchObject({
				category: 'system',
				action: 'system.startup',
				status: 'success',
				principalId: 'system-service',
				organizationId: 'org-123',
				timestamp: mockTimestamp,
				eventVersion: '1.0',
				hashAlgorithm: 'SHA-256',
				dataClassification: 'INTERNAL',
				retentionPolicy: 'standard',
			})
		})

		it('should create system event with configuration changes', () => {
			const configChanges = {
				'database.maxConnections': { old: 10, new: 20 },
				'logging.level': { old: 'INFO', new: 'DEBUG' },
			}

			const event = createSystemAuditEvent('system.configuration.change', {
				status: 'success',
				principalId: 'admin-user',
				systemComponent: 'database',
				configurationChanges: configChanges,
			})

			expect(event.configurationChanges).toEqual(configChanges)
			expect(event.systemComponent).toBe('database')
		})

		it('should create system event with maintenance details', () => {
			const maintenanceDetails = {
				type: 'scheduled' as const,
				duration: 3600,
				affectedServices: ['api', 'database'],
			}

			const event = createSystemAuditEvent('system.maintenance.started', {
				status: 'success',
				principalId: 'maintenance-system',
				maintenanceDetails,
			})

			expect(event.maintenanceDetails).toEqual(maintenanceDetails)
		})

		it('should create system event with backup details', () => {
			const backupDetails = {
				type: 'full' as const,
				size: 1024000,
				location: 's3://backups/2024-01-15',
			}

			const event = createSystemAuditEvent('system.backup.created', {
				status: 'success',
				principalId: 'backup-service',
				backupDetails,
			})

			expect(event.backupDetails).toEqual(backupDetails)
		})

		it('should generate correlation ID when configured', () => {
			const config: EventFactoryConfig = {
				...DEFAULT_FACTORY_CONFIG,
				generateCorrelationId: true,
			}

			const event = createSystemAuditEvent(
				'system.startup',
				{
					status: 'success',
				},
				config
			)

			expect(event.correlationId).toBeDefined()
			expect(event.correlationId).toMatch(/^corr-\d+-[a-z0-9]+$/)
		})

		it('should use custom configuration', () => {
			const config: EventFactoryConfig = {
				generateTimestamp: false,
				defaultDataClassification: 'CONFIDENTIAL',
				defaultRetentionPolicy: 'extended',
				defaultEventVersion: '2.0',
			}

			const event = createSystemAuditEvent(
				'system.startup',
				{
					status: 'success',
					timestamp: '2024-01-01T00:00:00.000Z',
				},
				config
			)

			expect(event.timestamp).toBe('2024-01-01T00:00:00.000Z')
			expect(event.dataClassification).toBe('CONFIDENTIAL')
			expect(event.retentionPolicy).toBe('extended')
			expect(event.eventVersion).toBe('2.0')
		})
	})

	describe('createAuthAuditEvent', () => {
		it('should create a basic auth audit event', () => {
			const event = createAuthAuditEvent('auth.login.success', {
				status: 'success',
				principalId: 'user-123',
				organizationId: 'org-456',
			})

			expect(event).toMatchObject({
				category: 'auth',
				action: 'auth.login.success',
				status: 'success',
				principalId: 'user-123',
				organizationId: 'org-456',
				timestamp: mockTimestamp,
				eventVersion: '1.0',
				hashAlgorithm: 'SHA-256',
				dataClassification: 'INTERNAL',
				retentionPolicy: 'standard',
			})
		})

		it('should create auth event with authentication method', () => {
			const event = createAuthAuditEvent('auth.login.attempt', {
				status: 'attempt',
				principalId: 'user-123',
				authMethod: 'mfa',
			})

			expect(event.authMethod).toBe('mfa')
		})

		it('should create auth event with failure reason', () => {
			const event = createAuthAuditEvent('auth.login.failure', {
				status: 'failure',
				principalId: 'user-123',
				failureReason: 'Invalid credentials',
			})

			expect(event.failureReason).toBe('Invalid credentials')
		})

		it('should create auth event with MFA details', () => {
			const mfaDetails = {
				method: 'totp' as const,
				verified: true,
			}

			const event = createAuthAuditEvent('auth.mfa.enabled', {
				status: 'success',
				principalId: 'user-123',
				mfaDetails,
			})

			expect(event.mfaDetails).toEqual(mfaDetails)
		})

		it('should create auth event with session duration', () => {
			const event = createAuthAuditEvent('auth.logout', {
				status: 'success',
				principalId: 'user-123',
				sessionDuration: 3600,
			})

			expect(event.sessionDuration).toBe(3600)
		})

		it('should create auth event with password policy details', () => {
			const passwordPolicy = {
				complexity: true,
				length: true,
				history: false,
			}

			const event = createAuthAuditEvent('auth.password.change', {
				status: 'success',
				principalId: 'user-123',
				passwordPolicy,
			})

			expect(event.passwordPolicy).toEqual(passwordPolicy)
		})
	})

	describe('createDataAuditEvent', () => {
		it('should create a basic data audit event', () => {
			const event = createDataAuditEvent('data.read', {
				status: 'success',
				principalId: 'user-123',
				organizationId: 'org-456',
			})

			expect(event).toMatchObject({
				category: 'data',
				action: 'data.read',
				status: 'success',
				principalId: 'user-123',
				organizationId: 'org-456',
				timestamp: mockTimestamp,
				eventVersion: '1.0',
				hashAlgorithm: 'SHA-256',
				dataClassification: 'INTERNAL',
				retentionPolicy: 'standard',
			})
		})

		it('should create data event with data type and record count', () => {
			const event = createDataAuditEvent('data.export', {
				status: 'success',
				principalId: 'user-123',
				dataType: 'Patient',
				recordCount: 150,
			})

			expect(event.dataType).toBe('Patient')
			expect(event.recordCount).toBe(150)
		})

		it('should create data event with export format', () => {
			const event = createDataAuditEvent('data.export', {
				status: 'success',
				principalId: 'user-123',
				exportFormat: 'csv',
			})

			expect(event.exportFormat).toBe('csv')
		})

		it('should create data event with share recipient', () => {
			const event = createDataAuditEvent('data.share', {
				status: 'success',
				principalId: 'user-123',
				shareRecipient: 'external-partner',
			})

			expect(event.shareRecipient).toBe('external-partner')
		})

		it('should create data event with anonymization method', () => {
			const event = createDataAuditEvent('data.anonymize', {
				status: 'success',
				principalId: 'user-123',
				anonymizationMethod: 'pseudonymization',
			})

			expect(event.anonymizationMethod).toBe('pseudonymization')
		})

		it('should create data event with query details', () => {
			const queryDetails = {
				filters: { status: 'active', age: { gte: 18 } },
				sortBy: 'lastName',
				limit: 100,
				offset: 0,
			}

			const event = createDataAuditEvent('data.read', {
				status: 'success',
				principalId: 'user-123',
				queryDetails,
			})

			expect(event.queryDetails).toEqual(queryDetails)
		})

		it('should create data event with data size', () => {
			const event = createDataAuditEvent('data.export', {
				status: 'success',
				principalId: 'user-123',
				dataSize: 2048000,
			})

			expect(event.dataSize).toBe(2048000)
		})
	})

	describe('createFHIRAuditEvent', () => {
		it('should create a basic FHIR audit event', () => {
			const event = createFHIRAuditEvent('fhir.patient.read', {
				status: 'success',
				principalId: 'practitioner-123',
				organizationId: 'org-456',
			})

			expect(event).toMatchObject({
				category: 'fhir',
				action: 'fhir.patient.read',
				status: 'success',
				principalId: 'practitioner-123',
				organizationId: 'org-456',
				timestamp: mockTimestamp,
				eventVersion: '1.0',
				hashAlgorithm: 'SHA-256',
				dataClassification: 'PHI', // Default to PHI for FHIR events
				retentionPolicy: 'standard',
			})
		})

		it('should create FHIR event with resource details', () => {
			const event = createFHIRAuditEvent('fhir.patient.read', {
				status: 'success',
				principalId: 'practitioner-123',
				fhirResourceType: 'Patient',
				fhirResourceId: 'patient-456',
				patientId: 'patient-456',
			})

			expect(event.fhirResourceType).toBe('Patient')
			expect(event.fhirResourceId).toBe('patient-456')
			expect(event.patientId).toBe('patient-456')
		})

		it('should create FHIR event with bundle details', () => {
			const event = createFHIRAuditEvent('fhir.bundle.process', {
				status: 'success',
				principalId: 'system-service',
				bundleType: 'transaction',
				bundleSize: 25,
			})

			expect(event.bundleType).toBe('transaction')
			expect(event.bundleSize).toBe(25)
		})

		it('should create FHIR event with operation outcome', () => {
			const operationOutcome = {
				severity: 'error' as const,
				code: 'not-found',
				details: 'Patient resource not found',
			}

			const event = createFHIRAuditEvent('fhir.patient.read', {
				status: 'failure',
				principalId: 'practitioner-123',
				operationOutcome,
			})

			expect(event.operationOutcome).toEqual(operationOutcome)
		})

		it('should create FHIR event with FHIR version', () => {
			const event = createFHIRAuditEvent('fhir.patient.create', {
				status: 'success',
				principalId: 'practitioner-123',
				fhirVersion: 'R4',
			})

			expect(event.fhirVersion).toBe('R4')
		})

		it('should create FHIR event with practitioner ID', () => {
			const event = createFHIRAuditEvent('fhir.practitioner.read', {
				status: 'success',
				principalId: 'admin-user',
				practitionerId: 'practitioner-789',
			})

			expect(event.practitionerId).toBe('practitioner-789')
		})
	})

	describe('createAuditEvent (Generic Factory)', () => {
		it('should route system actions to system factory', () => {
			const event = createAuditEvent('system.startup', {
				status: 'success',
				principalId: 'system-service',
			})

			expect(event.category).toBe('system')
			expect(event.action).toBe('system.startup')
		})

		it('should route auth actions to auth factory', () => {
			const event = createAuditEvent('auth.login.success', {
				status: 'success',
				principalId: 'user-123',
			})

			expect(event.category).toBe('auth')
			expect(event.action).toBe('auth.login.success')
		})

		it('should route data actions to data factory', () => {
			const event = createAuditEvent('data.read', {
				status: 'success',
				principalId: 'user-123',
			})

			expect(event.category).toBe('data')
			expect(event.action).toBe('data.read')
		})

		it('should route FHIR actions to FHIR factory', () => {
			const event = createAuditEvent('fhir.patient.read', {
				status: 'success',
				principalId: 'practitioner-123',
			})

			expect(event.category).toBe('fhir')
			expect(event.action).toBe('fhir.patient.read')
		})

		it('should throw error for unknown action', () => {
			expect(() => {
				createAuditEvent('unknown.action' as any, {
					status: 'success',
					principalId: 'user-123',
				})
			}).toThrow('Unknown audit action type: unknown.action')
		})

		it('should pass configuration to specific factories', () => {
			const config: EventFactoryConfig = {
				generateCorrelationId: true,
				defaultDataClassification: 'CONFIDENTIAL',
			}

			const event = createAuditEvent(
				'system.startup',
				{
					status: 'success',
					principalId: 'system-service',
				},
				config
			)

			expect(event.correlationId).toBeDefined()
			expect(event.dataClassification).toBe('CONFIDENTIAL')
		})
	})

	describe('Event Interface Validation', () => {
		it('should create SystemAuditEvent with correct type', () => {
			const event: SystemAuditEvent = createSystemAuditEvent('system.startup', {
				status: 'success',
				systemComponent: 'api-server',
			})

			expect(event.category).toBe('system')
			expect(event.systemComponent).toBe('api-server')
		})

		it('should create AuthAuditEvent with correct type', () => {
			const event: AuthAuditEvent = createAuthAuditEvent('auth.login.success', {
				status: 'success',
				authMethod: 'password',
			})

			expect(event.category).toBe('auth')
			expect(event.authMethod).toBe('password')
		})

		it('should create DataAuditEvent with correct type', () => {
			const event: DataAuditEvent = createDataAuditEvent('data.read', {
				status: 'success',
				dataType: 'Patient',
			})

			expect(event.category).toBe('data')
			expect(event.dataType).toBe('Patient')
		})

		it('should create FHIRAuditEvent with correct type', () => {
			const event: FHIRAuditEvent = createFHIRAuditEvent('fhir.patient.read', {
				status: 'success',
				fhirResourceType: 'Patient',
			})

			expect(event.category).toBe('fhir')
			expect(event.fhirResourceType).toBe('Patient')
		})
	})

	describe('Default Factory Configuration', () => {
		it('should have correct default values', () => {
			expect(DEFAULT_FACTORY_CONFIG).toEqual({
				generateTimestamp: true,
				generateCorrelationId: false,
				defaultDataClassification: 'INTERNAL',
				defaultRetentionPolicy: 'standard',
				defaultEventVersion: '1.0',
			})
		})
	})

	describe('Correlation ID Generation', () => {
		it('should generate unique correlation IDs', () => {
			const config: EventFactoryConfig = {
				...DEFAULT_FACTORY_CONFIG,
				generateCorrelationId: true,
			}

			const event1 = createSystemAuditEvent('system.startup', { status: 'success' }, config)
			const event2 = createSystemAuditEvent('system.startup', { status: 'success' }, config)

			expect(event1.correlationId).toBeDefined()
			expect(event2.correlationId).toBeDefined()
			expect(event1.correlationId).not.toBe(event2.correlationId)
		})

		it('should not override existing correlation ID', () => {
			const config: EventFactoryConfig = {
				...DEFAULT_FACTORY_CONFIG,
				generateCorrelationId: true,
			}

			const existingCorrelationId = 'existing-corr-id'
			const event = createSystemAuditEvent(
				'system.startup',
				{
					status: 'success',
					correlationId: existingCorrelationId,
				},
				config
			)

			expect(event.correlationId).toBe(existingCorrelationId)
		})
	})
})
