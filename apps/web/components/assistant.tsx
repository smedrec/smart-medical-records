'use client'

import { Thread } from '@/components/assistant-ui/thread'
import { ChatSidebar } from '@/components/chat-sidebar'
import { AssistantRuntimeProvider } from '@assistant-ui/react'
import { useChatRuntime } from '@assistant-ui/react-ai-sdk'

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@repo/ui/components/ui/breadcrumb'
import { Separator } from '@repo/ui/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@repo/ui/components/ui/sidebar'

export const Assistant = () => {
	const runtime = useChatRuntime({
		api: 'http://localhost:4111/api/agents/chefAgent/stream',
	})

	return (
		<AssistantRuntimeProvider runtime={runtime}>
			<SidebarProvider>
				<ChatSidebar />
				<SidebarInset>
					<div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
						<SidebarTrigger />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink href="#">Build Your Own ChatGPT UX</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className="hidden md:block" />
								<BreadcrumbItem>
									<BreadcrumbPage>Starter Template</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
					<Thread />
				</SidebarInset>
			</SidebarProvider>
		</AssistantRuntimeProvider>
	)
}
