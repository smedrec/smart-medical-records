/**
 * Integration Tests for SMEDREC Audit SDK
 *
 * These tests verify the SDK works correctly with real Redis and PostgreSQL
 * instances. They should be run in a test environment with proper setup.
 */

import Redis from 'ioredis'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { AuditSDK } from '../sdk.js'

import type { AuditSDKConfig } from '../types.js'

// Test configuration - uses test databases
const testConfig: AuditSDKConfig = {
	queueName: 'test-audit-integration',
	redis: {
		url: process.env.TEST_REDIS_URL || 'redis://localhost:6380', // Different port for tests
		options: {
			db: 1, // Use different database for tests
		},
	},
	databaseUrl:
		process.env.TEST_AUDIT_DB_URL || 'postgresql://test:test@localhost:5433/test_audit_db',
	defaults: {
		dataClassification: 'INTERNAL',
		generateHash: true,
		generateSignature: true,
	},
	crypto: {
		secretKey: 'test-secret-key-for-integration-tests-only',
		enableSignatures: true,
	},
	compliance: {
		hipaa: {
			enabled: true,
			retentionYears: 6,
		},
		gdpr: {
			enabled: true,
			defaultLegalBasis: 'legitimate_interest',
		},
	},
}

describe('Audit SDK Integration Tests', () => {
	let auditSDK: AuditSDK
	let testRedis: Redis

	beforeAll(async () => {
		// Skip integration tests if test environment is not available
		if (!process.env.RUN_INTEGRATION_TESTS) {
			console.log('Skipping integration tests - set RUN_INTEGRATION_TESTS=true to run')
			return
		}

		// Initialize test Redis client for verification
		testRedis = new Redis(testConfig.redis!.url!, testConfig.redis!.options)

		// Wait for Redis connection
		await new Promise((resolve, reject) => {
			testRedis.on('ready', resolve)
			testRedis.on('error', reject)
			setTimeout(() => reject(new Error('Redis connection timeout')), 5000)
		})

		// Initialize audit SDK
		auditSDK = new AuditSDK(testConfig)

		// Verify audit system health
		const health = await auditSDK.getHealth()
		expect(health.redis).toBe('connected')
		expect(health.database).toBe('connected')
	})

	afterAll(async () => {
		if (!process.env.RUN_INTEGRATION_TESTS) return

		if (auditSDK) {
			await auditSDK.close()
		}
		if (testRedis) {
			await testRedis.quit()
		}
	})

	beforeEach(async () => {
		if (!process.env.RUN_INTEGRATION_TESTS) return

		// Clean up test queue before each test
		await testRedis.del(`bull:${testConfig.queueName}:waiting`)
		await testRedis.del(`bull:${testConfig.queueName}:active`)
		await testRedis.del(`bull:${testConfig.queueName}:completed`)
		await testRedis.del(`bull:${testConfig.queueName}:failed`)
	})

	describe('Basic Event Logging', () => {
		it('should successfully log and queue audit events', async () => {
			if (!process.env.RUN_INTEGRATION_TESTS) return

			const eventDetails = {
				principalId: 'integration-test-user',
				action: 'integration.test.basic',
				status: 'success' as const,
				outcomeDescription: 'Integration test basic event logging',
			}

			await auditSDK.log(eventDetails)

			// Verify event was queued
			const queueLength = await testRedis.llen(`bull:${testConfig.queueName}:waiting`)
			expect(queueLength).toBeGreaterThan(0)
		})

		it('should generate cryptographic hash and signature', async () => {
			if (!process.env.RUN_INTEGRATION_TESTS) return

			const eventDetails = {
				principalId: 'integration-test-user',
				action: 'integration.test.crypto',
				status: 'success' as const,
				outcomeDescription: 'Integration test cryptographic features',
			}

			await auditSDK.log(eventDetails, {
				generateHash: true,
				generateSignature: true,
			})

			// Get the queued job to verify hash and signature were added
			const jobs = await testRedis.lrange(`bull:${testConfig.queueName}:waiting`, 0, -1)
			expect(jobs.length).toBeGreaterThan(0)

			const jobData = JSON.parse(jobs[0])
			const eventData = jobData.data

			expect(eventData.hash).toBeDefined()
			expect(eventData.signature).toBeDefined()
			expect(eventData.hashAlgorithm).toBe('SHA-256')
		})
	})

	describe('FHIR Event Logging', () => {
		it('should log FHIR events with proper classification', async () => {
			if (!process.env.RUN_INTEGRATION_TESTS) return

			await auditSDK.logFHIR({
				principalId: 'integration-practitioner',
				organizationId: 'integration-hospital',
				action: 'read',
				resourceType: 'Patient',
				resourceId: 'integration-patient-123',
				status: 'success',
				outcomeDescription: 'Integration test FHIR patient access',
				sessionContext: {
					sessionId: 'integration-session',
					ipAddress: '127.0.0.1',
					userAgent: 'Integration-Test/1.0',
				},
			})

			// Verify event was queued with PHI classification
			const jobs = await testRedis.lrange(`bull:${testConfig.queueName}:waiting`, 0, -1)
			const jobData = JSON.parse(jobs[0])
			const eventData = jobData.data

			expect(eventData.dataClassification).toBe('PHI')
			expect(eventData.action).toBe('fhir.patient.read')
			expect(eventData.targetResourceType).toBe('Patient')
		})
	})

	describe('Authentication Event Logging', () => {
		it('should log authentication events with session context', async () => {
			if (!process.env.RUN_INTEGRATION_TESTS) return

			await auditSDK.logAuth({
				principalId: 'integration-user-auth',
				action: 'login',
				status: 'success',
				sessionContext: {
					sessionId: 'integration-auth-session',
					ipAddress: '127.0.0.1',
					userAgent: 'Integration-Test/1.0',
				},
			})

			const jobs = await testRedis.lrange(`bull:${testConfig.queueName}:waiting`, 0, -1)
			const jobData = JSON.parse(jobs[0])
			const eventData = jobData.data

			expect(eventData.action).toBe('auth.login.success')
			expect(eventData.sessionContext).toBeDefined()
			expect(eventData.sessionContext.sessionId).toBe('integration-auth-session')
		})
	})

	describe('Critical Event Logging', () => {
		it('should log critical events with guaranteed delivery', async () => {
			if (!process.env.RUN_INTEGRATION_TESTS) return

			await auditSDK.logCritical(
				{
					principalId: 'integration-security-system',
					action: 'security.test.critical',
					status: 'failure',
					outcomeDescription: 'Integration test critical security event',
					dataClassification: 'CONFIDENTIAL',
				},
				{
					priority: 1,
					compliance: ['hipaa'],
				}
			)

			// Check both regular and reliable queues
			const regularQueueLength = await testRedis.llen(`bull:${testConfig.queueName}:waiting`)
			const reliableQueueLength = await testRedis.llen(
				`bull:${testConfig.queueName}-reliable:waiting`
			)

			expect(regularQueueLength + reliableQueueLength).toBeGreaterThan(0)
		})
	})

	describe('Compliance Validation', () => {
		it('should validate HIPAA compliance requirements', async () => {
			if (!process.env.RUN_INTEGRATION_TESTS) return

			const validHIPAAEvent = {
				principalId: 'integration-practitioner',
				action: 'fhir.patient.read',
				targetResourceType: 'Patient',
				targetResourceId: 'integration-patient',
				status: 'success' as const,
				dataClassification: 'PHI' as const,
				sessionContext: {
					sessionId: 'integration-session',
					ipAddress: '127.0.0.1',
					userAgent: 'Integration-Test/1.0',
				},
			}

			await expect(auditSDK.log(validHIPAAEvent, { compliance: ['hipaa'] })).resolves.not.toThrow()
		})

		it('should reject non-compliant HIPAA events', async () => {
			if (!process.env.RUN_INTEGRATION_TESTS) return

			const invalidHIPAAEvent = {
				principalId: 'integration-practitioner',
				action: 'fhir.patient.read',
				targetResourceType: 'Patient',
				targetResourceId: 'integration-patient',
				status: 'success' as const,
				dataClassification: 'PHI' as const,
				// Missing required sessionContext
			}

			await expect(auditSDK.log(invalidHIPAAEvent, { compliance: ['hipaa'] })).rejects.toThrow(
				'HIPAA Compliance Error'
			)
		})
	})

	describe('System Health Monitoring', () => {
		it('should report healthy system status', async () => {
			if (!process.env.RUN_INTEGRATION_TESTS) return

			const health = await auditSDK.getHealth()

			expect(health.redis).toBe('connected')
			expect(health.database).toBe('connected')
			expect(health.timestamp).toBeDefined()
			expect(new Date(health.timestamp)).toBeInstanceOf(Date)
		})
	})

	describe('Error Handling', () => {
		it('should handle Redis connection errors gracefully', async () => {
			if (!process.env.RUN_INTEGRATION_TESTS) return

			// Create SDK with invalid Redis URL
			const invalidConfig = {
				...testConfig,
				redis: { url: 'redis://invalid-host:6379' },
			}

			const invalidSDK = new AuditSDK(invalidConfig)

			// Should not throw immediately, but log operation should fail
			await expect(
				invalidSDK.log({
					principalId: 'test',
					action: 'test',
					status: 'success',
				})
			).rejects.toThrow()

			await invalidSDK.close()
		})

		it('should handle validation errors appropriately', async () => {
			if (!process.env.RUN_INTEGRATION_TESTS) return

			const invalidEvent = {
				// Missing required action field
				principalId: 'test-user',
				status: 'success' as const,
			}

			await expect(auditSDK.log(invalidEvent as any)).rejects.toThrow('Validation Error')
		})
	})

	describe('Performance and Scalability', () => {
		it('should handle multiple concurrent events', async () => {
			if (!process.env.RUN_INTEGRATION_TESTS) return

			const eventPromises = Array.from({ length: 10 }, (_, i) =>
				auditSDK.log({
					principalId: `concurrent-user-${i}`,
					action: 'integration.test.concurrent',
					status: 'success',
					outcomeDescription: `Concurrent test event ${i}`,
				})
			)

			await expect(Promise.all(eventPromises)).resolves.not.toThrow()

			// Verify all events were queued
			const queueLength = await testRedis.llen(`bull:${testConfig.queueName}:waiting`)
			expect(queueLength).toBe(10)
		})

		it('should handle large event payloads', async () => {
			if (!process.env.RUN_INTEGRATION_TESTS) return

			const largePayload = {
				principalId: 'integration-large-payload-user',
				action: 'integration.test.large_payload',
				status: 'success' as const,
				outcomeDescription: 'Integration test with large payload',
				largeData: {
					// Create a reasonably large object
					items: Array.from({ length: 100 }, (_, i) => ({
						id: `item-${i}`,
						name: `Test Item ${i}`,
						description: 'A'.repeat(100), // 100 character description
						metadata: {
							created: new Date().toISOString(),
							tags: [`tag-${i}`, `category-${i % 5}`],
						},
					})),
				},
			}

			await expect(auditSDK.log(largePayload)).resolves.not.toThrow()
		})
	})

	describe('Data Integrity', () => {
		it('should maintain event integrity through the pipeline', async () => {
			if (!process.env.RUN_INTEGRATION_TESTS) return

			const originalEvent = {
				principalId: 'integrity-test-user',
				action: 'integration.test.integrity',
				status: 'success' as const,
				outcomeDescription: 'Integration test for data integrity',
				testData: {
					value: 'original-value',
					timestamp: new Date().toISOString(),
				},
			}

			await auditSDK.log(originalEvent, {
				generateHash: true,
				generateSignature: true,
			})

			// Retrieve the queued event
			const jobs = await testRedis.lrange(`bull:${testConfig.queueName}:waiting`, 0, -1)
			const jobData = JSON.parse(jobs[0])
			const queuedEvent = jobData.data

			// Verify the event data integrity
			expect(queuedEvent.principalId).toBe(originalEvent.principalId)
			expect(queuedEvent.action).toBe(originalEvent.action)
			expect(queuedEvent.testData.value).toBe(originalEvent.testData.value)

			// Verify cryptographic integrity
			expect(queuedEvent.hash).toBeDefined()
			expect(queuedEvent.signature).toBeDefined()

			// The hash should be consistent
			expect(typeof queuedEvent.hash).toBe('string')
			expect(queuedEvent.hash.length).toBe(64) // SHA-256 hex string length
		})
	})
})
