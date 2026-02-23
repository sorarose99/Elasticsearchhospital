/**
 * Comprehensive API Service for Hospital Management System
 * Handles all backend communications and data management with Firebase
 */

// Base API configuration
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8000/api/v1' 
  : 'https://api.hospitalmanagement.com/v1';

// Response wrapper interface
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Base entity interfaces
interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by?: string;
}

interface Patient extends BaseEntity {
  patient_number: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email?: string;
  address: string;
  emergency_contact: {
    name: string;
    phone: string;
    relationship: string;
  };
  insurance: {
    provider: string;
    policy_number: string;
    group_number?: string;
    coverage_type: string;
  };
  medical_history: string[];
  allergies: string[];
  current_medications: string[];
  blood_type?: string;
  status: 'active' | 'inactive' | 'deceased';
}

interface Appointment extends BaseEntity {
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  duration: number;
  type: 'consultation' | 'follow_up' | 'procedure' | 'emergency';
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  reason: string;
  notes?: string;
  reminder_sent: boolean;
}

interface Staff extends BaseEntity {
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  specialization?: string;
  license_number?: string;
  hire_date: string;
  status: 'active' | 'inactive' | 'on_leave';
  schedule: {
    monday?: { start: string; end: string };
    tuesday?: { start: string; end: string };
    wednesday?: { start: string; end: string };
    thursday?: { start: string; end: string };
    friday?: { start: string; end: string };
    saturday?: { start: string; end: string };
    sunday?: { start: string; end: string };
  };
}

interface MedicalRecord extends BaseEntity {
  patient_id: string;
  doctor_id: string;
  visit_date: string;
  visit_type: string;
  chief_complaint: string;
  history_of_present_illness: string;
  physical_examination: string;
  diagnosis: string[];
  treatment_plan: string;
  prescriptions: Array<{
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  follow_up_required: boolean;
  follow_up_date?: string;
  vital_signs: {
    temperature: number;
    blood_pressure: { systolic: number; diastolic: number };
    heart_rate: number;
    respiratory_rate: number;
    oxygen_saturation: number;
    weight: number;
    height: number;
  };
}

interface LabOrder extends BaseEntity {
  patient_id: string;
  doctor_id: string;
  order_date: string;
  tests: Array<{
    test_code: string;
    test_name: string;
    specimen_type: string;
    urgency: 'routine' | 'urgent' | 'stat';
  }>;
  status: 'ordered' | 'collected' | 'in_progress' | 'completed' | 'cancelled';
  results?: Array<{
    test_code: string;
    result: string;
    unit: string;
    reference_range: string;
    abnormal_flag?: 'high' | 'low' | 'critical';
  }>;
  technician_id?: string;
  completed_date?: string;
  notes?: string;
}

class ApiService {
  private static instance: ApiService;
  private authToken: string | null = null;
  
  private constructor() {}
  
  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Authentication methods
  async setAuthToken(token: string) {
    this.authToken = token;
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const headers = {
        'Content-Type': 'application/json',
        ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
        ...options.headers,
      };

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('API request failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Patient Management API
  async getPatients(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<ApiResponse<{ patients: Patient[]; total: number }>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    
    return this.makeRequest(`/patients?${queryParams.toString()}`);
  }

  async getPatient(id: string): Promise<ApiResponse<Patient>> {
    return this.makeRequest(`/patients/${id}`);
  }

  async createPatient(patient: Omit<Patient, keyof BaseEntity>): Promise<ApiResponse<Patient>> {
    return this.makeRequest('/patients', {
      method: 'POST',
      body: JSON.stringify(patient),
    });
  }

  async updatePatient(id: string, patient: Partial<Patient>): Promise<ApiResponse<Patient>> {
    return this.makeRequest(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patient),
    });
  }

  async deletePatient(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest(`/patients/${id}`, {
      method: 'DELETE',
    });
  }

  // Appointment Management API
  async getAppointments(params?: {
    date?: string;
    doctor_id?: string;
    patient_id?: string;
    status?: string;
  }): Promise<ApiResponse<Appointment[]>> {
    const queryParams = new URLSearchParams();
    if (params?.date) queryParams.append('date', params.date);
    if (params?.doctor_id) queryParams.append('doctor_id', params.doctor_id);
    if (params?.patient_id) queryParams.append('patient_id', params.patient_id);
    if (params?.status) queryParams.append('status', params.status);
    
    return this.makeRequest(`/appointments?${queryParams.toString()}`);
  }

