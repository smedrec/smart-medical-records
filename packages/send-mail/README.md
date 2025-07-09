# @repo/send-mail

## Package Title and Description

**@repo/send-mail**: Email Sending Utility Package

This package provides a robust and straightforward way to enqueue email sending tasks using BullMQ and Redis. It's designed to be used in Node.js applications, offering a simple `SendMail` class to abstract the complexities of queue management and Redis interaction for sending emails asynchronously.

## Features

- **Asynchronous Email Queuing**: Leverages BullMQ to send email tasks to a Redis-backed queue, preventing email sending from blocking main application threads.
- **Redis Integration**: Uses `ioredis` for efficient communication with a Redis server.
- **Environment Variable Configuration**: Supports Redis URL configuration via environment variables (`MAIL_REDIS_URL`) for flexibility across different environments.
- **Connection Management**: Includes methods for gracefully closing Redis connections during application shutdown.
- **Error Handling**: Provides basic error handling and logging for Redis connection issues and queue operations.
- **Telemetry Ready**: Integrates `bullmq-otel` for OpenTelemetry (though specific OTLP exporter setup like `producer.inst.otlp.ts` is for demonstration and may need separate operational management).
- **Typed**: Written in TypeScript with JSDoc comments for better developer experience and type safety.

## Installation

### Prerequisites

- Node.js (Version specified in root `package.json` or project requirements, e.g., >=18.x)
- pnpm (Package manager used in this monorepo)
- A running Redis server instance (e.g., Redis v5.x or later).

### Steps

1.  **Ensure Redis is running and accessible.**
    Make a note of your Redis connection URL (e.g., `redis://localhost:6379`).

2.  **Install dependencies from the monorepo root:**
    If you haven't already, install all monorepo dependencies:

    ```bash
    pnpm install
    ```

    This package (`@repo/send-mail`) will be installed as part of the workspace.

3.  **Set up Environment Variables (Recommended):**
    For ease of configuration, it's recommended to set the `MAIL_REDIS_URL` environment variable. You can do this by creating a `.env` file in the root of your application that uses this package (not within `@repo/send-mail` itself), and load it using a library like `dotenv`.

    Example `.env` file content:

    ```env
    MAIL_REDIS_URL=redis://your-redis-host:your-redis-port
    ```

## Usage

Here's a basic example of how to use the `SendMail` class:

```typescript
import { SendMail } from '@repo/send-mail'

import type { SendMailEvent } from '@repo/send-mail' // For typing event details

// Define your queue name
const MY_MAIL_QUEUE = 'emailProcessingQueue'

// Option 1: Using environment variable MAIL_REDIS_URL
// Ensure MAIL_REDIS_URL is set in your environment.
const mailService = new SendMail(MY_MAIL_QUEUE)

// Option 2: Providing Redis URL directly
// const mailService = new SendMail(MY_MAIL_QUEUE, 'redis://localhost:6379');

// Option 3: Providing Redis URL and custom ioredis options
// const mailService = new SendMail(MY_MAIL_QUEUE, 'redis://localhost:6379', {
//   password: 'your-redis-password',
//   // other ioredis options
// });

async function sendWelcomeEmail(userId: string, userEmail: string) {
	const event: SendMailEvent = {
		principalId: userId,
		organizationId: 'defaultOrg', // Or your relevant organization ID
		action: 'user_welcome',
		emailDetails: {
			to: userEmail,
			subject: 'Welcome to Our Service!',
			body: '<h1>Hello!</h1><p>Thank you for signing up.</p>',
			// You can use html, text, cc, bcc, from, etc. from MailerSendOptions
		},
	}

	try {
		await mailService.send(event)
		console.log(`Email event for action '${event.action}' enqueued for user ${userId}.`)
	} catch (error) {
		console.error('Failed to enqueue email event:', error)
		// Handle the error appropriately (e.g., retry logic, logging to a monitoring service)
	}
}

// Example usage:
// sendWelcomeEmail('user-12345', 'test@example.com');

// Remember to close the connection when your application shuts down:
async function shutdown() {
	console.log('Shutting down email service...')
	await mailService.closeConnection()
	console.log('Email service shutdown complete.')
	process.exit(0)
}

// process.on('SIGTERM', shutdown);
// process.on('SIGINT', shutdown);
```

