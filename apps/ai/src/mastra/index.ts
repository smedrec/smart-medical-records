import 'dotenv/config'

import { registerCopilotKit } from '@mastra/agui'
import { Mastra } from '@mastra/core/mastra'
import { registerApiRoute } from '@mastra/core/server'
//import { CloudflareDeployer } from '@mastra/deployer-cloudflare'
import { PinoLogger } from '@mastra/loggers'
import createClient from 'openapi-fetch'
import { fetch, request } from 'undici'

import { Audit } from '@repo/audit'
import { Auth } from '@repo/auth/dist/auth/auth-class.js'
import { Cerbos } from '@repo/cerbos'

import { assistantAgent } from './agents/assistant-agent'
import { fhirAgent, openMCPServer } from './agents/fhir-test'
import { patientReportAgent } from './agents/patient-report-agent'
import { fhirMCPServer } from './mcp'
import { opensearch } from './stores/opensearch'
import { pgStorage, pgVector } from './stores/pgvector'
import { newUserWorkflow } from './workflows/new-user-workflow'
import { weatherWorkflow } from './workflows/weather-workflow'

import type { OtelConfig } from '@mastra/core'
import type { Session, User } from '@repo/auth'
import type { EnvConfig } from '@repo/auth/dist/auth/environment.js'
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

let authInstance: Auth | undefined = undefined
export { authInstance }

export const mastra = new Mastra({
	/**deployer: new CloudflareDeployer({
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
	}),*/
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
					}) */
					/**const session = await auth.api.getSession({ headers: c.req.raw.headers })

					if (!session) {
						return new Response('Unauthorized', { status: 401 })
					}
					const authHeader = c.req.header('Authorization')
					if (!authHeader) {
						return new Response('Unauthorized', { status: 401 })
					}*/
					const authConfig: EnvConfig = {
						BETTER_AUTH_URL: process.env.BETTER_AUTH_URL!,
						BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
						BETTER_AUTH_REDIS_URL: process.env.BETTER_AUTH_REDIS_URL!,
						AUTH_DB_URL: process.env.AUTH_DB_URL!,
						AUDIT_REDIS_URL: process.env.AUDIT_REDIS_URL!,
						APP_PUBLIC_URL: process.env.APP_PUBLIC_URL!,
						SMTP_HOST: process.env.SMTP_HOST!,
						SMTP_USER: process.env.SMTP_USER!,
						SMTP_PASSWORD: process.env.SMTP_PASSWORD!,
					}

					//console.log(`AUTH CONFIG: ${JSON.stringify(authConfig, null, 2)}`)

					/**if (!authInstance) {
						authInstance = new Auth(authConfig)
					}

					const auth = authInstance.getAuthInstance()

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
						user: rawSession.user,
					}

					console.log(`SESSION: ${JSON.stringify(session, null, 2)}`)
					const cerbos = new Cerbos(process.env.CERBOS_URL!)
					const audit = new Audit('audit', process.env.AUDIT_REDIS_URL!)

					const sessionData: FhirSessionData = {
						tokenResponse: {},
						serverUrl: 'https://hapi.teachhowtofish.org/fhir/',
						userId: session.session.userId, // Added for Cerbos Principal ID
						user: session.user,
						// TODO uniformize the types with the session
						roles: [session.session.activeOrganizationRole as string],
						activeOrganizationId: session.session.activeOrganizationId as string,
					}
					const fhirApiClient: FhirApiClient = createClient({ baseUrl: sessionData.serverUrl })
					const runtimeContext = c.get('runtimeContext')
					runtimeContext.set('cerbos', cerbos)
					runtimeContext.set('audit', audit)
					runtimeContext.set('fhirSessionData', sessionData)
					runtimeContext.set('fhirClient', fhirApiClient)*/
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
			registerApiRoute('/sign-in/email', {
				method: 'POST',
				handler: async (c) => {
					const body = await c.req.json()
					console.log(`${c.req.method} ${c.req.url} ${JSON.stringify(body, null, 2)}`)
					const res = await fetch('http://localhost:8801/auth/sign-in/email', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(body),
					})
					const json = await res.json()
					return c.json(json as Record<string, unknown>)
				},
			}),
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

					const cerbos = new Cerbos(process.env.CERBOS_URL!)
					const audit = new Audit('audit', process.env.AUDIT_REDIS_URL!)

					// Type guard for runtime validation
					const sessionAuth: { session: Session; user: User } | null =
						json && typeof json === 'object'
							? (json as { session: Session; user: User } | null)
							: null

					const sessionData: FhirSessionData = {
						tokenResponse: {},
						serverUrl: 'https://hapi.teachhowtofish.org/fhir/',
						userId: sessionAuth?.session.userId || '1RnE9Braod6DUi0b0EfqBgaTcRoWYwHz', // Added for Cerbos Principal ID
						roles: [sessionAuth?.session.activeOrganizationRole || 'owner'],
					}
					const fhirApiClient: FhirApiClient = createClient({ baseUrl: sessionData.serverUrl })
					runtimeContext.set('cerbos', cerbos)
					runtimeContext.set('audit', audit)
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
	workflows: { newUserWorkflow },
	agents: { assistantAgent, patientReportAgent },
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
