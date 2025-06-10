import { createRoute } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'

import { caseStudy } from '@repo/db'

import { ApiError, openApiErrorResponses } from '../../lib/errors'
import { idParamsSchema } from '../../shared/types'
import { CaseStudyPatchSchema, CaseStudySelectSchema } from './types'

import type { z } from '@hono/zod-openapi'
import type { App } from '../../lib/hono'

const route = createRoute({
	tags: ['CaseStudy'],
	operationId: 'caseStudy-update',
	method: 'patch',
	path: '/caseStudy/{id}',
	security: [{ cookieAuth: [] }],
	request: {
		params: idParamsSchema,
		body: {
			required: true,
			content: {
				'application/json': {
					schema: CaseStudyPatchSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: 'The updated caseStudy',
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
export type CaseStudyUpdateRequest = z.infer<
	(typeof route.request.body.content)['application/json']['schema']
>
export type CaseStudytUpdateResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerCaseStudyUpdate = (app: App) =>
	app.openapi(route, async (c) => {
		const { auth, db } = c.get('services')
		const session = c.get('session')
		let canUpdateCaseStudy: boolean = false

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
						caseStudy: ['update'],
					},
				},
			})

			canUpdateCaseStudy = result.valid
		} else {
			const result = await auth.api.hasPermission({
				headers: c.req.raw.headers,
				body: {
					permissions: {
						caseStudy: ['update'], // This must match the structure in your access control
					},
				},
			})

			canUpdateCaseStudy = result.success
		}

		if (!canUpdateCaseStudy) {
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

		const result = await db.update(caseStudy).set(data).where(eq(caseStudy.id, id)).returning()

		if (result.length < 1)
			throw new ApiError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'A machine readable error.',
			})

		return c.json(result[0], 200)
	})
