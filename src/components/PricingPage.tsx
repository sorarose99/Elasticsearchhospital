import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Check, 
  Crown, 
  Star, 
  Users, 
  UserPlus, 
  Calendar,
  Shield,
  Zap,
  Sparkles,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import billingService, { SubscriptionPlan } from '../services/BillingService';
import { localApiService } from '../services/LocalApiService';
import BillingSystemTest from './BillingSystemTest';

interface PricingPageProps {
  onSelectPlan?: (planId: string) => void;
  isArabic?: boolean;
  showTrialBanner?: boolean;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onSelectPlan,
  isArabic = false,
  showTrialBanner = true
}) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [error, setError] = useState<string | null>(null);
  const [showSystemTest, setShowSystemTest] = useState(false);

  const texts = {
    title: isArabic ? 'اختر الخطة المناسبة لك' : 'Choose the Perfect Plan for Your Clinic',
    subtitle: isArabic ? 'ابدأ مع فترة تجريبية مجانية لمدة 14 يوم' : 'Start with a 14-day free trial',
    monthly: isArabic ? 'شهرياً' : 'Monthly',
    yearly: isArabic ? 'سنوياً' : 'Yearly',
    save: isArabic ? 'وفر' : 'Save',
    mostPopular: isArabic ? 'الأكثر شيوعاً' : 'Most Popular',
    enterprise: isArabic ? 'للمؤسسات' : 'Enterprise',
    getStarted: isArabic ? 'ابدأ الآن' : 'Get Started',
    selectPlan: isArabic ? 'اختيار الخطة' : 'Choose Plan',
    freeTrial: isArabic ? 'فترة تجريبية مجانية' : 'Free Trial',
    noCommitment: isArabic ? 'بدون التزام' : 'No commitment',
    cancelAnytime: isArabic ? 'يمكن الإلغاء في أي وقت' : 'Cancel anytime',
    users: isArabic ? 'مستخدم' : 'users',
    patients: isArabic ? 'مريض' : 'patients',
    unlimited: isArabic ? 'غير محدود' : 'Unlimited',
    perMonth: isArabic ? '/شهر' : '/month',
    perYear: isArabic ? '/سنة' : '/year',
    billed: isArabic ? 'تتم الفوترة' : 'Billed',
    monthly_billing: isArabic ? 'شهرياً' : 'monthly',
    yearly_billing: isArabic ? 'سنوياً' : 'annually',
    features: {
      appointment_booking: isArabic ? 'حجز المواعيد' : 'Appointment Booking',
      patient_management: isArabic ? 'إدارة المرضى' : 'Patient Management',
      basic_reports: isArabic ? 'التقارير الأساسية' : 'Basic Reports',
      advanced_reports: isArabic ? 'التقارير المتقدمة' : 'Advanced Reports',
      lab_integration: isArabic ? 'تكامل المختبر' : 'Lab Integration',
      pharmacy_management: isArabic ? 'إدارة الصيدلية' : 'Pharmacy Management',
      radiology_management: isArabic ? 'إدارة الأشعة' : 'Radiology Management',
      billing_integration: isArabic ? 'تكامل الفوترة' : 'Billing Integration',
      api_access: isArabic ? 'وصول API' : 'API Access',
      priority_support: isArabic ? 'دعم أولوية' : 'Priority Support',
      custom_branding: isArabic ? 'علامة تجارية مخصصة' : 'Custom Branding',
      multi_location: isArabic ? 'مواقع متعددة' : 'Multi-location'
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try local API service first
      console.log('📋 Loading subscription plans from local service...');
      try {
        const localResult = await localApiService.getSubscriptionPlans();
        if (localResult.success && localResult.data) {
          console.log('✅ Using local subscription plans');
          setPlans(localResult.data);
          return;
        }
      } catch (localError) {
        console.warn('Local API service failed:', localError);
      }
      
      // Fallback to billing service
      console.log('🔄 Fallback to billing service...');
      try {
        await billingService.testConnection();
        const plansData = await billingService.getSubscriptionPlans();
        setPlans(plansData);
      } catch (connError) {
        console.warn('Billing service connection test failed:', connError);
        throw connError;
      }
      
    } catch (err) {
      console.error('Error loading plans:', err);
      setError(err instanceof Error ? err.message : 'Failed to load plans');
      
      // Set hardcoded default plans as ultimate fallback
      const defaultPlans = [
        {
          id: '1',
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
            basic_reports: true
          },
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
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
            pharmacy_management: true
          },
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setPlans(defaultPlans);
      console.log('📋 Using hardcoded fallback plans');
    } finally {
      setLoading(false);
    }
  };

  const filteredPlans = plans.filter(plan => plan.billing_cycle === billingCycle);

  const handleSelectPlan = (planId: string) => {
    if (onSelectPlan) {
      onSelectPlan(planId);
    } else {
      // Default behavior - redirect to signup or checkout
      console.log('Selected plan:', planId);
    }
  };

  const getPlanIcon = (planName: string) => {
    if (planName.toLowerCase().includes('starter')) {
      return <Users className="h-6 w-6" />;
    } else if (planName.toLowerCase().includes('professional')) {
      return <Star className="h-6 w-6" />;
    } else if (planName.toLowerCase().includes('enterprise')) {
      return <Crown className="h-6 w-6" />;
    }
    return <Shield className="h-6 w-6" />;
  };

  const isPlanPopular = (planName: string) => {
    return planName.toLowerCase().includes('professional');
  };

  const isPlanEnterprise = (planName: string) => {
    return planName.toLowerCase().includes('enterprise');
  };

  const getYearlyDiscount = () => {
    const monthlyPro = plans.find(p => p.name.toLowerCase().includes('professional') && p.billing_cycle === 'monthly');
    const yearlyPro = plans.find(p => p.name.toLowerCase().includes('professional') && p.billing_cycle === 'yearly');
    
    if (monthlyPro && yearlyPro) {
      const monthlyYearlyPrice = monthlyPro.price * 12;
      const discount = ((monthlyYearlyPrice - yearlyPro.price) / monthlyYearlyPrice) * 100;
      return Math.round(discount);
    }
    return 17; // Default discount
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading plans...</span>
      </div>
    );
  }

  if (showSystemTest) {
    return <BillingSystemTest onClose={() => setShowSystemTest(false)} />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <div className="flex gap-2 justify-center">
          <Button onClick={loadPlans} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button onClick={() => setShowSystemTest(true)} variant="secondary">
            System Test
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          {texts.title}
        </motion.h1>
        
        {showTrialBanner && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 mb-8"
          >
            {texts.subtitle}
          </motion.p>
        )}

        {/* Debug button for system test */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Button 
            onClick={() => setShowSystemTest(true)} 
            variant="outline" 
            size="sm"
            className="opacity-60 hover:opacity-100"
          >
            System Test
          </Button>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <span className={`${billingCycle === 'monthly' ? 'font-semibold' : 'text-gray-500'}`}>
            {texts.monthly}
          </span>
          
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          
          <div className="flex items-center gap-2">
            <span className={`${billingCycle === 'yearly' ? 'font-semibold' : 'text-gray-500'}`}>
              {texts.yearly}
            </span>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {texts.save} {getYearlyDiscount()}%
            </Badge>
          </div>
        </motion.div>
      </div>

      {/* Trial Benefits Banner */}
      {showTrialBanner && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-12 border border-blue-200"
        >
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>{texts.freeTrial}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <span>{texts.noCommitment}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <span>{texts.cancelAnytime}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPlans.map((plan, index) => {
          const isPopular = isPlanPopular(plan.name);
          const isEnterprise = isPlanEnterprise(plan.name);
          
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="relative"
            >
              <Card className={`relative h-full ${isPopular ? 'ring-2 ring-blue-500 scale-105' : ''} ${isEnterprise ? 'bg-gradient-to-br from-purple-50 to-indigo-50' : ''}`}>
                {isPopular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                    <Star className="h-3 w-3 mr-1" />
                    {texts.mostPopular}
                  </Badge>
                )}
                
                {isEnterprise && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500">
                    <Crown className="h-3 w-3 mr-1" />
                    {texts.enterprise}
                  </Badge>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`p-3 rounded-full ${isPopular ? 'bg-blue-100 text-blue-600' : isEnterprise ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                      {getPlanIcon(plan.name)}
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl">
                    {isArabic ? plan.name_ar : plan.name}
                  </CardTitle>
                  
                  <CardDescription className="text-base">
                    {isArabic ? plan.description_ar : plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold">
                        {billingService.formatCurrency(plan.price, plan.currency).replace(/[^\d.,]/g, '')}
                      </span>
                      <span className="text-lg text-gray-600 ml-1">
                        {plan.currency}
                      </span>
                      <span className="text-gray-500 ml-1">
                        {billingCycle === 'monthly' ? texts.perMonth : texts.perYear}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-1">
                      {texts.billed} {billingCycle === 'monthly' ? texts.monthly_billing : texts.yearly_billing}
                    </p>
                  </div>

                  {/* Limits */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">
                        {plan.max_users === -1 ? texts.unlimited : plan.max_users} {texts.users}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <UserPlus className="h-4 w-4 text-green-600" />
                      <span className="text-sm">
                        {plan.max_patients === -1 ? texts.unlimited : plan.max_patients} {texts.patients}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {Object.entries(plan.features).map(([feature, enabled]) => (
                      <div key={feature} className="flex items-center gap-3">
                        <div className={`flex-shrink-0 ${enabled ? 'text-green-600' : 'text-gray-300'}`}>
                          <Check className="h-4 w-4" />
                        </div>
                        <span className={`text-sm ${enabled ? 'text-gray-900' : 'text-gray-400'}`}>
                          {texts.features[feature as keyof typeof texts.features] || feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full ${isPopular ? 'bg-blue-600 hover:bg-blue-700' : isEnterprise ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                    size="lg"
                  >
                    {texts.selectPlan}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-12"
      >
        <p className="text-gray-600">
          {isArabic 
            ? 'جميع الخطط تشمل فترة تجريبية مجانية لمدة 14 يوم. لا حاجة لبطاقة ائتمانية.'
            : 'All plans include a 14-day free trial. No credit card required.'
          }
        </p>
      </motion.div>
    </div>
  );
};

export default PricingPage;