import { ApiError, openApiErrorResponses } from '@/lib/errors'
import { BaseResourceResponseSchema } from '@/lib/utils/responses'
import { createRoute, z } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'

import { organization, organizationHistory } from '@repo/db'

import type { App } from '@/lib/hono'
import type { ResourceBase } from '@/shared/types'
import type { Organization } from '@solarahealth/fhir-r4'

const route = createRoute({
	tags: ['Organization'],
	operationId: 'organization-update',
	method: 'post',
	path: '/fhir/r4/organization/update',
	security: [{ cookieAuth: [] }],
	request: {
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
			description: 'The updated organization',
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
export type OrganizationUpdateRequest = z.infer<
	(typeof route.request.body.content)['application/json']['schema']
>
export type OrganizationUpdateResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerOrganizationUpdate = (app: App) =>
	app.openapi(route, async (c) => {
		const { auth, db } = c.get('services')
		const session = c.get('session')
		let canUpdateOrganization: boolean = false

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
						organization: ['update'],
					},
				},
			})

			canUpdateOrganization = result.valid
		} else {
			const result = await auth.api.hasPermission({
				headers: c.req.raw.headers,
				body: {
					permissions: {
						organization: ['update'], // This must match the structure in your access control
					},
				},
			})

			canUpdateOrganization = result.success
		}

		if (!canUpdateOrganization) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: 'You do not have permissions to update practitioners.',
			})
		}

		const organizationId = session.session.activeOrganizationId as string

		const history = await db.select().from(organization).where(eq(organization.id, organizationId))

		if (history.length < 1)
			throw new ApiError({
				code: 'NOT_FOUND',
				message: 'Organization not found.',
			})

		const insertedHistory = await db.insert(organizationHistory).values(history[0]).returning({
			id: organizationHistory.id,
			resource: organizationHistory.resource,
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
			resource: resource as Organization, // Assuming resource is a JSON object
		}

		const result = await db
			.update(organization)
			.set(data)
			.where(eq(organization.id, organizationId))
			.returning()

		if (result.length < 1)
			throw new ApiError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'A machine readable error.',
			})

		return c.json(result[0], 200)
	})
