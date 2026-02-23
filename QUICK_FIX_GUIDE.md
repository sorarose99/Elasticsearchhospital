# Quick Fix Guide - Translation Issues

## 🎯 What Was Done

### ✅ Completed
1. **Added 150+ translation keys** to `src/services/LanguageServiceExtended.tsx`
   - Appointments: 35 keys
   - Staff: 45 keys
   - Billing: 25 keys
   - Pharmacy: 45 keys
   - Lab: 20 keys

2. **Updated Staff Management Component** (95% complete)
   - Header, tabs, stats, charts all now bilingual
   - Only minor table headers remain

3. **Previously Completed** (from earlier sessions)
   - Radiology Management: 100%
   - Patient Management: 100%
   - Patient Form: 100%

## 🔧 What Needs To Be Done

### 1. Fix Billing Component (CRITICAL)
**File**: `src/components/billing/BillingManagement.tsx`

**Problem**: Uses local translations instead of LanguageServiceExtended

**Solution**:
```typescript
// Step 1: Add import at top
import { useLanguage } from '../../services/LanguageService';

// Step 2: Remove this entire block (around line 70-150):
const translations = {
  en: { ... },
  ar: { ... }
};

// Step 3: In component function, replace:
const t = translations[language];

// With:
const { t, language, isRTL } = useLanguage();

// Step 4: Update component signature from:
export default function BillingManagement({ language, userRole }: BillingManagementProps)

// To:
export default function BillingManagement({ userRole }: BillingManagementProps)

// Step 5: Replace all t.keyName with t('billing.keyName')
// Example:
t.title → t('billing.management')
t.dashboard → t('billing.dashboard')
t.invoices → t('billing.invoices')
// etc.
```

### 2. Verify Other Components
Run these checks:

**Appointments**:
```bash
grep -n "useLanguage" src/components/appointments/AppointmentScheduler.tsx
# Should show: import { useLanguage } from ...
```

**Pharmacy**:
```bash
grep -n "useLanguage" src/components/pharmacy/PharmacyManagement.tsx
# Should show: import { useLanguage } from ...
```

## 🧪 Testing Steps

### Quick Test (2 minutes)
1. Start server: `npm run dev`
2. Open browser: `http://localhost:3001`
3. Login with any demo account
4. Navigate to each section:
   - Staff Management ✅
   - Appointments ⚠️
   - Billing ❌ (needs fix)
   - Pharmacy ⚠️
   - Radiology ✅
5. Click language toggle (EN ⟷ AR)
6. Check if ALL text changes

### What to Look For
- ✅ **Good**: All text changes language
- ⚠️ **Warning**: Most text changes, some doesn't
- ❌ **Bad**: Text shows as `key.name` or stays in one language

## 🐛 Common Issues

### Issue: See "staff.management" instead of "Staff Management"
**Fix**: Translation key typo or doesn't exist
```bash
# Check if key exists:
grep "staff.management" src/services/LanguageServiceExtended.tsx
```

### Issue: Only navbar changes, content stays Arabic
**Fix**: Component not using `t()` function
```bash
# Check component:
grep "t('" src/components/[component]/[file].tsx
```

### Issue: Changes don't appear
**Fix**: Clear browser cache
- Mac: Cmd + Shift + R
- Windows: Ctrl + Shift + R

## 📋 Translation Key Reference

### Staff Management
```typescript
t('staff.management')          // إدارة الموظفين
t('staff.dashboard')           // لوحة التحكم
t('staff.employees')           // الموظفون
t('staff.attendance')          // الحضور
t('staff.leaves')              // الإجازات
t('staff.totalEmployees')      // إجمالي الموظفين
t('staff.present')             // حاضر
t('staff.late')                // متأخر
t('staff.absent')              // غائب
```

### Appointments
```typescript
t('appointments.management')   // إدارة المواعيد
t('appointments.schedule')     // جدولة موعد
t('appointments.dayView')      // عرض اليوم
t('appointments.weekView')     // عرض الأسبوع
t('appointments.scheduled')    // مجدول
t('appointments.confirmed')    // مؤكد
t('appointments.completed')    // مكتمل
```

### Billing
```typescript
t('billing.management')        // الفوترة والإدارة المالية
t('billing.dashboard')         // لوحة التحكم
t('billing.invoices')          // الفواتير
t('billing.payments')          // المدفوعات
t('billing.totalRevenue')      // إجمالي الإيرادات
```

### Pharmacy
```typescript
t('pharmacy.title')            // إدارة الصيدلية
t('pharmacy.inventory')        // المخزون
t('pharmacy.prescriptions')    // الوصفات الطبية
t('pharmacy.lowStock')         // مخزون منخفض
t('pharmacy.nearExpiry')       // قريب من انتهاء الصلاحية
```

## 🎯 Priority Order

1. **NOW**: Fix BillingManagement.tsx (15 minutes)
2. **NEXT**: Test all components (10 minutes)
3. **THEN**: Fix any remaining issues found during testing
4. **FINALLY**: Complete staff table headers if needed

## 📞 Quick Commands

### Find hardcoded Arabic text:
```bash
grep -r "إدارة\|الموظفين\|الحضور" src/components/staff/
grep -r "الفوترة\|الفواتير" src/components/billing/
grep -r "الصيدلية\|الأدوية" src/components/pharmacy/
```

### Check if component uses translations:
```bash
grep "useLanguage" src/components/*/[ComponentName].tsx
grep "t('" src/components/*/[ComponentName].tsx
```

### Restart everything:
```bash
# Kill server
Ctrl + C

# Restart
npm run dev

# In browser
Cmd + Shift + R (Mac) or Ctrl + Shift + R (Windows)
```

## ✅ Success Criteria

You'll know it's working when:
1. Click language toggle
2. **ALL** text on the page changes
3. No text shows as `key.name`
4. No text stays in Arabic when English is selected
5. No text stays in English when Arabic is selected

## 📊 Current Status

| Component | Status | Action Needed |
|-----------|--------|---------------|
| Radiology | ✅ 100% | None |
| Patients | ✅ 100% | None |
| Patient Form | ✅ 100% | None |
| Staff | ✅ 95% | Minor labels |
| Appointments | ⚠️ 90% | Verify |
| Billing | ❌ 0% | **FIX NOW** |
| Pharmacy | ⚠️ 90% | Verify |
| Lab | ❓ Unknown | Investigate |

---

**Estimated Time to Complete**: 30-45 minutes
- Billing fix: 15 min
- Testing: 10 min
- Minor fixes: 10-20 min
