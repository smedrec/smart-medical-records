import { handleOperationOutcomeError } from '@/fhir/ErrorHandler'
import { IToolCallResult } from '@/mastra/tools/types'
import { createTextResponse, DefaultAuthContext } from '@/mastra/tools/utils'
import { createTool } from '@mastra/core'
import z from 'zod'

import type { FhirApiClient } from '@/fhir/client'
import type { RuntimeContextSession } from '@/hono/types'
import type { RuntimeServices, ToolCallResult } from '@/mastra/tools/types'
import type { OperationOutcome } from 'fhir/r4'

export const fhirResourceReadTool = createTool({
	id: 'fhirResourceRead',
	description:
		'Reads a FHIR resource from a FHIR server given a resource type and resource id. This can be used to obtain additional details of a resource.',
	inputSchema: z.object({
		resourceType: z
			.string()
			.describe('Resource type, ex: Patient, Practitioner, Organization, etc'),
		id: z.string().describe('Resource id'),
	}),
	outputSchema: IToolCallResult,
	execute: async ({ context, runtimeContext }): Promise<ToolCallResult> => {
		const { cerbos, audit } = runtimeContext.get('services') as RuntimeServices
		const session = runtimeContext.get('session') as RuntimeContextSession
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'read'
		const resourceType = context.resourceType
		const resourceId = context.id
		const principalId = session.userId || DefaultAuthContext.principalId
		const organizationId = session.activeOrganizationId || DefaultAuthContext.organizationId
		const roles = session.roles || DefaultAuthContext.roles
		const principal = { id: principalId, roles: roles, attributes: {} }
		const cerbosResource = { kind: resourceType, id: resourceId, attributes: {} }
		const cerbosAction = 'read'

		if (!fhirClient) {
			await audit.logSystem({
				action: toolName,
				status: 'failure',
				component: 'fhir-api-client',
				outcomeDescription: 'FHIR client not available.',
				systemContext: {
					version: '0.1.0',
					environment: 'development',
					nodeVersion: process.version,
				},
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
			await audit.logFHIR({
				principalId,
				organizationId,
				action: toolName,
				resourceType,
				resourceId,
				status: 'failure',
				outcomeDescription: `Forbidden: User ${principalId} with roles [${roles.join(', ')}] not authorized to perform '${cerbosAction}' on ${cerbosResource.kind}/${cerbosResource.id}.`,
				sessionContext: {
					sessionId: 'sess-medical-456',
					ipAddress: '10.0.1.75',
					userAgent: 'EMR-System/2.1.0',
				},
				fhirContext: {
					version: 'R4',
					interaction: cerbosAction,
				},
			})
			return createTextResponse(outcomeDescription, { isError: true })
		}
		await audit.logFHIR({
			principalId,
			organizationId,
			action: toolName,
			resourceType,
			resourceId,
			status: 'success',
			outcomeDescription: 'Authorization granted by Cerbos.',
			sessionContext: {
				sessionId: 'sess-medical-456',
				ipAddress: '10.0.1.75',
				userAgent: 'EMR-System/2.1.0',
			},
			fhirContext: {
				version: 'R4',
				interaction: cerbosAction,
			},
		})

		try {
			const { data, error, response } = await (fhirClient.GET as any)(`/${resourceType}/{id}`, {
				params: { path: { id: context.id } },
			})
			if (error) {
				const rText = await response.text()
				const operationOutcomeError = handleOperationOutcomeError(
					JSON.parse(rText) as OperationOutcome
				)
				const outcomeDescription = `FHIR ${resourceType} read failed: Status ${response.status}`
				await audit.logFHIR({
					principalId,
					organizationId,
					action: toolName,
					resourceType,
					resourceId,
					status: 'failure',
					outcomeDescription,
					sessionContext: {
						sessionId: 'sess-medical-456',
						ipAddress: '10.0.1.75',
						userAgent: 'EMR-System/2.1.0',
					},
					fhirContext: {
						version: 'R4',
						interaction: cerbosAction,
					},
				})
				return createTextResponse(operationOutcomeError.message, { isError: true })
			}
			await audit.logFHIR({
				principalId,
				organizationId,
				action: toolName,
				resourceType,
				resourceId,
				status: 'success',
				outcomeDescription: `Successfully read ${resourceType} resource.`,
				sessionContext: {
					sessionId: 'sess-medical-123',
					ipAddress: '10.0.1.50',
					userAgent: 'EMR-System/2.1.0',
				},
				fhirContext: {
					version: 'R4',
					interaction: cerbosAction,
				},
			})
			return createTextResponse(JSON.stringify(data, null, 2), { isError: false })
		} catch (e: any) {
			await audit.logFHIR({
				principalId,
				organizationId,
				action: toolName,
				resourceType,
				resourceId,
				status: 'failure',
				outcomeDescription: e.message,
				sessionContext: {
					sessionId: 'sess-medical-456',
					ipAddress: '10.0.1.75',
					userAgent: 'EMR-System/2.1.0',
				},
				fhirContext: {
					version: 'R4',
					interaction: cerbosAction,
				},
			})
			return createTextResponse(`FHIR ${resourceType} read failed. Error: ${e.message}`, {
				isError: true,
			})
		}
	},
})
