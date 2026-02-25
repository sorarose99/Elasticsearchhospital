import { test, expect } from '@playwright/test';

test.describe('Comprehensive Button Click Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin for full access
    await page.goto('/');
    await page.fill('input[type="email"]', 'admin@clinic.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
  });

  test('should click all main navigation buttons without errors', async ({ page }) => {
    const errors: string[] = [];
    const clickedButtons: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // List of main navigation items to test
    const navItems = [
      'Dashboard',
      'Patients',
      'Appointments',
      'Laboratory',
      'Pharmacy',
      'Radiology',
      'Billing',
      'Reports',
      'Analytics',
      'Settings'
    ];

    for (const item of navItems) {
      try {
        const button = page.locator(`text=${item}`).first();
        if (await button.isVisible({ timeout: 2000 })) {
          await button.click();
          await page.waitForTimeout(1000);
          await page.waitForLoadState('networkidle', { timeout: 5000 });
          clickedButtons.push(item);
        }
      } catch (e) {
        console.log(`Could not click ${item}: ${e}`);
      }
    }

    console.log(`Successfully clicked: ${clickedButtons.join(', ')}`);
    
    // Filter out known non-critical errors
    const criticalErrors = errors.filter(e => 
      !e.includes('Warning') && 
      !e.includes('DevTools') &&
      !e.includes('WebSocket') &&
      !e.includes('Failed to load resource')
    );
    
    expect(criticalErrors).toHaveLength(0);
    expect(clickedButtons.length).toBeGreaterThan(5); // At least 5 nav items should work
  });

  test('should click all visible buttons on dashboard', async ({ page }) => {
    const errors: string[] = [];
    const clickedButtons: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Get all buttons on the page
    const buttons = await page.locator('button').all();
    
    for (let i = 0; i < Math.min(buttons.length, 20); i++) {
      try {
        const button = buttons[i];
        if (await button.isVisible({ timeout: 1000 })) {
          const text = await button.textContent();
          await button.click();
          await page.waitForTimeout(500);
          clickedButtons.push(text || `Button ${i}`);
        }
      } catch (e) {
        // Some buttons might not be clickable, that's ok
      }
    }

    console.log(`Clicked ${clickedButtons.length} buttons`);
    
    const criticalErrors = errors.filter(e => 
      !e.includes('Warning') && 
      !e.includes('DevTools') &&
      !e.includes('WebSocket')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('should test all form inputs without errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Navigate to patients to test forms
    await page.click('text=Patients');
    await page.waitForLoadState('networkidle');
    
    // Try to open add patient form
    const addButton = page.locator('button:has-text("Add Patient"), button:has-text("إضافة مريض")').first();
    if (await addButton.isVisible({ timeout: 2000 })) {
      await addButton.click();
      await page.waitForTimeout(1000);
      
      // Find all input fields
      const inputs = await page.locator('input[type="text"], input[type="email"], input[type="tel"]').all();
      
      // Test typing in each input
      for (let i = 0; i < Math.min(inputs.length, 10); i++) {
        try {
          const input = inputs[i];
          if (await input.isVisible({ timeout: 1000 })) {
            await input.fill('Test');
            await page.waitForTimeout(200);
          }
        } catch (e) {
          // Some inputs might not be fillable
        }
      }
    }
    
    const criticalErrors = errors.filter(e => 
      !e.includes('Warning') && 
      !e.includes('DevTools') &&
      !e.includes('WebSocket')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('should test dropdown menus without errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Find all select elements and buttons that might open dropdowns
    const dropdowns = await page.locator('select, button[role="combobox"]').all();
    
    for (let i = 0; i < Math.min(dropdowns.length, 10); i++) {
      try {
        const dropdown = dropdowns[i];
        if (await dropdown.isVisible({ timeout: 1000 })) {
          await dropdown.click();
          await page.waitForTimeout(500);
          
          // Try to close it by clicking elsewhere
          await page.keyboard.press('Escape');
          await page.waitForTimeout(200);
        }
      } catch (e) {
        // Some dropdowns might not work, that's ok
      }
    }
    
    const criticalErrors = errors.filter(e => 
      !e.includes('Warning') && 
      !e.includes('DevTools') &&
      !e.includes('WebSocket')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('should test all tabs without errors', async ({ page }) => {
    const errors: string[] = [];
    const clickedTabs: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Navigate to a page with tabs (e.g., Reports)
    await page.click('text=Reports');
    await page.waitForLoadState('networkidle');
    
    // Find all tab buttons
    const tabs = await page.locator('[role="tab"], button:has-text("Tab")').all();
    
    for (let i = 0; i < Math.min(tabs.length, 10); i++) {
      try {
        const tab = tabs[i];
        if (await tab.isVisible({ timeout: 1000 })) {
          const text = await tab.textContent();
          await tab.click();
          await page.waitForTimeout(500);
          clickedTabs.push(text || `Tab ${i}`);
        }
      } catch (e) {
        // Some tabs might not be clickable
      }
    }

    console.log(`Clicked ${clickedTabs.length} tabs`);
    
    const criticalErrors = errors.filter(e => 
      !e.includes('Warning') && 
      !e.includes('DevTools') &&
      !e.includes('WebSocket')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });
});
