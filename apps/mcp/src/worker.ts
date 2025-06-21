import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js'
import { toFetchResponse, toReqRes } from 'fetch-to-node'
import { Hono } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { cors } from 'hono/cors'
import { useWorkersLogger } from 'workers-tagged-logger'

import { authorizeSmartClient, createSmartFhirClient, SmartFhirClientOptions } from '@repo/fhir' // Keep this if needed directly in worker.ts for other purposes
import { useNotFound, useOnError } from '@repo/hono-helpers'

import {
	defaultCookieOptions,
	FHIR_AUTH_STATE_COOKIE,
	FHIR_PKCE_VERIFIER_COOKIE,
	FHIR_SESSION_COOKIE,
} from './lib/auth-constants'
// Import shared constants

import { zEnv } from './lib/env'
import { init } from './lib/hono/init'
import { fhirAuthMiddleware } from './lib/hono/middleware/fhir-auth' // Import the new middleware

import { server } from './server'

import type { Context, Env, HonoEnv } from './lib/hono/context'

// Map to store transports by session ID
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {}

const app = new Hono<HonoEnv>()
	.use(
		'*',
		// middleware
		(c, next) =>
			useWorkersLogger(c.env.NAME, {
				environment: c.env.ENVIRONMENT,
				release: c.env.SENTRY_RELEASE,
			})(c, next)
	)

	.onError(useOnError())
	.notFound(useNotFound())

	.get('/', async (c) => {
		return c.text('hello, world!')
	})

// --- SMART on FHIR Auth Routes ---
// Constants are now imported from './lib/auth-constants'

