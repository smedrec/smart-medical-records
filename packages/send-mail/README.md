# @repo/send-mail

## Package Title and Description

**@repo/send-mail**: Email Sending Utility Package

This package provides a robust and straightforward way to enqueue email sending tasks using BullMQ and Redis. It's designed to be used in Node.js applications, offering a simple `SendMail` class to abstract the complexities of queue management and Redis interaction for sending emails asynchronously.

## Features

- **Asynchronous Email Queuing**: Leverages BullMQ to send email tasks to a Redis-backed queue.
- **Redis Integration**: Uses `ioredis`. Defaults to a shared connection via `@repo/redis-client` (configured by `REDIS_URL`), but can use `MAIL_REDIS_URL` for a dedicated connection if specified.
- **Connection Management**: Includes methods for gracefully closing BullMQ queues. Dedicated Redis connections are also closed; shared connections are managed globally.
- **Error Handling**: Provides logging for Redis connection issues and queue operations.
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
    - **`REDIS_URL`**: **Primary variable for most uses.** Configures the shared Redis connection used by default.
      Example: `REDIS_URL=redis://shared-redis-host:6379`
    - `MAIL_REDIS_URL`: (Optional, for dedicated connection) Used if `SendMail` is configured to create its own dedicated Redis connection, overriding the shared one.
      Example: `MAIL_REDIS_URL=redis://dedicated-mail-redis:6379`

    Set these in a `.env` file in your application's root and use a library like `dotenv` to load them.

## Usage

Here's a basic example of how to use the `SendMail` class:

```typescript
import { SendMail } from '@repo/send-mail'
import type { SendMailEvent } from '@repo/send-mail' // For typing event details

const MY_MAIL_QUEUE = 'emailProcessingQueue';

// Recommended: Use the shared Redis connection (configured via REDIS_URL)
// Ensure REDIS_URL is set in your environment.
const mailServiceShared = new SendMail(MY_MAIL_QUEUE);

// Advanced Option 1: Provide Redis URL directly for a dedicated connection
// const mailServiceWithUrl = new SendMail(MY_MAIL_QUEUE, 'redis://dedicated-mail-redis:6379');

// Advanced Option 2: Provide an existing ioredis instance
// import { getSharedRedisConnection } from '@repo/redis-client'; // or your own
// const existingRedis = getSharedRedisConnection();
// const mailServiceWithInstance = new SendMail(MY_MAIL_QUEUE, existingRedis);

// Advanced Option 3: Provide Redis URL and custom ioredis options for a dedicated connection
// const mailServiceWithCustomOpts = new SendMail(
//   MY_MAIL_QUEUE,
//   { url: 'redis://localhost:6379', options: { password: 'your-password' } }
// );

async function sendWelcomeEmail(userId: string, userEmail: string) {
	const event: SendMailEvent = {
		principalId: userId, // Using the shared instance from above
		organizationId: 'defaultOrg', // Or your relevant organization ID
		action: 'user_welcome',
		emailDetails: {
			to: userEmail,
			subject: 'Welcome to Our Service!',
			body: '<h1>Hello!</h1><p>Thank you for signing up.</p>',
			// You can use html, text, cc, bcc, from, etc. from MailerSendOptions
		},
	};

	try {
		await mailServiceShared.send(event); // Using the shared instance
		console.log(`Email event for action '${event.action}' enqueued for user ${userId}.`);
	} catch (error) {
		console.error('Failed to enqueue email event:', error);
		// Handle the error appropriately
	}
}

// Example usage:
// sendWelcomeEmail('user-12345', 'test@example.com');

// Closing connections:
// The `closeConnection()` method on a `SendMail` instance closes its BullMQ queue.
// If it's using a dedicated Redis connection, that's closed too.
// Shared Redis connections are managed globally via `@repo/redis-client`.

// async function shutdown() {
//   console.log('Shutting down email service resources...');
//   await mailServiceShared.closeConnection(); // Closes queue, not shared Redis.
//
//   // If you had a dedicated mailServiceWithUrl:
//   // await mailServiceWithUrl.closeConnection(); // Closes queue AND its dedicated Redis.
//
//   // Globally shutdown shared Redis (if used by any service)
//   // import { closeSharedRedisConnection } from '@repo/redis-client';
//   // await closeSharedRedisConnection();
//   console.log('Email service resources/queues closed.');
//   process.exit(0);
// }

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
