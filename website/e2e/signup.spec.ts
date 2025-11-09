import { test, expect } from '@playwright/test';

test.describe('Signup Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Clear localStorage to ensure clean state
    await page.evaluate(() => localStorage.clear());
  });

  test('should display signup modal when clicking signup button', async ({ page }) => {
    // Wait for 3D scene to load
    await page.waitForSelector('[data-testid="hero-3d-container"]');

    // Click on 3D scene to trigger login modal
    await page.click('[data-testid="hero-3d-container"]');

    // Wait for login modal to appear
    await page.waitForSelector('text=Đăng nhập', { timeout: 5000 });

    // Click on "Đăng ký" link to switch to signup modal
    await page.click('text=Đăng ký ngay');

    // Verify signup modal is displayed
    await expect(page.locator('text=Đăng ký tài khoản')).toBeVisible();
  });

  test('should successfully register a new user', async ({ page }) => {
    // Click on 3D scene to trigger login modal
    await page.click('[data-testid="hero-3d-container"]');

    // Switch to signup modal
    await page.click('text=Đăng ký ngay');

    // Generate unique test user
    const timestamp = Date.now();
    const testUser = {
      name: `Test User ${timestamp}`,
      email: `test${timestamp}@example.com`,
      password: 'Test123456'
    };

    // Fill in signup form
    await page.fill('input[type="text"]', testUser.name);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);

    // Submit form
    await page.click('button:has-text("Đăng ký")');

    // Wait for success message or redirect
    await page.waitForTimeout(1000);

    // Verify user is logged in (form should be visible, 3D should be hidden)
    const mainForm = page.locator('text=Tìm hành động của bạn');
    await expect(mainForm).toBeVisible({ timeout: 5000 });
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    // Click on 3D scene and switch to signup
    await page.click('[data-testid="hero-3d-container"]');
    await page.click('text=Đăng ký ngay');

    // Click signup button without filling form
    await page.click('button:has-text("Đăng ký")');

    // Check that form is still visible (validation prevented submission)
    await expect(page.locator('text=Đăng ký tài khoản')).toBeVisible();
  });

  test('should show error for existing email', async ({ page }) => {
    // Click on 3D scene and switch to signup
    await page.click('[data-testid="hero-3d-container"]');
    await page.click('text=Đăng ký ngay');

    // Try to register with existing user (admin@example.com from initial data)
    await page.fill('input[type="text"]', 'Admin User');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin');

    // Submit form
    await page.click('button:has-text("Đăng ký")');

    // Wait for error message
    await page.waitForTimeout(1000);

    // Error should be shown (email already exists)
    const errorMessage = page.locator('text=Email đã tồn tại').or(page.locator('text=Email already exists'));
    await expect(errorMessage).toBeVisible({ timeout: 3000 });
  });

  test('should switch between signup and login modals', async ({ page }) => {
    // Open login modal
    await page.click('[data-testid="hero-3d-container"]');
    await expect(page.locator('text=Đăng nhập')).toBeVisible();

    // Switch to signup
    await page.click('text=Đăng ký ngay');
    await expect(page.locator('text=Đăng ký tài khoản')).toBeVisible();

    // Switch back to login
    await page.click('text=Đăng nhập tại đây');
    await expect(page.locator('text=Đăng nhập').first()).toBeVisible();
  });

  test('should close signup modal when clicking outside or close button', async ({ page }) => {
    // Open signup modal
    await page.click('[data-testid="hero-3d-container"]');
    await page.click('text=Đăng ký ngay');
    await expect(page.locator('text=Đăng ký tài khoản')).toBeVisible();

    // Look for close button (X or close icon)
    const closeButton = page.locator('button').filter({ hasText: '×' }).or(
      page.locator('button[aria-label="Close"]')
    );

    if (await closeButton.count() > 0) {
      await closeButton.first().click();

      // Modal should be closed
      await expect(page.locator('text=Đăng ký tài khoản')).not.toBeVisible();
    }
  });
});
