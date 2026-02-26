/**
 * CLICK EVERYTHING RECORDER
 * Uses proper Playwright .all() method to click EVERY button on EVERY dashboard
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const CONFIG = {
  baseUrl: 'http://localhost:3000/admin',
  screenshotsDir: './demo-screenshots-complete',
  videoDir: './demo-videos-complete',
  viewport: { width: 1920, height: 1080 },
  slowMo: 150,
};

// All navigation items from NavigationConfig
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

// Create directories
[CONFIG.screenshotsDir, CONFIG.videoDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

async function screenshot(page, name) {
  try {
    const file = path.join(CONFIG.screenshotsDir, `${name}.png`);
    await page.screenshot({ path: file, fullPage: false, timeout: 10000 });
    console.log(`        ✅ ${name}.png`);
    return true;
  } catch (e) {
    console.log(`        ⚠️  Screenshot failed`);
    return false;
  }
}

async function wait(ms = 1000) {
  await new Promise(resolve => setTimeout(resolve, ms));
}

async function clickAllTabs(page, navSlug, counter) {
  console.log(`    📑 Finding all tabs...`);
  
  try {
    // Wait for tabs to load
    await page.waitForSelector('[role="tab"]', { timeout: 3000 }).catch(() => null);
    
    // Get ALL tab elements using .all()
    const tabs = await page.locator('[role="tab"]').all();
    console.log(`    Found ${tabs.length} tabs`);
    
    if (tabs.length === 0) {
      console.log(`    No tabs found`);
      return counter;
    }
    
    // Click each tab
    for (let i = 0; i < tabs.length; i++) {
      try {
        const tabText = await tabs[i].textContent();
        const cleanText = tabText?.trim().substring(0, 20).replace(/[^a-z0-9]/gi, '-') || `tab-${i}`;
        console.log(`      [${i+1}/${tabs.length}] Clicking tab: ${tabText?.trim()}`);
        
        // Click the tab
        await tabs[i].click({ timeout: 5000 });
        await wait(1500);
        
        // Screenshot
        await screenshot(page, `${String(counter).padStart(4, '0')}-${navSlug}-tab-${cleanText}`);
        counter++;
        
        // Scroll down to see content
        await page.evaluate(() => window.scrollBy(0, 300));
        await wait(500);
        await screenshot(page, `${String(counter).padStart(4, '0')}-${navSlug}-tab-${cleanText}-scroll`);
        counter++;
        
        // Scroll back to top
        await page.evaluate(() => window.scrollTo(0, 0));
        await wait(300);
        
      } catch (e) {
        console.log(`      ⚠️  Could not click tab ${i}: ${e.message}`);
      }
    }
  } catch (e) {
    console.log(`    ⚠️  Error with tabs: ${e.message}`);
  }
  
  return counter;
}

async function clickAllButtons(page, navSlug, counter) {
  console.log(`    🔘 Finding all buttons...`);
  
  try {
    // Wait for buttons to load
    await wait(1000);
    
    // Get ALL button elements using .all()
    // Exclude sidebar/nav buttons and dangerous buttons
    const allButtons = await page.locator('button:visible').all();
    console.log(`    Found ${allButtons.length} total buttons`);
    
    // Filter out dangerous buttons
    const safeButtons = [];
    for (const btn of allButtons) {
      try {
        const text = await btn.textContent();
        const cleanText = text?.trim().toLowerCase() || '';
        
        // Skip dangerous buttons
        if (cleanText.includes('logout') ||
            cleanText.includes('delete') ||
            cleanText.includes('remove') ||
            cleanText.includes('sign out') ||
            cleanText.length === 0) {
          continue;
        }
        
        // Check if button is in main content (not sidebar)
        const box = await btn.boundingBox();
        if (box && box.x > 250) { // Sidebar is typically < 250px
          safeButtons.push({ btn, text: cleanText });
        }
      } catch (e) {
        // Skip this button
      }
    }
    
    console.log(`    Clicking ${safeButtons.length} safe buttons`);
    
    // Click each safe button
    for (let i = 0; i < Math.min(safeButtons.length, 10); i++) { // Limit to 10 buttons per dashboard
      try {
        const { btn, text } = safeButtons[i];
        const btnSlug = text.substring(0, 20).replace(/[^a-z0-9]/gi, '-');
        console.log(`      [${i+1}/${Math.min(safeButtons.length, 10)}] Clicking: ${text.substring(0, 30)}`);
        
        // Click the button
        await btn.click({ timeout: 5000 });
        await wait(1500);
        
        // Screenshot
        await screenshot(page, `${String(counter).padStart(4, '0')}-${navSlug}-btn-${btnSlug}`);
        counter++;
        
        // Try to close any modal that opened
        try {
          // Press Escape to close modals
          await page.keyboard.press('Escape');
          await wait(500);
          
          // Or click close button
          const closeBtn = await page.locator('[aria-label="Close"], [class*="close"]').first();
          if (await closeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
            await closeBtn.click();
            await wait(500);
          }
        } catch (e) {
          // No modal to close
        }
        
      } catch (e) {
        console.log(`      ⚠️  Could not click button ${i}: ${e.message}`);
      }
    }
  } catch (e) {
    console.log(`    ⚠️  Error with buttons: ${e.message}`);
  }
  
  return counter;
}

async function clickAllCards(page, navSlug, counter) {
  console.log(`    📇 Finding all cards...`);
  
  try {
    // Get ALL card elements using .all()
    const cards = await page.locator('[class*="card"]:visible, [class*="Card"]:visible').all();
    console.log(`    Found ${cards.length} cards`);
    
    // Scroll to each card and screenshot
    for (let i = 0; i < Math.min(cards.length, 5); i++) {
      try {
        await cards[i].scrollIntoViewIfNeeded();
        await wait(500);
        await screenshot(page, `${String(counter).padStart(4, '0')}-${navSlug}-card-${i}`);
        counter++;
      } catch (e) {
        // Skip
      }
    }
  } catch (e) {
    console.log(`    ⚠️  Error with cards: ${e.message}`);
  }
  
  return counter;
}

async function exploreAIComponents(page, navSlug, counter) {
  console.log(`    🤖 Finding AI components...`);
  
  try {
    // Look for AI-related elements
    const aiElements = await page.locator('[class*="agent"], [class*="Agent"], [class*="insight"], [class*="Insight"], [class*="smart"], [class*="Smart"]').all();
    console.log(`    Found ${aiElements.length} AI elements`);
    
    for (let i = 0; i < Math.min(aiElements.length, 5); i++) {
      try {
        await aiElements[i].scrollIntoViewIfNeeded();
        await wait(500);
        await screenshot(page, `${String(counter).padStart(4, '0')}-${navSlug}-ai-${i}`);
        counter++;
      } catch (e) {
        // Skip
      }
    }
    
    // Look for floating AI button
    const floatingBtn = await page.locator('[class*="floating"]').first();
    if (await floatingBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log(`    Found AI floating button`);
      await screenshot(page, `${String(counter).padStart(4, '0')}-${navSlug}-ai-floating`);
      counter++;
      
      try {
        await floatingBtn.click();
        await wait(2000);
        await screenshot(page, `${String(counter).padStart(4, '0')}-${navSlug}-ai-panel`);
        counter++;
        
        await page.keyboard.press('Escape');
        await wait(500);
      } catch (e) {
        // Skip
      }
    }
  } catch (e) {
    console.log(`    ⚠️  Error with AI components: ${e.message}`);
  }
  
  return counter;
}

async function run() {
  console.log('\n🎬 CLICK EVERYTHING RECORDER');
  console.log('============================\n');
  console.log('Using Playwright .all() to click EVERY element\n');
  
  const browser = await chromium.launch({ 
    headless: false, 
    slowMo: CONFIG.slowMo 
  });
  
  const context = await browser.newContext({
    viewport: CONFIG.viewport,
    recordVideo: { 
      dir: CONFIG.videoDir, 
      size: CONFIG.viewport 
    }
  });
  
  const page = await context.newPage();
  page.setDefaultTimeout(10000);

  try {
    console.log('📍 Loading admin dashboard...\n');
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await wait(4000);
    
    let globalCounter = 1;
    
    // Process each navigation item
    for (let idx = 0; idx < NAV_ITEMS.length; idx++) {
      const navItem = NAV_ITEMS[idx];
      const num = String(idx + 1).padStart(2, '0');
      const navSlug = navItem.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`[${num}/${NAV_ITEMS.length}] ${navItem}`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      
      try {
        // Find and click navigation item
        console.log(`  📍 Clicking navigation...`);
        const navLocator = page.locator(`text="${navItem}"`).first();
        
        if (await navLocator.count() === 0) {
          console.log(`  ⚠️  Not found in sidebar`);
          continue;
        }
        
        await navLocator.click({ timeout: 10000 });
        await wait(3000);
        
        // Reset scroll
        await page.evaluate(() => window.scrollTo(0, 0));
        await wait(500);
        
        // Initial screenshot
        console.log(`  📸 Taking screenshots...`);
        await screenshot(page, `${String(globalCounter).padStart(4, '0')}-${navSlug}-initial`);
        globalCounter++;
        
        // Scroll and capture
        await page.evaluate(() => window.scrollBy(0, 400));
        await wait(500);
        await screenshot(page, `${String(globalCounter).padStart(4, '0')}-${navSlug}-scroll1`);
        globalCounter++;
        
        await page.evaluate(() => window.scrollBy(0, 400));
        await wait(500);
        await screenshot(page, `${String(globalCounter).padStart(4, '0')}-${navSlug}-scroll2`);
        globalCounter++;
        
        // Reset scroll
        await page.evaluate(() => window.scrollTo(0, 0));
        await wait(500);
        
        // Click ALL tabs
        globalCounter = await clickAllTabs(page, navSlug, globalCounter);
        
        // Click ALL buttons
        globalCounter = await clickAllButtons(page, navSlug, globalCounter);
        
        // Explore cards
        globalCounter = await clickAllCards(page, navSlug, globalCounter);
        
        // Explore AI components (for Emergency, Laboratory, Doctor dashboards)
        if (navItem.includes('Emergency') || navItem.includes('Laboratory') || navItem.includes('Dashboard')) {
          globalCounter = await exploreAIComponents(page, navSlug, globalCounter);
        }
        
        console.log(`  ✅ Completed ${navItem}`);
        
      } catch (e) {
        console.log(`  ❌ Error: ${e.message}`);
      }
    }
    
    console.log('\n\n✅ RECORDING COMPLETE!');
    console.log(`\n📊 Summary:`);
    console.log(`   Navigation items: ${NAV_ITEMS.length}`);
    console.log(`   Total screenshots: ${globalCounter}`);
    console.log(`   Folder: ${CONFIG.screenshotsDir}`);
    console.log(`   Video: ${CONFIG.videoDir}\n`);
    
  } catch (e) {
    console.error('\n❌ ERROR:', e.message);
    console.error(e.stack);
  } finally {
    await wait(2000);
    await context.close();
    await browser.close();
    console.log('🎉 DONE!\n');
  }
}

run().catch(console.error);
