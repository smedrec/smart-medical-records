import { createRoute, z } from '@hono/zod-openapi'

import { Infisical, InfisicalClientNotInitializedError, InfisicalError } from '@repo/infisical'

import { ApiError, openApiErrorResponses } from '../../lib/errors/index.js'

import type { InfisicalClientOptions, ProjectOptions } from '@repo/infisical'
import type { App } from '../../lib/hono/index.js'

const route = createRoute({
	tags: ['Secret'],
	operationId: 'secret-get',
	method: 'get',
	path: '/secret/{key}',
	security: [{ cookieAuth: [] }],
	request: {
		params: z.object({
			key: z.string().openapi({
				param: {
					name: 'key',
					in: 'path',
				},
				example: 'DB_URL / all to get all the keys on project',
			}),
		}),
	},
	responses: {
		200: {
			description: 'The secret value',
			content: {
				'application/json': {
					schema: z.array(
						z.object({
							key: z.string().openapi({}),
							value: z.string().openapi({}),
						})
					),
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

		const clientAuthOptions: InfisicalClientOptions = {
			siteUrl: c.env.INFISICAL_URL!, // e.g., "https://app.infisical.com"
			clientId: c.env.INFISICAL_CLIENT_ID!,
			clientSecret: c.env.INFISICAL_CLIENT_SECRET!,
		}

		const projectConfig: ProjectOptions = {
			projectId: c.env.INFISICAL_PROJECT_ID!, // Your Infisical Project ID
			environment: c.env.INFISICAL_ENVIRONMENT!, // e.g., "dev", "prod", "stg"
		}

		try {
			const infisicalClient = new Infisical(
				Infisical.WithConfig(projectConfig),
				await Infisical.init(clientAuthOptions)
			)
			const { key } = c.req.valid('param')
			if (key === 'all') {
				const keys = await infisicalClient.allSecrets()
				return c.json(keys, 200)
			}
			const value = await infisicalClient.getSecret(key)
			return c.json([{ key: key, value: value }], 200)
		} catch (error) {
			const message =
				error instanceof InfisicalError || error instanceof InfisicalClientNotInitializedError
					? error.message
					: 'An unknown error occurred'
			if (error instanceof InfisicalError) {
				throw new ApiError({ code: 'NOT_FOUND', message })
			}
			throw new ApiError({ code: 'INTERNAL_SERVER_ERROR', message })
		}

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
	})
