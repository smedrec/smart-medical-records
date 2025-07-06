import { app } from '@/lib/app'
import { useQuery } from '@tanstack/react-query'

//import clientLogger from '../lib/logger'

export interface ServerVersionInfo {
	version: string
	//source: string
	//timestamp: string
	//environment: string
	//uptime: number
}

/**
 * Hook to fetch version information from the API
 */
export function useServerVersion() {
	return useQuery<ServerVersionInfo>({
		queryKey: ['server-version'],
		queryFn: async () => {
			try {
				app.version()
				const response = await app.version()
				return response
			} catch (error) {
				console.error('Error fetching server version:', error)
				throw error
			}
		},
		staleTime: 5 * 60 * 1000, // Cache for 5 minutes
		retry: 3,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	})
}

/**
 * Hook that returns just the version string
 */
export function useVersionString() {
	const { data } = useServerVersion()
	return data?.version || '0.0.0-loading'
}
