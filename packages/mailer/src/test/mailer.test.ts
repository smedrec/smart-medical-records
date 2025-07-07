import sgMail from '@sendgrid/mail'
import { mock } from 'jest-mock-extended'
import nodemailer from 'nodemailer'
import { Resend } from 'resend'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { NodeMailer } from '../email/node.js'
import { ResendMailer } from '../email/resend.js'
import { SendGridMailer } from '../email/sendgrid.js'

import type { MailerSendOptions } from '../email/base.js'
import type { ResendMailerOptions } from '../email/resend.js'
import type { SendGridMailerOptions } from '../email/sendgrid.js'
import type { NodeMailerSmtpOptions } from '../index.js'

// Mocks
vi.mock('nodemailer')
vi.mock('resend')
vi.mock('@sendgrid/mail')

// Deeper mock for worker-mailer to prevent 'cloudflare:sockets' import issues
// We cannot use importOriginal() if the original module has top-level problematic imports.
vi.mock('worker-mailer', () => {
	// Manually mock the exports needed by the code under test.
	const mockConnect = vi.fn()
	const MockEmail = vi.fn().mockImplementation((args) => {
		// A simple constructor mock. If Email instances need methods, mock them here.
		// For example: this.send = vi.fn();
		return { ...args }
	})

	return {
		WorkerMailer: {
			connect: mockConnect,
		},
		Email: MockEmail,
		// Add any other named exports from 'worker-mailer' if they are used directly
		// and don't cause issues. For example, if there are types or utility functions
		// that are safe to import, they could be handled by importOriginal, but it's safer
		// to mock them explicitly if unsure.
	}
})

