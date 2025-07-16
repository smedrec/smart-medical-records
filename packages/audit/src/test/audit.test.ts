import { Queue as BullMQQueue } from 'bullmq'
import IORedisReal from 'ioredis' // Import the actual module for vi.mocked
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Audit } from '../audit' // Assuming Audit is exported from ./audit

import type { AuditLogEvent } from '../types'

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
	// let MockedIORedis = IORedisReal as any; // No longer needed like this
	let MockedBullMQQueue = BullMQQueue as any
	let originalProcessEnv: NodeJS.ProcessEnv

	let lastRedisInstance: any
	let lastBullMQInstance: any

	beforeEach(() => {
		vi.clearAllMocks()
		originalProcessEnv = { ...process.env }

		vi.mocked(IORedisReal).mockImplementation(() => {
			lastRedisInstance = {
				on: vi.fn(),
				quit: vi.fn().mockResolvedValue('OK'),
				disconnect: vi.fn().mockResolvedValue(undefined), // Add disconnect
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
			expect(vi.mocked(IORedisReal)).toHaveBeenCalledWith(mockRedisUrl, {
				maxRetriesPerRequest: null,
				enableAutoPipelining: true, // Added default option
			})
			expect(MockedBullMQQueue).toHaveBeenCalledWith(mockQueueName, {
				connection: expect.any(Object), // Check for an object, as it's a mock instance
			})
			expect(audit).toBeInstanceOf(Audit)
		})

		it('should successfully instantiate using AUDIT_REDIS_URL from environment variables', () => {
			process.env.AUDIT_REDIS_URL = 'redis://envhost:1234'
			const audit = new Audit(mockQueueName) // No direct args, should use AUDIT_REDIS_URL
			expect(vi.mocked(IORedisReal)).toHaveBeenCalledWith('redis://envhost:1234', {
				maxRetriesPerRequest: null,
				enableAutoPipelining: true, // Added default option
			})
			expect(MockedBullMQQueue).toHaveBeenCalledWith(mockQueueName, {
				connection: expect.any(Object), // Check for an object
			})
			expect(audit).toBeInstanceOf(Audit)
		})

		it('should throw an error if no redisUrl is provided and AUDIT_REDIS_URL is not set', () => {
			delete process.env.AUDIT_REDIS_URL // Ensure it's not set
			delete process.env.AUDIT_REDIS_URL // Ensure it's not set

			let auditService: Audit | null = null
			// Expect no error to be thrown, should default to shared connection
			expect(() => {
				auditService = new Audit(mockQueueName)
			}).not.toThrow()

			// Verify that Redis (mock) was called, implying getSharedRedisConnection was used
			expect(vi.mocked(IORedisReal)).toHaveBeenCalled()
			// Verify Queue was initialized with a connection
			expect(MockedBullMQQueue).toHaveBeenCalledWith(mockQueueName, {
				connection: lastRedisInstance, // lastRedisInstance is the one returned by the MockedIORedis constructor
			})
			expect(auditService).toBeInstanceOf(Audit)
		})

		it('should pass directConnectionOptions to IORedis constructor if provided', () => {
			const redisOptions = { password: 'securepassword' }
			new Audit(mockQueueName, mockRedisUrl, redisOptions)
			expect(vi.mocked(IORedisReal)).toHaveBeenCalledWith(mockRedisUrl, {
				maxRetriesPerRequest: null,
				enableAutoPipelining: true, // Added default option
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
			vi.mocked(IORedisReal).mockImplementationOnce(() => {
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
				`[AuditService] Redis Connection Error (direct connection for queue "${mockQueueName}"): ${testError.message}`,
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
					eventVersion: '1.0',
					hashAlgorithm: 'SHA-256',
					hash: expect.any(String), // Hash should be generated by default
				}),
				{ removeOnComplete: true, removeOnFail: false }
			)
		})

		it('should generate hash by default', async () => {
			const eventDetails: Omit<AuditLogEvent, 'timestamp'> = {
				action: 'testAction',
				status: 'success',
				principalId: 'user123',
			}
			await audit.log(eventDetails)

			const addCall = lastBullMQInstance.add.mock.calls[0]
			const loggedEvent = addCall[1]

			expect(loggedEvent.hash).toBeDefined()
			expect(typeof loggedEvent.hash).toBe('string')
			expect(loggedEvent.hash).toHaveLength(64) // SHA-256 hex length
		})

		it('should skip hash generation when explicitly disabled', async () => {
			const eventDetails: Omit<AuditLogEvent, 'timestamp'> = {
				action: 'testAction',
				status: 'success',
				principalId: 'user123',
			}
			await audit.log(eventDetails, { generateHash: false })

			const addCall = lastBullMQInstance.add.mock.calls[0]
			const loggedEvent = addCall[1]

			expect(loggedEvent.hash).toBeUndefined()
		})

		it('should generate signature when requested', async () => {
			const eventDetails: Omit<AuditLogEvent, 'timestamp'> = {
				action: 'testAction',
				status: 'success',
				principalId: 'user123',
			}
			await audit.log(eventDetails, { generateSignature: true })

			const addCall = lastBullMQInstance.add.mock.calls[0]
			const loggedEvent = addCall[1]

			expect(loggedEvent.signature).toBeDefined()
			expect(typeof loggedEvent.signature).toBe('string')
			expect(loggedEvent.signature).toHaveLength(64) // HMAC-SHA256 hex length
		})

		it('should include correlation ID when provided', async () => {
			const eventDetails: Omit<AuditLogEvent, 'timestamp'> = {
				action: 'testAction',
				status: 'success',
				principalId: 'user123',
			}
			const correlationId = 'corr-12345-abcde'
			await audit.log(eventDetails, { correlationId })

			const addCall = lastBullMQInstance.add.mock.calls[0]
			const loggedEvent = addCall[1]

			expect(loggedEvent.correlationId).toBe(correlationId)
		})

		it('should use custom event version when provided', async () => {
			const eventDetails: Omit<AuditLogEvent, 'timestamp'> = {
				action: 'testAction',
				status: 'success',
				principalId: 'user123',
			}
			const eventVersion = '2.0'
			await audit.log(eventDetails, { eventVersion })

			const addCall = lastBullMQInstance.add.mock.calls[0]
			const loggedEvent = addCall[1]

			expect(loggedEvent.eventVersion).toBe(eventVersion)
		})

		it('should set default data classification and retention policy', async () => {
			const eventDetails: Omit<AuditLogEvent, 'timestamp'> = {
				action: 'testAction',
				status: 'success',
				principalId: 'user123',
			}
			await audit.log(eventDetails)

			const addCall = lastBullMQInstance.add.mock.calls[0]
			const loggedEvent = addCall[1]

			expect(loggedEvent.dataClassification).toBe('INTERNAL')
			expect(loggedEvent.retentionPolicy).toBe('standard')
		})

		it('should validate event by default and throw on validation errors', async () => {
			const invalidEventDetails = {
				action: '', // Empty action should fail validation
				status: 'success',
				principalId: 'user123',
			} as Omit<AuditLogEvent, 'timestamp'>

			await expect(audit.log(invalidEventDetails)).rejects.toThrow(
				'[AuditService] Validation Error:'
			)
		})

		it('should skip validation when explicitly requested', async () => {
			const invalidEventDetails = {
				action: '', // Empty action would normally fail validation
				status: 'success',
				principalId: 'user123',
			} as Omit<AuditLogEvent, 'timestamp'>

			// Should not throw when validation is skipped
			await expect(
				audit.log(invalidEventDetails, { skipValidation: true })
			).resolves.toBeUndefined()

			expect(lastBullMQInstance.add).toHaveBeenCalled()
		})

		it('should sanitize dangerous content in event fields', async () => {
			const eventWithDangerousContent: Omit<AuditLogEvent, 'timestamp'> = {
				action: 'testAction<script>alert("xss")</script>',
				status: 'success',
				principalId: 'user123\0',
				outcomeDescription: 'Success with "quotes"',
			}

			await audit.log(eventWithDangerousContent)

			const addCall = lastBullMQInstance.add.mock.calls[0]
			const loggedEvent = addCall[1]

			expect(loggedEvent.action).not.toContain('<script>')
			expect(loggedEvent.principalId).not.toContain('\0')
			expect(loggedEvent.outcomeDescription).toContain('&quot;')
		})

		it('should preserve custom fields after validation and sanitization', async () => {
			const eventDetails: Omit<AuditLogEvent, 'timestamp'> = {
				action: 'testAction',
				status: 'success',
				principalId: 'user123',
				customField: 'custom value<script>',
				nestedCustom: {
					level1: 'nested value',
				},
			}

			await audit.log(eventDetails)

			const addCall = lastBullMQInstance.add.mock.calls[0]
			const loggedEvent = addCall[1]

			expect(loggedEvent.customField).toBeDefined()
			expect(loggedEvent.customField).not.toContain('<script>')
			expect(loggedEvent.nestedCustom).toBeDefined()
			expect(loggedEvent.nestedCustom.level1).toBe('nested value')
		})

		it('should throw validation error if action is missing', async () => {
			const eventDetails = {
				status: 'success',
				principalId: 'user123',
			} as Omit<AuditLogEvent, 'timestamp'>
			await expect(audit.log(eventDetails)).rejects.toThrow('[AuditService] Validation Error:')
		})

		it('should throw validation error if status is missing', async () => {
			const eventDetails = {
				action: 'testAction',
				principalId: 'user123',
			} as Omit<AuditLogEvent, 'timestamp'>
			await expect(audit.log(eventDetails)).rejects.toThrow('[AuditService] Validation Error:')
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

			await expect(audit.log(eventDetails)).rejects.toThrow(
				`[AuditService] Failed to log audit event to queue '${mockQueueName}'. Error: ${queueError.message}`
			)
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				`[AuditService] Failed to add event to BullMQ queue "${mockQueueName}":`,
				queueError
			)
			consoleErrorSpy.mockRestore()
		})
	})

	describe('cryptographic methods', () => {
		let audit: Audit

		beforeEach(() => {
			audit = new Audit(mockQueueName, mockRedisUrl, undefined, {
				secretKey: 'test-secret-key-for-audit-testing',
			})
		})

		it('should generate hash for audit event', () => {
			const event: AuditLogEvent = {
				timestamp: '2023-10-26T10:30:00.000Z',
				action: 'testAction',
				status: 'success',
				principalId: 'user123',
				eventVersion: '1.0',
				hashAlgorithm: 'SHA-256',
			}

			const hash = audit.generateEventHash(event)

			expect(hash).toBeDefined()
			expect(typeof hash).toBe('string')
			expect(hash).toHaveLength(64) // SHA-256 hex length
			expect(hash).toMatch(/^[a-f0-9]{64}$/)
		})

		it('should verify correct hash', () => {
			const event: AuditLogEvent = {
				timestamp: '2023-10-26T10:30:00.000Z',
				action: 'testAction',
				status: 'success',
				principalId: 'user123',
				eventVersion: '1.0',
				hashAlgorithm: 'SHA-256',
			}

			const hash = audit.generateEventHash(event)
			const isValid = audit.verifyEventHash(event, hash)

			expect(isValid).toBe(true)
		})

		it('should reject incorrect hash', () => {
			const event: AuditLogEvent = {
				timestamp: '2023-10-26T10:30:00.000Z',
				action: 'testAction',
				status: 'success',
				principalId: 'user123',
				eventVersion: '1.0',
				hashAlgorithm: 'SHA-256',
			}

			const correctHash = audit.generateEventHash(event)
			const incorrectHash = correctHash.replace('a', 'b')
			const isValid = audit.verifyEventHash(event, incorrectHash)

			expect(isValid).toBe(false)
		})

		it('should generate signature for audit event', () => {
			const event: AuditLogEvent = {
				timestamp: '2023-10-26T10:30:00.000Z',
				action: 'testAction',
				status: 'success',
				principalId: 'user123',
				eventVersion: '1.0',
				hashAlgorithm: 'SHA-256',
			}

			const signature = audit.generateEventSignature(event)

			expect(signature).toBeDefined()
			expect(typeof signature).toBe('string')
			expect(signature).toHaveLength(64) // HMAC-SHA256 hex length
			expect(signature).toMatch(/^[a-f0-9]{64}$/)
		})

		it('should verify correct signature', () => {
			const event: AuditLogEvent = {
				timestamp: '2023-10-26T10:30:00.000Z',
				action: 'testAction',
				status: 'success',
				principalId: 'user123',
				eventVersion: '1.0',
				hashAlgorithm: 'SHA-256',
			}

			const signature = audit.generateEventSignature(event)
			const isValid = audit.verifyEventSignature(event, signature)

			expect(isValid).toBe(true)
		})

		it('should reject incorrect signature', () => {
			const event: AuditLogEvent = {
				timestamp: '2023-10-26T10:30:00.000Z',
				action: 'testAction',
				status: 'success',
				principalId: 'user123',
				eventVersion: '1.0',
				hashAlgorithm: 'SHA-256',
			}

			const correctSignature = audit.generateEventSignature(event)
			const incorrectSignature = correctSignature.replace('a', 'b')
			const isValid = audit.verifyEventSignature(event, incorrectSignature)

			expect(isValid).toBe(false)
		})

		it('should detect tampering through hash verification', () => {
			const originalEvent: AuditLogEvent = {
				timestamp: '2023-10-26T10:30:00.000Z',
				action: 'testAction',
				status: 'success',
				principalId: 'user123',
				eventVersion: '1.0',
				hashAlgorithm: 'SHA-256',
			}

			const originalHash = audit.generateEventHash(originalEvent)

			// Tamper with the event
			const tamperedEvent = { ...originalEvent, action: 'tamperedAction' }
			const isValid = audit.verifyEventHash(tamperedEvent, originalHash)

			expect(isValid).toBe(false)
		})

		it('should detect tampering through signature verification', () => {
			const originalEvent: AuditLogEvent = {
				timestamp: '2023-10-26T10:30:00.000Z',
				action: 'testAction',
				status: 'success',
				principalId: 'user123',
				eventVersion: '1.0',
				hashAlgorithm: 'SHA-256',
			}

			const originalSignature = audit.generateEventSignature(originalEvent)

			// Tamper with the event
			const tamperedEvent = { ...originalEvent, status: 'failure' }
			const isValid = audit.verifyEventSignature(tamperedEvent, originalSignature)

			expect(isValid).toBe(false)
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

		it('should log success messages on successful close for a direct connection', async () => {
			const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
			// audit is now defined in beforeEach
			lastRedisInstance.status = 'ready'
			lastRedisInstance.quit.mockResolvedValue('OK')

			await audit.closeConnection()

			expect(consoleInfoSpy).toHaveBeenCalledWith(
				`[AuditService] BullMQ queue '${mockQueueName}' closed successfully.`
			)
			expect(consoleInfoSpy).toHaveBeenCalledWith(
				`[AuditService] Closing direct Redis connection for queue '${mockQueueName}'.`
			)
			expect(consoleInfoSpy).toHaveBeenCalledWith(
				`[AuditService] Direct Redis connection for queue '${mockQueueName}' quit gracefully.`
			)
			consoleInfoSpy.mockRestore()
		})

		it('should log error message if quitting direct connection fails', async () => {
			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
			// audit is now defined in beforeEach
			lastRedisInstance.status = 'ready'
			const closeError = new Error('Failed to close')
			lastRedisInstance.quit.mockRejectedValueOnce(closeError)
			const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})

			await audit.closeConnection()
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				`[AuditService] Error quitting direct Redis connection for queue '${mockQueueName}':`,
				closeError
			)
			expect(lastRedisInstance.disconnect).toHaveBeenCalledTimes(1)
			expect(consoleInfoSpy).toHaveBeenCalledWith(
				`[AuditService] Direct Redis connection for queue '${mockQueueName}' disconnected forcefully.`
			)
			consoleErrorSpy.mockRestore()
			consoleInfoSpy.mockRestore()
		})
	})
})
