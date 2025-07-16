import type { NextFunction, Request, Response } from 'express'
import type { AuditSDK } from './sdk.js'
import type { MiddlewareOptions } from './types.js'

/**
 * Express middleware for automatic audit logging
 */
export function createAuditMiddleware(auditSDK: AuditSDK, options: MiddlewareOptions = {}) {
	return (req: Request, res: Response, next: NextFunction) => {
		// Skip if configured to skip this request
		if (options.skip && options.skip(req)) {
			return next()
		}

		const startTime = Date.now()

		// Sample requests based on configuration
		if (options.performance?.sampleRate) {
			if (Math.random() > options.performance.sampleRate) {
				return next()
			}
		}

		// Capture original response methods
		const originalSend = res.send
		const originalJson = res.json
		const originalEnd = res.end

		let responseBody: any
		let responseSent = false

		// Override response methods to capture data
		res.send = function (body: any) {
			if (!responseSent) {
				responseBody = body
				void logRequest()
				responseSent = true
			}
			return originalSend.call(this, body)
		}

		res.json = function (obj: any) {
			if (!responseSent) {
				responseBody = obj
				void logRequest()
				responseSent = true
			}
			return originalJson.call(this, obj)
		}

		res.end = function (chunk?: any, encoding?: any) {
			if (!responseSent) {
				responseBody = chunk
				void logRequest()
				responseSent = true
			}
			return originalEnd.call(this, chunk, encoding)
		}

		async function logRequest() {
			const processingTime = Date.now() - startTime

			// Skip if processing time exceeds threshold
			if (options.performance?.maxLatency && processingTime > options.performance.maxLatency) {
				return
			}

			try {
				let eventDetails: any = {
					principalId: (req as any).user?.id || 'anonymous',
					action: `api.${req.method.toLowerCase()}.${getRoutePath(req)}`,
					status: res.statusCode < 400 ? 'success' : 'failure',
					outcomeDescription: `${req.method} ${req.path} - ${res.statusCode}`,
					processingLatency: processingTime,
					sessionContext: {
						sessionId: (req as any).sessionID || 'no-session',
						ipAddress: getClientIP(req),
						userAgent: req.get('User-Agent') || 'unknown',
					},
					apiDetails: {
						method: req.method,
						path: req.path,
						query: req.query,
						statusCode: res.statusCode,
						contentLength: res.get('Content-Length'),
						userAgent: req.get('User-Agent'),
						referer: req.get('Referer'),
					},
				}

				// Enrich event with custom data
				if (options.enrich) {
					eventDetails = options.enrich(req, res, eventDetails)
				}

				// Determine data classification based on route
				eventDetails.dataClassification = getDataClassification(req.path)

				// Add FHIR-specific context if applicable
				if (req.path.includes('/fhir/')) {
					eventDetails.fhirContext = extractFHIRContext(req)
				}

				await auditSDK.log(eventDetails)
			} catch (error) {
				if (options.onError) {
					options.onError(error as Error, req, res)
				} else {
					console.error('Audit middleware error:', error)
				}
			}
		}

		next()
	}
}

/**
 * Get the route path for logging
 */
function getRoutePath(req: Request): string {
	// Try to get the route pattern if available
	if ((req as any).route?.path) {
		return (req as any).route.path
	}

	// Fallback to actual path with parameter normalization
	return req.path.replace(/\/\d+/g, '/:id').replace(/\/[a-f0-9-]{36}/g, '/:uuid')
}

/**
 * Get client IP address
 */
function getClientIP(req: Request): string {
	return (
		req.ip ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		(req.connection as any)?.socket?.remoteAddress ||
		'unknown'
	)
}

/**
 * Determine data classification based on route
 */
