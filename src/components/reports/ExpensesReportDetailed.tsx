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
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, TreemapChart, Treemap
} from 'recharts';
import { 
  TrendingDown, TrendingUp, Receipt, Calendar, Download, 
  Filter, RefreshCw, AlertTriangle, Building, ShoppingCart,
  ArrowUpRight, ArrowDownRight, DollarSign, Percent
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';

interface ExpenseData {
  period: string;
  total: number;
  salaries: number;
  equipment: number;
  supplies: number;
  utilities: number;
  maintenance: number;
  insurance: number;
  rent: number;
  marketing: number;
}

interface ExpenseCategory {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  trend: number;
  budgetAllocated: number;
  budgetUsed: number;
}

interface VendorExpense {
  vendor: string;
  amount: number;
  transactions: number;
  category: string;
  avgAmount: number;
}

const ExpensesReportDetailed: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [toDate, setToDate] = useState<Date | undefined>(new Date());

  // Mock data - في التطبيق الحقيقي، سيتم جلب البيانات من الخادم
  const [expenseData, setExpenseData] = useState<ExpenseData[]>([
    { period: '2024-01', total: 85000, salaries: 45000, equipment: 12000, supplies: 8000, utilities: 5000, maintenance: 4000, insurance: 3000, rent: 6000, marketing: 2000 },
    { period: '2024-02', total: 89000, salaries: 45000, equipment: 15000, supplies: 9000, utilities: 5200, maintenance: 3500, insurance: 3000, rent: 6000, marketing: 2300 },
    { period: '2024-03', total: 92000, salaries: 47000, equipment: 18000, supplies: 8500, utilities: 5500, maintenance: 4000, insurance: 3000, rent: 6000, marketing: 0 },
    { period: '2024-04', total: 88000, salaries: 47000, equipment: 10000, supplies: 9200, utilities: 5300, maintenance: 5000, insurance: 3000, rent: 6000, marketing: 2500 },
    { period: '2024-05', total: 94000, salaries: 48000, equipment: 16000, supplies: 9500, utilities: 5800, maintenance: 3200, insurance: 3000, rent: 6000, marketing: 2500 },
    { period: '2024-06', total: 97000, salaries: 48000, equipment: 20000, supplies: 10000, utilities: 6000, maintenance: 4000, insurance: 3000, rent: 6000, marketing: 0 }
  ]);

  const expenseCategories: ExpenseCategory[] = [
    { 
      category: 'الرواتب والأجور', 
      amount: 48000, 
      percentage: 49.5, 
      color: '#3b82f6', 
      trend: 2.1,
      budgetAllocated: 50000,
      budgetUsed: 96
    },
    { 
      category: 'المعدات والأجهزة', 
      amount: 20000, 
      percentage: 20.6, 
      color: '#10b981', 
      trend: 25.0,
      budgetAllocated: 18000,
      budgetUsed: 111.1
    },
    { 
      category: 'المستلزمات الطبية', 
      amount: 10000, 
      percentage: 10.3, 
      color: '#f59e0b', 
      trend: 5.3,
      budgetAllocated: 12000,
      budgetUsed: 83.3
    },
    { 
      category: 'الإيجار', 
      amount: 6000, 
      percentage: 6.2, 
      color: '#ef4444', 
      trend: 0,
      budgetAllocated: 6000,
      budgetUsed: 100
    },
    { 
      category: 'المرافق والخدمات', 
      amount: 6000, 
      percentage: 6.2, 
      color: '#8b5cf6', 
      trend: 3.4,
      budgetAllocated: 5500,
      budgetUsed: 109.1
    },
    { 
      category: 'الصيانة', 
      amount: 4000, 
      percentage: 4.1, 
      color: '#06b6d4', 
      trend: 25.0,
      budgetAllocated: 3500,
      budgetUsed: 114.3
    },
    { 
      category: 'التأمين', 
      amount: 3000, 
      percentage: 3.1, 
      color: '#84cc16', 
      trend: 0,
      budgetAllocated: 3000,
      budgetUsed: 100
    }
  ];

  const vendorExpenses: VendorExpense[] = [
    { vendor: 'شركة المعدات الطبية المتطورة', amount: 15000, transactions: 3, category: 'معدات', avgAmount: 5000 },
    { vendor: 'مؤسسة المستلزمات الطبية', amount: 8000, transactions: 12, category: 'مستلزمات', avgAmount: 667 },
    { vendor: 'شركة الصيانة الشاملة', amount: 4000, transactions: 2, category: 'صيانة', avgAmount: 2000 },
    { vendor: 'شركة المرافق والخدمات', amount: 6000, transactions: 1, category: 'مرافق', avgAmount: 6000 },
    { vendor: 'شركة التأمين الطبي', amount: 3000, transactions: 1, category: 'تأمين', avgAmount: 3000 }
  ];

  const currentMonthExpenses = 97000;
  const lastMonthExpenses = 94000;
  const expenseGrowth = ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;
  const totalBudget = expenseCategories.reduce((sum, cat) => sum + cat.budgetAllocated, 0);
  const budgetUtilization = (currentMonthExpenses / totalBudget) * 100;

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log(`Exporting expense report as ${format}`);
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            {t('reports.expensesReport')}
          </h1>
          <p className="text-muted-foreground mt-1">
            تقرير مفصل عن المصروفات والنفقات
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
                <p className="text-sm font-medium text-muted-foreground">إجمالي المصروفات</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">97,000</p>
                  <Badge variant="secondary" className="text-xs">ريال</Badge>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-red-500" />
                  <span className="text-xs text-red-500 font-medium">+{expenseGrowth.toFixed(1)}%</span>
                  <span className="text-xs text-muted-foreground">من الشهر الماضي</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <Receipt className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift card-animate" style={{animationDelay: '0.1s'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">استخدام الميزانية</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{budgetUtilization.toFixed(1)}</p>
                  <Badge variant="secondary" className="text-xs">%</Badge>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {budgetUtilization > 100 ? (
                    <AlertTriangle className="h-3 w-3 text-yellow-500" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-green-500" />
                  )}
                  <span className={`text-xs font-medium ${budgetUtilization > 100 ? 'text-yellow-500' : 'text-green-500'}`}>
                    {budgetUtilization > 100 ? 'تجاوز الميزانية' : 'ضمن الميزانية'}
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Percent className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift card-animate" style={{animationDelay: '0.2s'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">أكبر فئة مصروفات</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold">الرواتب</p>
                  <Badge variant="secondary" className="text-xs">49.5%</Badge>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <DollarSign className="h-3 w-3 text-blue-500" />
                  <span className="text-xs text-blue-500 font-medium">48,000 ريال</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift card-animate" style={{animationDelay: '0.3s'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">معاملات الموردين</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">19</p>
                  <Badge variant="secondary" className="text-xs">معاملة</Badge>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <ShoppingCart className="h-3 w-3 text-purple-500" />
                  <span className="text-xs text-purple-500 font-medium">5 موردين</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-purple-600" />
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
          <TabsTrigger value="categories">الفئات</TabsTrigger>
          <TabsTrigger value="budget">الميزانية</TabsTrigger>
          <TabsTrigger value="vendors">الموردون</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expense Trend Chart */}
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5" />
                  اتجاه المصروفات الشهرية
                </CardTitle>
                <CardDescription>
                  مصروفات الـ 6 أشهر الماضية مقسمة حسب الفئة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={expenseData}>
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
                      dataKey="salaries" 
                      stackId="1" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.6}
                      name="الرواتب"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="equipment" 
                      stackId="1" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.6}
                      name="المعدات"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="supplies" 
                      stackId="1" 
                      stroke="#f59e0b" 
                      fill="#f59e0b" 
                      fillOpacity={0.6}
                      name="المستلزمات"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="utilities" 
                      stackId="1" 
                      stroke="#8b5cf6" 
                      fill="#8b5cf6" 
                      fillOpacity={0.6}
                      name="المرافق"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="rent" 
                      stackId="1" 
                      stroke="#ef4444" 
                      fill="#ef4444" 
                      fillOpacity={0.6}
                      name="الإيجار"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Expense Categories Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>توزيع المصروفات حسب الفئة</CardTitle>
                <CardDescription>نسبة مساهمة كل فئة في المصروفات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenseCategories.slice(0, 5).map((category, index) => (
                    <div key={category.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium">{category.category}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          {category.percentage.toFixed(1)}%
                        </span>
                        <span className="font-semibold">
                          {category.amount.toLocaleString()} ريال
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Vendors */}
            <Card>
              <CardHeader>
                <CardTitle>أكبر الموردين</CardTitle>
                <CardDescription>أكثر الموردين مصروفات هذا الشهر</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendorExpenses.slice(0, 5).map((vendor, index) => (
                    <div key={vendor.vendor} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{vendor.vendor}</p>
                        <p className="text-sm text-muted-foreground">
                          {vendor.transactions} معاملة · {vendor.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{vendor.amount.toLocaleString()} ريال</p>
                        <p className="text-sm text-muted-foreground">
                          متوسط: {vendor.avgAmount.toLocaleString()} ريال
                        </p>
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
              <CardTitle>اتجاهات المصروفات التفصيلية</CardTitle>
              <CardDescription>مقارنة أداء المصروفات عبر الفترات الزمنية</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={expenseData}>
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
                    stroke="#ef4444" 
                    strokeWidth={3}
                    name="إجمالي المصروفات"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="salaries" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="الرواتب"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="equipment" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="المعدات"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>توزيع المصروفات</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percentage }) => `${category}: ${percentage.toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {expenseCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value.toLocaleString()} ريال`, 'المصروف']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>مقارنة فئات المصروفات</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={expenseCategories}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`${value.toLocaleString()} ريال`, 'المصروف']} />
                    <Bar dataKey="amount" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Budget Tab */}
        <TabsContent value="budget" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>مقارنة الميزانية والمصروفات الفعلية</CardTitle>
              <CardDescription>مراقبة أداء المصروفات مقابل الميزانية المخصصة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {expenseCategories.map((category, index) => (
                  <div key={category.category} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{category.category}</h4>
                      <Badge 
                        variant={category.budgetUsed > 100 ? "destructive" : "secondary"}
                        className="font-medium"
                      >
                        {category.budgetUsed.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">الميزانية المخصصة</p>
                        <p className="font-bold">{category.budgetAllocated.toLocaleString()} ريال</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">المصروف الفعلي</p>
                        <p className="font-bold">{category.amount.toLocaleString()} ريال</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">المتبقي/الزائد</p>
                        <p className={`font-bold ${category.budgetUsed > 100 ? 'text-red-600' : 'text-green-600'}`}>
                          {category.budgetUsed > 100 ? '-' : '+'}{Math.abs(category.budgetAllocated - category.amount).toLocaleString()} ريال
                        </p>
                      </div>
                    </div>
                    <Progress 
                      value={Math.min(category.budgetUsed, 100)} 
                      className="mb-2"
                    />
                    {category.budgetUsed > 100 && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertTriangle className="h-4 w-4" />
                        تجاوز الميزانية بنسبة {(category.budgetUsed - 100).toFixed(1)}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vendors Tab */}
        <TabsContent value="vendors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تحليل مصروفات الموردين</CardTitle>
              <CardDescription>تفاصيل شاملة عن المصروفات حسب المورد</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {vendorExpenses.map((vendor, index) => (
                  <div key={vendor.vendor} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{vendor.vendor}</h4>
                      <Badge variant="outline">{vendor.category}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">إجمالي المبلغ</p>
                        <p className="text-lg font-bold">{vendor.amount.toLocaleString()} ريال</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">عدد المعاملات</p>
                        <p className="text-lg font-bold">{vendor.transactions}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">متوسط المعاملة</p>
                        <p className="text-lg font-bold">{vendor.avgAmount.toLocaleString()} ريال</p>
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
            قم بتصدير تقرير المصروفات بصيغ مختلفة
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

export default ExpensesReportDetailed;