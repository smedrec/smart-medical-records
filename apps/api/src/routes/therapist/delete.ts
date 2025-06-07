import { createRoute } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'

import { therapist } from '@repo/db'

import { ApiError, openApiErrorResponses } from '../../lib/errors'
import { idParamsSchema } from '../../shared/types'
import { TherapistInsertSchema } from './types'

import type { z } from '@hono/zod-openapi'
import type { App } from '../../lib/hono'

const route = createRoute({
	tags: ['Therapist'],
	operationId: 'therapist-delete',
	method: 'delete',
	path: '/therapist/{id}',
	security: [{ cookieAuth: [] }],
	request: {
		params: idParamsSchema,
	},
	responses: {
		200: {
			description: 'The requested therapist',
			content: {
				'application/json': {
					schema: TherapistInsertSchema,
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type Route = typeof route
export type TherapistDeleteResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerTherapistDelete = (app: App) =>
	app.openapi(route, async (c) => {
		const { auth, db } = c.get('services')
		const session = c.get('session')

		if (!session)
			throw new ApiError({ code: 'UNAUTHORIZED', message: 'You Need to login first to continue.' })

		const canDeleteTherapist = await auth.api.hasPermission({
			headers: c.req.raw.headers,
			body: {
				permissions: {
					therapist: ['delete'], // This must match the structure in your access control
				},
			},
		})

		if (!canDeleteTherapist) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: 'You do not have permissions to delete a therapist.',
			})
		}

		const organization = session.session.activeOrganizationId as string
		const { id } = c.req.valid('param')

		const result = await db
			.delete(therapist)
			.where(and(eq(therapist.organization, organization), eq(therapist.id, id)))
			.returning()

		if (result.length < 1)
			throw new ApiError({ code: 'NOT_FOUND', message: 'Therapist not found.' })

		return c.json(
			{
				message: 'Therapist deleted successfully',
			},
			200
		)
	})
