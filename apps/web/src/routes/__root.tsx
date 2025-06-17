import { seo } from '@/lib/seo'
import { Providers } from '@/providers'
import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'

import type { ReactNode } from 'react'

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			...seo({
				title: 'TanStack Start | Type-Safe, Client-First, Full-Stack React Framework',
				description: `TanStack Start is a type-safe, client-first, full-stack React framework. `,
			}),
		],
		links: [
			{ rel: 'stylesheet', href: '/public/styles/globals.css' }, // Direct link to public directory
			{ rel: 'icon', href: '/favicon.ico' },
			{ rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
			{ rel: 'manifest', href: '/manifest.webmanifest' },
		],
	}),
	component: RootComponent,
})

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	)
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<meta name="viewport" content="initial-scale=1, viewport-fit=cover, width=device-width" />
				<meta name="theme-color" media="(prefers-color-scheme: light)" content="oklch(1 0 0)" />
				<meta name="theme-color" media="(prefers-color-scheme: dark)" content="oklch(0.145 0 0)" />

				<HeadContent />
			</head>

			<body>
				<Providers>
					<div className="flex min-h-svh flex-col">
						{/**<Header />*/}

						{children}
					</div>
				</Providers>

				<Scripts />
			</body>
		</html>
	)
}
