import { createRoute, z } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'

import { emailProvider } from '@repo/auth-db'

import { ApiError, openApiErrorResponses } from '../../../lib/errors/index.js'

import type { App } from '../../../lib/hono/index.js'

const route = createRoute({
	tags: ['Config'],
	operationId: 'config-mail-delete',
	method: 'delete',
	path: '/config/mail',
	security: [{ cookieAuth: [] }],
	request: {},
	responses: {
		200: {
			description: 'The status msg',
			content: {
				'application/json': {
					schema: z.object({
						message: z.string().openapi({
							description: 'The status message',
						}),
					}),
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type Route = typeof route

export type ConfigMailDeleteResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerConfigMailDelete = (app: App) =>
	app.openapi(route, async (c) => {
		const { cerbos, db } = c.get('services')
		const session = c.get('session')

		if (!session)
			throw new ApiError({ code: 'UNAUTHORIZED', message: 'You Need to login first to continue.' })

		const canDeleteConfig = await cerbos.isAllowed({
			principal: {
				id: session.userId,
				roles: [session.activeOrganizationRole as string],
				attributes: {},
			},
			resource: {
				kind: 'Config',
				id: 'delete',
				attributes: {},
			},
			action: 'delete',
		})

		if (!canDeleteConfig) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: 'You do not have permissions to delete a mail configuration.',
			})
		}

		const result = await db.auth
			.delete(emailProvider)
			.where(eq(emailProvider.organizationId, session.activeOrganizationId as string))
			.returning()

		if (result.length < 1)
			throw new ApiError({
				code: 'NOT_FOUND',
				message: 'The organization does not have the mail configured.',
			})

		return c.json(
			{
				message: 'Mail configuration deleted successfully',
			},
			200
		)
	})
