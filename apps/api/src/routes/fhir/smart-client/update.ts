import { createRoute } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'

import { smartFhirClient } from '@repo/auth-db'

import { ApiError, openApiErrorResponses } from '../../../lib/errors/index.js'
import { AssistantSelectSchema, SmartFhirClientPatchSchema } from './types.js'

import type { z } from '@hono/zod-openapi'
import type { App } from '../../../lib/hono/index.js'

const route = createRoute({
	tags: ['FHIR'],
	operationId: 'smart-client-update',
	method: 'patch',
	path: '/fhir/smart-client',
	security: [{ cookieAuth: [] }],
	request: {
		body: {
			required: true,
			description: 'The smart fhir client to update',
			content: {
				'application/json': {
					schema: SmartFhirClientPatchSchema,
				},
			},
		},
	},
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
export type SmartFhirClientUpdateRequest = z.infer<
	(typeof route.request.body.content)['application/json']['schema']
>
export type SmartFhirClientUpdateResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerSmartFhirClientUpdate = (app: App) =>
	app.openapi(route, async (c) => {
		const { cerbos, db } = c.get('services')
		const session = c.get('session')

		if (!session)
			throw new ApiError({ code: 'UNAUTHORIZED', message: 'You Need to login first to continue.' })

		const canCreateClient = await cerbos.isAllowed({
			principal: {
				id: session.userId,
				roles: [session.activeOrganizationRole as string],
				attributes: {},
			},
			resource: {
				kind: 'SmartFhirClient',
				id: 'create',
				attributes: {},
			},
			action: 'create',
		})

		if (!canCreateClient) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: 'You do not have permissions to create a smart fhir client.',
			})
		}

		const rawData = c.req.valid('json')
		const data = {
			...rawData,
			updateBy: session.userId,
			updateAt: new Date(),
		}

		const result = await db
			.update(smartFhirClient)
			.set(data)
			.where(eq(smartFhirClient.organizationId, session.activeOrganizationId as string))
			.returning()

		if (result.length < 1)
			throw new ApiError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'A machine readable error when updating the smart fhir client.',
			})

		// Ensure redirectUri and launchToken are always strings (never null)
		const response = {
			organizationId: result[0].organizationId,
			clientId: result[0].clientId,
			scope: result[0].scope,
			iss: result[0].iss,
			redirectUri: result[0].redirectUri ?? '',
			fhirBaseUrl: result[0].fhirBaseUrl ?? '',
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
