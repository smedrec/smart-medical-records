/**
 * Configuration validation system
 * Provides comprehensive validation for audit system configuration
 */

import { ConfigValidationError } from './types.js'

import type { AuditConfig } from './types.js'

/**
 * Validation rules for configuration fields
 */
interface ValidationRule {
	required?: boolean
	type?: 'string' | 'number' | 'boolean' | 'object' | 'array'
	min?: number
	max?: number
	pattern?: RegExp
	enum?: readonly string[]
	custom?: (value: any) => boolean | string
}

/**
 * Configuration validation schema
 */
const validationSchema: Record<string, ValidationRule> = {
	// Root level
	environment: {
		required: true,
		type: 'string',
		enum: ['development', 'staging', 'production', 'test'],
	},
	version: {
		required: true,
		type: 'string',
		pattern: /^[\d\w\-\.]+$/,
	},
	lastUpdated: {
		required: true,
		type: 'string',
		custom: (value) => {
			const date = new Date(value)
			return !isNaN(date.getTime()) || 'Invalid ISO date string'
		},
	},

	// Redis configuration
	'redis.url': {
		required: true,
		type: 'string',
		custom: (value) => {
			try {
				const url = new URL(value)
				return url.protocol === 'redis:' || url.protocol === 'rediss:' || 'Invalid Redis URL'
			} catch {
				return 'Invalid URL format'
			}
		},
	},
	'redis.connectTimeout': {
		required: true,
		type: 'number',
		min: 1000,
		max: 60000,
	},
	'redis.commandTimeout': {
		required: true,
		type: 'number',
		min: 1000,
		max: 60000,
	},
	'redis.maxRetriesPerRequest': {
		required: true,
		type: 'number',
		min: 0,
		max: 10,
	},
	'redis.retryDelayOnFailover': {
		required: true,
		type: 'number',
		min: 100,
		max: 10000,
	},
	'redis.enableOfflineQueue': {
		required: true,
		type: 'boolean',
	},

	// Database configuration
	'database.url': {
		required: true,
		type: 'string',
		custom: (value) => {
			try {
				const url = new URL(value)
				return (
					url.protocol === 'postgresql:' || url.protocol === 'postgres:' || 'Invalid PostgreSQL URL'
				)
			} catch {
				return 'Invalid URL format'
			}
		},
	},
	'database.poolSize': {
		required: true,
		type: 'number',
		min: 1,
		max: 100,
	},
	'database.connectionTimeout': {
		required: true,
		type: 'number',
		min: 1000,
		max: 60000,
	},
	'database.queryTimeout': {
		required: true,
		type: 'number',
		min: 1000,
		max: 300000,
	},
	'database.ssl': {
		required: true,
		type: 'boolean',
	},
	'database.maxConnectionAttempts': {
		required: true,
		type: 'number',
		min: 1,
		max: 10,
	},

	// Worker configuration
	'worker.concurrency': {
		required: true,
		type: 'number',
		min: 1,
		max: 50,
	},
	'worker.queueName': {
		required: true,
		type: 'string',
		pattern: /^[a-zA-Z0-9_-]+$/,
	},
	'worker.port': {
		required: true,
		type: 'number',
		min: 1024,
		max: 65535,
	},
	'worker.gracefulShutdown': {
		required: true,
		type: 'boolean',
	},
	'worker.shutdownTimeout': {
		required: true,
		type: 'number',
		min: 1000,
		max: 60000,
	},

	// Retry configuration
	'retry.maxRetries': {
		required: true,
		type: 'number',
		min: 0,
		max: 10,
	},
	'retry.baseDelay': {
		required: true,
		type: 'number',
		min: 100,
		max: 10000,
	},
	'retry.maxDelay': {
		required: true,
		type: 'number',
		min: 1000,
		max: 300000,
	},
	'retry.backoffStrategy': {
		required: true,
		type: 'string',
		enum: ['exponential', 'linear', 'fixed'],
	},
	'retry.retryableErrors': {
		required: true,
		type: 'array',
		custom: (value) => {
			return (
				(Array.isArray(value) && value.every((item) => typeof item === 'string')) ||
				'Must be array of strings'
			)
		},
	},

	// Circuit breaker configuration
	'circuitBreaker.failureThreshold': {
		required: true,
		type: 'number',
		min: 1,
		max: 100,
	},
	'circuitBreaker.recoveryTimeout': {
		required: true,
		type: 'number',
		min: 1000,
		max: 300000,
	},
	'circuitBreaker.monitoringWindow': {
		required: true,
		type: 'number',
		min: 1000,
		max: 3600000,
	},
	'circuitBreaker.minimumCalls': {
		required: true,
		type: 'number',
		min: 1,
		max: 100,
	},

	// Dead letter configuration
	'deadLetter.queueName': {
		required: true,
		type: 'string',
		pattern: /^[a-zA-Z0-9_-]+$/,
	},
	'deadLetter.alertThreshold': {
		required: true,
		type: 'number',
		min: 1,
		max: 1000,
	},
	'deadLetter.maxRetentionTime': {
		required: true,
		type: 'number',
		min: 3600000, // 1 hour
		max: 2592000000, // 30 days
	},
	'deadLetter.autoCleanup': {
		required: true,
		type: 'boolean',
	},

	// Monitoring configuration
	'monitoring.enabled': {
		required: true,
		type: 'boolean',
	},
	'monitoring.metricsInterval': {
		required: true,
		type: 'number',
		min: 1000,
		max: 300000,
	},
	'monitoring.alertThresholds.errorRate': {
		required: true,
		type: 'number',
		min: 0,
		max: 1,
	},
	'monitoring.alertThresholds.processingLatency': {
		required: true,
		type: 'number',
		min: 100,
		max: 60000,
	},
	'monitoring.alertThresholds.queueDepth': {
		required: true,
		type: 'number',
		min: 10,
		max: 10000,
	},
	'monitoring.alertThresholds.memoryUsage': {
		required: true,
		type: 'number',
		min: 0.1,
		max: 1,
	},
	'monitoring.healthCheckInterval': {
		required: true,
		type: 'number',
		min: 5000,
		max: 300000,
	},

	// Security configuration
	'security.enableIntegrityVerification': {
		required: true,
		type: 'boolean',
	},
	'security.hashAlgorithm': {
		required: true,
		type: 'string',
		enum: ['SHA-256', 'SHA-512'],
	},
	'security.enableEventSigning': {
		required: true,
		type: 'boolean',
	},
	'security.encryptionKey': {
		required: false,
		type: 'string',
		custom: (value) => {
			if (value && (typeof value !== 'string' || value.length < 32)) {
				return 'Encryption key must be at least 32 characters'
			}
			return true
		},
	},
	'security.enableLogEncryption': {
		required: true,
		type: 'boolean',
	},

	// Compliance configuration
	'compliance.enableGDPR': {
		required: true,
		type: 'boolean',
	},
	'compliance.defaultRetentionDays': {
		required: true,
		type: 'number',
		min: 1,
		max: 3650, // 10 years
	},
	'compliance.enableAutoArchival': {
		required: true,
		type: 'boolean',
	},
	'compliance.enablePseudonymization': {
		required: true,
		type: 'boolean',
	},
	'compliance.reportingSchedule.enabled': {
		required: true,
		type: 'boolean',
	},
	'compliance.reportingSchedule.frequency': {
		required: true,
		type: 'string',
		enum: ['daily', 'weekly', 'monthly'],
	},
	'compliance.reportingSchedule.recipients': {
		required: true,
		type: 'array',
		custom: (value) => {
			if (!Array.isArray(value)) return 'Must be an array'
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
			return (
				value.every((email) => typeof email === 'string' && emailRegex.test(email)) ||
				'Must be array of valid email addresses'
			)
		},
	},

	// Logging configuration
	'logging.level': {
		required: true,
		type: 'string',
		enum: ['debug', 'info', 'warn', 'error'],
	},
	'logging.structured': {
		required: true,
		type: 'boolean',
	},
	'logging.format': {
		required: true,
		type: 'string',
		enum: ['json', 'text'],
	},
	'logging.enableCorrelationIds': {
		required: true,
		type: 'boolean',
	},
	'logging.retentionDays': {
		required: true,
		type: 'number',
		min: 1,
		max: 365,
	},
}

