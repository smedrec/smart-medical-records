import { z } from 'zod'

// Tool call result for MCP tool responses
export interface ToolCallResult {
	content: Array<{
		type: string
		text: string
	}>
	isError?: boolean
}

export const IToolCallResult = z.object({
	content: z.array({
		type: z.enum(['text', 'json']),
		text: z.string(),
	}),
	isError: z.boolean().optional(),
})
