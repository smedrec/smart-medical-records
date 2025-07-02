import { Audit } from '@repo/audit'

let auditInstance: Audit | undefined = undefined

export function initializeAudit() {
	if (!auditInstance) {
		auditInstance = new Audit('audit', process.env.AUDIT_REDIS_URL!)
	}
	return auditInstance
}

export function getAuditInstance() {
	if (!auditInstance) {
		throw new Error('Audit not initialized. Call initializeAudit first.')
	}
	return auditInstance
}
