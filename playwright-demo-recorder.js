/**
 * Playwright Demo Recorder
 * Automatically records video and takes screenshots of the entire Hospital Management System
 * with Elasticsearch Agent demonstrations
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Configuration
const CONFIG = {
  baseUrl: 'http://localhost:3000',
  outputDir: './demo-recordings',
  screenshotsDir: './demo-screenshots',
  videoDir: './demo-videos',
  credentials: {
    email: 'admin@hospital.com',
    password: 'admin123'
  },
  viewport: {
    width: 1920,
    height: 1080
  },
  slowMo: 1000, // Slow down actions for better video
};

// Create output directories
function setupDirectories() {
  [CONFIG.outputDir, CONFIG.screenshotsDir, CONFIG.videoDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Helper function to take screenshot
async function takeScreenshot(page, name) {
  const filename = path.join(CONFIG.screenshotsDir, `${name}.png`);
  await page.screenshot({ path: filename, fullPage: true });
  console.log(`✅ Screenshot saved: ${filename}`);
}

// Helper function to wait and scroll
async function smoothScroll(page, distance = 300) {
  await page.evaluate((dist) => {
    window.scrollBy({ top: dist, behavior: 'smooth' });
  }, distance);
  await page.waitForTimeout(1000);
}

// Main demo recording function
async function recordDemo() {
  console.log('🎬 Starting Playwright Demo Recorder...\n');
  
  setupDirectories();

  const browser = await chromium.launch({
    headless: false, // Show browser for visual confirmation
    slowMo: CONFIG.slowMo,
    timeout: 60000, // Increase timeout
  });

  const context = await browser.newContext({
    viewport: CONFIG.viewport,
    recordVideo: {
      dir: CONFIG.videoDir,
      size: CONFIG.viewport
    },
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();

  try {
    // ============================================
    // PART 1: LOGIN PAGE
    // ============================================
    console.log('📍 Part 1: Login Page');
    await page.goto(CONFIG.baseUrl);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await takeScreenshot(page, '01-login-page');
    
    // Fill login form
    await page.fill('#email', CONFIG.credentials.email);
    await page.waitForTimeout(500);
    await page.fill('#password', CONFIG.credentials.password);
    await page.waitForTimeout(500);
    
    await takeScreenshot(page, '02-login-filled');
    
    // Click login button
    await page.click('button[type="submit"]', { timeout: 10000 });
    await page.waitForTimeout(5000); // Wait longer for login
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    
    // ============================================
    // PART 2: ADMIN DASHBOARD OVERVIEW
    // ============================================
    console.log('📍 Part 2: Admin Dashboard Overview');
    await takeScreenshot(page, '03-admin-dashboard');
    
    // Scroll to show all stats
    await smoothScroll(page, 300);
    await takeScreenshot(page, '04-admin-dashboard-stats');
    
    await smoothScroll(page, 300);
    await takeScreenshot(page, '05-admin-dashboard-charts');
    
    // Scroll back to top
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(1000);
    
    // ============================================
    // PART 3: EMERGENCY MANAGEMENT (MAIN DEMO)
    // ============================================
    console.log('📍 Part 3: Emergency Management Dashboard ⭐');
    
    // Navigate to Emergency Management
    await page.click('text=Emergency Management');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Screenshot 1: Full page with AI Quick Actions
    await takeScreenshot(page, '06-emergency-full-page');
    
    // Screenshot 2: AI Quick Actions Bar (top)
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(1000);
    await takeScreenshot(page, '07-emergency-ai-quick-actions');
    
    // Highlight AI Quick Actions (hover effect)
    const quickActionsBar = await page.locator('text=AI Recommendations').first();
    if (await quickActionsBar.isVisible()) {
      await quickActionsBar.hover();
      await page.waitForTimeout(1000);
      await takeScreenshot(page, '08-emergency-quick-actions-hover');
    }
    
    // Screenshot 3: AI Insight Cards
    await smoothScroll(page, 200);
    await takeScreenshot(page, '09-emergency-insight-cards');
    
    // Screenshot 4: Priority Overview
    await smoothScroll(page, 300);
    await takeScreenshot(page, '10-emergency-priority-overview');
    
    // Screenshot 5: Patient Cards with AI Badges
    await smoothScroll(page, 400);
    await takeScreenshot(page, '11-emergency-patient-cards-1');
    
    await smoothScroll(page, 400);
    await takeScreenshot(page, '12-emergency-patient-cards-2');
    
    // Screenshot 6: Floating AI Button
    const aiButton = await page.locator('[class*="fixed"][class*="bottom"]').last();
    if (await aiButton.isVisible()) {
      await aiButton.hover();
      await page.waitForTimeout(1000);
      await takeScreenshot(page, '13-emergency-ai-button-hover');
      
      // Click AI button to open panel
      await aiButton.click();
      await page.waitForTimeout(2000);
      await takeScreenshot(page, '14-emergency-ai-panel-open');
      
      // Close AI panel
      const closeButton = await page.locator('[class*="close"]').first();
      if (await closeButton.isVisible()) {
        await closeButton.click();
        await page.waitForTimeout(1000);
      }
    }
    
    // Scroll back to top
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(1000);
    
    // ============================================
    // PART 4: LABORATORY DASHBOARD
    // ============================================
    console.log('📍 Part 4: Laboratory Dashboard');
    
    // Navigate to Laboratory
    await page.click('text=Laboratory');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Screenshot 1: Full page
    await takeScreenshot(page, '15-lab-full-page');
    
    // Screenshot 2: AI Quick Actions
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(1000);
    await takeScreenshot(page, '16-lab-ai-quick-actions');
    
    // Screenshot 3: AI Insight Cards
    await smoothScroll(page, 200);
    await takeScreenshot(page, '17-lab-insight-cards');
    
    // Screenshot 4: Stats Cards
    await smoothScroll(page, 300);
    await takeScreenshot(page, '18-lab-stats-cards');
    
    // Screenshot 5: Pending Tests with AI Badges
    await smoothScroll(page, 400);
    await takeScreenshot(page, '19-lab-pending-tests');
    
    // Click on Completed tab
    const completedTab = await page.locator('text=Completed Tests').first();
    if (await completedTab.isVisible()) {
      await completedTab.click();
      await page.waitForTimeout(2000);
      await takeScreenshot(page, '20-lab-completed-tests');
    }
    
    // Screenshot 6: AI Button
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(1000);
    const labAiButton = await page.locator('[class*="fixed"][class*="bottom"]').last();
    if (await labAiButton.isVisible()) {
      await labAiButton.hover();
      await page.waitForTimeout(1000);
      await takeScreenshot(page, '21-lab-ai-button');
    }
    
    // ============================================
    // PART 5: DOCTOR DASHBOARD
    // ============================================
    console.log('📍 Part 5: Doctor Dashboard');
    
    // Navigate to Dashboard (Doctor view)
    await page.click('text=Dashboard').first();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Screenshot 1: Full page
    await takeScreenshot(page, '22-doctor-full-page');
    
    // Screenshot 2: AI Quick Actions
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(1000);
    await takeScreenshot(page, '23-doctor-ai-quick-actions');
    
    // Screenshot 3: AI Insight Cards
    await smoothScroll(page, 200);
    await takeScreenshot(page, '24-doctor-insight-cards');
    
    // Screenshot 4: Today's Schedule with AI Badges
    await smoothScroll(page, 400);
    await takeScreenshot(page, '25-doctor-schedule');
    
    // Click on Patients tab
    const patientsTab = await page.locator('text=My Patients').first();
    if (await patientsTab.isVisible()) {
      await patientsTab.click();
      await page.waitForTimeout(2000);
      await smoothScroll(page, 300);
      await takeScreenshot(page, '26-doctor-patients-with-badges');
    }
    
    // Screenshot 5: AI Button
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(1000);
    const doctorAiButton = await page.locator('[class*="fixed"][class*="bottom"]').last();
    if (await doctorAiButton.isVisible()) {
      await doctorAiButton.hover();
      await page.waitForTimeout(1000);
      await takeScreenshot(page, '27-doctor-ai-button');
    }
    
    // ============================================
    // PART 6: OTHER DASHBOARDS (QUICK TOUR)
    // ============================================
    console.log('📍 Part 6: Other Dashboards Quick Tour');
    
    // Patients
    await page.click('text=Patients').first();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await takeScreenshot(page, '28-patients-dashboard');
    
    // Appointments
    await page.click('text=Appointments').first();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await takeScreenshot(page, '29-appointments-dashboard');
    
    // Pharmacy
    await page.click('text=Pharmacy').first();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await takeScreenshot(page, '30-pharmacy-dashboard');
    
    // Billing
    await page.click('text=Billing').first();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await takeScreenshot(page, '31-billing-dashboard');
    
    // Analytics
    await page.click('text=Analytics Dashboard').first();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await takeScreenshot(page, '32-analytics-dashboard');
    
    // ============================================
    // PART 7: FINAL SHOWCASE
    // ============================================
    console.log('📍 Part 7: Final Showcase - Back to Emergency');
    
    // Go back to Emergency Management for final showcase
    await page.click('text=Emergency Management');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Full page screenshot
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(1000);
    await takeScreenshot(page, '33-final-emergency-showcase');
    
    // Open AI panel for final shot
    const finalAiButton = await page.locator('[class*="fixed"][class*="bottom"]').last();
    if (await finalAiButton.isVisible()) {
      await finalAiButton.click();
      await page.waitForTimeout(2000);
      await takeScreenshot(page, '34-final-ai-panel-showcase');
    }
    
    console.log('\n✅ Demo recording completed successfully!');
    console.log(`\n📁 Screenshots saved to: ${CONFIG.screenshotsDir}`);
    console.log(`📁 Video will be saved to: ${CONFIG.videoDir}`);
    
  } catch (error) {
    console.error('❌ Error during recording:', error);
    await takeScreenshot(page, 'error-screenshot');
  } finally {
    // Close browser and save video
    await page.waitForTimeout(2000);
    await context.close();
    await browser.close();
    
    console.log('\n🎉 All done! Check the output directories for your demo materials.');
  }
}

// Run the demo
recordDemo().catch(console.error);
