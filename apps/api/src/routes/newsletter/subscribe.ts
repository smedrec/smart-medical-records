import { createRoute, z } from '@hono/zod-openapi'

import { newsletter } from '@repo/app-db'

import { ApiError, openApiErrorResponses } from '../../lib/errors/index.js'
import { NewsletterInsertSchema } from './types.js'

import type { App } from '@/lib/hono/index.js'

const route = createRoute({
	tags: ['Newsletter'],
	operationId: 'newsletter-subscribe',
	method: 'post',
	path: '/newsletter/subscribe',
	security: [{ cookieAuth: [] }],
	request: {
		body: {
			required: true,
			description: 'The subscriber to create',
			content: {
				'application/json': {
					schema: NewsletterInsertSchema,
				},
			},
		},
	},
	responses: {
		201: {
			description: 'The smart fhir client',
			content: {
				'application/json': {
					schema: z.object({
						success: z.boolean().openapi({}),
					}),
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type Route = typeof route
export type NewsletterSubscribeRequest = z.infer<
	(typeof route.request.body.content)['application/json']['schema']
>
export type NewsletterSubscribeResponse = z.infer<
	(typeof route.responses)[201]['content']['application/json']['schema']
>

export const registerNewsletterSubscribe = (app: App) =>
	app.openapi(route, async (c) => {
		const { db } = c.get('services')

		const data = c.req.valid('json')

		const result = await db.app
			.insert(newsletter)
			.values(data)
			.onConflictDoUpdate({
				target: [newsletter.email, newsletter.list],
				set: { status: 'pending', metadata: data.metadata },
			})
			.returning()

		if (result.length < 1)
			throw new ApiError({ code: 'INTERNAL_SERVER_ERROR', message: 'A machine readable error.' })

		return c.json({ success: true }, 201)
	})
