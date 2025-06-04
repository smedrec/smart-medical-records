import { createRoute } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'

import { therapist, user } from '../../db/schema'
import { ApiError, openApiErrorResponses } from '../../lib/errors'
import { idParamsSchema } from '../../shared/types'
import { TherapistSelectSchema } from './types'

import type { z } from '@hono/zod-openapi'
import type { App } from '../../lib/hono'

const route = createRoute({
	tags: ['Therapist'],
	operationId: 'therapist-find-one',
	method: 'get',
	path: '/therapist/{id}',
	security: [{ cookieAuth: [] }],
	request: {
		params: idParamsSchema,
	},
	responses: {
		200: {
			description: 'The therapist',
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
export type TherapistFindOneResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerTherapistFindOne = (app: App) =>
	app.openapi(route, async (c) => {
		const { auth, db } = c.get('services')
		const session = c.get('session')

		if (!session)
			throw new ApiError({
				code: 'UNAUTHORIZED',
				message: 'You Need to login first to continue.',
			})

		const canReadTherapist = await auth.api.hasPermission({
			headers: c.req.raw.headers,
			body: {
				permissions: {
					therapist: ['read'], // This must match the structure in your access control
				},
			},
		})

		if (!canReadTherapist) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: 'You do not have permissions to read a therapist.',
			})
		}

		const organization = session.session.activeOrganizationId as string
		const { id } = c.req.valid('param')

		const result = await db
			.select()
			.from(therapist)
			.leftJoin(user, eq(user.id, therapist.user))
			.where(and(eq(therapist.organization, organization), eq(therapist.id, id)))

		if (result.length < 1)
			throw new ApiError({
				code: 'NOT_FOUND',
				message: 'A machine readable errorAssistant not found.',
			})

		return c.json(result[0], 200)
	})
