import type { DecryptResponse, EncryptResponse, InfisicalKmsClientConfig } from './types.js'

/**
 * Base error class for Infisical KMS client errors.
 */
export class KmsError extends Error {
	constructor(message: string) {
		super(message)
		this.name = this.constructor.name
	}
}

/**
 * Error class for network-related issues or unexpected responses from the KMS API.
 */
export class KmsApiError extends KmsError {
	public status?: number
	public statusText?: string

	constructor(message: string, status?: number, statusText?: string) {
		super(`${message}${status ? ` (Status: ${status} ${statusText})` : ''}`)
		this.status = status
		this.statusText = statusText
	}
}

/**
 * Error class for issues specifically during the encryption process.
 */
export class KmsEncryptionError extends KmsApiError {}

/**
 * Error class for issues specifically during the decryption process.
 */
export class KmsDecryptionError extends KmsApiError {}

/**
 * InfisicalKmsClient provides methods to interact with the Infisical KMS API
 * for encrypting and decrypting data.
 */
export class InfisicalKmsClient {
	private config: InfisicalKmsClientConfig

	/**
	 * Creates an instance of InfisicalKmsClient.
	 * @param {InfisicalKmsClientConfig} config - Configuration for the client,
	 * including baseUrl, keyId, and accessToken.
	 */
	constructor(config: InfisicalKmsClientConfig) {
		this.config = config
	}

	/**
	 * Encrypts a plaintext string using the configured Infisical KMS key.
	 * The plaintext is first base64 encoded before sending to the API.
	 * @param {string} plaintext - The plaintext string to encrypt.
	 * @returns {Promise<EncryptResponse>} A promise that resolves with the ciphertext.
	 * @throws {KmsEncryptionError} If the encryption request fails due to network issues or an unsuccessful API response.
	 */
	public async encrypt(plaintext: string): Promise<EncryptResponse> {
		// Base64 encode the plaintext as required by the API.
		const b64 = btoa(plaintext)
		let response: Response
		try {
			response = await fetch(
				`${this.config.baseUrl}/api/v1/kms/keys/${this.config.keyId}/encrypt`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${this.config.accessToken}`,
					},
					body: JSON.stringify({ plaintext: b64 }),
				}
			)

			// Check if the API response is successful.
			if (!response.ok) {
				// Throw an error with status and statusText for better debugging.
				throw new KmsEncryptionError(
					`Failed to encrypt data`,
					response.status,
					response.statusText
				)
			}

			const data = await response.json()
			return data
		} catch (error) {
			if (error instanceof KmsEncryptionError) {
				throw error
			}
			// Catch network errors or other unexpected errors during fetch or JSON parsing.
			throw new KmsEncryptionError(`Encryption request failed: ${error instanceof Error ? error.message : String(error)}`)
		}
	}

	/**
	 * Decrypts a ciphertext string using the configured Infisical KMS key.
	 * The API is expected to return a base64 encoded plaintext, which is then decoded.
	 * @param {string} ciphertext - The ciphertext string to decrypt.
	 * @returns {Promise<DecryptResponse>} A promise that resolves with the decrypted plaintext.
	 * @throws {KmsDecryptionError} If the decryption request fails due to network issues or an unsuccessful API response.
	 */
	public async decrypt(ciphertext: string): Promise<DecryptResponse> {
		let response: Response
		try {
			response = await fetch(
				`${this.config.baseUrl}/api/v1/kms/keys/${this.config.keyId}/decrypt`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${this.config.accessToken}`,
					},
					body: JSON.stringify({ ciphertext: ciphertext }),
				}
			)

			// Check if the API response is successful.
			if (!response.ok) {
				// Throw an error with status and statusText for better debugging.
				throw new KmsDecryptionError(
					`Failed to decrypt data`,
					response.status,
					response.statusText
				)
			}

			const data = await response.json()

			// Decode the base64 plaintext received from the API.
			const str = atob(data.plaintext)
			return {
				plaintext: str,
			}
		} catch (error) {
			if (error instanceof KmsDecryptionError) {
				throw error
			}
			// Catch network errors or other unexpected errors during fetch, JSON parsing, or atob.
			throw new KmsDecryptionError(`Decryption request failed: ${error instanceof Error ? error.message : String(error)}`)
		}
	}
}
