'use client'

import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'sonner'

//import type { Metadata } from 'next'

import './globals.css'

import { Providers } from '@/app/providers'
import { AppSidebar } from '@/components/app-sidebar'
import { ModeToggle } from '@/components/mode-toggle'
import ChatSupport from '@/components/support/chat'
//import { Menu } from 'lucide'
import { useState } from 'react'

import { Button } from '@repo/ui/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@repo/ui/components/ui/sheet'
import { SidebarInset, SidebarProvider } from '@repo/ui/components/ui/sidebar'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

/**export const metadata: Metadata = {
	title: 'Smart Medical Record',
	description: 'FHIR R4/R5 compatible',
}*/

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<Providers>
					<SidebarProvider>
						<AppSidebar />
						<SidebarInset>
							<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
								<div className="md:hidden absolute top-4 left-4 z-50">
									<Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
										<SheetTrigger asChild>
											<Button variant="ghost" size="icon" data-testid="mobile-menu-button">
												{/**<Menu className="h-5 w-5" />*/}
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
								</div>
							</header>
							<main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
						</SidebarInset>
					</SidebarProvider>

					<Toaster />
					<ChatSupport />
				</Providers>
			</body>
		</html>
	)
}
