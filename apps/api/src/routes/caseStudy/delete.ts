import { createRoute, z } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'

import { caseStudy } from '@repo/db'

import { ApiError, openApiErrorResponses } from '../../lib/errors'
import { idParamsSchema } from '../../shared/types'

import type { App } from '../../lib/hono'

const route = createRoute({
	tags: ['CaseStudy'],
	operationId: 'caseStudy-delete',
	method: 'delete',
	path: '/caseStudy/{id}',
	security: [{ cookieAuth: [] }],
	request: {
		params: idParamsSchema,
	},
	responses: {
		200: {
			description: 'The requested caseStudy',
			content: {
				'application/json': {
					schema: z.object({
						message: z.string().openapi({
							description: 'The caseStudy message',
						}),
					}),
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type Route = typeof route
export type CaseStudyDeleteResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerCaseStudyDelete = (app: App) =>
	app.openapi(route, async (c) => {
		const { auth, db } = c.get('services')
		const session = c.get('session')
		let canDeleteCaseStudy: boolean = false

		if (!session)
			throw new ApiError({ code: 'UNAUTHORIZED', message: 'You Need to login first to continue.' })

		if (c.req.header('x-api-key')) {
			const result = await auth.api.verifyApiKey({
				body: {
					key: c.req.header('x-api-key') as string,
					permissions: {
						caseStudy: ['delete'],
					},
				},
			})

			canDeleteCaseStudy = result.valid
		} else {
			const result = await auth.api.hasPermission({
				headers: c.req.raw.headers,
				body: {
					permissions: {
						caseStudy: ['delete'], // This must match the structure in your access control
					},
				},
			})

			canDeleteCaseStudy = result.success
		}

		if (!canDeleteCaseStudy) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: 'You do not have permissions to delete a assistant.',
			})
		}

		const { id } = c.req.valid('param')

		const result = await db.delete(caseStudy).where(eq(caseStudy.id, id)).returning()

		if (result.length < 1)
			throw new ApiError({ code: 'NOT_FOUND', message: 'Assistant not found.' })

		return c.json(
			{
				message: 'Case Study deleted successfully',
			},
			200
		)
	})
