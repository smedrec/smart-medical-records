import { InfisicalSDK } from '@infisical/sdk'

import type { InfisicalClientOptions, ProjectOptions } from './types.js'

type InfisicalOptions = (s: Infisical) => void

export class Infisical {
	private project: ProjectOptions
	private apiClient: InfisicalSDK | undefined

	constructor(...options: InfisicalOptions[]) {
		// set the defaults
		this.project = {
			environment: 'dev',
			projectId: '',
		}
		this.apiClient = undefined

		// set the options
		for (const option of options) {
			option(this)
		}
	}

	public static WithConfig(projectOptions: ProjectOptions): InfisicalOptions {
		return (s: Infisical): void => {
			s.project = projectOptions
		}
	}

	public static async init(options: InfisicalClientOptions): Promise<InfisicalOptions> {
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
	}

	public async getSecret(secretName: string): Promise<string> {
		const singleSecret = await this.apiClient.secrets().getSecret({
			environment: this.project.environment,
			projectId: this.project.projectId,
			secretName: secretName,
		})
		return singleSecret.secretValue
	}

	public async allSecrets(): Promise<
		Array<{
			key: string
			value: string
		}>
	> {
		const secrets = await this.apiClient.secrets().listSecretsWithImports({
			environment: this.project.environment,
			projectId: this.project.projectId,
		})

		const onlyKeyValues = secrets.map((secret) => {
			return {
				key: secret.secretKey,
				value: secret.secretValue,
			}
		})

		return onlyKeyValues
	}
}
