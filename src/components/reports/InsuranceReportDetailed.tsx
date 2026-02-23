import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DatePicker } from '../ui/date-picker';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  Shield, Clock, CheckCircle, XCircle, AlertTriangle, Download, 
  Filter, RefreshCw, FileText, DollarSign, Percent,
  ArrowUpRight, ArrowDownRight, Calendar, Users
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';

interface InsuranceData {
  period: string;
  totalClaims: number;
  submittedClaims: number;
  approvedClaims: number;
  rejectedClaims: number;
  pendingClaims: number;
  totalAmount: number;
  approvedAmount: number;
  rejectedAmount: number;
  averageProcessingDays: number;
}

interface InsuranceProvider {
  provider: string;
  totalClaims: number;
  approvedClaims: number;
  rejectedClaims: number;
  pendingClaims: number;
  totalAmount: number;
  approvedAmount: number;
  approvalRate: number;
  averageAmount: number;
  color: string;
}

interface ClaimStatus {
  status: string;
  count: number;
  amount: number;
  percentage: number;
  color: string;
}

const InsuranceReportDetailed: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [toDate, setToDate] = useState<Date | undefined>(new Date());

  // Mock data - في التطبيق الحقيقي، سيتم جلب البيانات من الخادم
  const [insuranceData, setInsuranceData] = useState<InsuranceData[]>([
    { 
      period: '2024-01', 
      totalClaims: 125, 
      submittedClaims: 125, 
      approvedClaims: 98, 
      rejectedClaims: 15, 
      pendingClaims: 12,
      totalAmount: 185000, 
      approvedAmount: 142000, 
      rejectedAmount: 28000,
      averageProcessingDays: 8.5
    },
    { 
      period: '2024-02', 
      totalClaims: 142, 
      submittedClaims: 142, 
      approvedClaims: 115, 
      rejectedClaims: 18, 
      pendingClaims: 9,
      totalAmount: 210000, 
      approvedAmount: 168000, 
      rejectedAmount: 32000,
      averageProcessingDays: 7.2
    },
    { 
      period: '2024-03', 
      totalClaims: 158, 
      submittedClaims: 158, 
      approvedClaims: 128, 
      rejectedClaims: 22, 
      pendingClaims: 8,
      totalAmount: 235000, 
      approvedAmount: 189000, 
      rejectedAmount: 38000,
      averageProcessingDays: 6.8
    },
    { 
      period: '2024-04', 
      totalClaims: 171, 
      submittedClaims: 171, 
      approvedClaims: 142, 
      rejectedClaims: 20, 
      pendingClaims: 9,
      totalAmount: 258000, 
      approvedAmount: 215000, 
      rejectedAmount: 35000,
      averageProcessingDays: 6.5
    },
    { 
      period: '2024-05', 
      totalClaims: 189, 
      submittedClaims: 189, 
      approvedClaims: 158, 
      rejectedClaims: 25, 
      pendingClaims: 6,
      totalAmount: 285000, 
      approvedAmount: 238000, 
      rejectedAmount: 42000,
      averageProcessingDays: 6.1
    },
    { 
      period: '2024-06', 
      totalClaims: 203, 
      submittedClaims: 203, 
      approvedClaims: 172, 
      rejectedClaims: 23, 
      pendingClaims: 8,
      totalAmount: 312000, 
      approvedAmount: 268000, 
      rejectedAmount: 36000,
      averageProcessingDays: 5.8
    }
  ]);

  const insuranceProviders: InsuranceProvider[] = [
    { 
      provider: 'شركة بوبا العربية', 
      totalClaims: 65, 
      approvedClaims: 58, 
      rejectedClaims: 5, 
      pendingClaims: 2,
      totalAmount: 98000, 
      approvedAmount: 85000, 
      approvalRate: 89.2, 
      averageAmount: 1507,
      color: '#3b82f6'
    },
    { 
      provider: 'شركة التعاونية للتأمين', 
      totalClaims: 52, 
      approvedClaims: 44, 
      rejectedClaims: 6, 
      pendingClaims: 2,
      totalAmount: 78000, 
      approvedAmount: 68000, 
      approvalRate: 84.6, 
      averageAmount: 1500,
      color: '#10b981'
    },
    { 
      provider: 'شركة ولاء للتأمين', 
      totalClaims: 48, 
      approvedClaims: 42, 
      rejectedClaims: 4, 
      pendingClaims: 2,
      totalAmount: 72000, 
      approvedAmount: 64000, 
      approvalRate: 87.5, 
      averageAmount: 1500,
      color: '#f59e0b'
    },
    { 
      provider: 'شركة ملاذ للتأمين', 
      totalClaims: 24, 
      approvedClaims: 19, 
      rejectedClaims: 4, 
      pendingClaims: 1,
      totalAmount: 38000, 
      approvedAmount: 32000, 
      approvalRate: 79.2, 
      averageAmount: 1583,
      color: '#ef4444'
    },
    { 
      provider: 'شركة الأهلي توكالافا', 
      totalClaims: 14, 
      approvedClaims: 9, 
      rejectedClaims: 4, 
      pendingClaims: 1,
      totalAmount: 26000, 
      approvedAmount: 19000, 
      approvalRate: 64.3, 
      averageAmount: 1857,
      color: '#8b5cf6'
    }
  ];

  const claimStatuses: ClaimStatus[] = [
    { status: 'معتمد', count: 172, amount: 268000, percentage: 84.7, color: '#10b981' },
    { status: 'مرفوض', count: 23, amount: 36000, percentage: 11.3, color: '#ef4444' },
    { status: 'قيد المراجعة', count: 8, amount: 8000, percentage: 3.9, color: '#f59e0b' }
  ];

  const currentApprovalRate = 84.7;
  const lastMonthApprovalRate = 83.6;
  const averageProcessingTime = 5.8;
  const targetProcessingTime = 5.0;

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log(`Exporting insurance report as ${format}`);
    }, 2000);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            {t('reports.insuranceReport')}
          </h1>
          <p className="text-muted-foreground mt-1">
            تقرير شامل عن مطالبات التأمين والشركات المختلفة
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={loading}
            className="animate-scale-in"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {t('common.refresh')}
          </Button>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">اليوم</SelectItem>
              <SelectItem value="thisWeek">هذا الأسبوع</SelectItem>
              <SelectItem value="thisMonth">هذا الشهر</SelectItem>
              <SelectItem value="thisQuarter">هذا الربع</SelectItem>
              <SelectItem value="thisYear">هذا العام</SelectItem>
              <SelectItem value="custom">فترة مخصصة</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-lift card-animate">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي المطالبات</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">203</p>
                  <Badge variant="secondary" className="text-xs">مطالبة</Badge>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-blue-500" />
                  <span className="text-xs text-blue-500 font-medium">+7.4%</span>
                  <span className="text-xs text-muted-foreground">من الشهر الماضي</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift card-animate" style={{animationDelay: '0.1s'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">معدل الموافقة</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{currentApprovalRate}</p>
                  <Badge variant="secondary" className="text-xs">%</Badge>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500 font-medium">+{(currentApprovalRate - lastMonthApprovalRate).toFixed(1)}%</span>
                  <span className="text-xs text-muted-foreground">من الشهر الماضي</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift card-animate" style={{animationDelay: '0.2s'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي المبلغ المعتمد</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">268,000</p>
                  <Badge variant="secondary" className="text-xs">ريال</Badge>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <DollarSign className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500 font-medium">85.9%</span>
                  <span className="text-xs text-muted-foreground">من المطلوب</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift card-animate" style={{animationDelay: '0.3s'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">متوسط وقت المعالجة</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{averageProcessingTime}</p>
                  <Badge variant="secondary" className="text-xs">أيام</Badge>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3 text-orange-500" />
                  <span className="text-xs text-orange-500 font-medium">الهدف: {targetProcessingTime}</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="trends">الاتجاهات</TabsTrigger>
          <TabsTrigger value="providers">شركات التأمين</TabsTrigger>
          <TabsTrigger value="status">حالة المطالبات</TabsTrigger>
          <TabsTrigger value="analysis">التحليل</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Claims Trend Chart */}
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  اتجاه مطالبات التأمين الشهرية
                </CardTitle>
                <CardDescription>
                  تطور أعداد ومبالغ المطالبات على مدى 6 أشهر
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={insuranceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value: number, name: string) => {
                        if (name.includes('مبلغ')) {
                          return [`${value.toLocaleString()} ريال`, name];
                        }
                        return [`${value}`, name];
                      }}
                      labelFormatter={(label) => `الفترة: ${label}`}
                    />
                    <Legend />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="approvedClaims" 
                      stackId="1" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.6}
                      name="المطالبات المعتمدة"
                    />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="rejectedClaims" 
                      stackId="1" 
                      stroke="#ef4444" 
                      fill="#ef4444" 
                      fillOpacity={0.6}
                      name="المطالبات المرفوضة"
                    />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="pendingClaims" 
                      stackId="1" 
                      stroke="#f59e0b" 
                      fill="#f59e0b" 
                      fillOpacity={0.6}
                      name="المطالبات المعلقة"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="approvedAmount" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="المبلغ المعتمد"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Insurance Providers Performance */}
            <Card>
              <CardHeader>
                <CardTitle>أداء شركات التأمين</CardTitle>
                <CardDescription>مقارنة معدلات الموافقة بين الشركات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insuranceProviders.map((provider, index) => (
                    <div key={provider.provider} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{provider.provider}</span>
                        <Badge 
                          variant={provider.approvalRate >= 85 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {provider.approvalRate.toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">المطالبات</p>
                          <p className="font-semibold">{provider.totalClaims}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">المعتمد</p>
                          <p className="font-semibold text-green-600">{provider.approvedClaims}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">المبلغ</p>
                          <p className="font-semibold">{provider.approvedAmount.toLocaleString()}</p>
                        </div>
                      </div>
                      <Progress value={provider.approvalRate} className="mt-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Claim Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>توزيع حالة المطالبات</CardTitle>
                <CardDescription>التوزيع الحالي لحالات المطالبات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {claimStatuses.map((status, index) => (
                    <div key={status.status} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: status.color }}
                        />
                        <span className="font-medium">{status.status}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          {status.count} مطالبة
                        </span>
                        <span className="font-semibold">
                          {status.amount.toLocaleString()} ريال
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>اتجاه معدل الموافقة</CardTitle>
                <CardDescription>تطور معدل موافقة شركات التأمين</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={insuranceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${((value / insuranceData.find(d => d.period === value)?.totalClaims || 1) * 100).toFixed(1)}%`, 'معدل الموافقة']}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="approvedClaims" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      name="المطالبات المعتمدة"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rejectedClaims" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="المطالبات المرفوضة"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>متوسط وقت المعالجة</CardTitle>
                <CardDescription>تحسن أوقات معالجة المطالبات</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={insuranceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value} أيام`, 'وقت المعالجة']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="averageProcessingDays" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.6}
                      name="متوسط أيام المعالجة"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Providers Tab */}
        <TabsContent value="providers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>توزيع المطالبات حسب الشركة</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={insuranceProviders}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ provider, totalClaims }) => `${provider}: ${totalClaims}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="totalClaims"
                    >
                      {insuranceProviders.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value} مطالبة`, 'العدد']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>مقارنة معدلات الموافقة</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={insuranceProviders}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="provider" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'معدل الموافقة']} />
                    <Bar dataKey="approvalRate" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>تفاصيل شركات التأمين</CardTitle>
              <CardDescription>معلومات مفصلة عن أداء كل شركة تأمين</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {insuranceProviders.map((provider, index) => (
                  <div key={provider.provider} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-lg">{provider.provider}</h4>
                      <Badge 
                        variant={provider.approvalRate >= 85 ? "default" : "secondary"}
                        className="text-sm px-3 py-1"
                      >
                        معدل الموافقة: {provider.approvalRate.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">إجمالي المطالبات</p>
                        <p className="text-2xl font-bold">{provider.totalClaims}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">المطالبات المعتمدة</p>
                        <p className="text-2xl font-bold text-green-600">{provider.approvedClaims}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">المبلغ المعتمد</p>
                        <p className="text-xl font-bold">{provider.approvedAmount.toLocaleString()} ريال</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">متوسط المطالبة</p>
                        <p className="text-xl font-bold">{provider.averageAmount.toLocaleString()} ريال</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>معدل الموافقة</span>
                        <span>{provider.approvalRate.toFixed(1)}%</span>
                      </div>
                      <Progress value={provider.approvalRate} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Status Tab */}
        <TabsContent value="status" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تحليل حالة المطالبات</CardTitle>
              <CardDescription>تفاصيل شاملة عن حالات المطالبات المختلفة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {claimStatuses.map((status, index) => (
                  <div key={status.status} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: status.color }}
                      />
                      <h4 className="font-semibold">{status.status}</h4>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">عدد المطالبات</p>
                        <p className="text-2xl font-bold">{status.count}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">إجمالي المبلغ</p>
                        <p className="text-xl font-bold">{status.amount.toLocaleString()} ريال</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">النسبة من الإجمالي</p>
                        <div className="flex items-center gap-2">
                          <Progress value={status.percentage} className="flex-1" />
                          <span className="text-sm font-medium">{status.percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>توزيع حالة المطالبات</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={claimStatuses}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, percentage }) => `${status}: ${percentage.toFixed(1)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {claimStatuses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string, props: any) => [
                      `${value} مطالبة (${props.payload.amount.toLocaleString()} ريال)`, 
                      props.payload.status
                    ]} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>تحليل الأداء</CardTitle>
                <CardDescription>نقاط القوة والتحديات في إدارة التأمين</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800 dark:text-green-200">نقاط القوة</span>
                    </div>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <li>• تحسن معدل الموافقة إلى 84.7%</li>
                      <li>• تقليل وقت معالجة المطالبات إلى 5.8 أيام</li>
                      <li>• أداء ممتاز مع شركة بوبا العربية (89.2%)</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800 dark:text-yellow-200">التحديات</span>
                    </div>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                      <li>• معدل موافقة منخفض مع الأهلي توكالافا (64.3%)</li>
                      <li>• وقت المعالجة أعلى من الهدف (5.8 vs 5.0 أيام)</li>
                      <li>• نسبة الرفض تحتاج تحسين (11.3%)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>التوصيات</CardTitle>
                <CardDescription>إجراءات مقترحة لتحسين إدارة التأمين</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-2">🎯 تحسين معدل الموافقة</h4>
                    <p className="text-sm text-muted-foreground">
                      مراجعة سياسات التقديم مع الشركات ذات معدل الموافقة المنخفض
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-2">⏱️ تسريع المعالجة</h4>
                    <p className="text-sm text-muted-foreground">
                      تطبيق نظام المتابعة الآلي للمطالبات المعلقة أكثر من 7 أيام
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-2">📋 تحسين الوثائق</h4>
                    <p className="text-sm text-muted-foreground">
                      تدريب الفريق على متطلبات الوثائق لكل شركة تأمين
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-2">🤝 التفاوض مع الشركات</h4>
                    <p className="text-sm text-muted-foreground">
                      إعادة التفاوض مع الشركات ذات الأداء المنخفض لتحسين الشروط
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Export Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            تصدير التقرير
          </CardTitle>
          <CardDescription>
            قم بتصدير تقرير التأمين بصيغ مختلفة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => handleExport('pdf')}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              <Download className="h-4 w-4 mr-2" />
              تصدير PDF
            </Button>
            <Button 
              onClick={() => handleExport('excel')}
              disabled={loading}
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              <Download className="h-4 w-4 mr-2" />
              تصدير Excel
            </Button>
            <Button 
              onClick={() => handleExport('csv')}
              disabled={loading}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              تصدير CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsuranceReportDetailed;