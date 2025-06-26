import { WorkerMailer } from 'worker-mailer'

import type { Email, WorkerMailerOptions } from 'worker-mailer'

export class WorkersMailer {
	private smtpConnectionOptions: WorkerMailerOptions

	/**
	 * Constructs an WorkersMailer instance.
	 * @param smtpConnectionOptions Options for SMTP connection.
	 */
	constructor(smtpConnectionOptions: WorkerMailerOptions) {
		this.smtpConnectionOptions = smtpConnectionOptions

		if (!smtpConnectionOptions) {
			throw new Error(
				'WorkersMailer Service: Worker Mailer Options not provided and could not be found in environment variables.'
			)
		}
	}

	/**
	 * Send an email message.
	 * @param msg .
	 */
	async send(msg: Email): Promise<void> {
		const mailer = await WorkerMailer.connect(this.smtpConnectionOptions)

		await mailer.send(msg)
	}
}
