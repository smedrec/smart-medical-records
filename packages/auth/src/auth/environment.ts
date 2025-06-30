/**
 * Environment Configuration
 *
 * This module handles loading and validating environment variables
 * required for connecting to the FHIR API.
 */

import { AUTHError } from '../utils/errors.js'

// Helper to try and get env variables from Cloudflare Workers or Node.js process.env
export function getEnv(variableName: string): string | undefined {
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

// Interface for validated environment variables
export interface EnvConfig {
	BETTER_AUTH_URL: string
	BETTER_AUTH_SECRET: string
	BETTER_AUTH_REDIS_URL: string
	AUTH_DB_URL: string
	AUDIT_REDIS_URL: string
	APP_PUBLIC_URL: string
	SMTP_HOST: string
	SMTP_USER: string
	SMTP_PASSWORD: string
}

/**
 * Validate and retrieve required environment variables
 *
 * @returns Validated environment configuration
 * @throws {AUTHError} If required environment variables are missing
 */
export function getEnvConfig(): EnvConfig {
	const BETTER_AUTH_URL = getEnv('BETTER_AUTH_URL')
	const BETTER_AUTH_SECRET = getEnv('BETTER_AUTH_SECRET')
	const BETTER_AUTH_REDIS_URL = getEnv('BETTER_AUTH_REDIS_URL')
	const AUTH_DB_URL = getEnv('AUTH_DB_URL')
	const AUDIT_REDIS_URL = getEnv('AUDIT_REDIS_URL')
	const APP_PUBLIC_URL = getEnv('APP_PUBLIC_URL')
	const SMTP_HOST = getEnv('SMTP_HOST')
	const SMTP_USER = getEnv('SMTP_USER')
	const SMTP_PASSWORD = getEnv('SMTP_PASSWORD')

	// Validate required core environment variables
	if (!BETTER_AUTH_URL) {
		throw new AUTHError(
			`BETTER_AUTH_URL environment variable not set. BETTER_AUTH_URL is required.`
		)
	}

	// Validate required core environment variables
	if (!BETTER_AUTH_SECRET) {
		throw new AUTHError(
			`BETTER_AUTH_SECRET environment variable not set. BETTER_AUTH_SECRET is required.`
		)
	}

	if (!AUTH_DB_URL) {
		throw new AUTHError(`AUTH_DB_URL environment variable not set. AUTH_DB_URL is required.`)
	}

	if (!BETTER_AUTH_REDIS_URL) {
		throw new AUTHError(
			`BETTER_AUTH_REDIS_URL environment variable not set. BETTER_AUTH_REDIS_URL is required.`
		)
	}

	if (!AUDIT_REDIS_URL) {
		throw new AUTHError(
			`AUDIT_REDIS_URL environment variable not set. AUDIT_REDIS_URL is required.`
		)
	}

	if (!APP_PUBLIC_URL) {
		throw new AUTHError(`APP_PUBLIC_URL environment variable not set. APP_PUBLIC_URL is required.`)
	}

	if (!SMTP_HOST) {
		throw new AUTHError(`SMTP_HOST environment variable not set. SMTP_HOST is required.`)
	}

	if (!SMTP_USER) {
		throw new AUTHError(`SMTP_USER environment variable not set. SMTP_USER is required.`)
	}

	if (!SMTP_PASSWORD) {
		throw new AUTHError(`SMTP_PASSWORD environment variable not set. SMTP_PASSWORD is required.`)
	}

	// Validate URL format
	try {
		new URL(BETTER_AUTH_URL)
	} catch (error) {
		throw new AUTHError(`Invalid URL format for BETTER_AUTH_URL: ${BETTER_AUTH_URL}`)
	}

	try {
		new URL(APP_PUBLIC_URL)
	} catch (error) {
		throw new AUTHError(`Invalid URL format for APP_PUBLIC_URL: ${APP_PUBLIC_URL}`)
	}

	return {
		BETTER_AUTH_URL,
		BETTER_AUTH_SECRET,
		BETTER_AUTH_REDIS_URL,
		AUTH_DB_URL,
		AUDIT_REDIS_URL,
		APP_PUBLIC_URL,
		SMTP_HOST,
		SMTP_USER,
		SMTP_PASSWORD,
	}
}
