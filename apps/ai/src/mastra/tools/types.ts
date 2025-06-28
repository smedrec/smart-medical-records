// Tool call result for MCP tool responses
export interface ToolCallResult {
	content: Array<{
		type: string
		text: string
	}>
	isError?: boolean
}
