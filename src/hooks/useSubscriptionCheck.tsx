import { useState, useEffect, useCallback } from 'react';
import { useSupabaseAuth } from './useSupabaseAuth';
import { paddleService, SubscriptionData } from '../services/PaddleService';

interface SubscriptionLimits {
  canAddPatients: boolean;
  canAddUsers: boolean;
  storageExceeded: boolean;
  warnings: string[];
}

interface UpgradeSuggestion {
  shouldUpgrade: boolean;
  suggestedPlan: string | null;
  reasons: string[];
}

interface CurrentUsage {
  patients: number;
  users: number;
  storage: number; // in MB
}

export const useSubscriptionCheck = () => {
  const { user } = useSupabaseAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUsage, setCurrentUsage] = useState<CurrentUsage>({
    patients: 0,
    users: 0,
    storage: 0,
  });

  // Load subscription data
  const loadSubscription = useCallback(async () => {
    if (!user?.hospitalId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const subscriptionData = await paddleService.getSubscription(user.hospitalId);
      setSubscription(subscriptionData);
      
      // Load current usage statistics
      await loadUsageStatistics(user.hospitalId);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ في تحميل بيانات الاشتراك');
      console.error('Error loading subscription:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.hospitalId]);

  // Load current usage statistics
  const loadUsageStatistics = async (hospitalId: string) => {
    try {
      // You would typically fetch this from your hospital API
      // For now, we'll use placeholder data
      const response = await fetch(
        `https://${process.env.REACT_APP_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-89df438c/hospital/statistics/${hospitalId}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCurrentUsage({
          patients: data.totalPatients || 0,
          users: data.totalUsers || 0,
          storage: data.storageUsed || 0,
        });
      }
    } catch (error) {
      console.error('Error loading usage statistics:', error);
    }
  };

  useEffect(() => {
    loadSubscription();
  }, [loadSubscription]);

  // Check if subscription is valid and active
  const isSubscriptionActive = useCallback((): boolean => {
    if (!subscription) return false;
    return paddleService.isSubscriptionActive(subscription);
  }, [subscription]);

  // Check if subscription is in trial
  const isInTrial = useCallback((): boolean => {
    if (!subscription) return false;
    return paddleService.isSubscriptionInTrial(subscription);
  }, [subscription]);

  // Check if subscription is past due
  const isPastDue = useCallback((): boolean => {
    if (!subscription) return false;
    return paddleService.isSubscriptionPastDue(subscription);
  }, [subscription]);

  // Get days until expiry
  const getDaysUntilExpiry = useCallback((): number => {
    if (!subscription) return 0;
    return paddleService.getDaysUntilExpiry(subscription);
  }, [subscription]);

  // Check subscription limits
  const checkLimits = useCallback((): SubscriptionLimits => {
    if (!subscription) {
      return {
        canAddPatients: false,
        canAddUsers: false,
        storageExceeded: true,
        warnings: ['لا يوجد اشتراك نشط'],
      };
    }

    return paddleService.checkSubscriptionLimits(subscription, currentUsage);
  }, [subscription, currentUsage]);

  // Get upgrade suggestions
  const getUpgradeSuggestions = useCallback((): UpgradeSuggestion => {
    if (!subscription) {
      return {
        shouldUpgrade: true,
        suggestedPlan: 'basic',
        reasons: ['لا يوجد اشتراك نشط'],
      };
    }

    return paddleService.getUpgradeSuggestions(subscription, currentUsage);
  }, [subscription, currentUsage]);

  // Block action if limits exceeded
  const canPerformAction = useCallback((action: 'add_patient' | 'add_user' | 'upload_file'): {
    allowed: boolean;
    reason?: string;
  } => {
    if (!isSubscriptionActive()) {
      return {
        allowed: false,
        reason: 'الاشتراك غير نشط. يرجى تجديد الاشتراك للمتابعة.',
      };
    }

    const limits = checkLimits();

    switch (action) {
      case 'add_patient':
        return {
          allowed: limits.canAddPatients,
          reason: limits.canAddPatients ? undefined : 'وصلت إلى الحد الأقصى للمرضى في خطتك الحالية.',
        };
      
      case 'add_user':
        return {
          allowed: limits.canAddUsers,
          reason: limits.canAddUsers ? undefined : 'وصلت إلى الحد الأقصى للمستخدمين في خطتك الحالية.',
        };
      
      case 'upload_file':
        return {
          allowed: !limits.storageExceeded,
          reason: limits.storageExceeded ? 'تجاوزت حد التخزين المسموح في خطتك الحالية.' : undefined,
        };
      
      default:
        return { allowed: true };
    }
  }, [isSubscriptionActive, checkLimits]);

  // Show upgrade modal if needed
  const shouldShowUpgradeModal = useCallback((): boolean => {
    if (!subscription) return true;
    
    const upgradeSuggestions = getUpgradeSuggestions();
    return upgradeSuggestions.shouldUpgrade;
  }, [subscription, getUpgradeSuggestions]);

  // Get subscription status display
  const getStatusDisplay = useCallback(() => {
    if (!subscription) return { label: 'غير نشط', color: 'red', variant: 'destructive' as const };
    
    return paddleService.getSubscriptionStatusDisplay(subscription.subscription_status);
  }, [subscription]);

  // Refresh subscription data
  const refreshSubscription = useCallback(async () => {
    await loadSubscription();
  }, [loadSubscription]);

  return {
    // Data
    subscription,
    currentUsage,
    loading,
    error,
    
    // Status checks
    isSubscriptionActive: isSubscriptionActive(),
    isInTrial: isInTrial(),
    isPastDue: isPastDue(),
    daysUntilExpiry: getDaysUntilExpiry(),
    
    // Limits and actions
    limits: checkLimits(),
    upgradeSuggestions: getUpgradeSuggestions(),
    canPerformAction,
    shouldShowUpgradeModal: shouldShowUpgradeModal(),
    statusDisplay: getStatusDisplay(),
    
    // Actions
    refreshSubscription,
    loadSubscription,
  };
};