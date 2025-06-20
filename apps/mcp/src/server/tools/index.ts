import { env } from 'cloudflare:workers'
import { z } from 'zod'

import { server } from '../index.js'
import { readMemory, writeMemory } from '../resources/index.js'
import { allFhirTools } from './fhir-tools.js' // Import FHIR tools

import type { MemoryData } from '../resources/index.js'

const openRouterApiKey = env.OPENROUTER_API_KEY

// Tool 1: Read from Memory
function registerReadFromMemoryTool() {
	server.tool(
		'read_from_memory',
		"Reads the user's current CSS knowledge from memory.",
		{}, // No input parameters required for this tool
		async () => {
			try {
				const memoryData = await readMemory() // Uses the shared resource function
				return {
					content: [
						{
							type: 'text',
							text: JSON.stringify(memoryData, null, 2), // Return the memory data as JSON string
						},
					],
				}
			} catch (error) {
				console.error('Error in read_from_memory tool:', error)
				throw error // Let the MCP framework handle the error reporting
			}
		}
	)
}

// Tool 2: Write to Memory
function registerWriteToMemoryTool() {
	// Define the expected input structure for this tool using Zod
	const writeMemoryInputShape = {
		concept: z.string().describe("The CSS concept name (e.g., 'Flexbox')"),
		known: z.boolean().describe('Whether the user knows this concept (true/false)'),
	}
	// Zod schema instance used for potential validation (though MCP SDK might handle it)
	// const WriteMemoryInputSchema = z.object(writeMemoryInputShape);

	server.tool(
		'write_to_memory',
		"Updates the user's CSS knowledge memory for a specific concept.",
		writeMemoryInputShape, // Pass the shape to define the input schema for the client
		async (args) => {
			// args object contains validated input based on the shape
			const { concept, known } = args
			try {
				const currentMemory = await readMemory()
				// Create the updated memory state
				const updatedMemory: MemoryData = {
					...currentMemory,
					known_concepts: {
						...currentMemory.known_concepts,
						[concept]: known,
					},
				}
				await writeMemory(updatedMemory) // Use the shared resource function to write back
				return {
					content: [
						{
							type: 'text',
							text: `Memory updated successfully for concept: ${concept}`,
						},
					],
				}
			} catch (error) {
				console.error('Error in write_to_memory tool:', error)
				throw error
			}
		}
	)
}

// Tool 3: Get Latest CSS Updates via OpenRouter/Perplexity
function registerGetLatestUpdatesTool() {
	// Only register this tool if the API key is configured
	if (!openRouterApiKey) {
		console.warn(
			"OPENROUTER_API_KEY not found in .env file. 'get_latest_updates' tool will not be registered."
		)
		return
	}

	server.tool(
		'get_latest_updates',
		'Fetches recent news and updates about CSS features using Perplexity Sonar via OpenRouter.',
		{}, // No input parameters required
		async () => {
			const openRouterUrl = 'https://openrouter.ai/api/v1/chat/completions'
			const headers = {
				Authorization: `Bearer ${openRouterApiKey}`,
				'Content-Type': 'application/json',
				// Optional: Set Referer and X-Title headers for OpenRouter monitoring
				// "HTTP-Referer": "YOUR_SITE_URL",
				// "X-Title": "CSS Tutor Demo",
			}
			// Request body for the OpenRouter Chat Completions API
			const body = JSON.stringify({
				// Using a Perplexity model capable of accessing recent web info
				model: 'perplexity/sonar-pro',
				messages: [
					// System message guides the AI's response behavior
					{
						role: 'system',
						content:
							'You are an AI assistant specialized in finding the latest CSS news and updates. Summarize the key recent developments concisely.',
					},
					// User message provides the actual query
					{
						role: 'user',
						content:
							'What are the most important recent updates or newly released features in CSS? Focus on things developers should be aware of in the last few months.',
					},
				],
			})

			try {
				const response = await fetch(openRouterUrl, {
					method: 'POST',
					headers: headers,
					body: body,
				})

				if (!response.ok) {
					// Handle API errors
					const errorText = await response.text()
					throw new Error(
						`OpenRouter API request failed: ${response.status} ${response.statusText} - ${errorText}`
					)
				}

				// Parse the JSON response from OpenRouter
				const data: any = await response.json()
				// Extract the AI's reply from the response structure
				const assistantMessage = data.choices?.[0]?.message?.content

				if (!assistantMessage) {
					console.error('Invalid response structure from OpenRouter:', data)
					throw new Error('Could not extract assistant message from OpenRouter response.')
				}

				// Return the fetched CSS updates as text content
				return {
					content: [
						{
							type: 'text',
							text: assistantMessage,
						},
					],
				}
			} catch (error) {
				console.error('Error in get_latest_updates tool:', error)
				throw error
			}
		}
	)
}

// Function called by src/index.ts to register all tools for this server.
export function registerTools() {
	//registerReadFromMemoryTool()
	//registerWriteToMemoryTool()
	//registerGetLatestUpdatesTool() // This will only register if API key is present

	// Register all FHIR tools
	allFhirTools.forEach((tool) => {
		server.tool(
			tool.name,
			{
				description: tool.description,
				inputSchema: tool.inputSchema || {}, // Ensure inputSchema is at least an empty object
				outputSchema: tool.outputSchema || {}, // Ensure outputSchema is at least an empty object
			},
			tool.handler
		)
	})
}
