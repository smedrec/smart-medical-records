import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div>
			<h1 className="text-2xl font-bold">Assistants</h1>
		</div>
	)
}
