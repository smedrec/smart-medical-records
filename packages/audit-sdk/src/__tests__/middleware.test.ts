import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createAuditMiddleware, createWebSocketAuditMiddleware } from '../middleware.js'
import { AuditSDK } from '../sdk.js'

import type { NextFunction, Request, Response } from 'express'

// Mock the AuditSDK
vi.mock('../sdk.js', () => ({
	AuditSDK: vi.fn().mockImplementation(() => ({
		log: vi.fn().mockResolvedValue(undefined),
	})),
}))

describe('Audit Middleware', () => {
	let mockAuditSDK: AuditSDK
	let mockReq: Partial<Request>
	let mockRes: Partial<Response>
	let mockNext: NextFunction

	beforeEach(() => {
		mockAuditSDK = new AuditSDK({
			queueName: 'test-queue',
			redis: { url: 'redis://localhost:6379' },
		})

		mockReq = {
			method: 'GET',
			path: '/api/patients/123',
			query: { include: 'details' },
			ip: '192.168.1.100',
			get: vi.fn().mockImplementation((header: string) => {
				const headers: Record<string, string> = {
					'User-Agent': 'Test-Agent/1.0',
					Referer: 'https://example.com',
				}
				return headers[header]
			}),
			user: {
				id: 'user-123',
				organizationId: 'org-456',
			},
			sessionID: 'sess-abc123',
		}

		mockRes = {
			statusCode: 200,
			send: vi.fn().mockImplementation(function (this: any, body: any) {
				return this
			}),
			json: vi.fn().mockImplementation(function (this: any, obj: any) {
				return this
			}),
			end: vi.fn().mockImplementation(function (this: any, chunk?: any, encoding?: any) {
				return this
			}),
			get: vi.fn().mockImplementation((header: string) => {
				const headers: Record<string, string> = {
					'Content-Length': '1024',
				}
				return headers[header]
			}),
		}

		mockNext = vi.fn()
	})

	describe('Express Middleware', () => {
		it('should create middleware that logs requests', async () => {
			const middleware = createAuditMiddleware(mockAuditSDK)

			middleware(mockReq as Request, mockRes as Response, mockNext)

			// Trigger response
			mockRes.send!('test response')

			// Wait for async logging
			await new Promise((resolve) => setTimeout(resolve, 10))

			expect(mockNext).toHaveBeenCalled()
			expect(mockAuditSDK.log).toHaveBeenCalledWith(
				expect.objectContaining({
					principalId: 'user-123',
					action: 'api.get./api/patients/:id',
					status: 'success',
				})
			)
		})

		it('should skip requests when configured', () => {
			const middleware = createAuditMiddleware(mockAuditSDK, {
				skip: (req) => req.path.startsWith('/health'),
			})

			mockReq.path = '/health/check'

			middleware(mockReq as Request, mockRes as Response, mockNext)

			expect(mockNext).toHaveBeenCalled()
			expect(mockAuditSDK.log).not.toHaveBeenCalled()
		})

		it('should enrich events when configured', async () => {
			const middleware = createAuditMiddleware(mockAuditSDK, {
				enrich: (req, res, event) => ({
					...event,
					customField: 'custom-value',
				}),
			})

			middleware(mockReq as Request, mockRes as Response, mockNext)
			mockRes.send!('test response')

			await new Promise((resolve) => setTimeout(resolve, 10))

			expect(mockAuditSDK.log).toHaveBeenCalledWith(
				expect.objectContaining({
					customField: 'custom-value',
				})
			)
		})

		it('should handle errors gracefully', async () => {
			const mockOnError = vi.fn()
			const middleware = createAuditMiddleware(mockAuditSDK, {
				onError: mockOnError,
			})

			// Mock audit SDK to throw error
			mockAuditSDK.log = vi.fn().mockRejectedValue(new Error('Audit failed'))

			middleware(mockReq as Request, mockRes as Response, mockNext)
			mockRes.send!('test response')

			await new Promise((resolve) => setTimeout(resolve, 10))

			expect(mockOnError).toHaveBeenCalledWith(expect.any(Error), mockReq, mockRes)
		})

		it('should sample requests when configured', async () => {
			const middleware = createAuditMiddleware(mockAuditSDK, {
				performance: {
					sampleRate: 0, // Never sample
				},
			})

			middleware(mockReq as Request, mockRes as Response, mockNext)
			mockRes.send!('test response')

			await new Promise((resolve) => setTimeout(resolve, 10))

			expect(mockNext).toHaveBeenCalled()
			expect(mockAuditSDK.log).not.toHaveBeenCalled()
		})

		it('should classify data based on route', async () => {
			const middleware = createAuditMiddleware(mockAuditSDK)

			// Test PHI route
			mockReq.path = '/fhir/Patient/123'
			middleware(mockReq as Request, mockRes as Response, mockNext)
			mockRes.send!('patient data')

			await new Promise((resolve) => setTimeout(resolve, 10))

			expect(mockAuditSDK.log).toHaveBeenCalledWith(
				expect.objectContaining({
					dataClassification: 'PHI',
				})
			)
		})

		it('should extract FHIR context from FHIR routes', async () => {
			const middleware = createAuditMiddleware(mockAuditSDK)

			mockReq.path = '/fhir/Patient/123'
			mockReq.method = 'GET'
			mockReq.get = vi.fn().mockImplementation((header: string) => {
				if (header === 'FHIR-Version') return 'R4'
				return 'Test-Agent/1.0'
			})

			middleware(mockReq as Request, mockRes as Response, mockNext)
			mockRes.send!('patient data')

			await new Promise((resolve) => setTimeout(resolve, 10))

			expect(mockAuditSDK.log).toHaveBeenCalledWith(
				expect.objectContaining({
					fhirContext: {
						resourceType: 'Patient',
						resourceId: '123',
						interaction: 'read',
						version: 'R4',
						compartment: 'Patient/123',
					},
				})
			)
		})

		it('should handle different HTTP methods', async () => {
			const middleware = createAuditMiddleware(mockAuditSDK)

			// Test POST request
			mockReq.method = 'POST'
			mockReq.path = '/fhir/Patient'

			middleware(mockReq as Request, mockRes as Response, mockNext)
			mockRes.send!('created')

			await new Promise((resolve) => setTimeout(resolve, 10))

			expect(mockAuditSDK.log).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'api.post./fhir/Patient',
					fhirContext: expect.objectContaining({
						interaction: 'create',
					}),
				})
			)
		})

		it('should handle failed requests', async () => {
			const middleware = createAuditMiddleware(mockAuditSDK)

			mockRes.statusCode = 404

			middleware(mockReq as Request, mockRes as Response, mockNext)
			mockRes.send!('Not found')

			await new Promise((resolve) => setTimeout(resolve, 10))

			expect(mockAuditSDK.log).toHaveBeenCalledWith(
				expect.objectContaining({
					status: 'failure',
					outcomeDescription: expect.stringContaining('404'),
				})
			)
		})

		it('should handle anonymous users', async () => {
			const middleware = createAuditMiddleware(mockAuditSDK)

			delete mockReq.user
			delete mockReq.sessionID

			middleware(mockReq as Request, mockRes as Response, mockNext)
			mockRes.send!('response')

			await new Promise((resolve) => setTimeout(resolve, 10))

			expect(mockAuditSDK.log).toHaveBeenCalledWith(
				expect.objectContaining({
					principalId: 'anonymous',
					sessionContext: expect.objectContaining({
						sessionId: 'no-session',
					}),
				})
			)
		})
	})

	describe('WebSocket Middleware', () => {
		it('should create WebSocket middleware that logs events', async () => {
			const middleware = createWebSocketAuditMiddleware(mockAuditSDK)

			const mockSocket = {
				userId: 'user-123',
				id: 'socket-456',
				rooms: new Set(['room1', 'room2']),
				handshake: {
					address: '192.168.1.100',
					headers: {
						'user-agent': 'WebSocket-Client/1.0',
					},
				},
				emit: vi.fn(),
			}

			const mockNext = vi.fn()

			middleware(mockSocket, mockNext)

			// Simulate socket event
			mockSocket.emit('chat.message', { text: 'Hello' })

			await new Promise((resolve) => setTimeout(resolve, 10))

			expect(mockNext).toHaveBeenCalled()
			expect(mockAuditSDK.log).toHaveBeenCalledWith(
				expect.objectContaining({
					principalId: 'user-123',
					action: 'websocket.chat.message',
					status: 'success',
					sessionContext: expect.objectContaining({
						sessionId: 'socket-456',
						ipAddress: '192.168.1.100',
					}),
					websocketContext: expect.objectContaining({
						event: 'chat.message',
						socketId: 'socket-456',
						room: ['room1', 'room2'],
					}),
				})
			)
		})

		it('should handle anonymous WebSocket users', async () => {
			const middleware = createWebSocketAuditMiddleware(mockAuditSDK)

			const mockSocket = {
				id: 'socket-456',
				handshake: {
					address: '192.168.1.100',
					headers: {
						'user-agent': 'WebSocket-Client/1.0',
					},
				},
				emit: vi.fn(),
			}

			const mockNext = vi.fn()

			middleware(mockSocket, mockNext)
			mockSocket.emit('ping')

			await new Promise((resolve) => setTimeout(resolve, 10))

			expect(mockAuditSDK.log).toHaveBeenCalledWith(
				expect.objectContaining({
					principalId: 'anonymous',
				})
			)
		})
	})
})
