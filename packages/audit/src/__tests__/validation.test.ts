import { describe, expect, it } from 'vitest'

import {
	AuditSanitizationError,
	AuditValidationError,
	DEFAULT_VALIDATION_CONFIG,
	sanitizeAuditEvent,
	validateAndSanitizeAuditEvent,
	validateAuditEvent,
} from '../validation.js'

import type { AuditLogEvent, DataClassification, SessionContext } from '../types.js'
import type { ValidationConfig } from '../validation.js'

describe('Audit Event Validation', () => {
	const validEvent: AuditLogEvent = {
		timestamp: '2023-10-26T10:30:00.000Z',
		action: 'testAction',
		status: 'success',
		principalId: 'user-123',
		eventVersion: '1.0',
		hashAlgorithm: 'SHA-256',
		dataClassification: 'INTERNAL',
		retentionPolicy: 'standard',
	}

	describe('validateAuditEvent', () => {
		it('should validate a correct audit event', () => {
			const result = validateAuditEvent(validEvent)

			expect(result.isValid).toBe(true)
			expect(result.errors).toHaveLength(0)
			expect(result.warnings).toHaveLength(0)
		})

		it('should fail validation for missing required fields', () => {
			const invalidEvent = { ...validEvent }
			delete invalidEvent.timestamp
			delete invalidEvent.action

			const result = validateAuditEvent(invalidEvent)

			expect(result.isValid).toBe(false)
			expect(result.errors).toHaveLength(2)
			expect(result.errors[0].field).toBe('timestamp')
			expect(result.errors[0].code).toBe('REQUIRED_FIELD_MISSING')
			expect(result.errors[1].field).toBe('action')
			expect(result.errors[1].code).toBe('REQUIRED_FIELD_MISSING')
		})

		it('should fail validation for invalid timestamp format', () => {
			const invalidEvent = { ...validEvent, timestamp: 'invalid-timestamp' }

			const result = validateAuditEvent(invalidEvent)

			expect(result.isValid).toBe(false)
			expect(result.errors).toHaveLength(1)
			expect(result.errors[0].field).toBe('timestamp')
			expect(result.errors[0].code).toBe('INVALID_FORMAT')
		})

		it('should fail validation for non-string timestamp', () => {
			const invalidEvent = { ...validEvent, timestamp: 123 as any }

			const result = validateAuditEvent(invalidEvent)

			expect(result.isValid).toBe(false)
			expect(result.errors).toHaveLength(1)
			expect(result.errors[0].field).toBe('timestamp')
			expect(result.errors[0].code).toBe('INVALID_TYPE')
		})

		it('should fail validation for empty action', () => {
			const invalidEvent = { ...validEvent, action: '' }

			const result = validateAuditEvent(invalidEvent)

			expect(result.isValid).toBe(false)
			expect(result.errors).toHaveLength(1)
			expect(result.errors[0].field).toBe('action')
			expect(result.errors[0].code).toBe('EMPTY_VALUE')
		})

		it('should fail validation for non-string action', () => {
			const invalidEvent = { ...validEvent, action: 123 as any }

			const result = validateAuditEvent(invalidEvent)

			expect(result.isValid).toBe(false)
			expect(result.errors).toHaveLength(1)
			expect(result.errors[0].field).toBe('action')
			expect(result.errors[0].code).toBe('INVALID_TYPE')
		})

		it('should fail validation for action exceeding max length', () => {
			const config: ValidationConfig = { ...DEFAULT_VALIDATION_CONFIG, maxStringLength: 10 }
			const invalidEvent = { ...validEvent, action: 'a'.repeat(15) }

			const result = validateAuditEvent(invalidEvent, config)

			expect(result.isValid).toBe(false)
			expect(result.errors).toHaveLength(1)
			expect(result.errors[0].field).toBe('action')
			expect(result.errors[0].code).toBe('EXCEEDS_MAX_LENGTH')
		})

		it('should fail validation for invalid status', () => {
			const invalidEvent = { ...validEvent, status: 'invalid-status' as any }

			const result = validateAuditEvent(invalidEvent)

			expect(result.isValid).toBe(false)
			expect(result.errors).toHaveLength(1)
			expect(result.errors[0].field).toBe('status')
			expect(result.errors[0].code).toBe('INVALID_VALUE')
		})

		it('should fail validation for invalid data classification', () => {
			const invalidEvent = { ...validEvent, dataClassification: 'INVALID' as DataClassification }

			const result = validateAuditEvent(invalidEvent)

			expect(result.isValid).toBe(false)
			expect(result.errors).toHaveLength(1)
			expect(result.errors[0].field).toBe('dataClassification')
			expect(result.errors[0].code).toBe('INVALID_VALUE')
		})

		it('should fail validation for invalid hash algorithm', () => {
			const invalidEvent = { ...validEvent, hashAlgorithm: 'MD5' as any }

			const result = validateAuditEvent(invalidEvent)

			expect(result.isValid).toBe(false)
			expect(result.errors).toHaveLength(1)
			expect(result.errors[0].field).toBe('hashAlgorithm')
			expect(result.errors[0].code).toBe('INVALID_VALUE')
		})

		it('should warn for unknown event version', () => {
			const eventWithUnknownVersion = { ...validEvent, eventVersion: '3.0' }

			const result = validateAuditEvent(eventWithUnknownVersion)

			expect(result.isValid).toBe(true)
			expect(result.warnings).toHaveLength(1)
			expect(result.warnings[0]).toContain(
				"Event version '3.0' is not in the list of known versions"
			)
		})

		it('should fail validation for negative processing latency', () => {
			const invalidEvent = { ...validEvent, processingLatency: -100 }

			const result = validateAuditEvent(invalidEvent)

			expect(result.isValid).toBe(false)
			expect(result.errors).toHaveLength(1)
			expect(result.errors[0].field).toBe('processingLatency')
			expect(result.errors[0].code).toBe('INVALID_VALUE')
		})

		it('should fail validation for negative queue depth', () => {
			const invalidEvent = { ...validEvent, queueDepth: -5 }

			const result = validateAuditEvent(invalidEvent)

			expect(result.isValid).toBe(false)
			expect(result.errors).toHaveLength(1)
			expect(result.errors[0].field).toBe('queueDepth')
			expect(result.errors[0].code).toBe('INVALID_VALUE')
		})

		it('should validate string fields for max length', () => {
			const config: ValidationConfig = { ...DEFAULT_VALIDATION_CONFIG, maxStringLength: 5 }
			const invalidEvent = {
				...validEvent,
				principalId: 'very-long-principal-id',
				organizationId: 'very-long-org-id',
			}

			const result = validateAuditEvent(invalidEvent, config)

			expect(result.isValid).toBe(false)
			expect(result.errors.length).toBeGreaterThanOrEqual(2)
			expect(result.errors.some((e) => e.field === 'principalId')).toBe(true)
			expect(result.errors.some((e) => e.field === 'organizationId')).toBe(true)
		})
	})

	describe('Session Context Validation', () => {
		it('should validate correct session context', () => {
			const eventWithSession: AuditLogEvent = {
				...validEvent,
				sessionContext: {
					sessionId: 'sess-123',
					ipAddress: '192.168.1.1',
					userAgent: 'Mozilla/5.0',
					geolocation: 'US',
				},
			}

			const result = validateAuditEvent(eventWithSession)

			expect(result.isValid).toBe(true)
			expect(result.errors).toHaveLength(0)
		})

		it('should fail validation for missing session context fields', () => {
			const eventWithInvalidSession: AuditLogEvent = {
				...validEvent,
				sessionContext: {
					sessionId: '',
					ipAddress: '',
					userAgent: '',
				} as SessionContext,
			}

			const result = validateAuditEvent(eventWithInvalidSession)

			expect(result.isValid).toBe(false)
			expect(result.errors.length).toBeGreaterThan(0)
			expect(result.errors.some((e) => e.field === 'sessionContext.sessionId')).toBe(true)
			expect(result.errors.some((e) => e.field === 'sessionContext.ipAddress')).toBe(true)
			expect(result.errors.some((e) => e.field === 'sessionContext.userAgent')).toBe(true)
		})

		it('should fail validation for invalid IP address', () => {
			const eventWithInvalidIP: AuditLogEvent = {
				...validEvent,
				sessionContext: {
					sessionId: 'sess-123',
					ipAddress: '999.999.999.999',
					userAgent: 'Mozilla/5.0',
				},
			}

			const result = validateAuditEvent(eventWithInvalidIP)

			expect(result.isValid).toBe(false)
			expect(result.errors).toHaveLength(1)
			expect(result.errors[0].field).toBe('sessionContext.ipAddress')
			expect(result.errors[0].code).toBe('INVALID_FORMAT')
		})

		it('should validate IPv6 addresses', () => {
			const eventWithIPv6: AuditLogEvent = {
				...validEvent,
				sessionContext: {
					sessionId: 'sess-123',
					ipAddress: '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
					userAgent: 'Mozilla/5.0',
				},
			}

			const result = validateAuditEvent(eventWithIPv6)

			expect(result.isValid).toBe(true)
			expect(result.errors).toHaveLength(0)
		})
	})

	describe('Custom Fields Depth Validation', () => {
		it('should fail validation for deeply nested objects', () => {
			const config: ValidationConfig = { ...DEFAULT_VALIDATION_CONFIG, maxCustomFieldDepth: 2 }
			const eventWithDeepNesting: AuditLogEvent = {
				...validEvent,
				customField: {
					level1: {
						level2: {
							level3: {
								level4: 'too deep',
							},
						},
					},
				},
			}

			const result = validateAuditEvent(eventWithDeepNesting, config)

			expect(result.isValid).toBe(false)
			expect(result.errors).toHaveLength(1)
			expect(result.errors[0].code).toBe('EXCEEDS_MAX_DEPTH')
		})

		it('should pass validation for acceptable nesting depth', () => {
			const config: ValidationConfig = { ...DEFAULT_VALIDATION_CONFIG, maxCustomFieldDepth: 3 }
			const eventWithAcceptableNesting: AuditLogEvent = {
				...validEvent,
				customField: {
					level1: {
						level2: {
							level3: 'acceptable',
						},
					},
				},
			}

			const result = validateAuditEvent(eventWithAcceptableNesting, config)

			expect(result.isValid).toBe(true)
			expect(result.errors).toHaveLength(0)
		})
	})
})

