// Hook for fetching agents with smart polling

import { useNetworkStatus } from '@/hooks/use-network-status'
import { STALE_TIMES } from '@/lib/constants'
import { testHeaders } from '@/lib/utils'
//import clientLogger from '@/lib/logger'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'

interface UseHeadersResult {
	data: Record<string, string> | undefined
	isLoading: boolean
	isError: boolean
	error: Error | null
}

/**
 * @returns {UseHeadersResult} React Query result object with typed data and status properties
 */
function useHeaders(options = {}): UseHeadersResult {
	const network = useNetworkStatus()
	const queryHeaders = useServerFn(testHeaders)

	const queryResult = useQuery({
		queryKey: ['headers'],
		queryFn: () => queryHeaders(),
		staleTime: STALE_TIMES.RARE,
		refetchInterval: !network.isOffline ? STALE_TIMES.RARE : false,
		refetchIntervalInBackground: false,
		...(!network.isOffline &&
			network.effectiveType === 'slow-2g' && {
				refetchInterval: STALE_TIMES.RARE,
			}),
		...options,
	})

	return {
		data: queryResult.data,
		isLoading: queryResult.isLoading,
		isError: queryResult.isError,
		error: queryResult.error,
	}
}

export { useHeaders }
