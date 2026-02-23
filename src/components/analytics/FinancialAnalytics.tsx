import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart
} from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CreditCard,
  Banknote,
  Receipt,
  Target,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Building,
  Shield,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';

interface FinancialAnalyticsProps {
  userRole: string;
}

export default function FinancialAnalytics({ userRole }: FinancialAnalyticsProps) {
  const { language, t, isRTL } = useLanguage();
  const [timeRange, setTimeRange] = useState('month');

  // Financial KPIs
  const financialKPIs = useMemo(() => [
    {
      id: 'total-revenue',
      title: language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue',
      value: '$742,580',
      change: '+15.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      target: 800000,
      current: 742580
    },
    {
      id: 'monthly-growth',
      title: language === 'ar' ? 'النمو الشهري' : 'Monthly Growth',
      value: '12.5%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      target: 15,
      current: 12.5
    },
    {
      id: 'avg-bill',
      title: language === 'ar' ? 'متوسط الفاتورة' : 'Average Bill',
      value: '$1,247',
      change: '+8.3%',
      trend: 'up',
      icon: Receipt,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      target: 1300,
      current: 1247
    },
    {
      id: 'payment-rate',
      title: language === 'ar' ? 'معدل التحصيل' : 'Collection Rate',
      value: '94.2%',
      change: '+1.8%',
      trend: 'up',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      target: 95,
      current: 94.2
    }
  ], [language]);

  // Revenue by source
  const revenueBySource = useMemo(() => [
    { 
      source: language === 'ar' ? 'تأمين صحي' : 'Insurance', 
      amount: 350000, 
      percentage: 47.1, 
      color: '#8884d8' 
    },
    { 
      source: language === 'ar' ? 'دفع مباشر' : 'Direct Pay', 
      amount: 280000, 
      percentage: 37.7, 
      color: '#82ca9d' 
    },
    { 
      source: language === 'ar' ? 'حكومي' : 'Government', 
      amount: 85000, 
      percentage: 11.4, 
      color: '#ffc658' 
    },
    { 
      source: language === 'ar' ? 'أخرى' : 'Others', 
      amount: 27580, 
      percentage: 3.7, 
      color: '#ff7300' 
    }
  ], [language]);

  // Monthly revenue trend
  const monthlyRevenue = useMemo(() => [
    { 
      month: language === 'ar' ? 'يناير' : 'Jan', 
      revenue: 68000, 
      expenses: 52000, 
      profit: 16000,
      target: 70000 
    },
    { 
      month: language === 'ar' ? 'فبراير' : 'Feb', 
      revenue: 72000, 
      expenses: 54000, 
      profit: 18000,
      target: 72000 
    },
    { 
      month: language === 'ar' ? 'مارس' : 'Mar', 
      revenue: 78000, 
      expenses: 58000, 
      profit: 20000,
      target: 75000 
    },
    { 
      month: language === 'ar' ? 'أبريل' : 'Apr', 
      revenue: 75000, 
      expenses: 56000, 
      profit: 19000,
      target: 77000 
    },
    { 
      month: language === 'ar' ? 'مايو' : 'May', 
      revenue: 85000, 
      expenses: 62000, 
      profit: 23000,
      target: 80000 
    },
    { 
      month: language === 'ar' ? 'يونيو' : 'Jun', 
      revenue: 92000, 
      expenses: 65000, 
      profit: 27000,
      target: 85000 
    }
  ], [language]);

  // Department revenue breakdown
  const departmentRevenue = useMemo(() => [
    {
      department: language === 'ar' ? 'الجراحة' : 'Surgery',
      revenue: 185000,
      growth: 15.2,
      patients: 156,
      avgBill: 1185
    },
    {
      department: language === 'ar' ? 'القلب والأوعية' : 'Cardiology',
      revenue: 165000,
      growth: 12.8,
      patients: 132,
      avgBill: 1250
    },
    {
      department: language === 'ar' ? 'الأعصاب' : 'Neurology',
      revenue: 145000,
      growth: 18.5,
      patients: 98,
      avgBill: 1480
    },
    {
      department: language === 'ar' ? 'العظام' : 'Orthopedics',
      revenue: 125000,
      growth: 8.9,
      patients: 145,
      avgBill: 862
    },
    {
      department: language === 'ar' ? 'الطوارئ' : 'Emergency',
      revenue: 122580,
      growth: 5.2,
      patients: 425,
      avgBill: 288
    }
  ], [language]);

  // Payment methods
  const paymentMethods = useMemo(() => [
    {
      method: language === 'ar' ? 'بطاقة ائتمان' : 'Credit Card',
      amount: 325000,
      percentage: 43.8,
      icon: CreditCard,
      color: 'text-blue-600'
    },
    {
      method: language === 'ar' ? 'تحويل بنكي' : 'Bank Transfer',
      amount: 280000,
      percentage: 37.7,
      icon: Building,
      color: 'text-green-600'
    },
    {
      method: language === 'ar' ? 'نقداً' : 'Cash',
      amount: 95000,
      percentage: 12.8,
      icon: Banknote,
      color: 'text-orange-600'
    },
    {
      method: language === 'ar' ? 'تأمين' : 'Insurance',
      amount: 42580,
      percentage: 5.7,
      icon: Shield,
      color: 'text-purple-600'
    }
  ], [language]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  return (
    <div className="space-y-6">
      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {financialKPIs.map((kpi) => (
          <Card key={kpi.id} className="border border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
                <Badge variant={kpi.trend === 'up' ? 'default' : 'secondary'} className="text-xs">
                  {kpi.trend === 'up' ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {kpi.change}
                </Badge>
              </div>
              <h3 className="text-sm text-muted-foreground mb-1">{kpi.title}</h3>
              <div className="text-2xl font-semibold text-foreground mb-3">{kpi.value}</div>
              {kpi.target && kpi.current && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{language === 'ar' ? 'الهدف' : 'Target'}</span>
                    <span>{Math.round((kpi.current / kpi.target) * 100)}%</span>
                  </div>
                  <Progress value={(kpi.current / kpi.target) * 100} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {language === 'ar' ? 'تحليل الإيرادات' : 'Revenue Analysis'}
        </h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">
              {language === 'ar' ? 'الأسبوع' : 'This Week'}
            </SelectItem>
            <SelectItem value="month">
              {language === 'ar' ? 'الشهر' : 'This Month'}
            </SelectItem>
            <SelectItem value="quarter">
              {language === 'ar' ? 'الربع' : 'This Quarter'}
            </SelectItem>
            <SelectItem value="year">
              {language === 'ar' ? 'السنة' : 'This Year'}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Revenue Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Target */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'الإيرادات مقابل الهدف' : 'Revenue vs Target'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="revenue" 
                  fill="#8884d8" 
                  name={language === 'ar' ? 'الإيرادات' : 'Revenue'}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#ff7300" 
                  strokeWidth={2}
                  name={language === 'ar' ? 'الهدف' : 'Target'}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by Source */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'الإيرادات حسب المصدر' : 'Revenue by Source'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueBySource}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {revenueBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Profit & Loss */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            {language === 'ar' ? 'الأرباح والخسائر' : 'Profit & Loss'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff7300" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ff7300" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stackId="1"
                stroke="#8884d8" 
                fill="url(#colorRevenue)"
                name={language === 'ar' ? 'الإيرادات' : 'Revenue'}
              />
              <Area 
                type="monotone" 
                dataKey="expenses" 
                stackId="2"
                stroke="#ff7300" 
                fill="url(#colorExpenses)"
                name={language === 'ar' ? 'المصروفات' : 'Expenses'}
              />
              <Area 
                type="monotone" 
                dataKey="profit" 
                stackId="3"
                stroke="#82ca9d" 
                fill="url(#colorProfit)"
                name={language === 'ar' ? 'الربح' : 'Profit'}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Department Revenue & Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Revenue */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'إيرادات الأقسام' : 'Department Revenue'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentRevenue.map((dept, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">{dept.department}</div>
                    <div className="text-sm text-muted-foreground">
                      {dept.patients} {language === 'ar' ? 'مريض' : 'patients'} • 
                      ${dept.avgBill} {language === 'ar' ? 'متوسط' : 'avg'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">
                      ${dept.revenue.toLocaleString()}
                    </div>
                    <div className={`text-sm flex items-center gap-1 ${dept.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {dept.growth > 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {dept.growth}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'طرق الدفع' : 'Payment Methods'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentMethods.map((method, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-muted`}>
                      <method.icon className={`h-4 w-4 ${method.color}`} />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{method.method}</div>
                      <div className="text-sm text-muted-foreground">
                        {method.percentage}% {language === 'ar' ? 'من الإجمالي' : 'of total'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">
                      ${method.amount.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}