describe('@repo/mailer', () => {
	const mockSendOptions: MailerSendOptions = {
		from: 'test@example.com',
		to: 'recipient@example.com',
		subject: 'Test Subject',
		html: '<p>Test HTML</p>',
		text: 'Test Text',
	}

	describe('NodeMailer', () => {
		const mockSmtpOptions: NodeMailerSmtpOptions = {
			host: 'smtp.example.com',
			port: 587,
			auth: { user: 'user', pass: 'pass' },
		}
		let mockTransporter: { sendMail: vi.Mock; close: vi.Mock }

		beforeEach(() => {
			vi.clearAllMocks()
			mockTransporter = {
				sendMail: vi.fn(),
				close: vi.fn(),
			}
			;(nodemailer.createTransport as vi.Mock).mockReturnValue(mockTransporter)
		})

		it('should create a transporter on construction', () => {
			new NodeMailer(mockSmtpOptions)
			expect(nodemailer.createTransport).toHaveBeenCalledWith(mockSmtpOptions)
		})

		it('should throw error if SMTP options are not provided', () => {
			expect(() => new NodeMailer(undefined as any)).toThrow(
				'NodeMailer: SMTP connection options are required.'
			)
		})

		it('should send an email successfully', async () => {
			const mailer = new NodeMailer(mockSmtpOptions)
			await mailer.send(mockSendOptions)
			expect(mockTransporter.sendMail).toHaveBeenCalledWith({
				from: mockSendOptions.from,
				to: mockSendOptions.to,
				subject: mockSendOptions.subject,
				html: mockSendOptions.html,
				text: mockSendOptions.text,
			})
		})

		it('should close the transporter connection', () => {
			const mailer = new NodeMailer(mockSmtpOptions)
			mailer.close()
			expect(mockTransporter.close).toHaveBeenCalled()
		})

		it('should throw an error if sendMail fails with details', async () => {
			const mailer = new NodeMailer(mockSmtpOptions)
			const sendError = new Error('SMTP Send Error') as any
			sendError.code = 'EENVELOPE'
			sendError.responseCode = 550
			sendError.command = 'RCPT TO'
			;(mockTransporter.sendMail as vi.Mock).mockRejectedValueOnce(sendError)
			await expect(mailer.send(mockSendOptions)).rejects.toThrow(
				'NodeMailer: Failed to send email. SMTP Send Error (Code: EENVELOPE) (Response Code: 550) (Command: RCPT TO)'
			)
		})

		it('should throw basic error if sendMail fails without details', async () => {
			const mailer = new NodeMailer(mockSmtpOptions)
			const sendError = new Error('SMTP Generic Error')
			;(mockTransporter.sendMail as vi.Mock).mockRejectedValueOnce(sendError)
			await expect(mailer.send(mockSendOptions)).rejects.toThrow(
				'NodeMailer: Failed to send email. SMTP Generic Error'
			)
		})

		it('should throw an error with stringified non-Error if sendMail fails with non-Error', async () => {
			const mailer = new NodeMailer(mockSmtpOptions)
			const sendError = 'SMTP Send Failure String'
			;(mockTransporter.sendMail as vi.Mock).mockRejectedValueOnce(sendError)
			await expect(mailer.send(mockSendOptions)).rejects.toThrow(
				'NodeMailer: Failed to send email. SMTP Send Failure String'
			)
		})
	})

	describe('ResendMailer', () => {
		const mockResendOptions: ResendMailerOptions = { apiKey: 'test-api-key' }
		let mockResendInstance: Resend

		beforeEach(() => {
			vi.clearAllMocks()
			// We need to mock the Resend class constructor and its methods
			// The Resend SDK uses `new Resend().emails.send()`
			const mockEmailsSend = vi.fn()
			;(Resend as vi.Mock).mockImplementation(() => {
				return {
					emails: {
						send: mockEmailsSend,
					},
				} as unknown as Resend
			})
			mockResendInstance = new Resend(mockResendOptions.apiKey) // To get the mocked instance
		})

		it('should create a Resend instance on construction', () => {
			new ResendMailer(mockResendOptions)
			expect(Resend).toHaveBeenCalledWith(mockResendOptions.apiKey)
		})

		it('should throw error if API key is not provided', () => {
			expect(() => new ResendMailer({} as any)).toThrow('ResendMailer: API key is required.')
			expect(() => new ResendMailer(undefined as any)).toThrow('ResendMailer: API key is required.')
		})

		it('should send an email successfully', async () => {
			const mailer = new ResendMailer(mockResendOptions)
			await mailer.send(mockSendOptions)
			expect(mockResendInstance.emails.send).toHaveBeenCalledWith({
				from: mockSendOptions.from,
				to: mockSendOptions.to,
				subject: mockSendOptions.subject,
				html: mockSendOptions.html,
				text: mockSendOptions.text,
			})
		})

		it('should throw an error if resend.emails.send fails with details', async () => {
			const mailer = new ResendMailer(mockResendOptions)
			const sendError = new Error('Resend API Error') as any
			sendError.name = 'validation_error'
			sendError.statusCode = 422
			;(mockResendInstance.emails.send as vi.Mock).mockRejectedValueOnce(sendError)
			await expect(mailer.send(mockSendOptions)).rejects.toThrow(
				'ResendMailer: Failed to send email. Resend API Error (Name: validation_error) (Status Code: 422)'
			)
		})

		it('should throw basic error if resend.emails.send fails without details', async () => {
			const mailer = new ResendMailer(mockResendOptions)
			const sendError = new Error('Resend Generic Error')
			;(mockResendInstance.emails.send as vi.Mock).mockRejectedValueOnce(sendError)
			await expect(mailer.send(mockSendOptions)).rejects.toThrow(
				'ResendMailer: Failed to send email. Resend Generic Error'
			)
		})

		it('should throw an error with stringified non-Error if resend.emails.send fails with non-Error', async () => {
			const mailer = new ResendMailer(mockResendOptions)
			const sendError = 'Resend API Failure String'
			;(mockResendInstance.emails.send as vi.Mock).mockRejectedValueOnce(sendError)
			await expect(mailer.send(mockSendOptions)).rejects.toThrow(
				'ResendMailer: Failed to send email. Resend API Failure String'
			)
		})
	})

	describe('SendGridMailer', () => {
		const mockSendGridOptions: SendGridMailerOptions = { apiKey: 'test-api-key' }

		beforeEach(() => {
			vi.clearAllMocks()
			// sgMail is an object with methods, not a class constructor
			;(sgMail.setApiKey as vi.Mock).mockClear()
			;(sgMail.send as vi.Mock).mockClear()
		})

		it('should set the API key on construction', () => {
			new SendGridMailer(mockSendGridOptions)
			expect(sgMail.setApiKey).toHaveBeenCalledWith(mockSendGridOptions.apiKey)
		})

		it('should throw error if API key is not provided', () => {
			expect(() => new SendGridMailer({} as any)).toThrow('SendGridMailer: API key is required.')
			expect(() => new SendGridMailer(undefined as any)).toThrow(
				'SendGridMailer: API key is required.'
			)
		})

		it('should send an email successfully', async () => {
			const mailer = new SendGridMailer(mockSendGridOptions)
			await mailer.send(mockSendOptions)
			expect(sgMail.send).toHaveBeenCalledWith({
				from: mockSendOptions.from,
				to: mockSendOptions.to,
				subject: mockSendOptions.subject,
				html: mockSendOptions.html,
				text: mockSendOptions.text,
			})
		})

		it('should throw an error if sgMail.send fails', async () => {
			const mailer = new SendGridMailer(mockSendGridOptions)
			const sendError = new Error('SendGrid API Error')
			;(sgMail.send as vi.Mock).mockRejectedValueOnce(sendError)
			await expect(mailer.send(mockSendOptions)).rejects.toThrow(
				'SendGridMailer: Failed to send email. SendGrid API Error'
			)
		})

		it('should throw a detailed error if sgMail.send fails with response body', async () => {
			const mailer = new SendGridMailer(mockSendGridOptions)
			// Make sendError an instance of Error
			const sendError = new Error('Some generic message') as any // eslint-disable-line @typescript-eslint/no-explicit-any
			sendError.response = {
				body: {
					errors: [{ message: 'Detailed SG Error' }],
				},
			}
			;(sgMail.send as vi.Mock).mockRejectedValueOnce(sendError)
			await expect(mailer.send(mockSendOptions)).rejects.toThrow(
				'SendGridMailer: Failed to send email. [{"message":"Detailed SG Error"}]'
			)
		})

		it('should throw an error with stringified non-Error if sgMail.send fails with non-Error and no response property', async () => {
			const mailer = new SendGridMailer(mockSendGridOptions)
			const sendError = 'SendGrid API Failure String' // Not an Error instance, no 'response' property
			;(sgMail.send as vi.Mock).mockRejectedValueOnce(sendError)
			await expect(mailer.send(mockSendOptions)).rejects.toThrow(
				'SendGridMailer: Failed to send email. SendGrid API Failure String'
			)
		})

		it('should throw an error with stringified non-Error if sgMail.send fails with non-Error response body', async () => {
			const mailer = new SendGridMailer(mockSendGridOptions)
			const sendError = { response: { body: 'Non-JSON error body' } } // Non-Error, but has response.body
			;(sgMail.send as vi.Mock).mockRejectedValueOnce(sendError)
			// This will now hit `error.message` (which is undefined for a plain object) or `JSON.stringify(body)`
			// If error.message is undefined, it will try JSON.stringify(sendError.response.body)
			// Corrected expectation: body is used directly as it's a string, no extra JSON.stringify quotes
			await expect(mailer.send(mockSendOptions)).rejects.toThrow(
				'SendGridMailer: Failed to send email. Non-JSON error body'
			)
		})
	})
})
