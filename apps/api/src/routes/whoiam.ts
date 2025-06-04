import { createRoute, z } from '@hono/zod-openapi'

import { ApiError, openApiErrorResponses } from '../lib/errors'

import type { App } from '../lib/hono'

const route = createRoute({
	tags: ['api'],
	operationId: 'whoiam',
	method: 'get',
	path: '/whoiam',
	security: [{ apiKeyCookie: [] }],
	responses: {
		200: {
			description: 'Who i am',
			content: {
				'application/json': {
					schema: z.object({
						id: z.string().openapi({
							description: 'User ID',
							example: 'kLOQEDPqIG6ybTwzFFUBZ',
						}),
						name: z.string().min(3).openapi({
							description: "User's full name",
						}),
						email: z.string().email().openapi({
							description: "User's email address",
						}),
						emailVerified: z.boolean().openapi({
							description: 'Whether the email has been verified',
						}),
						createdAt: z.string().datetime().openapi({
							description: 'User account creation timestamp',
						}),
						updatedAt: z.string().datetime().openapi({
							description: 'Last user account update timestamp',
						}),
					}),
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type Route = typeof route
export type WhoiamResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerWhoiam = (app: App) =>
	app.openapi(route, async (c) => {
		const session = c.get('session')

		if (!session)
			throw new ApiError({ code: 'UNAUTHORIZED', message: 'You Need to login first to continue.' })

		return c.json(
			{
				id: session.user.id,
				name: session.user.name,
				email: session.user.email,
				emailVerified: session.user.emailVerified,
				createdAt: session.user.createdAt.toISOString(),
				updatedAt: session.user.updatedAt.toISOString(),
			},
			200
		)
	})
