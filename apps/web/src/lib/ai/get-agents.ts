import { ai } from '@/lib/ai/client'
import { createServerFn } from '@tanstack/react-start'

import type { GetAgentResponse } from '@mastra/client-js'

type Agent = GetAgentResponse

type AgentsObject = {
	[key: string]: Agent
}

type AgentArrayItem = Agent & { id: string }

export const getAgents = createServerFn({ method: 'GET' }).handler(async () => {
	try {
		const resultData = await ai.getAgents()
		const agentsArray: AgentArrayItem[] = Object.entries(resultData).map(([id, agent]) => ({
			id,
			...agent,
		}))
		return agentsArray
	} catch (error) {
		console.error('Error getting the agents:', error)
		throw new Error(error as string)
	}
})
