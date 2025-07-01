import { createRoute } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'

import { emailProvider } from '@repo/auth-db'

import { ApiError, openApiErrorResponses } from '../../../lib/errors/index.js'
import { ConfigMailPatchSchema, ConfigMailSelectSchema } from './types.js'

import type { z } from '@hono/zod-openapi'
import type { App } from '../../../lib/hono/index.js'

const route = createRoute({
	tags: ['Config'],
	operationId: 'config-mail-update',
	method: 'patch',
	path: '/config/mail',
	security: [{ cookieAuth: [] }],
	request: {
		body: {
			required: true,
			description: 'The mail configuration to update',
			content: {
				'application/json': {
					schema: ConfigMailPatchSchema,
				},
			},
		},
	},
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
export type ConfigMailUpdateRequest = z.infer<
	(typeof route.request.body.content)['application/json']['schema']
>
export type ConfigMailUpdateResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerConfigMailUpdate = (app: App) =>
	app.openapi(route, async (c) => {
		const { cerbos, db } = c.get('services')
		const session = c.get('session')

		if (!session)
			throw new ApiError({ code: 'UNAUTHORIZED', message: 'You Need to login first to continue.' })

		const canUpdateConfig = await cerbos.isAllowed({
			principal: {
				id: session.userId,
				roles: [session.activeOrganizationRole as string],
				attributes: {},
			},
			resource: {
				kind: 'Config',
				id: 'update',
				attributes: {},
			},
			action: 'update',
		})

		if (!canUpdateConfig) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: 'You do not have permissions to update the mail configuration.',
			})
		}

		const data = c.req.valid('json')

		const result = await db
			.update(emailProvider)
			.set(data)
			.where(eq(emailProvider.organizationId, session.activeOrganizationId as string))
			.returning()

		if (result.length < 1)
			throw new ApiError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'A machine readable error when updating the mail configuration.',
			})

		const response = {
			...result[0],
			provider: result[0].provider as 'smtp' | 'resend' | 'sendgrid',
			password: result[0].password ?? undefined,
			host: result[0].host ?? undefined,
			port: result[0].port ?? undefined,
			secure: result[0].secure ?? undefined,
			user: result[0].user ?? undefined,
			apiKey: result[0].apiKey ?? undefined,
			fromName: result[0].fromName ?? undefined,
			fromEmail: result[0].fromEmail ?? undefined,
		}

		return c.json(response, 200)
	})
