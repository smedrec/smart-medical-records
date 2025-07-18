/**
 * Integration tests for circuit breaker pattern
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { CircuitBreaker, DEFAULT_CIRCUIT_BREAKER_CONFIG } from '../queue/circuit-breaker.js'

describe('Circuit Breaker', () => {
	let circuitBreaker: CircuitBreaker

	beforeEach(() => {
		vi.useFakeTimers()
		circuitBreaker = new CircuitBreaker(
			{
				...DEFAULT_CIRCUIT_BREAKER_CONFIG,
				failureThreshold: 3,
				recoveryTimeout: 5000,
				minimumThroughput: 5,
			},
			'test-breaker'
		)
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe('CLOSED state behavior', () => {
		it('should start in CLOSED state', () => {
			expect(circuitBreaker.getState()).toBe('CLOSED')
			expect(circuitBreaker.isHealthy()).toBe(true)
		})

		it('should execute operations successfully in CLOSED state', async () => {
			const operation = vi.fn().mockResolvedValue('success')

			const result = await circuitBreaker.execute(operation)

			expect(result).toBe('success')
			expect(operation).toHaveBeenCalledTimes(1)
			expect(circuitBreaker.getState()).toBe('CLOSED')
		})

		it('should track successful operations', async () => {
			const operation = vi.fn().mockResolvedValue('success')

			await circuitBreaker.execute(operation)
			await circuitBreaker.execute(operation)

			const metrics = circuitBreaker.getMetrics()
			expect(metrics.totalRequests).toBe(2)
			expect(metrics.successfulRequests).toBe(2)
			expect(metrics.failedRequests).toBe(0)
			expect(metrics.failureRate).toBe(0)
		})

		it('should reset failure count on successful request', async () => {
			const failingOperation = vi.fn().mockRejectedValue(new Error('failure'))
			const successOperation = vi.fn().mockResolvedValue('success')

			// Generate some failures
			try {
				await circuitBreaker.execute(failingOperation)
			} catch {}
			try {
				await circuitBreaker.execute(failingOperation)
			} catch {}

			// Then succeed
			await circuitBreaker.execute(successOperation)

			const metrics = circuitBreaker.getMetrics()
			expect(metrics.totalRequests).toBe(3)
			expect(metrics.failedRequests).toBe(2)
			expect(circuitBreaker.getState()).toBe('CLOSED')
		})
	})

	describe('OPEN state behavior', () => {
		it('should open circuit after failure threshold is reached', async () => {
			const operation = vi.fn().mockRejectedValue(new Error('failure'))

			// Need minimum throughput first
			for (let i = 0; i < 5; i++) {
				try {
					await circuitBreaker.execute(operation)
				} catch {}
			}

			expect(circuitBreaker.getState()).toBe('OPEN')
			expect(circuitBreaker.isHealthy()).toBe(false)
		})

		it('should reject operations immediately when OPEN', async () => {
			// Force circuit to open
			circuitBreaker.forceOpen('test')

			const operation = vi.fn().mockResolvedValue('success')

			await expect(circuitBreaker.execute(operation)).rejects.toThrow(
				"Circuit breaker 'test-breaker' is OPEN"
			)

			expect(operation).not.toHaveBeenCalled()
		})

		it('should transition to HALF_OPEN after recovery timeout', async () => {
			// Force circuit to open
			circuitBreaker.forceOpen('test')
			expect(circuitBreaker.getState()).toBe('OPEN')

			// Fast-forward past recovery timeout
			vi.advanceTimersByTime(6000)

			const operation = vi.fn().mockResolvedValue('success')
			await circuitBreaker.execute(operation)

			expect(circuitBreaker.getState()).toBe('CLOSED') // Should close after successful operation
		})
	})

	describe('HALF_OPEN state behavior', () => {
		it('should close circuit on successful operation in HALF_OPEN', async () => {
			// Force to HALF_OPEN state
			circuitBreaker.forceOpen('test')
			vi.advanceTimersByTime(6000)

			const operation = vi.fn().mockResolvedValue('success')
			await circuitBreaker.execute(operation)

			expect(circuitBreaker.getState()).toBe('CLOSED')
		})

		it('should reopen circuit on failure in HALF_OPEN', async () => {
			// Force to HALF_OPEN state
			circuitBreaker.forceOpen('test')
			vi.advanceTimersByTime(6000)

			const operation = vi.fn().mockRejectedValue(new Error('still failing'))

			try {
				await circuitBreaker.execute(operation)
			} catch {}

			expect(circuitBreaker.getState()).toBe('OPEN')
		})
	})

	describe('State change notifications', () => {
		it('should notify listeners on state changes', () => {
			const listener = vi.fn()
			circuitBreaker.onStateChange(listener)

			circuitBreaker.forceOpen('test')

			expect(listener).toHaveBeenCalledWith('OPEN', expect.any(Object))
		})

		it('should track state change history', () => {
			circuitBreaker.forceOpen('test open')
			circuitBreaker.forceClose('test close')

			const metrics = circuitBreaker.getMetrics()
			expect(metrics.stateChanges).toHaveLength(2)
			expect(metrics.stateChanges[0]).toMatchObject({
				from: 'CLOSED',
				to: 'OPEN',
				reason: 'test open',
			})
			expect(metrics.stateChanges[1]).toMatchObject({
				from: 'OPEN',
				to: 'CLOSED',
				reason: 'test close',
			})
		})

		it('should limit state change history', () => {
			// Generate more than 100 state changes
			for (let i = 0; i < 150; i++) {
				circuitBreaker.forceOpen(`test ${i}`)
				circuitBreaker.forceClose(`test ${i}`)
			}

			const metrics = circuitBreaker.getMetrics()
			expect(metrics.stateChanges).toHaveLength(100)
		})
	})

	describe('Metrics tracking', () => {
		it('should track failure rate correctly', async () => {
			const successOp = vi.fn().mockResolvedValue('success')
			const failOp = vi.fn().mockRejectedValue(new Error('failure'))

			// 3 successes, 2 failures
			await circuitBreaker.execute(successOp)
			await circuitBreaker.execute(successOp)
			await circuitBreaker.execute(successOp)
			try {
				await circuitBreaker.execute(failOp)
			} catch {}
			try {
				await circuitBreaker.execute(failOp)
			} catch {}

			const metrics = circuitBreaker.getMetrics()
			expect(metrics.totalRequests).toBe(5)
			expect(metrics.successfulRequests).toBe(3)
			expect(metrics.failedRequests).toBe(2)
			expect(metrics.failureRate).toBe(0.4) // 2/5
		})

		it('should track last failure and success times', async () => {
			const successOp = vi.fn().mockResolvedValue('success')
			const failOp = vi.fn().mockRejectedValue(new Error('failure'))

			await circuitBreaker.execute(successOp)

			try {
				await circuitBreaker.execute(failOp)
			} catch {}

			const metrics = circuitBreaker.getMetrics()
			expect(metrics.lastSuccessTime).toBeDefined()
			expect(metrics.lastFailureTime).toBeDefined()
		})
	})

	describe('Integration scenarios', () => {
		it('should handle database connection failures', async () => {
			const dbOperation = vi.fn().mockRejectedValue(new Error('Database connection failed'))

			// Simulate repeated database failures
			for (let i = 0; i < 10; i++) {
				try {
					await circuitBreaker.execute(dbOperation)
				} catch {}
			}

			expect(circuitBreaker.getState()).toBe('OPEN')

			// Circuit should reject further attempts immediately
			const startTime = Date.now()
			try {
				await circuitBreaker.execute(dbOperation)
			} catch {}
			const endTime = Date.now()

			// Should fail immediately without calling the operation
			expect(endTime - startTime).toBeLessThan(10)
			expect(dbOperation).toHaveBeenCalledTimes(10) // Only the initial attempts
		})

		it('should recover after service comes back online', async () => {
			const dbOperation = vi.fn().mockRejectedValue(new Error('Database down'))

			// Force circuit open due to failures
			for (let i = 0; i < 10; i++) {
				try {
					await circuitBreaker.execute(dbOperation)
				} catch {}
			}

			expect(circuitBreaker.getState()).toBe('OPEN')

			// Service comes back online
			dbOperation.mockResolvedValue('Database operational')

			// Wait for recovery timeout
			vi.advanceTimersByTime(6000)

			// Next call should succeed and close the circuit
			const result = await circuitBreaker.execute(dbOperation)

			expect(result).toBe('Database operational')
			expect(circuitBreaker.getState()).toBe('CLOSED')
		})

		it('should handle mixed success/failure patterns', async () => {
			const operation = vi.fn()

			// Pattern: success, success, fail, success, fail, fail, fail
			operation
				.mockResolvedValueOnce('success1')
				.mockResolvedValueOnce('success2')
				.mockRejectedValueOnce(new Error('fail1'))
				.mockResolvedValueOnce('success3')
				.mockRejectedValueOnce(new Error('fail2'))
				.mockRejectedValueOnce(new Error('fail3'))
				.mockRejectedValueOnce(new Error('fail4'))

			const results = []
			for (let i = 0; i < 7; i++) {
				try {
					const result = await circuitBreaker.execute(operation)
					results.push(result)
				} catch (error) {
					results.push(error.message)
				}
			}

			expect(results).toEqual([
				'success1',
				'success2',
				'fail1',
				'success3',
				'fail2',
				'fail3',
				'fail4',
			])

			// Should still be closed as we haven't hit minimum throughput for opening
			const metrics = circuitBreaker.getMetrics()
			expect(metrics.totalRequests).toBe(7)
			expect(metrics.failureRate).toBeCloseTo(4 / 7)
		})

		it('should respect minimum throughput requirement', async () => {
			const operation = vi.fn().mockRejectedValue(new Error('failure'))

			// Only 2 failures (below minimum throughput of 5)
			try {
				await circuitBreaker.execute(operation)
			} catch {}
			try {
				await circuitBreaker.execute(operation)
			} catch {}

			// Circuit should remain closed
			expect(circuitBreaker.getState()).toBe('CLOSED')

			// Add more failures to reach minimum throughput
			for (let i = 0; i < 3; i++) {
				try {
					await circuitBreaker.execute(operation)
				} catch {}
			}

			// Now circuit should open
			expect(circuitBreaker.getState()).toBe('OPEN')
		})
	})

	describe('Manual control', () => {
		it('should allow manual opening', () => {
			circuitBreaker.forceOpen('Manual intervention')

			expect(circuitBreaker.getState()).toBe('OPEN')
			expect(circuitBreaker.isHealthy()).toBe(false)
		})

		it('should allow manual closing', () => {
			circuitBreaker.forceOpen('test')
			circuitBreaker.forceClose('Manual recovery')

			expect(circuitBreaker.getState()).toBe('CLOSED')
			expect(circuitBreaker.isHealthy()).toBe(true)
		})
	})

	describe('Listener management', () => {
		it('should add and remove listeners correctly', () => {
			const listener1 = vi.fn()
			const listener2 = vi.fn()

			circuitBreaker.onStateChange(listener1)
			circuitBreaker.onStateChange(listener2)

			circuitBreaker.forceOpen('test')

			expect(listener1).toHaveBeenCalledTimes(1)
			expect(listener2).toHaveBeenCalledTimes(1)

			circuitBreaker.removeStateChangeListener(listener1)
			circuitBreaker.forceClose('test')

			expect(listener1).toHaveBeenCalledTimes(1) // Not called again
			expect(listener2).toHaveBeenCalledTimes(2) // Called again
		})

		it('should handle listener errors gracefully', () => {
			const faultyListener = vi.fn().mockImplementation(() => {
				throw new Error('Listener error')
			})

			circuitBreaker.onStateChange(faultyListener)

			// Should not throw despite listener error
			expect(() => circuitBreaker.forceOpen('test')).not.toThrow()
		})
	})
})
