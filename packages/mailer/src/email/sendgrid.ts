import sgMail from '@sendgrid/mail'

import type { MailerProvider, MailerSendOptions } from './base.js'

/**
 * @interface SendGridMailerOptions
 * @description Defines the options required for initializing the SendGridMailer.
 * @property {string} apiKey - The API key for SendGrid.
 */
export interface SendGridMailerOptions {
	apiKey: string
}

/**
 * @interface SendGridErrorResponse
 * @description Defines the structure of the error response body from SendGrid.
 * @property {Array<{message: string; field?: string; help?: string}>} [errors] - An array of error objects.
 */
interface SendGridErrorResponse {
  errors?: Array<{message: string; field?: string; help?: string}>;
}

/**
 * @interface SendGridError
 * @description Extends the standard Error object to include specific details from SendGrid API errors.
 * @property {object} [response] - The response object from SendGrid, typically containing a body with error details.
 * @property {SendGridErrorResponse} [response.body] - The body of the error response.
 * @property {number} [code] - The HTTP status code of the error response (less common directly on error, often on response).
 */
interface SendGridError extends Error {
  response?: {
    body?: SendGridErrorResponse | string; // Body can be an object or a string
  };
  code?: number; // SendGrid errors might have a 'code' property for status
}


/**
 * @class SendGridMailer
 * @implements MailerProvider
 * @description Provides email sending functionality using the SendGrid SDK.
 */
export class SendGridMailer implements MailerProvider {
	/**
	 * Creates an instance of SendGridMailer.
	 * Sets the SendGrid API key.
	 * @param {SendGridMailerOptions} options - Configuration options for SendGrid, including the API key.
	 * @throws {Error} If the API key is not provided.
	 */
	constructor(options: SendGridMailerOptions) {
		if (!options || !options.apiKey) {
			throw new Error('SendGridMailer: API key is required.')
		}
		sgMail.setApiKey(options.apiKey)
	}

	/**
	 * Sends an email using the SendGrid SDK.
	 * @param {MailerSendOptions} options - The email sending options.
	 * @returns {Promise<void>} A promise that resolves when the email is sent.
	 * @throws {Error} If sending the email fails, with detailed error information from SendGrid.
	 */
	async send(options: MailerSendOptions): Promise<void> {
		try {
			await sgMail.send({
				from: options.from,
				to: options.to,
				subject: options.subject,
				html: options.html,
				...(options.text && { text: options.text }),
			})
		} catch (error) {
			// console.error('Error sending email with SendGridMailer:', error);
			let details = '';
			const sgError = error as SendGridError;

			if (typeof sgError === 'object' && sgError !== null) {
				if (sgError.response && sgError.response.body) {
					const body = sgError.response.body;
					if (typeof body === 'string') {
						details = body;
					} else if (body.errors && Array.isArray(body.errors)) {
						details = JSON.stringify(body.errors);
					} else {
						details = JSON.stringify(body); // Fallback for unexpected body structure
					}
				} else if (sgError.message) {
					details = sgError.message; // Standard error message
					if (sgError.code) { // Include status code if available directly on error
						details += ` (Code: ${sgError.code})`;
					}
				} else {
					details = String(error); // Fallback for other objects
				}
			} else {
				details = String(error); // Fallback for non-objects (strings, numbers, etc.)
			}
			throw new Error(`SendGridMailer: Failed to send email. ${details}`);
		}
	}
}
