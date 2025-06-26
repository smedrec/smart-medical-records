'use client'

import { AgentIcon } from '@/components/icons/agent-icon'
import { Link, useLocation } from '@tanstack/react-router'
import {
	Activity,
	Calendar,
	ChevronRight,
	CircleUser,
	Fingerprint,
	Home,
	Hospital,
	Key,
	Search,
	Settings,
	ShieldAlert,
	Stethoscope,
} from 'lucide-react'

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

// Menu items.
const items = [
	{
		title: 'Home',
		tooltip: 'Home',
		url: '/dashboard',
		icon: Home,
	},
	{
		title: 'AI Assistant',
		tooltip: 'Talk with our Assistant',
		url: '/dashboard/ai/chat',
		icon: AgentIcon,
	},
	{
		title: 'Practitioners',
		tooltip:
			'All individuals who are engaged in the healthcare process and healthcare-related services as part of their formal responsibilities.',
		url: '/dashboard/practitioners',
		icon: Stethoscope,
	},
	{
		title: 'Patients',
		tooltip:
			'Demographics and other administrative information about an individual or animal receiving care or other health-related services.',
		url: '/dashboard/patients',
		icon: Activity,
	},
	{
		title: 'Calendar',
		tooltip: 'Organization calendar',
		url: '/dashboard/calendar',
		icon: Calendar,
	},
	{
		title: 'Search',
		tooltip: 'Search resources',
		url: '/dashboard/search',
		icon: Search,
	},
	{
		title: 'Audit logs',
		tooltip: 'Audit logs',
		url: '/dashboard/audit',
		icon: ShieldAlert,
	},
	{
		title: 'Settings',
		tooltip: 'Settings',
		url: '#',
		icon: Settings,
		items: [
			{
				title: 'Account',
				tooltip: 'Account',
				icon: CircleUser,
				url: '/dashboard/settings/account',
			},
			{
				title: 'Security',
				tooltip: 'Security',
				icon: Fingerprint,
				url: '/dashboard/settings/security',
			},
			{
				title: 'Api Keys',
				tooltip: 'Api Keys',
				icon: Key,
				url: '/dashboard/settings/api-keys',
			},
			{
				title: 'Organization',
				tooltip:
					'A formally or informally recognized grouping of people or organizations formed for the purpose of achieving some form of collective action.',
				icon: Hospital,
				url: '/dashboard/settings/organization',
			},
		],
	},
]

export function NavMain() {
	const pathname = useLocation({
		select: (location) => location.pathname,
	})
	// FIXME - const isActive
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Main Menu</SidebarGroupLabel>
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
										<SidebarMenuItem key={`${item.title}-${index}`}>
											<CollapsibleTrigger asChild>
												<SidebarMenuButton tooltip={item.tooltip}>
													{item.icon && <item.icon />}
													<span>{item.title}</span>
													<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
												</SidebarMenuButton>
											</CollapsibleTrigger>
											<CollapsibleContent>
												<SidebarMenuSub>
													{item.items?.map((subItem, subIndex) => (
														<SidebarMenuSubItem key={`${subItem.title}-${subIndex}`}>
															<SidebarMenuSubButton asChild>
																<Link
																	className={`group/icon pr-4 ${isActive ? 'text-primary bg-muted/50' : 'text-[#939393]'}`}
																	to={subItem.url}
																>
																	<subItem.icon />
																	<span className="text-[0.8rem] font-normal">{subItem.title}</span>
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
										<SidebarMenuButton tooltip={item.tooltip} asChild>
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
