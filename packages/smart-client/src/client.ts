import axios, { type AxiosError, type AxiosInstance, isAxiosError } from 'axios'
import { importJWK, importPKCS8, SignJWT } from 'jose'
import { v4 as uuidv4 } from 'uuid'

import {
	SmartClientAuthenticationError,
	SmartClientInitializationError,
	SmartClientRequestError,
} from './types'

// Removed AxiosError and AxiosInstance from here as they are now in the main axios import
import type {
	SmartClientConfig,
	SmartClientError,
	SmartConfiguration,
	TokenResponse,
} from './types'

/**
 * Default lifetime for the JWT assertion in seconds (5 minutes).
 */
const DEFAULT_JWT_LIFETIME = 300

/**
 * Default signing algorithm for the JWT assertion.
 */
const DEFAULT_SIGNING_ALGORITHM = 'RS384'

/**
 * Smart FHIR client for backend services using asymmetric (public key) authentication.
 * This client handles the OAuth 2.0 client credentials flow with a JWT assertion.
 */
export class SmartClient {
	private config: SmartClientConfig
	private smartConfiguration?: SmartConfiguration
	private tokenResponse?: TokenResponse
	private tokenExpiryTime?: number // Store token expiry time in ms
	private httpClient: AxiosInstance

	/**
	 * Creates an instance of SmartClient.
	 * The client is not fully initialized until `init()` is called.
	 * @param {SmartClientConfig} config - The configuration for the SmartClient.
	 */
	constructor(config: SmartClientConfig) {
		if (!config) {
			throw new SmartClientInitializationError('SmartClientConfig is required.')
		}
		if (!config.clientId || !config.iss || !config.scope || !config.privateKey) {
			throw new SmartClientInitializationError(
				'Invalid SmartClientConfig: clientId, iss, scope, and privateKey are required.'
			)
		}
		// Validate that iss and clientId are the same, as per the spec for client credentials
		if (config.iss !== config.clientId) {
			throw new SmartClientInitializationError(
				'Invalid SmartClientConfig: iss and clientId must be identical for this authentication flow.'
			)
		}

		this.config = {
			...config,
			signingAlgorithm: config.signingAlgorithm || DEFAULT_SIGNING_ALGORITHM,
			jwtLifetime: config.jwtLifetime || DEFAULT_JWT_LIFETIME,
		}

		this.httpClient = axios.create({
			baseURL: this.config.fhirBaseUrl,
		})

		// Initialize other properties
		this.smartConfiguration = undefined
		this.tokenResponse = undefined
		this.tokenExpiryTime = undefined
	}

	/**
	 * Initializes the SmartClient by fetching the SMART configuration from the FHIR server.
	 * This method must be called before making any FHIR API calls.
	 * @param {SmartClientConfig} config - The configuration for the SmartClient, typically fetched from a secure database.
	 * @param {string} [issUrl] - The issuer URL of the FHIR server. If not provided,
	 *                            it will try to use `fhirBaseUrl` from config to construct
	 *                            the .well-known/smart-configuration URL.
	 * @returns {Promise<SmartClient>} The initialized SmartClient instance.
	 * @throws {SmartClientInitializationError} If initialization fails.
	 */
	public static async init(config: SmartClientConfig, issUrl?: string): Promise<SmartClient> {
		const client = new SmartClient(config)
		await client.initializeClient(issUrl) // Renamed to avoid conflict with potential 'initialize' in subclasses
		return client
	}