function getDataClassification(path: string): 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'PHI' {
	// PHI routes
	if (path.includes('/fhir/') || path.includes('/patient/') || path.includes('/health/')) {
		return 'PHI'
	}

	// Admin routes
	if (path.includes('/admin/') || path.includes('/config/')) {
		return 'CONFIDENTIAL'
	}

	// Auth routes
	if (path.includes('/auth/') || path.includes('/login/') || path.includes('/user/')) {
		return 'INTERNAL'
	}

	// Public routes
	if (path.includes('/public/') || path.includes('/docs/') || path.includes('/health-check/')) {
		return 'PUBLIC'
	}

	return 'INTERNAL'
}

/**
 * Extract FHIR-specific context from request
 */
function extractFHIRContext(req: Request) {
	const pathParts = req.path.split('/')
	const fhirIndex = pathParts.indexOf('fhir')

	if (fhirIndex === -1) return {}

	const resourceType = pathParts[fhirIndex + 1]
	const resourceId = pathParts[fhirIndex + 2]
	const interaction = getInteractionType(req.method, !!resourceId)

	return {
		resourceType,
		resourceId,
		interaction,
		version: req.get('FHIR-Version') || 'R4',
		compartment: resourceType && resourceId ? `${resourceType}/${resourceId}` : undefined,
	}
}

/**
 * Determine FHIR interaction type
 */
function getInteractionType(method: string, hasId: boolean): string {
	switch (method.toUpperCase()) {
		case 'GET':
			return hasId ? 'read' : 'search'
		case 'POST':
			return 'create'
		case 'PUT':
			return 'update'
		case 'PATCH':
			return 'patch'
		case 'DELETE':
			return 'delete'
		default:
			return 'unknown'
	}
}

/**
 * Middleware for WebSocket audit logging
 */
export function createWebSocketAuditMiddleware(auditSDK: AuditSDK) {
	return (socket: any, next: any) => {
		const originalEmit = socket.emit

		socket.emit = function (event: string, ...args: any[]) {
			// Log WebSocket events
			auditSDK
				.log({
					principalId: socket.userId || 'anonymous',
					action: `websocket.${event}`,
					status: 'success',
					outcomeDescription: `WebSocket event: ${event}`,
					sessionContext: {
						sessionId: socket.id,
						ipAddress: socket.handshake.address,
						userAgent: socket.handshake.headers['user-agent'],
					},
					websocketContext: {
						event,
						socketId: socket.id,
						room: socket.rooms ? Array.from(socket.rooms) : [],
					},
				})
				.catch((error) => {
					console.error('WebSocket audit error:', error)
				})

			return originalEmit.apply(this, [event, ...args])
		}

		next()
	}
}

/**
 * Middleware for GraphQL audit logging
 */
export function createGraphQLAuditMiddleware(auditSDK: AuditSDK) {
	return {
		requestDidStart() {
			return {
				didResolveOperation(requestContext: any) {
					const { request, operationName, operation } = requestContext

					auditSDK
						.log({
							principalId: requestContext.context.user?.id || 'anonymous',
							action: `graphql.${operation.operation}.${operationName || 'anonymous'}`,
							status: 'attempt',
							outcomeDescription: `GraphQL ${operation.operation}: ${operationName}`,
							sessionContext: requestContext.context.sessionContext,
							graphqlContext: {
								operation: operation.operation,
								operationName,
								query: request.query,
								variables: request.variables,
							},
						})
						.catch((error) => {
							console.error('GraphQL audit error:', error)
						})
				},

				didEncounterErrors(requestContext: any) {
					const { errors, operationName, operation } = requestContext

					auditSDK
						.log({
							principalId: requestContext.context.user?.id || 'anonymous',
							action: `graphql.${operation.operation}.${operationName || 'anonymous'}`,
							status: 'failure',
							outcomeDescription: `GraphQL error: ${errors[0]?.message}`,
							sessionContext: requestContext.context.sessionContext,
							errorDetails: {
								errors: errors.map((err: any) => ({
									message: err.message,
									path: err.path,
									extensions: err.extensions,
								})),
							},
						})
						.catch((error) => {
							console.error('GraphQL audit error:', error)
						})
				},
			}
		},
	}
}
