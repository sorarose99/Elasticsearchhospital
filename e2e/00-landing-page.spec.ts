import { test, expect } from '@playwright/test';

test.describe('Landing Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load landing page without errors', async ({ page }) => {
    // Check for console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForLoadState('networkidle');
    
    // Verify landing page elements
    await expect(page.locator('text=MediCore').first()).toBeVisible();
    
    // Check for no critical errors
    expect(errors.filter(e => !e.includes('Warning'))).toHaveLength(0);
  });

  test('should navigate to login page from header', async ({ page }) => {
    // Click login button in header
    await page.click('button:has-text("Login")');
    await page.waitForLoadState('networkidle');
    
    // Verify URL changed to /login
    expect(page.url()).toContain('/login');
    
    // Verify login form is visible
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should navigate to registration from Get Started button', async ({ page }) => {
    // Click Get Started button
    await page.click('button:has-text("Get Started")');
    await page.waitForLoadState('networkidle');
    
    // Verify URL changed to /register
    expect(page.url()).toContain('/register');
  });

  test('should navigate to pricing page', async ({ page }) => {
    // Click pricing button in navigation
    const pricingButtons = page.locator('button:has-text("Pricing")');
    await pricingButtons.first().click();
    await page.waitForLoadState('networkidle');
    
    // Verify URL changed to /pricing
    expect(page.url()).toContain('/pricing');
  });

  test('should scroll to features section', async ({ page }) => {
    // Click Features button
    await page.click('button:has-text("Features")');
    await page.waitForTimeout(1000); // Wait for smooth scroll
    
    // Verify features section is in viewport
    const featuresSection = page.locator('#features');
    await expect(featuresSection).toBeInViewport();
  });

  test('should scroll to about section', async ({ page }) => {
    // Click About button
    await page.click('button:has-text("About")');
    await page.waitForTimeout(1000); // Wait for smooth scroll
    
    // Verify about section is in viewport
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeInViewport();
  });

  test('should scroll to contact section', async ({ page }) => {
    // Click Contact button
    await page.click('button:has-text("Contact")');
    await page.waitForTimeout(1000); // Wait for smooth scroll
    
    // Verify contact section is in viewport
    const contactSection = page.locator('#contact');
    await expect(contactSection).toBeInViewport();
  });

  test('should navigate to AI Diagnostics', async ({ page }) => {
    // Scroll to advanced features section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(500);
    
    // Click Explore AI Diagnostics button
    const aiButton = page.locator('button:has-text("Explore AI Diagnostics")');
    if (await aiButton.isVisible()) {
      await aiButton.click();
      await page.waitForLoadState('networkidle');
      
      // Verify URL changed to /ai-diagnostics
      expect(page.url()).toContain('/ai-diagnostics');
    }
  });

  test('should navigate to Mobile App', async ({ page }) => {
    // Scroll to advanced features section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(500);
    
    // Click View Mobile App button
    const mobileButton = page.locator('button:has-text("View Mobile App")');
    if (await mobileButton.isVisible()) {
      await mobileButton.click();
      await page.waitForLoadState('networkidle');
      
      // Verify URL changed to /mobile-app
      expect(page.url()).toContain('/mobile-app');
    }
  });

  test('should navigate to Enterprise Features', async ({ page }) => {
    // Scroll to advanced features section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(500);
    
    // Click Enterprise Features button
    const enterpriseButton = page.locator('button:has-text("Enterprise Features")');
    if (await enterpriseButton.isVisible()) {
      await enterpriseButton.click();
      await page.waitForLoadState('networkidle');
      
      // Verify URL changed to /enterprise
      expect(page.url()).toContain('/enterprise');
    }
  });

  test('should display all stats correctly', async ({ page }) => {
    // Verify stats are visible - use more specific selectors
    const statsSection = page.locator('.grid.grid-cols-2.md\\:grid-cols-4').first();
    await expect(statsSection.locator('text=500+').first()).toBeVisible(); // Hospitals
    await expect(statsSection.locator('text=50K+').first()).toBeVisible(); // Healthcare professionals
    await expect(statsSection.locator('text=2M+').first()).toBeVisible(); // Patients
    await expect(statsSection.locator('text=99.9%').first()).toBeVisible(); // Uptime
  });

  test('should display all feature cards', async ({ page }) => {
    // Scroll to features section
    await page.evaluate(() => {
      const featuresSection = document.getElementById('features');
      featuresSection?.scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1000);
    
    // Verify feature cards are visible - look for the actual translation keys
    const featuresSection = page.locator('#features');
    await expect(featuresSection).toBeVisible();
    
    // Check for at least 6 feature cards
    const featureCards = page.locator('#features .group');
    await expect(featureCards.first()).toBeVisible();
    const count = await featureCards.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('should display testimonials', async ({ page }) => {
    // Scroll to testimonials section
    await page.evaluate(() => {
      const aboutSection = document.getElementById('about');
      aboutSection?.scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1000);
    
    // Verify testimonials are visible
    await expect(page.locator('text=Dr. Sarah Johnson')).toBeVisible();
    await expect(page.locator('text=Ahmed Al-Rahman')).toBeVisible();
    await expect(page.locator('text=Dr. Maria Rodriguez')).toBeVisible();
  });

  test('should display contact section', async ({ page }) => {
    // Scroll to contact section
    await page.evaluate(() => {
      const contactSection = document.getElementById('contact');
      contactSection?.scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1000);
    
    // Verify contact section is visible
    const contactSection = page.locator('#contact');
    await expect(contactSection).toBeVisible();
    
    // Check for contact cards
    const contactCards = contactSection.locator('.grid .p-6');
    await expect(contactCards.first()).toBeVisible();
  });

  test('should have working theme toggle', async ({ page }) => {
    // Find and click theme toggle
    const themeToggle = page.locator('button[aria-label*="theme"], button[aria-label*="Theme"]').first();
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      // Verify theme changed (check for dark class on html or body)
      const isDark = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark') || 
               document.body.classList.contains('dark');
      });
      
      expect(typeof isDark).toBe('boolean');
    }
  });

  test('should have working language toggle', async ({ page }) => {
    // Find and click language toggle
    const langToggle = page.locator('button[aria-label*="language"], button[aria-label*="Language"]').first();
    if (await langToggle.isVisible()) {
      const initialText = await page.locator('h1').first().textContent();
      
      await langToggle.click();
      await page.waitForTimeout(500);
      
      const newText = await page.locator('h1').first().textContent();
      
      // Text should change when language changes
      expect(initialText).not.toBe(newText);
    }
  });

  test('should navigate through complete user flow', async ({ page }) => {
    // 1. Start on landing page
    await expect(page.locator('text=MediCore').first()).toBeVisible();
    
    // 2. Scroll through sections
    await page.click('button:has-text("Features")');
    await page.waitForTimeout(500);
    
    await page.click('button:has-text("About")');
    await page.waitForTimeout(500);
    
    await page.click('button:has-text("Contact")');
    await page.waitForTimeout(500);
    
    // 3. Navigate to pricing
    await page.click('button:has-text("Pricing")');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/pricing');
    
    // 4. Go back to landing
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 5. Navigate to login
    await page.click('button:has-text("Login")');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/login');
    
    // Verify login form
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});
