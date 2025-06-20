import { logAuditEvent } from '../../lib/audit' // Import audit logger
import { cerbos } from '../../lib/cerbos'

import type {
	Bundle,
	OperationOutcome,
	Organization,
	Patient,
	Practitioner,
} from '@solarahealth/fhir-r4'
import type { FhirApiClient, FhirSessionData } from '../../lib/hono/middleware/fhir-auth'

export interface McpFhirToolCallContext {
	fhirClient?: FhirApiClient | null
	fhirSessionData?: FhirSessionData | null
}

const defaultPrincipalId = 'anonymous'
const defaultRoles = ['anonymous']

// --- Patient Tools ---
export const patientReadTool = {
	name: 'fhirPatientRead',
	description: 'Reads a Patient FHIR resource by ID.',
	inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] },
	async handler(params: { id: string }, context?: McpFhirToolCallContext): Promise<Patient> {
		const toolName = 'fhirPatientRead'
		const resourceType = 'Patient'
		const resourceId = params.id
		const principalId = context?.fhirSessionData?.userId || defaultPrincipalId
		const roles = context?.fhirSessionData?.roles || defaultRoles
		const principal = { id: principalId, roles }
		const cerbosResource = { kind: resourceType, id: resourceId, attributes: {} }
		const cerbosAction = 'read'

		logAuditEvent({
			principalId,
			action: `${toolName}Attempt`,
			targetResourceType: resourceType,
			targetResourceId: resourceId,
			status: 'attempt',
		})

		if (!context?.fhirClient) {
			logAuditEvent({
				principalId,
				action: toolName,
				targetResourceType: resourceType,
				targetResourceId: resourceId,
				status: 'failure',
				outcomeDescription: 'FHIR client not available.',
			})
			throw new Error('FHIR client not available.')
		}

		const allowed = await cerbos.isAllowed({
			principal,
			resource: cerbosResource,
			action: cerbosAction,
		})
		if (!allowed) {
			const outcomeDescription = `Forbidden: User ${principalId} with roles [${roles.join(', ')}] not authorized to perform '${cerbosAction}' on ${cerbosResource.kind}/${cerbosResource.id}.`
			logAuditEvent({
				principalId,
				action: `cerbos:${cerbosAction}`,
				targetResourceType: resourceType,
				targetResourceId: resourceId,
				status: 'failure',
				outcomeDescription,
			})
			throw new Error(outcomeDescription)
		}
		logAuditEvent({
			principalId,
			action: `cerbos:${cerbosAction}`,
			targetResourceType: resourceType,
			targetResourceId: resourceId,
			status: 'success',
			outcomeDescription: 'Authorization granted by Cerbos.',
		})

		try {
			const { data, error, response } = await context.fhirClient.GET('/Patient/{id}', {
				params: { path: { id: params.id } },
			})
			if (error) {
				const outcomeDescription = `FHIR Patient read failed: Status ${response.status}`
				logAuditEvent({
					principalId,
					action: toolName,
					targetResourceType: resourceType,
					targetResourceId: resourceId,
					status: 'failure',
					outcomeDescription,
					responseStatus: response.status,
					responseBody: await response.text(),
				})
				console.error(
					`FHIR Patient read error (ID: ${params.id}): Status ${response.status}`,
					await response.text()
				)
				throw new Error(outcomeDescription)
			}
			logAuditEvent({
				principalId,
				action: toolName,
				targetResourceType: resourceType,
				targetResourceId: resourceId,
				status: 'success',
				outcomeDescription: 'Successfully read Patient resource.',
			})
			return data as Patient
		} catch (e: any) {
			logAuditEvent({
				principalId,
				action: toolName,
				targetResourceType: resourceType,
				targetResourceId: resourceId,
				status: 'failure',
				outcomeDescription: e.message,
			})
			throw e
		}
	},
}

// Simplified audit logging for other tools for brevity in this example.
// In a real implementation, each tool would have detailed logging similar to patientReadTool.

