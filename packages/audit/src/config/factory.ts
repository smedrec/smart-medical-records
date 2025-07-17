/**
 * Configuration factory for creating environment-specific configurations
 */

import type { AuditConfig } from './types.js'

/**
 * Create default configuration for development environment
 */
export function createDevelopmentConfig(): AuditConfig {
	return {
		environment: 'development',
		version: '1.0.0',
		lastUpdated: new Date().toISOString(),
		redis: {
			url: process.env.REDIS_URL || 'redis://localhost:6379',
			connectTimeout: 10000,
			commandTimeout: 5000,
			maxRetriesPerRequest: 3,
			retryDelayOnFailover: 100,
			enableOfflineQueue: true,
		},
		database: {
			url: process.env.DATABASE_URL || 'postgresql://localhost:5432/audit_dev',
			poolSize: 10,
			connectionTimeout: 10000,
			queryTimeout: 30000,
			ssl: false,
			maxConnectionAttempts: 3,
		},
		worker: {
			concurrency: 2,
			queueName: 'audit-events-dev',
			port: 3001,
			gracefulShutdown: true,
			shutdownTimeout: 10000,
		},
		retry: {
			maxRetries: 3,
			baseDelay: 1000,
			maxDelay: 10000,
			backoffStrategy: 'exponential',
			retryableErrors: ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNREFUSED'],
		},
		circuitBreaker: {
			failureThreshold: 5,
			recoveryTimeout: 30000,
			monitoringPeriod: 60000,
			minimumThroughput: 10,
		},
		deadLetter: {
			queueName: 'audit-dead-letter-dev',
			maxRetentionDays: 30,
			alertThreshold: 10,
			processingInterval: 3000,
			archiveAfterDays: 30, // 24 hours
		},
		monitoring: {
			enabled: true,
			metricsInterval: 30000,
			alertThresholds: {
				errorRate: 0.1,
				processingLatency: 5000,
				queueDepth: 100,
				memoryUsage: 0.8,
			},
			healthCheckInterval: 30000,
		},
		security: {
			enableIntegrityVerification: true,
			hashAlgorithm: 'SHA-256',
			enableEventSigning: false,
			enableLogEncryption: false,
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
			defaultRetentionDays: 2555, // 7 years
			enableAutoArchival: true,
			enablePseudonymization: true,
			reportingSchedule: {
				enabled: false,
				frequency: 'weekly',
				recipients: [],
				includeGDPR: false,
				includeHIPAA: false,
			},
		},
		logging: {
			level: 'debug',
			structured: true,
			format: 'json',
			enableCorrelationIds: true,
			retentionDays: 30,
		},
	}
}

/**
 * Create default configuration for staging environment
 */
export function createStagingConfig(): AuditConfig {
	const baseConfig = createDevelopmentConfig()

	return {
		...baseConfig,
		environment: 'staging',
		redis: {
			...baseConfig.redis,
			url: process.env.REDIS_URL || 'redis://redis-staging:6379',
		},
		database: {
			...baseConfig.database,
			url: process.env.DATABASE_URL || 'postgresql://postgres-staging:5432/audit_staging',
			ssl: true,
			poolSize: 15,
		},
		worker: {
			...baseConfig.worker,
			concurrency: 4,
			queueName: 'audit-events-staging',
			port: 3001,
		},
		retry: {
			...baseConfig.retry,
			maxRetries: 5,
		},
		circuitBreaker: {
			...baseConfig.circuitBreaker,
			failureThreshold: 3,
			recoveryTimeout: 60000,
		},
		deadLetter: {
			...baseConfig.deadLetter,
			queueName: 'audit-dead-letter-staging',
			alertThreshold: 5,
			maxRetentionTime: 172800000, // 48 hours
		},
		monitoring: {
			...baseConfig.monitoring,
			metricsInterval: 15000,
			alertThresholds: {
				errorRate: 0.05,
				processingLatency: 3000,
				queueDepth: 50,
				memoryUsage: 0.75,
			},
			healthCheckInterval: 15000,
		},
		security: {
			...baseConfig.security,
			enableEventSigning: true,
			enableLogEncryption: true,
			encryptionKey: process.env.AUDIT_ENCRYPTION_KEY,
		},
		compliance: {
			...baseConfig.compliance,
			reportingSchedule: {
				enabled: true,
				frequency: 'weekly',
				recipients: process.env.COMPLIANCE_RECIPIENTS?.split(',') || [],
				includeGDPR: true,
				includeHIPAA: true,
			},
		},
		logging: {
			...baseConfig.logging,
			level: 'info',
			retentionDays: 90,
		},
	}
}

/**
 * Create default configuration for production environment
 */
