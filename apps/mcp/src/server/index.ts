import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

import { registerPrompts } from './prompts/index.js'
import { registerResources } from './resources/index.js'
import { registerTools } from './tools/index.js'

// Initialize the MCP Server instance
export const server = new McpServer({
	name: 'mcp-fhir-smedrec', // Unique name for this server
	version: '0.1.0', // Server version
	// Declare the types of capabilities the server will offer
	capabilities: {
		prompts: {}, // Will be populated by registerPrompts
		resources: {}, // Will be populated by registerResources
		tools: {}, // Will be populated by registerTools
	},
})

// Load and register all defined prompts, resources, and tools
registerPrompts()
registerResources()
registerTools()

// Main entry point for the server application
async function main(): Promise<void> {
	// Use StdioServerTransport to communicate over standard input/output
	// This is common for MCP servers launched as child processes by clients.
	const transport = new StdioServerTransport()
	// Connect the server logic to the transport layer
	await server.connect(transport)
}

// Start the server and handle potential errors
main().catch((error: Error) => {
	console.error('Server startup failed:', error) // Log errors to stderr
	process.exit(1)
})
