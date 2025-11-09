# End-to-End Tests with Playwright

This directory contains E2E tests for the NOW project using Playwright.

## Test Files

- `login.spec.ts` - Login feature tests (10 test cases)
- `signup.spec.ts` - Signup feature tests (6 test cases)
- `helpers.ts` - Common helper functions and utilities

## Running Tests

### Run all E2E tests
```bash
yarn test:e2e
```

### Run tests with UI mode (interactive)
```bash
yarn test:e2e:ui
```

### Run tests in headed mode (see browser)
```bash
yarn test:e2e:headed
```

### Debug tests
```bash
yarn test:e2e:debug
```

### View test report
```bash
yarn test:e2e:report
```

### Run specific test file
```bash
yarn test:e2e login.spec.ts
yarn test:e2e signup.spec.ts
```

### Run tests on specific browser
```bash
yarn test:e2e --project=chromium
yarn test:e2e --project=firefox
yarn test:e2e --project=webkit
```

## Prerequisites

Before running E2E tests, make sure:

1. Install Playwright browsers:
   ```bash
   yarn playwright install
   ```

2. Backend server is running on port 8000:
   ```bash
   cd ../backend
   uv run python manage.py runserver 8000
   ```

3. The tests will automatically start the Next.js dev server on port 3000

## Test Coverage

### Login Feature (10 tests)
- ✓ Display login modal when clicking on 3D scene
- ✓ Successfully login with valid credentials
- ✓ Show error for invalid credentials
- ✓ Show validation errors for empty fields
- ✓ Persist login after page reload
- ✓ Logout successfully
- ✓ Support login with different user accounts
- ✓ Close login modal when clicking close button
- ✓ Handle network errors gracefully

### Signup Feature (6 tests)
- ✓ Display signup modal when clicking signup button
- ✓ Successfully register a new user
- ✓ Show validation errors for empty fields
- ✓ Show error for existing email
- ✓ Switch between signup and login modals
- ✓ Close signup modal when clicking outside or close button

## Test Users

Default test users available in `data/users.json`:

```javascript
{
  email: 'admin@example.com',
  password: 'admin',
  name: 'Administrator'
}

{
  email: 'user@example.com',
  password: 'user',
  name: 'Test User'
}
```

## Writing New Tests

Use the helper functions from `helpers.ts`:

```typescript
import { test, expect } from '@playwright/test';
import { loginUser, signupUser, expectUserLoggedIn, TEST_USERS } from './helpers';

test('my test', async ({ page }) => {
  await page.goto('/');
  await loginUser(page, TEST_USERS.admin.email, TEST_USERS.admin.password);
  await expectUserLoggedIn(page);

  // Your test logic here
});
```

## Configuration

Test configuration is in `playwright.config.ts`:

- **Base URL**: http://localhost:3000
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Retries**: 2 on CI, 0 locally
- **Reporter**: HTML report
- **Screenshots**: Only on failure
- **Traces**: On first retry

## Debugging

### Visual debugging with UI mode
```bash
yarn test:e2e:ui
```

### Step through tests
```bash
yarn test:e2e:debug
```

### View traces
After a test fails with retries, traces are automatically collected. View them with:
```bash
yarn test:e2e:report
```

## CI/CD Integration

For CI environments, tests automatically:
- Run with 2 retries
- Use single worker (no parallel)
- Fail on `test.only`
- Generate HTML report

## Troubleshooting

**Tests timing out?**
- Make sure both frontend (port 3000) and backend (port 8000) are accessible
- Increase timeout in specific tests if needed

**Modal not appearing?**
- Check that 3D scene is loaded: `await page.waitForSelector('[data-testid="hero-3d-container"]')`
- Ensure localStorage is cleared in beforeEach

**Login/Signup not working?**
- Verify backend API is running on port 8000
- Check network tab in headed mode
- Use `yarn test:e2e:debug` to step through

## Best Practices

1. Always clear localStorage in `beforeEach`
2. Use specific selectors (data-testid when possible)
3. Wait for elements before interacting
4. Use helper functions for common actions
5. Generate unique test data for signup tests
6. Test both success and error cases
7. Test across different browsers
8. Keep tests independent and isolated
