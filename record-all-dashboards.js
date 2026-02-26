/**
 * Complete Dashboard Recorder
 * Records all dashboards with AI components
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const CONFIG = {
  baseUrl: 'http://localhost:3000',
  screenshotsDir: './demo-screenshots',
  videoDir: './demo-videos',
  viewport: { width: 1920, height: 1080 },
  slowMo: 500,
};

// Create directories
[CONFIG.screenshotsDir, CONFIG.videoDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

async function takeScreenshot(page, name, fullPage = true) {
  const filename = path.join(CONFIG.screenshotsDir, `${name}.png`);
  await page.screenshot({ path: filename, fullPage });
  console.log(`✅ ${name}.png`);
}

async function smoothScroll(page, distance = 400) {
  await page.evaluate((dist) => {
    window.scrollBy({ top: dist, behavior: 'smooth' });
  }, distance);
  await page.waitForTimeout(1500);
}

async function recordAllDashboards() {
  console.log('🎬 Starting Complete Dashboard Recording...\n');
  
  const browser = await chromium.launch({
    headless: false,
    slowMo: CONFIG.slowMo,
  });

  const context = await browser.newContext({
    viewport: CONFIG.viewport,
    recordVideo: {
      dir: CONFIG.videoDir,
      size: CONFIG.viewport
    },
  });

  const page = await context.newPage();
  page.setDefaultTimeout(30000);

  try {
    // ============================================
    // ADMIN DASHBOARD
    // ============================================
    console.log('\n📍 Part 1: Admin Dashboard');
    await page.goto(CONFIG.baseUrl + '/admin', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    await takeScreenshot(page, '01-admin-dashboard-full');
    await smoothScroll(page, 400);
    await takeScreenshot(page, '02-admin-dashboard-stats');
    await smoothScroll(page, 400);
    await takeScreenshot(page, '03-admin-dashboard-charts');
    
    // Scroll back to top
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(1000);
    
    // ============================================
    // EMERGENCY MANAGEMENT
    // ============================================
    console.log('\n📍 Part 2: Emergency Management ⭐');
    
    // Click Emergency Management in sidebar
    await page.click('text=Emergency Management');
    await page.waitForTimeout(3000);
    
    await takeScreenshot(page, '04-emergency-full-page');
    
    // AI Quick Actions
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(1000);
    await takeScreenshot(page, '05-emergency-ai-quick-actions');
    
    // AI Insight Cards
    await smoothScroll(page, 300);
    await takeScreenshot(page, '06-emergency-insight-cards');
    
    // Priority Overview
    await smoothScroll(page, 300);
    await takeScreenshot(page, '07-emergency-priority-overview');
    
    // Patient Cards with AI Badges
    await smoothScroll(page, 400);
    await takeScreenshot(page, '08-emergency-patient-cards-1');
    
    await smoothScroll(page, 400);
    await takeScreenshot(page, '09-emergency-patient-cards-2');
    
    // Try to find and hover over AI button
    try {
      const aiButton = await page.locator('[class*="fixed"]').last();
      if (await aiButton.isVisible({ timeout: 5000 })) {
        await aiButton.hover();
        await page.waitForTimeout(1000);
        await takeScreenshot(page, '10-emergency-ai-button');
      }
    } catch (e) {
      console.log('⚠️  AI button not found, continuing...');
    }
    
    // Scroll back to top
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(1000);
    
    // ============================================
    // LABORATORY DASHBOARD
    // ============================================
    console.log('\n📍 Part 3: Laboratory Dashboard');
    
    await page.click('text=Laboratory');
    await page.waitForTimeout(3000);
    
    await takeScreenshot(page, '11-lab-full-page');
    
    // AI Quick Actions
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(1000);
    await takeScreenshot(page, '12-lab-ai-quick-actions');
    
    // AI Insight Cards
    await smoothScroll(page, 300);
    await takeScreenshot(page, '13-lab-insight-cards');
    
    // Stats Cards
    await smoothScroll(page, 300);
    await takeScreenshot(page, '14-lab-stats-cards');
    
    // Pending Tests
    await smoothScroll(page, 400);
    await takeScreenshot(page, '15-lab-pending-tests');
    
    // Scroll back to top
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(1000);
    
    // ============================================
    // DOCTOR DASHBOARD (Main Dashboard)
    // ============================================
    console.log('\n📍 Part 4: Doctor Dashboard');
    
    // Click Dashboard in sidebar
    await page.click('text=Dashboard').first();
    await page.waitForTimeout(3000);
    
    await takeScreenshot(page, '16-doctor-full-page');
    
    // AI Quick Actions
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(1000);
    await takeScreenshot(page, '17-doctor-ai-quick-actions');
    
    // AI Insight Cards
    await smoothScroll(page, 300);
    await takeScreenshot(page, '18-doctor-insight-cards');
    
    // Schedule
    await smoothScroll(page, 400);
    await takeScreenshot(page, '19-doctor-schedule');
    
    // Scroll back to top
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(1000);
    
    // ============================================
    // OTHER DASHBOARDS (Quick Tour)
    // ============================================
    console.log('\n📍 Part 5: Other Dashboards');
    
    // Patients
    try {
      await page.click('text=Patients', { timeout: 5000 });
      await page.waitForTimeout(2000);
      await takeScreenshot(page, '20-patients-dashboard');
    } catch (e) {
      console.log('⚠️  Patients not found');
    }
    
    // Appointments
    try {
      await page.click('text=Appointments', { timeout: 5000 });
      await page.waitForTimeout(2000);
      await takeScreenshot(page, '21-appointments-dashboard');
    } catch (e) {
      console.log('⚠️  Appointments not found');
    }
    
    // Pharmacy
    try {
      await page.click('text=Pharmacy', { timeout: 5000 });
      await page.waitForTimeout(2000);
      await takeScreenshot(page, '22-pharmacy-dashboard');
    } catch (e) {
      console.log('⚠️  Pharmacy not found');
    }
    
    // Billing
    try {
      await page.click('text=Billing', { timeout: 5000 });
      await page.waitForTimeout(2000);
      await takeScreenshot(page, '23-billing-dashboard');
    } catch (e) {
      console.log('⚠️  Billing not found');
    }
    
    // Analytics
    try {
      await page.click('text=Analytics', { timeout: 5000 });
      await page.waitForTimeout(2000);
      await takeScreenshot(page, '24-analytics-dashboard');
    } catch (e) {
      console.log('⚠️  Analytics not found');
    }
    
    // ============================================
    // FINAL SHOWCASE - Back to Emergency
    // ============================================
    console.log('\n📍 Part 6: Final Showcase');
    
    await page.click('text=Emergency Management');
    await page.waitForTimeout(2000);
    
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(1000);
    await takeScreenshot(page, '25-final-emergency-showcase');
    
    console.log('\n✅ Recording completed successfully!');
    console.log(`\n📁 Screenshots: ${CONFIG.screenshotsDir}`);
    console.log(`📁 Video: ${CONFIG.videoDir}`);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    await takeScreenshot(page, 'error-screenshot', false);
  } finally {
    await page.waitForTimeout(2000);
    await context.close();
    await browser.close();
    console.log('\n🎉 All done!');
  }
}

recordAllDashboards().catch(console.error);
