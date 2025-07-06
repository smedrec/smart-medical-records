//import { Auth } from '@repo/auth'
//import { getEnvConfig } from '@repo/auth/dist/auth/environment.js'
import {
	adminClient,
	apiKeyClient,
	oidcClient,
	organizationClient,
} from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

/**import type { EnvConfig } from '@repo/auth/dist/auth/environment.js'

let authInstance: Auth | undefined = undefined

export function initializeAuth() {
	if (!authInstance) {
		const authConfig: EnvConfig = getEnvConfig()
		authInstance = new Auth(authConfig)
	}
	return authInstance
}

export function getAuthInstance() {
	if (!authInstance) {
		throw new Error('Auth not initialized. Call initializeAuth first.')
	}
	return authInstance.getAuthInstance()
}*/

const authClient = createAuthClient({
	//baseURL: env.BETTER_AUTH_URL,
	baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:8801/auth',
	plugins: [organizationClient(), adminClient(), apiKeyClient(), oidcClient()],
})

export { authClient }
