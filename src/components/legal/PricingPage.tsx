import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Crown, 
  Building2, 
  Heart, 
  Zap, 
  Globe, 
  Shield, 
  Users, 
  Clock,
  ArrowLeft,
  Star,
  Sparkles,
  ChevronRight,
  CreditCard,
  Smartphone,
  Brain,
  Database,
  Settings,
  Cloud,
  Lock,
  PhoneCall,
  Award,
  Target,
  TrendingUp,
  Workflow,
  LineChart,
  Bot,
  FileCheck,
  Headphones,
  Laptop
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { useLanguage } from '../../services/LanguageService';
import ThemeLanguageToggle from '../settings/ThemeLanguageToggle';

interface PricingPageProps {
  onBack: () => void;
  onGetStarted: (plan: string) => void;
}

// Paddle.js integration
declare global {
  interface Window {
    Paddle: any;
  }
}

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    nameKey: 'pricing.plans.starter.name',
    descKey: 'pricing.plans.starter.desc',
    icon: Heart,
    color: 'from-green-500 to-emerald-600',
    badge: null,
    monthlyPrice: 49,
    yearlyPrice: 39,
    paddleProductId: 'pri_01hqwe2345',
    features: [
      'pricing.features.patients50',
      'pricing.features.basicEMR',
      'pricing.features.appointments',
      'pricing.features.basicReports',
      'pricing.features.emailSupport',
      'pricing.features.mobileApp',
      'pricing.features.dataBackup',
      'pricing.features.basicAnalytics'
    ],
    limitations: [
      'pricing.limitations.limitedIntegrations',
      'pricing.limitations.basicCustomization',
      'pricing.limitations.noAI'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    nameKey: 'pricing.plans.professional.name',
    descKey: 'pricing.plans.professional.desc',
    icon: Building2,
    color: 'from-blue-500 to-cyan-600',
    badge: 'Most Popular',
    badgeKey: 'pricing.badges.popular',
    monthlyPrice: 99,
    yearlyPrice: 79,
    paddleProductId: 'pri_01hqwe2346',
    features: [
      'pricing.features.patients500',
      'pricing.features.advancedEMR',
      'pricing.features.labIntegration',
      'pricing.features.pharmacyManagement',
      'pricing.features.advancedReports',
      'pricing.features.prioritySupport',
      'pricing.features.customBranding',
      'pricing.features.apiAccess',
      'pricing.features.multiLocation',
      'pricing.features.telemedicine',
      'pricing.features.basicAI',
      'pricing.features.mobileSync'
    ],
    limitations: []
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    nameKey: 'pricing.plans.enterprise.name',
    descKey: 'pricing.plans.enterprise.desc',
    icon: Crown,
    color: 'from-purple-500 to-violet-600',
    badge: 'Advanced',
    badgeKey: 'pricing.badges.advanced',
    monthlyPrice: 199,
    yearlyPrice: 159,
    paddleProductId: 'pri_01hqwe2347',
    features: [
      'pricing.features.patientsUnlimited',
      'pricing.features.fullEMR',
      'pricing.features.allIntegrations',
      'pricing.features.aiAssistant',
      'pricing.features.dedicatedSupport',
      'pricing.features.customDevelopment',
      'pricing.features.onPremise',
      'pricing.features.sla99',
      'pricing.features.training',
      'pricing.features.compliance',
      'pricing.features.advancedAI',
      'pricing.features.customWorkflows',
      'pricing.features.enterpriseAnalytics',
      'pricing.features.whiteLabel'
    ],
    limitations: []
  },
  {
    id: 'healthcare-system',
    name: 'Healthcare System',
    nameKey: 'pricing.plans.healthcareSystem.name',
    descKey: 'pricing.plans.healthcareSystem.desc',
    icon: Building2,
    color: 'from-indigo-500 to-purple-700',
    badge: 'Large Organizations',
    badgeKey: 'pricing.badges.largeOrgs',
    monthlyPrice: 499,
    yearlyPrice: 399,
    paddleProductId: 'pri_01hqwe2348',
    features: [
      'pricing.features.multiHospital',
      'pricing.features.enterpriseEMR',
      'pricing.features.advancedIntegrations',
      'pricing.features.aiDiagnostics',
      'pricing.features.dedicatedManager',
      'pricing.features.customSolution',
      'pricing.features.hybridCloud',
      'pricing.features.sla999',
      'pricing.features.comprehensiveTraining',
      'pricing.features.fullCompliance',
      'pricing.features.predictiveAI',
      'pricing.features.enterpriseWorkflows',
      'pricing.features.realTimeAnalytics',
      'pricing.features.fullCustomization',
      'pricing.features.multiRegion',
      'pricing.features.disasterRecovery'
    ],
    limitations: []
  }
];

