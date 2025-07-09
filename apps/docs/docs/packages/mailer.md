# Mailer Package (@repo/mailer)

The `@repo/mailer` package provides a unified interface for sending emails through various providers. It's designed to be flexible and usable in different JavaScript environments, including Node.js and Cloudflare Workers.

## Table of Contents

- [Installation](#installation)
- [Core Concepts](#core-concepts)
  - [MailerProvider Interface](#mailerprovider-interface)
  - [MailerSendOptions](#mailersendoptions)
- [Available Providers](#available-providers)
  - [NodeMailer (SMTP)](#nodemailer-smtp)
    - [Configuration (NodeMailerSmtpOptions)](#configuration-nodemailersmtpoptions)
    - [Usage Example](#usage-example)
  - [WorkersMailer (SMTP for Cloudflare Workers)](#workersmailer-smtp-for-cloudflare-workers)
    - [Configuration (WorkerMailerOptions)](#configuration-workermaileroptions)
    - [Usage Example](#usage-example-1)
    - [DKIM Signing](#dkim-signing)
  - [ResendMailer](#resendmailer)
    - [Configuration (ResendMailerOptions)](#configuration-resendmaileroptions)
    - [Usage Example](#usage-example-2)
  - [SendGridMailer](#sendgridmailer)
    - [Configuration (SendGridMailerOptions)](#configuration-sendgridmaileroptions)
    - [Usage Example](#usage-example-3)
- [Choosing a Provider](#choosing-a-provider)
- [Error Handling](#error-handling)
- [Advanced Usage](#advanced-usage)
  - [Dynamic Provider Selection](#dynamic-provider-selection)
- [Contributing](#contributing)

## Installation

To use this package in your application or another package within the monorepo:

```bash
pnpm add '@repo/mailer@workspace:*'
# or
# yarn add '@repo/mailer@workspace:*'
# npm install '@repo/mailer@workspace:*'
```

## Core Concepts

### `MailerProvider` Interface

All mailer classes implement the `MailerProvider` interface, which defines a single method:

```typescript
interface MailerProvider {
	send(options: MailerSendOptions): Promise<void>
}
```

This ensures that switching between providers is seamless, as the method for sending emails remains consistent.

### `MailerSendOptions`

The `send` method across all providers accepts an object of type `MailerSendOptions`:

```typescript
interface MailerSendOptions {
	from: string // Sender's email address
	to: string | string[] // Recipient's email address or an array of addresses
	subject: string // Email subject
	html: string // HTML content of the email
	text?: string // Optional plain text content of the email
}
```

## Available Providers

### NodeMailer (SMTP)

Uses the popular `nodemailer` library for sending emails via SMTP. Suitable for Node.js environments.

#### Configuration (`NodeMailerSmtpOptions`)

These are the standard `nodemailer` SMTP transport options.

```typescript
import type { NodeMailerSmtpOptions } from '@repo/mailer'

const nodeMailerConfig: NodeMailerSmtpOptions = {
	host: 'smtp.example.com',
	port: 587, // Or 465 for SSL
	secure: false, // true for 465, false for other ports like 587 (STARTTLS)
	auth: {
		user: 'your-smtp-username',
		pass: 'your-smtp-password',
	},
	// Other nodemailer options can be added here
}
```

#### Usage Example

```typescript
import { NodeMailer } from '@repo/mailer'

import type { MailerSendOptions, NodeMailerSmtpOptions } from '@repo/mailer'

const config: NodeMailerSmtpOptions = {
	/* ... your config ... */
}
const mailer = new NodeMailer(config)

const emailDetails: MailerSendOptions = {
	from: 'no-reply@yourdomain.com',
	to: 'recipient@example.com',
	subject: 'Test Email from NodeMailer',
	html: '<h1>Hello World!</h1><p>This is a test email sent via NodeMailer.</p>',
	text: 'Hello World! This is a test email sent via NodeMailer.',
}

mailer
	.send(emailDetails)
	.then(() => console.log('Email sent successfully using NodeMailer!'))
	.catch((error) => console.error('NodeMailer send error:', error))
```

### WorkersMailer (SMTP for Cloudflare Workers)

Uses the `worker-mailer` library, which is specifically designed for sending emails from Cloudflare Workers environments where traditional Node.js SMTP modules might have compatibility issues.

#### Configuration (`WorkerMailerOptions`)

```typescript
import type { WorkerMailerOptions } from '@repo/mailer'

const workersMailerConfig: WorkerMailerOptions = {
	host: 'smtp.yourprovider.com',
	port: 587, // Or 465, 25
	secure: false, // Set to true if port is 465
	auth: {
		user: 'your-smtp-username',
		pass: 'your-smtp-password',
	},
	from: 'default-from@yourdomain.com', // Default from address if not specified in send options
	// Optional DKIM configuration
	dkim: {
		privateKey: `-----BEGIN PRIVATE KEY-----\nYOUR_DKIM_PRIVATE_KEY\n-----END PRIVATE KEY-----`,
		domainName: 'yourdomain.com',
		keySelector: 'default', // Your DKIM selector
	},
}
```

**Note on `secure` option**: For `worker-mailer`, the `secure` option behaves slightly differently than `nodemailer`. If `port` is 465, `secure` is implicitly true. For other ports like 587 (STARTTLS), `secure` should generally be `false` as `worker-mailer` handles STARTTLS automatically.

#### Usage Example

```typescript
import { WorkersMailer } from '@repo/mailer'

import type { MailerSendOptions, WorkerMailerOptions } from '@repo/mailer'

const config: WorkerMailerOptions = {
	/* ... your config ... */
}
const mailer = new WorkersMailer(config)

const emailDetails: MailerSendOptions = {
	from: 'worker-sender@yourdomain.com', // Overrides default if set in config
	to: 'recipient@example.com',
	subject: 'Test Email from WorkersMailer',
	html: '<h1>Hello from a Cloudflare Worker!</h1>',
}

// Within your Worker's fetch handler or scheduled event:
// await mailer.send(emailDetails);
// console.log('Email sent successfully using WorkersMailer!');
```

#### DKIM Signing

`WorkersMailer` supports DKIM signing. Provide the `dkim` object in the configuration with your private key, domain name, and key selector. Ensure your DNS records are correctly set up for DKIM.

### ResendMailer

Integrates with the Resend API for sending emails.

#### Configuration (`ResendMailerOptions`)

```typescript
import type { ResendMailerOptions } from '@repo/mailer'

const resendConfig: ResendMailerOptions = {
	apiKey: 'YOUR_RESEND_API_KEY', // Obtain from your Resend dashboard
}
```

#### Usage Example

```typescript
import { ResendMailer } from '@repo/mailer'

import type { MailerSendOptions, ResendMailerOptions } from '@repo/mailer'

const config: ResendMailerOptions = { apiKey: 're_yourActualApiKey' }
const mailer = new ResendMailer(config)

const emailDetails: MailerSendOptions = {
	from: 'onboarding@resend.dev', // Must be a verified domain/sender in Resend
	to: 'recipient@example.com',
	subject: 'Test Email from ResendMailer',
	html: '<h1>Hello from Resend!</h1>',
}

mailer
	.send(emailDetails)
	.then(() => console.log('Email sent successfully using ResendMailer!'))
	.catch((error) => console.error('ResendMailer send error:', error))
```

### SendGridMailer

Integrates with the SendGrid API for sending emails.

#### Configuration (`SendGridMailerOptions`)

```typescript
import type { SendGridMailerOptions } from '@repo/mailer'

const sendGridConfig: SendGridMailerOptions = {
	apiKey: 'YOUR_SENDGRID_API_KEY', // Obtain from your SendGrid dashboard
}
```

#### Usage Example

```typescript
import { SendGridMailer } from '@repo/mailer'

import type { MailerSendOptions, SendGridMailerOptions } from '@repo/mailer'

const config: SendGridMailerOptions = { apiKey: 'SG.yourActualApiKey' }
const mailer = new SendGridMailer(config)

const emailDetails: MailerSendOptions = {
	from: 'verified-sender@yourdomain.com', // Must be a verified sender in SendGrid
	to: 'recipient@example.com',
	subject: 'Test Email from SendGridMailer',
	html: '<h1>Hello from SendGrid!</h1>',
}

mailer
	.send(emailDetails)
	.then(() => console.log('Email sent successfully using SendGridMailer!'))
	.catch((error) => console.error('SendGridMailer send error:', error))
```

## Choosing a Provider

- **NodeMailer**: Best for traditional Node.js applications where you have direct access to SMTP servers or services like Amazon SES (via SMTP).
- **WorkersMailer**: Essential for Cloudflare Workers environments due to limitations with standard Node.js TCP socket-based libraries.
- **Resend/SendGrid**: Good choices if you prefer using a dedicated email API provider, which often offer better deliverability, analytics, and template management. They are also suitable for serverless environments where managing SMTP connections can be complex.

## Error Handling

Each provider's `send` method returns a `Promise`. If an error occurs during the sending process, the promise will be rejected. It's crucial to implement `.catch()` blocks to handle these errors appropriately.

The error messages are generally prefixed with the mailer's name (e.g., "NodeMailer: Failed to send email...") to help identify the source of the error. API-based mailers (Resend, SendGrid) may include more specific error details from the API response.

```typescript
try {
	await mailer.send(emailDetails)
	console.log('Email sent!')
} catch (error) {
	console.error('Detailed error:', error)
	// You might want to log this error to a monitoring service
}
```

## Advanced Usage

### Dynamic Provider Selection

You can dynamically choose a mailer provider based on environment variables or other configuration.

```typescript
import { NodeMailer, ResendMailer, WorkersMailer } from '@repo/mailer'

import type { MailerProvider } from '@repo/mailer'

function getMailer(): MailerProvider {
	const providerType = process.env.EMAIL_PROVIDER // e.g., 'nodemailer', 'workersmailer', 'resend'
	const apiKey = process.env.EMAIL_API_KEY
	const smtpHost = process.env.SMTP_HOST
	// ... other config from env

	if (providerType === 'resend' && apiKey) {
		return new ResendMailer({ apiKey })
	} else if (providerType === 'workersmailer' && smtpHost /* ... other smtpConfig */) {
		// return new WorkersMailer({ /* ... construct WorkerMailerOptions ... */ });
	}
	// Fallback to NodeMailer or throw error
	// return new NodeMailer({ /* ... construct NodeMailerSmtpOptions ... */ });
	throw new Error('Email provider not configured correctly.')
}

// const mailer = getMailer();
// mailer.send(...);
```

## Contributing

Contributions to improve the `@repo/mailer` package are welcome. Please ensure that:

- New providers implement the `MailerProvider` interface.
- Configuration options are clearly typed and documented.
- Unit tests are added for new functionality.
- The existing code style is followed.

```

```
