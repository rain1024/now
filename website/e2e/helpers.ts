import { Page, expect } from '@playwright/test';

/**
 * Helper functions for E2E tests
 */

export async function clearUserSession(page: Page) {
  await page.evaluate(() => localStorage.clear());
}

export async function loginUser(page: Page, email: string, password: string) {
  // Click on 3D scene to open login modal
  await page.click('[data-testid="hero-3d-container"]');

  // Wait for modal to appear
  await page.waitForSelector('text=Đăng nhập', { timeout: 5000 });

  // Fill in credentials
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);

  // Submit form
  await page.click('button:has-text("Đăng nhập")');

  // Wait for login to complete
  await page.waitForTimeout(1000);
}

export async function signupUser(page: Page, name: string, email: string, password: string) {
  // Click on 3D scene to open login modal
  await page.click('[data-testid="hero-3d-container"]');

  // Switch to signup modal
  await page.click('text=Đăng ký ngay');

  // Wait for signup modal
  await page.waitForSelector('text=Đăng ký tài khoản', { timeout: 5000 });

  // Fill in form
  await page.fill('input[type="text"]', name);
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);

  // Submit form
  await page.click('button:has-text("Đăng ký")');

  // Wait for signup to complete
  await page.waitForTimeout(1000);
}

export async function expectUserLoggedIn(page: Page) {
  // Main form should be visible
  await expect(page.locator('text=Tìm hành động của bạn')).toBeVisible({ timeout: 5000 });

  // 3D scene should not be visible
  await expect(page.locator('[data-testid="hero-3d-container"]')).not.toBeVisible();
}

export async function expectUserLoggedOut(page: Page) {
  // 3D scene should be visible
  await expect(page.locator('[data-testid="hero-3d-container"]')).toBeVisible({ timeout: 5000 });

  // Main form should not be visible
  await expect(page.locator('text=Tìm hành động của bạn')).not.toBeVisible();
}

export const TEST_USERS = {
  admin: {
    email: 'admin@example.com',
    password: 'admin',
    name: 'Administrator'
  },
  user: {
    email: 'user@example.com',
    password: 'user',
    name: 'Test User'
  }
};

export function generateTestUser() {
  const timestamp = Date.now();
  return {
    name: `Test User ${timestamp}`,
    email: `test${timestamp}@example.com`,
    password: 'Test123456'
  };
}
