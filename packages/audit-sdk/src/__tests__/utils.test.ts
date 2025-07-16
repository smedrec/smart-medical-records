import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
	AuditEventBatcher,
	AuditEventEnricher,
	AuditRateLimiter,
	createCorrelationId,
	eventToCSV,
	extractUserContext,
	formatEventForDisplay,
	generateEventHash,
	getCSVHeader,
	maskSensitiveData,
	validateEventStructure,
} from '../utils.js'

import type { AuditLogEvent } from '@repo/audit'

describe('Audit SDK Utils', () => {
	describe('createCorrelationId', () => {
		it('should create a correlation ID without prefix', () => {
			const id = createCorrelationId()
			expect(id).toMatch(/^[a-z0-9]+-[a-z0-9]+$/)
		})

		it('should create a correlation ID with prefix', () => {
			const id = createCorrelationId('test')
			expect(id).toMatch(/^test-[a-z0-9]+-[a-z0-9]+$/)
		})
	})

	describe('maskSensitiveData', () => {
		it('should mask default sensitive fields', () => {
			const event: AuditLogEvent = {
				timestamp: '2024-01-01T00:00:00Z',
				action: 'user.login',
				status: 'success',
				principalId: 'user-123',
				userPassword: 'secret123',
				apiToken: 'abc123',
			}

			const masked = maskSensitiveData(event)
			expect(masked.userPassword).toBe('***MASKED***')
			expect(masked.apiToken).toBe('***MASKED***')
			expect(masked.principalId).toBe('user-123') // Not masked
		})

		it('should mask custom sensitive fields', () => {
			const event: AuditLogEvent = {
				timestamp: '2024-01-01T00:00:00Z',
				action: 'user.login',
				status: 'success',
				ssn: '123-45-6789',
				creditCard: '4111-1111-1111-1111',
			}

			const masked = maskSensitiveData(event, ['ssn', 'creditCard'])
			expect(masked.ssn).toBe('***MASKED***')
			expect(masked.creditCard).toBe('***MASKED***')
		})

		it('should handle nested objects', () => {
			const event: AuditLogEvent = {
				timestamp: '2024-01-01T00:00:00Z',
				action: 'user.login',
				status: 'success',
				userDetails: {
					password: 'secret',
					email: 'user@example.com',
				},
			}

			const masked = maskSensitiveData(event)
			expect(masked.userDetails.password).toBe('***MASKED***')
			expect(masked.userDetails.email).toBe('user@example.com')
		})
	})

	describe('extractUserContext', () => {
		it('should extract context from JWT user', () => {
			const req = {
				user: {
					id: 'user-123',
					organizationId: 'org-456',
					roles: ['doctor', 'admin'],
				},
			}

			const context = extractUserContext(req)
			expect(context.principalId).toBe('user-123')
			expect(context.organizationId).toBe('org-456')
			expect(context.roles).toEqual(['doctor', 'admin'])
		})

		it('should extract context from API key', () => {
			const req = {
				apiKey: {
					id: 'api-key-123',
					organizationId: 'org-456',
				},
			}

			const context = extractUserContext(req)
			expect(context.principalId).toBe('api-key-123')
			expect(context.organizationId).toBe('org-456')
		})

		it('should extract context from session', () => {
			const req = {
				session: {
					user: {
						id: 'user-123',
						organizationId: 'org-456',
						roles: ['nurse'],
					},
				},
			}

			const context = extractUserContext(req)
			expect(context.principalId).toBe('user-123')
			expect(context.organizationId).toBe('org-456')
			expect(context.roles).toEqual(['nurse'])
		})

		it('should return empty context when no auth info', () => {
			const req = {}
			const context = extractUserContext(req)
			expect(context).toEqual({})
		})
	})

	describe('generateEventHash', () => {
		it('should generate consistent hash for same event', () => {
			const event = {
				principalId: 'user-123',
				action: 'test.action',
				status: 'success' as const,
				timestamp: '2024-01-01T00:00:00Z',
			}

			const hash1 = generateEventHash(event)
			const hash2 = generateEventHash(event)
			expect(hash1).toBe(hash2)
		})

		it('should generate different hash for different events', () => {
			const event1 = {
				principalId: 'user-123',
				action: 'test.action1',
				status: 'success' as const,
			}

			const event2 = {
				principalId: 'user-123',
				action: 'test.action2',
				status: 'success' as const,
			}

			const hash1 = generateEventHash(event1)
			const hash2 = generateEventHash(event2)
			expect(hash1).not.toBe(hash2)
		})
	})

	describe('AuditEventBatcher', () => {
		let batcher: AuditEventBatcher
		let mockFlush: ReturnType<typeof vi.fn>

		beforeEach(() => {
			mockFlush = vi.fn().mockResolvedValue(undefined)
			batcher = new AuditEventBatcher(3, 1000, mockFlush)
		})

		afterEach(() => {
			batcher.stop()
		})

		it('should batch events and flush when batch size reached', async () => {
			const events = [
				{ timestamp: '2024-01-01T00:00:00Z', action: 'test1', status: 'success' as const },
				{ timestamp: '2024-01-01T00:00:01Z', action: 'test2', status: 'success' as const },
				{ timestamp: '2024-01-01T00:00:02Z', action: 'test3', status: 'success' as const },
			]

			events.forEach((event) => batcher.add(event))

			// Wait a bit for async flush
			await new Promise((resolve) => setTimeout(resolve, 10))

			expect(mockFlush).toHaveBeenCalledWith(events)
		})

		it('should flush remaining events on stop', async () => {
			const event = {
				timestamp: '2024-01-01T00:00:00Z',
				action: 'test',
				status: 'success' as const,
			}
			batcher.add(event)

			batcher.stop()
			await new Promise((resolve) => setTimeout(resolve, 10))

			expect(mockFlush).toHaveBeenCalledWith([event])
		})
	})

	describe('AuditRateLimiter', () => {
		let rateLimiter: AuditRateLimiter

		beforeEach(() => {
			rateLimiter = new AuditRateLimiter(2, 1000) // 2 events per second
		})

		it('should allow events within limit', () => {
			expect(rateLimiter.isAllowed('user-123')).toBe(true)
			expect(rateLimiter.isAllowed('user-123')).toBe(true)
		})

		it('should block events over limit', () => {
			rateLimiter.isAllowed('user-123')
			rateLimiter.isAllowed('user-123')
			expect(rateLimiter.isAllowed('user-123')).toBe(false)
		})

		it('should reset after time window', async () => {
			rateLimiter.isAllowed('user-123')
			rateLimiter.isAllowed('user-123')
			expect(rateLimiter.isAllowed('user-123')).toBe(false)

			// Fast forward time by mocking Date.now
			const originalNow = Date.now
			Date.now = vi.fn().mockReturnValue(originalNow() + 2000)

			expect(rateLimiter.isAllowed('user-123')).toBe(true)

			Date.now = originalNow
		})
	})

	describe('AuditEventEnricher', () => {
		let enricher: AuditEventEnricher

		beforeEach(() => {
			enricher = new AuditEventEnricher()
		})

		it('should enrich events with added data', async () => {
			const event: AuditLogEvent = {
				timestamp: '2024-01-01T00:00:00Z',
				action: 'test.action',
				status: 'success',
			}

			enricher.addEnricher((event) => ({
				...event,
				enrichedField: 'enriched-value',
			}))

			const enrichedEvent = await enricher.enrich(event)
			expect(enrichedEvent.enrichedField).toBe('enriched-value')
		})

		it('should apply multiple enrichers in order', async () => {
			const event: AuditLogEvent = {
				timestamp: '2024-01-01T00:00:00Z',
				action: 'test.action',
				status: 'success',
			}

			enricher.addEnricher((event) => ({ ...event, field1: 'value1' }))
			enricher.addEnricher((event) => ({ ...event, field2: 'value2' }))

			const enrichedEvent = await enricher.enrich(event)
			expect(enrichedEvent.field1).toBe('value1')
			expect(enrichedEvent.field2).toBe('value2')
		})
	})

	describe('validateEventStructure', () => {
		it('should return no errors for valid event', () => {
			const event = {
				action: 'test.action',
				status: 'success' as const,
				dataClassification: 'INTERNAL' as const,
			}

			const errors = validateEventStructure(event)
			expect(errors).toHaveLength(0)
		})

		it('should return errors for missing required fields', () => {
			const event = {
				status: 'success' as const,
			}

			const errors = validateEventStructure(event)
			expect(errors).toContain('Action is required')
		})

		it('should return errors for invalid status', () => {
			const event = {
				action: 'test.action',
				status: 'invalid' as any,
			}

			const errors = validateEventStructure(event)
			expect(errors).toContain('Status must be one of: attempt, success, failure')
		})

		it('should return errors for invalid data classification', () => {
			const event = {
				action: 'test.action',
				status: 'success' as const,
				dataClassification: 'INVALID' as any,
			}

			const errors = validateEventStructure(event)
			expect(errors).toContain(
				'Data classification must be one of: PUBLIC, INTERNAL, CONFIDENTIAL, PHI'
			)
		})
	})

	describe('formatEventForDisplay', () => {
		it('should format event for display', () => {
			const event: AuditLogEvent = {
				timestamp: '2024-01-01T12:00:00Z',
				principalId: 'user-123',
				action: 'fhir.patient.read',
				targetResourceType: 'Patient',
				targetResourceId: 'patient-456',
				status: 'success',
			}

			const formatted = formatEventForDisplay(event)
			expect(formatted).toContain('user-123')
			expect(formatted).toContain('fhir.patient.read')
			expect(formatted).toContain('Patient/patient-456')
			expect(formatted).toContain('SUCCESS')
		})

		it('should handle missing optional fields', () => {
			const event: AuditLogEvent = {
				timestamp: '2024-01-01T12:00:00Z',
				action: 'system.startup',
				status: 'success',
			}

			const formatted = formatEventForDisplay(event)
			expect(formatted).toContain('Unknown')
			expect(formatted).toContain('N/A')
			expect(formatted).toContain('SUCCESS')
		})
	})

	describe('CSV Functions', () => {
		it('should convert event to CSV row', () => {
			const event: AuditLogEvent = {
				timestamp: '2024-01-01T12:00:00Z',
				principalId: 'user-123',
				organizationId: 'org-456',
				action: 'test.action',
				targetResourceType: 'Patient',
				targetResourceId: 'patient-789',
				status: 'success',
				outcomeDescription: 'Test event',
				dataClassification: 'PHI',
				sessionContext: {
					sessionId: 'sess-123',
					ipAddress: '192.168.1.100',
					userAgent: 'Test Agent',
				},
				hash: 'test-hash',
				signature: 'test-signature',
			}

			const csv = eventToCSV(event)
			expect(csv).toContain('"2024-01-01T12:00:00Z"')
			expect(csv).toContain('"user-123"')
			expect(csv).toContain('"test.action"')
			expect(csv).toContain('"192.168.1.100"')
		})

		it('should get CSV header', () => {
			const header = getCSVHeader()
			expect(header).toContain('"Timestamp"')
			expect(header).toContain('"Principal ID"')
			expect(header).toContain('"Action"')
			expect(header).toContain('"Status"')
		})

		it('should handle quotes in CSV data', () => {
			const event: AuditLogEvent = {
				timestamp: '2024-01-01T12:00:00Z',
				action: 'test.action',
				status: 'success',
				outcomeDescription: 'Event with "quotes" in description',
			}

			const csv = eventToCSV(event)
			expect(csv).toContain('""quotes""') // Escaped quotes
		})
	})
})
