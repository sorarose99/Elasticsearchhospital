import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin for full access
    await page.goto('/');
    await page.fill('input[type="email"]', 'admin@clinic.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to Patients module', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.click('text=Patients');
    await page.waitForLoadState('networkidle');
    
    // Verify patients page loaded
    await expect(page.locator('text=Patient')).toBeVisible({ timeout: 5000 });
    
    // Check for no critical errors
    const criticalErrors = errors.filter(e => 
      !e.includes('Warning') && 
      !e.includes('DevTools')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('should navigate to Appointments module', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.click('text=Appointments');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('text=Appointment')).toBeVisible({ timeout: 5000 });
    
    const criticalErrors = errors.filter(e => 
      !e.includes('Warning') && 
      !e.includes('DevTools')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('should navigate to Laboratory module', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.click('text=Laboratory');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('text=Lab')).toBeVisible({ timeout: 5000 });
    
    const criticalErrors = errors.filter(e => 
      !e.includes('Warning') && 
      !e.includes('DevTools')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('should navigate to Pharmacy module', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.click('text=Pharmacy');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('text=Pharmac')).toBeVisible({ timeout: 5000 });
    
    const criticalErrors = errors.filter(e => 
      !e.includes('Warning') && 
      !e.includes('DevTools')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('should navigate to Radiology module', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.click('text=Radiology');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('text=Radiolog')).toBeVisible({ timeout: 5000 });
    
    const criticalErrors = errors.filter(e => 
      !e.includes('Warning') && 
      !e.includes('DevTools')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('should navigate to Billing module', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.click('text=Billing');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('text=Billing')).toBeVisible({ timeout: 5000 });
    
    const criticalErrors = errors.filter(e => 
      !e.includes('Warning') && 
      !e.includes('DevTools')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('should navigate to Reports module', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.click('text=Reports');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('text=Report')).toBeVisible({ timeout: 5000 });
    
    const criticalErrors = errors.filter(e => 
      !e.includes('Warning') && 
      !e.includes('DevTools')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('should navigate to Settings module', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.click('text=Settings');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('text=Settings')).toBeVisible({ timeout: 5000 });
    
    const criticalErrors = errors.filter(e => 
      !e.includes('Warning') && 
      !e.includes('DevTools')
    );
    expect(criticalErrors).toHaveLength(0);
  });
});
