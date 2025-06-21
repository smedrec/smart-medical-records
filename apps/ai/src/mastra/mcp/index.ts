import { MCPServer } from '@mastra/mcp'

import { allFhirTools } from '../tools/fhir-tools'
import { assistantAgent } from '../agents/assistant-agent'

// Your Mastra Workflow
export const fhirMCPServer = new MCPServer({
	name: 'FHIR MCP Server',
	version: '1.0.0',
	tools: Object.fromEntries(allFhirTools.map(tool => [tool.id, tool])),
	// Provide your tool(s) here
	agents: { assistantAgent },
	// Provide your agent(s) here
	workflows: {},
	// Provide your workflow(s) here
})

// Start the server (e.g., using stdio for a CLI tool)
// await fhirMCPServer.startStdio();
// Or integrate with an HTTP server using startSSE()
// See MCPServer reference for details
