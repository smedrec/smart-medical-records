import nodemailer from 'nodemailer'

import type SMTPTransport from 'nodemailer/lib/smtp-transport'
import type { MailerProvider, MailerSendOptions } from './base.js'

export class NodeMailer implements MailerProvider {
	private transporter: nodemailer.Transporter

	constructor(smtpConnectionOptions: SMTPTransport.Options) {
		if (!smtpConnectionOptions) {
			throw new Error('NodeMailer: SMTP connection options are required.')
		}
		this.transporter = nodemailer.createTransport(smtpConnectionOptions)
	}

	async send(options: MailerSendOptions): Promise<void> {
		try {
			await this.transporter.sendMail({
				from: options.from,
				to: options.to,
				subject: options.subject,
				html: options.html,
				text: options.text,
			})
		} catch (error) {
			// console.error('Error sending email with NodeMailer:', error);
			throw new Error(
				`NodeMailer: Failed to send email. ${error instanceof Error ? error.message : String(error)}`
			)
		}
	}

	// Method to close the connection, useful for graceful shutdown
	close(): void {
		this.transporter.close()
	}
}
