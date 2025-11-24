# Testing Guide

This project uses **Vitest** for unit tests and **Cypress** for end-to-end tests.

## Running Tests

### Unit Tests (Vitest)

```bash
# Run tests once (default)
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with UI
yarn test:ui

# Run tests with coverage
yarn test:coverage
```

### E2E Tests (Cypress)

```bash
# Run E2E tests headlessly (requires server to be running)
yarn test:e2e

# Run E2E tests with automatic server start (recommended)
yarn test:e2e:ci

# Open Cypress Test Runner (requires server to be running)
yarn test:e2e:open
```

**Note:** For `test:e2e` and `test:e2e:open`, make sure your dev server is running first:
```bash
# In one terminal
yarn dev

# In another terminal
yarn test:e2e
```

Or use `test:e2e:ci` which automatically starts the server, waits for it to be ready, runs tests, and then shuts down the server.
