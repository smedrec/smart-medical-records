import { handleOperationOutcomeError } from '@/fhir/ErrorHandler'
import { IToolCallResult } from '@/mastra/tools/types'
import { createTextResponse, DefaultAuthContext } from '@/mastra/tools/utils'
import { createTool } from '@mastra/core'
import z from 'zod'

import type { FhirApiClient } from '@/fhir/client'
import type { RuntimeContextSession } from '@/hono/types'
import type { RuntimeServices, ToolCallResult } from '@/mastra/tools/types'
import type { OperationOutcome } from 'fhir/r4'

export const fhirResourceValidateTool = createTool({
	id: 'fhirResourceValidate',
	description:
		'Perform basic validation to ensure required resource fields are present and conform to FHIR data types (e.g., date formats).',
	inputSchema: z.object({
		resourceType: z
			.string()
			.describe('Resource type, ex: Patient, Practitioner, Organization, etc'),
		id: z
			.string()
			.optional()
			.describe('Resource id, is optional but can used before a update validation'),
		resource: z.unknown().describe(''),
	}),
	outputSchema: IToolCallResult,
	execute: async ({ context, runtimeContext }): Promise<ToolCallResult> => {
		const { cerbos, audit } = runtimeContext.get('services') as RuntimeServices
		const session = runtimeContext.get('session') as RuntimeContextSession
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'fhirResourceValidateTool'
		const resourceType = context.resourceType
		const resourceId = context.id || 'validate'
		const principalId = session.userId || DefaultAuthContext.principalId
		const organizationId = session.activeOrganizationId || DefaultAuthContext.organizationId
		const roles = session.roles || DefaultAuthContext.roles

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
			const desc = `Forbidden to ${cerbosAction} ${resourceType}/$validate`
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
			const { data, error, response } = await (fhirClient.POST as any)(
				`/${resourceType}/$validate`,
				{
					body: context.resource,
				}
			)
			if (error) {
				const rText = await response.text()
				const operationOutcomeError = handleOperationOutcomeError(
					JSON.parse(rText) as OperationOutcome
				)
				const desc = `FHIR ${resourceType} validate failed: Status ${response.status}`
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
						operationOutcomeError: operationOutcomeError.message,
					},
				})
				try {
					const o = JSON.parse(rText) as OperationOutcome
					if (o?.issue?.length > 0) throw new Error(o.issue[0].diagnostics)
				} catch (e) {}
				return createTextResponse(operationOutcomeError.message, { isError: true })
			}
			await audit.log({
				principalId,
				organizationId,
				action: toolName,
				targetResourceType: resourceType,
				targetResourceId: resourceId,
				status: 'success',
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
			return createTextResponse(`FHIR ${resourceType} validate failed. Error ${e.message}`, {
				isError: true,
			})
		}
	},
})
