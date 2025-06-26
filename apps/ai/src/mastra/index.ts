import { registerCopilotKit } from '@mastra/agui'
import { Mastra } from '@mastra/core/mastra'
import { CloudflareDeployer } from '@mastra/deployer-cloudflare'
import { PinoLogger } from '@mastra/loggers'
import createClient from 'openapi-fetch'
import { fetch, request } from 'undici'

import { Audit } from '@repo/audit'
import { Cerbos } from '@repo/cerbos'

import { assistantAgent } from './agents/assistant-agent'
import { fhirAgent } from './agents/fhir-test'
import { fhirMCPServer } from './mcp'
import { opensearch } from './stores/opensearch'
import { pgStorage, pgVector } from './stores/pgvector'
import { weatherWorkflow } from './workflows/weather-workflow'

import type { OtelConfig } from '@mastra/core'
import type { RuntimeContext } from '@mastra/core/di'
import type { Session, User } from '@repo/auth'
import type { FhirApiClient, FhirSessionData } from '../hono/middleware/fhir-auth'

type McpFhirToolCallContext = {
	cerbos: Cerbos
	audit: Audit
	fhirClient?: FhirApiClient | null
	fhirSessionData?: FhirSessionData | null
}

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
		endpoint: 'http://joseantcordeiro.hopto.org:4317',
		headers: {
			//Authorization: "Bearer YOUR_TOKEN_HERE",
		},
	},
}

export const mastra = new Mastra({
	deployer: new CloudflareDeployer({
		scope: 'your-account-id',
		projectName: 'smedrec-ai-worker',
		routes: [
			{
				pattern: 'example.com/*',
				zone_name: 'example.com',
				custom_domain: true,
			},
		],
		workerNamespace: 'smedrec-ai-worker',
		auth: {
			apiToken: 'your-api-token',
			apiEmail: 'your-email',
		},
		d1Databases: [
			{
				binding: 'DB',
				database_name: 'smedrec-ai',
				database_id: 'database-id',
			},
		],
		kvNamespaces: [
			{
				binding: 'KV',
				id: 'namespace-id',
			},
		],
	}),
	server: {
		cors: {
			origin: '*',
			allowMethods: ['*'],
			allowHeaders: ['*'],
		},
		middleware: [
			{
				handler: async (c, next) => {
					/**const response = await fetch(`${process.env.BETTER_AUTH_URL}/auth/oauth2/userinfo`, {
						headers: {
							Authorization: `Bearer ACCESS_TOKEN`,
						},
					})
					const session = await auth.api.getSession({ headers: c.req.raw.headers })

					if (!session) {
						return new Response('Unauthorized', { status: 401 })
					}
					const authHeader = c.req.header('Authorization')
					if (!authHeader) {
						return new Response('Unauthorized', { status: 401 })
					} */
					await next()
				},
				path: '/api/*',
			},

			async (c, next) => {
				const start = Date.now()
				/**const session = await auth.api.getSession({ headers: c.req.raw.headers })

					if (!session) {
						return new Response('Unauthorized', { status: 401 })
					}*/

				const cerbos = new Cerbos(process.env.CERBOS_URL!)
				const audit = new Audit('audit', process.env.AUDIT_REDIS_URL!)

				const sessionData: FhirSessionData = {
					tokenResponse: {},
					serverUrl: 'https://hapi.teachhowtofish.org/fhir/',
					userId: '1RnE9Braod6DUi0b0EfqBgaTcRoWYwHz', // Added for Cerbos Principal ID
					roles: ['owner'],
				}
				const fhirApiClient: FhirApiClient = createClient({ baseUrl: sessionData.serverUrl })
				const runtimeContext = c.get('runtimeContext')
				runtimeContext.set('cerbos', cerbos)
				runtimeContext.set('audit', audit)
				runtimeContext.set('fhirSessionData', sessionData)
				runtimeContext.set('fhirClient', fhirApiClient)
				await next()
				const duration = Date.now() - start
				console.log(
					`${c.req.method} ${c.req.url} - ${duration}ms - Request: ${JSON.stringify(c.req.raw)}}`
				)
			},
		],
		apiRoutes: [
			registerCopilotKit({
				path: '/copilotkit',
				resourceId: 'assistantAgent',
				setContext: async (c, runtimeContext) => {
					const { userId, role } = c.req.param()
					// Add whatever you need to the runtimeContext
					// Get session data from auth endpoint with proper error handling
					const res = await fetch('http://localhost:8801/auth/get-session', {
						headers: c.req.raw.headers,
						method: 'GET',
					})

					// Parse JSON once and validate response
					const json = await res.json()
					console.log(JSON.stringify(json, null, 2))

					// Type guard for runtime validation
					const sessionAuth: { session: Session; user: User } | null =
						json && typeof json === 'object'
							? (json as { session: Session; user: User } | null)
							: null

					const sessionData: FhirSessionData = {
						tokenResponse: {},
						serverUrl: 'http://joseantcordeiro.hopto.org:8080/fhir/',
						userId: sessionAuth?.session.userId || '1RnE9Braod6DUi0b0EfqBgaTcRoWYwHz', // Added for Cerbos Principal ID
						roles: [sessionAuth?.session.activeOrganizationRole || 'owner'],
					}
					const fhirApiClient: FhirApiClient = createClient({ baseUrl: sessionData.serverUrl })
					runtimeContext.set('fhirSessionData', sessionData)
					runtimeContext.set('fhirClient', fhirApiClient)
					/**const sessionData: FhirSessionData = {
						tokenResponse: {},
						serverUrl: 'http://joseantcordeiro.hopto.org:8080/fhir/',
						userId: userId, // Added for Cerbos Principal ID
						roles: [role as string],
					}
					runtimeContext.set('fhirSessionData', sessionData)
					const fhirApiClient: FhirApiClient = createClient({ baseUrl: sessionData.serverUrl })
					runtimeContext.set('fhirClient', fhirApiClient)
					//runtimeContext.set('temperature-scale', 'celsius')*/
				},
			}),
		],
	},
	workflows: { weatherWorkflow },
	agents: { assistantAgent, fhirAgent },
	vectors: { pgVector, opensearch },
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
