//import { getConfigInstance } from '@/lib/config'
import { createServerFn } from '@tanstack/react-start'
import { desc, eq } from 'drizzle-orm'

import { AuditDb, auditLog } from '@repo/audit-db'

//const config = getConfigInstance()

type GetAuditLogsParams = {
	principalId?: string
	organizationId?: string
}
// Using environment variable AUDIT_DB_URL
const auditDbService = new AuditDb()
const db = auditDbService.getDrizzleInstance()

export const getAuditLogs = createServerFn({ method: 'GET' })
	.validator((params?: GetAuditLogsParams) => params)
	.handler(async ({ data }) => {
		const userEvents = await db
			.select()
			.from(auditLog)
			//.where(data.principalId ? eq(auditLog.principalId, data.principalId) : '')
			.orderBy(desc(auditLog.timestamp))
			.limit(10)
		return userEvents
	})
