//import { redis } from "../db/redis";
import { cerbos } from '@/lib/cerbos'
import { createId } from '@paralleldrive/cuid2'

import { Audit } from '@repo/audit'
import { auth } from '@repo/auth'
import { AuthDb } from '@repo/auth-db'
import { fhir } from '@repo/fhir'

import { ConsoleLogger } from '../logs'

import type { MiddlewareHandler } from 'hono'
//import {initCache} from "../cache";
import type { HonoEnv } from '../hono/context'

/**
 * These maps persist between worker executions and are used for caching
 */
//const rlMap = new Map();

/**
 * workerId and coldStartAt are used to track the lifetime of the worker
 * and are set once when the worker is first initialized.
 *
 * subsequent requests will use the same workerId and coldStartAt
 */
let isolateId: string | undefined = undefined
let isolateCreatedAt: number | undefined = undefined
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

		const audit = new Audit('audit', c.env.AUDIT_REDIS_URL)

		const authDbInstance = new AuthDb()

		// Check the database connection
		const isConnected = await authDbInstance.checkAuthDbConnection()
		if (!isConnected) {
			console.error('Failed to connect to the auth database. Exiting.')
			process.exit(1)
		}

		// Get the Drizzle ORM instance
		const db = authDbInstance.getDrizzleInstance()

		//const cache = initCache(c);
		//const cache = null

		c.set('services', {
			auth,
			cerbos,
			fhir,
			db,
			//redis,
			audit,
			logger,
			//cache,
		})

		await next()
	}
}
