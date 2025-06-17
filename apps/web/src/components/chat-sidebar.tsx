import { Link, useLocation } from '@tanstack/react-router'
import { Github, MessagesSquare } from 'lucide-react'
import * as React from 'react'

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
	SidebarRail,
} from '@repo/ui/components/ui/sidebar'

const links = [
	{
		name: 'Agents',
		url: '/agents',
		//icon: AgentIcon,
	},
	{
		name: 'Networks',
		url: '/networks',
		//icon: Network,
	},
	{
		name: 'Tools',
		url: '/tools',
		//icon: ToolsIcon,
	},
	{
		name: 'MCP Servers',
		url: '/mcps',
		//icon: McpServerIcon,
	},
	{
		name: 'Workflows',
		url: '/workflows',
		//icon: WorkflowIcon,
	},
	{
		name: 'Runtime Context',
		url: '/runtime-context',
		//icon: Globe,
	},
]

export function ChatSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const pathname = useLocation({
		select: (location) => location.pathname,
	})
	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<a href="https://assistant-ui.com" target="_blank">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<MessagesSquare className="size-4" />
								</div>
								<div className="flex flex-col gap-0.5 leading-none">
									<span className="font-semibold">assistant-ui</span>
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{links.map((item, index) => {
								const [_, pagePath] = pathname.split('/')
								const lowercasedPagePath = item.name.toLowerCase()
								const isActive =
									item.url === pathname || item.name === pathname || pagePath === lowercasedPagePath
								return (
									<SidebarMenuItem key={`${item.name}-${index}`}>
										<SidebarMenuButton tooltip={item.name} asChild>
											<Link
												className={`group/icon pr-4 ${isActive ? 'text-primary bg-muted/50' : 'text-[#939393]'}`}
												to={item.url}
											>
												{/**<Icon>
													<item.icon />
												</Icon>*/}
												<span className="text-[0.8rem] font-normal">{item.name}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								)
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarRail />
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<a href="https://github.com/assistant-ui/assistant-ui" target="_blank">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<Github className="size-4" />
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