const authRoutes = new Hono<HonoEnv>()
	.get('/login', async (c) => {
		const redirectUri = new URL(c.req.url).origin + '/auth/callback' // Ensure this matches SMART_REDIRECT_URI if that's fixed
		try {
			const { authorizeUrl, codeVerifier, stateValue } = await authorizeSmartClient({
				env: c.env, // Pass the worker env containing SMART_CLIENT_ID etc.
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
	})
	.get('/callback', async (c) => {
		const code = c.req.query('code')
		const stateFromCallback = c.req.query('state')

		const pkceCodeVerifier = getCookie(c, FHIR_PKCE_VERIFIER_COOKIE)
		const expectedState = getCookie(c, FHIR_AUTH_STATE_COOKIE)

		deleteCookie(c, FHIR_PKCE_VERIFIER_COOKIE, { path: defaultCookieOptions.path })
		deleteCookie(c, FHIR_AUTH_STATE_COOKIE, { path: defaultCookieOptions.path })

		if (!code || !stateFromCallback) {
			return c.json({ error: 'Missing code or state from callback' }, 400)
		}
		if (!pkceCodeVerifier) {
			return c.json({ error: 'Missing PKCE verifier cookie' }, 400)
		}
		if (!expectedState) {
			return c.json({ error: 'Missing state cookie' }, 400)
		}

		try {
			// createSmartFhirClient will validate stateFromCallback against expectedState internally
			const fhirClient = await createSmartFhirClient({
				request: c.req.raw, // Pass the raw Request object
				env: c.env, // Pass the worker env
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
				return c.json({ error: 'Failed to obtain access token from FHIR client' }, 500)
			}

			// TODO: In a real scenario, parse clientState.idToken (JWT) to get actual userId and roles
			// For now, using placeholders. These roles should align with roles in Cerbos policies.
			const placeholderUserId = clientState.idToken?.sub || 'test-user-placeholder' // 'sub' is standard OIDC subject
			const placeholderRoles = ['practitioner', 'admin'] // Example roles

			const sessionData = {
				tokenResponse: clientState.tokenResponse,
				serverUrl: clientState.serverUrl,
				userId: placeholderUserId,
				roles: placeholderRoles,
			}

			const cookieExpiry = clientState.tokenResponse.expires_in
				? new Date(Date.now() + clientState.tokenResponse.expires_in * 1000)
				: new Date(Date.now() + 3600 * 1000) // Default to 1 hour if no expires_in

			setCookie(c, FHIR_SESSION_COOKIE, JSON.stringify(sessionData), {
				...defaultCookieOptions,
				expires: cookieExpiry,
			})

			return c.redirect('/') // Redirect to a protected area or dashboard
		} catch (error: any) {
			console.error('FHIR Callback failed:', error.message, error.stack)
			return c.json({ error: 'FHIR callback processing failed', details: error.message }, 500)
		}
	})
	.get('/logout', async (c) => {
		deleteCookie(c, FHIR_SESSION_COOKIE, { path: defaultCookieOptions.path })
		return c.redirect('/') // Or a specific logged-out page
	})

app.route('/auth', authRoutes)
// --- End Auth Routes ---

// Apply FHIR auth middleware before init and SSE routes
// if FHIR client might be needed by init or SSE setup.
// Or apply specifically to /sse if only SSE handlers need it.
app.use('/sse', fhirAuthMiddleware)

app.use('*', init()) // This should ideally be after specific routes or ensure it doesn't interfere.
// cors
app.use('*', (c, next) => {
	const corsMiddleware = cors({
		origin: c.env.ALLOWED_ORIGINS == '*' ? '*' : c.env.ALLOWED_ORIGINS.split(','), // replace with your origin
		allowHeaders: ['Content-Type', 'Authorization'],
		allowMethods: ['POST', 'GET', 'PATCH', 'OPTIONS', 'DELETE'],
		exposeHeaders: ['Content-Length'],
		maxAge: 600,
		credentials: true,
	})
	return corsMiddleware(c, next)
})
// Handle POST requests for client-to-server communication
app.post('/sse', async (c) => {
	const { req, res } = toReqRes(c.req.raw)
	const session = c.get('session') // MCP session from init()
	const fhirClient = c.get('fhirClient') // FHIR client from fhirAuthMiddleware
	const fhirSessionData = c.get('fhirSessionData') // FHIR session data from fhirAuthMiddleware

	// Check for existing session ID
	const sessionId = session?.id
	let transport: StreamableHTTPServerTransport
	const requestBody = await c.req.json() // Parse JSON body once

	if (sessionId && transports[sessionId]) {
		// Reuse existing transport
		transport = transports[sessionId]
	} else if (!sessionId && isInitializeRequest(requestBody)) {
		// New initialization request
		transport = new StreamableHTTPServerTransport({
			sessionIdGenerator: undefined, // MCP will generate
			onsessioninitialized: (newSessionId) => {
				// Store the transport by session ID
				transports[newSessionId] = transport
			},
		})

		// Clean up transport when closed
		transport.onclose = () => {
			if (transport.sessionId) {
				delete transports[transport.sessionId]
			}
		}

		// Connect to the MCP server
		await server.connect(transport)
	} else {
		// Invalid request
		return c.json(
			{
				jsonrpc: '2.0',
				error: {
					code: -32000,
					message: 'Bad Request: No valid MCP session ID provided or not an init request.',
				},
				id: requestBody?.id || null,
			},
			400
		)
	}

	// Inject fhirClient and fhirSessionData into the transport's callContext
	// This context will be passed to MCP tool handlers by the McpServer
	transport.callContext = {
		fhirClient,
		fhirSessionData,
		// Potentially other Hono context items if needed by tools
		// e.g., mcpSession: session
	}

	// Handle the request
	await transport.handleRequest(req, res, requestBody)

	res.on('close', () => {
		console.log('Request closed for MCP session:', transport.sessionId)
		void transport.close()
		void server.close()
	})

	return toFetchResponse(res)
})

// Reusable handler for GET and DELETE requests
const handleSessionRequest = async (c: Context) => {
	const { req, res } = toReqRes(c.req.raw)
	const session = c.get('session')
	const sessionId = session?.session.id
	if (!sessionId || !transports[sessionId]) {
		return c.json(
			{
				message: 'Invalid or missing session ID',
			},
			400
		)
	}

	const transport = transports[sessionId]
	await transport.handleRequest(req, res)
}

// Handle GET requests for server-to-client notifications via SSE
app.get('/sse', handleSessionRequest)

// Handle DELETE requests for session termination
app.delete('/sse', handleSessionRequest)

const handler = {
	fetch: (req: Request, env: Env, executionCtx: ExecutionContext) => {
		const parsedEnv = zEnv.safeParse(env)
		if (!parsedEnv.success) {
			/**new ConsoleLogger({
				requestId: '',
				environment: env.ENVIRONMENT,
				application: 'mcp',
			}).fatal(`BAD_ENVIRONMENT: ${parsedEnv.error.message}`) */
			return Response.json(
				{
					code: 'BAD_ENVIRONMENT',
					message: 'Some environment variables are missing or are invalid',
					errors: parsedEnv.error,
				},
				{ status: 500 }
			)
		}
		return app.fetch(req, parsedEnv.data, executionCtx)
	},
} satisfies ExportedHandler<Env>

// biome-ignore lint/style/noDefaultExport: Wrangler needs that
export default handler
