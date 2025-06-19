import { ChangePasswordCard, SessionsCard } from '@daveyplate/better-auth-ui'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/settings/security')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<h1 className="text-2xl font-bold">Security</h1>
			<ChangePasswordCard />
			<SessionsCard />
		</div>
	)
}
