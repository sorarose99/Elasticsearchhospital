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
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, ComposedChart
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Target, Calendar, Download, 
  Filter, RefreshCw, BarChart3, Calculator, DollarSign,
  ArrowUpRight, ArrowDownRight, AlertCircle, CheckCircle,
  Percent, Award, Activity
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';

interface ProfitabilityData {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  profitMargin: number;
  grossMargin: number;
  operatingMargin: number;
}

interface DepartmentProfitability {
  department: string;
  revenue: number;
  expenses: number;
  profit: number;
  profitMargin: number;
  color: string;
}

interface ProfitabilityMetrics {
  metric: string;
  current: number;
  previous: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

const ProfitabilityReportDetailed: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [toDate, setToDate] = useState<Date | undefined>(new Date());

  // Mock data - في التطبيق الحقيقي، سيتم جلب البيانات من الخادم
  const [profitabilityData, setProfitabilityData] = useState<ProfitabilityData[]>([
    { 
      period: '2024-01', 
      revenue: 125000, 
      expenses: 85000, 
      profit: 40000, 
      profitMargin: 32.0, 
      grossMargin: 45.0, 
      operatingMargin: 32.0 
    },
    { 
      period: '2024-02', 
      revenue: 142000, 
      expenses: 89000, 
      profit: 53000, 
      profitMargin: 37.3, 
      grossMargin: 48.5, 
      operatingMargin: 37.3 
    },
    { 
      period: '2024-03', 
      revenue: 158000, 
      expenses: 92000, 
      profit: 66000, 
      profitMargin: 41.8, 
      grossMargin: 52.1, 
      operatingMargin: 41.8 
    },
    { 
      period: '2024-04', 
      revenue: 171000, 
      expenses: 88000, 
      profit: 83000, 
      profitMargin: 48.5, 
      grossMargin: 56.2, 
      operatingMargin: 48.5 
    },
    { 
      period: '2024-05', 
      revenue: 189000, 
      expenses: 94000, 
      profit: 95000, 
      profitMargin: 50.3, 
      grossMargin: 58.7, 
      operatingMargin: 50.3 
    },
    { 
      period: '2024-06', 
      revenue: 203000, 
      expenses: 97000, 
      profit: 106000, 
      profitMargin: 52.2, 
      grossMargin: 60.1, 
      operatingMargin: 52.2 
    }
  ]);

  const departmentProfitability: DepartmentProfitability[] = [
    { 
      department: 'الاستشارات الطبية', 
      revenue: 125000, 
      expenses: 45000, 
      profit: 80000, 
      profitMargin: 64.0, 
      color: '#3b82f6' 
    },
    { 
      department: 'الإجراءات الطبية', 
      revenue: 48000, 
      expenses: 25000, 
      profit: 23000, 
      profitMargin: 47.9, 
      color: '#10b981' 
    },
    { 
      department: 'الصيدلية', 
      revenue: 22000, 
      expenses: 18000, 
      profit: 4000, 
      profitMargin: 18.2, 
      color: '#f59e0b' 
    },
    { 
      department: 'المختبر', 
      revenue: 5500, 
      expenses: 4500, 
      profit: 1000, 
      profitMargin: 18.2, 
      color: '#ef4444' 
    },
    { 
      department: 'الأشعة', 
      revenue: 2500, 
      expenses: 4500, 
      profit: -2000, 
      profitMargin: -80.0, 
      color: '#8b5cf6' 
    }
  ];

  const profitabilityMetrics: ProfitabilityMetrics[] = [
    { 
      metric: 'هامش الربح الإجمالي', 
      current: 60.1, 
      previous: 58.7, 
      target: 65.0, 
      unit: '%', 
      trend: 'up' 
    },
    { 
      metric: 'هامش الربح التشغيلي', 
      current: 52.2, 
      previous: 50.3, 
      target: 55.0, 
      unit: '%', 
      trend: 'up' 
    },
    { 
      metric: 'العائد على الاستثمار', 
      current: 18.5, 
      previous: 17.2, 
      target: 20.0, 
      unit: '%', 
      trend: 'up' 
    },
    { 
      metric: 'العائد على الأصول', 
      current: 12.3, 
      previous: 11.8, 
      target: 15.0, 
      unit: '%', 
      trend: 'up' 
    },
    { 
      metric: 'نقطة التعادل', 
      current: 85000, 
      previous: 89000, 
      target: 80000, 
      unit: 'ريال', 
      trend: 'down' 
    }
  ];

