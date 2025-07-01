import { Auth } from '@repo/auth'
import { getEnvConfig } from '@repo/auth/dist/auth/environment.js'

import type { EnvConfig } from '@repo/auth/dist/auth/environment.js'

const authConfig: EnvConfig = getEnvConfig()

let authInstance: Auth | undefined = undefined
export { authInstance }

if (!authInstance) {
	authInstance = new Auth(authConfig)
}

export const auth = authInstance.getAuthInstance()
