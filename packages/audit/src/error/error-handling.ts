/**
 * Comprehensive error handling and logging system for audit operations
 * Implements structured error logging, classification, and aggregation
 */

import { randomUUID } from 'crypto'
import { hostname } from 'os'

/**
 * Error classification types for different failure categories
 */
export type ErrorCategory =
	| 'DATABASE_ERROR'
	| 'NETWORK_ERROR'
	| 'VALIDATION_ERROR'
	| 'AUTHENTICATION_ERROR'
	| 'AUTHORIZATION_ERROR'
	| 'CONFIGURATION_ERROR'
	| 'PROCESSING_ERROR'
	| 'INTEGRITY_ERROR'
	| 'TIMEOUT_ERROR'
	| 'RESOURCE_ERROR'
	| 'EXTERNAL_SERVICE_ERROR'
	| 'UNKNOWN_ERROR'

/**
 * Error severity levels
 */
export type ErrorSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

/**
 * Error context interface for detailed troubleshooting information
 */
export interface ErrorContext {
	correlationId: string
	timestamp: string
	component: string
	operation: string
	userId?: string
	sessionId?: string
	requestId?: string
	metadata: Record<string, any>
	stackTrace?: string
	environment: {
		nodeVersion: string
		platform: string
		hostname: string
		processId: number
	}
}

/**
 * Structured error interface
 */
export interface StructuredError {
	id: string
	category: ErrorCategory
	severity: ErrorSeverity
	code: string
	message: string
	originalError?: Error
	context: ErrorContext
	retryable: boolean
	troubleshooting: {
		possibleCauses: string[]
		suggestedActions: string[]
		relatedDocumentation?: string[]
	}
	aggregationKey: string
}

/**
 * Error aggregation statistics
 */
export interface ErrorAggregation {
	aggregationKey: string
	category: ErrorCategory
	severity: ErrorSeverity
	count: number
	firstOccurrence: string
	lastOccurrence: string
	affectedComponents: string[]
	affectedUsers: string[]
	errorRate: number
	trend: 'INCREASING' | 'DECREASING' | 'STABLE'
	samples: StructuredError[]
}

/**
 * Error logging configuration
 */
export interface ErrorLoggingConfig {
	enableStructuredLogging: boolean
	enableAggregation: boolean
	aggregationWindowMinutes: number
	maxSamplesPerAggregation: number
	enableCorrelationTracking: boolean
	logLevel: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'
	enableStackTraces: boolean
	enableEnvironmentInfo: boolean
}

/**
 * Default error logging configuration
 */
export const DEFAULT_ERROR_LOGGING_CONFIG: ErrorLoggingConfig = {
	enableStructuredLogging: true,
	enableAggregation: true,
	aggregationWindowMinutes: 15,
	maxSamplesPerAggregation: 10,
	enableCorrelationTracking: true,
	logLevel: 'ERROR',
	enableStackTraces: true,
	enableEnvironmentInfo: true,
}

/**
 * Error classification rules
 */
export interface ErrorClassificationRule {
	pattern: RegExp | string
	category: ErrorCategory
	severity: ErrorSeverity
	retryable: boolean
	troubleshooting: {
		possibleCauses: string[]
		suggestedActions: string[]
		relatedDocumentation?: string[]
	}
}

/**
 * Default error classification rules
 */