  const currentProfit = 106000;
  const lastMonthProfit = 95000;
  const profitGrowth = ((currentProfit - lastMonthProfit) / lastMonthProfit) * 100;
  const currentMargin = 52.2;
  const targetMargin = 55.0;

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log(`Exporting profitability report as ${format}`);
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            {t('reports.profitabilityReport')}
          </h1>
          <p className="text-muted-foreground mt-1">
            تحليل شامل للربحية والأداء المالي
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
                <p className="text-sm font-medium text-muted-foreground">صافي الربح</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">106,000</p>
                  <Badge variant="secondary" className="text-xs">ريال</Badge>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500 font-medium">+{profitGrowth.toFixed(1)}%</span>
                  <span className="text-xs text-muted-foreground">من الشهر الماضي</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift card-animate" style={{animationDelay: '0.1s'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">هامش الربح</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{currentMargin}</p>
                  <Badge variant="secondary" className="text-xs">%</Badge>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Target className="h-3 w-3 text-blue-500" />
                  <span className="text-xs text-blue-500 font-medium">الهدف: {targetMargin}%</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Percent className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift card-animate" style={{animationDelay: '0.2s'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">العائد على الاستثمار</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">18.5</p>
                  <Badge variant="secondary" className="text-xs">%</Badge>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500 font-medium">+1.3%</span>
                  <span className="text-xs text-muted-foreground">من الشهر الماضي</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift card-animate" style={{animationDelay: '0.3s'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">نقطة التعادل</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">85,000</p>
                  <Badge variant="secondary" className="text-xs">ريال</Badge>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowDownRight className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500 font-medium">-4,000</span>
                  <span className="text-xs text-muted-foreground">من الشهر الماضي</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Calculator className="h-6 w-6 text-orange-600" />
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
          <TabsTrigger value="departments">الأقسام</TabsTrigger>
          <TabsTrigger value="metrics">المؤشرات</TabsTrigger>
          <TabsTrigger value="analysis">التحليل</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profitability Trend Chart */}
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  اتجاه الربحية الشهرية
                </CardTitle>
                <CardDescription>
                  مقارنة الإيرادات والمصروفات والأرباح على مدى 6 أشهر
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={profitabilityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value: number, name: string) => {
                        if (name.includes('%')) {
                          return [`${value}%`, name];
                        }
                        return [`${value.toLocaleString()} ريال`, name];
                      }}
                      labelFormatter={(label) => `الفترة: ${label}`}
                    />
                    <Legend />
                    <Bar 
                      yAxisId="left"
                      dataKey="revenue" 
                      fill="#3b82f6" 
                      fillOpacity={0.6}
                      name="الإيرادات"
                    />
                    <Bar 
                      yAxisId="left"
                      dataKey="expenses" 
                      fill="#ef4444" 
                      fillOpacity={0.6}
                      name="المصروفات"
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="profit" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      name="صافي الربح"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="profitMargin" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      name="هامش الربح %"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Department Profitability */}
            <Card>
              <CardHeader>
                <CardTitle>ربحية الأقسام</CardTitle>
                <CardDescription>مقارنة الربحية بين الأقسام المختلفة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentProfitability.map((dept, index) => (
                    <div key={dept.department} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{dept.department}</span>
                        <Badge 
                          variant={dept.profitMargin > 0 ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {dept.profitMargin > 0 ? '+' : ''}{dept.profitMargin.toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">الإيراد</p>
                          <p className="font-semibold">{dept.revenue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">المصروف</p>
                          <p className="font-semibold">{dept.expenses.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">الربح</p>
                          <p className={`font-semibold ${dept.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {dept.profit > 0 ? '+' : ''}{dept.profit.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Performance Indicators */}
            <Card>
              <CardHeader>
                <CardTitle>مؤشرات الأداء الرئيسية</CardTitle>
                <CardDescription>مقارنة الأداء الحالي بالأهداف المحددة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profitabilityMetrics.slice(0, 4).map((metric, index) => (
                    <div key={metric.metric} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{metric.metric}</span>
                          <div className="flex items-center gap-2">
                            {metric.trend === 'up' ? (
                              <ArrowUpRight className="h-3 w-3 text-green-500" />
                            ) : metric.trend === 'down' ? (
                              <ArrowDownRight className="h-3 w-3 text-red-500" />
                            ) : (
                              <Activity className="h-3 w-3 text-gray-500" />
                            )}
                            <span className="text-sm font-bold">
                              {metric.current}{metric.unit}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>السابق: {metric.previous}{metric.unit}</span>
                          <span>الهدف: {metric.target}{metric.unit}</span>
                        </div>
                        <Progress 
                          value={
                            metric.unit === '%' 
                              ? (metric.current / metric.target) * 100 
                              : metric.unit === 'ريال' && metric.metric === 'نقطة التعادل'
                                ? ((metric.target / metric.current) * 100)
                                : (metric.current / metric.target) * 100
                          } 
                          className="mt-2" 
                        />
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
              <CardTitle>اتجاهات الربحية التفصيلية</CardTitle>
              <CardDescription>تحليل شامل لتطور مؤشرات الربحية</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={profitabilityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="profitMargin" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="هامش الربح الصافي"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="grossMargin" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="هامش الربح الإجمالي"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="operatingMargin" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="هامش الربح التشغيلي"
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
                <CardTitle>توزيع الأرباح حسب القسم</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentProfitability.filter(d => d.profit > 0)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ department, profitMargin }) => `${department}: ${profitMargin.toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="profit"
                    >
                      {departmentProfitability.filter(d => d.profit > 0).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value.toLocaleString()} ريال`, 'الربح']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>مقارنة هوامش الربح</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentProfitability}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'هامش الربح']} />
                    <Bar 
                      dataKey="profitMargin" 
                      fill={(entry: any) => entry.profitMargin > 0 ? '#10b981' : '#ef4444'}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>مؤشرات الربحية الشاملة</CardTitle>
              <CardDescription>تحليل مفصل لجميع مؤشرات الأداء المالي</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profitabilityMetrics.map((metric, index) => (
                  <div key={metric.metric} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{metric.metric}</h4>
                      <Badge 
                        variant={
                          metric.trend === 'up' ? 'default' : 
                          metric.trend === 'down' ? 'destructive' : 'secondary'
                        }
                      >
                        {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">الحالي</p>
                        <p className="text-lg font-bold">
                          {metric.current.toLocaleString()}{metric.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">السابق</p>
                        <p className="text-lg font-bold">
                          {metric.previous.toLocaleString()}{metric.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">الهدف</p>
                        <p className="text-lg font-bold">
                          {metric.target.toLocaleString()}{metric.unit}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>التقدم نحو الهدف</span>
                        <span>
                          {(
                            metric.unit === '%' 
                              ? (metric.current / metric.target) * 100 
                              : metric.unit === 'ريال' && metric.metric === 'نقطة التعادل'
                                ? ((metric.target / metric.current) * 100)
                                : (metric.current / metric.target) * 100
                          ).toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={
                          metric.unit === '%' 
                            ? (metric.current / metric.target) * 100 
                            : metric.unit === 'ريال' && metric.metric === 'نقطة التعادل'
                              ? ((metric.target / metric.current) * 100)
                              : (metric.current / metric.target) * 100
                        } 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profitability Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>تحليل الربحية</CardTitle>
                <CardDescription>نقاط القوة والفرص للتحسين</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800 dark:text-green-200">نقاط القوة</span>
                    </div>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <li>• نمو مستمر في هامش الربح (+1.9% هذا الشهر)</li>
                      <li>• الاستشارات الطبية تحقق أعلى ربحية (64%)</li>
                      <li>• تحسن في كفاءة التكاليف التشغيلية</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800 dark:text-yellow-200">فرص التحسين</span>
                    </div>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                      <li>• قسم الأشعة يسجل خسائر (-80%)</li>
                      <li>• الصيدلية تحتاج تحسين هامش الربح (18.2%)</li>
                      <li>• زيادة كفاءة استخدام المعدات</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>التوصيات الاستراتيجية</CardTitle>
                <CardDescription>إجراءات مقترحة لتحسين الربحية</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-2">🎯 الهدف قصير المدى</h4>
                    <p className="text-sm text-muted-foreground">
                      تحسين ربحية قسم الأشعة من خلال زيادة استخدام المعدات وتحسين تسعير الخدمات
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-2">📈 تحسين الإيرادات</h4>
                    <p className="text-sm text-muted-foreground">
                      التوسع في خدمات الاستشارات المتخصصة والإجراءات عالية القيمة
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-2">💰 تحسين التكاليف</h4>
                    <p className="text-sm text-muted-foreground">
                      مراجعة تكاليف الصيدلية وتحسين إدارة المخزون لزيادة هامش الربح
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-2">⚡ الكفاءة التشغيلية</h4>
                    <p className="text-sm text-muted-foreground">
                      تطبيق تقنيات الأتمتة لتقليل التكاليف التشغيلية وزيادة الإنتاجية
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
            قم بتصدير تقرير الربحية بصيغ مختلفة
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

export default ProfitabilityReportDetailed;