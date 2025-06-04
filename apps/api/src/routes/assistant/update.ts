import { createRoute } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'

import { assistant } from '../../db/schema'
import { ApiError, openApiErrorResponses } from '../../lib/errors'
import { idParamsSchema } from '../../shared/types'
import { AssistantSelectSchema, patchAssistantSchema } from './types'

import type { z } from '@hono/zod-openapi'
import type { App } from '../../lib/hono'

const route = createRoute({
	tags: ['Assistant'],
	operationId: 'assistant-update',
	method: 'patch',
	path: '/assistant/{id}',
	security: [{ cookieAuth: [] }],
	request: {
		params: idParamsSchema,
		body: {
			required: true,
			content: {
				'application/json': {
					schema: patchAssistantSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: 'The updated assistant',
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
export type AssistantUpdateRequest = z.infer<
	(typeof route.request.body.content)['application/json']['schema']
>
export type AssistantUpdateResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerAssistantUpdate = (app: App) =>
	app.openapi(route, async (c) => {
		const { auth, db } = c.get('services')
		const session = c.get('session')

		if (!session)
			throw new ApiError({
				code: 'UNAUTHORIZED',
				message: 'You Need to login first to continue.',
			})

		const canUpdateAssistant = await auth.api.hasPermission({
			headers: c.req.raw.headers,
			body: {
				permissions: {
					assistant: ['update'], // This must match the structure in your access control
				},
			},
		})

		if (!canUpdateAssistant) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: 'You do not have permissions to update a assistant.',
			})
		}

		const { id } = c.req.valid('param')
		const data = {
			...c.req.valid('json'),
			updatedBy: session.session.userId,
			updatedAt: new Date(),
		}

		const result = await db.update(assistant).set(data).where(eq(assistant.id, id)).returning()

		if (result.length < 1)
			throw new ApiError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'A machine readable error.',
			})

		return c.json(result[0], 200)
	})
