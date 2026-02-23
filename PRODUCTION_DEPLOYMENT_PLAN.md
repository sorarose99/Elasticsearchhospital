# Firebase Production Deployment Plan

**Created**: February 20, 2026  
**Target Deployment**: Within 5-7 days  
**Status**: Ready to Execute  

---

## 🎯 Quick Summary

**Current State**: ✅ Firebase integration 100% complete, zero errors  
**Production Ready**: ⚠️ Requires security setup (5-7 days)  
**Critical Blockers**: 3 (Security Rules, User Roles, Compliance)  

---

## 📋 Phase 1: Critical Security (Days 1-2)

### Day 1 Morning: Deploy Firestore Security Rules

**Status**: ✅ Rules file created  
**Time**: 2-3 hours  
**Priority**: CRITICAL  

**Steps**:
1. Review `firestore.rules` file (already created)
2. Test rules locally with Firebase Emulator
3. Deploy to Firebase project
4. Verify rules are active
5. Test with different user roles

**Commands**:
```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init firestore

# Deploy security rules
firebase deploy --only firestore:rules

# Test rules
firebase emulators:start --only firestore
```

**Verification**:
- [ ] Rules deployed successfully
- [ ] Unauthorized access blocked
- [ ] Authorized access works
- [ ] Role-based access working

---

### Day 1 Afternoon: Create Users Collection & Role Management

**Status**: ⚠️ Needs implementation  
**Time**: 3-4 hours  
**Priority**: CRITICAL  

**Files to Create**:

1. **`src/services/UserManagementService.tsx`**
```typescript
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'sonner';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'pharmacist' | 'lab_technician' | 'radiologist' | 'billing';
  department?: string;
  specialization?: string;
  licenseNumber?: string;
  phone?: string;
  isActive: boolean;
  createdAt: any;
  updatedAt: any;
}

class UserManagementService {
  async createUserProfile(uid: string, data: Partial<UserProfile>) {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        ...data,
        uid,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      toast.success('User profile created');
      return { success: true };
    } catch (error) {
      console.error('Error creating user profile:', error);
      toast.error('Failed to create user profile');
      return { success: false, error };
    }
  }

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  async updateUserRole(uid: string, role: UserProfile['role']) {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        role,
        updatedAt: new Date()
      });
      toast.success('User role updated');
      return { success: true };
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
      return { success: false, error };
    }
  }

  async getAllUsers(): Promise<UserProfile[]> {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      return snapshot.docs.map(doc => doc.data() as UserProfile);
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }
}

export const userManagementService = new UserManagementService();
export default userManagementService;
```

2. **Update `src/hooks/useFirebaseAuth.tsx`**
```typescript
// Add after successful sign-in
const userProfile = await userManagementService.getUserProfile(userCredential.user.uid);
if (userProfile) {
  localStorage.setItem('userRole', userProfile.role);
}
```

**Verification**:
- [ ] Users collection created
- [ ] User profiles stored in Firestore
- [ ] Roles synced with authentication
- [ ] Admin can manage user roles

---

### Day 2: Initial User Setup & Testing

**Status**: ⚠️ Needs execution  
**Time**: 4-5 hours  
**Priority**: CRITICAL  

**Tasks**:
1. Create admin user manually in Firebase Console
2. Create test users for each role
3. Test authentication with roles
4. Verify security rules work with roles
5. Test all CRUD operations with different roles

**Admin User Creation** (Firebase Console):
```javascript
// In Firebase Console > Firestore > users collection
{
  uid: "admin-uid-from-auth",
  email: "admin@hospital.com",
  displayName: "System Administrator",
  role: "admin",
  isActive: true,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now()
}
```

**Test Users**:
- Admin: admin@hospital.com
- Doctor: doctor@hospital.com
- Nurse: nurse@hospital.com
- Receptionist: receptionist@hospital.com
- Pharmacist: pharmacist@hospital.com
- Lab Tech: labtech@hospital.com
- Radiologist: radiologist@hospital.com
- Billing: billing@hospital.com

