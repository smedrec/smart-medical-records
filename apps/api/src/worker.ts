//import { registerFhirCallback } from '@/routes/fhir/callback.js'
//import { registerFhirLogin } from '@/routes/fhir/login.js'
//import { registerSmartFhirClientCreate } from '@/routes/fhir/smart-client/create.js'
//import { registerSmartFhirClientDelete } from '@/routes/fhir/smart-client/delete.js'
//import { registerSmartFhirClientFind } from '@/routes/fhir/smart-client/find.js'
//import { registerSmartFhirClientUpdate } from '@/routes/fhir/smart-client/update.js'
//import { registerUploadAvatar } from '@/routes/user/uploadAvatar.js'
import { cors } from 'hono/cors'

import { auth } from '@repo/auth'

import { zEnv } from './lib/env.js'
import { newApp } from './lib/hono/index.js'
import { init } from './lib/hono/init.js'
import { ConsoleLogger } from './lib/logs/index.js'

// AI routes
//import { registerAiChat } from './routes/ai/chat.js'
//import { registerAiCreateIndex } from './routes/ai/create-index.js'
//import { registerAiDeleteIndex } from './routes/ai/delete-index.js'
//import { registerAiDetailsIndex } from './routes/ai/details-index.js'
//import { registerAiIndexes } from './routes/ai/indexes.js'
//import { registerAiStore } from './routes/ai/store.js'
//import { registerLiveness } from './routes/liveness.js'
//import { registerWhoiam } from './routes/whoiam.js'

//import type { Env } from '@/lib/hono/context.js'

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

/**registerLiveness(app)
registerWhoiam(app)

registerUploadAvatar(app)
// FHIR routes
//registerFhirLogin(app)
//registerFhirCallback(app)
registerSmartFhirClientFind(app)
registerSmartFhirClientCreate(app)
registerSmartFhirClientUpdate(app)
registerSmartFhirClientDelete(app)
// ai routes
registerAiChat(app)
registerAiStore(app)
registerAiCreateIndex(app)
registerAiDeleteIndex(app)
registerAiDetailsIndex(app)
registerAiIndexes(app)
*/
/**const handler = {
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
export default handler */
