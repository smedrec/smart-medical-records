// Hook for fetching agents with smart polling

//import clientLogger from '@/lib/logger'
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { getAgents } from "@/lib/ai/get-agents";
import { STALE_TIMES } from "@/lib/constants";

import type { AgentArrayItem } from "@/types";

interface UseAgentsResult {
	data: AgentArrayItem[] | undefined;
	isLoading: boolean;
	isError: boolean;
	error: Error | null;
}

/**
 * @returns {UseAgentsResult} React Query result object with typed data and status properties
 */
function useAgents(options = {}): UseAgentsResult {
	const network = useNetworkStatus();
	const queryAgents = useServerFn(getAgents);

	const queryResult = useQuery({
		queryKey: ["agents"],
		queryFn: async () => {
			const result = await queryAgents();
			return result;
		},
		staleTime: STALE_TIMES.RARE,
		refetchInterval: !network.isOffline ? STALE_TIMES.RARE : false,
		refetchIntervalInBackground: false,
		...(!network.isOffline &&
			network.effectiveType === "slow-2g" && {
				refetchInterval: STALE_TIMES.RARE,
			}),
		...options,
	});

	return {
		data: queryResult.data as AgentArrayItem[],
		isLoading: queryResult.isLoading,
		isError: queryResult.isError,
		error: queryResult.error,
	};
}

export { useAgents };
