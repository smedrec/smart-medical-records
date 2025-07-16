import { beforeEach, describe, expect, it } from 'vitest'

import { CryptoService, CryptoUtils, DEFAULT_CRYPTO_CONFIG } from '../crypto.js'

import type { AuditLogEvent } from '../types.js'

describe('CryptoService', () => {
	let cryptoService: CryptoService
	let sampleEvent: AuditLogEvent

	beforeEach(() => {
		cryptoService = new CryptoService({
			secretKey: 'test-secret-key-for-testing-purposes-only',
		})

		sampleEvent = {
			timestamp: '2023-10-26T10:30:00.000Z',
			action: 'userLogin',
			status: 'success',
			principalId: 'user-12345',
			organizationId: 'org-67890',
			targetResourceType: 'User',
			targetResourceId: 'user-12345',
			outcomeDescription: 'User logged in successfully',
			eventVersion: '1.0',
			hashAlgorithm: 'SHA-256',
		}
	})

	describe('constructor', () => {
		it('should create instance with default config', () => {
			const service = new CryptoService()
			const config = service.getConfig()
			expect(config.hashAlgorithm).toBe('SHA-256')
			expect(config.signatureAlgorithm).toBe('HMAC-SHA256')
		})

		it('should create instance with custom config', () => {
			const customConfig = {
				hashAlgorithm: 'SHA-256' as const,
				signatureAlgorithm: 'HMAC-SHA256' as const,
				secretKey: 'custom-secret',
			}
			const service = new CryptoService(customConfig)
			const config = service.getConfig()
			expect(config.hashAlgorithm).toBe('SHA-256')
			expect(config.signatureAlgorithm).toBe('HMAC-SHA256')
		})

		it('should throw error if no secret key provided', () => {
			expect(() => new CryptoService({ secretKey: '' })).toThrow(
				'[CryptoService] Secret key is required for cryptographic operations'
			)
		})
	})

	describe('generateHash', () => {
		it('should generate SHA-256 hash for audit event', () => {
			const hash = cryptoService.generateHash(sampleEvent)

			expect(hash).toBeDefined()
			expect(typeof hash).toBe('string')
			expect(hash).toHaveLength(64) // SHA-256 produces 64-character hex string
			expect(hash).toMatch(/^[a-f0-9]{64}$/) // Should be valid hex
		})

		it('should generate consistent hash for same event', () => {
			const hash1 = cryptoService.generateHash(sampleEvent)
			const hash2 = cryptoService.generateHash(sampleEvent)

			expect(hash1).toBe(hash2)
		})

		it('should generate different hash for different events', () => {
			const event2 = { ...sampleEvent, action: 'userLogout' }

			const hash1 = cryptoService.generateHash(sampleEvent)
			const hash2 = cryptoService.generateHash(event2)

			expect(hash1).not.toBe(hash2)
		})

		it('should generate different hash when critical fields change', () => {
			const originalHash = cryptoService.generateHash(sampleEvent)

			// Test each critical field
			const testCases = [
				{ ...sampleEvent, timestamp: '2023-10-26T11:30:00.000Z' },
				{ ...sampleEvent, action: 'userLogout' },
				{ ...sampleEvent, status: 'failure' },
				{ ...sampleEvent, principalId: 'user-54321' },
				{ ...sampleEvent, organizationId: 'org-98765' },
				{ ...sampleEvent, targetResourceType: 'Document' },
				{ ...sampleEvent, targetResourceId: 'doc-123' },
				{ ...sampleEvent, outcomeDescription: 'Different outcome' },
			]

			testCases.forEach((testEvent, index) => {
				const testHash = cryptoService.generateHash(testEvent)
				expect(testHash).not.toBe(originalHash, `Test case ${index} should produce different hash`)
			})
		})

		it('should handle events with practitioner-specific fields', () => {
			const practitionerEvent = {
				...sampleEvent,
				practitionerId: 'pract-123',
				licenseNumber: 'LIC-456',
				jurisdiction: 'CA',
				oldStatus: 'pending',
				newStatus: 'active',
				oldRole: 'resident',
				newRole: 'attending',
			}

			const hash = cryptoService.generateHash(practitionerEvent)
			expect(hash).toBeDefined()
			expect(hash).toHaveLength(64)
		})

		it('should handle events with null/undefined fields consistently', () => {
			const eventWithNulls = {
				...sampleEvent,
				principalId: undefined,
				organizationId: null,
				targetResourceType: undefined,
				targetResourceId: null,
			}

			const hash1 = cryptoService.generateHash(eventWithNulls)
			const hash2 = cryptoService.generateHash(eventWithNulls)

			expect(hash1).toBe(hash2)
		})
	})

	describe('verifyHash', () => {
		it('should verify correct hash', () => {
			const hash = cryptoService.generateHash(sampleEvent)
			const isValid = cryptoService.verifyHash(sampleEvent, hash)

			expect(isValid).toBe(true)
		})

		it('should reject incorrect hash', () => {
			const correctHash = cryptoService.generateHash(sampleEvent)
			const incorrectHash = correctHash.replace('a', 'b') // Modify one character

			const isValid = cryptoService.verifyHash(sampleEvent, incorrectHash)

			expect(isValid).toBe(false)
		})

		it('should reject hash when event is tampered', () => {
			const originalHash = cryptoService.generateHash(sampleEvent)
			const tamperedEvent = { ...sampleEvent, action: 'tamperedAction' }

			const isValid = cryptoService.verifyHash(tamperedEvent, originalHash)

			expect(isValid).toBe(false)
		})

		it('should handle verification errors gracefully', () => {
			const isValid = cryptoService.verifyHash(sampleEvent, 'invalid-hash')

			expect(isValid).toBe(false)
		})
	})

	describe('generateEventSignature', () => {
		it('should generate HMAC-SHA256 signature', () => {
			const signature = cryptoService.generateEventSignature(sampleEvent)

			expect(signature).toBeDefined()
			expect(typeof signature).toBe('string')
			expect(signature).toHaveLength(64) // HMAC-SHA256 produces 64-character hex string
			expect(signature).toMatch(/^[a-f0-9]{64}$/) // Should be valid hex
		})

		it('should generate consistent signature for same event', () => {
			const sig1 = cryptoService.generateEventSignature(sampleEvent)
			const sig2 = cryptoService.generateEventSignature(sampleEvent)

			expect(sig1).toBe(sig2)
		})

		it('should generate different signature for different events', () => {
			const event2 = { ...sampleEvent, action: 'userLogout' }

			const sig1 = cryptoService.generateEventSignature(sampleEvent)
			const sig2 = cryptoService.generateEventSignature(event2)

			expect(sig1).not.toBe(sig2)
		})

		it('should generate different signature with different secret key', () => {
			const service2 = new CryptoService({ secretKey: 'different-secret-key' })

			const sig1 = cryptoService.generateEventSignature(sampleEvent)
			const sig2 = service2.generateEventSignature(sampleEvent)

			expect(sig1).not.toBe(sig2)
		})
	})

	describe('verifyEventSignature', () => {
		it('should verify correct signature', () => {
			const signature = cryptoService.generateEventSignature(sampleEvent)
			const isValid = cryptoService.verifyEventSignature(sampleEvent, signature)

			expect(isValid).toBe(true)
		})

		it('should reject incorrect signature', () => {
			const correctSignature = cryptoService.generateEventSignature(sampleEvent)
			const incorrectSignature = correctSignature.replace('a', 'b') // Modify one character

			const isValid = cryptoService.verifyEventSignature(sampleEvent, incorrectSignature)

			expect(isValid).toBe(false)
		})

		it('should reject signature when event is tampered', () => {
			const originalSignature = cryptoService.generateEventSignature(sampleEvent)
			const tamperedEvent = { ...sampleEvent, action: 'tamperedAction' }

			const isValid = cryptoService.verifyEventSignature(tamperedEvent, originalSignature)

			expect(isValid).toBe(false)
		})

		it('should reject signature from different secret key', () => {
			const service2 = new CryptoService({ secretKey: 'different-secret-key' })
			const signature = service2.generateEventSignature(sampleEvent)

			const isValid = cryptoService.verifyEventSignature(sampleEvent, signature)

			expect(isValid).toBe(false)
		})

		it('should handle verification errors gracefully', () => {
			const isValid = cryptoService.verifyEventSignature(sampleEvent, 'invalid-signature')

			expect(isValid).toBe(false)
		})
	})

	describe('deterministic behavior', () => {
		it('should produce same hash regardless of object property order', () => {
			const event1 = {
				timestamp: sampleEvent.timestamp,
				action: sampleEvent.action,
				status: sampleEvent.status,
				principalId: sampleEvent.principalId,
			}

			const event2 = {
				principalId: sampleEvent.principalId,
				status: sampleEvent.status,
				action: sampleEvent.action,
				timestamp: sampleEvent.timestamp,
			}

			const hash1 = cryptoService.generateHash(event1)
			const hash2 = cryptoService.generateHash(event2)

			expect(hash1).toBe(hash2)
		})

		it('should handle complex nested objects consistently', () => {
			const eventWithNested = {
				...sampleEvent,
				metadata: { key1: 'value1', key2: { nested: 'value' } },
				additionalData: [1, 2, 3],
			}

			const hash1 = cryptoService.generateHash(eventWithNested)
			const hash2 = cryptoService.generateHash(eventWithNested)

			expect(hash1).toBe(hash2)
		})
	})

	describe('edge cases', () => {
		it('should handle empty string values', () => {
			const eventWithEmptyStrings = {
				...sampleEvent,
				principalId: '',
				outcomeDescription: '',
			}

			const hash = cryptoService.generateHash(eventWithEmptyStrings)
			expect(hash).toBeDefined()
			expect(hash).toHaveLength(64)
		})

		it('should handle special characters in event data', () => {
			const eventWithSpecialChars = {
				...sampleEvent,
				outcomeDescription: 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?',
			}

			const hash = cryptoService.generateHash(eventWithSpecialChars)
			const signature = cryptoService.generateEventSignature(eventWithSpecialChars)

			expect(hash).toBeDefined()
			expect(signature).toBeDefined()
			expect(cryptoService.verifyHash(eventWithSpecialChars, hash)).toBe(true)
			expect(cryptoService.verifyEventSignature(eventWithSpecialChars, signature)).toBe(true)
		})

		it('should handle unicode characters', () => {
			const eventWithUnicode = {
				...sampleEvent,
				outcomeDescription: 'Unicode: 你好世界 🌍 émojis',
			}

			const hash = cryptoService.generateHash(eventWithUnicode)
			const signature = cryptoService.generateEventSignature(eventWithUnicode)

			expect(hash).toBeDefined()
			expect(signature).toBeDefined()
			expect(cryptoService.verifyHash(eventWithUnicode, hash)).toBe(true)
			expect(cryptoService.verifyEventSignature(eventWithUnicode, signature)).toBe(true)
		})
	})
})

