/**
 * Tests for the monitoring and alerting system
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	ConsoleAlertHandler,
	DEFAULT_PATTERN_CONFIG,
	DefaultMetricsCollector,
	MonitoringService,
} from '../monitor/monitoring.js'

import type { Alert } from '../monitor/monitoring-types.js'
import type { PatternDetectionConfig } from '../monitor/monitoring.js'
import type { AuditLogEvent } from '../types.js'

describe('MonitoringService', () => {
	let monitoringService: MonitoringService
	let mockAlertHandler: any

	beforeEach(() => {
		mockAlertHandler = {
			sendAlert: vi.fn(),
			resolveAlert: vi.fn(),
			getActiveAlerts: vi.fn().mockResolvedValue([]),
		}

		monitoringService = new MonitoringService()
		monitoringService.addAlertHandler(mockAlertHandler)
	})

	describe('Failed Authentication Pattern Detection', () => {
		it('should detect failed authentication patterns', async () => {
			const events: AuditLogEvent[] = []
			const principalId = 'user-123'

			// Generate multiple failed auth events
			for (let i = 0; i < 6; i++) {
				events.push({
					timestamp: new Date().toISOString(),
					action: 'auth.login.failure',
					status: 'failure',
					principalId,
					sessionContext: {
						sessionId: `session-${i}`,
						ipAddress: '192.168.1.100',
						userAgent: 'Mozilla/5.0',
					},
				})
			}

			// Process events
			for (const event of events) {
				await monitoringService.processEvent(event)
			}

			// Verify alert was generated
			expect(mockAlertHandler.sendAlert).toHaveBeenCalled()
			const alertCall = mockAlertHandler.sendAlert.mock.calls[0][0] as Alert
			expect(alertCall.type).toBe('SECURITY')
			expect(alertCall.severity).toBe('HIGH')
			expect(alertCall.title).toContain('FAILED_AUTH')
		})

		it('should not trigger alert for failed auth below threshold', async () => {
			const events: AuditLogEvent[] = []
			const principalId = 'user-123'

			// Generate events below threshold
			for (let i = 0; i < 3; i++) {
				events.push({
					timestamp: new Date().toISOString(),
					action: 'auth.login.failure',
					status: 'failure',
					principalId,
				})
			}

			// Process events
			for (const event of events) {
				await monitoringService.processEvent(event)
			}

			// Verify no alert was generated
			expect(mockAlertHandler.sendAlert).not.toHaveBeenCalled()
		})
	})

	describe('Unauthorized Access Pattern Detection', () => {
		it('should detect unauthorized access patterns', async () => {
			const events: AuditLogEvent[] = []
			const principalId = 'user-456'

			// Generate multiple unauthorized access events
			for (let i = 0; i < 4; i++) {
				events.push({
					timestamp: new Date().toISOString(),
					action: 'data.read',
					status: 'failure',
					principalId,
					outcomeDescription: 'Access denied - unauthorized',
					targetResourceType: 'Patient',
					targetResourceId: `patient-${i}`,
				})
			}

			// Process events
			for (const event of events) {
				await monitoringService.processEvent(event)
			}

			// Verify alert was generated
			expect(mockAlertHandler.sendAlert).toHaveBeenCalled()
			const alertCall = mockAlertHandler.sendAlert.mock.calls[0][0] as Alert
			expect(alertCall.type).toBe('SECURITY')
			expect(alertCall.severity).toBe('CRITICAL')
			expect(alertCall.title).toContain('UNAUTHORIZED_ACCESS')
		})
	})

	describe('Data Velocity Pattern Detection', () => {
		it('should detect high-velocity data access patterns', async () => {
			const events: AuditLogEvent[] = []
			const principalId = 'user-789'

			// Generate high-velocity data access events during business hours to avoid off-hours detection
			const businessHoursDate = new Date()
			businessHoursDate.setHours(10, 0, 0, 0) // 10 AM

			for (let i = 0; i < 60; i++) {
				events.push({
					timestamp: businessHoursDate.toISOString(),
					action: 'fhir.patient.read',
					status: 'success',
					principalId,
					targetResourceType: 'Patient',
					targetResourceId: `patient-${i}`,
				})
			}

			// Process events
			for (const event of events) {
				await monitoringService.processEvent(event)
			}

			// Verify alert was generated - should be data velocity pattern
			expect(mockAlertHandler.sendAlert).toHaveBeenCalled()
			const alertCall = mockAlertHandler.sendAlert.mock.calls[0][0] as Alert
			expect(alertCall.type).toBe('SECURITY')
			expect(alertCall.severity).toBe('MEDIUM')
			expect(alertCall.title).toContain('DATA_VELOCITY')
		})
	})

	describe('Off-Hours Access Pattern Detection', () => {
		it('should detect off-hours access patterns', async () => {
			// Create event with off-hours timestamp (11 PM)
			const offHoursDate = new Date()
			offHoursDate.setHours(23, 0, 0, 0)

			const event: AuditLogEvent = {
				timestamp: offHoursDate.toISOString(),
				action: 'data.read',
				status: 'success',
				principalId: 'user-night',
				targetResourceType: 'Patient',
				targetResourceId: 'patient-123',
			}

			await monitoringService.processEvent(event)

			// Verify alert was generated
			expect(mockAlertHandler.sendAlert).toHaveBeenCalled()
			const alertCall = mockAlertHandler.sendAlert.mock.calls[0][0] as Alert
			expect(alertCall.type).toBe('SECURITY')
			expect(alertCall.severity).toBe('LOW')
			expect(alertCall.title).toContain('OFF_HOURS')
		})
	})

	describe('Bulk Operation Pattern Detection', () => {
		it('should detect bulk operation patterns', async () => {
			const events: AuditLogEvent[] = []

			// Generate bulk operation events during business hours to avoid off-hours detection
			const businessHoursDate = new Date()
			businessHoursDate.setHours(10, 0, 0, 0) // 10 AM

			for (let i = 0; i < 110; i++) {
				events.push({
					timestamp: businessHoursDate.toISOString(),
					action: 'data.export',
					status: 'success',
					principalId: `user-${i % 10}`,
					recordCount: 50,
				})
			}

			// Process events
			for (const event of events) {
				await monitoringService.processEvent(event)
			}

			// Verify alert was generated
			expect(mockAlertHandler.sendAlert).toHaveBeenCalled()
			const alertCall = mockAlertHandler.sendAlert.mock.calls[0][0] as Alert
			expect(alertCall.type).toBe('SECURITY')
			expect(alertCall.severity).toBe('MEDIUM')
			expect(alertCall.title).toContain('BULK_OPERATION')
		})
	})

	describe('Alert Management', () => {
		it('should resolve alerts correctly', async () => {
			// Generate an alert first
			const events: AuditLogEvent[] = []
			for (let i = 0; i < 6; i++) {
				events.push({
					timestamp: new Date().toISOString(),
					action: 'auth.login.failure',
					status: 'failure',
					principalId: 'user-123',
				})
			}

			for (const event of events) {
				await monitoringService.processEvent(event)
			}

			// Get the generated alert
			const activeAlerts = monitoringService.getActiveAlerts()
			expect(activeAlerts.length).toBeGreaterThan(0)

			const alertId = activeAlerts[0].id
			const resolvedBy = 'admin-user'

			// Resolve the alert
			await monitoringService.resolveAlert(alertId, resolvedBy)

			// Verify alert is resolved
			const remainingAlerts = monitoringService.getActiveAlerts()
			expect(remainingAlerts.length).toBe(0)

			// Verify handler was called
			expect(mockAlertHandler.resolveAlert).toHaveBeenCalledWith(alertId, resolvedBy)
		})
	})

	describe('Metrics Collection', () => {
		it('should collect and return metrics', async () => {
			const event: AuditLogEvent = {
				timestamp: new Date().toISOString(),
				action: 'data.read',
				status: 'success',
				principalId: 'user-123',
			}

			await monitoringService.processEvent(event)

			const metrics = monitoringService.getMetrics()
			expect(metrics.eventsProcessed).toBeGreaterThan(0)
			expect(metrics.timestamp).toBeDefined()
		})
	})

	describe('Health Status', () => {
		it('should return health status', async () => {
			const healthStatus = await monitoringService.getHealthStatus()

			expect(healthStatus.status).toBeDefined()
			expect(healthStatus.components).toBeDefined()
			expect(healthStatus.components.monitoring).toBeDefined()
			expect(healthStatus.components.alerting).toBeDefined()
			expect(healthStatus.components.patternDetection).toBeDefined()
			expect(healthStatus.timestamp).toBeDefined()
		})
	})
})

describe('DefaultMetricsCollector', () => {
	let metricsCollector: DefaultMetricsCollector

	beforeEach(() => {
		metricsCollector = new DefaultMetricsCollector()
	})

	it('should record events', () => {
		const event: AuditLogEvent = {
			timestamp: new Date().toISOString(),
			action: 'test.action',
			status: 'success',
		}

		metricsCollector.recordEvent(event)
		const metrics = metricsCollector.getMetrics()
		expect(metrics.eventsProcessed).toBe(1)
	})

	it('should record processing latency', () => {
		metricsCollector.recordProcessingLatency(100)
		metricsCollector.recordProcessingLatency(200)

		const metrics = metricsCollector.getMetrics()
		expect(metrics.processingLatency).toBe(125) // Simple moving average: (0 + 100) / 2 = 50, then (50 + 200) / 2 = 125
	})

	it('should record errors', () => {
		const error = new Error('Test error')
		metricsCollector.recordError(error)

		const metrics = metricsCollector.getMetrics()
		expect(metrics.errorRate).toBeGreaterThan(0)
	})

	it('should record integrity violations', () => {
		metricsCollector.recordIntegrityViolation()

		const metrics = metricsCollector.getMetrics()
		expect(metrics.integrityViolations).toBe(1)
	})

	it('should reset metrics', () => {
		const event: AuditLogEvent = {
			timestamp: new Date().toISOString(),
			action: 'test.action',
			status: 'success',
		}

		metricsCollector.recordEvent(event)
		metricsCollector.recordIntegrityViolation()

		let metrics = metricsCollector.getMetrics()
		expect(metrics.eventsProcessed).toBe(1)
		expect(metrics.integrityViolations).toBe(1)

		metricsCollector.resetMetrics()

		metrics = metricsCollector.getMetrics()
		expect(metrics.eventsProcessed).toBe(0)
		expect(metrics.integrityViolations).toBe(0)
	})
})

describe('ConsoleAlertHandler', () => {
	let consoleAlertHandler: ConsoleAlertHandler
	let consoleSpy: any

	beforeEach(() => {
		consoleAlertHandler = new ConsoleAlertHandler()
		consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
	})

	afterEach(() => {
		consoleSpy.mockRestore()
	})

	it('should send alerts to console', async () => {
		const alert: Alert = {
			id: 'test-alert-1',
			severity: 'HIGH',
			type: 'SECURITY',
			title: 'Test Alert',
			description: 'This is a test alert',
			timestamp: new Date().toISOString(),
			source: 'test',
			metadata: { test: true },
			resolved: false,
		}

		await consoleAlertHandler.sendAlert(alert)

		expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('🚨 ALERT [HIGH]: Test Alert'))
	})

	it('should resolve alerts', async () => {
		await consoleAlertHandler.resolveAlert('test-alert-1', 'admin')

		expect(consoleSpy).toHaveBeenCalledWith(
			expect.stringContaining('✅ Alert test-alert-1 resolved by admin')
		)
	})
})

describe('Pattern Detection Configuration', () => {
	it('should use custom configuration', async () => {
		const customConfig: PatternDetectionConfig = {
			...DEFAULT_PATTERN_CONFIG,
			failedAuthThreshold: 2, // Lower threshold for testing
		}

		const monitoringService = new MonitoringService(customConfig)
		const mockHandler = {
			sendAlert: vi.fn(),
			resolveAlert: vi.fn(),
			getActiveAlerts: vi.fn().mockResolvedValue([]),
		}
		monitoringService.addAlertHandler(mockHandler)

		// Generate events that would trigger with lower threshold
		const events: AuditLogEvent[] = []
		for (let i = 0; i < 3; i++) {
			events.push({
				timestamp: new Date().toISOString(),
				action: 'auth.login.failure',
				status: 'failure',
				principalId: 'user-123',
			})
		}

		for (const event of events) {
			await monitoringService.processEvent(event)
		}

		// Should trigger alert with lower threshold
		expect(mockHandler.sendAlert).toHaveBeenCalled()
	})
})
