import { Queue as BullMQQueue } from 'bullmq'
import { Redis as IORedis } from 'ioredis'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Audit } from '../audit' // Assuming Audit is exported from ./audit

import type { AuditLogEvent } from '../types'

// Mock ioredis
vi.mock('ioredis', () => {
	const Redis = vi.fn()
	Redis.prototype.on = vi.fn()
	Redis.prototype.quit = vi.fn().mockResolvedValue('OK')
	Redis.prototype.status = 'ready' // Default status
	return { Redis }
})

// Mock bullmq
vi.mock('bullmq', () => {
	const Queue = vi.fn()
	Queue.prototype.add = vi.fn().mockResolvedValue({ id: 'job-123' })
	Queue.prototype.close = vi.fn().mockResolvedValue(undefined)
	return { Queue }
})

describe('Audit Service', () => {
	const mockQueueName = 'test-audit-queue'
	const mockRedisUrl = 'redis://mockhost:6379'
	let MockedIORedis = IORedis as any
	let MockedBullMQQueue = BullMQQueue as any
	let originalProcessEnv: NodeJS.ProcessEnv

	let lastRedisInstance: any
	let lastBullMQInstance: any

	beforeEach(() => {
		vi.clearAllMocks()
		originalProcessEnv = { ...process.env }

		MockedIORedis.mockImplementation(() => {
			lastRedisInstance = {
				on: vi.fn(),
				quit: vi.fn().mockResolvedValue('OK'),
				status: 'ready',
			}
			return lastRedisInstance
		})

		MockedBullMQQueue.mockImplementation(() => {
			lastBullMQInstance = {
				add: vi.fn().mockResolvedValue({ id: 'job-123' }),
				close: vi.fn().mockResolvedValue(undefined),
			}
			return lastBullMQInstance
		})
	})

	afterEach(() => {
		process.env = originalProcessEnv
	})

	describe('Constructor', () => {
		it('should successfully instantiate with a provided redisUrl', () => {
			const audit = new Audit(mockQueueName, mockRedisUrl)
			expect(MockedIORedis).toHaveBeenCalledWith(mockRedisUrl, { maxRetriesPerRequest: null })
			expect(MockedBullMQQueue).toHaveBeenCalledWith(mockQueueName, {
				connection: expect.any(Object), // Check for an object, as it's a mock instance
			})
			expect(audit).toBeInstanceOf(Audit)
		})

		it('should successfully instantiate using AUDIT_REDIS_URL from environment variables', () => {
			process.env.AUDIT_REDIS_URL = 'redis://envhost:1234'
			const audit = new Audit(mockQueueName)
			expect(MockedIORedis).toHaveBeenCalledWith('redis://envhost:1234', {
				maxRetriesPerRequest: null,
			})
			expect(MockedBullMQQueue).toHaveBeenCalledWith(mockQueueName, {
				connection: expect.any(Object), // Check for an object
			})
			expect(audit).toBeInstanceOf(Audit)
		})

		it('should throw an error if no redisUrl is provided and AUDIT_REDIS_URL is not set', () => {
			delete process.env.AUDIT_REDIS_URL // Ensure it's not set
			expect(() => new Audit(mockQueueName)).toThrow(
				'[AuditService] Initialization Error: Redis URL was not provided and could not be found in environment variables (AUDIT_REDIS_URL). Please provide it directly or set the environment variable.'
			)
		})

		it('should pass redisConnectionOptions to IORedis constructor', () => {
			const redisOptions = { password: 'securepassword' }
			new Audit(mockQueueName, mockRedisUrl, redisOptions)
			expect(MockedIORedis).toHaveBeenCalledWith(mockRedisUrl, {
				maxRetriesPerRequest: null,
				password: 'securepassword',
			})
		})

		it('should register Redis event handlers', () => {
			// The mockImplementation in beforeEach ensures `lastRedisInstance` is set
			new Audit(mockQueueName, mockRedisUrl)
			expect(lastRedisInstance.on).toHaveBeenCalledWith('error', expect.any(Function))
			expect(lastRedisInstance.on).toHaveBeenCalledWith('connect', expect.any(Function))
			expect(lastRedisInstance.on).toHaveBeenCalledWith('ready', expect.any(Function))
			expect(lastRedisInstance.on).toHaveBeenCalledWith('close', expect.any(Function))
			expect(lastRedisInstance.on).toHaveBeenCalledWith('reconnecting', expect.any(Function))
		})

		it('should handle Redis connection error by logging to console.error', () => {
			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
			let errorHandler: ((err: Error) => void) | undefined

			// Override specific mock for this test to capture 'on' callback
			MockedIORedis.mockImplementation(() => {
				lastRedisInstance = {
					on: vi.fn((event, cb) => {
						if (event === 'error') {
							errorHandler = cb
						}
					}),
					quit: vi.fn().mockResolvedValue('OK'),
					status: 'ready',
				}
				return lastRedisInstance
			})

			new Audit(mockQueueName, mockRedisUrl) // This will use the above mockImplementation

			expect(errorHandler).toBeDefined()
			const testError = new Error('Redis connection failed')
			if (errorHandler) {
				errorHandler(testError)
			}
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				`[AuditService] Redis Connection Error for queue "${mockQueueName}": ${testError.message}`,
				testError
			)
			consoleErrorSpy.mockRestore()
		})
	})

	describe('log method', () => {
		let audit: Audit

		beforeEach(() => {
			// This ensures `lastBullMQInstance` is set by the mockImplementation
			// before `audit` instance is created.
			audit = new Audit(mockQueueName, mockRedisUrl)
		})

		it('should successfully log an event', async () => {
			const eventDetails: Omit<AuditLogEvent, 'timestamp'> = {
				action: 'testAction',
				status: 'success',
				principalId: 'user123',
			}
			await audit.log(eventDetails)

			// lastBullMQInstance is the actual mock object used by the audit instance
			expect(lastBullMQInstance.add).toHaveBeenCalledWith(
				mockQueueName,
				expect.objectContaining({
					action: 'testAction',
					status: 'success',
					principalId: 'user123',
					timestamp: expect.any(String),
				}),
				{ removeOnComplete: true, removeOnFail: true }
			)
		})

		it('should throw an error if action is missing', async () => {
			const eventDetails = {
				status: 'success',
				principalId: 'user123',
			} as Omit<AuditLogEvent, 'timestamp'>
			await expect(audit.log(eventDetails)).rejects.toThrow(
				"[AuditService] Log Error: Missing required event properties. 'action' and 'status' must be provided."
			)
		})

		it('should throw an error if status is missing', async () => {
			const eventDetails = {
				action: 'testAction',
				principalId: 'user123',
			} as Omit<AuditLogEvent, 'timestamp'>
			await expect(audit.log(eventDetails)).rejects.toThrow(
				"[AuditService] Log Error: Missing required event properties. 'action' and 'status' must be provided."
			)
		})

		it('should propagate error if BullMQ add fails', async () => {
			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
			const eventDetails: Omit<AuditLogEvent, 'timestamp'> = {
				action: 'testAction',
				status: 'failure',
			}
			const queueError = new Error('Failed to add to queue')
			// Ensure the `add` method on the instance used by `audit` is the one rejecting
			lastBullMQInstance.add.mockRejectedValueOnce(queueError)

			await expect(audit.log(eventDetails)).rejects.toThrow(queueError)
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				`[AuditService] Failed to add event to BullMQ queue "${mockQueueName}":`,
				queueError
			)
			consoleErrorSpy.mockRestore()
		})
	})

	describe('closeConnection method', () => {
		let audit: Audit // Declare audit here
		beforeEach(() => {
			// Add beforeEach to define audit
			audit = new Audit(mockQueueName, mockRedisUrl)
		})

		it('should call connection.quit if connection is ready', async () => {
			// audit is now defined in beforeEach
			lastRedisInstance.status = 'ready' // lastRedisInstance is the one used by audit
			await audit.closeConnection()
			expect(lastRedisInstance.quit).toHaveBeenCalled()
		})

		it('should call connection.quit if connection is "connect"', async () => {
			// audit is now defined in beforeEach
			lastRedisInstance.status = 'connect'
			await audit.closeConnection()
			expect(lastRedisInstance.quit).toHaveBeenCalled()
		})

		it('should call connection.quit if connection is "reconnecting"', async () => {
			// audit is now defined in beforeEach
			lastRedisInstance.status = 'reconnecting'
			await audit.closeConnection()
			expect(lastRedisInstance.quit).toHaveBeenCalled()
		})

		it('should not call connection.quit if connection is not ready/connect/reconnecting (e.g., "end")', async () => {
			// audit is now defined in beforeEach
			lastRedisInstance.status = 'end'
			await audit.closeConnection()
			expect(lastRedisInstance.quit).not.toHaveBeenCalled()
		})

		it('should not throw if connection is undefined (though constructor should prevent this)', async () => {
			// audit is now defined in beforeEach
			// To properly test this, we'd need to bypass the constructor's assignment
			// or make `connection` on `audit` null after construction.
			// The current setup makes `lastRedisInstance` available.
			// A more direct way to test this specific line in closeConnection:
			;(audit as any).connection = null
			await expect(audit.closeConnection()).resolves.toBeUndefined()
		})

		it('should log success message on successful close', async () => {
			const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
			// audit is now defined in beforeEach
			lastRedisInstance.status = 'ready'
			lastRedisInstance.quit.mockResolvedValue('OK')

			await audit.closeConnection()
			expect(consoleLogSpy).toHaveBeenCalledWith(
				`[AuditService] Successfully closed Redis connection for queue "${mockQueueName}".`
			)
			consoleLogSpy.mockRestore()
		})

		it('should log error message if closing connection fails', async () => {
			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
			// audit is now defined in beforeEach
			lastRedisInstance.status = 'ready'
			const closeError = new Error('Failed to close')
			lastRedisInstance.quit.mockRejectedValueOnce(closeError)

			await audit.closeConnection()
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				`[AuditService] Error while closing Redis connection for queue "${mockQueueName}":`,
				closeError
			)
			consoleErrorSpy.mockRestore()
		})
	})
})
