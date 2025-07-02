import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath, URLSearchParams } from 'url'
import axios from 'axios'
import jwt from 'jsonwebtoken'

import type {
	AuthResponse,
	GetAuthUrlParams,
	RefreshTokenResponse,
	SmartClientConfig,
	TokenResponse,
} from './types.js'

/**const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const KEYS_DIR = path.resolve(__dirname, '../keys')*/

export class SmartClient {
	private config: SmartClientConfig

	constructor(config: SmartClientConfig) {
		this.config = config
	}

	public getAuthorizationUrl(params: GetAuthUrlParams): string {
		const searchParams = new URLSearchParams({
			response_type: 'code',
			client_id: this.config.clientId,
			redirect_uri: this.config.redirectUri,
			scope: params.scope,
		})

		if (params.state) {
			searchParams.append('state', params.state)
		}

		if (params.aud) {
			searchParams.append('aud', params.aud)
		}

		return `${this.config.authUrl}?${searchParams.toString()}`
	}

	public handleAuthorizationResponse(query: {
		[key: string]: string | string[] | undefined
	}): AuthResponse {
		const { code, state } = query

		if (typeof code !== 'string') {
			throw new Error('Invalid authorization response: missing or invalid code')
		}

		const response: AuthResponse = { code }

		if (state && typeof state === 'string') {
			response.state = state
		}

		return response
	}

	public async exchangeCodeForToken(code: string): Promise<TokenResponse> {
		const params = new URLSearchParams({
			grant_type: 'authorization_code',
			code,
			redirect_uri: this.config.redirectUri,
			client_id: this.config.clientId,
		})

		if (this.config.clientSecret) {
			params.append('client_secret', this.config.clientSecret)
		}

		try {
			const response = await axios.post<TokenResponse>(this.config.tokenUrl, params, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			})
			return response.data
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				throw new Error(
					`Failed to exchange code for token: ${error.response.status} ${error.response.data}`
				)
			}
			throw new Error('Failed to exchange code for token')
		}
	}

	public async refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse> {
		const params = new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
			client_id: this.config.clientId,
		})

		if (this.config.clientSecret) {
			params.append('client_secret', this.config.clientSecret)
		}

		try {
			const response = await axios.post<RefreshTokenResponse>(this.config.tokenUrl, params, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			})
			return response.data
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				throw new Error(
					`Failed to refresh access token: ${error.response.status} ${error.response.data}`
				)
			}
			throw new Error('Failed to refresh access token')
		}
	}

	public async getBackendToken(scope: string): Promise<TokenResponse> {
		const privateKey = fs.readFileSync(
			`/home/jose/Documents/workspace/smedrec/smart-medical-records/apps/api/node_modules/@repo/smart-client/dist/jwtRS256.key`,
			'utf8'
		)
		const now = Math.floor(Date.now() / 1000)
		const token = jwt.sign(
			{
				iss: this.config.clientId,
				sub: this.config.clientId,
				aud: this.config.tokenUrl,
				jti: crypto.randomUUID(),
				exp: now + 5 * 60,
				iat: now,
			},
			privateKey,
			{ algorithm: 'RS256' }
		)

		const params = new URLSearchParams({
			grant_type: 'client_credentials',
			client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
			client_assertion: token,
			scope,
		})

		try {
			const response = await axios.post<TokenResponse>(this.config.tokenUrl, params, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			})
			return response.data
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				throw new Error(
					`Failed to get backend token: ${error.response.status} ${error.response.data}`
				)
			}
			throw new Error('Failed to get backend token')
		}
	}
}
