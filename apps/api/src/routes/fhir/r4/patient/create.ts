import { ApiError, openApiErrorResponses } from '@/lib/errors'
import { createRoute } from '@hono/zod-openapi'

import { patient } from '@repo/db'

import { PatientInsertSchema, PatientSelectSchema } from './types'

import type { App } from '@/lib/hono'
import type { z } from '@hono/zod-openapi'

const route = createRoute({
	tags: ['Patient'],
	operationId: 'patient-create',
	method: 'post',
	path: '/patient',
	security: [{ cookieAuth: [] }],
	request: {
		body: {
			required: true,
			description: 'The patient to create',
			content: {
				'application/json': {
					schema: PatientInsertSchema,
				},
			},
		},
	},
	responses: {
		201: {
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
export type PatientCreateRequest = z.infer<
	(typeof route.request.body.content)['application/json']['schema']
>
export type PatientCreateResponse = z.infer<
	(typeof route.responses)[201]['content']['application/json']['schema']
>

export const registerPatientCreate = (app: App) =>
	app.openapi(route, async (c) => {
		const { auth, db } = c.get('services')
		const session = c.get('session')

		if (!session)
			throw new ApiError({ code: 'UNAUTHORIZED', message: 'You Need to login first to continue.' })

		const canCreatePatient = await auth.api.hasPermission({
			headers: c.req.raw.headers,
			body: {
				permissions: {
					patient: ['create'], // This must match the structure in your access control
				},
			},
		})

		if (!canCreatePatient) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: 'You do not have permissions to create a patient.',
			})
		}

		const data = {
			...c.req.valid('json'),
			organization: session.session.activeOrganizationId as string,
			createdBy: session.user.id,
			updatedBy: session.user.id,
		}

		const result = await db.insert(patient).values(data).returning()

		if (result.length < 1)
			throw new ApiError({ code: 'INTERNAL_SERVER_ERROR', message: 'A machine readable error.' })

		return c.json(result[0], 201)
	})
