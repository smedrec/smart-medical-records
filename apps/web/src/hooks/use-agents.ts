// Hook for fetching agents with smart polling

import { useNetworkStatus } from '@/hooks/use-network-status'
import { ai } from '@/lib/ai/client'
import { STALE_TIMES } from '@/lib/constants'
import clientLogger from '@/lib/logger'
import { useQuery } from '@tanstack/react-query'

import type { GetAgentResponse } from '@mastra/client-js'

/**
 * @returns {AgentsWithDetailsResult} Combined query results with both list and detailed data
 */
interface AgentsWithDetailsResult {
	data: {
		agents: Record<string, GetAgentResponse>
	}
	isLoading: boolean
	isError: boolean
	error: unknown
}

/**
 * @returns {UseQueryResult} React Query result object with typed data and status properties
 */
export function useAgents(options = {}): AgentsWithDetailsResult {
	const network = useNetworkStatus()

	const queryResult = useQuery<{ agents: Record<string, GetAgentResponse> }, unknown>({
		queryKey: ['agents'],
		queryFn: async () => {
			try {
				const result = await ai.getAgents()
				return {
					agents: result,
				}
			} catch (error: any) {
				clientLogger.error('An error occurred:', error?.message)
				throw error
			}
		},
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
		data: {
			agents: queryResult.data?.agents ?? {},
		},
		isLoading: queryResult.isLoading,
		isError: queryResult.isError,
		error: queryResult.error,
	}
}
