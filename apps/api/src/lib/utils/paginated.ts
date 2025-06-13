import { z } from '@hono/zod-openapi'

export interface Paginated {
	/** Total number of results */
	count: number
	/** Number of results per page */
	pageSize: number
	/** Total number of pages */
	totalPages: number
	/** Current page number */
	current: number
}

type PaginatedParams = {
	size: number
	page: number
	count: number
}

export const getOffset = (page: number, size: number): number => {
	return size * (page - 1)
}

export const paginatedData = (params: PaginatedParams): Paginated => {
	const response = {
		current: params.page,
		pageSize: params.size,
		totalPages: Math.ceil(params.count / params.size),
		count: params.count,
	}
	return response
}

export const parseQueryInt = (queryString: unknown): number | undefined => {
	const query = parseInt(queryString as string)

	if (!isNaN(query) && query > 0) {
		return query
	}

	return undefined
}

export const PaginatedResponse = z.object({
	current: z.number().openapi({
		description: 'The current page number',
		example: 1,
	}),
	pageSize: z.number().openapi({
		description: 'The number of items per page',
		example: 10,
	}),
	totalPages: z.number().openapi({
		description: 'The total number of pages',
		example: 5,
	}),
	count: z.number().openapi({
		description: 'The total number of practitioners',
		example: 50,
	}),
})
