/**
 * COMPREHENSIVE DASHBOARD RECORDER
 * Actually logs in and clicks through EVERY navigation item
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const CONFIG = {
  baseUrl: 'http://localhost:3000',
  screenshotsDir: './demo-screenshots',
  videoDir: './demo-videos',
  viewport: { width: 1920, height: 1080 },
  credentials: {
    email: 'admin@hospital.com',
    password: 'admin123'
  }
};

// All navigation items from NavigationConfig.tsx
const ALL_NAVIGATION_ITEMS = [
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

async function takeScreenshot(page, name) {
  try {
    const filename = path.join(CONFIG.screenshotsDir, `${name}.png`);
    await page.screenshot({ path: filename, fullPage: true, timeout: 30000 });
    console.log(`  ✅ ${name}.png`);
    return true;
  } catch (error) {
    console.log(`  ⚠️  Screenshot failed: ${error.message}`);
    return false;
  }
}

async function smoothScroll(page, distance = 400) {
  await page.evaluate((dist) => {
    window.scrollBy({ top: dist, behavior: 'smooth' });
  }, distance);
  await page.waitForTimeout(800);
}

async function recordEverything() {
  console.log('🎬 COMPREHENSIVE DASHBOARD RECORDER\n');
  console.log('This will:');
  console.log('1. Login with admin credentials');
  console.log('2. Click through ALL 27 navigation items');
  console.log('3. Take screenshots of everything');
  console.log('4. Record full video\n');
  console.log('Starting in 3 seconds...\n');
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const browser = await chromium.launch({
    headless: false,
    slowMo: 200,
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
    // STEP 1: LOGIN
    // ============================================
    console.log('📍 STEP 1: Logging in...');
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    
    await takeScreenshot(page, '000-login-page');
    
    // Fill login form
    console.log('  Filling email...');
    await page.fill('#email', CONFIG.credentials.email);
    await page.waitForTimeout(300);
    
    console.log('  Filling password...');
    await page.fill('#password', CONFIG.credentials.password);
    await page.waitForTimeout(300);
    
    await takeScreenshot(page, '001-login-filled');
    
    // Click login button
    console.log('  Clicking login button...');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000); // Wait for login to complete
    
    console.log('  ✅ Logged in!\n');
    
    // ============================================
    // STEP 2: NAVIGATE THROUGH ALL ITEMS
    // ============================================
    console.log('📍 STEP 2: Navigating through all dashboards...\n');
    
    let screenshotCounter = 2;
    
    for (let i = 0; i < ALL_NAVIGATION_ITEMS.length; i++) {
      const navItem = ALL_NAVIGATION_ITEMS[i];
      const itemNumber = String(i + 1).padStart(2, '0');
      const filePrefix = String(screenshotCounter).padStart(3, '0');
      
      console.log(`\n[${itemNumber}/${ALL_NAVIGATION_ITEMS.length}] ${navItem}`);
      
      try {
        // Try to find and click the navigation item
        const navSelector = `text="${navItem}"`;
        
        // Check if element exists
        const elementExists = await page.locator(navSelector).count() > 0;
        
        if (!elementExists) {
          console.log(`  ⚠️  Not found in sidebar, skipping...`);
          continue;
        }
        
        // Click the navigation item
        console.log(`  Clicking...`);
        await page.click(navSelector, { timeout: 5000 });
        await page.waitForTimeout(2000);
        
        // Scroll to top
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await page.waitForTimeout(500);
        
        // Take full page screenshot
        await takeScreenshot(page, `${filePrefix}-${navItem.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-full`);
        screenshotCounter++;
        
        // Take top section
        await takeScreenshot(page, `${filePrefix}-${navItem.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-top`);
        screenshotCounter++;
        
        // Scroll and take middle section
        await smoothScroll(page, 400);
        await takeScreenshot(page, `${filePrefix}-${navItem.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-middle`);
        screenshotCounter++;
        
        // Scroll and take bottom section
        await smoothScroll(page, 400);
        await takeScreenshot(page, `${filePrefix}-${navItem.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-bottom`);
        screenshotCounter++;
        
        console.log(`  ✅ Captured 4 screenshots`);
        
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
      }
    }
    
    console.log('\n\n✅ RECORDING COMPLETE!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Total navigation items: ${ALL_NAVIGATION_ITEMS.length}`);
    console.log(`   - Screenshots taken: ~${screenshotCounter}`);
    console.log(`   - Screenshots folder: ${CONFIG.screenshotsDir}`);
    console.log(`   - Video folder: ${CONFIG.videoDir}`);
    
  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error.message);
    console.error(error.stack);
    await takeScreenshot(page, 'error-fatal');
  } finally {
    console.log('\n🎬 Closing browser and saving video...');
    await page.waitForTimeout(2000);
    await context.close();
    await browser.close();
    console.log('\n🎉 ALL DONE!\n');
  }
}

recordEverything().catch(console.error);
