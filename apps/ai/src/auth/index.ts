import { Auth } from '@repo/auth'
import { getEnvConfig } from '@repo/auth/dist/auth/environment.js'

import type { EnvConfig } from '@repo/auth/dist/auth/environment.js'

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
}
