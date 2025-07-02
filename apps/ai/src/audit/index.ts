import { Audit } from '@repo/audit'

//import { getEnvConfig } from '@repo/auth/dist/auth/environment.js'

//import type { EnvConfig } from '@repo/auth/dist/auth/environment.js'

let auditInstance: Audit | undefined = undefined

export function initializeAudit() {
	if (!auditInstance) {
		//const authConfig: EnvConfig = getEnvConfig()
		auditInstance = new Audit(process.env.CERBOS_URL!)
	}
	return auditInstance
}

export function getAuditInstance() {
	if (!auditInstance) {
		throw new Error('Cerbos not initialized. Call initializeCerbos first.')
	}
	return auditInstance
}
