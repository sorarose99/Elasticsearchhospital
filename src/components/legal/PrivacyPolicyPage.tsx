import React from 'react';
import { ArrowLeft, Shield, Eye, Lock, Database, Users, Globe } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { useLanguage } from '../../services/LanguageService';
import ThemeLanguageToggle from '../settings/ThemeLanguageToggle';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

const sections = [
  {
    id: 'information-collection',
    icon: Database,
    titleKey: 'privacy.sections.collection.title',
    content: [
      {
        subtitleKey: 'privacy.sections.collection.personal.title',
        textKey: 'privacy.sections.collection.personal.text'
      },
      {
        subtitleKey: 'privacy.sections.collection.medical.title',
        textKey: 'privacy.sections.collection.medical.text'
      },
      {
        subtitleKey: 'privacy.sections.collection.usage.title',
        textKey: 'privacy.sections.collection.usage.text'
      }
    ]
  },
  {
    id: 'information-use',
    icon: Eye,
    titleKey: 'privacy.sections.use.title',
    content: [
      {
        subtitleKey: 'privacy.sections.use.medical.title',
        textKey: 'privacy.sections.use.medical.text'
      },
      {
        subtitleKey: 'privacy.sections.use.operational.title',
        textKey: 'privacy.sections.use.operational.text'
      },
      {
        subtitleKey: 'privacy.sections.use.improvement.title',
        textKey: 'privacy.sections.use.improvement.text'
      }
    ]
  },
  {
    id: 'information-sharing',
    icon: Users,
    titleKey: 'privacy.sections.sharing.title',
    content: [
      {
        subtitleKey: 'privacy.sections.sharing.healthcare.title',
        textKey: 'privacy.sections.sharing.healthcare.text'
      },
      {
        subtitleKey: 'privacy.sections.sharing.legal.title',
        textKey: 'privacy.sections.sharing.legal.text'
      },
      {
        subtitleKey: 'privacy.sections.sharing.consent.title',
        textKey: 'privacy.sections.sharing.consent.text'
      }
    ]
  },
  {
    id: 'data-security',
    icon: Lock,
    titleKey: 'privacy.sections.security.title',
    content: [
      {
        subtitleKey: 'privacy.sections.security.encryption.title',
        textKey: 'privacy.sections.security.encryption.text'
      },
      {
        subtitleKey: 'privacy.sections.security.access.title',
        textKey: 'privacy.sections.security.access.text'
      },
      {
        subtitleKey: 'privacy.sections.security.compliance.title',
        textKey: 'privacy.sections.security.compliance.text'
      }
    ]
  },
  {
    id: 'user-rights',
    icon: Shield,
    titleKey: 'privacy.sections.rights.title',
    content: [
      {
        subtitleKey: 'privacy.sections.rights.access.title',
        textKey: 'privacy.sections.rights.access.text'
      },
      {
        subtitleKey: 'privacy.sections.rights.correction.title',
        textKey: 'privacy.sections.rights.correction.text'
      },
      {
        subtitleKey: 'privacy.sections.rights.deletion.title',
        textKey: 'privacy.sections.rights.deletion.text'
      },
      {
        subtitleKey: 'privacy.sections.rights.portability.title',
        textKey: 'privacy.sections.rights.portability.text'
      }
    ]
  },
  {
    id: 'international',
    icon: Globe,
    titleKey: 'privacy.sections.international.title',
    content: [
      {
        subtitleKey: 'privacy.sections.international.transfers.title',
        textKey: 'privacy.sections.international.transfers.text'
      },
      {
        subtitleKey: 'privacy.sections.international.safeguards.title',
        textKey: 'privacy.sections.international.safeguards.text'
      }
    ]
  }
];

const highlights = [
  {
    icon: Shield,
    titleKey: 'privacy.highlights.hipaa.title',
    descKey: 'privacy.highlights.hipaa.desc',
    color: 'text-green-600'
  },
  {
    icon: Lock,
    titleKey: 'privacy.highlights.encryption.title',
    descKey: 'privacy.highlights.encryption.desc',
    color: 'text-blue-600'
  },
  {
    icon: Eye,
    titleKey: 'privacy.highlights.transparency.title',
    descKey: 'privacy.highlights.transparency.desc',
    color: 'text-purple-600'
  },
  {
    icon: Users,
    titleKey: 'privacy.highlights.control.title',
    descKey: 'privacy.highlights.control.desc',
    color: 'text-orange-600'
  }
];

export default function PrivacyPolicyPage({ onBack }: PrivacyPolicyPageProps) {
  const { t, isRTL } = useLanguage();

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
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold">{t('privacy.title')}</h1>
            </div>

            <ThemeLanguageToggle variant="compact" showLabels={false} />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('privacy.hero.title')}
          </h1>
          <p className="text-xl text-muted-foreground mb-4 max-w-3xl mx-auto">
            {t('privacy.hero.subtitle')}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>{t('privacy.lastUpdated')}: December 1, 2024</span>
            <Badge variant="secondary">{t('privacy.version')} 2.1</Badge>
          </div>
        </div>

        {/* Privacy Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${highlight.color}`} />
                  </div>
                  <h3 className="font-semibold mb-2">{t(highlight.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground">{t(highlight.descKey)}</p>
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
                <CardTitle className="text-lg">{t('privacy.tableOfContents')}</CardTitle>
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
                        <Icon className="w-4 h-4 text-blue-600" />
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
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-blue-600" />
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

            {/* Contact Information */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-xl">{t('privacy.contact.title')}</CardTitle>
                <CardDescription>{t('privacy.contact.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">{t('privacy.contact.dpo.title')}</h4>
                    <p className="text-sm text-muted-foreground">{t('privacy.contact.dpo.name')}</p>
                    <p className="text-sm text-muted-foreground">privacy@hospitalmanagement.com</p>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">{t('privacy.contact.legal.title')}</h4>
                    <p className="text-sm text-muted-foreground">{t('privacy.contact.legal.address')}</p>
                    <p className="text-sm text-muted-foreground">legal@hospitalmanagement.com</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="text-center">
                  <Button className="bg-blue-600 hover:bg-blue-700 hover-lift">
                    {t('privacy.contact.button')}
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