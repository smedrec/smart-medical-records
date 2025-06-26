import nodemailer from 'nodemailer'

import type { SendMailOptions } from 'nodemailer'
import type SMTPTransport from 'nodemailer/lib/smtp-transport'

export class NodeMailer {
	private smtpConnectionOptions: SMTPTransport.Options

	/**
	 * Constructs an NodeMailer instance.
	 * @param smtpConnectionOptions Options for SMTP connection.
	 */
	constructor(smtpConnectionOptions: SMTPTransport.Options) {
		this.smtpConnectionOptions = smtpConnectionOptions

		if (!smtpConnectionOptions) {
			throw new Error(
				'WorkersMailer Service: Node Mailer Options not provided and could not be found in environment variables.'
			)
		}
	}

	/**
	 * Send an email message.
	 * @param msg .
	 * */
	async send(msg: SendMailOptions): Promise<void> {
		const mailer = nodemailer.createTransport(this.smtpConnectionOptions)

		await mailer.sendMail(msg)

		void mailer.close()
	}
}
