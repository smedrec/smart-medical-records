# @repo/redis-client

This package provides a shared Redis connection manager for use across different packages in the monorepo. It ensures that a single Redis connection is established and reused, preventing an excessive number of connections to the Redis server.

## Features

- Singleton pattern for Redis connection.
- Graceful connection closing.
- Configuration via environment variables (`REDIS_URL`).
- Exports `ioredis` types for convenience.

## Usage

### Getting the Shared Connection

To use the shared Redis connection, import `getSharedRedisConnection` from this package:

```typescript
import { getSharedRedisConnection } from '@repo/redis-client';

// Get the shared Redis instance
const redis = getSharedRedisConnection();

// Use the redis instance as needed
await redis.set('mykey', 'myvalue');
const value = await redis.get('mykey');
console.log(value);
```

The connection is established when `getSharedRedisConnection` is called for the first time. Subsequent calls will return the same connection instance.

### Redis URL Configuration

The Redis connection URL is determined by the `REDIS_URL` environment variable. If this variable is not set, it defaults to `redis://127.0.0.1:6379`.

Example `REDIS_URL`:
`redis://username:password@your-redis-host:6379`

### Closing the Connection

It's important to close the shared connection gracefully when your application is shutting down:

```typescript
import { closeSharedRedisConnection } from '@repo/redis-client';

// ... during application shutdown
await closeSharedRedisConnection();
```

### Checking Connection Status

You can get the current status of the connection:

```typescript
import { getRedisConnectionStatus } from '@repo/redis-client';

const status = getRedisConnectionStatus(); // e.g., 'ready', 'connecting', 'uninitialized'
console.log('Redis connection status:', status);
```

## For BullMQ

When using this shared connection with BullMQ, you can pass the connection instance to BullMQ's `Queue` or `Worker` options:

```typescript
import { Queue } from 'bullmq';
import { getSharedRedisConnection } from '@repo/redis-client';

const redisConnection = getSharedRedisConnection();

const myQueue = new Queue('my-queue-name', {
  connection: redisConnection,
  // other BullMQ options...
});

// ...
```

This ensures BullMQ uses the shared connection. Remember that the `Audit` and `SendMail` packages will be updated to use this shared client internally.
