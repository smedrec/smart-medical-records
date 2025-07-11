import axios from 'axios'
import { importJWK, importPKCS8, SignJWT } from 'jose'
import { v4 as uuidv4 } from 'uuid'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { SmartClient } from '../client'
import {
	SmartClientAuthenticationError,
	SmartClientInitializationError,
	SmartClientRequestError,
} from '../types'

import type { SmartClientConfig, SmartConfiguration, TokenResponse } from '../types'

// Mock 'axios'
vi.mock('axios', async (importOriginal) => {
	const actualAxios = await importOriginal<typeof axios>()
	const mockDefault = {
		create: vi.fn().mockReturnThis(),
		get: vi.fn(),
		post: vi.fn(),
		request: vi.fn(),
		// Also provide isAxiosError on the default export for the mock,
		// in case the transpiled/old code being tested still tries to access it via axios.isAxiosError
		isAxiosError: actualAxios.isAxiosError,
	}
	return {
		// Named exports
		isAxiosError: actualAxios.isAxiosError,
		// Default export
		default: mockDefault,
		// Allow access to mocked default properties directly on the module mock too
		// e.g. if some code was doing `import * as axiosAliased from 'axios'; axiosAliased.isAxiosError()`
		// though the client code is not doing this. This is more for robustness of the mock.
		...mockDefault,
	}
})

// Mock 'jose'
// We only need to mock the functions SmartClient uses directly
vi.mock('jose', async (importOriginal) => {
	const actualJose = await importOriginal<typeof import('jose')>()
	return {
		...actualJose,
		SignJWT: vi.fn().mockImplementation(() => ({
			setProtectedHeader: vi.fn().mockReturnThis(),
			setIssuedAt: vi.fn().mockReturnThis(),
			sign: vi.fn().mockResolvedValue('mocked.signed.jwt'),
		})),
		importPKCS8: vi.fn().mockResolvedValue({} as CryptoKey), // Mocked CryptoKey
		importJWK: vi.fn().mockResolvedValue({} as CryptoKey), // Mocked CryptoKey
	}
})

// Mock 'uuid'
vi.mock('uuid', () => ({
	v4: vi.fn(() => 'mocked-uuid-v4'),
}))

const mockAxiosInstance = axios as any // To access the mocked methods

