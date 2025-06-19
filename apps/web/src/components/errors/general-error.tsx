import {
	ErrorComponent,
	rootRouteId,
	useMatch,
	useNavigate,
	useRouter,
} from '@tanstack/react-router'

import { Button } from '@repo/ui/components/ui/button'
import { cn } from '@repo/ui/lib/utils'

import type { ErrorComponentProps } from '@tanstack/react-router'

interface GeneralErrorProps extends React.HTMLAttributes<HTMLDivElement> {
	minimal?: boolean
	error: ErrorComponentProps
}
export function GeneralError({ className, minimal = false, error }: GeneralErrorProps) {
	const isRoot = useMatch({
		strict: false,
		select: (state) => state.id === rootRouteId,
	})
	const navigate = useNavigate()
	const { history } = useRouter()
	return (
		<div className={cn('h-svh w-full', className)}>
			<ErrorComponent error={error} />
			<div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
				{!minimal && <h1 className="text-[7rem] leading-tight font-bold">500</h1>}
				<span className="font-medium">Oops! Something went wrong {`:')`}</span>
				<p className="text-muted-foreground text-center">
					We apologize for the inconvenience. <br /> Please try again later.
				</p>
				{!minimal && (
					<div className="mt-6 flex gap-4">
						{isRoot ? (
							<Button onClick={() => navigate({ to: '/' })}>Back to Home</Button>
						) : (
							<Button variant="outline" onClick={() => history.go(-1)}>
								Go Back
							</Button>
						)}
					</div>
				)}
			</div>
		</div>
	)
}
