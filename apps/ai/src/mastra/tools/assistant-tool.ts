import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

import { AppClient } from '@repo/app-client'

const appClient = new AppClient({
	baseUrl: 'http://localhost:8801',
	retries: 3, // Number of retry attempts
	backoffMs: 300, // Initial backoff time
	maxBackoffMs: 5000, // Maximum backoff time
	headers: {
		'x-api-key': 'bOPXYDDmOepUzKApNAcoajvJPhfIePcPSwMwaXsvRMIPkeBpzDQBPVVVdhkTBBiA',
	},
})

export const getAssistant = createTool({
	id: 'get-assistant',
	description: 'Get one assistant by id',
	inputSchema: z.object({
		id: z.string().describe('Assistant id'),
	}),
	outputSchema: z.object({
		id: z.string().describe('Assistant id'),
		name: z.string().describe('Assistant name'),
		email: z.string().describe('Assistant email'),
		image: z.string().or(z.null()).describe('Assistant image'),
		role: z.enum(['user', 'admin']).describe('Assistant role'),
		telephone: z.string().describe('Assistant telephone'),
		dob: z.string().describe('Assistant date of birth'),
		gender: z.enum(['MALE', 'FEMALE', 'OTHER']).describe('Assistant gender'),
		organization: z.string().describe('Assistant organization id'),
	}),
	execute: async ({ context }) => {
		const response = await appClient.findOneAssistant(context.id)
		return {
			id: response.assistant.id,
			name: response.user.name,
			email: response.user.email,
			image: response.user.image,
			role: response.user.role,
			telephone: response.assistant.telephone,
			dob: response.assistant.dob,
			gender: response.assistant.gender,
			organization: response.assistant.organization,
		}
	},
})
