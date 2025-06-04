import { createRoute, z } from '@hono/zod-openapi'

import { openApiErrorResponses } from '../lib/errors'

import type { App } from '../lib/hono'

const route = createRoute({
	tags: ['liveness'],
	operationId: 'liveness',
	method: 'get',
	path: '/liveness',
	responses: {
		200: {
			description: 'The configured services and their status',
			content: {
				'application/json': {
					schema: z.object({
						status: z.string().openapi({
							description: 'The status of the server',
						}),
						services: z.object({
							metrics: z.string().openapi({
								description: 'The name of the connected metrics service',
								example: 'AxiomMetrics',
							}),
							logger: z.string().openapi({
								description: 'The name of the connected logger service',
								example: 'AxiomLogger or ConsoleLogger',
							}),
							ratelimit: z.string().openapi({
								description: 'The name of the connected ratelimit service',
							}),
							usagelimit: z.string().openapi({
								description: 'The name of the connected usagelimit service',
							}),
						}),
					}),
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type LivenessResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerLiveness = (app: App) =>
	app.openapi(route, async (c) => {
		//const { logger, metrics, rateLimiter, usageLimiter } = c.get("services");
		const { logger } = c.get('services')

		return c.json({
			status: 'ok',
			services: {
				//metrics: metrics.constructor.name,
				logger: logger.constructor.name,
				//ratelimit: rateLimiter.constructor.name,
				//usagelimit: usageLimiter.constructor.name,
			},
		})
	})
