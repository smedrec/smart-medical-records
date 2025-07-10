import { handleOperationOutcomeError } from '@/fhir/ErrorHandler'
import { IToolCallResult } from '@/mastra/tools/types'
import { createTextResponse, DefaultAuthContext } from '@/mastra/tools/utils'
import { createTool } from '@mastra/core'
import z from 'zod'

import type { FhirApiClient } from '@/fhir/client'
import type { RuntimeContextSession } from '@/hono/types'
import type { RuntimeServices, ToolCallResult } from '@/mastra/tools/types'
import type { OperationOutcome } from 'fhir/r4'

export const fhirResourceCreateTool = createTool({
	id: 'fhirResourceCreate',
	description: 'Creates a new FHIR resource.',
	inputSchema: z.object({
		resourceType: z
			.string()
			.describe('Resource type, ex: Patient, Practitioner, Organization, etc'),
		resource: z.unknown().describe('The FHIR resource'),
	}),
	outputSchema: IToolCallResult,
	execute: async ({ context, runtimeContext }): Promise<ToolCallResult> => {
		const { cerbos, audit } = runtimeContext.get('services') as RuntimeServices
		const session = runtimeContext.get('session') as RuntimeContextSession
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'fhirResourceCreate'
		const resourceType = context.resourceType
		const principalId = session.userId || DefaultAuthContext.principalId
		const organizationId = session.activeOrganizationId || DefaultAuthContext.organizationId
		const roles = session.roles || DefaultAuthContext.roles

		await audit.log({
			principalId,
			organizationId,
			action: `${toolName}Attempt`,
			targetResourceType: resourceType,
			status: 'attempt',
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
		const cerbosResource = { id: 'create', kind: resourceType, attributes: {} }
		const cerbosAction = 'create'
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
			const { data, error, response } = await (fhirClient.POST as any)(`/${resourceType}`, {
				body: context.resource,
			})
			if (error) {
				const rText = await response.text()
				const operationOutcomeError = handleOperationOutcomeError(
					JSON.parse(rText) as OperationOutcome
				)
				const desc = `FHIR ${resourceType} create failed. Error: ${response.status}`
				await audit.log({
					principalId,
					organizationId,
					action: toolName,
					targetResourceType: resourceType,
					status: 'failure',
					outcomeDescription: desc,
					details: {
						responseStatus: response.status,
						responseBody: rText,
						operationOutcomeError: operationOutcomeError.message,
					},
				})
				return createTextResponse(operationOutcomeError.message, { isError: true })
			}
			await audit.log({
				principalId,
				organizationId,
				action: toolName,
				targetResourceType: resourceType,
				targetResourceId: data.id,
				status: 'success',
			})
			return createTextResponse(JSON.stringify(data, null, 2), { isError: true })
		} catch (e: any) {
			await audit.log({
				principalId,
				organizationId,
				action: toolName,
				targetResourceType: resourceType,
				status: 'failure',
				outcomeDescription: e.message,
			})
			return createTextResponse(`FHIR ${resourceType} create failed. Error: ${e.message}`, {
				isError: true,
			})
		}
	},
})
