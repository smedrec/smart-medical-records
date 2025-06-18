import { GitHubIcon, OrganizationSwitcher } from '@daveyplate/better-auth-ui'
import { Link, useLocation } from '@tanstack/react-router'
import { Calendar, Home, Inbox, Search, Settings } from 'lucide-react'

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@repo/ui/components/ui/sidebar'

// Menu items.
const items = [
	{
		title: 'Home',
		url: '#',
		icon: Home,
	},
	{
		title: 'Inbox',
		url: '#',
		icon: Inbox,
	},
	{
		title: 'Calendar',
		url: '#',
		icon: Calendar,
	},
	{
		title: 'Search',
		url: '#',
		icon: Search,
	},
	{
		title: 'Settings',
		url: '/dashboard/settings',
		icon: Settings,
	},
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const pathname = useLocation({
		select: (location) => location.pathname,
	})

	return (
		<Sidebar collapsible="none" {...props}>
			<SidebarHeader>
				<OrganizationSwitcher />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item, index) => {
								const [_, pagePath] = pathname.split('/')
								const lowercasedPagePath = item.title.toLowerCase()
								const isActive =
									item.url === pathname ||
									item.title === pathname ||
									pagePath === lowercasedPagePath
								return (
									<SidebarMenuItem key={`${item.title}-${index}`}>
										<SidebarMenuButton tooltip={item.title} asChild>
											<Link
												className={`group/icon pr-4 ${isActive ? 'text-primary bg-muted/50' : 'text-[#939393]'}`}
												to={item.url}
											>
												<item.icon />
												<span className="text-[0.8rem] font-normal">{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								)
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<a href="https://github.com/joseantcordeiro/smart-medical-record" target="_blank">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<GitHubIcon className="size-4" />
								</div>
								<div className="flex flex-col gap-0.5 leading-none">
									<span className="font-semibold">GitHub</span>
									<span className="">View Source</span>
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	)
}
