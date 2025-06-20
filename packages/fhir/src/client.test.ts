import FHIR from 'fhirclient' // Actual import to spy on/mock parts of it
import createOpenApiFetchClient from 'openapi-fetch' // Actual import to mock its default export
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
	authorizeSmartClient,
	createSmartFhirClient,
	generatePkceChallenge,
	generateRandomString,
} from './client'

import type { SmartFhirClientEnvOptions, SmartFhirClientOptions } from './client'

// Mock fhirclient parts
vi.mock('fhirclient', async (importOriginal) => {
	const actual = await importOriginal<typeof FHIR>()
	return {
		...actual, // Use actual for things not explicitly mocked, like types
		default: {
			// Assuming FHIR is the default export
			...actual.default,
			oauth2: {
				...actual.default?.oauth2,
				utils: {
					...actual.default?.oauth2?.utils,
					getWellKnownSMARTConfig: vi.fn(),
				},
				ready: vi.fn(),
			},
		},
	}
})

// Mock openapi-fetch
vi.mock('openapi-fetch', () => ({
	default: vi.fn().mockReturnValue({ use: vi.fn(), GET: vi.fn(), POST: vi.fn(), PUT: vi.fn() }),
}))

// Mock global crypto if not available or to make it deterministic
const mockCrypto = {
	getRandomValues: vi.fn((array: Uint8Array) => {
		for (let i = 0; i < array.length; i++) {
			array[i] = i + 1 // Fill with predictable values
		}
		return array
	}),
	subtle: {
		digest: vi.fn(async (algorithm: string, data: Uint8Array) => {
			// Simple mock hash: just reverse the data and convert to ArrayBuffer
			const reversed = data.slice().reverse()
			return reversed.buffer
		}),
	},
}

// Vitest doesn't automatically provide `crypto` in globalThis for Node env unless configured.
// For Cloudflare Workers, `crypto` is global.
// Let's ensure our mock is used if global.crypto is not fully there or for predictability.
if (!globalThis.crypto || !globalThis.crypto.subtle) {
	// @ts-ignore
	globalThis.crypto = mockCrypto
} else {
	// If it exists, spy and mock parts for determinism
	vi.spyOn(globalThis.crypto, 'getRandomValues').mockImplementation(mockCrypto.getRandomValues)
	vi.spyOn(globalThis.crypto.subtle, 'digest').mockImplementation(mockCrypto.subtle.digest)
}