describe('Audit Event Sanitization', () => {
	const eventWithDangerousContent: AuditLogEvent = {
		timestamp: '2023-10-26T10:30:00.000Z',
		action: 'testAction<script>alert("xss")</script>',
		status: 'success',
		principalId: 'user-123\0\x01',
		outcomeDescription: 'Success with "quotes" and \'apostrophes\'',
		eventVersion: '1.0',
		hashAlgorithm: 'SHA-256',
		customField: '<img src="x" onerror="alert(1)">',
	}

	describe('sanitizeAuditEvent', () => {
		it('should sanitize dangerous content', () => {
			const result = sanitizeAuditEvent(eventWithDangerousContent)

			expect(result.modified).toBe(true)
			expect(result.warnings.length).toBeGreaterThan(0)
			expect(result.sanitizedEvent.action).not.toContain('<script>')
			expect(result.sanitizedEvent.principalId).not.toContain('\0')
			expect(result.sanitizedEvent.outcomeDescription).toContain('&quot;')
			expect(result.sanitizedEvent.customField).not.toContain('<img')
		})

		it('should not modify clean content', () => {
			const cleanEvent: AuditLogEvent = {
				timestamp: '2023-10-26T10:30:00.000Z',
				action: 'cleanAction',
				status: 'success',
				principalId: 'user-123',
				eventVersion: '1.0',
				hashAlgorithm: 'SHA-256',
			}

			const result = sanitizeAuditEvent(cleanEvent)

			expect(result.modified).toBe(false)
			expect(result.warnings).toHaveLength(0)
			expect(result.sanitizedEvent).toEqual(cleanEvent)
		})

		it('should normalize data classification', () => {
			const eventWithLowercaseClassification: AuditLogEvent = {
				timestamp: '2023-10-26T10:30:00.000Z',
				action: 'testAction',
				status: 'success',
				eventVersion: '1.0',
				hashAlgorithm: 'SHA-256',
				dataClassification: 'phi' as any,
			}

			const result = sanitizeAuditEvent(eventWithLowercaseClassification)

			expect(result.modified).toBe(true)
			expect(result.sanitizedEvent.dataClassification).toBe('PHI')
		})

		it('should sanitize session context', () => {
			const eventWithDangerousSession: AuditLogEvent = {
				timestamp: '2023-10-26T10:30:00.000Z',
				action: 'testAction',
				status: 'success',
				eventVersion: '1.0',
				hashAlgorithm: 'SHA-256',
				sessionContext: {
					sessionId: 'sess-123<script>',
					ipAddress: '192.168.1.1',
					userAgent: 'Mozilla/5.0 with "quotes"',
					geolocation: 'US<img>',
				},
			}

			const result = sanitizeAuditEvent(eventWithDangerousSession)

			expect(result.modified).toBe(true)
			expect(result.sanitizedEvent.sessionContext?.sessionId).not.toContain('<script>')
			expect(result.sanitizedEvent.sessionContext?.userAgent).toContain('&quot;')
			expect(result.sanitizedEvent.sessionContext?.geolocation).not.toContain('<img>')
		})

		it('should normalize IP addresses', () => {
			const eventWithIPToNormalize: AuditLogEvent = {
				timestamp: '2023-10-26T10:30:00.000Z',
				action: 'testAction',
				status: 'success',
				eventVersion: '1.0',
				hashAlgorithm: 'SHA-256',
				sessionContext: {
					sessionId: 'sess-123',
					ipAddress: '192.168.001.001',
					userAgent: 'Mozilla/5.0',
				},
			}

			const result = sanitizeAuditEvent(eventWithIPToNormalize)

			expect(result.modified).toBe(true)
			expect(result.sanitizedEvent.sessionContext?.ipAddress).toBe('192.168.1.1')
		})

		it('should handle nested custom fields', () => {
			const eventWithNestedDangerous: AuditLogEvent = {
				timestamp: '2023-10-26T10:30:00.000Z',
				action: 'testAction',
				status: 'success',
				eventVersion: '1.0',
				hashAlgorithm: 'SHA-256',
				customData: {
					level1: {
						dangerous: '<script>alert("nested")</script>',
						array: ['<img>', 'clean', '"quotes"'],
					},
				},
			}

			const result = sanitizeAuditEvent(eventWithNestedDangerous)

			expect(result.modified).toBe(true)
			expect(result.sanitizedEvent.customData.level1.dangerous).not.toContain('<script>')
			expect(result.sanitizedEvent.customData.level1.array[0]).not.toContain('<img>')
			expect(result.sanitizedEvent.customData.level1.array[2]).toContain('&quot;')
		})

		it('should truncate overly long strings', () => {
			const eventWithLongString: AuditLogEvent = {
				timestamp: '2023-10-26T10:30:00.000Z',
				action: 'a'.repeat(15000),
				status: 'success',
				eventVersion: '1.0',
				hashAlgorithm: 'SHA-256',
			}

			const result = sanitizeAuditEvent(eventWithLongString)

			expect(result.modified).toBe(true)
			expect(result.sanitizedEvent.action).toHaveLength(10014) // 10000 + '...[truncated]' (14 chars)
			expect(result.sanitizedEvent.action.endsWith('...[truncated]')).toBe(true)
		})
	})
})

