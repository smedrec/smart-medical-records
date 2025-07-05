// Hook for fetching agents with smart polling

import { useNetworkStatus } from '@/hooks/use-network-status'
import { getAgents } from '@/lib/ai/get-agents'
import { STALE_TIMES } from '@/lib/constants'
//import clientLogger from '@/lib/logger'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'

/**
 * @returns {UseQueryResult} React Query result object with typed data and status properties
 */
export function useAgents(options = {}) {
	const network = useNetworkStatus()
	const queryAgents = useServerFn(getAgents)

	const queryResult = useQuery({
		queryKey: ['agents'],
		queryFn: async () => queryAgents(),
		staleTime: STALE_TIMES.FREQUENT,
		refetchInterval: !network.isOffline ? STALE_TIMES.FREQUENT : false,
		refetchIntervalInBackground: false,
		...(!network.isOffline &&
			network.effectiveType === 'slow-2g' && {
				refetchInterval: STALE_TIMES.STANDARD,
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
