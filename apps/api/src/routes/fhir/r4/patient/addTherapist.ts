import { ApiError, openApiErrorResponses } from '@/lib/errors'
import { createRoute, z } from '@hono/zod-openapi'

import { patientsToTherapists } from '@repo/db'

import type { App } from '@/lib/hono'

const route = createRoute({
	tags: ['Patient'],
	operationId: 'patient-add-therapist',
	method: 'post',
	path: '/patient/add-therapist',
	security: [{ cookieAuth: [] }],
	request: {
		body: {
			required: true,
			description: 'The therapist to patient',
			content: {
				'application/json': {
					schema: z.object({
						patient: z.string().openapi({
							description: 'The patient id',
						}),
						therapist: z.string().openapi({
							description: 'The therapist id',
						}),
					}),
				},
			},
		},
	},
	responses: {
		201: {
			description: 'The patient',
			content: {
				'application/json': {
					schema: z.object({
						patient: z.string().openapi({
							description: 'The patient id',
						}),
						therapist: z.string().openapi({
							description: 'The therapist id',
						}),
						disabled: z.boolean().openapi({}),
						createdBy: z.string().openapi({
							description: 'The user id that create the relation',
						}),
						updatedBy: z.string().openapi({
							description: 'The user id that disabled the relation',
						}),
						createdAt: z.string().openapi({}),
						updatedAt: z.string().openapi({}),
					}),
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type Route = typeof route
export type PatientsToTherapistsRequest = z.infer<
	(typeof route.request.body.content)['application/json']['schema']
>
export type PatientsToTherapistsResponse = z.infer<
	(typeof route.responses)[201]['content']['application/json']['schema']
>

export const registerPatientsToTherapists = (app: App) =>
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
				message: 'You do not have permissions to add a therapist to a patient.',
			})
		}

		const data = {
			...c.req.valid('json'),
			createdBy: session.user.id,
			updatedBy: session.user.id,
		}

		const result = await db.insert(patientsToTherapists).values(data).returning()

		if (result.length < 1)
			throw new ApiError({ code: 'INTERNAL_SERVER_ERROR', message: 'A machine readable error.' })

		return c.json(result[0], 201)
	})
