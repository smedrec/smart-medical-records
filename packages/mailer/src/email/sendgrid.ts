import sgMail from '@sendgrid/mail';
import type { MailerProvider, MailerSendOptions } from './base';

export interface SendGridMailerOptions {
  apiKey: string;
}

export class SendGridMailer implements MailerProvider {
  constructor(options: SendGridMailerOptions) {
    if (!options || !options.apiKey) {
      throw new Error('SendGridMailer: API key is required.');
    }
    sgMail.setApiKey(options.apiKey);
  }

  async send(options: MailerSendOptions): Promise<void> {
    try {
      await sgMail.send({
        from: options.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        ...(options.text && { text: options.text }),
      });
    } catch (error) {
      // console.error('Error sending email with SendGridMailer:', error);
      // Check if the error is an instance of Error and has a response property
      // Enhanced error handling for SendGrid
      let details = '';
      if (typeof error === 'object' && error !== null) {
        const errObj = error as any; // eslint-disable-line @typescript-eslint/no-explicit-any
        if (errObj.response && errObj.response.body) {
          const body = errObj.response.body;
          if (body.errors && Array.isArray(body.errors)) {
            details = JSON.stringify(body.errors);
          } else if (typeof body === 'string') {
            details = body; // Use body directly if it's a string
          } else {
            // Fallback to stringifying the whole body if errors array is not present but body is
            details = JSON.stringify(body);
          }
        } else if (errObj.message) {
          details = errObj.message; // Standard error message
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
