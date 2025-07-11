import { notes } from '@/mastra/mcp/notes'
import { listNotesTool, updateNoteTool, writeNoteTool } from '@/mastra/mcp/notes/tools'
import { pgStorage, pgVector } from '@/mastra/stores/pgvector'
import { groq } from '@ai-sdk/groq'
import { Agent } from '@mastra/core'
import { MCPClient } from '@mastra/mcp'
import { Memory } from '@mastra/memory'
import { ollama } from 'ollama-ai-provider'

const memory = new Memory({
	embedder: ollama.embedding('nomic-embed-text:latest'),
	storage: pgStorage,
	vector: pgVector,
	options: { lastMessages: 10, semanticRecall: { topK: 3, messageRange: 2 } },
})

const notesAgent = new Agent({
	name: 'notes-agent',
	description: 'A assistant to test mcp servers',
	instructions: `
    You are an Agent that helps users to write, update and list notes.
  `,
	model: groq('llama-3.3-70b-versatile'),
	tools: { writeNoteTool, updateNoteTool, listNotesTool },
	memory,
})

export { notesAgent }
