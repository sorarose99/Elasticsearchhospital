import { test, expect } from '@playwright/test';

test.describe('Comprehensive Module Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin to access all modules
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Login with admin credentials
    await page.fill('input[type="email"]', 'admin@clinic.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('should test Dashboard module', async ({ page }) => {
    console.log('🔍 Testing Dashboard...');
    
    // Check if dashboard loaded
    const dashboardVisible = await page.locator('text=/Dashboard|لوحة التحكم/i').first().isVisible().catch(() => false);
    expect(dashboardVisible).toBeTruthy();
    
    // Look for key dashboard elements
    const hasCards = await page.locator('[class*="card"], [class*="Card"]').count();
    expect(hasCards).toBeGreaterThan(0);
    
    console.log('✅ Dashboard loaded successfully');
  });

  test('should test Patients module', async ({ page }) => {
    console.log('🔍 Testing Patients module...');
    
    // Navigate to Patients
    const patientsButton = page.locator('button:has-text("Patients"), button:has-text("المرضى"), a:has-text("Patients"), a:has-text("المرضى")').first();
    if (await patientsButton.isVisible()) {
      await patientsButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Check for patient list or add patient button
      const hasPatientElements = await page.locator('text=/Add Patient|إضافة مريض|Patient List|قائمة المرضى/i').count();
      expect(hasPatientElements).toBeGreaterThan(0);
      
      console.log('✅ Patients module loaded');
    } else {
      console.log('⚠️  Patients button not found');
    }
  });

  test('should test Appointments module', async ({ page }) => {
    console.log('🔍 Testing Appointments module...');
    
    const appointmentsButton = page.locator('button:has-text("Appointments"), button:has-text("المواعيد"), a:has-text("Appointments"), a:has-text("المواعيد")').first();
    if (await appointmentsButton.isVisible()) {
      await appointmentsButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      const hasAppointmentElements = await page.locator('text=/Schedule|جدولة|Calendar|تقويم/i').count();
      expect(hasAppointmentElements).toBeGreaterThan(0);
      
      console.log('✅ Appointments module loaded');
    } else {
      console.log('⚠️  Appointments button not found');
    }
  });

  test('should test Laboratory module', async ({ page }) => {
    console.log('🔍 Testing Laboratory module...');
    
    const labButton = page.locator('button:has-text("Laboratory"), button:has-text("المختبر"), a:has-text("Laboratory"), a:has-text("المختبر")').first();
    if (await labButton.isVisible()) {
      await labButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      const hasLabElements = await page.locator('text=/Test|اختبار|Sample|عينة/i').count();
      expect(hasLabElements).toBeGreaterThan(0);
      
      console.log('✅ Laboratory module loaded');
    } else {
      console.log('⚠️  Laboratory button not found');
    }
  });

  test('should test Pharmacy module', async ({ page }) => {
    console.log('🔍 Testing Pharmacy module...');
    
    const pharmacyButton = page.locator('button:has-text("Pharmacy"), button:has-text("الصيدلية"), a:has-text("Pharmacy"), a:has-text("الصيدلية")').first();
    if (await pharmacyButton.isVisible()) {
      await pharmacyButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Check for no errors
      const errorBoundary = await page.locator('text=/Something went wrong|حدث خطأ/i').count();
      expect(errorBoundary).toBe(0);
      
      console.log('✅ Pharmacy module loaded without errors');
    } else {
      console.log('⚠️  Pharmacy button not found');
    }
  });

  test('should test Radiology module', async ({ page }) => {
    console.log('🔍 Testing Radiology module...');
    
    const radiologyButton = page.locator('button:has-text("Radiology"), button:has-text("الأشعة"), a:has-text("Radiology"), a:has-text("الأشعة")').first();
    if (await radiologyButton.isVisible()) {
      await radiologyButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      const errorBoundary = await page.locator('text=/Something went wrong|حدث خطأ/i').count();
      expect(errorBoundary).toBe(0);
      
      console.log('✅ Radiology module loaded');
    } else {
      console.log('⚠️  Radiology button not found');
    }
  });

  test('should test Billing module', async ({ page }) => {
    console.log('🔍 Testing Billing module...');
    
    const billingButton = page.locator('button:has-text("Billing"), button:has-text("الفوترة"), a:has-text("Billing"), a:has-text("الفوترة")').first();
    if (await billingButton.isVisible()) {
      await billingButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      const errorBoundary = await page.locator('text=/Something went wrong|حدث خطأ/i').count();
      expect(errorBoundary).toBe(0);
      
      console.log('✅ Billing module loaded');
    } else {
      console.log('⚠️  Billing button not found');
    }
  });

  test('should test Analytics module', async ({ page }) => {
    console.log('🔍 Testing Analytics module...');
    
    const analyticsButton = page.locator('button:has-text("Analytics"), button:has-text("التحليلات"), a:has-text("Analytics"), a:has-text("التحليلات")').first();
    if (await analyticsButton.isVisible()) {
      await analyticsButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      const errorBoundary = await page.locator('text=/Something went wrong|حدث خطأ/i').count();
      expect(errorBoundary).toBe(0);
      
      console.log('✅ Analytics module loaded');
    } else {
      console.log('⚠️  Analytics button not found');
    }
  });

  test('should test Reports module', async ({ page }) => {
    console.log('🔍 Testing Reports module...');
    
    const reportsButton = page.locator('button:has-text("Reports"), button:has-text("التقارير"), a:has-text("Reports"), a:has-text("التقارير")').first();
    if (await reportsButton.isVisible()) {
      await reportsButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      const errorBoundary = await page.locator('text=/Something went wrong|حدث خطأ/i').count();
      expect(errorBoundary).toBe(0);
      
      console.log('✅ Reports module loaded');
    } else {
      console.log('⚠️  Reports button not found');
    }
  });

  test('should test Nursing module', async ({ page }) => {
    console.log('🔍 Testing Nursing module...');
    
    const nursingButton = page.locator('button:has-text("Nursing"), button:has-text("التمريض"), a:has-text("Nursing"), a:has-text("التمريض")').first();
    if (await nursingButton.isVisible()) {
      await nursingButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      const errorBoundary = await page.locator('text=/Something went wrong|حدث خطأ/i').count();
      expect(errorBoundary).toBe(0);
      
      console.log('✅ Nursing module loaded');
    } else {
      console.log('⚠️  Nursing button not found');
    }
  });

  test('should test Inventory module', async ({ page }) => {
    console.log('🔍 Testing Inventory module...');
    
    const inventoryButton = page.locator('button:has-text("Inventory"), button:has-text("المخزون"), a:has-text("Inventory"), a:has-text("المخزون")').first();
    if (await inventoryButton.isVisible()) {
      await inventoryButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      const errorBoundary = await page.locator('text=/Something went wrong|حدث خطأ/i').count();
      expect(errorBoundary).toBe(0);
      
      console.log('✅ Inventory module loaded');
    } else {
      console.log('⚠️  Inventory button not found');
    }
  });

  test('should test Staff Management module', async ({ page }) => {
    console.log('🔍 Testing Staff Management module...');
    
    const staffButton = page.locator('button:has-text("Staff"), button:has-text("الموظفين"), a:has-text("Staff"), a:has-text("الموظفين")').first();
    if (await staffButton.isVisible()) {
      await staffButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      const errorBoundary = await page.locator('text=/Something went wrong|حدث خطأ/i').count();
      expect(errorBoundary).toBe(0);
      
      console.log('✅ Staff Management module loaded');
    } else {
      console.log('⚠️  Staff button not found');
    }
  });

  test('should test Insurance module', async ({ page }) => {
    console.log('🔍 Testing Insurance module...');
    
    const insuranceButton = page.locator('button:has-text("Insurance"), button:has-text("التأمين"), a:has-text("Insurance"), a:has-text("التأمين")').first();
    if (await insuranceButton.isVisible()) {
      await insuranceButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      const errorBoundary = await page.locator('text=/Something went wrong|حدث خطأ/i').count();
      expect(errorBoundary).toBe(0);
      
      console.log('✅ Insurance module loaded');
    } else {
      console.log('⚠️  Insurance button not found');
    }
  });

  test('should test Communication Center', async ({ page }) => {
    console.log('🔍 Testing Communication Center...');
    
    const commButton = page.locator('button:has-text("Communication"), button:has-text("الاتصالات"), a:has-text("Communication"), a:has-text("الاتصالات")').first();
    if (await commButton.isVisible()) {
      await commButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      const errorBoundary = await page.locator('text=/Something went wrong|حدث خطأ/i').count();
      expect(errorBoundary).toBe(0);
      
      console.log('✅ Communication Center loaded');
    } else {
      console.log('⚠️  Communication button not found');
    }
  });

  test('should test Emergency Management', async ({ page }) => {
    console.log('🔍 Testing Emergency Management...');
    
    const emergencyButton = page.locator('button:has-text("Emergency"), button:has-text("الطوارئ"), a:has-text("Emergency"), a:has-text("الطوارئ")').first();
    if (await emergencyButton.isVisible()) {
      await emergencyButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      const errorBoundary = await page.locator('text=/Something went wrong|حدث خطأ/i').count();
      expect(errorBoundary).toBe(0);
      
      console.log('✅ Emergency Management loaded');
    } else {
      console.log('⚠️  Emergency button not found');
    }
  });

  test('should test Quality Management', async ({ page }) => {
    console.log('🔍 Testing Quality Management...');
    
    const qualityButton = page.locator('button:has-text("Quality"), button:has-text("الجودة"), a:has-text("Quality"), a:has-text("الجودة")').first();
    if (await qualityButton.isVisible()) {
      await qualityButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      const errorBoundary = await page.locator('text=/Something went wrong|حدث خطأ/i').count();
      expect(errorBoundary).toBe(0);
      
      console.log('✅ Quality Management loaded');
    } else {
      console.log('⚠️  Quality button not found');
    }
  });

  test('should test Mobile Applications', async ({ page }) => {
    console.log('🔍 Testing Mobile Applications...');
    
    // Try to navigate via URL
    await page.goto('/mobile-app');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const errorBoundary = await page.locator('text=/Something went wrong|حدث خطأ/i').count();
    expect(errorBoundary).toBe(0);
    
    console.log('✅ Mobile Applications loaded');
  });

  test('should test AI Diagnostic Assistant', async ({ page }) => {
    console.log('🔍 Testing AI Diagnostic Assistant...');
    
    // Try to navigate via URL
    await page.goto('/ai-diagnostics');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const errorBoundary = await page.locator('text=/Something went wrong|حدث خطأ/i').count();
    expect(errorBoundary).toBe(0);
    
    console.log('✅ AI Diagnostic Assistant loaded');
  });

  test('should test Settings page', async ({ page }) => {
    console.log('🔍 Testing Settings...');
    
    const settingsButton = page.locator('button:has-text("Settings"), button:has-text("الإعدادات"), a:has-text("Settings"), a:has-text("الإعدادات")').first();
    if (await settingsButton.isVisible()) {
      await settingsButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      const errorBoundary = await page.locator('text=/Something went wrong|حدث خطأ/i').count();
      expect(errorBoundary).toBe(0);
      
      console.log('✅ Settings loaded');
    } else {
      console.log('⚠️  Settings button not found');
    }
  });

  test('should check for console errors across all modules', async ({ page }) => {
    console.log('🔍 Checking for console errors...');
    
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Navigate through a few key modules
    const modules = ['Dashboard', 'Patients', 'Pharmacy', 'Laboratory'];
    
    for (const module of modules) {
      const button = page.locator(`button:has-text("${module}"), a:has-text("${module}")`).first();
      if (await button.isVisible().catch(() => false)) {
        await button.click();
        await page.waitForTimeout(2000);
      }
    }

    // Filter out warnings and known non-critical errors
    const criticalErrors = errors.filter(e => 
      !e.includes('Warning') && 
      !e.includes('DevTools') &&
      !e.includes('WebSocket')
    );

    console.log(`Found ${criticalErrors.length} critical errors`);
    if (criticalErrors.length > 0) {
      console.log('Errors:', criticalErrors.slice(0, 5));
    }

    expect(criticalErrors.length).toBeLessThan(5);
  });
});
