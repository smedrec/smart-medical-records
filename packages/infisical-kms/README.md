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
	baseUrl: 'https://app.infisical.com/api/v1/kms',
	keyId: 'your-key-id',
	accessToken: 'your-access-token',
})

// 2. Encrypt data
const plaintext = 'This is a secret message.'
const encryptedData = await kmsClient.encrypt(plaintext)
console.log('Encrypted data:', encryptedData.ciphertext)

// 3. Decrypt data
const decryptedData = await kmsClient.decrypt(encryptedData.ciphertext)
console.log('Decrypted data:', decryptedData.plaintext)
```

## Project Structure

```
.
├── src/
│   ├── client.ts      # Contains the main InfisicalKmsClient class
│   ├── index.ts       # Exports the client and types
│   └── types.ts       # Defines the types for the client configuration and API responses
├── .eslintrc.cjs    # ESLint configuration
├── package.json     # Project metadata and dependencies
├── README.md        # This file
└── tsconfig.json    # TypeScript configuration
```

## Dependencies

- [axios](https://www.npmjs.com/package/axios): ^1.7.2

## How to Contribute

Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or feature requests.

## License

This project is licensed under the MIT License.
