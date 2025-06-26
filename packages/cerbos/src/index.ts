/**
 * Cerbos
 *
 * @example
 *
 * Use from other apps/packages:
 *
 * ```ts
 * import { Cerbos } from '@repo/cerbos'
 *
 * const cerbos = new Cerbos()
 * ```
 */
import { GRPC } from '@cerbos/grpc'
import { HTTP } from '@cerbos/http'

// Helper to try and get env variables from Cloudflare Workers or Node.js process.env
function getEnv(variableName: string): string | undefined {
	// Check Cloudflare Workers env
	// @ts-expect-error Hides `Cannot find name 'env'.` when not in CF Worker context.
	if (typeof env !== 'undefined' && env[variableName]) {
		// @ts-expect-error
		return env[variableName]
	}
	// Check Node.js process.env
	if (typeof process !== 'undefined' && process.env && process.env[variableName]) {
		return process.env[variableName]
	}
	return undefined
}

export class Cerbos {
	/**
	 * Constructs an Cerbos instance (http for Cloudflare Workers and grpc for Node.js environment).
	 * @param cerbosUrl Optional. The Cerbos connection URL. If not provided, it attempts to use
	 *                 `env.CERBOS_URL` (for Cloudflare Workers) or `process.env.CERBOS_URL` (for Node.js).
	 */
	constructor(cerbosUrl?: string) {
		const effectiveCerbosUrl = cerbosUrl || getEnv('CERBOS_URL')

		if (!effectiveCerbosUrl) {
			throw new Error(
				'Cerbos Service: Cerbos URL not provided and could not be found in environment variables (ACERBOS_URL).'
			)
		}
	}
}
