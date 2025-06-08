'use client'

import { Assistant } from '@/components/assistant'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ai/chat')({
	component: Chat,
})

export default function Chat() {
	return <Assistant />
}
