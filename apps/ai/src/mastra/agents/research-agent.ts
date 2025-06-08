import { groq } from '@ai-sdk/groq'
import { Agent } from '@mastra/core/agent'
import { Memory } from '@mastra/memory'

import { d1Storage } from '../stores/d1'
import { pgStorage } from '../stores/pgvector'
import { vectorQueryTool } from '../tools/vector-query-tool'

export const researchAgent = new Agent({
	name: 'Research Assistant',
	instructions: `You are a helpful research assistant that analyzes academic papers and technical documents.
    Use the provided vector query tool to find relevant information from your knowledge base, 
    and provide accurate, well-supported answers based on the retrieved content.
    Focus on the specific content available in the tool and acknowledge if you cannot find sufficient information to answer a question.
    Base your responses only on the content provided, not on general knowledge.`,
	model: groq('gpt-4o-mini'),
	tools: {
		vectorQueryTool,
	},
	memory: new Memory({
		storage: pgStorage,
	}),
})
