import { OrganizationSettingsCards } from "@daveyplate/better-auth-ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/settings/organization")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<h1 className="font-bold text-2xl">Organization</h1>
			<OrganizationSettingsCards />
		</div>
	);
}
