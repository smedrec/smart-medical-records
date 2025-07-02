import { Cerbos } from '@repo/cerbos'

//import { getEnvConfig } from '@repo/auth/dist/auth/environment.js'

//import type { EnvConfig } from '@repo/auth/dist/auth/environment.js'

let cerbosInstance: Cerbos | undefined = undefined

export function initializeCerbos() {
	if (!cerbosInstance) {
		//const authConfig: EnvConfig = getEnvConfig()
		cerbosInstance = new Cerbos(process.env.CERBOS_URL!)
	}
	return cerbosInstance
}

export function getCerbosInstance() {
	if (!cerbosInstance) {
		throw new Error('Cerbos not initialized. Call initializeCerbos first.')
	}
	return cerbosInstance.getClient()
}
