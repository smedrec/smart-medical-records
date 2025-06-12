import { createRoute, z } from '@hono/zod-openapi'
import { asc, eq } from 'drizzle-orm'

import { assistant, user } from '@repo/db'

import { ApiError, openApiErrorResponses } from '../../../../lib/errors'
import { getOffset, paginatedData, parseQueryInt } from '../../../../lib/utils/paginated'
import { querySchema } from '../../../../shared/types'
import { AssistantSelectSchema } from './types'

import type { App } from '../../../../lib/hono'

const route = createRoute({
	tags: ['Assistant'],
	operationId: 'assistant-get-all',
	method: 'get',
	path: '/assistant',
	security: [{ cookieAuth: [] }],
	request: {
		query: querySchema,
	},
	responses: {
		200: {
			description: 'The course',
			content: {
				'application/json': {
					schema: z.array(AssistantSelectSchema),
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type Route = typeof route
export type AssistantGetAllResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerAssistantGetAll = (app: App) =>
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
				message: 'You do not have permissions to read assistants.',
			})
		}

		const organization = session.session.activeOrganizationId as string

		const limit = parseQueryInt(c.req.query('limit')) || 10
		const page = parseQueryInt(c.req.query('page')) || 1
		const total = await db.$count(assistant, eq(assistant.organization, organization))
		const offset = getOffset(page, limit)
		const pagination = paginatedData({ size: limit, page, count: total })

		const result = await db
			.select()
			.from(assistant)
			.leftJoin(user, eq(user.id, assistant.user))
			.where(eq(assistant.organization, organization))
			.orderBy(asc(assistant.id)) // order by is mandatory
			.limit(limit) // the number of rows to return
			.offset(offset)

		if (result.length < 1)
			throw new ApiError({
				code: 'NOT_FOUND',
				message: 'Assistants not found.',
			})

		return c.json(
			{
				result: result,
				pagination: pagination,
			},
			200
		)
	})
