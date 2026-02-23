# Firebase Integration - Quick Reference Guide

## 🚀 Quick Start Pattern

Use this pattern for all remaining module integrations.

---

## Step-by-Step Integration

### 1. Import Required Dependencies

```typescript
import firebaseService from '../../services/FirebaseService';
import { toast } from 'sonner';
```

### 2. Remove isDemoMode Prop

```typescript
// Before
interface ComponentProps {
  isDemoMode?: boolean;
}

const Component: React.FC<ComponentProps> = ({ isDemoMode = false }) => {

// After
interface ComponentProps {
  // No props needed - always uses Firebase
}

const Component: React.FC<ComponentProps> = () => {
```

### 3. Update useEffect Hook

```typescript
useEffect(() => {
  // Load initial data
  loadData();
  
  // Subscribe to real-time updates
  const unsubscribe = firebaseService.subscribeToCollection('collectionName', (data) => {
    setData(data);
  });
  
  // Cleanup on unmount
  return () => unsubscribe();
}, []);
```

### 4. Update loadData Function

```typescript
const loadData = useCallback(async () => {
  setLoading(true);
  try {
    const data = await firebaseService.getCollection();
    setData(data);
  } catch (error) {
    console.error('Error loading data:', error);
    toast.error(language === 'ar' ? 'خطأ في تحميل البيانات' : 'Error loading data');
  } finally {
    setLoading(false);
  }
}, [language]);
```

### 5. Update CRUD Operations

```typescript
// CREATE
const handleCreate = async (data: any) => {
  try {
    await firebaseService.create('collection', data);
    // Success toast is automatic from FirebaseService
  } catch (error) {
    console.error('Error creating:', error);
    toast.error('Failed to create');
  }
};

// UPDATE
const handleUpdate = async (id: string, data: any) => {
  try {
    await firebaseService.update('collection', id, data);
    // Success toast is automatic from FirebaseService
  } catch (error) {
    console.error('Error updating:', error);
    toast.error('Failed to update');
  }
};

// DELETE
const handleDelete = async (id: string) => {
  try {
    await firebaseService.delete('collection', id);
    // Success toast is automatic from FirebaseService
  } catch (error) {
    console.error('Error deleting:', error);
    toast.error('Failed to delete');
  }
};
```

---

## 📋 Module-Specific Guides

### Laboratory Module

**Collection**: `labOrders`

**Key Methods**:
```typescript
// Get all lab orders
const orders = await firebaseService.getLabOrders();

// Get pending orders
const pending = await firebaseService.getPendingLabOrders();

// Submit results
await firebaseService.submitLabResults(orderId, results);

// Subscribe to updates
const unsubscribe = firebaseService.subscribeToCollection('labOrders', (orders) => {
  setLabOrders(orders);
});
```

**Data Structure**:
```typescript
interface LabOrder {
  id: string;
  patientId: string;
  doctorId: string;
  testType: string;
  status: 'pending' | 'in-progress' | 'completed';
  results?: any;
  createdAt: Timestamp;
  completedAt?: Timestamp;
}
```

---

### Radiology Module

**Collection**: `radiologyStudies`

**Key Methods**:
```typescript
// Get all studies
const studies = await firebaseService.getRadiologyStudies();

// Create study
await firebaseService.createRadiologyStudy(studyData);

// Submit report
await firebaseService.submitRadiologyReport(studyId, report);

// Subscribe to updates
const unsubscribe = firebaseService.subscribeToCollection('radiologyStudies', (studies) => {
  setStudies(studies);
});
```

**Data Structure**:
```typescript
interface RadiologyStudy {
  id: string;
  patientId: string;
  doctorId: string;
  modality: 'CT' | 'MRI' | 'XR' | 'US';
  studyDescription: string;
  status: 'pending' | 'completed' | 'reported';
  report?: any;
  createdAt: Timestamp;
  reportedAt?: Timestamp;
}
```

---

### Billing Module

**Collection**: `invoices`

**Key Methods**:
```typescript
// Get all invoices
const invoices = await firebaseService.getInvoices();

// Get pending invoices
const pending = await firebaseService.getPendingInvoices();

// Create invoice
await firebaseService.createInvoice(invoiceData);

// Mark as paid
await firebaseService.markInvoiceAsPaid(invoiceId, paymentDetails);

// Subscribe to updates
const unsubscribe = firebaseService.subscribeToCollection('invoices', (invoices) => {
  setInvoices(invoices);
});
```

**Data Structure**:
```typescript
interface Invoice {
  id: string;
  patientId: string;
  items: InvoiceItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'cancelled';
  paidAt?: Timestamp;
  paymentDetails?: any;
  createdAt: Timestamp;
}
```

---

### Staff Management Module

**Collection**: `staff`

