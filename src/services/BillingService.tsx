// BillingService - Firebase version
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    patients?: number;
    staff?: number;
    storage?: string;
  };
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface UsageLimits {
  patients: { used: number; limit: number };
  staff: { used: number; limit: number };
  storage: { used: string; limit: string };
}

export interface BillingDashboard {
  subscription: Subscription | null;
  usage: UsageLimits;
  invoices: any[];
}

export class BillingService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api/billing'; // Local API endpoint
    console.log('BillingService initialized (Firebase mode)');
  }

  // Get available subscription plans
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      // Return mock plans for now
      return [
        {
          id: 'basic',
          name: 'Basic Plan',
          price: 29.99,
          currency: 'USD',
          interval: 'month',
          features: [
            'Up to 100 patients',
            'Basic reporting',
            '5 staff members',
            '10GB storage'
          ],
          limits: {
            patients: 100,
            staff: 5,
            storage: '10GB'
          }
        },
        {
          id: 'professional',
          name: 'Professional Plan',
          price: 99.99,
          currency: 'USD',
          interval: 'month',
          features: [
            'Up to 500 patients',
            'Advanced reporting',
            '20 staff members',
            '50GB storage',
            'Priority support'
          ],
          limits: {
            patients: 500,
            staff: 20,
            storage: '50GB'
          }
        },
        {
          id: 'enterprise',
          name: 'Enterprise Plan',
          price: 299.99,
          currency: 'USD',
          interval: 'month',
          features: [
            'Unlimited patients',
            'Custom reporting',
            'Unlimited staff',
            '500GB storage',
            '24/7 support',
            'Custom integrations'
          ],
          limits: {
            patients: -1,
            staff: -1,
            storage: '500GB'
          }
        }
      ];
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      throw error;
    }
  }

  // Get current user subscription
  async getCurrentSubscription(userId: string): Promise<Subscription | null> {
    try {
      // Mock subscription for demo
      return {
        id: 'sub_demo',
        userId,
        planId: 'professional',
        status: 'active',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: false
      };
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
  }

  // Create checkout session
  async createCheckoutSession(planId: string): Promise<{ url: string }> {
    console.log('Creating checkout session for plan:', planId);
    // Mock checkout URL
    return {
      url: '/pricing?checkout=' + planId
    };
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    console.log('Cancelling subscription:', subscriptionId);
    return true;
  }

  // Format currency for display
  formatCurrency(amount: number, currency: string = 'USD'): string {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return `${currency} ${amount.toFixed(2)}`;
    }
  }

  // Test connection
  async testConnection(): Promise<void> {
    console.log('BillingService connection test - OK');
    return Promise.resolve();
  }
}

export default new BillingService();
