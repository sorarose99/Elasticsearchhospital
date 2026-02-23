import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Activity,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  FileText,
  Heart,
  Stethoscope
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import OverviewAnalytics from './OverviewAnalytics';
import FinancialAnalytics from './FinancialAnalytics';
import ClinicalAnalytics from './ClinicalAnalytics';

interface AnalyticsDashboardProps {
  userRole: string;
}

export default function AnalyticsDashboard({ userRole }: AnalyticsDashboardProps) {
  const { language, t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Quick stats for header
  const quickStats = useMemo(() => [
    {
      id: 'revenue',
      title: language === 'ar' ? 'الإيرادات الشهرية' : 'Monthly Revenue',
      value: '$52,400',
      change: '+12.5%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      id: 'patients',
      title: language === 'ar' ? 'المرضى الجدد' : 'New Patients',
      value: '348',
      change: '+8.2%',
      trend: 'up' as const,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      id: 'appointments',
      title: language === 'ar' ? 'المواعيد اليوم' : 'Today\'s Appointments',
      value: '42',
      change: '-3.1%',
      trend: 'down' as const,
      icon: Calendar,
      color: 'text-orange-600'
    },
    {
      id: 'occupancy',
      title: language === 'ar' ? 'نسبة الإشغال' : 'Bed Occupancy',
      value: '78%',
      change: '+5.4%',
      trend: 'up' as const,
      icon: Activity,
      color: 'text-purple-600'
    }
  ], [language]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleExport = () => {
    // Handle export functionality
    console.log('Exporting analytics data...');
  };

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              {language === 'ar' ? 'لوحة التحليلات' : 'Analytics Dashboard'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {language === 'ar' 
                ? 'تحليل شامل لأداء المستشفى والرؤى الإحصائية' 
                : 'Comprehensive hospital performance analysis and insights'
              }
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {language === 'ar' ? 'تحديث' : 'Refresh'}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              {language === 'ar' ? 'فلترة' : 'Filter'}
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={handleExport}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {language === 'ar' ? 'تصدير' : 'Export'}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {quickStats.map((stat) => (
            <Card key={stat.id} className="border border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-semibold text-foreground mt-1">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <span className={`text-xs ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {language === 'ar' ? 'نظرة عامة' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              {language === 'ar' ? 'التحليلات المالية' : 'Financial Analytics'}
            </TabsTrigger>
            <TabsTrigger value="clinical" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              {language === 'ar' ? 'التحليلات السريرية' : 'Clinical Analytics'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <OverviewAnalytics userRole={userRole} />
          </TabsContent>

          <TabsContent value="financial" className="mt-6">
            <FinancialAnalytics userRole={userRole} />
          </TabsContent>

          <TabsContent value="clinical" className="mt-6">
            <ClinicalAnalytics userRole={userRole} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}