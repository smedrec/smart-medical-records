import type { GetAgentResponse, GetToolResponse, GetWorkflowResponse } from '@mastra/client-js'

export type Agent = GetAgentResponse
export type Tool = GetToolResponse
export type Workflow = GetWorkflowResponse

type AgentsObject = {
	[key: string]: Agent
}

export type AgentArrayItem = GetAgentResponse & { id: string }
