// Helper function to generate PKCE code_challenge from code_verifier
// Exported for testing
export async function generatePkceChallenge(verifier: string): Promise<string> {
	const encoder = new TextEncoder()
	const data = encoder.encode(verifier)
	const hashBuffer = await crypto.subtle.digest('SHA-256', data)
	// Convert ArrayBuffer to Base64 URL encoded string
	const hashArray = Array.from(new Uint8Array(hashBuffer))
	const hashString = String.fromCharCode.apply(null, hashArray)
	return btoa(hashString).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}