// A sample RSA private key in PKCS8 PEM format for testing purposes.
// In a real scenario, this would be a securely generated key.
// This is a placeholder and might not be a valid key for actual crypto operations
// if not for the mocks of 'jose'.
const TEST_PRIVATE_KEY_PEM = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7V3P8Wn7FHzL5
... (rest of a dummy key) ...
-----END PRIVATE KEY-----`

const TEST_PRIVATE_KEY_JWK = {
	kty: 'RSA',
	n: 'u1dz_Fp-xR8y-Rh_dW7ck7Kz22A8wf-kN7Wi5CWvhFG2_Y7nQp1lDpb2IKMQr-Q4n_vgJ6d5rWPspJpSPY7iffUK4ipQCEbzID5DJ6fQMBZOfCTXyxkuMh3jYGKEF3Ziw2oxbM1H9j-eJAPtrj5stUG6kVoXowegdox-bSjWP0iI5PnkwUNzcekLMug4M3LRluEQgGR9O_BAML6-w3igZ_rZA_gunyrLAMbfmCVaceW5ohLp679kyM7U6W2gDK_NbkDKcINUakVmPeoG5h8RzgGzvGrySR0k0VDFiZv60Ua07DqHTeDGH9e4NV07AECae-oykIj5NDCs3pw',
	e: 'AQAB',
	d: 'example-d-value', // This would be the private exponent
	p: 'example-p-value',
	q: 'example-q-value',
	dp: 'example-dp-value',
	dq: 'example-dq-value',
	qi: 'example-qi-value',
	alg: 'RS384',
	kid: 'test-kid-jwk',
}

const BASE_CONFIG: SmartClientConfig = {
	clientId: 'test-client-id',
	iss: 'test-client-id', // Must be same as clientId for this flow
	scope: 'system/Observation.read system/Patient.read',
	privateKey: TEST_PRIVATE_KEY_PEM,
	fhirBaseUrl: 'https://fhir.example.com/r4',
	kid: 'test-kid-pem',
}

const SMART_CONFIGURATION_MOCK: SmartConfiguration = {
	token_endpoint: 'https://auth.example.com/token',
	token_endpoint_auth_methods_supported: ['private_key_jwt'],
	token_endpoint_auth_signing_alg_values_supported: ['RS384', 'ES384'],
	scopes_supported: ['system/Observation.read', 'system/Patient.read', 'openid', 'fhirUser'],
	response_types_supported: ['code', 'token'],
	capabilities: ['launch-ehr', 'client-confidential-asymmetric'],
}

const TOKEN_RESPONSE_MOCK: TokenResponse = {
	access_token: 'mocked_access_token_123',
	token_type: 'Bearer',
	expires_in: 300,
	scope: 'system/Observation.read system/Patient.read',
}

describe('SmartClient', () => {
	beforeEach(() => {
		vi.clearAllMocks() // Clear mocks before each test

		// Reset axios mocks to default behavior for each test
		mockAxiosInstance.get.mockReset()
		mockAxiosInstance.post.mockReset()
		mockAxiosInstance.request.mockReset()

		// Default successful smart configuration fetch
		mockAxiosInstance.get.mockImplementation((url: string) => {
			if (url.includes('.well-known/smart-configuration')) {
				return Promise.resolve({ data: SMART_CONFIGURATION_MOCK, status: 200 })
			}
			return Promise.reject(new Error(`Unhandled GET request to ${url}`))
		})
		// Default successful token post
		mockAxiosInstance.post.mockResolvedValue({ data: TOKEN_RESPONSE_MOCK, status: 200 })
	})

	describe('Constructor', () => {
		it('should create an instance with valid config', () => {
			const client = new SmartClient(BASE_CONFIG)
			expect(client).toBeInstanceOf(SmartClient)
		})

		it('should throw SmartClientInitializationError if config is missing', () => {
			expect(() => new SmartClient(undefined as any)).toThrow(SmartClientInitializationError)
			expect(() => new SmartClient(undefined as any)).toThrow('SmartClientConfig is required.')
		})

		it('should throw SmartClientInitializationError for invalid config (missing required fields)', () => {
			const invalidConfigs = [
				{ ...BASE_CONFIG, clientId: '' },
				{ ...BASE_CONFIG, iss: '' },
				{ ...BASE_CONFIG, scope: '' },
				{ ...BASE_CONFIG, privateKey: '' },
			]
			invalidConfigs.forEach((config) => {
				expect(() => new SmartClient(config)).toThrow(SmartClientInitializationError)
				expect(() => new SmartClient(config)).toThrow(
					'Invalid SmartClientConfig: clientId, iss, scope, and privateKey are required.'
				)
			})
		})

		it('should throw SmartClientInitializationError if iss and clientId are not identical', () => {
			const configWithMismatch = { ...BASE_CONFIG, iss: 'mismatched-iss' }
			expect(() => new SmartClient(configWithMismatch)).toThrow(SmartClientInitializationError)
			expect(() => new SmartClient(configWithMismatch)).toThrow(
				'Invalid SmartClientConfig: iss and clientId must be identical for this authentication flow.'
			)
		})

		it('should set default signingAlgorithm and jwtLifetime if not provided', () => {
			const client = new SmartClient(BASE_CONFIG)
			// Access private config for testing - not ideal but necessary here or use getters
			expect((client as any).config.signingAlgorithm).toBe('RS384')
			expect((client as any).config.jwtLifetime).toBe(300)
		})

		it('should use provided signingAlgorithm and jwtLifetime', () => {
			const client = new SmartClient({
				...BASE_CONFIG,
				signingAlgorithm: 'ES384',
				jwtLifetime: 600,
			})
			expect((client as any).config.signingAlgorithm).toBe('ES384')
			expect((client as any).config.jwtLifetime).toBe(600)
		})
	})

	describe('init() static method', () => {
		it('should initialize successfully and fetch SMART configuration via fhirBaseUrl', async () => {
			const client = await SmartClient.init(BASE_CONFIG)
			expect(client).toBeInstanceOf(SmartClient)
			expect(mockAxiosInstance.get).toHaveBeenCalledWith(
				'https://fhir.example.com/.well-known/smart-configuration', // Note: origin based
				{ headers: { Accept: 'application/json' } }
			)
			expect(client.getSmartConfiguration()).toEqual(SMART_CONFIGURATION_MOCK)
		})

		it('should initialize successfully and fetch SMART configuration via explicit issUrl', async () => {
			const issUrl = 'https://auth.custom.com/fhir'
			const client = await SmartClient.init(BASE_CONFIG, issUrl)
			expect(client).toBeInstanceOf(SmartClient)
			expect(mockAxiosInstance.get).toHaveBeenCalledWith(
				`${issUrl}/.well-known/smart-configuration`,
				{ headers: { Accept: 'application/json' } }
			)
			expect(client.getSmartConfiguration()).toEqual(SMART_CONFIGURATION_MOCK)
		})

		it('should correctly construct wellKnownUrl from fhirBaseUrl with path', async () => {
			const configWithPath = { ...BASE_CONFIG, fhirBaseUrl: 'https://fhir.example.com/test/r4/' }
			await SmartClient.init(configWithPath)
			expect(mockAxiosInstance.get).toHaveBeenCalledWith(
				'https://fhir.example.com/.well-known/smart-configuration', // Should be at the origin
				expect.anything()
			)
		})

		it('should throw SmartClientInitializationError if fhirBaseUrl and issUrl are missing for discovery', async () => {
			const configNoUrls = { ...BASE_CONFIG, fhirBaseUrl: undefined }
			await expect(SmartClient.init(configNoUrls, undefined)).rejects.toThrow(
				SmartClientInitializationError
			)
			await expect(SmartClient.init(configNoUrls, undefined)).rejects.toThrow(
				'Cannot determine .well-known/smart-configuration URL: issUrl or fhirBaseUrl must be provided for discovery.'
			)
		})

		it('should throw SmartClientInitializationError if SMART config fetch fails', async () => {
			mockAxiosInstance.get.mockReset().mockRejectedValueOnce(new Error('Network Error'))
			await expect(SmartClient.init(BASE_CONFIG)).rejects.toThrow(
				/Failed to fetch SMART configuration from .* Network Error/
			)
		})

		it('should throw SmartClientInitializationError if SMART config is missing token_endpoint', async () => {
			mockAxiosInstance.get.mockReset().mockResolvedValueOnce({
				data: { ...SMART_CONFIGURATION_MOCK, token_endpoint: undefined },
			})
			await expect(SmartClient.init(BASE_CONFIG)).rejects.toThrow(
				'Invalid SMART configuration: token_endpoint is missing.'
			)
		})

		it('should log a warning if private_key_jwt is not in token_endpoint_auth_methods_supported', async () => {
			const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
			mockAxiosInstance.get.mockResolvedValueOnce({
				data: {
					...SMART_CONFIGURATION_MOCK,
					token_endpoint_auth_methods_supported: ['client_secret_basic'],
				},
			})
			await SmartClient.init(BASE_CONFIG)
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining(
					"Server does not explicitly list 'private_key_jwt' in token_endpoint_auth_methods_supported"
				)
			)
			consoleWarnSpy.mockRestore()
		})

		it('should log a warning if configured signing algorithm is not in token_endpoint_auth_signing_alg_values_supported', async () => {
			const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
			mockAxiosInstance.get.mockResolvedValueOnce({
				data: {
					...SMART_CONFIGURATION_MOCK,
					token_endpoint_auth_signing_alg_values_supported: ['ES384'],
				},
			})
			// BASE_CONFIG uses RS384 by default
			await SmartClient.init(BASE_CONFIG)
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining(
					"configured signing algorithm 'RS384' is not listed in server's token_endpoint_auth_signing_alg_values_supported"
				)
			)
			consoleWarnSpy.mockRestore()
		})
	})

	describe('getAccessToken()', () => {
		let client: SmartClient

		beforeEach(async () => {
			// Initialize client for token tests
			client = await SmartClient.init(BASE_CONFIG)
			// Reset SignJWT mock for each token test to ensure clean state for `sign` call count
			;(SignJWT as any).mockImplementation(() => ({
				setProtectedHeader: vi.fn().mockReturnThis(),
				setIssuedAt: vi.fn().mockReturnThis(),
				sign: vi.fn().mockResolvedValue('mocked.signed.jwt'),
			}))
		})

		it('should request a new token successfully', async () => {
			const token = await client.getAccessToken()
			expect(token).toBe(TOKEN_RESPONSE_MOCK.access_token)
			expect(mockAxiosInstance.post).toHaveBeenCalledWith(
				SMART_CONFIGURATION_MOCK.token_endpoint,
				expect.any(String), // URLSearchParams string
				expect.objectContaining({
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Accept: 'application/json',
					},
				})
			)
			const params = new URLSearchParams(mockAxiosInstance.post.mock.calls[0][1])
			expect(params.get('grant_type')).toBe('client_credentials')
			expect(params.get('client_assertion_type')).toBe(
				'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'
			)
			expect(params.get('client_assertion')).toBe('mocked.signed.jwt')
			expect(params.get('scope')).toBe(BASE_CONFIG.scope)
			expect(client.getCurrentTokenResponse()).toEqual(TOKEN_RESPONSE_MOCK)
		})

		it('should use JWK private key if provided and parsed', async () => {
			const clientWithJwk = await SmartClient.init({
				...BASE_CONFIG,
				privateKey: JSON.stringify(TEST_PRIVATE_KEY_JWK),
			})
			await clientWithJwk.getAccessToken()
			expect(importJWK).toHaveBeenCalledWith(
				TEST_PRIVATE_KEY_JWK,
				BASE_CONFIG.signingAlgorithm || 'RS384'
			)
			expect(importPKCS8).not.toHaveBeenCalled()
		})

		it('should use PKCS8 private key if JWK parsing fails or not a JWK', async () => {
			await client.getAccessToken() // Uses BASE_CONFIG with PEM key
			expect(importPKCS8).toHaveBeenCalledWith(
				TEST_PRIVATE_KEY_PEM,
				BASE_CONFIG.signingAlgorithm || 'RS384'
			)
		})

		it('should return cached token if valid and not expired', async () => {
			await client.getAccessToken() // First call, fetches token
			expect(mockAxiosInstance.post).toHaveBeenCalledTimes(1)

			const token = await client.getAccessToken() // Second call
			expect(token).toBe(TOKEN_RESPONSE_MOCK.access_token)
			expect(mockAxiosInstance.post).toHaveBeenCalledTimes(1) // Should not call post again
		})

		it('should request a new token if cached token is expired', async () => {
			await client.getAccessToken() // First call
			expect(mockAxiosInstance.post).toHaveBeenCalledTimes(1)

			// Simulate time passing so token expires
			vi.useFakeTimers()
			vi.advanceTimersByTime((TOKEN_RESPONSE_MOCK.expires_in + 100) * 1000) // Advance past expiry + buffer

			await client.getAccessToken() // Should fetch new token
			expect(mockAxiosInstance.post).toHaveBeenCalledTimes(2)
			vi.useRealTimers()
		})

		it('should request a new token if forceRefresh is true', async () => {
			await client.getAccessToken() // First call
			expect(mockAxiosInstance.post).toHaveBeenCalledTimes(1)

			await client.getAccessToken(true) // Force refresh
			expect(mockAxiosInstance.post).toHaveBeenCalledTimes(2)
		})

		it('should throw SmartClientAuthenticationError if token endpoint post fails', async () => {
			mockAxiosInstance.post.mockReset().mockRejectedValueOnce(new Error('Token endpoint error'))
			await expect(client.getAccessToken(true)).rejects.toThrow( // forceRefresh = true
				'Failed to obtain access token: Token endpoint error'
			)
		})

		it('should throw SmartClientAuthenticationError with details from server error response', async () => {
			const errorResponse = {
				response: {
					data: { error: 'invalid_client', error_description: 'Client authentication failed' },
					status: 400,
				},
				message: 'Request failed with status code 400',
				isAxiosError: true, // Important for Axios error specific handling in client code
			}
			mockAxiosInstance.post.mockReset().mockRejectedValueOnce(errorResponse)
			await expect(client.getAccessToken(true)).rejects.toThrow( // forceRefresh = true
				'Failed to obtain access token: Client authentication failed (Code: invalid_client)'
			)
		})

		it('should throw SmartClientAuthenticationError if token response is invalid (missing access_token)', async () => {
			mockAxiosInstance.post.mockReset().mockResolvedValueOnce({
				data: { ...TOKEN_RESPONSE_MOCK, access_token: undefined },
			})
			await expect(client.getAccessToken(true)).rejects.toThrow( // forceRefresh = true
				'Received invalid token response from server: access_token or expires_in missing/invalid.'
			)
		})

		it('should throw SmartClientAuthenticationError if token response is invalid (missing expires_in)', async () => {
			mockAxiosInstance.post.mockReset().mockResolvedValueOnce({
				data: { ...TOKEN_RESPONSE_MOCK, expires_in: undefined },
			})
			await expect(client.getAccessToken(true)).rejects.toThrow( // forceRefresh = true
				'Received invalid token response from server: access_token or expires_in missing/invalid.'
			)
		})

		it('should throw SmartClientAuthenticationError if client is not initialized', async () => {
			const uninitializedClient = new SmartClient(BASE_CONFIG) // Not calling init()
			await expect(uninitializedClient.getAccessToken()).rejects.toThrow(
				SmartClientAuthenticationError
			)
			await expect(uninitializedClient.getAccessToken()).rejects.toThrow(
				'SmartClient not properly initialized or token_endpoint is missing.'
			)
		})

		it('should use configured kid and jwksUrl in JWT header', async () => {
			const configWithKidJku = {
				...BASE_CONFIG,
				kid: 'custom-kid',
				jwksUrl: 'https://client.example.com/jwks.json',
			}
			const clientWithKidJku = await SmartClient.init(configWithKidJku)

			// Spy on SignJWT().setProtectedHeader to check its argument
			const mockSignJwtInstance = {
				setProtectedHeader: vi.fn().mockReturnThis(),
				setIssuedAt: vi.fn().mockReturnThis(),
				sign: vi.fn().mockResolvedValue('mocked.signed.jwt.with.kid.jku'),
			}
			;(SignJWT as any).mockImplementation(() => mockSignJwtInstance)

			await clientWithKidJku.getAccessToken()

			expect(mockSignJwtInstance.setProtectedHeader).toHaveBeenCalledWith(
				expect.objectContaining({
					alg: configWithKidJku.signingAlgorithm || 'RS384',
					typ: 'JWT',
					kid: 'custom-kid',
					jku: 'https://client.example.com/jwks.json',
				})
			)
		})
	})

	describe('FHIR API requests (get, post, put, delete, patch)', () => {
		let client: SmartClient
		const resourcePath = 'Patient/123'
		const mockPatient = {
			resourceType: 'Patient',
			id: '123',
			name: [{ family: 'Test', given: ['User'] }],
		}

		beforeEach(async () => {
			client = await SmartClient.init(BASE_CONFIG)
			// Ensure JWT signing is mocked for these tests too if getAccessToken is called
			;(SignJWT as any).mockImplementation(() => ({
				setProtectedHeader: vi.fn().mockReturnThis(),
				setIssuedAt: vi.fn().mockReturnThis(),
				sign: vi.fn().mockResolvedValue('mocked.signed.jwt.for.fhir.request'),
			}))
		})

		it('get() should make a GET request with Authorization header', async () => {
			mockAxiosInstance.request.mockResolvedValueOnce({ data: mockPatient })
			const response = await client.get(resourcePath)
			expect(response).toEqual(mockPatient)
			expect(mockAxiosInstance.request).toHaveBeenCalledWith(
				expect.objectContaining({
					url: resourcePath,
					method: 'GET',
					headers: expect.objectContaining({
						Authorization: `Bearer ${TOKEN_RESPONSE_MOCK.access_token}`,
					}),
				})
			)
		})

		it('post() should make a POST request with Authorization header and body', async () => {
			mockAxiosInstance.request.mockResolvedValueOnce({ data: { ...mockPatient, id: 'new-id' } })
			const newPatientData = { resourceType: 'Patient', name: [{ family: 'New', given: ['User'] }] }
			const response = await client.post('Patient', newPatientData)
			expect(response).toEqual({ ...mockPatient, id: 'new-id' })
			expect(mockAxiosInstance.request).toHaveBeenCalledWith(
				expect.objectContaining({
					url: 'Patient',
					method: 'POST',
					headers: expect.objectContaining({
						Authorization: `Bearer ${TOKEN_RESPONSE_MOCK.access_token}`,
					}),
					data: newPatientData,
				})
			)
		})

		// Similar tests for put(), delete(), patch()

		it('should throw SmartClientRequestError if fhirBaseUrl is not configured', async () => {
			const configNoFhirBase = { ...BASE_CONFIG, fhirBaseUrl: undefined }
			const clientNoBase = new SmartClient(configNoFhirBase)
			// Need to manually set smartConfiguration as init won't fully run without fhirBaseUrl for discovery (or issUrl)
			;(clientNoBase as any).smartConfiguration = SMART_CONFIGURATION_MOCK

			await expect(clientNoBase.get(resourcePath)).rejects.toThrow(SmartClientRequestError)
			await expect(clientNoBase.get(resourcePath)).rejects.toThrow('fhirBaseUrl is not configured.')
		})

		it('should throw SmartClientRequestError if client not initialized (no smartConfiguration)', async () => {
			const uninitializedClient = new SmartClient(BASE_CONFIG)
			// Not calling init, so smartConfiguration is undefined
			await expect(uninitializedClient.get(resourcePath)).rejects.toThrow(SmartClientRequestError)
			await expect(uninitializedClient.get(resourcePath)).rejects.toThrow(
				'Client not initialized. Call static init() method first.'
			)
		})

		it('should retry request once on 401 error and succeed if new token works', async () => {
			// First call to /request results in 401
			mockAxiosInstance.request.mockRejectedValueOnce({
				isAxiosError: true,
				response: { status: 401, data: { message: 'Unauthorized' } },
				message: 'Request failed with status 401',
			})
			// Second call to /request (after token refresh) succeeds
			mockAxiosInstance.request.mockResolvedValueOnce({ data: mockPatient })

			// Mock getAccessToken to be called twice: once for initial, once for refresh
			const getAccessTokenSpy = vi.spyOn(client, 'getAccessToken')

			const response = await client.get(resourcePath)
			expect(response).toEqual(mockPatient)
			expect(getAccessTokenSpy).toHaveBeenCalledTimes(2) // Initial attempt + retry attempt
			expect(getAccessTokenSpy).toHaveBeenCalledWith(true) // Force refresh on retry
			expect(mockAxiosInstance.request).toHaveBeenCalledTimes(2) // Original failed, then retried
		})

		it('should throw SmartClientAuthenticationError if retry on 401 also fails due to token issue', async () => {
			const error401 = new Error('Request failed with status 401');
			(error401 as any).isAxiosError = true;
			(error401 as any).response = { status: 401, data: { message: 'Token expired' } };
			mockAxiosInstance.request.mockRejectedValueOnce(error401)

			// Mock getAccessToken (forceRefresh=true) to also fail
			const getAccessTokenSpy = vi
				.spyOn(client, 'getAccessToken')
				.mockImplementationOnce(() => {
					// This is the first call to getAccessToken in the try block of request()
					return Promise.resolve(TOKEN_RESPONSE_MOCK.access_token)
				})
				.mockRejectedValueOnce(new SmartClientAuthenticationError('Token refresh failed')) // This is for the retry call

			await expect(client.get(resourcePath)).rejects.toThrow('Authentication failed during retry')
			expect(getAccessTokenSpy).toHaveBeenCalledTimes(2)
		})

		it('should throw SmartClientRequestError if API request fails with non-401/403 error', async () => {
			const error500 = new Error('Request failed with status 500');
			(error500 as any).isAxiosError = true;
			(error500 as any).response = { status: 500, data: { message: 'Server Error' } };
			mockAxiosInstance.request.mockRejectedValueOnce(error500)

			await expect(client.get(resourcePath)).rejects.toThrow(
				"FHIR API request to 'Patient/123' failed with status 500: Request failed with status 500"
			)
		})

		it('should format OperationOutcome in error message if present', async () => {
			const operationOutcomeError = {
				resourceType: 'OperationOutcome',
				issue: [
					{
						severity: 'error',
						code: 'processing',
						diagnostics: 'Detailed error diagnostic message.',
					},
				],
			}
			const error400_opOutcome = new Error('Request failed with status 400');
			(error400_opOutcome as any).isAxiosError = true;
			(error400_opOutcome as any).response = { status: 400, data: operationOutcomeError };
			mockAxiosInstance.request.mockRejectedValueOnce(error400_opOutcome)

			await expect(client.get(resourcePath)).rejects.toThrow(
				"FHIR API error for 'Patient/123' (Status 400): [error/processing] Detailed error diagnostic message."
			)
		})
	})

	describe('getSmartConfiguration() and getCurrentTokenResponse()', () => {
		it('getSmartConfiguration() should return undefined before init', () => {
			const client = new SmartClient(BASE_CONFIG)
			expect(client.getSmartConfiguration()).toBeUndefined()
		})

		it('getSmartConfiguration() should return the fetched configuration after init', async () => {
			const client = await SmartClient.init(BASE_CONFIG)
			expect(client.getSmartConfiguration()).toEqual(SMART_CONFIGURATION_MOCK)
		})

		it('getCurrentTokenResponse() should return undefined before token acquisition', async () => {
			const client = await SmartClient.init(BASE_CONFIG)
			expect(client.getCurrentTokenResponse()).toBeUndefined()
		})

		it('getCurrentTokenResponse() should return the token response after successful acquisition', async () => {
			const client = await SmartClient.init(BASE_CONFIG)
			await client.getAccessToken()
			expect(client.getCurrentTokenResponse()).toEqual(TOKEN_RESPONSE_MOCK)
		})
	})
})
