# @repo/infisical

A reusable TypeScript package for securely fetching secrets from Infisical for your Node.js backend applications.

This package provides a simple client to interact with the Infisical SDK, simplifying the process of retrieving individual secrets or all secrets for a given project and environment.

## Features

- **Easy Initialization**: Configure the client once with your Infisical credentials and site URL.
- **Targeted Configuration**: Specify project ID and environment for secret retrieval.
- **Fetch Single Secret**: Retrieve a specific secret by its name.
- **Fetch All Secrets**: Get all secrets for the configured project and environment.
- **Error Handling**: Clear error types for issues like initialization problems or SDK errors.
- **TypeScript Support**: Fully typed for a better development experience.
- **Flexible Options**: Override default project/environment settings on a per-call basis for `getSecret` and `allSecrets`.

## Installation

### Prerequisites

- Node.js (LTS version recommended, e.g., v18, v20)
- pnpm (or your preferred package manager like npm or yarn)
- An Infisical account and a project set up.
- A Service Token from Infisical for authentication (Client ID and Client Secret). You can generate this from your Infisical project settings under "Service Tokens".

### Steps

1.  **Add the package to your project:**

    ```bash
    pnpm add @repo/infisical
    # or
    # yarn add @repo/infisical
    # or
    # npm install @repo/infisical
    ```

2.  **Ensure Infisical SDK is also available (it's a direct dependency of this package):**
    This package depends on `@infisical/sdk`. It will be installed automatically when you add `@repo/infisical`.

## Usage

### Initialization

First, you need to initialize the Infisical client. This typically happens once when your application starts. The `init` method is static and returns an option function that you pass to the `Infisical` constructor. You also need to configure the `projectId` and `environment` using `Infisical.WithConfig`.

```typescript
import { Infisical } from '@repo/infisical'

import type { InfisicalClientOptions, ProjectOptions } from '@repo/infisical'

async function initializeInfisicalClient() {
	const clientAuthOptions: InfisicalClientOptions = {
		siteUrl: process.env.INFISICAL_SITE_URL!, // e.g., "https://app.infisical.com"
		clientId: process.env.INFISICAL_CLIENT_ID!,
		clientSecret: process.env.INFISICAL_CLIENT_SECRET!,
	}

	const projectConfig: ProjectOptions = {
		projectId: process.env.INFISICAL_PROJECT_ID!, // Your Infisical Project ID
		environment: process.env.INFISICAL_ENVIRONMENT!, // e.g., "dev", "prod", "stg"
	}

	try {
		const infisicalClient = new Infisical(
			Infisical.WithConfig(initializeInfisicalClient),
			await Infisical.init(projectConfig)
		)
		console.log('Infisical client initialized successfully.')
		return infisicalClient
	} catch (error) {
		console.error('Failed to initialize Infisical client:', error)
		// Handle initialization error (e.g., exit application, retry, etc.)
		process.exit(1)
	}
}

// Example usage:
// const client = await initializeInfisicalClient();
// Now you can use the client to fetch secrets.
```

### Fetching a Single Secret

```typescript
// Assuming 'client' is your initialized Infisical instance from the example above

async function getDatabasePassword(client: Infisical) {
	try {
		const dbPassword = await client.getSecret('DATABASE_PASSWORD')
		console.log('Database Password:', dbPassword ? '******' : 'Not found')
		return dbPassword
	} catch (error) {
		console.error('Error fetching DATABASE_PASSWORD:', error)
		// Handle specific error, e.g., secret not found
	}
}

// To fetch a secret overriding the default environment or project ID:
async function getApiKeyForProd(client: Infisical) {
	try {
		const apiKey = await client.getSecret('API_KEY', { environment: 'prod' })
		console.log('Production API Key:', apiKey ? '******' : 'Not found')
		return apiKey
	} catch (error) {
		console.error('Error fetching API_KEY for prod:', error)
	}
}
```

### Fetching All Secrets

```typescript
// Assuming 'client' is your initialized Infisical instance

async function getAllSecrets(client: Infisical) {
	try {
		const secrets = await client.allSecrets()
		console.log('All secrets:')
		for (const secret of secrets) {
			console.log(`- ${secret.key}: ******`) // Mask sensitive values in logs
		}
		return secrets
	} catch (error) {
		console.error('Error fetching all secrets:', error)
	}
}

// To fetch all secrets overriding the default environment or project ID:
async function getAllSecretsForStaging(client: Infisical) {
	try {
		const secrets = await client.allSecrets({ environment: 'stg', projectId: 'another-project-id' })
		console.log('All staging secrets for another-project-id:')
		for (const secret of secrets) {
			console.log(`- ${secret.key}: ******`)
		}
		return secrets
	} catch (error) {
		console.error('Error fetching staging secrets:', error)
	}
}
```

## Error Handling

The package exports custom error types for better error management:

- `InfisicalClientNotInitializedError`: Thrown if you attempt to use `getSecret` or `allSecrets` before the client has been successfully initialized (i.e., `Infisical.init()` was not called or did not complete).
- `InfisicalError`: A general error for issues occurring during interaction with the Infisical SDK (e.g., authentication failure, secret not found, network issues). This error includes a `cause` property which may contain the original error from the SDK.

Always wrap calls to `Infisical.init()`, `client.getSecret()`, and `client.allSecrets()` in `try...catch` blocks to handle potential errors gracefully.

```typescript
import { Infisical, InfisicalClientNotInitializedError, InfisicalError } from '@repo/infisical'

// ... inside an async function
try {
	// ... Infisical operations
} catch (error) {
	if (error instanceof InfisicalClientNotInitializedError) {
		console.error('Critical: Infisical client was not ready.', error.message)
	} else if (error instanceof InfisicalError) {
		console.error('An error occurred with Infisical:', error.message)
		if (error.cause) {
			console.error('Caused by:', error.cause)
		}
	} else {
		console.error('An unexpected error occurred:', error)
	}
}
```

## Project Structure

```
packages/infisical/
├── dist/                     # Compiled JavaScript output
├── src/
│   ├── index.ts              # Main package entry point (exports)
│   ├── infisical.ts          # Core Infisical client class and logic
│   ├── types.ts              # TypeScript type definitions
│   └── test/
│       └── infisical.test.ts # Unit tests for the client
├── package.json
├── tsconfig.json
├── vitest.config.ts          # Vitest test runner configuration
└── README.md                 # This file
```

## Dependencies

- `@infisical/sdk`: `^4.0.2` (The official Infisical Node.js SDK)

### Dev Dependencies

- `vitest`: `^2.0.4` (For unit testing)
- `typescript`, `tsup`, `eslint`, etc. (Standard TypeScript development tools)

## How to Contribute

Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or feature requests.

### Development

1.  Clone the repository.
2.  Install dependencies: `pnpm install` (from the monorepo root).
3.  Navigate to the package: `cd packages/infisical`.
4.  Build the package: `pnpm build`.
5.  Run tests: `pnpm test`.
6.  Run tests in watch mode: `pnpm test:watch`.

## License

This project is licensed under the MIT License.
