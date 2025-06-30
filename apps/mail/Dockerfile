# Stage 1: Base with Node.js
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Stage 2: Install dependencies
FROM base AS deps
# Copy root and workspace files
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY tsconfig.json ./
COPY turbo.jsonc ./
COPY patches/fhirclient@2.6.0.patch ./patches/fhirclient@2.6.0.patch

# Copy necessary package.json files for all apps and packages
# This is a bit of a shotgun approach, but ensures all workspace dependencies are recognized by pnpm
# A more optimized approach would be to use `pnpm list -r --depth -1 --json` to get the dependency tree
# and copy only the necessary package.json files.
COPY apps/mail/package.json ./apps/audit/

COPY packages/audit/package.json ./packages/audit/
COPY packages/auth-db/package.json ./packages/auth-db/
COPY packages/send-mail/package.json ./packages/send-mail/
COPY packages/mailer/package.json ./packages/mailer/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/tools/package.json ./packages/tools/
COPY packages/typescript-config/package.json ./packages/typescript-config/

# Install all dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --strict-peer

# Stage 3: Build the application
FROM base AS build
COPY --from=deps /app /app

# Copy the source code for the mail app and its direct dependencies
# This assumes that @repo/mail is a local workspace package
COPY apps/mail ./apps/mail
COPY packages/audit ./packages/audit
COPY packages/auth-db ./packages/auth-db
COPY packages/send-mail ./packages/send-mail
COPY packages/mailer ./packages/mailer
COPY packages/typescript-config ./packages/typescript-config
COPY packages/tools ./packages/tools
COPY packages/eslint-config ./packages/eslint-config

# If there are other @repo dependencies for audit-worker, they need to be copied too.
# For example, if @repo/tools or @repo/eslint-config were runtime dependencies (they are devDeps here).

# Set the working directory for the build
WORKDIR /app/apps/mail

# Build the mail worker
# We need to ensure that the build command also builds any local workspace dependencies if they haven't been built.
# Turborepo handles this, so `pnpm build` within the app's context should be fine if turbo is set up correctly.
# Alternatively, filter the build at the root: `pnpm --filter mail-worker build`
RUN pnpm build

# Stage 4: Development server
FROM base AS dev
WORKDIR /app

# Copy built artifacts and necessary files
COPY --from=build /app /app
# Copy the source code again for nodemon to pick up changes
COPY apps/mail/src ./apps/mail/src

# Set the working directory for the app
WORKDIR /app/apps/mail

# Expose any ports if necessary (not needed for this worker)
# EXPOSE 3000

# Set environment variables
ENV NODE_ENV=development

# Command to run the development server
# This assumes that `npm run dev` in `apps/mail/package.json` handles TypeScript compilation and restarts.
# `concurrently "tsc -w" "nodemon dist/index.js"`
CMD ["npm", "run", "dev"]
