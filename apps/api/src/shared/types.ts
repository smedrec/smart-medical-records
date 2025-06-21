import { z } from '@hono/zod-openapi'

export const idSchema = z.string().length(32)
export const vectorIdSchema = z.enum(['opensearch', 'pgVector', 'mongoVector'])

export const idParamsSchema = z.object({
	id: idSchema.openapi({
		param: {
			name: 'id',
			in: 'path',
		},
		example: 'DyNtFA1TzJvpeSt2V4di6hWJ10WQlXdi',
	}),
})

export const idVectorSchema = z.object({
	id: vectorIdSchema.openapi({
		param: {
			name: 'id',
			in: 'path',
		},
		example: 'opensearch',
	}),
})

export const ResourceParamsSchema = z.object({
	resourceType: z.string().openapi({
		param: {
			name: 'resourceType',
			in: 'path',
		},
		example: 'Practitioner',
	}),
	id: z.string().openapi({
		param: {
			name: 'id',
			in: 'path',
		},
		example: '1234',
	}),
})

export const querySchema = z.object({
	limit: z.string().optional().openapi({
		description: 'The maximum number of results to return',
		example: '10',
	}),
	page: z.string().optional().openapi({
		description: 'The page number to return',
		example: '1',
	}),
})

export type ResourceBase = {
	version: number
	status: 'create' | 'updated' | 'deleted' | 'recreated' | null
}
