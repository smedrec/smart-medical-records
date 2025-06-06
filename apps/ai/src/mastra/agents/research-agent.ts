import { groq } from '@ai-sdk/groq'
import { Agent } from '@mastra/core/agent'
import { Memory } from '@mastra/memory'

import { mongoStorage } from '../stores/mongo-db'
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
		//storage: new D1Store({
		//  binding: DB, // D1Database binding provided by the Workers runtime
		//  tablePrefix: "dev_", // Optional: isolate tables per environment
		//}),
		storage: mongoStorage,
	}),
})