export const patientSearchTool = {
	name: 'fhirPatientSearch',
	description: 'Searches for Patient FHIR resources.',
	inputSchema: { type: 'object', properties: {} },
	async handler(
		params: Record<string, any>,
		context?: McpFhirToolCallContext
	): Promise<Bundle<Patient>> {
		const toolName = 'fhirPatientSearch'
		const resourceType = 'Patient'
		const principalId = context?.fhirSessionData?.userId || defaultPrincipalId
		const roles = context?.fhirSessionData?.roles || defaultRoles
		logAuditEvent({
			principalId,
			action: `${toolName}Attempt`,
			targetResourceType: resourceType,
			status: 'attempt',
			searchParams: params,
		})
		if (!context?.fhirClient) {
			logAuditEvent({
				principalId,
				action: toolName,
				targetResourceType: resourceType,
				status: 'failure',
				outcomeDescription: 'FHIR client not available.',
			})
			throw new Error('FHIR client not available.')
		}
		const principal = { id: principalId, roles }
		const cerbosResource = { kind: resourceType, attributes: params }
		const cerbosAction = 'search'
		const allowed = await cerbos.isAllowed({
			principal,
			resource: cerbosResource,
			action: cerbosAction,
		})
		if (!allowed) {
			const desc = `Forbidden to ${cerbosAction} ${resourceType}`
			logAuditEvent({
				principalId,
				action: `cerbos:${cerbosAction}`,
				targetResourceType: resourceType,
				status: 'failure',
				outcomeDescription: desc,
			})
			throw new Error(desc)
		}
		logAuditEvent({
			principalId,
			action: `cerbos:${cerbosAction}`,
			targetResourceType: resourceType,
			status: 'success',
		})
		try {
			const { data, error, response } = await context.fhirClient.GET('/Patient', {
				params: { query: params },
			})
			if (error) {
				const desc = `FHIR Patient search failed: Status ${response.status}`
				logAuditEvent({
					principalId,
					action: toolName,
					targetResourceType: resourceType,
					status: 'failure',
					outcomeDescription: desc,
					responseStatus: response.status,
				})
				throw new Error(desc)
			}
			logAuditEvent({
				principalId,
				action: toolName,
				targetResourceType: resourceType,
				status: 'success',
			})
			return data as Bundle<Patient>
		} catch (e: any) {
			logAuditEvent({
				principalId,
				action: toolName,
				targetResourceType: resourceType,
				status: 'failure',
				outcomeDescription: e.message,
			})
			throw e
		}
	},
}

export const patientCreateTool = {
	name: 'fhirPatientCreate',
	description: 'Creates a new Patient FHIR resource.',
	inputSchema: {
		type: 'object',
		properties: { resource: { type: 'object' } },
		required: ['resource'],
	},
	async handler(params: { resource: Patient }, context?: McpFhirToolCallContext): Promise<Patient> {
		const toolName = 'fhirPatientCreate'
		const resourceType = 'Patient'
		const principalId = context?.fhirSessionData?.userId || defaultPrincipalId
		const roles = context?.fhirSessionData?.roles || defaultRoles
		logAuditEvent({
			principalId,
			action: `${toolName}Attempt`,
			targetResourceType: resourceType,
			status: 'attempt',
		})
		if (!context?.fhirClient) {
			logAuditEvent({
				principalId,
				action: toolName,
				targetResourceType: resourceType,
				status: 'failure',
				outcomeDescription: 'FHIR client not available.',
			})
			throw new Error('FHIR client not available.')
		}
		const principal = { id: principalId, roles }
		const cerbosResource = { kind: resourceType, attributes: params.resource }
		const cerbosAction = 'create'
		const allowed = await cerbos.isAllowed({
			principal,
			resource: cerbosResource,
			action: cerbosAction,
		})
		if (!allowed) {
			const desc = `Forbidden to ${cerbosAction} ${resourceType}`
			logAuditEvent({
				principalId,
				action: `cerbos:${cerbosAction}`,
				targetResourceType: resourceType,
				status: 'failure',
				outcomeDescription: desc,
			})
			throw new Error(desc)
		}
		logAuditEvent({
			principalId,
			action: `cerbos:${cerbosAction}`,
			targetResourceType: resourceType,
			status: 'success',
		})
		try {
			const { data, error, response } = await context.fhirClient.POST('/Patient', {
				body: params.resource,
			})
			if (error) {
				const rText = await response.text()
				const desc = `FHIR Patient create failed: Status ${response.status}`
				logAuditEvent({
					principalId,
					action: toolName,
					targetResourceType: resourceType,
					status: 'failure',
					outcomeDescription: desc,
					responseStatus: response.status,
					responseBody: rText,
				})
				try {
					const o = JSON.parse(rText) as OperationOutcome
					if (o?.issue?.length > 0) throw new Error(o.issue[0].diagnostics)
				} catch (e) {}
				throw new Error(desc)
			}
			logAuditEvent({
				principalId,
				action: toolName,
				targetResourceType: resourceType,
				targetResourceId: data.id,
				status: 'success',
			})
			return data as Patient
		} catch (e: any) {
			logAuditEvent({
				principalId,
				action: toolName,
				targetResourceType: resourceType,
				status: 'failure',
				outcomeDescription: e.message,
			})
			throw e
		}
	},
}

