import { createRoute, z } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'
import { setCookie } from 'hono/cookie'

import { SmartClient } from '@repo/smart-client'

import { ApiError, openApiErrorResponses } from '../../lib/errors/index.js'

/**import { smartFhirClient } from '@repo/auth-db'
import {
	authorizeSmartClient,
	defaultCookieOptions,
	FHIR_AUTH_STATE_COOKIE,
	FHIR_PKCE_VERIFIER_COOKIE,
} from '@repo/fhir'*/

import type { App } from '../../lib/hono/index.js'

const route = createRoute({
	tags: ['FHIR'],
	operationId: 'fhir-authorize',
	method: 'post',
	path: '/fhir/authorize',
	security: [{ cookieAuth: [] }],
	request: {
		body: {
			required: true,
			description: 'The scope',
			content: {
				'application/json': {
					schema: z.object({
						scope: z.string(),
					}),
				},
			},
		},
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
export type FhirAuthorizeCreateRequest = z.infer<
	(typeof route.request.body.content)['application/json']['schema']
>
export type FhirAuthorizeResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerFhirAuthorize = (app: App) =>
	app.openapi(route, async (c) => {
		const data = c.req.valid('json')
		// 1. Initialize the SmartClient
		const smartClient = new SmartClient({
			clientId:
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwdWJfa2V5IjoiLS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS1cbk1JSUNJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBZzhBTUlJQ0NnS0NBZ0VBdHd4b0RHZU5wZjFnM0ZKbDIwUFZcbkxYWVpLNm84eGV1RjN3SzM0V2ZKUGZWc2U4YUhrOHZCdkVoSUpJb3JqSEppR1Yzd0M3NWV4RFhORHJZOU01cCtcbmhnWndzRng2NmFhMWhhZHg1TUFVUVQ0cjRrTVRYcXJRNFlCZFZzZ29MMGVLWDNDamlkM0I2cC80RlBrZ3l3OXdcblo2TnZWamQwYXB3MjI4VDNxUUNCcEd0TWJEc2k4SVJiT05SU1FDVUpENDNSS1FJc2JNTEhsa081T1l6QkVHN1FcbktCU1UvL0VlRlpSVmczaDhNMVRvYnZjZGQ2T1lweEliclVzRDBvT0NLT1J0dWs2cHJ4OG1aekhxTFJkUnM0ejJcbkVSY3cvZW95VTRaOG0zUGsyZi9RNjNyK0VUSGh3TkNrR29nOXBTSTlQNUhlSmprQXZ5T2o1Vmx1Sk9aVDJpNllcbjFBQlR5eEQ2S3ZtUDdaYmtYMkRHL09TSjdHNEtEV2ZZZldxencrYmhTT0Vsc05hMVprVkJ3Q3oxYy9FK21zVGpcbmRNWGRNcFZFRWY0bW8xbDVaU1JCS3dTdVhESVlUUThTSmhLcnFVYmVNWUQ1ZmhXdHNEUDFtTDJKZEY3SGdybEpcbmsxYm9hejF4Y2hMa2p4VGF2SzVKaU9HbTdzaDBpa3BvaDFGYmROVHU0TFJMU01sYzMwSW1GbGJsU0czVTRtZzNcbkNYMUppYmF5Um9LSFY0RGk0UXpUSDVBeUxzQy9tc2owVzZrTkt3ZmZqT2hqNkNVbEttS3FIcFlzdkIwd3owRUJcbmU2MmhmV21VNlo0NmFUcTlmcEhlOUdmT010Wk5RZjU4UjJJTGJRNWlvZnd6VzJUdW1rcnNLUXY3U1NQaXBuZkZcbkVQVUtycUVhMVFNejl3cXFZZE5TdjRVQ0F3RUFBUT09XG4tLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0iLCJpc3MiOiJodHRwczovL2hhcGkudGVhY2hob3d0b2Zpc2gub3JnL2ZoaXIiLCJhY2Nlc3NUb2tlbnNFeHBpcmVJbiI6MTUsImlhdCI6MTc1MTQ3Mzk4Mn0.bkqaqgh8t4RyR1PKFaie_I8OwsXV5XpZxR_DqOwUHMA',
			//clientSecret: 'my-client-secret', // optional
			redirectUri: 'http://localhost:8801/fhir/callback',
			authUrl: 'https://launcher.teachhowtofish.org/v/r4/auth/authorize',
			tokenUrl: 'https://launcher.teachhowtofish.org/v/r4/auth/token',
		})

		try {
			const token = await smartClient.getBackendToken(data.scope)
			return c.json(token, 200)
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error'
			throw new ApiError({ code: 'UNAUTHORIZED', message: errorMessage })
		}

		/**
		// 2. Get the authorization URL
		const authUrl = smartClient.getAuthorizationUrl({
			scope: 'openid fhirUser launch/patient patient/*.read',
			//state: 'my-state', // optional
			aud: 'https://launcher.teachhowtofish.org/v/r4/fhir', // optional
		})
		const insureAuthorizeUrl = authUrl.replaceAll('https', 'http')
		c.res.headers.set('Location', insureAuthorizeUrl)
		return c.text(insureAuthorizeUrl, 302)*/

		/**
		const { cerbos, db, audit } = c.get('services')
		const session = c.get('session')
		const resourceType = 'SmartFhirClient'
		const resourceId = 'openid fhirUser launch/patient patient/*.read'

		if (!session)
			throw new ApiError({
				code: 'UNAUTHORIZED',
				message: 'You Need to login the app first to continue.',
			})

		const principalId = session.userId as string
		const activeOrganizationId = session.activeOrganizationId as string */

		/**const cerbosResource = { kind: resourceType, id: resourceId, attributes: {} }
		const cerbosAction = 'FhirAuthorize'
		const roles = [session.activeOrganizationRole as string]
		const principal = { id: principalId, roles }

		const allowed = await cerbos.isAllowed({
			principal,
			resource: cerbosResource,
			action: cerbosAction,
		})

		if (!allowed) {
			const outcomeDescription = `Forbidden: User ${principalId} with roles [${roles.join(', ')}] not authorized to perform '${cerbosAction}' on ${cerbosResource.kind}/${cerbosResource.id}.`
			await audit.log({
				principalId,
				organizationId: activeOrganizationId,
				action: `cerbos:${cerbosAction}`,
				targetResourceType: resourceType,
				targetResourceId: resourceId,
				status: 'failure',
				outcomeDescription,
			})
			throw new ApiError({
				code: 'UNAUTHORIZED',
				message: outcomeDescription,
			})
		}
		await audit.log({
			principalId,
			organizationId: activeOrganizationId,
			action: `cerbos:${cerbosAction}`,
			targetResourceType: resourceType,
			targetResourceId: resourceId,
			status: 'success',
			outcomeDescription: 'Authorization granted by Cerbos.',
		})*/

		/**const smartFhirClientConfig = await db
			.select()
			.from(smartFhirClient)
			.where(eq(smartFhirClient.organizationId, activeOrganizationId))*/

		/**if (smartFhirClientConfig.length < 1)
			throw new ApiError({
				code: 'NOT_FOUND',
				message: 'Smart Fhir Client not found.',
			})

		const redirectUri = new URL(c.req.url).origin + '/fhir/callback' // Ensure this matches SMART_REDIRECT_URI if that's fixed
		try {
			const { authorizeUrl, codeVerifier, stateValue } = await authorizeSmartClient({
				clientId: smartFhirClientConfig[0].clientId,
				scope: smartFhirClientConfig[0].scope,
				iss: smartFhirClientConfig[0].iss,
				redirectUri,
				// Scope might be in env (SMART_SCOPE) or passed explicitly if needed
			})

			setCookie(c, FHIR_PKCE_VERIFIER_COOKIE, codeVerifier, defaultCookieOptions)
			setCookie(c, FHIR_AUTH_STATE_COOKIE, stateValue, defaultCookieOptions)

			if (smartFhirClientConfig[0].environment === 'development') {
				const insureAuthorizeUrl = authorizeUrl.replaceAll('https', 'http')
				return c.redirect(insureAuthorizeUrl)
			}

			return c.redirect(authorizeUrl)
		} catch (error: any) {
			console.error('Login failed:', error.message)
			return c.json({ error: 'FHIR Login initiation failed', details: error.message }, 500)
		}*/
	})
