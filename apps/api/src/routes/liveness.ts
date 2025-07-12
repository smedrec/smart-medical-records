import { createRoute, z } from '@hono/zod-openapi'
import { sql } from 'drizzle-orm'

import { openApiErrorResponses } from '../lib/errors/index.js'

import type { App } from '../lib/hono/index.js'

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
							logger: z.string().openapi({
								description: 'The name of the connected logger service',
								example: 'AxiomLogger or ConsoleLogger',
							}),
							db: z.object({
								auth: z.string().openapi({
									description: 'The status of the Auth DB',
									example: '🟢 or 🔴',
								}),
								app: z.string().openapi({
									description: 'The status of the App DB',
									example: '🟢 or 🔴',
								}),
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
		const { logger, db } = c.get('services')
		let authDbStatus: boolean = false
		let appDbStatus: boolean = false

		try {
			await db.auth.execute(sql`select 1`)
			authDbStatus = true
		} catch (error) {
			console.error('🔴 AUTH Database connection failed:', error)
		}

		try {
			await db.app.execute(sql`select 1`)
			appDbStatus = true
		} catch (error) {
			console.error('🔴 APP Database connection failed:', error)
		}

		return c.json(
			{
				status: 'ok',
				services: {
					logger: String(logger?.constructor?.name ?? 'Unknown'),
					db: {
						auth: authDbStatus ? '🟢' : '🔴',
						app: appDbStatus ? '🟢' : '🔴',
					},
				},
			},
			200
		)
	})
