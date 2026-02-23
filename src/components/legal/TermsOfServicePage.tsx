import React from 'react';
import { ArrowLeft, FileText, Scale, Shield, AlertTriangle, Users, Gavel } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { useLanguage } from '../../services/LanguageService';
import ThemeLanguageToggle from '../settings/ThemeLanguageToggle';

interface TermsOfServicePageProps {
  onBack: () => void;
}

const sections = [
  {
    id: 'acceptance',
    icon: FileText,
    titleKey: 'terms.sections.acceptance.title',
    content: [
      {
        subtitleKey: 'terms.sections.acceptance.agreement.title',
        textKey: 'terms.sections.acceptance.agreement.text'
      },
      {
        subtitleKey: 'terms.sections.acceptance.modifications.title',
        textKey: 'terms.sections.acceptance.modifications.text'
      }
    ]
  },
  {
    id: 'services',
    icon: Shield,
    titleKey: 'terms.sections.services.title',
    content: [
      {
        subtitleKey: 'terms.sections.services.description.title',
        textKey: 'terms.sections.services.description.text'
      },
      {
        subtitleKey: 'terms.sections.services.availability.title',
        textKey: 'terms.sections.services.availability.text'
      },
      {
        subtitleKey: 'terms.sections.services.updates.title',
        textKey: 'terms.sections.services.updates.text'
      }
    ]
  },
  {
    id: 'user-obligations',
    icon: Users,
    titleKey: 'terms.sections.obligations.title',
    content: [
      {
        subtitleKey: 'terms.sections.obligations.account.title',
        textKey: 'terms.sections.obligations.account.text'
      },
      {
        subtitleKey: 'terms.sections.obligations.compliance.title',
        textKey: 'terms.sections.obligations.compliance.text'
      },
      {
        subtitleKey: 'terms.sections.obligations.prohibited.title',
        textKey: 'terms.sections.obligations.prohibited.text'
      }
    ]
  },
  {
    id: 'data-responsibility',
    icon: Scale,
    titleKey: 'terms.sections.data.title',
    content: [
      {
        subtitleKey: 'terms.sections.data.ownership.title',
        textKey: 'terms.sections.data.ownership.text'
      },
      {
        subtitleKey: 'terms.sections.data.backup.title',
        textKey: 'terms.sections.data.backup.text'
      },
      {
        subtitleKey: 'terms.sections.data.security.title',
        textKey: 'terms.sections.data.security.text'
      }
    ]
  },
  {
    id: 'payment-terms',
    icon: Gavel,
    titleKey: 'terms.sections.payment.title',
    content: [
      {
        subtitleKey: 'terms.sections.payment.billing.title',
        textKey: 'terms.sections.payment.billing.text'
      },
      {
        subtitleKey: 'terms.sections.payment.refunds.title',
        textKey: 'terms.sections.payment.refunds.text'
      },
      {
        subtitleKey: 'terms.sections.payment.suspension.title',
        textKey: 'terms.sections.payment.suspension.text'
      }
    ]
  },
  {
    id: 'liability',
    icon: AlertTriangle,
    titleKey: 'terms.sections.liability.title',
    content: [
      {
        subtitleKey: 'terms.sections.liability.limitation.title',
        textKey: 'terms.sections.liability.limitation.text'
      },
      {
        subtitleKey: 'terms.sections.liability.medical.title',
        textKey: 'terms.sections.liability.medical.text'
      },
      {
        subtitleKey: 'terms.sections.liability.indemnification.title',
        textKey: 'terms.sections.liability.indemnification.text'
      }
    ]
  }
];

const keyPoints = [
  {
    icon: FileText,
    titleKey: 'terms.keyPoints.agreement.title',
    descKey: 'terms.keyPoints.agreement.desc',
    color: 'text-blue-600'
  },
  {
    icon: Shield,
    titleKey: 'terms.keyPoints.compliance.title',
    descKey: 'terms.keyPoints.compliance.desc',
    color: 'text-green-600'
  },
  {
    icon: Scale,
    titleKey: 'terms.keyPoints.responsibility.title',
    descKey: 'terms.keyPoints.responsibility.desc',
    color: 'text-purple-600'
  },
  {
    icon: AlertTriangle,
    titleKey: 'terms.keyPoints.liability.title',
    descKey: 'terms.keyPoints.liability.desc',
    color: 'text-orange-600'
  }
];

export default function TermsOfServicePage({ onBack }: TermsOfServicePageProps) {
  const { t, isRTL } = useLanguage();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-background ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="hover-lift">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('common.back')}
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold">{t('terms.title')}</h1>
            </div>

            <ThemeLanguageToggle variant="compact" showLabels={false} />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {t('terms.hero.title')}
          </h1>
          <p className="text-xl text-muted-foreground mb-4 max-w-3xl mx-auto">
            {t('terms.hero.subtitle')}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>{t('terms.effectiveDate')}: December 1, 2024</span>
            <Badge variant="secondary">{t('terms.version')} 3.0</Badge>
          </div>
        </div>

        {/* Important Notice */}
        <Alert className="mb-12 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20 animate-fade-in">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800 dark:text-orange-200">
            <strong>{t('terms.notice.title')}</strong> {t('terms.notice.text')}
          </AlertDescription>
        </Alert>

        {/* Key Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {keyPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${point.color}`} />
                  </div>
                  <h3 className="font-semibold mb-2">{t(point.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground">{t(point.descKey)}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">{t('terms.tableOfContents')}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {sections.map((section, index) => {
                    const Icon = section.icon;
                    return (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors animate-fade-in"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <Icon className="w-4 h-4 text-purple-600" />
                        {t(section.titleKey)}
                      </a>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card key={section.id} id={section.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-purple-600" />
                      </div>
                      <CardTitle className="text-xl">{t(section.titleKey)}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        <h3 className="font-semibold mb-3 text-lg">{t(item.subtitleKey)}</h3>
                        <p className="text-muted-foreground leading-relaxed">{t(item.textKey)}</p>
                        {itemIndex < section.content.length - 1 && <Separator className="mt-6" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}

            {/* Governing Law */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-xl">{t('terms.governing.title')}</CardTitle>
                <CardDescription>{t('terms.governing.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">{t('terms.governing.jurisdiction.title')}</h4>
                    <p className="text-sm text-muted-foreground">{t('terms.governing.jurisdiction.text')}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">{t('terms.governing.disputes.title')}</h4>
                    <p className="text-sm text-muted-foreground">{t('terms.governing.disputes.text')}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold mb-2">{t('terms.governing.changes.title')}</h4>
                  <p className="text-sm text-muted-foreground">{t('terms.governing.changes.text')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-xl">{t('terms.contact.title')}</CardTitle>
                <CardDescription>{t('terms.contact.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">{t('terms.contact.legal.title')}</h4>
                    <p className="text-sm text-muted-foreground">Hospital Management Systems Inc.</p>
                    <p className="text-sm text-muted-foreground">123 Healthcare Avenue, Suite 456</p>
                    <p className="text-sm text-muted-foreground">Medical City, MC 12345</p>
                    <p className="text-sm text-muted-foreground">legal@hospitalmanagement.com</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">{t('terms.contact.support.title')}</h4>
                    <p className="text-sm text-muted-foreground">support@hospitalmanagement.com</p>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                    <p className="text-sm text-muted-foreground">{t('terms.contact.support.hours')}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="text-center">
                  <Button className="bg-purple-600 hover:bg-purple-700 hover-lift">
                    {t('terms.contact.button')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}