import { createTool } from '@mastra/core'
import z from 'zod'

import { logAuditEvent } from '../../audit' // Import audit logger
import { cerbos } from '../../cerbos'
import { createPatientSchema, createPractitionerSchema } from '../../v4.0.1'

import type { Audit } from '@repo/audit'
import type { FhirApiClient, FhirSessionData } from '../../hono/middleware/fhir-auth'
import type { Bundle, OperationOutcome, Organization, Patient, Practitioner } from '../../v4.0.1'

export type McpFhirToolCallContext = {
	audit: Audit
	fhirClient?: FhirApiClient | null
	fhirSessionData?: FhirSessionData | null
}

const patientSchema = createPatientSchema()
const practitionerSchema = createPractitionerSchema()

const defaultPrincipalId = 'anonymous'
const defaultRoles = ['anonymous']

// -- FHIR Resource Tools

export const fhirResourceReadTool = createTool({
	id: 'fhirResourceRead',
	description: 'Reads a FHIR resource by ID.',
	inputSchema: z.object({
		resourceType: z
			.string()
			.describe('Resource type, ex: Patient, Practitioner, Organization, etc'),
		id: z.string().describe('Resource id'),
	}),
	execute: async ({ context, runtimeContext }): Promise<Patient> => {
		const audit = runtimeContext.get('audit') as Audit
		const fhirSessionData = runtimeContext.get('fhirSessionData') as FhirSessionData
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'fhirResourceRead'
		const resourceType = context.resourceType
		const resourceId = context.id
		const principalId = fhirSessionData.userId || defaultPrincipalId
		const roles = fhirSessionData.roles || defaultRoles
		const principal = { id: principalId, roles: roles, attributes: {} }
		const cerbosResource = { kind: resourceType, id: resourceId, attributes: {} }
		const cerbosAction = 'read'

		await audit.log({
			principalId,
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
			throw new Error('FHIR client not available.')
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
				action: `cerbos:${cerbosAction}`,
				targetResourceType: resourceType,
				targetResourceId: resourceId,
				status: 'failure',
				outcomeDescription,
			})
			throw new Error(outcomeDescription)
		}
		await audit.log({
			principalId,
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
				throw new Error(outcomeDescription)
			}
			await audit.log({
				principalId,
				action: toolName,
				targetResourceType: resourceType,
				targetResourceId: resourceId,
				status: 'success',
				outcomeDescription: `Successfully read ${resourceType} resource.`,
			})
			return data as Patient
		} catch (e: any) {
			await audit.log({
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
	execute: async ({ context, runtimeContext }): Promise<Bundle<Patient>> => {
		const audit = runtimeContext.get('audit') as Audit
		const fhirSessionData = runtimeContext.get('fhirSessionData') as FhirSessionData
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'fhirResourceSearch'
		const resourceType = context.resourceType
		const principalId = fhirSessionData.userId || defaultPrincipalId
		const roles = fhirSessionData.roles || defaultRoles
		await audit.log({
			principalId,
			action: `${toolName}Attempt`,
			targetResourceType: resourceType,
			status: 'attempt',
			searchParams: context.params,
		})
		if (!fhirClient) {
			await audit.log({
				principalId,
				action: toolName,
				targetResourceType: resourceType,
				status: 'failure',
				outcomeDescription: 'FHIR client not available.',
			})
			throw new Error('FHIR client not available.')
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
				action: `cerbos:${cerbosAction}`,
				targetResourceType: resourceType,
				status: 'failure',
				outcomeDescription: desc,
			})
			throw new Error(desc)
		}
		await audit.log({
			principalId,
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
					action: toolName,
					targetResourceType: resourceType,
					status: 'failure',
					outcomeDescription: desc,
					details: {
						responseStatus: response.status,
					},
				})
				throw new Error(desc)
			}
			await audit.log({
				principalId,
				action: toolName,
				targetResourceType: resourceType,
				status: 'success',
			})
			return data as Bundle<any>
		} catch (e: any) {
			await audit.log({
				principalId,
				action: toolName,
				targetResourceType: resourceType,
				status: 'failure',
				outcomeDescription: e.message,
			})
			throw e
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
	execute: async ({ context, runtimeContext }): Promise<unknown> => {
		const audit = runtimeContext.get('audit') as Audit
		const fhirSessionData = runtimeContext.get('fhirSessionData') as FhirSessionData
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'fhirResourceCreate'
		const resourceType = context.resourceType
		const principalId = fhirSessionData.userId || defaultPrincipalId
		const roles = fhirSessionData.roles || defaultRoles

		await audit.log({
			principalId,
			action: `${toolName}Attempt`,
			targetResourceType: resourceType,
			status: 'attempt',
		})

		if (!fhirClient) {
			await audit.log({
				principalId,
				action: toolName,
				targetResourceType: resourceType,
				status: 'failure',
				outcomeDescription: 'FHIR client not available.',
			})
			throw new Error('FHIR client not available.')
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
				action: `cerbos:${cerbosAction}`,
				targetResourceType: resourceType,
				status: 'failure',
				outcomeDescription: desc,
			})
			throw new Error(desc)
		}

		await audit.log({
			principalId,
			action: `cerbos:${cerbosAction}`,
			targetResourceType: resourceType,
			status: 'success',
			outcomeDescription: 'Authorization granted by Cerbos.',
		})

		const valid = patientSchema.safeParse(context.resource)
		if (!valid.success) {
			const desc = `${valid.error.message} to ${cerbosAction} ${resourceType}`
			await audit.log({
				principalId,
				action: `cerbos:${cerbosAction}`,
				targetResourceType: resourceType,
				status: 'failure',
				outcomeDescription: desc,
			})
			throw new Error(desc)
		}

		try {
			const { data, error, response } = await fhirClient.POST(`/${resourceType}`, {
				body: context.resource,
			})
			if (error) {
				const rText = await response.text()
				const desc = `FHIR ${resourceType} create failed: Status ${response.status}`
				await audit.log({
					principalId,
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
				throw new Error(desc)
			}
			await audit.log({
				principalId,
				action: toolName,
				targetResourceType: resourceType,
				targetResourceId: data.id,
				status: 'success',
			})
			return data as Patient
		} catch (e: any) {
			await audit.log({
				principalId,
				action: toolName,
				targetResourceType: resourceType,
				status: 'failure',
				outcomeDescription: e.message,
			})
			throw e
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
	execute: async ({ context, runtimeContext }): Promise<unknown> => {
		const audit = runtimeContext.get('audit') as Audit
		const fhirSessionData = runtimeContext.get('fhirSessionData') as FhirSessionData
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'fhirResourceUpdate'
		const resourceType = context.resourceType
		const resourceId = context.id
		const principalId = fhirSessionData.userId || defaultPrincipalId
		const roles = fhirSessionData.roles || defaultRoles

		await audit.log({
			principalId,
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
			throw new Error('FHIR client not available.')
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
				action: `cerbos:${cerbosAction}`,
				targetResourceType: resourceType,
				targetResourceId: resourceId,
				status: 'failure',
				outcomeDescription: desc,
			})
			throw new Error(desc)
		}
		await audit.log({
			principalId,
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
				throw new Error(desc)
			}
			await audit.log({
				principalId,
				action: toolName,
				targetResourceType: resourceType,
				targetResourceId: resourceId,
				status: 'success',
			})
			return data
		} catch (e: any) {
			await audit.log({
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
	execute: async ({ context, runtimeContext }): Promise<unknown> => {
		const audit = runtimeContext.get('audit') as Audit
		const fhirSessionData = runtimeContext.get('fhirSessionData') as FhirSessionData
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'fhirResourceDelete'
		const resourceType = context.resourceType
		const resourceId = context.id
		const principalId = fhirSessionData.userId || defaultPrincipalId
		const roles = fhirSessionData.roles || defaultRoles
		const principal = { id: principalId, roles: roles, attributes: {} }
		const cerbosResource = { kind: resourceType, id: resourceId, attributes: {} }
		const cerbosAction = 'delete'

		await audit.log({
			principalId,
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
			throw new Error('FHIR client not available.')
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
				action: `cerbos:${cerbosAction}`,
				targetResourceType: resourceType,
				targetResourceId: resourceId,
				status: 'failure',
				outcomeDescription,
			})
			throw new Error(outcomeDescription)
		}
		await audit.log({
			principalId,
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
				throw new Error(outcomeDescription)
			}
			await audit.log({
				principalId,
				action: toolName,
				targetResourceType: resourceType,
				targetResourceId: resourceId,
				status: 'success',
				outcomeDescription: `Successfully delete ${resourceType} resource.`,
			})
			return data
		} catch (e: any) {
			await audit.log({
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
})

// --- Patient Tools ---
export const patientReadTool = createTool({
	id: 'fhirPatientRead',
	description: 'Reads a Patient FHIR resource by ID.',
	inputSchema: z.object({
		id: z.string().describe('Patient id'),
	}),
	execute: async ({ context, runtimeContext }): Promise<Patient> => {
		const fhirSessionData = runtimeContext.get('fhirSessionData') as FhirSessionData
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'fhirPatientRead'
		const resourceType = 'Patient'
		const resourceId = context.id
		const principalId = fhirSessionData.userId || defaultPrincipalId
		const roles = fhirSessionData.roles || defaultRoles
		const principal = { id: principalId, roles: roles, attributes: {} }
		const cerbosResource = { kind: resourceType, id: resourceId, attributes: {} }
		const cerbosAction = 'read'

		logAuditEvent({
			principalId,
			action: `${toolName}Attempt`,
			targetResourceType: resourceType,
			targetResourceId: resourceId,
			status: 'attempt',
		})

		if (!fhirClient) {
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
			const { data, error, response } = await fhirClient.GET('/Patient/{id}', {
				params: { path: { id: context.id } },
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
					`FHIR Patient read error (ID: ${context.id}): Status ${response.status}`,
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
})

// Simplified audit logging for other tools for brevity in this example.
// In a real implementation, each tool would have detailed logging similar to patientReadTool.

export const patientSearchTool = createTool({
	id: 'fhirPatientSearch',
	description: 'Searches for Patient FHIR resources.',
	inputSchema: z.object({
		params: z.unknown().describe('The patient search parameters'),
	}),
	execute: async ({ context, runtimeContext }): Promise<Bundle<Patient>> => {
		const fhirSessionData = runtimeContext.get('fhirSessionData') as FhirSessionData
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'fhirPatientSearch'
		const resourceType = 'Patient'
		const principalId = fhirSessionData.userId || defaultPrincipalId
		const roles = fhirSessionData.roles || defaultRoles
		logAuditEvent({
			principalId,
			action: `${toolName}Attempt`,
			targetResourceType: resourceType,
			status: 'attempt',
			searchParams: context.params,
		})
		if (!fhirClient) {
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
		const cerbosResource = { id: 'all', kind: resourceType, attributes: {} }
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
			const { data, error, response } = await fhirClient.GET('/Patient', {
				params: { query: context.params },
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
})

export const patientCreateTool = createTool({
	id: 'fhirPatientCreate',
	description: 'Creates a new Patient FHIR resource.',
	inputSchema: z.object({
		resource: z.unknown().describe('The Patient fhir resource'),
	}),
	execute: async ({ context, runtimeContext }): Promise<Patient> => {
		const fhirSessionData = runtimeContext.get('fhirSessionData') as FhirSessionData
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'fhirPatientCreate'
		const resourceType = 'Patient'
		const principalId = fhirSessionData.userId || defaultPrincipalId
		const roles = fhirSessionData.roles || defaultRoles

		logAuditEvent({
			principalId,
			action: `${toolName}Attempt`,
			targetResourceType: resourceType,
			status: 'attempt',
		})

		if (!fhirClient) {
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
		const cerbosResource = { id: 'create', kind: resourceType, attributes: {} }
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

		const valid = patientSchema.safeParse(context.resource)
		if (!valid.success) {
			const desc = `${valid.error.message} to ${cerbosAction} ${resourceType}`
			logAuditEvent({
				principalId,
				action: `cerbos:${cerbosAction}`,
				targetResourceType: resourceType,
				status: 'failure',
				outcomeDescription: desc,
			})
			throw new Error(desc)
		}

		try {
			const { data, error, response } = await fhirClient.POST('/Patient', {
				body: context.resource,
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
})

export const patientUpdateTool = createTool({
	id: 'fhirPatientUpdate',
	description: 'Updates an existing Patient FHIR resource.',
	inputSchema: z.object({
		id: z.string().describe('Patient id'),
		resource: z.unknown().describe(''),
	}),
	execute: async ({ context, runtimeContext }): Promise<Patient> => {
		const fhirSessionData = runtimeContext.get('fhirSessionData') as FhirSessionData
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'fhirPatientUpdate'
		const resourceType = 'Patient'
		const resourceId = context.id
		const principalId = fhirSessionData.userId || defaultPrincipalId
		const roles = fhirSessionData.roles || defaultRoles
		logAuditEvent({
			principalId,
			action: `${toolName}Attempt`,
			targetResourceType: resourceType,
			targetResourceId: resourceId,
			status: 'attempt',
		})
		if (!fhirClient) {
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
		const cerbosResource = { id: resourceId, kind: resourceType, attributes: {} }
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
			const { data, error, response } = await fhirClient.PUT('/Patient/{id}', {
				params: { path: { id: context.id } },
				body: context.resource,
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
})

// --- Practitioner Tools (Apply similar detailed audit logging) ---
export const practitionerReadTool = createTool({
	id: 'fhirPractitionerRead',
	description: 'Reads a Practitioner FHIR resource by ID.',
	inputSchema: z.object({
		id: z.string().describe('Practitioner ID'),
	}),
	execute: async ({ context, runtimeContext }): Promise<Practitioner> => {
		const fhirSessionData = runtimeContext.get('fhirSessionData') as FhirSessionData
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'fhirPractitionerRead'
		const resourceType = 'Practitioner'
		const resourceId = context.id
		const principalId = fhirSessionData.userId || defaultPrincipalId
		const roles = fhirSessionData.roles || defaultRoles
		logAuditEvent({
			principalId,
			action: `${toolName}Attempt`,
			targetResourceType: resourceType,
			targetResourceId: resourceId,
			status: 'attempt',
		})
		if (!fhirClient) {
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
			const { data, error, response } = await fhirClient.GET('/Practitioner/{id}', {
				params: { path: { id: context.id } },
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
})

export const practitionerSearchTool = createTool({
	id: 'fhirPractitionerSearch',
	description: 'Searches for Practitioner FHIR resources.',
	inputSchema: z.object({
		params: z.unknown().describe('The practitioner search parameters'),
	}),
	execute: async ({ context, runtimeContext }): Promise<Bundle<Practitioner>> => {
		const fhirSessionData = runtimeContext.get('fhirSessionData') as FhirSessionData
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'fhirPractitionerSearch'
		const resourceType = 'Practitioner'
		const principalId = fhirSessionData.userId || defaultPrincipalId
		const roles = fhirSessionData.roles || defaultRoles
		logAuditEvent({
			principalId,
			action: `${toolName}Attempt`,
			targetResourceType: resourceType,
			status: 'attempt',
			searchParams: context.params,
		})
		if (!fhirClient) {
			logAuditEvent({
				principalId,
				action: toolName,
				status: 'failure',
				outcomeDescription: 'FHIR client not available.',
			})
			throw new Error('FHIR client not available.')
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
			const { data, error, response } = await fhirClient.GET('/Practitioner', {
				params: { query: context.params },
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
})

export const practitionerCreateTool = createTool({
	id: 'fhirPractitionerCreate',
	description: 'Creates a new Practitioner FHIR resource.',
	inputSchema: z.object({
		resource: z.unknown().describe('The Practitioner FHIR resource.'),
	}),
	execute: async ({ context, runtimeContext }): Promise<Practitioner> => {
		const fhirSessionData = runtimeContext.get('fhirSessionData') as FhirSessionData
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'fhirPractitionerCreate'
		const resourceType = 'Practitioner'
		const principalId = fhirSessionData.userId || defaultPrincipalId
		const roles = fhirSessionData.roles || defaultRoles
		logAuditEvent({
			principalId,
			action: `${toolName}Attempt`,
			targetResourceType: resourceType,
			status: 'attempt',
		})
		if (!fhirClient) {
			logAuditEvent({
				principalId,
				action: toolName,
				status: 'failure',
				outcomeDescription: 'FHIR client not available.',
			})
			throw new Error('FHIR client not available.')
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
			const { data, error, response } = await fhirClient.POST('/Practitioner', {
				body: context.resource,
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
})

export const practitionerUpdateTool = createTool({
	id: 'fhirPractitionerUpdate',
	description: 'Updates an existing Practitioner FHIR resource.',
	inputSchema: z.object({
		id: z.string().describe('Practitioner id'),
		resource: z.unknown().describe(''),
	}),
	execute: async ({ context, runtimeContext }): Promise<Practitioner> => {
		const fhirSessionData = runtimeContext.get('fhirSessionData') as FhirSessionData
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'fhirPractitionerUpdate'
		const resourceType = 'Practitioner'
		const resourceId = context.id
		const principalId = fhirSessionData.userId || defaultPrincipalId
		const roles = fhirSessionData.roles || defaultRoles
		logAuditEvent({
			principalId,
			action: `${toolName}Attempt`,
			targetResourceType: resourceType,
			targetResourceId: resourceId,
			status: 'attempt',
		})
		if (!fhirClient) {
			logAuditEvent({
				principalId,
				action: toolName,
				status: 'failure',
				outcomeDescription: 'FHIR client not available.',
			})
			throw new Error('FHIR client not available.')
		}
		const principal = { id: principalId, roles }
		const cerbosResource = { kind: resourceType, id: resourceId, attributes: {} }
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
			const { data, error, response } = await fhirClient.PUT('/Practitioner/{id}', {
				params: { path: { id: context.id } },
				body: context.resource,
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
})

// --- Organization Tools (Apply similar detailed audit logging) ---
export const organizationReadTool = createTool({
	id: 'fhirOrganizationRead',
	description: 'Reads an Organization FHIR resource by ID.',
	inputSchema: z.object({
		id: z.string().describe('Organization id'),
	}),
	execute: async ({ context, runtimeContext }): Promise<Organization> => {
		const fhirSessionData = runtimeContext.get('fhirSessionData') as FhirSessionData
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'fhirOrganizationRead'
		const resourceType = 'Organization'
		const resourceId = context.id
		const principalId = fhirSessionData.userId || defaultPrincipalId
		const roles = fhirSessionData.roles || defaultRoles
		logAuditEvent({
			principalId,
			action: `${toolName}Attempt`,
			targetResourceType: resourceType,
			targetResourceId: resourceId,
			status: 'attempt',
		})
		if (!fhirClient) {
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
			const { data, error, response } = await fhirClient.GET('/Organization/{id}', {
				params: { path: { id: context.id } },
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
})

export const organizationSearchTool = createTool({
	id: 'fhirOrganizationSearch',
	description: 'Searches for Organization FHIR resources.',
	inputSchema: z.object({
		params: z.unknown().describe('The organization search parameters'),
	}),
	execute: async ({ context, runtimeContext }): Promise<Bundle<Organization>> => {
		const fhirSessionData = runtimeContext.get('fhirSessionData') as FhirSessionData
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'fhirOrganizationSearch'
		const resourceType = 'Organization'
		const principalId = fhirSessionData.userId || defaultPrincipalId
		const roles = fhirSessionData.roles || defaultRoles
		logAuditEvent({
			principalId,
			action: `${toolName}Attempt`,
			targetResourceType: resourceType,
			status: 'attempt',
			searchParams: context.params,
		})
		if (!fhirClient) {
			logAuditEvent({
				principalId,
				action: toolName,
				status: 'failure',
				outcomeDescription: 'FHIR client not available.',
			})
			throw new Error('FHIR client not available.')
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
			const { data, error, response } = await fhirClient.GET('/Organization', {
				params: { query: context.params },
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
})

export const organizationCreateTool = createTool({
	id: 'fhirOrganizationCreate',
	description: 'Creates a new Organization FHIR resource.',
	inputSchema: z.object({
		resource: z.unknown().describe('The Organization FHIR resource.'),
	}),
	execute: async ({ context, runtimeContext }): Promise<Organization> => {
		const fhirSessionData = runtimeContext.get('fhirSessionData') as FhirSessionData
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'fhirOrganizationCreate'
		const resourceType = 'Organization'
		const principalId = fhirSessionData.userId || defaultPrincipalId
		const roles = fhirSessionData.roles || defaultRoles
		logAuditEvent({
			principalId,
			action: `${toolName}Attempt`,
			targetResourceType: resourceType,
			status: 'attempt',
		})
		if (!fhirClient) {
			logAuditEvent({
				principalId,
				action: toolName,
				status: 'failure',
				outcomeDescription: 'FHIR client not available.',
			})
			throw new Error('FHIR client not available.')
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
			const { data, error, response } = await fhirClient.POST('/Organization', {
				body: context.resource,
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
})

export const organizationUpdateTool = createTool({
	id: 'fhirOrganizationUpdate',
	description: 'Updates an existing Organization FHIR resource.',
	inputSchema: z.object({
		id: z.string().describe('The Organization ID'),
		resource: z.unknown().describe('The Organization FHIR resource.'),
	}),
	execute: async ({ context, runtimeContext }): Promise<Organization> => {
		const fhirSessionData = runtimeContext.get('fhirSessionData') as FhirSessionData
		const fhirClient = runtimeContext.get('fhirClient') as FhirApiClient
		const toolName = 'fhirOrganizationUpdate'
		const resourceType = 'Organization'
		const resourceId = context.id
		const principalId = fhirSessionData.userId || defaultPrincipalId
		const roles = fhirSessionData.roles || defaultRoles
		logAuditEvent({
			principalId,
			action: `${toolName}Attempt`,
			targetResourceType: resourceType,
			targetResourceId: resourceId,
			status: 'attempt',
		})
		if (!fhirClient) {
			logAuditEvent({
				principalId,
				action: toolName,
				status: 'failure',
				outcomeDescription: 'FHIR client not available.',
			})
			throw new Error('FHIR client not available.')
		}
		const principal = { id: principalId, roles }
		const cerbosResource = { kind: resourceType, id: resourceId, attributes: {} }
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
			const { data, error, response } = await fhirClient.PUT('/Organization/{id}', {
				params: { path: { id: context.id } },
				body: context.resource,
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
})

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

export const fhirResourceTools = [
	fhirResourceReadTool,
	fhirResourceSearchTool,
	fhirResourceCreateTool,
	fhirResourceUpdateTool,
	fhirResourceDeleteTool,
]

export const allFhirTools = [...fhirResourceTools]