export const patientUpdateTool = {
	name: 'fhirPatientUpdate',
	description: 'Updates an existing Patient FHIR resource.',
	inputSchema: {
		type: 'object',
		properties: { id: { type: 'string' }, resource: { type: 'object' } },
		required: ['id', 'resource'],
	},
	async handler(
		params: { id: string; resource: Patient },
		context?: McpFhirToolCallContext
	): Promise<Patient> {
		const toolName = 'fhirPatientUpdate'
		const resourceType = 'Patient'
		const resourceId = params.id
		const principalId = context?.fhirSessionData?.userId || defaultPrincipalId
		const roles = context?.fhirSessionData?.roles || defaultRoles
		logAuditEvent({
			principalId,
			action: `${toolName}Attempt`,
			targetResourceType: resourceType,
			targetResourceId: resourceId,
			status: 'attempt',
		})
		if (!context?.fhirClient) {
			logAuditEvent({
				principalId,
				action: toolName,
				targetResourceType: resourceType,
				targetResourceId: resourceId,
				status: 'failure',
				outcomeDescription: 'FHIR client not available.',
			})
			throw new Error('FHIR client not available.')
		}
		const principal = { id: principalId, roles }
		const cerbosResource = { kind: resourceType, id: resourceId, attributes: params.resource }
		const cerbosAction = 'update'
		const allowed = await cerbos.isAllowed({
			principal,
			resource: cerbosResource,
			action: cerbosAction,
		})
		if (!allowed) {
			const desc = `Forbidden to ${cerbosAction} ${resourceType}/${resourceId}`
			logAuditEvent({
				principalId,
				action: `cerbos:${cerbosAction}`,
				targetResourceType: resourceType,
				targetResourceId: resourceId,
				status: 'failure',
				outcomeDescription: desc,
			})
			throw new Error(desc)
		}
		logAuditEvent({
			principalId,
			action: `cerbos:${cerbosAction}`,
			targetResourceType: resourceType,
			targetResourceId: resourceId,
			status: 'success',
		})
		try {
			const { data, error, response } = await context.fhirClient.PUT('/Patient/{id}', {
				params: { path: { id: params.id } },
				body: params.resource,
			})
			if (error) {
				const rText = await response.text()
				const desc = `FHIR Patient update failed: Status ${response.status}`
				logAuditEvent({
					principalId,
					action: toolName,
					targetResourceType: resourceType,
					targetResourceId: resourceId,
					status: 'failure',
					outcomeDescription: desc,
					responseStatus: response.status,
					responseBody: rText,
				})
				try {
					const o = JSON.parse(rText) as OperationOutcome
					if (o?.issue?.length > 0) throw new Error(o.issue[0].diagnostics)
				} catch (e) {}
				throw new Error(desc)
			}
			logAuditEvent({
				principalId,
				action: toolName,
				targetResourceType: resourceType,
				targetResourceId: resourceId,
				status: 'success',
			})
			return data as Patient
		} catch (e: any) {
			logAuditEvent({
				principalId,
				action: toolName,
				targetResourceType: resourceType,
				targetResourceId: resourceId,
				status: 'failure',
				outcomeDescription: e.message,
			})
			throw e
		}
	},
}

