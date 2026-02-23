// PaddleService - Deprecated (replaced with Firebase)
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
}

export class PaddleService {
  private baseUrl = '/api/paddle';

  constructor() {
    console.warn('⚠️ PaddleService is deprecated. Using local billing instead.');
  }

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return [];
  }

  async createCheckoutSession(planId: string): Promise<{ url: string }> {
    return { url: '/pricing' };
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    return true;
  }
}

export default new PaddleService();
