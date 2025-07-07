export { NodeMailer } from './email/node.js'
export { ResendMailer } from './email/resend.js'
export { SendGridMailer } from './email/sendgrid.js'
export type { MailerProvider, MailerSendOptions } from './email/base.js'

// Export configuration options types for each provider
export type { Options as NodeMailerSmtpOptions } from 'nodemailer/lib/smtp-transport'
export type { ResendMailerOptions } from './email/resend.js'
export type { SendGridMailerOptions } from './email/sendgrid.js'