const addOns = [
  {
    name: 'AI Diagnostics Module',
    nameKey: 'pricing.addons.aiDiagnostics.name',
    descKey: 'pricing.addons.aiDiagnostics.desc',
    monthlyPrice: 89,
    yearlyPrice: 71,
    icon: Brain,
    paddleProductId: 'pri_addon_ai_diag',
    popular: true
  },
  {
    name: 'Mobile App Suite',
    nameKey: 'pricing.addons.mobileApp.name',
    descKey: 'pricing.addons.mobileApp.desc',
    monthlyPrice: 49,
    yearlyPrice: 39,
    icon: Smartphone,
    paddleProductId: 'pri_addon_mobile'
  },
  {
    name: 'Telemedicine Pro',
    nameKey: 'pricing.addons.telemedicine.name',
    descKey: 'pricing.addons.telemedicine.desc',
    monthlyPrice: 59,
    yearlyPrice: 47,
    icon: Globe,
    paddleProductId: 'pri_addon_tele'
  },
  {
    name: 'Advanced Analytics',
    nameKey: 'pricing.addons.analytics.name',
    descKey: 'pricing.addons.analytics.desc',
    monthlyPrice: 79,
    yearlyPrice: 63,
    icon: LineChart,
    paddleProductId: 'pri_addon_analytics'
  },
  {
    name: 'Enterprise Security',
    nameKey: 'pricing.addons.security.name',
    descKey: 'pricing.addons.security.desc',
    monthlyPrice: 99,
    yearlyPrice: 79,
    icon: Shield,
    paddleProductId: 'pri_addon_security'
  },
  {
    name: 'Workflow Automation',
    nameKey: 'pricing.addons.workflow.name',
    descKey: 'pricing.addons.workflow.desc',
    monthlyPrice: 69,
    yearlyPrice: 55,
    icon: Workflow,
    paddleProductId: 'pri_addon_workflow'
  }
];

const faqs = [
  {
    questionKey: 'pricing.faqs.trialPeriod.question',
    answerKey: 'pricing.faqs.trialPeriod.answer'
  },
  {
    questionKey: 'pricing.faqs.dataExport.question',
    answerKey: 'pricing.faqs.dataExport.answer'
  },
  {
    questionKey: 'pricing.faqs.setup.question',
    answerKey: 'pricing.faqs.setup.answer'
  },
  {
    questionKey: 'pricing.faqs.support.question',
    answerKey: 'pricing.faqs.support.answer'
  },
  {
    questionKey: 'pricing.faqs.customization.question',
    answerKey: 'pricing.faqs.customization.answer'
  }
];

