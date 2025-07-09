import { z } from 'zod/v4'

export type WorkersEnvironment = z.infer<typeof WorkersEnvironment>
export const WorkersEnvironment = z.enum(['VITEST', 'development', 'staging', 'production'])

/** Global bindings */
export type SharedHonoEnv = {
	/**
	 * Name of the worker used in logging/etc.
	 * Automatically pulled from package.json
	 */
	NAME: string
	/**
	 * Environment of the worker.
	 * All workers should specify env in wrangler.jsonc vars
	 */
	ENVIRONMENT: WorkersEnvironment
	/**
	 * Release version of the Worker (based on the current git commit).
	 * Useful for logs, Sentry, etc.
	 */
	SENTRY_RELEASE: string
	/**
	 * Better Auth environment variables.
	 *
	 */
	BETTER_AUTH_URL: string
	BETTER_AUTH_SECRET: string
	/*
	 * Cerbos api url
	 */
	CERBOS_HTTP_API_URL: string
	/**
	 * Application environment variables.
	 */
	APP_PUBLIC_URL: string
	/**
	 * HAPI FHIR api url
	 */
	FHIR_API_URL: string
	/**
	 * SMTP credentials.
	 */
	SMTP_USER: string
	SMTP_PASSWORD: string
	SMTP_HOST: string
	FROM_NAME: string
	FROM_EMAIL: string
	/**
	 * The postgres database url
	 */
	DATABASE_URL: string
	AUTH_DB_URL: string
	/**
	 * Shared REDIS instance to queues
	 */
	REDIS_URL: string
	/**
	 * REDIS instance to active sessions
	 */
	BETTER_AUTH_REDIS_URL: string
	/**
	 * Smart FHIR Client
	 */
	SMART_ISS: string
	FHIR_BASE_URL: string

	/**
	 * KMS
	 */
	INFISICAL_URL: string
	KMS_KEY_ID: string
	INFISICAL_ACCESS_TOKEN: string
	INFISICAL_CLIENT_ID: string
	INFISICAL_CLIENT_SECRET: string
	INFISICAL_PROJECT_ID: string
	INFISICAL_ENVIRONMENT: string
}
/** Global Hono variables */
export type SharedHonoVariables = {
	// Things like Sentry, etc. that should be present on all Workers
}

/** Top-level Hono app */
export interface HonoApp {
	Variables: SharedHonoVariables
	Bindings: SharedHonoEnv
}

/** Context used for non-Hono things like Durable Objects */
export type SharedAppContext = {
	var: SharedHonoVariables
	env: SharedHonoEnv
	//executionCtx: Pick<ExecutionContext, 'waitUntil'>
}
