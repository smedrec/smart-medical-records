interface InfisicalClientOptions {
	siteUrl: string
	clientId: string
	clientSecret: string
	environment: 'dev' | 'prod'
	projectId: string
}

interface ProjectOptions {
	environment: 'dev' | 'prod'
	projectId: string
}

export type { InfisicalClientOptions, ProjectOptions }
