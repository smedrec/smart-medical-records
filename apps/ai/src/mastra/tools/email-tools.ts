import { createTool } from '@mastra/core'
import z from 'zod'

import { logAuditEvent } from '../../audit'
import { email } from '../../email'

import type { FhirSessionData } from '../../hono/middleware/fhir-auth'

// --- Email Tools (Apply similar detailed audit logging) ---
export const emailSendTool = createTool({
	id: 'emailSend',
	description: 'Send a email.',
	inputSchema: z.object({
		to: z.string().describe('Recipient name'),
		subject: z.string().describe('The subject of the email'),
		text: z.string().describe('The body of the email'),
	}),
	execute: async ({ context, runtimeContext }): Promise<{ success: boolean; message: string }> => {
		const fhirSessionData = runtimeContext.get('fhirSessionData') as FhirSessionData
		const toolName = 'emailSend'
		const resourceId = context.to
		const principalId = fhirSessionData.userId

		logAuditEvent({
			principalId,
			action: `${toolName}Attempt`,
			targetResourceId: resourceId,
			status: 'attempt',
		})

		try {
			await email.send({
				to: context.to,
				subject: context.subject,
				text: context.text,
			})

			logAuditEvent({ principalId, action: toolName, status: 'success' })
			return { success: true, message: 'Email sent' }
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
