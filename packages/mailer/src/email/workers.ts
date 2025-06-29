/**import { Email, WorkerMailer } from 'worker-mailer'

import type { WorkerMailerOptions } from 'worker-mailer'
import type { MailerProvider, MailerSendOptions } from './base.js'

export class WorkersMailer implements MailerProvider {
	private mailerInstance: WorkerMailer | null = null
	private smtpConnectionOptions: WorkerMailerOptions

	constructor(smtpConnectionOptions: WorkerMailerOptions) {
		if (!smtpConnectionOptions) {
			throw new Error('WorkersMailer: SMTP connection options are required.')
		}
		this.smtpConnectionOptions = smtpConnectionOptions
	}

	private async connect(): Promise<WorkerMailer> {
		if (!this.mailerInstance) {
			try {
				this.mailerInstance = await WorkerMailer.connect(this.smtpConnectionOptions)
			} catch (error) {
				// console.error('Error connecting with WorkersMailer:', error);
				throw new Error(
					`WorkersMailer: Failed to connect. ${error instanceof Error ? error.message : String(error)}`
				)
			}
		}
		return this.mailerInstance
	}

	async send(options: MailerSendOptions): Promise<void> {
		const mailer = await this.connect()
		try {
			const email = new Email({
				from: { email: options.from }, // Assuming from is just an email address string
				to: (Array.isArray(options.to) ? options.to : [options.to]).map((addr) => ({
					email: addr,
				})),
				subject: options.subject,
				html: options.html,
				...(options.text && { text: options.text }),
			})
			await mailer.send(email)
		} catch (error) {
			// console.error('Error sending email with WorkersMailer:', error);
			throw new Error(
				`WorkersMailer: Failed to send email. ${error instanceof Error ? error.message : String(error)}`
			)
		}
	}
}
*/
