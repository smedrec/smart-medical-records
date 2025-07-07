# @repo/mailer

A shared package for sending emails via different providers.

## Features

- Multiple email provider integrations:
  - **NodeMailer (SMTP)**: For standard SMTP-based email sending in Node.js environments.
  - **WorkersMailer (SMTP)**: Optimized for Cloudflare Workers, using `worker-mailer` for SMTP.
  - **Resend**: Integration with the Resend email API.
  - **SendGrid**: Integration with the SendGrid email API.
- Common interface for sending emails, regardless of the chosen provider.
- Type-safe configurations and send options.

## Installation

To add this package as a dependency in another app or package within your monorepo, run:

```sh
cd apps/your-app # or packages/your-package
pnpm add '@repo/mailer@workspace:*'
```

## Usage

First, import the desired mailer class and its options type:

```typescript
import { NodeMailer, ResendMailer, SendGridMailer } from '@repo/mailer'

import type {
	MailerSendOptions,
	NodeMailerSmtpOptions,
	ResendMailerOptions,
	SendGridMailerOptions,
	WorkerMailerOptions,
} from '@repo/mailer'
```

Then, initialize the mailer with its specific configuration:

**NodeMailer (SMTP)**

```typescript
const nodeMailerOptions: NodeMailerSmtpOptions = {
	host: 'smtp.example.com',
	port: 587,
	secure: false, // true for 465, false for other ports
	auth: {
		user: 'your-smtp-user',
		pass: 'your-smtp-password',
	},
}
const mailer = new NodeMailer(nodeMailerOptions)
```

**Resend**

```typescript
const resendOptions: ResendMailerOptions = {
	apiKey: 'YOUR_RESEND_API_KEY',
}
const mailer = new ResendMailer(resendOptions)
```

**SendGrid**

```typescript
const sendGridOptions: SendGridMailerOptions = {
	apiKey: 'YOUR_SENDGRID_API_KEY',
}
const mailer = new SendGridMailer(sendGridOptions)
```

**Sending an Email**

All mailers use the same `send` method signature:

```typescript
const sendOptions: MailerSendOptions = {
	from: 'sender@example.com',
	to: 'recipient@example.com', // or ['recipient1@example.com', 'recipient2@example.com']
	subject: 'Hello from @repo/mailer!',
	html: '<p>This is an HTML email.</p>',
	text: 'This is a plain text email.', // Optional
}

async function sendEmail() {
	try {
		await mailer.send(sendOptions)
		console.log('Email sent successfully!')
	} catch (error) {
		console.error('Failed to send email:', error)
	}
}

sendEmail()
```
