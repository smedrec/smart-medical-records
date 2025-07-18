/**
 * Integration tests for complete reliable event processing flow
 */

import { Redis } from 'ioredis'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { CircuitBreaker } from '../queue/circuit-breaker.js'
import { DeadLetterHandler } from '../queue/dead-letter-queue.js'
import { ReliableEventProcessor } from '../queue/reliable-processor.js'
import { executeWithRetry } from '../retry.js'

import type { AuditLogEvent } from '../types.js'

// Mock Redis and BullMQ
vi.mock('ioredis')
vi.mock('bullmq')

describe('Reliable Event Processing Integration', () => {
	let mockRedis: vi.Mocked<Redis>
	let mockDatabase: {
		insert: vi.Mock
		isConnected: vi.Mock
	}

	beforeEach(() => {
		vi.useFakeTimers()

		mockRedis = new Redis() as vi.Mocked<Redis>
		mockDatabase = {
			insert: vi.fn().mockResolvedValue({ id: 1 }),
			isConnected: vi.fn().mockReturnValue(true),
		}
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe('End-to-end event processing', () => {
		it('should process audit events successfully through the complete pipeline', async () => {
			const auditEvent: AuditLogEvent = {
				timestamp: '2023-01-01T00:00:00.000Z',
				action: 'user.login',
				status: 'success',
				principalId: 'user-123',
				targetResourceType: 'User',
				targetResourceId: 'user-123',
			}

			// Mock successful database operation
			const eventProcessor = vi.fn().mockImplementation(async (event: AuditLogEvent) => {
				await mockDatabase.insert(event)
			})

			const processor = new ReliableEventProcessor(mockRedis, eventProcessor, {
				queueName: 'integration-test-queue',
				concurrency: 1,
				retryConfig: {
					maxRetries: 3,
					backoffStrategy: 'exponential',
					baseDelay: 100,
					maxDelay: 1000,
					retryableErrors: ['ECONNRESET', 'ETIMEDOUT'],
				},
				circuitBreakerConfig: {
					failureThreshold: 3,
					recoveryTimeout: 2000,
					monitoringPeriod: 60000,
					minimumThroughput: 5,
				},
				deadLetterConfig: {
					queueName: 'integration-test-dlq',
					maxRetentionDays: 7,
					alertThreshold: 5,
					processingInterval: 30000,
				},
				persistentStorage: true,
				durabilityGuarantees: true,
			})

			await processor.start()
			await processor.addEvent(auditEvent)

			// Simulate event processing
			await (processor as any).processJobWithReliability({
				id: 'test-job-1',
				data: auditEvent,
				timestamp: Date.now(),
			})

			expect(eventProcessor).toHaveBeenCalledWith(auditEvent)
			expect(mockDatabase.insert).toHaveBeenCalledWith(auditEvent)

			await processor.cleanup()
		})

		it('should handle database failures with retry and recovery', async () => {
			const auditEvent: AuditLogEvent = {
				timestamp: '2023-01-01T00:00:00.000Z',
				action: 'data.update',
				status: 'success',
				principalId: 'user-456',
				targetResourceType: 'Patient',
				targetResourceId: 'patient-789',
			}

			// Mock database failures followed by success
			let attemptCount = 0
			const eventProcessor = vi.fn().mockImplementation(async (event: AuditLogEvent) => {
				attemptCount++
				if (attemptCount <= 2) {
					const error = new Error('Database connection failed')
					;(error as any).code = 'ECONNRESET'
					throw error
				}
				await mockDatabase.insert(event)
			})

			const processor = new ReliableEventProcessor(mockRedis, eventProcessor, {
				queueName: 'retry-test-queue',
				concurrency: 1,
				retryConfig: {
					maxRetries: 5,
					backoffStrategy: 'exponential',
					baseDelay: 50,
					maxDelay: 500,
					retryableErrors: ['ECONNRESET', 'ETIMEDOUT'],
					jitter: false,
				},
				circuitBreakerConfig: {
					failureThreshold: 10,
					recoveryTimeout: 1000,
					monitoringPeriod: 60000,
					minimumThroughput: 5,
				},
				deadLetterConfig: {
					queueName: 'retry-test-dlq',
					maxRetentionDays: 7,
					alertThreshold: 10,
					processingInterval: 30000,
				},
				persistentStorage: true,
				durabilityGuarantees: true,
			})

			await processor.start()

			// Process event with retries
			const result = await executeWithRetry(() => eventProcessor(auditEvent), {
				maxRetries: 5,
				backoffStrategy: 'exponential',
				baseDelay: 50,
				maxDelay: 500,
				retryableErrors: ['ECONNRESET', 'ETIMEDOUT'],
				jitter: false,
			})

			expect(result.success).toBe(true)
			expect(result.attempts).toHaveLength(2) // 2 failures before success
			expect(eventProcessor).toHaveBeenCalledTimes(3) // 1 initial + 2 retries
			expect(mockDatabase.insert).toHaveBeenCalledWith(auditEvent)

			await processor.cleanup()
		})

		it('should handle circuit breaker opening and recovery', async () => {
			const auditEvents: AuditLogEvent[] = Array(10)
				.fill(null)
				.map((_, i) => ({
					timestamp: new Date().toISOString(),
					action: `test.action.${i}`,
					status: 'success' as const,
					principalId: `user-${i}`,
				}))

			let failureCount = 0
			const eventProcessor = vi.fn().mockImplementation(async (event: AuditLogEvent) => {
				failureCount++
				if (failureCount <= 8) {
					throw new Error('Service unavailable')
				}
				// Service recovers after 8 failures
				await mockDatabase.insert(event)
			})

			const circuitBreaker = new CircuitBreaker(
				{
					failureThreshold: 5,
					recoveryTimeout: 1000,
					monitoringPeriod: 60000,
					minimumThroughput: 3,
				},
				'integration-test-cb'
			)

			// Process events through circuit breaker
			let successCount = 0
			let circuitOpenCount = 0

			for (const event of auditEvents) {
				try {
					await circuitBreaker.execute(() => eventProcessor(event))
					successCount++
				} catch (error) {
					if (error.message.includes('Circuit breaker')) {
						circuitOpenCount++
					}
				}

				// Simulate time passing for recovery
				if (circuitBreaker.getState() === 'OPEN') {
					vi.advanceTimersByTime(1100) // Past recovery timeout
				}
			}

			expect(circuitBreaker.getState()).toBe('CLOSED') // Should recover
			expect(successCount).toBeGreaterThan(0)
			expect(circuitOpenCount).toBeGreaterThan(0)

			const metrics = circuitBreaker.getMetrics()
			expect(metrics.totalRequests).toBe(auditEvents.length)
			expect(metrics.stateChanges.length).toBeGreaterThan(0)
		})

		it('should send events to dead letter queue after max retries', async () => {
			const auditEvent: AuditLogEvent = {
				timestamp: '2023-01-01T00:00:00.000Z',
				action: 'critical.operation',
				status: 'failure',
				principalId: 'user-critical',
				targetResourceType: 'CriticalResource',
				targetResourceId: 'critical-123',
			}

			// Mock persistent failure
			const eventProcessor = vi.fn().mockRejectedValue(new Error('Persistent database failure'))

			const deadLetterHandler = new DeadLetterHandler(mockRedis, {
				queueName: 'dlq-test-queue',
				maxRetentionDays: 7,
				alertThreshold: 1,
				processingInterval: 30000,
			})

			const alertCallback = vi.fn()
			deadLetterHandler.onAlert(alertCallback)

			// Mock the dead letter queue operations
			const mockDLQueue = {
				add: vi.fn().mockResolvedValue({ id: 'dlq-job-1' }),
				getJobs: vi.fn().mockResolvedValue([
					{
						data: {
							originalEvent: auditEvent,
							failureReason: 'Persistent database failure',
							firstFailureTime: new Date().toISOString(),
						},
					},
				]),
			}

			;(deadLetterHandler as any).dlQueue = mockDLQueue

			// Attempt to process with retries
			const retryResult = await executeWithRetry(() => eventProcessor(auditEvent), {
				maxRetries: 3,
				backoffStrategy: 'exponential',
				baseDelay: 50,
				maxDelay: 200,
				retryableErrors: ['ECONNRESET', 'ETIMEDOUT'],
			})

			expect(retryResult.success).toBe(false)
			expect(retryResult.attempts).toHaveLength(4) // 1 initial + 3 retries

			// Send to dead letter queue
			await deadLetterHandler.addFailedEvent(
				auditEvent,
				retryResult.error!,
				'failed-job-123',
				'main-queue',
				retryResult.attempts.map((attempt) => ({
					attempt: attempt.attempt,
					timestamp: attempt.timestamp,
					error: attempt.error.message,
				}))
			)

			expect(mockDLQueue.add).toHaveBeenCalledWith(
				'dead-letter-event',
				expect.objectContaining({
					originalEvent: auditEvent,
					failureReason: 'Persistent database failure',
					failureCount: 4,
					originalJobId: 'failed-job-123',
					originalQueueName: 'main-queue',
				}),
				expect.any(Object)
			)

			// Check if alert was triggered
			expect(alertCallback).toHaveBeenCalledWith(
				expect.objectContaining({
					totalEvents: 1,
				})
			)
		})

		it('should handle high-volume processing with mixed outcomes', async () => {
			const events: AuditLogEvent[] = Array(50)
				.fill(null)
				.map((_, i) => ({
					timestamp: new Date().toISOString(),
					action: `bulk.operation.${i}`,
					status: 'success' as const,
					principalId: `user-${i}`,
					targetResourceType: 'BulkResource',
					targetResourceId: `resource-${i}`,
				}))

			let processedCount = 0
			const eventProcessor = vi.fn().mockImplementation(async (event: AuditLogEvent) => {
				processedCount++

				// Simulate various failure scenarios
				if (processedCount % 7 === 0) {
					throw new Error('Network timeout')
				}
				if (processedCount % 11 === 0) {
					const error = new Error('Database connection lost')
					;(error as any).code = 'ECONNRESET'
					throw error
				}
				if (processedCount % 13 === 0) {
					throw new Error('Validation error') // Non-retryable
				}

				await mockDatabase.insert(event)
			})

			const processor = new ReliableEventProcessor(mockRedis, eventProcessor, {
				queueName: 'bulk-test-queue',
				concurrency: 5,
				retryConfig: {
					maxRetries: 3,
					backoffStrategy: 'exponential',
					baseDelay: 10,
					maxDelay: 100,
					retryableErrors: ['ECONNRESET', 'ETIMEDOUT'],
				},
				circuitBreakerConfig: {
					failureThreshold: 10,
					recoveryTimeout: 500,
					monitoringPeriod: 60000,
					minimumThroughput: 5,
				},
				deadLetterConfig: {
					queueName: 'bulk-test-dlq',
					maxRetentionDays: 7,
					alertThreshold: 20,
					processingInterval: 30000,
				},
				persistentStorage: true,
				durabilityGuarantees: true,
			})

			await processor.start()

			// Process all events
			const results = await Promise.allSettled(
				events.map(async (event) => {
					try {
						await (processor as any).processJobWithReliability({
							id: `bulk-job-${event.principalId}`,
							data: event,
							timestamp: Date.now(),
						})
						return 'success'
					} catch (error) {
						return 'failed'
					}
				})
			)

			const successCount = results.filter(
				(r) => r.status === 'fulfilled' && r.value === 'success'
			).length
			const failureCount = results.filter(
				(r) => r.status === 'fulfilled' && r.value === 'failed'
			).length

			expect(successCount).toBeGreaterThan(0)
			expect(failureCount).toBeGreaterThan(0)
			expect(successCount + failureCount).toBe(events.length)

			const healthStatus = await processor.getHealthStatus()
			expect(healthStatus.processorMetrics.totalProcessed).toBe(events.length)

			await processor.cleanup()
		})
	})

	describe('System resilience scenarios', () => {
		it('should handle Redis connection failures gracefully', async () => {
			const auditEvent: AuditLogEvent = {
				timestamp: '2023-01-01T00:00:00.000Z',
				action: 'redis.test',
				status: 'success',
				principalId: 'user-redis-test',
			}

			// Mock Redis connection issues
			mockRedis.status = 'connecting'

			const eventProcessor = vi.fn().mockResolvedValue(undefined)

			const processor = new ReliableEventProcessor(mockRedis, eventProcessor, {
				queueName: 'redis-test-queue',
				concurrency: 1,
				retryConfig: {
					maxRetries: 2,
					backoffStrategy: 'fixed',
					baseDelay: 100,
					maxDelay: 100,
					retryableErrors: ['ECONNRESET'],
				},
				circuitBreakerConfig: {
					failureThreshold: 5,
					recoveryTimeout: 1000,
					monitoringPeriod: 60000,
					minimumThroughput: 3,
				},
				deadLetterConfig: {
					queueName: 'redis-test-dlq',
					maxRetentionDays: 7,
					alertThreshold: 10,
					processingInterval: 30000,
				},
				persistentStorage: true,
				durabilityGuarantees: true,
			})

			// Should handle Redis connection issues without crashing
			expect(() => processor.start()).not.toThrow()

			// Redis recovers
			mockRedis.status = 'ready'

			await processor.addEvent(auditEvent)
			await processor.cleanup()
		})

		it('should maintain data consistency during partial failures', async () => {
			const events: AuditLogEvent[] = [
				{
					timestamp: '2023-01-01T00:00:00.000Z',
					action: 'consistency.test.1',
					status: 'success',
					principalId: 'user-1',
				},
				{
					timestamp: '2023-01-01T00:00:01.000Z',
					action: 'consistency.test.2',
					status: 'success',
					principalId: 'user-2',
				},
				{
					timestamp: '2023-01-01T00:00:02.000Z',
					action: 'consistency.test.3',
					status: 'success',
					principalId: 'user-3',
				},
			]

			const processedEvents: AuditLogEvent[] = []
			const eventProcessor = vi.fn().mockImplementation(async (event: AuditLogEvent) => {
				// Second event fails
				if (event.principalId === 'user-2') {
					throw new Error('Simulated failure')
				}
				processedEvents.push(event)
				await mockDatabase.insert(event)
			})

			const processor = new ReliableEventProcessor(mockRedis, eventProcessor, {
				queueName: 'consistency-test-queue',
				concurrency: 1,
				retryConfig: {
					maxRetries: 1,
					backoffStrategy: 'fixed',
					baseDelay: 50,
					maxDelay: 50,
					retryableErrors: [],
				},
				circuitBreakerConfig: {
					failureThreshold: 10,
					recoveryTimeout: 1000,
					monitoringPeriod: 60000,
					minimumThroughput: 5,
				},
				deadLetterConfig: {
					queueName: 'consistency-test-dlq',
					maxRetentionDays: 7,
					alertThreshold: 5,
					processingInterval: 30000,
				},
				persistentStorage: true,
				durabilityGuarantees: true,
			})

			await processor.start()

			// Process events sequentially
			for (const event of events) {
				try {
					await (processor as any).processJobWithReliability({
						id: `consistency-job-${event.principalId}`,
						data: event,
						timestamp: Date.now(),
					})
				} catch {
					// Expected for user-2
				}
			}

			// Verify only successful events were processed
			expect(processedEvents).toHaveLength(2)
			expect(processedEvents.map((e) => e.principalId)).toEqual(['user-1', 'user-3'])
			expect(mockDatabase.insert).toHaveBeenCalledTimes(2)

			await processor.cleanup()
		})
	})

	describe('Performance and monitoring', () => {
		it('should track processing latency correctly', async () => {
			const auditEvent: AuditLogEvent = {
				timestamp: '2023-01-01T00:00:00.000Z',
				action: 'latency.test',
				status: 'success',
				principalId: 'user-latency-test',
			}

			const eventProcessor = vi.fn().mockImplementation(async (event: AuditLogEvent) => {
				// Simulate processing delay
				await new Promise((resolve) => setTimeout(resolve, 100))
				await mockDatabase.insert(event)
			})

			const processor = new ReliableEventProcessor(mockRedis, eventProcessor, {
				queueName: 'latency-test-queue',
				concurrency: 1,
				retryConfig: {
					maxRetries: 1,
					backoffStrategy: 'fixed',
					baseDelay: 50,
					maxDelay: 50,
					retryableErrors: [],
				},
				circuitBreakerConfig: {
					failureThreshold: 5,
					recoveryTimeout: 1000,
					monitoringPeriod: 60000,
					minimumThroughput: 3,
				},
				deadLetterConfig: {
					queueName: 'latency-test-dlq',
					maxRetentionDays: 7,
					alertThreshold: 10,
					processingInterval: 30000,
				},
				persistentStorage: true,
				durabilityGuarantees: true,
			})

			await processor.start()

			const startTime = Date.now()
			await (processor as any).processJobWithReliability({
				id: 'latency-job',
				data: auditEvent,
				timestamp: startTime,
				processedOn: startTime + 150,
			})

			const metrics = processor.getMetrics()
			expect(metrics.averageProcessingTime).toBeGreaterThan(0)

			await processor.cleanup()
		})

		it('should provide comprehensive health status', async () => {
			const processor = new ReliableEventProcessor(
				mockRedis,
				vi.fn().mockResolvedValue(undefined),
				{
					queueName: 'health-test-queue',
					concurrency: 2,
					retryConfig: {
						maxRetries: 3,
						backoffStrategy: 'exponential',
						baseDelay: 100,
						maxDelay: 1000,
						retryableErrors: ['ECONNRESET'],
					},
					circuitBreakerConfig: {
						failureThreshold: 5,
						recoveryTimeout: 2000,
						monitoringPeriod: 60000,
						minimumThroughput: 5,
					},
					deadLetterConfig: {
						queueName: 'health-test-dlq',
						maxRetentionDays: 7,
						alertThreshold: 10,
						processingInterval: 30000,
					},
					persistentStorage: true,
					durabilityGuarantees: true,
				}
			)

			await processor.start()

			const healthStatus = await processor.getHealthStatus()

			expect(healthStatus).toMatchObject({
				isRunning: true,
				circuitBreakerState: 'CLOSED',
				queueDepth: expect.any(Number),
				processorMetrics: expect.objectContaining({
					totalProcessed: expect.any(Number),
					successfullyProcessed: expect.any(Number),
					failedProcessed: expect.any(Number),
					averageProcessingTime: expect.any(Number),
				}),
				circuitBreakerMetrics: expect.objectContaining({
					totalRequests: expect.any(Number),
					failureRate: expect.any(Number),
				}),
				deadLetterMetrics: expect.objectContaining({
					totalEvents: expect.any(Number),
				}),
				healthScore: expect.any(Number),
			})

			expect(healthStatus.healthScore).toBeGreaterThanOrEqual(0)
			expect(healthStatus.healthScore).toBeLessThanOrEqual(100)

			await processor.cleanup()
		})
	})
})
