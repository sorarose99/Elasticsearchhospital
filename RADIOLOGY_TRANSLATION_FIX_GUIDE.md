# Radiology Component Translation Fix Guide

## Status
✅ Translation keys added to LanguageServiceExtended.tsx
✅ Component updated to use useLanguage hook
⏳ Remaining hardcoded text needs replacement

## Translation Keys Added (60+ keys)

### English & Arabic translations added for:
- `radiology.title` - "Radiology & Medical Imaging" / "الأشعة والتصوير الطبي"
- `radiology.newStudy` - "New Study" / "دراسة جديدة"
- `radiology.dashboard` - "Dashboard" / "لوحة التحكم"
- `radiology.studies` - "Studies" / "الدراسات"
- `radiology.modalityBreakdown` - "Modality Breakdown" / "توزيع أنواع الفحص"
- `radiology.modalityDistribution` - "Study Distribution by Modality Type" / "توزيع الدراسات حسب نوع الفحص"
- `radiology.recentStudies` - "Recent Studies" / "الدراسات الحديثة"
- `radiology.latestAddedStudies` - "Latest Added Studies" / "آخر الدراسات المضافة"
- `radiology.fromYesterday` - "from yesterday" / "من الأمس"
- And 50+ more keys...

## Changes Made to RadiologyManagement.tsx

### 1. Updated Imports
```typescript
// Added:
import { useLanguage } from '../../services/LanguageService';

// Removed language prop from interface:
interface RadiologyManagementProps {
  userRole: string;  // removed: language: 'en' | 'ar';
}
```

### 2. Removed Local Translations Object
- Deleted the entire `translations` object (200+ lines)
- Now uses centralized translations from LanguageServiceExtended.tsx

### 3. Updated Component to Use useLanguage Hook
```typescript
export default function RadiologyManagement({ userRole }: RadiologyManagementProps) {
  const { t, language } = useLanguage();  // Added this line
  // ... rest of component
}
```

### 4. Updated Badge Functions
- `getStatusBadge()` now uses `t('radiology.scheduled')` instead of `t.scheduled`
- `getPriorityBadge()` now uses `t('radiology.routine')` instead of hardcoded 'عادي'

## Remaining Hardcoded Text to Replace

### In Main Component (lines ~395-480):
```typescript
// Line ~396: Replace
دراسة جديدة
// With:
{t('radiology.newStudy')}

// Line ~448: Replace
توزيع الدراسات حسب نوع الفحص
// With:
{t('radiology.modalityDistribution')}

// Line ~475: Replace
الدراسات الحديثة
// With:
{t('radiology.recentStudies')}

// Line ~477: Replace
آخر الدراسات المضافة
// With:
{t('radiology.latestAddedStudies')}

// Line ~413: Replace
من الأمس
// With:
{t('radiology.fromYesterday')}
```

### In DICOM Viewer Section (lines ~520-540):
```typescript
// Line ~523: Replace
عارض DICOM المتطور
// With:
{t('radiology.advancedViewer')}

// Line ~525: Replace
اختر دراسة من قائمة الدراسات أو قائمة العمل لعرضها في العارض المتقدم
// With:
{t('radiology.selectStudyToView')}

// Line ~530: Replace
اذهب إلى الدراسات
// With:
{t('radiology.goToStudies')}

// Line ~535: Replace
اذهب إلى قائمة العمل
// With:
{t('radiology.goToWorklist')}
```

### In DICOM Viewer Dialog (lines ~545-560):
```typescript
// Line ~549: Replace
عارض DICOM
// With:
{t('radiology.viewer')}
```

### In DICOMViewer Component (lines ~600-900):
```typescript
// Line ~680: Replace
لا توجد دراسة محددة
// With:
{t('radiology.noStudySelected')}

// Line ~681: Replace
اختر دراسة من قائمة الدراسات لعرضها
// With:
{t('radiology.selectStudyFromList')}

// Line ~850: Replace
التحكم في الصورة
// With:
{t('radiology.imageControl')}

// Line ~920: Replace
معلومات الدراسة
// With:
{t('radiology.studyInfo')}

// Line ~923: Replace
المريض:
// With:
{t('radiology.patient')}:

// Line ~927: Replace
التاريخ:
// With:
{t('radiology.date')}:

// Line ~931: Replace
النوع:
// With:
{t('radiology.type')}:

// Line ~935: Replace
الجزء:
// With:
{t('radiology.part')}:
```

## Quick Fix Commands

To replace all hardcoded text at once, use these string replacements in the file:

1. `دراسة جديدة` → `{t('radiology.newStudy')}`
2. `توزيع الدراسات حسب نوع الفحص` → `{t('radiology.modalityDistribution')}`
3. `الدراسات الحديثة` → `{t('radiology.recentStudies')}`
4. `آخر الدراسات المضافة` → `{t('radiology.latestAddedStudies')}`
5. `من الأمس` → `{t('radiology.fromYesterday')}`
6. `عارض DICOM المتطور` → `{t('radiology.advancedViewer')}`
7. `اختر دراسة من قائمة الدراسات أو قائمة العمل لعرضها في العارض المتقدم` → `{t('radiology.selectStudyToView')}`
8. `اذهب إلى الدراسات` → `{t('radiology.goToStudies')}`
9. `اذهب إلى قائمة العمل` → `{t('radiology.goToWorklist')}`
10. `لا توجد دراسة محددة` → `{t('radiology.noStudySelected')}`
11. `اختر دراسة من قائمة الدراسات لعرضها` → `{t('radiology.selectStudyFromList')}`
12. `التحكم في الصورة` → `{t('radiology.imageControl')}`
13. `معلومات الدراسة` → `{t('radiology.studyInfo')}`
14. `المريض:` → `{t('radiology.patient')}:`
15. `التاريخ:` → `{t('radiology.date')}:`
16. `النوع:` → `{t('radiology.type')}:`
17. `الجزء:` → `{t('radiology.part')}:`

## Files Modified
- ✅ `src/services/LanguageServiceExtended.tsx` - Added 60+ radiology translation keys
- ✅ `src/components/radiology/RadiologyManagement.tsx` - Partially updated (imports, hooks, badge functions)
- ⏳ `src/components/radiology/RadiologyManagement.tsx` - Needs JSX text replacements

## Next Steps
1. Complete the string replacements listed above in RadiologyManagement.tsx
2. Check other radiology components (StudiesManagement, WorklistManagement, ReportsManagement)
3. Test the radiology section with language toggle
4. Verify all text changes between English and Arabic

## Testing
After completing the fixes:
1. Restart dev server
2. Hard refresh browser (Cmd+Shift+R)
3. Navigate to Radiology section
4. Toggle language and verify all text changes
5. Check all tabs: Dashboard, Studies, Worklist, Reports, Viewer
