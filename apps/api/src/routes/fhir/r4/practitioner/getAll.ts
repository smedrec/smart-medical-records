import { ApiError, openApiErrorResponses } from '@/lib/errors'
import { getOffset, paginatedData, PaginatedResponse, parseQueryInt } from '@/lib/utils/paginated'
import { BaseResourceResponseSchema, UserSelectResponseSchema } from '@/lib/utils/responses'
import { querySchema } from '@/shared/types'
import { createRoute, z } from '@hono/zod-openapi'
import { asc, eq } from 'drizzle-orm'

import { practitioner, user } from '@repo/db'

import type { App } from '@/lib/hono'

const route = createRoute({
	tags: ['Practitioner'],
	operationId: 'practitioner-get-all',
	method: 'get',
	path: '/fhir/r4/practitioner',
	security: [{ cookieAuth: [] }],
	request: {
		query: querySchema,
	},
	responses: {
		200: {
			description: 'The practitioners',
			content: {
				'application/json': {
					schema: z.object({
						result: z.array(
							z.object({
								practitioner: BaseResourceResponseSchema,
								user: UserSelectResponseSchema,
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
export type PractitionerGetAllResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerPractitionerGetAll = (app: App) =>
	app.openapi(route, async (c) => {
		const { cerbos, db } = c.get('services')
		const session = c.get('session')
		//let canReadPractitioner: boolean = false

		if (!session)
			throw new ApiError({
				code: 'UNAUTHORIZED',
				message: 'You Need to login first to continue.',
			})

		const decision = await cerbos.checkResource({
			principal: {
				id: session.session.userId,
				roles: [session.user.role as string],
				attributes: {},
			},
			resource: {
				kind: 'practitioner',
				id: '',
				attributes: {},
			},
			actions: ['read'],
		})

		/**if (c.req.header('x-api-key')) {
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
		}*/

		if (!decision.isAllowed('read')) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: 'You do not have permissions to read practitioners.',
			})
		}

		const tenant = session.session.activeOrganizationId as string

		const limit = parseQueryInt(c.req.query('limit')) || 10
		const page = parseQueryInt(c.req.query('page')) || 1
		const total = await db.$count(practitioner, eq(practitioner.tenant, tenant))
		const offset = getOffset(page, limit)
		const pagination = paginatedData({ size: limit, page, count: total })

		try {
			const result = await db
				.select()
				.from(practitioner)
				.leftJoin(user, eq(user.id, practitioner.user))
				.where(eq(practitioner.tenant, tenant))
				.orderBy(asc(practitioner.id)) // order by is mandatory
				.limit(limit) // the number of rows to return
				.offset(offset)

			if (result.length < 1)
				throw new ApiError({
					code: 'NOT_FOUND',
					message: 'Practitioners not found.',
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
				message: `Failed to fetch practitioners. ${error instanceof Error ? error.message : 'Unknown error'}`,
			})
		}
	})
