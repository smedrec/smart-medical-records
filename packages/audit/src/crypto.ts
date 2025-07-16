import { createHash, createHmac, randomBytes } from 'crypto'

import type { AuditLogEvent } from './types.js'

/**
 * Configuration for cryptographic operations
 */
export interface CryptoConfig {
	hashAlgorithm: 'SHA-256'
	signatureAlgorithm: 'HMAC-SHA256'
	secretKey?: string
}

/**
 * Default cryptographic configuration
 */
export const DEFAULT_CRYPTO_CONFIG: CryptoConfig = {
	hashAlgorithm: 'SHA-256',
	signatureAlgorithm: 'HMAC-SHA256',
	secretKey: process.env.AUDIT_CRYPTO_SECRET || generateDefaultSecret(),
}

/**
 * Generates a default secret key if none is provided
 * In production, this should be set via environment variables
 */
function generateDefaultSecret(): string {
	console.warn(
		'[CryptoService] No AUDIT_CRYPTO_SECRET provided, generating random secret. This should be set in production.'
	)
	return randomBytes(32).toString('hex')
}

/**
 * Interface for cryptographic integrity verification
 */
export interface CryptographicService {
	generateHash(event: AuditLogEvent): string
	verifyHash(event: AuditLogEvent, expectedHash: string): boolean
	generateEventSignature(event: AuditLogEvent): string
	verifyEventSignature(event: AuditLogEvent, signature: string): boolean
}

/**
 * Cryptographic service for audit event integrity verification
 * Implements SHA-256 hashing and HMAC-SHA256 signatures for tamper detection
 */
export class CryptoService implements CryptographicService {
	private config: CryptoConfig

	constructor(config: Partial<CryptoConfig> = {}) {
		this.config = { ...DEFAULT_CRYPTO_CONFIG, ...config }

		if (!this.config.secretKey) {
			throw new Error('[CryptoService] Secret key is required for cryptographic operations')
		}
	}

	/**
	 * Generates a SHA-256 hash of critical audit event fields
	 * Uses a standardized algorithm to ensure consistency across the system
	 *
	 * @param event The audit event to hash
	 * @returns SHA-256 hash as hexadecimal string
	 */
	generateHash(event: AuditLogEvent): string {
		// Extract critical fields for hashing in a deterministic order
		const criticalFields = this.extractCriticalFields(event)

		// Create deterministic string representation
		const dataToHash = this.createDeterministicString(criticalFields)

		// Generate SHA-256 hash
		return createHash('sha256').update(dataToHash, 'utf8').digest('hex')
	}

	/**
	 * Verifies the integrity of an audit event by comparing hashes
	 *
	 * @param event The audit event to verify
	 * @param expectedHash The expected hash value
	 * @returns true if hashes match, false if tampered
	 */
	verifyHash(event: AuditLogEvent, expectedHash: string): boolean {
		try {
			const computedHash = this.generateHash(event)
			return computedHash === expectedHash
		} catch (error) {
			console.error('[CryptoService] Hash verification failed:', error)
			return false
		}
	}

	/**
	 * Generates an HMAC-SHA256 signature for an audit event
	 * Provides additional security through secret key authentication
	 *
	 * @param event The audit event to sign
	 * @returns HMAC-SHA256 signature as hexadecimal string
	 */
	generateEventSignature(event: AuditLogEvent): string {
		// First generate the hash of the event
		const eventHash = this.generateHash(event)

		// Create HMAC signature using the hash and secret key
		return createHmac('sha256', this.config.secretKey!).update(eventHash, 'utf8').digest('hex')
	}

	/**
	 * Verifies the HMAC-SHA256 signature of an audit event
	 *
	 * @param event The audit event to verify
	 * @param signature The expected signature
	 * @returns true if signature is valid, false if invalid or tampered
	 */
	verifyEventSignature(event: AuditLogEvent, signature: string): boolean {
		try {
			const computedSignature = this.generateEventSignature(event)
			return computedSignature === signature
		} catch (error) {
			console.error('[CryptoService] Signature verification failed:', error)
			return false
		}
	}

	/**
	 * Extracts critical fields from audit event for hashing
	 * These fields are essential for integrity verification
	 *
	 * @param event The audit event
	 * @returns Object containing critical fields
	 */
	private extractCriticalFields(event: AuditLogEvent): Record<string, any> {
		return {
			timestamp: event.timestamp,
			action: event.action,
			status: event.status,
			principalId: event.principalId || null,
			organizationId: event.organizationId || null,
			targetResourceType: event.targetResourceType || null,
			targetResourceId: event.targetResourceId || null,
			outcomeDescription: event.outcomeDescription || null,
			// Include practitioner-specific fields if present
			practitionerId: (event as any).practitionerId || null,
			licenseNumber: (event as any).licenseNumber || null,
			jurisdiction: (event as any).jurisdiction || null,
			oldStatus: (event as any).oldStatus || null,
			newStatus: (event as any).newStatus || null,
			oldRole: (event as any).oldRole || null,
			newRole: (event as any).newRole || null,
		}
	}

	/**
	 * Creates a deterministic string representation of critical fields
	 * Ensures consistent hashing regardless of object property order
	 *
	 * @param fields The critical fields object
	 * @returns Deterministic string representation
	 */
	private createDeterministicString(fields: Record<string, any>): string {
		// Sort keys to ensure deterministic order
		const sortedKeys = Object.keys(fields).sort()

		// Create key-value pairs in sorted order
		const pairs = sortedKeys.map((key) => `${key}:${JSON.stringify(fields[key])}`)

		// Join with separator
		return pairs.join('|')
	}

	/**
	 * Gets the current cryptographic configuration
	 *
	 * @returns Current configuration (without secret key for security)
	 */
	getConfig(): Omit<CryptoConfig, 'secretKey'> {
		return {
			hashAlgorithm: this.config.hashAlgorithm,
			signatureAlgorithm: this.config.signatureAlgorithm,
		}
	}
}

/**
 * Default instance of the cryptographic service
 * Uses environment configuration
 */
export const defaultCryptoService = new CryptoService()

/**
 * Utility functions for direct hash operations
 */
export const CryptoUtils = {
	/**
	 * Generate SHA-256 hash using the default service
	 */
	generateHash: (event: AuditLogEvent): string => defaultCryptoService.generateHash(event),

	/**
	 * Verify hash using the default service
	 */
	verifyHash: (event: AuditLogEvent, expectedHash: string): boolean =>
		defaultCryptoService.verifyHash(event, expectedHash),

	/**
	 * Generate signature using the default service
	 */
	generateSignature: (event: AuditLogEvent): string =>
		defaultCryptoService.generateEventSignature(event),

	/**
	 * Verify signature using the default service
	 */
	verifySignature: (event: AuditLogEvent, signature: string): boolean =>
		defaultCryptoService.verifyEventSignature(event, signature),
}
