import { ApiError, openApiErrorResponses } from '@/lib/errors/index.js'
import { idParamsSchema } from '@/shared/types.js'
import { createRoute, z } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'

import { authClient } from '@repo/auth'
import { activeOrganization, member } from '@repo/auth-db'

import type { App } from '@/lib/hono/index.js'

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
		let role

		if (!session)
			throw new ApiError({
				code: 'UNAUTHORIZED',
				message: 'You Need to login first to continue.',
			})

		try {
			const result = await db.auth.query.member.findFirst({
				where: and(eq(member.userId, session.userId), eq(member.organizationId, id)),
			})
			if (result) {
				role = result.role
			} else {
				throw new ApiError({ code: 'NOT_FOUND', message: 'The user is not member.' })
			}
		} catch (error) {
			throw new ApiError({
				code: 'INTERNAL_SERVER_ERROR',
				message: `An error occurred while setting the active organization. ${error instanceof Error ? error.message : 'Unknown error'}`,
			})
		}

		try {
			const result = await db.auth
				.insert(activeOrganization)
				.values({
					userId: session.userId,
					organizationId: id,
					role: role,
				})
				.onConflictDoUpdate({
					target: activeOrganization.userId,
					set: { organizationId: id, role: role },
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
