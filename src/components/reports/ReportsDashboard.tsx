import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  FileText, 
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
  BarChart3,
  Heart,
  Stethoscope,
  Settings,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  Printer,
  Share,
  BookOpen,
  PieChart,
  LineChart
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import OverviewReports from './OverviewReports';
import FinancialReports from './FinancialReports';
import ClinicalReports from './ClinicalReports';
import OperationalReports from './OperationalReports';

interface ReportsDashboardProps {
  userRole: string;
}

export default function ReportsDashboard({ userRole }: ReportsDashboardProps) {
  const { language, t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Quick report stats
  const reportStats = useMemo(() => [
    {
      id: 'total_reports',
      title: language === 'ar' ? 'إجمالي التقارير' : 'Total Reports',
      value: '156',
      change: '+12',
      trend: 'up' as const,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'scheduled_reports',
      title: language === 'ar' ? 'التقارير المجدولة' : 'Scheduled Reports',
      value: '23',
      change: '+3',
      trend: 'up' as const,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'generated_today',
      title: language === 'ar' ? 'تم إنشاؤها اليوم' : 'Generated Today',
      value: '8',
      change: '-2',
      trend: 'down' as const,
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'pending_approval',
      title: language === 'ar' ? 'في انتظار الموافقة' : 'Pending Approval',
      value: '5',
      change: '+1',
      trend: 'up' as const,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ], [language]);

  // Recent reports
  const recentReports = useMemo(() => [
    {
      id: 1,
      name: language === 'ar' ? 'تقرير الإيرادات الشهرية' : 'Monthly Revenue Report',
      type: language === 'ar' ? 'مالي' : 'Financial',
      status: 'completed',
      generatedBy: language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohamed',
      generatedAt: '2024-01-20T10:30:00Z',
      size: '2.5 MB'
    },
    {
      id: 2,
      name: language === 'ar' ? 'إحصائيات المرضى الأسبوعية' : 'Weekly Patient Statistics',
      type: language === 'ar' ? 'سريري' : 'Clinical',
      status: 'processing',
      generatedBy: language === 'ar' ? 'فاطمة علي' : 'Fatima Ali',
      generatedAt: '2024-01-20T09:15:00Z',
      size: '1.8 MB'
    },
    {
      id: 3,
      name: language === 'ar' ? 'تقرير كفاءة العمليات' : 'Operational Efficiency Report',
      type: language === 'ar' ? 'تشغيلي' : 'Operational',
      status: 'pending',
      generatedBy: language === 'ar' ? 'محمد حسن' : 'Mohamed Hassan',
      generatedAt: '2024-01-20T08:45:00Z',
      size: '3.2 MB'
    }
  ], [language]);

  // Report categories
  const reportCategories = useMemo(() => [
    {
      id: 'financial',
      name: language === 'ar' ? 'التقارير المالية' : 'Financial Reports',
      count: 45,
      icon: DollarSign,
      color: 'text-green-600',
      description: language === 'ar' ? 'إيرادات، مصروفات، ربحية' : 'Revenue, expenses, profitability'
    },
    {
      id: 'clinical',
      name: language === 'ar' ? 'التقارير السريرية' : 'Clinical Reports',
      count: 38,
      icon: Stethoscope,
      color: 'text-blue-600',
      description: language === 'ar' ? 'جودة الرعاية، نتائج المرضى' : 'Care quality, patient outcomes'
    },
    {
      id: 'operational',
      name: language === 'ar' ? 'التقارير التشغيلية' : 'Operational Reports',
      count: 52,
      icon: Settings,
      color: 'text-purple-600',
      description: language === 'ar' ? 'كفاءة العمليات، إدارة الموارد' : 'Process efficiency, resource management'
    },
    {
      id: 'regulatory',
      name: language === 'ar' ? 'التقارير التنظيمية' : 'Regulatory Reports',
      count: 21,
      icon: BookOpen,
      color: 'text-red-600',
      description: language === 'ar' ? 'الامتثال، التدقيق، الجودة' : 'Compliance, auditing, quality'
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
    console.log('Exporting reports data...');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            {language === 'ar' ? 'مكتمل' : 'Completed'}
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Activity className="h-3 w-3 mr-1" />
            {language === 'ar' ? 'معالج' : 'Processing'}
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800">
            <Clock className="h-3 w-3 mr-1" />
            {language === 'ar' ? 'معلق' : 'Pending'}
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      day: '2-digit',
      month: 'short'
    }).format(date);
  };

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              {language === 'ar' ? 'التقارير والتحليلات المتقدمة' : 'Advanced Reports & Analytics'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {language === 'ar' 
                ? 'إنشاء وإدارة التقارير الشاملة والتحليلات التفصيلية' 
                : 'Generate and manage comprehensive reports and detailed analytics'
              }
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">
                  {language === 'ar' ? 'اليوم' : 'Today'}
                </SelectItem>
                <SelectItem value="week">
                  {language === 'ar' ? 'هذا الأسبوع' : 'This Week'}
                </SelectItem>
                <SelectItem value="month">
                  {language === 'ar' ? 'هذا الشهر' : 'This Month'}
                </SelectItem>
                <SelectItem value="quarter">
                  {language === 'ar' ? 'هذا الربع' : 'This Quarter'}
                </SelectItem>
                <SelectItem value="year">
                  {language === 'ar' ? 'هذا العام' : 'This Year'}
                </SelectItem>
              </SelectContent>
            </Select>
            
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
          {reportStats.map((stat) => (
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
                  <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.color}`}>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {language === 'ar' ? 'نظرة عامة' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              {language === 'ar' ? 'التقارير المالية' : 'Financial Reports'}
            </TabsTrigger>
            <TabsTrigger value="clinical" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              {language === 'ar' ? 'التقارير السريرية' : 'Clinical Reports'}
            </TabsTrigger>
            <TabsTrigger value="operational" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              {language === 'ar' ? 'التقارير التشغيلية' : 'Operational Reports'}
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Overview */}
          {activeTab === 'overview' && (
            <div className="mt-6 space-y-6">
              {/* Report Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {reportCategories.map((category) => (
                  <Card key={category.id} className="border border-border hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <category.icon className={`h-5 w-5 ${category.color}`} />
                            <h3 className="font-medium text-foreground">{category.name}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                          <Badge variant="secondary" className="text-xs">
                            {category.count} {language === 'ar' ? 'تقرير' : 'reports'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Reports */}
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    {language === 'ar' ? 'التقارير الحديثة' : 'Recent Reports'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentReports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{report.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{report.type}</span>
                              <span>•</span>
                              <span>{formatTime(report.generatedAt)}</span>
                              <span>•</span>
                              <span>{report.generatedBy}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(report.status)}
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Eye className="h-3 w-3" />
                            {language === 'ar' ? 'عرض' : 'View'}
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Download className="h-3 w-3" />
                            {language === 'ar' ? 'تحميل' : 'Download'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <OverviewReports userRole={userRole} />
            </div>
          )}

          <TabsContent value="financial" className="mt-6">
            <FinancialReports userRole={userRole} />
          </TabsContent>

          <TabsContent value="clinical" className="mt-6">
            <ClinicalReports userRole={userRole} />
          </TabsContent>

          <TabsContent value="operational" className="mt-6">
            <OperationalReports userRole={userRole} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}