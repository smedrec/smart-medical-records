# FHIR Client (@repo/fhir)

## Introduction

This page details the `@repo/fhir` package, which provides the core client functionality for interacting with an external FHIR R4 server. It handles constructing API requests, managing SMART on FHIR authentication, and processing responses. The client is built upon `openapi-fetch` for making HTTP requests. For the SMART on FHIR flow, it manually implements PKCE and state handling and uses utilities from the `fhirclient` library (like `getWellKnownSMARTConfig`) for discovering server metadata.

## Configuration

The FHIR client, particularly its authentication functions (`authorizeSmartClient` and `createSmartFhirClient`), requires several configuration parameters. These are typically provided via environment variables set in the Cloudflare Worker, which are then passed via an `env` object in the `SmartFhirClientOptions`.

### FHIR Server Base URL (`iss`)

- **Purpose:** The base URL of the FHIR R4 server you intend to connect to. This is also known as the "Issuer" (`iss`) URL in SMART on FHIR terminology.
- **Configuration:**
  - Primarily set via the `SMART_ISS` environment variable.
  - Can also be passed as an `iss` property in the `SmartFhirClientOptions` object, which would override the environment variable.
  - A fallback to the `FHIR_BASE_URL` environment variable is also supported by the configuration helper (`getSmartConfigFromEnv`).
- **Usage:** This URL is crucial. It's used to:
  - Discover the FHIR server's SMART capabilities (like its authorization and token endpoints via `/.well-known/smart-configuration` or `/metadata`).
  - Serve as the `aud` (audience) parameter in the OAuth 2.0 authorization request.
  - Become the base URL for all subsequent FHIR API calls made by the initialized client.

### SMART on FHIR Environment Variables / Options

The following parameters are vital for the SMART on FHIR authentication flow:

- **`SMART_CLIENT_ID` (or `clientId` option):**

  - **Purpose:** The OAuth 2.0 Client ID assigned to the MCP FHIR Server application. This ID is obtained when registering the application with the FHIR Identity Provider (IdP).
  - **Required:** Yes.

- **`SMART_REDIRECT_URI` (and the `redirectUri` option for `authorizeSmartClient`):**

  - **Purpose:** The callback URL where the IdP redirects the user after authentication. This **must exactly match** one of the redirect URIs registered with the IdP for your client application.
  - **Configuration & Usage:**
    - The `/auth/login` route in the MCP server dynamically constructs the `redirectUri` passed to `authorizeSmartClient` using the request's origin (e.g., `https://<your-worker-domain>/auth/callback`). This ensures the correct origin is used when initiating the redirect to the IdP.
    - The `SMART_REDIRECT_URI` environment variable should be set to this exact, full callback URL (e.g., `https://<your-worker-domain>/auth/callback`). This value from the environment is then used by `createSmartFhirClient` during the token exchange step (as the `redirect_uri` parameter sent to the token endpoint) and is critical for `FHIR.oauth2.ready()` to correctly process the callback.
  - **Required:** Yes.

- **`SMART_SCOPE` (or `scope` option):**
  - **Purpose:** A space-separated string of OAuth 2.0 scopes that the application requests. This determines the permissions the application will have if the user authorizes the request.
  - **Examples:** `openid profile fhirUser launch/patient patient/*.read user/*.read offline_access` (if refresh tokens are desired and supported).
  - **Required:** Yes.

## Authentication Flow (SMART on FHIR)

The `@repo/fhir` package provides two main functions to handle the server-side aspects of the SMART on FHIR authorization code flow with PKCE. This flow is specifically adapted for execution within a Cloudflare Worker environment.

### 1. `authorizeSmartClient(options)`

- **Purpose:** Initiates the SMART on FHIR login process. It prepares all necessary OAuth parameters, generates PKCE codes (`code_verifier` and `code_challenge`) and a `state` value for CSRF protection, constructs the full authorization URL for the FHIR IdP, and returns these details to the caller.
- **Key Options (`SmartFhirClientOptions`):**
  - `env`: The Cloudflare Worker environment object (expected to contain `SMART_CLIENT_ID`, `SMART_ISS`, `SMART_SCOPE`).
  - `redirectUri`: The specific, fully qualified redirect URI for this authorization request (e.g., `https://<worker-domain>/auth/callback`).
  - `iss` (optional): Overrides `env.SMART_ISS`.
  - `clientId` (optional): Overrides `env.SMART_CLIENT_ID`.
  - `scope` (optional): Overrides `env.SMART_SCOPE`.
  - `launch` (optional): The launch context token, if applicable (e.g., for an EHR launch scenario).
