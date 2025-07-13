import { createRoute, z } from '@hono/zod-openapi'

import { ApiError, openApiErrorResponses } from '../../../lib/errors/index.js'
import { createFhirApiClient } from '../../../lib/fhir/client.js'
import { handleOperationOutcomeError } from '../../../lib/fhir/ErrorHandler.js'
import { ResourceParamsSchema } from '../../../shared/types.js'

import type { OperationOutcome } from 'fhir/r4'
import type { App } from '../../../lib/hono/index.js'

const route = createRoute({
	tags: ['FHIR'],
	operationId: 'fhir-resource-get',
	method: 'get',
	path: '/fhir/resources/{resourceType}/{id}',
	security: [{ cookieAuth: [] }],
	request: {
		params: ResourceParamsSchema,
	},
	responses: {
		200: {
			description: 'The smart fhir client',
			content: {
				'application/json': {
					schema: z.object({
						resource: z.any().openapi({
							description: 'The resource data',
						}),
					}),
				},
			},
		},
		...openApiErrorResponses,
	},
})

export type Route = typeof route

export type ResourceGetResponse = z.infer<
	(typeof route.responses)[200]['content']['application/json']['schema']
>

export const registerResourceGet = (app: App) =>
	app.openapi(route, async (c) => {
		const { cerbos, audit } = c.get('services')
		const session = c.get('session')

		if (!session)
			throw new ApiError({ code: 'UNAUTHORIZED', message: 'You Need to login first to continue.' })

		const params = c.req.valid('param')

		const canReadResource = await cerbos.isAllowed({
			principal: {
				id: session.userId,
				roles: [session.activeOrganizationRole as string],
				attributes: {},
			},
			resource: {
				kind: params.resourceType,
				id: 'read',
				attributes: {},
			},
			action: 'read',
		})

		if (!canReadResource) {
			throw new ApiError({
				code: 'FORBIDDEN',
				message: `You do not have permissions to read a fhir resource of type ${params.resourceType}.`,
			})
		}

		const toolName = 'fhirResourceRead'
		const resourceType = params.resourceType
		const resourceId = params.id
		const principalId = session.userId
		const organizationId = session.activeOrganizationId

		const fhirClient = createFhirApiClient(
			'https://launcher.teachhowtofish.org/v/r4/fhir/',
			session.smartClientAccessToken!
		)

		try {
			const { data, error, response } = await (fhirClient.GET as any)(`/${resourceType}/{id}`, {
				params: { path: { id: params.id } },
			})
			if (error) {
				const rText = await response.text()
				const operationOutcomeError = handleOperationOutcomeError(
					JSON.parse(rText) as OperationOutcome
				)
				const outcomeDescription = `FHIR ${resourceType} read failed: Status ${response.status}`
				await audit.log({
					principalId,
					organizationId,
					action: toolName,
					targetResourceType: resourceType,
					targetResourceId: resourceId,
					status: 'failure',
					outcomeDescription,
					details: {
						responseStatus: response.status,
						responseBody: rText,
						operationOutcomeError: operationOutcomeError.message,
					},
				})
				throw new ApiError({
					code: 'INTERNAL_SERVER_ERROR',
					message: operationOutcomeError.message,
				})
			}
			await audit.log({
				principalId,
				organizationId,
				action: toolName,
				targetResourceType: resourceType,
				targetResourceId: resourceId,
				status: 'success',
				outcomeDescription: `Successfully read ${resourceType} resource.`,
			})
			return c.json(data, 200)
		} catch (e: any) {
			await audit.log({
				principalId,
				organizationId,
				action: toolName,
				targetResourceType: resourceType,
				targetResourceId: resourceId,
				status: 'failure',
				outcomeDescription: e.message,
			})
			throw new ApiError({
				code: 'INTERNAL_SERVER_ERROR',
				message: `FHIR ${resourceType} read failed. Error: ${e.message}`,
			})
		}
	})
