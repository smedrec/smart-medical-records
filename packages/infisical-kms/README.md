# @repo/infisical-kms

A reusable TypeScript package for encrypting and decrypting data using Infisical KMS.

## Features

- Encrypt plaintext data.
- Decrypt ciphertext data.

## Installation

```bash
pnpm add @repo/infisical-kms
```

## Usage

Here's an example of how to use the `InfisicalKmsClient` to encrypt and decrypt data.

```typescript
import { InfisicalKmsClient } from '@repo/infisical-kms'

// 1. Initialize the InfisicalKmsClient
const kmsClient = new InfisicalKmsClient({
	baseUrl: 'https://app.infisical.com',
	keyId: 'your-key-id',
	accessToken: 'your-access-token',
})

// 2. Encrypt data
try {
	const plaintext = 'This is a secret message.'
	const encryptedData = await kmsClient.encrypt(plaintext)
	console.log('Encrypted data:', encryptedData.ciphertext)

	// 3. Decrypt data
	const decryptedData = await kmsClient.decrypt(encryptedData.ciphertext)
	console.log('Decrypted data:', decryptedData.plaintext)
} catch (error) {
	// Handle specific KMS errors
	if (error instanceof KmsApiError) {
		console.error(`KMS API Error: ${error.message}`, `Status: ${error.status}`);
	} else if (error instanceof KmsEncryptionError) {
		console.error(`Encryption Error: ${error.message}`);
	} else if (error instanceof KmsDecryptionError) {
		console.error(`Decryption Error: ${error.message}`);
	} else if (error instanceof KmsError) {
		console.error(`KMS Error: ${error.message}`);
	}
	 else {
		console.error('An unexpected error occurred:', error)
	}
}
```

## Error Handling

The client exports custom error classes to help you identify the source of problems:

- `KmsError`: Base error class for all client-specific errors.
- `KmsApiError`: Errors originating from the Infisical KMS API (e.g., authentication failure, invalid key ID). This error class includes `status` and `statusText` properties from the API response.
- `KmsEncryptionError`: A subclass of `KmsApiError`, specifically for errors occurring during the encryption process.
- `KmsDecryptionError`: A subclass of `KmsApiError`, specifically for errors occurring during the decryption process.

You can use `instanceof` to catch and handle these errors specifically:

```typescript
import {
	InfisicalKmsClient,
	KmsApiError,
	KmsEncryptionError,
	KmsDecryptionError,
	KmsError
} from '@repo/infisical-kms'

// ... client setup ...

try {
	// ... use kmsClient.encrypt() or kmsClient.decrypt() ...
} catch (error) {
	if (error instanceof KmsEncryptionError) {
		// Handle encryption-specific error
		console.error('Encryption failed:', error.message, 'Status:', error.status);
	} else if (error instanceof KmsDecryptionError) {
		// Handle decryption-specific error
		console.error('Decryption failed:', error.message, 'Status:', error.status);
	} else if (error instanceof KmsApiError) {
		// Handle other API errors
		console.error('KMS API error:', error.message, 'Status:', error.status);
	} else if (error instanceof KmsError) {
		// Handle other KMS client errors
		console.error('KMS client error:', error.message);
	} else {
		// Handle other unexpected errors
		console.error('An unexpected error occurred:', error);
	}
}
```

## Project Structure

```
.
├── src/
│   ├── client.ts      # Contains the main InfisicalKmsClient class and error definitions
│   ├── index.ts       # Exports the client, types, and errors
│   ├── types.ts       # Defines the types for the client configuration and API responses
│   └── test/
│       └── unit/
│           └── client.test.ts # Unit tests for the KmsClient
├── .eslintrc.cjs    # ESLint configuration
├── package.json     # Project metadata and dependencies
├── README.md        # This file
├── tsconfig.json    # TypeScript configuration
└── vitest.config.ts # Vitest configuration for running tests
```

## Running Tests

To run the tests for this package, navigate to the root of the monorepo and use the following command:

```bash
pnpm turbo -F @repo/infisical-kms test
```

Alternatively, you can run Vitest in watch mode within the package directory:

```bash
cd packages/infisical-kms
pnpm test --watch
```

## How to Contribute

Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or feature requests.

## License

This project is licensed under the MIT License.
