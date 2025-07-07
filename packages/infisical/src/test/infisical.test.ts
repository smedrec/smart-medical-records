// Test file for infisical.ts
// Vitest will be used here.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Infisical, InfisicalClientNotInitializedError, InfisicalError } from '../infisical'

import type { InfisicalClientOptions, ProjectOptions } from '../types'

// Mock the InfisicalSDK
const mockLogin = vi.fn()
const mockGetSecret = vi.fn()
const mockListSecrets = vi.fn()

vi.mock('@infisical/sdk', () => {
	return {
		InfisicalSDK: vi.fn().mockImplementation(() => {
			return {
				auth: () => ({
					universalAuth: {
						login: mockLogin,
					},
				}),
				secrets: () => ({
					getSecret: mockGetSecret,
					listSecretsWithImports: mockListSecrets,
				}),
			}
		}),
	}
})

describe('Infisical', () => {
	const clientOptions: InfisicalClientOptions = {
		siteUrl: 'https://test.infisical.com',
		clientId: 'test-client-id',
		clientSecret: 'test-client-secret',
	}

	const projectOptions: ProjectOptions = {
		projectId: 'test-project-id',
		environment: 'dev',
	}

	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('Constructor and Configuration', () => {
		it('should construct with default project options if none provided via WithConfig', () => {
			const client = new Infisical()
			// @ts-expect-error Accessing private member for test
			expect(client.project).toEqual({ environment: 'dev', projectId: '' })
		})

		it('should construct and apply WithConfig options', () => {
			const client = new Infisical(Infisical.WithConfig(projectOptions))
			// @ts-expect-error Accessing private member for test
			expect(client.project).toEqual(projectOptions)
		})

		it('should construct and apply init and WithConfig options', async () => {
			mockLogin.mockResolvedValueOnce(undefined)
			const initOpt = await Infisical.init(clientOptions)
			const client = new Infisical(initOpt, Infisical.WithConfig(projectOptions))

			// @ts-expect-error Accessing private member for test
			expect(client.apiClient).toBeDefined()
			// @ts-expect-error Accessing private member for test
			expect(client.project).toEqual(projectOptions)
		})
	})

	describe('init', () => {
		it('should initialize and authenticate successfully', async () => {
			mockLogin.mockResolvedValueOnce(undefined)
			const initOpt = await Infisical.init(clientOptions)
			const client = new Infisical(initOpt)

			expect(mockLogin).toHaveBeenCalledWith({
				clientId: clientOptions.clientId,
				clientSecret: clientOptions.clientSecret,
			})
			// @ts-expect-error Accessing private member for test
			expect(client.apiClient).toBeDefined()
		})

		it('should throw InfisicalError if authentication fails', async () => {
			const authError = new Error('Authentication failed')
			mockLogin.mockRejectedValueOnce(authError)

			await expect(Infisical.init(clientOptions)).rejects.toThrow(InfisicalError)
			await expect(Infisical.init(clientOptions)).rejects.toSatisfy((err: InfisicalError) => {
				expect(err.message).toBe('Failed to initialize or authenticate Infisical client.')
				expect(err.cause).toBe(authError)
				return true
			})
		})
	})

	describe('getSecret', () => {
		it('should throw InfisicalClientNotInitializedError if client is not initialized', async () => {
			const client = new Infisical(Infisical.WithConfig(projectOptions))
			await expect(client.getSecret('MY_SECRET')).rejects.toThrow(
				InfisicalClientNotInitializedError
			)
		})

		it('should retrieve a secret successfully', async () => {
			mockLogin.mockResolvedValueOnce(undefined)
			mockGetSecret.mockResolvedValueOnce({ secretValue: 'supersecret' })

			const initOpt = await Infisical.init(clientOptions)
			const client = new Infisical(initOpt, Infisical.WithConfig(projectOptions))

			const secretValue = await client.getSecret('MY_SECRET')

			expect(mockGetSecret).toHaveBeenCalledWith({
				secretName: 'MY_SECRET',
				projectId: projectOptions.projectId,
				environment: projectOptions.environment,
			})
			expect(secretValue).toBe('supersecret')
		})

		it('should retrieve a secret with overridden options', async () => {
			mockLogin.mockResolvedValueOnce(undefined)
			mockGetSecret.mockResolvedValueOnce({ secretValue: 'prodsecret' })

			const initOpt = await Infisical.init(clientOptions)
			const client = new Infisical(initOpt, Infisical.WithConfig(projectOptions)) // Default 'dev'

			const secretValue = await client.getSecret('MY_SECRET', {
				environment: 'prod',
				projectId: 'prod-project',
			})

			expect(mockGetSecret).toHaveBeenCalledWith({
				secretName: 'MY_SECRET',
				projectId: 'prod-project',
				environment: 'prod',
			})
			expect(secretValue).toBe('prodsecret')
		})

		it('should throw InfisicalError if SDK fails to get secret', async () => {
			mockLogin.mockResolvedValueOnce(undefined)
			const sdkError = new Error('SDK secret retrieval failed')
			mockGetSecret.mockRejectedValueOnce(sdkError)

			const initOpt = await Infisical.init(clientOptions)
			const client = new Infisical(initOpt, Infisical.WithConfig(projectOptions))

			await expect(client.getSecret('MY_SECRET')).rejects.toThrow(InfisicalError)
			await expect(client.getSecret('MY_SECRET')).rejects.toSatisfy((err: InfisicalError) => {
				expect(err.message).toBe('Failed to get secret "MY_SECRET".')
				expect(err.cause).toBe(sdkError)
				return true
			})
		})
	})

	describe('allSecrets', () => {
		it('should throw InfisicalClientNotInitializedError if client is not initialized', async () => {
			const client = new Infisical(Infisical.WithConfig(projectOptions))
			await expect(client.allSecrets()).rejects.toThrow(InfisicalClientNotInitializedError)
		})

		it('should retrieve all secrets successfully', async () => {
			mockLogin.mockResolvedValueOnce(undefined)
			const sdkSecretsResponse = [
				{ secretKey: 'KEY1', secretValue: 'VALUE1', id: '1' },
				{ secretKey: 'KEY2', secretValue: 'VALUE2', id: '2' },
			]
			mockListSecrets.mockResolvedValueOnce(sdkSecretsResponse)

			const initOpt = await Infisical.init(clientOptions)
			const client = new Infisical(initOpt, Infisical.WithConfig(projectOptions))

			const secrets = await client.allSecrets()

			expect(mockListSecrets).toHaveBeenCalledWith({
				projectId: projectOptions.projectId,
				environment: projectOptions.environment,
			})
			expect(secrets).toEqual([
				{ key: 'KEY1', value: 'VALUE1' },
				{ key: 'KEY2', value: 'VALUE2' },
			])
		})

		it('should retrieve all secrets with overridden options', async () => {
			mockLogin.mockResolvedValueOnce(undefined)
			const sdkSecretsResponse = [{ secretKey: 'PRODKEY1', secretValue: 'PRODVALUE1', id: '1' }]
			mockListSecrets.mockResolvedValueOnce(sdkSecretsResponse)

			const initOpt = await Infisical.init(clientOptions)
			const client = new Infisical(initOpt, Infisical.WithConfig(projectOptions)) // Default 'dev'

			const secrets = await client.allSecrets({ environment: 'prod', projectId: 'prod-project' })

			expect(mockListSecrets).toHaveBeenCalledWith({
				projectId: 'prod-project',
				environment: 'prod',
			})
			expect(secrets).toEqual([{ key: 'PRODKEY1', value: 'PRODVALUE1' }])
		})

		it('should throw InfisicalError if SDK fails to list secrets', async () => {
			mockLogin.mockResolvedValueOnce(undefined)
			const sdkError = new Error('SDK list secrets failed')
			mockListSecrets.mockRejectedValueOnce(sdkError)

			const initOpt = await Infisical.init(clientOptions)
			const client = new Infisical(initOpt, Infisical.WithConfig(projectOptions))

			await expect(client.allSecrets()).rejects.toThrow(InfisicalError)
			await expect(client.allSecrets()).rejects.toSatisfy((err: InfisicalError) => {
				expect(err.message).toBe('Failed to list all secrets.')
				expect(err.cause).toBe(sdkError)
				return true
			})
		})
	})
})
