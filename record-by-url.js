/**
 * URL-based Dashboard Recorder
 * Navigates directly to URLs for reliable recording
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const CONFIG = {
  baseUrl: 'http://localhost:3000',
  screenshotsDir: './demo-screenshots',
  videoDir: './demo-videos',
  viewport: { width: 1920, height: 1080 },
};

if (!fs.existsSync(CONFIG.screenshotsDir)) {
  fs.mkdirSync(CONFIG.screenshotsDir, { recursive: true });
}
if (!fs.existsSync(CONFIG.videoDir)) {
  fs.mkdirSync(CONFIG.videoDir, { recursive: true });
}

async function takeScreenshot(page, name) {
  const filename = path.join(CONFIG.screenshotsDir, `${name}.png`);
  await page.screenshot({ path: filename, fullPage: true });
  console.log(`✅ ${name}`);
}

async function smoothScroll(page, distance = 400) {
  await page.evaluate((dist) => {
    window.scrollBy({ top: dist, behavior: 'smooth' });
  }, distance);
  await page.waitForTimeout(1200);
}

async function recordDashboards() {
  console.log('🎬 Recording All Dashboards by URL...\n');
  
  const browser = await chromium.launch({
    headless: false,
    slowMo: 300,
  });

  const context = await browser.newContext({
    viewport: CONFIG.viewport,
    recordVideo: {
      dir: CONFIG.videoDir,
      size: CONFIG.viewport
    },
  });

  const page = await context.newPage();

  try {
    const dashboards = [
      { name: 'Admin Dashboard', url: '/admin', prefix: 'admin' },
      { name: 'Emergency Management', url: '/admin?view=emergency', prefix: 'emergency' },
      { name: 'Laboratory', url: '/admin?view=laboratory', prefix: 'lab' },
      { name: 'Patients', url: '/admin?view=patients', prefix: 'patients' },
      { name: 'Appointments', url: '/admin?view=appointments', prefix: 'appointments' },
      { name: 'Pharmacy', url: '/admin?view=pharmacy', prefix: 'pharmacy' },
      { name: 'Radiology', url: '/admin?view=radiology', prefix: 'radiology' },
      { name: 'Billing', url: '/admin?view=billing', prefix: 'billing' },
      { name: 'Analytics', url: '/admin?view=analytics', prefix: 'analytics' },
    ];

    for (const dashboard of dashboards) {
      console.log(`\n📍 ${dashboard.name}`);
      
      try {
        await page.goto(CONFIG.baseUrl + dashboard.url, { 
          waitUntil: 'domcontentloaded',
          timeout: 30000 
        });
        await page.waitForTimeout(3000);
        
        // Full page screenshot
        await takeScreenshot(page, `${dashboard.prefix}-01-full`);
        
        // Scroll and capture sections
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
        await page.waitForTimeout(500);
        await takeScreenshot(page, `${dashboard.prefix}-02-top`);
        
        await smoothScroll(page, 400);
        await takeScreenshot(page, `${dashboard.prefix}-03-middle`);
        
        await smoothScroll(page, 400);
        await takeScreenshot(page, `${dashboard.prefix}-04-bottom`);
        
      } catch (error) {
        console.log(`⚠️  ${dashboard.name} - ${error.message}`);
      }
    }
    
    console.log('\n✅ All dashboards recorded!');
    console.log(`📁 Screenshots: ${CONFIG.screenshotsDir}`);
    console.log(`📁 Video: ${CONFIG.videoDir}`);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await page.waitForTimeout(2000);
    await context.close();
    await browser.close();
    console.log('\n🎉 Done!');
  }
}

recordDashboards().catch(console.error);
