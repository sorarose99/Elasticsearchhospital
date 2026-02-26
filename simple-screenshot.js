/**
 * Simple Screenshot Tool
 * Takes screenshots of the application without complex interactions
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const CONFIG = {
  baseUrl: 'http://localhost:3000',
  outputDir: './demo-screenshots',
  viewport: { width: 1920, height: 1080 },
};

// Create output directory
if (!fs.existsSync(CONFIG.outputDir)) {
  fs.mkdirSync(CONFIG.outputDir, { recursive: true });
}

async function takeScreenshots() {
  console.log('📸 Starting Simple Screenshot Tool...\n');
  
  const browser = await chromium.launch({
    headless: false,
    timeout: 60000,
  });

  const context = await browser.newContext({
    viewport: CONFIG.viewport,
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();
  page.setDefaultTimeout(60000);

  try {
    // Navigate to home page
    console.log('📍 Navigating to home page...');
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);
    
    // Take screenshot of whatever is on the page
    const filename1 = path.join(CONFIG.outputDir, `01-homepage.png`);
    await page.screenshot({ path: filename1, fullPage: true });
    console.log(`✅ Screenshot saved: ${filename1}`);
    
    // Wait a bit more
    await page.waitForTimeout(2000);
    
    // Take another screenshot
    const filename2 = path.join(CONFIG.outputDir, `02-page-loaded.png`);
    await page.screenshot({ path: filename2, fullPage: false });
    console.log(`✅ Screenshot saved: ${filename2}`);
    
    console.log('\n✅ Screenshots completed!');
    console.log(`📁 Check: ${CONFIG.outputDir}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

takeScreenshots().catch(console.error);
