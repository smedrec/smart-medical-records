import { createRoute, z } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'

import { patientsToTherapists } from '@repo/db'

import { ApiError, openApiErrorResponses } from '../../lib/errors'

import type { App } from '../../lib/hono'

const route = createRoute({
	tags: ['Patient'],
	operationId: 'patient-disable-therapist',
	method: 'post',
	path: '/patient/disable-therapist',
	security: [{ cookieAuth: [] }],
	request: {
		body: {
			required: true,
			description: 'Disable therapist to patient',
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
		200: {
			description: 'The relation patient therapist disabled',
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
export type PatientsDisableTherapistsRequest = z.infer<
	(typeof route.request.body.content)['application/json']['schema']
>
export type PatientsDisableTherapistsResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerPatientsDisableTherapists = (app: App) =>
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
				message: 'You do not have permissions to disable a therapist in a patient.',
			})
		}

		const params = c.req.valid('json')

		const data = {
			disabled: true,
			updatedBy: session.session.userId,
			updatedAt: new Date(),
		}

		const result = await db
			.update(patientsToTherapists)
			.set(data)
			.where(
				and(
					eq(patientsToTherapists.patient, params.patient),
					eq(patientsToTherapists.therapist, params.therapist)
				)
			)
			.returning()

		if (result.length < 1)
			throw new ApiError({ code: 'NOT_FOUND', message: 'Relation patient therapist not found.' })

		return c.json(result[0], 200)
	})
