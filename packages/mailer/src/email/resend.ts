import { Resend } from 'resend'

import type { MailerProvider, MailerSendOptions } from './base.js'

/**
 * @interface ResendMailerOptions
 * @description Defines the options required for initializing the ResendMailer.
 * @property {string} apiKey - The API key for Resend.
 */
export interface ResendMailerOptions {
	apiKey: string
}

/**
 * @interface ResendError
 * @description Extends the standard Error object to include specific details from Resend API errors.
 * @property {string} [name] - The name of the error (e.g., 'validation_error').
 * @property {number} [statusCode] - HTTP status code of the error response.
 */
interface ResendError extends Error {
	name: string
	statusCode?: number
}

/**
 * @class ResendMailer
 * @implements MailerProvider
 * @description Provides email sending functionality using the Resend SDK.
 */
export class ResendMailer implements MailerProvider {
	private resend: Resend

	/**
	 * Creates an instance of ResendMailer.
	 * @param {ResendMailerOptions} options - Configuration options for Resend, including the API key.
	 * @throws {Error} If the API key is not provided.
	 */
	constructor(options: ResendMailerOptions) {
		if (!options || !options.apiKey) {
			throw new Error('ResendMailer: API key is required.')
		}
		this.resend = new Resend(options.apiKey)
	}

	/**
	 * Sends an email using the Resend SDK.
	 * @param {MailerSendOptions} options - The email sending options.
	 * @returns {Promise<void>} A promise that resolves when the email is sent.
	 * @throws {Error} If sending the email fails, with details from the Resend API error.
	 */
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
			let details = String(error)
			if (error instanceof Error) {
				details = error.message
				const resendError = error as ResendError
				if (resendError.name) {
					details += ` (Name: ${resendError.name})`
				}
				if (resendError.statusCode) {
					details += ` (Status Code: ${resendError.statusCode})`
				}
			}
			// console.error('Error sending email with ResendMailer:', error);
			throw new Error(`ResendMailer: Failed to send email. ${details}`)
		}
	}
}
