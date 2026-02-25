import { test, expect } from '@playwright/test';

test.describe('Language and Theme Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should switch language from EN to AR', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Find language toggle button
    const langButton = page.locator('button:has-text("AR"), button:has-text("EN"), button[aria-label*="language"]').first();
    
    if (await langButton.isVisible()) {
      await langButton.click();
      await page.waitForTimeout(1000);
      
      // Verify language changed (check for Arabic text or RTL)
      const htmlDir = await page.locator('html').getAttribute('dir');
      // Either RTL is set or we can see Arabic text
      const hasArabic = htmlDir === 'rtl' || await page.locator('text=/[\u0600-\u06FF]/').first().isVisible();
      expect(hasArabic).toBeTruthy();
    }
    
    const criticalErrors = errors.filter(e => 
      !e.includes('Warning') && 
      !e.includes('DevTools')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('should switch theme from light to dark', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.waitForLoadState('networkidle');
    
    // Find theme toggle button
    const themeButton = page.locator('button[aria-label*="theme"], button:has-text("Dark"), button:has-text("Light")').first();
    
    if (await themeButton.isVisible()) {
      await themeButton.click();
      await page.waitForTimeout(1000);
      
      // Verify theme changed (check for dark class or dark background)
      const htmlClass = await page.locator('html').getAttribute('class');
      const hasDarkClass = htmlClass?.includes('dark');
      expect(hasDarkClass).toBeTruthy();
    }
    
    const criticalErrors = errors.filter(e => 
      !e.includes('Warning') && 
      !e.includes('DevTools')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('should maintain language after navigation', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.waitForLoadState('networkidle');
    
    // Switch to Arabic
    const langButton = page.locator('button:has-text("AR"), button:has-text("EN")').first();
    if (await langButton.isVisible()) {
      await langButton.click();
      await page.waitForTimeout(500);
    }
    
    // Login
    await page.fill('input[type="email"]', 'admin@clinic.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    
    // Check if Arabic is still active
    const htmlDir = await page.locator('html').getAttribute('dir');
    const hasArabic = htmlDir === 'rtl' || await page.locator('text=/[\u0600-\u06FF]/').first().isVisible();
    expect(hasArabic).toBeTruthy();
    
    const criticalErrors = errors.filter(e => 
      !e.includes('Warning') && 
      !e.includes('DevTools')
    );
    expect(criticalErrors).toHaveLength(0);
  });
});
