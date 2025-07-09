# @repo/cerbos

This package provides a Cerbos class that automatically initializes the correct Cerbos client based on the runtime environment. It uses the HTTP client for Cloudflare Workers and the gRPC client for Node.js environments.

This allows for a unified way to interact with Cerbos policies across different parts of your application stack that might run in varying JavaScript environments.

## Installation

This package is intended to be used as part of a monorepo. Ensure that its peer dependencies are met:

```json
"dependencies": {
  "@cerbos/grpc": "^0.22.0",
  "@cerbos/http": "0.22.0"
}
```

(And `@cerbos/core` is implicitly required for types).

## Usage

First, ensure that your Cerbos PDP is running and accessible.

You need to provide the Cerbos PDP URL. This can be done in two ways:

1.  **Environment Variable**: Set the `CERBOS_URL` environment variable.
    - For Node.js, this can be in a `.env` file (e.g., `CERBOS_URL=localhost:3593` for local gRPC).
    - For Cloudflare Workers, configure this in your `wrangler.toml` or via the Cloudflare dashboard.
2.  **Constructor Argument**: Pass the URL directly when creating an instance of the `Cerbos` class. This will override any environment variable.

```typescript
import { Cerbos } from '@repo/cerbos'

// Option 1: Using environment variable CERBOS_URL
// Ensure CERBOS_URL is set in your environment.
// e.g., CERBOS_URL=http://localhost:3592 (for HTTP) or CERBOS_URL=localhost:3593 (for gRPC)
const cerbosInstanceEnv = new Cerbos()
const cerbosClientEnv = cerbosInstanceEnv.getClient()

// Option 2: Providing URL directly in the constructor
const cerbosPdpUrl = 'http://localhost:3592' // Or 'localhost:3593' for gRPC
const cerbosInstanceDirect = new Cerbos(cerbosPdpUrl)
const cerbosClientDirect = cerbosInstanceDirect.getClient()

// Now you can use the cerbosClient to interact with the Cerbos PDP
// For example, to check permissions:
async function checkAccess() {
	try {
		const decision = await cerbosClientDirect.checkResource({
			principal: {
				id: 'user123',
				roles: ['USER'],
				attributes: { department: 'engineering' },
			},
			resource: {
				kind: 'document',
				id: 'doc456',
				attributes: { owner: 'user123', status: 'draft' },
			},
			actions: ['view', 'edit'],
		})

		if (decision.isAllowed('view')) {
			console.log('User is allowed to view the document.')
		} else {
			console.log('User is NOT allowed to view the document.')
		}

		if (decision.isAllowed('edit')) {
			console.log('User is allowed to edit the document.')
		} else {
			console.log('User is NOT allowed to edit the document.')
		}
	} catch (error) {
		console.error('Error checking resource with Cerbos:', error)
	}
}

checkAccess()
```

## Environment Detection

- **Cloudflare Workers**: Detected by the presence of `WebSocketPair`. Initializes `HTTP` client from `@cerbos/http`.
- **Node.js**: Detected by the presence of `process.versions.node`. Initializes `GRPC` client from `@cerbos/grpc`.
  - By default, the gRPC client is initialized with `tls: false`. If you need to connect to a gRPC Cerbos instance with TLS enabled, you will need to modify the client instantiation logic or use the `@cerbos/grpc` client directly with appropriate options.

If the environment cannot be determined, an error will be thrown during instantiation.
