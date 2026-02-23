import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, 
  Crown, 
  Calendar,
  Users,
  UserPlus,
  X,
  Upgrade,
  CreditCard
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useSubscriptionLimits } from '../hooks/useSubscriptionLimits';
import billingService from '../services/BillingService';

interface SubscriptionBannerProps {
  clinicId: string;
  onUpgrade?: () => void;
  onManageBilling?: () => void;
  isArabic?: boolean;
  showOnlyWarnings?: boolean;
}

export const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({
  clinicId,
  onUpgrade,
  onManageBilling,
  isArabic = false,
  showOnlyWarnings = false
}) => {
  const { limits, loading, getTrialStatus, getUsagePercentage, isApproachingLimit, isAtLimit } = useSubscriptionLimits(clinicId);
  const [dismissed, setDismissed] = React.useState(false);

  const texts = {
    trialExpired: isArabic ? 'انتهت فترة التجريب' : 'Trial Expired',
    trialExpiring: isArabic ? 'تنتهي فترة التجريب قريباً' : 'Trial Expiring Soon',
    subscribeNow: isArabic ? 'اشترك الآن' : 'Subscribe Now',
    upgrade: isArabic ? 'ترقية' : 'Upgrade',
    manageBilling: isArabic ? 'إدارة الفوترة' : 'Manage Billing',
    daysLeft: isArabic ? 'يوم متبقي' : 'days left',
    usersLimit: isArabic ? 'حد المستخدمين' : 'Users limit',
    patientsLimit: isArabic ? 'حد المرضى' : 'Patients limit',
    approaching: isArabic ? 'قريب من الحد الأقصى' : 'Approaching limit',
    reached: isArabic ? 'تم الوصول للحد الأقصى' : 'Limit reached',
    currentPlan: isArabic ? 'الخطة الحالية' : 'Current Plan',
    trialActive: isArabic ? 'فترة تجريبية نشطة' : 'Trial Active',
    subscriptionActive: isArabic ? 'اشتراك نشط' : 'Subscription Active'
  };

  if (loading || dismissed) return null;

  const trialStatus = getTrialStatus();
  const usersPercentage = getUsagePercentage('users');
  const patientsPercentage = getUsagePercentage('patients');

  // Determine what banners to show
  const showTrialExpired = trialStatus?.isExpired;
  const showTrialExpiring = trialStatus?.isTrialActive && trialStatus.daysRemaining <= 3;
  const showUsersApproaching = isApproachingLimit('users');
  const showUsersAtLimit = isAtLimit('users');
  const showPatientsApproaching = isApproachingLimit('patients');
  const showPatientsAtLimit = isAtLimit('patients');

  // Don't show anything if no warnings and showOnlyWarnings is true
  if (showOnlyWarnings && !showTrialExpired && !showTrialExpiring && 
      !showUsersApproaching && !showUsersAtLimit && 
      !showPatientsApproaching && !showPatientsAtLimit) {
    return null;
  }

  const banners = [];

  // Trial expired banner
  if (showTrialExpired) {
    banners.push(
      <Alert key="trial-expired" className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-800">{texts.trialExpired}</AlertTitle>
        <AlertDescription className="text-red-700">
          <div className="flex items-center justify-between">
            <span>
              {isArabic 
                ? 'انتهت فترة التجريب المجانية. اشترك للمتابعة.' 
                : 'Your free trial has ended. Subscribe to continue using the system.'
              }
            </span>
            <div className="flex gap-2 ml-4">
              <Button onClick={onUpgrade} size="sm" className="bg-red-600 hover:bg-red-700">
                <Crown className="h-4 w-4 mr-1" />
                {texts.subscribeNow}
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Trial expiring banner
  if (showTrialExpiring && !showTrialExpired) {
    banners.push(
      <Alert key="trial-expiring" className="border-yellow-200 bg-yellow-50">
        <Calendar className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800">{texts.trialExpiring}</AlertTitle>
        <AlertDescription className="text-yellow-700">
          <div className="flex items-center justify-between">
            <span>
              {trialStatus?.daysRemaining} {texts.daysLeft}
              {isArabic ? ' في فترة التجريب' : ' in your trial'}
            </span>
            <div className="flex gap-2 ml-4">
              <Button onClick={onUpgrade} size="sm" variant="secondary">
                <Crown className="h-4 w-4 mr-1" />
                {texts.upgrade}
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Users limit warnings
  if (showUsersAtLimit) {
    banners.push(
      <Alert key="users-limit" className="border-red-200 bg-red-50">
        <Users className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-800">{texts.usersLimit} - {texts.reached}</AlertTitle>
        <AlertDescription className="text-red-700">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>
                {isArabic 
                  ? 'لا يمكن إضافة مستخدمين جدد. ترقي خطتك لإضافة المزيد.' 
                  : 'Cannot add new users. Upgrade your plan to add more users.'
                }
              </span>
              <Button onClick={onUpgrade} size="sm" className="bg-red-600 hover:bg-red-700">
                <Upgrade className="h-4 w-4 mr-1" />
                {texts.upgrade}
              </Button>
            </div>
            <Progress value={usersPercentage} className="h-2" />
            <div className="text-sm">
              {limits?.currentUsage.users} / {limits?.planLimits.max_users} users
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  } else if (showUsersApproaching && !showOnlyWarnings) {
    banners.push(
      <Alert key="users-approaching" className="border-yellow-200 bg-yellow-50">
        <Users className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800">{texts.usersLimit} - {texts.approaching}</AlertTitle>
        <AlertDescription className="text-yellow-700">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>
                {isArabic 
                  ? 'تقترب من حد المستخدمين المسموح به.' 
                  : 'You are approaching your user limit.'
                }
              </span>
              <Button onClick={onUpgrade} size="sm" variant="secondary">
                <Upgrade className="h-4 w-4 mr-1" />
                {texts.upgrade}
              </Button>
            </div>
            <Progress value={usersPercentage} className="h-2" />
            <div className="text-sm">
              {limits?.currentUsage.users} / {limits?.planLimits.max_users} users
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Patients limit warnings
  if (showPatientsAtLimit) {
    banners.push(
      <Alert key="patients-limit" className="border-red-200 bg-red-50">
        <UserPlus className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-800">{texts.patientsLimit} - {texts.reached}</AlertTitle>
        <AlertDescription className="text-red-700">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>
                {isArabic 
                  ? 'لا يمكن إضافة مرضى جدد. ترقي خطتك لإضافة المزيد.' 
                  : 'Cannot add new patients. Upgrade your plan to add more patients.'
                }
              </span>
              <Button onClick={onUpgrade} size="sm" className="bg-red-600 hover:bg-red-700">
                <Upgrade className="h-4 w-4 mr-1" />
                {texts.upgrade}
              </Button>
            </div>
            <Progress value={patientsPercentage} className="h-2" />
            <div className="text-sm">
              {limits?.currentUsage.patients} / {limits?.planLimits.max_patients} patients
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  } else if (showPatientsApproaching && !showOnlyWarnings) {
    banners.push(
      <Alert key="patients-approaching" className="border-yellow-200 bg-yellow-50">
        <UserPlus className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800">{texts.patientsLimit} - {texts.approaching}</AlertTitle>
        <AlertDescription className="text-yellow-700">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>
                {isArabic 
                  ? 'تقترب من حد المرضى المسموح به.' 
                  : 'You are approaching your patient limit.'
                }
              </span>
              <Button onClick={onUpgrade} size="sm" variant="secondary">
                <Upgrade className="h-4 w-4 mr-1" />
                {texts.upgrade}
              </Button>
            </div>
            <Progress value={patientsPercentage} className="h-2" />
            <div className="text-sm">
              {limits?.currentUsage.patients} / {limits?.planLimits.max_patients} patients
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Current plan status (when no warnings)
  if (!showOnlyWarnings && banners.length === 0 && limits?.hasAccess) {
    banners.push(
      <Alert key="plan-status" className="border-green-200 bg-green-50">
        <Crown className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">
          {limits.subscriptionStatus === 'trial' ? texts.trialActive : texts.subscriptionActive}
        </AlertTitle>
        <AlertDescription className="text-green-700">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              {trialStatus?.isTrialActive && (
                <div>{trialStatus.daysRemaining} {texts.daysLeft}</div>
              )}
              <div className="flex gap-4 text-sm">
                <span>{limits.currentUsage.users}/{limits.planLimits.max_users} users</span>
                <span>{limits.currentUsage.patients}/{limits.planLimits.max_patients} patients</span>
              </div>
            </div>
            <div className="flex gap-2">
              {onManageBilling && (
                <Button onClick={onManageBilling} size="sm" variant="outline">
                  <CreditCard className="h-4 w-4 mr-1" />
                  {texts.manageBilling}
                </Button>
              )}
              {onUpgrade && (
                <Button onClick={onUpgrade} size="sm" variant="secondary">
                  <Crown className="h-4 w-4 mr-1" />
                  {texts.upgrade}
                </Button>
              )}
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (banners.length === 0) return null;

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {banners.map((banner, index) => (
          <motion.div
            key={banner.key}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {banner}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDismissed(true)}
              className="absolute top-2 right-2 h-6 w-6 p-0 opacity-70 hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SubscriptionBanner;