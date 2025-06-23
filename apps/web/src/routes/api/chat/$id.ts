import { MastraClient } from '@mastra/client-js'
import { createServerFileRoute } from '@tanstack/react-start/server'

export const ai = new MastraClient({
	baseUrl: 'http://localhost:4111',
	retries: 3,
	backoffMs: 300,
	maxBackoffMs: 5000,
	headers: {
		'X-Development': 'true',
	},
})

export const ServerRoute = createServerFileRoute('/api/chat/$id').methods({
	POST: async ({ request, params }) => {
		const { id } = params
		const { messages } = (await request.json()) as { messages: any }

		console.log(JSON.stringify(await request.json()))

		try {
			const agent = ai.getAgent(id)
			const response = await agent.generate({
				messages: messages,
				memoryOptions: {
					workingMemory: {
						enabled: true,
					},
				},
			})
			// Extract the assistant's text from the response
			/**const lastMessage = Array.isArray(response.response.messages)
				? response.response.messages.find((msg: any) => msg.role === 'assistant')
				: null
			const text =
				typeof lastMessage?.content === 'string'
					? lastMessage.content
					: (lastMessage?.content?.text ?? '')*/

			return new Response(JSON.stringify(response.response.messages), {
				headers: {
					'Content-Type': 'application/json',
				},
			})
		} catch (error) {
			console.error('Development error:', error)
			throw new Error(error as string)
		}
	},
})
