import { createTool } from '@mastra/core'
import z from 'zod'

import { createTextResponse } from './utils'
import { getInitialFhirSearchQueries } from './utils/fhirSearchQueries'

import type { Audit } from '@repo/audit'
import type { Cerbos } from '@repo/cerbos'
import type { FhirApiClient, FhirSessionData } from '../../hono/middleware/fhir-auth'
import type { Bundle, OperationOutcome } from '../../v4.0.1'
import type { ToolCallResult } from './types'

export type McpFhirToolCallContext = {
	audit: Audit
	fhirClient?: FhirApiClient | null
	fhirSessionData?: FhirSessionData | null
}

const defaultPrincipalId = 'anonymous'
const defaultRoles = ['anonymous']
const defaultOrganization = 'anonymous'

// -- FHIR Resource Tools

// TODO - Concurrency: Implement mechanisms to handle concurrent requests to avoid double-booking a Slot, for example. This might involve checking the Slot status immediately before updating or using optimistic locking if the MCP server supports it (e.g., If-Match headers).
// TODO - fhirResourcePatchTool: To apply partial updates to a resource (use when only specific fields need changing, to minimize data transfer).

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
	execute: async ({ context, runtimeContext }): Promise<ToolCallResult> => {
		const cerbos = runtimeContext.get('cerbos') as Cerbos
		const audit = runtimeContext.get('audit') as Audit
		const fhirSessionData = runtimeContext.get('fhirSessionData') as FhirSessionData
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'fhirResourceRead'
		const resourceType = context.resourceType
		const resourceId = context.id
		const principalId = fhirSessionData.userId || defaultPrincipalId
		const roles = fhirSessionData.roles || defaultRoles
		const principal = { id: principalId, roles: roles, attributes: {} }
		const organizationId = fhirSessionData.activeOrganizationId || defaultOrganization
		const cerbosResource = { kind: resourceType, id: resourceId, attributes: {} }
		const cerbosAction = 'read'

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
			const { data, error, response } = await fhirClient.GET(`/${resourceType}/{id}`, {
				params: { path: { id: context.id } },
			})
			if (error) {
				const rText = await response.text()
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
					},
				})
				console.error(
					`FHIR ${resourceType} read error (ID: ${context.id}): Status ${response.status}`,
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
				outcomeDescription: `Successfully read ${resourceType} resource.`,
			})
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(data, null, 2),
					},
				],
			}
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
			return createTextResponse(`FHIR ${resourceType} read failed`, { isError: true })
		}
	},
})

// TODO - Simplified audit logging for other tools for brevity in this example.
// TODO - In a real implementation, each tool would have detailed logging similar to ReadTool.

export const fhirResourceSearchTool = createTool({
	id: 'fhirResourceSearch',
	description: 'Searches for on FHIR resources.',
	inputSchema: z.object({
		resourceType: z
			.string()
			.describe('Resource type, ex: Patient, Practitioner, Organization, etc'),
		params: z.unknown().describe('The fhir resource search parameters'),
	}),
	execute: async ({ context, runtimeContext }): Promise<ToolCallResult> => {
		const cerbos = runtimeContext.get('cerbos') as Cerbos
		const audit = runtimeContext.get('audit') as Audit
		const fhirSessionData = runtimeContext.get('fhirSessionData') as FhirSessionData
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'fhirResourceSearch'
		const resourceType = context.resourceType
		const principalId = fhirSessionData.userId || defaultPrincipalId
		const roles = fhirSessionData.roles || defaultRoles
		const organizationId = fhirSessionData.activeOrganizationId || defaultOrganization

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
			const { data, error, response } = await fhirClient.GET(`/${resourceType}`, {
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
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(data as Bundle<unknown>, null, 2),
					},
				],
			}
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

export const fhirResourceCreateTool = createTool({
	id: 'fhirResourceCreate',
	description: 'Creates a new FHIR resource.',
	inputSchema: z.object({
		resourceType: z
			.string()
			.describe('Resource type, ex: Patient, Practitioner, Organization, etc'),
		resource: z.unknown().describe('The FHIR resource'),
	}),
	execute: async ({ context, runtimeContext }): Promise<ToolCallResult> => {
		const cerbos = runtimeContext.get('cerbos') as Cerbos
		const audit = runtimeContext.get('audit') as Audit
		const fhirSessionData = runtimeContext.get('fhirSessionData') as FhirSessionData
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'fhirResourceCreate'
		const resourceType = context.resourceType
		const principalId = fhirSessionData.userId || defaultPrincipalId
		const roles = fhirSessionData.roles || defaultRoles
		const organizationId = fhirSessionData.activeOrganizationId || defaultOrganization

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
			const { data, error, response } = await fhirClient.POST(`/${resourceType}`, {
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
				targetResourceId: data.id,
				status: 'success',
			})
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(data, null, 2),
					},
				],
			}
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
	execute: async ({ context, runtimeContext }): Promise<ToolCallResult> => {
		const cerbos = runtimeContext.get('cerbos') as Cerbos
		const audit = runtimeContext.get('audit') as Audit
		const fhirSessionData = runtimeContext.get('fhirSessionData') as FhirSessionData
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'fhirResourceUpdate'
		const resourceType = context.resourceType
		const resourceId = context.id
		const principalId = fhirSessionData.userId || defaultPrincipalId
		const organizationId = fhirSessionData.activeOrganizationId || defaultOrganization
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
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(data, null, 2),
					},
				],
			}
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

