/**
 * Tests for configuration validator
 */

import { describe, expect, it } from 'vitest'

import { createDevelopmentConfig, createProductionConfig } from '../config/factory.js'
import { ConfigValidationError } from '../config/types.js'
import {
	getFieldValidationRule,
	getValidationSchema,
	validateConfiguration,
	validatePartialConfiguration,
} from '../config/validator.js'

import type { AuditConfig } from '../config/types.js'

describe('Configuration Validator', () => {
	describe('validateConfiguration', () => {
		it('should validate a complete valid configuration', async () => {
			const config = createDevelopmentConfig()
			await expect(validateConfiguration(config)).resolves.not.toThrow()
		})

		it('should validate production configuration', async () => {
			const config = createProductionConfig()
			await expect(validateConfiguration(config)).resolves.not.toThrow()
		})

		it('should throw error for missing required fields', async () => {
			const config = createDevelopmentConfig()
			delete (config as any).environment

			await expect(validateConfiguration(config)).rejects.toThrow('Configuration validation failed')
		})

		it('should validate Redis URL format', async () => {
			const config = createDevelopmentConfig()
			config.redis.url = 'invalid-url'

			await expect(validateConfiguration(config)).rejects.toThrow('Configuration validation failed')
		})

		it('should validate PostgreSQL URL format', async () => {
			const config = createDevelopmentConfig()
			config.database.url = 'mysql://localhost:3306/db'

			await expect(validateConfiguration(config)).rejects.toThrow('Configuration validation failed')
		})

		it('should validate numeric ranges', async () => {
			const config = createDevelopmentConfig()
			config.worker.concurrency = -1

			await expect(validateConfiguration(config)).rejects.toThrow('Configuration validation failed')
		})

		it('should validate enum values', async () => {
			const config = createDevelopmentConfig()
			;(config.environment as any) = 'invalid-env'

			await expect(validateConfiguration(config)).rejects.toThrow('Configuration validation failed')
		})

		it('should validate pattern matching', async () => {
			const config = createDevelopmentConfig()
			config.worker.queueName = 'invalid queue name!'

			await expect(validateConfiguration(config)).rejects.toThrow('Configuration validation failed')
		})

		it('should validate array types', async () => {
			const config = createDevelopmentConfig()
			;(config.retry.retryableErrors as any) = 'not-an-array'

			await expect(validateConfiguration(config)).rejects.toThrow('Configuration validation failed')
		})

		it('should validate email addresses in compliance recipients', async () => {
			const config = createDevelopmentConfig()
			config.compliance.reportingSchedule.enabled = true
			config.compliance.reportingSchedule.recipients = ['invalid-email']

			await expect(validateConfiguration(config)).rejects.toThrow('Configuration validation failed')
		})

		it('should validate custom validation rules', async () => {
			const config = createDevelopmentConfig()
			config.security.enableLogEncryption = true
			config.security.encryptionKey = 'too-short'

			await expect(validateConfiguration(config)).rejects.toThrow('Configuration validation failed')
		})
	})

	describe('cross-field validation', () => {
		it('should validate retry delay consistency', async () => {
			const config = createDevelopmentConfig()
			config.retry.maxDelay = 500
			config.retry.baseDelay = 1000

			await expect(validateConfiguration(config)).rejects.toThrow(
				'retry.maxDelay must be greater than or equal to retry.baseDelay'
			)
		})

		it('should validate monitoring error rate range', async () => {
			const config = createDevelopmentConfig()
			config.monitoring.alertThresholds.errorRate = 1.5

			await expect(validateConfiguration(config)).rejects.toThrow(
				'monitoring.alertThresholds.errorRate must be between 0 and 1'
			)
		})

		it('should validate security encryption key requirement', async () => {
			const config = createDevelopmentConfig()
			config.security.enableLogEncryption = true
			config.security.encryptionKey = undefined

			await expect(validateConfiguration(config)).rejects.toThrow(
				'security.encryptionKey is required when security.enableLogEncryption is true'
			)
		})

		it('should validate compliance reporting recipients requirement', async () => {
			const config = createDevelopmentConfig()
			config.compliance.reportingSchedule.enabled = true
			config.compliance.reportingSchedule.recipients = []

			await expect(validateConfiguration(config)).rejects.toThrow(
				'compliance.reportingSchedule.recipients must not be empty when reporting is enabled'
			)
		})
	})

	describe('environment-specific validation', () => {
		it('should enforce production security requirements', async () => {
			const config = createProductionConfig()
			config.security.enableIntegrityVerification = false

			await expect(validateConfiguration(config)).rejects.toThrow(
				'security.enableIntegrityVerification must be true in production'
			)
		})

		it('should enforce production SSL requirement', async () => {
			const config = createProductionConfig()
			config.database.ssl = false

			await expect(validateConfiguration(config)).rejects.toThrow(
				'database.ssl must be true in production'
			)
		})

		it('should warn about debug logging in production', async () => {
			const config = createProductionConfig()
			config.logging.level = 'debug'

			await expect(validateConfiguration(config)).rejects.toThrow(
				'logging.level should not be debug in production'
			)
		})
	})

	describe('validatePartialConfiguration', () => {
		it('should validate partial configuration updates', async () => {
			const baseConfig = createDevelopmentConfig()
			const partialConfig = {
				worker: {
					concurrency: 8,
				},
			}

			await expect(validatePartialConfiguration(partialConfig, baseConfig)).resolves.not.toThrow()
		})

		it('should reject invalid partial configuration', async () => {
			const baseConfig = createDevelopmentConfig()
			const partialConfig = {
				worker: {
					concurrency: -1,
				},
			}

			await expect(validatePartialConfiguration(partialConfig, baseConfig)).rejects.toThrow(
				'Configuration validation failed'
			)
		})

		it('should validate cross-field constraints in partial updates', async () => {
			const baseConfig = createDevelopmentConfig()
			const partialConfig = {
				retry: {
					maxDelay: 500,
				},
			}

			await expect(validatePartialConfiguration(partialConfig, baseConfig)).rejects.toThrow(
				'retry.maxDelay must be greater than or equal to retry.baseDelay'
			)
		})
	})

	describe('validation schema access', () => {
		it('should return validation rule for specific field', () => {
			const rule = getFieldValidationRule('worker.concurrency')
			expect(rule).toBeDefined()
			expect(rule?.required).toBe(true)
			expect(rule?.type).toBe('number')
			expect(rule?.min).toBe(1)
			expect(rule?.max).toBe(50)
		})

		it('should return undefined for non-existent field', () => {
			const rule = getFieldValidationRule('nonexistent.field')
			expect(rule).toBeUndefined()
		})

		it('should return complete validation schema', () => {
			const schema = getValidationSchema()
			expect(schema).toBeDefined()
			expect(Object.keys(schema).length).toBeGreaterThan(0)
			expect(schema).toHaveProperty('environment')
			expect(schema).toHaveProperty('redis.url')
			expect(schema).toHaveProperty('database.url')
			expect(schema).toHaveProperty('worker.concurrency')
		})
	})

	describe('ConfigValidationError', () => {
		it('should create validation error with correct properties', () => {
			const error = new ConfigValidationError(
				'Test validation error',
				'test.field',
				'invalid-value',
				'test-constraint'
			)

			expect(error.name).toBe('ConfigValidationError')
			expect(error.message).toBe('Test validation error')
			expect(error.field).toBe('test.field')
			expect(error.value).toBe('invalid-value')
			expect(error.constraint).toBe('test-constraint')
		})

		it('should be instance of Error', () => {
			const error = new ConfigValidationError('Test', 'field', 'value', 'constraint')
			expect(error).toBeInstanceOf(Error)
		})
	})

	describe('field-specific validation', () => {
		it('should validate Redis configuration fields', async () => {
			const config = createDevelopmentConfig()

			// Test invalid connect timeout
			config.redis.connectTimeout = 500
			await expect(validateConfiguration(config)).rejects.toThrow()

			// Reset and test invalid command timeout
			config.redis.connectTimeout = 5000
			config.redis.commandTimeout = 70000
			await expect(validateConfiguration(config)).rejects.toThrow()

			// Reset and test invalid max retries
			config.redis.commandTimeout = 5000
			config.redis.maxRetriesPerRequest = 15
			await expect(validateConfiguration(config)).rejects.toThrow()
		})

		it('should validate database configuration fields', async () => {
			const config = createDevelopmentConfig()

			// Test invalid pool size
			config.database.poolSize = 0
			await expect(validateConfiguration(config)).rejects.toThrow()

			// Reset and test invalid connection timeout
			config.database.poolSize = 10
			config.database.connectionTimeout = 500
			await expect(validateConfiguration(config)).rejects.toThrow()

			// Reset and test invalid query timeout
			config.database.connectionTimeout = 5000
			config.database.queryTimeout = 500
			await expect(validateConfiguration(config)).rejects.toThrow()
		})

		it('should validate worker configuration fields', async () => {
			const config = createDevelopmentConfig()

			// Test invalid port
			config.worker.port = 80
			await expect(validateConfiguration(config)).rejects.toThrow()

			// Reset and test invalid shutdown timeout
			config.worker.port = 3001
			config.worker.shutdownTimeout = 500
			await expect(validateConfiguration(config)).rejects.toThrow()
		})

		it('should validate monitoring configuration fields', async () => {
			const config = createDevelopmentConfig()

			// Test invalid metrics interval
			config.monitoring.metricsInterval = 500
			await expect(validateConfiguration(config)).rejects.toThrow()

			// Reset and test invalid health check interval
			config.monitoring.metricsInterval = 30000
			config.monitoring.healthCheckInterval = 1000
			await expect(validateConfiguration(config)).rejects.toThrow()
		})

		it('should validate compliance configuration fields', async () => {
			const config = createDevelopmentConfig()

			// Test invalid retention days
			config.compliance.defaultRetentionDays = 0
			await expect(validateConfiguration(config)).rejects.toThrow()

			// Reset and test invalid retention days (too high)
			config.compliance.defaultRetentionDays = 4000
			await expect(validateConfiguration(config)).rejects.toThrow()
		})

		it('should validate logging configuration fields', async () => {
			const config = createDevelopmentConfig()

			// Test invalid retention days
			config.logging.retentionDays = 0
			await expect(validateConfiguration(config)).rejects.toThrow()

			// Reset and test invalid retention days (too high)
			config.logging.retentionDays = 400
			await expect(validateConfiguration(config)).rejects.toThrow()
		})
	})
})