export function createProductionConfig(): AuditConfig {
	const baseConfig = createStagingConfig()

	return {
		...baseConfig,
		environment: 'production',
		redis: {
			...baseConfig.redis,
			url: process.env.REDIS_URL || 'rediss://redis-prod:6380',
			connectTimeout: 5000,
			commandTimeout: 3000,
			maxRetriesPerRequest: 5,
		},
		database: {
			...baseConfig.database,
			url: process.env.DATABASE_URL || 'postgresql://postgres-prod:5432/audit_prod',
			ssl: true,
			poolSize: 25,
			connectionTimeout: 5000,
			queryTimeout: 60000,
			maxConnectionAttempts: 5,
		},
		worker: {
			...baseConfig.worker,
			concurrency: 8,
			queueName: 'audit-events-prod',
			port: 3001,
			shutdownTimeout: 30000,
		},
		retry: {
			...baseConfig.retry,
			maxRetries: 5,
			baseDelay: 2000,
			maxDelay: 30000,
		},
		circuitBreaker: {
			...baseConfig.circuitBreaker,
		},
		deadLetter: {
			...baseConfig.deadLetter,
			queueName: 'audit-dead-letter-prod',
			alertThreshold: 20,
			archiveAfterDays: 7, // 7 days
		},
		monitoring: {
			...baseConfig.monitoring,
			metricsInterval: 10000,
			alertThresholds: {
				errorRate: 0.01,
				processingLatency: 2000,
				queueDepth: 25,
				memoryUsage: 0.7,
			},
			healthCheckInterval: 10000,
		},
		security: {
			...baseConfig.security,
			enableIntegrityVerification: true,
			hashAlgorithm: 'SHA-256',
			enableEventSigning: true,
			enableLogEncryption: true,
			encryptionKey: process.env.AUDIT_ENCRYPTION_KEY,
		},
		compliance: {
			...baseConfig.compliance,
			reportingSchedule: {
				enabled: true,
				frequency: 'daily',
				recipients: process.env.COMPLIANCE_RECIPIENTS?.split(',') || [],
				includeGDPR: true,
				includeHIPAA: true,
			},
		},
		logging: {
			...baseConfig.logging,
			level: 'warn',
			retentionDays: 365,
		},
	}
}

/**
 * Create default configuration for test environment
 */
export function createTestConfig(): AuditConfig {
	const baseConfig = createDevelopmentConfig()

	return {
		...baseConfig,
		environment: 'test',
		redis: {
			...baseConfig.redis,
			url: process.env.REDIS_URL || 'redis://localhost:6380',
		},
		database: {
			...baseConfig.database,
			url: process.env.DATABASE_URL || 'postgresql://localhost:5432/audit_test',
			poolSize: 5,
		},
		worker: {
			...baseConfig.worker,
			concurrency: 1,
			queueName: 'audit-events-test',
			port: 3002,
		},
		retry: {
			...baseConfig.retry,
			maxRetries: 1,
			baseDelay: 100,
			maxDelay: 1000,
		},
		circuitBreaker: {
			...baseConfig.circuitBreaker,
			failureThreshold: 10,
			recoveryTimeout: 5000,
			monitoringWindow: 10000,
			minimumCalls: 5,
		},
		deadLetter: {
			...baseConfig.deadLetter,
			queueName: 'audit-dead-letter-test',
			alertThreshold: 50,
			maxRetentionTime: 3600000, // 1 hour
		},
		monitoring: {
			...baseConfig.monitoring,
			enabled: false,
			metricsInterval: 60000,
			healthCheckInterval: 60000,
		},
		security: {
			...baseConfig.security,
			enableIntegrityVerification: false,
			enableEventSigning: false,
			enableLogEncryption: false,
		},
		compliance: {
			...baseConfig.compliance,
			defaultRetentionDays: 1,
			enableAutoArchival: false,
			enablePseudonymization: false,
			reportingSchedule: {
				enabled: false,
				frequency: 'daily',
				recipients: [],
				includeGDPR: false,
				includeHIPAA: false,
			},
		},
		logging: {
			...baseConfig.logging,
			level: 'error',
			retentionDays: 1,
		},
	}
}

/**
 * Create configuration based on environment
 */
export function createConfigForEnvironment(environment: string): AuditConfig {
	switch (environment.toLowerCase()) {
		case 'development':
		case 'dev':
			return createDevelopmentConfig()
		case 'staging':
		case 'stage':
			return createStagingConfig()
		case 'production':
		case 'prod':
			return createProductionConfig()
		case 'test':
			return createTestConfig()
		default:
			throw new Error(`Unknown environment: ${environment}`)
	}
}

/**
 * Create minimal configuration with only required fields
 */
export function createMinimalConfig(
	environment: 'development' | 'staging' | 'production' | 'test'
): Partial<AuditConfig> {
	return {
		environment,
		version: '1.0.0',
		lastUpdated: new Date().toISOString(),
		redis: {
			url: process.env.REDIS_URL || 'redis://localhost:6379',
			connectTimeout: 10000,
			commandTimeout: 5000,
			maxRetriesPerRequest: 3,
			retryDelayOnFailover: 100,
			enableOfflineQueue: true,
		},
		database: {
			url: process.env.DATABASE_URL || 'postgresql://localhost:5432/audit',
			poolSize: 10,
			connectionTimeout: 10000,
			queryTimeout: 30000,
			ssl: environment === 'production',
			maxConnectionAttempts: 3,
		},
		worker: {
			concurrency: 2,
			queueName: `audit-events-${environment}`,
			port: 3001,
			gracefulShutdown: true,
			shutdownTimeout: 10000,
		},
	}
}

/**
 * Merge configurations with override precedence
 */
export function mergeConfigurations(
	baseConfig: AuditConfig,
	overrideConfig: Partial<AuditConfig>
): AuditConfig {
	const merged = { ...baseConfig }

	for (const [key, value] of Object.entries(overrideConfig)) {
		if (value !== undefined) {
			if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
				// Deep merge objects
				const currentValue = merged[key as keyof AuditConfig]
				if (typeof currentValue === 'object' && currentValue !== null) {
					merged[key as keyof AuditConfig] = {
						...(currentValue as Record<string, any>),
						...value,
					} as any
				} else {
					merged[key as keyof AuditConfig] = value as any
				}
			} else {
				// Direct assignment for primitives and arrays
				merged[key as keyof AuditConfig] = value as any
			}
		}
	}

	// Update metadata
	merged.lastUpdated = new Date().toISOString()

	return merged
}
