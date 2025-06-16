import { auth } from '@repo/auth'

import { cerbos } from '../cerbos'

//import { ConsoleLogger } from '../logs'

import type { MiddlewareHandler } from 'hono'
//import {initCache} from "../cache";
import type { HonoEnv } from './context'

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

let requestId: string | undefined = undefined
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

		if (!requestId) {
			requestId = crypto.randomUUID()
		}
		c.set('requestId', requestId)

		c.set('requestStartedAt', Date.now())

		/**const logger = new ConsoleLogger({
			requestId,
			application: 'mcp',
			environment: c.env.ENVIRONMENT as 'VITEST' | 'development' | 'staging' | 'production',
			defaultFields: { environment: c.env.ENVIRONMENT },
		})*/

		// @ts-ignore
		c.set(
			'location',
			c.req.header('True-Client-IP') ??
				c.req.header('CF-Connecting-IP') ??
				c.req.raw?.cf?.colo ??
				''
		)
		c.set('userAgent', c.req.header('User-Agent'))

		const session = await auth.api.getSession({
			query: {
				disableCookieCache: true,
			},
			headers: c.req.raw.headers,
		})

		if (!session) {
			c.set('session', null)
		}

		/**if (c.req.header('x-api-key')) {
			const organization = await getActiveOrganization(session.session?.userId)
			session.session.activeOrganizationId = organization
		}*/

		c.set('session', session)

		c.set('services', {
			auth,
			cerbos,
			//redis,
			//logger,
			//cache,
		})

		await next()
	}
}
