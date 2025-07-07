import { createRoute, z } from '@hono/zod-openapi'

import { ApiError, openApiErrorResponses } from '../../lib/errors/index.js'
import { initializeInfisicalClient } from '../../lib/infisical/client.js'

import type { App } from '../../lib/hono/index.js'

const route = createRoute({
	tags: ['Secret'],
	operationId: 'secret-get',
	method: 'get',
	path: '/secret',
	security: [{ cookieAuth: [] }],
	request: {
		params: z.object({
			key: z.string().openapi({}),
		}),
	},
	responses: {
		200: {
			description: 'The smart fhir client',
			content: {
				'application/json': {
					schema: z.object({
						value: z.string().openapi({}),
					}),
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type Route = typeof route

export type SecretGetResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerSecretGet = (app: App) =>
	app.openapi(route, async (c) => {
		const session = c.get('session')

		if (!session)
			throw new ApiError({ code: 'UNAUTHORIZED', message: 'You Need to login first to continue.' })

		const infisical = await initializeInfisicalClient()
		/**const canCreateClient = await cerbos.isAllowed({
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
    }*/

		const { key } = c.req.valid('param')

		try {
			const value = await infisical.getSecret(key)
			return c.json({ value: value }, 200)
		} catch (error) {
			const message = error instanceof Error ? error.message : 'An unknown error occurred'
			throw new ApiError({ code: 'INTERNAL_SERVER_ERROR', message })
		}
	})
