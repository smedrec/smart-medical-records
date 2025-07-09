# @repo/auditdb

The `@repo/audit-db` package provides a reusable class, `AuditDb`, for initializing a Drizzle ORM client connected to a PostgreSQL database. It's designed for use in various applications within the monorepo that require access to the audit log database.

## Features

- Easy initialization of a Drizzle ORM instance for PostgreSQL.
- Connection configuration via environment variables (`AUDIT_DB_URL`) or direct constructor arguments.
- Includes the audit log database schema (`auditLog`).
- Provides a connection check utility.

## Installation

To add `@repo/auditdb` as a dependency in another package (e.g., an application or another shared package):

```sh
# Navigate to the target package directory
cd apps/your-app # or packages/your-package

# Add @repo/auditdb using pnpm
pnpm add '@repo/audit-db@workspace:*'
```

## Usage

### Environment Variable

Ensure the `AUDIT_DB_URL` environment variable is set with your PostgreSQL connection string. For example:

```env
AUDIT_DB_URL="postgresql://user:password@host:port/database"
```

### Initializing and Using AuditDb

Here's a basic example of how to use the `AuditDb` class:

```typescript
import { AuditDb } from '@repo/audit-db'
import { auditLog } from '@repo/audit-db/schema' // Import the schema if you need to reference tables directly

async function main() {
	try {
		// Initialize AuditDb, it will use AUDIT_DB_URL from environment variables
		const auditDbInstance = new AuditDb()

		// Or, provide the connection string directly
		// const auditDbInstance = new AuditDb("postgresql://user:password@host:port/database");

		// Check the database connection
		const isConnected = await auditDbInstance.checkAuditDbConnection()
		if (!isConnected) {
			console.error('Failed to connect to the audit database. Exiting.')
			process.exit(1)
		}

		// Get the Drizzle ORM instance
		const db = auditDbInstance.getDrizzleInstance()

		// Now you can use 'db' to interact with the database
		// For example, to insert an audit log event:
		const newEvent = await db
			.insert(auditLog)
			.values({
				timestamp: new Date().toISOString(),
				action: 'user.login',
				status: 'success',
				principalId: 'user-123',
				// ... other fields
			})
			.returning()

		console.log('New audit event logged:', newEvent)

		// Example: Querying audit log events
		const recentEvents = await db.select().from(auditLog).limit(10)
		console.log('Recent audit events:', recentEvents)
	} catch (error) {
		console.error('An error occurred:', error)
	}
}

main()
```

## Database Schema and Migrations

The database schema is defined in `src/schema.ts`. This package uses Drizzle Kit for managing database migrations. The following scripts are available in `package.json`:

- `pnpm run audit-db:generate`: Generates SQL migration files based on schema changes.
  ```sh
  pnpm --filter @repo/audit-db audit-db:generate
  ```
- `pnpm run audit-db:migrate`: Applies pending migrations to the database.
  ```sh
  pnpm --filter @repo/audit-db audit-db:migrate
  ```
- `pnpm run audit-db:studio`: Starts Drizzle Studio, a local GUI for your database.
  ```sh
  pnpm --filter @repo/audit-db audit-db:studio
  ```

Make sure your database connection URL is correctly configured (e.g., via `AUDIT_DB_URL` or in `drizzle-dev.config.ts`) when running these commands.

```

```
