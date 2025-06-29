import { OpenAPIHono } from '@hono/zod-openapi'
import { prettyJSON } from 'hono/pretty-json'

import { auth } from '@repo/auth'
import { getActiveOrganization } from '@repo/auth/src/better-auth/functions.js'
import { useNotFound } from '@repo/hono-helpers'

import { handleError, handleZodError } from '../errors'

import type { Context as GenericContext } from 'hono'
import type { HonoEnv } from './context'

//import { sentry } from '@hono/sentry';

export function newApp() {
	const app = new OpenAPIHono<HonoEnv>({
		defaultHook: handleZodError,
	})

	app.use(prettyJSON())
	app.onError(handleError)
	app.notFound(useNotFound())
	//app.use('*', sentry({
	//  dsn: process.env.SENTRY_DSN,
	//}));

	app.use('*', async (c, next) => {
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
			return next()
		}

		// FIXME - solve this session type structure
		if (c.req.header('x-api-key')) {
			const organization = await getActiveOrganization(session.session?.userId)
			session.session.activeOrganizationId = organization?.organizationId
			session.session.activeOrganizationRole = organization?.role ?? null
		}

		c.set('session', session)

		return next()
	})

	/**app.doc("/openapi.json", {
    openapi: "3.0.0",
    info: {
      title: "O4S LMS API",
      version: "1.0.0",
    },

    servers: [
      {
        url: "http://localhost:4321",
        description: "Development",
      },
    ],

    "x-speakeasy-retries": {
      strategy: "backoff",
      backoff: {
        initialInterval: 50, // 50ms
        maxInterval: 1_000, // 1s
        maxElapsedTime: 30_000, // 30s
        exponent: 1.5,
      },
      statusCodes: ["5XX"],
      retryConnectionErrors: true,
    },
  });

  app.openAPIRegistry.registerComponent("securitySchemes", "bearerAuth", {
    bearerFormat: "root key",
    type: "http",
    scheme: "bearer",
    "x-speakeasy-example": "UNKEY_ROOT_KEY",
  });*/
	return app
}

export type App = ReturnType<typeof newApp>
export type Context = GenericContext<HonoEnv>
