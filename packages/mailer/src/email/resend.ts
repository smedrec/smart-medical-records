import { Resend } from 'resend'

import type { MailerProvider, MailerSendOptions } from './base.js'

export interface ResendMailerOptions {
	apiKey: string
}

export class ResendMailer implements MailerProvider {
	private resend: Resend

	constructor(options: ResendMailerOptions) {
		if (!options || !options.apiKey) {
			throw new Error('ResendMailer: API key is required.')
		}
		this.resend = new Resend(options.apiKey)
	}

	async send(options: MailerSendOptions): Promise<void> {
		try {
			await this.resend.emails.send({
				from: options.from,
				to: options.to,
				subject: options.subject,
				html: options.html,
				...(options.text && { text: options.text }),
			})
		} catch (error) {
			// console.error('Error sending email with ResendMailer:', error);
			throw new Error(
				`ResendMailer: Failed to send email. ${error instanceof Error ? error.message : String(error)}`
			)
		}
	}
}
