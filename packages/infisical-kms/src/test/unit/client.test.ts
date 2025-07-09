import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
	InfisicalKmsClient,
	KmsApiError,
	KmsDecryptionError,
	KmsEncryptionError,
} from '../../client'

import type { InfisicalKmsClientConfig } from '../../types'

// Mock global fetch
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

// Mock btoa and atob for Node.js environment if not running in a browser-like env (Vitest default is Node)
if (typeof global.btoa === 'undefined') {
	global.btoa = (str: string) => Buffer.from(str, 'binary').toString('base64')
}
if (typeof global.atob === 'undefined') {
	global.atob = (b64Encoded: string) => Buffer.from(b64Encoded, 'base64').toString('binary')
}

describe('InfisicalKmsClient', () => {
	const mockConfig: InfisicalKmsClientConfig = {
		baseUrl: 'https://test.infisical.com',
		keyId: 'test-key-id',
		accessToken: 'test-access-token',
	}

	let client: InfisicalKmsClient

	beforeEach(() => {
		client = new InfisicalKmsClient(mockConfig)
		mockFetch.mockReset()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('encrypt', () => {
		it('should encrypt plaintext successfully', async () => {
			const plaintext = 'my secret message'
			const expectedCiphertext = 'encrypted-secret'
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ ciphertext: expectedCiphertext }),
			} as Response)

			const result = await client.encrypt(plaintext)

			expect(result.ciphertext).toBe(expectedCiphertext)
			expect(mockFetch).toHaveBeenCalledOnce()
			expect(mockFetch).toHaveBeenCalledWith(
				`${mockConfig.baseUrl}/api/v1/kms/keys/${mockConfig.keyId}/encrypt`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${mockConfig.accessToken}`,
					},
					body: JSON.stringify({ plaintext: btoa(plaintext) }),
				}
			)
		})

		it('should throw KmsEncryptionError on API error during encryption', async () => {
			const plaintext = 'test'
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 500,
				statusText: 'Internal Server Error',
			} as Response)

			try {
				await client.encrypt(plaintext)
			} catch (error) {
				expect(error).toBeInstanceOf(KmsEncryptionError)
				expect(error.message).toBe('Failed to encrypt data (Status: 500 Internal Server Error)')
				if (error instanceof KmsApiError) {
					expect(error.status).toBe(500)
					expect(error.statusText).toBe('Internal Server Error')
				}
			}
			expect.assertions(4) // Ensures the catch block was hit
		})

		it('should throw KmsEncryptionError on network error during encryption', async () => {
			const plaintext = 'test'
			mockFetch.mockRejectedValueOnce(new Error('Network failed'))

			try {
				await client.encrypt(plaintext)
			} catch (error) {
				expect(error).toBeInstanceOf(KmsEncryptionError)
				expect(error.message).toBe('Encryption request failed: Network failed')
			}
			expect.assertions(2)
		})

		it('should throw KmsEncryptionError if response JSON parsing fails', async () => {
			const plaintext = 'my secret message'
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => {
					throw new Error('Invalid JSON')
				},
			} as Response)
			try {
				await client.encrypt(plaintext)
			} catch (error) {
				expect(error).toBeInstanceOf(KmsEncryptionError)
				expect(error.message).toBe('Encryption request failed: Invalid JSON')
			}
			expect.assertions(2)
		})
	})

	describe('decrypt', () => {
		it('should decrypt ciphertext successfully', async () => {
			const ciphertext = 'encrypted-secret'
			const expectedPlaintextB64 = btoa('my secret message')
			const expectedPlaintext = 'my secret message'

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ plaintext: expectedPlaintextB64 }),
			} as Response)

			const result = await client.decrypt(ciphertext)

			expect(result.plaintext).toBe(expectedPlaintext)
			expect(mockFetch).toHaveBeenCalledOnce()
			expect(mockFetch).toHaveBeenCalledWith(
				`${mockConfig.baseUrl}/api/v1/kms/keys/${mockConfig.keyId}/decrypt`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${mockConfig.accessToken}`,
					},
					body: JSON.stringify({ ciphertext }),
				}
			)
		})

		it('should throw KmsDecryptionError on API error during decryption', async () => {
			const ciphertext = 'test-cipher'
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
			} as Response)

			try {
				await client.decrypt(ciphertext)
			} catch (error) {
				expect(error).toBeInstanceOf(KmsDecryptionError)
				expect(error.message).toBe('Failed to decrypt data (Status: 401 Unauthorized)')
				if (error instanceof KmsApiError) {
					expect(error.status).toBe(401)
					expect(error.statusText).toBe('Unauthorized')
				}
			}
			expect.assertions(4)
		})

		it('should throw KmsDecryptionError on network error during decryption', async () => {
			const ciphertext = 'test-cipher'
			mockFetch.mockRejectedValueOnce(new Error('Network connection lost'))
			try {
				await client.decrypt(ciphertext)
			} catch (error) {
				expect(error).toBeInstanceOf(KmsDecryptionError)
				expect(error.message).toBe('Decryption request failed: Network connection lost')
			}
			expect.assertions(2)
		})

		it('should throw KmsDecryptionError if atob fails', async () => {
			const ciphertext = 'encrypted-secret'
			const invalidBase64Plaintext = 'this is not base64' // atob will throw on this

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ plaintext: invalidBase64Plaintext }),
			} as Response)

			// Temporarily mock atob to simulate failure
			const originalAtob = global.atob
			global.atob = vi.fn().mockImplementation(() => {
				throw new Error('atob failed')
			})

			try {
				await client.decrypt(ciphertext)
			} catch (error) {
				expect(error).toBeInstanceOf(KmsDecryptionError)
				expect(error.message).toBe('Decryption request failed: atob failed')
			}
			global.atob = originalAtob // Restore original atob
			expect.assertions(2)
		})

		it('should correctly pass status and statusText for KmsApiError instances', async () => {
			const plaintext = 'test'
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 403,
				statusText: 'Forbidden',
			} as Response)

			try {
				await client.encrypt(plaintext)
			} catch (error) {
				expect(error).toBeInstanceOf(KmsApiError)
				expect(error).toBeInstanceOf(KmsEncryptionError)
				if (error instanceof KmsApiError) {
					expect(error.status).toBe(403)
					expect(error.statusText).toBe('Forbidden')
				} else {
					throw new Error('Error was not an instance of KmsApiError')
				}
			}
		})
	})
})
