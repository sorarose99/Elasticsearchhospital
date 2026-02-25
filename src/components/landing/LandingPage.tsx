import React from 'react';
import { 
  Heart, 
  Shield, 
  Users, 
  Calendar, 
  FileText, 
  BarChart3, 
  Clock, 
  Award,
  ChevronRight,
  Play,
  Star,
  CheckCircle,
  ArrowRight,
  Zap,
  Globe,
  Lock,
  Brain,
  Smartphone,
  Building2,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useLanguage } from '../../services/LanguageService';
import ThemeLanguageToggle from '../settings/ThemeLanguageToggle';

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
  onPricing: () => void;
  onPrivacy: () => void;
  onTerms: () => void;
  onMobileApp?: () => void;
  onAIDiagnostics?: () => void;
  onEnterpriseSettings?: () => void;
}

const features = [
  {
    icon: Heart,
    titleKey: 'landing.features.patientCare.title',
    descKey: 'landing.features.patientCare.desc',
    color: 'text-red-500'
  },
  {
    icon: Calendar,
    titleKey: 'landing.features.scheduling.title',
    descKey: 'landing.features.scheduling.desc',
    color: 'text-blue-500'
  },
  {
    icon: FileText,
    titleKey: 'landing.features.emr.title',
    descKey: 'landing.features.emr.desc',
    color: 'text-green-500'
  },
  {
    icon: BarChart3,
    titleKey: 'landing.features.analytics.title',
    descKey: 'landing.features.analytics.desc',
    color: 'text-purple-500'
  },
  {
    icon: Shield,
    titleKey: 'landing.features.security.title',
    descKey: 'landing.features.security.desc',
    color: 'text-orange-500'
  },
  {
    icon: Users,
    titleKey: 'landing.features.collaboration.title',
    descKey: 'landing.features.collaboration.desc',
    color: 'text-teal-500'
  }
];

const testimonials = [
  {
    name: 'Dr. Sarah Johnson',
    role: 'Chief Medical Officer',
    company: 'City General Hospital',
    rating: 5,
    testimonial: 'This system has revolutionized our patient care workflow. The intuitive interface and comprehensive features have increased our efficiency by 40%.'
  },
  {
    name: 'Ahmed Al-Rahman',
    role: 'Hospital Administrator',
    company: 'Medical Center Dubai',
    rating: 5,
    testimonial: 'The multilingual support and cultural considerations make this perfect for our diverse patient population. Excellent system!'
  },
  {
    name: 'Dr. Maria Rodriguez',
    role: 'Emergency Department Director',
    company: 'Metro Emergency Hospital',
    rating: 5,
    testimonial: 'Real-time collaboration features and instant notifications have been game-changers for our emergency response times.'
  }
];

const stats = [
  { number: '500+', labelKey: 'landing.stats.hospitals' },
  { number: '50K+', labelKey: 'landing.stats.healthcare' },
  { number: '2M+', labelKey: 'landing.stats.patients' },
  { number: '99.9%', labelKey: 'landing.stats.uptime' }
];

