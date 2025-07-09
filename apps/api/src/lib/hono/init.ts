//import { redis } from "../db/redis";
import { createId } from '@paralleldrive/cuid2'

import { Audit } from '@repo/audit'
import { AuthDb } from '@repo/auth-db'
import { InfisicalKmsClient } from '@repo/infisical-kms'

import { auth } from '../auth.js'
import { cerbos } from '../cerbos/index.js'
//import { fhir } from '@repo/fhir'

import { ConsoleLogger } from '../logs/index.js'

import type { MiddlewareHandler } from 'hono'
//import {initCache} from "../cache";
import type { HonoEnv } from '../hono/context.js'

/**
 * These maps persist between worker executions and are used for caching
 */
//const rlMap = new Map();

let isolateId: string | undefined = undefined
let isolateCreatedAt: number | undefined = undefined

let authDbInstance: AuthDb | undefined = undefined

export { authDbInstance }

let audit: Audit | undefined = undefined
export { audit }
/**
 * Initialize all services.
 *
 * Call this once before any hono handlers run.
 */
export function init(): MiddlewareHandler<HonoEnv> {
	return async (c, next) => {
		if (!isolateId) {
			isolateId = crypto.randomUUID()
		}
		if (!isolateCreatedAt) {
			isolateCreatedAt = Date.now()
		}
		c.set('isolateId', isolateId)
		c.set('isolateCreatedAt', isolateCreatedAt)
		const requestId = createId()
		c.set('requestId', requestId)

		c.set('requestStartedAt', Date.now())

		c.res.headers.set('x-smedrec-requestId', requestId)

		const logger = new ConsoleLogger({
			requestId,
			application: 'api',
			environment: c.env.ENVIRONMENT as 'VITEST' | 'development' | 'staging' | 'production',
			defaultFields: { environment: c.env.ENVIRONMENT },
		})

		if (!authDbInstance) {
			authDbInstance = new AuthDb(c.env.AUTH_DB_URL)
			// Check the database connection
			const isConnected = await authDbInstance.checkAuthDbConnection()
			if (!isConnected) {
				console.error('Failed to connect to the auth database. Exiting.')
				process.exit(1)
			}
		}

		// Get the Drizzle ORM instance
		const db = authDbInstance.getDrizzleInstance()

		if (!audit) audit = new Audit('audit')

		const kms = new InfisicalKmsClient({
			baseUrl: c.env.INFISICAL_URL!,
			keyId: c.env.KMS_KEY_ID!,
			accessToken: c.env.INFISICAL_ACCESS_TOKEN!,
		})

		//const cache = initCache(c);
		//const cache = null

		c.set('services', {
			auth,
			cerbos,
			//fhir,
			db,
			kms,
			//redis,
			audit,
			logger,
			//cache,
		})

		await next()
	}
}
