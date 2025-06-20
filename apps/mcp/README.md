# mcp

A Cloudflare Workers application using Hono

## Development

### Run in dev mode

```sh
pnpm dev
```

### Run tests

```sh
pnpm test
```

### Deploy

```sh
pnpm turbo deploy
```

**_ Integrate FHIR R4 Data Access for MCP Server _**

**_ Objective: _**

Develop a (MCP) server to securely access, retrieve, and potentially display/utilize health data from an external server that is compatible with FHIR Standard Release 4 (R4) via its FHIR API.
FHIR Resource Handling: Supports creation, validation, and management of FHIR resources including Patient, Practitioner, and Organization records. Ensures compliance with FHIR R4 standards.
Smart Medical Records Integration: Seamless integration with existing medical systems for real-time data synchronization. Implements secure data exchange protocols (e.g., OAuth2, SMART on FHIR).
Security & Compliance: Built-in support for HIPAA/GDPR compliance, audit logging, and role-based access control.
Extensible Architecture: Modular design allowing easy addition of new resource types and integration with third-party healthcare APIs.

**_ Key Requirements & Information: _**

- FHIR Server Endpoint:

1. The the base URL of the FHIR R4 server is a config variable on app workspace (e.g., https://[your-fhir-server.com]/fhir/R4/)
2. Standard FHIR conventions are assumed unless specified.

**_ Authentication & Authorization: _**

The MCP server authenticate with the FHIR API (e.g., OAuth 2.0, API Key, Basic Auth, no authentication for public data).

Authentication is required:

1.OAuth 2.0: Client ID, Client Secret, Authorization Endpoint, Token Endpoint, Scopes required. 2. API Key: Header name and key value (for development/testing; production requires secure handling). 3. Other: Specify the exact mechanism. 4. The authenticated user/client need specific permissions to access certain resource types or patient data that is implemented with rules on the cerbos server.

**_ Data Access and Querying: _**

Some FHIR Resources are primarily of interest? (e.g., Patient, Observation, Condition, MedicationRequest, DiagnosticReport).

Examples of typical queries the MCP server would need to perform:

1. Retrieve a Patient by ID: [FHIR_BASE]/Patient/[patient-id]
2. Retrieve Observations for a specific Patient: [FHIR_BASE]/Observation?patient=[patient-id]&code=[loinc-code]
3. Search for Patients by name: [FHIR_BASE]/Patient?name=[patient-name]
4. Query data within a specific date range: \_lastUpdated=gt[date]
5. The queries can involve chaining or \_include parameters? (e.g., Observation?patient=[patient-id]&\_include=Observation:subject)

Set the required headers for API requests (e.g., Accept: application/fhir+json).

**_ Data Processing & Integration within MCP: _**

1. The retrieved FHIR data should be parsed and processed within the MCP server's environment (e.g., JSON parsing).
2. The intended use is display the data in reply to the users solicitations on the app environment? (e.g., displaying patient vitals in a chat message, triggering in-game events based on health status).

**_ Error Handling & Robustness: _**

1. API errors (e.g., 401 Unauthorized, 404 Not Found, 500 Internal Server Error) should be handled.
2. Logging and monitoring should be implemented for FHIR API interactions only if unencrypted
3. Consider rate limiting from the FHIR server.

**_ Security & Privacy Considerations: _**

1. Emphasize the importance of data privacy (HIPAA/GDPR compliance) and secure handling of Protected Health Information (PHI).
2. Ensure that any sensitive information (e.g., API keys, patient data) is never exposed directly to clients or unencrypted logs.
3. Discuss strategies for secure storage and transmission of credentials.

**_ Example Conceptual Flow: _**

1. User in SMEDREC APP issues command: /getpatienthealth [patientID]
2. MCP server, using its integrated module, constructs a FHIR API request: GET [FHIR_BASE]/Patient/[patientID]
3. MCP server authenticates and sends the request.
4. FHIR server responds with Patient resource.
5. MCP server parses the JSON response.
6. MCP server extracts relevant data (e.g., patient name, current condition).
7. MCP server displays a summary message in SMEDREC chat: "Patient [Patient Name] has [Condition Name]."
