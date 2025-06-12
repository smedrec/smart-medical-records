// Practitioner routes
import { registerPractitionerCreate } from '@/routes/fhir/r4/practitioner/create'
import { registerPractitionerDelete } from '@/routes/fhir/r4/practitioner/delete'
import { registerPractitionerFindOne } from '@/routes/fhir/r4/practitioner/findOne'
import { registerPractitionerGetAll } from '@/routes/fhir/r4/practitioner/getAll'
import { registerPractitionerRecreate } from '@/routes/fhir/r4/practitioner/recreate'
import { registerPractitionerUpdate } from '@/routes/fhir/r4/practitioner/update'
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
// Patient routes
//import { registerPatientsToTherapists } from './routes/fhir/r4/patient/addTherapist'
import { registerPatientCreate } from './routes/fhir/r4/patient/create'
import { registerPatientDelete } from './routes/fhir/r4/patient/delete'
//import { registerPatientsDisableTherapists } from './routes/fhir/r4/patient/disableTherapist'
import { registerPatientFindOne } from './routes/fhir/r4/patient/findOne'
import { registerPatientGetAll } from './routes/fhir/r4/patient/getAll'
import { registerPatientUpdate } from './routes/fhir/r4/patient/update'
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

// Practitioner routes
registerPractitionerGetAll(app)
registerPractitionerFindOne(app)
registerPractitionerFindOne(app)
registerPractitionerCreate(app)
registerPractitionerUpdate(app)
registerPractitionerDelete(app)
registerPractitionerRecreate(app)
// Patient routes
registerPatientCreate(app)
registerPatientDelete(app)
registerPatientGetAll(app)
registerPatientFindOne(app)
registerPatientUpdate(app)
//registerPatientsToTherapists(app)
//registerPatientsDisableTherapists(app)

// ai routes
registerAiChat(app)
registerAiStore(app)
registerAiCreateIndex(app)
registerAiDeleteIndex(app)
registerAiDetailsIndex(app)
registerAiIndexes(app)

export default app
