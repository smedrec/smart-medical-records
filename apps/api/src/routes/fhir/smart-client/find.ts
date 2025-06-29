import { createRoute } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'

import { smartFhirClient } from '@repo/auth-db'

import { ApiError, openApiErrorResponses } from '../../../lib/errors/index.js'
import { AssistantSelectSchema } from './types.js'

import type { z } from '@hono/zod-openapi'
import type { App } from '../../../lib/hono/index.js'

const route = createRoute({
	tags: ['FHIR'],
	operationId: 'smart-client-find',
	method: 'get',
	path: '/fhir/smart-client',
	security: [{ cookieAuth: [] }],
	request: {},
	responses: {
		200: {
			description: 'The smart fhir client',
			content: {
				'application/json': {
					schema: AssistantSelectSchema,
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type Route = typeof route

export type SmartFhirClientFindResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerSmartFhirClientFind = (app: App) =>
	app.openapi(route, async (c) => {
		const { cerbos, db } = c.get('services')
		const session = c.get('session')

		if (!session)
			throw new ApiError({ code: 'UNAUTHORIZED', message: 'You Need to login first to continue.' })

		const canReadClient = await cerbos.isAllowed({
			principal: {
				id: session.userId,
				roles: [session.activeOrganizationRole as string],
				attributes: {},
			},
			resource: {
				kind: 'SmartFhirClient',
				id: 'read',
				attributes: {},
			},
			action: 'read',
		})

		if (!canReadClient) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: 'You do not have permissions to read a smart fhir client.',
			})
		}

		const result = await db
			.select()
			.from(smartFhirClient)
			.where(eq(smartFhirClient.organizationId, session.activeOrganizationId as string))

		if (result.length < 1)
			throw new ApiError({
				code: 'NOT_FOUND',
				message: 'The organization does not have the smart fhir client configured.',
			})

		// Ensure the response matches the OpenAPI schema types
		const response = {
			...result[0],
			redirectUri: result[0].redirectUri ?? '',
			launchToken: result[0].launchToken ?? '',
			provider: result[0].provider as 'demo' | 'azure' | 'aws' | 'gcp',
			environment: result[0].environment as 'development' | 'production',
			updatedBy: result[0].updatedBy ?? undefined,
			updatedAt: result[0].updatedAt
				? typeof result[0].updatedAt === 'string'
					? result[0].updatedAt
					: result[0].updatedAt.toISOString()
				: undefined,
			createdAt: result[0].createdAt
				? typeof result[0].createdAt === 'string'
					? result[0].createdAt
					: result[0].createdAt.toISOString()
				: undefined,
		}

		return c.json(response, 200)
	})
