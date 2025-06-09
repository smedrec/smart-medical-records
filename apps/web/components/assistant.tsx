'use client'

import { ChatSidebar } from '@/components/chat-sidebar'
import { CopilotKitComponent } from '@/components/copilotkit'
import { ModeToggle } from '@/components/mode-toggle'
import { GitHubIcon, UserButton } from '@daveyplate/better-auth-ui'

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@repo/ui/components/ui/breadcrumb'
import { Button } from '@repo/ui/components/ui/button'
import { Separator } from '@repo/ui/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@repo/ui/components/ui/sidebar'

export const Assistant = () => {
	return (
		<SidebarProvider>
			<ChatSidebar />
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

					<div className="flex items-center gap-2">
						<a
							href="https://github.com/daveyplate/better-auth-tanstack-starter"
							target="_blank"
							rel="noreferrer"
						>
							<Button variant="outline" size="icon" className="size-8 rounded-full">
								<GitHubIcon />
							</Button>
						</a>

						<ModeToggle />
						<UserButton />
					</div>
				</header>
				<CopilotKitComponent />
			</SidebarInset>
		</SidebarProvider>
	)
}