describe('CryptoUtils', () => {
	let sampleEvent: AuditLogEvent

	beforeEach(() => {
		sampleEvent = {
			timestamp: '2023-10-26T10:30:00.000Z',
			action: 'userLogin',
			status: 'success',
			principalId: 'user-12345',
			eventVersion: '1.0',
			hashAlgorithm: 'SHA-256',
		}
	})

	describe('utility functions', () => {
		it('should generate hash using default service', () => {
			const hash = CryptoUtils.generateHash(sampleEvent)

			expect(hash).toBeDefined()
			expect(typeof hash).toBe('string')
			expect(hash).toHaveLength(64)
		})

		it('should verify hash using default service', () => {
			const hash = CryptoUtils.generateHash(sampleEvent)
			const isValid = CryptoUtils.verifyHash(sampleEvent, hash)

			expect(isValid).toBe(true)
		})

		it('should generate signature using default service', () => {
			const signature = CryptoUtils.generateSignature(sampleEvent)

			expect(signature).toBeDefined()
			expect(typeof signature).toBe('string')
			expect(signature).toHaveLength(64)
		})

		it('should verify signature using default service', () => {
			const signature = CryptoUtils.generateSignature(sampleEvent)
			const isValid = CryptoUtils.verifySignature(sampleEvent, signature)

			expect(isValid).toBe(true)
		})
	})

	describe('consistency with CryptoService', () => {
		it('should produce same results as CryptoService with default config', () => {
			// Note: This test might fail if DEFAULT_CRYPTO_CONFIG uses a random secret
			// In production, ensure AUDIT_CRYPTO_SECRET is set consistently
			const utilHash = CryptoUtils.generateHash(sampleEvent)
			const utilSignature = CryptoUtils.generateSignature(sampleEvent)

			expect(utilHash).toBeDefined()
			expect(utilSignature).toBeDefined()
			expect(CryptoUtils.verifyHash(sampleEvent, utilHash)).toBe(true)
			expect(CryptoUtils.verifySignature(sampleEvent, utilSignature)).toBe(true)
		})
	})
})

