//import * as jose from 'jose'

export const FhirServerUrlHeaderName = 'x-fhir-server-url'
export const FhirAccessTokenHeaderName = 'x-fhir-access-token'
export const PatientIdHeaderName = 'x-patient-id'

export function createTextResponse(
	text: string,
	options: { isError: boolean } = { isError: false }
): { content: Array<{ type: 'text'; text: string }>; isError?: boolean } {
	return {
		content: [{ type: 'text', text }],
		isError: options.isError,
	}
}

/**
export type FhirContext = {
	url: string
	token: string
}

export function getFhirContext(req: Request): FhirContext | null {
	const headers = req.headers
	const url = headers[FhirServerUrlHeaderName]?.toString()

	if (!url) {
		return null
	}

	const token = headers[FhirAccessTokenHeaderName]?.toString()
	if (!token) {
		return null
	}

	return { url, token }
}

export function getPatientIdIfContextExists(req: Request) {
	const fhirToken = req.headers[FhirAccessTokenHeaderName]?.toString()
	if (fhirToken) {
		const claims = jose.decodeJwt(fhirToken)
		if (claims['patient']) {
			return claims['patient']?.toString()
		}
	}

	return req.headers[PatientIdHeaderName]?.toString() || null
}
 */
