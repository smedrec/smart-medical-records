---
title: '@repo/auditdb'
---

# `@repo/auditdb`

The `@repo/auditdb` package is a crucial component for maintaining a comprehensive audit trail across applications within the SMEDREC ecosystem. It provides a standardized way to connect to and interact with a PostgreSQL database designated for storing audit logs. The core of this package is the `AuditDb` class, which simplifies the initialization of a [Drizzle ORM](https://orm.drizzle.team/) client, pre-configured with the audit log schema.

## Purpose

- **Centralized Audit Logging**: Offers a single, consistent interface for database interactions related to audit events.
- **Reusable Database Client**: Allows multiple applications or services to easily connect to the audit database without duplicating connection logic.
- **Schema Management**: Works with Drizzle Kit for robust database schema definition and migration management.

## Installation

To use `@repo/auditdb` in another package within your monorepo (e.g., an API service or a background worker), add it as a dependency:

```bash
# Navigate to your app's or package's directory
cd apps/your-app # or packages/your-package

# Add @repo/auditdb using pnpm, ensuring it links to the workspace version
pnpm add '@repo/auditdb@workspace:*'
```

## Setup

### Environment Variables

The `AuditDb` class relies on a PostgreSQL connection string to connect to the database. This should be provided via the `AUDIT_DB_URL` environment variable:

```env
AUDIT_DB_URL="postgresql://YOUR_USER:YOUR_PASSWORD@YOUR_HOST:YOUR_PORT/YOUR_DATABASE"
```

Replace the placeholders (`YOUR_USER`, `YOUR_PASSWORD`, etc.) with your actual PostgreSQL credentials and connection details.

## `AuditDb` Class API

The primary export of this package is the `AuditDb` class.

### Constructor

`new AuditDb(postgresUrl?: string)`

- `postgresUrl` (optional): A string representing the PostgreSQL connection URL.
  - If provided, this URL will be used to connect to the database.
  - If not provided, the class will attempt to use the connection URL from the `AUDIT_DB_URL` environment variable.
- **Throws**: An `Error` if the PostgreSQL URL is not provided (either directly or via the environment variable) or if the connection fails.

**Example:**

```typescript
import { AuditDb } from '@repo/auditdb'

// Using environment variable AUDIT_DB_URL
const dbServiceEnv = new AuditDb()

// Providing connection string directly
const dbServiceDirect = new AuditDb('postgresql://user:pass@host:port/db')
```

### Methods

#### `getDrizzleInstance(): PostgresJsDatabase<typeof schema>`

- Returns: The initialized Drizzle ORM `PostgresJsDatabase` instance, typed with the audit log schema defined in `@repo/auditdb/schema`. This instance is used to perform all database operations.

**Example:**

```typescript
const auditDbService = new AuditDb()
const drizzleClient = auditDbService.getDrizzleInstance()

// Now use drizzleClient for database operations
// e.g., await drizzleClient.select().from(auditLogTable)...
```

#### `async checkAuditDbConnection(): Promise<boolean>`

- Performs a simple query (`SELECT 1`) to verify the database connection.
- Returns: `true` if the connection is successful, `false` otherwise. Logs the outcome to the console.

**Example:**

```typescript
const auditDbService = new AuditDb()
const isConnected = await auditDbService.checkAuditDbConnection()

if (isConnected) {
	console.log('Successfully connected to the audit database.')
} else {
	console.error('Failed to connect to the audit database.')
}
```

## Usage Example

Here’s a comprehensive example demonstrating how to initialize `AuditDb` and use the Drizzle client to interact with the `auditLog` table (assuming the schema is imported).

```typescript
import { AuditDb } from '@repo/auditdb'
import { auditLog } from '@repo/auditdb/schema' // Import the schema

async function logAuditEvent() {
	try {
		const auditDbInstance = new AuditDb() // Uses AUDIT_DB_URL

		if (!(await auditDbInstance.checkAuditDbConnection())) {
			console.error('Audit DB connection check failed. Aborting operation.')
			return
		}

		const db = auditDbInstance.getDrizzleInstance()

		// Example: Inserting a new audit log event
		const [newEvent] = await db
			.insert(auditLog)
			.values({
				timestamp: new Date().toISOString(), // Event timestamp
				action: 'document.viewed',
				status: 'success', // 'success' or 'failure' from AuditEventStatus
				principalId: 'user-007',
				organizationId: 'org-smedrec',
				targetResourceType: 'PatientChart',
				targetResourceId: 'chart-abc-123',
				outcomeDescription: 'User successfully viewed patient chart.',
				details: { ipAddress: '192.168.1.100', sessionId: 'session-xyz' }, // Arbitrary JSON details
			})
			.returning()

		console.log('Audit event logged successfully:', newEvent)

		// Example: Querying the latest 5 audit events for a specific user
		const userEvents = await db
			.select()
			.from(auditLog)
			.where(eq(auditLog.principalId, 'user-007'))
			.orderBy(desc(auditLog.timestamp))
			.limit(5)

		console.log(`Last 5 events for user-007:`, userEvents)
	} catch (error) {
		console.error('Error during audit logging:', error)
	}
}

// Remember to import `eq` and `desc` from 'drizzle-orm' if using them
// import { eq, desc } from 'drizzle-orm';

logAuditEvent()
```

_Note: For operators like `eq` and `desc` used in queries, ensure you import them from `drizzle-orm`._

## Database Schema and Migrations

The audit log database schema is defined using Drizzle ORM in `packages/auditdb/src/schema.ts`. This typically includes tables like `auditLog` with columns for event details.

### Drizzle Kit Scripts

This package is configured with Drizzle Kit to manage database schema migrations and provide development utilities. The following scripts are available via `pnpm --filter @repo/auditdb <script_name>`:

- **`auditdb:generate`**: Compares your Drizzle schema definition (`src/schema.ts`) with the current state of your database (or existing migrations) and generates new SQL migration files in the `packages/auditdb/drizzle` directory.

  ```bash
  pnpm --filter @repo/auditdb auditdb:generate
  ```

  _Run this after making changes to `src/schema.ts`._

- **`auditdb:migrate`**: Applies any pending SQL migration files to the database connected via `AUDIT_DB_URL` (or as configured in `drizzle-dev.config.ts`).

  ```bash
  pnpm --filter @repo/auditdb auditdb:migrate
  ```

  _Run this to update your database schema to the latest version._

- **`auditdb:studio`**: Launches Drizzle Studio, a web-based GUI that allows you to browse and interact with your database tables and data.
  ```bash
  pnpm --filter @repo/auditdb auditdb:studio
  ```
  _Useful for development and debugging._

Ensure your `AUDIT_DB_URL` is correctly set in your environment or that your `drizzle-dev.config.ts` points to the correct development database when running these commands.
