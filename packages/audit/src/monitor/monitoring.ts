/**
 * Real-time monitoring and alerting system for audit events
 * Implements suspicious pattern detection, alert generation, and metrics collection
 */

import type { AuditLogEvent } from '../types.js'
import type {
	Alert,
	AlertSeverity,
	AlertType,
	AuditMetrics,
	HealthStatus,
} from './monitoring-types.js'

/**
 * Pattern detection configuration
 */
export interface PatternDetectionConfig {
	// Failed authentication thresholds
	failedAuthThreshold: number
	failedAuthTimeWindow: number // in milliseconds

	// Unauthorized access detection
	unauthorizedAccessThreshold: number
	unauthorizedAccessTimeWindow: number

	// Suspicious data access patterns
	dataAccessVelocityThreshold: number
	dataAccessTimeWindow: number

	// Bulk operations detection
	bulkOperationThreshold: number
	bulkOperationTimeWindow: number

	// Off-hours access detection
	offHoursStart: number // hour (0-23)
	offHoursEnd: number // hour (0-23)
}

/**
 * Default pattern detection configuration
 */
export const DEFAULT_PATTERN_CONFIG: PatternDetectionConfig = {
	failedAuthThreshold: 5,
	failedAuthTimeWindow: 5 * 60 * 1000, // 5 minutes
	unauthorizedAccessThreshold: 3,
	unauthorizedAccessTimeWindow: 10 * 60 * 1000, // 10 minutes
	dataAccessVelocityThreshold: 50,
	dataAccessTimeWindow: 60 * 1000, // 1 minute
	bulkOperationThreshold: 100,
	bulkOperationTimeWindow: 5 * 60 * 1000, // 5 minutes
	offHoursStart: 22, // 10 PM
	offHoursEnd: 6, // 6 AM
}

/**
 * Suspicious pattern detection results
 */
export interface PatternDetectionResult {
	patterns: SuspiciousPattern[]
	alerts: Alert[]
}

/**
 * Suspicious pattern interface
 */
export interface SuspiciousPattern {
	type: 'FAILED_AUTH' | 'UNAUTHORIZED_ACCESS' | 'DATA_VELOCITY' | 'BULK_OPERATION' | 'OFF_HOURS'
	severity: AlertSeverity
	description: string
	events: AuditLogEvent[]
	metadata: Record<string, any>
	timestamp: string
}

/**
 * Alert handler interface
 */
export interface AlertHandler {
	sendAlert(alert: Alert): Promise<void>
	resolveAlert(alertId: string, resolvedBy: string): Promise<void>
	getActiveAlerts(): Promise<Alert[]>
}

/**
 * Metrics collector interface
 */
export interface MetricsCollector {
	recordEvent(event: AuditLogEvent): void
	recordProcessingLatency(latency: number): void
	recordError(error: Error): void
	recordIntegrityViolation(): void
	getMetrics(): AuditMetrics
	resetMetrics(): void
}

/**
 * Real-time monitoring service
 */
export class MonitoringService {
	private events: AuditLogEvent[] = []
	private alerts: Alert[] = []
	private metrics: AuditMetrics
	private config: PatternDetectionConfig
	private alertHandlers: AlertHandler[] = []
	private metricsCollector: MetricsCollector

	constructor(
		config: PatternDetectionConfig = DEFAULT_PATTERN_CONFIG,
		metricsCollector?: MetricsCollector
	) {
		this.config = config
		this.metrics = this.initializeMetrics()
		this.metricsCollector = metricsCollector || new DefaultMetricsCollector()
	}

	/**
	 * Initialize metrics with default values
	 */
	private initializeMetrics(): AuditMetrics {
		return {
			eventsProcessed: 0,
			processingLatency: 0,
			queueDepth: 0,
			errorRate: 0,
			integrityViolations: 0,
			timestamp: new Date().toISOString(),
			alertsGenerated: 0,
			suspiciousPatterns: 0,
		}
	}

