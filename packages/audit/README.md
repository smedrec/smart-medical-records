# @repo/audit

A simple audit logging package designed to capture and queue audit events using Redis and BullMQ. It provides a straightforward way to integrate audit trailing into Node.js applications within the monorepo.

## Features

*   **Asynchronous Event Logging**: Events are added to a BullMQ queue for processing, preventing audit logging from blocking application execution.
*   **Redis Backend**: Leverages Redis for robust and scalable message queuing via BullMQ.
*   **Configurable**: Allows configuration of the BullMQ queue name and Redis connection parameters.
*   **Typed Events**: Uses TypeScript for defined `AuditLogEvent` structures, ensuring consistency.
*   **Environment Variable Support**: Can automatically pick up Redis connection URL from `AUDIT_REDIS_URL` environment variable.

## Installation

### Prerequisites

*   Node.js (version specified in project's `package.json` or `.nvmrc`)
*   pnpm (version specified in project's `package.json` or `engines` field)
*   A running Redis server instance accessible by the application.

### Adding to Your Package

If you are developing another package or application within this monorepo and want to use `@repo/audit`, add it as a dependency:

```bash
pnpm add @repo/audit ioredis bullmq
```

Ensure that `ioredis` and `bullmq` are also listed as direct dependencies in your package, as they are peer dependencies for the proper functioning of `@repo/audit`.

### Environment Variables

*   `AUDIT_REDIS_URL`: (Optional if providing URL directly in constructor) The connection URL for your Redis instance.
    *   Example: `redis://localhost:6379`
    *   Example with password: `redis://:yourpassword@yourhost:6379`

## Usage

### Initializing the Audit Service

```typescript
import { Audit } from '@repo/audit';
import type { AuditLogEvent } from '@repo/audit'; // For typing event details

// Option 1: Provide Redis URL directly
const auditServiceWithUrl = new Audit('my-application-audit-queue', 'redis://localhost:6379');

// Option 2: Rely on AUDIT_REDIS_URL environment variable
// Ensure AUDIT_REDIS_URL is set in your environment
const auditServiceWithEnv = new Audit('my-application-audit-queue');

// Option 3: Provide additional IORedis connection options
const auditServiceWithCustomOptions = new Audit(
  'my-application-audit-queue',
  'redis://localhost:6379',
  {
    // Example: enable TLS
    // tls: {
    //   ca: fs.readFileSync('/path/to/ca.crt'),
    //   key: fs.readFileSync('/path/to/client.key'),
    //   cert: fs.readFileSync('/path/to/client.crt'),
    //   servername: 'your.redis.host.com' // if SNI is required
    // },
    // See IORedis documentation for all available options
    maxRetriesPerRequest: 3, // Override default null
  }
);
```

### Logging an Audit Event

The `log` method is asynchronous and requires `action` and `status` fields in the event details.

```typescript
async function recordUserLogin(userId: string, success: boolean, ipAddress?: string) {
  try {
    await auditServiceWithEnv.log({
      principalId: userId,
      action: 'userLoginAttempt', // Be specific with action names
      status: success ? 'success' : 'failure',
      outcomeDescription: success ? `User ${userId} logged in successfully.` : `User ${userId} login attempt failed.`,
      // Add any other relevant context
      details: {
        ipAddress: ipAddress || 'unknown',
        userAgent: 'some-user-agent/1.0', // Example
      }
    });
    console.log('Audit event logged.');
  } catch (error) {
    console.error('Failed to log audit event:', error);
    // Implement retry logic or fallback if critical
  }
}

// Example usage:
recordUserLogin('user-001', true, '192.168.1.100');
recordUserLogin('user-002', false, '203.0.113.45');
```

### AuditLogEvent Structure

The `AuditLogEvent` interface (from `src/types.ts`) defines the structure of an audit event:

```typescript
export interface AuditLogEvent {
  timestamp: string;          // ISO 8601, auto-generated
  ttl?: string;               // Optional TTL for the event
  principalId?: string;       // User or system initiating the action
  organizationId?: string;    // For multi-tenant systems
  action: string;             // e.g., "userCreate", "documentUpdate" (Required)
  targetResourceType?: string;// e.g., "User", "Document"
  targetResourceId?: string;  // ID of the resource
  status: 'attempt' | 'success' | 'failure'; // Status of the action (Required)
  outcomeDescription?: string;// Detailed outcome
  [key: string]: any;         // For additional context-specific data
}
```

### Closing the Connection

It's important to close the Redis connection gracefully when your application shuts down.

```typescript
async function shutdown() {
  // ... other shutdown logic ...
  await auditServiceWithEnv.closeConnection();
  console.log('Audit service connection closed.');
  process.exit(0);
}

process.on('SIGINT', shutdown); // Example: handle CTRL+C
process.on('SIGTERM', shutdown); // Example: handle kill signals
```

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

*   **ioredis**: A robust, high-performance Redis client for Node.js.
*   **bullmq**: A fast and reliable message queue system for Node.js built on top of Redis.

Version numbers are managed in the root `package.json` and individual package `package.json` files.

## Error Handling

*   **Initialization**: The `Audit` constructor will throw an error if the Redis URL is not provided (either directly or via `AUDIT_REDIS_URL`).
*   **Logging**: The `log` method will throw an error if `action` or `status` are missing from the event details. It will also rethrow errors encountered when trying to add the event to the BullMQ queue (e.g., if Redis becomes unavailable).
*   **Redis Connection**: The service logs Redis connection errors, connection status changes (connect, ready, close, reconnecting) to the console. It does not crash the application on Redis connection errors post-initialization but logs them. Robust applications should monitor these logs.

## How to Contribute

Contributions are welcome! Please follow these general guidelines:

1.  **Bug Reports**: Submit an issue detailing the bug, including steps to reproduce.
2.  **Feature Requests**: Submit an issue describing the proposed feature and its use case.
3.  **Pull Requests**:
    *   Fork the repository and create a new branch for your feature or fix.
    *   Ensure your code adheres to the project's linting and formatting standards.
    *   Write unit tests for any new functionality or bug fixes.
    *   Ensure all tests pass (`pnpm test` within the package, or `pnpm turbo test` from root).
    *   Update documentation (like this README) if your changes affect usage or features.
    *   Submit a pull request with a clear description of your changes.

Refer to the main project's contribution guidelines if available at the root of the monorepo.

## License

This package is licensed under the **MIT License**. See the [LICENSE](../../LICENSE) file in the root of the repository for more details.

## TODOs / Potential Improvements

*   **Dead-letter Queue**: For failed audit log jobs, implement a dead-letter queue mechanism instead of just `removeOnFail: true` for more robust error recovery.
*   **Configurable BullMQ Job Options**: Allow more BullMQ job options (e.g., retry attempts, backoff strategies) to be configured when creating the `Audit` instance or logging an event.
*   **Advanced Redis Error Handling**: Implement more sophisticated Redis error handling within the `Audit` class, potentially including retry logic for disconnections or an event emitter for applications to subscribe to health status changes.
*   **Batch Logging**: For high-throughput scenarios, consider adding a method to log events in batches.
*   **Pluggable Transports**: Abstract the BullMQ/Redis transport to allow for other potential backends in the future (though this significantly increases complexity).
```
