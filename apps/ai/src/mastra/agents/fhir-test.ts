import { groq } from '@ai-sdk/groq'
import { Agent } from '@mastra/core'
import { MCPClient } from '@mastra/mcp'
import { Memory } from '@mastra/memory'
import { ollama } from 'ollama-ai-provider'

import { pgStorage, pgVector } from '../stores/pgvector'

const memory = new Memory({
	embedder: ollama.embedding('nomic-embed-text:latest'),
	storage: pgStorage,
	vector: pgVector,
	options: { lastMessages: 10, semanticRecall: { topK: 3, messageRange: 2 } },
})
// Configure MCPClient to connect to your server(s)
export const mcp = new MCPClient({
	servers: {
		fhirresources: {
			command: 'npx',
			args: ['-y', '/home/jose/Documents/workspace/smedrec/fhir-mcp/build/index.js'],
			env: {
				FHIR_BASE_URL: 'http://joseantcordeiro.hopto.org:4000/v/r4/fhir',
				SMART_CLIENT_ID:
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwdWJfa2V5IjoiLS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS1cbk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBemdwYkFnWGtaSjQ2VTZIRGRvMHNcblB3bkptbElpeTNVM09FZHJ5SDlxcVI4TzM0Y2kxaUwxKzhESUNIKzZhajlLYmpkanl6bFh3ZzBEZFkrVmxhVTlcbkwyMmNTdlp4dVJ1QUlKZ2hPR0RtQTdrTlF1dTRhL1EyMmJMWjNHcHNtSWJQZVBqRExFcHRqZlhneVYxVUJMbUtcbmJadUgrdGlaMlFScnM4cHpVUWZFOC92UUdZZFRaa1BLcm15Z0xEVjRqd2Vkc2ZzaWdhVUdsNWdVWXRHUDBvdmtcblY0QVhiMkN5UXAxeWFzWTVnSEorUWJnVURjb1llNjBUSFhXcUFTaXhQa3JTSUxUMXcxbTJCWlJiMnovOFBEK0Fcbkk3c3p6RjV4U3ZyakdkdURNYS9tMVAzVUVMTHcwNG1CTFlyNkttT09yTEUyWlBBWDlZQXgrdklXRlZ2TVBDMHRcbmx3SURBUUFCXG4tLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0iLCJpc3MiOiJodHRwOi8vam9zZWFudGNvcmRlaXJvLmhvcHRvLm9yZzo4MDgwL2ZoaXIiLCJhY2Nlc3NUb2tlbnNFeHBpcmVJbiI6MTUsImlhdCI6MTc1MDcyNzg4OH0.m-ETnjB-r--AcJPzpRCWlFzBwnYG2YEECHp5OELIjzY',
				SMART_SCOPE: 'system/*.read',
				SMART_ISS:
					'https://launch.smarthealthit.org/v/r4/sim/WzQsIiIsIiIsIiIsMCwwLDAsIiIsIiIsIiIsIiIsIiIsIiIsIiIsMSwxLCIiXQ/fhir',
			},
		},
	},
})

export const fhirAgent = new Agent({
	name: 'fhir-resources-agent',
	description: 'A assistant to manage FHIR',
	instructions: `
    You are an Agent that helps users to manage FHIR resources.
  `,
	model: groq('llama-3.3-70b-versatile'),
	tools: await mcp.getTools(),
	memory,
})
