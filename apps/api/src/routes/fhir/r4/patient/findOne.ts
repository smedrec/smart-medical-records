import { ApiError, openApiErrorResponses } from '@/lib/errors'
import { idParamsSchema } from '@/shared/types'
import { createRoute } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'

import { patient } from '@repo/db'

import { PatientSelectSchema } from './types'

import type { App } from '@/lib/hono'
import type { z } from '@hono/zod-openapi'

const route = createRoute({
	tags: ['Patient'],
	operationId: 'patient-find-one',
	method: 'get',
	path: '/patient/{id}',
	security: [{ cookieAuth: [] }],
	request: {
		params: idParamsSchema,
	},
	responses: {
		200: {
			description: 'The course',
			content: {
				'application/json': {
					schema: PatientSelectSchema,
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type Route = typeof route
export type PatientFindOneResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerPatientFindOne = (app: App) =>
	app.openapi(route, async (c) => {
		const { auth, db } = c.get('services')
		const session = c.get('session')

		if (!session)
			throw new ApiError({
				code: 'UNAUTHORIZED',
				message: 'You Need to login first to continue.',
			})

		const canReadPatient = await auth.api.hasPermission({
			headers: c.req.raw.headers,
			body: {
				permissions: {
					patient: ['read'], // This must match the structure in your access control
				},
			},
		})

		if (!canReadPatient) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: 'You do not have permissions to read a assistant.',
			})
		}

		const organization = session.session.activeOrganizationId as string
		const { id } = c.req.valid('param')

		const result = await db
			.select()
			.from(patient)
			.where(and(eq(patient.organization, organization), eq(patient.id, id)))

		if (result.length < 1)
			throw new ApiError({
				code: 'NOT_FOUND',
				message: 'Patient not found.',
			})

		return c.json(result[0], 200)
	})
