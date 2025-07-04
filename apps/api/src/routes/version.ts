import { createRoute, z } from '@hono/zod-openapi'

import { openApiErrorResponses } from '../lib/errors/index.js'

import type { App } from '../lib/hono/index.js'

const route = createRoute({
	tags: ['version'],
	operationId: 'version',
	method: 'get',
	path: '/version',
	responses: {
		200: {
			description: 'The version of the server',
			content: {
				'application/json': {
					schema: z.object({
						version: z.string().openapi({
							description: 'The version of the server',
						}),
					}),
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type VersionResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerVersion = (app: App) =>
	app.openapi(route, async (c) => {
		return c.json(
			{
				version: '0.1.0',
			},
			200
		)
	})
