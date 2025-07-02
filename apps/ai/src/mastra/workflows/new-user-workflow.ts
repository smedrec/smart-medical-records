import { createStep, createWorkflow } from '@mastra/core/workflows'
import { eq } from 'drizzle-orm'
import createClient from 'openapi-fetch'
import { z } from 'zod'

import { user } from '@repo/auth-db'

import { emailSendTool } from '../tools/email-tools'
import { fhirResourceCreateTool } from '../tools/fhir/resource-create'

import type { Databases } from '@/db'
import type { ToolCallResult } from '../tools/types'

const sendWelcomeEmail = createStep({
	id: 'send-welcome-email',
	description: 'Sends the welcome email to the new user',
	inputSchema: z.object({
		name: z.string().describe('The user name'),
		email: z.string().email().describe('The user email'),
	}),
	outputSchema: z.object({
		success: z.boolean(),
		message: z.string(),
	}),
	execute: async ({ inputData, runtimeContext }) => {
		const { name, email } = inputData
		const result = (await emailSendTool.execute({
			context: {
				to: email,
				subject: 'Welcome a board',
				html: `
					<p><b>Hello ${name},</p>
					<p>Welcome blablabla...</P>
					<p></p>
					<p>All the best</p>
					<p>The team</p>
				`,
			},
			runtimeContext,
		})) as ToolCallResult
		// Ensure result matches the outputSchema shape
		return {
			success: !result.isError,
			message: result.content[0].text,
		}
	},
})

const createFhirPersonResource = createStep({
	id: 'create-fhir-person-resource',
	description: 'Creates a new FHIR Person Resource for the new user',
	inputSchema: z.object({
		name: z.string().describe('The user name'),
		email: z.string().email().describe('The user email'),
	}),
	outputSchema: z.object({
		success: z.boolean(),
		message: z.string(),
	}),
	execute: async ({ inputData, runtimeContext }) => {
		if (!inputData) {
			return { success: false, message: 'Input data not found' }
		}
		const db = runtimeContext.get('db') as Databases

		const names: string[] = inputData.name.split(' ')
		const last = names.pop()
		try {
			const resource = {
				resourceType: 'Person',
				active: true,
				text: {
					status: 'generated',
					div: `<div xmlns="http://www.w3.org/1999/xhtml">\n      \n      <p>${inputData.name}</p>\n    \n    </div>`,
				},
				name: [
					{
						use: 'official',
						family: last,
						given: names,
					},
				],
				telecom: [
					{
						system: 'email',
						value: inputData.email,
						rank: 1,
					},
				],
			}
			if (typeof fhirResourceCreateTool.execute !== 'function') {
				return { success: false, message: 'fhirResourceCreateTool.execute is not available' }
			}
			const result = (await fhirResourceCreateTool.execute({
				context: {
					resourceType: 'Person',
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
				return { success: false, message: 'Failed to create person resource: missing id' }
			}

			// TODO - check errors
			await db.auth
				.update(user)
				.set({ personId: createdResource.id })
				.where(eq(user.email, inputData.email))

			return {
				success: true,
				message: `Person resource created with id: ${createdResource.id}`,
			}
		} catch (error) {
			console.error('Error setting up fhir person resource:', error)
			return { success: false, message: 'Error setting up fhir person resource:' }
		}
	},
})

export const newUserWorkflow = createWorkflow({
	id: 'new-user-workflow',
	description: 'New user workflow tasks',
	inputSchema: z.object({
		name: z.string().describe('The user name'),
		email: z.string().email().describe('The user email'),
	}),
	outputSchema: z.object({
		success: z.boolean(),
		message: z.string(),
	}),
})
	.parallel([sendWelcomeEmail, createFhirPersonResource])
	.commit()
