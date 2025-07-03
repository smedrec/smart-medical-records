import axios from 'axios'

import type { AxiosInstance } from 'axios'
import type { DecryptResponse, EncryptResponse, InfisicalKmsClientConfig } from './types.js'

export class InfisicalKmsClient {
	private config: InfisicalKmsClientConfig
	private instance: AxiosInstance

	constructor(config: InfisicalKmsClientConfig) {
		this.config = config
		this.instance = axios.create({
			baseURL: `${this.config.baseUrl}`,
		})
		this.instance.defaults.headers.common['Content-Type'] = 'application/json'
		this.instance.defaults.headers.common['Authorization'] = `Bearer ${this.config.accessToken}`
	}

	public async encrypt(plaintext: string): Promise<EncryptResponse> {
		const b64 = btoa(plaintext)
		try {
			const response = await this.instance.post<EncryptResponse>(
				`/api/v1/kms/keys/${this.config.keyId}/encrypt`,
				{
					plaintext: b64,
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
			const response = await this.instance.post<DecryptResponse>(
				`/api/v1/kms/keys/${this.config.keyId}/decrypt`,
				{
					ciphertext: ciphertext,
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