describe('Combined Validation and Sanitization', () => {
	describe('validateAndSanitizeAuditEvent', () => {
		it('should sanitize and then validate successfully', () => {
			const dirtyButValidEvent: Partial<AuditLogEvent> = {
				timestamp: '2023-10-26T10:30:00.000Z',
				action: 'testAction<script>',
				status: 'success',
				principalId: 'user-123',
				eventVersion: '1.0',
				dataClassification: 'internal' as any,
			}

			const result = validateAndSanitizeAuditEvent(dirtyButValidEvent)

			expect(result.isValid).toBe(true)
			expect(result.sanitizedEvent).toBeDefined()
			expect(result.sanitizedEvent!.action).not.toContain('<script>')
			expect(result.sanitizedEvent!.dataClassification).toBe('INTERNAL')
			expect(result.sanitizationWarnings.length).toBeGreaterThan(0)
		})

		it('should fail validation even after sanitization if fundamentally invalid', () => {
			const invalidEvent: Partial<AuditLogEvent> = {
				timestamp: 'invalid-timestamp',
				action: '',
				status: 'invalid-status' as any,
			}

			const result = validateAndSanitizeAuditEvent(invalidEvent)

			expect(result.isValid).toBe(false)
			expect(result.sanitizedEvent).toBeNull()
			expect(result.validationErrors.length).toBeGreaterThan(0)
		})

		it('should handle complex scenarios with both sanitization and validation issues', () => {
			const complexEvent: Partial<AuditLogEvent> = {
				timestamp: '2023-10-26T10:30:00.000Z',
				action: 'testAction<script>alert("xss")</script>',
				status: 'success',
				principalId: 'user-123\0',
				processingLatency: -100, // Invalid
				sessionContext: {
					sessionId: 'sess-123<img>',
					ipAddress: '999.999.999.999', // Invalid IP
					userAgent: 'Mozilla/5.0',
				},
				customField: {
					level1: {
						level2: {
							level3: {
								level4: 'too deep for default config',
							},
						},
					},
				},
			}

			const result = validateAndSanitizeAuditEvent(complexEvent)

			expect(result.isValid).toBe(false)
			expect(result.sanitizedEvent).toBeNull()
			expect(result.validationErrors.length).toBeGreaterThan(0)
			expect(result.sanitizationWarnings.length).toBeGreaterThan(0)

			// Check that sanitization warnings are present
			expect(result.sanitizationWarnings.some((w) => w.field === 'action')).toBe(true)
			expect(result.sanitizationWarnings.some((w) => w.field === 'principalId')).toBe(true)

			// Check that validation errors are present
			expect(result.validationErrors.some((e) => e.field === 'processingLatency')).toBe(true)
			expect(result.validationErrors.some((e) => e.field === 'sessionContext.ipAddress')).toBe(true)
		})

		it('should use custom validation config', () => {
			const customConfig: ValidationConfig = {
				...DEFAULT_VALIDATION_CONFIG,
				maxStringLength: 5,
				allowedEventVersions: ['2.0'],
			}

			const event: Partial<AuditLogEvent> = {
				timestamp: '2023-10-26T10:30:00.000Z',
				action: 'very-long-action-name',
				status: 'success',
				eventVersion: '1.0',
			}

			const result = validateAndSanitizeAuditEvent(event, customConfig)

			expect(result.isValid).toBe(false)
			expect(
				result.validationErrors.some((e) => e.field === 'action' && e.code === 'EXCEEDS_MAX_LENGTH')
			).toBe(true)
			expect(
				result.validationWarnings.some((w) => w.includes("Event version '1.0' is not in the list"))
			).toBe(true)
		})
	})
})

