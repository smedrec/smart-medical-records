import {
	OrganizationInvitationsCard,
	OrganizationMembersCard,
} from "@daveyplate/better-auth-ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/staff/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<h1 className="font-bold text-2xl">Staff</h1>
			<OrganizationMembersCard />
			<OrganizationInvitationsCard />
		</div>
	);
}
