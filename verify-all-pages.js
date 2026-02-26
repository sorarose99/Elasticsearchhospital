/**
 * Verify All Pages Are Accessible
 * 
 * This script checks that all pages load without errors
 */

console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║                                                           ║');
console.log('║  🔍 VERIFYING ALL PAGES                                   ║');
console.log('║                                                           ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

const baseUrl = 'http://localhost:3000';

const pagesToCheck = [
  { name: 'Landing Page', url: '/' },
  { name: 'Login Page', url: '/login' },
  { name: 'Register Page', url: '/register' },
  { name: 'Pricing Page', url: '/pricing' },
  { name: 'Privacy Policy', url: '/privacy' },
  { name: 'Terms of Service', url: '/terms' },
  { name: 'Agent Dashboard', url: '/agents' },
  { name: 'Mobile App', url: '/mobile-app' },
  { name: 'AI Diagnostics', url: '/ai-diagnostics' },
  { name: 'Enterprise Settings', url: '/enterprise' }
];

console.log('📋 Pages to verify:\n');

let allPassed = true;

for (const page of pagesToCheck) {
  try {
    const response = await fetch(`${baseUrl}${page.url}`);
    
    if (response.ok) {
      console.log(`✅ ${page.name.padEnd(25)} - ${page.url}`);
    } else {
      console.log(`❌ ${page.name.padEnd(25)} - ${page.url} (Status: ${response.status})`);
      allPassed = false;
    }
  } catch (error) {
    console.log(`❌ ${page.name.padEnd(25)} - ${page.url} (Error: ${error.message})`);
    allPassed = false;
  }
}

console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║                                                           ║');
console.log(`║  ${allPassed ? '✅ ALL PAGES ACCESSIBLE' : '❌ SOME PAGES FAILED'}                              ║`);
console.log('║                                                           ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

if (allPassed) {
  console.log('🎉 All pages are accessible and ready for screenshots!\n');
  console.log('📸 Follow SCREEN_RECORDING_GUIDE.md to capture everything\n');
  console.log('Key URLs:');
  console.log('   • Landing: http://localhost:3000');
  console.log('   • Agents:  http://localhost:3000/agents  ⭐ MOST IMPORTANT');
  console.log('   • Login:   http://localhost:3000/login\n');
} else {
  console.log('⚠️  Some pages failed. Make sure dev server is running:\n');
  console.log('   npm run dev\n');
}

console.log('Next Steps:');
console.log('   1. Open browser to http://localhost:3000/agents');
console.log('   2. Follow SCREEN_RECORDING_GUIDE.md');
console.log('   3. Capture all 3 agents in action');
console.log('   4. Record 3-minute demo video\n');
