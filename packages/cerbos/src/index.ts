/**
 * Cerbos Client Initializer
 *
 * This package provides a Cerbos class that automatically initializes the correct
 * Cerbos client based on the runtime environment. It uses the HTTP client for
 * Cloudflare Workers and the gRPC client for Node.js environments.
 *
 * @example
 *
 * Use from other apps/packages:
 *
 * ```ts
 * import { Cerbos } from '@repo/cerbos';
 *
 * // The CERBOS_URL environment variable will be used if not provided in the constructor
 * const cerbosInstance = new Cerbos();
 * const cerbosClient = cerbosInstance.getClient();
 *
 * // Now you can use cerbosClient to interact with the Cerbos PDP
 * // E.g., cerbosClient.checkResource({ ... });
 * ```
 */
import { GRPC } from '@cerbos/grpc';
import { HTTP } from '@cerbos/http';
import type { CerbosClient } from '@cerbos/core';

// Helper to try and get env variables from Cloudflare Workers or Node.js process.env
function getEnv(variableName: string): string | undefined {
	// Check Cloudflare Workers env (this is a common way, but might need adjustment based on actual CF worker env structure)
	// @ts-expect-error Hides `Cannot find name 'env'.` when not in CF Worker context. KV bindings are usually on `env`
	if (typeof WebSocketPair !== 'undefined' && typeof env !== 'undefined' && env && env[variableName]) {
		// @ts-expect-error
		return env[variableName];
	}
	// Check Node.js process.env
	if (typeof process !== 'undefined' && process.env && process.env[variableName]) {
		return process.env[variableName];
	}
	return undefined;
}

// Environment detection functions
const isCloudflareWorkers = (): boolean => typeof WebSocketPair !== 'undefined';
const isNodeJS = (): boolean => typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

export class Cerbos {
	private client: CerbosClient;

	/**
	 * Constructs a Cerbos instance, automatically selecting the appropriate client
	 * (HTTP for Cloudflare Workers, gRPC for Node.js environment).
	 * @param cerbosUrl Optional. The Cerbos PDP connection URL. If not provided, it attempts to use
	 *                 the `CERBOS_URL` environment variable.
	 * @throws Error if the Cerbos URL is not provided and cannot be found in environment variables.
	 * @throws Error if the environment is not recognized as Cloudflare Workers or Node.js.
	 */
	constructor(cerbosUrl?: string) {
		const effectiveCerbosUrl = cerbosUrl || getEnv('CERBOS_URL');

		if (!effectiveCerbosUrl) {
			throw new Error(
				'Cerbos Service: Cerbos URL not provided and could not be found in environment variables (CERBOS_URL).'
			);
		}

		if (isCloudflareWorkers()) {
			this.client = new HTTP(effectiveCerbosUrl);
		} else if (isNodeJS()) {
			this.client = new GRPC(effectiveCerbosUrl, { tls: false }); // Assuming local development often uses non-TLS gRPC. Adjust as needed.
		} else {
			throw new Error(
				'Cerbos Service: Unrecognized environment. Cannot determine whether to use HTTP or gRPC client.'
			);
		}
	}

	/**
	 * Retrieves the initialized Cerbos client instance (either HTTP or gRPC).
	 * @returns The CerbosClient instance.
	 */
	public getClient(): CerbosClient {
		return this.client;
	}
}
