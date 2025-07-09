# @repo/logger

A reusable TypeScript package for robust logging with features like custom levels, Sentry integration for error tracking, and in-memory log buffering. It uses `pino` for high-performance logging and `pino-pretty` for development-friendly console output.

## Features

- **Customizable Log Levels**: Supports standard levels (fatal, error, warn, info, debug, trace) and additional custom levels (log, progress, success).
- **Pretty Console Output**: Integrates `pino-pretty` for colorized and human-readable logs in development (disabled when `LOG_JSON_FORMAT=true`).
- **Sentry Integration**: Automatically captures exceptions and sends them to Sentry (configurable via environment variables).
- **In-Memory Log Buffering**: Keeps a configurable number of recent log entries in memory, accessible for debugging purposes (Node.js environment only).
- **Dynamic Log Filtering**: Filters certain verbose logs (e.g., service registration messages) unless in debug mode (`LOG_LEVEL=debug`) or diagnostic mode (`LOG_DIAGNOSTIC=true`).
- **JSON Output Option**: Can output logs in JSON format for production environments (`LOG_JSON_FORMAT=true`).
- **Instance Creation**: Allows creation of new logger instances with specific bindings.

## Installation

To install the `@repo/logger` package, navigate to your project root and run:

```bash
# Using pnpm
pnpm add @repo/logger

# Using npm
npm install @repo/logger

# Using yarn
yarn add @repo/logger
```

Ensure you have a compatible Node.js version (as per the project's `package.json` or your monorepo's root configuration).

## Usage

### Basic Logging

Import the default logger instance and use its methods:

```typescript
import logger from '@repo/logger'

logger.info('This is an informational message.')
logger.warn({ detail: 'Something might be wrong' }, 'This is a warning with context.')
logger.error(new Error('Something went wrong!'), 'Error occurred')

// Custom levels
logger.log('A general log message.')
logger.progress('Operation in progress...')
logger.success('Operation completed successfully!')
```

### Creating a New Logger Instance

You can create a new logger instance, for example, with default bindings:

```typescript
import { createLogger } from '@repo/logger'

const childLogger = createLogger({ component: 'MyComponent' })
childLogger.info('This message is from MyComponent.')
// Logs will include: {"level":30,"time":...,"pid":...,"hostname":"...","component":"MyComponent","msg":"This message is from MyComponent."}
```

### Accessing Recent Logs (Node.js only)

The default logger instance buffers recent logs in memory. This feature is primarily for debugging in Node.js environments.

```typescript
import logger from '@repo/logger'

// ... some logging operations ...

if (typeof (logger as any).recentLogs === 'function') {
	const recent = (logger as any).recentLogs()
	console.log('Recent logs:', recent)
}

// To clear the in-memory buffer:
if (typeof logger.clear === 'function') {
	logger.clear()
}
```

_Note: Accessing `recentLogs` requires a type assertion or check as it's dynamically added to the logger instance and not part of the standard `pino.Logger` type._

### Environment Variables

The logger's behavior can be configured using the following environment variables:

- `LOG_LEVEL`: Sets the minimum log level to output (e.g., `debug`, `info`, `warn`, `error`). Defaults to `info` (or `debug` if `LOG_LEVEL` itself is set to `debug`).
- `DEFAULT_LOG_LEVEL`: Fallback log level if `LOG_LEVEL` is not `debug`. Defaults to `info`.
- `LOG_JSON_FORMAT`: Set to `true` to output logs in JSON format (disables pretty printing). Defaults to `false`.
- `LOG_DIAGNOSTIC`: Set to `true` to enable diagnostic logging, which adds a `diagnostic: true` marker to logs and shows filtered logs in the console. Defaults to `false`.
- `SENTRY_DSN`: Your Sentry DSN for error reporting.
- `SENTRY_ENVIRONMENT`: The application environment for Sentry (e.g., `development`, `production`). Defaults to `process.env.NODE_ENV`.
- `SENTRY_LOGGING`: Set to `false` to disable Sentry logging. Defaults to `true`.
- `SENTRY_TRACES_SAMPLE_RATE`: Sample rate for Sentry tracing (0.0 to 1.0). Defaults to `1.0`.
- `SENTRY_SEND_DEFAULT_PII`: Set to `true` to allow Sentry to send personally identifiable information. Defaults to `false`.

## Project Structure

- `src/index.ts`: Main entry point. Configures and exports the `pino` logger instance and `createLogger` function. Contains the `InMemoryDestination` class and Sentry integration logic.
- `src/sentry/instrument.ts`: Handles Sentry initialization.
- `package.json`: Defines package metadata, scripts, and dependencies.
- `tsconfig.json`: TypeScript configuration for the package.

## Dependencies

Key dependencies include:

- `@sentry/browser`: "^9.34.0" - For Sentry error tracking.
- `pino`: "9.7.0" - Fast JSON logger.
- `pino-pretty`: "^13.0.0" - For development-friendly log output.

For a full list of dependencies and devDependencies, please see the `package.json` file.

## How to Contribute

Contributions are welcome! Please follow these general guidelines:

1.  **Bug Reports**: If you find a bug, please open an issue detailing the problem, steps to reproduce, and expected behavior.
2.  **Feature Requests**: Open an issue to discuss new features or enhancements.
3.  **Pull Requests**:
    - Fork the repository and create a new branch for your feature or fix.
    - Ensure your code adheres to the existing style and linting rules (`pnpm check:lint`).
    - Ensure all type checks pass (`pnpm check:types`).
    - Write tests for your changes if applicable.
    - Submit a pull request with a clear description of your changes.

## License

This project is licensed under the **MIT License**. See the LICENSE file in the root of the monorepo for more details.

## Potential Improvements / TODO

- **Browser Compatibility**: While `pino-pretty` is dynamically imported to avoid browser issues, thorough testing in browser environments for all features would be beneficial. The `InMemoryDestination` currently relies on `process` and might need adjustments for full browser support if recent log access is desired there.
- **Type Safety for `recentLogs`**: The `recentLogs` method on the `InMemoryDestination` is accessed via `(logger as any).recentLogs()`. A more type-safe way to expose this, perhaps via a custom logger interface that's conditionally applied in Node.js, could be explored.
- **Extensibility**: Consider making the `InMemoryDestination` behavior (like `maxLogs`) more configurable.
- **Testing**: Add comprehensive unit and integration tests for the logger's functionality, including Sentry integration and log filtering logic.

```

```
