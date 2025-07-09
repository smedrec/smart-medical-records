import { Assistant } from '@/components/assistant'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/assistant')({
	component: RouteComponent,
})

function RouteComponent() {
	return <Assistant />
}
