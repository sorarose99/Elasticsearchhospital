/**
 * Test Setup File
 * Runs before all tests
 */

import { beforeAll, afterAll, vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock environment variables
process.env.VITE_FIREBASE_API_KEY = 'test-api-key';
process.env.VITE_FIREBASE_AUTH_DOMAIN = 'test.firebaseapp.com';
process.env.VITE_FIREBASE_PROJECT_ID = 'test-project';
process.env.VITE_FIREBASE_STORAGE_BUCKET = 'test.appspot.com';
process.env.VITE_FIREBASE_MESSAGING_SENDER_ID = '123456789';
process.env.VITE_FIREBASE_APP_ID = '1:123456789:web:abcdef';

// Mock toast notifications
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn()
  }
}));

// Mock Firebase completely for unit tests
vi.mock('../src/config/firebase', () => ({
  db: {},
  auth: {},
  storage: {},
  analytics: null,
  default: {}
}));

// Mock Firebase Service for component tests
vi.mock('../src/services/FirebaseService', () => {
  const mockPatients = [
    { id: '1', name: 'Test Patient 1', email: 'test1@example.com', phone: '+1234567890' },
    { id: '2', name: 'Test Patient 2', email: 'test2@example.com', phone: '+0987654321' }
  ];

  return {
    default: {
      // Connection
      ping: vi.fn().mockResolvedValue({ success: true, message: 'Mock connection successful' }),
      
      // Patients
      getPatients: vi.fn().mockResolvedValue(mockPatients),
      getPatient: vi.fn().mockImplementation((id) => 
        Promise.resolve(mockPatients.find(p => p.id === id) || null)
      ),
      createPatient: vi.fn().mockImplementation((data) => 
        Promise.resolve({ id: 'new-id', ...data })
      ),
      updatePatient: vi.fn().mockImplementation((id, data) => 
        Promise.resolve({ id, ...data })
      ),
      deletePatient: vi.fn().mockResolvedValue(undefined),
      searchPatients: vi.fn().mockImplementation((term) => 
        Promise.resolve(mockPatients.filter(p => p.name.includes(term)))
      ),
      subscribeToPatients: vi.fn().mockImplementation((callback) => {
        const unsubscribe = () => {};
        setTimeout(() => callback(mockPatients), 0);
        return unsubscribe;
      }),
      
      // Appointments
      getAppointments: vi.fn().mockResolvedValue([]),
      createAppointment: vi.fn().mockImplementation((data) => 
        Promise.resolve({ id: 'apt-id', ...data })
      ),
      updateAppointment: vi.fn().mockImplementation((id, data) => 
        Promise.resolve({ id, ...data })
      ),
      deleteAppointment: vi.fn().mockResolvedValue(undefined),
      getTodayAppointments: vi.fn().mockResolvedValue([]),
      getAppointmentsByDoctor: vi.fn().mockResolvedValue([]),
      getAppointmentsByPatient: vi.fn().mockResolvedValue([]),
      subscribeToAppointments: vi.fn().mockImplementation((callback) => {
        const unsubscribe = () => {};
        setTimeout(() => callback([]), 0);
        return unsubscribe;
      }),
      
      // Inventory
      getInventory: vi.fn().mockResolvedValue([]),
      getInventoryItem: vi.fn().mockImplementation((id) => 
        Promise.resolve({ id, currentStock: 90, minimumStock: 20 })
      ),
      createInventoryItem: vi.fn().mockImplementation((data) => 
        Promise.resolve({ id: 'inv-id', ...data })
      ),
      updateInventoryItem: vi.fn().mockImplementation((id, data) => 
        Promise.resolve({ id, ...data })
      ),
      deleteInventoryItem: vi.fn().mockResolvedValue(undefined),
      updateStock: vi.fn().mockResolvedValue(undefined),
      getLowStockItems: vi.fn().mockResolvedValue([]),
      
      // Prescriptions
      getPrescriptions: vi.fn().mockResolvedValue([]),
      createPrescription: vi.fn().mockImplementation((data) => 
        Promise.resolve({ id: 'rx-id', ...data })
      ),
      updatePrescription: vi.fn().mockImplementation((id, data) => 
        Promise.resolve({ id, ...data })
      ),
      dispenseMedication: vi.fn().mockImplementation((id) => 
        Promise.resolve({ id, status: 'dispensed' })
      ),
      
      // Lab Orders
      getLabOrders: vi.fn().mockResolvedValue([]),
      getLabOrder: vi.fn().mockResolvedValue({}),
      createLabOrder: vi.fn().mockImplementation((data) => 
        Promise.resolve({ id: 'lab-id', ...data })
      ),
      updateLabOrder: vi.fn().mockImplementation((id, data) => 
        Promise.resolve({ id, ...data })
      ),
      submitLabResults: vi.fn().mockImplementation((id, results) => 
        Promise.resolve({ id, results, status: 'completed' })
      ),
      getPendingLabOrders: vi.fn().mockResolvedValue([]),
      
      // Radiology
      getRadiologyStudies: vi.fn().mockResolvedValue([]),
      getRadiologyStudy: vi.fn().mockResolvedValue({}),
      createRadiologyStudy: vi.fn().mockImplementation((data) => 
        Promise.resolve({ id: 'rad-id', ...data })
      ),
      updateRadiologyStudy: vi.fn().mockImplementation((id, data) => 
        Promise.resolve({ id, ...data })
      ),
      submitRadiologyReport: vi.fn().mockImplementation((id, report) => 
        Promise.resolve({ id, report, status: 'reported' })
      ),
      
      // Billing
      getInvoices: vi.fn().mockResolvedValue([]),
      getInvoice: vi.fn().mockResolvedValue({}),
      createInvoice: vi.fn().mockImplementation((data) => 
        Promise.resolve({ id: 'inv-id', ...data })
      ),
      updateInvoice: vi.fn().mockImplementation((id, data) => 
        Promise.resolve({ id, ...data })
      ),
      deleteInvoice: vi.fn().mockResolvedValue(undefined),
      markInvoiceAsPaid: vi.fn().mockImplementation((id, details) => 
        Promise.resolve({ id, status: 'paid', paymentDetails: details })
      ),
      getPendingInvoices: vi.fn().mockResolvedValue([]),
      
      // Insurance
      getInsuranceClaims: vi.fn().mockResolvedValue([]),
      createInsuranceClaim: vi.fn().mockImplementation((data) => 
        Promise.resolve({ id: 'claim-id', ...data })
      ),
      updateInsuranceClaim: vi.fn().mockImplementation((id, data) => 
        Promise.resolve({ id, ...data })
      ),
      
      // Staff
      getStaff: vi.fn().mockResolvedValue([]),
      getStaffMember: vi.fn().mockResolvedValue({}),
      createStaffMember: vi.fn().mockImplementation((data) => 
        Promise.resolve({ id: 'staff-id', ...data })
      ),
      updateStaffMember: vi.fn().mockImplementation((id, data) => 
        Promise.resolve({ id, ...data })
      ),
      deleteStaffMember: vi.fn().mockResolvedValue(undefined),
      getStaffByRole: vi.fn().mockResolvedValue([]),
      getStaffByDepartment: vi.fn().mockResolvedValue([]),
      
      // Generic
      getAll: vi.fn().mockResolvedValue([]),
      getById: vi.fn().mockResolvedValue({}),
      create: vi.fn().mockImplementation((collection, data) => 
        Promise.resolve({ id: 'new-id', ...data })
      ),
      update: vi.fn().mockImplementation((collection, id, data) => 
        Promise.resolve({ id, ...data })
      ),
      delete: vi.fn().mockResolvedValue(undefined),
      queryCollection: vi.fn().mockResolvedValue([]),
      subscribeToCollection: vi.fn().mockImplementation((collection, callback) => {
        const unsubscribe = () => {};
        setTimeout(() => callback([]), 0);
        return unsubscribe;
      }),
      
      // Batch
      batchCreate: vi.fn().mockResolvedValue(undefined),
      batchUpdate: vi.fn().mockResolvedValue(undefined),
      batchDelete: vi.fn().mockResolvedValue(undefined),
      
      // Cleanup
      cleanup: vi.fn()
    }
  };
});

// Setup before all tests
beforeAll(() => {
  console.log('🧪 Starting test suite...');
});

// Cleanup after all tests
afterAll(() => {
  console.log('✅ Test suite completed');
});
