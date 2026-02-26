/**
 * DEEP INTERACTIVE RECORDER
 * Actually clicks buttons, tabs, and interactive elements in each dashboard
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const CONFIG = {
  baseUrl: 'http://localhost:3000/admin',
  screenshotsDir: './demo-screenshots-interactive',
  videoDir: './demo-videos-interactive',
  viewport: { width: 1920, height: 1080 },
};

const NAV_ITEMS = [
  'Emergency Management',  // Start with the important one with AI
  'Laboratory',           // Has AI components
  'Dashboard',
  'Patients',
  'Appointments',
  'Pharmacy',
  'Radiology',
  'Billing & Financial Management',
  'Analytics Dashboard',
];

[CONFIG.screenshotsDir, CONFIG.videoDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

async function screenshot(page, name) {
  try {
    const file = path.join(CONFIG.screenshotsDir, `${name}.png`);
    await page.screenshot({ path: file, fullPage: false, timeout: 15000 });
    console.log(`      ✅ ${name}.png`);
    return true;
  } catch (e) {
    console.log(`      ⚠️  Screenshot failed`);
    return false;
  }
}

async function scroll(page, px = 400) {
  await page.evaluate((p) => window.scrollBy({ top: p, behavior: 'smooth' }), px);
  await page.waitForTimeout(800);
}

async function clickAndCapture(page, selector, name, counter) {
  try {
    const exists = await page.locator(selector).count() > 0;
    if (!exists) return false;
    
    console.log(`    Clicking: ${selector}`);
    await page.click(selector, { timeout: 5000 });
    await page.waitForTimeout(2000);
    
    await screenshot(page, `${counter}-${name}`);
    return true;
  } catch (e) {
    console.log(`    ⚠️  Could not click: ${selector}`);
    return false;
  }
}

async function exploreInteractiveElements(page, dashboardName, baseCounter) {
  console.log(`\n  🔍 Exploring interactive elements in ${dashboardName}...`);
  
  let counter = baseCounter;
  
  // Look for tabs
  const tabs = await page.locator('[role="tab"], [class*="tab"]').all();
  console.log(`    Found ${tabs.length} tabs`);
  
  for (let i = 0; i < Math.min(tabs.length, 5); i++) {
    try {
      const tabText = await tabs[i].textContent();
      console.log(`    Clicking tab: ${tabText?.substring(0, 30)}`);
      await tabs[i].click();
      await page.waitForTimeout(1500);
      await screenshot(page, `${counter}-tab-${i}`);
      counter++;
    } catch (e) {
      // Skip
    }
  }
  
  // Look for buttons (but not navigation buttons)
  const buttons = await page.locator('button:not([class*="sidebar"]):not([class*="nav"])').all();
  console.log(`    Found ${buttons.length} buttons`);
  
  for (let i = 0; i < Math.min(buttons.length, 3); i++) {
    try {
      const btnText = await buttons[i].textContent();
      if (btnText && btnText.length < 50 && !btnText.includes('Logout')) {
        console.log(`    Clicking button: ${btnText.substring(0, 30)}`);
        await buttons[i].click();
        await page.waitForTimeout(1500);
        await screenshot(page, `${counter}-btn-${i}`);
        counter++;
        
        // Close any modal that opened
        const closeBtn = await page.locator('[class*="close"], [aria-label="Close"]').first();
        if (await closeBtn.isVisible({ timeout: 1000 })) {
          await closeBtn.click();
          await page.waitForTimeout(500);
        }
      }
    } catch (e) {
      // Skip
    }
  }
  
  // Look for cards or expandable sections
  const cards = await page.locator('[class*="card"], [class*="accordion"]').all();
  console.log(`    Found ${cards.length} cards/sections`);
  
  for (let i = 0; i < Math.min(cards.length, 3); i++) {
    try {
      await cards[i].scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await screenshot(page, `${counter}-card-${i}`);
      counter++;
    } catch (e) {
      // Skip
    }
  }
  
  return counter;
}

async function run() {
  console.log('\n🎬 DEEP INTERACTIVE RECORDER');
  console.log('============================\n');
  console.log('This will:');
  console.log('- Navigate to each dashboard');
  console.log('- Click tabs, buttons, and interactive elements');
  console.log('- Take screenshots of different states');
  console.log('- Capture actual content changes\n');
  
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const context = await browser.newContext({
    viewport: CONFIG.viewport,
    recordVideo: { dir: CONFIG.videoDir, size: CONFIG.viewport }
  });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);

  try {
    console.log('📍 Loading admin dashboard...\n');
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(4000);
    
    let globalCounter = 1;
    
    for (let idx = 0; idx < NAV_ITEMS.length; idx++) {
      const item = NAV_ITEMS[idx];
      const num = String(idx + 1).padStart(2, '0');
      const slug = item.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`[${num}/${NAV_ITEMS.length}] ${item}`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      
      try {
        // Check if nav item exists
        const exists = await page.locator(`text="${item}"`).count() > 0;
        if (!exists) {
          console.log(`  ⚠️  Not found in sidebar`);
          continue;
        }
        
        // Click navigation
        console.log(`  📍 Clicking navigation...`);
        await page.click(`text="${item}"`, { timeout: 10000 });
        await page.waitForTimeout(3000); // Wait longer for content to load
        
        // Reset scroll
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(500);
        
        // Take initial screenshot
        console.log(`  📸 Taking screenshots...`);
        const baseCounter = String(globalCounter).padStart(3, '0');
        await screenshot(page, `${baseCounter}-${slug}-initial`);
        globalCounter++;
        
        // Scroll and capture
        await scroll(page, 400);
        await screenshot(page, `${baseCounter}-${slug}-scroll1`);
        globalCounter++;
        
        await scroll(page, 400);
        await screenshot(page, `${baseCounter}-${slug}-scroll2`);
        globalCounter++;
        
        // Now explore interactive elements
        globalCounter = await exploreInteractiveElements(page, item, globalCounter);
        
        console.log(`  ✅ Captured ~${globalCounter - parseInt(baseCounter)} screenshots`);
        
      } catch (e) {
        console.log(`  ❌ Error: ${e.message}`);
      }
    }
    
    console.log('\n\n✅ RECORDING COMPLETE!');
    console.log(`\n📊 Summary:`);
    console.log(`   Dashboards explored: ${NAV_ITEMS.length}`);
    console.log(`   Total screenshots: ~${globalCounter}`);
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
