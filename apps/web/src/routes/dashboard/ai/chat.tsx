'use client'

import { CopilotKitComponent } from '@/components/copilotkit'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/ai/chat')({
	component: Chat,
})

export default function Chat() {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
				<CopilotKitComponent />
			</div>
		</div>
	)
}
