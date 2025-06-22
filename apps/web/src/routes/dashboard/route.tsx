import { ChatInput } from '@/components/ai/chat-input'
import { AppSidebar } from '@/components/app-sidebar'
import { ModeToggle } from '@/components/mode-toggle'
import { authClient } from '@/lib/auth-client'
import { useChat } from '@ai-sdk/react'
import { RedirectToSignIn, UserButton } from '@daveyplate/better-auth-ui'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { CornerDownLeft, Mic, Paperclip } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

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
import { useIsMobile } from '@repo/ui/hooks/use-mobile'

export const Route = createFileRoute('/dashboard')({
	component: DashboardLayout,
})

function DashboardLayout() {
	const isMobile = useIsMobile()
	const { data: activeOrganization } = authClient.useActiveOrganization()

	const [isGenerating, setIsGenerating] = useState(false)
	const { messages, setMessages, input, handleInputChange, handleSubmit, isLoading, reload } =
		useChat({
			onResponse(response) {
				if (response) {
					console.log(response)
					setIsGenerating(false)
				}
			},
			onError(error) {
				if (error) {
					setIsGenerating(false)
				}
			},
		})

	const messagesRef = useRef<HTMLDivElement>(null)
	const formRef = useRef<HTMLFormElement>(null)

	useEffect(() => {
		if (messagesRef.current) {
			messagesRef.current.scrollTop = messagesRef.current.scrollHeight
		}
	}, [messages])

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsGenerating(true)
		handleSubmit(e)
	}

	const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			if (isGenerating || isLoading || !input) return
			setIsGenerating(true)
			onSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
		}
	}

	const handleActionClick = async (action: string, messageIndex: number) => {
		console.log('Action clicked:', action, 'Message index:', messageIndex)
		if (action === 'Refresh') {
			setIsGenerating(true)
			try {
				await reload()
			} catch (error) {
				console.error('Error reloading:', error)
			} finally {
				setIsGenerating(false)
			}
		}

		if (action === 'Copy') {
			const message = messages[messageIndex]
			if (message && message.role === 'assistant') {
				void navigator.clipboard.writeText(message.content)
			}
		}
	}

	return (
		<>
			<RedirectToSignIn />
			<SidebarProvider defaultOpen={true}>
				<AppSidebar />
				<SidebarInset>
					<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
						<div className="flex flex-1 items-center gap-2 px-3">
							<SidebarTrigger />
							<Separator orientation="vertical" className="mr-2 h-4" />
							<Breadcrumb>
								<BreadcrumbList>
									<BreadcrumbItem className="hidden md:block">
										<BreadcrumbLink href="#">{activeOrganization?.name}</BreadcrumbLink>
									</BreadcrumbItem>
									<BreadcrumbSeparator className="hidden md:block" />
									<BreadcrumbItem className="hidden md:block">
										<BreadcrumbPage>Home</BreadcrumbPage>
									</BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb>
						</div>

						<div className="ml-auto gap-2 px-3">
							<ModeToggle />
							<UserButton size={isMobile ? 'icon' : 'sm'} className="gap-2 px-3" />
						</div>
					</header>
					{/* Form and Footer fixed at the bottom */}
					<div className="w-full px-4 pb-4">
						<form
							ref={formRef}
							onSubmit={onSubmit}
							className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
						>
							<ChatInput
								value={input}
								onKeyDown={onKeyDown}
								onChange={handleInputChange}
								placeholder="Type your message here..."
								className="rounded-lg bg-background border-0 shadow-none focus-visible:ring-0"
							/>
							<div className="flex items-center p-3 pt-0">
								<Button variant="ghost" size="icon">
									<Paperclip className="size-4" />
									<span className="sr-only">Attach file</span>
								</Button>

								<Button variant="ghost" size="icon">
									<Mic className="size-4" />
									<span className="sr-only">Use Microphone</span>
								</Button>

								<Button
									disabled={!input || isLoading}
									type="submit"
									size="sm"
									className="ml-auto gap-1.5"
								>
									Send Message
									<CornerDownLeft className="size-3.5" />
								</Button>
							</div>
						</form>
					</div>
					<Outlet />
				</SidebarInset>
			</SidebarProvider>
		</>
	)
}
