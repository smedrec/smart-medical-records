/**
 * Shared types for monitoring and health check systems
 */

/**
 * Audit metrics interface
 */
export interface AuditMetrics {
	eventsProcessed: number
	processingLatency: number
	queueDepth: number
	errorRate: number
	integrityViolations: number
	timestamp: string
	alertsGenerated: number
	suspiciousPatterns: number
}

/**
 * Individual component health status
 */
export interface ComponentHealth {
	status: 'OK' | 'WARNING' | 'CRITICAL'
	message?: string
	details?: Record<string, any>
	responseTime?: number
	lastCheck: string
}

/**
 * Health status interface
 */
export interface HealthStatus {
	status: 'OK' | 'WARNING' | 'CRITICAL'
	components: {
		[key: string]: ComponentHealth
	}
	timestamp: string
}

/**
 * Alert severity levels
 */
export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

/**
 * Alert types for categorization
 */
export type AlertType = 'SECURITY' | 'COMPLIANCE' | 'PERFORMANCE' | 'SYSTEM'

/**
 * Alert interface
 */
export interface Alert {
	id: string
	severity: AlertSeverity
	type: AlertType
	title: string
	description: string
	timestamp: string
	source: string
	metadata: Record<string, any>
	resolved: boolean
	resolvedAt?: string
	resolvedBy?: string
	correlationId?: string
}
