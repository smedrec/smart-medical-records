import crypto from 'crypto'
import axios from 'axios'
import jwt from 'jsonwebtoken'

import type { SmartClientConfig, SmartConfiguration, TokenResponse } from './types.js'

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
			{ algorithm: 'RS384' }
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
