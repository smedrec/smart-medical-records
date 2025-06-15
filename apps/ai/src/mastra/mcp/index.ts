import { MCPServer } from '@mastra/mcp'

// Your Mastra tool
import { weatherAgent } from '../agents/weather-agent'
import { weatherTool } from '../tools/weather-tool'
// Your Mastra Agent
import { weatherWorkflow } from '../workflows/weather-workflow'

// Your Mastra Workflow
const weatherMCPServer = new MCPServer({
	name: 'Weather MCP Server',
	version: '1.0.0',
	tools: { weatherTool },
	// Provide your tool(s) here
	agents: { weatherAgent },
	// Provide your agent(s) here
	workflows: { weatherWorkflow },
	// Provide your workflow(s) here
})

// Start the server (e.g., using stdio for a CLI tool)
//await server.startStdio();
// Or integrate with an HTTP server using startSSE()
// See MCPServer reference for details
