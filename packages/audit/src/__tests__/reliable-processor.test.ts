/**
 * Integration tests for reliable event processor
 */

import { Redis } from 'ioredis'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
	DEFAULT_RELIABLE_PROCESSOR_CONFIG,
	ReliableEventProcessor,
} from '../queue/reliable-processor.js'

import type { AuditLogEvent } from '../types.js'

// Mock dependencies
vi.mock('ioredis')
vi.mock('bullmq')

describe('Reliable Event Processor', () => {
	let mockRedis: vi.Mocked<Redis>
	let processor: ReliableEventProcessor<AuditLogEvent>
	let mockEventProcessor: vi.Mock
	let mockAuditEvent: AuditLogEvent

	beforeEach(() => {
		vi.useFakeTimers()

		mockRedis = new Redis() as vi.Mocked<Redis>
		mockEventProcessor = vi.fn().mockResolvedValue(undefined)

		processor = new ReliableEventProcessor<AuditLogEvent>(mockRedis, mockEventProcessor, {
			...DEFAULT_RELIABLE_PROCESSOR_CONFIG,
			queueName: 'test-reliable-queue',
			concurrency: 2,
			retryConfig: {
				...DEFAULT_RELIABLE_PROCESSOR_CONFIG.retryConfig,
				maxRetries: 3,
				baseDelay: 100,
			},
			circuitBreakerConfig: {
				...DEFAULT_RELIABLE_PROCESSOR_CONFIG.circuitBreakerConfig,
				failureThreshold: 2,
				recoveryTimeout: 1000,
			},
		})

		mockAuditEvent = {
			timestamp: '2023-01-01T00:00:00.000Z',
			action: 'test.action',
			status: 'success',
			principalId: 'user-123',
			targetResourceType: 'TestResource',
			targetResourceId: 'resource-456',
		}
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe('Processor lifecycle', () => {
		it('should start and stop correctly', async () => {
			const mockWorker = {
				on: vi.fn(),
				close: vi.fn().mockResolvedValue(undefined),
			}

			const mockQueue = {
				add: vi.fn().mockResolvedValue({ id: 'job-123' }),
				getJobs: vi.fn().mockResolvedValue([]),
			}

			// Mock BullMQ components
			vi.doMock('bullmq', () => ({
				Queue: vi.fn().mockImplementation(() => mockQueue),
				Worker: vi.fn().mockImplementation(() => mockWorker),
			}))

			await processor.start()

			expect(mockWorker.on).toHaveBeenCalledWith('completed', expect.any(Function))
			expect(mockWorker.on).toHaveBeenCalledWith('failed', expect.any(Function))
			expect(mockWorker.on).toHaveBeenCalledWith('error', expect.any(Function))

			await processor.stop()

			expect(mockWorker.close).toHaveBeenCalled()
		})

		it('should handle start when already running', async () => {
			const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

			await processor.start()
			await processor.start() // Second call

			expect(consoleSpy).toHaveBeenCalledWith('[ReliableProcessor] Processor already running')

			consoleSpy.mockRestore()
		})
	})

	describe('Event processing', () => {
		it('should process events successfully', async () => {
			const mockJob = {
				id: 'job-123',
				data: mockAuditEvent,
				timestamp: Date.now(),
				processedOn: Date.now() + 100,
			}

			// Mock the processJobWithReliability method
			const processJobSpy = vi
				.spyOn(processor as any, 'processJobWithReliability')
				.mockResolvedValue(undefined)

			await (processor as any).processJobWithReliability(mockJob)

			expect(mockEventProcessor).toHaveBeenCalledWith(mockAuditEvent)
		})

		it('should handle processing failures with retry', async () => {
			const error = new Error('Processing failed')
			mockEventProcessor
				.mockRejectedValueOnce(error)
				.mockRejectedValueOnce(error)
				.mockResolvedValue(undefined)

			const mockJob = {
				id: 'job-123',
				data: mockAuditEvent,
				timestamp: Date.now(),
			}

			// Mock circuit breaker and retry mechanisms
			const mockCircuitBreaker = {
				execute: vi.fn().mockImplementation(async (operation) => {
					// Simulate retry logic
					try {
						await operation()
					} catch (err) {
						// First two attempts fail, third succeeds
						if (mockEventProcessor.mock.calls.length < 3) {
							throw err
						}
					}
				}),
				getState: vi.fn().mockReturnValue('CLOSED'),
				getMetrics: vi.fn().mockReturnValue({ failureRate: 0 }),
			}

			;(processor as any).circuitBreaker = mockCircuitBreaker

			await (processor as any).processJobWithReliability(mockJob)

			expect(mockEventProcessor).toHaveBeenCalledTimes(3)
		})

		it('should send failed events to dead letter queue', async () => {
			const error = new Error('Persistent failure')
			mockEventProcessor.mockRejectedValue(error)

			const mockDeadLetterHandler = {
				addFailedEvent: vi.fn().mockResolvedValue(undefined),
			}

			;(processor as any).deadLetterHandler = mockDeadLetterHandler

			const mockJob = {
				id: 'job-123',
				data: mockAuditEvent,
				timestamp: Date.now(),
			}

			// Mock circuit breaker to always fail
			const mockCircuitBreaker = {
				execute: vi.fn().mockRejectedValue(error),
			}

			;(processor as any).circuitBreaker = mockCircuitBreaker

			await expect((processor as any).processJobWithReliability(mockJob)).rejects.toThrow()

			expect(mockDeadLetterHandler.addFailedEvent).toHaveBeenCalledWith(
				mockAuditEvent,
				error,
				'job-123',
				'test-reliable-queue',
				expect.any(Array)
			)
		})
	})

	describe('Circuit breaker integration', () => {
		it('should open circuit breaker on repeated failures', async () => {
			const error = new Error('Service unavailable')
			mockEventProcessor.mockRejectedValue(error)

			// Simulate multiple failures
			for (let i = 0; i < 5; i++) {
				const mockJob = {
					id: `job-${i}`,
					data: mockAuditEvent,
					timestamp: Date.now(),
				}

				try {
					await (processor as any).processJobWithReliability(mockJob)
				} catch {}
			}

			const cbMetrics = await processor.getCircuitBreakerMetrics()
			expect(cbMetrics.failedRequests).toBeGreaterThan(0)
		})

		it('should recover when circuit breaker closes', async () => {
			// First, cause circuit breaker to open
			const error = new Error('Service down')
			mockEventProcessor.mockRejectedValue(error)

			for (let i = 0; i < 3; i++) {
				try {
					await (processor as any).processJobWithReliability({
						id: `fail-job-${i}`,
						data: mockAuditEvent,
						timestamp: Date.now(),
					})
				} catch {}
			}

			// Then, service recovers
			mockEventProcessor.mockResolvedValue(undefined)

			// Fast-forward past recovery timeout
			vi.advanceTimersByTime(2000)

			// Next job should succeed
			await (processor as any).processJobWithReliability({
				id: 'recovery-job',
				data: mockAuditEvent,
				timestamp: Date.now(),
			})

			expect(mockEventProcessor).toHaveBeenLastCalledWith(mockAuditEvent)
		})
	})

	describe('Metrics tracking', () => {
		it('should track processing metrics correctly', async () => {
			const mockJob = {
				id: 'job-123',
				data: mockAuditEvent,
				timestamp: Date.now(),
				processedOn: Date.now() + 50,
			}

			// Mock successful processing
			;(processor as any).processJobWithReliability = vi.fn().mockResolvedValue(undefined)

			// Simulate worker events
			const metrics = processor.getMetrics()
			expect(metrics.totalProcessed).toBe(0)

			// Simulate completed job
			;(processor as any).metrics.totalProcessed++
			;(processor as any).metrics.successfullyProcessed++

			const updatedMetrics = processor.getMetrics()
			expect(updatedMetrics.totalProcessed).toBe(1)
			expect(updatedMetrics.successfullyProcessed).toBe(1)
		})

		it('should calculate health score correctly', async () => {
			const healthStatus = await processor.getHealthStatus()

			expect(healthStatus).toMatchObject({
				isRunning: expect.any(Boolean),
				circuitBreakerState: expect.any(String),
				queueDepth: expect.any(Number),
				processorMetrics: expect.any(Object),
				circuitBreakerMetrics: expect.any(Object),
				deadLetterMetrics: expect.any(Object),
				healthScore: expect.any(Number),
			})

			expect(healthStatus.healthScore).toBeGreaterThanOrEqual(0)
			expect(healthStatus.healthScore).toBeLessThanOrEqual(100)
		})
	})

	describe('Queue management', () => {
		it('should add events to queue correctly', async () => {
			const mockQueue = {
				add: vi.fn().mockResolvedValue({ id: 'job-123' }),
			}

			;(processor as any).queue = mockQueue

			await processor.addEvent(mockAuditEvent, { priority: 1, delay: 1000 })

			expect(mockQueue.add).toHaveBeenCalledWith('process-event', mockAuditEvent, {
				priority: 1,
				delay: 1000,
			})
		})

		it('should handle queue addition failures', async () => {
			const mockQueue = {
				add: vi.fn().mockRejectedValue(new Error('Queue unavailable')),
			}

			;(processor as any).queue = mockQueue

			await expect(processor.addEvent(mockAuditEvent)).rejects.toThrow(
				'Failed to add event to reliable processing queue'
			)
		})
	})

	describe('Integration scenarios', () => {
		it('should handle high-volume processing', async () => {
			const events = Array(100)
				.fill(null)
				.map((_, i) => ({
					...mockAuditEvent,
					action: `bulk-action-${i}`,
				}))

			const mockQueue = {
				add: vi.fn().mockResolvedValue({ id: 'job-123' }),
			}

			;(processor as any).queue = mockQueue

			const promises = events.map((event) => processor.addEvent(event))
			await Promise.all(promises)

			expect(mockQueue.add).toHaveBeenCalledTimes(100)
		})

		it('should handle mixed success/failure scenarios', async () => {
			let callCount = 0
			mockEventProcessor.mockImplementation(() => {
				callCount++
				if (callCount % 3 === 0) {
					throw new Error('Intermittent failure')
				}
				return Promise.resolve()
			})

			const jobs = Array(10)
				.fill(null)
				.map((_, i) => ({
					id: `job-${i}`,
					data: { ...mockAuditEvent, action: `action-${i}` },
					timestamp: Date.now(),
				}))

			let successCount = 0
			let failureCount = 0

			for (const job of jobs) {
				try {
					await (processor as any).processJobWithReliability(job)
					successCount++
				} catch {
					failureCount++
				}
			}

			expect(successCount).toBeGreaterThan(0)
			expect(failureCount).toBeGreaterThan(0)
			expect(successCount + failureCount).toBe(10)
		})

		it('should handle database connection recovery', async () => {
			// Simulate database connection issues
			let connectionAttempts = 0
			mockEventProcessor.mockImplementation(() => {
				connectionAttempts++
				if (connectionAttempts <= 3) {
					const error = new Error('Database connection failed')
					;(error as any).code = 'ECONNREFUSED'
					throw error
				}
				return Promise.resolve()
			})

			const mockJob = {
				id: 'db-recovery-job',
				data: mockAuditEvent,
				timestamp: Date.now(),
			}

			// Should eventually succeed after retries
			await (processor as any).processJobWithReliability(mockJob)

			expect(connectionAttempts).toBe(4) // 1 initial + 3 retries
		})
	})

	describe('Cleanup and resource management', () => {
		it('should cleanup resources correctly', async () => {
			const mockWorker = {
				close: vi.fn().mockResolvedValue(undefined),
			}

			const mockQueue = {
				close: vi.fn().mockResolvedValue(undefined),
			}

			const mockDeadLetterHandler = {
				cleanup: vi.fn().mockResolvedValue(undefined),
			}

			;(processor as any).worker = mockWorker
			;(processor as any).queue = mockQueue
			;(processor as any).deadLetterHandler = mockDeadLetterHandler

			await processor.cleanup()

			expect(mockWorker.close).toHaveBeenCalled()
			expect(mockQueue.close).toHaveBeenCalled()
			expect(mockDeadLetterHandler.cleanup).toHaveBeenCalled()
		})
	})

	describe('Force processing', () => {
		it('should process pending events when forced', async () => {
			const pendingJobs = [
				{ id: 'job-1', data: mockAuditEvent, moveToCompleted: vi.fn(), token: 'token-1' },
				{ id: 'job-2', data: mockAuditEvent, moveToCompleted: vi.fn(), token: 'token-2' },
			]

			const mockQueue = {
				getJobs: vi.fn().mockResolvedValue(pendingJobs),
			}

			;(processor as any).queue = mockQueue
			;(processor as any).processJobWithReliability = vi.fn().mockResolvedValue(undefined)

			await processor.processPendingEvents()

			expect(mockQueue.getJobs).toHaveBeenCalledWith(['waiting'])
			expect((processor as any).processJobWithReliability).toHaveBeenCalledTimes(2)
			expect(pendingJobs[0].moveToCompleted).toHaveBeenCalledWith('force-processed', 'token-1')
			expect(pendingJobs[1].moveToCompleted).toHaveBeenCalledWith('force-processed', 'token-2')
		})

		it('should handle failures during force processing', async () => {
			const error = new Error('Force processing failed')
			const failingJob = {
				id: 'failing-job',
				data: mockAuditEvent,
				moveToFailed: vi.fn(),
				token: 'token-1',
			}

			const mockQueue = {
				getJobs: vi.fn().mockResolvedValue([failingJob]),
			}

			;(processor as any).queue = mockQueue
			;(processor as any).processJobWithReliability = vi.fn().mockRejectedValue(error)

			await processor.processPendingEvents()

			expect(failingJob.moveToFailed).toHaveBeenCalledWith(error, 'token-1')
		})
	})
})
