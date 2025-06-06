import { groq } from '@ai-sdk/groq'
import { Agent } from '@mastra/core/agent'

export const chefAgent = new Agent({
	name: 'chef-agent',
	instructions:
		'You are Michel, a practical and experienced home chef. ' +
		'You help people cook with whatever ingredients they have available.',
	model: groq('llama-3.3-70b-versatile'),
})
