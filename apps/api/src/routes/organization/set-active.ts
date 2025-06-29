import { ApiError, openApiErrorResponses } from '@/lib/errors'
import { idParamsSchema } from '@/shared/types'
import { createRoute, z } from '@hono/zod-openapi'

import { activeOrganization } from '@repo/auth-db'
import { authClient } from '@repo/better-auth'

import type { App } from '@/lib/hono'

const route = createRoute({
	tags: ['Organization'],
	operationId: 'organization-set-active',
	method: 'post',
	path: '/organization/{id}/set-active',
	security: [{ cookieAuth: [] }],
	request: {
		params: idParamsSchema,
	},
	responses: {
		200: {
			description: 'The practitioner',
			content: {
				'application/json': {
					schema: z.object({
						userId: z.string(),
						organizationId: z.string(),
					}),
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type Route = typeof route
export type OrganizationSetActiveResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerOrganizationSetActive = (app: App) =>
	app.openapi(route, async (c) => {
		const { db } = c.get('services')
		const session = c.get('session')
		const { id } = c.req.valid('param')

		if (!session)
			throw new ApiError({
				code: 'UNAUTHORIZED',
				message: 'You Need to login first to continue.',
			})

		try {
			const result = await db
				.insert(activeOrganization)
				.values({
					userId: session.session.userId,
					organizationId: id,
					role: session.session.activeOrganizationRole!,
				})
				.onConflictDoUpdate({
					target: activeOrganization.userId,
					set: { organizationId: id, role: session.session.activeOrganizationRole! },
				})
				.returning()

			if (result.length < 1)
				throw new ApiError({
					code: 'NOT_FOUND',
					message: 'Organization not found.',
				})

			await authClient.organization.setActive({
				organizationId: id,
			})

			return c.json(
				{
					userId: String(result[0].userId),
					organizationId: String(result[0].organizationId),
				},
				200
			)
		} catch (error) {
			throw new ApiError({
				code: 'INTERNAL_SERVER_ERROR',
				message: `An error occurred while setting the active organization. ${error instanceof Error ? error.message : 'Unknown error'}`,
			})
		}
	})