// --- Practitioner Tools (Apply similar detailed audit logging) ---
export const practitionerReadTool = {
	name: 'fhirPractitionerRead',
	description: 'Reads a Practitioner FHIR resource by ID.',
	inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] },
	async handler(params: { id: string }, context?: McpFhirToolCallContext): Promise<Practitioner> {
		const toolName = 'fhirPractitionerRead'
		const resourceType = 'Practitioner'
		const resourceId = params.id
		const principalId = context?.fhirSessionData?.userId || defaultPrincipalId
		const roles = context?.fhirSessionData?.roles || defaultRoles
		logAuditEvent({
			principalId,
			action: `${toolName}Attempt`,
			targetResourceType: resourceType,
			targetResourceId: resourceId,
			status: 'attempt',
		})
		if (!context?.fhirClient) {
			logAuditEvent({
				principalId,
				action: toolName,
				status: 'failure',
				outcomeDescription: 'FHIR client not available.',
			})
			throw new Error('FHIR client not available.')
		}
		const principal = { id: principalId, roles }
		const cerbosResource = { kind: resourceType, id: resourceId }
		const cerbosAction = 'read'
		const allowed = await cerbos.isAllowed({
			principal,
			resource: cerbosResource,
			action: cerbosAction,
		})
		if (!allowed) {
			const desc = `Forbidden to ${cerbosAction} ${resourceType}/${resourceId}`
			logAuditEvent({
				principalId,
				action: `cerbos:${cerbosAction}`,
				targetResourceType: resourceType,
				targetResourceId: resourceId,
				status: 'failure',
				outcomeDescription: desc,
			})
			throw new Error(desc)
		}
		logAuditEvent({
			principalId,
			action: `cerbos:${cerbosAction}`,
			targetResourceType: resourceType,
			targetResourceId: resourceId,
			status: 'success',
		})
		try {
			const { data, error, response } = await context.fhirClient.GET('/Practitioner/{id}', {
				params: { path: { id: params.id } },
			})
			if (error) {
				const desc = `FHIR error: Status ${response.status}`
				logAuditEvent({
					principalId,
					action: toolName,
					status: 'failure',
					outcomeDescription: desc,
					responseStatus: response.status,
				})
				throw new Error(desc)
			}
			logAuditEvent({ principalId, action: toolName, status: 'success' })
			return data as Practitioner
		} catch (e: any) {
			logAuditEvent({
				principalId,
				action: toolName,
				status: 'failure',
				outcomeDescription: e.message,
			})
			throw e
		}
	},
}

export const practitionerSearchTool = {
	name: 'fhirPractitionerSearch',
	description: 'Searches for Practitioner FHIR resources.',
	inputSchema: { type: 'object', properties: {} },
	async handler(
		params: Record<string, any>,
		context?: McpFhirToolCallContext
	): Promise<Bundle<Practitioner>> {
		const toolName = 'fhirPractitionerSearch'
		const resourceType = 'Practitioner'
		const principalId = context?.fhirSessionData?.userId || defaultPrincipalId
		const roles = context?.fhirSessionData?.roles || defaultRoles
		logAuditEvent({
			principalId,
			action: `${toolName}Attempt`,
			targetResourceType: resourceType,
			status: 'attempt',
			searchParams: params,
		})
		if (!context?.fhirClient) {
			logAuditEvent({
				principalId,
				action: toolName,
				status: 'failure',
				outcomeDescription: 'FHIR client not available.',
			})
			throw new Error('FHIR client not available.')
		}
		const principal = { id: principalId, roles }
		const cerbosResource = { kind: resourceType, attributes: params }
		const cerbosAction = 'search'
		const allowed = await cerbos.isAllowed({
			principal,
			resource: cerbosResource,
			action: cerbosAction,
		})
		if (!allowed) {
			const desc = `Forbidden to ${cerbosAction} ${resourceType}`
			logAuditEvent({
				principalId,
				action: `cerbos:${cerbosAction}`,
				targetResourceType: resourceType,
				status: 'failure',
				outcomeDescription: desc,
			})
			throw new Error(desc)
		}
		logAuditEvent({
			principalId,
			action: `cerbos:${cerbosAction}`,
			targetResourceType: resourceType,
			status: 'success',
		})
		try {
			const { data, error, response } = await context.fhirClient.GET('/Practitioner', {
				params: { query: params },
			})
			if (error) {
				const desc = `FHIR error: Status ${response.status}`
				logAuditEvent({
					principalId,
					action: toolName,
					status: 'failure',
					outcomeDescription: desc,
					responseStatus: response.status,
				})
				throw new Error(desc)
			}
			logAuditEvent({ principalId, action: toolName, status: 'success' })
			return data as Bundle<Practitioner>
		} catch (e: any) {
			logAuditEvent({
				principalId,
				action: toolName,
				status: 'failure',
				outcomeDescription: e.message,
			})
			throw e
		}
	},
}