export const DEFAULT_ERROR_CLASSIFICATION_RULES: ErrorClassificationRule[] = [
	// Database errors
	{
		pattern: /database.*connection|connection.*database/i,
		category: 'DATABASE_ERROR',
		severity: 'HIGH',
		retryable: true,
		troubleshooting: {
			possibleCauses: [
				'Database server is down or unreachable',
				'Network connectivity issues',
				'Database connection pool exhausted',
				'Firewall blocking database connections',
			],
			suggestedActions: [
				'Check database server status',
				'Verify network connectivity',
				'Review connection pool configuration',
				'Check firewall rules',
			],
			relatedDocumentation: ['https://docs.postgresql.org/current/runtime-config-connection.html'],
		},
	},
	{
		pattern: /deadlock|lock.*timeout|constraint.*violation/i,
		category: 'DATABASE_ERROR',
		severity: 'MEDIUM',
		retryable: true,
		troubleshooting: {
			possibleCauses: [
				'Database deadlock between transactions',
				'Long-running transactions holding locks',
				'Data integrity constraint violations',
			],
			suggestedActions: [
				'Retry the operation',
				'Review transaction isolation levels',
				'Optimize query performance',
				'Check data integrity constraints',
			],
		},
	},
	// Network errors
	{
		pattern: /ECONNRESET|ETIMEDOUT|ENOTFOUND|ECONNREFUSED|EHOSTUNREACH|ENETUNREACH/i,
		category: 'NETWORK_ERROR',
		severity: 'HIGH',
		retryable: true,
		troubleshooting: {
			possibleCauses: [
				'Network connectivity issues',
				'DNS resolution failures',
				'Service unavailable',
				'Firewall blocking connections',
			],
			suggestedActions: [
				'Check network connectivity',
				'Verify DNS configuration',
				'Check service availability',
				'Review firewall rules',
			],
		},
	},
	// Validation errors
	{
		pattern: /validation.*failed|invalid.*input|schema.*error/i,
		category: 'VALIDATION_ERROR',
		severity: 'MEDIUM',
		retryable: false,
		troubleshooting: {
			possibleCauses: [
				'Invalid input data format',
				'Missing required fields',
				'Data type mismatches',
				'Schema validation failures',
			],
			suggestedActions: [
				'Validate input data format',
				'Check required field presence',
				'Verify data types',
				'Review schema definitions',
			],
		},
	},
	// Authentication errors
	{
		pattern: /authentication.*failed|invalid.*credentials|unauthorized/i,
		category: 'AUTHENTICATION_ERROR',
		severity: 'HIGH',
		retryable: false,
		troubleshooting: {
			possibleCauses: [
				'Invalid credentials provided',
				'Expired authentication tokens',
				'Authentication service unavailable',
				'User account locked or disabled',
			],
			suggestedActions: [
				'Verify credentials',
				'Check token expiration',
				'Confirm authentication service status',
				'Review user account status',
			],
		},
	},
	// Authorization errors
	{
		pattern: /authorization.*failed|access.*denied|forbidden|insufficient.*permissions/i,
		category: 'AUTHORIZATION_ERROR',
		severity: 'MEDIUM',
		retryable: false,
		troubleshooting: {
			possibleCauses: [
				'Insufficient user permissions',
				'Role-based access control restrictions',
				'Resource-level access denied',
				'Policy evaluation failures',
			],
			suggestedActions: [
				'Review user permissions',
				'Check role assignments',
				'Verify resource access policies',
				'Review authorization rules',
			],
		},
	},
	// Timeout errors - make pattern more specific to avoid matching "unknown error"
	{
		pattern: /\btimeout\b|\btimed.*out\b/i,
		category: 'TIMEOUT_ERROR',
		severity: 'HIGH', // Changed to HIGH to match test expectations
		retryable: true,
		troubleshooting: {
			possibleCauses: [
				'Operation taking longer than expected',
				'Resource contention',
				'Network latency issues',
				'Insufficient system resources',
			],
			suggestedActions: [
				'Increase timeout values',
				'Optimize operation performance',
				'Check system resource usage',
				'Review network latency',
			],
		},
	},
	// Configuration errors
	{
		pattern: /configuration.*error|config.*invalid|missing.*environment/i,
		category: 'CONFIGURATION_ERROR',
		severity: 'CRITICAL',
		retryable: false,
		troubleshooting: {
			possibleCauses: [
				'Missing configuration values',
				'Invalid configuration format',
				'Environment variables not set',
				'Configuration file corruption',
			],
			suggestedActions: [
				'Check configuration files',
				'Verify environment variables',
				'Validate configuration format',
				'Review configuration documentation',
			],
		},
	},
	// Integrity errors
	{
		pattern: /integrity.*violation|hash.*mismatch|verification.*failed/i,
		category: 'INTEGRITY_ERROR',
		severity: 'CRITICAL',
		retryable: false,
		troubleshooting: {
			possibleCauses: [
				'Data corruption detected',
				'Cryptographic verification failure',
				'Tampering attempt detected',
				'Storage system errors',
			],
			suggestedActions: [
				'Investigate data integrity',
				'Check cryptographic signatures',
				'Review audit logs for tampering',
				'Verify storage system health',
			],
		},
	},
]

