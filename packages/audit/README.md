# @repo/audit

A simple audit logging package designed to capture and queue audit events using Redis and BullMQ. It provides a straightforward way to integrate audit trailing into Node.js applications within the monorepo.

## Features

- **Asynchronous Event Logging**: Events are added to a BullMQ queue for processing, preventing audit logging from blocking application execution.
- **Redis Backend**: Leverages Redis for robust and scalable message queuing via BullMQ.
- **Configurable**: Allows configuration of the BullMQ queue name and Redis connection parameters.
- **Typed Events**: Uses TypeScript for defined `AuditLogEvent` structures, ensuring consistency.
- **Environment Variable Support**: Defaults to using a shared Redis connection configured via `REDIS_URL` (from `@repo/redis-client`). Can also use `AUDIT_REDIS_URL` for a dedicated connection if explicitly configured.

## Installation

### Prerequisites

- Node.js (version specified in project's `package.json` or `.nvmrc`)
- pnpm (version specified in project's `package.json` or `engines` field)
- A running Redis server instance accessible by the application.

### Adding to Your Package

If you are developing another package or application within this monorepo and want to use `@repo/audit`, add it as a dependency:

```bash
pnpm add @repo/audit ioredis bullmq
```

Ensure that `ioredis` and `bullmq` are also listed as direct dependencies in your package, as they are peer dependencies for the proper functioning of `@repo/audit`.

### Environment Variables

- **`REDIS_URL`**: **Recommended for most use cases.** This is used by the default shared Redis connection managed by `@repo/redis-client`.
  - Example: `REDIS_URL=redis://username:password@shared-redis-host:6379`
- `AUDIT_REDIS_URL`: (Optional, for dedicated connection) The connection URL for a specific Redis instance if you choose *not* to use the shared connection. This is only used if the `Audit` service is instantiated without explicit connection parameters, forcing it to create its own connection.
  - Example: `AUDIT_REDIS_URL=redis://localhost:6379`

## Usage

### Initializing the Audit Service

```typescript
import { Audit } from '@repo/audit'
import type { AuditLogEvent } from '@repo/audit' // For typing event details

// Recommended: Use the shared Redis connection (configured via REDIS_URL)
// Ensure REDIS_URL is set in your environment.
const auditServiceShared = new Audit('my-application-audit-queue');

// Advanced Option 1: Provide Redis URL directly for a dedicated connection
const auditServiceWithUrl = new Audit('my-application-audit-queue', 'redis://dedicated-audit-redis:6379');

// Advanced Option 2: Rely on AUDIT_REDIS_URL for a dedicated connection
// Ensure AUDIT_REDIS_URL is set and REDIS_URL might be ignored or used by other services.
// This is invoked if you instantiate Audit with only the queue name and the internal logic
// attempts to create a direct connection (less common with the new shared client default).
// const auditServiceWithEnvVar = new Audit('my-application-audit-queue'); // Behavior depends on internal fallback logic if shared client fails or direct is forced by other params.

// Advanced Option 3: Provide an existing ioredis instance
// import { getSharedRedisConnection } from '@repo/redis-client'; // or your own instance
// const existingRedisConnection = getSharedRedisConnection(); // Example
// const auditServiceWithInstance = new Audit('my-application-audit-queue', existingRedisConnection);


// Advanced Option 4: Provide additional IORedis connection options for a dedicated connection
const auditServiceWithCustomOptions = new Audit(
	'my-application-audit-queue',
	{ url: 'redis://localhost:6379' }, // Can pass options object
	{
		// Example: enable TLS
		// tls: {
		//   ca: fs.readFileSync('/path/to/ca.crt'),
		//   key: fs.readFileSync('/path/to/client.key'),
		//   cert: fs.readFileSync('/path/to/client.crt'),
		//   servername: 'your.redis.host.com' // if SNI is required
		// },
		maxRetriesPerRequest: 3, // Override default null for the dedicated connection
	}
);
```

### Logging an Audit Event

The `log` method is asynchronous and requires `action` and `status` fields in the event details.

```typescript
async function recordUserLogin(userId: string, success: boolean, ipAddress?: string) {
	try {
		// Using the shared connection instance from the example above
		await auditServiceShared.log({
			principalId: userId,
			action: 'userLoginAttempt', // Be specific with action names
			status: success ? 'success' : 'failure',
			outcomeDescription: success
				? `User ${userId} logged in successfully.`
				: `User ${userId} login attempt failed.`,
			// Add any other relevant context
			details: {
				ipAddress: ipAddress || 'unknown',
				userAgent: 'some-user-agent/1.0', // Example
			},
		});
		console.log('Audit event logged.');
	} catch (error) {
		console.error('Failed to log audit event:', error);
		// Implement retry logic or fallback if critical
	}
}

// Example usage:
// recordUserLogin('user-001', true, '192.168.1.100');
// recordUserLogin('user-002', false, '203.0.113.45');
```

### AuditLogEvent Structure

The `AuditLogEvent` interface (from `src/types.ts`) defines the structure of an audit event:

```typescript
export interface AuditLogEvent {
	timestamp: string // ISO 8601, auto-generated
	ttl?: string // Optional TTL for the event
	principalId?: string // User or system initiating the action
	organizationId?: string // For multi-tenant systems
	action: string // e.g., "userCreate", "documentUpdate" (Required)
	targetResourceType?: string // e.g., "User", "Document"
	targetResourceId?: string // ID of the resource
	status: 'attempt' | 'success' | 'failure' // Status of the action (Required)
	outcomeDescription?: string // Detailed outcome
	[key: string]: any // For additional context-specific data
}
```

### Closing the Connection

The `closeConnection()` method on an `Audit` instance will close the associated BullMQ queue.
- If the `Audit` instance is using a **dedicated Redis connection** (one it created itself), it will also close that Redis connection.
- If the `Audit` instance is using the **shared Redis connection** (from `@repo/redis-client`), it **will not** close the shared connection. The shared connection should be closed globally at application shutdown using `closeSharedRedisConnection` from `@repo/redis-client`.

```typescript
// For an audit service using a dedicated connection:
// await auditServiceWithUrl.closeConnection();
// console.log('Audit service with dedicated connection closed.');

// For an audit service using the shared connection:
// await auditServiceShared.closeConnection(); // This only closes the BullMQ queue for this instance.
// console.log('Audit service (shared connection) queue resources released.');
//
// // At application shutdown, close the shared Redis connection:
// import { closeSharedRedisConnection } from '@repo/redis-client';
// await closeSharedRedisConnection();
// console.log('Shared Redis connection closed.');
```

It's important to manage connection lifecycles appropriately based on how the `Audit` service is initialized.

## Project Structure

```
packages/audit/
├── README.md               # This file
├── package.json            # Package manifest
├── tsconfig.json           # TypeScript configuration
├── vitest.config.ts        # Vitest test runner configuration
└── src/
    ├── audit.ts            # Core Audit class implementation
    ├── audit.test.ts       # Unit tests for Audit class
    ├── index.ts            # Main export point for the package
    └── types.ts            # TypeScript type definitions (AuditLogEvent, etc.)
```

## Dependencies

- **@repo/redis-client**: Provides shared Redis connection management.
- **ioredis**: A robust, high-performance Redis client for Node.js.
- **bullmq**: A fast and reliable message queue system for Node.js built on top of Redis.

Version numbers are managed in the root `package.json` and individual package `package.json` files.

## Error Handling

- **Initialization**:
  - If using the shared connection, errors from `@repo/redis-client` (e.g., invalid `REDIS_URL`) will propagate.
  - If creating a dedicated connection, the `Audit` constructor will throw an error if a Redis URL is required but cannot be resolved (e.g., from `AUDIT_REDIS_URL` if used as fallback) or if `ioredis` fails to instantiate.
- **Logging**: The `log` method will throw an error if `action` or `status` are missing. It also rethrows errors from BullMQ if adding to the queue fails.
- **Redis Connection**:
  - The shared client (`@repo/redis-client`) manages its own connection logging and error handling.
  - For dedicated connections, the `Audit` service logs Redis connection events (errors, connect, close, etc.) to the console.

Robust applications should monitor these logs and handle errors from `log` calls appropriately.

## How to Contribute

Contributions are welcome! Please follow these general guidelines:

1.  **Bug Reports**: Submit an issue detailing the bug, including steps to reproduce.
2.  **Feature Requests**: Submit an issue describing the proposed feature and its use case.
3.  **Pull Requests**:
    - Fork the repository and create a new branch for your feature or fix.
    - Ensure your code adheres to the project's linting and formatting standards.
    - Write unit tests for any new functionality or bug fixes.
    - Ensure all tests pass (`pnpm test` within the package, or `pnpm turbo test` from root).
    - Update documentation (like this README) if your changes affect usage or features.
    - Submit a pull request with a clear description of your changes.

Refer to the main project's contribution guidelines if available at the root of the monorepo.

## License

This package is licensed under the **MIT License**. See the [LICENSE](../../LICENSE) file in the root of the repository for more details.

## TODOs / Potential Improvements

- **Dead-letter Queue**: For failed audit log jobs, implement a dead-letter queue mechanism instead of just `removeOnFail: true` for more robust error recovery.
- **Configurable BullMQ Job Options**: Allow more BullMQ job options (e.g., retry attempts, backoff strategies) to be configured when creating the `Audit` instance or logging an event.
- **Advanced Redis Error Handling**: Implement more sophisticated Redis error handling within the `Audit` class, potentially including retry logic for disconnections or an event emitter for applications to subscribe to health status changes.
- **Batch Logging**: For high-throughput scenarios, consider adding a method to log events in batches.
- **Pluggable Transports**: Abstract the BullMQ/Redis transport to allow for other potential backends in the future (though this significantly increases complexity).

```

```
