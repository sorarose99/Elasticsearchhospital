/**
 * Debug script to see what's actually on the page
 */

const { chromium } = require('playwright');

async function debug() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Loading page...');
  await page.goto('http://localhost:3000/admin', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);
  
  console.log('\n📍 Page loaded. Taking screenshot...');
  await page.screenshot({ path: 'debug-page.png', fullPage: true });
  console.log('✅ Saved: debug-page.png');
  
  console.log('\n📍 Looking for navigation elements...');
  
  // Try to find sidebar or navigation
  const navElements = await page.locator('[role="navigation"], nav, aside, [class*="sidebar"], [class*="nav"]').all();
  console.log(`Found ${navElements.length} navigation-like elements`);
  
  // Try to find all links
  const links = await page.locator('a, button').all();
  console.log(`Found ${links.length} total links/buttons`);
  
  // Get first 20 visible text elements
  console.log('\n📍 First 20 visible text elements:');
  const textElements = await page.locator('text=/./').all();
  for (let i = 0; i < Math.min(20, textElements.length); i++) {
    try {
      const text = await textElements[i].textContent();
      if (text && text.trim() && text.trim().length < 50) {
        console.log(`  - "${text.trim()}"`);
      }
    } catch (e) {
      // Skip
    }
  }
  
  console.log('\n📍 Looking for specific navigation items...');
  const navItems = ['Dashboard', 'Patients', 'Emergency Management', 'Laboratory'];
  for (const item of navItems) {
    const count = await page.locator(`text="${item}"`).count();
    console.log(`  "${item}": ${count} found`);
  }
  
  await browser.close();
  console.log('\n✅ Debug complete!');
}

debug().catch(console.error);
