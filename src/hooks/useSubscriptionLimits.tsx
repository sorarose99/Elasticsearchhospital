import { useState, useEffect, useContext } from 'react';
import billingService, { UsageLimits } from '../services/BillingService';

export interface SubscriptionCheck {
  canAccess: boolean;
  reason?: string;
  upgradeRequired?: boolean;
  trialExpired?: boolean;
}

export const useSubscriptionLimits = (clinicId: string) => {
  const [limits, setLimits] = useState<UsageLimits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (clinicId) {
      loadLimits();
    }
  }, [clinicId]);

  const loadLimits = async () => {
    try {
      setLoading(true);
      const limitsData = await billingService.checkLimits(clinicId);
      setLimits(limitsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load limits');
    } finally {
      setLoading(false);
    }
  };

  // Check if user can add new users
  const canAddUser = (): SubscriptionCheck => {
    if (!limits) {
      return { canAccess: false, reason: 'Loading limits...' };
    }

    if (!limits.hasAccess) {
      const trialDays = billingService.getTrialDaysRemaining(limits.trialEndsAt);
      return {
        canAccess: false,
        reason: trialDays > 0 ? 'Trial access only' : 'Subscription required',
        trialExpired: trialDays === 0,
        upgradeRequired: true
      };
    }

    if (!limits.canAddUsers) {
      return {
        canAccess: false,
        reason: `User limit reached (${limits.planLimits.max_users})`,
        upgradeRequired: true
      };
    }

    return { canAccess: true };
  };

  // Check if user can add new patients
  const canAddPatient = (): SubscriptionCheck => {
    if (!limits) {
      return { canAccess: false, reason: 'Loading limits...' };
    }

    if (!limits.hasAccess) {
      const trialDays = billingService.getTrialDaysRemaining(limits.trialEndsAt);
      return {
        canAccess: false,
        reason: trialDays > 0 ? 'Trial access only' : 'Subscription required',
        trialExpired: trialDays === 0,
        upgradeRequired: true
      };
    }

    if (!limits.canAddPatients) {
      return {
        canAccess: false,
        reason: `Patient limit reached (${limits.planLimits.max_patients})`,
        upgradeRequired: true
      };
    }

    return { canAccess: true };
  };

  // Check if feature is available
  const canUseFeature = (feature: string): SubscriptionCheck => {
    if (!limits) {
      return { canAccess: false, reason: 'Loading limits...' };
    }

    if (!limits.hasAccess) {
      const trialDays = billingService.getTrialDaysRemaining(limits.trialEndsAt);
      return {
        canAccess: false,
        reason: trialDays > 0 ? 'Trial access only' : 'Subscription required',
        trialExpired: trialDays === 0,
        upgradeRequired: true
      };
    }

    if (!limits.features[feature]) {
      return {
        canAccess: false,
        reason: `Feature "${feature}" not available in current plan`,
        upgradeRequired: true
      };
    }

    return { canAccess: true };
  };

  // Get trial status
  const getTrialStatus = () => {
    if (!limits) return null;

    const daysRemaining = billingService.getTrialDaysRemaining(limits.trialEndsAt);
    return {
      isTrialActive: limits.subscriptionStatus === 'trial' && daysRemaining > 0,
      daysRemaining,
      isExpired: daysRemaining === 0 && limits.subscriptionStatus === 'trial'
    };
  };

  // Get usage percentage for progress bars
  const getUsagePercentage = (type: 'users' | 'patients'): number => {
    if (!limits) return 0;

    const current = limits.currentUsage[type];
    const max = limits.planLimits[type === 'users' ? 'max_users' : 'max_patients'];
    
    if (max === -1) return 0; // Unlimited
    return Math.min((current / max) * 100, 100);
  };

  // Check if approaching limits (>80%)
  const isApproachingLimit = (type: 'users' | 'patients'): boolean => {
    return getUsagePercentage(type) > 80;
  };

  // Check if at limit (100%)
  const isAtLimit = (type: 'users' | 'patients'): boolean => {
    return getUsagePercentage(type) >= 100;
  };

  return {
    limits,
    loading,
    error,
    canAddUser,
    canAddPatient,
    canUseFeature,
    getTrialStatus,
    getUsagePercentage,
    isApproachingLimit,
    isAtLimit,
    refresh: loadLimits
  };
};

// HOC for protecting components with subscription checks
export const withSubscriptionCheck = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredFeature?: string
) => {
  return (props: P & { clinicId: string }) => {
    const { canUseFeature, limits, loading } = useSubscriptionLimits(props.clinicId);

    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Checking access...</span>
        </div>
      );
    }

    if (requiredFeature) {
      const check = canUseFeature(requiredFeature);
      if (!check.canAccess) {
        return (
          <div className="text-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Feature Not Available
            </h3>
            <p className="text-yellow-700 mb-4">{check.reason}</p>
            {check.upgradeRequired && (
              <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">
                Upgrade Plan
              </button>
            )}
          </div>
        );
      }
    }

    return <WrappedComponent {...props} />;
  };
};

// Hook for showing upgrade prompts
export const useUpgradePrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptReason, setPromptReason] = useState<string>('');

  const triggerUpgradePrompt = (reason: string) => {
    setPromptReason(reason);
    setShowPrompt(true);
  };

  const closePrompt = () => {
    setShowPrompt(false);
    setPromptReason('');
  };

  return {
    showPrompt,
    promptReason,
    triggerUpgradePrompt,
    closePrompt
  };
};