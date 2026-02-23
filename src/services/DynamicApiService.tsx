/**
 * Dynamic API Service for Hospital Management System
 * Connects to Firebase backend with real-time data
 */

// API Configuration
const API_BASE_URL = '/api';

// Response wrapper interface
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class DynamicApiService {
  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Request failed',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  }

  // Patients
  static async getPatients() {
    return this.makeRequest('/patients');
  }

  static async getPatient(id: string) {
    return this.makeRequest(`/patients/${id}`);
  }

  static async createPatient(data: any) {
    return this.makeRequest('/patients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updatePatient(id: string, data: any) {
    return this.makeRequest(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deletePatient(id: string) {
    return this.makeRequest(`/patients/${id}`, {
      method: 'DELETE',
    });
  }

  // Appointments
  static async getAppointments() {
    return this.makeRequest('/appointments');
  }

  static async createAppointment(data: any) {
    return this.makeRequest('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateAppointment(id: string, data: any) {
    return this.makeRequest(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteAppointment(id: string) {
    return this.makeRequest(`/appointments/${id}`, {
      method: 'DELETE',
    });
  }

  // Staff
  static async getStaff() {
    return this.makeRequest('/staff');
  }

  static async getStaffMember(id: string) {
    return this.makeRequest(`/staff/${id}`);
  }

  static async createStaffMember(data: any) {
    return this.makeRequest('/staff', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateStaffMember(id: string, data: any) {
    return this.makeRequest(`/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteStaffMember(id: string) {
    return this.makeRequest(`/staff/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  static async ping() {
    return this.makeRequest('/health');
  }
}

export default DynamicApiService;
