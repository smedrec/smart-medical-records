//import { redis } from "../db/redis";
import { createId } from '@paralleldrive/cuid2'

import { db } from '../../db'
import { auth } from '../better-auth'
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
		const requestId = 'req_' + createId()
		c.set('requestId', requestId)

		c.set('requestStartedAt', Date.now())

		c.res.headers.set('smedrec-Request-Id', requestId)

		const logger = new ConsoleLogger({
			requestId,
			application: 'api',
			environment: c.env.ENVIRONMENT as
				| 'unknown'
				| 'test'
				| 'development'
				| 'preview'
				| 'canary'
				| 'production',
			defaultFields: { environment: c.env.ENVIRONMENT },
		})

		//const cache = initCache(c);
		//const cache = null

		c.set('services', {
			auth,
			db,
			//redis,
			logger,
			//cache,
		})

		await next()
	}
}
