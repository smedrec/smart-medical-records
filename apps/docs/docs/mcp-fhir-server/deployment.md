# Deployment and Configuration

## Overview

The MCP FHIR Server is designed as a serverless application deployed on Cloudflare Workers. This platform provides a scalable, globally distributed environment for running the server logic close to users while minimizing infrastructure management.

## Environment Variables

The behavior and configuration of the MCP FHIR Server are primarily controlled through environment variables. These must be set in your Cloudflare Worker's settings (via the Cloudflare dashboard or `wrangler.toml`).

### SMART on FHIR Client Configuration

These variables are essential for the `@repo/fhir` package to handle SMART on FHIR authentication and for the `apps/mcp` worker to orchestrate the flow correctly.

- **`SMART_CLIENT_ID`**
  - **Description:** The OAuth 2.0 Client ID for your SMART on FHIR application, obtained when registering your application with the FHIR Identity Provider (IdP).
  - **Example:** `my-mcp-fhir-app`

- **`SMART_REDIRECT_URI`**
  - **Description:** The full, absolute URI of the callback endpoint in your deployed worker. This exact URI must be registered with your FHIR IdP. The `/auth/login` route dynamically constructs the `redirect_uri` parameter for the _initial_ redirect to the IdP using the request's origin and the path `/auth/callback`. However, this `SMART_REDIRECT_URI` environment variable is used by the `@repo/fhir` client during the token exchange step in the `/auth/callback` handler, and it must precisely match the registered URI.
  - **Example:** `https://my-worker.mydomain.com/auth/callback`

- **`SMART_ISS`**
  - **Description:** The Issuer URL of the FHIR Authorization Server and Resource Server. This is the base URL of the FHIR server (e.g., `https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/`). This is the primary way to specify the FHIR server endpoint.
  - **Example:** `https://sandbox.smarthealthit.org/v/r4/fhir`

- **`FHIR_BASE_URL`** (Alternative to `SMART_ISS`)
  - **Description:** If `SMART_ISS` is not set, this variable can be used as a fallback to define the base URL of the FHIR server. It serves the same purpose as `SMART_ISS`.
  - **Example:** `https://fhir.another-server.com/r4`

- **`SMART_SCOPE`**
  - **Description:** A space-separated string of OAuth 2.0 scopes that your application requires to function. This defines the permissions your application will request from the user.
  - **Example:** `openid fhirUser profile launch/patient patient/*.read patient/*.write user/*.read user/*.write offline_access`

### Application Behavior

These variables control aspects of the Hono application and its middleware within the `apps/mcp` worker.

- **`ALLOWED_ORIGINS`**
  - **Description:** A comma-separated list of origins allowed for Cross-Origin Resource Sharing (CORS). Set to `*` to allow all origins (use with caution, especially in production).
  - **Example:** `https://my-frontend-app.com,https://another-app.com`

- **`ENVIRONMENT`**
  - **Description:** The deployment environment (e.g., `development`, `staging`, `production`). This can be used by logging, Sentry (if integrated), or other services to adjust their behavior.
  - **Example:** `production`

- **`LOG_LEVEL`** (Conceptual)
  - **Description:** While the application currently uses `console.info` for structured audit logging, a `LOG_LEVEL` variable could be adopted by a more advanced logging setup in the future to control log verbosity. Current audit logs are always emitted.
  - **Example:** `info`

- **`SENTRY_RELEASE`** (If Sentry is integrated)
  - **Description:** The release version identifier for Sentry error tracking. This is often set during the CI/CD build and deployment process.
  - **Example:** `mcp-fhir-server@1.0.5`

- **`NAME`** (Typically for Worker Identification)
  - **Description:** The name of the Cloudflare Worker service as defined in `wrangler.toml`. This is often used in logging or monitoring dashboards to identify the specific worker instance.
  - **Example:** `mcp-fhir-service`

### Cerbos Configuration

This variable is required if using Cerbos with the HTTP client for RBAC.

- **`CERBOS_HTTP_API_URL`**
  - **Description:** The full URL of your Cerbos Policy Decision Point (PDP) HTTP endpoint. The Cloudflare Worker needs to be able to make outbound HTTP requests to this URL.
  - **Example:** `http://cerbos-pdp.internal-network.local:3593` or `https://my-cerbos-pdp.public-domain.com`

## Deployment Process

1.  **Prerequisites:**
    - A Cloudflare account with Workers enabled.
    - [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started/) installed and authenticated.
    - The application monorepo cloned and all dependencies installed (e.g., via `pnpm install` at the root).

2.  **Configuration (`wrangler.toml` and Secrets):**
    - Navigate to the `apps/mcp` directory.
    - Ensure the `wrangler.toml` file is correctly configured with your Cloudflare account ID, the worker name, compatibility flags (e.g., `compatibility_date`), and any necessary build steps.
    - Set the environment variables listed above. **Sensitive values** (like `SMART_CLIENT_ID` if it's a confidential client, API keys, or specific URLs that are not public) should be configured as **secrets** using Wrangler:
      ```bash
      npx wrangler secret put SMART_CLIENT_ID
      # Enter the value when prompted
      npx wrangler secret put SMART_ISS
      npx wrangler secret put SMART_SCOPE
      npx wrangler secret put CERBOS_HTTP_API_URL
      # ... and so on for other secrets
      ```
    - Non-sensitive variables can be defined directly in `wrangler.toml` under the `[vars]` section.

3.  **Deployment Command:**
    - As mentioned in `apps/mcp/README.md`, the project may use `pnpm turbo deploy`, which likely orchestrates the deployment of the `mcp` worker via Turborepo.
    - Alternatively, you can deploy the worker directly using Wrangler from the `apps/mcp` directory:
      ```bash
      npx wrangler deploy src/worker.ts --name your-worker-name
      # Ensure 'your-worker-name' matches the name in wrangler.toml or your desired deployment name.
      ```

4.  **Verify:** After deployment, check the Cloudflare dashboard for your worker. Test the authentication flow and MCP tool endpoints to ensure the worker is functioning correctly with the configured environment.

For more detailed information on deploying and managing Cloudflare Workers, refer to the official [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/).

## External Dependencies

The MCP FHIR Server's successful operation depends on the availability and correct configuration of these external services:

- **FHIR R4 Server & Identity Provider:**
  - Must be a FHIR R4 compliant server.
  - Must support the SMART on FHIR (v1 or v2) authorization framework, specifically the Authorization Code Grant with PKCE.
  - Your MCP application (identified by `SMART_CLIENT_ID`) must be registered as a public client with this FHIR server's Identity Provider, and the `SMART_REDIRECT_URI` must be listed as an allowed callback URL.

- **Cerbos PDP (Policy Decision Point):**
  - A running instance of the Cerbos PDP.
  - It must be network-accessible from the Cloudflare Worker environment at the URL specified by `CERBOS_HTTP_API_URL`.
  - The Cerbos PDP must be loaded with the relevant policies (e.g., for `Patient`, `Practitioner`, `Organization` resources and their associated actions like `create`, `read`, `update`, `search`) located in the `policies/` directory of the monorepo.

Ensure these dependencies are properly set up, configured, and reachable for the MCP FHIR Server to function as expected.
