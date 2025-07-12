import { z } from '@hono/zod-openapi'

export const NewsletterInsertSchema = z
	.object({
		email: z.string().email().openapi({
			description: 'Email',
		}),
		list: z.string().openapi({
			description: 'The newsletter list',
			example: 'main',
		}),
		status: z.enum(['confirmed', 'pending', 'unsubscribed']).default('pending').openapi({}),
		metadata: z.array(z.record(z.string(), z.any())).optional().openapi({}),
	})
	.openapi('NewsletterInsertSchema')
