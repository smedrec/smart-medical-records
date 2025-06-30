import { RuntimeContext } from '@mastra/core/di'
import { createStep, createWorkflow } from '@mastra/core/workflows'
import createClient from 'openapi-fetch'
import { z } from 'zod'

import { Audit } from '@repo/audit'
import { Cerbos } from '@repo/cerbos'

import { emailSendTool } from '../tools/email-tools'
import { fhirResourceCreateTool } from '../tools/fhir-tools'

import type { FhirApiClient, FhirSessionData } from '../../hono/middleware/fhir-auth'
import type { ToolCallResult } from '../tools/types'

const runtimeContext = new RuntimeContext()

const cerbos = new Cerbos(process.env.CERBOS_URL!)
const audit = new Audit('audit', process.env.AUDIT_REDIS_URL!)
const sessionData: FhirSessionData = {
	tokenResponse: {},
	serverUrl: 'https://hapi.teachhowtofish.org/fhir/',
	userId: '1Hb4MBVPx02HHsBPc8yfJDMDiW2XeVjO', // Added for Cerbos Principal ID
	roles: ['owner'],
	activeOrganizationId: 'G47R3UBSyF2aVGT3hwMKbh06aZngIA8m',
}
const fhirApiClient: FhirApiClient = createClient({ baseUrl: sessionData.serverUrl })
runtimeContext.set('cerbos', cerbos)
runtimeContext.set('audit', audit)
runtimeContext.set('fhirSessionData', sessionData)
runtimeContext.set('fhirClient', fhirApiClient)

const createFhirOrganizationResource = createStep({
	id: 'create-fhir-organization-resource',
	description: 'Creates a new FHIR Organization Resource for the new created organization',
	inputSchema: z.object({
		orgName: z.string().describe('The organization name'),
		success: z.boolean(),
		message: z.string(),
	}),
	outputSchema: z.object({
		success: z.boolean(),
		message: z.string(),
	}),
	execute: async ({ inputData }) => {
		if (!inputData || !inputData.orgName) {
			return { success: false, message: 'Input data not found' }
		}

		try {
			const resource = {
				resourceType: 'Organization',
				active: true,
				text: {
					status: 'generated',
					div: `<div xmlns="http://www.w3.org/1999/xhtml">\n      \n      <p>${inputData.orgName}</p>\n    \n    </div>`,
				},
				name: inputData.orgName,
			}
			if (typeof fhirResourceCreateTool.execute !== 'function') {
				return { success: false, message: 'fhirResourceCreateTool.execute is not available' }
			}
			const result = (await fhirResourceCreateTool.execute({
				context: {
					resourceType: 'Organization',
					resource,
				},
				runtimeContext,
			})) as ToolCallResult

			// Assume result.result contains the created FHIR resource
			const createdResource = JSON.parse(result.content[0].text)
			if (
				!result ||
				typeof createdResource !== 'object' ||
				result.isError === true ||
				typeof createdResource.id !== 'string'
			) {
				return { success: false, message: 'Failed to create organization resource: missing id' }
			}
			return {
				success: true,
				message: `Organization resource created with id: ${createdResource.id}`,
			}
		} catch (error) {
			console.error('Error setting up fhir organization resource:', error)
			return { success: false, message: 'Error setting up fhir organization resource:' }
		}
	},
})

export const newOrganizationWorkflow = createWorkflow({
	id: 'new-organization-workflow',
	description: 'Creates a new Organization fhir resource',
	inputSchema: z.object({
		orgName: z.string().describe('The organization name'),
		name: z.string().describe('The user name'),
		email: z.string().email().describe('The user email'),
	}),
	outputSchema: z.object({
		success: z.boolean(),
		message: z.string(),
	}),
})
	.then(
		createStep({
			id: 'send-marketing-email-with-orgName',
			description: 'Sends the marketing email and passes orgName forward',
			inputSchema: z.object({
				orgName: z.string().describe('The organization name'),
				name: z.string().describe('The user name'),
				email: z.string().email().describe('The user email'),
			}),
			outputSchema: z.object({
				orgName: z.string(),
				success: z.boolean(),
				message: z.string(),
			}),
			execute: async ({ inputData }) => {
				const { orgName, name, email } = inputData
				const result = await emailSendTool.execute({
					context: {
						to: email,
						subject: `${orgName} created, and now`,
						html: `
							<p><b>Hello ${name},</p>
							<p>Thans for creating the new organization... blabla...</P>
							<p></p>
							<p>All the best</p>
							<p>The team</p>
						`,
					},
					runtimeContext,
				})
				return {
					orgName: orgName,
					success: result.success,
					message: result.message,
				}
			},
		})
	)
	.then(createFhirOrganizationResource)
	.commit()
