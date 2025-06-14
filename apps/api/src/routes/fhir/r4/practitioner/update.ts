import { ApiError, openApiErrorResponses } from '@/lib/errors'
import { BaseResourceResponseSchema } from '@/lib/utils/responses'
import { idParamsSchema } from '@/shared/types'
import { createRoute, z } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'

import { practitioner, practitionerHistory } from '@repo/db'

import type { App } from '@/lib/hono'
import type { ResourceBase } from '@/shared/types'
import type { Practitioner } from '@solarahealth/fhir-r4'

const route = createRoute({
	tags: ['Practitioner'],
	operationId: 'practitioner-update',
	method: 'post',
	path: '/fhir/r4/practitioner/{id}/update',
	security: [{ cookieAuth: [] }],
	request: {
		params: idParamsSchema,
		body: {
			required: true,
			content: {
				'application/json': {
					schema: z.object({
						resource: z.unknown().openapi({
							description: 'The practitioner resource to update',
						}),
					}),
				},
			},
		},
	},
	responses: {
		200: {
			description: 'The updated practitioner',
			content: {
				'application/json': {
					schema: BaseResourceResponseSchema,
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type Route = typeof route
export type PractitionerUpdateRequest = z.infer<
	(typeof route.request.body.content)['application/json']['schema']
>
export type PractitionerUpdateResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerPractitionerUpdate = (app: App) =>
	app.openapi(route, async (c) => {
		const { auth, db } = c.get('services')
		const session = c.get('session')
		let canUpdatePractitioner: boolean = false

		if (!session)
			throw new ApiError({
				code: 'UNAUTHORIZED',
				message: 'You Need to login first to continue.',
			})

		if (c.req.header('x-api-key')) {
			const result = await auth.api.verifyApiKey({
				body: {
					key: c.req.header('x-api-key') as string,
					permissions: {
						practitioner: ['update'],
					},
				},
			})

			canUpdatePractitioner = result.valid
		} else {
			const result = await auth.api.hasPermission({
				headers: c.req.raw.headers,
				body: {
					permissions: {
						practitioner: ['update'], // This must match the structure in your access control
					},
				},
			})

			canUpdatePractitioner = result.success
		}

		if (!canUpdatePractitioner) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: 'You do not have permissions to update practitioners.',
			})
		}

		const { id } = c.req.valid('param')
		const tenant = session.session.activeOrganizationId as string

		/**const insertedHistory = await db
			.insert(practitionerHistory)
			.select(
				db
					.select({
						ts: practitioner.ts,
						resource_type: practitioner.resource_type,
						status: practitioner.status,
						resource: practitioner.resource,
					})
					.from(practitioner)
					.where(eq(practitioner.id, id))
			)
			.returning({
				id: practitionerHistory.id,
				resource: practitionerHistory.resource,
			}) */

		const history = await db
			.select()
			.from(practitioner)
			.where(and(eq(practitioner.tenant, tenant), eq(practitioner.id, id)))

		if (history.length < 1)
			throw new ApiError({
				code: 'NOT_FOUND',
				message: 'Practitioner not found.',
			})

		const insertedHistory = await db.insert(practitionerHistory).values(history[0]).returning({
			id: practitionerHistory.id,
			resource: practitionerHistory.resource,
		})

		if (insertedHistory.length < 1)
			throw new ApiError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'Failed to insert history record.',
			})

		const body = await c.req.json()
		const resource = {
			...insertedHistory[0].resource,
			...body.resource,
		}

		const data = {
			version: (history[0].version as number) + 1,
			ts: new Date(),
			status: 'updated' as ResourceBase['status'],
			resource: resource as Practitioner, // Assuming resource is a JSON object
			updatedBy: session.session.userId,
		}

		const result = await db
			.update(practitioner)
			.set(data)
			.where(and(eq(practitioner.tenant, tenant), eq(practitioner.id, id)))
			.returning()

		if (result.length < 1)
			throw new ApiError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'A machine readable error.',
			})

		return c.json(result[0], 200)
	})
