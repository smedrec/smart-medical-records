import { appClient } from '@/lib/app-client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
	component: RouteComponent,
})

function RouteComponent() {
	const queryClient = useQueryClient()

	const query = useQuery({
		queryKey: ['assistant'],
		queryFn: () => appClient.getAssistants({ limit: 10, page: 1 }),
	})

	return (
		<div>
			<h1 className="text-2xl font-bold">Assistants</h1>
			<ul>{query.data?.result.map((item) => <li key={item.assistant.id}>{item.user.name}</li>)}</ul>
		</div>
	)
}