describe('FHIR Client - Unit Tests', () => {
	let mockSmartConfig: any
	let mockEnvOptions: SmartFhirClientEnvOptions

	beforeEach(() => {
		vi.clearAllMocks()

		mockSmartConfig = {
			authorization_endpoint: 'https://auth.example.com/authorize',
			token_endpoint: 'https://auth.example.com/token',
			// Add other fields if client.ts uses them from this config
		}

		// @ts-ignore - FHIR is mocked
		FHIR.oauth2.utils.getWellKnownSMARTConfig.mockResolvedValue(mockSmartConfig)

		mockEnvOptions = {
			SMART_CLIENT_ID: 'test-client-id',
			SMART_SCOPE: 'patient/*.read launch/patient',
			SMART_ISS: 'https://fhir.example.com/r4',
			SMART_REDIRECT_URI: 'https://app.example.com/auth/callback',
		}
	})

	describe('authorizeSmartClient', () => {
		it('should construct correct authorizeUrl and return verifier and state', async () => {
			const options: SmartFhirClientOptions = {
				env: mockEnvOptions,
				redirectUri: mockEnvOptions.SMART_REDIRECT_URI, // Explicitly pass for clarity in test
				// Other options like launch if needed
			}

			const result = await authorizeSmartClient(options)

			expect(FHIR.oauth2.utils.getWellKnownSMARTConfig).toHaveBeenCalledWith(
				mockEnvOptions.SMART_ISS
			)

			const authorizeUrl = new URL(result.authorizeUrl)
			expect(authorizeUrl.origin).toBe(
				mockSmartConfig.authorization_endpoint.substring(
					0,
					mockSmartConfig.authorization_endpoint.indexOf('/authorize')
				)
			)
			expect(authorizeUrl.pathname).toBe('/authorize')
			expect(authorizeUrl.searchParams.get('response_type')).toBe('code')
			expect(authorizeUrl.searchParams.get('client_id')).toBe(mockEnvOptions.SMART_CLIENT_ID)
			expect(authorizeUrl.searchParams.get('redirect_uri')).toBe(options.redirectUri)
			expect(authorizeUrl.searchParams.get('scope')).toBe(mockEnvOptions.SMART_SCOPE)
			expect(authorizeUrl.searchParams.get('state')).toBe(result.stateValue)
			expect(authorizeUrl.searchParams.get('aud')).toBe(mockEnvOptions.SMART_ISS)
			expect(authorizeUrl.searchParams.get('code_challenge_method')).toBe('S256')
			expect(authorizeUrl.searchParams.get('code_challenge')).toBeDefined()

			expect(result.codeVerifier).toBeDefined()
			expect(result.stateValue).toBeDefined()
			// Check if crypto mocks were used for deterministic values if needed
		})

		it('should throw if clientId is missing', async () => {
			const options: SmartFhirClientOptions = {
				env: { ...mockEnvOptions, SMART_CLIENT_ID: undefined },
			}
			await expect(authorizeSmartClient(options)).rejects.toThrow('SMART Client ID is required')
		})

		it('should throw if iss is missing', async () => {
			const options: SmartFhirClientOptions = { env: { ...mockEnvOptions, SMART_ISS: undefined } }
			await expect(authorizeSmartClient(options)).rejects.toThrow(
				'SMART ISS (FHIR Server URL) is required'
			)
		})

		it('should throw if getWellKnownSMARTConfig fails', async () => {
			// @ts-ignore
			FHIR.oauth2.utils.getWellKnownSMARTConfig.mockRejectedValueOnce(new Error('Network error'))
			const options: SmartFhirClientOptions = { env: mockEnvOptions }
			await expect(authorizeSmartClient(options)).rejects.toThrow(
				'Failed to fetch SMART configuration'
			)
		})
	})

	describe('createSmartFhirClient', () => {
		let mockRequest: Request
		let successfulReadyResponse: any

		beforeEach(() => {
			mockRequest = new Request(
				'https://app.example.com/auth/callback?code=test-code&state=test-state'
			) as Request
			successfulReadyResponse = {
				state: {
					tokenResponse: {
						access_token: 'mock-access-token',
						expires_in: 3600,
						id_token: 'mock-id-token', // For userId placeholder
						scope: 'patient/*.read launch/patient',
					},
					serverUrl: mockEnvOptions.SMART_ISS,
					clientId: mockEnvOptions.SMART_CLIENT_ID,
				},
				// Add other methods if fhirClient is used directly in worker.ts beyond openapi-fetch wrapper
			}
			// @ts-ignore
			FHIR.oauth2.ready.mockResolvedValue(successfulReadyResponse)
			// @ts-ignore
			createOpenApiFetchClient.mockReturnValue({ use: vi.fn() })
		})

		it('should successfully initialize client on valid callback', async () => {
			const options: SmartFhirClientOptions = {
				request: mockRequest,
				env: mockEnvOptions,
				pkceCodeVerifier: 'mock-pkce-verifier',
				expectedState: 'test-state',
			}

			const client = await createSmartFhirClient(options)

			expect(FHIR.oauth2.ready).toHaveBeenCalledWith(
				expect.objectContaining({
					code: 'test-code',
					state: 'test-state',
					pkceCode: 'mock-pkce-verifier',
					redirectUri: 'https://app.example.com/auth/callback', // Constructed from request
					clientId: mockEnvOptions.SMART_CLIENT_ID,
					scope: mockEnvOptions.SMART_SCOPE,
				})
			)
			expect(createOpenApiFetchClient).toHaveBeenCalledWith({ baseUrl: mockEnvOptions.SMART_ISS })
			expect(client.use).toHaveBeenCalled() // Middleware was applied
			// TODO: Test if the middleware correctly adds auth header (more involved mock of createOpenApiFetchClient)
		})

		it('should throw if state mismatch', async () => {
			const options: SmartFhirClientOptions = {
				request: mockRequest,
				env: mockEnvOptions,
				pkceCodeVerifier: 'mock-pkce-verifier',
				expectedState: 'different-state',
			}
			await expect(createSmartFhirClient(options)).rejects.toThrow(
				/Invalid state parameter received/
			)
		})

		it('should throw if code is missing from URL', async () => {
			const reqWithoutCode = new Request(
				'https://app.example.com/auth/callback?state=test-state'
			) as Request
			const options: SmartFhirClientOptions = {
				request: reqWithoutCode,
				env: mockEnvOptions,
				pkceCodeVerifier: 'mock-pkce-verifier',
				expectedState: 'test-state',
			}
			await expect(createSmartFhirClient(options)).rejects.toThrow(
				'Authorization code not found in request URL'
			)
		})

		it('should throw if pkceCodeVerifier is missing', async () => {
			const options: SmartFhirClientOptions = {
				request: mockRequest,
				env: mockEnvOptions,
				expectedState: 'test-state',
				// pkceCodeVerifier is missing
			}
			await expect(createSmartFhirClient(options)).rejects.toThrow(
				'PKCE code_verifier must be provided'
			)
		})

		it('should throw if FHIR.oauth2.ready fails', async () => {
			// @ts-ignore
			FHIR.oauth2.ready.mockRejectedValueOnce(new Error('Token exchange failed'))
			const options: SmartFhirClientOptions = {
				request: mockRequest,
				env: mockEnvOptions,
				pkceCodeVerifier: 'mock-pkce-verifier',
				expectedState: 'test-state',
			}
			await expect(createSmartFhirClient(options)).rejects.toThrow(
				/SMART on FHIR authentication failed during ready.*Token exchange failed/
			)
		})

		it('should throw if no access token after ready() succeeds', async () => {
			const readyResponseWithoutToken = {
				...successfulReadyResponse,
				state: {
					...successfulReadyResponse.state,
					tokenResponse: {
						...successfulReadyResponse.state.tokenResponse,
						access_token: undefined,
					},
				},
			}
			// @ts-ignore
			FHIR.oauth2.ready.mockResolvedValue(readyResponseWithoutToken)
			const options: SmartFhirClientOptions = {
				request: mockRequest,
				env: mockEnvOptions,
				pkceCodeVerifier: 'mock-pkce-verifier',
				expectedState: 'test-state',
			}
			await expect(createSmartFhirClient(options)).rejects.toThrow('Failed to obtain access token')
		})
	})

	describe('Crypto Utilities', () => {
		it('generateRandomString produces a base64url string of expected characteristics', () => {
			// Using actual crypto now, but our mock makes it deterministic
			const random32 = generateRandomString(32)
			expect(random32).toBeTypeOf('string')
			// With the mock crypto.getRandomValues, 32 bytes from 1 to 32
			// String.fromCharCode(1..32) -> base64 then URL encoded
			// The exact value depends on the base64url encoding of mock bytes:
			// Bytes: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32]
			// btoa(String.fromCharCode(...bytes))
			// Expected based on online btoa of String.fromCharCode(1..32) then URL safe:
			const expectedRandomString = 'AQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyA' // from mock
			expect(random32.length).toBeGreaterThanOrEqual(43) // Base64 of 32 bytes is 44 chars with padding, 43 without
			expect(random32).toMatch(/^[A-Za-z0-9\-_]+$/) // Base64 URL characters

			const random16 = generateRandomString(16)
			expect(random16).toBeTypeOf('string')
			expect(random16.length).toBeGreaterThanOrEqual(21)
		})

		it('generatePkceChallenge produces a SHA256 hash then base64url', async () => {
			const verifier =
				'test_verifier_string_long_enough_for_sha256_to_be_meaningful_and_not_trivial'
			// Mock crypto.subtle.digest returns reversed input as ArrayBuffer
			// TextEncoder().encode(verifier) -> reversed -> base64url
			// This test will verify the SHA-256 and base64url process based on the mock.

			// Based on our mock of crypto.subtle.digest (reverses the input):
			const textEncoder = new TextEncoder()
			const encodedVerifier = textEncoder.encode(verifier)
			const reversedEncodedVerifier = encodedVerifier.slice().reverse()
			const hashString = String.fromCharCode.apply(null, Array.from(reversedEncodedVerifier))
			const expectedChallenge = btoa(hashString)
				.replace(/\+/g, '-')
				.replace(/\//g, '_')
				.replace(/=/g, '')

			const challenge = await generatePkceChallenge(verifier)
			expect(challenge).toBeTypeOf('string')
			expect(challenge).toMatch(/^[A-Za-z0-9\-_]+$/)
			expect(challenge).toBe(expectedChallenge)
		})
	})
})
