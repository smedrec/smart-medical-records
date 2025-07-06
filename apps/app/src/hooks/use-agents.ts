// Hook for fetching agents with smart polling

import { useNetworkStatus } from '@/hooks/use-network-status'
import { getAgents } from '@/lib/ai/get-agents'
import { AgentArrayItem } from '@/lib/ai/types'
import { STALE_TIMES } from '@/lib/constants'
//import clientLogger from '@/lib/logger'
import { useQuery } from '@tanstack/react-query'

interface UseAgentsResult {
	data: AgentArrayItem[] | undefined
	isLoading: boolean
	isError: boolean
	error: Error | null
}

/**
 * @returns {UseQueryResult} React Query result object with typed data and status properties
 */
export function useAgents(options = {}): UseAgentsResult {
	const network = useNetworkStatus()

	const queryResult = useQuery({
		queryKey: ['agents'],
		queryFn: async () => getAgents(),
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
