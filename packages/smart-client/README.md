# @repo/smart-client

A reusable TypeScript package for client authorization within a backend application, following the SMART App Launch framework.

## Installation

```bash
pnpm add @repo/smart-client
```

## Usage

Here's an example of how to use the `SmartClient` to initiate an authorization flow and exchange a code for tokens.

```typescript
import { SmartClient } from '@repo/smart-client'

// 1. Initialize the SmartClient
const smartClient = new SmartClient({
	clientId: 'my-client-id',
	clientSecret: 'my-client-secret', // optional
	redirectUri: 'https://my-app.com/callback',
	authUrl: 'https://smart-auth-server.com/auth',
	tokenUrl: 'https://smart-auth-server.com/token',
})

// 2. Get the authorization URL
const authUrl = smartClient.getAuthorizationUrl({
	scope: 'openid fhirUser launch/patient patient/*.read',
	state: 'my-state', // optional
	aud: 'https://fhir-server.com/api/v4', // optional
})

console.log('Redirect your user to this URL:', authUrl)

// 3. Handle the authorization response (in your callback handler)
// The user will be redirected back to your redirectUri with a code and state in the query parameters.

// Example query: { code: 'some-auth-code', state: 'my-state' }
const handleCallback = async (query: { [key: string]: string | string[] | undefined }) => {
	try {
		const { code } = smartClient.handleAuthorizationResponse(query)

		// 4. Exchange the authorization code for an access token
		const tokenResponse = await smartClient.exchangeCodeForToken(code)

		console.log('Access Token:', tokenResponse.access_token)
		console.log('Refresh Token:', tokenResponse.refresh_token)
		console.log('Expires In:', tokenResponse.expires_in)

		// 5. Refresh the access token (when it expires)
		if (tokenResponse.refresh_token) {
			const refreshedToken = await smartClient.refreshAccessToken(tokenResponse.refresh_token)
			console.log('Refreshed Access Token:', refreshedToken.access_token)
		}
	} catch (error) {
		console.error('Error:', error.message)
	}
}
```
