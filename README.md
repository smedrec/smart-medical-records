# Smart Medical Records (SMEDREC)

A modern, open-source medical records system for registering patient cases with treatments, forms, and conclusions. Built with Cloudflare Workers, Hono, and Drizzle ORM.

## 🏥 Features

- **Patient Case Management**: 📋 Store and organize medical records
- **Treatment Tracking**: 💉 Document procedures and therapies
- **Form Integration**: 📄 Support for medical forms and structured data
- **Conclusion Logging**: 📝 Final diagnoses and outcomes
- **Cloudflare-first**: ☁️ Edge-native architecture with Worker deployment
- **Type-safe**: 🔐 TypeScript with shared type definitions
- **Monorepo**: 🧩 Turborepo + pnpm workspaces for efficient development
- **Holistic View**: 🌍 Support for looking at the whole person, not just medical needs
- **Interdisciplinary Approach**: 🧠 Combine all branches of medical healthcare knowledge
- **Therapists**: 🧑‍⚕️ Store professional therapists (internal and/or external)
- **Assistants**: 🤖 Speed up or delegate client information management
- **Clients**: 🧑‍🤝‍🧑 Store clients with all healthcare necessities
- **Custom Forms**: 📋 Design your own questionnaires for next-gen analytics
- **Internationalization**: 🌐 Translate and adapt to your language
- **Statistics**: 📊 Access important statistics at a glance
- **Customise**: 🎨 View what's relevant to you, aggregate info through forms
- **As Many as Necessary**: 📚 Support for multiple case studies per client
- **Treatments**: 💉 Track treatments within case studies
- **Immutable Conclusions**: 📝 Finalize case studies with unchangeable conclusions
- **Transit Encryption**: 🔒 Data encryption in transit using world-standard protocols
- **Session Tracking**: 🔐 Real-time user login location visibility
- **Database Backups**: 📦 Point-in-Time Recovery for data preservation
- **Secure Networks**: 🛡️ Services in isolated secure networks
- **Built-in Firewalls**: 🛡️ Protection from malicious attacks

## 🛠 Tech Stack

- **Framework**: [Hono](https://hono.dev/) for API routing
  - Middleware for holistic request handling
  - Modular design enabling interdisciplinary integration
- **Frontend Framework**: [Tanstack Start](https://tanstack.com/start/latest) for WEB APP
- **Database**: [Drizzle ORM](https://orm.drizzle.team/) with SQL schema
- **Security**:
  - 🔒 Built-in firewalls and transit encryption
  - 🛡️ Secure network isolation with Cloudflare Workers
- **Testing**: Vitest + Cloudflare Test Environment
- **Tooling**: Turborepo, pnpm, Eslint, Prettier
- **Deployment**: Cloudflare Workers with Wrangler
- **Analytics**:
  - 📊 Real-time statistics and custom form analytics
  - 📋 Immutable form records for audit compliance

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
├── api/  # Core API worker for handling backend logic and data processing.
└── web/  # Web app worker for the user interface and client-side interactions.

packages/
├── hono-helpers/     # Shared Hono middleware for common API functionalities.
├── typescript-config/ # Shared TypeScript settings to ensure code consistency.
├── tools/             # Development utilities for building and maintaining the project.
├── app-client/        # Node.js client for interacting with the API.
```

For more detailed documentation, please refer to the [docs](./apps/docs/docs/README.md) section.

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
