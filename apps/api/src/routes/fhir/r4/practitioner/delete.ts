import { ApiError, openApiErrorResponses } from '@/lib/errors'
import { idParamsSchema } from '@/shared/types'
import { createRoute, z } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'

import { practitioner, practitionerHistory } from '@repo/db'

import type { App } from '@/lib/hono'
import type { ResourceBase } from '@/shared/types'

const route = createRoute({
	tags: ['Practitioner'],
	operationId: 'practitioner-delete',
	method: 'post',
	path: '/fhir/r4/practitioner/{id}/delete',
	security: [{ cookieAuth: [] }],
	request: {
		params: idParamsSchema,
	},
	responses: {
		200: {
			description: 'The deleted success message',
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
export type PractitionerDeleteResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerPractitionerDelete = (app: App) =>
	app.openapi(route, async (c) => {
		const { cerbos, db } = c.get('services')
		const session = c.get('session')
		const { id } = c.req.valid('param')

		if (!session)
			throw new ApiError({ code: 'UNAUTHORIZED', message: 'You Need to login first to continue.' })

		const decision = await cerbos.checkResource({
			principal: {
				id: session.session.userId,
				roles: [session.user.role as string],
				attributes: {},
			},
			resource: {
				kind: 'practitioner',
				id: id,
				attributes: {},
			},
			actions: ['delete'],
		})

		if (!decision.isAllowed('delete')) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: 'You do not have permissions to delete practitioners.',
			})
		}

		const tenant = session.session.activeOrganizationId as string

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
		// Update the practitioner to mark it as deleted
		// This is a soft delete, we just update the status and version
		// We also update the updatedBy field to the current user
		// and set the timestamp to now
		// This allows us to keep the history of the practitioner
		// and also allows us to restore it later if needed
		// We also increment the version number
		// This is important for the history tracking
		// and to ensure that the practitioner is not modified after deletion
		const data = {
			version: (history[0].version as number) + 1,
			ts: new Date(),
			status: 'deleted' as ResourceBase['status'],
			updatedBy: session.session.userId,
		}

		const result = await db
			.update(practitioner)
			.set(data)
			.where(and(eq(practitioner.tenant, tenant), eq(practitioner.id, id)))
			.returning()

		if (result.length < 1)
			throw new ApiError({ code: 'NOT_FOUND', message: 'Practitioner not found.' })

		return c.json(
			{
				message: 'Practitioner deleted successfully',
			},
			200
		)
	})
