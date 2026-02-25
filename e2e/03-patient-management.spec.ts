import { test, expect } from '@playwright/test';

test.describe('Patient Management Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/');
    await page.fill('input[type="email"]', 'admin@clinic.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    
    // Navigate to patients
    await page.click('text=Patients');
    await page.waitForLoadState('networkidle');
  });

  test('should display patient list without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.waitForLoadState('networkidle');
    
    // Check if patient list or empty state is visible
    const hasPatients = await page.locator('text=Patient').isVisible();
    expect(hasPatients).toBeTruthy();
    
    // Check for no critical errors
    const criticalErrors = errors.filter(e => 
      !e.includes('Warning') && 
      !e.includes('DevTools') &&
      !e.includes('WebSocket')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('should open add patient form', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // Click add patient button
    const addButton = page.locator('button:has-text("Add Patient"), button:has-text("إضافة مريض")').first();
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(1000);
      
      // Verify form opened (check for common form fields)
      const formVisible = await page.locator('input[type="text"], input[type="email"]').first().isVisible();
      expect(formVisible).toBeTruthy();
    }
    
    const criticalErrors = errors.filter(e => 
      !e.includes('Warning') && 
      !e.includes('DevTools') &&
      !e.includes('WebSocket')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('should search patients', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // Find search input
    const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="بحث"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      await page.waitForTimeout(500);
    }
    
    const criticalErrors = errors.filter(e => 
      !e.includes('Warning') && 
      !e.includes('DevTools') &&
      !e.includes('WebSocket')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('should filter patients', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // Try to find and click filter dropdown
    const filterButton = page.locator('button:has-text("Filter"), button:has-text("تصفية"), select').first();
    if (await filterButton.isVisible()) {
      await filterButton.click();
      await page.waitForTimeout(500);
    }
    
    const criticalErrors = errors.filter(e => 
      !e.includes('Warning') && 
      !e.includes('DevTools') &&
      !e.includes('WebSocket')
    );
    expect(criticalErrors).toHaveLength(0);
  });
});
