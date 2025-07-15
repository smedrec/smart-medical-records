import { AuthQueryProvider } from "@daveyplate/better-auth-tanstack";
import { AuthUIProviderTanstack } from "@daveyplate/better-auth-ui/tanstack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { authClient } from "./lib/auth";
import { STALE_TIMES } from "./lib/constants";

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
});

export function Providers({ children }: { children: ReactNode }) {
	const router = useRouter();

	return (
		<QueryClientProvider client={queryClient}>
			<AuthQueryProvider>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
					themeColor={{
						light: "oklch(1 0 0)",
						dark: "oklch(0.145 0 0)",
					}}
				>
					<AuthUIProviderTanstack
						authClient={authClient}
						avatar={true}
						organization={{
							logo: true,
							customRoles: [
								{ role: "practitioner", label: "Practitioner" },
								{ role: "patient", label: "Patient" },
							],
						}}
						apiKey={{
							metadata: {
								environment: process.env.ENVIRONMENT || "development",
								version: "v1",
							},
						}}
						settings={{
							url: "/app/settings/account",
						}}
						navigate={(href) => router.navigate({ href })}
						replace={(href) => router.navigate({ href, replace: true })}
						Link={({ href, ...props }) => <Link to={href} {...props} />}
					>
						{children}
						<Toaster richColors />
						<TanStackRouterDevtools position="bottom-left" />
					</AuthUIProviderTanstack>
				</ThemeProvider>
			</AuthQueryProvider>
		</QueryClientProvider>
	);
}
