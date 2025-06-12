import { ApiError, openApiErrorResponses } from '@/lib/errors'
import { getOffset, paginatedData, parseQueryInt } from '@/lib/utils/paginated'
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
					schema: z.array(practitioner.$inferSelect),
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
		const { auth, db } = c.get('services')
		const session = c.get('session')
		let canReadPractitioner: boolean

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
				message: 'You do not have permissions to read practitioners.',
			})
		}

		const organization = session.session.activeOrganizationId as string

		const limit = parseQueryInt(c.req.query('limit')) || 10
		const page = parseQueryInt(c.req.query('page')) || 1
		const total = await db.$count(practitioner, eq(practitioner.organization, organization))
		const offset = getOffset(page, limit)
		const pagination = paginatedData({ size: limit, page, count: total })

		const result = await db
			.select()
			.from(practitioner)
			.leftJoin(user, eq(user.id, practitioner.user))
			.where(eq(practitioner.organization, organization))
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
	})