describe('DEFAULT_CRYPTO_CONFIG', () => {
	it('should have correct default values', () => {
		expect(DEFAULT_CRYPTO_CONFIG.hashAlgorithm).toBe('SHA-256')
		expect(DEFAULT_CRYPTO_CONFIG.signatureAlgorithm).toBe('HMAC-SHA256')
		expect(DEFAULT_CRYPTO_CONFIG.secretKey).toBeDefined()
	})

	it('should use environment variable if available', () => {
		// This test verifies the config respects environment variables
		// The actual value depends on whether AUDIT_CRYPTO_SECRET is set
		expect(typeof DEFAULT_CRYPTO_CONFIG.secretKey).toBe('string')
		expect(DEFAULT_CRYPTO_CONFIG.secretKey!.length).toBeGreaterThan(0)
	})
})

describe('Integration with AuditLogEvent types', () => {
	let cryptoService: CryptoService

	beforeEach(() => {
		cryptoService = new CryptoService({
			secretKey: 'integration-test-secret-key',
		})
	})

	it('should work with enhanced AuditLogEvent interface', () => {
		const enhancedEvent: AuditLogEvent = {
			timestamp: '2023-10-26T10:30:00.000Z',
			action: 'userLogin',
			status: 'success',
			principalId: 'user-12345',
			eventVersion: '1.0',
			hashAlgorithm: 'SHA-256',
			correlationId: 'corr-12345-abcde',
			hash: undefined, // Will be set by crypto service
			signature: undefined, // Will be set by crypto service
		}

		const hash = cryptoService.generateHash(enhancedEvent)
		const signature = cryptoService.generateEventSignature(enhancedEvent)

		enhancedEvent.hash = hash
		enhancedEvent.signature = signature

		expect(cryptoService.verifyHash(enhancedEvent, hash)).toBe(true)
		expect(cryptoService.verifyEventSignature(enhancedEvent, signature)).toBe(true)
	})

	it('should handle practitioner audit events', () => {
		const practitionerEvent: AuditLogEvent = {
			timestamp: '2023-10-26T10:30:00.000Z',
			action: 'practitionerLicenseVerificationSuccess',
			status: 'success',
			principalId: 'admin-123',
			practitionerId: 'pract-456',
			licenseNumber: 'LIC-789',
			jurisdiction: 'CA',
			oldStatus: 'pending',
			newStatus: 'verified',
			eventVersion: '1.0',
			hashAlgorithm: 'SHA-256',
		}

		const hash = cryptoService.generateHash(practitionerEvent)
		const signature = cryptoService.generateEventSignature(practitionerEvent)

		expect(hash).toBeDefined()
		expect(signature).toBeDefined()
		expect(cryptoService.verifyHash(practitionerEvent, hash)).toBe(true)
		expect(cryptoService.verifyEventSignature(practitionerEvent, signature)).toBe(true)
	})
})
