import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  onSnapshot,
  writeBatch,
  increment
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'sonner';

/**
 * Comprehensive Firebase Service for Hospital Management System
 * Handles all CRUD operations for all modules with real-time updates
 */

class FirebaseService {
  private listeners: Map<string, () => void> = new Map();

  // ==================== UTILITY METHODS ====================

  /**
   * Generic method to get all documents from a collection
   */
  async getAll<T>(collectionName: string): Promise<T[]> {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as T));
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
      toast.error(`Failed to load ${collectionName}`);
      throw error;
    }
  }

  /**
   * Generic method to get a single document by ID
   */
  async getById<T>(collectionName: string, id: string): Promise<T> {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      } else {
        throw new Error(`${collectionName} not found`);
      }
    } catch (error) {
      console.error(`Error fetching ${collectionName}/${id}:`, error);
      toast.error(`Failed to load ${collectionName}`);
      throw error;
    }
  }

  /**
   * Generic method to create a new document
   */
  async create<T>(collectionName: string, data: Partial<T>): Promise<T> {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      const newDoc = await getDoc(docRef);
      toast.success(`${collectionName} created successfully`);
      return { id: docRef.id, ...newDoc.data() } as T;
    } catch (error) {
      console.error(`Error creating ${collectionName}:`, error);
      toast.error(`Failed to create ${collectionName}`);
      throw error;
    }
  }

  /**
   * Generic method to update a document
   */
  async update<T>(collectionName: string, id: string, data: Partial<T>): Promise<T> {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
      
      const updatedDoc = await getDoc(docRef);
      toast.success(`${collectionName} updated successfully`);
      return { id, ...updatedDoc.data() } as T;
    } catch (error) {
      console.error(`Error updating ${collectionName}/${id}:`, error);
      toast.error(`Failed to update ${collectionName}`);
      throw error;
    }
  }

  /**
   * Generic method to delete a document
   */
  async delete(collectionName: string, id: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      toast.success(`${collectionName} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting ${collectionName}/${id}:`, error);
      toast.error(`Failed to delete ${collectionName}`);
      throw error;
    }
  }

  /**
   * Generic query method with filters
   */
  async queryCollection<T>(
    collectionName: string, 
    filters: any[] = [],
    orderByField?: string,
    limitCount?: number
  ): Promise<T[]> {
    try {
      const collectionRef = collection(db, collectionName);
      const constraints = [...filters];
      
      if (orderByField) {
        constraints.push(orderBy(orderByField, 'desc'));
      }
      
      if (limitCount) {
        constraints.push(limit(limitCount));
      }
      
      const q = query(collectionRef, ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as T));
    } catch (error) {
      console.error(`Error querying ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time updates
   */
  subscribeToCollection<T>(
    collectionName: string,
    callback: (data: T[]) => void,
    filters: any[] = []
  ): () => void {
    const collectionRef = collection(db, collectionName);
    const q = filters.length > 0 ? query(collectionRef, ...filters) : collectionRef;
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as T));
      callback(data);
    }, (error) => {
      console.error(`Error in ${collectionName} subscription:`, error);
    });
    
    const key = `${collectionName}-${Date.now()}`;
    this.listeners.set(key, unsubscribe);
    
    return () => {
      unsubscribe();
      this.listeners.delete(key);
    };
  }

  /**
   * Cleanup all listeners
   */
  cleanup(): void {
    this.listeners.forEach(unsubscribe => unsubscribe());
    this.listeners.clear();
  }

  // ==================== PATIENTS ====================

  async getPatients() {
    return this.getAll<any>('patients');
  }

  async getPatient(id: string) {
    return this.getById<any>('patients', id);
  }

  async createPatient(data: any) {
    return this.create<any>('patients', {
      ...data,
      status: 'active',
      registrationDate: Timestamp.now()
    });
  }

  async updatePatient(id: string, data: any) {
    return this.update<any>('patients', id, data);
  }

  async deletePatient(id: string) {
    return this.delete('patients', id);
  }

  async searchPatients(searchTerm: string) {
    const patients = await this.getPatients();
    return patients.filter((patient: any) =>
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.includes(searchTerm) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.mrn?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  subscribeToPatients(callback: (patients: any[]) => void) {
    return this.subscribeToCollection('patients', callback);
  }

  // ==================== APPOINTMENTS ====================

  async getAppointments() {
    return this.getAll<any>('appointments');
  }

  async getAppointment(id: string) {
    return this.getById<any>('appointments', id);
  }

  async createAppointment(data: any) {
    return this.create<any>('appointments', {
      ...data,
      status: data.status || 'scheduled',
      createdBy: data.createdBy || 'system'
    });
  }

  async updateAppointment(id: string, data: any) {
    return this.update<any>('appointments', id, data);
  }

  async deleteAppointment(id: string) {
    return this.delete('appointments', id);
  }

  async getTodayAppointments() {
    const today = new Date().toISOString().split('T')[0];
    return this.queryCollection<any>('appointments', [
      where('date', '==', today)
    ], 'time');
  }

  async getAppointmentsByDoctor(doctorId: string) {
    return this.queryCollection<any>('appointments', [
      where('doctorId', '==', doctorId)
    ], 'date');
  }

  async getAppointmentsByPatient(patientId: string) {
    return this.queryCollection<any>('appointments', [
      where('patientId', '==', patientId)
    ], 'date');
  }

  subscribeToAppointments(callback: (appointments: any[]) => void) {
    return this.subscribeToCollection('appointments', callback);
  }

  // ==================== STAFF ====================

  async getStaff() {
    return this.getAll<any>('staff');
  }

  async getStaffMember(id: string) {
    return this.getById<any>('staff', id);
  }

  async createStaffMember(data: any) {
    return this.create<any>('staff', {
      ...data,
      status: 'active',
      hireDate: data.hireDate || Timestamp.now()
    });
  }

  async updateStaffMember(id: string, data: any) {
    return this.update<any>('staff', id, data);
  }

  async deleteStaffMember(id: string) {
    return this.delete('staff', id);
  }

  async getStaffByRole(role: string) {
    return this.queryCollection<any>('staff', [
      where('role', '==', role),
      where('status', '==', 'active')
    ]);
  }

  async getStaffByDepartment(department: string) {
    return this.queryCollection<any>('staff', [
      where('department', '==', department),
      where('status', '==', 'active')
    ]);
  }

  // ==================== PHARMACY ====================

  async getInventory() {
    return this.getAll<any>('inventory');
  }

  async getInventoryItem(id: string) {
    return this.getById<any>('inventory', id);
  }

  async createInventoryItem(data: any) {
    return this.create<any>('inventory', data);
  }

  async updateInventoryItem(id: string, data: any) {
    return this.update<any>('inventory', id, data);
  }

  async deleteInventoryItem(id: string) {
    return this.delete('inventory', id);
  }

  async updateStock(id: string, quantity: number) {
    const docRef = doc(db, 'inventory', id);
    await updateDoc(docRef, {
      currentStock: increment(quantity),
      updatedAt: Timestamp.now()
    });
    toast.success('Stock updated successfully');
  }

  async getLowStockItems() {
    const inventory = await this.getInventory();
    return inventory.filter((item: any) => 
      item.currentStock <= item.minimumStock
    );
  }

  async getPrescriptions() {
    return this.getAll<any>('prescriptions');
  }

  async createPrescription(data: any) {
    return this.create<any>('prescriptions', {
      ...data,
      status: 'pending'
    });
  }

  async updatePrescription(id: string, data: any) {
    return this.update<any>('prescriptions', id, data);
  }

  async dispenseMedication(prescriptionId: string) {
    return this.update<any>('prescriptions', prescriptionId, {
      status: 'dispensed',
      dispensedAt: Timestamp.now()
    });
  }

  // ==================== LABORATORY ====================

  async getLabOrders() {
    return this.getAll<any>('labOrders');
  }

  async getLabOrder(id: string) {
    return this.getById<any>('labOrders', id);
  }

  async createLabOrder(data: any) {
    return this.create<any>('labOrders', {
      ...data,
      status: 'pending'
    });
  }

  async updateLabOrder(id: string, data: any) {
    return this.update<any>('labOrders', id, data);
  }

  async submitLabResults(id: string, results: any) {
    return this.update<any>('labOrders', id, {
      results,
      status: 'completed',
      completedAt: Timestamp.now()
    });
  }

  async getPendingLabOrders() {
    return this.queryCollection<any>('labOrders', [
      where('status', '==', 'pending')
    ], 'createdAt');
  }

  // ==================== RADIOLOGY ====================

  async getRadiologyStudies() {
    return this.getAll<any>('radiologyStudies');
  }

  async getRadiologyStudy(id: string) {
    return this.getById<any>('radiologyStudies', id);
  }

  async createRadiologyStudy(data: any) {
    return this.create<any>('radiologyStudies', {
      ...data,
      status: 'pending'
    });
  }

  async updateRadiologyStudy(id: string, data: any) {
    return this.update<any>('radiologyStudies', id, data);
  }

  async submitRadiologyReport(id: string, report: any) {
    return this.update<any>('radiologyStudies', id, {
      report,
      status: 'reported',
      reportedAt: Timestamp.now()
    });
  }

  // ==================== BILLING ====================

  async getInvoices() {
    return this.getAll<any>('invoices');
  }

  async getInvoice(id: string) {
    return this.getById<any>('invoices', id);
  }

  async createInvoice(data: any) {
    return this.create<any>('invoices', {
      ...data,
      status: 'pending'
    });
  }

  async updateInvoice(id: string, data: any) {
    return this.update<any>('invoices', id, data);
  }

  async markInvoiceAsPaid(id: string, paymentDetails: any) {
    return this.update<any>('invoices', id, {
      status: 'paid',
      paidAt: Timestamp.now(),
      paymentDetails
    });
  }

  async getPendingInvoices() {
    return this.queryCollection<any>('invoices', [
      where('status', '==', 'pending')
    ], 'createdAt');
  }

  // ==================== INSURANCE ====================

  async getInsuranceClaims() {
    return this.getAll<any>('insuranceClaims');
  }

  async createInsuranceClaim(data: any) {
    return this.create<any>('insuranceClaims', {
      ...data,
      status: 'submitted'
    });
  }

  async updateInsuranceClaim(id: string, data: any) {
    return this.update<any>('insuranceClaims', id, data);
  }

  // ==================== DASHBOARD STATS ====================

  async getDashboardStats(userRole: string) {
    try {
      const [patients, appointments, staff] = await Promise.all([
        this.getPatients(),
        this.getAppointments(),
        this.getStaff()
      ]);

      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = appointments.filter((apt: any) => apt.date === today);

      return {
        totalPatients: patients.length,
        todayAppointments: todayAppointments.length,
        totalStaff: staff.length,
        activeStaff: staff.filter((s: any) => s.status === 'active').length,
        recentPatients: patients.slice(0, 5),
        recentAppointments: todayAppointments.slice(0, 5)
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // ==================== BATCH OPERATIONS ====================

  async batchCreate(collectionName: string, items: any[]) {
    try {
      const batch = writeBatch(db);
      const collectionRef = collection(db, collectionName);

      items.forEach(item => {
        const docRef = doc(collectionRef);
        batch.set(docRef, {
          ...item,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      });

      await batch.commit();
      toast.success(`${items.length} items created successfully`);
    } catch (error) {
      console.error(`Error batch creating ${collectionName}:`, error);
      toast.error(`Failed to create items`);
      throw error;
    }
  }

  async batchUpdate(collectionName: string, updates: { id: string; data: any }[]) {
    try {
      const batch = writeBatch(db);

      updates.forEach(({ id, data }) => {
        const docRef = doc(db, collectionName, id);
        batch.update(docRef, {
          ...data,
          updatedAt: Timestamp.now()
        });
      });

      await batch.commit();
      toast.success(`${updates.length} items updated successfully`);
    } catch (error) {
      console.error(`Error batch updating ${collectionName}:`, error);
      toast.error(`Failed to update items`);
      throw error;
    }
  }

  async batchDelete(collectionName: string, ids: string[]) {
    try {
      const batch = writeBatch(db);

      ids.forEach(id => {
        const docRef = doc(db, collectionName, id);
        batch.delete(docRef);
      });

      await batch.commit();
      toast.success(`${ids.length} items deleted successfully`);
    } catch (error) {
      console.error(`Error batch deleting ${collectionName}:`, error);
      toast.error(`Failed to delete items`);
      throw error;
    }
  }

  // ==================== HEALTH CHECK ====================

  async ping() {
    try {
      const testRef = collection(db, '_health');
      await getDocs(query(testRef, limit(1)));
      return { success: true, message: 'Firebase connection successful' };
    } catch (error) {
      console.error('Firebase ping failed:', error);
      return { success: false, message: 'Firebase connection failed' };
    }
  }
}

// Create singleton instance
const firebaseService = new FirebaseService();

export default firebaseService;
export { firebaseService };
