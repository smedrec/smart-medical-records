import { createRoute } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'

import { therapist } from '@repo/db'

import { ApiError, openApiErrorResponses } from '../../lib/errors'
import { idParamsSchema } from '../../shared/types'
import { patchTherapistSchema, TherapistSelectSchema } from './types'

import type { z } from '@hono/zod-openapi'
import type { App } from '../../lib/hono'

const route = createRoute({
	tags: ['Therapist'],
	operationId: 'therapist-update',
	method: 'patch',
	path: '/therapist/{id}',
	security: [{ cookieAuth: [] }],
	request: {
		params: idParamsSchema,
		body: {
			required: true,
			content: {
				'application/json': {
					schema: patchTherapistSchema,
				},
			},
		},
	},
	responses: {
		200: {
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
export type TherapistUpdateRequest = z.infer<
	(typeof route.request.body.content)['application/json']['schema']
>
export type TherapistUpdateResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerTherapistUpdate = (app: App) =>
	app.openapi(route, async (c) => {
		const { auth, db } = c.get('services')
		const session = c.get('session')

		if (!session)
			throw new ApiError({
				code: 'UNAUTHORIZED',
				message: 'You Need to login first to continue.',
			})

		const canUpdateAssistant = await auth.api.hasPermission({
			headers: c.req.raw.headers,
			body: {
				permissions: {
					assistant: ['update'], // This must match the structure in your access control
				},
			},
		})

		if (!canUpdateAssistant) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: 'You do not have permissions to update therapists.',
			})
		}

		const { id } = c.req.valid('param')
		const data = {
			...c.req.valid('json'),
			updatedBy: session.session.userId,
			updatedAt: new Date(),
		}

		const result = await db.update(therapist).set(data).where(eq(therapist.id, id)).returning()

		if (result.length < 1)
			throw new ApiError({
				code: 'NOT_FOUND',
				message: 'Therapist not found.',
			})

		return c.json(result[0], 200)
	})
