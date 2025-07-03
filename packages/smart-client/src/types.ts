export interface SmartClientConfig {
	clientId: string
	clientSecret?: string
	scope: string
	iss: string
	redirectUri: string
	fhirBaseUrl?: string
	privateKey: string
	provider: 'demo' | 'azure' | 'aws' | 'gcp'
	environment: 'development' | 'production'
}

export interface SmartConfiguration {
	authorizationEndpoint: string
	tokenEndpoint: string
	introspectionEndpoint: string
	tokenEndpointAuthMethodsSupported: string[]
	scopesSupported: string[]
	responsesTypesSupported: string[]
	capabilities: string[]
}

export interface GetAuthUrlParams {
	scope: string
	state?: string
	aud?: string
}

export interface AuthResponse {
	code: string
	state?: string
}

export interface TokenResponse {
	access_token: string
	refresh_token?: string
	expires_in: number
	token_type: string
	scope: string
}

export interface RefreshTokenResponse {
	access_token: string
	expires_in: number
	token_type: string
	scope: string
}
