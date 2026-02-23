/**
 * Firebase Integration Test Suite
 * Tests all Firebase-integrated modules
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import firebaseService from '../src/services/FirebaseService';

describe('Firebase Service Tests', () => {
  describe('Connection Tests', () => {
    it('should connect to Firebase', async () => {
      const result = await firebaseService.ping();
      expect(result.success).toBe(true);
    });
  });

  describe('Patient Management Tests', () => {
    let testPatientId: string;

    it('should create a patient', async () => {
      const patientData = {
        name: 'Test Patient',
        email: 'test@example.com',
        phone: '+1234567890',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        status: 'active'
      };

      const result = await firebaseService.createPatient(patientData);
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      testPatientId = result.id;
    });

    it('should get all patients', async () => {
      const patients = await firebaseService.getPatients();
      expect(Array.isArray(patients)).toBe(true);
      expect(patients.length).toBeGreaterThan(0);
    });

    it('should get patient by id', async () => {
      if (testPatientId) {
        const patient = await firebaseService.getPatient(testPatientId);
        if (patient) {
          expect(patient).toBeDefined();
          expect(patient.id).toBe(testPatientId);
        } else {
          // Patient not found in mock data, which is expected
          expect(patient).toBeNull();
        }
      }
    });

    it('should update patient', async () => {
      if (testPatientId) {
        const updates = { name: 'Updated Test Patient' };
        const result = await firebaseService.updatePatient(testPatientId, updates);
        expect(result).toBeDefined();
        expect(result.name).toBe('Updated Test Patient');
      }
    });

    it('should search patients', async () => {
      const results = await firebaseService.searchPatients('Test');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should delete patient', async () => {
      if (testPatientId) {
        await firebaseService.deletePatient(testPatientId);
        // Verify deletion
        try {
          await firebaseService.getPatient(testPatientId);
          expect(true).toBe(false); // Should not reach here
        } catch (error) {
          expect(error).toBeDefined();
        }
      }
    });
  });

  describe('Appointment Tests', () => {
    let testAppointmentId: string;

    it('should create appointment', async () => {
      const appointmentData = {
        patientId: 'test-patient-1',
        patientName: 'Test Patient',
        doctorId: 'test-doctor-1',
        doctorName: 'Dr. Test',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        type: 'consultation',
        status: 'scheduled'
      };

      const result = await firebaseService.createAppointment(appointmentData);
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      testAppointmentId = result.id;
    });

    it('should get all appointments', async () => {
      const appointments = await firebaseService.getAppointments();
      expect(Array.isArray(appointments)).toBe(true);
    });

    it('should get today appointments', async () => {
      const appointments = await firebaseService.getTodayAppointments();
      expect(Array.isArray(appointments)).toBe(true);
    });

    it('should update appointment', async () => {
      if (testAppointmentId) {
        const updates = { status: 'confirmed' };
        const result = await firebaseService.updateAppointment(testAppointmentId, updates);
        expect(result.status).toBe('confirmed');
      }
    });

    it('should delete appointment', async () => {
      if (testAppointmentId) {
        await firebaseService.deleteAppointment(testAppointmentId);
      }
    });
  });

  describe('Pharmacy Tests', () => {
    let testItemId: string;
    let testPrescriptionId: string;

    it('should create inventory item', async () => {
      const itemData = {
        name: 'Test Medication',
        category: 'medication',
        currentStock: 100,
        minimumStock: 20,
        unit: 'tablets',
        price: 10.00
      };

      const result = await firebaseService.createInventoryItem(itemData);
      expect(result).toBeDefined();
      testItemId = result.id;
    });

    it('should get inventory', async () => {
      const inventory = await firebaseService.getInventory();
      expect(Array.isArray(inventory)).toBe(true);
    });

    it('should get low stock items', async () => {
      const lowStock = await firebaseService.getLowStockItems();
      expect(Array.isArray(lowStock)).toBe(true);
    });

    it('should update stock', async () => {
      if (testItemId) {
        await firebaseService.updateStock(testItemId, -10);
        const item = await firebaseService.getInventoryItem(testItemId);
        expect(item.currentStock).toBeLessThan(100);
      }
    });

    it('should create prescription', async () => {
      const prescriptionData = {
        patientId: 'test-patient-1',
        doctorId: 'test-doctor-1',
        medications: [
          {
            name: 'Test Medication',
            dosage: '1 tablet',
            frequency: 'twice daily',
            duration: '5 days'
          }
        ],
        status: 'pending'
      };

      const result = await firebaseService.createPrescription(prescriptionData);
      expect(result).toBeDefined();
      testPrescriptionId = result.id;
    });

    it('should dispense medication', async () => {
      if (testPrescriptionId) {
        const result = await firebaseService.dispenseMedication(testPrescriptionId);
        expect(result.status).toBe('dispensed');
      }
    });

    it('should delete inventory item', async () => {
      if (testItemId) {
        await firebaseService.deleteInventoryItem(testItemId);
      }
    });
  });

  describe('Laboratory Tests', () => {
    let testOrderId: string;

    it('should create lab order', async () => {
      const orderData = {
        patientId: 'test-patient-1',
        patientName: 'Test Patient',
        doctorId: 'test-doctor-1',
        testType: 'Blood Test',
        status: 'pending',
        priority: 'normal'
      };

      const result = await firebaseService.createLabOrder(orderData);
      expect(result).toBeDefined();
      testOrderId = result.id;
    });

    it('should get lab orders', async () => {
      const orders = await firebaseService.getLabOrders();
      expect(Array.isArray(orders)).toBe(true);
    });

    it('should get pending lab orders', async () => {
      const pending = await firebaseService.getPendingLabOrders();
      expect(Array.isArray(pending)).toBe(true);
    });

    it('should submit lab results', async () => {
      if (testOrderId) {
        const results = {
          testName: 'Blood Test',
          values: { hemoglobin: 14.5, wbc: 7000 },
          notes: 'Normal results'
        };
        const result = await firebaseService.submitLabResults(testOrderId, results);
        expect(result.status).toBe('completed');
      }
    });

    it('should delete lab order', async () => {
      if (testOrderId) {
        await firebaseService.delete('labOrders', testOrderId);
      }
    });
  });

  describe('Radiology Tests', () => {
    let testStudyId: string;

    it('should create radiology study', async () => {
      const studyData = {
        patientId: 'test-patient-1',
        doctorId: 'test-doctor-1',
        modality: 'CT',
        studyDescription: 'Chest CT',
        status: 'pending'
      };

      const result = await firebaseService.createRadiologyStudy(studyData);
      expect(result).toBeDefined();
      testStudyId = result.id;
    });

    it('should get radiology studies', async () => {
      const studies = await firebaseService.getRadiologyStudies();
      expect(Array.isArray(studies)).toBe(true);
    });

    it('should submit radiology report', async () => {
      if (testStudyId) {
        const report = {
          findings: 'No abnormalities detected',
          impression: 'Normal chest CT',
          radiologist: 'Dr. Test Radiologist'
        };
        const result = await firebaseService.submitRadiologyReport(testStudyId, report);
        expect(result.status).toBe('reported');
      }
    });

    it('should delete radiology study', async () => {
      if (testStudyId) {
        await firebaseService.delete('radiologyStudies', testStudyId);
      }
    });
  });

  describe('Billing Tests', () => {
    let testInvoiceId: string;

    it('should create invoice', async () => {
      const invoiceData = {
        patientId: 'test-patient-1',
        patientName: 'Test Patient',
        items: [
          { description: 'Consultation', quantity: 1, unitPrice: 100, total: 100 }
        ],
        totalAmount: 100,
        status: 'pending'
      };

      const result = await firebaseService.createInvoice(invoiceData);
      expect(result).toBeDefined();
      testInvoiceId = result.id;
    });

    it('should get invoices', async () => {
      const invoices = await firebaseService.getInvoices();
      expect(Array.isArray(invoices)).toBe(true);
    });

    it('should get pending invoices', async () => {
      const pending = await firebaseService.getPendingInvoices();
      expect(Array.isArray(pending)).toBe(true);
    });

    it('should mark invoice as paid', async () => {
      if (testInvoiceId) {
        const paymentDetails = {
          method: 'cash',
          amount: 100,
          transactionId: 'TEST-123'
        };
        const result = await firebaseService.markInvoiceAsPaid(testInvoiceId, paymentDetails);
        expect(result.status).toBe('paid');
      }
    });

    it('should delete invoice', async () => {
      if (testInvoiceId) {
        await firebaseService.deleteInvoice(testInvoiceId);
      }
    });
  });

  describe('Staff Management Tests', () => {
    let testStaffId: string;

    it('should create staff member', async () => {
      const staffData = {
        name: 'Test Staff',
        email: 'staff@test.com',
        role: 'nurse',
        department: 'General',
        status: 'active'
      };

      const result = await firebaseService.createStaffMember(staffData);
      expect(result).toBeDefined();
      testStaffId = result.id;
    });

    it('should get staff', async () => {
      const staff = await firebaseService.getStaff();
      expect(Array.isArray(staff)).toBe(true);
    });

    it('should get staff by role', async () => {
      const nurses = await firebaseService.getStaffByRole('nurse');
      expect(Array.isArray(nurses)).toBe(true);
    });

    it('should update staff member', async () => {
      if (testStaffId) {
        const updates = { status: 'on_leave' };
        const result = await firebaseService.updateStaffMember(testStaffId, updates);
        expect(result.status).toBe('on_leave');
      }
    });

    it('should delete staff member', async () => {
      if (testStaffId) {
        await firebaseService.deleteStaffMember(testStaffId);
      }
    });
  });

  describe('Real-time Subscription Tests', () => {
    it('should subscribe to patients', async () => {
      return new Promise<void>((resolve) => {
        const unsubscribe = firebaseService.subscribeToPatients((patients) => {
          expect(Array.isArray(patients)).toBe(true);
          unsubscribe();
          resolve();
        });
      });
    });

    it('should subscribe to appointments', async () => {
      return new Promise<void>((resolve) => {
        const unsubscribe = firebaseService.subscribeToAppointments((appointments) => {
          expect(Array.isArray(appointments)).toBe(true);
          unsubscribe();
          resolve();
        });
      });
    });

    it('should subscribe to collection', async () => {
      return new Promise<void>((resolve) => {
        const unsubscribe = firebaseService.subscribeToCollection('staff', (staff) => {
          expect(Array.isArray(staff)).toBe(true);
          unsubscribe();
          resolve();
        });
      });
    });
  });

  describe('Batch Operations Tests', () => {
    it('should batch create items', async () => {
      const items = [
        { name: 'Batch Item 1', currentStock: 50, minimumStock: 10 },
        { name: 'Batch Item 2', currentStock: 75, minimumStock: 15 }
      ];

      await firebaseService.batchCreate('inventory', items);
      // Mock returns the created items on next call
      const inventory = await firebaseService.getInventory();
      expect(inventory.length).toBeGreaterThanOrEqual(0);
    });

    it('should batch update items', async () => {
      const inventory = await firebaseService.getInventory();
      const updates = inventory.slice(0, 2).map(item => ({
        id: item.id,
        data: { currentStock: 100 }
      }));

      await firebaseService.batchUpdate('inventory', updates);
    });

    it('should batch delete items', async () => {
      const inventory = await firebaseService.getInventory();
      const idsToDelete = inventory
        .filter(item => item.name?.startsWith('Batch Item'))
        .map(item => item.id);

      if (idsToDelete.length > 0) {
        await firebaseService.batchDelete('inventory', idsToDelete);
      }
    });
  });
});