**Verification**:
- [ ] Admin user can access all features
- [ ] Doctor can create prescriptions and lab orders
- [ ] Pharmacist can manage inventory
- [ ] Lab tech can update lab orders
- [ ] Receptionist can manage appointments
- [ ] Unauthorized actions are blocked

---

## 📋 Phase 2: Compliance & Monitoring (Days 3-4)

### Day 3: Basic Compliance Documents

**Status**: ⚠️ Needs creation  
**Time**: 4-6 hours  
**Priority**: HIGH  

**Documents to Create**:

1. **Privacy Policy** (`public/privacy-policy.html`)
2. **Terms of Service** (`public/terms-of-service.html`)
3. **Cookie Policy** (`public/cookie-policy.html`)
4. **Data Retention Policy** (internal document)

**Quick Templates Available**:
- Use online generators for basic templates
- Customize for healthcare/hospital context
- Have legal review (recommended)

**Implementation**:
- Add links in footer
- Add consent checkbox on registration
- Store consent in user profile

---

### Day 4: Error Logging & Monitoring

**Status**: ⚠️ Needs setup  
**Time**: 3-4 hours  
**Priority**: HIGH  

**Setup Sentry**:
```bash
npm install @sentry/react @sentry/tracing
```

**Configure** (`src/main.tsx`):
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

**Setup Firebase Analytics**:
```typescript
// Already configured in firebase.ts
// Just enable in Firebase Console
```

**Verification**:
- [ ] Errors logged to Sentry
- [ ] Analytics tracking events
- [ ] Performance monitoring active
- [ ] Alerts configured

---

## 📋 Phase 3: Data & Backup (Day 5)

### Day 5 Morning: Seed Production Data

**Status**: ✅ Seed script exists  
**Time**: 2-3 hours  
**Priority**: MEDIUM  

**Steps**:
1. Review `src/config/initializeFirestore.ts`
2. Customize sample data for production
3. Run initialization script
4. Verify data in Firebase Console
5. Test with real workflows

**Run Initialization**:
```typescript
// In browser console or create admin page
import { initializeFirestoreCollections } from './config/initializeFirestore';
await initializeFirestoreCollections();
```

---

### Day 5 Afternoon: Setup Backups

**Status**: ⚠️ Needs configuration  
**Time**: 2-3 hours  
**Priority**: MEDIUM  

**Firebase Backup Setup**:
1. Go to Firebase Console
2. Navigate to Firestore > Backups
3. Enable automated backups
4. Set schedule (daily recommended)
5. Configure retention (30 days recommended)