- **Returned Object:** A Promise resolving to:
  - `authorizeUrl: string`: The fully constructed URL to which the user's browser should be redirected to authenticate with the IdP.
  - `codeVerifier: string`: The generated PKCE code verifier. **This must be securely stored by the caller** (e.g., in an HttpOnly, Secure cookie) as it's required during the token exchange in the callback step.
  - `stateValue: string`: The generated `state` parameter. **This must also be securely stored by the caller** (e.g., in an HttpOnly, Secure cookie) and verified in the callback step to prevent CSRF attacks.

### 2. `createSmartFhirClient(options)`

- **Purpose:** Handles the callback from the FHIR IdP after the user authenticates and authorizes the application. It verifies the `state` parameter, then exchanges the received authorization `code` for an access token (and optionally an ID token, refresh token) at the IdP's token endpoint, using the previously stored `pkceCodeVerifier`. If successful, it returns an initialized FHIR API client (`openapi-fetch` instance) pre-configured with the obtained access token.
- **Key Options (`SmartFhirClientOptions`):**
  - `request`: The incoming Cloudflare Worker `Request` object (which includes the callback URL with `code` and `state` query parameters).
  - `env`: The Worker environment object.
  - `pkceCodeVerifier`: The PKCE code verifier that was generated by `authorizeSmartClient` and stored by the caller.
  - `expectedState`: The `state` value that was generated by `authorizeSmartClient` and stored by the caller.
  - `iss`, `clientId`, `scope` (optional): These can override `env` values if necessary, but typically the values used should be consistent with the initial authorization request. The `redirectUri` for the token exchange is derived from the incoming `request`'s URL within this function.
- **Returned Object:** A Promise resolving to an `openapi-fetch` client instance. This client is pre-configured with:
  - The `baseUrl` set to the FHIR server's URL (this is `smartClient.state.serverUrl`, which `fhirclient`'s `ready()` function determines, usually matching the `iss`).
  - An `onRequest` middleware that automatically adds the `Authorization: Bearer <access_token>` header to all outgoing FHIR API requests.

## Using the Client

The client returned by `createSmartFhirClient` is an instance of `openapi-fetch`, typed according to the FHIR R4 OpenAPI specification (via `paths` from `@repo/fhir/src/r4.d.ts`). You use its HTTP methods (`GET`, `POST`, `PUT`, etc.) to interact with FHIR resources.

```typescript
// Example: Assuming 'fhirApiClient' is the client from createSmartFhirClient
// and Patient is a type from '@repo/fhir/src/r4'.

import type { Client } from 'openapi-fetch' // Or your specific aliased type for the FHIR client
import type { Patient } from '@repo/fhir/src/r4'

// Assuming 'paths' is the type definition for FHIR API paths.
// import type { paths } from '@repo/fhir/src/r4.d.ts';
// type FhirApiClientType = Client<paths>;

async function getPatient(fhirApiClient: Client<any>, patientId: string): Promise<Patient> {
	const { data, error, response } = await fhirApiClient.GET('/Patient/{id}', {
		params: { path: { id: patientId } },
	})

	if (error) {
		// For detailed debugging:
		// console.error(`FHIR API Error: ${response.status} ${response.statusText}`, await response.text());
		throw new Error(`Failed to fetch patient ${patientId}: ${error.message || response.statusText}`)
	}
	return data as Patient // Cast if 'data' is not strictly typed enough by default
}
```

For more advanced usage patterns and options available with `openapi-fetch`, please refer to its official documentation.

## Error Handling

- The `openapi-fetch` client, as configured in `@repo/fhir`, will typically throw an error if the FHIR server responds with a non-2xx HTTP status (e.g., 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error) or if network issues occur.
- The `error` object returned by `openapi-fetch` usually contains a `message`. The `response` object (also returned) can be inspected for the HTTP status code and the response body, which might contain an `OperationOutcome` FHIR resource with more details about the error.
- The `authorizeSmartClient` and `createSmartFhirClient` functions themselves include error handling for invalid or missing configuration, state validation failures, and issues during the PKCE code generation or token exchange process. These errors should be caught and handled appropriately in your Hono route handlers (e.g., by redirecting to an error page or returning a JSON error response).
