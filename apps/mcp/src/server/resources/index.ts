import fs from 'fs/promises' // Use promises for async operations
import path from 'path'
import { fileURLToPath } from 'url'
import { z } from 'zod'

import { server } from '../index.js'

// Helper to get the correct directory path in ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// Path to the JSON file acting as our simple database
const memoryFilePath = path.resolve(__dirname, '../../data/memory.json')

// Zod schema to validate the structure of the memory data
const MemorySchema = z.object({
	user_id: z.string(),
	known_concepts: z.record(z.string(), z.boolean()), // Concept name -> known status
})

// TypeScript type derived from the Zod schema for type safety
export type MemoryData = z.infer<typeof MemorySchema>

// Reads and validates the memory data from memory.json
export async function readMemory(): Promise<MemoryData> {
	try {
		const data = await fs.readFile(memoryFilePath, 'utf-8')
		const jsonData = JSON.parse(data)
		// Ensure the data conforms to our expected schema
		return MemorySchema.parse(jsonData)
	} catch (error) {
		console.error('Error reading or parsing memory file:', error)
		// For a demo, we throw; a real app might return a default or handle errors differently
		throw new Error(
			`Failed to read/parse memory file: ${error instanceof Error ? error.message : String(error)}`
		)
	}
}

// Validates and writes the given memory data to memory.json
export async function writeMemory(newData: MemoryData): Promise<void> {
	try {
		// Ensure the data to be written conforms to the schema
		MemorySchema.parse(newData)
		const dataString = JSON.stringify(newData, null, 2) // Pretty-print JSON
		await fs.writeFile(memoryFilePath, dataString, 'utf-8')
	} catch (error) {
		console.error('Error validating or writing memory file:', error)
		throw new Error(
			`Failed to validate/write memory file: ${error instanceof Error ? error.message : String(error)}`
		)
	}
}

// Registers the 'css_knowledge_memory' resource with the MCP server.
// This resource represents the user's knowledge state stored in memory.json.
function registerCssKnowledgeMemoryResource() {
	const resourceName = 'css_knowledge_memory'
	// A URI identifying this resource type. Clients might request specific URIs under this base.
	const resourceUriBase = `memory://${resourceName}/`

	server.resource(
		resourceName,
		resourceUriBase,
		{
			// Metadata defining resource capabilities
			read: true, // Allows clients/tools to read the resource
			write: true, // Allows clients/tools to modify the resource (via tools)
		},
		async (uri: URL) => {
			// Handler called when a client reads the resource
			// This demo ignores the specific URI path and always returns the single memory file.
			// A multi-user system might use the path to identify the user.
			try {
				const memoryData = await readMemory()
				return {
					contents: [
						{
							uri: uri.toString(), // Echo the requested URI
							mimeType: 'application/json',
							text: JSON.stringify(memoryData), // Return data as a JSON string
						},
					],
				}
			} catch (error) {
				console.error(`Error handling resource request for ${uri}:`, error)
				throw error // Propagate error to the server framework
			}
		}
	)
}

// Function called by src/index.ts to register all resources for this server.
export function registerResources() {
	registerCssKnowledgeMemoryResource()
}
