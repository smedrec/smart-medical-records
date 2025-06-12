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
	path: '/fhir/r4/practitioner/{id}/recreate',
	security: [{ cookieAuth: [] }],
	request: {
		params: idParamsSchema,
	},
	responses: {
		200: {
			description: 'The recreated success message',
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
export type PractitionerRecreateResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerPractitionerRecreate = (app: App) =>
	app.openapi(route, async (c) => {
		const { auth, db } = c.get('services')
		const session = c.get('session')
		let canRecreatePractitioner: boolean = false

		if (!session)
			throw new ApiError({ code: 'UNAUTHORIZED', message: 'You Need to login first to continue.' })

		if (c.req.header('x-api-key')) {
			const result = await auth.api.verifyApiKey({
				body: {
					key: c.req.header('x-api-key') as string,
					permissions: {
						practitioner: ['recreate'],
					},
				},
			})

			canRecreatePractitioner = result.valid
		} else {
			const result = await auth.api.hasPermission({
				headers: c.req.raw.headers,
				body: {
					permissions: {
						practitioner: ['recreate'], // This must match the structure in your access control
					},
				},
			})

			canRecreatePractitioner = result.success
		}

		if (!canRecreatePractitioner) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: 'You do not have permissions to recreate practitioners.',
			})
		}

		const organization = session.session.activeOrganizationId as string
		const { id } = c.req.valid('param')

		const history = await db
			.select()
			.from(practitioner)
			.where(and(eq(practitioner.organization, organization), eq(practitioner.id, id)))

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

		const data = {
			version: (history[0].version as number) + 1,
			ts: new Date(),
			status: 'recreated' as ResourceBase['status'],
			updatedBy: session.session.userId,
		}

		const result = await db
			.update(practitioner)
			.set(data)
			.where(and(eq(practitioner.organization, organization), eq(practitioner.id, id)))
			.returning()

		if (result.length < 1)
			throw new ApiError({ code: 'NOT_FOUND', message: 'Practitioner not found.' })

		return c.json(
			{
				message: 'Practitioner recreated successfully',
			},
			200
		)
	})
