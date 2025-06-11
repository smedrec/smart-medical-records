import { createRoute, z } from '@hono/zod-openapi'
import { asc, eq } from 'drizzle-orm'

import { caseStudy, caseStudyTherapist, patient } from '@repo/db'

import { ApiError, openApiErrorResponses } from '../../lib/errors'
import { getOffset, paginatedData, parseQueryInt } from '../../lib/utils/paginated'
import { idParamsSchema, querySchema } from '../../shared/types'
import { CaseStudySelectSchema } from './types'

import type { App } from '../../lib/hono'

const route = createRoute({
	tags: ['CaseStudy'],
	operationId: 'caseStudy-get-all',
	method: 'get',
	path: '/caseStudy/get-all/{id}',
	security: [{ cookieAuth: [] }],
	request: {
		query: querySchema,
		params: idParamsSchema,
	},
	responses: {
		200: {
			description: 'The caseStudies',
			content: {
				'application/json': {
					schema: z.array(CaseStudySelectSchema),
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type Route = typeof route

export type CaseStudyGetAllResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerCaseStudyGetAll = (app: App) =>
	app.openapi(route, async (c) => {
		const { auth, db } = c.get('services')
		const session = c.get('session')
		let canReadCaseStudy: boolean = false

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
						caseStudy: ['read'],
					},
				},
			})

			canReadCaseStudy = result.valid
		} else {
			const result = await auth.api.hasPermission({
				headers: c.req.raw.headers,
				body: {
					permissions: {
						caseStudy: ['read'], // This must match the structure in your access control
					},
				},
			})

			canReadCaseStudy = result.success
		}

		if (!canReadCaseStudy) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: 'You do not have permissions to read a case study.',
			})
		}

		const { id } = c.req.valid('param')

		const limit = parseQueryInt(c.req.query('limit')) || 10
		const page = parseQueryInt(c.req.query('page')) || 1
		const total = await db.$count(caseStudy, eq(caseStudy.patient, id))
		const offset = getOffset(page, limit)
		const pagination = paginatedData({ size: limit, page, count: total })

		const result = await db
			.select()
			.from(caseStudy)
			//.leftJoin(patient, eq(patient.id, caseStudy.patient))
			.leftJoin(caseStudyTherapist, eq(caseStudyTherapist.caseStudy, caseStudy.id))
			.where(eq(caseStudy.patient, id))
			.orderBy(asc(caseStudy.id)) // order by is mandatory
			.limit(limit) // the number of rows to return
			.offset(offset)

		if (result.length < 1)
			throw new ApiError({
				code: 'NOT_FOUND',
				message: 'Case studies not found.',
			})

		return c.json(
			{
				result: result,
				pagination: pagination,
			},
			200
		)
	})
