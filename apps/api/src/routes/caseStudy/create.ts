import { createRoute } from '@hono/zod-openapi'

import { caseStudy, caseStudyTherapist, member } from '@repo/db'

import { ApiError, openApiErrorResponses } from '../../lib/errors'
import { CaseStudyInsertSchema, CaseStudySelectSchema } from './types'

import type { z } from '@hono/zod-openapi'
import type { App } from '../../lib/hono'

const route = createRoute({
	tags: ['CaseStudy'],
	operationId: 'caseStudy-create',
	method: 'post',
	path: '/caseStudy/',
	security: [{ cookieAuth: [] }],
	request: {
		body: {
			required: true,
			description: 'The caseStudy to create',
			content: {
				'application/json': {
					schema: CaseStudyInsertSchema,
				},
			},
		},
	},
	responses: {
		201: {
			description: 'The assistant',
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
export type CaseStudyCreateRequest = z.infer<
	(typeof route.request.body.content)['application/json']['schema']
>
export type CaseStudyCreateResponse = z.infer<
	(typeof route.responses)[201]['content']['application/json']['schema']
>

export const registerCaseStudyCreate = (app: App) =>
	app.openapi(route, async (c) => {
		const { auth, db } = c.get('services')
		const session = c.get('session')
		let canCreateCaseStudy: boolean = false
		// let careTeam: any = {}

		if (!session)
			throw new ApiError({ code: 'UNAUTHORIZED', message: 'You Need to login first to continue.' })

		if (c.req.header('x-api-key')) {
			const result = await auth.api.verifyApiKey({
				body: {
					key: c.req.header('x-api-key') as string,
					permissions: {
						caseStudy: ['create'],
					},
				},
			})

			canCreateCaseStudy = result.valid
		} else {
			const result = await auth.api.hasPermission({
				headers: c.req.raw.headers,
				body: {
					permissions: {
						caseStudy: ['create'], // This must match the structure in your access control
					},
				},
			})

			canCreateCaseStudy = result.success
		}

		if (!canCreateCaseStudy) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: 'You do not have permissions to create a CaseStudy.',
			})
		}

		/**const body = c.req.valid('json')

		if (!body.careTeam) {
			careTeam = await auth.api.createTeam({
				body: {
					name: body.title + ' - Care Team',
					organizationId: session.session.activeOrganizationId as string,
				},
			})

			if (!careTeam || !careTeam.id) {
				throw new ApiError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Failed to create care team for the case study.',
				})
			}
		} else {
			const memberCareTeam = await db
				.insert(member)
				.values({
					id: generateId(),
					organizationId: session.session.activeOrganizationId as string,
					userId: session.session.userId,
					teamId: careTeam.id,
					role: 'therapist',
					createdAt: new Date(),
				})
				.returning()

			if (!memberCareTeam[0] || !memberCareTeam[0].id) {
				throw new ApiError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Failed to add user to the care team.',
				})
			}
		} */

		const data = {
			...c.req.valid('json'),
			createdBy: session.session.userId,
			updatedBy: session.session.userId,
		}

		const result = await db.insert(caseStudy).values(data).returning()

		await db
			.insert(caseStudyTherapist)
			.values({
				caseStudy: result[0].id,
				therapist: data.therapist,
				createdBy: session.session.userId,
				updatedBy: session.session.userId,
			})
			.returning()

		if (result.length < 1)
			throw new ApiError({ code: 'INTERNAL_SERVER_ERROR', message: 'A machine readable error.' })

		// Transform null values to undefined for optional fields
		const response = {
			...result[0],
			careTeam: result[0].careTeam ?? undefined,
		}
		return c.json(response, 201)
	})
