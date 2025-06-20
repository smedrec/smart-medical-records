# mcp

A Cloudflare Workers application using Hono

## Documentation

This application implements an MCP FHIR Server.
Detailed documentation can be found in the [docs site here](/mcp-fhir-server/).
(Note: VuePress links are typically absolute from the site root. The link `/mcp-fhir-server/` should correctly point to `apps/docs/docs/mcp-fhir-server/README.md` when rendered by VuePress from the `apps/docs/docs` root).

## Development

### Run in dev mode

```sh
pnpm dev
```

### Run tests

```sh
pnpm test
```

### Deploy

```sh
pnpm turbo deploy
```
