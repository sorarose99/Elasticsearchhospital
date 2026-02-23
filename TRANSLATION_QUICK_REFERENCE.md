# Translation Quick Reference Guide

## Quick Start

### Using Translations in Components
```typescript
import { useLanguage } from '../../services/LanguageService';

const MyComponent = () => {
  const { t, language, isRTL } = useLanguage();
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <h1>{t('module.title')}</h1>
    </div>
  );
};
```

## Available Translation Modules

### Core Modules
- `common.*` - Common UI elements (80+ keys)
- `auth.*` - Authentication (15+ keys)
- `roles.*` - User roles (7+ keys)

### Feature Modules
- `appointments.*` - Appointments (80+ keys)
- `patients.*` - Patient management (35+ keys)
- `lab.*` - Laboratory (30+ keys)
- `emergency.*` - Emergency (40+ keys)
- `pharmacy.*` - Pharmacy (25+ keys)
- `radiology.*` - Radiology (25+ keys)
- `quality.*` - Quality management (20+ keys)
- `billing.*` - Billing (25+ keys)
- `staff.*` - Staff management (25+ keys)
- `reports.*` - Reports (20+ keys)
- `dashboard.*` - Dashboard (10+ keys)
- `inventory.*` - Inventory (80+ keys)
- `nursing.*` - Nursing (150+ keys)
- `research.*` - Research (100+ keys)
- `communication.*` - Communication (100+ keys)

## Common Translation Keys

### Actions
```typescript
t('common.save')      // Save / حفظ
t('common.cancel')    // Cancel / إلغاء
t('common.delete')    // Delete / حذف
t('common.edit')      // Edit / تعديل
t('common.add')       // Add / إضافة
t('common.submit')    // Submit / إرسال
t('common.update')    // Update / تحديث
t('common.create')    // Create / إنشاء
t('common.remove')    // Remove / إزالة
t('common.view')      // View / عرض
```

### Status
```typescript
t('common.active')    // Active / نشط
t('common.inactive')  // Inactive / غير نشط
t('common.pending')   // Pending / قيد الانتظار
t('common.completed') // Completed / مكتمل
t('common.cancelled') // Cancelled / ملغي
```

### Navigation
```typescript
t('common.back')      // Back / رجوع
t('common.next')      // Next / التالي
t('common.previous')  // Previous / السابق
t('common.home')      // Home / الرئيسية
```

## Module-Specific Examples

### Patients
```typescript
t('patients.title')           // Patient Management / إدارة المرضى
t('patients.addNew')          // Add New Patient / إضافة مريض جديد
t('patients.searchPatients')  // Search patients... / البحث عن المرضى...
t('patients.male')            // Male / ذكر
t('patients.female')          // Female / أنثى
```

### Emergency
```typescript
t('emergency.title')      // Emergency Management / إدارة الطوارئ
t('emergency.critical')   // Critical / حرج
t('emergency.urgent')     // Urgent / عاجل
t('emergency.triage')     // Triage / الفرز
t('emergency.vitals')     // Vital Signs / العلامات الحيوية
```

### Pharmacy
```typescript
t('pharmacy.title')           // Pharmacy Management / إدارة الصيدلية
t('pharmacy.prescriptions')   // Prescriptions / الوصفات الطبية
t('pharmacy.dispense')        // Dispense / صرف
t('pharmacy.medicationName')  // Medication Name / اسم الدواء
```

### Laboratory
```typescript
t('lab.title')        // Laboratory Management / إدارة المختبر
t('lab.orderTest')    // Order Test / طلب تحليل
t('lab.pending')      // Pending / قيد الانتظار
t('lab.completed')    // Completed / مكتمل
t('lab.critical')     // Critical / حرج
```

## Language Switching

### Get Current Language
```typescript
const { language } = useLanguage();
// Returns: 'en' or 'ar'
```

### Switch Language
```typescript
const { setLanguage } = useLanguage();
setLanguage('ar'); // Switch to Arabic
setLanguage('en'); // Switch to English
```

### Check RTL
```typescript
const { isRTL } = useLanguage();
// Returns: true for Arabic, false for English
```

## Translation with Parameters

### Define Translation
```typescript
// In translation file
'message.welcome': 'Welcome, {name}!'
'message.welcomeAr': 'مرحباً، {name}!'
```

### Use with Parameters
```typescript
const message = t('message.welcome', { name: 'Ahmed' });
// Result: "Welcome, Ahmed!"
```

## Adding New Translations

### Step 1: Choose Location
- For module-specific: `src/components/[module]/translations.ts`
- For general: `src/services/LanguageServiceExtended.ts`

### Step 2: Add Translation Keys
```typescript
const myModuleTranslations = {
  en: {
    'myModule.title': 'My Module',
    'myModule.description': 'Module description',
  },
  ar: {
    'myModule.title': 'وحدتي',
    'myModule.description': 'وصف الوحدة',
  }
};
```

### Step 3: Export and Merge
```typescript
export const extendedTranslations = {
  en: {
    ...existingTranslations.en,
    ...myModuleTranslations.en,
  },
  ar: {
    ...existingTranslations.ar,
    ...myModuleTranslations.ar,
  }
};
```

## Best Practices

### DO ✅
- Always provide both English and Arabic translations
- Use consistent key naming: `module.category.item`
- Keep translations concise and clear
- Use professional medical terminology
- Test in both languages
- Maintain RTL layout for Arabic

### DON'T ❌
- Don't hardcode text in components
- Don't use inconsistent key names
- Don't forget to add Arabic translation
- Don't use informal language
- Don't skip RTL testing

## Common Patterns

### Card Title
```typescript
<CardTitle>{t('module.title')}</CardTitle>
```

### Button
```typescript
<Button>{t('common.save')}</Button>
```

### Input Placeholder
```typescript
<Input placeholder={t('patients.searchPatients')} />
```

### Select Options
```typescript
<SelectItem value="male">{t('patients.male')}</SelectItem>
<SelectItem value="female">{t('patients.female')}</SelectItem>
```

### Conditional Text
```typescript
{status === 'active' ? t('common.active') : t('common.inactive')}
```

## Debugging

### Check Current Language
```typescript
console.log('Current language:', language);
```

### Check Translation Key
```typescript
console.log('Translation:', t('module.key'));
```

### Verify RTL
```typescript
console.log('Is RTL:', isRTL);
```

## File Locations

### Core Files
- `src/services/LanguageService.tsx` - Main service
- `src/services/LanguageServiceExtended.ts` - Central repository

### Module Files
- `src/components/appointments/translations.ts`
- `src/components/communication/translations.ts`
- `src/components/inventory/translations.ts`
- `src/components/nursing/translations.ts`
- `src/components/research/translations.ts`

## Support

### Documentation
- Full audit: `TRANSLATION_AUDIT_REPORT.md`
- Summary: `TRANSLATION_COMPLETION_SUMMARY.md`
- This guide: `TRANSLATION_QUICK_REFERENCE.md`

### Testing
1. Switch language in settings
2. Verify all text is translated
3. Check RTL layout in Arabic
4. Test form validation messages
5. Verify error messages

---

**Quick Reference Version**: 1.0  
**Last Updated**: February 18, 2026  
**Total Keys**: 700+  
**Languages**: English, Arabic
