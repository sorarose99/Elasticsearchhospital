/**
 * DEEP INTERACTIVE RECORDER - ACTUALLY CLICKS EVERYTHING
 * This script will:
 * 1. Navigate to each dashboard
 * 2. Click ALL tabs within each dashboard
 * 3. Click buttons and interactive elements
 * 4. Scroll to show AI components
 * 5. Take screenshots of different states
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const CONFIG = {
  baseUrl: 'http://localhost:3000/admin',
  screenshotsDir: './demo-screenshots-deep',
  videoDir: './demo-videos-deep',
  viewport: { width: 1920, height: 1080 },
  slowMo: 300, // Slow down for visibility
};

// Focus on dashboards with AI components
const DASHBOARDS = [
  {
    name: 'Emergency Management',
    slug: 'emergency',
    tabs: ['triage', 'emergency_room', 'protocols', 'statistics'],
    hasAI: true,
    priority: 1
  },
  {
    name: 'Laboratory',
    slug: 'laboratory',
    tabs: ['pending', 'completed', 'results', 'quality', 'hl7'],
    hasAI: true,
    priority: 2
  },
  {
    name: 'Dashboard',
    slug: 'dashboard',
    tabs: [],
    hasAI: false,
    priority: 3
  },
  {
    name: 'Patients',
    slug: 'patients',
    tabs: ['list', 'registration', 'emr'],
    hasAI: false,
    priority: 4
  },
  {
    name: 'Appointments',
    slug: 'appointments',
    tabs: ['schedule', 'today', 'waiting'],
    hasAI: false,
    priority: 5
  },
  {
    name: 'Pharmacy',
    slug: 'pharmacy',
    tabs: ['prescriptions', 'inventory', 'dispensing'],
    hasAI: false,
    priority: 6
  },
  {
    name: 'Radiology',
    slug: 'radiology',
    tabs: ['management', 'studies', 'dicom', 'worklist', 'reports'],
    hasAI: false,
    priority: 7
  },
  {
    name: 'Billing & Financial Management',
    slug: 'billing',
    tabs: ['management', 'invoices', 'payments', 'insurance'],
    hasAI: false,
    priority: 8
  }
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
    await page.screenshot({ path: file, fullPage: false, timeout: 15000 });
    console.log(`      ✅ ${name}.png`);
    return true;
  } catch (e) {
    console.log(`      ⚠️  Screenshot failed: ${e.message}`);
    return false;
  }
}

async function wait(ms = 1000) {
  await new Promise(resolve => setTimeout(resolve, ms));
}

async function scrollAndCapture(page, name, counter) {
  // Scroll to top first
  await page.evaluate(() => window.scrollTo(0, 0));
  await wait(500);
  await screenshot(page, `${counter}-${name}-top`);
  
  // Scroll middle
  await page.evaluate(() => window.scrollBy(0, 400));
  await wait(500);
  await screenshot(page, `${counter}-${name}-mid`);
  
  // Scroll bottom
  await page.evaluate(() => window.scrollBy(0, 400));
  await wait(500);
  await screenshot(page, `${counter}-${name}-bottom`);
}

async function clickTabs(page, dashboard, counter) {
  console.log(`    🔍 Looking for tabs...`);
  
  // Try to find tab triggers
  const tabTriggers = await page.locator('[role="tab"]').all();
  console.log(`    Found ${tabTriggers.length} tabs`);
  
  for (let i = 0; i < tabTriggers.length; i++) {
    try {
      const tabText = await tabTriggers[i].textContent();
      const cleanText = tabText?.trim().substring(0, 30) || `tab-${i}`;
      console.log(`      Clicking tab: ${cleanText}`);
      
      await tabTriggers[i].click({ timeout: 5000 });
      await wait(2000); // Wait for content to load
      
      // Take screenshot of this tab
      await screenshot(page, `${counter}-${dashboard.slug}-tab-${i}-${cleanText.replace(/[^a-z0-9]/gi, '-')}`);
      counter++;
      
      // Scroll within this tab
      await page.evaluate(() => window.scrollBy(0, 300));
      await wait(500);
      await screenshot(page, `${counter}-${dashboard.slug}-tab-${i}-scrolled`);
      counter++;
      
    } catch (e) {
      console.log(`      ⚠️  Could not click tab ${i}: ${e.message}`);
    }
  }
  
  return counter;
}

async function clickButtons(page, dashboard, counter) {
  console.log(`    🔍 Looking for buttons...`);
  
  // Find all visible buttons (but not in sidebar/nav)
  const buttons = await page.locator('button:visible:not([class*="sidebar"]):not([class*="nav"])').all();
  console.log(`    Found ${buttons.length} buttons`);
  
  // Click first 3 buttons
  for (let i = 0; i < Math.min(buttons.length, 3); i++) {
    try {
      const btnText = await buttons[i].textContent();
      const cleanText = btnText?.trim().substring(0, 30) || `btn-${i}`;
      
      // Skip logout and dangerous buttons
      if (cleanText.toLowerCase().includes('logout') || 
          cleanText.toLowerCase().includes('delete') ||
          cleanText.toLowerCase().includes('remove')) {
        continue;
      }
      
      console.log(`      Clicking button: ${cleanText}`);
      await buttons[i].click({ timeout: 5000 });
      await wait(2000);
      
      await screenshot(page, `${counter}-${dashboard.slug}-btn-${i}-${cleanText.replace(/[^a-z0-9]/gi, '-')}`);
      counter++;
      
      // Try to close any modal that opened
      const closeBtn = await page.locator('[aria-label="Close"], [class*="close"]').first();
      if (await closeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await closeBtn.click();
        await wait(500);
      }
      
      // Press Escape to close modals
      await page.keyboard.press('Escape');
      await wait(500);
      
    } catch (e) {
      console.log(`      ⚠️  Could not click button ${i}: ${e.message}`);
    }
  }
  
  return counter;
}

async function exploreAIComponents(page, dashboard, counter) {
  if (!dashboard.hasAI) return counter;
  
  console.log(`    🤖 Looking for AI components...`);
  
  // Look for AI insight cards
  const aiCards = await page.locator('[class*="agent"], [class*="insight"], [class*="smart"]').all();
  console.log(`    Found ${aiCards.length} AI-related elements`);
  
  for (let i = 0; i < Math.min(aiCards.length, 5); i++) {
    try {
      await aiCards[i].scrollIntoViewIfNeeded();
      await wait(500);
      await screenshot(page, `${counter}-${dashboard.slug}-ai-component-${i}`);
      counter++;
    } catch (e) {
      // Skip
    }
  }
  
  // Look for AI floating button
  const floatingBtn = await page.locator('[class*="floating"]').first();
  if (await floatingBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    console.log(`    Found AI floating button`);
    await screenshot(page, `${counter}-${dashboard.slug}-ai-floating-btn`);
    counter++;
    
    // Click it to open AI panel
    try {
      await floatingBtn.click();
      await wait(2000);
      await screenshot(page, `${counter}-${dashboard.slug}-ai-panel-open`);
      counter++;
      
      // Close it
      await page.keyboard.press('Escape');
      await wait(500);
    } catch (e) {
      console.log(`      ⚠️  Could not interact with AI button`);
    }
  }
  
  return counter;
}

async function run() {
  console.log('\n🎬 DEEP INTERACTIVE RECORDER');
  console.log('============================\n');
  console.log('This will ACTUALLY click through everything:\n');
  console.log('✓ Navigate to each dashboard');
  console.log('✓ Click ALL tabs within dashboards');
  console.log('✓ Click buttons and interactive elements');
  console.log('✓ Show AI components in action');
  console.log('✓ Take screenshots of different states\n');
  
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
  page.setDefaultTimeout(15000);

  try {
    console.log('📍 Loading admin dashboard...\n');
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await wait(4000);
    
    let globalCounter = 1;
    
    // Sort by priority (AI dashboards first)
    const sortedDashboards = DASHBOARDS.sort((a, b) => a.priority - b.priority);
    
    for (let idx = 0; idx < sortedDashboards.length; idx++) {
      const dashboard = sortedDashboards[idx];
      const num = String(idx + 1).padStart(2, '0');
      
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`[${num}/${sortedDashboards.length}] ${dashboard.name} ${dashboard.hasAI ? '🤖 (AI)' : ''}`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      
      try {
        // Click navigation item
        console.log(`  📍 Clicking navigation...`);
        const navItem = page.locator(`text="${dashboard.name}"`).first();
        const exists = await navItem.count() > 0;
        
        if (!exists) {
          console.log(`  ⚠️  Not found in sidebar`);
          continue;
        }
        
        await navItem.click({ timeout: 10000 });
        await wait(3000); // Wait for content to load
        
        // Reset scroll
        await page.evaluate(() => window.scrollTo(0, 0));
        await wait(500);
        
        // Take initial screenshot
        console.log(`  📸 Taking screenshots...`);
        const baseCounter = String(globalCounter).padStart(3, '0');
        await screenshot(page, `${baseCounter}-${dashboard.slug}-initial`);
        globalCounter++;
        
        // Scroll and capture
        await scrollAndCapture(page, dashboard.slug, globalCounter);
        globalCounter += 3;
        
        // Click tabs if they exist
        if (dashboard.tabs && dashboard.tabs.length > 0) {
          console.log(`  📑 Exploring ${dashboard.tabs.length} tabs...`);
          globalCounter = await clickTabs(page, dashboard, globalCounter);
        }
        
        // Click buttons
        console.log(`  🔘 Clicking buttons...`);
        globalCounter = await clickButtons(page, dashboard, globalCounter);
        
        // Explore AI components if present
        if (dashboard.hasAI) {
          console.log(`  🤖 Exploring AI components...`);
          globalCounter = await exploreAIComponents(page, dashboard, globalCounter);
        }
        
        console.log(`  ✅ Captured ~${globalCounter - parseInt(baseCounter)} screenshots`);
        
      } catch (e) {
        console.log(`  ❌ Error: ${e.message}`);
      }
    }
    
    console.log('\n\n✅ RECORDING COMPLETE!');
    console.log(`\n📊 Summary:`);
    console.log(`   Dashboards explored: ${sortedDashboards.length}`);
    console.log(`   Total screenshots: ~${globalCounter}`);
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