	/**
	 * Add an alert handler
	 */
	addAlertHandler(handler: AlertHandler): void {
		this.alertHandlers.push(handler)
	}

	/**
	 * Process audit event for monitoring
	 */
	async processEvent(event: AuditLogEvent): Promise<void> {
		// Store event for pattern analysis
		this.events.push(event)
		this.metricsCollector.recordEvent(event)

		// Keep only recent events for pattern detection
		const cutoffTime =
			Date.now() -
			Math.max(
				this.config.failedAuthTimeWindow,
				this.config.unauthorizedAccessTimeWindow,
				this.config.dataAccessTimeWindow,
				this.config.bulkOperationTimeWindow
			)

		this.events = this.events.filter((e) => new Date(e.timestamp).getTime() > cutoffTime)

		// Detect suspicious patterns
		const detectionResult = await this.detectSuspiciousPatterns([event])

		// Generate alerts for detected patterns
		for (const alert of detectionResult.alerts) {
			await this.generateAlert(alert)
		}

		// Update metrics
		this.metrics.eventsProcessed++
		this.metrics.suspiciousPatterns += detectionResult.patterns.length
		this.metrics.timestamp = new Date().toISOString()
	}

	/**
	 * Detect suspicious patterns in audit events
	 */
	async detectSuspiciousPatterns(newEvents: AuditLogEvent[]): Promise<PatternDetectionResult> {
		const patterns: SuspiciousPattern[] = []
		const alerts: Alert[] = []

		// Combine new events with existing events for analysis
		const allEvents = [...this.events, ...newEvents]

		// 1. Failed authentication attempts
		const failedAuthPattern = this.detectFailedAuthPattern(allEvents)
		if (failedAuthPattern) {
			patterns.push(failedAuthPattern)
			alerts.push(this.createAlertFromPattern(failedAuthPattern))
		}

		// 2. Unauthorized access attempts
		const unauthorizedAccessPattern = this.detectUnauthorizedAccessPattern(allEvents)
		if (unauthorizedAccessPattern) {
			patterns.push(unauthorizedAccessPattern)
			alerts.push(this.createAlertFromPattern(unauthorizedAccessPattern))
		}

		// 3. High-velocity data access
		const dataVelocityPattern = this.detectDataVelocityPattern(allEvents)
		if (dataVelocityPattern) {
			patterns.push(dataVelocityPattern)
			alerts.push(this.createAlertFromPattern(dataVelocityPattern))
		}

		// 4. Bulk operations
		const bulkOperationPattern = this.detectBulkOperationPattern(allEvents)
		if (bulkOperationPattern) {
			patterns.push(bulkOperationPattern)
			alerts.push(this.createAlertFromPattern(bulkOperationPattern))
		}

		// 5. Off-hours access
		const offHoursPattern = this.detectOffHoursPattern(allEvents)
		if (offHoursPattern) {
			patterns.push(offHoursPattern)
			alerts.push(this.createAlertFromPattern(offHoursPattern))
		}

		return { patterns, alerts }
	}

	/**
	 * Detect failed authentication patterns
	 */
	private detectFailedAuthPattern(events: AuditLogEvent[]): SuspiciousPattern | null {
		const now = Date.now()
		const cutoffTime = now - this.config.failedAuthTimeWindow

		const failedAuthEvents = events.filter(
			(event) =>
				event.action.includes('auth.login.failure') &&
				event.status === 'failure' &&
				new Date(event.timestamp).getTime() > cutoffTime
		)

		// Group by principal ID or IP address
		const groupedEvents = new Map<string, AuditLogEvent[]>()

		for (const event of failedAuthEvents) {
			const key = event.principalId || event.sessionContext?.ipAddress || 'unknown'
			if (!groupedEvents.has(key)) {
				groupedEvents.set(key, [])
			}
			groupedEvents.get(key)!.push(event)
		}

		// Check if any group exceeds threshold
		for (const [key, groupEvents] of groupedEvents) {
			if (groupEvents.length >= this.config.failedAuthThreshold) {
				return {
					type: 'FAILED_AUTH',
					severity: 'HIGH',
					description: `${groupEvents.length} failed authentication attempts detected from ${key} within ${this.config.failedAuthTimeWindow / 1000} seconds`,
					events: groupEvents,
					metadata: {
						source: key,
						attemptCount: groupEvents.length,
						timeWindow: this.config.failedAuthTimeWindow,
					},
					timestamp: new Date().toISOString(),
				}
			}
		}

		return null
	}

