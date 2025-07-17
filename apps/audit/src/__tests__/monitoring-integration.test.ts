/**
 * Integration tests for audit worker monitoring and alerting
 */

import { Hono } from 'hono'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
	ConsoleAlertHandler,
	DatabaseHealthCheck,
	HealthCheckService,
	MonitoringService,
	RedisHealthCheck,
} from '@repo/audit'

import type { AuditLogEvent } from '@repo/audit'

// Mock dependencies
vi.mock('@repo/redis-client', () => ({
	getSharedRedisConnection: vi.fn().mockReturnValue({
		on: vi.fn(),
	}),
	getRedisConnectionStatus: vi.fn().mockReturnValue('ready'),
	closeSharedRedisConnection: vi.fn(),
}))

vi.mock('@repo/audit-db', () => ({
	AuditDb: vi.fn().mockImplementation(() => ({
		checkAuditDbConnection: vi.fn().mockResolvedValue(true),
		getDrizzleInstance: vi.fn().mockReturnValue({
			insert: vi.fn().mockReturnValue({
				values: vi.fn().mockResolvedValue({}),
			}),
		}),
		end: vi.fn(),
	})),
}))

describe('Audit Worker Monitoring Integration', () => {
	let app: Hono
	let monitoringService: MonitoringService
	let healthCheckService: HealthCheckService

	beforeEach(() => {
		app = new Hono()
		monitoringService = new MonitoringService()
		healthCheckService = new HealthCheckService()

		// Add alert handler
		monitoringService.addAlertHandler(new ConsoleAlertHandler())

		// Register health checks
		healthCheckService.registerHealthCheck(new DatabaseHealthCheck(() => Promise.resolve(true)))
		healthCheckService.registerHealthCheck(new RedisHealthCheck(() => 'ready'))

		// Setup routes similar to the actual worker
		app.get('/healthz', async (c) => {
			try {
				const healthStatus = await healthCheckService.checkAllComponents()

				if (healthStatus.status === 'OK') {
					return c.json(healthStatus)
				} else {
					c.status(healthStatus.status === 'CRITICAL' ? 503 : 200)
					return c.json(healthStatus)
				}
			} catch (error) {
				c.status(503)
				return c.json({
					status: 'CRITICAL',
					error: error instanceof Error ? error.message : 'Unknown error',
					timestamp: new Date().toISOString(),
				})
			}
		})

		app.get('/metrics', async (c) => {
			try {
				const metrics = monitoringService.getMetrics()
				return c.json({ monitoring: metrics })
			} catch (error) {
				c.status(500)
				return c.json({
					error: 'Failed to collect metrics',
					message: error instanceof Error ? error.message : 'Unknown error',
				})
			}
		})

		app.get('/alerts', async (c) => {
			try {
				const activeAlerts = monitoringService.getActiveAlerts()
				return c.json({
					alerts: activeAlerts,
					count: activeAlerts.length,
					timestamp: new Date().toISOString(),
				})
			} catch (error) {
				c.status(500)
				return c.json({
					error: 'Failed to get alerts',
					message: error instanceof Error ? error.message : 'Unknown error',
				})
			}
		})

		app.post('/alerts/:alertId/resolve', async (c) => {
			const alertId = c.req.param('alertId')
			const body = await c.req.json().catch(() => ({}))
			const resolvedBy = body.resolvedBy || 'system'

			try {
				await monitoringService.resolveAlert(alertId, resolvedBy)
				return c.json({
					success: true,
					message: `Alert ${alertId} resolved by ${resolvedBy}`,
					timestamp: new Date().toISOString(),
				})
			} catch (error) {
				c.status(500)
				return c.json({
					error: 'Failed to resolve alert',
					message: error instanceof Error ? error.message : 'Unknown error',
				})
			}
		})

		app.get('/health/:component', async (c) => {
			const componentName = c.req.param('component')

			try {
				const componentHealth = await healthCheckService.checkComponent(componentName)

				if (!componentHealth) {
					c.status(404)
					return c.json({
						error: 'Component not found',
						component: componentName,
					})
				}

				const statusCode =
					componentHealth.status === 'CRITICAL'
						? 503
						: componentHealth.status === 'WARNING'
							? 200
							: 200

				c.status(statusCode)
				return c.json(componentHealth)
			} catch (error) {
				c.status(500)
				return c.json({
					error: 'Failed to check component health',
					message: error instanceof Error ? error.message : 'Unknown error',
				})
			}
		})
	})

	describe('Health Check Endpoints', () => {
		it('should return healthy status when all components are OK', async () => {
			const req = new Request('http://localhost/healthz')
			const res = await app.fetch(req)
			const data = await res.json()

			expect(res.status).toBe(200)
			expect(data.status).toBe('OK')
			expect(data.components).toBeDefined()
			expect(data.components.database).toBeDefined()
			expect(data.components.redis).toBeDefined()
		})

		it('should return specific component health', async () => {
			const req = new Request('http://localhost/health/database')
			const res = await app.fetch(req)
			const data = await res.json()

			expect(res.status).toBe(200)
			expect(data.status).toBe('OK')
			expect(data.message).toContain('connection')
		})

		it('should return 404 for unknown component', async () => {
			const req = new Request('http://localhost/health/unknown')
			const res = await app.fetch(req)
			const data = await res.json()

			expect(res.status).toBe(404)
			expect(data.error).toBe('Component not found')
			expect(data.component).toBe('unknown')
		})
	})

	describe('Metrics Endpoints', () => {
		it('should return monitoring metrics', async () => {
			// Process some events first
			const event: AuditLogEvent = {
				timestamp: new Date().toISOString(),
				action: 'test.action',
				status: 'success',
				principalId: 'test-user',
			}

			await monitoringService.processEvent(event)

			const req = new Request('http://localhost/metrics')
			const res = await app.fetch(req)
			const data = await res.json()

			expect(res.status).toBe(200)
			expect(data.monitoring).toBeDefined()
			expect(data.monitoring.eventsProcessed).toBeGreaterThan(0)
			expect(data.monitoring.timestamp).toBeDefined()
		})
	})

	describe('Alert Endpoints', () => {
		it('should return active alerts', async () => {
			// Generate some failed auth events to trigger an alert
			const events: AuditLogEvent[] = []
			for (let i = 0; i < 6; i++) {
				events.push({
					timestamp: new Date().toISOString(),
					action: 'auth.login.failure',
					status: 'failure',
					principalId: 'test-user',
				})
			}

			// Process events to generate alerts
			for (const event of events) {
				await monitoringService.processEvent(event)
			}

			const req = new Request('http://localhost/alerts')
			const res = await app.fetch(req)
			const data = await res.json()

			expect(res.status).toBe(200)
			expect(data.alerts).toBeDefined()
			expect(data.count).toBeGreaterThan(0)
			expect(data.timestamp).toBeDefined()
		})

		it('should resolve alerts', async () => {
			// Generate an alert first
			const events: AuditLogEvent[] = []
			for (let i = 0; i < 6; i++) {
				events.push({
					timestamp: new Date().toISOString(),
					action: 'auth.login.failure',
					status: 'failure',
					principalId: 'test-user',
				})
			}

			for (const event of events) {
				await monitoringService.processEvent(event)
			}

			// Get the alert ID
			const activeAlerts = monitoringService.getActiveAlerts()
			expect(activeAlerts.length).toBeGreaterThan(0)

			const alertId = activeAlerts[0].id

			// Resolve the alert
			const req = new Request(`http://localhost/alerts/${alertId}/resolve`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ resolvedBy: 'test-admin' }),
			})

			const res = await app.fetch(req)
			const data = await res.json()

			expect(res.status).toBe(200)
			expect(data.success).toBe(true)
			expect(data.message).toContain('resolved by test-admin')

			// Verify alert is resolved
			const remainingAlerts = monitoringService.getActiveAlerts()
			expect(remainingAlerts.length).toBe(0)
		})
	})

	describe('Pattern Detection Integration', () => {
		it('should detect and alert on suspicious patterns', async () => {
			const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

			// Generate failed authentication pattern
			const events: AuditLogEvent[] = []
			for (let i = 0; i < 6; i++) {
				events.push({
					timestamp: new Date().toISOString(),
					action: 'auth.login.failure',
					status: 'failure',
					principalId: 'suspicious-user',
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

			// Verify alert was logged to console
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('🚨 ALERT [HIGH]'))
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('FAILED_AUTH'))

			// Verify alert is active
			const activeAlerts = monitoringService.getActiveAlerts()
			expect(activeAlerts.length).toBeGreaterThan(0)
			expect(activeAlerts[0].severity).toBe('HIGH')
			expect(activeAlerts[0].type).toBe('SECURITY')

			consoleSpy.mockRestore()
		})

		it('should detect unauthorized access patterns', async () => {
			const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

			// Generate unauthorized access pattern
			const events: AuditLogEvent[] = []
			for (let i = 0; i < 4; i++) {
				events.push({
					timestamp: new Date().toISOString(),
					action: 'data.read',
					status: 'failure',
					principalId: 'unauthorized-user',
					outcomeDescription: 'Access denied - unauthorized',
					targetResourceType: 'Patient',
					targetResourceId: `patient-${i}`,
				})
			}

			// Process events
			for (const event of events) {
				await monitoringService.processEvent(event)
			}

			// Verify critical alert was generated
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('🚨 ALERT [CRITICAL]'))
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('UNAUTHORIZED_ACCESS'))

			const activeAlerts = monitoringService.getActiveAlerts()
			expect(activeAlerts.length).toBeGreaterThan(0)
			expect(activeAlerts[0].severity).toBe('CRITICAL')

			consoleSpy.mockRestore()
		})

		it('should detect high-velocity data access', async () => {
			const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

			// Generate high-velocity data access pattern
			const events: AuditLogEvent[] = []
			for (let i = 0; i < 60; i++) {
				events.push({
					timestamp: new Date().toISOString(),
					action: 'fhir.patient.read',
					status: 'success',
					principalId: 'data-scraper',
					targetResourceType: 'Patient',
					targetResourceId: `patient-${i}`,
				})
			}

			// Process events
			for (const event of events) {
				await monitoringService.processEvent(event)
			}

			// Verify medium severity alert was generated
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('🚨 ALERT [MEDIUM]'))
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('DATA_VELOCITY'))

			const activeAlerts = monitoringService.getActiveAlerts()
			expect(activeAlerts.length).toBeGreaterThan(0)
			expect(activeAlerts[0].severity).toBe('MEDIUM')

			consoleSpy.mockRestore()
		})
	})

	describe('Error Handling', () => {
		it('should handle health check service errors gracefully', async () => {
			// Create a health check service that throws errors
			const faultyHealthCheckService = new HealthCheckService()
			faultyHealthCheckService.registerHealthCheck({
				name: 'faulty-component',
				check: vi.fn().mockRejectedValue(new Error('Component failure')),
			})

			// Override the app's health check to use the faulty service
			app.get('/healthz-faulty', async (c) => {
				try {
					const healthStatus = await faultyHealthCheckService.checkAllComponents()
					return c.json(healthStatus)
				} catch (error) {
					c.status(503)
					return c.json({
						status: 'CRITICAL',
						error: error instanceof Error ? error.message : 'Unknown error',
						timestamp: new Date().toISOString(),
					})
				}
			})

			const req = new Request('http://localhost/healthz-faulty')
			const res = await app.fetch(req)
			const data = await res.json()

			expect(res.status).toBe(200) // Health check service handles errors internally
			expect(data.status).toBe('CRITICAL')
			expect(data.components['faulty-component'].status).toBe('CRITICAL')
		})

		it('should handle metrics collection errors', async () => {
			// Create a monitoring service that throws errors
			const faultyMonitoringService = new MonitoringService()
			vi.spyOn(faultyMonitoringService, 'getMetrics').mockImplementation(() => {
				throw new Error('Metrics collection failed')
			})

			// Override the app's metrics endpoint
			app.get('/metrics-faulty', async (c) => {
				try {
					const metrics = faultyMonitoringService.getMetrics()
					return c.json({ monitoring: metrics })
				} catch (error) {
					c.status(500)
					return c.json({
						error: 'Failed to collect metrics',
						message: error instanceof Error ? error.message : 'Unknown error',
					})
				}
			})

			const req = new Request('http://localhost/metrics-faulty')
			const res = await app.fetch(req)
			const data = await res.json()

			expect(res.status).toBe(500)
			expect(data.error).toBe('Failed to collect metrics')
			expect(data.message).toBe('Metrics collection failed')
		})
	})
})
