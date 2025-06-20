export const FHIR_PKCE_VERIFIER_COOKIE = 'fhir_pkce_verifier'
export const FHIR_AUTH_STATE_COOKIE = 'fhir_auth_state'
export const FHIR_SESSION_COOKIE = 'fhir_session'

export const defaultCookieOptions = {
	path: '/',
	httpOnly: true,
	secure: true, // Requires HTTPS
	sameSite: 'Lax' as const,
}
