import { ApiError, openApiErrorResponses } from '@/lib/errors'
import { createRoute, z } from '@hono/zod-openapi'

import {
	codesystem,
	implementationguide,
	list,
	namingsystem,
	structuredefinition,
	valueset,
} from '@repo/db'

import type { App } from '@/lib/hono'

const route = createRoute({
	tags: ['Seed'],
	operationId: 'seed',
	method: 'post',
	path: '/seed',
	security: [{ cookieAuth: [] }],
	request: {
		body: {
			required: true,
			description: 'The practitioner to create',
			content: {
				'application/json': {
					schema: z.unknown().openapi({
						description: 'The resource to create',
					}),
				},
			},
		},
	},
	responses: {
		201: {
			description: 'The practitioner',
			content: {
				'application/json': {
					schema: z.object({
						message: z.string().openapi({
							description: 'The status message',
						}),
					}),
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type Route = typeof route

export type SeedRequest = z.infer<(typeof route.request.body.content)['application/json']['schema']>

export type SeedResponse = z.infer<
	(typeof route.responses)[201]['content']['application/json']['schema']
>

export const registerSeed = (app: App) =>
	app.openapi(route, async (c) => {
		const { db } = c.get('services')
		const session = c.get('session')

		if (!session)
			throw new ApiError({ code: 'UNAUTHORIZED', message: 'You Need to login first to continue.' })

		const data = await c.req.json()

		switch (data.resourceType) {
			case 'CodeSystem': {
				console.log(`Processing CodeSystem resource type`)
				const result = await db
					.insert(codesystem)
					.values({
						createdBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
						updatedBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
						resource: data,
					})
					.returning()

				console.log(`Created ${result[0].id}`)
				break
			}
			case 'ValueSet': {
				console.log(`Processing ValueSet resource type`)
				const result = await db
					.insert(valueset)
					.values({
						createdBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
						updatedBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
						resource: data,
					})
					.returning()
				console.log(`Created ${result[0].id}`)
				break
			}
			case 'ImplementationGuide': {
				console.log(`Processing ImplementationGuide resource type`)
				const result = await db
					.insert(implementationguide)
					.values({
						organization: 'vcoCNrwmPJYmhtG7E9emxeFZ3voKIDNl',
						createdBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
						updatedBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
						resource: data,
					})
					.returning()
				console.log(`Created ${result[0].id}`)
				break
			}
			case 'List': {
				console.log(`Processing List resource type}`)
				const result = await db
					.insert(list)
					.values({
						createdBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
						updatedBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
						resource: data,
					})
					.returning()
				console.log(`Created ${result[0].id}`)
				break
			}
			case 'NamingSystem': {
				console.log(`Processing List resource type`)
				const result = await db
					.insert(namingsystem)
					.values({
						createdBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
						updatedBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
						resource: data,
					})
					.returning()
				console.log(`Created ${result[0].id}`)
				break
			}
			case 'StructureDefinition': {
				console.log(`Processing List resource type`)
				const result = await db
					.insert(structuredefinition)
					.values({
						createdBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
						updatedBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
						resource: data,
					})
					.returning()
				console.log(`Created ${result[0].id}`)
				break
			}
			default:
				console.log(`Unknown resource type ${data.resourceType}`)
				return c.json(
					{
						message: `Unknown resource type: ${data.resourceType}`,
					},
					400
				)
		}

		return c.json(
			{
				message: 'Database seeding successfully',
			},
			200
		)
	})
