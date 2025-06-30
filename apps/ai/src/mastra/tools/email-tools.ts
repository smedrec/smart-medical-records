import { createTool } from '@mastra/core'
import { eq } from 'drizzle-orm'
import z from 'zod'

import { AuthDb, emailProvider } from '@repo/auth-db'
import { NodeMailer, ResendMailer, SendGridMailer } from '@repo/mailer'

import type { Audit } from '@repo/audit'
import type { MailerSendOptions } from '@repo/mailer'
import type { FhirSessionData } from '../../hono/middleware/fhir-auth'

interface Mailer {
	from: string | null
	mailer: NodeMailer | ResendMailer | SendGridMailer | null
}

async function getEmailProvider(organizationId: string): Promise<Mailer> {
	const transport: Mailer = { from: null, mailer: null }
	// Using environment variable AUTH_DB_URL
	const authDbService = new AuthDb(process.env.AUTH_DB_URL)

	if (await authDbService.checkAuthDbConnection()) {
		console.info('🟢 Connected to Postgres for Email service.')
	} else {
		console.error('🔴 Postgres connection error for Email service')
		return transport
	}

	const db = authDbService.getDrizzleInstance()

	const provider = await db.query.emailProvider.findFirst({
		where: eq(emailProvider.organizationId, organizationId),
	})

	await authDbService.end()

	if (!provider) {
		console.error('🔴 Mailer connection error for Email service')
		return transport
	}

	transport.from = `${provider.fromName} <${provider.fromEmail}>`

	switch (provider?.providerType) {
		case 'nodemailer':
			transport.mailer = new NodeMailer({
				host: provider.smtpHost!,
				port: provider.smtpPort as number,
				secure: provider.smtpSecure as boolean,
				auth: {
					user: provider.smtpUser!,
					pass: provider.smtpPass!,
				},
			})
			break
		case 'resend':
			transport.mailer = new ResendMailer({
				apiKey: provider.apiKey!,
			})
			break
		case 'sendgrid':
			transport.mailer = new SendGridMailer({
				apiKey: provider.apiKey!,
			})
			break

		default:
			break
	}

	return transport
}

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
		const organizationId = fhirSessionData.activeOrganizationId
		let email: Mailer

		await audit.log({
			principalId,
			organizationId,
			action: `${toolName}Attempt`,
			status: 'attempt',
		})

		if (organizationId) {
			email = await getEmailProvider(organizationId)
		} else {
			return {
				success: false,
				message:
					'The organization id is not defined in the context, unable to define the mail transport',
			}
		}

		if (!email.mailer) {
			console.error('🔴 Mailer connection error for Email service')
		}

		const emailDetails: MailerSendOptions = {
			from: email.from!,
			to: context.to,
			subject: context.subject,
			html: context.html,
			text: context.text,
		}

		try {
			await email.mailer?.send(emailDetails)
			await audit.log({
				principalId,
				organizationId,
				action: toolName,
				status: 'success',
				outcomeDescription: 'Email sent successfully using Mailer!',
			})
			return { success: true, message: 'Email sent' }
		} catch (error) {
			await audit.log({
				principalId,
				organizationId,
				action: toolName,
				status: 'failure',
				outcomeDescription: `Mailer send error: ${error}`,
			})
			console.error('🔴 Mailer send error')
			return { success: false, message: 'Mailer send error' }
		}
	},
})
