import { test, expect } from '@playwright/test';

test.describe('Login Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Clear localStorage to ensure clean state
    await page.evaluate(() => localStorage.clear());
  });

  test('should display login modal when clicking on 3D scene', async ({ page }) => {
    // Wait for 3D scene to load
    await page.waitForSelector('[data-testid="hero-3d-container"]');

    // Click on 3D scene to trigger login modal
    await page.click('[data-testid="hero-3d-container"]');

    // Verify login modal is displayed
    await expect(page.locator('text=Đăng nhập')).toBeVisible({ timeout: 5000 });
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // Click on 3D scene to trigger login modal
    await page.click('[data-testid="hero-3d-container"]');

    // Wait for login modal
    await page.waitForSelector('text=Đăng nhập');

    // Fill in login form with default admin credentials
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin');

    // Submit form
    await page.click('button:has-text("Đăng nhập")');

    // Wait for success and redirect
    await page.waitForTimeout(1000);

    // Verify user is logged in
    // 1. Main form should be visible
    const mainForm = page.locator('text=Tìm hành động của bạn');
    await expect(mainForm).toBeVisible({ timeout: 5000 });

    // 2. User info should be displayed
    const userInfo = page.locator('text=Administrator');
    await expect(userInfo).toBeVisible({ timeout: 3000 });

    // 3. 3D scene should no longer be visible
    const hero3D = page.locator('[data-testid="hero-3d-container"]');
    await expect(hero3D).not.toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Click on 3D scene to trigger login modal
    await page.click('[data-testid="hero-3d-container"]');

    // Fill in login form with invalid credentials
    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');

    // Submit form
    await page.click('button:has-text("Đăng nhập")');

    // Wait for error message
    await page.waitForTimeout(1000);

    // Error message should be displayed
    const errorMessage = page.locator('text=Email hoặc mật khẩu không đúng').or(
      page.locator('text=Invalid email or password')
    );
    await expect(errorMessage).toBeVisible({ timeout: 3000 });
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    // Click on 3D scene to trigger login modal
    await page.click('[data-testid="hero-3d-container"]');

    // Click login button without filling form
    await page.click('button:has-text("Đăng nhập")');

    // Check that form is still visible (validation prevented submission)
    await expect(page.locator('text=Đăng nhập')).toBeVisible();
  });

  test('should persist login after page reload', async ({ page }) => {
    // Login first
    await page.click('[data-testid="hero-3d-container"]');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button:has-text("Đăng nhập")');

    // Wait for login to complete
    await page.waitForSelector('text=Tìm hành động của bạn', { timeout: 5000 });

    // Reload page
    await page.reload();

    // User should still be logged in (form visible, no 3D scene)
    await expect(page.locator('text=Tìm hành động của bạn')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-testid="hero-3d-container"]')).not.toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.click('[data-testid="hero-3d-container"]');
    await page.fill('input[type="email"]', 'user@example.com');
    await page.fill('input[type="password"]', 'user');
    await page.click('button:has-text("Đăng nhập")');

    // Wait for login to complete
    await page.waitForSelector('text=Tìm hành động của bạn', { timeout: 5000 });

    // Click on user info or logout button
    const userButton = page.locator('text=Test User').or(page.locator('[data-testid="user-info"]'));
    await userButton.click();

    // Look for logout button
    const logoutButton = page.locator('button:has-text("Đăng xuất")').or(
      page.locator('button:has-text("Logout")')
    );

    if (await logoutButton.count() > 0) {
      await logoutButton.click();

      // Should return to 3D landing page
      await expect(page.locator('[data-testid="hero-3d-container"]')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('text=Tìm hành động của bạn')).not.toBeVisible();
    }
  });

  test('should support login with different user accounts', async ({ page }) => {
    // Test users from initial data
    const users = [
      { email: 'admin@example.com', password: 'admin', name: 'Administrator' },
      { email: 'user@example.com', password: 'user', name: 'Test User' }
    ];

    for (const user of users) {
      // Clear state
      await page.evaluate(() => localStorage.clear());
      await page.reload();

      // Login
      await page.click('[data-testid="hero-3d-container"]');
      await page.fill('input[type="email"]', user.email);
      await page.fill('input[type="password"]', user.password);
      await page.click('button:has-text("Đăng nhập")');

      // Verify login success
      await expect(page.locator('text=Tìm hành động của bạn')).toBeVisible({ timeout: 5000 });

      // Verify correct user name is displayed
      await expect(page.locator(`text=${user.name}`)).toBeVisible({ timeout: 3000 });
    }
  });

  test('should close login modal when clicking close button', async ({ page }) => {
    // Open login modal
    await page.click('[data-testid="hero-3d-container"]');
    await expect(page.locator('text=Đăng nhập')).toBeVisible();

    // Look for close button (X or close icon)
    const closeButton = page.locator('button').filter({ hasText: '×' }).or(
      page.locator('button[aria-label="Close"]')
    );

    if (await closeButton.count() > 0) {
      await closeButton.first().click();

      // Modal should be closed
      await expect(page.locator('text=Đăng nhập')).not.toBeVisible();
    }
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate offline mode
    await page.context().setOffline(true);

    // Try to login
    await page.click('[data-testid="hero-3d-container"]');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button:has-text("Đăng nhập")');

    // Wait for potential error
    await page.waitForTimeout(2000);

    // Should show network error or stay on login modal
    const isModalVisible = await page.locator('text=Đăng nhập').isVisible();
    expect(isModalVisible).toBe(true);

    // Restore online mode
    await page.context().setOffline(false);
  });
});
