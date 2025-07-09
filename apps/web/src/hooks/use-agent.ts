// Hook for fetching agents with smart polling

import { useNetworkStatus } from '@/hooks/use-network-status'
import { getAgent } from '@/lib/ai/get-agent'
import { STALE_TIMES } from '@/lib/constants'
//import clientLogger from '@/lib/logger'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'

import type { GetAgentResponse } from '@mastra/client-js'

interface UseAgentResult {
	data: GetAgentResponse
	isLoading: boolean
	isError: boolean
	error: Error | null
}

/**
 * @returns {UseAgentResult} React Query result object with typed data and status properties
 */
function useAgent(agentId: string, options = {}): UseAgentResult {
	const network = useNetworkStatus()
	const queryAgent = useServerFn(getAgent)

	const queryResult = useQuery({
		queryKey: ['agents', agentId],
		queryFn: async () => queryAgent({ data: { agentId: agentId } }),
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

export { useAgent }