  async createAppointment(appointment: Omit<Appointment, keyof BaseEntity>): Promise<ApiResponse<Appointment>> {
    return this.makeRequest('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointment),
    });
  }

  async updateAppointment(id: string, appointment: Partial<Appointment>): Promise<ApiResponse<Appointment>> {
    return this.makeRequest(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointment),
    });
  }

  async cancelAppointment(id: string, reason?: string): Promise<ApiResponse<Appointment>> {
    return this.makeRequest(`/appointments/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // Staff Management API
  async getStaff(params?: {
    role?: string;
    department?: string;
    status?: string;
  }): Promise<ApiResponse<Staff[]>> {
    const queryParams = new URLSearchParams();
    if (params?.role) queryParams.append('role', params.role);
    if (params?.department) queryParams.append('department', params.department);
    if (params?.status) queryParams.append('status', params.status);
    
    return this.makeRequest(`/staff?${queryParams.toString()}`);
  }

  async createStaff(staff: Omit<Staff, keyof BaseEntity>): Promise<ApiResponse<Staff>> {
    return this.makeRequest('/staff', {
      method: 'POST',
      body: JSON.stringify(staff),
    });
  }

  async updateStaff(id: string, staff: Partial<Staff>): Promise<ApiResponse<Staff>> {
    return this.makeRequest(`/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(staff),
    });
  }

  // Medical Records API
  async getMedicalRecords(patientId: string): Promise<ApiResponse<MedicalRecord[]>> {
    return this.makeRequest(`/patients/${patientId}/medical-records`);
  }

  async createMedicalRecord(record: Omit<MedicalRecord, keyof BaseEntity>): Promise<ApiResponse<MedicalRecord>> {
    return this.makeRequest('/medical-records', {
      method: 'POST',
      body: JSON.stringify(record),
    });
  }

  async updateMedicalRecord(id: string, record: Partial<MedicalRecord>): Promise<ApiResponse<MedicalRecord>> {
    return this.makeRequest(`/medical-records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(record),
    });
  }

  // Laboratory API
  async getLabOrders(params?: {
    patient_id?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<ApiResponse<LabOrder[]>> {
    const queryParams = new URLSearchParams();
    if (params?.patient_id) queryParams.append('patient_id', params.patient_id);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.date_from) queryParams.append('date_from', params.date_from);
    if (params?.date_to) queryParams.append('date_to', params.date_to);
    
    return this.makeRequest(`/lab-orders?${queryParams.toString()}`);
  }

  async createLabOrder(order: Omit<LabOrder, keyof BaseEntity>): Promise<ApiResponse<LabOrder>> {
    return this.makeRequest('/lab-orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  async updateLabResults(orderId: string, results: LabOrder['results']): Promise<ApiResponse<LabOrder>> {
    return this.makeRequest(`/lab-orders/${orderId}/results`, {
      method: 'PUT',
      body: JSON.stringify({ results }),
    });
  }

  // Analytics API
  async getDashboardStats(dateRange?: { from: string; to: string }): Promise<ApiResponse<{
    totalPatients: number;
    totalAppointments: number;
    totalRevenue: number;
    patientsByAge: Array<{ age_group: string; count: number }>;
    appointmentsByStatus: Array<{ status: string; count: number }>;
    revenueByMonth: Array<{ month: string; revenue: number }>;
  }>> {
    const queryParams = new URLSearchParams();
    if (dateRange?.from) queryParams.append('from', dateRange.from);
    if (dateRange?.to) queryParams.append('to', dateRange.to);
    
    return this.makeRequest(`/analytics/dashboard?${queryParams.toString()}`);
  }

  // Real-time updates using Firebase (placeholder for future implementation)
  subscribeToPatients(callback: (payload: any) => void) {
    console.warn('Real-time subscriptions not yet implemented with Firebase');
    return { unsubscribe: () => {} };
  }

  subscribeToAppointments(callback: (payload: any) => void) {
    console.warn('Real-time subscriptions not yet implemented with Firebase');
    return { unsubscribe: () => {} };
  }

  // File upload API
  async uploadFile(file: File, folder: string): Promise<ApiResponse<{ url: string; path: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      };
    }
  }
}

// Export singleton instance
export const apiService = ApiService.getInstance();

// Export types for use in components
export type {
  Patient,
  Appointment, 
  Staff,
  MedicalRecord,
  LabOrder,
  ApiResponse,
  BaseEntity
};