import { Queue } from 'bullmq'
import { Redis } from 'ioredis'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { SendMail } from '../mail'

import type { SendMailEvent } from '../types'

// Mock dependencies
vi.mock('bullmq')
vi.mock('ioredis')
vi.mock('bullmq-otel', () => ({
	BullMQOtel: vi.fn().mockImplementation(() => ({
		// Mock any methods if BullMQOtel instance is used
	})),
}))

describe('SendMail', () => {
	const mockQueueName = 'test-mail-queue'
	const mockRedisUrl = 'redis://localhost:6379'
	const mockRedisOptions = { db: 1 }
	let mockRedisInstance: any
	let mockQueueInstance: any

	beforeEach(() => {
		// Reset mocks before each test
		vi.clearAllMocks()

		// Setup mock Redis instance
		mockRedisInstance = {
			status: 'ready',
			on: vi.fn(),
			quit: vi.fn().mockResolvedValue('OK'),
			disconnect: vi.fn().mockResolvedValue(undefined),
		}
		;(Redis as any).mockImplementation(() => mockRedisInstance)

		// Setup mock Queue instance
		mockQueueInstance = {
			add: vi.fn().mockResolvedValue({ id: 'job1' }), // Mock job object
			close: vi.fn().mockResolvedValue(undefined),
			// Mock other Queue methods if needed
		}
		;(Queue as any).mockImplementation(() => mockQueueInstance)

		// Mock console methods
		vi.spyOn(console, 'info').mockImplementation(() => {})
		vi.spyOn(console, 'warn').mockImplementation(() => {})
		vi.spyOn(console, 'error').mockImplementation(() => {})
	})

	afterEach(() => {
		// Restore console mocks
		vi.restoreAllMocks()
		// Clear any timers or pending operations if necessary
	})

	describe('Constructor', () => {
		it('should initialize successfully with direct Redis URL', () => {
			const mailService = new SendMail(mockQueueName, mockRedisUrl, mockRedisOptions)
			expect(Redis).toHaveBeenCalledWith(mockRedisUrl, {
				maxRetriesPerRequest: null,
				enableAutoPipelining: true,
				...mockRedisOptions,
			})
			expect(Queue).toHaveBeenCalledWith(mockQueueName, {
				connection: mockRedisInstance,
				telemetry: expect.any(Object), // BullMQOtel mock
			})
			expect(mailService).toBeInstanceOf(SendMail)
			expect(mockRedisInstance.on).toHaveBeenCalledWith('connect', expect.any(Function))
			expect(mockRedisInstance.on).toHaveBeenCalledWith('error', expect.any(Function))
			expect(mockRedisInstance.on).toHaveBeenCalledWith('close', expect.any(Function))
			expect(mockRedisInstance.on).toHaveBeenCalledWith('reconnecting', expect.any(Function))
		})

		it('should initialize successfully using MAIL_REDIS_URL from environment', () => {
			process.env.MAIL_REDIS_URL = 'redis://env-redis:6379'
			const mailService = new SendMail(mockQueueName, undefined, mockRedisOptions)
			expect(Redis).toHaveBeenCalledWith('redis://env-redis:6379', {
				maxRetriesPerRequest: null,
				enableAutoPipelining: true,
				...mockRedisOptions,
			})
			expect(Queue).toHaveBeenCalledWith(mockQueueName, {
				connection: mockRedisInstance,
				telemetry: expect.any(Object),
			})
			expect(mailService).toBeInstanceOf(SendMail)
			delete process.env.MAIL_REDIS_URL // Clean up env var
		})

		it('should throw error if Redis URL is not provided and not in environment', () => {
			const originalEnv = process.env.MAIL_REDIS_URL
			delete process.env.MAIL_REDIS_URL // Ensure it's not set

			expect(() => new SendMail(mockQueueName)).toThrow(
				"[SendMailService] Initialization failed: Redis URL was not provided directly and could not be found in the environment variable 'MAIL_REDIS_URL'."
			)

			if (originalEnv !== undefined) {
				process.env.MAIL_REDIS_URL = originalEnv // Restore if it was originally set
			}
		})

		it('should handle Redis instantiation errors', () => {
			const instantiationError = new Error('Redis init failed')
			;(Redis as any).mockImplementationOnce(() => {
				throw instantiationError
			})
			expect(() => new SendMail(mockQueueName, mockRedisUrl)).toThrow(
				`[SendMailService] Failed to initialize Redis connection for queue ${mockQueueName}. Please check Redis configuration and availability. Error: ${instantiationError.message}`
			)
			expect(console.error).toHaveBeenCalledWith(
				`[SendMailService] Failed to create Redis instance for queue ${mockQueueName}:`,
				instantiationError
			)
		})

		it('should log Redis connection events', () => {
			new SendMail(mockQueueName, mockRedisUrl)
			// Simulate events
			const connectCallback = mockRedisInstance.on.mock.calls.find(
				(call: any) => call[0] === 'connect'
			)[1]
			connectCallback()
			expect(console.info).toHaveBeenCalledWith(
				`[SendMailService] Successfully connected to Redis for queue ${mockQueueName}.`
			)

			const errorCallback = mockRedisInstance.on.mock.calls.find(
				(call: any) => call[0] === 'error'
			)[1]
			const testError = new Error('Test Redis error')
			errorCallback(testError)
			expect(console.error).toHaveBeenCalledWith(
				`[SendMailService] Redis connection error for queue '${mockQueueName}': ${testError.message}. Attempting to reconnect...`,
				testError
			)

			const closeCallback = mockRedisInstance.on.mock.calls.find(
				(call: any) => call[0] === 'close'
			)[1]
			closeCallback()
			expect(console.info).toHaveBeenCalledWith(
				`[SendMailService] Redis connection closed for queue ${mockQueueName}.`
			)

			const reconnectingCallback = mockRedisInstance.on.mock.calls.find(
				(call: any) => call[0] === 'reconnecting'
			)[1]
			reconnectingCallback()
			expect(console.info).toHaveBeenCalledWith(
				`[SendMailService] Reconnecting to Redis for queue ${mockQueueName}...`
			)
		})
	})

	describe('send', () => {
		let mailService: SendMail
		const eventDetails: SendMailEvent = {
			principalId: 'user123',
			organizationId: 'org456',
			action: 'test_action',
			emailDetails: {
				to: 'test@example.com',
				subject: 'Test Email',
				body: 'This is a test email.',
			},
		}

		beforeEach(() => {
			mailService = new SendMail(mockQueueName, mockRedisUrl)
		})

		it('should add event to the BullMQ queue with correct parameters', async () => {
			await mailService.send(eventDetails)
			expect(mockQueueInstance.add).toHaveBeenCalledWith(mockQueueName, eventDetails, {
				removeOnComplete: true,
				removeOnFail: true,
			})
		})

		it('should throw error if queue is not initialized (edge case, constructor should prevent)', async () => {
			;(mailService as any).bullmq_queue = null // Simulate uninitialized queue
			await expect(mailService.send(eventDetails)).rejects.toThrow(
				'[SendMailService] Cannot send event: BullMQ queue is not initialized.'
			)
		})

		it('should log a warning if Redis connection is not ready when sending', async () => {
			mockRedisInstance.status = 'end' // Simulate a non-ideal state
			await mailService.send(eventDetails)
			expect(console.warn).toHaveBeenCalledWith(
				`[SendMailService] Attempting to send mail while Redis connection status is 'end' for queue ${mockQueueName}. This might fail if Redis is unavailable.`
			)
			expect(mockQueueInstance.add).toHaveBeenCalled() // Still attempts to add
		})

		it('should throw and log error if adding job to queue fails', async () => {
			const queueAddError = new Error('Queue add failed')
			mockQueueInstance.add.mockRejectedValueOnce(queueAddError)

			await expect(mailService.send(eventDetails)).rejects.toThrow(
				`[SendMailService] Failed to send mail event to queue '${mockQueueName}'. Error: ${queueAddError.message}`
			)
			expect(console.error).toHaveBeenCalledWith(
				`[SendMailService] Failed to add job to queue '${mockQueueName}':`,
				queueAddError
			)
		})
	})

	describe('closeConnection', () => {
		let mailService: SendMail

		beforeEach(() => {
			mailService = new SendMail(mockQueueName, mockRedisUrl)
		})

		it('should close BullMQ queue and Redis connection successfully', async () => {
			await mailService.closeConnection()
			expect(mockQueueInstance.close).toHaveBeenCalledTimes(1)
			expect(mockRedisInstance.quit).toHaveBeenCalledTimes(1)
			expect(mockRedisInstance.disconnect).not.toHaveBeenCalled()
			expect(console.info).toHaveBeenCalledWith(
				`[SendMailService] BullMQ queue '${mockQueueName}' closed successfully.`
			)
			expect(console.info).toHaveBeenCalledWith(
				`[SendMailService] Redis connection for queue '${mockQueueName}' quit gracefully.`
			)
		})

		it('should handle error when closing BullMQ queue and still attempt to close Redis', async () => {
			const queueCloseError = new Error('Queue close failed')
			mockQueueInstance.close.mockRejectedValueOnce(queueCloseError)

			await mailService.closeConnection()

			expect(mockQueueInstance.close).toHaveBeenCalledTimes(1)
			expect(console.error).toHaveBeenCalledWith(
				`[SendMailService] Error closing BullMQ queue '${mockQueueName}':`,
				queueCloseError
			)
			expect(mockRedisInstance.quit).toHaveBeenCalledTimes(1) // Should still quit Redis
			expect(console.info).toHaveBeenCalledWith(
				`[SendMailService] Redis connection for queue '${mockQueueName}' quit gracefully.`
			)
		})

		it('should call disconnect if Redis quit fails', async () => {
			const quitError = new Error('Redis quit failed')
			mockRedisInstance.quit.mockRejectedValueOnce(quitError)
			// Simulate status not being 'end' after failed quit
			mockRedisInstance.status = 'ready'

			await mailService.closeConnection()

			expect(mockRedisInstance.quit).toHaveBeenCalledTimes(1)
			expect(console.error).toHaveBeenCalledWith(
				`[SendMailService] Error quitting Redis connection for queue '${mockQueueName}':`,
				quitError
			)
			expect(mockRedisInstance.disconnect).toHaveBeenCalledTimes(1)
			expect(console.info).toHaveBeenCalledWith(
				`[SendMailService] Redis connection for queue '${mockQueueName}' disconnected forcefully after quit error.`
			)
		})

		it('should not call quit or disconnect if Redis connection is already ended', async () => {
			mockRedisInstance.status = 'end'
			await mailService.closeConnection()
			expect(mockRedisInstance.quit).not.toHaveBeenCalled()
			expect(mockRedisInstance.disconnect).not.toHaveBeenCalled()
		})

		it('should handle cases where bullmq_queue or connection is null (defensive)', async () => {
			;(mailService as any).bullmq_queue = null
			;(mailService as any).connection = null
			await expect(mailService.closeConnection()).resolves.toBeUndefined() // Should not throw
		})
	})
})
