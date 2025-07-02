import { IToolCallResult } from '@/mastra/tools/types'
import { createTextResponse } from '@/mastra/tools/utils'
import { createTool } from '@mastra/core'
import z from 'zod'

import type { FhirApiClient, FhirSessionData } from '@/hono/middleware/fhir-auth'
import type { ToolCallResult } from '@/mastra/tools/types'
import type { OperationOutcome } from '@/v4.0.1'
import type { Audit } from '@repo/audit'
import type { Cerbos } from '@repo/cerbos'

const defaultPrincipalId = 'anonymous'
const defaultRoles = ['anonymous']
const defaultOrganizationId = 'anonymous'

export const fhirResourceUpdateTool = createTool({
	id: 'fhirResourceUpdate',
	description: 'Updates an existing FHIR resource.',
	inputSchema: z.object({
		resourceType: z
			.string()
			.describe('Resource type, ex: Patient, Practitioner, Organization, etc'),
		id: z.string().describe('Resource id'),
		resource: z.unknown().describe(''),
	}),
	outputSchema: IToolCallResult,
	execute: async ({ context, runtimeContext }): Promise<ToolCallResult> => {
		const cerbos = runtimeContext.get('cerbos') as Cerbos
		const audit = runtimeContext.get('audit') as Audit
		const fhirSessionData = runtimeContext.get('fhirSessionData') as FhirSessionData
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'fhirResourceUpdate'
		const resourceType = context.resourceType
		const resourceId = context.id
		const principalId = fhirSessionData.userId || defaultPrincipalId
		const organizationId = fhirSessionData.activeOrganizationId || defaultOrganizationId
		const roles = fhirSessionData.roles || defaultRoles

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
		const principal = { id: principalId, roles }
		const cerbosResource = { id: resourceId, kind: resourceType, attributes: {} }
		const cerbosAction = 'update'
		const allowed = await cerbos.isAllowed({
			principal,
			resource: cerbosResource,
			action: cerbosAction,
		})
		if (!allowed) {
			const desc = `Forbidden to ${cerbosAction} ${resourceType}/${resourceId}`
			await audit.log({
				principalId,
				organizationId,
				action: `cerbos:${cerbosAction}`,
				targetResourceType: resourceType,
				targetResourceId: resourceId,
				status: 'failure',
				outcomeDescription: desc,
			})
			return createTextResponse(desc, { isError: true })
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
			const { data, error, response } = await fhirClient.PUT(`/${resourceType}/{id}`, {
				params: { path: { id: context.id } },
				body: context.resource,
			})
			if (error) {
				const rText = await response.text()
				const desc = `FHIR ${resourceType} update failed: Status ${response.status}`
				await audit.log({
					principalId,
					organizationId,
					action: toolName,
					targetResourceType: resourceType,
					targetResourceId: resourceId,
					status: 'failure',
					outcomeDescription: desc,
					details: {
						responseStatus: response.status,
						responseBody: rText,
					},
				})
				try {
					const o = JSON.parse(rText) as OperationOutcome
					if (o?.issue?.length > 0) throw new Error(o.issue[0].diagnostics)
				} catch (e) {}
				return createTextResponse(desc, { isError: true })
			}
			await audit.log({
				principalId,
				organizationId,
				action: toolName,
				targetResourceType: resourceType,
				targetResourceId: resourceId,
				status: 'success',
			})
			return createTextResponse(JSON.stringify(data, null, 2), { isError: true })
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