	private async initializeClient(issUrl?: string): Promise<void> {
		let wellKnownUrl: string

		if (issUrl) {
			// Ensure issUrl ends with a slash for proper URL joining
			const baseIss = issUrl.endsWith('/') ? issUrl : `${issUrl}/`
			wellKnownUrl = new URL('.well-known/smart-configuration', baseIss).toString()
		} else if (this.config.fhirBaseUrl) {
			// The .well-known/smart-configuration path should be relative to the authority's root,
			// not necessarily the FHIR base URL's path (e.g. /r4).
			// We construct it from the origin of fhirBaseUrl.
			try {
				const fhirBaseUrlObj = new URL(this.config.fhirBaseUrl)
				// Ensure the base for .well-known is the origin, without any sub-paths like /r4
				const authorityRoot = fhirBaseUrlObj.origin.endsWith('/')
					? fhirBaseUrlObj.origin
					: `${fhirBaseUrlObj.origin}/`
				wellKnownUrl = new URL('.well-known/smart-configuration', authorityRoot).toString()
			} catch (e: any) {
				throw new SmartClientInitializationError(
					`Invalid fhirBaseUrl: ${this.config.fhirBaseUrl}. Could not construct .well-known/smart-configuration URL.`,
					{ cause: e }
				)
			}
		} else {
			throw new SmartClientInitializationError(
				'Cannot determine .well-known/smart-configuration URL: issUrl or fhirBaseUrl must be provided for discovery.'
			)
		}

		try {
			const response = await this.httpClient.get<SmartConfiguration>(wellKnownUrl, {
				headers: { Accept: 'application/json' },
			})
			this.smartConfiguration = response.data

			if (!this.smartConfiguration?.token_endpoint) {
				throw new SmartClientInitializationError(
					'Invalid SMART configuration: token_endpoint is missing.'
				)
			}

			// Validate server capabilities for asymmetric client authentication
			if (
				this.smartConfiguration.token_endpoint_auth_methods_supported &&
				!this.smartConfiguration.token_endpoint_auth_methods_supported.includes('private_key_jwt')
			) {
				// Log a warning or throw an error if strict conformance is required by the application
				console.warn(
					`SMART configuration warning: Server does not explicitly list 'private_key_jwt' in token_endpoint_auth_methods_supported. Found: [${this.smartConfiguration.token_endpoint_auth_methods_supported.join(', ')}]. Proceeding with asymmetric authentication.`
				)
			}

			if (
				this.smartConfiguration.token_endpoint_auth_signing_alg_values_supported &&
				!this.smartConfiguration.token_endpoint_auth_signing_alg_values_supported.includes(
					this.config.signingAlgorithm!
				)
			) {
				// Log a warning or throw an error
				console.warn(
					`SMART configuration warning: The configured signing algorithm '${this.config.signingAlgorithm}' is not listed in server's token_endpoint_auth_signing_alg_values_supported. Supported: [${this.smartConfiguration.token_endpoint_auth_signing_alg_values_supported.join(', ')}]. Ensure the server supports the configured algorithm.`
				)
			}
		} catch (error: any) {
			const details = error.response?.data ? { responseData: error.response.data } : {}
			throw new SmartClientInitializationError(
				`Failed to fetch SMART configuration from ${wellKnownUrl}: ${error.message}`,
				{ cause: error, details }
			)
		}
	}

