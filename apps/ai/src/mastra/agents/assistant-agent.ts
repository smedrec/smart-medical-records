import { groq } from '@ai-sdk/groq'
import { Agent } from '@mastra/core/agent'

import { getAssistant } from '../tools/assistant-tool'

export const assistantAgent = new Agent({
	name: 'assistant-agent',
	instructions: `
    You are an Agent that helps users find information about assistants.
  `,
	model: groq('llama-3.3-70b-versatile'),
	tools: {
		getAssistant,
	},
})
