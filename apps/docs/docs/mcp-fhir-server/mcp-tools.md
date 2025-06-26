# MCP FHIR Tools

## Introduction

The MCP FHIR Server exposes specific FHIR (Fast Healthcare Interoperability Resources) R4 operations as MCP (Model Context Protocol) tools. These tools enable client applications (MCP clients) to interact with FHIR resources (Patient, Practitioner, Organization) in a standardized way after successful user authentication via the SMART on FHIR flow.

## General Usage

### Authentication

Before any MCP FHIR tool can be successfully invoked, the user must have completed the SMART on FHIR authentication flow. Upon successful authentication, an `FHIR_SESSION_COOKIE` is set by the server. This cookie contains the necessary access token and FHIR server details. The `fhirAuthMiddleware` reads this cookie on each relevant request (typically to the `/sse` endpoint) and initializes a lightweight FHIR client, making it available to the MCP tool handlers. If the session is not present or invalid, tool execution will likely fail due to failed authorization checks or an inability to make authenticated FHIR calls.

### Invocation

MCP tools are invoked by sending JSON-RPC 2.0 messages over a persistent connection, typically Server-Sent Events (SSE) managed via the `/sse` endpoint in this application. The client constructs a JSON-RPC request specifying the tool `method` (which is the registered tool name) and its `params`.

### Error Handling

- **Authentication/Authorization Errors:** If the `FHIR_SESSION_COOKIE` is missing, invalid, or the contained token is expired, the `fhirClient` might not be available or functional, leading to errors. Furthermore, all tool executions are subject to Role-Based Access Control (RBAC) checks via Cerbos. If a user is not authorized to perform a specific action on a resource, Cerbos will deny the request, and the tool will return an authorization error.
- **FHIR Server Errors:** If the external FHIR server returns an error for an API call (e.g., 404 Not Found, 401 Unauthorized, 500 Internal Server Error), the tool will relay this failure, typically by throwing an error that results in a JSON-RPC error response to the client. The audit logs will contain more detailed information about the error.
- **Input Validation:** MCP tools have defined `inputSchema` (see `apps/mcp/src/server/tools/fhir-tools.ts`). If the `params` sent in the JSON-RPC request do not conform to this schema, the MCP server framework may reject the request or the tool handler might error.

## Available Tools

The following tools are provided for interacting with FHIR resources. Tool names in MCP (used as the `method` in JSON-RPC calls) are as listed below.

### FHIR Resource Tools

- **`fhirResourceCreate`**
  - Description: Creates a new FHIR resource.
  - Input (`params`): `{ "resourceType": "string", "resource": <unknown> }` (The FHIR Resource R4 object to create).
  - Output: The created FHIR Resource R4 object from the server, including its server-assigned ID and metadata.
- **`fhirResourceRead`**
  - Description: Reads a FHIR resource by its ID.
  - Input (`params`): `{ "resourceType": "string", "id": "string" }` (The logical ID of the Resource).
  - Output: The requested FHIR Resource R4 object.
- **`fhirResourceUpdate`**
  - Description: Updates an existing FHIR resource by its ID. The provided `resource` should be the complete updated FHIR resource.
  - Input (`params`): `{ "resourceType": "string", "id": "string", "resource": <unknown> }`.
  - Output: The updated FHIR Resource R4 object from the server.
- **`fhirResourceSearch`**
  - Description: Searches for FHIR resources based on FHIR R4 search parameters.
  - Input (`params`): { "resourceType": "string", searchParams: `Record<string, any>` } (An object representing FHIR search parameters, e.g., `{ "name": "Smith", "birthdate": "ge1990-01-01" }`).
  - Output: A FHIR R4 Bundle resource containing the search results.
- **`fhirResourceDelete`**
  - Description: Deletes an existing FHIR resource by its ID. The provided `resource` should be the complete updated FHIR resource.
  - Input (`params`): `{ "resourceType": "string", "id": "string" }` (The logical ID of the Resource).
  - Output: The confirmation FHIR message R4 object from the server.

## Example MCP Call (Conceptual)

MCP clients communicate with these tools using JSON-RPC 2.0. Here's a conceptual example of a request to read a Patient:

```json
{
	"jsonrpc": "2.0",
	"method": "fhirResourceRead",
	"params": { "resourceType": "Patient", "id": "123" },
	"id": "request-1"
}
```

The `method` name corresponds to the registered tool name (e.g., `fhirResourceRead`, `fhirPatientSearch`). The `params` object structure should match the `inputSchema` defined for the respective tool in `apps/mcp/src/server/tools/fhir-tools.ts`. The server will respond with a JSON-RPC response containing either the `result` (the output described above) or an `error` object.
