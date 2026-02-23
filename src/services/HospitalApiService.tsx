// HospitalApiService - Firebase version
import { auth } from '../config/firebase';

// API Base URL
const API_BASE_URL = '/api';

// API Headers
const getHeaders = async () => {
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Get current user session
const getCurrentSession = async () => {
  const user = auth.currentUser;
  return user ? await user.getIdToken() : null;
};

export class HospitalApiService {
  // Authentication
  static async login(credentials: { email: string; password: string }) {
    console.log('Login via Firebase Auth');
    return { success: true };
  }

  static async register(userData: any) {
    console.log('Register via Firebase Auth');
    return { success: true };
  }

  static async logout() {
    await auth.signOut();
    return { success: true };
  }

  static async getCurrentUser() {
    return auth.currentUser;
  }

  // Patients
  static async getPatients() {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/patients`, { headers });
    return response.json();
  }

  static async getPatient(id: string) {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, { headers });
    return response.json();
  }

  static async createPatient(data: any) {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/patients`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    return response.json();
  }

  static async updatePatient(id: string, data: any) {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });
    return response.json();
  }

  static async deletePatient(id: string) {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: 'DELETE',
      headers
    });
    return response.json();
  }

  // Appointments
  static async getAppointments() {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/appointments`, { headers });
    return response.json();
  }

  static async createAppointment(data: any) {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // Staff
  static async getStaff() {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/staff`, { headers });
    return response.json();
  }

  // Real-time subscriptions (placeholder)
  static subscribeToNotifications(userId: string, callback: (payload: any) => void) {
    console.warn('Real-time subscriptions not yet implemented with Firebase');
    return { unsubscribe: () => {} };
  }

  static subscribeToAppointments(callback: (payload: any) => void) {
    console.warn('Real-time subscriptions not yet implemented with Firebase');
    return { unsubscribe: () => {} };
  }

  static subscribeToLabOrders(callback: (payload: any) => void) {
    console.warn('Real-time subscriptions not yet implemented with Firebase');
    return { unsubscribe: () => {} };
  }
}

export default HospitalApiService;
