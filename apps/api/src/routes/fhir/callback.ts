import { createRoute, z } from '@hono/zod-openapi'

//import { eq } from 'drizzle-orm'
//import { deleteCookie, getCookie, setCookie } from 'hono/cookie'

import { SmartClient } from '@repo/smart-client'

import { ApiError, openApiErrorResponses } from '../../lib/errors/index.js'

import type { RefreshTokenResponse, TokenResponse } from '@repo/smart-client'
/**import { smartFhirClient } from '@repo/auth-db'
import {
	defaultCookieOptions,
	FHIR_AUTH_STATE_COOKIE,
	FHIR_PKCE_VERIFIER_COOKIE,
	FHIR_SESSION_COOKIE,
	getSmartFhirAccessToken,
} from '@repo/fhir'*/

import type { App } from '../../lib/hono/index.js'

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
					schema: z.object({
						access_token: z.string(),
						refresh_token: z.string().optional(),
						expires_in: z.number(),
						token_type: z.string(),
						scope: z.string(),
					}),
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
		const codeFromCallback = c.req.query('code')
		const stateFromCallback = c.req.query('state')
		console.log(`CODE: ${codeFromCallback} STATE: ${stateFromCallback}`)

		const smartClient = new SmartClient({
			clientId:
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwdWJfa2V5IjoiLS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS1cbk1JSUNJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBZzhBTUlJQ0NnS0NBZ0VBdHd4b0RHZU5wZjFnM0ZKbDIwUFZcbkxYWVpLNm84eGV1RjN3SzM0V2ZKUGZWc2U4YUhrOHZCdkVoSUpJb3JqSEppR1Yzd0M3NWV4RFhORHJZOU01cCtcbmhnWndzRng2NmFhMWhhZHg1TUFVUVQ0cjRrTVRYcXJRNFlCZFZzZ29MMGVLWDNDamlkM0I2cC80RlBrZ3l3OXdcblo2TnZWamQwYXB3MjI4VDNxUUNCcEd0TWJEc2k4SVJiT05SU1FDVUpENDNSS1FJc2JNTEhsa081T1l6QkVHN1FcbktCU1UvL0VlRlpSVmczaDhNMVRvYnZjZGQ2T1lweEliclVzRDBvT0NLT1J0dWs2cHJ4OG1aekhxTFJkUnM0ejJcbkVSY3cvZW95VTRaOG0zUGsyZi9RNjNyK0VUSGh3TkNrR29nOXBTSTlQNUhlSmprQXZ5T2o1Vmx1Sk9aVDJpNllcbjFBQlR5eEQ2S3ZtUDdaYmtYMkRHL09TSjdHNEtEV2ZZZldxencrYmhTT0Vsc05hMVprVkJ3Q3oxYy9FK21zVGpcbmRNWGRNcFZFRWY0bW8xbDVaU1JCS3dTdVhESVlUUThTSmhLcnFVYmVNWUQ1ZmhXdHNEUDFtTDJKZEY3SGdybEpcbmsxYm9hejF4Y2hMa2p4VGF2SzVKaU9HbTdzaDBpa3BvaDFGYmROVHU0TFJMU01sYzMwSW1GbGJsU0czVTRtZzNcbkNYMUppYmF5Um9LSFY0RGk0UXpUSDVBeUxzQy9tc2owVzZrTkt3ZmZqT2hqNkNVbEttS3FIcFlzdkIwd3owRUJcbmU2MmhmV21VNlo0NmFUcTlmcEhlOUdmT010Wk5RZjU4UjJJTGJRNWlvZnd6VzJUdW1rcnNLUXY3U1NQaXBuZkZcbkVQVUtycUVhMVFNejl3cXFZZE5TdjRVQ0F3RUFBUT09XG4tLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0iLCJpc3MiOiJodHRwczovL2hhcGkudGVhY2hob3d0b2Zpc2gub3JnL2ZoaXIiLCJhY2Nlc3NUb2tlbnNFeHBpcmVJbiI6MTUsImlhdCI6MTc1MTQ3Mzk4Mn0.bkqaqgh8t4RyR1PKFaie_I8OwsXV5XpZxR_DqOwUHMA',
			//clientSecret: 'my-client-secret', // optional
			redirectUri: 'http://localhost:8801/fhir/callback',
			authUrl: 'https://launcher.teachhowtofish.org/v/r4/auth/authorize',
			tokenUrl: 'https://launcher.teachhowtofish.org/v/r4/auth/token',
		})

		try {
			const { code } = smartClient.handleAuthorizationResponse({
				code: c.req.query('code'),
				state: c.req.query('state'),
			})

			// 4. Exchange the authorization code for an access token
			const tokenResponse: TokenResponse = await smartClient.exchangeCodeForToken(code)

			console.log('Access Token:', tokenResponse.access_token)
			console.log('Refresh Token:', tokenResponse.refresh_token)
			console.log('Expires In:', tokenResponse.expires_in)

			// 5. Refresh the access token (when it expires)
			if (tokenResponse.refresh_token) {
				const refreshedToken: RefreshTokenResponse = await smartClient.refreshAccessToken(
					tokenResponse.refresh_token
				)
				console.log('Refreshed Access Token:', refreshedToken.access_token)
				return c.json(refreshedToken, 200)
			}
			return c.json(tokenResponse, 200)
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error'
			throw new ApiError({ code: 'UNAUTHORIZED', message: errorMessage })
		}

		/**const { db } = c.get('services')
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
			/** Test with node-fetch Request, also not working
			const url = new URL(c.req.url)
			url.pathname = '/fhir/callback'
			url.search = `?code=${code}&state=${stateFromCallback}`

			const headers = new Headers()
			for (const [key, value] of Object.entries(c.req.header())) {
				if (value !== undefined) headers.set(key, value)
			}

			const request = new Request(url.toString(), {
				method: c.req.method,
				headers,
				// body: ... // Only if needed
			})
			
			console.log(`REQUEST: ${request.method} ${raw.url}`)
			for (const [key, value] of request.headers.entries()) {
				console.log(`  ${key}: ${value}`)
			}*/ /**
			const accessToken = await getSmartFhirAccessToken({
				request: c.req.raw, // Pass the raw Request object
				clientId: smartFhirClientConfig[0].clientId,
				scope: smartFhirClientConfig[0].scope,
				iss: smartFhirClientConfig[0].iss,
				pkceCodeVerifier,
				expectedState,
				// `code` and `state` are parsed from request by createSmartFhirClient
			})

			console.log('c.req.raw type:', typeof c.req.raw)
			console.log(
				'c.req.raw keys:',
				c.req.raw ? Object.keys(c.req.raw) : 'c.req.raw is null/undefined'
			)
			console.log('c.req.url:', c.req.url) // Hono's parsed UR

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

			//if (smartFhirClientConfig[0].environment === 'development') {
			return c.json(
				{
					sessionData,
					accessToken: accessToken,
				},
				200
			)
			//}
			//return c.redirect(smartFhirClientConfig[0].redirectUri as string) // Redirect to a protected area or dashboard
		} catch (error: any) {
			console.error('FHIR Callback failed:', error.message, error.stack)
			throw new ApiError({
				code: 'INTERNAL_SERVER_ERROR',
				message: `FHIR callback processing failed: ${error.message}`,
			})
		}*/
	})
