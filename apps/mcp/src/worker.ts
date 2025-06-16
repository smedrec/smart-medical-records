import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { toFetchResponse, toReqRes } from 'fetch-to-node'
import { Hono } from 'hono'
import { useWorkersLogger } from 'workers-tagged-logger'

import { useNotFound, useOnError } from '@repo/hono-helpers'

import { init } from './lib/hono/init'
import { server } from './server'

import type { Context, HonoEnv } from './lib/hono/context'

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

app.use('*', init())
// Handle POST requests for client-to-server communication
app.post('/sse', async (c) => {
	const { req, res } = toReqRes(c.req.raw)
	const session = c.get('session')
	// Check for existing session ID
	const sessionId = session?.session.id
	let transport: StreamableHTTPServerTransport

	if (sessionId && transports[sessionId]) {
		// Reuse existing transport
		transport = transports[sessionId]
	} else if (!sessionId && isInitializeRequest(c.body)) {
		// New initialization request
		transport = new StreamableHTTPServerTransport({
			sessionIdGenerator: undefined,
			onsessioninitialized: (sessionId) => {
				// Store the transport by session ID
				transports[sessionId] = transport
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
					message: 'Bad Request: No valid session ID provided',
				},
				id: null,
			},
			400
		)
	}

	// Handle the request
	await transport.handleRequest(req, res, await c.req.json())

	res.on('close', () => {
		console.log('Request closed')
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

export default app
