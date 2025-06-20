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

### Patient Tools

- **`fhirPatientCreate`**
  - Description: Creates a new Patient FHIR resource.
  - Input (`params`): `{ "resource": Patient }` (The FHIR Patient R4 object to create).
  - Output: The created FHIR Patient R4 object from the server, including its server-assigned ID and metadata.
- **`fhirPatientRead`**
  - Description: Reads a Patient FHIR resource by its ID.
  - Input (`params`): `{ "id": "string" }` (The logical ID of the Patient).
  - Output: The requested FHIR Patient R4 object.
- **`fhirPatientUpdate`**
  - Description: Updates an existing Patient FHIR resource by its ID. The provided `resource` should be the complete updated Patient resource.
  - Input (`params`): `{ "id": "string", "resource": Patient }`.
  - Output: The updated FHIR Patient R4 object from the server.
- **`fhirPatientSearch`**
  - Description: Searches for Patient FHIR resources based on FHIR R4 search parameters.
  - Input (`params`): `Record<string, any>` (An object representing FHIR search parameters, e.g., `{ "name": "Smith", "birthdate": "ge1990-01-01" }`).
  - Output: A FHIR R4 Bundle resource containing the search results.

### Practitioner Tools

- **`fhirPractitionerCreate`**
  - Description: Creates a new Practitioner FHIR resource.
  - Input (`params`): `{ "resource": Practitioner }`.
  - Output: The created FHIR Practitioner R4 object.
- **`fhirPractitionerRead`**
  - Description: Reads a Practitioner FHIR resource by its ID.
  - Input (`params`): `{ "id": "string" }`.
  - Output: The requested FHIR Practitioner R4 object.
- **`fhirPractitionerUpdate`**
  - Description: Updates an existing Practitioner FHIR resource.
  - Input (`params`): `{ "id": "string", "resource": Practitioner }`.
  - Output: The updated FHIR Practitioner R4 object.
- **`fhirPractitionerSearch`**
  - Description: Searches for Practitioner FHIR resources.
  - Input (`params`): `Record<string, any>` (e.g., `{ "family": "Jones", "identifier": "system|value" }`).
  - Output: A FHIR R4 Bundle resource containing Practitioner search results.

### Organization Tools

- **`fhirOrganizationCreate`**
  - Description: Creates a new Organization FHIR resource.
  - Input (`params`): `{ "resource": Organization }`.
  - Output: The created FHIR Organization R4 object.
- **`fhirOrganizationRead`**
  - Description: Reads an Organization FHIR resource by its ID.
  - Input (`params`): `{ "id": "string" }`.
  - Output: The requested FHIR Organization R4 object.
- **`fhirOrganizationUpdate`**
  - Description: Updates an existing Organization FHIR resource.
  - Input (`params`): `{ "id": "string", "resource": Organization }`.
  - Output: The updated FHIR Organization R4 object.
- **`fhirOrganizationSearch`**
  - Description: Searches for Organization FHIR resources.
  - Input (`params`): `Record<string, any>` (e.g., `{ "name": "General Hospital", "address-city": "Anytown" }`).
  - Output: A FHIR R4 Bundle resource containing Organization search results.

## Example MCP Call (Conceptual)

MCP clients communicate with these tools using JSON-RPC 2.0. Here's a conceptual example of a request to read a Patient:

```json
{
	"jsonrpc": "2.0",
	"method": "fhirPatientRead",
	"params": { "id": "123" },
	"id": "request-1"
}
```

The `method` name corresponds to the registered tool name (e.g., `fhirPatientRead`, `fhirPatientSearch`). The `params` object structure should match the `inputSchema` defined for the respective tool in `apps/mcp/src/server/tools/fhir-tools.ts`. The server will respond with a JSON-RPC response containing either the `result` (the output described above) or an `error` object.