export const practitionerCreateTool = {
	name: 'fhirPractitionerCreate',
	description: 'Creates a new Practitioner FHIR resource.',
	inputSchema: {
		type: 'object',
		properties: { resource: { type: 'object' } },
		required: ['resource'],
	},
	async handler(
		params: { resource: Practitioner },
		context?: McpFhirToolCallContext
	): Promise<Practitioner> {
		const toolName = 'fhirPractitionerCreate'
		const resourceType = 'Practitioner'
		const principalId = context?.fhirSessionData?.userId || defaultPrincipalId
		const roles = context?.fhirSessionData?.roles || defaultRoles
		logAuditEvent({
			principalId,
			action: `${toolName}Attempt`,
			targetResourceType: resourceType,
			status: 'attempt',
		})
		if (!context?.fhirClient) {
			logAuditEvent({
				principalId,
				action: toolName,
				status: 'failure',
				outcomeDescription: 'FHIR client not available.',
			})
			throw new Error('FHIR client not available.')
		}
		const principal = { id: principalId, roles }
		const cerbosResource = { kind: resourceType, attributes: params.resource }
		const cerbosAction = 'create'
		const allowed = await cerbos.isAllowed({
			principal,
			resource: cerbosResource,
			action: cerbosAction,
		})
		if (!allowed) {
			const desc = `Forbidden to ${cerbosAction} ${resourceType}`
			logAuditEvent({
				principalId,
				action: `cerbos:${cerbosAction}`,
				targetResourceType: resourceType,
				status: 'failure',
				outcomeDescription: desc,
			})
			throw new Error(desc)
		}
		logAuditEvent({
			principalId,
			action: `cerbos:${cerbosAction}`,
			targetResourceType: resourceType,
			status: 'success',
		})
		try {
			const { data, error, response } = await context.fhirClient.POST('/Practitioner', {
				body: params.resource,
			})
			if (error) {
				const rText = await response.text()
				const desc = `FHIR error: Status ${response.status}`
				logAuditEvent({
					principalId,
					action: toolName,
					status: 'failure',
					outcomeDescription: desc,
					responseStatus: response.status,
					responseBody: rText,
				})
				try {
					const o = JSON.parse(rText) as OperationOutcome
					if (o?.issue?.length > 0) throw new Error(o.issue[0].diagnostics)
				} catch (e) {}
				throw new Error(desc)
			}
			logAuditEvent({ principalId, action: toolName, targetResourceId: data.id, status: 'success' })
			return data as Practitioner
		} catch (e: any) {
			logAuditEvent({
				principalId,
				action: toolName,
				status: 'failure',
				outcomeDescription: e.message,
			})
			throw e
		}
	},
}

