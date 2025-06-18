import { OrganizationMembersCard, OrganizationSettingsCards } from '@daveyplate/better-auth-ui'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/settings')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<div className="grid auto-rows-min gap-4 md:grid-cols-2">
				<div className="bg-muted/50 aspect-video rounded-xl">
					<OrganizationSettingsCards />
				</div>
				<div className="bg-muted/50 aspect-video rounded-xl" />
			</div>
			<div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
				<OrganizationMembersCard />
			</div>
		</div>
	)
}
