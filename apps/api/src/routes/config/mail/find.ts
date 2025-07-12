import { createRoute } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'

import { emailProvider } from '@repo/auth-db'

import { ApiError, openApiErrorResponses } from '../../../lib/errors/index.js'
import { ConfigMailSelectSchema } from './types.js'

import type { z } from '@hono/zod-openapi'
import type { App } from '../../../lib/hono/index.js'

const route = createRoute({
	tags: ['Config'],
	operationId: 'config-mail-find',
	method: 'get',
	path: '/config/mail',
	security: [{ cookieAuth: [] }],
	request: {},
	responses: {
		200: {
			description: 'The mail configuration',
			content: {
				'application/json': {
					schema: ConfigMailSelectSchema,
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type Route = typeof route

export type ConfigMailFindResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerConfigMailFind = (app: App) =>
	app.openapi(route, async (c) => {
		const { cerbos, db } = c.get('services')
		const session = c.get('session')

		if (!session)
			throw new ApiError({ code: 'UNAUTHORIZED', message: 'You Need to login first to continue.' })

		const canReadConfig = await cerbos.isAllowed({
			principal: {
				id: session.userId,
				roles: [session.activeOrganizationRole as string],
				attributes: {},
			},
			resource: {
				kind: 'Config',
				id: 'read',
				attributes: {},
			},
			action: 'read',
		})

		if (!canReadConfig) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: 'You do not have permissions to read a mail configuration.',
			})
		}

		const result = await db.auth
			.select()
			.from(emailProvider)
			.where(eq(emailProvider.organizationId, session.activeOrganizationId as string))

		if (result.length < 1)
			throw new ApiError({
				code: 'NOT_FOUND',
				message: 'The organization does not have the mail configured.',
			})

		// Ensure the response matches the OpenAPI schema types
		const response = {
			organizationId: result[0].organizationId ?? undefined,
			provider: result[0].provider as 'smtp' | 'resend' | 'sendgrid',
			host: result[0].host ?? undefined,
			port: result[0].port ?? undefined,
			secure: result[0].secure ?? undefined,
			user: result[0].user ?? undefined,
			fromName: result[0].fromName ?? undefined,
			fromEmail: result[0].fromEmail ?? undefined,
		}

		return c.json(response, 200)
	})
