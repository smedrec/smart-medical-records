import { createTool } from '@mastra/core'
import z from 'zod'

import { NodeMailer } from '@repo/mailer'

import type { Audit } from '@repo/audit'
import type { MailerSendOptions, NodeMailerSmtpOptions } from '@repo/mailer'
import type { FhirSessionData } from '../../hono/middleware/fhir-auth'

const config: NodeMailerSmtpOptions = {
	host: process.env.SMTP_HOST!,
	port: 2525, // Or 465 for SSL
	secure: false, // true for 465, false for other ports like 587 (STARTTLS)
	auth: {
		user: process.env.SMTP_USER!,
		pass: process.env.SMTP_PASSWORD!,
	},
	// Other nodemailer options can be added here
}

const mailer = new NodeMailer(config)

// --- Email Tools (Apply similar detailed audit logging) ---
export const emailSendTool = createTool({
	id: 'emailSend',
	description: 'Send a email.',
	inputSchema: z.object({
		to: z.string().describe('Recipient name'),
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

		await audit.log({
			principalId,
			action: `${toolName}Attempt`,
			status: 'attempt',
		})

		const emailDetails: MailerSendOptions = {
			from: 'no-reply@smedrec.com',
			to: context.to,
			subject: context.subject,
			html: context.html,
			text: context.text,
		}

		try {
			await mailer.send(emailDetails)
			await audit.log({
				principalId,
				action: toolName,
				status: 'success',
				outcomeDescription: 'Email sent successfully using NodeMailer!',
			})
			return { success: true, message: 'Email sent' }
		} catch (error) {
			await audit.log({
				principalId,
				action: toolName,
				status: 'failure',
				outcomeDescription: `NodeMailer send error: ${error}`,
			})
			return { success: false, message: 'NodeMailer send error' }
		}
	},
})
