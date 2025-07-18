/**
 * Tests for the health check system
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	CircuitBreakerHealthCheck,
	DatabaseHealthCheck,
	DEFAULT_HEALTH_CONFIG,
	HealthCheckService,
	ProcessingHealthCheck,
	QueueHealthCheck,
	RedisHealthCheck,
} from '../monitor/health-check.js'

import type {
	AuditMetrics,
	ComponentHealthCheck,
	HealthCheckConfig,
} from '../monitor/health-check.js'

describe('HealthCheckService', () => {
	let healthCheckService: HealthCheckService

	beforeEach(() => {
		healthCheckService = new HealthCheckService()
	})

	it('should register and unregister health checks', () => {
		const mockHealthCheck: ComponentHealthCheck = {
			name: 'test-component',
			check: vi.fn().mockResolvedValue({
				status: 'OK',
				message: 'Test component is healthy',
				lastCheck: new Date().toISOString(),
			}),
		}

		healthCheckService.registerHealthCheck(mockHealthCheck)
		healthCheckService.unregisterHealthCheck('test-component')

		// After unregistering, component should not be found
		expect(healthCheckService.checkComponent('test-component')).resolves.toBeNull()
	})

	it('should check all components and return overall status', async () => {
		const mockHealthCheck1: ComponentHealthCheck = {
			name: 'component1',
			check: vi.fn().mockResolvedValue({
				status: 'OK',
				message: 'Component 1 is healthy',
				lastCheck: new Date().toISOString(),
			}),
		}

		const mockHealthCheck2: ComponentHealthCheck = {
			name: 'component2',
			check: vi.fn().mockResolvedValue({
				status: 'WARNING',
				message: 'Component 2 has warnings',
				lastCheck: new Date().toISOString(),
			}),
		}

		healthCheckService.registerHealthCheck(mockHealthCheck1)
		healthCheckService.registerHealthCheck(mockHealthCheck2)

		const healthStatus = await healthCheckService.checkAllComponents()

		expect(healthStatus.status).toBe('WARNING') // Overall status should be WARNING
		expect(healthStatus.components.component1.status).toBe('OK')
		expect(healthStatus.components.component2.status).toBe('WARNING')
		expect(healthStatus.timestamp).toBeDefined()
	})

	it('should return CRITICAL status when any component is critical', async () => {
		const mockHealthCheck1: ComponentHealthCheck = {
			name: 'component1',
			check: vi.fn().mockResolvedValue({
				status: 'OK',
				message: 'Component 1 is healthy',
				lastCheck: new Date().toISOString(),
			}),
		}

		const mockHealthCheck2: ComponentHealthCheck = {
			name: 'component2',
			check: vi.fn().mockResolvedValue({
				status: 'CRITICAL',
				message: 'Component 2 is critical',
				lastCheck: new Date().toISOString(),
			}),
		}

		healthCheckService.registerHealthCheck(mockHealthCheck1)
		healthCheckService.registerHealthCheck(mockHealthCheck2)

		const healthStatus = await healthCheckService.checkAllComponents()

		expect(healthStatus.status).toBe('CRITICAL')
	})

	it('should handle health check timeouts', async () => {
		const config: HealthCheckConfig = {
			...DEFAULT_HEALTH_CONFIG,
			timeout: 100, // Very short timeout
			retryAttempts: 1,
		}

		const healthCheckService = new HealthCheckService(config)

		const slowHealthCheck: ComponentHealthCheck = {
			name: 'slow-component',
			check: vi.fn().mockImplementation(
				() => new Promise((resolve) => setTimeout(resolve, 200)) // Slower than timeout
			),
		}

		healthCheckService.registerHealthCheck(slowHealthCheck)

		const componentHealth = await healthCheckService.checkComponent('slow-component')

		expect(componentHealth?.status).toBe('CRITICAL')
		expect(componentHealth?.message).toContain('timeout')
	})

	it('should retry failed health checks', async () => {
		const config: HealthCheckConfig = {
			...DEFAULT_HEALTH_CONFIG,
			retryAttempts: 3,
			retryDelay: 10, // Short delay for testing
		}

		const healthCheckService = new HealthCheckService(config)

		let attemptCount = 0
		const flakyHealthCheck: ComponentHealthCheck = {
			name: 'flaky-component',
			check: vi.fn().mockImplementation(() => {
				attemptCount++
				if (attemptCount < 3) {
					throw new Error('Temporary failure')
				}
				return Promise.resolve({
					status: 'OK',
					message: 'Component recovered',
					lastCheck: new Date().toISOString(),
				})
			}),
		}

		healthCheckService.registerHealthCheck(flakyHealthCheck)

		const componentHealth = await healthCheckService.checkComponent('flaky-component')

		expect(componentHealth?.status).toBe('OK')
		expect(attemptCount).toBe(3) // Should have retried
	})
})

describe('DatabaseHealthCheck', () => {
	it('should return OK when database connection is healthy', async () => {
		const mockCheckConnection = vi.fn().mockResolvedValue(true)
		const dbHealthCheck = new DatabaseHealthCheck(mockCheckConnection)

		const health = await dbHealthCheck.check()

		expect(health.status).toBe('OK')
		expect(health.message).toContain('connection ok')
		expect(health.details?.connected).toBe(true)
		expect(health.responseTime).toBeDefined()
	})

	it('should return CRITICAL when database connection fails', async () => {
		const mockCheckConnection = vi.fn().mockResolvedValue(false)
		const dbHealthCheck = new DatabaseHealthCheck(mockCheckConnection)

		const health = await dbHealthCheck.check()

		expect(health.status).toBe('CRITICAL')
		expect(health.message).toContain('connection failed')
	})

	it('should return CRITICAL when database check throws error', async () => {
		const mockCheckConnection = vi.fn().mockRejectedValue(new Error('Connection timeout'))
		const dbHealthCheck = new DatabaseHealthCheck(mockCheckConnection)

		const health = await dbHealthCheck.check()

		expect(health.status).toBe('CRITICAL')
		expect(health.message).toContain('Connection timeout')
		expect(health.details?.error).toBe('Connection timeout')
	})

	it('should return WARNING for slow database responses', async () => {
		const mockCheckConnection = vi
			.fn()
			.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(true), 3000)))
		const dbHealthCheck = new DatabaseHealthCheck(mockCheckConnection)

		const health = await dbHealthCheck.check()

		expect(health.status).toBe('WARNING')
		expect(health.responseTime).toBeGreaterThan(2000)
	})
})

describe('RedisHealthCheck', () => {
	it('should return OK when Redis connection is ready', async () => {
		const mockGetConnectionStatus = vi.fn().mockReturnValue('ready')
		const redisHealthCheck = new RedisHealthCheck(mockGetConnectionStatus)

		const health = await redisHealthCheck.check()

		expect(health.status).toBe('OK')
		expect(health.message).toContain('ready')
		expect(health.details?.connectionStatus).toBe('ready')
	})

	it('should return CRITICAL when Redis connection is not ready', async () => {
		const mockGetConnectionStatus = vi.fn().mockReturnValue('connecting')
		const redisHealthCheck = new RedisHealthCheck(mockGetConnectionStatus)

		const health = await redisHealthCheck.check()

		expect(health.status).toBe('CRITICAL')
		expect(health.message).toContain('connecting')
	})

	it('should handle Redis connection status errors', async () => {
		const mockGetConnectionStatus = vi.fn().mockImplementation(() => {
			throw new Error('Redis connection error')
		})
		const redisHealthCheck = new RedisHealthCheck(mockGetConnectionStatus)

		const health = await redisHealthCheck.check()

		expect(health.status).toBe('CRITICAL')
		expect(health.message).toContain('Redis connection error')
	})
})

describe('QueueHealthCheck', () => {
	it('should return OK when queue is healthy', async () => {
		const mockGetQueueDepth = vi.fn().mockResolvedValue(50)
		const mockGetProcessingRate = vi.fn().mockResolvedValue(10)
		const queueHealthCheck = new QueueHealthCheck(mockGetQueueDepth, mockGetProcessingRate)

		const health = await queueHealthCheck.check()

		expect(health.status).toBe('OK')
		expect(health.message).toContain('normally')
		expect(health.details?.queueDepth).toBe(50)
		expect(health.details?.processingRate).toBe(10)
	})

	it('should return WARNING when queue depth is elevated', async () => {
		const mockGetQueueDepth = vi.fn().mockResolvedValue(150) // Above warning threshold
		const mockGetProcessingRate = vi.fn().mockResolvedValue(10)
		const queueHealthCheck = new QueueHealthCheck(mockGetQueueDepth, mockGetProcessingRate)

		const health = await queueHealthCheck.check()

		expect(health.status).toBe('WARNING')
		expect(health.message).toContain('elevated')
	})

	it('should return CRITICAL when queue depth is critically high', async () => {
		const mockGetQueueDepth = vi.fn().mockResolvedValue(600) // Above critical threshold
		const mockGetProcessingRate = vi.fn().mockResolvedValue(10)
		const queueHealthCheck = new QueueHealthCheck(mockGetQueueDepth, mockGetProcessingRate)

		const health = await queueHealthCheck.check()

		expect(health.status).toBe('CRITICAL')
		expect(health.message).toContain('critically high')
	})

	it('should handle queue check errors', async () => {
		const mockGetQueueDepth = vi.fn().mockRejectedValue(new Error('Queue unavailable'))
		const mockGetProcessingRate = vi.fn().mockResolvedValue(10)
		const queueHealthCheck = new QueueHealthCheck(mockGetQueueDepth, mockGetProcessingRate)

		const health = await queueHealthCheck.check()

		expect(health.status).toBe('CRITICAL')
		expect(health.message).toContain('Queue unavailable')
	})
})

describe('ProcessingHealthCheck', () => {
	it('should return OK when processing is healthy', async () => {
		const mockGetMetrics = vi.fn().mockResolvedValue({
			eventsProcessed: 100,
			processingLatency: 500,
			errorRate: 0.01, // 1%
			integrityViolations: 0,
		} as AuditMetrics)

		const processingHealthCheck = new ProcessingHealthCheck(mockGetMetrics)

		const health = await processingHealthCheck.check()

		expect(health.status).toBe('OK')
		expect(health.message).toContain('healthy')
		expect(health.details?.eventsProcessed).toBe(100)
		expect(health.details?.errorRate).toBe(0.01)
	})

	it('should return WARNING when error rate is elevated', async () => {
		const mockGetMetrics = vi.fn().mockResolvedValue({
			eventsProcessed: 100,
			processingLatency: 500,
			errorRate: 0.07, // 7% - above warning threshold
			integrityViolations: 0,
		} as AuditMetrics)

		const processingHealthCheck = new ProcessingHealthCheck(mockGetMetrics)

		const health = await processingHealthCheck.check()

		expect(health.status).toBe('WARNING')
		expect(health.message).toContain('Elevated error rate')
	})

	it('should return CRITICAL when error rate is critical', async () => {
		const mockGetMetrics = vi.fn().mockResolvedValue({
			eventsProcessed: 100,
			processingLatency: 500,
			errorRate: 0.15, // 15% - above critical threshold
			integrityViolations: 0,
		} as AuditMetrics)

		const processingHealthCheck = new ProcessingHealthCheck(mockGetMetrics)

		const health = await processingHealthCheck.check()

		expect(health.status).toBe('CRITICAL')
		expect(health.message).toContain('Critical error rate')
	})

	it('should return WARNING when processing latency is elevated', async () => {
		const mockGetMetrics = vi.fn().mockResolvedValue({
			eventsProcessed: 100,
			processingLatency: 3000, // 3s - above warning threshold
			errorRate: 0.01,
			integrityViolations: 0,
		} as AuditMetrics)

		const processingHealthCheck = new ProcessingHealthCheck(mockGetMetrics)

		const health = await processingHealthCheck.check()

		expect(health.status).toBe('WARNING')
		expect(health.message).toContain('Elevated processing latency')
	})

	it('should handle processing metrics errors', async () => {
		const mockGetMetrics = vi.fn().mockRejectedValue(new Error('Metrics unavailable'))
		const processingHealthCheck = new ProcessingHealthCheck(mockGetMetrics)

		const health = await processingHealthCheck.check()

		expect(health.status).toBe('CRITICAL')
		expect(health.message).toContain('Metrics unavailable')
	})
})

describe('CircuitBreakerHealthCheck', () => {
	it('should return OK when circuit breaker is closed', async () => {
		const mockGetState = vi.fn().mockResolvedValue('CLOSED')
		const cbHealthCheck = new CircuitBreakerHealthCheck(mockGetState)

		const health = await cbHealthCheck.check()

		expect(health.status).toBe('OK')
		expect(health.message).toContain('closed (normal operation)')
		expect(health.details?.state).toBe('CLOSED')
	})

	it('should return WARNING when circuit breaker is half-open', async () => {
		const mockGetState = vi.fn().mockResolvedValue('HALF_OPEN')
		const cbHealthCheck = new CircuitBreakerHealthCheck(mockGetState)

		const health = await cbHealthCheck.check()

		expect(health.status).toBe('WARNING')
		expect(health.message).toContain('half-open (testing recovery)')
	})

	it('should return CRITICAL when circuit breaker is open', async () => {
		const mockGetState = vi.fn().mockResolvedValue('OPEN')
		const cbHealthCheck = new CircuitBreakerHealthCheck(mockGetState)

		const health = await cbHealthCheck.check()

		expect(health.status).toBe('CRITICAL')
		expect(health.message).toContain('open (blocking requests)')
	})

	it('should return WARNING for unknown circuit breaker state', async () => {
		const mockGetState = vi.fn().mockResolvedValue('UNKNOWN')
		const cbHealthCheck = new CircuitBreakerHealthCheck(mockGetState)

		const health = await cbHealthCheck.check()

		expect(health.status).toBe('WARNING')
		expect(health.message).toContain('unknown state')
	})

	it('should handle circuit breaker state errors', async () => {
		const mockGetState = vi.fn().mockRejectedValue(new Error('Circuit breaker unavailable'))
		const cbHealthCheck = new CircuitBreakerHealthCheck(mockGetState)

		const health = await cbHealthCheck.check()

		expect(health.status).toBe('CRITICAL')
		expect(health.message).toContain('Circuit breaker unavailable')
	})
})
