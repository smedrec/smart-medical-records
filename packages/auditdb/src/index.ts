import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema.js'

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

export class AuditDb {
	private client: // postgres client type
	private auditDb: PostgresJsDatabase

	/**
	 * Constructs a Cerbos instance, automatically selecting the appropriate client
	 * (HTTP for Cloudflare Workers, gRPC for Node.js environment).
	 * @param cerbosUrl Optional. The Cerbos PDP connection URL. If not provided, it attempts to use
	 *                 the `CERBOS_URL` environment variable.
	 * @throws Error if the Cerbos URL is not provided and cannot be found in environment variables.
	 * @throws Error if the environment is not recognized as Cloudflare Workers or Node.js.
	 */
	constructor(postgresUrl?: string) {
		const effectivePostgresUrl = postgresUrl || getEnv('AUDIT_DB_URL')

		if (!effectivePostgresUrl) {
			throw new Error(
				'Audit DB Service: Audit DB URL not provided and could not be found in environment variables (AUDIT_DB_URL).'
			)
		}
		this.client = postgres(effectivePostgresUrl, {})

		this.auditDb = drizzle(this.client, { schema })

	}


	/**
	 * A simple function to test the connection.
	 * @returns true or false.
	 */
	public async checkAuditDbConnection() {
		try {
			await this.client`SELECT 1` // Simple query to check connection
			console.log('🟢 Database connection successful.')
			return true
		} catch (error) {
			console.error('🔴 Database connection failed:', error)
			// In a real app, you might want to throw the error or handle it more gracefully
			// For the worker, if the DB isn't available, it might retry or exit.
			// process.exit(1); // Consider if failure to connect on startup is fatal
			return false
		}
	}
}
