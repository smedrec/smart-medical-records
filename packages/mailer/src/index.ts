export { NodeMailer } from './email/node';
export { WorkersMailer } from './email/workers';
export { ResendMailer } from './email/resend';
export { SendGridMailer } from './email/sendgrid';
export type { MailerProvider, MailerSendOptions } from './email/base';

// Export configuration options types for each provider
export type { Options as NodeMailerSmtpOptions } from 'nodemailer/lib/smtp-transport';
export type { WorkerMailerOptions } from 'worker-mailer';
export type { ResendMailerOptions } from './email/resend';
export type { SendGridMailerOptions } from './email/sendgrid';
