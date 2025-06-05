import { z } from '@hono/zod-openapi'

export const AiChatSchema = z
	.object({
		role: z.enum(['system', 'user', 'assistant']).openapi({
			description: 'The chat role.',
			example: 'user',
		}),
		content: z.string().openapi({
			description: 'The chat content.',
			example: '',
		}),
	})
	.openapi('AiChat')
