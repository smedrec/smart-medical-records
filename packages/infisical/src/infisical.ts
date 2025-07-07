import { InfisicalSDK } from '@infisical/sdk'

import type { GetSecretOptions, ListSecretsOptions } from '@infisical/sdk'
import type { InfisicalClientOptions, ProjectOptions } from './types.js'

/**
 * Represents an option function for configuring an Infisical instance.
 * @param s - The Infisical instance to configure.
 */
type InfisicalOption = (s: Infisical) => void

/**
 * Error thrown when the Infisical client is not initialized before use.
 */
export class InfisicalClientNotInitializedError extends Error {
	constructor(
		message = 'Infisical client has not been initialized. Call and await Infisical.init() before using client methods.'
	) {
		super(message)
		this.name = 'InfisicalClientNotInitializedError'
	}
}

/**
 * Error thrown when an operation with the Infisical SDK fails.
 */
export class InfisicalError extends Error {
	constructor(
		message: string,
		public readonly cause?: unknown
	) {
		super(message)
		this.name = 'InfisicalError'
	}
}

/**
 * The Infisical class provides methods to interact with the Infisical API
 * for retrieving secrets and configuration.
 */
export class Infisical {
	private project: ProjectOptions
	private apiClient: InfisicalSDK | undefined

	/**
	 * Constructs a new Infisical client instance.
	 * Configuration is applied via option functions.
	 * @param options - Configuration options for the Infisical client.
	 */
	constructor(...options: InfisicalOption[]) {
		// Set the defaults
		this.project = {
			environment: 'dev',
			projectId: '',
		}
		this.apiClient = undefined

		// Apply the options
		for (const option of options) {
			option(this)
		}
	}

	/**
	 * Creates a configuration option to set project-specific details.
	 * @param projectOptions - The project options to configure.
	 * @returns An InfisicalOption function.
	 *
	 * @example
	 * ```typescript
	 * const projectConfig = Infisical.WithConfig({
	 *   projectId: "your-project-id",
	 *   environment: "prod",
	 * });
	 * const client = new Infisical(projectConfig);
	 * ```
	 */
	public static WithConfig(projectOptions: ProjectOptions): InfisicalOption {
		return (s: Infisical): void => {
			s.project = projectOptions
		}
	}

	/**
	 * Initializes the Infisical SDK client and authenticates with the Infisical service.
	 * This method must be called and awaited before any other secret-retrieving methods.
	 * @param options - Options required for client initialization and authentication.
	 * @returns An InfisicalOption function that sets the initialized API client.
	 * @throws {InfisicalError} If authentication or client initialization fails.
	 *
	 * @example
	 * ```typescript
	 * const clientOptions = {
	 *   siteUrl: "https://app.infisical.com",
	 *   clientId: "your-client-id",
	 *   clientSecret: "your-client-secret",
	 *   // projectId and environment are set via WithConfig or directly in methods
	 * };
	 * try {
	 *   const initOption = await Infisical.init(clientOptions);
	 *   const client = new Infisical(initOption, Infisical.WithConfig({ projectId: "...", environment: "dev" }));
	 *   // Now you can use client.getSecret() or client.allSecrets()
	 * } catch (error) {
	 *   console.error("Failed to initialize Infisical client:", error);
	 * }
	 * ```
	 */
	public static async init(options: InfisicalClientOptions): Promise<InfisicalOption> {
		try {
			const apiClient = new InfisicalSDK({
				siteUrl: options.siteUrl,
			})

			// Authenticate with Infisical
			await apiClient.auth().universalAuth.login({
				clientId: options.clientId,
				clientSecret: options.clientSecret,
			})

			return (s: Infisical): void => {
				s.apiClient = apiClient
			}
		} catch (error) {
			throw new InfisicalError('Failed to initialize or authenticate Infisical client.', error)
		}
	}

	private ensureClientInitialized(): void {
		if (!this.apiClient) {
			throw new InfisicalClientNotInitializedError()
		}
	}

	/**
	 * Retrieves a single secret by its name.
	 * @param secretName - The name of the secret to retrieve.
	 * @param options - Optional: Override project ID, environment, or other SDK options.
	 * @returns The value of the secret.
	 * @throws {InfisicalClientNotInitializedError} If the client has not been initialized.
	 * @throws {InfisicalError} If the secret retrieval fails (e.g., secret not found, network error).
	 *
	 * @example
	 * ```typescript
	 * // Assuming client is initialized and configured
	 * const dbPassword = await client.getSecret("DATABASE_PASSWORD");
	 *
	 * // Override environment for a specific call
	 * const apiKey = await client.getSecret("API_KEY", { environment: "prod" });
	 * ```
	 */
	public async getSecret(secretName: string, options?: Partial<GetSecretOptions>): Promise<string> {
		this.ensureClientInitialized()
		try {
			const secretRequestOptions: GetSecretOptions = {
				environment: this.project.environment,
				projectId: this.project.projectId,
				secretName: secretName,
				...options, // User-provided options will override defaults
			}
			// We know apiClient is defined due to ensureClientInitialized
			const singleSecret = await this.apiClient!.secrets().getSecret(secretRequestOptions)
			return singleSecret.secretValue
		} catch (error) {
			throw new InfisicalError(`Failed to get secret "${secretName}".`, error)
		}
	}

	/**
	 * Retrieves all secrets for the configured project and environment.
	 * @param options - Optional: Override project ID, environment, or other SDK options.
	 * @returns An array of key-value pairs representing the secrets.
	 * @throws {InfisicalClientNotInitializedError} If the client has not been initialized.
	 * @throws {InfisicalError} If listing secrets fails.
	 *
	 * @example
	 * ```typescript
	 * // Assuming client is initialized and configured
	 * const allMySecrets = await client.allSecrets();
	 * for (const secret of allMySecrets) {
	 *   console.log(`${secret.key}: ${secret.value}`);
	 * }
	 * ```
	 */
	public async allSecrets(options?: Partial<ListSecretsOptions>): Promise<
		Array<{
			key: string
			value: string
		}>
	> {
		this.ensureClientInitialized()
		try {
			const listRequestOptions: ListSecretsOptions = {
				environment: this.project.environment,
				projectId: this.project.projectId,
				...options, // User-provided options will override defaults
			}
			// We know apiClient is defined due to ensureClientInitialized
			const secrets = await this.apiClient!.secrets().listSecretsWithImports(listRequestOptions)

			const onlyKeyValues = secrets.map((secret) => {
				return {
					key: secret.secretKey,
					value: secret.secretValue,
				}
			})

			return onlyKeyValues
		} catch (error) {
			throw new InfisicalError('Failed to list all secrets.', error)
		}
	}
}
