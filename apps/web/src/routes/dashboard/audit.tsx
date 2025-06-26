import { columns } from '@/components/dashboard/audit/columns'
import { DataTable } from '@/components/dashboard/audit/data-table'
import { getAuditLogs } from '@/lib/audit/get'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'

import { Spinner } from '@repo/ui/components/ui/spinner'

import type { AuditLog } from '@/components/dashboard/audit/columns'

export const Route = createFileRoute('/dashboard/audit')({
	component: RouteComponent,
})

function RouteComponent() {
	const logs = useServerFn(getAuditLogs)

	const { data, isLoading, error } = useQuery({
		queryKey: ['auditLogs'],
		queryFn: () => logs(),
	})
	if (isLoading || !data)
		return (
			<div className="min-h-[100vh] flex flex-col gap-10 items-center justify-center pb-4">
				<div className="flex flex-col gap-5 w-[60%]">
					<Spinner size={50} />
				</div>
			</div>
		)
	if (error)
		return `An error occured: ${(error as { message?: string }).message ?? 'Unknown error'}`

	// Ensure data is an array
	const items = Array.isArray(data) ? data : []

	const tableData = items.map((item: AuditLog) => {
		return {
			id: item.id,
			timestamp: item.timestamp,
			action: item.action,
			targetResourceType: item.targetResourceType,
			status: item.status,
		}
	})

	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<h1 className="text-2xl font-bold">Audit Logs</h1>
			<DataTable columns={columns} data={tableData} />
		</div>
	)
}
