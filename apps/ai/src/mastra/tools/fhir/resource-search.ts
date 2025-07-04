import { IToolCallResult } from '@/mastra/tools/types'
import { createTextResponse } from '@/mastra/tools/utils'
import { createTool } from '@mastra/core'
import z from 'zod'

import type { FhirApiClient } from '@/fhir/client'
import type { Bundle } from '@/fhir/v4.0.1'
import type { RuntimeContextSession } from '@/hono/types'
import type { ToolCallResult } from '@/mastra/tools/types'
import type { Audit } from '@repo/audit'
import type { Cerbos } from '@repo/cerbos'

const defaultPrincipalId = 'anonymous'
const defaultRoles = ['anonymous']
const defaultOrganizationId = 'anonymous'

export const fhirResourceSearchTool = createTool({
	id: 'fhirResourceSearch',
	description: 'Searches for on FHIR resources.',
	inputSchema: z.object({
		resourceType: z
			.string()
			.describe('Resource type, ex: Patient, Practitioner, Organization, etc'),
		params: z.unknown().describe('The fhir resource search parameters'),
	}),
	outputSchema: IToolCallResult,
	execute: async ({ context, runtimeContext }): Promise<ToolCallResult> => {
		const cerbos = runtimeContext.get('cerbos') as Cerbos
		const audit = runtimeContext.get('audit') as Audit
		const session = runtimeContext.get('session') as RuntimeContextSession
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'fhirResourceSearch'
		const resourceType = context.resourceType
		const principalId = session.userId || defaultPrincipalId
		const roles = session.roles || defaultRoles
		const organizationId = session.activeOrganizationId || defaultOrganizationId

		await audit.log({
			principalId,
			organizationId,
			action: `${toolName}Attempt`,
			targetResourceType: resourceType,
			status: 'attempt',
			searchParams: context.params,
		})

		if (!fhirClient) {
			await audit.log({
				principalId,
				organizationId,
				action: toolName,
				targetResourceType: resourceType,
				status: 'failure',
				outcomeDescription: 'FHIR client not available.',
			})
			return createTextResponse('FHIR client not available.', { isError: true })
		}

		const principal = { id: principalId, roles }
		const cerbosResource = { id: 'all', kind: resourceType, attributes: {} }
		const cerbosAction = 'search'
		const allowed = await cerbos.isAllowed({
			principal,
			resource: cerbosResource,
			action: cerbosAction,
		})
		if (!allowed) {
			const desc = `Forbidden to ${cerbosAction} ${resourceType}`
			await audit.log({
				principalId,
				organizationId,
				action: `cerbos:${cerbosAction}`,
				targetResourceType: resourceType,
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
			status: 'success',
			outcomeDescription: 'Authorization granted by Cerbos.',
		})
		try {
			const { data, error, response } = await (fhirClient.GET as any)(`/${resourceType}`, {
				params: { query: context.params },
			})
			if (error) {
				const desc = `FHIR ${resourceType} search failed: Status ${response.status}`
				await audit.log({
					principalId,
					organizationId,
					action: toolName,
					targetResourceType: resourceType,
					status: 'failure',
					outcomeDescription: desc,
					details: {
						responseStatus: response.status,
					},
				})
				return createTextResponse(desc, { isError: true })
			}
			await audit.log({
				principalId,
				organizationId,
				action: toolName,
				targetResourceType: resourceType,
				status: 'success',
			})
			return createTextResponse(JSON.stringify(data as Bundle<unknown>, null, 2), {
				isError: false,
			})
		} catch (e: any) {
			await audit.log({
				principalId,
				organizationId,
				action: toolName,
				targetResourceType: resourceType,
				status: 'failure',
				outcomeDescription: e.message,
			})
			// TODO - better description to error message
			return createTextResponse('ERROR.', { isError: true })
		}
	},
})
