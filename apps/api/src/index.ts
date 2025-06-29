// Practitioner routes
import { cors } from 'hono/cors'

import { auth } from '@repo/better-auth'

import { newApp } from './lib/hono'
import { init } from './lib/hono/init'
// AI routes
import { registerAiChat } from './routes/ai/chat'
import { registerAiCreateIndex } from './routes/ai/create-index'
import { registerAiDeleteIndex } from './routes/ai/delete-index'
import { registerAiDetailsIndex } from './routes/ai/details-index'
import { registerAiIndexes } from './routes/ai/indexes'
import { registerAiStore } from './routes/ai/store'
import { registerLiveness } from './routes/liveness'
import { registerWhoiam } from './routes/whoiam'

const app = newApp()

app.use('*', init())

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

/**
 * Mounts Better Auth on all GET and POST requests under `/api/*`.
 * Ensure its `basePath` aligns with this route.
 */
app.on(['GET', 'POST'], '/auth/*', (c) => {
	return auth.handler(c.req.raw)
})

registerLiveness(app)
registerWhoiam(app)

// ai routes
registerAiChat(app)
registerAiStore(app)
registerAiCreateIndex(app)
registerAiDeleteIndex(app)
registerAiDetailsIndex(app)
registerAiIndexes(app)

export default app
