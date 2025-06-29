import { zEnv } from '@/lib/env'
import { ConsoleLogger } from '@/lib/logs'
import { registerFhirCallback } from '@/routes/fhir/callback'
import { registerFhirLogin } from '@/routes/fhir/login'
import { registerSmartFhirClientCreate } from '@/routes/fhir/smart-client/create'
import { registerSmartFhirClientDelete } from '@/routes/fhir/smart-client/delete'
import { registerSmartFhirClientFind } from '@/routes/fhir/smart-client/find'
import { registerSmartFhirClientUpdate } from '@/routes/fhir/smart-client/update'
import { registerUploadAvatar } from '@/routes/user/uploadAvatar'
import { cors } from 'hono/cors'

import { auth } from '@repo/auth'

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

import type { Env } from '@/lib/hono/context'

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
 * Mounts Better Auth on all GET and POST requests under `/auth/*`.
 * Ensure its `basePath` aligns with this route.
 */
app.on(['GET', 'POST'], '/auth/*', (c) => {
	return auth.handler(c.req.raw)
})

registerLiveness(app)
registerWhoiam(app)

registerUploadAvatar(app)
// FHIR routes
registerFhirLogin(app)
registerFhirCallback(app)
registerSmartFhirClientFind(app)
registerSmartFhirClientCreate(app)
registerSmartFhirClientUpdate(app)
registerSmartFhirClientDelete(app)
// FHIR resources routes
registerResourceRead(app)
registerResourceReadHistory(app)
// ai routes
registerAiChat(app)
registerAiStore(app)
registerAiCreateIndex(app)
registerAiDeleteIndex(app)
registerAiDetailsIndex(app)
registerAiIndexes(app)

const handler = {
	fetch: (req: Request, env: Env, executionCtx: ExecutionContext) => {
		const parsedEnv = zEnv.safeParse(env)
		if (!parsedEnv.success) {
			new ConsoleLogger({
				requestId: '',
				environment: env.ENVIRONMENT,
				application: 'api',
			}).fatal(`BAD_ENVIRONMENT: ${parsedEnv.error.message}`)
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
