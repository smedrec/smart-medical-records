import { IToolCallResult } from '@/mastra/tools/types'
import { createTextResponse } from '@/mastra/tools/utils'
import { createTool } from '@mastra/core'
import z from 'zod'

import type { FhirApiClient, FhirSessionData } from '@/hono/middleware/fhir-auth'
import type { ToolCallResult } from '@/mastra/tools/types'
import type { Audit } from '@repo/audit'
import type { Cerbos } from '@repo/cerbos'

const defaultPrincipalId = 'anonymous'
const defaultRoles = ['anonymous']
const defaultOrganizationId = 'anonymous'

export const fhirResourceDeleteTool = createTool({
	id: 'fhirResourceDelete',
	description: 'Deletes a FHIR resource by ID.',
	inputSchema: z.object({
		resourceType: z
			.string()
			.describe('Resource type, ex: Patient, Practitioner, Organization, etc'),
		id: z.string().describe('Resource id'),
	}),
	outputSchema: IToolCallResult,
	execute: async ({ context, runtimeContext }): Promise<ToolCallResult> => {
		const cerbos = runtimeContext.get('cerbos') as Cerbos
		const audit = runtimeContext.get('audit') as Audit
		const fhirSessionData = runtimeContext.get('fhirSessionData') as FhirSessionData
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'fhirResourceDelete'
		const resourceType = context.resourceType
		const resourceId = context.id
		const principalId = fhirSessionData.userId || defaultPrincipalId
		const organizationId = fhirSessionData.activeOrganizationId || defaultOrganizationId
		const roles = fhirSessionData.roles || defaultRoles
		const principal = { id: principalId, roles: roles, attributes: {} }
		const cerbosResource = { kind: resourceType, id: resourceId, attributes: {} }
		const cerbosAction = 'delete'

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

		try {
			const { data, error, response } = await fhirClient.DELETE(`/${resourceType}/{id}`, {
				params: { path: { id: context.id } },
			})
			if (error) {
				const rText = await response.text()
				const outcomeDescription = `FHIR ${resourceType} delete failed: Status ${response.status}`
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
					},
				})
				console.error(
					`FHIR ${resourceType} delete error (ID: ${context.id}): Status ${response.status}`,
					await response.text()
				)
				return createTextResponse(outcomeDescription, { isError: true })
			}
			await audit.log({
				principalId,
				organizationId,
				action: toolName,
				targetResourceType: resourceType,
				targetResourceId: resourceId,
				status: 'success',
				outcomeDescription: `Successfully delete ${resourceType} resource.`,
			})
			return createTextResponse(JSON.stringify(data, null, 2), { isError: false })
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
			// TODO - better description to error message
			return createTextResponse('ERROR', { isError: true })
		}
	},
})
