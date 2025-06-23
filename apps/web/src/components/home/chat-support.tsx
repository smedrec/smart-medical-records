import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ai/chat-bubble'
import { ChatInput } from '@/components/ai/chat-input'
import { ChatMessageList } from '@/components/ai/chat-message-list'
import {
	ExpandableChat,
	ExpandableChatBody,
	ExpandableChatFooter,
	ExpandableChatHeader,
} from '@/components/ai/expandable-chat'
import { Send } from 'lucide-react'

import { Button } from '@repo/ui/components/ui/button'

export default function ChatSupport() {
	const message = {
		role: 'assistant',
		content: 'Hello there',
	}
	return (
		<ExpandableChat size="lg" position="bottom-right">
			<ExpandableChatHeader className="flex-col text-center justify-center">
				<h1 className="text-xl font-semibold">Chat with our AI ✨</h1>
				<p>Ask any question for our AI to answer</p>
				<div className="flex gap-2 items-center pt-2">
					<Button variant="secondary">New Chat</Button>
					<Button variant="secondary">See FAQ</Button>
				</div>
			</ExpandableChatHeader>
			<ExpandableChatBody>
				<ChatMessageList>
					<ChatBubble>
						<ChatBubbleAvatar />
						<ChatBubbleMessage>{message.content}</ChatBubbleMessage>
					</ChatBubble>
				</ChatMessageList>
			</ExpandableChatBody>
			<ExpandableChatFooter>
				<ChatInput />
				<Button type="submit" size="icon">
					<Send className="size-4" />
				</Button>
			</ExpandableChatFooter>
		</ExpandableChat>
	)
}
