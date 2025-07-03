import { createRoute, z } from '@hono/zod-openapi'

import { ApiError, openApiErrorResponses } from '../../lib/errors/index.js'
import { kms } from '../../lib/infisical/kms.js'

import type { EncryptResponse } from '@repo/infisical-kms'
import type { App } from '../../lib/hono/index.js'

const route = createRoute({
	tags: ['KMS'],
	operationId: 'kms-encrypt',
	method: 'post',
	path: '/kms/encrypt',
	security: [{ cookieAuth: [] }],
	request: {
		body: {
			required: true,
			description: 'The plaintext to encrypt',
			content: {
				'application/json': {
					schema: z.object({
						plaintext: z.string().openapi({}),
					}),
				},
			},
		},
	},
	responses: {
		200: {
			description: 'The smart fhir client',
			content: {
				'application/json': {
					schema: z.object({
						ciphertext: z.string().openapi({}),
					}),
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type Route = typeof route
export type KmsEncryptRequest = z.infer<
	(typeof route.request.body.content)['application/json']['schema']
>
export type KmsEncryptResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerKmsEncrypt = (app: App) =>
	app.openapi(route, async (c) => {
		//const { cerbos, db } = c.get('services')
		const session = c.get('session')

		if (!session)
			throw new ApiError({ code: 'UNAUTHORIZED', message: 'You Need to login first to continue.' })

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

		const data = c.req.valid('json')

		try {
			const result: EncryptResponse = await kms.encrypt(data.plaintext)
			return c.json(result, 200)
		} catch (error) {
			const message = error instanceof Error ? error.message : 'An unknown error occurred'
			throw new ApiError({ code: 'INTERNAL_SERVER_ERROR', message })
		}
	})
