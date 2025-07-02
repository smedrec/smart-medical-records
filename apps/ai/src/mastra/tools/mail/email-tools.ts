import { IToolCallResult } from '@/mastra/tools/types'
import { createTextResponse } from '@/mastra/tools/utils'
import { createTool } from '@mastra/core'
import z from 'zod'

import { SendMail } from '@repo/send-mail'

import type { FhirSessionData } from '@/hono/middleware/fhir-auth'
import type { ToolCallResult } from '@/mastra/tools/types'
import type { Audit } from '@repo/audit'
import type { MailerSendOptions } from '@repo/mailer'

const email = new SendMail('mail', process.env.MAIL_REDIS_URL!)

// --- Email Tools (Apply similar detailed audit logging) ---
const emailSendTool = createTool({
	id: 'emailSend',
	description: 'Send a email.',
	inputSchema: z.object({
		to: z.string().describe('Recipient email'),
		subject: z.string().describe('The subject of the email'),
		html: z.string().describe('The body of the email in html'),
		text: z.string().optional().describe('The body of the email in text'),
	}),
	outputSchema: IToolCallResult,
	execute: async ({ context, runtimeContext }): Promise<ToolCallResult> => {
		const audit = runtimeContext.get('audit') as Audit
		const fhirSessionData = runtimeContext.get('fhirSessionData') as FhirSessionData
		const toolName = 'emailSend'
		const principalId = fhirSessionData.userId
		const organizationId = fhirSessionData.activeOrganizationId

		if (!principalId || !organizationId)
			return createTextResponse(
				'userId and organizationId must be in runtime context to send mails',
				{ isError: true }
			)

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

		return createTextResponse('Email enqueued', { isError: false })
	},
})

export { emailSendTool }