**Key Methods**:
```typescript
// Get all staff
const staff = await firebaseService.getStaff();

// Get by role
const doctors = await firebaseService.getStaffByRole('doctor');

// Get by department
const deptStaff = await firebaseService.getStaffByDepartment('cardiology');

// Create staff member
await firebaseService.createStaffMember(staffData);

// Update staff member
await firebaseService.updateStaffMember(staffId, updates);

// Subscribe to updates
const unsubscribe = firebaseService.subscribeToCollection('staff', (staff) => {
  setStaff(staff);
});
```

**Data Structure**:
```typescript
interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  specialization?: string;
  status: 'active' | 'inactive';
  hireDate: Timestamp;
  email: string;
  phone: string;
}
```

---

## 🎯 Common Patterns

### Loading State
```typescript
const [loading, setLoading] = useState(false);

const loadData = async () => {
  setLoading(true);
  try {
    // Load data
  } finally {
    setLoading(false);
  }
};
```

### Error Handling
```typescript
try {
  await firebaseService.someOperation();
} catch (error) {
  console.error('Error:', error);
  toast.error(language === 'ar' ? 'حدث خطأ' : 'An error occurred');
}
```

### Real-time Subscriptions
```typescript
useEffect(() => {
  const unsubscribe = firebaseService.subscribeToCollection('collection', (data) => {
    setData(data);
  });
  
  return () => unsubscribe();
}, []);
```

### Data Enrichment
```typescript
// Enrich data with related collections
const enrichedData = data.map(item => ({
  ...item,
  patient: patients.find(p => p.id === item.patientId),
  doctor: doctors.find(d => d.id === item.doctorId)
}));
```

---

## ✅ Testing Checklist

For each module integration:

- [ ] Import FirebaseService and toast
- [ ] Remove isDemoMode prop and logic
- [ ] Update useEffect with real-time subscriptions
- [ ] Update loadData() to fetch from Firebase
- [ ] Update all CRUD operations
- [ ] Add proper error handling
- [ ] Test real-time updates
- [ ] Verify toast notifications
- [ ] Check TypeScript diagnostics
- [ ] Test with multiple users
- [ ] Verify data persistence
- [ ] Test error scenarios

---

## 🚨 Common Pitfalls

### 1. Forgetting to Cleanup Subscriptions
```typescript
// ❌ BAD
useEffect(() => {
  firebaseService.subscribeToCollection('collection', callback);
}, []);

// ✅ GOOD
useEffect(() => {
  const unsubscribe = firebaseService.subscribeToCollection('collection', callback);
  return () => unsubscribe();
}, []);
```

### 2. Not Handling Errors
```typescript
// ❌ BAD
const data = await firebaseService.getData();

// ✅ GOOD
try {
  const data = await firebaseService.getData();
} catch (error) {
  console.error('Error:', error);
  toast.error('Failed to load data');
}
```

### 3. Missing Loading States
```typescript
// ❌ BAD
const loadData = async () => {
  const data = await firebaseService.getData();
  setData(data);
};

// ✅ GOOD
const loadData = async () => {
  setLoading(true);
  try {
    const data = await firebaseService.getData();
    setData(data);
  } finally {
    setLoading(false);
  }
};
```

### 4. Not Using useCallback
```typescript
// ❌ BAD
const loadData = async () => {
  // ...
};

// ✅ GOOD
const loadData = useCallback(async () => {
  // ...
}, [dependencies]);
```

---

## 📊 Progress Tracking

After completing each module:

1. Update `FIREBASE_INTEGRATION_STARTED.md`
2. Run diagnostics: `getDiagnostics(['path/to/file.tsx'])`
3. Test real-time updates
4. Verify toast notifications
5. Check for TypeScript errors
6. Update progress percentage

---

## 🎓 Best Practices

1. **Always use real-time subscriptions** for live data
2. **Clean up subscriptions** in useEffect return
3. **Use toast notifications** for all operations
4. **Handle errors gracefully** with try-catch
5. **Maintain loading states** for better UX
6. **Use TypeScript** for type safety
7. **Test with multiple users** for collaboration
8. **Document changes** in progress files

---

## 🔗 Quick Links

- Firebase Service: `src/services/FirebaseService.tsx`
- Progress Tracking: `FIREBASE_INTEGRATION_STARTED.md`
- Session Summary: `FIREBASE_INTEGRATION_SESSION_SUMMARY.md`
- Firebase Config: `.env`

---

## 💡 Tips

- Copy-paste the pattern from completed modules
- Use Find & Replace for collection names
- Test incrementally (don't integrate everything at once)
- Keep demo data for fallback during development
- Use Firebase Console to verify data structure
- Monitor Firestore usage in Firebase Console

---

**Last Updated**: Current Session
**Modules Remaining**: 5 (Laboratory, Radiology, Billing, Staff, Dashboard Stats)
**Estimated Time per Module**: 30-45 minutes