	/**
	 * Retrieves an access token. If a valid token exists and is not expired, it returns the cached token.
	 * Otherwise, it requests a new token from the FHIR authorization server.
	 * @param {boolean} [forceRefresh=false] - If true, forces a new token request even if a cached token exists.
	 * @returns {Promise<string>} The access token.
	 * @throws {SmartClientAuthenticationError} If token acquisition fails or client is not initialized.
	 */
	public async getAccessToken(forceRefresh: boolean = false): Promise<string> {
		if (!this.smartConfiguration?.token_endpoint) {
			throw new SmartClientAuthenticationError(
				'SmartClient not properly initialized or token_endpoint is missing. Call static init() method first.'
			)
		}

		if (
			!forceRefresh &&
			this.tokenResponse?.access_token &&
			this.tokenExpiryTime &&
			Date.now() < this.tokenExpiryTime
		) {
			return this.tokenResponse.access_token
		}

		try {
			const signedJwt = await this.createClientAssertion()
			const tokenRequestBody = new URLSearchParams({
				grant_type: 'client_credentials',
				client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
				client_assertion: signedJwt,
				scope: this.config.scope,
			})

			const response = await this.httpClient.post<TokenResponse>(
				this.smartConfiguration.token_endpoint,
				tokenRequestBody.toString(),
				{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Accept: 'application/json',
					},
				}
			)

			this.tokenResponse = response.data
			if (!this.tokenResponse.access_token || typeof this.tokenResponse.expires_in !== 'number') {
				throw new SmartClientAuthenticationError(
					'Received invalid token response from server: access_token or expires_in missing/invalid.',
					{ details: this.tokenResponse }
				)
			}
			// expires_in is in seconds, calculate expiry time in ms
			// Add a small buffer (e.g., 30-60 seconds) to request a new token before actual expiry
			const safetyBufferSeconds = 60 // Use token for (expires_in - buffer) seconds
			this.tokenExpiryTime =
				Date.now() + (this.tokenResponse.expires_in - safetyBufferSeconds) * 1000

			return this.tokenResponse.access_token
		} catch (error: any) {
			const errorDetails = error.response?.data
				? { responseData: error.response.data, status: error.response.status }
				: {}
			let errorMessage = `Failed to obtain access token: ${error.message}`
			if (error.response?.data?.error_description) {
				errorMessage = `Failed to obtain access token: ${error.response.data.error_description} (Code: ${error.response.data.error})`
			} else if (error.response?.status) {
				errorMessage = `Failed to obtain access token: Server responded with status ${error.response.status}`
			}
			throw new SmartClientAuthenticationError(errorMessage, {
				cause: error,
				details: errorDetails,
			})
		}
	}

	/**
	 * Creates a signed JWT assertion for client authentication.
	 * @returns {Promise<string>} The signed JWT.
	 * @throws {SmartClientAuthenticationError} If JWT creation or signing fails, or if client is not initialized.
	 */
	private async createClientAssertion(): Promise<string> {
		if (!this.smartConfiguration?.token_endpoint) {
			throw new SmartClientAuthenticationError(
				'Token endpoint URL is not available. Initialize the client by calling static init() method.'
			)
		}

		const { clientId, iss, privateKey, kid, jwksUrl, signingAlgorithm, jwtLifetime } = this.config
		const now = Math.floor(Date.now() / 1000)
		const expirationTime = now + (jwtLifetime as number)

		const payload = {
			iss: iss,
			sub: clientId,
			aud: this.smartConfiguration.token_endpoint,
			exp: expirationTime,
			jti: uuidv4(),
		}

		try {
			// eslint-disable-next-line @typescript-eslint/consistent-type-imports
			let keyObject: import('jose').KeyLike
			// Attempt to parse privateKey as JWK first
			try {
				const jwk = JSON.parse(privateKey)
				// Basic check to differentiate from a PEM string that might be JSON-escaped
				if (jwk && typeof jwk === 'object' && jwk.kty) {
					// eslint-disable-next-line @typescript-eslint/consistent-type-imports
					keyObject = (await importJWK(jwk, signingAlgorithm as string)) as import('jose').KeyLike
				} else {
					// If not a valid JWK object, assume PKCS8 PEM
					keyObject = (await importPKCS8(
						privateKey,
						signingAlgorithm as string
						// eslint-disable-next-line @typescript-eslint/consistent-type-imports
					)) as import('jose').KeyLike
				}
			} catch (e) {
				// If JSON.parse fails or it's not a JWK, assume PKCS8 PEM format
				keyObject = (await importPKCS8(
					privateKey,
					signingAlgorithm as string
					// eslint-disable-next-line @typescript-eslint/consistent-type-imports
				)) as import('jose').KeyLike
			}

			const jwtBuilder = new SignJWT(payload)
				.setProtectedHeader({
					alg: signingAlgorithm as string,
					typ: 'JWT',
					...(kid && { kid }),
					...(jwksUrl && { jku: jwksUrl }),
				})
				.setIssuedAt(now)

			return await jwtBuilder.sign(keyObject)
		} catch (error: any) {
			throw new SmartClientAuthenticationError(
				`Failed to create or sign JWT assertion: ${error.message}`,
				{ cause: error }
			)
		}
	}

	/**
	 * Makes a generic FHIR API request.
	 * @param {string} resourcePath - The path to the FHIR resource (e.g., "Patient/123", "Observation?patient=123").
	 *                                This path is relative to the `fhirBaseUrl`.
	 * @param {'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'} [method='GET'] - The HTTP method.
	 * @param {object} [data] - The request body for POST, PUT, PATCH.
	 * @param {object} [params] - URL query parameters.
	 * @returns {Promise<T>} The FHIR resource or API response data.
	 * @throws {SmartClientRequestError} If the request fails or fhirBaseUrl is not configured.
	 * @throws {SmartClientAuthenticationError} If token refresh is needed and fails, or initial token was invalid.
	 * @template T The expected response data type.
	 */
	public async request<T = any>(
		resourcePath: string,
		method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
		data?: object,
		params?: object
	): Promise<T> {
		if (!this.config.fhirBaseUrl) {
			throw new SmartClientRequestError('fhirBaseUrl is not configured. Cannot make FHIR requests.')
		}
		if (!this.smartConfiguration) {
			throw new SmartClientRequestError('Client not initialized. Call static init() method first.')
		}

		try {
			const accessToken = await this.getAccessToken()
			const response = await this.httpClient.request<T>({
				url: resourcePath, // This will be appended to httpClient's baseURL (fhirBaseUrl)
				method,
				headers: {
					Authorization: `Bearer ${accessToken}`,
					Accept: 'application/fhir+json',
					...((method === 'POST' || method === 'PUT' || method === 'PATCH') &&
						data && { 'Content-Type': 'application/fhir+json;charset=utf-8' }),
				},
				data,
				params,
			})
			return response.data
		} catch (error: any) {
			let errorMessage = `FHIR API request to '${resourcePath}' failed: ${error.message}`
			let errorDetails: any = { requestPath: resourcePath, requestMethod: method }

			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<any>
				if (axiosError.response) {
					errorMessage = `FHIR API request to '${resourcePath}' failed with status ${axiosError.response.status}: ${axiosError.message}`
					errorDetails.status = axiosError.response.status
					errorDetails.responseData = axiosError.response.data

					// Check for OperationOutcome in FHIR error responses
					if (axiosError.response.data?.resourceType === 'OperationOutcome') {
						errorMessage = `FHIR API error for '${resourcePath}' (Status ${axiosError.response.status}): ${this.formatOperationOutcome(axiosError.response.data)}`
					}

					// If the error is 401 (Unauthorized) or 403 (Forbidden), it might be due to an expired/invalid token.
					// Attempt to get a new token and retry ONCE.
					if (
						(axiosError.response.status === 401 || axiosError.response.status === 403) &&
						!params?.['_retryAttempted']
					) {
						console.warn(
							`FHIR request received ${axiosError.response.status}. Attempting to refresh token and retry.`
						)
						try {
							// Force refresh the token
							const newAccessToken = await this.getAccessToken(true)
							// Retry the original request directly with the new token
							const retryResponse = await this.httpClient.request<T>({
								url: resourcePath,
								method,
								headers: {
									Authorization: `Bearer ${newAccessToken}`,
									Accept: 'application/fhir+json',
									...((method === 'POST' || method === 'PUT' || method === 'PATCH') &&
										data && { 'Content-Type': 'application/fhir+json;charset=utf-8' }),
								},
								data,
								params: { ...params, _retryAttempted: true },
							})
							return retryResponse.data
						} catch (retryError: any) {
							let finalErrorMessage = `FHIR API request to '${resourcePath}' failed after retry: ${retryError.message}`
							let finalErrorCause = retryError
							let finalErrorDetails = (retryError as SmartClientError).details || errorDetails

							if (retryError instanceof SmartClientAuthenticationError) {
								finalErrorMessage = `Authentication failed during retry for '${resourcePath}': ${retryError.message}`
								throw new SmartClientAuthenticationError(finalErrorMessage, {
									cause: finalErrorCause,
									details: finalErrorDetails,
								})
							} else if (isAxiosError(retryError) && retryError.response) {
								// If retry itself was an Axios error (e.g. server still returns error after new token)
								finalErrorMessage = `FHIR API request to '${resourcePath}' failed on retry with status ${retryError.response.status}: ${retryError.message}`
								finalErrorDetails = {
									requestPath: resourcePath,
									requestMethod: method,
									status: retryError.response.status,
									responseData: retryError.response.data,
								}
								if (retryError.response.data?.resourceType === 'OperationOutcome') {
									finalErrorMessage = `FHIR API error on retry for '${resourcePath}' (Status ${retryError.response.status}): ${this.formatOperationOutcome(retryError.response.data)}`
								}
							}
							// Default to throwing SmartClientRequestError for other retry failures
							throw new SmartClientRequestError(finalErrorMessage, {
								cause: finalErrorCause,
								details: finalErrorDetails,
							})
						}
					}
				}
			} else if (error instanceof SmartClientAuthenticationError) {
				// Propagate authentication errors from getAccessToken if it was the source of the initial error
				throw error
			}
			// Fallback for non-Axios errors or Axios errors without a response property
			throw new SmartClientRequestError(errorMessage, { cause: error, details: errorDetails })
		}
	}

	/**
	 * Formats an OperationOutcome resource into a human-readable string.
	 * @param {any} operationOutcome - The FHIR OperationOutcome resource.
	 * @returns {string} A formatted error message string.
	 */
	private formatOperationOutcome(operationOutcome: any): string {
		if (operationOutcome?.issue && Array.isArray(operationOutcome.issue)) {
			return operationOutcome.issue
				.map(
					(iss: any) =>
						`[${iss.severity}/${iss.code}] ${iss.diagnostics || iss.details?.text || 'No details provided.'}`
				)
				.join('; ')
		}
		return 'OperationOutcome received, but issues are not in the expected format.'
	}

	/**
	 * Convenience method for making a GET request to a FHIR resource.
	 * @param {string} resourcePath - The path to the FHIR resource (e.g., "Patient/123").
	 * @param {object} [params] - URL query parameters.
	 * @returns {Promise<T>} The FHIR resource.
	 * @template T The expected response data type.
	 */
	public async get<T = any>(resourcePath: string, params?: object): Promise<T> {
		return this.request<T>(resourcePath, 'GET', undefined, params)
	}

	/**
	 * Convenience method for making a POST request to create a FHIR resource.
	 * @param {string} resourcePath - The path to the FHIR resource type (e.g., "Patient").
	 * @param {object} data - The FHIR resource to create.
	 * @returns {Promise<T>} The created FHIR resource, typically including its new ID.
	 * @template T The expected response data type.
	 */
	public async post<T = any>(resourcePath: string, data: object): Promise<T> {
		return this.request<T>(resourcePath, 'POST', data)
	}

	/**
	 * Convenience method for making a PUT request to update a FHIR resource.
	 * @param {string} resourcePath - The path to the FHIR resource (e.g., "Patient/123").
	 * @param {object} data - The FHIR resource data to update.
	 * @returns {Promise<T>} The updated FHIR resource.
	 * @template T The expected response data type.
	 */
	public async put<T = any>(resourcePath: string, data: object): Promise<T> {
		return this.request<T>(resourcePath, 'PUT', data)
	}

	/**
	 * Convenience method for making a DELETE request to remove a FHIR resource.
	 * @param {string} resourcePath - The path to the FHIR resource (e.g., "Patient/123").
	 * @returns {Promise<T>} Typically an OperationOutcome or no content.
	 * @template T The expected response data type.
	 */
	public async delete<T = any>(resourcePath: string): Promise<T> {
		return this.request<T>(resourcePath, 'DELETE')
	}

	/**
	 * Convenience method for making a PATCH request to partially update a FHIR resource.
	 * @param {string} resourcePath - The path to the FHIR resource (e.g., "Patient/123").
	 * @param {object} data - The patch operations (e.g., JSON Patch as per RFC 6902, or FHIR Patch).
	 *                        Ensure 'Content-Type' reflects the patch type if not 'application/fhir+json'.
	 * @returns {Promise<T>} The updated FHIR resource.
	 * @template T The expected response data type.
	 */
	public async patch<T = any>(resourcePath: string, data: object): Promise<T> {
		// For PATCH, Content-Type might vary (e.g., application/json-patch+json).
		// The generic request method sets 'application/fhir+json'.
		// If a different patch type is needed, the `request` method might need adjustment
		// or this patch method should handle headers more specifically.
		// For now, assuming FHIR Patch with fhir+json.
		return this.request<T>(resourcePath, 'PATCH', data)
	}

	/**
	 * Returns the current SMART configuration if fetched.
	 * @returns {SmartConfiguration | undefined} The SMART configuration object or undefined.
	 */
	public getSmartConfiguration(): SmartConfiguration | undefined {
		return this.smartConfiguration
	}

	/**
	 * Returns the current raw token response if available.
	 * Useful for debugging or accessing non-standard token properties.
	 * @returns {TokenResponse | undefined} The token response object or undefined.
	 */
	public getCurrentTokenResponse(): TokenResponse | undefined {
		return this.tokenResponse
	}
}
