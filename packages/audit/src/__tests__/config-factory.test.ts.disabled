/**
 * Tests for configuration factory
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
	createConfigForEnvironment,
	createDevelopmentConfig,
	createMinimalConfig,
	createProductionConfig,
	createStagingConfig,
	createTestConfig,
	mergeConfigurations,
} from '../config/factory.js'

import type { AuditConfig } from '../config/types.js'

describe('Configuration Factory', () => {
	beforeEach(() => {
		// Clean up environment variables before each test
		delete process.env.REDIS_URL
		delete process.env.DATABASE_URL
		delete process.env.AUDIT_ENCRYPTION_KEY
		delete process.env.COMPLIANCE_RECIPIENTS
	})

	afterEach(() => {
		// Clean up environment variables after each test
		delete process.env.REDIS_URL
		delete process.env.DATABASE_URL
		delete process.env.AUDIT_ENCRYPTION_KEY
		delete process.env.COMPLIANCE_RECIPIENTS
	})

	describe('createDevelopmentConfig', () => {
		it('should create valid development configuration', () => {
			const config = createDevelopmentConfig()

			expect(config.environment).toBe('development')
			expect(config.version).toBe('1.0.0')
			expect(config.lastUpdated).toBeDefined()
			expect(config.redis.url).toContain('localhost')
			expect(config.database.ssl).toBe(false)
			expect(config.worker.concurrency).toBe(2)
			expect(config.logging.level).toBe('debug')
			expect(config.monitoring.enabled).toBe(true)
			expect(config.security.enableIntegrityVerification).toBe(true)
			expect(config.security.enableEventSigning).toBe(false)
			expect(config.compliance.enableGDPR).toBe(true)
		})

		it('should use environment variables when available', () => {
			process.env.REDIS_URL = 'redis://custom-redis:6379'
			process.env.DATABASE_URL = 'postgresql://custom-db:5432/custom_audit'

			const config = createDevelopmentConfig()

			expect(config.redis.url).toBe('redis://custom-redis:6379')
			expect(config.database.url).toBe('postgresql://custom-db:5432/custom_audit')
		})

		it('should have appropriate development settings', () => {
			const config = createDevelopmentConfig()

			expect(config.worker.queueName).toBe('audit-events-dev')
			expect(config.deadLetter.queueName).toBe('audit-dead-letter-dev')
			expect(config.deadLetter.maxRetentionTime).toBe(86400000) // 24 hours
			expect(config.compliance.reportingSchedule.enabled).toBe(false)
		})
	})

	describe('createStagingConfig', () => {
		it('should create valid staging configuration', () => {
			const config = createStagingConfig()

			expect(config.environment).toBe('staging')
			expect(config.database.ssl).toBe(true)
			expect(config.worker.concurrency).toBe(4)
			expect(config.logging.level).toBe('info')
			expect(config.security.enableEventSigning).toBe(true)
			expect(config.security.enableLogEncryption).toBe(true)
			expect(config.compliance.reportingSchedule.enabled).toBe(true)
		})

		it('should have enhanced security settings', () => {
			const config = createStagingConfig()

			expect(config.security.enableIntegrityVerification).toBe(true)
			expect(config.security.enableEventSigning).toBe(true)
			expect(config.security.enableLogEncryption).toBe(true)
		})

		it('should use environment variables for sensitive data', () => {
			process.env.AUDIT_ENCRYPTION_KEY = 'test-encryption-key-32-characters-long'
			process.env.COMPLIANCE_RECIPIENTS = 'admin@example.com,compliance@example.com'

			const config = createStagingConfig()

			expect(config.security.encryptionKey).toBe('test-encryption-key-32-characters-long')
			expect(config.compliance.reportingSchedule.recipients).toEqual([
				'admin@example.com',
				'compliance@example.com',
			])
		})

		it('should have appropriate staging settings', () => {
			const config = createStagingConfig()

			expect(config.worker.queueName).toBe('audit-events-staging')
			expect(config.deadLetter.queueName).toBe('audit-dead-letter-staging')
			expect(config.deadLetter.maxRetentionTime).toBe(172800000) // 48 hours
			expect(config.monitoring.metricsInterval).toBe(15000)
		})
	})

	describe('createProductionConfig', () => {
		it('should create valid production configuration', () => {
			const config = createProductionConfig()

			expect(config.environment).toBe('production')
			expect(config.database.ssl).toBe(true)
			expect(config.worker.concurrency).toBe(8)
			expect(config.logging.level).toBe('warn')
			expect(config.logging.retentionDays).toBe(365)
			expect(config.security.enableIntegrityVerification).toBe(true)
			expect(config.security.enableEventSigning).toBe(true)
			expect(config.security.enableLogEncryption).toBe(true)
		})

		it('should have production-optimized settings', () => {
			const config = createProductionConfig()

			expect(config.redis.connectTimeout).toBe(5000)
			expect(config.redis.commandTimeout).toBe(3000)
			expect(config.database.poolSize).toBe(25)
			expect(config.worker.shutdownTimeout).toBe(30000)
			expect(config.circuitBreaker.failureThreshold).toBe(2)
			expect(config.deadLetter.alertThreshold).toBe(1)
		})

		it('should have strict monitoring thresholds', () => {
			const config = createProductionConfig()

			expect(config.monitoring.alertThresholds.errorRate).toBe(0.01)
			expect(config.monitoring.alertThresholds.processingLatency).toBe(2000)
			expect(config.monitoring.alertThresholds.queueDepth).toBe(25)
			expect(config.monitoring.alertThresholds.memoryUsage).toBe(0.7)
		})

		it('should have daily compliance reporting', () => {
			const config = createProductionConfig()

			expect(config.compliance.reportingSchedule.enabled).toBe(true)
			expect(config.compliance.reportingSchedule.frequency).toBe('daily')
		})

		it('should use secure Redis connection', () => {
			const config = createProductionConfig()

			expect(config.redis.url).toContain('rediss://')
		})
	})

	describe('createTestConfig', () => {
		it('should create valid test configuration', () => {
			const config = createTestConfig()

			expect(config.environment).toBe('test')
			expect(config.worker.concurrency).toBe(1)
			expect(config.logging.level).toBe('error')
			expect(config.logging.retentionDays).toBe(1)
			expect(config.monitoring.enabled).toBe(false)
			expect(config.security.enableIntegrityVerification).toBe(false)
			expect(config.security.enableEventSigning).toBe(false)
			expect(config.compliance.enableGDPR).toBe(false)
		})

		it('should have minimal test settings', () => {
			const config = createTestConfig()

			expect(config.retry.maxRetries).toBe(1)
			expect(config.retry.baseDelay).toBe(100)
			expect(config.retry.maxDelay).toBe(1000)
			expect(config.circuitBreaker.failureThreshold).toBe(10)
			expect(config.deadLetter.alertThreshold).toBe(50)
			expect(config.compliance.defaultRetentionDays).toBe(1)
		})

		it('should use different port for test environment', () => {
			const config = createTestConfig()

			expect(config.worker.port).toBe(3002)
		})
	})

	describe('createConfigForEnvironment', () => {
		it('should create development config for "development"', () => {
			const config = createConfigForEnvironment('development')
			expect(config.environment).toBe('development')
		})

		it('should create development config for "dev"', () => {
			const config = createConfigForEnvironment('dev')
			expect(config.environment).toBe('development')
		})

		it('should create staging config for "staging"', () => {
			const config = createConfigForEnvironment('staging')
			expect(config.environment).toBe('staging')
		})

		it('should create staging config for "stage"', () => {
			const config = createConfigForEnvironment('stage')
			expect(config.environment).toBe('staging')
		})

		it('should create production config for "production"', () => {
			const config = createConfigForEnvironment('production')
			expect(config.environment).toBe('production')
		})

		it('should create production config for "prod"', () => {
			const config = createConfigForEnvironment('prod')
			expect(config.environment).toBe('production')
		})

		it('should create test config for "test"', () => {
			const config = createConfigForEnvironment('test')
			expect(config.environment).toBe('test')
		})

		it('should throw error for unknown environment', () => {
			expect(() => createConfigForEnvironment('unknown')).toThrow('Unknown environment: unknown')
		})

		it('should handle case insensitive environment names', () => {
			const config = createConfigForEnvironment('PRODUCTION')
			expect(config.environment).toBe('production')
		})
	})

	describe('createMinimalConfig', () => {
		it('should create minimal development configuration', () => {
			const config = createMinimalConfig('development')

			expect(config.environment).toBe('development')
			expect(config.version).toBe('1.0.0')
			expect(config.lastUpdated).toBeDefined()
			expect(config.redis).toBeDefined()
			expect(config.database).toBeDefined()
			expect(config.worker).toBeDefined()
			expect(config.database?.ssl).toBe(false)
		})

		it('should create minimal production configuration with SSL', () => {
			const config = createMinimalConfig('production')

			expect(config.environment).toBe('production')
			expect(config.database?.ssl).toBe(true)
		})

		it('should have environment-specific queue names', () => {
			const devConfig = createMinimalConfig('development')
			const prodConfig = createMinimalConfig('production')

			expect(devConfig.worker?.queueName).toBe('audit-events-development')
			expect(prodConfig.worker?.queueName).toBe('audit-events-production')
		})
	})

	describe('mergeConfigurations', () => {
		it('should merge configurations with override precedence', () => {
			const baseConfig = createDevelopmentConfig()
			const overrideConfig: Partial<AuditConfig> = {
				worker: {
					concurrency: 8,
					port: 4000,
				},
				logging: {
					level: 'info',
				},
			}

			const merged = mergeConfigurations(baseConfig, overrideConfig)

			expect(merged.worker.concurrency).toBe(8)
			expect(merged.worker.port).toBe(4000)
			expect(merged.worker.queueName).toBe(baseConfig.worker.queueName) // Should keep base value
			expect(merged.logging.level).toBe('info')
			expect(merged.logging.structured).toBe(baseConfig.logging.structured) // Should keep base value
		})

		it('should handle deep object merging', () => {
			const baseConfig = createDevelopmentConfig()
			const overrideConfig: Partial<AuditConfig> = {
				monitoring: {
					alertThresholds: {
						errorRate: 0.05,
						processingLatency: 3000,
					},
				},
			}

			const merged = mergeConfigurations(baseConfig, overrideConfig)

			expect(merged.monitoring.alertThresholds.errorRate).toBe(0.05)
			expect(merged.monitoring.alertThresholds.processingLatency).toBe(3000)
			expect(merged.monitoring.alertThresholds.queueDepth).toBe(
				baseConfig.monitoring.alertThresholds.queueDepth
			) // Should keep base value
			expect(merged.monitoring.enabled).toBe(baseConfig.monitoring.enabled) // Should keep base value
		})

		it('should handle array overrides', () => {
			const baseConfig = createDevelopmentConfig()
			const overrideConfig: Partial<AuditConfig> = {
				retry: {
					retryableErrors: ['CUSTOM_ERROR'],
				},
			}

			const merged = mergeConfigurations(baseConfig, overrideConfig)

			expect(merged.retry.retryableErrors).toEqual(['CUSTOM_ERROR'])
			expect(merged.retry.maxRetries).toBe(baseConfig.retry.maxRetries) // Should keep base value
		})

		it('should update lastUpdated timestamp', () => {
			const baseConfig = createDevelopmentConfig()
			const originalTimestamp = baseConfig.lastUpdated

			// Wait a bit to ensure timestamp difference
			const overrideConfig: Partial<AuditConfig> = {
				worker: { concurrency: 8 },
			}

			const merged = mergeConfigurations(baseConfig, overrideConfig)

			expect(merged.lastUpdated).not.toBe(originalTimestamp)
			expect(new Date(merged.lastUpdated).getTime()).toBeGreaterThan(
				new Date(originalTimestamp).getTime()
			)
		})

		it('should handle undefined values in override', () => {
			const baseConfig = createDevelopmentConfig()
			const overrideConfig: Partial<AuditConfig> = {
				worker: {
					concurrency: 8,
				},
				logging: undefined,
			}

			const merged = mergeConfigurations(baseConfig, overrideConfig)

			expect(merged.worker.concurrency).toBe(8)
			expect(merged.logging).toEqual(baseConfig.logging) // Should keep base value
		})

		it('should handle primitive value overrides', () => {
			const baseConfig = createDevelopmentConfig()
			const overrideConfig: Partial<AuditConfig> = {
				environment: 'staging',
				version: '2.0.0',
			}

			const merged = mergeConfigurations(baseConfig, overrideConfig)

			expect(merged.environment).toBe('staging')
			expect(merged.version).toBe('2.0.0')
		})
	})

	describe('configuration consistency', () => {
		it('should have consistent queue naming across environments', () => {
			const devConfig = createDevelopmentConfig()
			const stagingConfig = createStagingConfig()
			const prodConfig = createProductionConfig()
			const testConfig = createTestConfig()

			expect(devConfig.worker.queueName).toContain('dev')
			expect(devConfig.deadLetter.queueName).toContain('dev')

			expect(stagingConfig.worker.queueName).toContain('staging')
			expect(stagingConfig.deadLetter.queueName).toContain('staging')

			expect(prodConfig.worker.queueName).toContain('prod')
			expect(prodConfig.deadLetter.queueName).toContain('prod')

			expect(testConfig.worker.queueName).toContain('test')
			expect(testConfig.deadLetter.queueName).toContain('test')
		})

		it('should have progressive security settings across environments', () => {
			const devConfig = createDevelopmentConfig()
			const stagingConfig = createStagingConfig()
			const prodConfig = createProductionConfig()

			// Development should have basic security
			expect(devConfig.security.enableIntegrityVerification).toBe(true)
			expect(devConfig.security.enableEventSigning).toBe(false)
			expect(devConfig.security.enableLogEncryption).toBe(false)

			// Staging should have enhanced security
			expect(stagingConfig.security.enableIntegrityVerification).toBe(true)
			expect(stagingConfig.security.enableEventSigning).toBe(true)
			expect(stagingConfig.security.enableLogEncryption).toBe(true)

			// Production should have maximum security
			expect(prodConfig.security.enableIntegrityVerification).toBe(true)
			expect(prodConfig.security.enableEventSigning).toBe(true)
			expect(prodConfig.security.enableLogEncryption).toBe(true)
		})

		it('should have appropriate concurrency levels across environments', () => {
			const devConfig = createDevelopmentConfig()
			const stagingConfig = createStagingConfig()
			const prodConfig = createProductionConfig()
			const testConfig = createTestConfig()

			expect(testConfig.worker.concurrency).toBeLessThan(devConfig.worker.concurrency)
			expect(devConfig.worker.concurrency).toBeLessThan(stagingConfig.worker.concurrency)
			expect(stagingConfig.worker.concurrency).toBeLessThan(prodConfig.worker.concurrency)
		})
	})
})
