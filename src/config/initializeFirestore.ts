import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';

// Collection names
export const COLLECTIONS = {
  PATIENTS: 'patients',
  APPOINTMENTS: 'appointments',
  STAFF: 'staff',
  INVENTORY: 'inventory',
  BILLING: 'billing',
  LAB_ORDERS: 'lab_orders',
  PRESCRIPTIONS: 'prescriptions',
  MEDICAL_RECORDS: 'medical_records',
  DEPARTMENTS: 'departments',
  NOTIFICATIONS: 'notifications'
};

// Initialize Firestore collections with sample data
export const initializeFirestoreCollections = async () => {
  try {
    console.log('🔥 Initializing Firestore collections...');

    // Check if collections already exist
    const patientsSnapshot = await getDocs(collection(db, COLLECTIONS.PATIENTS));
    
    if (!patientsSnapshot.empty) {
      console.log('✅ Firestore collections already initialized');
      return { success: true, message: 'Collections already exist' };
    }

    // Create sample patient
    await setDoc(doc(db, COLLECTIONS.PATIENTS, 'sample-patient-1'), {
      id: 'sample-patient-1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      address: '123 Main St, City, Country',
      bloodType: 'O+',
      allergies: [],
      chronicConditions: [],
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '+1234567891'
      },
      insuranceProvider: 'Health Insurance Co.',
      insuranceNumber: 'INS123456',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    });

    // Create sample appointment
    await setDoc(doc(db, COLLECTIONS.APPOINTMENTS, 'sample-appointment-1'), {
      id: 'sample-appointment-1',
      patientId: 'sample-patient-1',
      patientName: 'John Doe',
      doctorId: 'doctor-1',
      doctorName: 'Dr. Smith',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      type: 'consultation',
      status: 'scheduled',
      department: 'General Medicine',
      notes: 'Regular checkup',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Create sample staff member
    await setDoc(doc(db, COLLECTIONS.STAFF, 'doctor-1'), {
      id: 'doctor-1',
      name: 'Dr. Smith',
      email: 'dr.smith@hospital.com',
      role: 'doctor',
      specialization: 'General Medicine',
      department: 'General Medicine',
      phone: '+1234567892',
      licenseNumber: 'MED123456',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Create sample inventory item
    await setDoc(doc(db, COLLECTIONS.INVENTORY, 'sample-item-1'), {
      id: 'sample-item-1',
      name: 'Paracetamol 500mg',
      category: 'medication',
      quantity: 1000,
      unit: 'tablets',
      reorderLevel: 200,
      supplier: 'Pharma Supplies Inc.',
      expiryDate: '2025-12-31',
      batchNumber: 'BATCH001',
      price: 0.50,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Create sample billing record
    await setDoc(doc(db, COLLECTIONS.BILLING, 'sample-bill-1'), {
      id: 'sample-bill-1',
      patientId: 'sample-patient-1',
      patientName: 'John Doe',
      amount: 150.00,
      currency: 'USD',
      status: 'pending',
      items: [
        {
          description: 'Consultation Fee',
          quantity: 1,
          unitPrice: 100.00,
          total: 100.00
        },
        {
          description: 'Lab Tests',
          quantity: 1,
          unitPrice: 50.00,
          total: 50.00
        }
      ],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Create sample lab order
    await setDoc(doc(db, COLLECTIONS.LAB_ORDERS, 'sample-lab-1'), {
      id: 'sample-lab-1',
      patientId: 'sample-patient-1',
      patientName: 'John Doe',
      doctorId: 'doctor-1',
      doctorName: 'Dr. Smith',
      testType: 'Blood Test',
      status: 'pending',
      priority: 'normal',
      notes: 'Complete blood count',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Create sample prescription
    await setDoc(doc(db, COLLECTIONS.PRESCRIPTIONS, 'sample-prescription-1'), {
      id: 'sample-prescription-1',
      patientId: 'sample-patient-1',
      patientName: 'John Doe',
      doctorId: 'doctor-1',
      doctorName: 'Dr. Smith',
      medications: [
        {
          name: 'Paracetamol 500mg',
          dosage: '1 tablet',
          frequency: 'twice daily',
          duration: '5 days',
          instructions: 'Take after meals'
        }
      ],
      diagnosis: 'Common cold',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Create sample department
    await setDoc(doc(db, COLLECTIONS.DEPARTMENTS, 'general-medicine'), {
      id: 'general-medicine',
      name: 'General Medicine',
      description: 'General medical consultations and treatments',
      headOfDepartment: 'Dr. Smith',
      staffCount: 5,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    console.log('✅ Firestore collections initialized successfully');
    return { success: true, message: 'Collections created successfully' };

  } catch (error) {
    console.error('❌ Error initializing Firestore collections:', error);
    return { success: false, error: error };
  }
};

// Function to check if Firestore is properly configured
export const checkFirestoreConnection = async () => {
  try {
    const testCollection = collection(db, '_health_check');
    await getDocs(testCollection);
    return true;
  } catch (error) {
    console.error('Firestore connection check failed:', error);
    return false;
  }
};
