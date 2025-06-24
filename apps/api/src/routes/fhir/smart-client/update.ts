import { ApiError, openApiErrorResponses } from '@/lib/errors'
import { createRoute } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'

import { smartFhirClient } from '@repo/db'

import { AssistantSelectSchema, SmartFhirClientPatchSchema } from './types'

import type { App } from '@/lib/hono'
import type { z } from '@hono/zod-openapi'

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
export type SmartFhirClientUpdateRequest = z.infer<
	(typeof route.request.body.content)['application/json']['schema']
>
export type SmartFhirClientUpdateResponse = z.infer<
	(typeof route.responses)[201]['content']['application/json']['schema']
>

export const registerSmartFhirClientUpdate = (app: App) =>
	app.openapi(route, async (c) => {
		const { cerbos, db } = c.get('services')
		const session = c.get('session')

		if (!session)
			throw new ApiError({ code: 'UNAUTHORIZED', message: 'You Need to login first to continue.' })

		const canCreateClient = await cerbos.isAllowed({
			principal: {
				id: session.session.userId,
				roles: [session.session.activeOrganizationRole as string],
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
			updateBy: session.session.userId,
			updateAt: new Date(),
		}

		const result = await db
			.update(smartFhirClient)
			.set(data)
			.where(eq(smartFhirClient.organizationId, session.session.activeOrganizationId as string))
			.returning()

		if (result.length < 1)
			throw new ApiError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'A machine readable error when updating the smart fhir client.',
			})

		return c.json(result[0], 201)
	})
