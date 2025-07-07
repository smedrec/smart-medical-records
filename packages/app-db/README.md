# @repo/app-db

The `@repo/app-db` package provides a reusable class, `AppDb`, for initializing a Drizzle ORM client connected to a PostgreSQL database. It's designed for use in various applications within the monorepo that require access to the app database.

## Features

- Easy initialization of a Drizzle ORM instance for PostgreSQL.
- Connection configuration via environment variables (`APP_DB_URL`) or direct constructor arguments.
- Includes all app database schema (`auditLog`).
- Provides a connection check utility.

## Installation

To add `@repo/app db` as a dependency in another package (e.g., an application or another shared package):

```sh
# Navigate to the target package directory
cd apps/your-app # or packages/your-package

# Add @repo/auditdb using pnpm
pnpm add '@repo/app-db@workspace:*'
```

## Usage

### Environment Variable

Ensure the `APP_DB_URL` environment variable is set with your PostgreSQL connection string. For example:

```env
APP_DB_URL="postgresql://user:password@host:port/database"
```
