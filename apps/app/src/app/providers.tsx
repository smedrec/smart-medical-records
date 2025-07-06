'use client'

import { STALE_TIMES } from '@/lib/constants'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from 'next-themes'

import type { ReactNode } from 'react'

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

function Providers({ children }: { children: ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem={true}
				disableTransitionOnChange
			>
				{children}
			</ThemeProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	)
}

export { Providers }
