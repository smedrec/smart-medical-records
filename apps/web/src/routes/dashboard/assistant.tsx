import { $api } from '@/lib/fhirClient'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/assistant')({
	component: RouteComponent,
})

function RouteComponent() {
	const { data, error, isLoading } = $api.useQuery('get', '/Person/_history')

	if (isLoading || !data) return 'Loading...'
	if (error) return `An error occured: ${error.message}`

	// Ensure data is an array
	const items = Array.isArray(data.entry) ? data.entry : []

	return (
		<div>
			<h1 className="text-2xl font-bold">Assistants</h1>
			<ul>
				{items.map((item) => (
					<li key={item.id}>
						{item.name[0].given} {item.name[0].family}
					</li>
				))}
			</ul>
		</div>
	)
}
