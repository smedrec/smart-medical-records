import nodemailer from 'nodemailer'

import type SMTPTransport from 'nodemailer/lib/smtp-transport'
import type { MailerProvider, MailerSendOptions } from './base.js'

/**
 * @interface NodeMailerError
 * @description Extends the standard Error object to include SMTP-specific details from Nodemailer.
 * @property {string} [code] - SMTP error code (e.g., 'EENVELOPE', 'ECONNECTION').
 * @property {string} [response] - The last SMTP response from the server.
 * @property {number} [responseCode] - The SMTP response code.
 * @property {string} [command] - The SMTP command that failed.
 */
interface NodeMailerError extends Error {
	code?: string
	response?: string
	responseCode?: number
	command?: string
}

/**
 * @class NodeMailer
 * @implements MailerProvider
 * @description Provides email sending functionality using Nodemailer with SMTP.
 */
export class NodeMailer implements MailerProvider {
	private transporter: nodemailer.Transporter

	/**
	 * Creates an instance of NodeMailer.
	 * @param {SMTPTransport.Options} smtpConnectionOptions - Configuration options for the SMTP connection.
	 * @throws {Error} If SMTP connection options are not provided.
	 */
	constructor(smtpConnectionOptions: SMTPTransport.Options) {
		if (!smtpConnectionOptions) {
			throw new Error('NodeMailer: SMTP connection options are required.')
		}
		this.transporter = nodemailer.createTransport(smtpConnectionOptions)
	}

	/**
	 * Sends an email using Nodemailer.
	 * @param {MailerSendOptions} options - The email sending options.
	 * @returns {Promise<void>} A promise that resolves when the email is sent.
	 * @throws {Error} If sending the email fails, with details from the Nodemailer error.
	 */
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
			let details = String(error)
			if (error instanceof Error) {
				details = error.message
				const nodeError = error as NodeMailerError
				if (nodeError.code) {
					details += ` (Code: ${nodeError.code})`
				}
				if (nodeError.responseCode) {
					details += ` (Response Code: ${nodeError.responseCode})`
				}
				if (nodeError.command) {
					details += ` (Command: ${nodeError.command})`
				}
				// Avoid duplicating the response if it's already in the message for some error types
				if (nodeError.response && !details.includes(nodeError.response)) {
					details += ` (Response: ${nodeError.response})`
				}
			}
			// console.error('Error sending email with NodeMailer:', error);
			throw new Error(`NodeMailer: Failed to send email. ${details}`)
		}
	}

	/**
	 * Closes the Nodemailer transporter connection.
	 * Useful for graceful shutdown.
	 */
	close(): void {
		this.transporter.close()
	}
}
