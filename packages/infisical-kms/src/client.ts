import axios from 'axios'

import type { EncryptResponse, InfisicalKmsClientConfig } from './types.js'

export class InfisicalKmsClient {
	private config: InfisicalKmsClientConfig

	constructor(config: InfisicalKmsClientConfig) {
		this.config = config
	}

	public async encrypt(plaintext: string): Promise<EncryptResponse> {
		try {
			const response = await axios.post<EncryptResponse>(
				`${this.config.baseUrl}/${this.config.keyId}/encrypt`,
				{
					plaintext: `${plaintext}`,
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

	public async decrypt(ciphertext: string): Promise<EncryptResponse> {
		try {
			const response = await axios.post<EncryptResponse>(
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
			return response.data
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				throw new Error(`Failed to decrypt data: ${error.response.status} ${error.response.data}`)
			}
			throw new Error('Failed to decrypt data')
		}
	}
}
