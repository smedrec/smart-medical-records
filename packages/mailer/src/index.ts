/**
 * @fileoverview This is the main entry point for the @repo/mailer package.
 * It exports all the available mailer providers and their associated types.
 */

export { NodeMailer } from './email/node.js'
export { ResendMailer } from './email/resend.js'
export { SendGridMailer } from './email/sendgrid.js'
export type { MailerProvider, MailerSendOptions } from './email/base.js'

// Export configuration options types for each provider
/**
 * @typedef {import('nodemailer/lib/smtp-transport').Options} NodeMailerSmtpOptions
 * Re-export of Nodemailer's SMTP transport options type.
 */
export type { Options as NodeMailerSmtpOptions } from 'nodemailer/lib/smtp-transport'

/**
 * @typedef {import('./email/resend.js').ResendMailerOptions} ResendMailerOptions
 * Re-export of ResendMailer's options type.
 */
export type { ResendMailerOptions } from './email/resend.js'

/**
 * @typedef {import('./email/sendgrid.js').SendGridMailerOptions} SendGridMailerOptions
 * Re-export of SendGridMailer's options type.
 */
export type { SendGridMailerOptions } from './email/sendgrid.js'
