import { ApiError, openApiErrorResponses } from '@/lib/errors/index.js'
import { createRoute, z } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'

import { smartFhirClient } from '@repo/auth-db'

import type { App } from '@/lib/hono/index.js'

const route = createRoute({
	tags: ['FHIR'],
	operationId: 'smart-client-find',
	method: 'delete',
	path: '/fhir/smart-client',
	security: [{ cookieAuth: [] }],
	request: {},
	responses: {
		200: {
			description: 'The status msg',
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

export type SmartFhirClientDeleteResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerSmartFhirClientDelete = (app: App) =>
	app.openapi(route, async (c) => {
		const { cerbos, db } = c.get('services')
		const session = c.get('session')

		if (!session)
			throw new ApiError({ code: 'UNAUTHORIZED', message: 'You Need to login first to continue.' })

		const canDeleteClient = await cerbos.isAllowed({
			principal: {
				id: session.userId,
				roles: [session.activeOrganizationRole as string],
				attributes: {},
			},
			resource: {
				kind: 'SmartFhirClient',
				id: 'delete',
				attributes: {},
			},
			action: 'delete',
		})

		if (!canDeleteClient) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: 'You do not have permissions to delete a smart fhir client.',
			})
		}

		const result = await db
			.delete(smartFhirClient)
			.where(eq(smartFhirClient.organizationId, session.activeOrganizationId as string))
			.returning()

		if (result.length < 1)
			throw new ApiError({
				code: 'NOT_FOUND',
				message: 'The organization does not have the smart fhir client configured.',
			})

		return c.json(
			{
				message: 'Smart fhir client deleted successfully',
			},
			200
		)
	})