/**
 * Validate configuration object
 */
export async function validateConfiguration(config: AuditConfig): Promise<void> {
	const errors: ConfigValidationError[] = []

	// Validate each field according to schema
	for (const [fieldPath, rule] of Object.entries(validationSchema)) {
		try {
			const value = getNestedValue(config, fieldPath)
			validateField(fieldPath, value, rule)
		} catch (error) {
			if (error instanceof ConfigValidationError) {
				errors.push(error)
			} else {
				errors.push(
					new ConfigValidationError(
						`Validation error for field ${fieldPath}: ${error instanceof Error ? error.message : 'Unknown error'}`,
						fieldPath,
						getNestedValue(config, fieldPath),
						'validation'
					)
				)
			}
		}
	}

	// Custom cross-field validations
	try {
		validateCrossFieldConstraints(config)
	} catch (error) {
		if (error instanceof ConfigValidationError) {
			errors.push(error)
		}
	}

	// Throw aggregated errors if any
	if (errors.length > 0) {
		const errorMessage = errors.map((e) => `${e.field}: ${e.message}`).join('; ')
		throw new Error(`Configuration validation failed: ${errorMessage}`)
	}
}

/**
 * Validate individual field
 */
function validateField(fieldPath: string, value: any, rule: ValidationRule): void {
	// Check required fields
	if (rule.required && (value === undefined || value === null)) {
		throw new ConfigValidationError(`Field ${fieldPath} is required`, fieldPath, value, 'required')
	}

	// Skip further validation if field is not required and not provided
	if (!rule.required && (value === undefined || value === null)) {
		return
	}

	// Type validation
	if (rule.type && !validateType(value, rule.type)) {
		throw new ConfigValidationError(
			`Field ${fieldPath} must be of type ${rule.type}`,
			fieldPath,
			value,
			'type'
		)
	}

	// Numeric range validation
	if (rule.type === 'number') {
		if (rule.min !== undefined && value < rule.min) {
			throw new ConfigValidationError(
				`Field ${fieldPath} must be at least ${rule.min}`,
				fieldPath,
				value,
				'min'
			)
		}
		if (rule.max !== undefined && value > rule.max) {
			throw new ConfigValidationError(
				`Field ${fieldPath} must be at most ${rule.max}`,
				fieldPath,
				value,
				'max'
			)
		}
	}

	// Pattern validation
	if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
		throw new ConfigValidationError(
			`Field ${fieldPath} does not match required pattern`,
			fieldPath,
			value,
			'pattern'
		)
	}

	// Enum validation
	if (rule.enum && !rule.enum.includes(value)) {
		throw new ConfigValidationError(
			`Field ${fieldPath} must be one of: ${rule.enum.join(', ')}`,
			fieldPath,
			value,
			'enum'
		)
	}

	// Custom validation
	if (rule.custom) {
		const result = rule.custom(value)
		if (result !== true) {
			throw new ConfigValidationError(
				typeof result === 'string' ? result : `Field ${fieldPath} failed custom validation`,
				fieldPath,
				value,
				'custom'
			)
		}
	}
}

