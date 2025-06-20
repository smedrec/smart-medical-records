# @repo/fhir

This package provides a client for interacting with FHIR R4 servers, including robust support for SMART on FHIR authentication tailored for server-side environments like Cloudflare Workers.

## Features

- FHIR R4 compatible client powered by `openapi-fetch`.
- SMART on FHIR v1/v2 authentication flow:
  - Authorization Code Grant with PKCE (Proof Key for Code Exchange).
  - Manual PKCE code generation and authorization URL construction for server-side redirect control.
  - Token exchange and client initialization.
- Typed FHIR operations based on an R4 OpenAPI specification (via `openapi-fetch` and `r4.d.ts`).

## Configuration and Usage

For comprehensive documentation on:

- **Configuration:** Required environment variables (e.g., `SMART_CLIENT_ID`, `SMART_REDIRECT_URI`, `SMART_ISS`, `SMART_SCOPE`, and `FHIR_BASE_URL` as a fallback for `SMART_ISS`) and dynamic options passed to the client functions.
- **Authentication Flow:** Detailed explanation of the `authorizeSmartClient` and `createSmartFhirClient` functions.
- **Client Usage:** How to use the initialized client to make FHIR API calls.
- **Error Handling.**

Please refer to the main **[MCP FHIR Server documentation on the FHIR Client](/mcp-fhir-server/fhir-client.md)**.

### Conceptual Example

The core authentication flow involves two steps, typically handled by different routes in your application:

1.  **Initiating Login (e.g., in a `/login` route):**

    ```typescript
    // import { authorizeSmartClient, SmartFhirClientOptions } from '@repo/fhir';
    // // Assuming 'c.env' aligns with SmartFhirClientEnvOptions from '@repo/fhir'
    // // import type { Context } from 'hono';
    // // import type { YourHonoEnv } from './your-hono-env-setup';

    // export async function handleLogin(c: Context<YourHonoEnv>) {
    //   const dynamicRedirectUri = new URL(c.req.url).origin + '/auth/callback';
    //   const options: SmartFhirClientOptions = {
    //     env: c.env, // Your Cloudflare Worker environment object
    //     redirectUri: dynamicRedirectUri, // This must match a URI pre-registered with the IdP
    //     // iss, clientId, scope can also be passed here to override env, if needed
    //   };
    //   const { authorizeUrl, codeVerifier, stateValue } = await authorizeSmartClient(options);
    //
    //   // 1. Store codeVerifier and stateValue securely (e.g., HttpOnly cookie)
    //   //    Example: c.cookie('pkce_verifier', codeVerifier, cookieOptions);
    //   //             c.cookie('auth_state', stateValue, cookieOptions);
    //   // 2. Redirect the user to authorizeUrl
    //   return c.redirect(authorizeUrl);
    // }
    ```

2.  **Handling Callback (e.g., in your `/auth/callback` route):**

    ```typescript
    // import { createSmartFhirClient, SmartFhirClientOptions } from '@repo/fhir';
    // // Assuming 'c.env' aligns with SmartFhirClientEnvOptions from '@repo/fhir'
    // // import type { Context } from 'hono';
    // // import type { YourHonoEnv } from './your-hono-env-setup';

    // export async function handleCallback(c: Context<YourHonoEnv>) {
    //   // 1. Retrieve code and state from URL query parameters
    //   const code = c.req.query('code');
    //   const receivedState = c.req.query('state');
    //
    //   // 2. Retrieve stored codeVerifier and expectedState (from cookie or other storage)
    //   const pkceCodeVerifier = c.req.cookie('pkce_verifier'); // Example
    //   const expectedState = c.req.cookie('auth_state');    // Example
    //
    //   // 3. Clear temporary cookies
    //   //    Example: c.cookie('pkce_verifier', '', { maxAge: 0 });
    //   //             c.cookie('auth_state', '', { maxAge: 0 });
    //
    //   if (!code || !receivedState || !pkceCodeVerifier || !expectedState) {
    //     // Handle missing parameters error
    //     return c.text('Authentication callback error: Missing parameters', 400);
    //   }
    //
    //   const options: SmartFhirClientOptions = {
    //     request: c.req.raw, // The raw Request object
    //     env: c.env,
    //     pkceCodeVerifier,
    //     expectedState,
    //     // iss, clientId, scope can also be passed if not relying solely on env
    //   };
    //   const fhirApiClient = await createSmartFhirClient(options);
    //
    //   // 4. Store the token (e.g., fhirApiClient.state.tokenResponse) securely in a session cookie
    //   //    Example: c.cookie('session_token', JSON.stringify(fhirApiClient.state.tokenResponse), sessionCookieOptions);
    //   // 5. Redirect user to the application
    //   return c.redirect('/');
    //
    //   // Example API call (if needed immediately, usually done in subsequent requests):
    //   // const { data: patient } = await fhirApiClient.GET("/Patient/{id}", {
    //   //   params: { path: { id: '123' } }
    //   // });
    // }
    ```

For detailed implementation, see the usage within the `apps/mcp` worker (`apps/mcp/src/worker.ts`) and the comprehensive documentation linked above.