export default function LandingPage({ onLogin, onRegister, onPricing, onPrivacy, onTerms, onMobileApp, onAIDiagnostics, onEnterpriseSettings }: LandingPageProps) {
  const { t, isRTL } = useLanguage();

  return (
    <div className={`min-h-screen bg-white dark:bg-background ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  {t('landing.brandName')}
                </h1>
                <p className="text-xs text-muted-foreground">{t('landing.tagline')}</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Button variant="ghost" onClick={onPricing}>{t('landing.nav.pricing')}</Button>
              <Button variant="ghost" onClick={() => {
                const featuresSection = document.getElementById('features');
                featuresSection?.scrollIntoView({ behavior: 'smooth' });
              }}>{t('landing.nav.features')}</Button>
              <Button variant="ghost" onClick={() => {
                const aboutSection = document.getElementById('about');
                aboutSection?.scrollIntoView({ behavior: 'smooth' });
              }}>{t('landing.nav.about')}</Button>
              <Button variant="ghost" onClick={() => {
                const contactSection = document.getElementById('contact');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
              }}>{t('landing.nav.contact')}</Button>
            </nav>

            <div className="flex items-center gap-3">
              <ThemeLanguageToggle variant="compact" showLabels={false} />
              <Button variant="outline" onClick={onLogin}>
                {t('landing.nav.login')}
              </Button>
              <Button onClick={onRegister} className="bg-blue-600 hover:bg-blue-700">
                {t('landing.nav.getStarted')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              {t('landing.hero.badge')}
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              {t('landing.hero.title')}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('landing.hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" onClick={onRegister} className="bg-blue-600 hover:bg-blue-700 px-8 hover-lift">
                {t('landing.hero.cta')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="px-8 hover-lift" onClick={() => {
                const demoSection = document.getElementById('demo-video');
                if (demoSection) {
                  demoSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                  // Open demo video modal or navigate to demo page
                  window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
                }
              }}>
                <Play className="w-5 h-5 mr-2" />
                {t('landing.hero.watchDemo')}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t(stat.labelKey)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-background/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('landing.features.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('landing.features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <CardTitle>{t(feature.titleKey)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {t(feature.descKey)}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('landing.testimonials.title')}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('landing.testimonials.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">
                    "{testimonial.testimonial}"
                  </p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              {t('landing.advanced.badge')} New Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Next-Generation Healthcare Technology
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the future of healthcare management with AI-powered diagnostics, mobile applications, and enterprise-grade solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* AI Diagnostics */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border-blue-200 dark:border-blue-800">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  AI-Powered Diagnostics
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <CardDescription className="text-base">
                  Revolutionary AI assistant that analyzes symptoms, provides differential diagnoses, and offers evidence-based recommendations with 94% accuracy.
                </CardDescription>
                <ul className="text-sm space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Multi-modal symptom analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Medical imaging AI</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Predictive analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Drug interaction detection</span>
                  </li>
                </ul>
                {onAIDiagnostics && (
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 hover-lift"
                    onClick={onAIDiagnostics}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Explore AI Diagnostics
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Mobile Application */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-200 dark:border-green-800" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Mobile App Suite
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <CardDescription className="text-base">
                  Comprehensive mobile applications for iOS and Android with offline capabilities, voice commands, and biometric security.
                </CardDescription>
                <ul className="text-sm space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Patient care on-the-go</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Secure messaging & video calls</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Voice-to-text documentation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Biometric authentication</span>
                  </li>
                </ul>
                {onMobileApp && (
                  <Button 
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover-lift"
                    onClick={onMobileApp}
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    View Mobile App
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Enterprise Solutions */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/50 dark:to-violet-950/50 border-purple-200 dark:border-purple-800" style={{ animationDelay: '0.2s' }}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                  Enterprise Solutions
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <CardDescription className="text-base">
                  Advanced configurations for large healthcare organizations with multi-location management, custom workflows, and enterprise security.
                </CardDescription>
                <ul className="text-sm space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Multi-location management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Advanced security & compliance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Scalable infrastructure</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Custom integrations</span>
                  </li>
                </ul>
                {onEnterpriseSettings && (
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 hover-lift"
                    onClick={onEnterpriseSettings}
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Enterprise Features
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Enterprise Stats */}
          <div className="mt-16 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  94%
                </div>
                <div className="text-sm text-muted-foreground">
                  AI Diagnostic Accuracy
                </div>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  10K+
                </div>
                <div className="text-sm text-muted-foreground">
                  Mobile App Downloads
                </div>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-2">
                  500+
                </div>
                <div className="text-sm text-muted-foreground">
                  Enterprise Clients
                </div>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                  99.9%
                </div>
                <div className="text-sm text-muted-foreground">
                  System Uptime
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('landing.cta.title')}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {t('landing.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" onClick={onRegister} className="px-8 hover-lift">
                {t('landing.cta.register')}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={onPricing} className="px-8 border-white text-white hover:bg-white hover:text-blue-600 hover-lift">
                {t('landing.cta.viewPricing')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50 dark:bg-background/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('landing.contact.title') || 'Get in Touch'}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {t('landing.contact.subtitle') || 'Have questions? Our team is here to help you get started.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Sales</h3>
                  <p className="text-sm text-muted-foreground mb-3">Talk to our sales team</p>
                  <a href="mailto:sales@medicore.com" className="text-blue-600 hover:underline text-sm">
                    sales@medicore.com
                  </a>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Support</h3>
                  <p className="text-sm text-muted-foreground mb-3">Get technical support</p>
                  <a href="mailto:support@medicore.com" className="text-blue-600 hover:underline text-sm">
                    support@medicore.com
                  </a>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Enterprise</h3>
                  <p className="text-sm text-muted-foreground mb-3">Enterprise solutions</p>
                  <a href="mailto:enterprise@medicore.com" className="text-blue-600 hover:underline text-sm">
                    enterprise@medicore.com
                  </a>
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={onRegister} className="bg-blue-600 hover:bg-blue-700">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" onClick={() => window.open('https://calendly.com/medicore', '_blank')}>
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold">{t('landing.brandName')}</span>
              </div>
              <p className="text-gray-400 text-sm">
                {t('landing.footer.description')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t('landing.footer.product')}</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Button variant="link" className="p-0 h-auto text-gray-400">{t('landing.nav.features')}</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-gray-400" onClick={onPricing}>{t('landing.nav.pricing')}</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-gray-400">{t('landing.footer.integrations')}</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-gray-400">{t('landing.footer.api')}</Button></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t('landing.footer.company')}</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Button variant="link" className="p-0 h-auto text-gray-400">{t('landing.footer.about')}</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-gray-400">{t('landing.footer.careers')}</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-gray-400">{t('landing.footer.contact')}</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-gray-400">{t('landing.footer.blog')}</Button></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t('landing.footer.legal')}</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Button variant="link" className="p-0 h-auto text-gray-400" onClick={onPrivacy}>{t('landing.footer.privacy')}</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-gray-400" onClick={onTerms}>{t('landing.footer.terms')}</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-gray-400">{t('landing.footer.security')}</Button></li>
                <li><Button variant="link" className="p-0 h-auto text-gray-400">{t('landing.footer.compliance')}</Button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2024 {t('landing.brandName')}. {t('landing.footer.rights')}
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">{t('landing.footer.global')}</span>
              <Lock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">{t('landing.footer.secure')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}