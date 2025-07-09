/**
 * @interface MailerSendOptions
 * @description Defines the common options for sending an email, regardless of the provider.
 * @property {string} from - The sender's email address.
 * @property {string | string[]} to - The recipient's email address or an array of recipient email addresses.
 * @property {string} subject - The subject line of the email.
 * @property {string} html - The HTML content of the email.
 * @property {string} [text] - Optional plain text content of the email.
 */
export interface MailerSendOptions {
	from: string
	to: string | string[]
	subject: string
	html: string
	text?: string
}

/**
 * @interface MailerProvider
 * @description Defines the contract for a mailer provider.
 * Any mailer implementation (e.g., NodeMailer, ResendMailer) must implement this interface.
 */
export interface MailerProvider {
	/**
	 * Sends an email.
	 * @param {MailerSendOptions} options - The options for the email to be sent.
	 * @returns {Promise<void>} A promise that resolves when the email has been processed for sending.
	 * @throws {Error} If an error occurs during the sending process.
	 */
	send(options: MailerSendOptions): Promise<void>
}
