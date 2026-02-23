import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar, 
  Download,
  Printer,
  Filter,
  RefreshCw,
  ArrowLeft,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Target,
  Users,
  Building,
  Stethoscope,
  ShieldCheck,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Search,
  SortAsc,
  SortDesc,
  Eye,
  FileText,
  TrendingUp as GrowthIcon,
  ArrowUpRight,
  ArrowDownRight,
  Zap
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';
import { cn } from '../ui/utils';

interface RevenueSource {
  id: string;
  name: string;
  category: string;
  amount: number;
  percentage: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  transactions: number;
  averageValue: number;
  color: string;
}

interface DepartmentRevenue {
  department: string;
  current: number;
  previous: number;
  growth: number;
  percentage: number;
  patientCount: number;
  averagePerPatient: number;
}

interface RevenueReportProps {
  onGoBack: () => void;
}

const RevenueReport: React.FC<RevenueReportProps> = ({ onGoBack }) => {
  const { t, language, isRTL } = useLanguage();
  const { effectiveTheme } = useTheme();

  // State management
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area' | 'pie'>('area');
  const [viewMode, setViewMode] = useState<'summary' | 'detailed' | 'trends'>('summary');
  const [sortBy, setSortBy] = useState<'amount' | 'growth' | 'name'>('amount');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Revenue sources data
  const revenueSources: RevenueSource[] = useMemo(() => [
    {
      id: 'consultations',
      name: language === 'ar' ? 'الاستشارات الطبية' : 'Medical Consultations',
      category: language === 'ar' ? 'خدمات طبية' : 'Medical Services',
      amount: 850000,
      percentage: 34.7,
      change: 12.3,
      trend: 'up',
      transactions: 2156,
      averageValue: 394,
      color: '#3b82f6'
    },
    {
      id: 'surgery',
      name: language === 'ar' ? 'العمليات الجراحية' : 'Surgical Procedures',
      category: language === 'ar' ? 'جراحة' : 'Surgery',
      amount: 650000,
      percentage: 26.5,
      change: 8.7,
      trend: 'up',
      transactions: 187,
      averageValue: 3476,
      color: '#ef4444'
    },
    {
      id: 'diagnostics',
      name: language === 'ar' ? 'التشخيص والأشعة' : 'Diagnostics & Imaging',
      category: language === 'ar' ? 'تشخيص' : 'Diagnostics',
      amount: 420000,
      percentage: 17.1,
      change: 15.2,
      trend: 'up',
      transactions: 3247,
      averageValue: 129,
      color: '#10b981'
    },
    {
      id: 'pharmacy',
      name: language === 'ar' ? 'الصيدلية' : 'Pharmacy',
      category: language === 'ar' ? 'أدوية' : 'Medications',
      amount: 280000,
      percentage: 11.4,
      change: -2.1,
      trend: 'down',
      transactions: 4832,
      averageValue: 58,
      color: '#f59e0b'
    },
    {
      id: 'laboratory',
      name: language === 'ar' ? 'المختبر' : 'Laboratory Tests',
      category: language === 'ar' ? 'فحوصات' : 'Tests',
      amount: 180000,
      percentage: 7.3,
      change: 5.8,
      trend: 'up',
      transactions: 2891,
      averageValue: 62,
      color: '#8b5cf6'
    },
    {
      id: 'emergency',
      name: language === 'ar' ? 'الطوارئ' : 'Emergency Services',
      category: language === 'ar' ? 'طوارئ' : 'Emergency',
      amount: 70000,
      percentage: 2.9,
      change: 18.5,
      trend: 'up',
      transactions: 423,
      averageValue: 165,
      color: '#06b6d4'
    }
  ], [language]);

  // Department revenue data
  const departmentRevenue: DepartmentRevenue[] = useMemo(() => [
    {
      department: language === 'ar' ? 'الطب الباطني' : 'Internal Medicine',
      current: 450000,
      previous: 398000,
      growth: 13.1,
      percentage: 18.4,
      patientCount: 1247,
      averagePerPatient: 361
    },
    {
      department: language === 'ar' ? 'الجراحة العامة' : 'General Surgery',
      current: 380000,
      previous: 365000,
      growth: 4.1,
      percentage: 15.5,
      patientCount: 156,
      averagePerPatient: 2436
    },
    {
      department: language === 'ar' ? 'أمراض القلب' : 'Cardiology',
      current: 320000,
      previous: 287000,
      growth: 11.5,
      percentage: 13.1,
      patientCount: 287,
      averagePerPatient: 1115
    },
    {
      department: language === 'ar' ? 'الأشعة' : 'Radiology',
      current: 290000,
      previous: 275000,
      growth: 5.5,
      percentage: 11.8,
      patientCount: 2156,
      averageValue: 134.5
    },
    {
      department: language === 'ar' ? 'المختبر' : 'Laboratory',
      current: 245000,
      previous: 231000,
      growth: 6.1,
      percentage: 10.0,
      patientCount: 3247,
      averagePerPatient: 75.5
    }
  ], [language]);

  // Monthly trend data
  const monthlyTrend = useMemo(() => [
    { month: language === 'ar' ? 'يناير' : 'Jan', revenue: 2100000, consultations: 750000, surgery: 580000, diagnostics: 380000, pharmacy: 290000, laboratory: 100000 },
    { month: language === 'ar' ? 'فبراير' : 'Feb', revenue: 2250000, consultations: 780000, surgery: 620000, diagnostics: 400000, pharmacy: 320000, laboratory: 130000 },
    { month: language === 'ar' ? 'مارس' : 'Mar', revenue: 2180000, consultations: 760000, surgery: 595000, diagnostics: 390000, pharmacy: 315000, laboratory: 120000 },
    { month: language === 'ar' ? 'أبريل' : 'Apr', revenue: 2350000, consultations: 820000, surgery: 650000, diagnostics: 415000, pharmacy: 335000, laboratory: 130000 },
    { month: language === 'ar' ? 'مايو' : 'May', revenue: 2450000, consultations: 850000, surgery: 680000, diagnostics: 420000, pharmacy: 350000, laboratory: 150000 }
  ], [language]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100);
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span>{entry.name}: {formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Handle data refresh
  const handleRefresh = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
  };

  // Handle export
  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    // Implementation for export functionality
    console.log(`Exporting revenue report as ${format}`);
  };

  // Sort revenue sources
  const sortedRevenueSources = useMemo(() => {
    return [...revenueSources].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'growth':
          aValue = a.change;
          bValue = b.change;
          break;
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        default:
          return 0;
      }

      if (sortBy === 'name') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });
  }, [revenueSources, sortBy, sortOrder]);

  return (
    <div className={cn("space-y-6 p-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("flex items-center justify-between", isRTL ? "flex-row-reverse" : "")}
      >
        <div className={cn("flex items-center gap-4", isRTL ? "flex-row-reverse" : "")}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onGoBack}
            className="hover-lift"
          >
            <ArrowLeft className={cn("h-4 w-4", isRTL ? "ml-2 rotate-180" : "mr-2")} />
            {language === 'ar' ? 'رجوع' : 'Back'}
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          <div className={isRTL ? "text-right" : ""}>
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
              <DollarSign className="h-6 w-6" />
              {language === 'ar' ? 'تقرير الإيرادات' : 'Revenue Report'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'ar' ? 'تحليل تفصيلي لجميع مصادر الإيرادات' : 'Detailed analysis of all revenue sources'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="hover-lift"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin", isRTL ? "ml-2" : "mr-2")} />
            {language === 'ar' ? 'تحديث' : 'Refresh'}
          </Button>

          <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="area">
                <div className="flex items-center gap-2">
                  <AreaChart className="h-4 w-4" />
                  {language === 'ar' ? 'منطقة' : 'Area'}
                </div>
              </SelectItem>
              <SelectItem value="line">
                <div className="flex items-center gap-2">
                  <LineChartIcon className="h-4 w-4" />
                  {language === 'ar' ? 'خط' : 'Line'}
                </div>
              </SelectItem>
              <SelectItem value="bar">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  {language === 'ar' ? 'أعمدة' : 'Bar'}
                </div>
              </SelectItem>
              <SelectItem value="pie">
                <div className="flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4" />
                  {language === 'ar' ? 'دائري' : 'Pie'}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => handleExport(value as any)}>
            <SelectTrigger className="w-32">
              <Download className="h-4 w-4 mr-2" />
              <SelectValue placeholder={language === 'ar' ? 'تصدير' : 'Export'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* View Mode Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {language === 'ar' ? 'ملخص' : 'Summary'}
            </TabsTrigger>
            <TabsTrigger value="detailed" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {language === 'ar' ? 'تفصيلي' : 'Detailed'}
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <GrowthIcon className="h-4 w-4" />
              {language === 'ar' ? 'الاتجاهات' : 'Trends'}
            </TabsTrigger>
          </TabsList>

          {/* Summary View */}
          <TabsContent value="summary" className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className={cn("flex items-center justify-between", isRTL ? "flex-row-reverse" : "")}>
                      <div className={isRTL ? "text-right" : ""}>
                        <p className="text-sm text-muted-foreground mb-1">
                          {language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}
                        </p>
                        <p className="text-2xl font-bold">{formatCurrency(2450000)}</p>
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm">+12.5%</span>
                        </div>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-full">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className={cn("flex items-center justify-between", isRTL ? "flex-row-reverse" : "")}>
                      <div className={isRTL ? "text-right" : ""}>
                        <p className="text-sm text-muted-foreground mb-1">
                          {language === 'ar' ? 'متوسط المعاملة' : 'Average Transaction'}
                        </p>
                        <p className="text-2xl font-bold">{formatCurrency(189)}</p>
                        <div className="flex items-center gap-1 text-blue-600">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm">+8.3%</span>
                        </div>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-full">
                        <Target className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className={cn("flex items-center justify-between", isRTL ? "flex-row-reverse" : "")}>
                      <div className={isRTL ? "text-right" : ""}>
                        <p className="text-sm text-muted-foreground mb-1">
                          {language === 'ar' ? 'عدد المعاملات' : 'Total Transactions'}
                        </p>
                        <p className="text-2xl font-bold">12,981</p>
                        <div className="flex items-center gap-1 text-purple-600">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm">+15.7%</span>
                        </div>
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-full">
                        <Zap className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className={cn("flex items-center justify-between", isRTL ? "flex-row-reverse" : "")}>
                      <div className={isRTL ? "text-right" : ""}>
                        <p className="text-sm text-muted-foreground mb-1">
                          {language === 'ar' ? 'معدل النمو' : 'Growth Rate'}
                        </p>
                        <p className="text-2xl font-bold">12.5%</p>
                        <div className="flex items-center gap-1 text-green-600">
                          <ArrowUpRight className="h-4 w-4" />
                          <span className="text-sm">{language === 'ar' ? 'مقارنة بالشهر السابق' : 'vs last month'}</span>
                        </div>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-full">
                        <GrowthIcon className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Revenue Breakdown Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {language === 'ar' ? 'تحليل الإيرادات حسب المصدر' : 'Revenue Analysis by Source'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === 'pie' ? (
                        <PieChart>
                          <Pie
                            data={revenueSources}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={120}
                            dataKey="amount"
                            label={({ name, percentage }) => `${name}: ${percentage}%`}
                          >
                            {revenueSources.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                        </PieChart>
                      ) : chartType === 'bar' ? (
                        <BarChart data={revenueSources}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis 
                            dataKey="name" 
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis 
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => formatCurrency(value)}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar 
                            dataKey="amount" 
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      ) : (
                        <AreaChart data={monthlyTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis 
                            dataKey="month" 
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis 
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => formatCurrency(value)}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#3b82f6"
                            fill="url(#colorRevenue)"
                            fillOpacity={0.3}
                          />
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                        </AreaChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Detailed View */}
          <TabsContent value="detailed" className="space-y-6">
            {/* Revenue Sources Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className={cn("flex items-center justify-between", isRTL ? "flex-row-reverse" : "")}>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {language === 'ar' ? 'مصادر الإيرادات التفصيلية' : 'Detailed Revenue Sources'}
                    </CardTitle>
                    
                    <div className="flex items-center gap-2">
                      <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="amount">{language === 'ar' ? 'المبلغ' : 'Amount'}</SelectItem>
                          <SelectItem value="growth">{language === 'ar' ? 'النمو' : 'Growth'}</SelectItem>
                          <SelectItem value="name">{language === 'ar' ? 'الاسم' : 'Name'}</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      >
                        {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {sortedRevenueSources.map((source, index) => (
                        <motion.div
                          key={source.id}
                          initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className={cn("flex items-center justify-between", isRTL ? "flex-row-reverse" : "")}>
                            <div className={cn("flex items-center gap-4", isRTL ? "flex-row-reverse" : "")}>
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: source.color }}
                              />
                              <div className={isRTL ? "text-right" : ""}>
                                <h3 className="font-medium">{source.name}</h3>
                                <p className="text-sm text-muted-foreground">{source.category}</p>
                              </div>
                            </div>
                            
                            <div className={cn("flex items-center gap-6", isRTL ? "flex-row-reverse" : "")}>
                              <div className={cn("text-center", isRTL ? "text-right" : "")}>
                                <p className="text-lg font-bold">{formatCurrency(source.amount)}</p>
                                <p className="text-sm text-muted-foreground">{source.percentage}%</p>
                              </div>
                              
                              <div className={cn("text-center", isRTL ? "text-right" : "")}>
                                <div className={cn("flex items-center gap-1", source.trend === 'up' ? 'text-green-600' : 'text-red-600')}>
                                  {source.trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                  <span className="text-sm font-medium">{Math.abs(source.change)}%</span>
                                </div>
                              </div>
                              
                              <div className={cn("text-center", isRTL ? "text-right" : "")}>
                                <p className="text-sm font-medium">{source.transactions.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">{language === 'ar' ? 'معاملة' : 'transactions'}</p>
                              </div>
                              
                              <div className={cn("text-center", isRTL ? "text-right" : "")}>
                                <p className="text-sm font-medium">{formatCurrency(source.averageValue)}</p>
                                <p className="text-xs text-muted-foreground">{language === 'ar' ? 'متوسط' : 'average'}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>

            {/* Department Revenue Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    {language === 'ar' ? 'الإيرادات حسب القسم' : 'Revenue by Department'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {departmentRevenue.map((dept, index) => (
                      <motion.div
                        key={dept.department}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border rounded-lg hover:shadow-md transition-all duration-300"
                      >
                        <div className="space-y-3">
                          <div className={cn("flex items-center justify-between", isRTL ? "flex-row-reverse" : "")}>
                            <h3 className="font-medium">{dept.department}</h3>
                            <Badge variant={dept.growth > 0 ? "default" : "secondary"}>
                              {dept.growth > 0 ? '+' : ''}{dept.growth}%
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className={cn("flex justify-between text-sm", isRTL ? "flex-row-reverse" : "")}>
                              <span className="text-muted-foreground">{language === 'ar' ? 'الحالي' : 'Current'}:</span>
                              <span className="font-medium">{formatCurrency(dept.current)}</span>
                            </div>
                            <div className={cn("flex justify-between text-sm", isRTL ? "flex-row-reverse" : "")}>
                              <span className="text-muted-foreground">{language === 'ar' ? 'السابق' : 'Previous'}:</span>
                              <span>{formatCurrency(dept.previous)}</span>
                            </div>
                            <div className={cn("flex justify-between text-sm", isRTL ? "flex-row-reverse" : "")}>
                              <span className="text-muted-foreground">{language === 'ar' ? 'المرضى' : 'Patients'}:</span>
                              <span>{dept.patientCount}</span>
                            </div>
                            <div className={cn("flex justify-between text-sm", isRTL ? "flex-row-reverse" : "")}>
                              <span className="text-muted-foreground">{language === 'ar' ? 'متوسط/مريض' : 'Avg/Patient'}:</span>
                              <span>{formatCurrency(dept.averagePerPatient)}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Trends View */}
          <TabsContent value="trends" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChartIcon className="h-5 w-5" />
                    {language === 'ar' ? 'اتجاهات الإيرادات الشهرية' : 'Monthly Revenue Trends'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="month" 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickFormatter={(value) => formatCurrency(value)}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="consultations" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          name={language === 'ar' ? 'الاستشارات' : 'Consultations'}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="surgery" 
                          stroke="#ef4444" 
                          strokeWidth={3}
                          name={language === 'ar' ? 'الجراحة' : 'Surgery'}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="diagnostics" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          name={language === 'ar' ? 'التشخيص' : 'Diagnostics'}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="pharmacy" 
                          stroke="#f59e0b" 
                          strokeWidth={3}
                          name={language === 'ar' ? 'الصيدلية' : 'Pharmacy'}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default RevenueReport;