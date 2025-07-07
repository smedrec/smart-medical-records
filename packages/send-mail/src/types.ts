import type { MailerSendOptions } from '@repo/mailer'

export interface SendMailEvent {
	principalId: string
	organizationId: string
	action: string
	emailDetails: MailerSendOptions
}
