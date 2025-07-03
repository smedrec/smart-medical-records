import { createRoute } from '@hono/zod-openapi'

import { smartFhirClient } from '@repo/auth-db'

import { ApiError, openApiErrorResponses } from '../../../lib/errors/index.js'
import { AssistantSelectSchema, SmartFhirClientInsertSchema } from './types.js'

import type { App } from '@/lib/hono/index.js'
import type { z } from '@hono/zod-openapi'

const route = createRoute({
	tags: ['FHIR'],
	operationId: 'smart-client-create',
	method: 'post',
	path: '/fhir/smart-client',
	security: [{ cookieAuth: [] }],
	request: {
		body: {
			required: true,
			description: 'The smart fhir client to create',
			content: {
				'application/json': {
					schema: SmartFhirClientInsertSchema,
				},
			},
		},
	},
	responses: {
		201: {
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
export type SmartFhirClientCreateRequest = z.infer<
	(typeof route.request.body.content)['application/json']['schema']
>
export type SmartFhirClientCreateResponse = z.infer<
	(typeof route.responses)[201]['content']['application/json']['schema']
>

export const registerSmartFhirClientCreate = (app: App) =>
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
			organizationId: session.activeOrganizationId as string,
			createdBy: session.userId,
		}

		const result = await db.insert(smartFhirClient).values(data).returning()

		if (result.length < 1)
			throw new ApiError({ code: 'INTERNAL_SERVER_ERROR', message: 'A machine readable error.' })

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
			createdBy: result[0].createdBy ?? undefined,
			createdAt: result[0].createdAt ?? undefined,
		}

		return c.json(response, 201)
	})
