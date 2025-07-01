import { MCPServer } from '@mastra/mcp'

import { promptHandlers } from './prompts'
import { resourceHandlers } from './resources'
import { writeNoteTool } from './tools'

export const notes = new MCPServer({
	name: 'notes',
	version: '0.1.0',
	resources: resourceHandlers,
	prompts: promptHandlers,
	tools: {
		write: writeNoteTool,
	},
})
