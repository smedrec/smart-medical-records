# Project Documentation

This directory contains key documentation for the Smart Medical Records project. All documentation files follow markdown component (mdc) links for easy navigation.

## Documentation Index

1. [Code Style Guidelines](mdc:project-docs/CodeStyleGuidelines.md)

   - TypeScript, React, ESLint, and file structure conventions

2. [Technical Design Specification](mdc:project-docs/TechnicalDesign.md)

   - Architecture overview and technology stack details

3. [Testing Strategy](mdc:project-docs/TestingStrategy.md)

   - Unit, integration, and end-to-end testing approach

4. [Security Compliance](mdc:project-docs/SecurityCompliance.md)
   - Authentication, data protection, and regulatory compliance

## Accessing Documentation

All documentation files use markdown component (mdc) links that can be resolved by the documentation server. To view any file:

```bash
# For local development
pnpm run docs:dev

# For production build
pnpm run docs:build
```

## Updating Documentation

When making changes to documentation:

1. Use the `final_file_content` from tool responses as reference
2. Maintain consistent formatting with existing files
3. Update this README if new documentation files are added
