# Authentication and Authorization Flow (MCP Server)

## Introduction

This page details the SMART on FHIR (SoF) authentication and authorization flow as implemented in the MCP FHIR Server (`apps/mcp`). The server acts as a public OAuth 2.0 client, enabling users to authorize its access to their health data on an external FHIR server. The flow uses the Authorization Code Grant with PKCE (Proof Key for Code Exchange).

The core logic for handling SoF interactions is encapsulated within the `@repo/fhir` package, specifically through the `authorizeSmartClient` and `createSmartFhirClient` functions. The MCP FHIR Server (`apps/mcp`) provides HTTP endpoints to orchestrate this browser-based flow.

## Authentication Endpoints

The following Hono routes are exposed by the MCP server to manage the authentication lifecycle:

### `GET /auth/login`

- **Purpose:** Initiates the SMART on FHIR login sequence.
- **Process:**
  1.  When a user's browser hits this endpoint, the server prepares for the OAuth 2.0 authorization request.
  2.  It calls the `authorizeSmartClient` function (from `@repo/fhir`). This function:
      - Generates a cryptographically secure `code_verifier` (for PKCE).
      - Derives a `code_challenge` from the verifier (using SHA-256).
      - Generates a unique, opaque `state` parameter (for CSRF protection).
      - Constructs the full authorization URL for the configured FHIR Identity Provider (IdP). This URL includes parameters like `client_id`, the dynamically determined `redirect_uri` (based on the request's origin plus `/auth/callback`), `scope`, `aud` (audience, typically the FHIR server's `iss` URL), `response_type=code`, `state`, `code_challenge`, and `code_challenge_method=S256`.
  3.  The server then securely stores the generated `codeVerifier` and `stateValue` in HTTP-only, Secure cookies: `FHIR_PKCE_VERIFIER_COOKIE` and `FHIR_AUTH_STATE_COOKIE`, respectively.
  4.  Finally, the user's browser is redirected to the IdP's `authorizeUrl`.

### `GET /auth/callback`

- **Purpose:** Handles the redirect from the FHIR Identity Provider after the user has authenticated and (presumably) granted authorization. This endpoint URL (`<app_origin>/auth/callback`) must be pre-registered with the IdP as a valid redirect URI for the client application.
- **Process:**
  1.  The IdP redirects the user's browser to this endpoint. The URL includes an `authorization_code` and the original `state` value as query parameters.
  2.  The server retrieves the `code` and `state` from the URL's query string.
  3.  It also retrieves the previously stored `codeVerifier` (from `FHIR_PKCE_VERIFIER_COOKIE`) and `expectedState` (from `FHIR_AUTH_STATE_COOKIE`).
  4.  The temporary `FHIR_PKCE_VERIFIER_COOKIE` and `FHIR_AUTH_STATE_COOKIE` are then cleared.
  5.  The received `state` is validated against the `expectedState`. If they do not match, the request is rejected to prevent Cross-Site Request Forgery (CSRF) attacks.
  6.  If the state is valid, the server calls `createSmartFhirClient` (from `@repo/fhir`). This function takes the current `request` (for URL context), `env` (for configuration), the retrieved `pkceCodeVerifier`, and `expectedState`. Internally, it uses `FHIR.oauth2.ready()` which:
      - Makes a POST request to the IdP's token endpoint to exchange the `authorization_code` for an access token. This request includes `grant_type=authorization_code`, the `code`, the `redirect_uri` (which must match the one used in the initial authorization request), `client_id`, and the `code_verifier` (for PKCE).
  7.  Upon successful token exchange, the server receives an access token, potentially an ID token (containing user information), a refresh token (if `offline_access` scope was requested and granted), and other token metadata like `expires_in` and `scope`.
  8.  This session information (including the full token response, the FHIR server URL, and placeholder `userId` and `roles` – ideally derived from the ID token in a production system) is stored securely in a new HTTP-only, Secure cookie named `FHIR_SESSION_COOKIE`.
  9.  The user is then redirected to a designated page within the application, typically the application root (`/`) or a user dashboard.

### `GET /auth/logout`

- **Purpose:** Logs the user out of their current session with the MCP FHIR Server.
- **Process:**
  1.  Clears the `FHIR_SESSION_COOKIE`. This effectively ends the user's authenticated session with the MCP server.
  2.  Redirects the user to a logged-out page or the application's home page (e.g., `/`).
  - **Note:** This action only clears the session with the MCP FHIR Server. It does not typically log the user out of their session with the external FHIR Identity Provider.

## Cookies Used

The authentication process utilizes several cookies, all configured with `Path=/`, `HttpOnly=true`, `Secure=true` (requiring HTTPS), and `SameSite=Lax`:

- **`FHIR_PKCE_VERIFIER_COOKIE`:** Stores the PKCE `code_verifier` string generated during the `/auth/login` step. It is used once during the `/auth/callback` step for the token exchange and then cleared.
- **`FHIR_AUTH_STATE_COOKIE`:** Stores the `state` parameter (a random string) generated during `/auth/login`. It is used for CSRF protection during the `/auth/callback` step and then cleared.
- **`FHIR_SESSION_COOKIE`:** Stores critical session information as a JSON string after a successful token exchange. This typically includes the `tokenResponse` (containing the access token, ID token, refresh token, expiry, scope) and the `serverUrl` (the FHIR server base URL). Its expiry is usually tied to the access token's lifetime. This cookie enables the `fhirAuthMiddleware` to authenticate subsequent MCP tool requests.

## Configuration

The authentication flow relies on several configuration settings passed to the underlying `@repo/fhir` package, which are sourced from environment variables in the Cloudflare Worker:

- `SMART_CLIENT_ID`: Your application's registered client ID with the FHIR IdP.
- `SMART_REDIRECT_URI`: The full, exact redirect URI (e.g., `https://<your-worker-domain>/auth/callback`) that is registered with the IdP and used by the `createSmartFhirClient` function during the token exchange. While the `/auth/login` route dynamically sets the redirect URI for the _initial_ redirect to the IdP using the request's origin, this environment variable ensures the _token exchange_ step uses the precise, registered URI.
- `SMART_ISS`: The issuer URL of the FHIR server (e.g., `https://fhir.example.com/r4`).
- `SMART_SCOPE`: The OAuth 2.0 scopes your application requires (e.g., `openid profile fhirUser patient/*.read`).

For further details on these configurations and how they are used by the FHIR client logic, please refer to the [FHIR Client (@repo/fhir)](./fhir-client.md) documentation.

## Error Handling

Errors encountered during the authentication flow (such as a state mismatch during callback, failure to exchange the authorization code for a token, or misconfiguration) are caught by the respective Hono route handlers in `apps/mcp/src/worker.ts`. Currently, these handlers typically return a JSON error response to the client with an appropriate HTTP status code (e.g., 400 for bad request, 500 for server-side issues). In a production user-facing application, these would ideally be enhanced to redirect to user-friendly error pages or provide more structured error feedback.
