import createClient from 'openapi-fetch'

import type { paths } from '@/fhir/r4'
import type {
	Client as OpenApiFetchClient,
	Middleware as OpenApiFetchMiddleware,
} from 'openapi-fetch'

export type FhirApiClient = OpenApiFetchClient<paths>

function createFhirApiClient(baseUrl: string, accessToken?: string): FhirApiClient {
	// Create a lightweight openapi-fetch client instance
	const fhirApiClient = createClient({ baseUrl: baseUrl })

	const authHeaderMiddleware: OpenApiFetchMiddleware = {
		onRequest(req) {
			req.request.headers.set('Accept', 'application/fhir+json')
			if (
				req.request.method === 'POST' ||
				req.request.method === 'PUT' ||
				req.request.method === 'PATCH'
			) {
				req.request.headers.set('Content-Type', 'application/fhir+json')
			}
			if (accessToken) {
				req.request.headers.set('Authorization', `Bearer ${accessToken}`)
			}
		},
		// Optional: Add basic onResponse/onError for this client if needed
		// async onResponse(res) { return res; },
		// async onError(err) { throw err; },
	}
	fhirApiClient.use(authHeaderMiddleware)

	return fhirApiClient
}

export { createFhirApiClient }
