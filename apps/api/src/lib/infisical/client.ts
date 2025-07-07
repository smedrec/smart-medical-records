import { Infisical } from '@repo/infisical'

import type { InfisicalClientOptions, ProjectOptions } from '@repo/infisical'

async function initializeInfisicalClient() {
	const clientAuthOptions: InfisicalClientOptions = {
		siteUrl: process.env.INFISICAL_SITE_URL!, // e.g., "https://app.infisical.com"
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

export { initializeInfisicalClient }
