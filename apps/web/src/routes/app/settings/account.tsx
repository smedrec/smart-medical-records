import {
	APIKeysCard,
	ChangeEmailCard,
	DeleteAccountCard,
	UpdateAvatarCard,
	UpdateNameCard,
} from "@daveyplate/better-auth-ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/settings/account")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<h1 className="font-bold text-2xl">Account</h1>
			<div className="grid auto-rows-min gap-4 md:grid-cols-3">
				<div className="aspect-video rounded-xl">
					<UpdateAvatarCard />
				</div>
				<div className="aspect-video rounded-xl">
					<UpdateNameCard />
				</div>
				<div className="aspect-video rounded-xl">
					<ChangeEmailCard />
				</div>
			</div>
			<APIKeysCard />
			<DeleteAccountCard />
		</div>
	);
}
