import 'dotenv/config'

// Validate all environment variables at startup
const requiredEnvVars = [
	'NODE_ENV',
	'ENVIRONMENT',
	'BETTER_AUTH_URL',
	'API_PUBLIC_URL',
	'APP_PUBLIC_URL',
	'AUDIT_DB_URL',
]

interface ConfigEnv {
	[key: string]: string | undefined
}

let config: ConfigEnv | undefined = undefined

function initializeConfig() {
	if (!config) {
		for (const envVar of requiredEnvVars) {
			if (!process.env[envVar]) {
				throw new Error(`Missing required environment variable: ${envVar}`)
			}
		}
	}
}

function getConfigInstance() {
	//if (!config) {
	//	throw new Error('Config not initialized. Call initializeConfig first.')
	//}

	config = {
		nodeEnv: process.env.NODE_ENV,
		//port: parseInt(process.env.PORT, 10),
		environment: process.env.ENVIRONMENT!,
		authUrl: process.env.BETTER_AUTH_URL!,
		apiUrl: process.env.API_PUBLIC_URL!,
		appUrl: process.env.APP_PUBLIC_URL!,
		auditDb: process.env.AUDIT_DB_URL!,
	}

	return config
}

export { initializeConfig, getConfigInstance }
// Type-safe environment access
