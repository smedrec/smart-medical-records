//import clientLogger from '@/lib/logger'
import { RedirectToSignIn, UserButton } from "@daveyplate/better-auth-ui";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import { AppSidebar } from "@/components/app/app-sidebar";
import { Footer } from "@/components/app/footer";
import { SettingsDropdown } from "@/components/app/settings-dropdown";
import { FullscreenToggle } from "@/components/full-screen-toggle";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/app")({
	component: DashboardLayout,
});

function DashboardLayout() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<>
			<RedirectToSignIn />
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<div className="w-full">
						{/* Header */}
						<header className="sticky top-0 z-50 border-b bg-background/60 px-4 py-3 backdrop-blur">
							<div className="container flex h-14 items-center justify-between gap-4 md:hidden">
								<Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
									<SheetTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											data-testid="mobile-menu-button"
										>
											<Menu className="h-5 w-5" />
											<span className="sr-only">Toggle menu</span>
										</Button>
									</SheetTrigger>
									<SheetContent side="left" className="z-50 w-80 p-0">
										<AppSidebar isMobile={true} />
									</SheetContent>
								</Sheet>
							</div>

							<div className="flex grow justify-end gap-2 p-3">
								<ModeToggle />
								<SettingsDropdown />
								<UserButton size="icon" />
								<FullscreenToggle />
							</div>
						</header>
						{/* Content */}
						<main className="min-h-[calc(100svh-6.82rem)] bg-muted/40">
							<Outlet />
						</main>
						<Footer />
					</div>
				</SidebarInset>
			</SidebarProvider>
		</>
	);
}
