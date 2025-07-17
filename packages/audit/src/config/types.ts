/**
 * Configuration management types for the audit system
 * Uses existing types from the audit system to avoid duplication
 */

import type { ComplianceConfig } from '@repo/audit-sdk'
import type { CircuitBreakerConfig } from '../circuit-breaker.js'
import type { DeadLetterConfig } from '../dead-letter-queue.js'
import type { RetryConfig } from '../retry.js'

export interface AuditConfig {
	/** Environment identifier */
	environment: 'development' | 'staging' | 'production' | 'test'

	/** Configuration version for tracking changes */
	version: string

	/** Timestamp when configuration was last updated */
	lastUpdated: string

	/** Redis configuration */
	redis: RedisConfig

	/** Database configuration */
	database: DatabaseConfig

	/** Worker configuration */
	worker: WorkerConfig

	/** Retry configuration */
	retry: RetryConfig

	/** Circuit breaker configuration */
	circuitBreaker: CircuitBreakerConfig

	/** Dead letter queue configuration */
	deadLetter: DeadLetterConfig

	/** Monitoring configuration */
	monitoring: MonitoringConfig

	/** Security configuration */
	security: SecurityConfig

	/** Compliance configuration */
	compliance: ComplianceConfig

	/** Logging configuration */
	logging: LoggingConfig
}

export interface RedisConfig {
	/** Redis connection URL */
	url: string

	/** Connection timeout in milliseconds */
	connectTimeout: number

	/** Command timeout in milliseconds */
	commandTimeout: number

	/** Maximum number of retries */
	maxRetriesPerRequest: number

	/** Retry delay on failure */
	retryDelayOnFailover: number

	/** Enable offline queue */
	enableOfflineQueue: boolean
}

export interface DatabaseConfig {
	/** Database connection URL */
	url: string

	/** Connection pool size */
	poolSize: number

	/** Connection timeout in milliseconds */
	connectionTimeout: number

	/** Query timeout in milliseconds */
	queryTimeout: number

	/** Enable SSL */
	ssl: boolean

	/** Maximum connection attempts */
	maxConnectionAttempts: number
}

export interface WorkerConfig {
	/** Worker concurrency level */
	concurrency: number

	/** Queue name for audit events */
	queueName: string

	/** Worker port for health checks */
	port: number

	/** Enable graceful shutdown */
	gracefulShutdown: boolean

	/** Shutdown timeout in milliseconds */
	shutdownTimeout: number
}

export interface MonitoringConfig {
	/** Enable real-time monitoring */
	enabled: boolean

	/** Metrics collection interval in milliseconds */
	metricsInterval: number

	/** Alert thresholds */
	alertThresholds: {
		errorRate: number
		processingLatency: number
		queueDepth: number
		memoryUsage: number
	}

	/** Health check interval in milliseconds */
	healthCheckInterval: number
}

export interface SecurityConfig {
	/** Enable cryptographic integrity verification */
	enableIntegrityVerification: boolean

	/** Hash algorithm for integrity verification */
	hashAlgorithm: 'SHA-256' | 'SHA-512'

	/** Enable event signing */
	enableEventSigning: boolean

	/** Encryption key for sensitive data */
	encryptionKey?: string

	/** Enable audit log encryption */
	enableLogEncryption: boolean
}

export interface LoggingConfig {
	/** Log level */
	level: 'debug' | 'info' | 'warn' | 'error'

	/** Enable structured logging */
	structured: boolean

	/** Log format */
	format: 'json' | 'text'

	/** Enable log correlation IDs */
	enableCorrelationIds: boolean

	/** Log retention period in days */
	retentionDays: number
}

/**
 * Configuration validation error
 */
export class ConfigValidationError extends Error {
	constructor(
		message: string,
		public field: string,
		public value: any,
		public constraint: string
	) {
		super(message)
		this.name = 'ConfigValidationError'
	}
}

/**
 * Configuration change event
 */
export interface ConfigChangeEvent {
	/** Unique identifier for the change */
	id: string

	/** Timestamp of the change */
	timestamp: string

	/** Configuration field that changed */
	field: string

	/** Previous value */
	previousValue: any

	/** New value */
	newValue: any

	/** User or system that made the change */
	changedBy: string

	/** Reason for the change */
	reason?: string

	/** Environment where change occurred */
	environment: string
}

/**
 * Configuration hot-reload settings
 */
export interface HotReloadConfig {
	/** Enable hot reloading */
	enabled: boolean

	/** Fields that support hot reloading */
	reloadableFields: string[]

	/** Reload check interval in milliseconds */
	checkInterval: number

	/** Configuration file path to watch */
	configFilePath?: string
}

/**
 * Secure configuration storage settings
 */
export interface SecureStorageConfig {
	/** Enable secure storage */
	enabled: boolean

	/** Encryption algorithm */
	algorithm: 'AES-256-GCM' | 'AES-256-CBC'

	/** Key derivation function */
	kdf: 'PBKDF2' | 'scrypt'

	/** Salt for key derivation */
	salt: string

	/** Number of iterations for key derivation */
	iterations: number
}
