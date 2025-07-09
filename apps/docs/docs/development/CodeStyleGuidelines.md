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

- Configuration in [.prettierrc.cjs](mdc:.prettierrc.cjs)
- Format files with: `pnpm run format`

### Key Formatting Rules

1. **Single Quotes**
   - Use single quotes (`'`) for strings
   - Rationale: Consistent with TypeScript default and most modern JS projects
   - Exception: JSX attributes use double quotes (`"`) for HTML compatibility

2. **Trailing Commas**
   - Always add trailing commas in object declarations
   - Benefits: Easier version control diffs and future-proofing for multi-line objects
   - Example:

   ```ts
   // Good
   const config = {
   	indent: 2,
   	singleQuote: true,
   }

   // Bad
   const config = {
   	indent: 2,
   	singleQuote: true,
   }
   ```

3. **2-Space Indentation**
   - Use 2-space indentation for all code
   - Reason: Matches Prettier's default and improves readability in most code editors
   - Configuration: `"tabWidth": 2` in [packages/typescript-config/workers.json](mdc:packages/typescript-config/workers.json)

4. **Semicolons**
   - Always add semicolons at the end of statements
   - Rationale: Prevents ASI (Automatic Semicolon Insertion) issues and ensures explicit statement termination
   - Example:

   ```ts
   // Good
   console.log('Hello')

   // Bad
   console.log('Hello')
   ```

5. **Object Literal Spacing**
   - Add spaces between brackets in object literals
   - Rationale: Improves readability of object declarations
   - Example:

   ```ts
   // Good
   const obj = { key: 'value' }

   // Bad
   const obj = { key: 'value' }
   ```

## File Structure

- Feature files grouped by domain in `src/`
- Shared utilities in `lib/` or `utils/` directories
- Tests in `test/` directory with:
  - `*.test.ts` for unit tests
  - `integration/` for worker tests

## Git Commit Style

- Use conventional commits:
  - `feat: add new feature`
  - `fix: resolve bug`
  - `chore: update dependencies`
- Keep messages under 72 characters
- Commit message examples:

  ```bash
  # Good
  feat: add patient search endpoint
  fix: resolve form validation bug
  chore: update dependencies

  # Bad
  Fixed bug
  Added new thing
  ```