describe('Error Classes', () => {
	describe('AuditValidationError', () => {
		it('should create validation error with all properties', () => {
			const error = new AuditValidationError('Test message', 'testField', 'testValue', 'TEST_CODE')

			expect(error.name).toBe('AuditValidationError')
			expect(error.message).toBe('Test message')
			expect(error.field).toBe('testField')
			expect(error.value).toBe('testValue')
			expect(error.code).toBe('TEST_CODE')
			expect(error instanceof Error).toBe(true)
		})
	})

	describe('AuditSanitizationError', () => {
		it('should create sanitization error with all properties', () => {
			const error = new AuditSanitizationError('Test message', 'testField', 'original', 'sanitized')

			expect(error.name).toBe('AuditSanitizationError')
			expect(error.message).toBe('Test message')
			expect(error.field).toBe('testField')
			expect(error.originalValue).toBe('original')
			expect(error.sanitizedValue).toBe('sanitized')
			expect(error instanceof Error).toBe(true)
		})
	})
})

describe('Edge Cases and Security', () => {
	it('should handle null and undefined values safely', () => {
		const eventWithNulls: Partial<AuditLogEvent> = {
			timestamp: '2023-10-26T10:30:00.000Z',
			action: 'testAction',
			status: 'success',
			principalId: null as any,
			organizationId: undefined,
			customField: null,
		}

		const result = validateAndSanitizeAuditEvent(eventWithNulls)

		expect(result.isValid).toBe(true)
		expect(result.sanitizedEvent).toBeDefined()
	})

	it('should handle arrays in custom fields', () => {
		const eventWithArrays: Partial<AuditLogEvent> = {
			timestamp: '2023-10-26T10:30:00.000Z',
			action: 'testAction',
			status: 'success',
			customArray: ['<script>', 'normal', '"quotes"', { nested: '<img>' }],
		}

		const result = validateAndSanitizeAuditEvent(eventWithArrays)

		expect(result.isValid).toBe(true)
		expect(result.sanitizedEvent).toBeDefined()
		expect(result.sanitizedEvent!.customArray[0]).not.toContain('<script>')
		expect(result.sanitizedEvent!.customArray[2]).toContain('&quot;')
		expect((result.sanitizedEvent!.customArray[3] as any).nested).not.toContain('<img>')
	})

	it('should prevent prototype pollution attempts', () => {
		const maliciousEvent: any = {
			timestamp: '2023-10-26T10:30:00.000Z',
			action: 'testAction',
			status: 'success',
			__proto__: { polluted: true },
			constructor: { prototype: { polluted: true } },
		}

		const result = validateAndSanitizeAuditEvent(maliciousEvent)

		expect(result.isValid).toBe(true)
		expect(result.sanitizedEvent).toBeDefined()
		// Ensure prototype pollution didn't occur
		expect((Object.prototype as any).polluted).toBeUndefined()
	})

	it('should handle circular references gracefully', () => {
		const circularEvent: any = {
			timestamp: '2023-10-26T10:30:00.000Z',
			action: 'testAction',
			status: 'success',
		}
		circularEvent.circular = circularEvent

		// This should not throw an error or cause infinite recursion
		expect(() => {
			validateAndSanitizeAuditEvent(circularEvent)
		}).not.toThrow()
	})
})
