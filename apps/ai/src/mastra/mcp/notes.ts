import { MCPServer } from '@mastra/mcp'

import { writeNoteTool } from '../tools/write-note'
import { promptHandlers } from './prompts/notes'
import { resourceHandlers } from './resources/notes'

export const notes = new MCPServer({
	name: 'notes',
	version: '0.1.0',
	resources: resourceHandlers,
	prompts: promptHandlers,
	tools: {
		write: writeNoteTool,
	},
})
