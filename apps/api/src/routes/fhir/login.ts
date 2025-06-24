import { ApiError, openApiErrorResponses } from '@/lib/errors'
import { createRoute, z } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'
import { setCookie } from 'hono/cookie'

import { smartFhirClient } from '@repo/db'
import {
	authorizeSmartClient,
	defaultCookieOptions,
	FHIR_AUTH_STATE_COOKIE,
	FHIR_PKCE_VERIFIER_COOKIE,
} from '@repo/fhir'

import type { App } from '@/lib/hono'

const route = createRoute({
	tags: ['FHIR'],
	operationId: 'fhir-login',
	method: 'post',
	path: '/fhir/login',
	security: [{ cookieAuth: [] }],
	request: {},
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
export type FhirLoginResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerResourceReadHistory = (app: App) =>
	app.openapi(route, async (c) => {
		const { cerbos, db } = c.get('services')
		const session = c.get('session')

		if (!session)
			throw new ApiError({
				code: 'UNAUTHORIZED',
				message: 'You Need to login the app first to continue.',
			})

		const activeOrganizationId = session.session.activeOrganizationId as string

		const smartFhirClientConfig = await db
			.select()
			.from(smartFhirClient)
			.where(eq(smartFhirClient.organizationId, activeOrganizationId))

		if (smartFhirClientConfig.length < 1)
			throw new ApiError({
				code: 'NOT_FOUND',
				message: 'Smart Fhir Client not found.',
			})

		const redirectUri = new URL(c.req.url).origin + '/fhir/callback' // Ensure this matches SMART_REDIRECT_URI if that's fixed
		try {
			const { authorizeUrl, codeVerifier, stateValue } = await authorizeSmartClient({
				env: {
					clientId: smartFhirClientConfig[0].clientId,
					scope: smartFhirClientConfig[0].scope,
					iss: smartFhirClientConfig[0].iss,
				}, // Pass the worker env containing SMART_CLIENT_ID etc.
				redirectUri,
				// Scope might be in env (SMART_SCOPE) or passed explicitly if needed
			})

			setCookie(c, FHIR_PKCE_VERIFIER_COOKIE, codeVerifier, defaultCookieOptions)
			setCookie(c, FHIR_AUTH_STATE_COOKIE, stateValue, defaultCookieOptions)

			return c.redirect(authorizeUrl)
		} catch (error: any) {
			console.error('Login failed:', error.message)
			return c.json({ error: 'FHIR Login initiation failed', details: error.message }, 500)
		}

		/**const decision = await cerbos.checkResource({
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
		}*/
	})
