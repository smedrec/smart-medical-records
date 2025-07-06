# @repo/app-client

A TypeScript client library for interacting with the App API. It provides methods for common API operations, including authentication-related checks, encryption, and decryption services, with built-in retry mechanisms and customizable options.

## Features

- **Typed API Calls**: Leverages TypeScript for strong typing of requests and responses.
- **Authentication Ready**: Designed to work with cookie-based authentication (`credentials: 'include'`).
- **Retry Mechanism**: Automatically retries failed requests with exponential backoff.
- **Customizable**: Allows configuration of base URL, retry attempts, backoff timings, and custom headers.
- **Standard Endpoints**: Includes methods for API health checks (`ok`), version retrieval (`version`), encryption (`encrypt`), and decryption (`decrypt`).
- **Modern Build**: Outputs CJS and ESM modules with included type definitions.

## Installation

### Prerequisites

- Node.js (LTS version recommended)
- npm, yarn, or pnpm (depending on your project/monorepo setup)

### Setup

1.  **Add the package to your project**:
    If this package is published to a registry:

    ```bash
    npm install @repo/app-client
    # or
    yarn add @repo/app-client
    # or
    pnpm add @repo/app-client
    ```

    If you are using it as part of a monorepo with workspace support (as suggested by `workspace:*` dependencies):

    ```bash
    # Ensure it's listed as a dependency in your consuming package's package.json
    # "dependencies": {
    #   "@repo/app-client": "workspace:*"
    # }
    # Then run install from the monorepo root
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

2.  **Development Dependencies (for contributing or running tests locally for this package)**:
    The package uses `vitest` for testing and `tsup` for building. These are listed in `devDependencies`.
    To install development dependencies for this specific package (if not handled by a monorepo root install):
    ```bash
    cd packages/app-client # Or your path to this package
    npm install
    ```

## Usage

First, import and instantiate the client:

```typescript
import { AppClient } from '@repo/app-client'

import type { ClientOptions } from '@repo/app-client'

const options: ClientOptions = {
	baseUrl: 'https://api.yourapp.com', // Replace with your actual API base URL
	// Optional custom headers
	headers: {
		'X-Custom-App-Header': 'my-app-value',
	},
	// Optional retry configuration
	retries: 3, // Default is 3
	backoffMs: 200, // Default is 100ms
	maxBackoffMs: 2000, // Default is 1000ms
}

const client = new AppClient(options)

// Example API calls
async function checkApiStatus() {
	try {
		const response = await client.ok()
		console.log('API Status:', response) // { ok: true }
	} catch (error) {
		console.error('Error checking API status:', error)
	}
}

async function getApiVersion() {
	try {
		const response = await client.version()
		console.log('API Version:', response.version)
	} catch (error) {
		console.error('Error getting API version:', error)
	}
}

async function encryptData(text: string) {
	try {
		const response = await client.encrypt(text)
		console.log('Encrypted Text:', response.ciphertext)
		return response.ciphertext
	} catch (error) {
		console.error('Error encrypting data:', error)
		return null
	}
}

async function decryptData(ciphertext: string) {
	try {
		const response = await client.decrypt(ciphertext)
		console.log('Decrypted Text:', response.plaintext)
		return response.plaintext
	} catch (error) {
		console.error('Error decrypting data:', error)
		return null
	}
}

// Using the functions
checkApiStatus()
getApiVersion()
encryptData('My secret message').then((cipher) => {
	if (cipher) {
		decryptData(cipher)
	}
})
```

## Project Structure

```
packages/app-client/
├── dist/                  # Compiled output (JavaScript and type definitions)
├── src/                   # TypeScript source files
│   ├── base.ts            # Base class with common request logic (retries, backoff)
│   ├── client.ts          # Main AppClient class implementing API methods
│   ├── client.test.ts     # Unit tests for AppClient
│   ├── index.ts           # Entry point for the package
│   └── types.ts           # TypeScript type definitions and interfaces
├── .eslintrc.cjs          # ESLint configuration
├── package.json           # NPM package manifest
├── README.md              # This file
├── tsconfig.json          # TypeScript compiler configuration
└── vitest.config.ts       # Vitest test runner configuration
```

## Dependencies

### Main Dependencies

This package currently has no explicit production dependencies listed in its `package.json` (`dependencies: {}`). It relies on the built-in `fetch` API.

### Development Dependencies

The following are key development dependencies:

- `@repo/eslint-config`: "workspace:\*" (Shared ESLint configuration)
- `@repo/typescript-config`: "workspace:\*" (Shared TypeScript configuration)
- `tsup`: "8.5.0" (For bundling TypeScript into CJS/ESM)
- `typescript`: "5.8.3"
- `vitest`: "3.2.4" (Test runner)

_(Version numbers are as of the time of this writing and may change. Refer to `package.json` for the most up-to-date list.)_

## Security Considerations

- **Cookie-Based Authentication**: This client is configured to send credentials (like cookies) with requests by using `credentials: 'include'` in its `fetch` calls. The security of this mechanism heavily relies on the server-side implementation:
  - **HttpOnly Cookies**: Server should set cookies with the `HttpOnly` flag to prevent access from client-side JavaScript, mitigating XSS risks.
  - **Secure Cookies**: Cookies should be set with the `Secure` flag to ensure they are only sent over HTTPS.
  - **CORS Policy**: The server must have a correctly configured Cross-Origin Resource Sharing (CORS) policy that allows credentials from the client's origin.
- **Base URL Configuration**: The `baseUrl` for the API is configurable. Ensure that this URL is trusted and correctly set. If the `baseUrl` can be manipulated by user input, sanitize it thoroughly to prevent requests from being redirected to malicious servers.
- **Sensitive Data**: When using `encrypt` and `decrypt` methods, be mindful of how and where plaintext and ciphertext are handled and stored in your application.

## How to Contribute

Contributions are welcome! Please follow these general guidelines:

1.  **Bug Reports**: If you find a bug, please open an issue on the project's issue tracker. Include a clear description, steps to reproduce, and expected behavior.
2.  **Feature Requests**: Open an issue to discuss new features or improvements.
3.  **Pull Requests**:
    - Fork the repository and create a new branch for your feature or bug fix.
    - Ensure your code adheres to the existing coding style and linting rules (`npm run check:lint`).
    - Write tests for any new functionality or bug fixes (`npm test --prefix packages/app-client` or equivalent for your setup).
    - Ensure all tests pass.
    - Submit a pull request with a clear description of your changes.

## License

This project is licensed under the **MIT License**. See the `LICENSE` file in the root of the repository for more details.

## Examples

See the [Usage](#usage) section for detailed examples of how to instantiate the client and call its methods. Here's a quick recap of method calls:

```typescript
// Assuming 'client' is an instance of AppClient

// Check API health
client.ok().then(console.log).catch(console.error)

// Get API version
client.version().then(console.log).catch(console.error)

// Encrypt text
client
	.encrypt('sensitive data')
	.then((response) => {
		console.log('Ciphertext:', response.ciphertext)
	})
	.catch(console.error)

// Decrypt text
client
	.decrypt('previously_encrypted_ciphertext')
	.then((response) => {
		console.log('Plaintext:', response.plaintext)
	})
	.catch(console.error)
```
