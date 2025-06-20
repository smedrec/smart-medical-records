import { getCookie } from 'hono/cookie'
import createClient from 'openapi-fetch' // Direct import for lightweight client

import type { MiddlewareHandler } from 'hono'
import type {
	Client as OpenApiFetchClient,
	Middleware as OpenApiFetchMiddleware,
} from 'openapi-fetch'

// TODO: Share this constant with worker.ts (e.g., from a shared constants file)
const FHIR_SESSION_COOKIE = 'fhir_session'

export interface FhirSessionData {
	tokenResponse: {
		access_token?: string
		id_token?: string // Often contains user identity info
		[key: string]: any // Other token response fields like expires_in, refresh_token
	}
	serverUrl: string
	userId?: string // Added for Cerbos Principal ID
	roles?: string[] // Added for Cerbos Principal roles
}

// Define the shape of the fhirClient in the context if needed, for now using OpenApiFetchClient<any>
// This could be typed more specifically if your paths.d.ts from @repo/fhir is accessible
// and relevant for a generic API client.
export type FhirApiClient = OpenApiFetchClient<any>

// Extend Hono's context type if you want typed access c.get('fhirClient')
// declare module 'hono' {
//   interface ContextVariableMap {
//     fhirClient?: FhirApiClient | null;
//     fhirSessionData?: FhirSessionData | null;
//   }
// }

export const fhirAuthMiddleware: MiddlewareHandler = async (c, next) => {
	const sessionCookie = getCookie(c, FHIR_SESSION_COOKIE)

	if (sessionCookie) {
		try {
			const sessionData = JSON.parse(sessionCookie) as FhirSessionData

			if (sessionData && sessionData.tokenResponse?.access_token && sessionData.serverUrl) {
				// Set raw session data in context for potential use (e.g. refresh logic later)
				c.set('fhirSessionData', sessionData)

				// Create a lightweight openapi-fetch client instance
				const fhirApiClient = createClient({ baseUrl: sessionData.serverUrl })

				const authHeaderMiddleware: OpenApiFetchMiddleware = {
					onRequest(req) {
						req.request.headers.set(
							'Authorization',
							`Bearer ${sessionData.tokenResponse.access_token}`
						)
					},
					// Optional: Add basic onResponse/onError for this client if needed
					// async onResponse(res) { return res; },
					// async onError(err) { throw err; },
				}
				fhirApiClient.use(authHeaderMiddleware)

				c.set('fhirClient', fhirApiClient as FhirApiClient)
			} else {
				c.set('fhirSessionData', null)
				c.set('fhirClient', null)
			}
		} catch (error) {
			console.error('Failed to parse FHIR session cookie:', error)
			c.set('fhirSessionData', null)
			c.set('fhirClient', null)
		}
	} else {
		c.set('fhirSessionData', null)
		c.set('fhirClient', null)
	}

	await next()
}
