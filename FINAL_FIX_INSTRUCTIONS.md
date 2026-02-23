# Final Fix Instructions - Billing Component

## ✅ COMPLETED
1. Added `import { useLanguage } from '../../services/LanguageService';`
2. Removed `language` from component props
3. Added `const { t, language, isRTL } = useLanguage();` in component
4. Removed entire `translations` object (200+ lines)
5. Removed `const t = translations[language];` line

## 🔧 REMAINING: Replace All t.keyName with t('billing.keyName')

### Pattern to Replace
```typescript
// OLD:
t.title
t.dashboard
t.paid

// NEW:
t('billing.management')
t('billing.dashboard')
t('billing.paid')
```

### Complete Replacement List

#### Main Labels
- `t.title` → `t('billing.management')`
- `t.dashboard` → `t('billing.dashboard')`
- `t.invoices` → `t('billing.invoices')`
- `t.payments` → `t('billing.payments')`
- `t.insurance` → `t('billing.insurance')`
- `t.reports` → `t('billing.reports')`

#### Dashboard Stats
- `t.totalRevenue` → `t('billing.totalRevenue')`
- `t.pendingPayments` → `t('billing.pendingPayments')`
- `t.completedPayments` → `t('billing.completedPayments')`
- `t.insuranceClaims` → `t('billing.insuranceClaims')`
- `t.recentTransactions` → `t('billing.recentTransactions')`
- `t.latestTransactions` → `t('billing.latestTransactions')`

#### Invoice Management
- `t.createInvoice` → `t('billing.createInvoice')`
- `t.recordPayment` → `t('billing.recordPayment')`
- `t.invoiceNumber` → `t('common.invoiceNumber')` (if exists) or `t('billing.invoiceNumber')`
- `t.patientName` → `t('common.patientName')` or `t('billing.patientName')`
- `t.invoiceDate` → `t('billing.invoiceDate')`
- `t.dueDate` → `t('billing.dueDate')`
- `t.amount` → `t('billing.amount')`
- `t.status` → `t('common.status')`
- `t.actions` → `t('common.actions')`

#### Status Labels
- `t.paid` → `t('billing.paid')` or `t('common.paid')`
- `t.pending` → `t('billing.pending')` or `t('common.pending')`
- `t.overdue` → `t('billing.overdue')`
- `t.cancelled` → `t('common.cancelled')`
- `t.completed` → `t('common.completed')`
- `t.approved` → `t('billing.approved')`
- `t.rejected` → `t('billing.rejected')`
- `t.submitted` → `t('billing.submitted')`
- `t.underReview` → `t('billing.underReview')`

#### Common Actions
- `t.search` → `t('common.search')`
- `t.filter` → `t('common.filter')`
- `t.export` → `t('common.export')`
- `t.save` → `t('common.save')`
- `t.cancel` → `t('common.cancel')`
- `t.delete` → `t('common.delete')`
- `t.loading` → `t('common.loading')`

### Quick Find & Replace Commands

Use your editor's find & replace feature:

1. Find: `t\.title` → Replace: `t('billing.management')`
2. Find: `t\.dashboard` → Replace: `t('billing.dashboard')`
3. Find: `t\.invoices` → Replace: `t('billing.invoices')`
4. Find: `t\.payments` → Replace: `t('billing.payments')`
5. Find: `t\.insurance` → Replace: `t('billing.insurance')`
6. Find: `t\.reports` → Replace: `t('billing.reports')`
7. Find: `t\.totalRevenue` → Replace: `t('billing.totalRevenue')`
8. Find: `t\.pendingPayments` → Replace: `t('billing.pendingPayments')`
9. Find: `t\.completedPayments` → Replace: `t('billing.completedPayments')`
10. Find: `t\.insuranceClaims` → Replace: `t('billing.insuranceClaims')`
11. Find: `t\.recentTransactions` → Replace: `t('billing.recentTransactions')`
12. Find: `t\.createInvoice` → Replace: `t('billing.createInvoice')`
13. Find: `t\.recordPayment` → Replace: `t('billing.recordPayment')`
14. Find: `t\.paid` → Replace: `t('common.paid')` or add to billing keys
15. Find: `t\.pending` → Replace: `t('common.pending')` or add to billing keys
16. Find: `t\.search` → Replace: `t('common.search')`
17. Find: `t\.filter` → Replace: `t('common.filter')`
18. Find: `t\.export` → Replace: `t('common.export')`
19. Find: `t\.save` → Replace: `t('common.save')`
20. Find: `t\.cancel` → Replace: `t('common.cancel')`

### Alternative: Use Regex Find & Replace

**Pattern**: `t\.(\w+)`
**Replace**: `t('billing.$1')` or `t('common.$1')` depending on the key

**Note**: You'll need to manually check each replacement to ensure it uses the correct category (billing vs common).

## 🧪 Testing After Fix

1. Restart dev server
2. Hard refresh browser
3. Navigate to Billing & Financial Management
4. Toggle language (EN ⟷ AR)
5. Verify:
   - Page title changes
   - All tab labels change
   - All metric cards change
   - All table headers change
   - All button labels change
   - All status badges change

## ⚠️ Common Issues

### Issue: Translation key not found
**Symptom**: See `billing.keyName` as literal text
**Fix**: Check if key exists in `LanguageServiceExtended.tsx`. If not, add it.

### Issue: Wrong category
**Symptom**: Key shows as `common.keyName` but should be `billing.keyName`
**Fix**: Update the t() call to use correct category

## 📝 Additional Keys Needed

If you find keys that don't exist in LanguageServiceExtended.tsx, add them:

```typescript
// In English section
'billing.paid': 'Paid',
'billing.pending': 'Pending',
'billing.overdue': 'Overdue',
'billing.approved': 'Approved',
'billing.rejected': 'Rejected',
'billing.submitted': 'Submitted',
'billing.underReview': 'Under Review',

// In Arabic section
'billing.paid': 'مدفوع',
'billing.pending': 'معلق',
'billing.overdue': 'متأخر',
'billing.approved': 'معتمد',
'billing.rejected': 'مرفوض',
'billing.submitted': 'مقدم',
'billing.underReview': 'قيد المراجعة',
```

## ✅ Success Criteria

- No `t.keyName` patterns remain in the file
- All text uses `t('category.key')` pattern
- Language toggle works for all text
- No translation keys show as literal text