export const practitionerUpdateTool = {
	name: 'fhirPractitionerUpdate',
	description: 'Updates an existing Practitioner FHIR resource.',
	inputSchema: {
		type: 'object',
		properties: { id: { type: 'string' }, resource: { type: 'object' } },
		required: ['id', 'resource'],
	},
	async handler(
		params: { id: string; resource: Practitioner },
		context?: McpFhirToolCallContext
	): Promise<Practitioner> {
		const toolName = 'fhirPractitionerUpdate'
		const resourceType = 'Practitioner'
		const resourceId = params.id
		const principalId = context?.fhirSessionData?.userId || defaultPrincipalId
		const roles = context?.fhirSessionData?.roles || defaultRoles
		logAuditEvent({
			principalId,
			action: `${toolName}Attempt`,
			targetResourceType: resourceType,
			targetResourceId: resourceId,
			status: 'attempt',
		})
		if (!context?.fhirClient) {
			logAuditEvent({
				principalId,
				action: toolName,
				status: 'failure',
				outcomeDescription: 'FHIR client not available.',
			})
			throw new Error('FHIR client not available.')
		}
		const principal = { id: principalId, roles }
		const cerbosResource = { kind: resourceType, id: resourceId, attributes: params.resource }
		const cerbosAction = 'update'
		const allowed = await cerbos.isAllowed({
			principal,
			resource: cerbosResource,
			action: cerbosAction,
		})
		if (!allowed) {
			const desc = `Forbidden to ${cerbosAction} ${resourceType}/${resourceId}`
			logAuditEvent({
				principalId,
				action: `cerbos:${cerbosAction}`,
				targetResourceType: resourceType,
				targetResourceId: resourceId,
				status: 'failure',
				outcomeDescription: desc,
			})
			throw new Error(desc)
		}
		logAuditEvent({
			principalId,
			action: `cerbos:${cerbosAction}`,
			targetResourceType: resourceType,
			targetResourceId: resourceId,
			status: 'success',
		})
		try {
			const { data, error, response } = await context.fhirClient.PUT('/Practitioner/{id}', {
				params: { path: { id: params.id } },
				body: params.resource,
			})
			if (error) {
				const rText = await response.text()
				const desc = `FHIR error: Status ${response.status}`
				logAuditEvent({
					principalId,
					action: toolName,
					status: 'failure',
					outcomeDescription: desc,
					responseStatus: response.status,
					responseBody: rText,
				})
				try {
					const o = JSON.parse(rText) as OperationOutcome
					if (o?.issue?.length > 0) throw new Error(o.issue[0].diagnostics)
				} catch (e) {}
				throw new Error(desc)
			}
			logAuditEvent({ principalId, action: toolName, status: 'success' })
			return data as Practitioner
		} catch (e: any) {
			logAuditEvent({
				principalId,
				action: toolName,
				status: 'failure',
				outcomeDescription: e.message,
			})
			throw e
		}
	},
}

// --- Organization Tools (Apply similar detailed audit logging) ---
export const organizationReadTool = {
	name: 'fhirOrganizationRead',
	description: 'Reads an Organization FHIR resource by ID.',
	inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] },
	async handler(params: { id: string }, context?: McpFhirToolCallContext): Promise<Organization> {
		const toolName = 'fhirOrganizationRead'
		const resourceType = 'Organization'
		const resourceId = params.id
		const principalId = context?.fhirSessionData?.userId || defaultPrincipalId
		const roles = context?.fhirSessionData?.roles || defaultRoles
		logAuditEvent({
			principalId,
			action: `${toolName}Attempt`,
			targetResourceType: resourceType,
			targetResourceId: resourceId,
			status: 'attempt',
		})
		if (!context?.fhirClient) {
			logAuditEvent({
				principalId,
				action: toolName,
				status: 'failure',
				outcomeDescription: 'FHIR client not available.',
			})
			throw new Error('FHIR client not available.')
		}
		const principal = { id: principalId, roles }
		const cerbosResource = { kind: resourceType, id: resourceId }
		const cerbosAction = 'read'
		const allowed = await cerbos.isAllowed({
			principal,
			resource: cerbosResource,
			action: cerbosAction,
		})
		if (!allowed) {
			const desc = `Forbidden to ${cerbosAction} ${resourceType}/${resourceId}`
			logAuditEvent({
				principalId,
				action: `cerbos:${cerbosAction}`,
				targetResourceType: resourceType,
				targetResourceId: resourceId,
				status: 'failure',
				outcomeDescription: desc,
			})
			throw new Error(desc)
		}
		logAuditEvent({
			principalId,
			action: `cerbos:${cerbosAction}`,
			targetResourceType: resourceType,
			targetResourceId: resourceId,
			status: 'success',
		})
		try {
			const { data, error, response } = await context.fhirClient.GET('/Organization/{id}', {
				params: { path: { id: params.id } },
			})
			if (error) {
				const desc = `FHIR error: Status ${response.status}`
				logAuditEvent({
					principalId,
					action: toolName,
					status: 'failure',
					outcomeDescription: desc,
					responseStatus: response.status,
				})
				throw new Error(desc)
			}
			logAuditEvent({ principalId, action: toolName, status: 'success' })
			return data as Organization
		} catch (e: any) {
			logAuditEvent({
				principalId,
				action: toolName,
				status: 'failure',
				outcomeDescription: e.message,
			})
			throw e
		}
	},
}