	/**
	 * Detect unauthorized access patterns
	 */
	private detectUnauthorizedAccessPattern(events: AuditLogEvent[]): SuspiciousPattern | null {
		const now = Date.now()
		const cutoffTime = now - this.config.unauthorizedAccessTimeWindow

		const unauthorizedEvents = events.filter(
			(event) =>
				event.status === 'failure' &&
				(event.outcomeDescription?.toLowerCase().includes('unauthorized') ||
					event.outcomeDescription?.toLowerCase().includes('access denied') ||
					event.outcomeDescription?.toLowerCase().includes('forbidden')) &&
				new Date(event.timestamp).getTime() > cutoffTime
		)

		// Group by principal ID
		const groupedEvents = new Map<string, AuditLogEvent[]>()

		for (const event of unauthorizedEvents) {
			const key = event.principalId || 'unknown'
			if (!groupedEvents.has(key)) {
				groupedEvents.set(key, [])
			}
			groupedEvents.get(key)!.push(event)
		}

		// Check if any group exceeds threshold
		for (const [key, groupEvents] of groupedEvents) {
			if (groupEvents.length >= this.config.unauthorizedAccessThreshold) {
				return {
					type: 'UNAUTHORIZED_ACCESS',
					severity: 'CRITICAL',
					description: `${groupEvents.length} unauthorized access attempts detected from principal ${key} within ${this.config.unauthorizedAccessTimeWindow / 1000} seconds`,
					events: groupEvents,
					metadata: {
						principalId: key,
						attemptCount: groupEvents.length,
						timeWindow: this.config.unauthorizedAccessTimeWindow,
					},
					timestamp: new Date().toISOString(),
				}
			}
		}

		return null
	}

	/**
	 * Detect high-velocity data access patterns
	 */
	private detectDataVelocityPattern(events: AuditLogEvent[]): SuspiciousPattern | null {
		const now = Date.now()
		const cutoffTime = now - this.config.dataAccessTimeWindow

		const dataAccessEvents = events.filter(
			(event) =>
				(event.action.includes('data.read') ||
					event.action.includes('fhir.') ||
					event.targetResourceType) &&
				event.status === 'success' &&
				new Date(event.timestamp).getTime() > cutoffTime
		)

		// Group by principal ID
		const groupedEvents = new Map<string, AuditLogEvent[]>()

		for (const event of dataAccessEvents) {
			const key = event.principalId || 'unknown'
			if (!groupedEvents.has(key)) {
				groupedEvents.set(key, [])
			}
			groupedEvents.get(key)!.push(event)
		}

		// Check if any group exceeds threshold
		for (const [key, groupEvents] of groupedEvents) {
			if (groupEvents.length >= this.config.dataAccessVelocityThreshold) {
				return {
					type: 'DATA_VELOCITY',
					severity: 'MEDIUM',
					description: `${groupEvents.length} data access operations detected from principal ${key} within ${this.config.dataAccessTimeWindow / 1000} seconds`,
					events: groupEvents,
					metadata: {
						principalId: key,
						accessCount: groupEvents.length,
						timeWindow: this.config.dataAccessTimeWindow,
						resourceTypes: [
							...new Set(groupEvents.map((e) => e.targetResourceType).filter(Boolean)),
						],
					},
					timestamp: new Date().toISOString(),
				}
			}
		}

		return null
	}

