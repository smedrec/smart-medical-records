import { ApiError, openApiErrorResponses } from '@/lib/errors'
import { idParamsSchema } from '@/shared/types'
import { createRoute } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'

import { patient } from '@repo/db'

import { patchPatientSchema, PatientSelectSchema } from './types'

import type { App } from '@/lib/hono'
import type { z } from '@hono/zod-openapi'

const route = createRoute({
	tags: ['Patient'],
	operationId: 'patient-update',
	method: 'patch',
	path: '/patient/{id}',
	security: [{ cookieAuth: [] }],
	request: {
		params: idParamsSchema,
		body: {
			required: true,
			content: {
				'application/json': {
					schema: patchPatientSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: 'The patient',
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
export type PatientUpdateRequest = z.infer<
	(typeof route.request.body.content)['application/json']['schema']
>
export type ClientPatientResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerPatientUpdate = (app: App) =>
	app.openapi(route, async (c) => {
		const { auth, db } = c.get('services')
		const session = c.get('session')

		if (!session)
			throw new ApiError({
				code: 'UNAUTHORIZED',
				message: 'You Need to login first to continue.',
			})

		const canUpdatePatient = await auth.api.hasPermission({
			headers: c.req.raw.headers,
			body: {
				permissions: {
					patient: ['update'], // This must match the structure in your access control
				},
			},
		})

		if (!canUpdatePatient) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: 'You do not have permissions to update patients.',
			})
		}

		const organization = session.session.activeOrganizationId as string
		const { id } = c.req.valid('param')
		const data = {
			...c.req.valid('json'),
			updatedBy: session.session.userId,
			updatedAt: new Date(),
		}

		const result = await db
			.update(patient)
			.set(data)
			.where(and(eq(patient.organization, organization), eq(patient.id, id)))
			.returning()

		if (result.length < 1)
			throw new ApiError({
				code: 'NOT_FOUND',
				message: 'Patient not found.',
			})

		return c.json(result[0], 200)
	})
