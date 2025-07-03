import axios from 'axios'

import type { DecryptResponse, EncryptResponse, InfisicalKmsClientConfig } from './types.js'

export class InfisicalKmsClient {
	private config: InfisicalKmsClientConfig

	constructor(config: InfisicalKmsClientConfig) {
		this.config = config
	}

	public async encrypt(plaintext: string): Promise<EncryptResponse> {
		const b64 = btoa(plaintext)
		try {
			const response = await axios.post<EncryptResponse>(
				`${this.config.baseUrl}/${this.config.keyId}/encrypt`,
				{
					plaintext: `${b64})`,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${this.config.accessToken}`,
					},
				}
			)
			return response.data
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				throw new Error(`Failed to encrypt data: ${error.response.status} ${error.response.data}`)
			}
			throw new Error('Failed to encrypt data')
		}
	}

	public async decrypt(ciphertext: string): Promise<DecryptResponse> {
		try {
			const response = await axios.post<DecryptResponse>(
				`${this.config.baseUrl}/${this.config.keyId}/decrypt`,
				{
					plaintext: `${ciphertext}`,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${this.config.accessToken}`,
					},
				}
			)
			const str = atob(response.data.plaintext)
			return {
				plaintext: str,
			}
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				throw new Error(`Failed to decrypt data: ${error.response.status} ${error.response.data}`)
			}
			throw new Error('Failed to decrypt data')
		}
	}
}
