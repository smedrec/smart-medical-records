import { assistantAgent } from '@/mastra/agents/assistant-agent'
import { notesAgent } from '@/mastra/agents/notes'
import { patientReportAgent } from '@/mastra/agents/patient-report-agent'
import { pg } from '@/mastra/stores/postgres'
import { allAuthWorkflows } from '@/mastra/workflows/auth'
import { groq } from '@ai-sdk/groq'
import { NewAgentNetwork } from '@mastra/core/network/vNext'
import { Memory } from '@mastra/memory'
import { ollama } from 'ollama-ai-provider'

// Initialize memory with PostgreSQL storage and vector search
const memory = new Memory({
	embedder: ollama.embedding('nomic-embed-text:latest'),
	storage: pg.storage,
	vector: pg.vector,
	options: { lastMessages: 10, semanticRecall: { topK: 3, messageRange: 2 } },
})

const network = new NewAgentNetwork({
	id: 'smedrec-network',
	name: 'Smedrec Network',
	instructions:
		'You can deal with FHIR resources, FHIR MCP servers, and FHIR MCP tools. You can also write, update and list notes.',
	model: groq('llama-3.3-70b-versatile'),
	agents: { assistantAgent, patientReportAgent, notesAgent },
	workflows: { ...Object.fromEntries(allAuthWorkflows.map((workflow) => [workflow.id, workflow])) },
	memory,
})

export { network }
