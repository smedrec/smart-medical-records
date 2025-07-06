import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { ModeToggle } from '@/components/mode-toggle'
//import clientLogger from '@/lib/logger'
import { RedirectToSignIn, UserButton } from '@daveyplate/better-auth-ui'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@repo/ui/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@repo/ui/components/ui/sheet'
import { SidebarInset, SidebarProvider } from '@repo/ui/components/ui/sidebar'
import { useIsMobile } from '@repo/ui/hooks/use-mobile'

export const Route = createFileRoute('/dashboard')({
	component: DashboardLayout,
})

function DashboardLayout() {
	const isMobile = useIsMobile()
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

	return (
		<>
			<RedirectToSignIn />
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
						<div className="md:hidden absolute top-4 left-4 z-50">
							<Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
								<SheetTrigger asChild>
									<Button variant="ghost" size="icon" data-testid="mobile-menu-button">
										<Menu className="h-5 w-5" />
										<span className="sr-only">Toggle menu</span>
									</Button>
								</SheetTrigger>
								<SheetContent side="left" className="w-80 p-0 z-50">
									<AppSidebar isMobile={true} />
								</SheetContent>
							</Sheet>
						</div>

						<div className="ml-auto gap-2 px-3">
							<ModeToggle />
							<UserButton size={isMobile ? 'icon' : 'sm'} className="gap-2 px-3" />
						</div>
					</header>
					<div className="flex flex-1 flex-col gap-4 p-4">
						<Outlet />
					</div>
				</SidebarInset>
			</SidebarProvider>
		</>
	)
}
