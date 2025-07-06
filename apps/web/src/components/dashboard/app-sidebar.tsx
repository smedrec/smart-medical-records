import { SectionHeader, SidebarSection } from '@/components/dashboard/tiny-components'
import { useAgents } from '@/hooks/use-agents'
import { Link, useLocation } from '@tanstack/react-router'
import {
	Book,
	Bot,
	CircleUser,
	Cog,
	Fingerprint,
	Github,
	Hospital,
	Key,
	Plus,
	Settings,
	TerminalIcon,
	Users,
} from 'lucide-react'
import { useMemo } from 'react'

import { Separator } from '@repo/ui/components/ui/separator'
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
	SidebarMenuSkeleton,
} from '@repo/ui/components/ui/sidebar'
import { cn } from '@repo/ui/lib/utils'

import { useVersionString } from '../../hooks/use-version'
import { authClient } from '../../lib/auth-client'

//import clientLogger from '../../lib/logger'

import type { GetAgentResponse } from '@mastra/client-js'
import type { Organization } from 'better-auth/plugins/organization'

type Agent = GetAgentResponse & { id: string }

const AgentRow = ({
	agent,
	isOnline,
	active,
}: {
	agent: Agent
	isOnline: boolean
	active: boolean
}) => (
	<SidebarMenuItem>
		<Link to={`/dashboard/chat/${agent.id}`}>
			<SidebarMenuButton
				isActive={active}
				className="px-2 py-2 my-1 h-full rounded-md justify-between"
			>
				<span className="text-base truncate max-w-24">{agent.name}</span>
				<div className="flex items-center">
					<div className="relative w-6 h-6 rounded-full bg-gray-600">
						<span
							className={cn(
								'absolute bottom-0 right-0 w-[8px] h-[8px] rounded-full border border-white',
								isOnline ? 'bg-green-500' : 'bg-muted-foreground'
							)}
						/>
					</div>
				</div>
			</SidebarMenuButton>
		</Link>
	</SidebarMenuItem>
)

const AgentListSection = ({ agents, activePath }: { agents: Agent[]; activePath: string }) => {
	return (
		<>
			<div className="flex items-center px-4 pt-1 pb-0 text-muted-foreground">
				<SectionHeader className="px-0 py-0 text-xs flex gap-1 mr-2">
					<Bot className="size-4" />
					<div>Agents</div>
				</SectionHeader>
				<Separator />
			</div>
			<SidebarGroup>
				<SidebarGroupContent className="px-1 mt-0">
					<SidebarMenu>
						{agents.map((a) => (
							<AgentRow
								key={a?.id}
								agent={a as Agent}
								isOnline={true}
								active={activePath.includes(`/dashboard/chat/${String(a?.id)}`)}
							/>
						))}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</>
	)
}

const OrganizationsListSection = ({
	organizations,
	isLoadingOrganizations,
	activeOrganizationId,
}: {
	organizations: Organization[] | undefined
	isLoadingOrganizations: boolean
	activeOrganizationId: string | undefined
}) => {
	return (
		<>
			<div className="flex items-center px-4 pt-1 pb-0 text-muted-foreground">
				<SectionHeader className="px-0 py-0 text-xs flex gap-1 mr-2">
					<Users className="size-4" />
					<div>Organizations</div>
				</SectionHeader>
				<Separator />
			</div>
			<SidebarGroup>
				<SidebarGroupContent className="px-1 mt-0">
					<SidebarMenu>
						{isLoadingOrganizations &&
							Array.from({ length: 3 }).map((_, i) => (
								<SidebarMenuItem key={`skel-group-${i}`}>
									<SidebarMenuSkeleton />
								</SidebarMenuItem>
							))}
						{organizations?.map((organization) => {
							const active = organization.id === activeOrganizationId
							return (
								<SidebarMenuItem>
									<SidebarMenuButton
										isActive={active}
										className="px-2 py-2 my-1 h-full rounded-md justify-between"
									>
										{/* Name */}
										<span className="text-base truncate max-w-24">{organization.name}</span>
										<div className="flex items-center gap-2">
											{/* Organization logo */}
											<div className="flex -space-x-2">
												{organization.logo ? (
													<img
														key={organization.id}
														src={organization.logo}
														alt={organization.name}
														className="w-6 h-6 rounded-full object-cover border border-background"
													/>
												) : (
													<></>
												)}
											</div>
										</div>
									</SidebarMenuButton>
								</SidebarMenuItem>
							)
						})}

						{(!organizations || organizations.length === 0) && !isLoadingOrganizations && (
							<SidebarMenuItem>
								<div className="p-4 text-xs text-muted-foreground">No organizations found.</div>
							</SidebarMenuItem>
						)}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</>
	)
}
/**
 * Renders the main application sidebar, displaying navigation, agent lists, group rooms, and utility links.
 *
 * The sidebar includes sections for online and offline agents, group rooms, a create button for agents and groups, and footer links to documentation, logs, and settings. It handles loading and error states for agent and room data, and conditionally displays a group creation panel.
 */
export function AppSidebar({ isMobile = false }: { isMobile?: boolean }) {
	const location = useLocation()
	const version = useVersionString() // Get api version

	const { data: agentsData, error: agentsError, isLoading: isLoadingAgents } = useAgents()
	const { data: organizationsData, isPending: isLoadingOrganizations } =
		authClient.useListOrganizations()
	const { data: activeOrganization } = authClient.useActiveOrganization()

	const agents = useMemo(() => agentsData || [], [agentsData])
	const organizations = useMemo(() => organizationsData || [], [organizationsData])

	const agentLoadError = agentsError
		? 'Error loading agents: NetworkError: Unable to connect to the server. Please check if the server is running.'
		: undefined

	return (
		<>
			<Sidebar
				className={cn(
					'bg-background border-r overflow-hidden',
					isMobile ? 'p-3 pt-12 w-full h-full' : 'p-4 w-72 fixed left-0 top-0 z-40 h-screen',
					!isMobile && 'hidden md:flex md:flex-col'
				)}
				collapsible="none"
				variant="inset" // Added variant="inset"
				data-testid="app-sidebar"
			>
				{/* ---------- header ---------- */}
				<SidebarHeader>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton size="lg" asChild>
								<Link to="/dashboard" className="px-4 py-2 h-full sidebar-logo no-underline">
									<div className="flex flex-col pt-2 gap-1 items-start justify-center">
										<img
											alt="smedrec-logo"
											src="/smedrec-logo-tmp.png"
											className="w-32 max-w-full"
										/>
										<span className="text-xs font-mono text-muted-foreground">v{version}</span>
									</div>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>

				{/* ---------- content ---------- */}
				<SidebarContent className="flex-1 overflow-y-auto">
					{agentLoadError && <div className="px-4 py-2 text-xs text-red-500">{agentLoadError}</div>}

					{isLoadingAgents && !agentLoadError && (
						<SidebarSection title="Agents">
							<SidebarMenuSkeleton />
						</SidebarSection>
					)}

					{!isLoadingAgents && !agentLoadError && (
						<>
							<AgentListSection agents={agents} activePath={location.pathname} />
							<OrganizationsListSection
								organizations={organizations}
								isLoadingOrganizations={isLoadingOrganizations}
								activeOrganizationId={activeOrganization?.id}
							/>
						</>
					)}
				</SidebarContent>

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

			{/* Server management hidden - using single default server */}
		</>
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
			<Link to={to}>
				<SidebarMenuButton>
					<Icon className="h-4 w-4 mr-3" />
					{label}
				</SidebarMenuButton>
			</Link>
		</SidebarMenuItem>
	)
}
