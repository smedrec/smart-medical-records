import { createRoute, z } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'

import { patient } from '../../db/schema'
import { ApiError, openApiErrorResponses } from '../../lib/errors'
import { idParamsSchema } from '../../shared/types'

import type { App } from '../../lib/hono'

const route = createRoute({
	tags: ['Patient'],
	operationId: 'patient-delete',
	method: 'delete',
	path: '/patient/{id}',
	security: [{ cookieAuth: [] }],
	request: {
		params: idParamsSchema,
	},
	responses: {
		200: {
			description: 'The requested patient',
			content: {
				'application/json': {
					schema: z.object({
						message: z.string().openapi({
							description: 'The status message',
						}),
					}),
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type Route = typeof route
export type PatientDeleteResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerPatientDelete = (app: App) =>
	app.openapi(route, async (c) => {
		const { auth, db } = c.get('services')
		const session = c.get('session')

		if (!session)
			throw new ApiError({ code: 'UNAUTHORIZED', message: 'You Need to login first to continue.' })

		const canDeletePatient = await auth.api.hasPermission({
			headers: c.req.raw.headers,
			body: {
				permissions: {
					patient: ['delete'], // This must match the structure in your access control
				},
			},
		})

		if (!canDeletePatient) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: 'You do not have permissions to delete a assistant.',
			})
		}

		const organization = session.session.activeOrganizationId as string
		const { id } = c.req.valid('param')

		const result = await db
			.delete(patient)
			.where(and(eq(patient.organization, organization), eq(patient.id, id)))
			.returning()

		if (result.length < 1) throw new ApiError({ code: 'NOT_FOUND', message: 'Patient not found.' })

		return c.json(
			{
				message: 'Patient deleted successfully',
			},
			200
		)
	})
