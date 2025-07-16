import { AuditSDK } from '@repo/audit-sdk'

let auditInstance: AuditSDK | undefined = undefined

export function initializeAudit() {
	if (!auditInstance) {
		auditInstance = new AuditSDK({
			queueName: 'audit',
			redis: {
				url: process.env.REDIS_URL,
			},
			databaseUrl: process.env.AUDIT_DB_URL,
			defaults: {
				dataClassification: 'INTERNAL',
				generateHash: true,
			},
			compliance: {
				hipaa: {
					enabled: true,
					retentionYears: 6,
				},
			},
		})
	}
	return auditInstance
}

export function getAuditInstance() {
	if (!auditInstance) {
		throw new Error('Audit not initialized. Call initializeAudit first.')
	}
	return auditInstance
}
