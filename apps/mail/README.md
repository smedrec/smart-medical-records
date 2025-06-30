# Mail Worker (`mail-worker`)

This application is a Node.js-based BullMQ worker responsible for processing send mail events from a Redis queue.

It consumes messages produced by services using the `@repo/send-mail` package.

## Prerequisites

- Node.js (version as specified in the root `package.json` or `.nvmrc`)
- pnpm (version as specified in the root `package.json`)
- Docker (for running local PostgreSQL and Redis instances, optional if you have them running elsewhere)
- A running PostgreSQL server.
- A running Redis server.

## Setup

1.  **Install Dependencies:**
    From the monorepo root:

    ```sh
    pnpm install
    ```

2.  **Environment Variables:**
    Copy the example environment file and customize it with your local settings:

    ```sh
    cp apps/mail/.env.example apps/mail/.env
    ```

    Edit `apps/mail/.env` with your actual `AUTH_DB_URL` and `MAIL_REDIS_URL`. Required variables:
    - `AUTH_DB_URL`: Connection string for PostgreSQL (e.g., `postgresql://user:password@localhost:5432/auditdb`)
    - `MAIL_REDIS_URL`: Connection string for Redis (e.g., `redis://localhost:6379`)
    - `MAIL_QUEUE_NAME`: Name of the BullMQ queue to process (defaults to `audit`)
    - `LOG_LEVEL`: Logging level (e.g., `info`, `debug`, defaults to `info`)
    - `WORKER_CONCURRENCY`: Number of concurrent jobs the worker can process (defaults to 5)

## Development

### Run in Development Mode

This command starts the TypeScript compiler in watch mode and uses `nodemon` to restart the worker when changes are detected.

```sh
# From the monorepo root
pnpm -F mail-worker dev

# Or from the apps/audit directory
# cd apps/mail
# pnpm dev
```

### Build for Production

This command compiles the TypeScript code to JavaScript in the `apps/mail/dist` directory.

```sh
# From the monorepo root
pnpm -F mail-worker build

# Or from the apps/mail directory
# cd apps/mail
# pnpm build
```

### Run in Production Mode

After building, you can run the worker using:

```sh
# From the monorepo root
pnpm -F mail-worker start

# Or from the apps/audit directory
# cd apps/mail
# pnpm start
```

Ensure environment variables are set in your production environment.

## Testing

Run unit tests using Vitest:

```sh
# From the monorepo root
pnpm -F mail-worker test

# Or from the apps/audit directory
# cd apps/mail
# pnpm test
```

Integration tests (if developed) might require separate setup for Redis/Postgres and specific test scripts.

## How it Works

1.  **Queue Interaction:** The worker connects to Redis using the provided `MAIL_REDIS_URL` and listens to the queue specified by `MAIL_QUEUE_NAME`.
2.  **Job Processing:** When a new job (an `MAilSendEvent`) arrives, the worker:
    - Parses the event data.
    - Reads the organization configuration to send emails
    - Sends a email using the organization mail configuration.
3.  **Logging:** The worker uses `workers-tagged-logger` for logging its operations. Log level is configurable via `LOG_LEVEL`.
4.  **Error Handling:** If processing a job fails, BullMQ's retry mechanism will take effect based on its default configuration. Failed jobs are retained for a configurable period.

## AGENTS.md Check

There are no specific `AGENTS.md` instructions in `apps/mail` or its parent directories that directly apply to the worker's core logic beyond general repository guidelines. The `.cursor/rules/worker-development.mdc` was for Cloudflare Workers and is less relevant now, but principles of clear configuration and testing still apply.
The `packages/mail/AGENTS.md` (if it existed) would be relevant for how events are _produced_, which this worker _consumes_.
This worker adheres to the general structure of a Node.js application within the monorepo.
