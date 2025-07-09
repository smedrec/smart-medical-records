import { SectionHeader } from '@/components/tiny-components'
import {
	Book,
	CircleUser,
	Fingerprint,
	Github,
	Hospital,
	Key,
	MessagesSquare,
	Settings,
	TerminalIcon,
} from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

import { Separator } from '@repo/ui/components/ui/separator'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from '@repo/ui/components/ui/sidebar'
import { cn } from '@repo/ui/lib/utils'

import { ThreadList } from './assistant-ui/thread-list'

export function AppSidebar({
	isMobile = false,
	...props
}: {
	isMobile?: boolean
	props?: React.ComponentProps<typeof Sidebar>
}) {
	return (
		<Sidebar
			className={cn(
				'bg-background border-r overflow-hidden',
				isMobile ? 'p-3 pt-12 w-full h-full' : 'p-4 w-72 left-0 top-0 z-40 h-screen',
				!isMobile && 'hidden md:flex md:flex-col'
			)}
			{...props}
		>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link href="https://assistant-ui.com" target="_blank">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<MessagesSquare className="size-4" />
								</div>
								<div className="flex flex-col gap-0.5 leading-none">
									<span className="font-semibold">assistant-ui</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<ThreadList />
			</SidebarContent>

			<SidebarRail />
			{/* ---------- footer ---------- */}
			<SidebarFooter className="px-2 py-4">
				<SidebarMenu>
					<FooterLink to="https://smedrec-67bbd.web.app/" Icon={Book} label="Documentation" />
					<FooterLink
						to="https://github.com/smedrec/smart-medical-records"
						Icon={Github}
						label="View Source"
					/>
					<FooterLink to="/dashboard/audit" Icon={TerminalIcon} label="Logs" />
					<SectionHeader className="px-0 py-0 text-xs flex gap-1 mr-2">
						<Settings className="size-4" />
						<div>Settings</div>
					</SectionHeader>
					<Separator />
					<FooterLink to="/dashboard/settings/account" Icon={CircleUser} label="Account" />
					<FooterLink to="/dashboard/settings/security" Icon={Fingerprint} label="Security" />
					<FooterLink to="/dashboard/settings/api-keys" Icon={Key} label="Api Keys" />
					<FooterLink
						to="/dashboard/settings/organization"
						Icon={Hospital}
						label="Organization Settings"
					/>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	)
}

/* ---------- footer link ---------- */
const FooterLink = ({ to, Icon, label }: { to: string; Icon: typeof Book; label: string }) => {
	const isExternal = to.startsWith('http://') || to.startsWith('https://')

	if (isExternal) {
		return (
			<SidebarMenuItem>
				<a href={to} target="_blank" rel="noopener noreferrer">
					<SidebarMenuButton>
						<Icon className="h-4 w-4 mr-3" />
						{label}
					</SidebarMenuButton>
				</a>
			</SidebarMenuItem>
		)
	}

	return (
		<SidebarMenuItem>
			<Link href={to}>
				<SidebarMenuButton>
					<Icon className="h-4 w-4 mr-3" />
					{label}
				</SidebarMenuButton>
			</Link>
		</SidebarMenuItem>
	)
}
