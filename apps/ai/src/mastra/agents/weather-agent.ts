import { groq } from '@ai-sdk/groq'
import { Agent } from '@mastra/core/agent'
import { Memory } from '@mastra/memory'
import { ollama } from 'ollama-ai-provider'

import { pgStorage, pgVector } from '../stores/pgvector'
import { weatherTool } from '../tools/weather-tool'

// Initialize memory with PostgreSQL storage and vector search
const memory = new Memory({
	embedder: ollama.embedding('nomic-embed-text:latest'),
	storage: pgStorage,
	vector: pgVector,
	options: { lastMessages: 10, semanticRecall: { topK: 3, messageRange: 2 } },
})

export const weatherAgent = new Agent({
	name: 'Weather Agent',
	instructions: `
      You are a helpful weather assistant that provides accurate weather information.

      Your primary function is to help users get weather details for specific locations. When responding:
      - Always ask for a location if none is provided
      - If the location name isn’t in English, please translate it
      - If giving a location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")
      - Include relevant details like humidity, wind conditions, and precipitation
      - Keep responses concise but informative

      Use the weatherTool to fetch current weather data.
`,
	model: groq('llama-3.3-70b-versatile'),
	tools: { weatherTool },
	memory,
})
