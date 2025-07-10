import { assistantAgent } from '@/mastra/agents/assistant-agent'
import { patientReportAgent } from '@/mastra/agents/patient-report-agent'
import { pgStorage, pgVector } from '@/mastra/stores/pgvector'
import { allAuthWorkflows } from '@/mastra/workflows/auth'
import { groq } from '@ai-sdk/groq'
import { NewAgentNetwork } from '@mastra/core/network/vNext'
import { Memory } from '@mastra/memory'
import { ollama } from 'ollama-ai-provider'

// Initialize memory with PostgreSQL storage and vector search
const memory = new Memory({
	embedder: ollama.embedding('nomic-embed-text:latest'),
	storage: pgStorage,
	vector: pgVector,
	options: { lastMessages: 10, semanticRecall: { topK: 3, messageRange: 2 } },
})

const network = new NewAgentNetwork({
	id: 'smedrec-network',
	name: 'Smedrec Network',
	instructions:
		'You can research cities. You can also synthesize research material. You can also write a full report based on the researched material.',
	model: groq('llama-3.3-70b-versatile'),
	agents: { assistantAgent, patientReportAgent },
	workflows: { ...Object.fromEntries(allAuthWorkflows.map((workflow) => [workflow.id, workflow])) },
	memory: memory,
})

export { network }
