'use server'

import { ai } from '@/lib/ai'

import type { AgentArrayItem } from '@/lib/ai/types'

export const getAgents = async () => {
	const mastra = await ai()
	try {
		const resultData = await mastra.getAgents()
		const agentsArray: AgentArrayItem[] = Object.entries(resultData).map(([id, agent]) => ({
			id,
			...agent,
		}))
		return agentsArray
	} catch (error) {
		console.error('Error getting the agents:', error)
		throw new Error(error as string)
	}
}
