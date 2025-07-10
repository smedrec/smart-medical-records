import { getInitialFhirSearchQueries } from '@/mastra/tools/fhir/fhirSearchQueries'
import { IToolCallResult } from '@/mastra/tools/types'
import { createTextResponse, DefaultAuthContext } from '@/mastra/tools/utils'
import { createTool } from '@mastra/core'
import z from 'zod'

import type { FhirApiClient } from '@/fhir/client'
import type { RuntimeContextSession } from '@/hono/types'
import type { RuntimeServices, ToolCallResult } from '@/mastra/tools/types'

export const fhirPatientReportSearchTool = createTool({
	id: 'fhirPatientReportSearch',
	description: 'Search patient clinical data in JSON format.',
	inputSchema: z.object({
		id: z.string().describe('Patient id'),
	}),
	outputSchema: IToolCallResult,
	execute: async ({ context, runtimeContext }): Promise<ToolCallResult> => {
		const { cerbos, audit } = runtimeContext.get('services') as RuntimeServices
		const session = runtimeContext.get('session') as RuntimeContextSession
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'fhirPatientReportSearch'
		const resourceType = 'FhirPatientReport'
		const resourceId = context.id
		const principalId = session.userId || DefaultAuthContext.principalId
		const organizationId = session.activeOrganizationId || DefaultAuthContext.organizationId
		const roles = session.roles || DefaultAuthContext.roles
		const principal = { id: principalId, roles: roles, attributes: {} }
		const cerbosResource = { kind: resourceType, id: resourceId, attributes: {} }
		const cerbosAction = 'read'

		const queries = getInitialFhirSearchQueries(resourceId)

		await audit.log({
			principalId,
			organizationId,
			action: `${toolName}Attempt`,
			targetResourceType: resourceType,
			targetResourceId: resourceId,
			status: 'attempt',
		})

		if (!fhirClient) {
			await audit.log({
				principalId,
				organizationId,
				action: toolName,
				targetResourceType: resourceType,
				targetResourceId: resourceId,
				status: 'failure',
				outcomeDescription: 'FHIR client not available.',
			})
			return createTextResponse('FHIR client not available.', { isError: true })
		}

		const allowed = await cerbos.isAllowed({
			principal,
			resource: cerbosResource,
			action: cerbosAction,
		})

		if (!allowed) {
			const outcomeDescription = `Forbidden: User ${principalId} with roles [${roles.join(', ')}] not authorized to perform '${cerbosAction}' on ${cerbosResource.kind}/${cerbosResource.id}.`
			await audit.log({
				principalId,
				organizationId,
				action: `cerbos:${cerbosAction}`,
				targetResourceType: resourceType,
				targetResourceId: resourceId,
				status: 'failure',
				outcomeDescription,
			})
			return createTextResponse(outcomeDescription, { isError: true })
		}
		await audit.log({
			principalId,
			organizationId,
			action: `cerbos:${cerbosAction}`,
			targetResourceType: resourceType,
			targetResourceId: resourceId,
			status: 'success',
			outcomeDescription: 'Authorization granted by Cerbos.',
		})

		let result: any[] = []

		await Promise.all(
			queries.map(async (query) => {
				await audit.log({
					principalId,
					organizationId,
					action: `${toolName}Attempt`,
					targetResourceType: query.resourceType,
					targetResourceId: resourceId,
					status: 'attempt',
					details: {
						params: query.params,
					},
				})

				try {
					console.log(JSON.stringify(query.params))
					const { data, error, response } = await (fhirClient.GET as any)(
						`/${query.resourceType}`,
						{
							params: { query: query.params },
						}
					)
					if (error) {
						const rText = await response.text()
						const outcomeDescription = `FHIR ${resourceType} read failed: Status ${response.status}`
						await audit.log({
							principalId,
							organizationId,
							action: toolName,
							targetResourceType: query.resourceType,
							targetResourceId: resourceId,
							status: 'failure',
							outcomeDescription,
							details: {
								responseStatus: response.status,
								responseBody: rText,
							},
						})
						console.error(
							`FHIR ${query.resourceType} read error (ID: ${context.id}): Status ${response.status}`,
							await response.text()
						)
						return createTextResponse(outcomeDescription, { isError: true })
					}
					await audit.log({
						principalId,
						organizationId,
						action: toolName,
						targetResourceType: query.resourceType,
						targetResourceId: resourceId,
						status: 'success',
						outcomeDescription: `Successfully read ${query.resourceType} resource.`,
					})
					if (data.total > 0) result.push(data)
				} catch (e: any) {
					await audit.log({
						principalId,
						organizationId,
						action: toolName,
						targetResourceType: query.resourceType,
						targetResourceId: resourceId,
						status: 'failure',
						outcomeDescription: e.message,
					})
					// TODO - better description to error message
					//  FIXME - bug when read Organization or Practioner
					// return createTextResponse('ERROR', { isError: true })
				}
			})
		)

		return createTextResponse(JSON.stringify(result, null, 2), { isError: false })
	},
})
