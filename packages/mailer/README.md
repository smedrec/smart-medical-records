# @repo/mailer

A shared package for sending emails via different providers, offering a unified interface for NodeMailer (SMTP), Resend, and SendGrid.

## Features

- Supports multiple email providers:
  - NodeMailer (SMTP)
  - Resend
  - SendGrid
- Common interface (`MailerProvider`) for sending emails.
- Type-safe configuration and send options.
- Detailed error reporting specific to each provider.
- Includes a `close()` method for `NodeMailer` to gracefully shut down SMTP connections.

## Installation

This package is intended for use within a monorepo structure (e.g., using pnpm workspaces). It's a private package and not meant to be published independently.

To install dependencies for the entire monorepo (which would include this package):

```bash
pnpm install
```

If you were to use it as a standalone package (hypothetically, as it's private):

```bash
npm install @repo/mailer
# or
yarn add @repo/mailer
# or
pnpm add @repo/mailer
```

### Prerequisites

Ensure you have the necessary API keys or SMTP credentials for the email provider(s) you intend to use.

- **NodeMailer (SMTP)**: SMTP server details (host, port, auth credentials).
- **Resend**: Resend API Key.
- **SendGrid**: SendGrid API Key.

## Usage

First, import the desired mailer class and its options type, along with the common `MailerSendOptions`.

```typescript
import { NodeMailer, ResendMailer, SendGridMailer } from '@repo/mailer'

import type {
	MailerSendOptions,
	NodeMailerSmtpOptions,
	ResendMailerOptions,
	SendGridMailerOptions,
} from '@repo/mailer'
```

### NodeMailer (SMTP)

```typescript
const smtpOptions: NodeMailerSmtpOptions = {
	host: 'smtp.example.com',
	port: 587,
	secure: false, // true for 465, false for other ports
	auth: {
		user: 'your-smtp-user',
		pass: 'your-smtp-password',
	},
}

const nodeMailer = new NodeMailer(smtpOptions)

const emailOptions: MailerSendOptions = {
	from: 'sender@example.com',
	to: 'recipient@example.com',
	subject: 'Hello from NodeMailer!',
	html: '<p>This is an email sent via NodeMailer.</p>',
	text: 'This is an email sent via NodeMailer.',
}

async function sendEmailWithNodeMailer() {
	try {
		await nodeMailer.send(emailOptions)
		console.log('Email sent successfully with NodeMailer!')
	} catch (error) {
		console.error('Failed to send email with NodeMailer:', error)
	} finally {
		nodeMailer.close() // Important for graceful shutdown
	}
}

sendEmailWithNodeMailer()
```

### Resend

```typescript
const resendOptions: ResendMailerOptions = {
	apiKey: 'your-resend-api-key',
}

const resendMailer = new ResendMailer(resendOptions)

const emailOptionsResend: MailerSendOptions = {
	from: 'sender@example.com', // Must be a verified domain on Resend
	to: 'recipient@example.com',
	subject: 'Hello from Resend!',
	html: '<p>This is an email sent via Resend.</p>',
	text: 'This is an email sent via Resend.',
}

async function sendEmailWithResend() {
	try {
		await resendMailer.send(emailOptionsResend)
		console.log('Email sent successfully with Resend!')
	} catch (error) {
		console.error('Failed to send email with Resend:', error)
	}
}

sendEmailWithResend()
```

### SendGrid

```typescript
const sendGridOptions: SendGridMailerOptions = {
	apiKey: 'your-sendgrid-api-key',
}

const sendGridMailer = new SendGridMailer(sendGridOptions)

const emailOptionsSendGrid: MailerSendOptions = {
	from: 'sender@example.com', // Must be a verified sender or domain on SendGrid
	to: 'recipient@example.com',
	subject: 'Hello from SendGrid!',
	html: '<p>This is an email sent via SendGrid.</p>',
	text: 'This is an email sent via SendGrid.',
}

async function sendEmailWithSendGrid() {
	try {
		await sendGridMailer.send(emailOptionsSendGrid)
		console.log('Email sent successfully with SendGrid!')
	} catch (error) {
		console.error('Failed to send email with SendGrid:', error)
	}
}

sendEmailWithSendGrid()
```

## Project Structure

```
packages/mailer/
├── src/
│   ├── email/
│   │   ├── base.ts         # Defines common interfaces (MailerProvider, MailerSendOptions)
│   │   ├── node.ts         # NodeMailer (SMTP) implementation
│   │   ├── resend.ts       # Resend implementation
│   │   └── sendgrid.ts     # SendGrid implementation
│   ├── test/
│   │   └── mailer.test.ts  # Unit tests for the mailer providers
│   └── index.ts            # Main entry point, exports all providers and types
├── package.json            # Package manifest, scripts, and dependencies
├── tsconfig.json           # TypeScript configuration
├── README.md               # This file
└── ...                     # Other configuration files (linting, etc.)
```

## Dependencies

This package relies on the following external libraries (versions as per `package.json` at the time of writing):

- `@sendgrid/mail`: ^8.1.5
- `nodemailer`: ^7.0.4
- `resend`: ^4.6.0

DevDependencies include TypeScript, Vitest for testing, ESLint, etc. (see `package.json` for a full list).

## How to Contribute

Contributions are welcome! Please follow these guidelines:

- **Bug Reports**: If you find a bug, please open an issue detailing the problem, steps to reproduce, and expected behavior.
- **Feature Requests**: Open an issue to discuss new features or improvements.
- **Pull Requests**:
  1.  Fork the repository (if applicable, or create a branch in the main repo).
  2.  Create a new branch for your feature or bug fix.
  3.  Make your changes, ensuring code is well-formatted and includes tests.
  4.  Ensure all tests pass (`pnpm --filter @repo/mailer test`).
  5.  Submit a pull request with a clear description of your changes.

## License

This project is licensed under the MIT License.

It is assumed that a `LICENSE` file containing the MIT License text exists at the root of the monorepo. If not, one should be added.

Example MIT License text:

```
MIT License

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

Replace `[year]` and `[fullname]` accordingly.

## Examples

The [Usage](#usage) section provides clear examples for each mailer provider. Additionally, the unit tests in `src/test/mailer.test.ts` demonstrate how each mailer is instantiated and used, including mock setups for testing.

---

_Internal Notes / TODOs for Maintainability:_

- The recent refactor improved error detail propagation. Continue to monitor underlying SDK changes to ensure error information remains comprehensive.
- Keep JSDoc comments and this README up-to-date with any significant changes to interfaces, implementations, or dependencies.

```

```
