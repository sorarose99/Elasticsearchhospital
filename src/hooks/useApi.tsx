/**
 * React hooks for API state management and real-time updates
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService, ApiResponse } from '../services/ApiService';

// Generic API hook for CRUD operations
export function useApi<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const refetch = useCallback(() => {
    setRefetchTrigger(prev => prev + 1);
  }, []);

  // Generic fetch function
  const fetchData = useCallback(async (params?: Record<string, any>) => {
    setLoading(true);
    setError(null);
    
    try {
      // This would need to be implemented based on the specific API service method
      // For now, we'll use a placeholder
      const response = await fetch(`/api${endpoint}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error('API request failed');
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refetchTrigger]);

  return {
    data,
    loading,
    error,
    refetch,
    setData
  };
}

// Specific hooks for different entities
export function usePatients(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) {
  const [patients, setPatients] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getPatients(params);
      if (response.success && response.data) {
        setPatients(response.data.patients);
        setTotal(response.data.total);
      } else {
        throw new Error(response.error || 'Failed to fetch patients');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [params]);

  const createPatient = useCallback(async (patientData: any) => {
    const response = await apiService.createPatient(patientData);
    if (response.success) {
      fetchPatients(); // Refresh the list
    }
    return response;
  }, [fetchPatients]);

  const updatePatient = useCallback(async (id: string, patientData: any) => {
    const response = await apiService.updatePatient(id, patientData);
    if (response.success) {
      fetchPatients(); // Refresh the list
    }
    return response;
  }, [fetchPatients]);

  const deletePatient = useCallback(async (id: string) => {
    const response = await apiService.deletePatient(id);
    if (response.success) {
      fetchPatients(); // Refresh the list
    }
    return response;
  }, [fetchPatients]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Subscribe to real-time updates
  useEffect(() => {
    const subscription = apiService.subscribeToPatients((payload) => {
      console.log('Patient updated:', payload);
      fetchPatients(); // Refresh data on change
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchPatients]);

  return {
    patients,
    total,
    loading,
    error,
    refetch: fetchPatients,
    createPatient,
    updatePatient,
    deletePatient
  };
}

export function useAppointments(params?: {
  date?: string;
  doctor_id?: string;
  patient_id?: string;
  status?: string;
}) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getAppointments(params);
      if (response.success && response.data) {
        setAppointments(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch appointments');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [params]);

  const createAppointment = useCallback(async (appointmentData: any) => {
    const response = await apiService.createAppointment(appointmentData);
    if (response.success) {
      fetchAppointments(); // Refresh the list
    }
    return response;
  }, [fetchAppointments]);

  const updateAppointment = useCallback(async (id: string, appointmentData: any) => {
    const response = await apiService.updateAppointment(id, appointmentData);
    if (response.success) {
      fetchAppointments(); // Refresh the list
    }
    return response;
  }, [fetchAppointments]);

  const cancelAppointment = useCallback(async (id: string, reason?: string) => {
    const response = await apiService.cancelAppointment(id, reason);
    if (response.success) {
      fetchAppointments(); // Refresh the list
    }
    return response;
  }, [fetchAppointments]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Subscribe to real-time updates
  useEffect(() => {
    const subscription = apiService.subscribeToAppointments((payload) => {
      console.log('Appointment updated:', payload);
      fetchAppointments(); // Refresh data on change
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchAppointments]);

  return {
    appointments,
    loading,
    error,
    refetch: fetchAppointments,
    createAppointment,
    updateAppointment,
    cancelAppointment
  };
}

export function useStaff(params?: {
  role?: string;
  department?: string;
  status?: string;
}) {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getStaff(params);
      if (response.success && response.data) {
        setStaff(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch staff');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [params]);

  const createStaff = useCallback(async (staffData: any) => {
    const response = await apiService.createStaff(staffData);
    if (response.success) {
      fetchStaff(); // Refresh the list
    }
    return response;
  }, [fetchStaff]);

  const updateStaff = useCallback(async (id: string, staffData: any) => {
    const response = await apiService.updateStaff(id, staffData);
    if (response.success) {
      fetchStaff(); // Refresh the list
    }
    return response;
  }, [fetchStaff]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  return {
    staff,
    loading,
    error,
    refetch: fetchStaff,
    createStaff,
    updateStaff
  };
}

export function useMedicalRecords(patientId: string) {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    if (!patientId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getMedicalRecords(patientId);
      if (response.success && response.data) {
        setRecords(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch medical records');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  const createRecord = useCallback(async (recordData: any) => {
    const response = await apiService.createMedicalRecord(recordData);
    if (response.success) {
      fetchRecords(); // Refresh the list
    }
    return response;
  }, [fetchRecords]);

  const updateRecord = useCallback(async (id: string, recordData: any) => {
    const response = await apiService.updateMedicalRecord(id, recordData);
    if (response.success) {
      fetchRecords(); // Refresh the list
    }
    return response;
  }, [fetchRecords]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return {
    records,
    loading,
    error,
    refetch: fetchRecords,
    createRecord,
    updateRecord
  };
}

export function useLabOrders(params?: {
  patient_id?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
}) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getLabOrders(params);
      if (response.success && response.data) {
        setOrders(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch lab orders');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [params]);

  const createOrder = useCallback(async (orderData: any) => {
    const response = await apiService.createLabOrder(orderData);
    if (response.success) {
      fetchOrders(); // Refresh the list
    }
    return response;
  }, [fetchOrders]);

  const updateResults = useCallback(async (orderId: string, results: any) => {
    const response = await apiService.updateLabResults(orderId, results);
    if (response.success) {
      fetchOrders(); // Refresh the list
    }
    return response;
  }, [fetchOrders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    createOrder,
    updateResults
  };
}

export function useDashboardStats(dateRange?: { from: string; to: string }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getDashboardStats(dateRange);
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch dashboard stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
}

// File upload hook
export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File, folder: string) => {
    setUploading(true);
    setError(null);
    
    try {
      const response = await apiService.uploadFile(file, folder);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Upload failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
    }
  }, []);

  return {
    uploadFile,
    uploading,
    error
  };
}