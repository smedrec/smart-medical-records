# @repo/auth-db

The `@repo/auth-db` package provides a reusable class, `AuthDb`, for initializing a Drizzle ORM client connected to a PostgreSQL database. It's designed for use in various applications within the monorepo that require access to the audit log database.

## Features

- Easy initialization of a Drizzle ORM instance for PostgreSQL.
- Connection configuration via environment variables (`AUTH_DB_URL`) or direct constructor arguments.
- Includes comprehensive authentication and authorization schema.
- Practitioner management with license verification and document processing.
- Role-based access control with owner, practitioner, and assistant roles.
- Audit logging and compliance tracking.
- Provides a connection check utility.

## Installation

To add `@repo/auth-db` as a dependency in another package (e.g., an application or another shared package):

```sh
# Navigate to the target package directory
cd apps/your-app # or packages/your-package

# Add @repo/auditdb using pnpm
pnpm add '@repo/auth-db@workspace:*'
```

## Usage

### Environment Variable

Ensure the `AUTH_DB_URL` environment variable is set with your PostgreSQL connection string. For example:

```env
AUTH_DB_URL="postgresql://user:password@host:port/database"
```

### Initializing and Using AuditDb

Here's a basic example of how to use the `AuthDb` class:

```typescript
import { AuthDb } from '@repo/auth-db'
import * as schema from '@repo/auth-db/schema' // Import the schema if you need to reference tables directly

async function main() {
	try {
		// Initialize AuditDb, it will use AUDIT_DB_URL from environment variables
		const authDbInstance = new AuthDb()

		// Or, provide the connection string directly
		// const auditDbInstance = new AuditDb("postgresql://user:password@host:port/database");

		// Check the database connection
		const isConnected = await authDbInstance.checkAuthDbConnection()
		if (!isConnected) {
			console.error('Failed to connect to the auth database. Exiting.')
			process.exit(1)
		}

		// Get the Drizzle ORM instance
		const db = authDbInstance.getDrizzleInstance()

		// Now you can use 'db' to interact with the database
		const user = await db.select().from(schema.user).where(eq(schema.user.id, id)).returning()
	} catch (error) {
		console.error('An error occurred:', error)
	}
}

main()
```

## Database Schema and Migrations

The database schema is defined in `src/schema.ts`. This package uses Drizzle Kit for managing database migrations. The following scripts are available in `package.json`:

- `pnpm run auditdb:generate`: Generates SQL migration files based on schema changes.
  ```sh
  pnpm --filter @repo/auditdb auditdb:generate
  ```
- `pnpm run auditdb:migrate`: Applies pending migrations to the database.
  ```sh
  pnpm --filter @repo/auditdb auditdb:migrate
  ```
- `pnpm run auditdb:studio`: Starts Drizzle Studio, a local GUI for your database.
  ```sh
  pnpm --filter @repo/auditdb auditdb:studio
  ```

Make sure your database connection URL is correctly configured (e.g., via `AUTH_DB_URL` or in `drizzle-dev.config.ts`) when running these commands.

## Practitioner Management Schema

The package includes comprehensive schema support for healthcare practitioner management:

### Core Tables

- **`practitioner`**: Extends user accounts with license information, verification status, and professional credentials
- **`license_certificate`**: Stores uploaded license documents with OCR processing results
- **`verification_attempt`**: Tracks all verification attempts (API, OCR, manual) with detailed results

### Key Features

- **License Verification**: Support for multiple verification methods (API, OCR, manual review)
- **Document Processing**: OCR capabilities for license certificate validation
- **Role-Based Access**: Three distinct roles (owner, practitioner, assistant) with appropriate permissions
- **Audit Trail**: Complete tracking of all verification and approval activities
- **Compliance**: HIPAA-compliant data handling and audit logging

### Usage Example

```typescript
import { AuthDb, licenseCertificate, practitioner } from '@repo/auth-db'

import type { NewPractitioner } from '@repo/auth-db'

const authDb = new AuthDb()
const db = authDb.getDrizzleInstance()

// Create a new practitioner
const newPractitioner: NewPractitioner = {
	id: 'user-123',
	licenseNumber: 'MD123456',
	jurisdiction: 'US-CA',
	licenseType: 'MD',
	verificationStatus: 'pending',
	specialties: ['Internal Medicine'],
	credentials: ['MD', 'FACP'],
}

await db.insert(practitioner).values(newPractitioner)

// Query practitioners with their certificates
const practitionersWithCerts = await db
	.select()
	.from(practitioner)
	.leftJoin(licenseCertificate, eq(practitioner.id, licenseCertificate.practitionerId))
	.where(eq(practitioner.verificationStatus, 'verified'))
```
