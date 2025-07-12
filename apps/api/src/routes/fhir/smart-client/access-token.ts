import { createRoute, z } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'

import { smartFhirClient } from '@repo/auth-db'
import { SmartClient } from '@repo/smart-client'

import { ApiError, openApiErrorResponses } from '../../../lib/errors/index.js'

import type { DecryptResponse } from '@repo/infisical-kms'
import type { SmartClientConfig } from '@repo/smart-client'
import type { App } from '../../../lib/hono/index.js'

const route = createRoute({
	tags: ['FHIR'],
	operationId: 'smart-client-access-token',
	method: 'get',
	path: '/fhir/smart-client/access-token',
	security: [{ cookieAuth: [] }],
	request: {},
	responses: {
		200: {
			description: 'The smart fhir client',
			content: {
				'application/json': {
					schema: z.object({
						accessToken: z.string(),
					}),
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type Route = typeof route

export type SmartFhirClientAccessTokenResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerSmartFhirClientAccessToken = (app: App) =>
	app.openapi(route, async (c) => {
		const { cerbos, db, kms } = c.get('services')
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

		const privateKey: DecryptResponse = await kms.decrypt(result[0].privateKey!)

		const config: SmartClientConfig = {
			clientId: result[0].clientId,
			iss: result[0].iss,
			scope: result[0].scope,
			privateKey: privateKey.plaintext, // Load your private key securely
			fhirBaseUrl: result[0].fhirBaseUrl!, // e.g., "https://sandbox.fhir.org/r4"
			//kid: process.env.FHIR_KID, // Optional
			// signingAlgorithm: 'ES384', // Optional
		}

		try {
			// Option 1: Discover .well-known/smart-configuration using fhirBaseUrl
			const client = await SmartClient.init(config)

			// Option 2: Provide an explicit issuer URL for .well-known/smart-configuration discovery
			// const explicitIssUrl = 'https://auth.example.com/auth/realms/myrealm';
			// const client = await SmartClient.init(config, explicitIssUrl);

			const token = await client.getAccessToken()
			return c.json({ accessToken: token as string }, 200)
		} catch (error) {
			console.error('Failed to initialize SmartClient:', error)
			// Handle initialization error (e.g., server unreachable, invalid config)
			throw error
		}
	})
