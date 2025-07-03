import crypto from 'crypto'
import axios from 'axios'
import jwt from 'jsonwebtoken'

import type {
	AuthResponse,
	GetAuthUrlParams,
	RefreshTokenResponse,
	SmartClientConfig,
	SmartConfiguration,
	TokenResponse,
} from './types.js'

/**const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const KEYS_DIR = path.resolve(__dirname, '../keys')*/

type SmartClientOption = (s: SmartClient) => void

export class SmartClient {
	private config: SmartClientConfig
	private smartConfig: SmartConfiguration

	constructor(...options: SmartClientOption[]) {
		// defaults
		this.config = {
			clientId: '',
			clientSecret: undefined,
			scope: '',
			iss: '',
			redirectUri: '',
			fhirBaseUrl: undefined,
			privateKey: '',
			provider: 'demo',
			environment: 'development',
		}
		this.smartConfig = {
			authorizationEndpoint: '',
			tokenEndpoint: '',
			introspectionEndpoint: '',
			tokenEndpointAuthMethodsSupported: [],
			scopesSupported: [],
			responsesTypesSupported: [],
			capabilities: [],
		}
		// set the options
		for (const option of options) {
			option(this)
		}
	}

	public static WithConfig(clientOptions: SmartClientConfig): SmartClientOption {
		return (s: SmartClient): void => {
			s.config = clientOptions
		}
	}

	public static async init(iss: string): Promise<SmartClientOption> {
		try {
			const response = await axios.get<SmartConfiguration>(
				`${iss}/.well-known/smart-configuration`,
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			)
			return (s: SmartClient): void => {
				s.smartConfig = response.data
			}
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				throw new Error(
					`Failed to get smart configuration: ${error.response.status} ${error.response.data}`
				)
			}
			throw new Error('Failed to get smart configuration')
		}
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

		return `${this.smartConfig.authorizationEndpoint}?${searchParams.toString()}`
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
			const response = await axios.post<TokenResponse>(this.smartConfig.tokenEndpoint, params, {
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
			const response = await axios.post<RefreshTokenResponse>(
				this.smartConfig.tokenEndpoint,
				params,
				{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				}
			)
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

	public async getBackendToken(): Promise<TokenResponse> {
		const now = Math.floor(Date.now() / 1000)
		const token = jwt.sign(
			{
				iss: this.config.clientId,
				sub: this.config.clientId,
				aud: this.smartConfig.tokenEndpoint,
				jti: crypto.randomUUID(),
				exp: now + 5 * 60,
				iat: now,
			},
			this.config.privateKey,
			{ algorithm: 'RS256' }
		)

		const params = new URLSearchParams({
			grant_type: 'client_credentials',
			client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
			client_assertion: token,
			scope: this.config.scope,
		})

		try {
			const response = await axios.post<TokenResponse>(this.smartConfig.tokenEndpoint, params, {
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
