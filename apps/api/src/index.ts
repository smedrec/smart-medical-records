//import { zEnv } from '@/lib/env.js'
import { registerFhirAuthorize } from './routes/fhir/authorize.js'
import { registerFhirCallback } from './routes/fhir/callback.js'
import { registerSmartFhirClientCreate } from './routes/fhir/smart-client/create.js'
import { registerSmartFhirClientDelete } from './routes/fhir/smart-client/delete.js'
import { registerSmartFhirClientFind } from './routes/fhir/smart-client/find.js'
import { registerSmartFhirClientUpdate } from './routes/fhir/smart-client/update.js'
import { registerKmsDecrypt } from './routes/kms/decrypt.js'
import { registerKmsEncrypt } from './routes/kms/encrypt.js'

//import { registerUploadAvatar } from '@/routes/user/uploadAvatar.js'
import 'dotenv/config'

import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'

import { auth } from './lib/auth.js'
import { newApp } from './lib/hono/index.js'
import { authDbInstance, init } from './lib/hono/init.js'
import { nodeEnv } from './lib/hono/node-env.js'
import { logger } from './lib/logs/middleware.js'
// AI routes
import { registerAiChat } from './routes/ai/chat.js'
import { registerAiCreateIndex } from './routes/ai/create-index.js'
import { registerAiDeleteIndex } from './routes/ai/delete-index.js'
import { registerAiDetailsIndex } from './routes/ai/details-index.js'
import { registerAiIndexes } from './routes/ai/indexes.js'
import { registerAiStore } from './routes/ai/store.js'
import { registerConfigMailCreate } from './routes/config/mail/create.js'
import { registerConfigMailDelete } from './routes/config/mail/delete.js'
import { registerConfigMailFind } from './routes/config/mail/find.js'
import { registerConfigMailUpdate } from './routes/config/mail/update.js'
import { registerLiveness } from './routes/liveness.js'
import { registerSecretGet } from './routes/secrets/get.js'
import { registerVersion } from './routes/version.js'

//import type { Env } from '@/lib/hono/context.js'

const app = newApp()

if (process.env.NODE_ENV !== 'production') {
	app.use('*', nodeEnv())
}

app.use('*', init())
app.use(logger())

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

registerVersion(app)
registerLiveness(app)

//registerUploadAvatar(app)
// FHIR routes
registerFhirAuthorize(app)
registerFhirCallback(app)
registerSmartFhirClientFind(app)
registerSmartFhirClientCreate(app)
registerSmartFhirClientUpdate(app)
registerSmartFhirClientDelete(app)
registerConfigMailCreate(app)
registerConfigMailFind(app)
registerConfigMailUpdate(app)
registerConfigMailDelete(app)
// ai routes
registerAiChat(app)
registerAiStore(app)
registerAiCreateIndex(app)
registerAiDeleteIndex(app)
registerAiDetailsIndex(app)
registerAiIndexes(app)
// KMS
registerKmsEncrypt(app)
registerKmsDecrypt(app)
registerSecretGet(app)

const server = serve({
	fetch: app.fetch,
	port: 8801,
})

// graceful shutdown
process.on('SIGINT', async () => {
	await authDbInstance?.end()
	server.close()
	process.exit(0)
})
process.on('SIGTERM', () => {
	server.close(async (err) => {
		if (err) {
			console.error(err)
			process.exit(1)
		}
		await authDbInstance?.end()
		process.exit(0)
	})
})

export default app
