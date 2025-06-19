'use client'

import { Link, useLocation } from '@tanstack/react-router'
import { Calendar, ChevronRight, Home, Inbox, Search, Settings } from 'lucide-react'

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@repo/ui/components/ui/collapsible'
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@repo/ui/components/ui/sidebar'

import type { LucideIcon } from 'lucide-react'

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
		url: '#',
		icon: Settings,
		items: [
			{
				title: 'Account',
				url: '/dashboard/settings/account',
			},
			{
				title: 'Security',
				url: '/dashboard/settings/security',
			},
			{
				title: 'Api Keys',
				url: '/dashboard/settings/api-keys',
			},
			{
				title: 'Organization',
				url: '/dashboard/settings/organization',
			},
		],
	},
]

export function NavMain() {
	const pathname = useLocation({
		select: (location) => location.pathname,
	})
	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item, index) => {
						const [_, pagePath] = pathname.split('/')
						const lowercasedPagePath = item.title.toLowerCase()
						//const isOpen =
						const isActive =
							item.url === pathname || item.title === pathname || pagePath === lowercasedPagePath
						return (
							<>
								{item.items ? (
									<Collapsible
										key={item.title}
										asChild
										defaultOpen={isActive}
										className="group/collapsible"
									>
										<SidebarMenuItem>
											<CollapsibleTrigger asChild>
												<SidebarMenuButton tooltip={item.title}>
													{item.icon && <item.icon />}
													<span>{item.title}</span>
													<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
												</SidebarMenuButton>
											</CollapsibleTrigger>
											<CollapsibleContent>
												<SidebarMenuSub>
													{item.items?.map((subItem) => (
														<SidebarMenuSubItem key={subItem.title}>
															<SidebarMenuSubButton asChild>
																<Link
																	className={`group/icon pr-4 ${isActive ? 'text-primary bg-muted/50' : 'text-[#939393]'}`}
																	to={subItem.url}
																>
																	<span>{subItem.title}</span>
																</Link>
															</SidebarMenuSubButton>
														</SidebarMenuSubItem>
													))}
												</SidebarMenuSub>
											</CollapsibleContent>
										</SidebarMenuItem>
									</Collapsible>
								) : (
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
								)}
							</>
						)
					})}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}
