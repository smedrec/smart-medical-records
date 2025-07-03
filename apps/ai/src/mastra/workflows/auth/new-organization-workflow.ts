import { fhirResourceCreateTool } from '@/mastra/tools/fhir/resource-create'
import { emailSendTool } from '@/mastra/tools/mail/email-tools'
import { createStep, createWorkflow } from '@mastra/core/workflows'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { organization } from '@repo/auth-db'

import type { Databases } from '@/db'
import type { ToolCallResult } from '@/mastra/tools/types'

const createFhirOrganizationResource = createStep({
	id: 'create-fhir-organization-resource',
	description: 'Creates a new FHIR Organization Resource for the new created organization',
	inputSchema: z.object({
		orgId: z.string().describe('The new organization id'),
		orgName: z.string().describe('The new organization name'),
		success: z.boolean(),
		message: z.string(),
	}),
	outputSchema: z.object({
		success: z.boolean(),
		message: z.string(),
	}),
	execute: async ({ inputData, runtimeContext }) => {
		if (!inputData || !inputData.orgName) {
			return { success: false, message: 'Input data not found' }
		}

		const db = runtimeContext.get('db') as Databases

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

			// TODO - check errors
			await db.auth
				.update(organization)
				.set({ metadata: `{ "organizationId": ${createdResource.id} }` })
				.where(eq(organization.id, inputData.orgId))

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

const newOrganizationWorkflow = createWorkflow({
	id: 'new-organization-workflow',
	description: 'Creates a new Organization fhir resource',
	inputSchema: z.object({
		orgId: z.string().describe('The new organization id'),
		orgName: z.string().describe('The new organization name'),
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
			description: 'Sends the marketing email and passes orgId and orgName forward',
			inputSchema: z.object({
				orgId: z.string().describe('The new organization id'),
				orgName: z.string().describe('The new organization name'),
				name: z.string().describe('The user name'),
				email: z.string().email().describe('The user email'),
			}),
			outputSchema: z.object({
				orgId: z.string(),
				orgName: z.string(),
				success: z.boolean(),
				message: z.string(),
			}),
			execute: async ({ inputData, runtimeContext }) => {
				const { orgId, orgName, name, email } = inputData
				// FIXME - the organization id is not in runtime context and the mail configuration is not set
				const result = (await emailSendTool.execute({
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
				})) as ToolCallResult
				return {
					orgId: orgId,
					orgName: orgName,
					success: !result.isError,
					message: result.content[0].text,
				}
			},
		})
	)
	.then(createFhirOrganizationResource)
	.commit()

export { newOrganizationWorkflow }
