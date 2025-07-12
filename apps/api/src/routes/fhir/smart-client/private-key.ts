import { createRoute } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'

import { smartFhirClient } from '@repo/auth-db'

import { ApiError, openApiErrorResponses } from '../../../lib/errors/index.js'
import { AssistantSelectSchema, PrivateKeySchema } from './types.js'

import type { App } from '@/lib/hono/index.js'
import type { z } from '@hono/zod-openapi'
import type { EncryptResponse } from '@repo/infisical-kms'

const route = createRoute({
	tags: ['FHIR'],
	operationId: 'smart-client-private-key-jwt',
	method: 'post',
	path: '/fhir/smart-client/private-key-jwt',
	security: [{ cookieAuth: [] }],
	request: {
		body: {
			required: true,
			description: 'The smart fhir client private key JWT json',
			content: {
				'application/json': {
					schema: PrivateKeySchema,
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
export type SmartFhirClientPrivateKeyJWTRequest = z.infer<
	(typeof route.request.body.content)['application/json']['schema']
>
export type SmartFhirClientPrivateKeyJWTResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerSmartFhirClientPrivateKeyJWT = (app: App) =>
	app.openapi(route, async (c) => {
		const { cerbos, db, kms } = c.get('services')
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

		const plaintext = JSON.stringify(rawData.privateKey, null, 2)
		const encrypt: EncryptResponse = await kms.encrypt(plaintext)

		const data = {
			privateKey: encrypt.ciphertext,
			updatedBy: session.userId,
			updatedAt: new Date(),
		}

		const result = await db.auth
			.update(smartFhirClient)
			.set(data)
			.where(eq(smartFhirClient.organizationId, session.activeOrganizationId as string))
			.returning()

		if (result.length < 1)
			throw new ApiError({ code: 'INTERNAL_SERVER_ERROR', message: 'A machine readable error.' })

		const response = {
			organizationId: result[0].organizationId,
			clientId: result[0].clientId,
			scope: result[0].scope,
			iss: result[0].iss,
			fhirBaseUrl: result[0].fhirBaseUrl ?? '',
			provider: result[0].provider as 'demo' | 'azure' | 'aws' | 'gcp',
			environment: result[0].environment as 'development' | 'production',
			createdBy: result[0].createdBy ?? undefined,
			createdAt: result[0].createdAt ?? undefined,
			updatedBy: result[0].updatedBy ?? undefined,
			updatedAt: result[0].updatedAt ?? undefined,
		}

		return c.json(response, 200)
	})
