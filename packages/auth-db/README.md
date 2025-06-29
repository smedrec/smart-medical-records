# @repo/auditdb

The `@repo/auth-db` package provides a reusable class, `AuthDb`, for initializing a Drizzle ORM client connected to a PostgreSQL database. It's designed for use in various applications within the monorepo that require access to the audit log database.

## Features

- Easy initialization of a Drizzle ORM instance for PostgreSQL.
- Connection configuration via environment variables (`AUTH_DB_URL`) or direct constructor arguments.
- Includes the audit log database schema (`auditLog`).
- Provides a connection check utility.

## Installation

To add `@repo/auditdb` as a dependency in another package (e.g., an application or another shared package):

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
AUDIT_DB_URL="postgresql://user:password@host:port/database"
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

```

```
