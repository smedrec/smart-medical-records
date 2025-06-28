import { groq } from '@ai-sdk/groq'
import { Agent } from '@mastra/core/agent'
import { createStep, createWorkflow } from '@mastra/core/workflows'
import { z } from 'zod'

import { schedulingCoordinatorAgent } from '../agents/scheduling-agent'

const llm = groq('llama-3.3-70b-versatile')

// Status Monitoring: Continuously monitor the status of schedules and appointments.

const createAvailableSlotsStep = createStep({
	id: 'createAvailableSlotsStep',
	inputSchema: z.object({
		resourceType: z.string(),
		id: z.string(),
	}),
	outputSchema: z.object({
		finalCopy: z.string(),
	}),
	execute: async ({ inputData }) => {
		// Calculate the start and end of the given date (UTC)
		const start = new Date(date)
		start.setUTCHours(0, 0, 0, 0)
		const end = new Date(start)
		end.setUTCDate(end.getUTCDate() + 1)
		const copy = inputData?.copy
		const result = await schedulingCoordinatorAgent.generate(
			`Edit the following blog post only returning the edited copy: ${copy}`
		)
		console.log('editor result', result.text)
		return {
			finalCopy: result.text,
		}
	},
})

const createAvailableSlotsWorkflow = createWorkflow({
	id: 'createAvailableSlotsWorkflow',
	inputSchema: z.object({
		resourceType: z.string(),
		id: z.string(),
	}),
	outputSchema: z.object({
		finalCopy: z.string(),
	}),
})
