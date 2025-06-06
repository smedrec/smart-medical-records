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

export const AiStoreSchema = z
	.object({
		paperUrl: z.string().openapi({
			description: 'The paper url.',
			example: 'https://arxiv.org/html/1706.03762',
		}),
	})
	.openapi('AiStore')

export const AiCreateIndexSchema = z
	.object({
		indexName: z.string().openapi({
			description: 'The index name.',
			example: 'papers',
		}),
		dimension: z.number().openapi({
			description: 'The index dimension.',
			example: 1536,
		}),
		metric: z.enum(['cosine', 'euclidean', 'dotproduct']).openapi({
			description: 'The index metric.',
			example: 'cosine',
		}),
	})
	.openapi('AiCreateIndex')
