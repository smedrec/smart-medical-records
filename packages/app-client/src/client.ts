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

import type { ClientOptions, VersionResponse } from './types.js'

export class AppClient extends BaseResource {
	constructor(options: ClientOptions) {
		super(options)
	}

	/**
	 * Check if the API is working
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
}
