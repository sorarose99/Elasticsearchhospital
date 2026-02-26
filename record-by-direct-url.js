/**
 * DIRECT URL NAVIGATION RECORDER
 * Navigates directly to dashboard URLs and interacts with content
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const CONFIG = {
  baseUrl: 'http://localhost:3000',
  screenshotsDir: './demo-screenshots-url',
  videoDir: './demo-videos-url',
  viewport: { width: 1920, height: 1080 },
  slowMo: 200,
};

// Direct URL paths for each dashboard
const DASHBOARDS = [
  {
    name: 'Admin Dashboard',
    url: '/admin',
    slug: 'admin-dashboard',
    hasAI: false,
    priority: 1
  },
  {
    name: 'Emergency Management',
    url: '/admin', // Then click Emergency Management
    navClick: 'Emergency Management',
    slug: 'emergency',
    hasAI: true,
    priority: 2
  },
  {
    name: 'Laboratory',
    url: '/admin',
    navClick: 'Laboratory',
    slug: 'laboratory',
    hasAI: true,
    priority: 3
  },
  {
    name: 'Patients',
    url: '/admin',
    navClick: 'Patients',
    slug: 'patients',
    hasAI: false,
    priority: 4
  },
  {
    name: 'Appointments',
    url: '/admin',
    navClick: 'Appointments',
    slug: 'appointments',
    hasAI: false,
    priority: 5
  },
  {
    name: 'Pharmacy',
    url: '/admin',
    navClick: 'Pharmacy',
    slug: 'pharmacy',
    hasAI: false,
    priority: 6
  },
  {
    name: 'Radiology',
    url: '/admin',
    navClick: 'Radiology',
    slug: 'radiology',
    hasAI: false,
    priority: 7
  },
  {
    name: 'Billing',
    url: '/admin',
    navClick: 'Billing & Financial Management',
    slug: 'billing',
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
    console.log(`      ⚠️  Screenshot failed`);
    return false;
  }
}

async function wait(ms = 1000) {
  await new Promise(resolve => setTimeout(resolve, ms));
}

async function clickAllTabs(page, dashboard, counter) {
  console.log(`    🔍 Looking for tabs...`);
  
  try {
    // Wait for tabs to be visible
    await page.waitForSelector('[role="tab"]', { timeout: 5000 }).catch(() => null);
    
    const tabs = await page.locator('[role="tab"]').all();
    console.log(`    Found ${tabs.length} tabs`);
    
    for (let i = 0; i < tabs.length; i++) {
      try {
        const tabText = await tabs[i].textContent();
        const cleanText = tabText?.trim().replace(/[^a-z0-9]/gi, '-').substring(0, 30) || `tab-${i}`;
        console.log(`      Clicking tab: ${tabText?.trim()}`);
        
        // Click the tab
        await tabs[i].click({ timeout: 5000 });
        await wait(2000);
        
        // Take screenshot
        await screenshot(page, `${counter}-${dashboard.slug}-tab-${cleanText}`);
        counter++;
        
        // Scroll down in this tab
        await page.evaluate(() => window.scrollBy(0, 400));
        await wait(500);
        await screenshot(page, `${counter}-${dashboard.slug}-tab-${cleanText}-scrolled`);
        counter++;
        
        // Scroll back to top
        await page.evaluate(() => window.scrollTo(0, 0));
        await wait(300);
        
      } catch (e) {
        console.log(`      ⚠️  Could not interact with tab ${i}`);
      }
    }
  } catch (e) {
    console.log(`    ⚠️  No tabs found or error: ${e.message}`);
  }
  
  return counter;
}

async function clickButtons(page, dashboard, counter) {
  console.log(`    🔘 Looking for buttons...`);
  
  try {
    // Find visible buttons (exclude nav/sidebar buttons)
    const buttons = await page.locator('button:visible').all();
    console.log(`    Found ${buttons.length} buttons`);
    
    let clicked = 0;
    for (let i = 0; i < buttons.length && clicked < 3; i++) {
      try {
        const btnText = await buttons[i].textContent();
        const cleanText = btnText?.trim() || '';
        
        // Skip dangerous or navigation buttons
        if (cleanText.toLowerCase().includes('logout') ||
            cleanText.toLowerCase().includes('delete') ||
            cleanText.toLowerCase().includes('remove') ||
            cleanText.length === 0) {
          continue;
        }
        
        console.log(`      Clicking button: ${cleanText.substring(0, 30)}`);
        
        await buttons[i].click({ timeout: 5000 });
        await wait(2000);
        
        const btnSlug = cleanText.replace(/[^a-z0-9]/gi, '-').substring(0, 30);
        await screenshot(page, `${counter}-${dashboard.slug}-btn-${btnSlug}`);
        counter++;
        clicked++;
        
        // Try to close any modal
        await page.keyboard.press('Escape');
        await wait(500);
        
      } catch (e) {
        // Skip this button
      }
    }
  } catch (e) {
    console.log(`    ⚠️  Error clicking buttons: ${e.message}`);
  }
  
  return counter;
}

async function exploreAIComponents(page, dashboard, counter) {
  if (!dashboard.hasAI) return counter;
  
  console.log(`    🤖 Looking for AI components...`);
  
  try {
    // Look for AI-related elements
    const aiSelectors = [
      '[class*="agent"]',
      '[class*="insight"]',
      '[class*="smart"]',
      '[class*="ai"]',
      '[class*="recommendation"]'
    ];
    
    for (const selector of aiSelectors) {
      const elements = await page.locator(selector).all();
      if (elements.length > 0) {
        console.log(`    Found ${elements.length} elements matching ${selector}`);
        
        for (let i = 0; i < Math.min(elements.length, 3); i++) {
          try {
            await elements[i].scrollIntoViewIfNeeded();
            await wait(500);
            await screenshot(page, `${counter}-${dashboard.slug}-ai-${i}`);
            counter++;
          } catch (e) {
            // Skip
          }
        }
      }
    }
    
    // Look for floating AI button
    const floatingBtn = await page.locator('[class*="floating"]').first();
    if (await floatingBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log(`    Found AI floating button`);
      await screenshot(page, `${counter}-${dashboard.slug}-ai-floating`);
      counter++;
      
      try {
        await floatingBtn.click();
        await wait(2000);
        await screenshot(page, `${counter}-${dashboard.slug}-ai-panel-open`);
        counter++;
        
        await page.keyboard.press('Escape');
        await wait(500);
      } catch (e) {
        // Skip
      }
    }
  } catch (e) {
    console.log(`    ⚠️  Error exploring AI components: ${e.message}`);
  }
  
  return counter;
}

async function run() {
  console.log('\n🎬 DIRECT URL NAVIGATION RECORDER');
  console.log('==================================\n');
  console.log('This will navigate directly to dashboards and interact with content\n');
  
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
    let globalCounter = 1;
    
    for (let idx = 0; idx < DASHBOARDS.length; idx++) {
      const dashboard = DASHBOARDS[idx];
      const num = String(idx + 1).padStart(2, '0');
      
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`[${num}/${DASHBOARDS.length}] ${dashboard.name} ${dashboard.hasAI ? '🤖' : ''}`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      
      try {
        // Navigate to URL
        console.log(`  📍 Navigating to ${dashboard.url}...`);
        await page.goto(CONFIG.baseUrl + dashboard.url, { 
          waitUntil: 'domcontentloaded', 
          timeout: 30000 
        });
        await wait(3000);
        
        // If we need to click a nav item
        if (dashboard.navClick) {
          console.log(`  📍 Clicking navigation: ${dashboard.navClick}...`);
          try {
            // Try multiple selectors
            const navItem = page.locator(`text="${dashboard.navClick}"`).first();
            await navItem.click({ timeout: 10000 });
            await wait(3000);
          } catch (e) {
            console.log(`  ⚠️  Could not click nav item: ${e.message}`);
            // Continue anyway, might already be on the page
          }
        }
        
        // Reset scroll
        await page.evaluate(() => window.scrollTo(0, 0));
        await wait(500);
        
        // Take initial screenshot
        console.log(`  📸 Taking screenshots...`);
        const baseCounter = String(globalCounter).padStart(3, '0');
        await screenshot(page, `${baseCounter}-${dashboard.slug}-initial`);
        globalCounter++;
        
        // Scroll and capture
        await page.evaluate(() => window.scrollBy(0, 400));
        await wait(500);
        await screenshot(page, `${baseCounter}-${dashboard.slug}-scroll1`);
        globalCounter++;
        
        await page.evaluate(() => window.scrollBy(0, 400));
        await wait(500);
        await screenshot(page, `${baseCounter}-${dashboard.slug}-scroll2`);
        globalCounter++;
        
        // Click all tabs
        console.log(`  📑 Exploring tabs...`);
        globalCounter = await clickAllTabs(page, dashboard, globalCounter);
        
        // Click buttons
        console.log(`  🔘 Clicking buttons...`);
        globalCounter = await clickButtons(page, dashboard, globalCounter);
        
        // Explore AI components
        if (dashboard.hasAI) {
          console.log(`  🤖 Exploring AI components...`);
          globalCounter = await exploreAIComponents(page, dashboard, globalCounter);
        }
        
        console.log(`  ✅ Captured screenshots for ${dashboard.name}`);
        
      } catch (e) {
        console.log(`  ❌ Error: ${e.message}`);
      }
    }
    
    console.log('\n\n✅ RECORDING COMPLETE!');
    console.log(`\n📊 Summary:`);
    console.log(`   Dashboards explored: ${DASHBOARDS.length}`);
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
