# MCP FHIR Server Overview

## Introduction

The MCP FHIR Server is a backend application designed to securely access, retrieve, and manage health data from an external FHIR R4 server. It acts as a bridge, making the FHIR server's API accessible to client applications primarily through the Model Context Protocol (MCP). This enables standardized and controlled data exchange for applications that consume health information via MCP.

## Key Features

*   **FHIR R4 Compatibility:** Interacts with standard FHIR R4 APIs.
*   **SMART on FHIR Authentication:** Implements the SMART on FHIR framework (using OAuth 2.0 with PKCE) for secure, delegated authorization to the FHIR server. This is adapted for server-side (Cloudflare Workers) operation.
*   **MCP Tool-Based Operations:** Exposes FHIR operations (CRUD + Search for Patient, Practitioner, and Organization resources) as MCP tools, allowing MCP clients to interact with FHIR data.
*   **Role-Based Access Control (RBAC):** Integrates with Cerbos to enforce fine-grained access control policies on FHIR operations invoked via MCP tools.
*   **Audit Logging:** Provides audit trails for significant actions, including authorization attempts, Cerbos checks, and FHIR resource interactions.

## High-Level Architecture

The MCP FHIR Server is built as a Cloudflare Worker application, utilizing the following key components:

*   **Hono:** A lightweight web framework used for routing and handling HTTP requests within the Cloudflare Worker. It manages the SMART on FHIR authentication routes (`/auth/login`, `/auth/callback`, `/auth/logout`) and the primary MCP interaction endpoint (`/sse`).
*   **`@repo/fhir` Package:** A dedicated package within this monorepo that contains the FHIR client logic. This client is responsible for:
    *   Orchestrating the SMART on FHIR authentication flow (PKCE generation, authorization URL construction, token exchange).
    *   Making API calls to the external FHIR server using `openapi-fetch` (a typed Fetch client based on the FHIR OpenAPI specification).
*   **Model Context Protocol (MCP) SDK:** Used to define and serve MCP tools. These tools wrap the underlying FHIR client operations. Client applications interact with these tools over an SSE (Server-Sent Events) connection established at the `/sse` endpoint.
*   **Cerbos:** A decoupled access control policy engine used to enforce RBAC on the MCP FHIR tools before any FHIR API call is made.
*   **Cloudflare Workers:** Provides the serverless execution environment, enabling global distribution and scalability.

The typical operational flow involves a user initiating an action that requires FHIR data. If not already authenticated, they are redirected via their browser to a FHIR Identity Provider. Upon successful authentication and authorization, a session is established with the MCP FHIR Server. Subsequent MCP tool calls (carrying the session context) use the obtained access token to interact securely with the FHIR server, with each operation being authorized by Cerbos.

## Documentation Pages

For more detailed information on specific aspects of the MCP FHIR Server, please refer to the following pages:

*   [Authentication and Authorization Flow](./authentication.md)
*   [FHIR Client (@repo/fhir)](./fhir-client.md)
*   [MCP FHIR Tools](./mcp-tools.md)
*   [Security (RBAC and Audit)](./security.md)
*   [Deployment and Configuration](./deployment.md)
