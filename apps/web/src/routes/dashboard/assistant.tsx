import { $api } from '@/lib/fhirClient'
import { createFileRoute } from '@tanstack/react-router'

import type { Person } from '@solarahealth/fhir-r4'

export const Route = createFileRoute('/dashboard/assistant')({
	component: RouteComponent,
})

function RouteComponent() {
	const { data, error, isLoading } = $api.useQuery('get', '/Person/_history')

	if (isLoading || !data) return 'Loading...'
	if (error)
		return `An error occured: ${(error as { message?: string }).message ?? 'Unknown error'}`

	// Ensure data is an array
	const items = Array.isArray(data.entry) ? data.entry : []

	return (
		<div>
			<h1 className="text-2xl font-bold">Persons</h1>
			<ul>
				{items.map((item: { id: string; resource: Person }) => (
					<li key={item.id}>
						{item.resource.name?.[0]?.given?.join(' ') ?? ''}{' '}
						{item.resource.name?.[0]?.family ?? ''}
					</li>
				))}
			</ul>
		</div>
	)
}
