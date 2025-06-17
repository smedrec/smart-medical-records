import { useSession } from '@/hooks/auth-hooks'
import { authClient } from '@/lib/auth-client'
import { CopilotKit } from '@copilotkit/react-core'
import { CopilotChat } from '@copilotkit/react-ui'

import '@copilotkit/react-ui/styles.css'

import { Skeleton } from '@repo/ui/components/ui/skeleton'

export function CopilotKitComponent() {
	const { session, user, isPending } = useSession()

	const { data: activeOrganization, isPending: isPendingActiveOrganization } =
		authClient.useActiveOrganization()

	if (isPending || isPendingActiveOrganization)
		return (
			<div className="flex items-center space-x-4">
				<Skeleton className="h-12 w-12 rounded-full" />
				<div className="space-y-2">
					<Skeleton className="h-4 w-[250px]" />
					<Skeleton className="h-4 w-[200px]" />
				</div>
			</div>
		)

	return (
		<CopilotKit
			runtimeUrl={`http://localhost:4111/copilotkit?userId=${user?.id || ''}&organizationId=${activeOrganization?.id || ''}`}
			agent="assistantAgent"
		>
			<CopilotChat
				labels={{
					title: 'Your Assistant',
					initial: 'Hi! 👋 How can I assist you today?',
				}}
			/>
		</CopilotKit>
	)
}
