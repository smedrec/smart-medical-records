# Technical Design Specification

## Architecture Overview

**Frontend**:

- Tanstack Start with React Server Components
- Vinxi for optimized builds (see [packages/typescript-config/workers.json](mdc:packages/typescript-config/tanstack-start.json))
- Client components in [apps/web/components/](mdc:apps/web/components/)
- Shared types in [apps/api/src/shared/types.ts](mdc:apps/api/src/shared/types.ts)

**Backend**:

- Node.js 22.x with Hono framework (see [packages/hono-helpers/](mdc:packages/hono-helpers/))
- Auth via [better-auth](mdc:apps/api/src/lib/better-auth/index.ts)
- API routes in [apps/api/src/routes/](mdc:apps/api/src/routes/)

**AI Framework**:

- Cloudflare Worker using Mastra, The TypeScript Agent Framework (see [Mastra](https://mastra.ai/))
- AI processing in [apps/ai/](mdc:apps/ai/)
- Integrates [Cloudflare Vectorize](https://developers.cloudflare.com/vectorize/) for document analysis
- Uses [Mastra Client SDK](https://mastra.ai/en/docs/deployment/client) for API communication

**Database**:

- Cloudflare D1 schema in [apps/api/drizzle/schema/](mdc:apps/api/drizzle/schema/)
- Cloudflare KV caching for session management and rate limiting

## Dependency Management

- Shared configs in [packages/typescript-config/](mdc:packages/typescript-config/)
- ESLint rules from [packages/eslint-config/](mdc:packages/eslint-config/)
- Turborepo setup in [turbo.jsonc](mdc:turbo.jsonc)
- Worker dependencies in [wrangler.jsonc](mdc:apps/api/wrangler.jsonc)

## Performance Optimization

- LCP <1.2s through server-side rendering
- API latency <800ms p95 via Redis caching
- Bundling with Vite for frontend assets
- WebAssembly modules for OCR processing

## Security Implementation

- OAuth2 + SAML integration in [apps/api/src/lib/better-auth/](mdc:apps/api/src/lib/better-auth/)
- AES-256 encryption for stored data
- HIPAA-compliant audit logs in [apps/api/src/lib/logs/](mdc:apps/api/src/lib/logs/)
- Rate limiting via [packages/hono-helpers/src/middleware/rate-limit.ts](mdc:packages/hono-helpers/src/middleware/rate-limit.ts)

## Scalability Strategy

- Horizontal scaling through Kubernetes
- 10k concurrent user capacity
- Database sharding plan in [apps/api/drizzle.config.ts](mdc:apps/api/drizzle.config.ts)
- Worker isolation via Turborepo filters (see [turbo.jsonc](mdc:turbo.jsonc))

## Technology Stack

```json
{
	"frontend": {
		"framework": "Tanstack Start with Cloudflare works",
		"stateManagement": "React Hook Form + Zod",
		"uiLibrary": "Shadcn UI components (see @shadcn/ui)"
	},
	"backend": {
		"framework": "Hono with Cloudflare Workers",
		"database": "Cloudflare D1 + Cloudflare KV",
		"orm": "Drizzle ORM (see [apps/api/src/db/index.ts](mdc:apps/api/src/db/index.ts))"
	},
	"ai": {
		"framework": "Mastra with Cloudflare Workers",
		"models": "Cloudflare Vectorize for document processing",
		"integration": "REST API from apps/api/ for data access"
	}
}
```