/**
 * Validate type of value
 */
function validateType(value: any, expectedType: string): boolean {
	switch (expectedType) {
		case 'string':
			return typeof value === 'string'
		case 'number':
			return typeof value === 'number' && !isNaN(value)
		case 'boolean':
			return typeof value === 'boolean'
		case 'object':
			return typeof value === 'object' && value !== null && !Array.isArray(value)
		case 'array':
			return Array.isArray(value)
		default:
			return false
	}
}

/**
 * Get nested value from object by path
 */
function getNestedValue(obj: any, path: string): any {
	const keys = path.split('.')
	let current = obj

	for (const key of keys) {
		if (current && typeof current === 'object' && key in current) {
			current = current[key]
		} else {
			return undefined
		}
	}

	return current
}

/**
 * Validate cross-field constraints
 */
function validateCrossFieldConstraints(config: AuditConfig): void {
	// Validate retry configuration consistency
	if (config.retry.maxDelay < config.retry.baseDelay) {
		throw new ConfigValidationError(
			'retry.maxDelay must be greater than or equal to retry.baseDelay',
			'retry.maxDelay',
			config.retry.maxDelay,
			'cross-field'
		)
	}

	// Validate monitoring thresholds
	if (
		config.monitoring.alertThresholds.errorRate > 1 ||
		config.monitoring.alertThresholds.errorRate < 0
	) {
		throw new ConfigValidationError(
			'monitoring.alertThresholds.errorRate must be between 0 and 1',
			'monitoring.alertThresholds.errorRate',
			config.monitoring.alertThresholds.errorRate,
			'range'
		)
	}

	// Validate security configuration consistency
	if (config.security.enableLogEncryption && !config.security.encryptionKey) {
		throw new ConfigValidationError(
			'security.encryptionKey is required when security.enableLogEncryption is true',
			'security.encryptionKey',
			config.security.encryptionKey,
			'conditional-required'
		)
	}

	// Validate compliance configuration
	if (
		config.compliance.reportingSchedule.enabled &&
		config.compliance.reportingSchedule.recipients.length === 0
	) {
		throw new ConfigValidationError(
			'compliance.reportingSchedule.recipients must not be empty when reporting is enabled',
			'compliance.reportingSchedule.recipients',
			config.compliance.reportingSchedule.recipients,
			'conditional-required'
		)
	}

	// Environment-specific validations
	if (config.environment === 'production') {
		if (!config.security.enableIntegrityVerification) {
			throw new ConfigValidationError(
				'security.enableIntegrityVerification must be true in production',
				'security.enableIntegrityVerification',
				config.security.enableIntegrityVerification,
				'production-required'
			)
		}

		if (!config.database.ssl) {
			throw new ConfigValidationError(
				'database.ssl must be true in production',
				'database.ssl',
				config.database.ssl,
				'production-required'
			)
		}

		if (config.logging.level === 'debug') {
			throw new ConfigValidationError(
				'logging.level should not be debug in production',
				'logging.level',
				config.logging.level,
				'production-constraint'
			)
		}
	}
}

/**
 * Validate partial configuration (for updates)
 */
export async function validatePartialConfiguration(
	partialConfig: Partial<AuditConfig>,
	baseConfig: AuditConfig
): Promise<void> {
	// Create a merged configuration for validation
	const mergedConfig = { ...baseConfig, ...partialConfig }
	await validateConfiguration(mergedConfig)
}

/**
 * Get validation schema for a specific field
 */
export function getFieldValidationRule(fieldPath: string): ValidationRule | undefined {
	return validationSchema[fieldPath]
}

/**
 * Get all validation rules
 */
export function getValidationSchema(): Record<string, ValidationRule> {
	return { ...validationSchema }
}
