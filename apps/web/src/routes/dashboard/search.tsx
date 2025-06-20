import ComingSoon from '@/components/coming-soon'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/search')({
	component: RouteComponent,
})

function RouteComponent() {
	return <ComingSoon />
}
