import { ApiError, openApiErrorResponses } from '@/lib/errors'
import { createRoute, z } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'
import { setCookie } from 'hono/cookie'

import { smartFhirClient } from '@repo/auth-db'
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

export const registerFhirLogin = (app: App) =>
	app.openapi(route, async (c) => {
		const { cerbos, db, audit } = c.get('services')
		const session = c.get('session')
		const resourceType = 'SmartFhirClient'
		const resourceId = 'smart-fhir-client'

		if (!session)
			throw new ApiError({
				code: 'UNAUTHORIZED',
				message: 'You Need to login the app first to continue.',
			})

		const principalId = session.session.userId as string
		const activeOrganizationId = session.session.activeOrganizationId as string

		const cerbosResource = { kind: resourceType, id: resourceId, attributes: {} }
		const cerbosAction = 'login'
		const roles = [session.session.activeOrganizationRole as string]
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
		})

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
		}
	})
