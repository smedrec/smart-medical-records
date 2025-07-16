import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

/* ---------- tiny components ---------- */
const SectionHeader = ({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) => (
	<div
		className={cn(
			"sidebar-section-header px-4 pt-1 pb-0 font-medium text-muted-foreground text-sm",
			className,
		)}
	>
		{children}
	</div>
);

const SidebarSection = ({
	title,
	children,
	className = "",
}: {
	title: string;
	children: React.ReactNode;
	className?: string;
}) => (
	<>
		<SectionHeader className={className}>{title}</SectionHeader>
		<SidebarGroup>
			<SidebarGroupContent className="mt-0">
				<SidebarMenu>{children}</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	</>
);

export { SectionHeader, SidebarSection };
