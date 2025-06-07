import { createRoute } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'

import { assistant, user } from '@repo/db'

import { ApiError, openApiErrorResponses } from '../../lib/errors'
import { idParamsSchema } from '../../shared/types'
import { AssistantSelectSchema } from './types'

import type { z } from '@hono/zod-openapi'
import type { App } from '../../lib/hono'

const route = createRoute({
	tags: ['Assistant'],
	operationId: 'assistant-find-one',
	method: 'get',
	path: '/assistant/{id}',
	security: [{ cookieAuth: [] }],
	request: {
		params: idParamsSchema,
	},
	responses: {
		200: {
			description: 'The Assistant',
			content: {
				'application/json': {
					schema: AssistantSelectSchema,
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type Route = typeof route
export type AssistantFindOneResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerAssistantFindOne = (app: App) =>
	app.openapi(route, async (c) => {
		const { auth, db } = c.get('services')
		const session = c.get('session')

		if (!session)
			throw new ApiError({
				code: 'UNAUTHORIZED',
				message: 'You Need to login first to continue.',
			})

		const canReadAssistant = await auth.api.hasPermission({
			headers: c.req.raw.headers,
			body: {
				permissions: {
					assistant: ['read'], // This must match the structure in your access control
				},
			},
		})

		if (!canReadAssistant) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: 'You do not have permissions to read a assistant.',
			})
		}

		const organization = session.session.activeOrganizationId as string
		const { id } = c.req.valid('param')

		const result = await db
			.select()
			.from(assistant)
			.leftJoin(user, eq(user.id, assistant.user))
			.where(and(eq(assistant.organization, organization), eq(assistant.id, id)))

		if (result.length < 1)
			throw new ApiError({
				code: 'NOT_FOUND',
				message: 'Assistant not found.',
			})

		return c.json(result[0], 200)
	})
