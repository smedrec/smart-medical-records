import { columns } from '@/components/dashboard/patient/columns'
import { DataTable } from '@/components/dashboard/patient/data-table'
import { getResources } from '@/lib/resources/get'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'

import { Skeleton } from '@repo/ui/components/ui/skeleton'

import type { Patient } from '@solarahealth/fhir-r4'

export const Route = createFileRoute('/dashboard/patients')({
	component: RouteComponent,
})

function RouteComponent() {
	const getPatients = useServerFn(getResources)

	const { data, isLoading, error } = useQuery({
		queryKey: ['patients'],
		queryFn: () => getPatients({ data: { resourceType: 'Patient' } }),
	})
	if (isLoading || !data)
		return (
			<div className="flex items-center space-x-4">
				<div className="space-y-2">
					<Skeleton className="h-4 w-[250px]" />
					<Skeleton className="h-4 w-[250px]" />
					<Skeleton className="h-4 w-[250px]" />
				</div>
			</div>
		)
	if (error)
		return `An error occured: ${(error as { message?: string }).message ?? 'Unknown error'}`

	// Ensure data is an array
	const items = Array.isArray(data.entry) ? data.entry : []

	const tableData = items.map((item: { resource: Patient }) => {
		return {
			id: item.resource.id,
			email: item.resource.telecom?.[0].value,
			name: item.resource.name?.[0].given?.join(' ') + ' ' + item.resource.name?.[0].family,
		}
	})

	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<h1 className="text-2xl font-bold">Patients</h1>
			<DataTable columns={columns} data={tableData} />
		</div>
	)
}
