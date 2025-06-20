# Security Considerations

## Introduction

Security is a critical aspect of the MCP FHIR Server, ensuring that access to sensitive health data is properly controlled and that actions are traceable. This section covers the primary security mechanisms implemented: Role-Based Access Control (RBAC) using Cerbos and detailed Audit Logging.

## Role-Based Access Control (RBAC) with Cerbos

### Overview

The MCP FHIR Server utilizes Cerbos, an open-source, decoupled access control solution, to enforce Role-Based Access Control (RBAC) on FHIR operations that are exposed as MCP tools. This allows for fine-grained permission management based on user roles and the attributes of the resources being accessed.

### Policy Enforcement

Before any FHIR operation (like reading a Patient record or creating a Practitioner resource) is executed by an MCP tool, a check is made to the Cerbos Policy Decision Point (PDP). This check determines whether the authenticated user, based on their assigned roles and the context of the request (including resource attributes), has the necessary permission to perform the requested action on the specific FHIR resource.

### Policy Files

Access control policies are defined in human-readable YAML files located in the `policies/` directory at the root of the monorepo. Key policy files relevant to FHIR resources include:

- `policies/patient.yaml`
- `policies/practitioner.yaml`
- `policies/organization.yaml`

These files contain rules that specify which roles are allowed or denied permission for defined actions on these resources, potentially based on conditions evaluating attributes of the principal or the resource.

### Resource Kinds and Actions

For the purpose of Cerbos policies, FHIR resources are identified by the following kinds (which directly match the FHIR resource types):

- `Patient`
- `Practitioner`
- `Organization`

The actions that can be performed on these resources and are checked against Cerbos policies include:

- `create`
- `read`
- `update`
- `search`

**Note:** Ensure your Cerbos policies explicitly define rules for all these actions, including `search`, to achieve the desired access control. If an action is not defined for a resource kind in the policies, Cerbos will typically deny it by default. A `delete` action, while common in FHIR, is not currently implemented in the MCP FHIR tools.

### User Roles

- **Determination (Current Implementation):** For development and demonstration, the `userId` and `roles` are set as placeholder values within the `FHIR_SESSION_COOKIE` during the authentication callback. For example, `userId` might be derived from an ID token's `sub` claim (defaulting to `'test-user-placeholder'`) and `roles` might be hardcoded (e.g., `['practitioner', 'admin']`).
- **Production Implementation:** In a production environment, it is critical to:
  1.  Securely obtain and validate the ID token provided by the SMART on FHIR IdP.
  2.  Extract verified user identity claims (such as `sub` for `userId`) from the ID token.
  3.  Obtain user roles either from custom claims within the ID token or by making a secure call to a trusted User Information endpoint or an internal identity/role management system using the access token.
      These verified `userId` and `roles` must then be used to populate the Cerbos `Principal` object for authorization checks.
- The roles used in the Cerbos policies (e.g., `admin`, `practitioner`, `patient`, `owner`, `member` as seen in policy examples) must align with the roles assigned to users within your organization's identity system.

### Error Handling

If a Cerbos authorization check denies access for a requested operation, the corresponding MCP tool will throw an authorization error (e.g., "Forbidden: You are not authorized..."). This error is then propagated back to the MCP client, typically as a JSON-RPC error response, indicating that the action was not permitted.

## Audit Logging

### Mechanism

The MCP FHIR Server implements structured audit logging for significant events related to FHIR tool operations. Audit logs are generated as JSON objects and are output to `console.info()` by default. In the Cloudflare Workers environment, these console logs can be captured and integrated with various logging services and analytics platforms through Cloudflare's logging capabilities (e.g., Cloudflare Logpush).

### Logged Events

The following types of events are audited for each MCP FHIR tool invocation:

1.  **Tool Attempt:** Logged when an MCP tool handler is first invoked, indicating the start of an operation.
2.  **FHIR Client Availability Check:** Logs a failure if the necessary FHIR client is not available in the context.
3.  **Cerbos Authorization Outcome:** Logs the success or failure of the authorization check performed by Cerbos. This includes details about the principal, resource, and action being checked.
4.  **FHIR API Call Outcome:** Logs the success or failure of the actual API call made to the external FHIR server after successful authorization.

### Log Content

Each audit log entry is a JSON object containing detailed information about the event. Key fields typically include:

- `timestamp`: An ISO 8601 timestamp (e.g., `"2023-10-27T10:30:00.000Z"`).
- `principalId`: The ID of the user performing the action (e.g., `"test-user-placeholder"`). Defaults to `"anonymous"` if user information is unavailable.
- `action`: A string describing the specific action or check being audited (e.g., `fhirPatientReadAttempt`, `cerbos:read`, `fhirPatientReadSuccess`, `fhirPatientCreateFailure`).
- `targetResourceType`: The type of resource involved (e.g., `Patient`, `Practitioner`, `Organization`).
- `targetResourceId`: The ID of the specific resource instance, if applicable (e.g., a Patient's logical ID for a read/update operation, or the ID of a newly created resource).
- `status`: The outcome of the event (`attempt`, `success`, `failure`).
- `outcomeDescription`: A human-readable description of the event's outcome (e.g., "Successfully read Patient resource," "Authorization denied by Cerbos," "FHIR API error: Status 404").
- Additional context-specific fields may be included, such as `searchParams` (for search operations), `responseStatus` (HTTP status from FHIR server on error), or `responseBody` (error details from FHIR server).

### Purpose

Comprehensive audit logs serve several vital purposes:

- **Monitoring:** Tracking system activity, API usage, and operational health.
- **Security Analysis:** Detecting suspicious activities, unauthorized access attempts, policy violations, and potential security incidents.
- **Compliance:** Helping to meet regulatory requirements for data access tracking and security event logging in healthcare environments (e.g., HIPAA in the US).
- **Debugging and Troubleshooting:** Assisting developers and administrators in diagnosing issues by providing a detailed trail of actions and outcomes leading up to an error or unexpected behavior.
