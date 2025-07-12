import { createRoute } from '@hono/zod-openapi'

import { emailProvider } from '@repo/auth-db'

import { ApiError, openApiErrorResponses } from '../../../lib/errors/index.js'
import { ConfigMailInsertSchema, ConfigMailSelectSchema } from './types.js'

import type { App } from '@/lib/hono/index.js'
import type { z } from '@hono/zod-openapi'

const route = createRoute({
	tags: ['Config'],
	operationId: 'config-mail-create',
	method: 'post',
	path: '/config/mail',
	security: [{ cookieAuth: [] }],
	request: {
		body: {
			required: true,
			description: 'The configuration to create',
			content: {
				'application/json': {
					schema: ConfigMailInsertSchema,
				},
			},
		},
	},
	responses: {
		201: {
			description: 'The smart fhir client',
			content: {
				'application/json': {
					schema: ConfigMailSelectSchema,
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type Route = typeof route
export type ConfigMailCreateRequest = z.infer<
	(typeof route.request.body.content)['application/json']['schema']
>
export type ConfigMailCreateResponse = z.infer<
	(typeof route.responses)[201]['content']['application/json']['schema']
>

export const registerConfigMailCreate = (app: App) =>
	app.openapi(route, async (c) => {
		const { cerbos, db, kms } = c.get('services')
		const session = c.get('session')

		if (!session)
			throw new ApiError({ code: 'UNAUTHORIZED', message: 'You Need to login first to continue.' })

		const canCreateConfig = await cerbos.isAllowed({
			principal: {
				id: session.userId,
				roles: [session.activeOrganizationRole as string],
				attributes: {},
			},
			resource: {
				kind: 'Config',
				id: 'create',
				attributes: {},
			},
			action: 'create',
		})

		if (!canCreateConfig) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: 'You do not have permissions to create a mail configuration.',
			})
		}

		const rawData = c.req.valid('json')

		if (rawData.password) {
			const encryptedPassword = await kms.encrypt(rawData.password!)
			rawData.password = encryptedPassword.ciphertext
		}
		if (rawData.apiKey) {
			const encryptedApiKey = await kms.encrypt(rawData.apiKey!)
			rawData.apiKey = encryptedApiKey.ciphertext
		}

		const data = {
			...rawData,
			organizationId: session.activeOrganizationId as string,
		}

		const result = await db.auth.insert(emailProvider).values(data).returning()

		if (result.length < 1)
			throw new ApiError({ code: 'INTERNAL_SERVER_ERROR', message: 'A machine readable error.' })

		const response = {
			organizationId: result[0].organizationId ?? undefined,
			provider: result[0].provider as 'smtp' | 'resend' | 'sendgrid',
			host: result[0].host ?? undefined,
			port: result[0].port ?? undefined,
			secure: result[0].secure ?? undefined,
			user: result[0].user ?? undefined,
			fromName: result[0].fromName ?? undefined,
			fromEmail: result[0].fromEmail ?? undefined,
		}

		return c.json(response, 201)
	})
