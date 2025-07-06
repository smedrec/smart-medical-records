/**
 * App Client.
 *
 * @app-client
 *
 * Use from other apps/packages:
 *
 * ```ts
 * import { AppClient } from '@repo/app-client'
 *
 * const client = new appClient({})
 * ```
 */
import { BaseResource } from './base.js'

import type { ClientOptions, DecryptResponse, EncryptResponse, VersionResponse } from './types.js'

export class AppClient extends BaseResource {
	constructor(options: ClientOptions) {
		super(options)
	}

	/**
	 * Check if the Auth API is working
	 * @returns Promise ...
	 */
	public async ok(): Promise<{ ok: boolean }> {
		return await this.request(`/auth/ok`)
	}

	/**
	 * Retrieves api version
	 * @returns Promise contains api version
	 */
	public version(): Promise<VersionResponse> {
		return this.request(`/version`)
	}

	/**
	 * Encrypt a plaintext string
	 * @param plaintext Plaintext to be encrypted
	 * @returns Promise contains ciphertext
	 */
	public async encrypt(plaintext: string): Promise<EncryptResponse> {
		return await this.request(`/encrypt`, { method: 'POST', body: { plaintext: plaintext } })
	}

	/**
	 * Decrypt a ciphertext string
	 * @param ciphertext Ciphertext to be decrypt
	 * @returns Promise contains plaintext
	 */
	public async decrypt(ciphertext: string): Promise<DecryptResponse> {
		return await this.request(`/decrypt`, { method: 'POST', body: { ciphertext: ciphertext } })
	}
}
