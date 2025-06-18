# API Application (`apps/api`)

The `apps/api` application is the backbone of the SMEDREC system, providing the core backend logic, data storage, and service integrations. It's built using Hono, running on Cloudflare Workers, and interacts with a database via Drizzle ORM.

## Overview

- **Purpose**: Serves as the central API for all client applications (web, mobile, etc.) and external integrations.
- **Technology Stack**:
  - Runtime: Cloudflare Workers
  - Framework: Hono
  - ORM: Drizzle ORM
  - Language: TypeScript

## Key Features

- Secure data handling for patient records, treatments, and forms.
- User authentication and authorization.
- Business logic for case management.
- Integration points for other services (e.g., FHIR, external analytics).

## Architecture

(To be detailed: High-level architecture, request flow, key components like middleware, routing structure, etc.)

## Major Endpoints

(To be detailed: List key API endpoints, their purpose, request/response formats. For example:)

- `POST /auth/login` - User authentication.
- `GET /patients` - Retrieve a list of patients.
- `POST /patients` - Create a new patient.
- `GET /patients/{id}` - Retrieve a specific patient.
- `GET /cases` - Retrieve case studies.
- ... and so on.

## Authentication & Authorization

(To be detailed: Explanation of how authentication works, token types (e.g., JWT), and how authorization/permissions are handled, possibly referencing policy files if they are used e.g. Cerbos policies mentioned in file listing).

## Error Handling

(To be detailed: Common error codes and responses.)

## Local Development

The API can be run locally using the `just dev` command, which typically starts it on `http://localhost:8787`. Refer to the [Get Started](../get-started.md) guide for more details on running the project.

## Contributing

If you are contributing to the API, ensure your changes are well-tested and documented.
