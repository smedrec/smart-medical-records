import { createTool } from '@mastra/core'
import z from 'zod'

import { SendMail } from '@repo/send-mail'

import type { Audit } from '@repo/audit'
import type { MailerSendOptions } from '@repo/mailer'
import type { FhirSessionData } from '../../hono/middleware/fhir-auth'

const email = new SendMail('mail', process.env.MAIL_REDIS_URL!)

// --- Email Tools (Apply similar detailed audit logging) ---
export const emailSendTool = createTool({
	id: 'emailSend',
	description: 'Send a email.',
	inputSchema: z.object({
		to: z.string().describe('Recipient email'),
		subject: z.string().describe('The subject of the email'),
		html: z.string().describe('The body of the email in html'),
		text: z.string().optional().describe('The body of the email in text'),
	}),
	outputSchema: z.object({
		success: z.boolean(),
		message: z.string(),
	}),
	execute: async ({ context, runtimeContext }): Promise<{ success: boolean; message: string }> => {
		const audit = runtimeContext.get('audit') as Audit
		const fhirSessionData = runtimeContext.get('fhirSessionData') as FhirSessionData
		const toolName = 'emailSend'
		const principalId = fhirSessionData.userId
		const organizationId = fhirSessionData.activeOrganizationId

		if (!principalId || !organizationId)
			return {
				success: false,
				message: 'userId and organizationId must be in context to send mails',
			}

		await audit.log({
			principalId,
			organizationId,
			action: `${toolName}Attempt`,
			status: 'attempt',
		})

		const emailDetails: MailerSendOptions = {
			from: 'email.from',
			to: context.to,
			subject: context.subject,
			html: context.html,
			text: context.text,
		}

		await email.send({
			principalId,
			organizationId,
			action: toolName,
			emailDetails,
		})

		return { success: true, message: 'Email sent' }
	},
})
