export interface MailerSendOptions {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export interface MailerProvider {
  send(options: MailerSendOptions): Promise<void>;
}
