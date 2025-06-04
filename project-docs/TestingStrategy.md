# Testing Strategy

## Testing Overview

All tests follow the [Vitest](mdc:apps/api/vitest.config.ts) configuration with:

- Unit tests in `*.test.ts` files
- Integration tests in `test/integration/` directories
- E2E tests in [apps/web/e2e/](mdc:apps/web/e2e/)

## Test Types

### Unit Testing

- **Frontend**: React Testing Library + Vitest (see [apps/web/vitest.config.ts](mdc:apps/web/vitest.config.ts))
- **Backend**: Vitest + Supertest for API endpoint validation
- **Coverage**: 85%+ for core modules

### Integration Testing

- **Database**: Local Miniflare D1 + Local Miniflare KV for test environments
- **Worker**: Cloudflare Worker test harness in [apps/api/src/test/integration/worker.test.ts](mdc:apps/api/src/test/integration/worker.test.ts)
- **API**: End-to-end flow validation with real database connections

### E2E Testing

- **Tool**: Cypress 13.x with component testing
- **Coverage**: Critical paths only (login, form submission, data export)
- **Execution**: `pnpm run e2e` in [apps/web/](mdc:apps/web/)

## CI/CD Integration

- **GitHub Actions**:
  - Unit tests on PR
  - Integration tests on merge
  - E2E tests nightly
- **Thresholds**:
  - Fail build if coverage <80%
  - Block deployment if critical tests fail

## Mocks & Fixtures

- **Frontend**:
  - Mock service workers in [apps/web/src/mocks/](mdc:apps/web/src/mocks/)
  - Storybook stories for component states
- **Backend**:
  - [apps/api/src/test/fixtures/](mdc:apps/api/src/test/fixtures/) for database seeding
  - [msw](mdc:packages/tools/src/bin/run-vitest) for API mocking

## Reporting

- **Coverage**: HTML reports in `coverage/` directories
- **Allure**: XML results in `allure-results/` for detailed test analysis
- **Flaky Tests**: Quarantined in [apps/api/src/test/quarantine/](mdc:apps/api/src/test/quarantine/)
