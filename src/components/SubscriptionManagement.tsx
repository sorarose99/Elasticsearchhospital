import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Crown, 
  CreditCard, 
  Download, 
  Users, 
  Database, 
  Headphones,
  Calendar,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface SubscriptionPlan {
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: {
    maxPatients: number;
    maxUsers: number;
    storage: string;
    support: string;
  };
}

interface SubscriptionData {
  subscription_plan: string;
  subscription_status: string;
  subscription_id: string;
  subscription_start: string;
  subscription_end: string;
  details: any;
  plan: SubscriptionPlan;
}

interface Payment {
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  paidAt?: string;
  failedAt?: string;
  reason?: string;
}

export const SubscriptionManagement: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [plans, setPlans] = useState<Record<string, SubscriptionPlan>>({});
  const [currentSubscription, setCurrentSubscription] = useState<SubscriptionData | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadSubscriptionData();
  }, [user]);

  const loadSubscriptionData = async () => {
    if (!user?.hospitalId) return;

    try {
      setLoading(true);

      // Load subscription plans
      const plansResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-89df438c/paddle/plans`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      const plansData = await plansResponse.json();
      if (plansData.success) {
        setPlans(plansData.plans);
      }

      // Load current subscription
      const subscriptionResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-89df438c/paddle/subscription/${user.hospitalId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      const subscriptionData = await subscriptionResponse.json();
      if (subscriptionData.success) {
        setCurrentSubscription(subscriptionData.subscription);
      }

      // Load billing history
      const billingResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-89df438c/paddle/billing/${user.hospitalId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      const billingData = await billingResponse.json();
      if (billingData.success) {
        setPayments(billingData.payments);
      }

    } catch (error) {
      console.error('Error loading subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    if (!user?.hospitalId) return;

    try {
      setActionLoading(true);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-89df438c/paddle/create-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            planId,
            userId: user.id,
            hospitalId: user.hospitalId
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        // Redirect to Paddle checkout
        window.open(data.checkoutUrl, '_blank');
      } else {
        console.error('Failed to create checkout:', data.error);
      }

    } catch (error) {
      console.error('Error creating checkout:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!currentSubscription?.subscription_id) return;

    try {
      setActionLoading(true);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-89df438c/paddle/cancel-subscription`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            subscriptionId: currentSubscription.subscription_id,
            hospitalId: user?.hospitalId
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        await loadSubscriptionData();
      } else {
        console.error('Failed to cancel subscription:', data.error);
      }

    } catch (error) {
      console.error('Error cancelling subscription:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'فعال', variant: 'default' as const, icon: CheckCircle },
      cancelled: { label: 'ملغي', variant: 'destructive' as const, icon: X },
      past_due: { label: 'متأخر السداد', variant: 'destructive' as const, icon: AlertCircle },
      trialing: { label: 'فترة تجريبية', variant: 'secondary' as const, icon: Calendar },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Crown className="h-8 w-8 text-yellow-500" />
          <h1 className="text-3xl font-bold">إدارة الاشتراك والفوترة</h1>
        </div>

        <Tabs defaultValue="current" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current">الاشتراك الحالي</TabsTrigger>
            <TabsTrigger value="plans">خطط الاشتراك</TabsTrigger>
            <TabsTrigger value="billing">سجل الفوترة</TabsTrigger>
          </TabsList>

          {/* Current Subscription */}
          <TabsContent value="current" className="space-y-6">
            {currentSubscription ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>اشتراكك الحالي</span>
                    {getStatusBadge(currentSubscription.subscription_status)}
                  </CardTitle>
                  <CardDescription>
                    {currentSubscription.plan?.name || 'خطة غير محددة'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {currentSubscription.plan && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                        <Users className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">المرضى</p>
                          <p className="font-semibold">
                            {currentSubscription.plan.features.maxPatients === -1 
                              ? 'غير محدود' 
                              : currentSubscription.plan.features.maxPatients}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                        <Users className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">المستخدمين</p>
                          <p className="font-semibold">
                            {currentSubscription.plan.features.maxUsers === -1 
                              ? 'غير محدود' 
                              : currentSubscription.plan.features.maxUsers}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                        <Database className="h-8 w-8 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-600">التخزين</p>
                          <p className="font-semibold">{currentSubscription.plan.features.storage}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                        <Headphones className="h-8 w-8 text-orange-600" />
                        <div>
                          <p className="text-sm text-gray-600">الدعم</p>
                          <p className="font-semibold">{currentSubscription.plan.features.support}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">تاريخ بداية الاشتراك</h3>
                      <p className="text-gray-600">
                        {new Date(currentSubscription.subscription_start).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">تاريخ انتهاء الاشتراك</h3>
                      <p className="text-gray-600">
                        {new Date(currentSubscription.subscription_end).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>

                  {currentSubscription.subscription_status === 'active' && (
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={handleCancelSubscription}
                        disabled={actionLoading}
                      >
                        إلغاء الاشتراك
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  لا يوجد اشتراك نشط. يرجى اختيار خطة اشتراك للاستمرار في استخدام النظام.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* Subscription Plans */}
          <TabsContent value="plans" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(plans).map(([planId, plan]) => (
                <motion.div
                  key={planId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={`relative ${
                    planId === 'professional' 
                      ? 'border-2 border-blue-500 shadow-lg' 
                      : 'border border-gray-200'
                  }`}>
                    {planId === 'professional' && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-blue-500 text-white">الأكثر شعبية</Badge>
                      </div>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <div className="text-3xl font-bold text-blue-600">
                        ${plan.price}
                        <span className="text-sm text-gray-500">/{plan.interval === 'month' ? 'شهر' : 'سنة'}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">
                            {plan.features.maxPatients === -1 
                              ? 'مرضى غير محدودين' 
                              : `حتى ${plan.features.maxPatients} مريض`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">
                            {plan.features.maxUsers === -1 
                              ? 'مستخدمين غير محدودين' 
                              : `حتى ${plan.features.maxUsers} مستخدم`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">تخزين {plan.features.storage}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">دعم {plan.features.support}</span>
                        </div>
                      </div>

                      <Button 
                        className="w-full" 
                        variant={planId === currentSubscription?.subscription_plan ? 'outline' : 'default'}
                        onClick={() => handleUpgrade(planId)}
                        disabled={
                          actionLoading || 
                          planId === currentSubscription?.subscription_plan ||
                          currentSubscription?.subscription_status === 'active'
                        }
                      >
                        {planId === currentSubscription?.subscription_plan 
                          ? 'الخطة الحالية' 
                          : 'اختيار هذه الخطة'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Billing History */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  سجل الفوترة
                </CardTitle>
                <CardDescription>
                  تاريخ جميع المدفوعات والفواتير
                </CardDescription>
              </CardHeader>
              <CardContent>
                {payments.length > 0 ? (
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <div 
                        key={payment.orderId}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            payment.status === 'completed' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {payment.status === 'completed' ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold">
                              ${payment.amount} {payment.currency}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(payment.paidAt || payment.failedAt || '').toLocaleDateString('ar-SA')}
                            </p>
                            {payment.reason && (
                              <p className="text-sm text-red-600">{payment.reason}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={payment.status === 'completed' ? 'default' : 'destructive'}
                          >
                            {payment.status === 'completed' ? 'مدفوع' : 'فشل'}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    لا يوجد سجل فوترة متاح
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};