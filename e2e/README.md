# E2E Testing with Playwright

End-to-end tests using Playwright and the Page Object Model pattern.

## Quick Start

### 1. Install Playwright
```bash
npx playwright install chromium
```

### 2. Setup Authentication
Create `.env.test` in project root:
```bash
E2E_USERNAME=test@winelog.local
E2E_PASSWORD=TestPassword123!
BASE_URL=http://localhost:4321
```

Create test user:
- Option A: Register at `http://localhost:4321/register`
- Option B: Use Supabase Dashboard → Authentication → Users → Add User

### 3. Run Tests
```bash
# All tests
npm run test:e2e

# Interactive UI mode
npm run test:e2e:ui

# Headed mode (visible browser)
npm run test:e2e:headed

# Debug mode
npm run test:e2e:debug
```

## Project Structure

```
e2e/
├── fixtures/
│   └── auth.fixture.ts      # Auto-login fixture
├── page-objects/
│   ├── BasePage.ts          # Base class
│   ├── LoginPage.ts         # Login page
│   ├── DashboardPage.ts     # Dashboard page
│   ├── NewBatchModal.ts     # New batch modal
│   └── index.ts             # Exports
└── tests/
    └── *.spec.ts            # Test files
```

## Writing Tests

### Test without authentication
```typescript
import { test, expect } from "@playwright/test";
import { LoginPage } from "../page-objects";

test("login page loads", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  // ...
});
```

### Test with authentication (using fixture)
```typescript
import { test, expect } from "../fixtures/auth.fixture";

test("create batch", async ({ authenticatedPage }) => {
  // User is already logged in, on /dashboard
  const modal = await authenticatedPage.clickNewBatch();
  await modal.createBatchWithFirstTemplate("My Batch");
  expect(authenticatedPage.url()).toMatch(/\/batches\//);
});
```

### AAA Pattern Example
```typescript
test("complete batch creation", async ({ authenticatedPage }) => {
  // Arrange
  const modal = await authenticatedPage.clickNewBatch();
  
  // Act
  await modal.selectFirstTemplate();
  await modal.fillBatchName("Chardonnay 2024");
  await modal.clickSubmit();
  
  // Assert
  expect(authenticatedPage.url()).toMatch(/\/batches\//);
});
```

## Available Page Objects

### LoginPage
```typescript
const loginPage = new LoginPage(page);
await loginPage.login(email, password);
```

### DashboardPage
```typescript
const dashboard = new DashboardPage(page);
await dashboard.navigate();
const modal = await dashboard.clickNewBatch();
```

### NewBatchModal
```typescript
// Step by step
await modal.selectFirstTemplate();
await modal.fillBatchName("Name");
await modal.clickSubmit();

// Or use high-level method
await modal.createBatchWithFirstTemplate("Name");
```

## Debugging

```bash
# UI Mode (recommended)
npm run test:e2e:ui

# Debug specific test
npm run test:e2e:debug -- -g "test name"

# View last report
npm run test:e2e:report

# View trace after failure
npx playwright show-trace trace.zip
```

## data-testid Reference

| Element | data-testid | Page Object |
|---------|-------------|-------------|
| User Email (Header) | `user-email` | - |
| New Batch Button | `button-new-batch` | DashboardPage |
| New Batch Dialog | `dialog-new-batch` | NewBatchModal |
| Template Grid | `template-picker-grid` | NewBatchModal |
| Template Card | `template-card-{id}` | NewBatchModal |
| Batch Name Input | `input-batch-name` | NewBatchModal |
| Cancel Button | `button-cancel-batch` | NewBatchModal |
| Submit Button | `button-submit-batch` | NewBatchModal |

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Page Object Model](https://playwright.dev/docs/pom)