/**
 * Error logger interface
 */
export interface ErrorLogger {
	logError(error: StructuredError): Promise<void>
	logAggregation(aggregation: ErrorAggregation): Promise<void>
	getErrorHistory(filters?: ErrorHistoryFilters): Promise<StructuredError[]>
	getAggregations(filters?: AggregationFilters): Promise<ErrorAggregation[]>
}

/**
 * Error history filters
 */
export interface ErrorHistoryFilters {
	category?: ErrorCategory
	severity?: ErrorSeverity
	component?: string
	correlationId?: string
	startTime?: string
	endTime?: string
	limit?: number
}

/**
 * Aggregation filters
 */
export interface AggregationFilters {
	category?: ErrorCategory
	severity?: ErrorSeverity
	component?: string
	startTime?: string
	endTime?: string
	minCount?: number
}

/**
 * Comprehensive error handler class
 */
export class ErrorHandler {
	private aggregations = new Map<string, ErrorAggregation>()
	private classificationRules: ErrorClassificationRule[]
	private errorLogger?: ErrorLogger

	constructor(
		private config: ErrorLoggingConfig = DEFAULT_ERROR_LOGGING_CONFIG,
		classificationRules: ErrorClassificationRule[] = DEFAULT_ERROR_CLASSIFICATION_RULES,
		errorLogger?: ErrorLogger
	) {
		this.classificationRules = classificationRules
		this.errorLogger = errorLogger

		// Start aggregation cleanup interval
		if (config.enableAggregation) {
			this.startAggregationCleanup()
		}
	}

	/**
	 * Handle and process an error with full context
	 */
	async handleError(
		error: Error,
		context: Partial<ErrorContext>,
		component: string,
		operation: string
	): Promise<StructuredError> {
		const correlationId = context.correlationId || this.generateCorrelationId()

		// Build complete error context
		const fullContext: ErrorContext = {
			correlationId,
			timestamp: new Date().toISOString(),
			component,
			operation,
			userId: context.userId,
			sessionId: context.sessionId,
			requestId: context.requestId,
			metadata: context.metadata || {},
			stackTrace: this.config.enableStackTraces ? error.stack : undefined,
			environment: this.config.enableEnvironmentInfo
				? {
						nodeVersion: process.version,
						platform: process.platform,
						hostname: hostname(),
						processId: process.pid,
					}
				: ({} as any),
		}

		// Classify the error
		const classification = this.classifyError(error)

		// Create structured error
		const structuredError: StructuredError = {
			id: randomUUID(),
			category: classification.category,
			severity: classification.severity,
			code: this.generateErrorCode(classification.category, error),
			message: error.message,
			originalError: error,
			context: fullContext,
			retryable: classification.retryable,
			troubleshooting: classification.troubleshooting,
			aggregationKey: this.generateAggregationKey(
				classification.category,
				error.message,
				component
			),
		}

		// Log the structured error
		if (this.config.enableStructuredLogging) {
			await this.logStructuredError(structuredError)
		}

		// Update aggregations
		if (this.config.enableAggregation) {
			this.updateAggregation(structuredError)
		}

		return structuredError
	}

	/**
	 * Classify an error based on configured rules
	 */
	private classifyError(error: Error): ErrorClassificationRule {
		const errorMessage = error.message.toLowerCase()
		const errorName = error.name.toLowerCase()
		const errorStack = error.stack?.toLowerCase() || ''

		// Check each classification rule
		for (const rule of this.classificationRules) {
			const pattern =
				typeof rule.pattern === 'string' ? new RegExp(rule.pattern, 'i') : rule.pattern

			if (pattern.test(errorMessage) || pattern.test(errorName) || pattern.test(errorStack)) {
				return rule
			}
		}

		// Default classification for unknown errors
		return {
			pattern: /.*/,
			category: 'UNKNOWN_ERROR',
			severity: 'MEDIUM',
			retryable: false,
			troubleshooting: {
				possibleCauses: ['Unknown error occurred'],
				suggestedActions: ['Review error details and logs', 'Contact system administrator'],
			},
		}
	}

