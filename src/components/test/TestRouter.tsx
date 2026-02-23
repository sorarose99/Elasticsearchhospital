import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { TestTube2, Palette, Activity, Eye, Calendar, Database } from 'lucide-react';
import ColorContrastTest from './ColorContrastTest';
import ColorStabilityTest from './ColorStabilityTest';
import AppointmentTest from './AppointmentTest';
import DatabaseStatusChecker from '../database/DatabaseStatusChecker';
import DOMValidationTest from './DOMValidationTest';
import { useLanguage } from '../../services/LanguageService';
import { useNavigation } from '../navigation/NavigationContext';

const TestRouter: React.FC = () => {
  const { language } = useLanguage();
  const { navigation } = useNavigation();

  if (!navigation.currentView || navigation.currentView === 'overview') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {language === 'ar' ? 'مختبر اختبار النظام' : 'System Testing Lab'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? 'أدوات شاملة لاختبار وضمان جودة النظام'
                : 'Comprehensive tools for testing and quality assurance'
              }
            </p>
          </div>
          <Badge variant="secondary">
            {language === 'ar' ? 'أدوات اختبار' : 'Testing Tools'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Color Contrast Test */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Eye className="w-6 h-6 text-blue-600" />
                <CardTitle className="text-lg">
                  {language === 'ar' ? 'اختبار التباين' : 'Contrast Test'}
                </CardTitle>
              </div>
              <CardDescription>
                {language === 'ar' 
                  ? 'فحص إمكانية الوصول والتباين للألوان'
                  : 'Check accessibility and color contrast levels'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => {
                  // This would normally navigate, but we'll show inline for demo
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'تشغيل الاختبار' : 'Run Test'}
              </Button>
            </CardContent>
          </Card>

          {/* Color Stability Test */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Activity className="w-6 h-6 text-green-600" />
                <CardTitle className="text-lg">
                  {language === 'ar' ? 'اختبار الاستقرار' : 'Stability Test'}
                </CardTitle>
              </div>
              <CardDescription>
                {language === 'ar' 
                  ? 'مراقبة استقرار الألوان في الوقت الفعلي'
                  : 'Monitor color stability in real-time'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => {
                  // This would normally navigate, but we'll show inline for demo
                }}
              >
                <Activity className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'بدء المراقبة' : 'Start Monitoring'}
              </Button>
            </CardContent>
          </Card>

          {/* Appointments System Test */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-indigo-600" />
                <CardTitle className="text-lg">
                  {language === 'ar' ? 'اختبار نظام المواعيد' : 'Appointments Test'}
                </CardTitle>
              </div>
              <CardDescription>
                {language === 'ar' 
                  ? 'اختبار نظام حجز المواعيد مع رمز QR والإشعارات'
                  : 'Test appointment scheduling with QR codes and notifications'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="default" 
                className="w-full"
                onClick={() => {
                  // This would normally navigate, but we'll show inline for demo
                }}
              >
                <Calendar className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'تشغيل الاختبار' : 'Run Test'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Combined Testing Interface */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'ar' ? 'أدوات الاختبار المتقدمة' : 'Advanced Testing Tools'}
            </CardTitle>
            <CardDescription>
              {language === 'ar' 
                ? 'واجهة شاملة لجميع أدوات اختبار النظام'
                : 'Comprehensive interface for all system testing tools'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="database" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="database" className="flex items-center space-x-2">
                  <Database className="w-4 h-4" />
                  <span>{language === 'ar' ? 'قاعدة البيانات' : 'Database'}</span>
                </TabsTrigger>
                <TabsTrigger value="appointments" className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{language === 'ar' ? 'المواعيد' : 'Appointments'}</span>
                </TabsTrigger>
                <TabsTrigger value="contrast" className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>{language === 'ar' ? 'التباين' : 'Contrast'}</span>
                </TabsTrigger>
                <TabsTrigger value="stability" className="flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>{language === 'ar' ? 'الاستقرار' : 'Stability'}</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="database" className="mt-6">
                <DatabaseStatusChecker autoRun={true} />
              </TabsContent>
              
              <TabsContent value="appointments" className="mt-6">
                <AppointmentTest />
              </TabsContent>
              
              <TabsContent value="contrast" className="mt-6">
                <ColorContrastTest />
              </TabsContent>
              
              <TabsContent value="stability" className="mt-6">
                <ColorStabilityTest />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Testing Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                {language === 'ar' ? 'اختبارات اليوم' : 'Tests Today'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                {language === 'ar' ? '+3 من الأمس' : '+3 from yesterday'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                {language === 'ar' ? 'معدل النجاح' : 'Success Rate'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">94%</div>
              <p className="text-xs text-muted-foreground">
                {language === 'ar' ? 'من جميع الاختبارات' : 'of all tests'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                {language === 'ar' ? 'مشاكل محلولة' : 'Issues Resolved'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">8</div>
              <p className="text-xs text-muted-foreground">
                {language === 'ar' ? 'هذا الأسبوع' : 'this week'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                {language === 'ar' ? 'وقت الاستجابة' : 'Response Time'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">0.8s</div>
              <p className="text-xs text-muted-foreground">
                {language === 'ar' ? 'متوسط' : 'average'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Handle specific views
  switch (navigation.currentView) {
    case 'appointments':
      return <AppointmentTest />;
    case 'contrast':
      return <ColorContrastTest />;
    case 'stability':
      return <ColorStabilityTest />;
    default:
      return <div>Test view not found</div>;
  }
};

export default TestRouter;