import { createVectorQueryTool } from '@mastra/rag'
import { ollama } from 'ollama-ai-provider'

// Create a tool for semantic search over our paper embeddings
export const vectorQueryTool = createVectorQueryTool({
	vectorStoreName: 'mongoVector',
	indexName: 'papers',
	model: ollama.embedding('nomic-embed-text:latest'),
})
