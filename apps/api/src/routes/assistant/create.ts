import { createRoute } from '@hono/zod-openapi'

import { assistant } from '../../db/schema'
import { ApiError, openApiErrorResponses } from '../../lib/errors'
import { AssistantInsertSchema, AssistantSelectSchema } from './types'

import type { z } from '@hono/zod-openapi'
import type { App } from '../../lib/hono'

const route = createRoute({
	tags: ['Assistant'],
	operationId: 'assistant-create',
	method: 'post',
	path: '/assistant',
	security: [{ cookieAuth: [] }],
	request: {
		body: {
			required: true,
			description: 'The assistant to create',
			content: {
				'application/json': {
					schema: AssistantInsertSchema,
				},
			},
		},
	},
	responses: {
		201: {
			description: 'The assistant',
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
export type AssistantCreateRequest = z.infer<
	(typeof route.request.body.content)['application/json']['schema']
>
export type AssistantCreateResponse = z.infer<
	(typeof route.responses)[201]['content']['application/json']['schema']
>

export const registerAssistantCreate = (app: App) =>
	app.openapi(route, async (c) => {
		const { auth, db } = c.get('services')
		const session = c.get('session')

		if (!session)
			throw new ApiError({ code: 'UNAUTHORIZED', message: 'You Need to login first to continue.' })

		const canCreateAssistant = await auth.api.hasPermission({
			headers: c.req.raw.headers,
			body: {
				permissions: {
					assistant: ['create'], // This must match the structure in your access control
				},
			},
		})

		if (!canCreateAssistant) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: 'You do not have permissions to create a assistant.',
			})
		}

		const data = {
			...c.req.valid('json'),
			organization: session.session.activeOrganizationId as string,
			createdBy: session.session.userId,
			updatedBy: session.session.userId,
		}

		const result = await db.insert(assistant).values(data).returning()

		if (result.length < 1)
			throw new ApiError({ code: 'INTERNAL_SERVER_ERROR', message: 'A machine readable error.' })

		return c.json(result[0], 201)
	})
