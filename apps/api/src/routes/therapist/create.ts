import { createRoute } from '@hono/zod-openapi'

import { therapist } from '../../db/schema'
import { ApiError, openApiErrorResponses } from '../../lib/errors'
import { TherapistInsertSchema, TherapistSelectSchema } from './types'

import type { z } from '@hono/zod-openapi'
import type { App } from '../../lib/hono'

const route = createRoute({
	tags: ['Therapist'],
	operationId: 'therapist-create',
	method: 'post',
	path: '/therapist',
	security: [{ cookieAuth: [] }],
	request: {
		body: {
			required: true,
			description: 'The therapist to create',
			content: {
				'application/json': {
					schema: TherapistInsertSchema,
				},
			},
		},
	},
	responses: {
		201: {
			description: 'The course',
			content: {
				'application/json': {
					schema: TherapistSelectSchema,
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type Route = typeof route
export type TherapistCreateRequest = z.infer<
	(typeof route.request.body.content)['application/json']['schema']
>
export type TherapistCreateResponse = z.infer<
	(typeof route.responses)[201]['content']['application/json']['schema']
>

export const registerTherapistCreate = (app: App) =>
	app.openapi(route, async (c) => {
		const { auth, db } = c.get('services')
		const session = c.get('session')

		if (!session)
			throw new ApiError({ code: 'UNAUTHORIZED', message: 'You Need to login first to continue.' })

		const canCreateTherapist = await auth.api.hasPermission({
			headers: c.req.raw.headers,
			body: {
				permissions: {
					therapist: ['create'], // This must match the structure in your access control
				},
			},
		})

		if (!canCreateTherapist) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: 'You do not have permissions to create a therapist.',
			})
		}

		const data = {
			...c.req.valid('json'),
			organization: session.session.activeOrganizationId as string,
			createdBy: session.user.id,
			updatedBy: session.user.id,
		}

		const result = await db.insert(therapist).values(data).returning()

		if (result.length < 1)
			throw new ApiError({ code: 'INTERNAL_SERVER_ERROR', message: 'A machine readable error.' })

		return c.json(result[0], 201)
	})
