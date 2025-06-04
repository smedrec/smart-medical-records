import { z } from '@hono/zod-openapi'

export const idParamsSchema = z.object({
	id: z
		.string()
		.min(3)
		.openapi({
			param: {
				name: 'id',
				in: 'path',
			},
			example: 'DyNtFA1TzJvpeSt2V4di6hWJ10WQlXdi',
		}),
})

export const querySchema = z.object({
	limit: z.string().optional().openapi({}),
	page: z.string().optional().openapi({}),
})
