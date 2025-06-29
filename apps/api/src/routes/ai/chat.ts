import { createRoute, z } from '@hono/zod-openapi'

import { aiClient } from '../../lib/ai/index.js'
import { ApiError, openApiErrorResponses } from '../../lib/errors/index.js'

import type { App } from '../../lib/hono/index.js'

const route = createRoute({
	tags: ['AI'],
	operationId: 'ai-chat',
	method: 'post',
	path: '/ai/chat/{id}',
	security: [{ cookieAuth: [] }],
	request: {
		params: z.object({
			id: z.string().openapi({
				param: {
					name: 'id',
					in: 'path',
				},
				example: 'opensearch',
			}),
		}),
		body: {
			required: true,
			description: 'Chat message',
			content: {
				'application/json': {
					schema: z.object({
						messages: z.object({
							role: z.string(),
							content: z.string(),
						}),
					}),
				},
			},
		},
	},
	responses: {
		200: {
			description: 'The chat response',
			content: {
				'application/json': {
					schema: z.object({
						text: z.string().openapi({}),
					}),
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type Route = typeof route
export type AiChatRequest = z.infer<
	(typeof route.request.body.content)['application/json']['schema']
>
export type AiChatResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerAiChat = (app: App) =>
	app.openapi(route, async (c) => {
		//const { auth } = c.get('services')
		const session = c.get('session')

		if (!session)
			throw new ApiError({ code: 'UNAUTHORIZED', message: 'You Need to login first to continue.' })

		/**const canCreateAssistant = await auth.api.hasPermission({
			headers: c.req.raw.headers,
			body: {
				permissions: {
					assistant: ['create'], // This must match the structure in your access control
				},
			},
		})

		if (!canCreateAssistant) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: 'You do not have permissions to create a assistant.',
			})
		} */

		console.log(JSON.stringify(await c.req.json()))
		const { id } = c.req.valid('param')
		const { messages } = await c.req.json()
		//const data = c.req.valid('json')

		try {
			const agent = aiClient.getAgent(id)
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

			return c.json(response.response.messages, 200)
		} catch (error) {
			console.error('Development error:', error)
			throw new ApiError({ code: 'INTERNAL_SERVER_ERROR', message: error as string })
		}
	})
