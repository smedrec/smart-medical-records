import { groq } from '@ai-sdk/groq'
import { Agent } from '@mastra/core/agent'
import { Memory } from '@mastra/memory'
import { ollama } from 'ollama-ai-provider'

import { pgStorage, pgVector } from '../stores/pgvector'
import { emailSendTool } from '../tools/email-tools'
import { allFhirTools } from '../tools/fhir-tools'

// Initialize memory with PostgreSQL storage and vector search
const memory = new Memory({
	embedder: ollama.embedding('nomic-embed-text:latest'),
	storage: pgStorage,
	vector: pgVector,
	options: { lastMessages: 10, semanticRecall: { topK: 3, messageRange: 2 } },
})

export const assistantAgent = new Agent({
	name: 'assistant-agent',
	description: 'A assistant to manage FHIR',
	instructions: `
    You are an Agent that helps users to manage the Patient, Practitioner and Organization FHIR resources.
  `,
	model: groq('llama-3.3-70b-versatile'),
	tools: {
		...Object.fromEntries(allFhirTools.map((tool) => [tool.id, tool])),
		emailSendTool,
	},
	memory,
})
