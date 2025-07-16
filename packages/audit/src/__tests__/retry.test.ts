/**
 * Integration tests for retry mechanism
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
	executeWithRetry,
	calculateDelay,
	isRetryableError,
	DEFAULT_RETRY_CONFIG,
	withRetry,
} from '../retry.js'

describe('Retry Mechanism', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe('isRetryableError', () => {
		it('should identify retryable errors by code', () => {
			const error = new Error('Connection failed')
			;(error as any).code = 'ECONNRESET'

			expect(isRetryableError(error, DEFAULT_RETRY_CONFIG)).toBe(true)
		})

		it('should identify retryable errors by message', () => {
			const error = new Error('Connection timeout occurred')

			expect(isRetryableError(error, DEFAULT_RETRY_CONFIG)).toBe(true)
		})

		it('should not retry non-retryable errors', () => {
			const error = new Error('Validation failed')

			expect(isRetryableError(error, DEFAULT_RETRY_CONFIG)).toBe(false)
		})
	})

	describe('calculateDelay', () => {
		it('should calculate exponential backoff correctly', () => {
			const config = { ...DEFAULT_RETRY_CONFIG, jitter: false }

			expect(calculateDelay(1, config)).toBe(1000) // 1000 * 2^0
			expect(calculateDelay(2, config)).toBe(2000) // 1000 * 2^1
			expect(calculateDelay(3, config)).toBe(4000) // 1000 * 2^2
		})

		it('should respect maximum delay', () => {
			const config = { ...DEFAULT_RETRY_CONFIG, maxDelay: 5000, jitter: false }

			expect(calculateDelay(10, config)).toBe(5000)
		})

		it('should calculate linear backoff correctly', () => {
			const config = { ...DEFAULT_RETRY_CONFIG, backoffStrategy: 'linear' as const, jitter: false }

			expect(calculateDelay(1, config)).toBe(1000) // 1000 * 1
			expect(calculateDelay(2, config)).toBe(2000) // 1000 * 2
			expect(calculateDelay(3, config)).toBe(3000) // 1000 * 3
		})

		it('should use fixed delay when configured', () => {
			const config = { ...DEFAULT_RETRY_CONFIG, backoffStrategy: 'fixed' as const, jitter: false }

			expect(calculateDelay(1, config)).toBe(1000)
			expect(calculateDelay(5, config)).toBe(1000)
		})

		it('should add jitter when enabled', () => {
			const config = { ...DEFAULT_RETRY_CONFIG, jitter: true }

			const delay1 = calculateDelay(1, config)
			const delay2 = calculateDelay(1, config)

			// With jitter, delays should be different (very unlikely to be exactly the same)
			// and within expected range
			expect(delay1).toBeGreaterThan(800) // 1000 - 20% jitter
			expect(delay1).toBeLessThan(1200) // 1000 + 20% jitter
			expect(delay2).toBeGreaterThan(800)
			expect(delay2).toBeLessThan(1200)
		})
	})

	describe('executeWithRetry', () => {
		it('should succeed on first attempt', async () => {
			const operation = vi.fn().mockResolvedValue('success')

			const result = await executeWithRetry(operation, DEFAULT_RETRY_CONFIG)

			expect(result.success).toBe(true)
			expect(result.result).toBe('success')
			expect(result.attempts).toHaveLength(0)
			expect(operation).toHaveBeenCalledTimes(1)
		})

		it('should retry on retryable errors', async () => {
			const error = new Error('Connection timeout')
			const operation = vi
				.fn()
				.mockRejectedValueOnce(error)
				.mockRejectedValueOnce(error)
				.mockResolvedValue('success')

			const promise = executeWithRetry(operation, {
				...DEFAULT_RETRY_CONFIG,
				maxRetries: 3,
				baseDelay: 100,
			})

			// Fast-forward through delays
			vi.advanceTimersByTime(100)
			await Promise.resolve()
			vi.advanceTimersByTime(200)
			await Promise.resolve()

			const result = await promise

			expect(result.success).toBe(true)
			expect(result.result).toBe('success')
			expect(result.attempts).toHaveLength(2)
			expect(operation).toHaveBeenCalledTimes(3)
		})

		it('should fail after max retries', async () => {
			const error = new Error('Connection timeout')
			const operation = vi.fn().mockRejectedValue(error)

			const promise = executeWithRetry(operation, {
				...DEFAULT_RETRY_CONFIG,
				maxRetries: 2,
				baseDelay: 100,
			})

			// Fast-forward through all delays
			vi.advanceTimersByTime(100)
			await Promise.resolve()
			vi.advanceTimersByTime(200)
			await Promise.resolve()

			const result = await promise

			expect(result.success).toBe(false)
			expect(result.error).toBe(error)
			expect(result.attempts).toHaveLength(3) // Initial + 2 retries
			expect(operation).toHaveBeenCalledTimes(3)
		})

		it('should not retry non-retryable errors', async () => {
			const error = new Error('Validation failed')
			const operation = vi.fn().mockRejectedValue(error)

			const result = await executeWithRetry(operation, DEFAULT_RETRY_CONFIG)

			expect(result.success).toBe(false)
			expect(result.error).toBe(error)
			expect(result.attempts).toHaveLength(1)
			expect(operation).toHaveBeenCalledTimes(1)
		})

		it('should track attempt details correctly', async () => {
			const error = new Error('Connection timeout')
			const operation = vi.fn().mockRejectedValueOnce(error).mockResolvedValue('success')

			const promise = executeWithRetry(operation, {
				...DEFAULT_RETRY_CONFIG,
				maxRetries: 2,
				baseDelay: 100,
			})

			vi.advanceTimersByTime(100)
			const result = await promise

			expect(result.attempts).toHaveLength(1)
			expect(result.attempts[0]).toMatchObject({
				attempt: 1,
				error,
				delay: expect.any(Number),
				timestamp: expect.any(String),
			})
		})
	})

	describe('withRetry decorator', () => {
		it('should retry decorated methods', async () => {
			class TestService {
				private callCount = 0

				@withRetry({ maxRetries: 2, baseDelay: 100 })
				async testMethod(): Promise<string> {
					this.callCount++
					if (this.callCount < 3) {
						const error = new Error('Connection timeout')
						throw error
					}
					return 'success'
				}

				getCallCount(): number {
					return this.callCount
				}
			}

			const service = new TestService()
			const promise = service.testMethod()

			// Fast-forward through delays
			vi.advanceTimersByTime(100)
			await Promise.resolve()
			vi.advanceTimersByTime(200)
			await Promise.resolve()

			const result = await promise

			expect(result).toBe('success')
			expect(service.getCallCount()).toBe(3)
		})

		it('should throw error after max retries in decorated method', async () => {
			class TestService {
				@withRetry({ maxRetries: 1, baseDelay: 100 })
				async failingMethod(): Promise<string> {
					throw new Error('Connection timeout')
				}
			}

			const service = new TestService()
			const promise = service.failingMethod()

			vi.advanceTimersByTime(100)
			await Promise.resolve()

			await expect(promise).rejects.toThrow('Connection timeout')
		})
	})

	describe('Integration scenarios', () => {
		it('should handle database connection failures', async () => {
			const dbOperation = vi
				.fn()
				.mockRejectedValueOnce(new Error('ECONNREFUSED'))
				.mockRejectedValueOnce(new Error('ETIMEDOUT'))
				.mockResolvedValue({ id: 1, inserted: true })

			const result = await executeWithRetry(dbOperation, {
				...DEFAULT_RETRY_CONFIG,
				maxRetries: 3,
				baseDelay: 50,
			})

			// Fast-forward through delays
			vi.advanceTimersByTime(50)
			await Promise.resolve()
			vi.advanceTimersByTime(100)
			await Promise.resolve()

			expect(result.success).toBe(true)
			expect(result.result).toEqual({ id: 1, inserted: true })
			expect(result.attempts).toHaveLength(2)
		})

		it('should handle network timeouts with exponential backoff', async () => {
			const networkOperation = vi
				.fn()
				.mockRejectedValueOnce(new Error('Network timeout'))
				.mockRejectedValueOnce(new Error('Network timeout'))
				.mockRejectedValueOnce(new Error('Network timeout'))
				.mockResolvedValue('network response')

			const config = {
				...DEFAULT_RETRY_CONFIG,
				maxRetries: 4,
				baseDelay: 100,
				backoffStrategy: 'exponential' as const,
				jitter: false,
			}

			const promise = executeWithRetry(networkOperation, config)

			// Simulate exponential backoff delays
			vi.advanceTimersByTime(100) // First retry after 100ms
			await Promise.resolve()
			vi.advanceTimersByTime(200) // Second retry after 200ms
			await Promise.resolve()
			vi.advanceTimersByTime(400) // Third retry after 400ms
			await Promise.resolve()

			const result = await promise

			expect(result.success).toBe(true)
			expect(result.result).toBe('network response')
			expect(result.attempts).toHaveLength(3)
			expect(networkOperation).toHaveBeenCalledTimes(4)
		})

		it('should respect maximum delay limits', async () => {
			const operation = vi.fn().mockRejectedValue(new Error('Connection timeout'))

			const config = {
				...DEFAULT_RETRY_CONFIG,
				maxRetries: 10,
				baseDelay: 1000,
				maxDelay: 5000,
				backoffStrategy: 'exponential' as const,
				jitter: false,
			}

			const promise = executeWithRetry(operation, config)

			// The exponential backoff should be capped at maxDelay
			const delays = []
			for (let i = 1; i <= 5; i++) {
				const expectedDelay = Math.min(1000 * Math.pow(2, i - 1), 5000)
				delays.push(expectedDelay)
				vi.advanceTimersByTime(expectedDelay)
				await Promise.resolve()
			}

			const result = await promise

			expect(result.success).toBe(false)
			expect(result.attempts.length).toBeGreaterThan(0)

			// Verify that delays were capped
			const actualDelays = result.attempts.map((a) => a.delay)
			expect(Math.max(...actualDelays)).toBeLessThanOrEqual(5000)
		})
	})
})
