'use client'

import { Thread } from '@/components/assistant-ui/thread'
import { ThreadList } from '@/components/assistant-ui/thread-list'
import { AssistantRuntimeProvider } from '@assistant-ui/react'
import { useChatRuntime } from '@assistant-ui/react-ai-sdk'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ai/chat')({
	component: Chat,
})

export default function Chat() {
	// Point the runtime to the Mastra server endpoint
	const runtime = useChatRuntime({
		api: 'http://localhost:4111/api/agents/weatherAgent/stream',
	})

	return (
		<AssistantRuntimeProvider runtime={runtime}>
			<main className="grid h-dvh grid-cols-[200px_1fr] gap-x-2 px-4 py-4">
				<ThreadList />
				<Thread />
			</main>
		</AssistantRuntimeProvider>
	)
}