export const organizationSearchTool = {
	name: 'fhirOrganizationSearch',
	description: 'Searches for Organization FHIR resources.',
	inputSchema: { type: 'object', properties: {} },
	async handler(
		params: Record<string, any>,
		context?: McpFhirToolCallContext
	): Promise<Bundle<Organization>> {
		const toolName = 'fhirOrganizationSearch'
		const resourceType = 'Organization'
		const principalId = context?.fhirSessionData?.userId || defaultPrincipalId
		const roles = context?.fhirSessionData?.roles || defaultRoles
		logAuditEvent({
			principalId,
			action: `${toolName}Attempt`,
			targetResourceType: resourceType,
			status: 'attempt',
			searchParams: params,
		})
		if (!context?.fhirClient) {
			logAuditEvent({
				principalId,
				action: toolName,
				status: 'failure',
				outcomeDescription: 'FHIR client not available.',
			})
			throw new Error('FHIR client not available.')
		}
		const principal = { id: principalId, roles }
		const cerbosResource = { kind: resourceType, attributes: params }
		const cerbosAction = 'search'
		const allowed = await cerbos.isAllowed({
			principal,
			resource: cerbosResource,
			action: cerbosAction,
		})
		if (!allowed) {
			const desc = `Forbidden to ${cerbosAction} ${resourceType}`
			logAuditEvent({
				principalId,
				action: `cerbos:${cerbosAction}`,
				targetResourceType: resourceType,
				status: 'failure',
				outcomeDescription: desc,
			})
			throw new Error(desc)
		}
		logAuditEvent({
			principalId,
			action: `cerbos:${cerbosAction}`,
			targetResourceType: resourceType,
			status: 'success',
		})
		try {
			const { data, error, response } = await context.fhirClient.GET('/Organization', {
				params: { query: params },
			})
			if (error) {
				const desc = `FHIR error: Status ${response.status}`
				logAuditEvent({
					principalId,
					action: toolName,
					status: 'failure',
					outcomeDescription: desc,
					responseStatus: response.status,
				})
				throw new Error(desc)
			}
			logAuditEvent({ principalId, action: toolName, status: 'success' })
			return data as Bundle<Organization>
		} catch (e: any) {
			logAuditEvent({
				principalId,
				action: toolName,
				status: 'failure',
				outcomeDescription: e.message,
			})
			throw e
		}
	},
}

export const organizationCreateTool = {
	name: 'fhirOrganizationCreate',
	description: 'Creates a new Organization FHIR resource.',
	inputSchema: {
		type: 'object',
		properties: { resource: { type: 'object' } },
		required: ['resource'],
	},
	async handler(
		params: { resource: Organization },
		context?: McpFhirToolCallContext
	): Promise<Organization> {
		const toolName = 'fhirOrganizationCreate'
		const resourceType = 'Organization'
		const principalId = context?.fhirSessionData?.userId || defaultPrincipalId
		const roles = context?.fhirSessionData?.roles || defaultRoles
		logAuditEvent({
			principalId,
			action: `${toolName}Attempt`,
			targetResourceType: resourceType,
			status: 'attempt',
		})
		if (!context?.fhirClient) {
			logAuditEvent({
				principalId,
				action: toolName,
				status: 'failure',
				outcomeDescription: 'FHIR client not available.',
			})
			throw new Error('FHIR client not available.')
		}
		const principal = { id: principalId, roles }
		const cerbosResource = { kind: resourceType, attributes: params.resource }
		const cerbosAction = 'create'
		const allowed = await cerbos.isAllowed({
			principal,
			resource: cerbosResource,
			action: cerbosAction,
		})
		if (!allowed) {
			const desc = `Forbidden to ${cerbosAction} ${resourceType}`
			logAuditEvent({
				principalId,
				action: `cerbos:${cerbosAction}`,
				targetResourceType: resourceType,
				status: 'failure',
				outcomeDescription: desc,
			})
			throw new Error(desc)
		}
		logAuditEvent({
			principalId,
			action: `cerbos:${cerbosAction}`,
			targetResourceType: resourceType,
			status: 'success',
		})
		try {
			const { data, error, response } = await context.fhirClient.POST('/Organization', {
				body: params.resource,
			})
			if (error) {
				const rText = await response.text()
				const desc = `FHIR error: Status ${response.status}`
				logAuditEvent({
					principalId,
					action: toolName,
					status: 'failure',
					outcomeDescription: desc,
					responseStatus: response.status,
					responseBody: rText,
				})
				try {
					const o = JSON.parse(rText) as OperationOutcome
					if (o?.issue?.length > 0) throw new Error(o.issue[0].diagnostics)
				} catch (e) {}
				throw new Error(desc)
			}
			logAuditEvent({ principalId, action: toolName, targetResourceId: data.id, status: 'success' })
			return data as Organization
		} catch (e: any) {
			logAuditEvent({
				principalId,
				action: toolName,
				status: 'failure',
				outcomeDescription: e.message,
			})
			throw e
		}
	},
}

