export interface SmartClientConfig {
	clientId: string
	clientSecret?: string
	redirectUri: string
	authUrl: string
	tokenUrl: string
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
