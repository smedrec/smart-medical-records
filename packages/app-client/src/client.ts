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
	public ok(): Promise<{ ok: boolean }> {
		return this.request(`/auth/ok`)
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
	public encrypt(plaintext: string): Promise<EncryptResponse> {
		return this.request(`/encrypt`, { method: 'POST', body: { plaintext: plaintext } })
	}

	/**
	 * Decrypt a ciphertext string
	 * @param ciphertext Ciphertext to be decrypt
	 * @returns Promise contains plaintext
	 */
	// TODO: Standardize naming convention (e.g., to decrypt) in a future refactor.
	public Decrypt(ciphertext: string): Promise<DecryptResponse> {
		return this.request(`/decrypt`, { method: 'POST', body: { ciphertext: ciphertext } })
	}
}
