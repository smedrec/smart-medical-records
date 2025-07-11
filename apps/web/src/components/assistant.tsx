'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { Thread } from '@/components/assistant-ui/thread'
import { useHeaders } from '@/hooks/use-headers'
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
import { Loader } from '@repo/ui/components/ui/loader'
import { Separator } from '@repo/ui/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@repo/ui/components/ui/sidebar'

export const Assistant = () => {
	const { data: headers, isLoading } = useHeaders()
	if (isLoading) return <Loader />

	const runtime = useChatRuntime({
		api: 'http://localhost:4111/api/agents/assistantAgent/stream',
		headers: headers,
	})

	return (
		<AssistantRuntimeProvider runtime={runtime}>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
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
					</header>
					<Thread />
				</SidebarInset>
			</SidebarProvider>
		</AssistantRuntimeProvider>
	)
}
