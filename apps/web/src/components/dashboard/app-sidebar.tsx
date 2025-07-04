import ConnectionStatus from '@/components/dashboard/connection-status'
import { SectionHeader } from '@/components/dashboard/tiny-components'
import { useAgents } from '@/hooks/use-agents'
import { useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { Book, Cog, Plus, TerminalIcon } from 'lucide-react'
import { useMemo } from 'react'
import { toast } from 'sonner'

import { Button } from '@repo/ui/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu'
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
import clientLogger from '../../lib/logger'

const OrganizationsListSection = ({
	organizations,
	isLoadingOrganizations,
	activeOrganizationId,
}: {
	organizations: Organization[] | undefined
	isLoadingOrganizations: boolean
	activeOrganizationId: string
}) => {
	return (
		<>
			<div className="flex items-center px-4 pt-1 pb-0 text-muted-foreground">
				<SectionHeader className="px-0 py-0 text-xs flex gap-1 mr-2">
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
						{organizations?.map((organization) => (
							<GroupForOrganizations
								key={organization.id}
								organizationId={organization.id}
								activeOrganizationId={activeOrganizationId}
							/>
						))}
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
export function AppSidebar({
	refreshHomePage,
	isMobile = false,
}: AppSidebarProps & { isMobile?: boolean }) {
	const location = useLocation()
	const navigate = useNavigate()
	const queryClient = useQueryClient() // Get query client instance
	const version = useVersionString() // Get api version

	const { data: agentsData, error: agentsError, isLoading: isLoadingAgents } = useAgents()
	const { data: organizationsData, isPending: isLoadingOrganizations } =
		authClient.useListOrganizations()
	const { data: activeOrganization } = authClient.useActiveOrganization()

	const agents = useMemo(() => agentsData?.agents || [], [agentsData])
	const organizations = useMemo(() => organizationsData || [], [organizationsData])

	const [onlineAgents, offlineAgents] = useMemo(
		() => partition(agents, (a) => a.status === CoreAgentStatus.ACTIVE),
		[agents]
	)

	const agentLoadError = agentsError
		? 'Error loading agents: NetworkError: Unable to connect to the server. Please check if the server is running.'
		: undefined

	const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault()
		clientLogger.info('[AppSidebar] handleLogoClick triggered', { currentPath: location.pathname })

		// Invalidate queries that should be fresh on home page
		void queryClient.invalidateQueries({ queryKey: ['agents'] })
		void queryClient.invalidateQueries({ queryKey: ['servers'] })
		void queryClient.invalidateQueries({ queryKey: ['channels'] }) // This is broad, consider more specific invalidations if performance is an issue
		// Example: if you know active server IDs, invalidate ['channels', serverId]

		if (location.pathname === '/') {
			clientLogger.info('[AppSidebar] Already on home page. Calling refreshHomePage().')
			// refreshHomePage should ideally trigger a re-render/refetch in Home.tsx
			// This can be done by changing a key prop on Home.tsx or further query invalidations if needed.
			refreshHomePage()
		} else {
			clientLogger.info('[AppSidebar] Not on home page. Navigating to "/".')
			void navigate('/dashboard')
		}
	}

	function renderCreateNewButton() {
		const navigate = useNavigate()

		const handleCreateAgent = () => {
			void navigate('/create')
		}

		const handleCreateGroup = () => {
			void navigate('/group/new')
		}

		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="outline"
						className="w-full justify-start rounded-[8px] py-5 border-white"
					>
						<Plus className="size-4" />
						Create New
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="start"
					className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)]"
				>
					<DropdownMenuItem onClick={handleCreateAgent} className="w-full">
						Create New Agent
					</DropdownMenuItem>
					<DropdownMenuItem onClick={handleCreateGroup} className="w-full">
						Create New Group
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		)
	}

	return (
		<>
			<Sidebar
				className={cn(
					'bg-background border-r overflow-hidden',
					isMobile ? 'p-3 pt-12 w-full h-full' : 'p-4 w-72 fixed left-0 top-0 z-40 h-screen',
					!isMobile && 'hidden md:flex md:flex-col'
				)}
				collapsible="none"
				data-testid="app-sidebar"
			>
				{/* ---------- header ---------- */}
				<SidebarHeader>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton size="lg" asChild>
								<a
									href="/"
									onClick={handleLogoClick}
									className="px-4 py-2 h-full sidebar-logo no-underline"
								>
									<div className="flex flex-col pt-2 gap-1 items-start justify-center">
										<img
											alt="smedrec-logo"
											src="/smedrec-logo-light.png"
											className="w-32 max-w-full"
										/>
										<span className="text-xs font-mono text-muted-foreground">v{version}</span>
									</div>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>

				{/* ---------- content ---------- */}
				<SidebarContent className="flex-1 overflow-y-auto">
					{/* create agent button - moved from old CreateButton dropdown */}
					{/* This section is for the "Agents" list.
              The "Create Agent" button should ideally be next to the "Agents" title.
              Let's adjust the structure slightly if needed or place it prominently.
          */}
					{agentLoadError && <div className="px-4 py-2 text-xs text-red-500">{agentLoadError}</div>}

					<div className="px-4 py-6">{renderCreateNewButton()}</div>

					{isLoadingAgents && !agentLoadError && (
						<SidebarSection title="Agents">
							<SidebarMenuSkeleton />
						</SidebarSection>
					)}

					{!isLoadingAgents && !agentLoadError && (
						<>
							<AgentListSection
								agents={[...onlineAgents, ...offlineAgents]}
								activePath={location.pathname}
							/>
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
						<FooterLink to="https://eliza.how/" Icon={Book} label="Documentation" />
						<FooterLink to="/logs" Icon={TerminalIcon} label="Logs" />
						<FooterLink to="/settings" Icon={Cog} label="Settings" />
						<ConnectionStatus />
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
			<NavLink to={to}>
				<SidebarMenuButton>
					<Icon className="h-4 w-4 mr-3" />
					{label}
				</SidebarMenuButton>
			</NavLink>
		</SidebarMenuItem>
	)
}