**Manual Export Feature**:
```typescript
// Add to admin panel
const exportData = async () => {
  const collections = ['patients', 'appointments', 'staff', 'inventory'];
  const data = {};
  
  for (const col of collections) {
    data[col] = await firebaseService.getAll(col);
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup-${new Date().toISOString()}.json`;
  a.click();
};
```

---

## 📋 Phase 4: Final Testing & Deployment (Days 6-7)

### Day 6: Comprehensive Testing

**Status**: ⚠️ Needs execution  
**Time**: Full day  
**Priority**: HIGH  

**Test Scenarios**:

1. **Authentication Tests**
   - [ ] Sign up new user
   - [ ] Sign in existing user
   - [ ] Sign out
   - [ ] Password reset
   - [ ] Role-based access

2. **Patient Management Tests**
   - [ ] Create patient
   - [ ] View patient list
   - [ ] Update patient
   - [ ] Search patient
   - [ ] Delete patient (admin only)

3. **Appointments Tests**
   - [ ] Schedule appointment
   - [ ] View appointments
   - [ ] Update appointment
   - [ ] Cancel appointment
   - [ ] QR code generation

4. **Pharmacy Tests**
   - [ ] View inventory
   - [ ] Add medication
   - [ ] Update stock
   - [ ] Create prescription
   - [ ] Dispense medication

5. **Laboratory Tests**
   - [ ] Create lab order
   - [ ] View pending orders
   - [ ] Submit results
   - [ ] View completed orders

6. **Radiology Tests**
   - [ ] Create study
   - [ ] View studies
   - [ ] Submit report
   - [ ] View images

7. **Billing Tests**
   - [ ] Create invoice
   - [ ] Process payment
   - [ ] View revenue
   - [ ] Insurance claims

8. **Staff Management Tests**
   - [ ] Add staff member
   - [ ] Update staff
   - [ ] View staff list
   - [ ] Manage attendance

9. **Dashboard Tests**
   - [ ] View statistics
   - [ ] Real-time updates
   - [ ] Recent activity
   - [ ] Critical alerts

10. **Security Tests**
    - [ ] Unauthorized access blocked
    - [ ] Role restrictions enforced
    - [ ] Data validation working
    - [ ] Error handling proper

---

### Day 7: Production Deployment

**Status**: ⚠️ Ready to execute  
**Time**: 4-6 hours  
**Priority**: CRITICAL  

**Pre-Deployment Checklist**:
- [ ] All tests passed
- [ ] Security rules deployed
- [ ] User roles configured
- [ ] Compliance documents ready
- [ ] Monitoring configured
- [ ] Backups enabled
- [ ] Environment variables set
- [ ] Domain configured
- [ ] SSL certificate ready

**Deployment Steps**:

1. **Build Production Bundle**
```bash
npm run build
```

2. **Deploy to Firebase Hosting**
```bash
firebase deploy --only hosting
```

3. **Verify Deployment**
- [ ] Site accessible
- [ ] Authentication working
- [ ] Data loading correctly
- [ ] Real-time updates working
- [ ] No console errors

4. **Post-Deployment**
- [ ] Monitor error logs
- [ ] Check performance
- [ ] Verify backups
- [ ] Test critical workflows
- [ ] Notify team

---

## 🚨 Rollback Plan

If issues occur:

1. **Immediate Rollback**
```bash
firebase hosting:rollback
```

2. **Restore Previous Rules**
```bash
firebase deploy --only firestore:rules
```

3. **Restore Data** (if needed)
- Use Firebase Console
- Import from backup
- Verify data integrity

---

## 📊 Success Criteria

### Technical
- [ ] Zero critical errors
- [ ] < 2s page load time
- [ ] 99.9% uptime
- [ ] All features working
- [ ] Security rules active

### Business
- [ ] All user roles working
- [ ] Data persisting correctly
- [ ] Real-time updates working
- [ ] Backups running
- [ ] Monitoring active

---

## 📞 Support Plan

### During Deployment
- Monitor error logs continuously
- Have rollback plan ready
- Keep team on standby
- Document any issues

### Post-Deployment
- Monitor for 48 hours
- Daily check-ins
- Weekly reviews
- Monthly audits

---

## 💰 Cost Estimate

### One-Time Costs
- Domain: $10-15/year
- SSL: Free (Let's Encrypt)
- Initial setup: 40-50 hours

### Monthly Costs
- Firebase (Blaze): $25-100
- Sentry: $26-80
- Total: $50-200/month

---

## 📝 Next Steps

### Immediate (Today)
1. ✅ Review this deployment plan
2. ⚠️ Deploy Firestore security rules
3. ⚠️ Create admin user
4. ⚠️ Test security rules

### This Week
1. ⚠️ Implement user role management
2. ⚠️ Create compliance documents
3. ⚠️ Setup monitoring
4. ⚠️ Configure backups

### Next Week
1. ⚠️ Comprehensive testing
2. ⚠️ Production deployment
3. ⚠️ Post-deployment monitoring
4. ⚠️ Team training

---

**Plan Created**: February 20, 2026  
**Target Completion**: February 27, 2026  
**Status**: Ready to Execute  
**Confidence Level**: High ✅  