	/**
	 * Generate error code based on category and error details
	 */
	private generateErrorCode(category: ErrorCategory, error: Error): string {
		const categoryCode = category.replace('_ERROR', '').substring(0, 3).toUpperCase()
		const errorHash = this.hashString(error.message).substring(0, 6)
		return `${categoryCode}-${errorHash}`
	}

	/**
	 * Generate aggregation key for grouping similar errors
	 */
	private generateAggregationKey(
		category: ErrorCategory,
		message: string,
		component: string
	): string {
		// Normalize message by removing dynamic parts (IDs, timestamps, etc.)
		const normalizedMessage = message
			.replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, '[UUID]')
			.replace(/\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?\b/gi, '[TIMESTAMP]')
			.replace(/\b\d+\b/g, '[NUMBER]')
			.replace(/\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g, '[EMAIL]')

		return `${category}:${component}:${this.hashString(normalizedMessage)}`
	}

	/**
	 * Generate correlation ID
	 */
	private generateCorrelationId(): string {
		return `corr-${Date.now()}-${randomUUID().substring(0, 8)}`
	}

	/**
	 * Hash string for consistent key generation
	 */
	private hashString(str: string): string {
		let hash = 0
		for (let i = 0; i < str.length; i++) {
			const char = str.charCodeAt(i)
			hash = (hash << 5) - hash + char
			hash = hash & hash // Convert to 32-bit integer
		}
		return Math.abs(hash).toString(16)
	}

	/**
	 * Log structured error
	 */
	private async logStructuredError(error: StructuredError): Promise<void> {
		const logEntry = {
			level: this.mapSeverityToLogLevel(error.severity),
			timestamp: error.context.timestamp,
			correlationId: error.context.correlationId,
			errorId: error.id,
			category: error.category,
			severity: error.severity,
			code: error.code,
			message: error.message,
			component: error.context.component,
			operation: error.context.operation,
			userId: error.context.userId,
			sessionId: error.context.sessionId,
			requestId: error.context.requestId,
			retryable: error.retryable,
			aggregationKey: error.aggregationKey,
			metadata: error.context.metadata,
			environment: error.context.environment,
			troubleshooting: error.troubleshooting,
			stackTrace: error.context.stackTrace,
		}

		// Log to console (structured JSON)
		console.log(JSON.stringify(logEntry, null, 2))

		// Log to external logger if configured
		if (this.errorLogger) {
			await this.errorLogger.logError(error)
		}
	}

	/**
	 * Map severity to log level
	 */
	private mapSeverityToLogLevel(severity: ErrorSeverity): string {
		switch (severity) {
			case 'LOW':
				return 'WARN'
			case 'MEDIUM':
				return 'ERROR'
			case 'HIGH':
				return 'ERROR'
			case 'CRITICAL':
				return 'ERROR'
			default:
				return 'ERROR'
		}
	}

	/**
	 * Update error aggregation
	 */
	private updateAggregation(error: StructuredError): void {
		const key = error.aggregationKey
		const now = new Date().toISOString()

		if (this.aggregations.has(key)) {
			const aggregation = this.aggregations.get(key)!
			aggregation.count++
			aggregation.lastOccurrence = now
			aggregation.affectedComponents = [
				...new Set([...aggregation.affectedComponents, error.context.component]),
			]

			if (error.context.userId) {
				aggregation.affectedUsers = [
					...new Set([...aggregation.affectedUsers, error.context.userId]),
				]
			}

			// Add sample if under limit
			if (aggregation.samples.length < this.config.maxSamplesPerAggregation) {
				aggregation.samples.push(error)
			}

			// Calculate trend (simplified)
			const timeWindow = this.config.aggregationWindowMinutes * 60 * 1000
			const recentErrors = aggregation.samples.filter(
				(sample) => Date.now() - new Date(sample.context.timestamp).getTime() < timeWindow / 2
			)
			const olderErrors = aggregation.samples.filter((sample) => {
				const age = Date.now() - new Date(sample.context.timestamp).getTime()
				return age >= timeWindow / 2 && age < timeWindow
			})

			if (recentErrors.length > olderErrors.length * 1.5) {
				aggregation.trend = 'INCREASING'
			} else if (recentErrors.length < olderErrors.length * 0.5) {
				aggregation.trend = 'DECREASING'
			} else {
				aggregation.trend = 'STABLE'
			}

			// Calculate error rate (errors per minute)
			const windowStart = Date.now() - timeWindow
			const errorsInWindow = aggregation.samples.filter(
				(sample) => new Date(sample.context.timestamp).getTime() > windowStart
			).length
			aggregation.errorRate = errorsInWindow / this.config.aggregationWindowMinutes
		} else {
			// Create new aggregation
			const aggregation: ErrorAggregation = {
				aggregationKey: key,
				category: error.category,
				severity: error.severity,
				count: 1,
				firstOccurrence: now,
				lastOccurrence: now,
				affectedComponents: [error.context.component],
				affectedUsers: error.context.userId ? [error.context.userId] : [],
				errorRate: 1 / this.config.aggregationWindowMinutes,
				trend: 'STABLE',
				samples: [error],
			}

			this.aggregations.set(key, aggregation)
		}

		// Log aggregation if it's significant
		const aggregation = this.aggregations.get(key)!
		if (aggregation.count % 10 === 0 || aggregation.severity === 'CRITICAL') {
			void this.logAggregation(aggregation)
		}
	}

	/**
	 * Log error aggregation
	 */
	private async logAggregation(aggregation: ErrorAggregation): Promise<void> {
		const logEntry = {
			level: 'WARN',
			timestamp: new Date().toISOString(),
			type: 'ERROR_AGGREGATION',
			aggregationKey: aggregation.aggregationKey,
			category: aggregation.category,
			severity: aggregation.severity,
			count: aggregation.count,
			errorRate: aggregation.errorRate,
			trend: aggregation.trend,
			affectedComponents: aggregation.affectedComponents,
			affectedUsers: aggregation.affectedUsers.length,
			firstOccurrence: aggregation.firstOccurrence,
			lastOccurrence: aggregation.lastOccurrence,
		}

		console.log(JSON.stringify(logEntry, null, 2))

		// Always log to the error logger if available
		if (this.errorLogger) {
			await this.errorLogger.logAggregation(aggregation)
		}
	}

	/**
	 * Get error aggregations
	 */
	getAggregations(): ErrorAggregation[] {
		return Array.from(this.aggregations.values())
	}

	/**
	 * Get aggregation by key
	 */
	getAggregation(key: string): ErrorAggregation | undefined {
		return this.aggregations.get(key)
	}

	/**
	 * Clear old aggregations
	 */
	private startAggregationCleanup(): void {
		const cleanupInterval = this.config.aggregationWindowMinutes * 60 * 1000 // Same as window

		setInterval(() => {
			const cutoffTime = Date.now() - this.config.aggregationWindowMinutes * 60 * 1000 * 2 // Keep for 2x window

			for (const [key, aggregation] of this.aggregations.entries()) {
				if (new Date(aggregation.lastOccurrence).getTime() < cutoffTime) {
					this.aggregations.delete(key)
				}
			}
		}, cleanupInterval)
	}

	/**
	 * Set error logger
	 */
	setErrorLogger(logger: ErrorLogger): void {
		this.errorLogger = logger
	}

	/**
	 * Add classification rule
	 */
	addClassificationRule(rule: ErrorClassificationRule): void {
		this.classificationRules.unshift(rule) // Add to beginning for priority
	}

	/**
	 * Get error statistics
	 */
	getErrorStatistics(): {
		totalErrors: number
		errorsByCategory: Record<ErrorCategory, number>
		errorsBySeverity: Record<ErrorSeverity, number>
		topAggregations: ErrorAggregation[]
	} {
		const aggregations = this.getAggregations()
		const totalErrors = aggregations.reduce((sum, agg) => sum + agg.count, 0)

		const errorsByCategory = {} as Record<ErrorCategory, number>
		const errorsBySeverity = {} as Record<ErrorSeverity, number>

		for (const agg of aggregations) {
			errorsByCategory[agg.category] = (errorsByCategory[agg.category] || 0) + agg.count
			errorsBySeverity[agg.severity] = (errorsBySeverity[agg.severity] || 0) + agg.count
		}

		const topAggregations = aggregations.sort((a, b) => b.count - a.count).slice(0, 10)

		return {
			totalErrors,
			errorsByCategory,
			errorsBySeverity,
			topAggregations,
		}
	}
}