	/**
	 * Detect bulk operation patterns
	 */
	private detectBulkOperationPattern(events: AuditLogEvent[]): SuspiciousPattern | null {
		const now = Date.now()
		const cutoffTime = now - this.config.bulkOperationTimeWindow

		const bulkEvents = events.filter(
			(event) =>
				(event.action.includes('data.export') ||
					event.action.includes('data.import') ||
					event.action.includes('bulk') ||
					(event as any).recordCount > 10) &&
				new Date(event.timestamp).getTime() > cutoffTime
		)

		if (bulkEvents.length >= this.config.bulkOperationThreshold) {
			return {
				type: 'BULK_OPERATION',
				severity: 'MEDIUM',
				description: `${bulkEvents.length} bulk operations detected within ${this.config.bulkOperationTimeWindow / 1000} seconds`,
				events: bulkEvents,
				metadata: {
					operationCount: bulkEvents.length,
					timeWindow: this.config.bulkOperationTimeWindow,
					totalRecords: bulkEvents.reduce((sum, e) => sum + ((e as any).recordCount || 1), 0),
				},
				timestamp: new Date().toISOString(),
			}
		}

		return null
	}

	/**
	 * Detect off-hours access patterns
	 */
	private detectOffHoursPattern(events: AuditLogEvent[]): SuspiciousPattern | null {
		const offHoursEvents = events.filter((event) => {
			const eventTime = new Date(event.timestamp)
			const hour = eventTime.getHours()

			// Check if event occurred during off-hours
			const isOffHours =
				this.config.offHoursStart > this.config.offHoursEnd
					? hour >= this.config.offHoursStart || hour < this.config.offHoursEnd
					: hour >= this.config.offHoursStart && hour < this.config.offHoursEnd

			return (
				isOffHours &&
				(event.action.includes('data.') || event.action.includes('fhir.')) &&
				event.status === 'success'
			)
		})

		if (offHoursEvents.length > 0) {
			return {
				type: 'OFF_HOURS',
				severity: 'LOW',
				description: `${offHoursEvents.length} data access operations detected during off-hours (${this.config.offHoursStart}:00 - ${this.config.offHoursEnd}:00)`,
				events: offHoursEvents,
				metadata: {
					accessCount: offHoursEvents.length,
					offHoursStart: this.config.offHoursStart,
					offHoursEnd: this.config.offHoursEnd,
					principals: [...new Set(offHoursEvents.map((e) => e.principalId).filter(Boolean))],
				},
				timestamp: new Date().toISOString(),
			}
		}

		return null
	}

	/**
	 * Create alert from suspicious pattern
	 */
	private createAlertFromPattern(pattern: SuspiciousPattern): Alert {
		return {
			id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			severity: pattern.severity,
			type: 'SECURITY',
			title: `Suspicious Pattern Detected: ${pattern.type}`,
			description: pattern.description,
			timestamp: pattern.timestamp,
			source: 'audit-monitoring',
			metadata: {
				patternType: pattern.type,
				eventCount: pattern.events.length,
				...pattern.metadata,
			},
			resolved: false,
		}
	}

	/**
	 * Generate and send alert
	 */
	private async generateAlert(alert: Alert): Promise<void> {
		this.alerts.push(alert)
		this.metrics.alertsGenerated++

		// Send alert through all registered handlers
		for (const handler of this.alertHandlers) {
			try {
				await handler.sendAlert(alert)
			} catch (error) {
				console.error('Failed to send alert through handler:', error)
			}
		}
	}

	/**
	 * Get current metrics
	 */
	getMetrics(): AuditMetrics {
		return { ...this.metrics, ...this.metricsCollector.getMetrics() }
	}

	/**
	 * Get active alerts
	 */
	getActiveAlerts(): Alert[] {
		return this.alerts.filter((alert) => !alert.resolved)
	}

