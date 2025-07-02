import { assistantAgent } from '@/mastra/agents/assistant-agent'
import { allFhirTools } from '@/mastra/tools/fhir'
import { emailSendTool } from '@/mastra/tools/mail/email-tools'
import { MCPServer } from '@mastra/mcp'

// Your Mastra Workflow
const fhirMCPServer = new MCPServer({
	name: 'FHIR MCP Server',
	version: '1.0.0',
	tools: {
		...Object.fromEntries(allFhirTools.map((tool) => [tool.id, tool])),
		emailSendTool,
	},
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

export { fhirMCPServer }
