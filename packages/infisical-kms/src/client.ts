import type { DecryptResponse, EncryptResponse, InfisicalKmsClientConfig } from './types.js'

export class InfisicalKmsClient {
	private config: InfisicalKmsClientConfig

	constructor(config: InfisicalKmsClientConfig) {
		this.config = config
	}

	public async encrypt(plaintext: string): Promise<EncryptResponse> {
		const b64 = btoa(plaintext)
		try {
			const response = await fetch(
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

			if (!response.ok) {
				throw new Error(`Failed to encrypt data: ${response.status} ${response.statusText}`)
			}

			const data = await response.json()

			return data
		} catch (error) {
			throw new Error(`Failed to encrypt data: ${error}`)
		}
	}

	public async decrypt(ciphertext: string): Promise<DecryptResponse> {
		try {
			const response = await fetch(
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

			if (!response.ok) {
				throw new Error(`Failed to decrypt data: ${response.status} ${response.statusText}`)
			}

			const data = await response.json()

			const str = atob(data.plaintext)
			return {
				plaintext: str,
			}
		} catch (error) {
			throw new Error(`Failed to decrypt data: ${error}`)
		}
	}
}
