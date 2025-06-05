import { createRoute } from '@hono/zod-openapi'

import { aiClient } from '../../lib/ai/ai-client'
import { ApiError, openApiErrorResponses } from '../../lib/errors'
import { AiChatSchema } from './types'

import type { z } from '@hono/zod-openapi'
import type { App } from '../../lib/hono'

const route = createRoute({
	tags: ['AI'],
	operationId: 'ai-chat',
	method: 'post',
	path: '/ai/chat',
	security: [{ cookieAuth: [] }],
	request: {
		body: {
			required: true,
			description: 'Chat message',
			content: {
				'application/json': {
					schema: AiChatSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: 'The chat response',
			content: {
				'application/json': {
					schema: {},
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

		const data = c.req.valid('json')

		try {
			const agent = aiClient.getAgent('weatherAgent')
			const response = await agent.generate({
				messages: [{ role: data.role, content: data.content }],
			})
			//console.log('Response:', response)
			return c.json(response, 200)
		} catch (error) {
			console.error('Development error:', error)
			throw new ApiError({ code: 'INTERNAL_SERVER_ERROR', message: error as string })
		}
	})
