import * as crypto from "node:crypto";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
	Book,
	Bot,
	Github,
	RefreshCcw,
	TerminalIcon,
	Users,
} from "lucide-react";
import { useMemo } from "react";
import { Separator } from "@/components/ui/separator";
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
} from "@/components/ui/sidebar";
import { useAgents } from "@/hooks/use-agents";
import { useVersionString } from "@/hooks/use-version";
import { cn } from "@/lib/utils";
import { SectionHeader, SidebarSection } from "./tiny-components";

//import clientLogger from '../../lib/logger'

import type { GetAgentResponse } from "@mastra/client-js";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import type { Organization } from "better-auth/plugins/organization";
import {
	useActiveOrganization,
	useListOrganizations,
} from "@/hooks/auth-hooks";
import { i18n } from "@/lib/configs/i18n";
import type { LocaleType } from "@/types";
import { Button } from "../ui/button";

type Agent = GetAgentResponse & { id: string };

const AgentRow = ({
	agent,
	isOnline,
	active,
}: {
	agent: Agent;
	isOnline: boolean;
	active: boolean;
}) => (
	<SidebarMenuItem>
		<Link to={`/app/chat/${agent.id}`}>
			<SidebarMenuButton
				isActive={active}
				className="my-1 h-full justify-between rounded-md px-2 py-2"
			>
				<span className="max-w-24 truncate text-base">{agent.name}</span>
				<div className="flex items-center">
					<div className="relative h-6 w-6 rounded-full bg-gray-600">
						<span
							className={cn(
								"absolute right-0 bottom-0 h-[8px] w-[8px] rounded-full border border-white",
								isOnline ? "bg-green-500" : "bg-muted-foreground",
							)}
						/>
					</div>
				</div>
			</SidebarMenuButton>
		</Link>
	</SidebarMenuItem>
);

const AgentListSection = ({
	agents,
	activePath,
}: {
	agents: Agent[];
	activePath: string;
}) => {
	return (
		<>
			<div className="flex items-center px-4 pt-1 pb-0 text-muted-foreground">
				<SectionHeader className="mr-2 flex gap-1 px-0 py-0 text-xs">
					<Bot className="size-4" />
					<div>Agents</div>
				</SectionHeader>
				<Separator />
			</div>
			<SidebarGroup>
				<SidebarGroupContent className="mt-0 px-1">
					<SidebarMenu>
						{agents.map((a) => (
							<AgentRow
								key={a?.id}
								agent={a as Agent}
								isOnline={true}
								active={activePath.includes(`/app/chat/${String(a?.id)}`)}
							/>
						))}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</>
	);
};

