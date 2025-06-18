import { ApiError, openApiErrorResponses } from '@/lib/errors'
import { ResourceParamsSchema } from '@/shared/types'
import { createRoute, z } from '@hono/zod-openapi'

import type { App } from '@/lib/hono'

const route = createRoute({
	tags: ['ResourceR4'],
	operationId: 'resource-read',
	method: 'get',
	path: '/fhir/r4/{resourceType}/{id}',
	security: [{ cookieAuth: [] }],
	request: {
		params: ResourceParamsSchema,
	},
	responses: {
		200: {
			description: 'The Resource',
			content: {
				'application/json': {
					schema: z.any(),
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type Route = typeof route
export type ResourceReadResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerResourceRead = (app: App) =>
	app.openapi(route, async (c) => {
		const { cerbos, fhir } = c.get('services')
		const session = c.get('session')
		const { resourceType, id } = c.req.valid('param')

		if (!session)
			throw new ApiError({
				code: 'UNAUTHORIZED',
				message: 'You Need to login first to continue.',
			})

		const decision = await cerbos.checkResource({
			principal: {
				id: session.session.userId,
				roles: [session.session.activeOrganizationRole as string],
				attributes: {},
			},
			resource: {
				kind: resourceType,
				id: id,
				attributes: {},
			},
			actions: ['read'],
		})

		if (!decision.isAllowed('read')) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: `You do not have permissions to read a ${resourceType}.`,
			})
		}

		const {
			data, // only present if 2XX response
			error, // only present if 4XX or 5XX response
		} = await (fhir.GET as any)(`/${resourceType}/{id}`, {
			params: {
				path: { id: id },
			},
		})

		if (data) return c.json(data, 200)

		throw new ApiError({
			code: 'INTERNAL_SERVER_ERROR',
			message: `An error occurred while fetching the practitioner. ${error instanceof Error ? error.message : 'Unknown error'}`,
		})
	})
