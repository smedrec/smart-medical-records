import { ApiError, openApiErrorResponses } from '@/lib/errors'
import { getOffset, paginatedData, PaginatedResponse, parseQueryInt } from '@/lib/utils/paginated'
import { BaseResourceResponseSchema, UserSelectResponseSchema } from '@/lib/utils/responses'
import { idParamsSchema, querySchema } from '@/shared/types'
import { createRoute, z } from '@hono/zod-openapi'
import { and, desc, eq } from 'drizzle-orm'

import { practitionerHistory } from '@repo/db'

import type { App } from '@/lib/hono'

const route = createRoute({
	tags: ['PractitionerHistory'],
	operationId: 'practitioner-history-find-one',
	method: 'get',
	path: '/fhir/r4/practitioner/{id}/_history',
	security: [{ cookieAuth: [] }],
	request: {
		params: idParamsSchema,
		query: querySchema,
	},
	responses: {
		200: {
			description: 'The practitioner',
			content: {
				'application/json': {
					schema: z.object({
						result: z.array(
							z.object({
								BaseResourceResponseSchema,
							})
						),
						pagination: PaginatedResponse,
					}),
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type Route = typeof route
export type PractitionerHistoryFindOneResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerPractitionerHistoryFindOne = (app: App) =>
	app.openapi(route, async (c) => {
		const { auth, db } = c.get('services')
		const session = c.get('session')
		let canReadPractitioner: boolean = false

		if (!session)
			throw new ApiError({
				code: 'UNAUTHORIZED',
				message: 'You Need to login first to continue.',
			})

		if (c.req.header('x-api-key')) {
			const result = await auth.api.verifyApiKey({
				body: {
					key: c.req.header('x-api-key') as string,
					permissions: {
						practitioner: ['read'],
					},
				},
			})

			canReadPractitioner = result.valid
		} else {
			const result = await auth.api.hasPermission({
				headers: c.req.raw.headers,
				body: {
					permissions: {
						practitioner: ['read'], // This must match the structure in your access control
					},
				},
			})

			canReadPractitioner = result.success
		}

		if (!canReadPractitioner) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: 'You do not have permissions to read a practitioner.',
			})
		}

		const tenant = session.session.activeOrganizationId as string
		const { id } = c.req.valid('param')

		const limit = parseQueryInt(c.req.query('limit')) || 10
		const page = parseQueryInt(c.req.query('page')) || 1
		const total = await db.$count(
			practitionerHistory,
			and(eq(practitionerHistory.tenant, tenant), eq(practitionerHistory.id, id))
		)
		const offset = getOffset(page, limit)
		const pagination = paginatedData({ size: limit, page, count: total })

		try {
			const result = await db
				.select()
				.from(practitionerHistory)
				.where(and(eq(practitionerHistory.tenant, tenant), eq(practitionerHistory.id, id)))
				.orderBy(desc(practitionerHistory.version)) // order by is mandatory
				.limit(limit) // the number of rows to return
				.offset(offset)

			if (result.length < 1)
				throw new ApiError({
					code: 'NOT_FOUND',
					message: 'Practitioner not found.',
				})

			return c.json(
				{
					result: result,
					pagination: pagination,
				},
				200
			)
		} catch (error) {
			throw new ApiError({
				code: 'INTERNAL_SERVER_ERROR',
				message: `An error occurred while fetching the practitioner. ${error instanceof Error ? error.message : 'Unknown error'}`,
			})
		}
	})
