import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AuditSDK } from '../sdk.js'

import type { AuditSDKConfig } from '../types.js'

// Mock the dependencies
vi.mock('@repo/audit', () => ({
	Audit: vi.fn().mockImplementation(() => ({
		log: vi.fn().mockResolvedValue(undefined),
		logWithGuaranteedDelivery: vi.fn().mockResolvedValue(undefined),
		closeConnection: vi.fn().mockResolvedValue(undefined),
		generateEventHash: vi.fn().mockReturnValue('mock-hash'),
		verifyEventHash: vi.fn().mockReturnValue(true),
		generateEventSignature: vi.fn().mockReturnValue('mock-signature'),
		verifyEventSignature: vi.fn().mockReturnValue(true),
	})),
}))

vi.mock('@repo/audit-db', () => ({
	AuditDb: vi.fn().mockImplementation(() => ({
		getDrizzleInstance: vi.fn().mockReturnValue({}),
		checkAuditDbConnection: vi.fn().mockResolvedValue(true),
	})),
}))

describe('AuditSDK', () => {
	let auditSDK: AuditSDK
	let config: AuditSDKConfig

	beforeEach(() => {
		config = {
			queueName: 'test-audit-queue',
			redis: {
				url: 'redis://localhost:6379',
			},
			databaseUrl: 'postgresql://test:test@localhost:5432/test_audit',
			defaults: {
				dataClassification: 'INTERNAL',
				generateHash: true,
			},
			compliance: {
				hipaa: {
					enabled: true,
					retentionYears: 6,
				},
			},
		}
		auditSDK = new AuditSDK(config)
	})

	afterEach(async () => {
		await auditSDK.close()
	})

	describe('Basic Logging', () => {
		it('should log a simple audit event', async () => {
			const eventDetails = {
				principalId: 'user-123',
				action: 'user.login',
				status: 'success' as const,
				outcomeDescription: 'User logged in successfully',
			}

			await expect(auditSDK.log(eventDetails)).resolves.not.toThrow()
		})

		it('should apply default values from config', async () => {
			const eventDetails = {
				principalId: 'user-123',
				action: 'data.read',
				status: 'success' as const,
			}

			await auditSDK.log(eventDetails)

			// Verify that the underlying audit service was called
			expect(auditSDK['audit'].log).toHaveBeenCalled()
		})

		it('should use presets when specified', async () => {
			const eventDetails = {
				principalId: 'user-123',
				status: 'success' as const,
			}

			await auditSDK.log(eventDetails, { preset: 'authentication' })

			expect(auditSDK['audit'].log).toHaveBeenCalled()
		})
	})

	describe('FHIR Logging', () => {
		it('should log FHIR events with proper classification', async () => {
			const fhirDetails = {
				principalId: 'practitioner-456',
				action: 'read',
				resourceType: 'Patient',
				resourceId: 'patient-789',
				status: 'success' as const,
				outcomeDescription: 'Accessed patient record for treatment',
			}

			await expect(auditSDK.logFHIR(fhirDetails)).resolves.not.toThrow()
		})

		it('should include FHIR context when provided', async () => {
			const fhirDetails = {
				principalId: 'practitioner-456',
				action: 'read',
				resourceType: 'Patient',
				resourceId: 'patient-789',
				status: 'success' as const,
				fhirContext: {
					version: 'R4',
					interaction: 'read',
					compartment: 'Patient/patient-789',
				},
			}

			await auditSDK.logFHIR(fhirDetails)

			expect(auditSDK['audit'].log).toHaveBeenCalledWith(
				expect.objectContaining({
					fhirContext: fhirDetails.fhirContext,
					dataClassification: 'PHI',
				}),
				expect.objectContaining({
					compliance: ['hipaa'],
				})
			)
		})
	})

	describe('Authentication Logging', () => {
		it('should log successful login', async () => {
			const authDetails = {
				principalId: 'user-123',
				action: 'login' as const,
				status: 'success' as const,
				sessionContext: {
					sessionId: 'sess-123',
					ipAddress: '192.168.1.100',
					userAgent: 'Mozilla/5.0...',
				},
			}

			await expect(auditSDK.logAuth(authDetails)).resolves.not.toThrow()
		})

		it('should log failed login with reason', async () => {
			const authDetails = {
				principalId: 'user-123',
				action: 'login' as const,
				status: 'failure' as const,
				reason: 'Invalid credentials',
			}

			await auditSDK.logAuth(authDetails)

			expect(auditSDK['audit'].log).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'auth.login.failure',
					outcomeDescription: 'Invalid credentials',
				}),
				expect.objectContaining({
					preset: 'authentication',
				})
			)
		})
	})

	describe('System Logging', () => {
		it('should log system events', async () => {
			const systemDetails = {
				action: 'backup.created',
				status: 'success' as const,
				component: 'backup-service',
				outcomeDescription: 'Daily backup completed successfully',
			}

			await expect(auditSDK.logSystem(systemDetails)).resolves.not.toThrow()
		})
	})

	describe('Data Operation Logging', () => {
		it('should log data operations with changes', async () => {
			const dataDetails = {
				principalId: 'user-123',
				action: 'update' as const,
				resourceType: 'Patient',
				resourceId: 'patient-456',
				status: 'success' as const,
				dataClassification: 'PHI' as const,
				changes: {
					field: 'address',
					oldValue: '123 Old St',
					newValue: '456 New Ave',
				},
			}

			await expect(auditSDK.logData(dataDetails)).resolves.not.toThrow()
		})
	})

	describe('Critical Event Logging', () => {
		it('should log critical events with guaranteed delivery', async () => {
			const criticalEvent = {
				principalId: 'security-system',
				action: 'security.breach.detected',
				status: 'failure' as const,
				outcomeDescription: 'Unauthorized access attempt detected',
				dataClassification: 'CONFIDENTIAL' as const,
			}

			await expect(
				auditSDK.logCritical(criticalEvent, {
					priority: 1,
					compliance: ['hipaa'],
				})
			).resolves.not.toThrow()
		})
	})

	describe('Health Monitoring', () => {
		it('should return health status', async () => {
			const health = await auditSDK.getHealth()

			expect(health).toHaveProperty('redis')
			expect(health).toHaveProperty('database')
			expect(health).toHaveProperty('timestamp')
			expect(health.redis).toBe('connected')
			expect(health.database).toBe('connected')
		})
	})

	describe('Error Handling', () => {
		it('should handle validation errors gracefully', async () => {
			const invalidEvent = {
				// Missing required fields
				status: 'success' as const,
			}

			// Mock validation error
			auditSDK['audit'].log = vi
				.fn()
				.mockRejectedValue(new Error('Validation Error: Action is required'))

			await expect(auditSDK.log(invalidEvent as any)).rejects.toThrow('Validation Error')
		})

		it('should handle compliance validation errors', async () => {
			const event = {
				principalId: 'user-123',
				action: 'fhir.patient.read',
				targetResourceType: 'Patient',
				targetResourceId: 'patient-456',
				status: 'success' as const,
				dataClassification: 'PHI' as const,
				// Missing required sessionContext for HIPAA
			}

			await expect(auditSDK.log(event, { compliance: ['hipaa'] })).rejects.toThrow()
		})
	})

	describe('Configuration', () => {
		it('should initialize without database when not provided', () => {
			const configWithoutDb = {
				queueName: 'test-queue',
				redis: { url: 'redis://localhost:6379' },
			}

			const sdk = new AuditSDK(configWithoutDb)
			expect(sdk['auditDb']).toBeUndefined()
		})

		it('should apply crypto configuration', () => {
			const configWithCrypto = {
				...config,
				crypto: {
					secretKey: 'test-secret',
					enableSignatures: true,
				},
			}

			const sdk = new AuditSDK(configWithCrypto)
			expect(sdk).toBeDefined()
		})
	})
})
