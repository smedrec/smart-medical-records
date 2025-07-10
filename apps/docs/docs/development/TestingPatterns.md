# Testing Patterns and Practices

This guide covers testing strategies, patterns, and tools used across the Node.js monorepo.

## Testing Stack

### Core Testing Tools

- **[Vitest](https://vitest.dev/)** - Fast unit and integration testing framework.
- **[Supertest](https://github.com/ladjs/supertest)** (Optional, for HTTP integration testing) - Useful for testing HTTP servers (e.g., Express.js, Fastify) by making requests against them.
- **Mocking Libraries**: Vitest has built-in mocking capabilities (`vi.mock`, `vi.spyOn`).
- **Assertion Libraries**: Vitest uses Chai-like assertions by default.

### Configuration

- **Root**: [vitest.workspace.ts](mdc:vitest.workspace.ts) (if using Vitest workspaces) - Defines test projects across the monorepo.
- **Packages/Applications**: Individual `vitest.config.ts` or `vitest.config.js` files for package-specific or application-specific test configurations. These typically define the test environment (e.g., `node`), test file patterns, and any necessary setup files.

## Test Structure

### App Testing Pattern

```
apps/app-name/
└── src/
    ├── index.ts // Main application entry point (e.g., server setup)
    └── test/
        ├── integration/
        │   └── api.integration.test.ts // Example for API endpoint tests
        └── unit/
            └── services.test.ts      // Example for service layer unit tests
        // Or co-locate unit tests with source files:
        // src/services/
        //   ├── user.service.ts
        //   └── user.service.test.ts
```

### Package Testing Pattern

```
packages/package-name/
└── src/
    ├── index.ts
    ├── module.ts
    └── test/
        ├── unit/                 // For pure functions and modules
        │   └── module.test.ts
        └── integration/          // If the package has integration points (e.g., with a DB or external service mock)
            └── service.integration.test.ts
        // Or co-locate unit tests:
        // src/
        //   ├── module.ts
        //   └── module.test.ts
```

## Node.js Application Integration Tests (HTTP Example)

This example uses `supertest` for testing an Express.js-like application.

```typescript
// apps/api-service/src/test/integration/api.integration.test.ts
import { Application } from 'express' // Or your specific server type
import request from 'supertest' // You might need to install supertest: pnpm add -D supertest @types/supertest
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

// Assuming your app is exported from src/index.ts or src/app.ts
import { app, server } from '../../app' // Adjust path as needed; server might be an http.Server instance

describe('API Integration Tests', () => {
	// let expressApp: Application;
	// let httpServer;

	beforeAll(async () => {
		// If your app setup is complex or async, handle it here.
		// For simple apps, just importing 'app' might be enough for supertest.
		// If your app doesn't start listening automatically, you might need to:
		// expressApp = createApp(); // Your function to create the app instance
		// httpServer = expressApp.listen(0); // Listen on a random free port for testing
	})

	afterAll(async () => {
		// Close the server if you started one explicitly
		// if (httpServer) {
		//   httpServer.close();
		// }
		if (server && server.close) {
			// Assuming `server` is your http.Server instance
			server.close()
		}
	})

	it('handles GET /healthcheck request', async () => {
		const response = await request(app) // Use the Express app instance directly
			.get('/healthcheck')

		expect(response.status).toBe(200)
		expect(response.body).toEqual({ status: 'ok', message: 'Service is healthy' })
	})

	it('handles POST /submit-data with valid JSON', async () => {
		const testData = { message: 'test payload' }
		const response = await request(app)
			.post('/submit-data')
			.send(testData)
			.set('Accept', 'application/json') // Important for some frameworks

		expect(response.status).toBe(201) // Or 200, depending on your API
		expect(response.body).toHaveProperty('id')
		expect(response.body.receivedMessage).toBe(testData.message)
	})

	it('handles POST /submit-data with invalid data (e.g., missing field)', async () => {
		const response = await request(app)
			.post('/submit-data')
			.send({ wrongField: 'test' })
			.set('Accept', 'application/json')

		expect(response.status).toBe(400) // Example: Bad Request
		expect(response.body).toHaveProperty('error')
	})
})
```

### Testing with Environment Variables

Vitest and Node.js allow environment variables to be set in various ways:

- **Directly in tests**: `process.env.MY_VAR = 'value';` (use with caution, can affect other tests).
- **Using `.env` files**: `dotenv` package can load variables from `.env` files. Configure this in `vitest.config.ts` or a setup file.
- **Via test script**: `MY_VAR=value pnpm test`.
- **Mocking `process.env`**: `vi.stubGlobal('process', { ...process, env: { ...process.env, MY_VAR: 'value' } });`

```typescript
// Example: apps/my-app/src/config.ts
export const getConfig = () => ({
  apiKey: process.env.API_KEY,
  databaseUrl: process.env.DATABASE_URL,
});

// Example: apps/my-app/src/test/unit/config.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getConfig } from '../../config';

describe('App Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset process.env and restore mocks for each test
    vi.resetModules(); // Important to re-evaluate modules with new env vars
    process.env = { ...originalEnv }; // Restore original environment
  });

  it('uses environment variables for API_KEY', () => {
    process.env.API_KEY = 'test_api_key_123';
    const config = getConfig();
    expect(config.apiKey).toBe('test_api_key_123');
  });

  it('returns undefined if API_KEY is not set', () => {
    delete process.env.API_KEY; // Ensure it's not set
    const config = getConfig();
    expect(config.apiKey).toBeUndefined();
  });
});
```

## Unit Testing Shared Packages

### Testing Utilities and Helpers

```typescript
// packages/string-utils/src/test/formatters.test.ts
import { describe, expect, it } from 'vitest'

import { capitalize, truncate } from '../formatters' // Assuming these functions exist

describe('String Formatters', () => {
	describe('capitalize', () => {
		it('should capitalize the first letter of a string', () => {
			expect(capitalize('hello')).toBe('Hello')
		})

		it('should return an empty string if input is empty', () => {
			expect(capitalize('')).toBe('')
		})

		it('should handle already capitalized strings', () => {
			expect(capitalize('World')).toBe('World')
		})
	})

	describe('truncate', () => {
		it('should truncate a string to the specified length', () => {
			expect(truncate('This is a long string', 10)).toBe('This is a...')
		})

		it('should not truncate if string is shorter than length', () => {
			expect(truncate('Short', 10)).toBe('Short')
		})

		it('should allow custom ellipsis', () => {
			expect(truncate('Another long one', 7, '***')).toBe('Another***')
		})
	})
})
```

### Testing TypeScript Types (using `expectTypeOf`)

Vitest's `expectTypeOf` allows you to make assertions about types.

```typescript
// packages/data-models/src/test/user.types.test.ts
import { describe, expectTypeOf, it } from 'vitest'

import type { AdminUser, BaseUser, User } from '../user.types' // Assuming these types exist

describe('User Type Definitions', () => {
	it('User should have required properties', () => {
		expectTypeOf<User>().toHaveProperty('id')
		expectTypeOf<User>().toHaveProperty('username')
		expectTypeOf<User>().toHaveProperty('email')
	})

	it('AdminUser should extend User and have admin-specific properties', () => {
		expectTypeOf<AdminUser>().toMatchTypeOf<User>() // Checks if AdminUser is assignable to User
		expectTypeOf<AdminUser>().toHaveProperty('permissions')
		expectTypeOf<AdminUser>().toHaveProperty('lastLoginAt')
	})

	it('BaseUser should only contain common properties', () => {
		type BaseKeys = keyof BaseUser
		expectTypeOf<BaseKeys>().toEqualTypeOf<'id' | 'username'>()
	})
})
```

## Test Commands

### Running Tests

```bash
# Run all tests
just test
# or
pnpm test

# Run tests in CI mode
pnpm test:ci

# Run tests for specific package
pnpm turbo -F @repo/package-name test # Assumes 'test' script runs 'vitest run' or similar
# or directly if 'test' script is just 'vitest'
pnpm turbo -F @repo/package-name test run

# Run tests for specific application/service
pnpm turbo -F app-name test # e.g., pnpm turbo -F api-service test

# Watch mode for development in a specific package/app
pnpm -F app-name test --watch # Or your configured watch script, e.g., pnpm -F app-name test:watch
# Or, if the 'test' script in package.json is 'vitest' (without 'run'):
pnpm -F app-name test
```

### Turbo Test Pipeline

```bash
# Run tests with dependency awareness
pnpm turbo test
```

## Vitest Configuration

### Workspace Configuration

[vitest.workspace.ts](mdc:vitest.workspace.ts) defines:

```typescript
import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
	// App applications
	'apps/*/vitest.config.{ts,js}',
	// Shared packages
	'packages/*/vitest.config.{ts,js}',
])
```

### Application Vitest Config Example

```typescript
// apps/api-service/vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true, // Optional: to use Vitest globals like describe, it, expect without importing
		environment: 'node', // Essential for Node.js applications
		setupFiles: ['./src/test/setup-env.ts'], // Optional: for global test setup (e.g., loading .env)
		coverage: {
			provider: 'v8', // or 'istanbul'
			reporter: ['text', 'json', 'html'],
			include: ['src/**/*.ts'], // Specify files to include in coverage
			exclude: [
				// Specify files/patterns to exclude
				'src/test/**/*',
				'src/**/*.types.ts',
				'src/index.ts', // Or your main entry point if it's just bootstrapping
			],
		},
		// If using path aliases in tsconfig.json, configure them for Vitest
		// resolve: {
		//   alias: {
		//     '@app': './src',
		//   },
		// },
	},
})
```

### Shared Package Vitest Config Example

```typescript
// packages/string-utils/vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			include: ['src/**/*.ts'],
			exclude: ['src/test/**/*', 'src/**/*.types.ts'],
		},
	},
})
```

## Testing Best Practices

### 1. Test Structure and Granularity

- **Unit Tests**: Focus on individual functions, modules, or classes in isolation. Mock dependencies to ensure tests are fast and deterministic.
  - Place alongside source files (e.g., `module.test.ts` next to `module.ts`) or in a dedicated `unit` subdirectory within `src/test/`.
- **Integration Tests**: Test interactions between multiple components or modules, including with external systems like databases or other services (which should be mocked or use test instances).
  - For HTTP applications, this often involves sending requests to your application and verifying responses.
  - Place in `src/test/integration/` or `tests/integration/`.
- **Consistent Naming**: Use `*.test.ts` or `*.spec.ts` for test files.

### 2. Environment Setup and Configuration

- **Environment Variables**: Use `.env` files (e.g., `.env.test`) loaded via a setup file in `vitest.config.ts` for test-specific environment variables. Avoid polluting the global `process.env` directly within tests where possible.
- **Mocking**: Utilize Vitest's `vi.mock()`, `vi.spyOn()`, and `vi.fn()` for mocking modules, functions, and spies.
  - For database interactions, consider using an in-memory database (like SQLite for SQL DBs) or a dedicated test database instance that is reset between tests.
- **Test Cases**: Cover success paths, error handling, edge cases, and invalid inputs.

### 3. Coverage and Quality

```bash
# Run tests with coverage (ensure coverage options are set in vitest.config.ts)
pnpm test --coverage

# Stricter type checking for tests (if not part of your main check:types)
# (This is usually covered by `pnpm turbo check:types` if tests are included in tsconfig)
```

- Aim for meaningful coverage, not just high percentages. Focus on testing critical paths and complex logic.

### 4. CI Integration

Tests should run automatically in your CI/CD pipeline:

- **Branch Workflow**: On every push to feature branches and pull requests.
- **Release Workflow**: Before any deployment to staging or production environments.

### 5. Debugging Tests

```bash
# Run a specific test file with verbose output
pnpm turbo -F app-name test -- src/test/integration/api.integration.test.ts --reporter=verbose

# Debug tests using Node.js inspector with Vitest
# Add `debug` script to package.json: "test:debug": "vitest --inspect-brk"
# Then run: pnpm -F app-name test:debug
# And attach your debugger.

# For more focused debugging, use `.only` and `.skip` on describe/it blocks (remove before committing)
# describe.only('Focused test suite', () => { ... });
# it.only('Focused test case', () => { ... });
```

## Common Node.js Testing Patterns

### Mocking External API Calls (e.g., using `vi.fn` or `msw`)

```typescript
// Example using vi.fn for a service that uses fetch
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Assume someApiService.ts uses global fetch
// import { fetchDataFromExternalAPI } from './someApiService';

// Mock global fetch before tests that use it
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('someApiService', () => {
	beforeEach(() => {
		mockFetch.mockReset() // Reset mock before each test
	})

	it('fetches data successfully', async () => {
		const mockResponseData = { data: 'mocked response' }
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => mockResponseData,
			status: 200,
		} as Response)

		// const result = await fetchDataFromExternalAPI('some/path');
		// expect(result).toEqual(mockResponseData);
		// expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/some/path'); // Verify URL
	})

	it('handles fetch error', async () => {
		mockFetch.mockRejectedValueOnce(new Error('Network error'))
		// await expect(fetchDataFromExternalAPI('some/path')).rejects.toThrow('Network error');
	})
})
```

For more complex scenarios, consider using [Mock Service Worker (MSW)](https://mswjs.io/) to intercept and mock HTTP requests at the network level.

### Testing Error Handling in an Express.js Controller (Example)

```typescript
import express, { NextFunction, Request, Response } from 'express'
import request from 'supertest'
import { describe, expect, it, vi } from 'vitest'

// Assume this is your controller
const myController = {
	getData: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.params
			if (id === 'error') {
				throw new Error('Forced error')
			}
			if (id === 'notfound') {
				return res.status(404).json({ message: 'Item not found' })
			}
			res.status(200).json({ id, data: 'Sample data' })
		} catch (error) {
			next(error) // Pass to error handling middleware
		}
	},
}

// Simple error handling middleware for testing
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
	res.status(500).json({ message: err.message || 'Something went wrong' })
}

const app = express()
app.get('/data/:id', myController.getData)
app.use(errorHandler)

describe('myController error handling', () => {
	it('handles errors gracefully and passes them to error middleware', async () => {
		const response = await request(app).get('/data/error')
		expect(response.status).toBe(500)
		expect(response.body.message).toBe('Forced error')
	})

	it('returns 404 for not found items', async () => {
		const response = await request(app).get('/data/notfound')
		expect(response.status).toBe(404)
		expect(response.body.message).toBe('Item not found')
	})
})
```

### Testing Asynchronous Operations (Promises, async/await)

Vitest handles promises and async/await naturally. Ensure your tests are `async` and you `await` promises.

```typescript
// service.ts
export const delayedSuccess = (message: string): Promise<string> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(`Success: ${message}`), 10);
  });
};

export const delayedFailure = (): Promise<never> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Operation failed')), 10);
  });
};

// service.test.ts
import { describe, it, expect } from 'vitest';
import { delayedSuccess, delayedFailure } from './service';

describe('Async Operations', () => {
	it('should resolve with success message', async () => {
		const result = await delayedSuccess('Task complete');
		expect(result).toBe('Success: Task complete');
	});

	it('should reject with an error message', async () => {
		// Using .rejects for promise rejection testing
		await expect(delayedFailure()).rejects.toThrow('Operation failed');

		// Or using try/catch
		// try {
		//   await delayedFailure();
		// } catch (e) {
		//   expect(e.message).toBe('Operation failed');
		// }
	});
});
```
