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
  limit
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Firebase API Service using object pattern to avoid class constructor issues
const createFirebaseApiService = () => {
  const service = {
    name: 'FirebaseApiService',

    // Health check
    async ping() {
    try {
      // Try to read from a system collection to verify connection
      const testRef = collection(db, '_health');
      await getDocs(query(testRef, limit(1)));
      return { pong: true };
    } catch (error) {
      console.error('Firebase ping failed:', error);
      return { pong: false };
    }
  },

  // Generic CRUD operations
  async getAll(collectionName: string) {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
      throw error;
    }
  },

  async getById(collectionName: string, id: string) {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Document not found');
      }
    } catch (error) {
      console.error(`Error fetching ${collectionName}/${id}:`, error);
      throw error;
    }
  },

  async create(collectionName: string, data: any) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error(`Error creating ${collectionName}:`, error);
      throw error;
    }
  },

  async update(collectionName: string, id: string, data: any) {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      return { id, ...data };
    } catch (error) {
      console.error(`Error updating ${collectionName}/${id}:`, error);
      throw error;
    }
  },

  async delete(collectionName: string, id: string) {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting ${collectionName}/${id}:`, error);
      throw error;
    }
  },

  // Query with filters
  async query(collectionName: string, filters: any[] = []) {
    try {
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, ...filters);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error(`Error querying ${collectionName}:`, error);
      throw error;
    }
  },

  // Patients
  async getPatients() {
    return service.getAll('patients');
  },

  async getPatient(id: string) {
    return service.getById('patients', id);
  },

  async createPatient(data: any) {
    return service.create('patients', data);
  },

  async updatePatient(id: string, data: any) {
    return service.update('patients', id, data);
  },

  async deletePatient(id: string) {
    return service.delete('patients', id);
  },

  // Appointments
  async getAppointments() {
    return service.getAll('appointments');
  },

  async getAppointment(id: string) {
    return service.getById('appointments', id);
  },

  async createAppointment(data: any) {
    return service.create('appointments', data);
  },

  async updateAppointment(id: string, data: any) {
    return service.update('appointments', id, data);
  },

  async deleteAppointment(id: string) {
    return service.delete('appointments', id);
  },

  // Staff
  async getStaff() {
    return service.getAll('staff');
  },

  async getStaffMember(id: string) {
    return service.getById('staff', id);
  },

  async createStaffMember(data: any) {
    return service.create('staff', data);
  },

  async updateStaffMember(id: string, data: any) {
    return service.update('staff', id, data);
  },

  async deleteStaffMember(id: string) {
    return service.delete('staff', id);
  }
};

return service;
};

// Create singleton instance
export const firebaseApiService = createFirebaseApiService();
export default firebaseApiService;
