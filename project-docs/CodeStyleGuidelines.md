# Code Style Guidelines

## TypeScript

- Use strict mode (`strict: true`)
- Follow [packages/typescript-config/base.json](mdc:packages/typescript-config/base.json) for base configuration
- React-specific overrides in [packages/typescript-config/react.json](mdc:packages/typescript-config/react.json)
- Type definitions in `types.ts` files at package root

## React

- Component files use `.tsx` extension
- Hooks in `hooks/` directory with `.ts` extension
- Component structure:

```tsx
// Good
const MyComponent = () => {
  // implementation
}

export { MyComponent }

// Bad
export default function() { ... }
```

## ESLint

- Base rules from [packages/eslint-config/src/default.config.ts](mdc:packages/eslint-config/src/default.config.ts)
- React-specific rules in [packages/eslint-config/src/react.config.ts](mdc:packages/eslint-config/src/react.config.ts)
- Run linter with: `pnpm run lint`

## Prettier

- Configuration in [package.json](mdc:package.json)
- Format files with: `pnpm run format`
- Special rules:
  - Single quotes for strings
  - Trailing commas in objects
  - 2-space indentation

## File Structure

- Feature files grouped by domain in `src/`
- Shared utilities in `lib/` or `utils/`
- Tests in `test/` directory with:
  - `*.test.ts` for unit tests
  - `integration/` for worker tests

## Git Commit Style

- Use conventional commits:
  - `feat: add new feature`
  - `fix: resolve bug`
  - `chore: update dependencies`
- Keep messages under 72 characters
