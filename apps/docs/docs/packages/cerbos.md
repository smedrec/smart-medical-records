---
title: Cerbos Client (@repo/cerbos)
---

# Cerbos Client (`@repo/cerbos`)

The `@repo/cerbos` package provides a convenient way to initialize and use the Cerbos client in different JavaScript environments. It automatically detects whether your code is running in a Cloudflare Workers environment or a Node.js environment and instantiates the appropriate Cerbos client (`HTTP` or `gRPC` respectively).

## Overview

Cerbos is a decoupled authorization layer. This package simplifies the integration of Cerbos into your applications by abstracting the client initialization logic.

Key features:

-   **Automatic Environment Detection**: Switches between `@cerbos/http` for Cloudflare Workers and `@cerbos/grpc` for Node.js.
-   **Simplified Configuration**: Centralizes Cerbos PDP URL configuration.
-   **Consistent API**: Provides a `getClient()` method that returns an instance compatible with `CerbosClient` from `@cerbos/core`.

## Installation

This package is designed for use within the monorepo. It relies on peer dependencies that should be present in the `packages/cerbos/package.json` file:

-   `@cerbos/http`: For the HTTP client used in Cloudflare Workers.
-   `@cerbos/grpc`: For the gRPC client used in Node.js.
-   `@cerbos/core`: (Implicit) For shared types like `CerbosClient`.

The versions for these dependencies are managed in `packages/cerbos/package.json`.

## Configuration

### Cerbos PDP URL

The Cerbos client needs the URL of your Cerbos Policy Decision Point (PDP) instance. This can be configured in two ways, with the constructor argument taking precedence:

1.  **Constructor Argument (Recommended for Clarity)**:
    Pass the URL string as the first argument when creating a `Cerbos` instance.

    ```typescript
    import { Cerbos } from '@repo/cerbos';

    const cerbosHttpUrl = 'http://127.0.0.1:3592'; // Standard Cerbos HTTP port
    const cerbosGrpcUrl = '127.0.0.1:3593';     // Standard Cerbos gRPC port (without http/https scheme)

    // For Cloudflare Workers (or any environment where HTTP is preferred)
    const cerbosHttpInstance = new Cerbos(cerbosHttpUrl);

    // For Node.js (or any environment where gRPC is preferred and available)
    const cerbosGrpcInstance = new Cerbos(cerbosGrpcUrl);
    ```

2.  **Environment Variable**:
    Set the `CERBOS_URL` environment variable. The `Cerbos` class will automatically pick it up if no URL is provided in the constructor.
    -   **Node.js**: You can use a `.env` file (e.g., `CERBOS_URL=127.0.0.1:3593`) or set it in your shell.
    -   **Cloudflare Workers**: Configure the `CERBOS_URL` variable in your `wrangler.toml` file or through the Cloudflare dashboard.

    ```typescript
    // Assuming CERBOS_URL is set in the environment
    import { Cerbos } from '@repo/cerbos';
    const cerbosInstance = new Cerbos();
    ```

If the URL is not provided via either method, the constructor will throw an error.

## Usage

1.  **Import the `Cerbos` class**:
    ```typescript
    import { Cerbos } from '@repo/cerbos';
    ```

2.  **Instantiate the `Cerbos` class**:
    Provide the Cerbos PDP URL if not using the environment variable.
    ```typescript
    // Using environment variable
    const cerbos = new Cerbos();

    // Or, providing URL directly
    // const cerbos = new Cerbos('http://localhost:3592'); // For HTTP
    // const cerbos = new Cerbos('localhost:3593');    // For gRPC
    ```

3.  **Get the client instance**:
    Use the `getClient()` method to get the underlying Cerbos client.
    ```typescript
    const cerbosClient = cerbos.getClient();
    ```
    The returned `cerbosClient` will be either an `HTTP` client or a `GRPC` client instance, both compatible with the `CerbosClient` interface from `@cerbos/core`.

4.  **Interact with Cerbos**:
    Use the client to make authorization checks, such as `checkResource`, `checkResources`, `planResources`, etc.

    ```typescript
    async function performCheck() {
      try {
        const decision = await cerbosClient.checkResource({
          principal: {
            id: 'alice',
            roles: ['employee'],
            attributes: { department: 'marketing' },
          },
          resource: {
            kind: 'document',
            id: 'xyz123',
            attributes: { owner: 'bob', status: 'public' },
          },
          actions: ['view', 'comment'],
        });

        if (decision.isAllowed('view')) {
          console.log('Alice is allowed to view the document.');
        } else {
          console.log('Alice is NOT allowed to view the document.');
        }

        if (decision.isAllowed('comment')) {
          console.log('Alice is allowed to comment on the document.');
        } else {
          console.log('Alice is NOT allowed to comment on the document.');
        }
      } catch (error) {
        console.error('Failed to check resource with Cerbos:', error);
      }
    }

    performCheck();
    ```

## Environment Detection Details

The `@repo/cerbos` package uses the following logic to determine the environment:

-   **Cloudflare Workers**:
    -   **Detection**: Checks for the global availability of `WebSocketPair` (i.e., `typeof WebSocketPair !== 'undefined'`).
    -   **Client**: Initializes an `HTTP` client from `@cerbos/http`.
    -   **URL Format**: Expects a standard HTTP/S URL (e.g., `http://localhost:3592`).

-   **Node.js**:
    -   **Detection**: Checks for the presence and properties of the global `process` object (i.e., `typeof process !== 'undefined' && process.versions != null && process.versions.node != null`).
    -   **Client**: Initializes a `GRPC` client from `@cerbos/grpc`.
    -   **URL Format**: Expects a host and port (e.g., `localhost:3593`).
    -   **gRPC TLS**: By default, the gRPC client is instantiated with `tls: false`. For production environments or when connecting to a gRPC Cerbos PDP with TLS enabled, you would typically need to provide TLS configuration. This package currently does not expose options to configure gRPC TLS directly. If advanced gRPC configuration is needed, consider using `@cerbos/grpc` directly.

-   **Unknown Environment**:
    If neither environment is detected, the `Cerbos` constructor will throw an error, as it cannot determine which client to use.

## Error Handling

-   An error is thrown if the Cerbos URL is missing.
-   An error is thrown if the environment cannot be identified.
-   Standard errors from the `@cerbos/core`, `@cerbos/http`, or `@cerbos/grpc` clients may be thrown during operations (e.g., network issues, Cerbos PDP errors). Ensure you handle these appropriately in your application code.
---

This documentation should provide a comprehensive guide for users of the `@repo/cerbos` package.