const OrganizationsListSection = ({
	organizations,
	isLoadingOrganizations,
	activeOrganizationId,
}: {
	organizations: Organization[] | undefined;
	isLoadingOrganizations: boolean;
	activeOrganizationId: string | undefined;
}) => {
	const navigate = useNavigate();

	async function setActiveOrganization(id: string) {
		try {
			const result = await fetch(
				`http://localhost:8801/organizations/${id}/set-active`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			if (!result.ok) {
				throw new Error("Failed to update organization");
			}
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<>
			<div className="flex items-center px-4 pt-1 pb-0 text-muted-foreground">
				<SectionHeader className="mr-2 flex gap-1 px-0 py-0 text-xs">
					<Users className="size-4" />
					<div>Organizations</div>
				</SectionHeader>
				<Separator />
			</div>
			<SidebarGroup>
				<SidebarGroupContent className="mt-0 px-1">
					<SidebarMenu>
						{isLoadingOrganizations &&
							Array.from({ length: 3 }).map((_) => (
								<SidebarMenuItem
									key={`${crypto.randomBytes(5).toString("hex")}`}
								>
									<SidebarMenuSkeleton />
								</SidebarMenuItem>
							))}
						{organizations?.map((organization) => {
							const active = organization.id === activeOrganizationId;
							return (
								<SidebarMenuItem key={organization.id}>
									<SidebarMenuButton
										isActive={active}
										className="my-1 h-full justify-between rounded-md px-2 py-2"
										onClick={async () => {
											if (active) {
												navigate({
													to: "/app/staff",
												});
											} else {
												await setActiveOrganization(organization.id);
											}
										}}
									>
										{/* Name */}
										<span className="max-w-24 truncate text-base">
											{organization.name}
										</span>
										<div className="flex items-center gap-2">
											{/* Organization logo */}
											<div className="-space-x-2 flex">
												{organization.logo ? (
													<img
														key={organization.id}
														src={organization.logo}
														alt={organization.name}
														className="h-6 w-6 rounded-full border border-background object-cover"
													/>
												) : (
													<></>
												)}
											</div>
										</div>
									</SidebarMenuButton>
								</SidebarMenuItem>
							);
						})}

						{(!organizations || organizations.length === 0) &&
							!isLoadingOrganizations && (
								<SidebarMenuItem>
									<div className="p-4 text-muted-foreground text-xs">
										No organizations found.
									</div>
								</SidebarMenuItem>
							)}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</>
	);
};
/**
 * Renders the main application sidebar, displaying navigation, agent lists, group rooms, and utility links.
 *
 * The sidebar includes sections for online and offline agents, group rooms, a create button for agents and groups, and footer links to documentation, logs, and settings. It handles loading and error states for agent and room data, and conditionally displays a group creation panel.
 */
export function AppSidebar({
	isMobile = false,
	...props
}: {
	isMobile?: boolean;
	props?: React.ComponentProps<typeof Sidebar>;
}) {
	const location = useLocation();
	const version = useVersionString(); // Get api version

	const queryClient = useQueryClient();

	const locale = "en" as LocaleType;
	const direction = i18n.localeDirection[locale];
	const isRTL = direction === "rtl";

	const {
		data: agentsData,
		error: agentsError,
		isLoading: isLoadingAgents,
	} = useAgents();
	const {
		data: organizationsData,
		isPending: isLoadingOrganizations,
		error: organizationsError,
	} = useListOrganizations();
	const { data: activeOrganization } = useActiveOrganization();

	const agents = useMemo(() => agentsData || [], [agentsData]);
	const organizations = useMemo(
		() => organizationsData || [],
		[organizationsData],
	);

	const agentLoadError = agentsError
		? "Error loading agents: NetworkError: Unable to connect to the server. Please check if the server is running."
		: undefined;

	const organizationsLoadError = organizationsError
		? "Error loading organizations: NetworkError: Unable to connect to the server. Please check if the server is running."
		: undefined;

	return (
		<>
			<Sidebar
				className={cn(
					"overflow-hidden border-r bg-background",
					isMobile
						? "h-full w-full p-3 pt-12"
						: "top-0 left-0 z-40 h-screen w-72 p-4",
					!isMobile && "hidden md:flex md:flex-col",
				)}
				collapsible="none"
				variant="inset" // Added variant="inset"
				side={isRTL ? "right" : "left"}
				data-testid="app-sidebar"
				{...props}
			>
				{/* ---------- header ---------- */}
				<SidebarHeader>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton size="lg" asChild>
								<Link
									to="/app"
									className="sidebar-logo h-full px-4 py-2 no-underline"
								>
									<div className="flex flex-col items-start justify-center gap-1 pt-2">
										<img
											alt="smedrec-logo"
											src="/smedrec-logo-tmp.png"
											className="w-32 max-w-full"
										/>
										<span className="font-mono text-muted-foreground text-xs">
											v{version}
										</span>
									</div>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>

				{/* ---------- content ---------- */}
				<SidebarContent className="flex-1 overflow-y-auto">
					{/* ---------- agents ---------- */}
					{agentLoadError && (
						<div className="px-4 py-2 text-red-500 text-xs">
							{agentLoadError}
							<Button
								variant="ghost"
								size="icon"
								className="size-8 rounded-full"
								onClick={() => queryClient.invalidateQueries(["agents"])}
							>
								<RefreshCcw className="me-2 h-4 w-4" />
							</Button>
						</div>
					)}
					{isLoadingAgents && !agentLoadError && (
						<SidebarSection title="Agents">
							<SidebarMenuSkeleton />
						</SidebarSection>
					)}
					{!isLoadingAgents && !agentLoadError && (
						<AgentListSection agents={agents} activePath={location.pathname} />
					)}

					{/* ---------- organizations ---------- */}
					{organizationsLoadError && (
						<div className="px-4 py-2 text-red-500 text-xs">
							{organizationsLoadError}
						</div>
					)}
					{isLoadingOrganizations && !organizationsError && (
						<SidebarSection title="Organizations">
							<SidebarMenuSkeleton />
						</SidebarSection>
					)}
					{!isLoadingOrganizations && !organizationsError && (
						<OrganizationsListSection
							organizations={organizations}
							isLoadingOrganizations={isLoadingOrganizations}
							activeOrganizationId={activeOrganization?.id}
						/>
					)}
				</SidebarContent>

				{/* ---------- footer ---------- */}
				<SidebarFooter className="px-2 py-4">
					<SidebarMenu>
						<FooterLink
							to="https://smedrec-67bbd.web.app/"
							Icon={Book}
							label="Documentation"
						/>
						<FooterLink
							to="https://github.com/joseantcordeiro/smedrec-apps"
							Icon={Github}
							label="View Source"
						/>
						<FooterLink to="/app/audit" Icon={TerminalIcon} label="Logs" />
					</SidebarMenu>
				</SidebarFooter>
			</Sidebar>
		</>
	);
}

/* ---------- footer link ---------- */
const FooterLink = ({
	to,
	Icon,
	label,
}: {
	to: string;
	Icon: typeof Book;
	label: string;
}) => {
	const isExternal = to.startsWith("http://") || to.startsWith("https://");

	if (isExternal) {
		return (
			<SidebarMenuItem>
				<a href={to} target="_blank" rel="noopener noreferrer">
					<SidebarMenuButton>
						<Icon className="mr-3 h-4 w-4" />
						{label}
					</SidebarMenuButton>
				</a>
			</SidebarMenuItem>
		);
	}

	return (
		<SidebarMenuItem>
			<Link to={to}>
				<SidebarMenuButton>
					<Icon className="mr-3 h-4 w-4" />
					{label}
				</SidebarMenuButton>
			</Link>
		</SidebarMenuItem>
	);
};
