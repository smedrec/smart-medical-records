import { createRoute } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'

import { caseStudy, caseStudyTherapist, patient } from '@repo/db'

import { ApiError, openApiErrorResponses } from '../../lib/errors'
import { idParamsSchema } from '../../shared/types'
import { CaseStudySelectSchema } from './types'

import type { z } from '@hono/zod-openapi'
import type { App } from '../../lib/hono'

const route = createRoute({
	tags: ['CaseStudy'],
	operationId: 'caseStudy-find-one',
	method: 'get',
	path: '/caseStudy/{id}',
	security: [{ cookieAuth: [] }],
	request: {
		params: idParamsSchema,
	},
	responses: {
		200: {
			description: 'The CaseStudy',
			content: {
				'application/json': {
					schema: CaseStudySelectSchema,
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type Route = typeof route
export type CaseStudyFindOneResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerCaseStudyFindOne = (app: App) =>
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

		const result = await db
			.select()
			.from(caseStudy)
			.leftJoin(patient, eq(patient.id, caseStudy.patient))
			//.leftJoin(caseStudyTherapist, eq(caseStudyTherapist.caseStudy, caseStudy.id))
			.where(eq(caseStudy.id, id))

		if (result.length < 1)
			throw new ApiError({
				code: 'NOT_FOUND',
				message: 'Case not found.',
			})

		return c.json(result[0], 200)
	})
