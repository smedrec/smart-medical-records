import { groq } from '@ai-sdk/groq'
import { Agent } from '@mastra/core/agent'
import { createStep, createWorkflow } from '@mastra/core/workflows'
import { z } from 'zod'

const sendWelcomeEmail = createStep({
	id: 'send-welcome-email',
	description: 'Send to the new user the welcome email',
	inputSchema: z.object({
		name: z.string().describe('The user name'),
		email: z.string().email().describe('The user email'),
	}),
	outputSchema: z.object({
		success: z.boolean(),
		message: z.string(),
	}),
	execute: async ({ inputData }) => {},
})