A separate worker process (not part of this package) would then listen to this BullMQ queue (`emailProcessingQueue` in the example) to actually process the jobs and send the emails using a mailer library (like the one potentially provided by `@repo/mailer`).

## Project Structure

A brief overview of the main files and directories within `packages/send-mail`:

```
packages/send-mail/
├── src/
│   ├── index.ts            # Main export point for the package.
│   ├── mail.ts             # Contains the SendMail class and its logic.
│   ├── mail.test.ts        # Unit tests for the SendMail class.
│   ├── producer.inst.otlp.ts # Example OpenTelemetry producer instantiation (for tracing/metrics, may require specific setup).
│   └── types.ts            # TypeScript type definitions (e.g., SendMailEvent).
├── package.json            # NPM package manifest, including dependencies.
├── tsconfig.json           # TypeScript configuration for the package.
├── vitest.config.ts        # Vitest test runner configuration.
└── README.md               # This file.
```

## Dependencies

This package relies on several external libraries:

- **`bullmq`**: (version `5.56.1`) - Robust, fast and Redis-based queue system for Node.
- **`bullmq-otel`**: (version `1.0.1`) - OpenTelemetry instrumentation for BullMQ.
- **`ioredis`**: (version `5.6.1`) - A robust, performance-focused and full-featured Redis client for Node.js.
- **`@opentelemetry/exporter-metrics-otlp-proto`**: (version `0.202.0`) - OTLP metric exporter.
- **`@opentelemetry/exporter-trace-otlp-proto`**: (version `0.202.0`) - OTLP trace exporter.
- **`@opentelemetry/sdk-metrics`**: (version `2.0.1`) - OpenTelemetry Metrics SDK.
- **`@opentelemetry/sdk-node`**: (version `0.202.0`) - OpenTelemetry Node.js SDK.
- **`@repo/hono-helpers`**: (workspace:\*) - Workspace dependency (purpose may vary).
- **`@repo/mailer`**: (workspace:\*) - Workspace dependency, likely providing `MailerSendOptions` type and email sending capabilities for the consumer.

Dev Dependencies include `typescript`, `vitest`, `tsup`, and various ESLint/TypeScript configurations from the monorepo.

## How to Contribute

Contributions are welcome! Please follow these guidelines:

1.  **Bug Reports**: If you find a bug, please open an issue on the project's issue tracker. Include a clear description of the issue, steps to reproduce, and expected behavior.
2.  **Feature Requests**: Open an issue to discuss new features or improvements.
3.  **Pull Requests**:
    - Ensure your code adheres to the existing coding style and conventions (ESLint and Prettier are used).
    - Write unit tests for any new functionality or bug fixes.
    - Ensure all tests pass (`pnpm test` within the package directory).
    - Update documentation (README.md, JSDoc comments) as necessary.
    - Follow the monorepo's contribution guidelines if available (e.g., regarding commit messages, changeset).

## License

This project is licensed under the **MIT License**. See the [LICENSE](../../LICENSE) file in the root of the monorepo for more details.

## TODO / Potential Improvements

- **Configurable Job Options**: Allow `removeOnComplete` and `removeOnFail` job options in `send()` to be configurable, perhaps via constructor options.
- **Advanced Redis Error Handling**: Implement more sophisticated error handling for Redis connection issues, such as emitting status events that consuming applications can subscribe to.
- **Telemetry Configuration**: Make OpenTelemetry (`BullMQOtel`) integration more configurable or optional. The current `producer.inst.otlp.ts` is an example instantiation and not directly used by the `SendMail` class itself.
- **Dead Letter Queue (DLQ) Strategy**: While BullMQ supports it, this package doesn't explicitly configure or document a DLQ strategy for failed jobs. This would typically be part of the worker setup.
- **More Granular Logging Control**: Allow passing a custom logger instance or configuring log levels.

```

```
