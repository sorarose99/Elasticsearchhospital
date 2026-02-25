import { test, expect } from '@playwright/test';

test.describe('Authentication Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page directly via URL
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('should load login page without errors', async ({ page }) => {
    // Check for console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForLoadState('networkidle');
    
    // Verify login page elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    
    // Check for no critical errors
    expect(errors.filter(e => !e.includes('Warning'))).toHaveLength(0);
  });

  test('should login as admin successfully', async ({ page }) => {
    await page.fill('input[type="email"]', 'admin@clinic.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Wait for navigation to dashboard
    await page.waitForURL(/.*dashboard.*/i, { timeout: 10000 });
    
    // Verify dashboard loaded
    await expect(page.locator('text=Dashboard')).toBeVisible({ timeout: 10000 });
  });

  test('should login as doctor successfully', async ({ page }) => {
    await page.fill('input[type="email"]', 'doctor@clinic.com');
    await page.fill('input[type="password"]', 'doctor123');
    await page.click('button[type="submit"]');
    
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Dashboard')).toBeVisible({ timeout: 10000 });
  });

  test('should login as receptionist successfully', async ({ page }) => {
    await page.fill('input[type="email"]', 'receptionist@clinic.com');
    await page.fill('input[type="password"]', 'receptionist123');
    await page.click('button[type="submit"]');
    
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Dashboard')).toBeVisible({ timeout: 10000 });
  });

  test('should login as lab tech successfully', async ({ page }) => {
    await page.fill('input[type="email"]', 'lab@clinic.com');
    await page.fill('input[type="password"]', 'lab123');
    await page.click('button[type="submit"]');
    
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Dashboard')).toBeVisible({ timeout: 10000 });
  });

  test('should login as pharmacist successfully', async ({ page }) => {
    await page.fill('input[type="email"]', 'pharmacist@clinic.com');
    await page.fill('input[type="password"]', 'pharmacist123');
    await page.click('button[type="submit"]');
    
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Dashboard')).toBeVisible({ timeout: 10000 });
  });

  test('should login as radiologist successfully', async ({ page }) => {
    await page.fill('input[type="email"]', 'radiologist@clinic.com');
    await page.fill('input[type="password"]', 'radiologist123');
    await page.click('button[type="submit"]');
    
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Dashboard')).toBeVisible({ timeout: 10000 });
  });

  test('should login as billing successfully', async ({ page }) => {
    await page.fill('input[type="email"]', 'billing@clinic.com');
    await page.fill('input[type="password"]', 'billing123');
    await page.click('button[type="submit"]');
    
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Dashboard')).toBeVisible({ timeout: 10000 });
  });
});