export const organizationUpdateTool = {
	name: 'fhirOrganizationUpdate',
	description: 'Updates an existing Organization FHIR resource.',
	inputSchema: {
		type: 'object',
		properties: { id: { type: 'string' }, resource: { type: 'object' } },
		required: ['id', 'resource'],
	},
	async handler(
		params: { id: string; resource: Organization },
		context?: McpFhirToolCallContext
	): Promise<Organization> {
		const toolName = 'fhirOrganizationUpdate'
		const resourceType = 'Organization'
		const resourceId = params.id
		const principalId = context?.fhirSessionData?.userId || defaultPrincipalId
		const roles = context?.fhirSessionData?.roles || defaultRoles
		logAuditEvent({
			principalId,
			action: `${toolName}Attempt`,
			targetResourceType: resourceType,
			targetResourceId: resourceId,
			status: 'attempt',
		})
		if (!context?.fhirClient) {
			logAuditEvent({
				principalId,
				action: toolName,
				status: 'failure',
				outcomeDescription: 'FHIR client not available.',
			})
			throw new Error('FHIR client not available.')
		}
		const principal = { id: principalId, roles }
		const cerbosResource = { kind: resourceType, id: resourceId, attributes: params.resource }
		const cerbosAction = 'update'
		const allowed = await cerbos.isAllowed({
			principal,
			resource: cerbosResource,
			action: cerbosAction,
		})
		if (!allowed) {
			const desc = `Forbidden to ${cerbosAction} ${resourceType}/${resourceId}`
			logAuditEvent({
				principalId,
				action: `cerbos:${cerbosAction}`,
				targetResourceType: resourceType,
				targetResourceId: resourceId,
				status: 'failure',
				outcomeDescription: desc,
			})
			throw new Error(desc)
		}
		logAuditEvent({
			principalId,
			action: `cerbos:${cerbosAction}`,
			targetResourceType: resourceType,
			targetResourceId: resourceId,
			status: 'success',
		})
		try {
			const { data, error, response } = await context.fhirClient.PUT('/Organization/{id}', {
				params: { path: { id: params.id } },
				body: params.resource,
			})
			if (error) {
				const rText = await response.text()
				const desc = `FHIR error: Status ${response.status}`
				logAuditEvent({
					principalId,
					action: toolName,
					status: 'failure',
					outcomeDescription: desc,
					responseStatus: response.status,
					responseBody: rText,
				})
				try {
					const o = JSON.parse(rText) as OperationOutcome
					if (o?.issue?.length > 0) throw new Error(o.issue[0].diagnostics)
				} catch (e) {}
				throw new Error(desc)
			}
			logAuditEvent({ principalId, action: toolName, status: 'success' })
			return data as Organization
		} catch (e: any) {
			logAuditEvent({
				principalId,
				action: toolName,
				status: 'failure',
				outcomeDescription: e.message,
			})
			throw e
		}
	},
}

export const fhirPatientTools = [
	patientReadTool,
	patientSearchTool,
	patientCreateTool,
	patientUpdateTool,
]
export const fhirPractitionerTools = [
	practitionerReadTool,
	practitionerSearchTool,
	practitionerCreateTool,
	practitionerUpdateTool,
]
export const fhirOrganizationTools = [
	organizationReadTool,
	organizationSearchTool,
	organizationCreateTool,
	organizationUpdateTool,
]

export const allFhirTools = [
	...fhirPatientTools,
	...fhirPractitionerTools,
	...fhirOrganizationTools,
]
