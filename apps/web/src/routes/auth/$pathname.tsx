import { AcceptInvitationCard, AuthCard } from '@daveyplate/better-auth-ui'
import { createFileRoute, Link } from '@tanstack/react-router'

import { cn } from '@repo/ui/lib/utils'

export const Route = createFileRoute('/auth/$pathname')({
	component: RouteComponent,
})

function RouteComponent() {
	const { pathname } = Route.useParams()

	return (
		<main className="flex grow flex-col items-center justify-center gap-4 p-4">
			{pathname === 'accept-invitation' ? (
				<AcceptInvitationCard />
			) : (
				<AuthCard pathname={pathname} redirectTo="/dashboard" />
			)}

			<p className="text-muted-foreground text-xs">
				By signing in, you agree to our{' '}
				<Link className="text-warning underline" to="/tos" target="_blank" rel="noreferrer">
					Terms of Use
				</Link>{' '}
				and{' '}
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
					['callback', 'settings', 'sign-out'].includes(pathname) && 'hidden',
					'text-muted-foreground text-xs'
				)}
			>
				Powered by{' '}
				<a
					className="text-warning underline"
					href="https://better-auth.com"
					target="_blank"
					rel="noreferrer"
				>
					better-auth.
				</a>
			</p>
		</main>
	)
}
