import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema.js'

import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import type { Sql } from 'postgres'

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

export class AppDb {
	private client: Sql
	private appDb: PostgresJsDatabase<typeof schema>

	/**
	 * Constructs an AppDb instance, establishing a connection to the PostgreSQL database
	 * and initializing Drizzle ORM.
	 * @param postgresUrl Optional. The PostgreSQL connection URL. If not provided, it attempts to use
	 *                    the `APP_DB_URL` environment variable.
	 * @param params Optional. PostgreSQL connection parameters.
	 * @throws Error if the PostgreSQL URL is not provided and cannot be found in environment variables.
	 */
	constructor(postgresUrl?: string, params?: { maxConnections?: number }) {
		const effectivePostgresUrl = postgresUrl || getEnv('APP_DB_URL')

		if (!effectivePostgresUrl) {
			throw new Error(
				'AppDb: PostgreSQL connection URL not provided (postgresUrl parameter) and could not be found in environment variables (APP_DB_URL).'
			)
		}
		const maxConnections = params?.maxConnections || 10
		this.client = postgres(effectivePostgresUrl, {
			max: maxConnections,
		})
		this.appDb = drizzle(this.client, { schema })
	}

	/**
	 * Provides access to the Drizzle ORM instance for database operations.
	 * @returns The Drizzle ORM instance typed with the audit log schema.
	 */
	public getDrizzleInstance(): PostgresJsDatabase<typeof schema> {
		return this.appDb
	}

	/**
	 * Checks the database connection by executing a simple query.
	 * @returns true or false.
	 */
	public async checkAppDbConnection() {
		try {
			await this.client`SELECT 1` // Simple query to check connection
			console.log('🟢 APP Database connection successful.')
			return true
		} catch (error) {
			console.error('🔴 APP Database connection failed:', error)
			// In a real app, you might want to throw the error or handle it more gracefully
			// For the worker, if the DB isn't available, it might retry or exit.
			// process.exit(1); // Consider if failure to connect on startup is fatal
			return false
		}
	}

	/**
	 * Ends the client connection.
	 * @returns void.
	 */
	public async end(): Promise<void> {
		await this.client.end()
	}
}
