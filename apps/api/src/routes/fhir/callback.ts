import { ApiError, openApiErrorResponses } from '@/lib/errors'
import { createRoute, z } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'

import { smartFhirClient } from '@repo/db'
import {
	createSmartFhirClient,
	defaultCookieOptions,
	FHIR_AUTH_STATE_COOKIE,
	FHIR_PKCE_VERIFIER_COOKIE,
	FHIR_SESSION_COOKIE,
} from '@repo/fhir'

import type { App } from '@/lib/hono'

const route = createRoute({
	tags: ['FHIR'],
	operationId: 'fhir-callback',
	method: 'get',
	path: '/fhir/callback',
	security: [{ cookieAuth: [] }],
	request: {
		query: z.object({
			code: z.string().openapi({
				description: 'The code from callback',
			}),
			state: z.string().openapi({
				description: 'The state from callback',
			}),
		}),
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
export type FhirCallbackResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerFhirCallback = (app: App) =>
	app.openapi(route, async (c) => {
		const { cerbos, db } = c.get('services')
		const session = c.get('session')

		if (!session)
			throw new ApiError({
				code: 'UNAUTHORIZED',
				message: 'You Need to login the app first to continue.',
			})

		const activeOrganizationId = session.session.activeOrganizationId as string

		const code = c.req.query('code')
		const stateFromCallback = c.req.query('state')

		const pkceCodeVerifier = getCookie(c, FHIR_PKCE_VERIFIER_COOKIE)
		const expectedState = getCookie(c, FHIR_AUTH_STATE_COOKIE)

		deleteCookie(c, FHIR_PKCE_VERIFIER_COOKIE, { path: defaultCookieOptions.path })
		deleteCookie(c, FHIR_AUTH_STATE_COOKIE, { path: defaultCookieOptions.path })

		if (!code || !stateFromCallback) {
			throw new ApiError({
				code: 'BAD_REQUEST',
				message: 'Missing code or state from callback.',
			})
		}
		if (!pkceCodeVerifier) {
			throw new ApiError({
				code: 'BAD_REQUEST',
				message: 'Missing PKCE verifier cookie.',
			})
		}
		if (!expectedState) {
			throw new ApiError({
				code: 'BAD_REQUEST',
				message: 'Missing state cookie.',
			})
		}

		const smartFhirClientConfig = await db
			.select()
			.from(smartFhirClient)
			.where(eq(smartFhirClient.organizationId, activeOrganizationId))

		if (smartFhirClientConfig.length < 1)
			throw new ApiError({
				code: 'NOT_FOUND',
				message: 'Smart Fhir Client not found.',
			})

		try {
			// createSmartFhirClient will validate stateFromCallback against expectedState internally
			const fhirClient = await createSmartFhirClient({
				request: c.req.raw, // Pass the raw Request object
				env: {
					clientId: smartFhirClientConfig[0].clientId,
					scope: smartFhirClientConfig[0].scope,
					iss: smartFhirClientConfig[0].iss,
				},
				pkceCodeVerifier,
				expectedState,
				// `code` and `state` are parsed from request by createSmartFhirClient
			})

			// @ts-ignore TODO: fhirclient.Client type doesn't directly expose 'state' in this way. Need to check actual structure.
			const clientState = fhirClient.state as {
				tokenResponse: any
				serverUrl: string
				idToken?: any
			}

			if (!clientState.tokenResponse || !clientState.tokenResponse.access_token) {
				throw new ApiError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Failed to obtain access token from FHIR client.',
				})
			}

			const sessionData = {
				tokenResponse: clientState.tokenResponse,
				serverUrl: clientState.serverUrl,
				userId: session.session.userId,
				roles: [session.session.activeOrganizationRole],
			}

			const cookieExpiry = clientState.tokenResponse.expires_in
				? new Date(Date.now() + clientState.tokenResponse.expires_in * 1000)
				: new Date(Date.now() + 3600 * 1000) // Default to 1 hour if no expires_in

			setCookie(c, FHIR_SESSION_COOKIE, JSON.stringify(sessionData), {
				...defaultCookieOptions,
				expires: cookieExpiry,
			})

			return c.redirect(smartFhirClientConfig[0].redirectUri as string) // Redirect to a protected area or dashboard
		} catch (error: any) {
			console.error('FHIR Callback failed:', error.message, error.stack)
			throw new ApiError({
				code: 'INTERNAL_SERVER_ERROR',
				message: `FHIR callback processing failed: ${error.message}`,
			})
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
