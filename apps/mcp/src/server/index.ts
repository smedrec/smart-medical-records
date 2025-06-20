import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

import { allFhirTools } from './tools/fhir-tools.js'

// Initialize the MCP Server instance
export const server = new McpServer({
	name: 'smedrec-fhir-mcp', // Unique name for this server
	version: '0.1.0', // Server version
	// Declare the types of capabilities the server will offer
	capabilities: {
		prompts: {}, // Will be populated by registerPrompts
		resources: {}, // Will be populated by registerResources
		tools: allFhirTools, // Will be populated by registerTools
	},
})

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
