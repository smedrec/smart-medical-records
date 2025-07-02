import { Cerbos } from '@repo/cerbos'

let cerbosInstance: Cerbos | undefined = undefined

export function initializeCerbos() {
	if (!cerbosInstance) {
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
