import { Infisical } from '@repo/infisical'

import type { InfisicalClientOptions, ProjectOptions } from '@repo/infisical'

let infisicalInstance: Infisical | undefined = undefined

async function initializeInfisicalClient(): Promise<Infisical> {
	const clientAuthOptions: InfisicalClientOptions = {
		siteUrl: process.env.INFISICAL_URL!, // e.g., "https://app.infisical.com"
		clientId: process.env.INFISICAL_CLIENT_ID!,
		clientSecret: process.env.INFISICAL_CLIENT_SECRET!,
	}

	const projectConfig: ProjectOptions = {
		projectId: process.env.INFISICAL_PROJECT_ID!, // Your Infisical Project ID
		environment: process.env.INFISICAL_ENVIRONMENT!, // e.g., "dev", "prod", "stg"
	}

	try {
		const infisicalClient = new Infisical(
			Infisical.WithConfig(projectConfig),
			await Infisical.init(clientAuthOptions)
		)
		console.log('Infisical client initialized successfully.')
		return infisicalClient
	} catch (error) {
		console.error('Failed to initialize Infisical client:', error)
		// Handle initialization error (e.g., exit application, retry, etc.)
		process.exit(1)
	}
}

async function initializeInfisical(): Promise<Infisical | undefined> {
	if (!infisicalInstance) {
		infisicalInstance = await initializeInfisicalClient()
	}
	return infisicalInstance
}

async function getSecret(key: string): Promise<string | undefined> {
	if (!infisicalInstance) {
		infisicalInstance = await initializeInfisicalClient()
	}
	try {
		const value = await infisicalInstance.getSecret(key)
		return value
	} catch (error) {
		console.error('Error fetching DATABASE_PASSWORD:', error)
		// Handle specific error, e.g., secret not found
	}
}

export { initializeInfisical, getSecret }