export const fhirResourceValidateTool = createTool({
	id: 'fhirResourceValidateTool',
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
	execute: async ({ context, runtimeContext }): Promise<ToolCallResult> => {
		const cerbos = runtimeContext.get('cerbos') as Cerbos
		const audit = runtimeContext.get('audit') as Audit
		const fhirSessionData = runtimeContext.get('fhirSessionData') as FhirSessionData
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'fhirResourceValidateTool'
		const resourceType = context.resourceType
		const resourceId = context.id || 'validate'
		const principalId = fhirSessionData.userId || defaultPrincipalId
		const organizationId = fhirSessionData.activeOrganizationId || defaultOrganization
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
			const { data, error, response } = await fhirClient.POST(`/${resourceType}/$validate`, {
				body: context.resource,
			})
			if (error) {
				const rText = await response.text()
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
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(data, null, 2),
					},
				],
			}
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

export const fhirResourceDeleteTool = createTool({
	id: 'fhirResourceDelete',
	description: 'Deletes a FHIR resource by ID.',
	inputSchema: z.object({
		resourceType: z
			.string()
			.describe('Resource type, ex: Patient, Practitioner, Organization, etc'),
		id: z.string().describe('Resource id'),
	}),
	execute: async ({ context, runtimeContext }): Promise<ToolCallResult> => {
		const cerbos = runtimeContext.get('cerbos') as Cerbos
		const audit = runtimeContext.get('audit') as Audit
		const fhirSessionData = runtimeContext.get('fhirSessionData') as FhirSessionData
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'fhirResourceDelete'
		const resourceType = context.resourceType
		const resourceId = context.id
		const principalId = fhirSessionData.userId || defaultPrincipalId
		const organizationId = fhirSessionData.activeOrganizationId || defaultOrganization
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
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(data, null, 2),
					},
				],
			}
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

export const fhirPatientReportSearchTool = createTool({
	id: 'fhirPatientReportSearch',
	description: 'Search patient clinical data in JSON format.',
	inputSchema: z.object({
		id: z.string().describe('Patient id'),
	}),
	execute: async ({ context, runtimeContext }): Promise<ToolCallResult> => {
		const cerbos = runtimeContext.get('cerbos') as Cerbos
		const audit = runtimeContext.get('audit') as Audit
		const fhirSessionData = runtimeContext.get('fhirSessionData') as FhirSessionData
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'fhirPatientReportSearch'
		const resourceType = 'FhirPatientReport'
		const resourceId = context.id
		const principalId = fhirSessionData.userId || defaultPrincipalId
		const organizationId = fhirSessionData.activeOrganizationId || defaultOrganization
		const roles = fhirSessionData.roles || defaultRoles
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
					const { data, error, response } = await fhirClient.GET(`/${query.resourceType}`, {
						params: { query: query.params },
					})
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

		return {
			content: [
				{
					type: 'text',
					text: JSON.stringify(result, null, 2),
				},
			],
		}
	},
})

export const fhirResourceTools = [
	fhirResourceReadTool,
	fhirResourceSearchTool,
	fhirResourceValidateTool,
	fhirResourceCreateTool,
	fhirResourceUpdateTool,
	fhirResourceDeleteTool,
	fhirPatientReportSearchTool,
]

export const allFhirTools = [...fhirResourceTools]