	/**
	 * Resolve an alert
	 */
	async resolveAlert(alertId: string, resolvedBy: string): Promise<void> {
		const alert = this.alerts.find((a) => a.id === alertId)
		if (alert) {
			alert.resolved = true
			alert.resolvedAt = new Date().toISOString()
			alert.resolvedBy = resolvedBy

			// Notify handlers
			for (const handler of this.alertHandlers) {
				try {
					await handler.resolveAlert(alertId, resolvedBy)
				} catch (error) {
					console.error('Failed to resolve alert through handler:', error)
				}
			}
		}
	}

	/**
	 * Get system health status
	 */
	async getHealthStatus(): Promise<HealthStatus> {
		const now = new Date().toISOString()
		const metrics = this.getMetrics()

		// Determine overall health based on metrics
		let overallStatus: 'OK' | 'WARNING' | 'CRITICAL' = 'OK'

		if (metrics.errorRate > 0.1) {
			// 10% error rate
			overallStatus = 'CRITICAL'
		} else if (metrics.errorRate > 0.05 || metrics.processingLatency > 5000) {
			// 5% error rate or 5s latency
			overallStatus = 'WARNING'
		}

		return {
			status: overallStatus,
			components: {
				monitoring: {
					status: 'OK',
					message: `Processing ${metrics.eventsProcessed} events`,
					lastCheck: now,
				},
				alerting: {
					status: this.getActiveAlerts().length > 10 ? 'WARNING' : 'OK',
					message: `${this.getActiveAlerts().length} active alerts`,
					lastCheck: now,
				},
				patternDetection: {
					status: metrics.suspiciousPatterns > 5 ? 'WARNING' : 'OK',
					message: `${metrics.suspiciousPatterns} suspicious patterns detected`,
					lastCheck: now,
				},
			},
			timestamp: now,
		}
	}
}

/**
 * Default metrics collector implementation
 */
export class DefaultMetricsCollector implements MetricsCollector {
	private metrics: AuditMetrics

	constructor() {
		this.metrics = {
			eventsProcessed: 0,
			processingLatency: 0,
			queueDepth: 0,
			errorRate: 0,
			integrityViolations: 0,
			timestamp: new Date().toISOString(),
			alertsGenerated: 0,
			suspiciousPatterns: 0,
		}
	}

	recordEvent(event: AuditLogEvent): void {
		this.metrics.eventsProcessed++
		this.metrics.timestamp = new Date().toISOString()
	}

	recordProcessingLatency(latency: number): void {
		// Simple moving average
		this.metrics.processingLatency = (this.metrics.processingLatency + latency) / 2
	}

	recordError(error: Error): void {
		// Simple error rate calculation
		this.metrics.errorRate = Math.min(this.metrics.errorRate + 0.01, 1.0)
	}

	recordIntegrityViolation(): void {
		this.metrics.integrityViolations++
	}

	getMetrics(): AuditMetrics {
		return { ...this.metrics }
	}

	resetMetrics(): void {
		this.metrics = {
			eventsProcessed: 0,
			processingLatency: 0,
			queueDepth: 0,
			errorRate: 0,
			integrityViolations: 0,
			timestamp: new Date().toISOString(),
			alertsGenerated: 0,
			suspiciousPatterns: 0,
		}
	}
}

/**
 * Console alert handler for development/testing
 */
export class ConsoleAlertHandler implements AlertHandler {
	async sendAlert(alert: Alert): Promise<void> {
		console.log(`🚨 ALERT [${alert.severity}]: ${alert.title}`)
		console.log(`   Description: ${alert.description}`)
		console.log(`   Source: ${alert.source}`)
		console.log(`   Timestamp: ${alert.timestamp}`)
		console.log(`   Metadata:`, alert.metadata)
	}

	async resolveAlert(alertId: string, resolvedBy: string): Promise<void> {
		console.log(`✅ Alert ${alertId} resolved by ${resolvedBy}`)
	}

	async getActiveAlerts(): Promise<Alert[]> {
		// Console handler doesn't store alerts
		return []
	}
}
