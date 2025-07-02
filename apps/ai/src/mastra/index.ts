import 'dotenv/config'

import { getAuditInstance, initializeAudit } from '@/audit'
import { getAuthInstance, initializeAuth } from '@/auth'
import { getCerbosInstance, initializeCerbos } from '@/cerbos'
import { getDbInstance, initializeDb } from '@/db'
import { allAuthWorkflows } from '@/mastra/workflows/auth'
import { registerCopilotKit } from '@mastra/agui'
import { Mastra } from '@mastra/core/mastra'
import { registerApiRoute } from '@mastra/core/server'
import { PinoLogger } from '@mastra/loggers'
import createClient from 'openapi-fetch'

import { assistantAgent } from './agents/assistant-agent'
import { patientReportAgent } from './agents/patient-report-agent'
import { fhirMCPServer } from './mcp'
import { pgStorage, pgVector } from './stores/pgvector'

import type { paths } from '@/fhir/r4'
import type { FhirApiClient, FhirSessionData } from '@/hono/middleware/fhir-auth'
import type { OtelConfig } from '@mastra/core'
import type { Session, User } from '@repo/auth'

// FIXME The traces does not working
const otelConfig: OtelConfig = {
	serviceName: 'smedrec-ai-dev',
	enabled: true,
	tracerName: 'mastra',
	sampling: {
		type: 'ratio',
		probability: 0.5,
	},
	export: {
		type: 'otlp',
		protocol: 'grpc',
		endpoint: 'http://joseantcordeiro.hopto.org:4318',
		headers: {
			//Authorization: "Bearer YOUR_TOKEN_HERE",
		},
	},
}

initializeAuth()
initializeCerbos()
initializeAudit()
initializeDb()

const mastra: Mastra = new Mastra({
	server: {
		cors: {
			origin: '*',
			allowMethods: ['*'],
			allowHeaders: ['*'],
		},
		middleware: [
			{
				handler: async (c, next) => {
					const auth = getAuthInstance()
					const rawSession = await auth.api.getSession({ headers: c.req.raw.headers })

					if (!rawSession) {
						return new Response('Unauthorized', { status: 401 })
					}

					// Ensure all required Session fields are present
					const session: { session: Session; user: User } = {
						session: {
							...rawSession.session,
							smartClientAccessToken: (rawSession.session as any).smartClientAccessToken ?? null,
							activeOrganizationId: (rawSession.session as any).activeOrganizationId ?? null,
							activeOrganizationRole: (rawSession.session as any).activeOrganizationRole ?? null,
						},
						user: {
							...rawSession.user,
							role: (rawSession.user as any).role ?? null,
							banned: (rawSession.user as any).banned ?? null,
							lang: (rawSession.user as any).lang ?? null,
						},
					}

					//console.log(`SESSION: ${JSON.stringify(session, null, 2)}`)
					const cerbos = getCerbosInstance()
					const audit = getAuditInstance()
					const db = getDbInstance()

					const sessionData: FhirSessionData = {
						tokenResponse: {},
						serverUrl: 'https://hapi.teachhowtofish.org/fhir/',
						userId: session.session.userId, // Added for Cerbos Principal ID
						user: session.user,
						// TODO uniformize the types with the session
						roles: [session.session.activeOrganizationRole as string],
						activeOrganizationId: session.session.activeOrganizationId as string,
					}
					const fhirApiClient: FhirApiClient = createClient<paths>({
						baseUrl: sessionData.serverUrl,
					})
					const runtimeContext = c.get('runtimeContext')
					runtimeContext.set('cerbos', cerbos)
					runtimeContext.set('audit', audit)
					runtimeContext.set('db', db)
					runtimeContext.set('fhirSessionData', sessionData)
					runtimeContext.set('fhirClient', fhirApiClient)
					await next()
				},
				path: '/api/*',
			},

			async (c, next) => {
				const start = Date.now()

				await next()
				const duration = Date.now() - start
				console.log(
					`${c.req.method} ${c.req.url} - ${duration}ms - Request: ${JSON.stringify(c.req.raw)}}`
				)
			},
		],
		apiRoutes: [
			registerApiRoute('/fhir/callback', {
				method: 'GET',
				handler: async (c) => {
					const code = c.req.query('code')
					const state = c.req.query('state')

					try {
						const { code } = smartClient.handleAuthorizationResponse({ code, state })

						// Exchange the authorization code for an access token
						const tokenResponse = await smartClient.exchangeCodeForToken(code)

						console.log('Access Token:', tokenResponse.access_token)
						console.log('Refresh Token:', tokenResponse.refresh_token)
						console.log('Expires In:', tokenResponse.expires_in)

						// Refresh the access token (when it expires)
						if (tokenResponse.refresh_token) {
							const refreshedToken = await smartClient.refreshAccessToken(tokenResponse.refresh_token)
							console.log('Refreshed Access Token:', refreshedToken.access_token)
						}
						return c.json(tokenResponse)
					} catch (error) {
						console.error('Error:', error.message)
					}
					return c.json(tokenResponse)
				},
			}),
			registerCopilotKit({
				path: '/copilotkit',
				resourceId: 'assistantAgent',
				setContext: async (c, runtimeContext) => {},
			}),
		],
	},
	workflows: { ...Object.fromEntries(allAuthWorkflows.map((workflow) => [workflow.id, workflow])) },
	agents: { assistantAgent, patientReportAgent },
	vectors: { pgVector },
	//storage: new D1Store({
	//  binding: DB, // D1Database binding provided by the Workers runtime
	//  tablePrefix: "dev_", // Optional: isolate tables per environment
	//}),
	storage: pgStorage,
	mcpServers: {
		fhirMCPServer,
	},
	logger: new PinoLogger({
		name: 'Mastra',
		level: 'info',
	}),
	telemetry: otelConfig,
})

export { mastra }
