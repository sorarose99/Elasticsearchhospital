import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  FileText, 
  AlertTriangle, 
  Check, 
  Crown,
  Users,
  UserPlus,
  TrendingUp,
  Download,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import billingService, { BillingDashboard, SubscriptionPlan, UsageLimits } from '../services/BillingService';
import { toast } from 'sonner';

interface BillingDashboardProps {
  clinicId: string;
  isArabic?: boolean;
}

export const BillingDashboardComponent: React.FC<BillingDashboardProps> = ({
  clinicId,
  isArabic = false
}) => {
  const [dashboard, setDashboard] = useState<BillingDashboard | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upgrading, setUpgrading] = useState(false);

  const texts = {
    title: isArabic ? 'إدارة الفوترة والاشتراكات' : 'Billing & Subscriptions',
    overview: isArabic ? 'نظرة عامة' : 'Overview',
    plans: isArabic ? 'الخطط' : 'Plans',
    invoices: isArabic ? 'الفواتير' : 'Invoices',
    payments: isArabic ? 'المدفوعات' : 'Payments',
    currentPlan: isArabic ? 'الخطة الحالية' : 'Current Plan',
    upgrade: isArabic ? 'ترقية الخطة' : 'Upgrade Plan',
    cancel: isArabic ? 'إلغاء الاشتراك' : 'Cancel Subscription',
    updatePayment: isArabic ? 'تحديث طريقة الدفع' : 'Update Payment Method',
    usage: isArabic ? 'الاستخدام' : 'Usage',
    features: isArabic ? 'الميزات' : 'Features',
    trial: isArabic ? 'فترة تجريبية' : 'Trial',
    daysLeft: isArabic ? 'أيام متبقية' : 'days left',
    totalPaid: isArabic ? 'إجمالي المدفوع' : 'Total Paid',
    nextBilling: isArabic ? 'الفوترة التالية' : 'Next Billing',
    status: isArabic ? 'الحالة' : 'Status',
    amount: isArabic ? 'المبلغ' : 'Amount',
    date: isArabic ? 'التاريخ' : 'Date',
    download: isArabic ? 'تحميل' : 'Download',
    refresh: isArabic ? 'تحديث' : 'Refresh',
    noData: isArabic ? 'لا توجد بيانات' : 'No data available',
    loading: isArabic ? 'جاري التحميل...' : 'Loading...',
    selectPlan: isArabic ? 'اختيار الخطة' : 'Select Plan',
    monthlyBilling: isArabic ? 'فوترة شهرية' : 'Monthly Billing',
    yearlyBilling: isArabic ? 'فوترة سنوية' : 'Yearly Billing',
    save: isArabic ? 'وفر' : 'Save',
    mostPopular: isArabic ? 'الأكثر شيوعاً' : 'Most Popular',
    usersLimit: isArabic ? 'حد المستخدمين' : 'Users Limit',
    patientsLimit: isArabic ? 'حد المرضى' : 'Patients Limit'
  };

  useEffect(() => {
    loadDashboardData();
    loadPlans();
  }, [clinicId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await billingService.getBillingDashboard(clinicId);
      setDashboard(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const loadPlans = async () => {
    try {
      const plansData = await billingService.getSubscriptionPlans();
      setPlans(plansData);
    } catch (err) {
      console.error('Error loading plans:', err);
    }
  };

  const handleUpgrade = async (planId: string) => {
    try {
      setUpgrading(true);
      const { checkout_url } = await billingService.createCheckoutSession(planId, clinicId);
      
      // Redirect to Paddle checkout
      window.open(checkout_url, '_blank');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upgrade failed');
    } finally {
      setUpgrading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm(isArabic ? 'هل أنت متأكد من إلغاء الاشتراك؟' : 'Are you sure you want to cancel your subscription?')) {
      return;
    }

    try {
      await billingService.cancelSubscription(clinicId);
      await loadDashboardData();
      toast.success(isArabic ? 'تم إلغاء الاشتراك بنجاح' : 'Subscription cancelled successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cancellation failed');
    }
  };

  const handleUpdatePayment = async () => {
    try {
      await billingService.updatePaymentMethod(clinicId);
      toast.info(isArabic ? 'سيتم إعادة توجيهك لتحديث طريقة الدفع' : 'You will be redirected to update payment method');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    }
  };

  const renderUsageCard = (limits: UsageLimits) => {
    const trialDays = billingService.getTrialDaysRemaining(limits.trialEndsAt);
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {texts.usage}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {limits.subscriptionStatus === 'trial' && trialDays > 0 && (
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{texts.trial}</AlertTitle>
              <AlertDescription>
                {trialDays} {texts.daysLeft}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>{texts.usersLimit}</span>
                <span>{limits.currentUsage.users} / {limits.planLimits.max_users}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ 
                    width: `${Math.min((limits.currentUsage.users / limits.planLimits.max_users) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>{texts.patientsLimit}</span>
                <span>{limits.currentUsage.patients} / {limits.planLimits.max_patients}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ 
                    width: `${Math.min((limits.currentUsage.patients / limits.planLimits.max_patients) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>

            <div className="pt-2">
              <h4 className="font-medium mb-2">{texts.features}</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(limits.features).map(([feature, enabled]) => (
                  <div key={feature} className="flex items-center gap-2">
                    {enabled ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <span className="h-4 w-4" />
                    )}
                    <span className={`text-sm ${enabled ? 'text-green-600' : 'text-gray-400'}`}>
                      {feature.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderPlanCard = (plan: SubscriptionPlan) => {
    const isCurrentPlan = dashboard?.subscription?.plan_id === plan.id;
    const yearlyDiscount = plan.billing_cycle === 'yearly' ? '17%' : null;

    return (
      <Card key={plan.id} className={`relative ${isCurrentPlan ? 'ring-2 ring-blue-500' : ''}`}>
        {plan.name.toLowerCase().includes('professional') && (
          <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-orange-500">
            {texts.mostPopular}
          </Badge>
        )}
        
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{isArabic ? plan.name_ar : plan.name}</span>
            {isCurrentPlan && <Crown className="h-5 w-5 text-yellow-500" />}
          </CardTitle>
          <CardDescription>
            {isArabic ? plan.description_ar : plan.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="text-center mb-4">
            <div className="text-3xl font-bold">
              {billingService.formatCurrency(plan.price, plan.currency)}
            </div>
            <div className="text-sm text-gray-600">
              {billingService.formatBillingCycle(plan.billing_cycle, isArabic)}
              {yearlyDiscount && (
                <Badge variant="secondary" className="ml-2">
                  {texts.save} {yearlyDiscount}
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="text-sm">{plan.max_users} users</span>
            </div>
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span className="text-sm">{plan.max_patients} patients</span>
            </div>
          </div>

          <div className="space-y-1 mb-4">
            {Object.entries(plan.features).map(([feature, enabled]) => (
              <div key={feature} className="flex items-center gap-2">
                {enabled ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <span className="h-4 w-4" />
                )}
                <span className={`text-sm ${enabled ? '' : 'text-gray-400'}`}>
                  {feature.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>

          <Button
            onClick={() => handleUpgrade(plan.id)}
            disabled={upgrading || isCurrentPlan}
            className="w-full"
            variant={isCurrentPlan ? "secondary" : "default"}
          >
            {upgrading ? texts.loading : isCurrentPlan ? texts.currentPlan : texts.selectPlan}
          </Button>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">{texts.loading}</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{texts.title}</h1>
        <Button onClick={loadDashboardData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          {texts.refresh}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{texts.overview}</TabsTrigger>
          <TabsTrigger value="plans">{texts.plans}</TabsTrigger>
          <TabsTrigger value="invoices">{texts.invoices}</TabsTrigger>
          <TabsTrigger value="payments">{texts.payments}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{texts.currentPlan}</CardTitle>
                <Crown className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboard?.subscription?.plan ? 
                    (isArabic ? dashboard.subscription.plan.name_ar : dashboard.subscription.plan.name) :
                    texts.trial
                  }
                </div>
                <p className="text-xs text-gray-600">
                  <Badge className={billingService.getStatusColor(dashboard?.subscription?.status || 'trial')}>
                    {billingService.getStatusText(dashboard?.subscription?.status || 'trial', isArabic)}
                  </Badge>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{texts.totalPaid}</CardTitle>
                <DollarSign className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {billingService.formatCurrency(dashboard?.totalPaid || 0)}
                </div>
                <p className="text-xs text-gray-600">
                  {dashboard?.paymentsCount || 0} transactions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{texts.nextBilling}</CardTitle>
                <Calendar className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboard?.subscription?.current_period_end ? 
                    new Date(dashboard.subscription.current_period_end).toLocaleDateString() :
                    '--'
                  }
                </div>
                <p className="text-xs text-gray-600">
                  {dashboard?.subscription?.plan ? 
                    billingService.formatCurrency(dashboard.subscription.plan.price) :
                    texts.trial
                  }
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {dashboard?.limits && renderUsageCard(dashboard.limits)}
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={() => handleUpgrade(plans[1]?.id)} className="w-full">
                  <Crown className="h-4 w-4 mr-2" />
                  {texts.upgrade}
                </Button>
                
                <Button onClick={handleUpdatePayment} variant="outline" className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" />
                  {texts.updatePayment}
                </Button>
                
                {dashboard?.subscription && (
                  <Button onClick={handleCancel} variant="destructive" className="w-full">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    {texts.cancel}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map(renderPlanCard)}
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{texts.invoices}</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboard?.recentInvoices?.length ? (
                <div className="space-y-4">
                  {dashboard.recentInvoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {billingService.formatCurrency(invoice.amount, invoice.currency)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(invoice.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={billingService.getStatusColor(invoice.status)}>
                          {billingService.getStatusText(invoice.status, isArabic)}
                        </Badge>
                        {invoice.invoice_url && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={invoice.invoice_url} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">{texts.noData}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{texts.payments}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">{texts.noData}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingDashboardComponent;