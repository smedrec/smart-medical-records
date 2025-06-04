import { cors } from 'hono/cors'

import { auth } from './lib/better-auth'
import { newApp } from './lib/hono'
import { init } from './lib/hono/init'
import { registerAssistantCreate } from './routes/assistant/create'
import { registerAssistantDelete } from './routes/assistant/delete'
import { registerAssistantFindOne } from './routes/assistant/findOne'
import { registerAssistantGetAll } from './routes/assistant/getAll'
import { registerAssistantUpdate } from './routes/assistant/update'
// routes
import { registerLiveness } from './routes/liveness'
import { registerPatientsToTherapists } from './routes/patient/addTherapist'
import { registerPatientCreate } from './routes/patient/create'
import { registerPatientDelete } from './routes/patient/delete'
import { registerPatientsDisableTherapists } from './routes/patient/disableTherapist'
import { registerPatientFindOne } from './routes/patient/findOne'
import { registerPatientGetAll } from './routes/patient/getAll'
import { registerPatientUpdate } from './routes/patient/update'
import { registerTherapistCreate } from './routes/therapist/create'
import { registerTherapistDelete } from './routes/therapist/delete'
import { registerTherapistFindOne } from './routes/therapist/findOne'
import { registerTherapistGetAll } from './routes/therapist/getAll'
import { registerTherapistUpdate } from './routes/therapist/update'
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
// Assistant routes
registerAssistantCreate(app)
registerAssistantDelete(app)
registerAssistantGetAll(app)
registerAssistantFindOne(app)
registerAssistantUpdate(app)
// Therapist routes
registerTherapistCreate(app)
registerTherapistDelete(app)
registerTherapistGetAll(app)
registerTherapistFindOne(app)
registerTherapistUpdate(app)
// Patient routes
registerPatientCreate(app)
registerPatientDelete(app)
registerPatientGetAll(app)
registerPatientFindOne(app)
registerPatientUpdate(app)
registerPatientsToTherapists(app)
registerPatientsDisableTherapists(app)

export default app
