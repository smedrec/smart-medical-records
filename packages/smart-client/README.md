# @repo/smart-client

## Package Title and Description

**SMART FHIR Backend Services Client**

This package provides a TypeScript client for backend applications to securely authenticate and interact with SMART on FHIR servers. It implements the [SMART App Launch IG: Backend Services](https://hl7.org/fhir/smart-app-launch/backend-services.html) profile, specifically focusing on asymmetric (public key) client authentication (`private_key_jwt`) using the OAuth 2.0 client credentials grant flow.

The client handles fetching the server's SMART configuration, generating JWT assertions for authentication, obtaining access tokens, and making FHIR API requests.

## Features

*   **SMART Backend Services Authentication**: Implements `private_key_jwt` client authentication.
*   **Asymmetric Key Support**: Uses RSA or ECDSA private keys (PKCS8 PEM or JWK format) to sign JWT assertions.
*   **Automatic Token Management**:
    *   Fetches and caches access tokens.
    *   Handles token expiration and renewal.
*   **SMART Configuration Discovery**: Retrieves server capabilities from the `.well-known/smart-configuration` endpoint.
*   **FHIR API Interaction**:
    *   Provides methods for common FHIR operations (GET, POST, PUT, DELETE, PATCH).
    *   Includes automatic retries for requests failing with 401/403 (Unauthorized/Forbidden) after refreshing the token.
*   **Typed Interfaces**: Includes TypeScript types for configuration, server metadata, and token responses.
*   **Error Handling**: Custom error classes for better diagnostics of initialization, authentication, and request failures.
*   **Flexible Configuration**: Allows detailed configuration of client ID, scopes, private keys, signing algorithms, etc.

## Installation

### Prerequisites

*   Node.js (version recommended by the monorepo, e.g., >=18.x)
*   pnpm (version recommended by the monorepo)
*   A provisioned client ID and registered public key(s) with the target FHIR authorization server.

### Steps

1.  **Add the package as a dependency** to your application or another package within the monorepo:

    ```bash
    # If your package is in the same monorepo
    pnpm add @repo/smart-client --filter your-app-or-package-name
    ```
    This will also install its direct dependencies: `axios`, `jose`, and `uuid`.

## Usage

### Configuration

The `SmartClient` requires a configuration object of type `SmartClientConfig`. This configuration typically comes from a secure source, like environment variables or a database, specific to the organization using the client.

```typescript
// src/types.ts (example of what SmartClientConfig looks like)
export interface SmartClientConfig {
  clientId: string; // Your client_id
  iss: string; // Issuer URL, must be identical to clientId for this flow
  scope: string; // e.g., "system/Patient.read system/Observation.write"
  privateKey: string; // Your private key in PEM (PKCS8) or JWK (JSON string) format
  fhirBaseUrl?: string; // Base URL of the FHIR server (e.g., "https://fhir.your-server.com/r4")
                        // Used for FHIR requests and optionally for .well-known discovery
  kid?: string; // Optional: Key ID for the public key, if registered with the FHIR server
  signingAlgorithm?: 'RS384' | 'ES384' | string; // Optional: JWA algorithm, defaults to 'RS384'
  jwksUrl?: string; // Optional: URL to your public JWK Set
  jwtLifetime?: number; // Optional: Lifetime of the generated JWT assertion in seconds (default: 300)
}
```

### Initialization

The client must be initialized before use. The static `init()` method fetches the FHIR server's SMART configuration.

```typescript
import { SmartClient, SmartClientConfig } from '@repo/smart-client';

async function initializeSmartClient() {
  const config: SmartClientConfig = {
    clientId: process.env.FHIR_CLIENT_ID!,
    iss: process.env.FHIR_CLIENT_ID!, // Must match clientId
    scope: 'system/*.read',
    privateKey: process.env.FHIR_PRIVATE_KEY!, // Load your private key securely
    fhirBaseUrl: process.env.FHIR_SERVER_BASE_URL, // e.g., "https://sandbox.fhir.org/r4"
    kid: process.env.FHIR_KID, // Optional
    // signingAlgorithm: 'ES384', // Optional
  };

  try {
    // Option 1: Discover .well-known/smart-configuration using fhirBaseUrl's origin
    const client = await SmartClient.init(config);

    // Option 2: Provide an explicit issuer URL for .well-known/smart-configuration discovery
    // const explicitIssUrl = 'https://auth.example.com/auth/realms/myrealm';
    // const client = await SmartClient.init(config, explicitIssUrl);

    console.log('SmartClient initialized successfully.');
    return client;
  } catch (error) {
    console.error('Failed to initialize SmartClient:', error);
    // Handle initialization error (e.g., server unreachable, invalid config)
    throw error;
  }
}
```

### Making FHIR API Requests

Once initialized, you can use the client instance to make FHIR API requests. The client handles token acquisition and renewal automatically.

```typescript
async function fetchPatientData(client: SmartClient, patientId: string) {
  try {
    // Example: Fetch a Patient resource
    const patient = await client.get(`Patient/${patientId}`);
    console.log('Fetched Patient:', patient);

    // Example: Search for Observations for this patient
    const observations = await client.get('Observation', {
      params: { patient: patientId, _count: 10 },
    });
    console.log('Fetched Observations:', observations);

    // Example: Create a new Observation
    const newObservation = {
      resourceType: 'Observation',
      status: 'final',
      code: { coding: [{ system: 'http://loinc.org', code: '29463-7' }] }, // Example: Body Weight
      subject: { reference: `Patient/${patientId}` },
      valueQuantity: { value: 70, unit: 'kg', system: 'http://unitsofmeasure.org', code: 'kg' },
      effectiveDateTime: new Date().toISOString(),
    };
    // const createdObservation = await client.post('Observation', newObservation);
    // console.log('Created Observation:', createdObservation);

  } catch (error) {
    console.error('FHIR API request failed:', error);
    // Handle API errors (e.g., resource not found, server error, authentication issue after retries)
    if (error instanceof SmartClientRequestError) {
        console.error("Details:", error.details);
    }
  }
}

// Main execution
initializeSmartClient()
  .then(client => {
    if (client) {
      return fetchPatientData(client, 'some-patient-id');
    }
  })
  .catch(err => {
    // Global error handling if needed
  });
```

### Error Handling

The client throws specific error types:
*   `SmartClientInitializationError`: For issues during `new SmartClient()` or `SmartClient.init()`.
*   `SmartClientAuthenticationError`: For problems related to JWT creation or obtaining an access token.
*   `SmartClientRequestError`: For failures during FHIR API requests (after successful token acquisition, though can include auth errors on retry).

These errors extend the base `SmartClientError` and may contain a `cause` (the original error) and `details` (additional context, like server response).

## Project Structure

```
packages/smart-client/
├── dist/                     # Compiled output (JavaScript and type definitions)
├── src/                      # TypeScript source files
│   ├── client.ts             # Core SmartClient class implementation
│   ├── types.ts              # TypeScript interfaces and error classes
│   ├── index.ts              # Main entry point, exports public API
│   └── client.test.ts        # Unit tests for the client
├── .eslintrc.cjs             # ESLint configuration
├── package.json              # Package manifest, dependencies, and scripts
├── README.md                 # This file
└── tsconfig.json             # TypeScript compiler options
```

## Dependencies

*   [axios](https://axios-http.com/): Promise-based HTTP client for Node.js and the browser.
    *   Version: `^1.10.0`
*   [jose](https://github.com/panva/jose): A zero-dependency JWS, JWE, JWT, JWK, JWKS library for Node.js, Browser, Cloudflare Workers, Deno.
    *   Version: `^5.6.3`
*   [uuid](https://github.com/uuidjs/uuid): For the creation of RFC4122 UUIDs.
    *   Version: `^10.0.0`

Dev Dependencies include standard monorepo tools like ESLint, TypeScript, and Vitest for testing.

## How to Contribute

Contributions are welcome! Please follow these guidelines:

1.  **Bug Reports**: If you find a bug, please open an issue on the project's issue tracker. Include a clear description, steps to reproduce, and expected behavior.
2.  **Feature Requests**: Open an issue to discuss new features or improvements.
3.  **Pull Requests**:
    *   Fork the repository and create a new branch for your feature or bug fix.
    *   Ensure your code follows the existing coding style and conventions (ESLint should pass).
    *   Write unit tests for any new functionality or bug fixes.
    *   Make sure all tests pass (`pnpm test` within the package or relevant turbo command).
    *   Update documentation (README, code comments) as necessary.
    *   Open a pull request with a clear description of your changes.

## License

This project is licensed under the **MIT License**. See the `LICENSE` file at the root of the monorepo for more details.

## Examples

See the [Usage](#usage) section for examples of initializing the client and making API requests.

### Advanced: Using a JWK Private Key

If your private key is in JWK (JSON Web Key) format as a JSON string:

```typescript
const config: SmartClientConfig = {
  // ... other config
  privateKey: JSON.stringify({
    kty: "RSA",
    kid: "my-rsa-key-2024",
    alg: "RS384",
    n: "verylongn...",
    e: "AQAB",
    d: "verylongd...",
    // ... other RSA private key components (p, q, dp, dq, qi)
  }),
  kid: "my-rsa-key-2024", // Ensure kid in config matches kid in JWK if both are present
  signingAlgorithm: 'RS384', // Ensure this matches the 'alg' in your JWK or is compatible
};
```

### TODO / Potential Improvements

*   **More Granular Error Handling**: Further differentiate error types or provide more structured error details.
*   **JWKS URI Caching**: If `jwks_uri` is used by the server for token validation (not directly by this client for signing), consider caching strategies.
*   **Support for other Grant Types**: While focused on `client_credentials`, future extensions could include other OAuth flows if needed for different SMART profiles.
*   **Request Throttling/Rate Limiting**: Implement client-side rate limiting if interacting with sensitive or rate-limited FHIR endpoints.
*   **Custom HTTP Client Configuration**: Allow passing more detailed Axios configuration (e.g., custom timeouts, proxy settings) to the `SmartClient`.
```
