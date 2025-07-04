import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { ModeToggle } from '@/components/mode-toggle'
import { ai } from '@/lib/ai/client'
import { STALE_TIMES } from '@/lib/constants'
//import clientLogger from '@/lib/logger'
import { RedirectToSignIn, UserButton } from '@daveyplate/better-auth-ui'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@repo/ui/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@repo/ui/components/ui/sheet'
import { SidebarInset, SidebarProvider } from '@repo/ui/components/ui/sidebar'
import { useIsMobile } from '@repo/ui/hooks/use-mobile'

// Create a query client with optimized settings
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: STALE_TIMES.STANDARD,
			// Default to no polling unless specifically configured
			refetchInterval: false,
			// Make queries retry 3 times with exponential backoff
			retry: 3,
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
			// Refetch query on window focus
			refetchOnWindowFocus: true,
			// Enable refetch on reconnect
			refetchOnReconnect: true,
			// Fail queries that take too long
		},
		mutations: {
			// Default to 3 retries for mutations too
			retry: 3,
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
		},
	},
})

// Prefetch initial data with smarter error handling
/**const prefetchInitialData = async () => {
	try {
		// Prefetch agents (real-time data so shorter stale time)
		await queryClient.prefetchQuery({
			queryKey: ['agents'],
			queryFn: async () => {
				const result = await ai.getAgents()
				return { data: result }
			},
			staleTime: STALE_TIMES.FREQUENT,
		})
	} catch (error) {
		console.error('Error prefetching initial data:', error)
		// Don't throw, let the app continue loading with fallbacks
	}
}*/

// Execute prefetch immediately
//void prefetchInitialData()

export const Route = createFileRoute('/dashboard')({
	component: DashboardLayout,
})

function DashboardLayout() {
	const isMobile = useIsMobile()
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [homeKey, setHomeKey] = useState(Date.now())
	const pathname = useLocation({
		select: (location) => location.pathname,
	})

	const queryClient = useQueryClient()

	const refreshHomePage = () => {
		//clientLogger.info('[AppContent] refreshHomePage called. Current homeKey:', homeKey)
		const newKey = Date.now()
		setHomeKey(newKey)
		//clientLogger.info('[AppContent] New homeKey set to:', newKey)

		//clientLogger.info('[AppContent] Invalidating queries for Home page refresh.')
		queryClient.invalidateQueries({ queryKey: ['agents'] })
	}

	return (
		<>
			<RedirectToSignIn />
			<SidebarProvider>
				<AppSidebar refreshHomePage={refreshHomePage} />
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
									<AppSidebar isMobile={true} refreshHomePage={refreshHomePage} />
								</SheetContent>
							</Sheet>
						</div>

						<div className="ml-auto gap-2 px-3">
							<ModeToggle />
							<UserButton size={isMobile ? 'icon' : 'sm'} className="gap-2 px-3" />
						</div>
					</header>

					<Outlet />
				</SidebarInset>
			</SidebarProvider>
		</>
	)
}
