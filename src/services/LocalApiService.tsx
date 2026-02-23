// Local API service that works without external dependencies
import { SubscriptionPlan } from './BillingService';

interface LocalApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  source: 'local';
  timestamp: string;
}

// Create Local API Service using object pattern
const createLocalApiService = () => {
  let initialized = false;
  
  // Default subscription plans
  const subscription_plans = [
    {
      id: 'plan-starter',
      name: 'Starter',
      name_ar: 'باقة المبتدئين',
      description: 'Perfect for small clinics',
      description_ar: 'مثالية للعيادات الصغيرة',
      price: 49.99,
      currency: 'USD',
      billing_cycle: 'monthly',
      max_users: 5,
      max_patients: 500,
      features: {
        appointment_booking: true,
        patient_management: true,
        basic_reports: true,
        advanced_reports: false,
        lab_integration: false,
        pharmacy_management: false
      },
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'plan-professional',
      name: 'Professional',
      name_ar: 'باقة المحترفين',
      description: 'For growing medical practices',
      description_ar: 'للممارسات الطبية النامية',
      price: 99.99,
      currency: 'USD',
      billing_cycle: 'monthly',
      max_users: 15,
      max_patients: 2000,
      features: {
        appointment_booking: true,
        patient_management: true,
        basic_reports: true,
        advanced_reports: true,
        lab_integration: true,
        pharmacy_management: true,
        radiology_management: false,
        billing_integration: true
      },
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'plan-enterprise',
      name: 'Enterprise',
      name_ar: 'باقة المؤسسات',
      description: 'For large hospitals and clinics',
      description_ar: 'للمستشفيات والعيادات الكبيرة',
      price: 199.99,
      currency: 'USD',
      billing_cycle: 'monthly',
      max_users: 50,
      max_patients: 10000,
      features: {
        appointment_booking: true,
        patient_management: true,
        basic_reports: true,
        advanced_reports: true,
        lab_integration: true,
        pharmacy_management: true,
        radiology_management: true,
        billing_integration: true,
        api_access: true
      },
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // Server health status
  const server_health = {
    status: 'healthy',
    overall: 'operational',
    timestamp: new Date().toISOString(),
    server_id: 'local-api-service',
    version: '1.0.0',
    components: {
      api: { status: 'healthy', healthy: true },
      local_storage: { status: 'operational', healthy: true },
      subscription_plans: { status: 'available', healthy: true }
    },
    capabilities: {
      database_operations: true,
      file_storage: true,
      subscription_management: true,
      offline_mode: false,
      local_mode: true
    }
  };

  // Server info
  const server_info = {
    server: 'Hospital Management System - Local API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    mode: 'local',
    authentication: {
      required: false,
      local_mode: true,
      note: 'Running in local mode without external dependencies'
    },
    endpoints: {
      available: ['health', 'ping', 'info', 'subscription-plans', 'test-connection']
    },
    database: {
      connected: true,
      type: 'localStorage',
      note: 'Using browser localStorage for data persistence'
    },
    external_dependencies: {
      firebase: 'configured',
      paddle: 'simulated',
      note: 'All external services are simulated locally'
    }
  };

  // Local data storage
  const localData: Record<string, any> = {};

  console.log('🏠 Initializing local API service...');
  initialized = true;
  console.log('✅ Local API service initialized');

  // Simulate network delay for realistic behavior
  const simulateDelay = async (ms: number = 100): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const testLocalStorage = (): boolean => {
    try {
      const testKey = 'local-api-test';
      const testValue = 'test-value';
      
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      return retrieved === testValue;
    } catch (error) {
      console.error('localStorage test failed:', error);
      return false;
    }
  };

  // Return the service object
  const service = {
    // Health check
    async health(): Promise<LocalApiResponse> {
      await simulateDelay(50);
      
      return {
        success: true,
        data: server_health,
        source: 'local',
        timestamp: new Date().toISOString()
      };
    },

    // Ping test
    async ping(): Promise<LocalApiResponse> {
      await simulateDelay(20);
      
      return {
        success: true,
        data: {
          pong: true,
          timestamp: new Date().toISOString(),
          server: 'local-api-service',
          status: 'ok'
        },
        source: 'local',
        timestamp: new Date().toISOString()
      };
    },

    // Server info
    async info(): Promise<LocalApiResponse> {
      await simulateDelay(30);
      
      return {
        success: true,
        data: server_info,
        source: 'local',
        timestamp: new Date().toISOString()
      };
    },

    // Get subscription plans
    async getSubscriptionPlans(): Promise<LocalApiResponse<SubscriptionPlan[]>> {
      await simulateDelay(100);
      
      return {
        success: true,
        data: subscription_plans,
        source: 'local',
        timestamp: new Date().toISOString()
      };
    },

    // Test connection (always successful in local mode)
    async testConnection(): Promise<LocalApiResponse> {
      await simulateDelay(150);
      
      return {
        success: true,
        data: {
          status: 'connected',
          message: 'Local API service is operational',
          tests: {
            localStorage: testLocalStorage(),
            subscriptionPlans: true,
            healthCheck: true
          }
        },
        source: 'local',
        timestamp: new Date().toISOString()
      };
    },

    // Get current status for UI
    getStatus() {
      return {
        initialized: initialized,
        mode: 'local',
        healthy: true,
        capabilities: {
          database_operations: true,
          file_storage: false,
          subscription_management: true,
          offline_mode: true
        }
      };
    },

    // Store data locally
    async setData(key: string, data: any): Promise<LocalApiResponse> {
      try {
        localData[key] = data;
        
        // Also store in localStorage for persistence
        localStorage.setItem(`local-api-${key}`, JSON.stringify(data));
        
        return {
          success: true,
          data: { key, stored: true },
          source: 'local',
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Storage failed',
          source: 'local',
          timestamp: new Date().toISOString()
        };
      }
    },

    // Get data locally
    async getData(key: string): Promise<LocalApiResponse> {
      try {
        let data = localData[key];
        
        // Try localStorage if not in memory
        if (data === undefined) {
          const stored = localStorage.getItem(`local-api-${key}`);
          if (stored) {
            data = JSON.parse(stored);
            localData[key] = data; // Cache in memory
          }
        }
        
        return {
          success: true,
          data,
          source: 'local',
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Retrieval failed',
          source: 'local',
          timestamp: new Date().toISOString()
        };
      }
    }
  };

  return service;
};

// Create singleton instance
export const localApiService = createLocalApiService();
export default localApiService;