export default function PricingPage({ onBack, onGetStarted }: PricingPageProps) {
  const [isYearly, setIsYearly] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isPaddleLoaded, setIsPaddleLoaded] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const { t, isRTL } = useLanguage();

  // Load Paddle.js
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/paddle.js';
    script.async = true;
    script.onload = () => {
      if (window.Paddle) {
        window.Paddle.Setup({ 
          vendor: parseInt(process.env.REACT_APP_PADDLE_VENDOR_ID || '12345') 
        });
        setIsPaddleLoaded(true);
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handlePaddleCheckout = (plan: typeof plans[0]) => {
    if (!isPaddleLoaded || !window.Paddle) {
      // Fallback to regular checkout flow
      onGetStarted(plan.id);
      return;
    }

    const checkoutData = {
      product: plan.paddleProductId,
      title: `${t(plan.nameKey)} - ${isYearly ? t('pricing.billing.yearly') : t('pricing.billing.monthly')}`,
      message: t(plan.descKey),
      coupon: isYearly ? 'YEARLY20' : undefined,
      passthrough: JSON.stringify({
        planId: plan.id,
        billing: isYearly ? 'yearly' : 'monthly',
        addOns: selectedAddOns
      }),
      successCallback: (data: any) => {
        console.log('Payment successful:', data);
        // Redirect to dashboard or success page
        onGetStarted(plan.id);
      },
      closeCallback: () => {
        console.log('Checkout closed');
      }
    };

    window.Paddle.Checkout.open(checkoutData);
  };

  const toggleAddOn = (addonId: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const getPrice = (plan: typeof plans[0]) => {
    return isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const getSavings = (plan: typeof plans[0]) => {
    const monthlyCost = plan.monthlyPrice * 12;
    const yearlyCost = plan.yearlyPrice * 12;
    const savings = Math.round(((monthlyCost - yearlyCost) / monthlyCost) * 100);
    return savings;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-background ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="hover-lift">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('common.back')}
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold">{t('pricing.title')}</h1>
            </div>

            <ThemeLanguageToggle variant="compact" showLabels={false} />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('pricing.hero.title')}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('pricing.hero.subtitle')}
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`font-medium ${!isYearly ? 'text-blue-600' : 'text-muted-foreground'}`}>
              {t('pricing.billing.monthly')}
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-blue-600"
            />
            <span className={`font-medium ${isYearly ? 'text-blue-600' : 'text-muted-foreground'}`}>
              {t('pricing.billing.yearly')}
            </span>
            {isYearly && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 ml-2">
                <Sparkles className="w-3 h-3 mr-1" />
                {t('pricing.billing.save')} 20%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const price = getPrice(plan);
            const savings = getSavings(plan);
            
            return (
              <Card 
                key={plan.id} 
                className={`relative group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in ${
                  plan.badge ? 'ring-2 ring-blue-500 shadow-lg' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      {t(plan.badgeKey || 'pricing.badges.popular')}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{t(plan.nameKey)}</CardTitle>
                  <CardDescription className="text-base">{t(plan.descKey)}</CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Pricing */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">${price}</span>
                      <span className="text-muted-foreground">
                        /{isYearly ? t('pricing.billing.month') : t('pricing.billing.month')}
                      </span>
                    </div>
                    {isYearly && (
                      <div className="text-sm text-green-600 mt-1">
                        {t('pricing.billing.save')} {savings}% ({t('pricing.billing.billed')} ${price * 12}/{t('pricing.billing.year')})
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{t(feature)}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, limitIndex) => (
                      <div key={limitIndex} className="flex items-start gap-3 opacity-60">
                        <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                          <div className="w-3 h-3 border border-muted-foreground rounded-full mx-auto mt-1"></div>
                        </div>
                        <span className="text-sm text-muted-foreground">{t(limitation)}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full h-12 ${plan.badge ? `bg-gradient-to-r ${plan.color} hover:shadow-lg` : ''} hover-lift`}
                    onClick={() => handlePaddleCheckout(plan)}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {t('pricing.getStarted')}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Add-ons Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('pricing.addons.title')}</h2>
            <p className="text-xl text-muted-foreground">
              {t('pricing.addons.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addOns.map((addon, index) => {
              const Icon = addon.icon;
              const price = isYearly ? addon.yearlyPrice : addon.monthlyPrice;
              const isSelected = selectedAddOns.includes(addon.paddleProductId);
              
              return (
                <Card 
                  key={index} 
                  className={`hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in cursor-pointer ${
                    isSelected ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/50' : ''
                  } ${addon.popular ? 'ring-2 ring-purple-500' : ''}`} 
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => toggleAddOn(addon.paddleProductId)}
                >
                  {addon.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-purple-600 text-white px-3 py-1">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isSelected 
                          ? 'bg-blue-100 dark:bg-blue-900' 
                          : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700'
                      }`}>
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-blue-600'}`} />
                      </div>
                      <CardTitle className="text-lg">{t(addon.nameKey)}</CardTitle>
                    </div>
                    <CardDescription>{t(addon.descKey)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold">${price}</span>
                        <span className="text-muted-foreground text-sm">/{t('pricing.billing.month')}</span>
                      </div>
                      <Button 
                        variant={isSelected ? "default" : "outline"} 
                        size="sm" 
                        className="hover-lift"
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            {t('pricing.addons.added')}
                          </>
                        ) : (
                          t('pricing.addons.add')
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('pricing.faqs.title')}</h2>
            <p className="text-xl text-muted-foreground">
              {t('pricing.faqs.subtitle')}
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-0">
                  <button
                    className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{t(faq.questionKey)}</h3>
                      <ChevronRight className={`w-5 h-5 transition-transform duration-200 ${expandedFaq === index ? 'rotate-90' : ''}`} />
                    </div>
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6">
                      <Separator className="mb-4" />
                      <p className="text-muted-foreground">{t(faq.answerKey)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Enterprise CTA */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white animate-fade-in">
          <CardContent className="p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">{t('pricing.enterprise.title')}</h2>
              <p className="text-xl mb-6 opacity-90">{t('pricing.enterprise.subtitle')}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="px-8 hover-lift">
                  {t('pricing.enterprise.contact')}
                </Button>
                <Button size="lg" variant="outline" className="px-8 border-white text-white hover:bg-white hover:text-blue-600 hover-lift">
                  {t('pricing.enterprise.demo')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}