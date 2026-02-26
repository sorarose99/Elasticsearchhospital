/**
 * FINAL COMPREHENSIVE RECORDER
 * Navigates through ALL dashboards (auth bypass already enabled)
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const CONFIG = {
  baseUrl: 'http://localhost:3000/admin',
  screenshotsDir: './demo-screenshots-final',
  videoDir: './demo-videos-final',
  viewport: { width: 1920, height: 1080 },
};

// All 27 navigation items
const NAV_ITEMS = [
  'Dashboard',
  'Patients',
  'Appointments',
  'Laboratory',
  'Pharmacy',
  'Radiology',
  'Billing & Financial Management',
  'Analytics Dashboard',
  'Advanced Reports & Analytics',
  'Administration',
  'Nursing Management',
  'Inventory Management',
  'Staff Management',
  'Insurance Management',
  'Communication Center',
  'Emergency Management',
  'Telemedicine',
  'Patient Portal',
  'Discharge Planning',
  'Hospital Setup',
  'Quality Management',
  'Clinical Research',
  'Settings & Customization',
  'Medical Specializations',
  'Mobile Applications',
  'IoT Medical Devices',
  'AI Diagnostic Assistant'
];

[CONFIG.screenshotsDir, CONFIG.videoDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

async function screenshot(page, name) {
  try {
    const file = path.join(CONFIG.screenshotsDir, `${name}.png`);
    await page.screenshot({ path: file, fullPage: false, timeout: 20000 });
    console.log(`    ✅ ${name}.png`);
    return true;
  } catch (e) {
    console.log(`    ⚠️  Failed: ${e.message}`);
    return false;
  }
}

async function scroll(page, px = 400) {
  await page.evaluate((p) => window.scrollBy({ top: p, behavior: 'smooth' }), px);
  await page.waitForTimeout(600);
}

async function run() {
  console.log('\n🎬 FINAL COMPREHENSIVE RECORDER');
  console.log('================================\n');
  console.log(`📊 Will capture ${NAV_ITEMS.length} dashboards`);
  console.log(`📁 Output: ${CONFIG.screenshotsDir}\n`);
  
  const browser = await chromium.launch({ headless: false, slowMo: 150 });
  const context = await browser.newContext({
    viewport: CONFIG.viewport,
    recordVideo: { dir: CONFIG.videoDir, size: CONFIG.viewport }
  });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);

  try {
    console.log('📍 Loading admin dashboard...\n');
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    let counter = 1;
    
    for (const item of NAV_ITEMS) {
      const num = String(counter).padStart(3, '0');
      const slug = item.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      console.log(`\n[${counter}/${NAV_ITEMS.length}] ${item}`);
      
      try {
        // Check if nav item exists
        const exists = await page.locator(`text="${item}"`).count() > 0;
        if (!exists) {
          console.log(`  ⚠️  Not found, skipping`);
          continue;
        }
        
        // Click navigation
        console.log(`  Clicking...`);
        await page.click(`text="${item}"`, { timeout: 10000 });
        await page.waitForTimeout(2500);
        
        // Reset scroll
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(400);
        
        // Take screenshots
        console.log(`  Taking screenshots...`);
        await screenshot(page, `${num}-${slug}-view1`);
        
        await scroll(page, 400);
        await screenshot(page, `${num}-${slug}-view2`);
        
        await scroll(page, 400);
        await screenshot(page, `${num}-${slug}-view3`);
        
        console.log(`  ✅ Done`);
        counter++;
        
      } catch (e) {
        console.log(`  ❌ Error: ${e.message}`);
      }
    }
    
    console.log('\n\n✅ RECORDING COMPLETE!');
    console.log(`\n📊 Summary:`);
    console.log(`   Dashboards: ${NAV_ITEMS.length}`);
    console.log(`   Screenshots: ~${counter * 3}`);
    console.log(`   Folder: ${CONFIG.screenshotsDir}`);
    console.log(`   Video: ${CONFIG.videoDir}\n`);
    
  } catch (e) {
    console.error('\n❌ ERROR:', e.message);
  } finally {
    await page.waitForTimeout(2000);
    await context.close();
    await browser.close();
    console.log('🎉 DONE!\n');
  }
}

run().catch(console.error);
