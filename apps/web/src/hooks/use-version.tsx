import { getVersion } from '@/lib/app/get-version'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'

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
	const queryVersion = useServerFn(getVersion)
	return useQuery<ServerVersionInfo>({
		queryKey: ['server-version'],
		queryFn: async () => {
			try {
				const data = queryVersion()
				/**const response = await fetch(`${API_URL}/version`)

				if (!response.ok) {
					throw new Error(
						`Failed to fetch server version: ${response.status} ${response.statusText}`
					)
				}

				const data = await response.json()*/
				return data
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
 * Hook that returns just the version string for backwards compatibility
 */
export function useVersionString() {
	const { data } = useServerVersion()
	return data?.version || '0.0.0-loading'
}
