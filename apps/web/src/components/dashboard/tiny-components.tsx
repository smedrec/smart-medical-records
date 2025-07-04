import { SidebarGroup, SidebarGroupContent, SidebarMenu } from '@repo/ui/components/ui/sidebar'
import { cn } from '@repo/ui/lib/utils'

/* ---------- tiny components ---------- */
const SectionHeader = ({
	children,
	className = '',
}: {
	children: React.ReactNode
	className?: string
}) => (
	<div
		className={cn(
			'px-4 pt-1 pb-0 text-sm font-medium text-muted-foreground sidebar-section-header',
			className
		)}
	>
		{children}
	</div>
)

const SidebarSection = ({
	title,
	children,
	className = '',
}: {
	title: string
	children: React.ReactNode
	className?: string
}) => (
	<>
		<SectionHeader className={className}>{title}</SectionHeader>
		<SidebarGroup>
			<SidebarGroupContent className="mt-0">
				<SidebarMenu>{children}</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	</>
)

export { SectionHeader, SidebarSection }
