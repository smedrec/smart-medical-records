import { ApiError, openApiErrorResponses } from '@/lib/errors'
import { createRoute } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'

import { smartFhirClient } from '@repo/auth-db'

import { AssistantSelectSchema } from './types'

import type { App } from '@/lib/hono'
import type { z } from '@hono/zod-openapi'

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
				id: session.session.userId,
				roles: [session.session.activeOrganizationRole as string],
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
			.where(eq(smartFhirClient.organizationId, session.session.activeOrganizationId as string))

		if (result.length < 1)
			throw new ApiError({
				code: 'NOT_FOUND',
				message: 'The organization does not have the smart fhir client configured.',
			})

		return c.json(result[0], 200)
	})
