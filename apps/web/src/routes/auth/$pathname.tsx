import { AcceptInvitationCard, AuthCard } from "@daveyplate/better-auth-ui";
import { createFileRoute, Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth/$pathname")({
	component: RouteComponent,
});

function RouteComponent() {
	const { pathname } = Route.useParams();

	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				{pathname === "accept-invitation" ? (
					<AcceptInvitationCard />
				) : (
					<AuthCard pathname={pathname} redirectTo="/app" />
				)}

				<p className="text-center text-muted-foreground text-xs">
					By signing in, you agree to our{" "}
					<Link
						className="text-warning underline"
						to="/tos"
						target="_blank"
						rel="noreferrer"
					>
						Terms of Use
					</Link>{" "}
					and{" "}
					<Link
						className="text-warning underline"
						to="/privacy-policy"
						target="_blank"
						rel="noreferrer"
					>
						Privacy Policy
					</Link>
					.
				</p>
				<p
					className={cn(
						["callback", "settings", "sign-out"].includes(pathname) && "hidden",
						"text-center text-muted-foreground text-xs",
					)}
				>
					Powered by{" "}
					<a
						className="text-warning underline"
						href="https://better-auth.com"
						target="_blank"
						rel="noreferrer"
					>
						better-auth.
					</a>
				</p>
			</div>
		</div>
	);
}
