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
  TrendingUp, TrendingDown, DollarSign, Calendar, Download, 
  Filter, RefreshCw, BarChart3, Users, CreditCard, Clock,
  ArrowUpRight, ArrowDownRight, AlertCircle, CheckCircle
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';

interface RevenueData {
  period: string;
  total: number;
  cash: number;
  card: number;
  insurance: number;
  consultations: number;
  procedures: number;
  medications: number;
  labs: number;
  radiology: number;
}

interface DepartmentRevenue {
  department: string;
  revenue: number;
  percentage: number;
  color: string;
}

interface PaymentMethod {
  method: string;
  amount: number;
  transactions: number;
  percentage: number;
}

const RevenueReportDetailed: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [toDate, setToDate] = useState<Date | undefined>(new Date());

  // Mock data - في التطبيق الحقيقي، سيتم جلب البيانات من الخادم
  const [revenueData, setRevenueData] = useState<RevenueData[]>([
    { period: '2024-01', total: 125000, cash: 35000, card: 45000, insurance: 45000, consultations: 75000, procedures: 30000, medications: 15000, labs: 3000, radiology: 2000 },
    { period: '2024-02', total: 142000, cash: 38000, card: 52000, insurance: 52000, consultations: 85000, procedures: 35000, medications: 17000, labs: 3500, radiology: 1500 },
    { period: '2024-03', total: 158000, cash: 42000, card: 58000, insurance: 58000, consultations: 95000, procedures: 38000, medications: 18000, labs: 4000, radiology: 3000 },
    { period: '2024-04', total: 171000, cash: 45000, card: 63000, insurance: 63000, consultations: 105000, procedures: 40000, medications: 19000, labs: 4500, radiology: 2500 },
    { period: '2024-05', total: 189000, cash: 48000, card: 70000, insurance: 71000, consultations: 115000, procedures: 45000, medications: 20000, labs: 5000, radiology: 4000 },
    { period: '2024-06', total: 203000, cash: 52000, card: 75000, insurance: 76000, consultations: 125000, procedures: 48000, medications: 22000, labs: 5500, radiology: 2500 }
  ]);

  const departmentRevenue: DepartmentRevenue[] = [
    { department: 'الاستشارات الطبية', revenue: 125000, percentage: 61.6, color: '#3b82f6' },
    { department: 'الإجراءات الطبية', revenue: 48000, percentage: 23.6, color: '#10b981' },
    { department: 'الصيدلية', revenue: 22000, percentage: 10.8, color: '#f59e0b' },
    { department: 'المختبر', revenue: 5500, percentage: 2.7, color: '#ef4444' },
    { department: 'الأشعة', revenue: 2500, percentage: 1.2, color: '#8b5cf6' }
  ];

  const paymentMethods: PaymentMethod[] = [
    { method: 'بطاقة ائتمان/خصم', amount: 75000, transactions: 245, percentage: 37 },
    { method: 'تأمين طبي', amount: 76000, transactions: 156, percentage: 37.4 },
    { method: 'نقدي', amount: 52000, transactions: 198, percentage: 25.6 }
  ];

  const currentMonthRevenue = 203000;
  const lastMonthRevenue = 189000;
  const revenueGrowth = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    setLoading(true);
    // محاكاة عملية التصدير
    setTimeout(() => {
      setLoading(false);
      console.log(`Exporting revenue report as ${format}`);
    }, 2000);
  };

  const handleRefresh = () => {
    setLoading(true);
    // محاكاة تحديث البيانات
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('reports.revenueReport')}
          </h1>
          <p className="text-muted-foreground mt-1">
            تقرير مفصل عن الإيرادات والمبيعات
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
                <p className="text-sm font-medium text-muted-foreground">إجمالي الإيرادات</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">203,000</p>
                  <Badge variant="secondary" className="text-xs">ريال</Badge>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500 font-medium">+{revenueGrowth.toFixed(1)}%</span>
                  <span className="text-xs text-muted-foreground">من الشهر الماضي</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift card-animate" style={{animationDelay: '0.1s'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">متوسط الإيراد لكل مريض</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">1,350</p>
                  <Badge variant="secondary" className="text-xs">ريال</Badge>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500 font-medium">+5.2%</span>
                  <span className="text-xs text-muted-foreground">من الشهر الماضي</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift card-animate" style={{animationDelay: '0.2s'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">المعاملات المكتملة</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">599</p>
                  <Badge variant="secondary" className="text-xs">معاملة</Badge>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500 font-medium">98.5%</span>
                  <span className="text-xs text-muted-foreground">معدل النجاح</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift card-animate" style={{animationDelay: '0.3s'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">متوسط وقت التحصيل</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">2.3</p>
                  <Badge variant="secondary" className="text-xs">أيام</Badge>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowDownRight className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500 font-medium">-0.5</span>
                  <span className="text-xs text-muted-foreground">من الشهر الماضي</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="trends">الاتجاهات</TabsTrigger>
          <TabsTrigger value="departments">الأقسام</TabsTrigger>
          <TabsTrigger value="payments">طرق الدفع</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend Chart */}
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  اتجاه الإيرادات الشهرية
                </CardTitle>
                <CardDescription>
                  إيرادات الـ 6 أشهر الماضية مقسمة حسب المصدر
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toLocaleString()} ريال`, '']}
                      labelFormatter={(label) => `الفترة: ${label}`}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="consultations" 
                      stackId="1" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.6}
                      name="الاستشارات"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="procedures" 
                      stackId="1" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.6}
                      name="الإجراءات"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="medications" 
                      stackId="1" 
                      stroke="#f59e0b" 
                      fill="#f59e0b" 
                      fillOpacity={0.6}
                      name="الأدوية"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="labs" 
                      stackId="1" 
                      stroke="#ef4444" 
                      fill="#ef4444" 
                      fillOpacity={0.6}
                      name="المختبر"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="radiology" 
                      stackId="1" 
                      stroke="#8b5cf6" 
                      fill="#8b5cf6" 
                      fillOpacity={0.6}
                      name="الأشعة"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Department Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>توزيع الإيرادات حسب القسم</CardTitle>
                <CardDescription>نسبة مساهمة كل قسم في الإيرادات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentRevenue.map((dept, index) => (
                    <div key={dept.department} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: dept.color }}
                        />
                        <span className="font-medium">{dept.department}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          {dept.percentage.toFixed(1)}%
                        </span>
                        <span className="font-semibold">
                          {dept.revenue.toLocaleString()} ريال
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>طرق الدفع</CardTitle>
                <CardDescription>توزيع الإيرادات حسب طريقة الدفع</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map((method, index) => (
                    <div key={method.method} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{method.method}</span>
                        <span className="text-sm text-muted-foreground">
                          {method.transactions} معاملة
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Progress value={method.percentage} className="flex-1" />
                        <span className="font-semibold ml-3">
                          {method.amount.toLocaleString()} ريال
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {method.percentage.toFixed(1)}% من إجمالي الإيرادات
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
          <Card>
            <CardHeader>
              <CardTitle>اتجاهات الإيرادات التفصيلية</CardTitle>
              <CardDescription>مقارنة أداء الإيرادات عبر الفترات الزمنية</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toLocaleString()} ريال`, '']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="إجمالي الإيرادات"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="consultations" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="الاستشارات"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="procedures" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="الإجراءات"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>توزيع الإيرادات</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentRevenue}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                    >
                      {departmentRevenue.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value.toLocaleString()} ريال`, 'الإيراد']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>مقارنة أداء الأقسام</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`${value.toLocaleString()} ريال`, 'الإيراد']} />
                    <Bar dataKey="revenue" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تحليل طرق الدفع</CardTitle>
              <CardDescription>تفاصيل شاملة عن طرق الدفع والمعاملات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {paymentMethods.map((method, index) => (
                  <div key={method.method} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{method.method}</h4>
                      <Badge variant="outline">{method.percentage.toFixed(1)}%</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">إجمالي المبلغ</p>
                        <p className="text-lg font-bold">{method.amount.toLocaleString()} ريال</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">عدد المعاملات</p>
                        <p className="text-lg font-bold">{method.transactions}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">متوسط المعاملة</p>
                        <p className="text-lg font-bold">
                          {Math.round(method.amount / method.transactions).toLocaleString()} ريال
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">نسبة المساهمة</p>
                        <Progress value={method.percentage} className="mt-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
            قم بتصدير تقرير الإيرادات بصيغ مختلفة
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

export default RevenueReportDetailed;