/**
 * Integration tests for dead letter queue handling
 */

import { Redis } from 'ioredis'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { DeadLetterHandler, DEFAULT_DEAD_LETTER_CONFIG } from '../queue/dead-letter-queue.js'

import type { AuditLogEvent } from '../types.js'

// Mock ioredis
vi.mock('ioredis', () => {
	const RedisMock = vi.fn()
	RedisMock.prototype.on = vi.fn()
	RedisMock.prototype.quit = vi.fn().mockResolvedValue('OK')
	RedisMock.prototype.disconnect = vi.fn().mockResolvedValue(undefined)
	RedisMock.prototype.status = 'ready'
	return {
		Redis: RedisMock,
		default: RedisMock,
	}
})

describe('Dead Letter Queue Handler', () => {
	let mockRedis: vi.Mocked<Redis>
	let deadLetterHandler: DeadLetterHandler
	let mockAuditEvent: AuditLogEvent

	beforeEach(() => {
		vi.useFakeTimers()

		mockRedis = new Redis() as vi.Mocked<Redis>

		deadLetterHandler = new DeadLetterHandler(mockRedis, {
			...DEFAULT_DEAD_LETTER_CONFIG,
			queueName: 'test-dead-letter',
			alertThreshold: 3,
			processingInterval: 1000,
		})

		mockAuditEvent = {
			timestamp: '2023-01-01T00:00:00.000Z',
			action: 'test.action',
			status: 'failure',
			principalId: 'user-123',
			targetResourceType: 'TestResource',
			targetResourceId: 'resource-456',
		}
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe('addFailedEvent', () => {
		it('should add failed event to dead letter queue', async () => {
			const mockQueue = {
				add: vi.fn().mockResolvedValue({ id: 'job-123' }),
			}

			// Mock the queue creation
			vi.doMock('bullmq', () => ({
				Queue: vi.fn().mockImplementation(() => mockQueue),
			}))

			const error = new Error('Database connection failed')
			const retryHistory = [
				{ attempt: 1, timestamp: '2023-01-01T00:00:01.000Z', error: 'Connection timeout' },
				{ attempt: 2, timestamp: '2023-01-01T00:00:02.000Z', error: 'Connection refused' },
			]

			await deadLetterHandler.addFailedEvent(
				mockAuditEvent,
				error,
				'original-job-123',
				'audit-queue',
				retryHistory
			)

			expect(mockQueue.add).toHaveBeenCalledWith(
				'dead-letter-event',
				expect.objectContaining({
					originalEvent: mockAuditEvent,
					failureReason: 'Database connection failed',
					failureCount: 2,
					firstFailureTime: '2023-01-01T00:00:01.000Z',
					lastFailureTime: expect.any(String),
					originalJobId: 'original-job-123',
					originalQueueName: 'audit-queue',
					metadata: {
						errorStack: error.stack,
						retryHistory,
					},
				}),
				expect.objectContaining({
					removeOnComplete: false,
					removeOnFail: false,
					delay: 0,
				})
			)
		})

		it('should handle queue addition failures', async () => {
			const mockQueue = {
				add: vi.fn().mockRejectedValue(new Error('Queue unavailable')),
			}

			vi.doMock('bullmq', () => ({
				Queue: vi.fn().mockImplementation(() => mockQueue),
			}))

			const error = new Error('Original failure')

			await expect(deadLetterHandler.addFailedEvent(mockAuditEvent, error)).rejects.toThrow(
				'Critical: Failed to add audit event to dead letter queue'
			)
		})
	})

	describe('getMetrics', () => {
		it('should calculate metrics correctly', async () => {
			const mockJobs = [
				{
					data: {
						originalEvent: { ...mockAuditEvent, action: 'action1' },
						failureReason: 'Database error',
						firstFailureTime: '2023-01-01T00:00:00.000Z',
					},
				},
				{
					data: {
						originalEvent: { ...mockAuditEvent, action: 'action2' },
						failureReason: 'Network error',
						firstFailureTime: '2023-01-01T12:00:00.000Z',
					},
				},
				{
					data: {
						originalEvent: { ...mockAuditEvent, action: 'action3' },
						failureReason: 'Database error',
						firstFailureTime: new Date().toISOString(), // Today
					},
				},
			]

			const mockQueue = {
				getJobs: vi.fn().mockResolvedValue(mockJobs),
			}

			// Mock the queue
			;(deadLetterHandler as any).dlQueue = mockQueue

			const metrics = await deadLetterHandler.getMetrics()

			expect(metrics.totalEvents).toBe(3)
			expect(metrics.eventsToday).toBe(1)
			expect(metrics.oldestEvent).toBe('2023-01-01T00:00:00.000Z')
			expect(metrics.topFailureReasons).toEqual([
				{ reason: 'Database error', count: 2 },
				{ reason: 'Network error', count: 1 },
			])
		})

		it('should handle empty queue', async () => {
			const mockQueue = {
				getJobs: vi.fn().mockResolvedValue([]),
			}

			;(deadLetterHandler as any).dlQueue = mockQueue

			const metrics = await deadLetterHandler.getMetrics()

			expect(metrics.totalEvents).toBe(0)
			expect(metrics.eventsToday).toBe(0)
			expect(metrics.oldestEvent).toBeUndefined()
			expect(metrics.topFailureReasons).toEqual([])
		})
	})

	describe('Alert system', () => {
		it('should trigger alerts when threshold is exceeded', async () => {
			const alertCallback = vi.fn()
			deadLetterHandler.onAlert(alertCallback)

			// Mock queue with events above threshold
			const mockJobs = Array(5)
				.fill(null)
				.map((_, i) => ({
					data: {
						originalEvent: { ...mockAuditEvent, action: `action${i}` },
						failureReason: 'Test error',
						firstFailureTime: new Date().toISOString(),
					},
				}))

			const mockQueue = {
				getJobs: vi.fn().mockResolvedValue(mockJobs),
				add: vi.fn().mockResolvedValue({ id: 'job-123' }),
			}

			;(deadLetterHandler as any).dlQueue = mockQueue

			// Add an event to trigger alert check
			await deadLetterHandler.addFailedEvent(mockAuditEvent, new Error('Test'))

			expect(alertCallback).toHaveBeenCalledWith(
				expect.objectContaining({
					totalEvents: 5,
				})
			)
		})

		it('should respect alert cooldown period', async () => {
			const alertCallback = vi.fn()
			deadLetterHandler.onAlert(alertCallback)

			// Mock queue with events above threshold
			const mockJobs = Array(5)
				.fill(null)
				.map(() => ({
					data: {
						originalEvent: mockAuditEvent,
						failureReason: 'Test error',
						firstFailureTime: new Date().toISOString(),
					},
				}))

			const mockQueue = {
				getJobs: vi.fn().mockResolvedValue(mockJobs),
				add: vi.fn().mockResolvedValue({ id: 'job-123' }),
			}

			;(deadLetterHandler as any).dlQueue = mockQueue

			// First alert
			await deadLetterHandler.addFailedEvent(mockAuditEvent, new Error('Test'))
			expect(alertCallback).toHaveBeenCalledTimes(1)

			// Second alert within cooldown period
			await deadLetterHandler.addFailedEvent(mockAuditEvent, new Error('Test'))
			expect(alertCallback).toHaveBeenCalledTimes(1) // Should not increase

			// Fast-forward past cooldown
			vi.advanceTimersByTime(300001) // 5 minutes + 1ms

			// Third alert after cooldown
			await deadLetterHandler.addFailedEvent(mockAuditEvent, new Error('Test'))
			expect(alertCallback).toHaveBeenCalledTimes(2) // Should increase
		})

		it('should handle alert callback errors gracefully', async () => {
			const faultyCallback = vi.fn().mockImplementation(() => {
				throw new Error('Alert callback failed')
			})

			deadLetterHandler.onAlert(faultyCallback)

			const mockJobs = Array(5)
				.fill(null)
				.map(() => ({
					data: {
						originalEvent: mockAuditEvent,
						failureReason: 'Test error',
						firstFailureTime: new Date().toISOString(),
					},
				}))

			const mockQueue = {
				getJobs: vi.fn().mockResolvedValue(mockJobs),
				add: vi.fn().mockResolvedValue({ id: 'job-123' }),
			}

			;(deadLetterHandler as any).dlQueue = mockQueue

			// Should not throw despite callback error
			await expect(
				deadLetterHandler.addFailedEvent(mockAuditEvent, new Error('Test'))
			).resolves.not.toThrow()
		})
	})

	describe('Worker management', () => {
		it('should start and stop worker correctly', async () => {
			const mockWorker = {
				on: vi.fn(),
				close: vi.fn().mockResolvedValue(undefined),
			}

			vi.doMock('bullmq', () => ({
				Queue: vi.fn(),
				Worker: vi.fn().mockImplementation(() => mockWorker),
			}))

			deadLetterHandler.startWorker()
			expect(mockWorker.on).toHaveBeenCalledWith('completed', expect.any(Function))
			expect(mockWorker.on).toHaveBeenCalledWith('failed', expect.any(Function))

			await deadLetterHandler.stopWorker()
			expect(mockWorker.close).toHaveBeenCalled()
		})

		it('should handle worker start when already started', () => {
			const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

			deadLetterHandler.startWorker()
			deadLetterHandler.startWorker() // Second call

			expect(consoleSpy).toHaveBeenCalledWith('[DeadLetterHandler] Worker already started')

			consoleSpy.mockRestore()
		})
	})

	describe('Event processing', () => {
		it('should process events based on age', async () => {
			const oldEvent = {
				originalEvent: mockAuditEvent,
				failureReason: 'Old failure',
				firstFailureTime: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 days ago
				failureCount: 1,
				lastFailureTime: new Date().toISOString(),
				metadata: { retryHistory: [] },
			}

			const recentEvent = {
				originalEvent: mockAuditEvent,
				failureReason: 'Recent failure',
				firstFailureTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
				failureCount: 1,
				lastFailureTime: new Date().toISOString(),
				metadata: { retryHistory: [] },
			}

			const mockJob = (data: any) => ({ data })

			// Test old event (should be removed)
			const processJob = (deadLetterHandler as any).processDeadLetterEvent.bind(deadLetterHandler)

			const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

			await processJob(mockJob(oldEvent))
			await processJob(mockJob(recentEvent))

			// Old event should trigger removal log
			expect(consoleSpy).toHaveBeenCalledWith(
				expect.stringContaining('Removing DLQ event older than')
			)

			consoleSpy.mockRestore()
		})
	})

	describe('Integration scenarios', () => {
		it('should handle high-volume failure scenarios', async () => {
			const mockQueue = {
				add: vi.fn().mockResolvedValue({ id: 'job-123' }),
				getJobs: vi.fn().mockResolvedValue([]),
			}

			;(deadLetterHandler as any).dlQueue = mockQueue

			// Simulate high volume of failures
			const promises = []
			for (let i = 0; i < 100; i++) {
				promises.push(
					deadLetterHandler.addFailedEvent(
						{ ...mockAuditEvent, action: `bulk-action-${i}` },
						new Error(`Bulk failure ${i}`)
					)
				)
			}

			await Promise.all(promises)

			expect(mockQueue.add).toHaveBeenCalledTimes(100)
		})

		it('should track failure patterns over time', async () => {
			const failures = [
				{ reason: 'Database timeout', count: 5 },
				{ reason: 'Network error', count: 3 },
				{ reason: 'Validation error', count: 2 },
			]

			const mockJobs = []
			failures.forEach(({ reason, count }) => {
				for (let i = 0; i < count; i++) {
					mockJobs.push({
						data: {
							originalEvent: mockAuditEvent,
							failureReason: reason,
							firstFailureTime: new Date().toISOString(),
						},
					})
				}
			})

			const mockQueue = {
				getJobs: vi.fn().mockResolvedValue(mockJobs),
			}

			;(deadLetterHandler as any).dlQueue = mockQueue

			const metrics = await deadLetterHandler.getMetrics()

			expect(metrics.topFailureReasons).toEqual([
				{ reason: 'Database timeout', count: 5 },
				{ reason: 'Network error', count: 3 },
				{ reason: 'Validation error', count: 2 },
			])
		})

		it('should handle cleanup operations', async () => {
			const mockWorker = {
				close: vi.fn().mockResolvedValue(undefined),
			}

			const mockQueue = {
				close: vi.fn().mockResolvedValue(undefined),
			}

			;(deadLetterHandler as any).dlWorker = mockWorker
			;(deadLetterHandler as any).dlQueue = mockQueue

			await deadLetterHandler.cleanup()

			expect(mockWorker.close).toHaveBeenCalled()
			expect(mockQueue.close).toHaveBeenCalled()
		})
	})

	describe('Callback management', () => {
		it('should add and remove alert callbacks', () => {
			const callback1 = vi.fn()
			const callback2 = vi.fn()

			deadLetterHandler.onAlert(callback1)
			deadLetterHandler.onAlert(callback2)

			// Both callbacks should be in the list
			expect((deadLetterHandler as any).alertCallbacks).toHaveLength(2)

			deadLetterHandler.removeAlertCallback(callback1)

			// Only callback2 should remain
			expect((deadLetterHandler as any).alertCallbacks).toHaveLength(1)
			expect((deadLetterHandler as any).alertCallbacks[0]).toBe(callback2)
		})
	})
})
