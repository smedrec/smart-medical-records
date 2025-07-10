import { IToolCallResult } from '@/mastra/tools/types'
import { createTextResponse, DefaultAuthContext } from '@/mastra/tools/utils'
import { createTool } from '@mastra/core'
import z from 'zod'

import type { FhirApiClient } from '@/fhir/client'
import type { OperationOutcome } from '@/fhir/v4.0.1'
import type { RuntimeContextSession } from '@/hono/types'
import type { RuntimeServices, ToolCallResult } from '@/mastra/tools/types'

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
				const desc = `FHIR ${resourceType} create failed: Status ${response.status}`
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
					},
				})
				try {
					const error = handleOperationOutcomeError(JSON.parse(rText) as OperationOutcome)
					//const o = JSON.parse(rText) as OperationOutcome
					//if (o?.issue?.length > 0) throw new Error(o.issue[0].diagnostics)
					return createTextResponse(error.message, { isError: true })
				} catch (e) {}
				return createTextResponse(desc, { isError: true })
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
			// TODO - better description to error message
			return createTextResponse('ERROR', { isError: true })
		}
	},
})

export function handleOperationOutcomeError(operationOutcome: OperationOutcome): Validation {
	const errorMessage = operationOutcome.issue
		? operationOutcome.issue
				.map((issue) => {
					return issue.details?.text ?? 'Unknown error'
				})
				.join('\n')
		: 'Unknown error'

	return {
		message: 'OperationOutcome: ' + errorMessage,
		severity: 'ERROR',
	}
}
