# Smart Medical Records (SMEDREC)

A modern, open-source medical records system for registering patient cases with treatments, forms, and conclusions. Built with Cloudflare Workers, Hono, and Drizzle ORM.

## 🏥 Features

- **Patient Case Management**: Store and organize medical records
- **Treatment Tracking**: Document procedures and therapies
- **Form Integration**: Support for medical forms and structured data
- **Conclusion Logging**: Final diagnoses and outcomes
- **Cloudflare-first**: Edge-native architecture with Worker deployment
- **Type-safe**: TypeScript with shared type definitions
- **Monorepo**: Turborepo + pnpm workspaces for efficient development

## 🛠 Tech Stack

- **Framework**: [Hono](https://hono.dev/) for API routing
- **Database**: [Drizzle ORM](https://orm.drizzle.team/) with SQL schema
- **Testing**: Vitest + Cloudflare Test Environment
- **Tooling**: Turborepo, pnpm, Eslint, Prettier
- **Deployment**: Cloudflare Workers with Wrangler

## 🚀 Quick Start

```bash
# Install dependencies
just install

# Start development servers
just dev

# Deploy to Cloudflare
just deploy
```

## 📁 Project Structure

```
apps/
├── api/              # Core API worker
└── example-worker-echoback/  # Example worker

packages/
├── hono-helpers/     # Shared Hono middleware
├── typescript-config/ # Shared TypeScript settings
└── tools/             # Development utilities
```

## 🧪 Testing

```bash
# Run all tests
just test

# Test specific worker
pnpm turbo -F api test
```

## 🧑‍🤝‍🧑 Contributing

1. Fork the repo
2. Create a changeset: `just cs`
3. Submit a PR with clear description
4. Ensure all tests pass

## 📄 License

MIT License - see [LICENSE](LICENSE) for details
