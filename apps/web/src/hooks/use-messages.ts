// Hook for fetching agent messages with smart polling

import { useNetworkStatus } from '@/hooks/use-network-status'
import { getMessages } from '@/lib/ai/get-messages'
import { STALE_TIMES } from '@/lib/constants'
//import clientLogger from '@/lib/logger'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'

import type { ModelMessage } from 'ai'

interface UseMessagesResult {
	data: ModelMessage[] | undefined
	isLoading: boolean
	isError: boolean
	error: Error | null
}

interface UseMessagesProps {
	threadId: string
	agentId: string
	options?: any
}

/**
 * @returns {UseMessagesResult} React Query result object with typed data and status properties
 */
function useMessages({ threadId, agentId, options = {} }: UseMessagesProps): UseMessagesResult {
	const network = useNetworkStatus()
	const queryMessages = useServerFn(getMessages)

	const queryResult = useQuery({
		queryKey: ['messages'],
		queryFn: async () => queryMessages({ data: { threadId: threadId, agentId: agentId } }),
		staleTime: STALE_TIMES.FREQUENT,
		refetchInterval: !network.isOffline ? STALE_TIMES.FREQUENT : false,
		refetchIntervalInBackground: false,
		...(!network.isOffline &&
			network.effectiveType === 'slow-2g' && {
				refetchInterval: STALE_TIMES.FREQUENT,
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

export { useMessages }
