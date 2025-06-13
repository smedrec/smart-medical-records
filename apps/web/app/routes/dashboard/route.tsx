import { AppSidebar } from '@/components/app-sidebar'
import { createFileRoute, Outlet } from '@tanstack/react-router'

import { SidebarProvider, SidebarTrigger } from '@repo/ui/components/ui/sidebar'

export const Route = createFileRoute('/dashboard')({
	component: DashboardLayout,
})

function DashboardLayout() {
	return (
		<SidebarProvider defaultOpen={true}>
			<AppSidebar />
			<main>
				<SidebarTrigger />
				<Outlet />
			</main>
		</SidebarProvider>
	)
}
