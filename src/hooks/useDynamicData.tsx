/**
 * Dynamic Data Management Hook
 * Provides real-time data fetching and state management for the hospital system
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { dynamicApiService, ApiResponse } from '../services/DynamicApiService';
import type { 
  Patient, 
  Appointment, 
  LabOrder, 
  Prescription, 
  Invoice, 
  Payment, 
  RadiologyStudy, 
  DashboardStats,
  Analytics
} from '../services/DynamicApiService';

// Generic hook state interface
interface DataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

// Generic hook return interface
interface DataHookReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  lastUpdated: Date | null;
}

// Hook options interface
interface UseDataOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
  enableRealTime?: boolean;
}

// ============================================================================
// GENERIC DATA HOOK
// ============================================================================

function useGenericData<T>(
  fetchFunction: () => Promise<ApiResponse<T>>,
  dependencies: any[] = [],
  options: UseDataOptions = {}
): DataHookReturn<T> {
  const { autoRefresh = false, refreshInterval = 30000, enableRealTime = false } = options;
  
  const [state, setState] = useState<DataState<T>>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null
  });

  const mountedRef = useRef(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    if (!mountedRef.current) return;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await fetchFunction();
      
      if (!mountedRef.current) return;
      
      if (result.success) {
        setState({
          data: result.data || null,
          loading: false,
          error: null,
          lastUpdated: new Date()
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: result.error || 'Failed to fetch data',
          lastUpdated: null
        });
      }
    } catch (error) {
      if (!mountedRef.current) return;
      
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        lastUpdated: null
      });
    }
  }, [fetchFunction]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, dependencies);

  // Auto-refresh setup
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      intervalRef.current = setInterval(fetchData, refreshInterval);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval, fetchData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    refresh: fetchData,
    lastUpdated: state.lastUpdated
  };
}

// ============================================================================
// PATIENT DATA HOOKS
// ============================================================================

export function usePatients(options?: UseDataOptions): DataHookReturn<Patient[]> & {
  createPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'createdBy'>) => Promise<ApiResponse<Patient>>;
  updatePatient: (id: string, patient: Partial<Patient>) => Promise<ApiResponse<Patient>>;
} {
  const hookResult = useGenericData(
    () => dynamicApiService.getPatients(),
    [],
    { autoRefresh: true, refreshInterval: 60000, ...options }
  );

  const createPatient = useCallback(async (patient: Omit<Patient, 'id' | 'createdAt' | 'createdBy'>) => {
    const result = await dynamicApiService.createPatient(patient);
    if (result.success) {
      hookResult.refresh(); // Refresh the list
    }
    return result;
  }, [hookResult.refresh]);

  const updatePatient = useCallback(async (id: string, patient: Partial<Patient>) => {
    const result = await dynamicApiService.updatePatient(id, patient);
    if (result.success) {
      hookResult.refresh(); // Refresh the list
    }
    return result;
  }, [hookResult.refresh]);

  return {
    ...hookResult,
    createPatient,
    updatePatient
  };
}

export function usePatient(patientId: string | null): DataHookReturn<Patient> {
  return useGenericData(
    () => patientId ? dynamicApiService.getPatient(patientId) : Promise.resolve({ success: false, error: 'No patient ID' }),
    [patientId],
    { autoRefresh: true, refreshInterval: 30000 }
  );
}

// ============================================================================
// APPOINTMENT DATA HOOKS
// ============================================================================

export function useAppointments(options?: UseDataOptions): DataHookReturn<Appointment[]> & {
  createAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'createdBy'>) => Promise<ApiResponse<Appointment>>;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => Promise<ApiResponse<Appointment>>;
} {
  const hookResult = useGenericData(
    () => dynamicApiService.getAppointments(),
    [],
    { autoRefresh: true, refreshInterval: 30000, ...options }
  );

  const createAppointment = useCallback(async (appointment: Omit<Appointment, 'id' | 'createdAt' | 'createdBy'>) => {
    const result = await dynamicApiService.createAppointment(appointment);
    if (result.success) {
      hookResult.refresh(); // Refresh the list
    }
    return result;
  }, [hookResult.refresh]);

  const updateAppointment = useCallback(async (id: string, appointment: Partial<Appointment>) => {
    const result = await dynamicApiService.updateAppointment(id, appointment);
    if (result.success) {
      hookResult.refresh(); // Refresh the list
    }
    return result;
  }, [hookResult.refresh]);

  return {
    ...hookResult,
    createAppointment,
    updateAppointment
  };
}

// ============================================================================
// LABORATORY DATA HOOKS
// ============================================================================

export function useLabOrders(options?: UseDataOptions): DataHookReturn<LabOrder[]> & {
  createLabOrder: (labOrder: Omit<LabOrder, 'id' | 'createdAt' | 'orderedBy'>) => Promise<ApiResponse<LabOrder>>;
  updateLabResults: (orderId: string, results: LabOrder['results']) => Promise<ApiResponse<LabOrder>>;
} {
  const hookResult = useGenericData(
    () => dynamicApiService.getLabOrders(),
    [],
    { autoRefresh: true, refreshInterval: 30000, ...options }
  );

  const createLabOrder = useCallback(async (labOrder: Omit<LabOrder, 'id' | 'createdAt' | 'orderedBy'>) => {
    const result = await dynamicApiService.createLabOrder(labOrder);
    if (result.success) {
      hookResult.refresh(); // Refresh the list
    }
    return result;
  }, [hookResult.refresh]);

  const updateLabResults = useCallback(async (orderId: string, results: LabOrder['results']) => {
    const result = await dynamicApiService.updateLabResults(orderId, results);
    if (result.success) {
      hookResult.refresh(); // Refresh the list
    }
    return result;
  }, [hookResult.refresh]);

  return {
    ...hookResult,
    createLabOrder,
    updateLabResults
  };
}

// ============================================================================
// PHARMACY DATA HOOKS
// ============================================================================

export function usePrescriptions(options?: UseDataOptions): DataHookReturn<Prescription[]> & {
  createPrescription: (prescription: Omit<Prescription, 'id' | 'createdAt' | 'prescribedBy'>) => Promise<ApiResponse<Prescription>>;
} {
  const hookResult = useGenericData(
    () => dynamicApiService.getPrescriptions(),
    [],
    { autoRefresh: true, refreshInterval: 45000, ...options }
  );

  const createPrescription = useCallback(async (prescription: Omit<Prescription, 'id' | 'createdAt' | 'prescribedBy'>) => {
    const result = await dynamicApiService.createPrescription(prescription);
    if (result.success) {
      hookResult.refresh(); // Refresh the list
    }
    return result;
  }, [hookResult.refresh]);

  return {
    ...hookResult,
    createPrescription
  };
}

// ============================================================================
// BILLING DATA HOOKS
// ============================================================================

export function useInvoices(options?: UseDataOptions): DataHookReturn<Invoice[]> & {
  createInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'createdBy'>) => Promise<ApiResponse<Invoice>>;
  updateInvoiceStatus: (id: string, status: Invoice['status']) => Promise<ApiResponse<Invoice>>;
} {
  const hookResult = useGenericData(
    () => dynamicApiService.getInvoices(),
    [],
    { autoRefresh: true, refreshInterval: 60000, ...options }
  );

  const createInvoice = useCallback(async (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'createdBy'>) => {
    const result = await dynamicApiService.createInvoice(invoice);
    if (result.success) {
      hookResult.refresh(); // Refresh the list
    }
    return result;
  }, [hookResult.refresh]);

  const updateInvoiceStatus = useCallback(async (id: string, status: Invoice['status']) => {
    const result = await dynamicApiService.updateInvoiceStatus(id, status);
    if (result.success) {
      hookResult.refresh(); // Refresh the list
    }
    return result;
  }, [hookResult.refresh]);

  return {
    ...hookResult,
    createInvoice,
    updateInvoiceStatus
  };
}

export function usePayments(options?: UseDataOptions): DataHookReturn<Payment[]> & {
  createPayment: (payment: Omit<Payment, 'id' | 'createdAt' | 'recordedBy'>) => Promise<ApiResponse<Payment>>;
} {
  const hookResult = useGenericData(
    () => dynamicApiService.getPayments(),
    [],
    { autoRefresh: true, refreshInterval: 60000, ...options }
  );

  const createPayment = useCallback(async (payment: Omit<Payment, 'id' | 'createdAt' | 'recordedBy'>) => {
    const result = await dynamicApiService.createPayment(payment);
    if (result.success) {
      hookResult.refresh(); // Refresh the list
    }
    return result;
  }, [hookResult.refresh]);

  return {
    ...hookResult,
    createPayment
  };
}

// ============================================================================
// RADIOLOGY DATA HOOKS
// ============================================================================

export function useRadiologyStudies(options?: UseDataOptions): DataHookReturn<RadiologyStudy[]> & {
  createStudy: (study: Omit<RadiologyStudy, 'id' | 'studyInstanceUID' | 'createdAt' | 'createdBy'>) => Promise<ApiResponse<RadiologyStudy>>;
  updateStudyStatus: (id: string, status: RadiologyStudy['status'], images?: number) => Promise<ApiResponse<RadiologyStudy>>;
} {
  const hookResult = useGenericData(
    () => dynamicApiService.getRadiologyStudies(),
    [],
    { autoRefresh: true, refreshInterval: 45000, ...options }
  );

  const createStudy = useCallback(async (study: Omit<RadiologyStudy, 'id' | 'studyInstanceUID' | 'createdAt' | 'createdBy'>) => {
    const result = await dynamicApiService.createRadiologyStudy(study);
    if (result.success) {
      hookResult.refresh(); // Refresh the list
    }
    return result;
  }, [hookResult.refresh]);

  const updateStudyStatus = useCallback(async (id: string, status: RadiologyStudy['status'], images?: number) => {
    const result = await dynamicApiService.updateStudyStatus(id, status, images);
    if (result.success) {
      hookResult.refresh(); // Refresh the list
    }
    return result;
  }, [hookResult.refresh]);

  return {
    ...hookResult,
    createStudy,
    updateStudyStatus
  };
}

// ============================================================================
// DASHBOARD AND ANALYTICS HOOKS
// ============================================================================

export function useDashboardStats(): DataHookReturn<DashboardStats> {
  return useGenericData(
    () => dynamicApiService.getDashboardStats(),
    [],
    { autoRefresh: true, refreshInterval: 30000 }
  );
}

export function useAnalytics(dateRange?: string, department?: string): DataHookReturn<Analytics> {
  return useGenericData(
    () => dynamicApiService.getAnalytics(dateRange, department),
    [dateRange, department],
    { autoRefresh: true, refreshInterval: 60000 }
  );
}

// ============================================================================
// COMBINED DATA HOOKS FOR DASHBOARD VIEWS
// ============================================================================

export function useDoctorDashboard() {
  const appointments = useAppointments({ refreshInterval: 30000 });
  const patients = usePatients({ refreshInterval: 60000 });
  const labOrders = useLabOrders({ refreshInterval: 30000 });
  const stats = useDashboardStats();

  return {
    appointments,
    patients,
    labOrders,
    stats,
    loading: appointments.loading || patients.loading || labOrders.loading || stats.loading,
    error: appointments.error || patients.error || labOrders.error || stats.error,
    refresh: async () => {
      await Promise.all([
        appointments.refresh(),
        patients.refresh(),
        labOrders.refresh(),
        stats.refresh()
      ]);
    }
  };
}

export function useLabDashboard() {
  const labOrders = useLabOrders({ refreshInterval: 15000 }); // More frequent refresh for lab
  const patients = usePatients({ refreshInterval: 60000 });
  const stats = useDashboardStats();

  return {
    labOrders,
    patients,
    stats,
    loading: labOrders.loading || patients.loading || stats.loading,
    error: labOrders.error || patients.error || stats.error,
    refresh: async () => {
      await Promise.all([
        labOrders.refresh(),
        patients.refresh(),
        stats.refresh()
      ]);
    }
  };
}

export function usePharmacyDashboard() {
  const prescriptions = usePrescriptions({ refreshInterval: 30000 });
  const patients = usePatients({ refreshInterval: 60000 });
  const stats = useDashboardStats();

  return {
    prescriptions,
    patients,
    stats,
    loading: prescriptions.loading || patients.loading || stats.loading,
    error: prescriptions.error || patients.error || stats.error,
    refresh: async () => {
      await Promise.all([
        prescriptions.refresh(),
        patients.refresh(),
        stats.refresh()
      ]);
    }
  };
}

export function useRadiologyDashboard() {
  const studies = useRadiologyStudies({ refreshInterval: 30000 });
  const patients = usePatients({ refreshInterval: 60000 });
  const stats = useDashboardStats();

  return {
    studies,
    patients,
    stats,
    loading: studies.loading || patients.loading || stats.loading,
    error: studies.error || patients.error || stats.error,
    refresh: async () => {
      await Promise.all([
        studies.refresh(),
        patients.refresh(),
        stats.refresh()
      ]);
    }
  };
}

export function useBillingDashboard() {
  const invoices = useInvoices({ refreshInterval: 60000 });
  const payments = usePayments({ refreshInterval: 60000 });
  const patients = usePatients({ refreshInterval: 60000 });
  const stats = useDashboardStats();

  return {
    invoices,
    payments,
    patients,
    stats,
    loading: invoices.loading || payments.loading || patients.loading || stats.loading,
    error: invoices.error || payments.error || patients.error || stats.error,
    refresh: async () => {
      await Promise.all([
        invoices.refresh(),
        payments.refresh(),
        patients.refresh(),
        stats.refresh()
      ]);
    }
  };
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

export function useDataSyncStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updateSyncTime = useCallback(() => {
    setLastSyncTime(new Date());
  }, []);

  return {
    isOnline,
    lastSyncTime,
    updateSyncTime
  };
}