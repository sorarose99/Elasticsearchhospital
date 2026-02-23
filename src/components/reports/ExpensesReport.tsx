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
import { Progress } from '../ui/progress';
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
  CreditCard, 
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
  DollarSign,
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
  Zap,
  Package,
  Truck,
  Wrench,
  UserCheck,
  Lightbulb,
  Wifi,
  Shield,
  HeartHandshake,
  Briefcase
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';
import { cn } from '../ui/utils';

interface ExpenseCategory {
  id: string;
  name: string;
  type: 'operational' | 'medical' | 'administrative' | 'maintenance';
  amount: number;
  budgeted: number;
  variance: number;
  percentage: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  transactions: number;
  averageValue: number;
  color: string;
  icon: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
}

interface DepartmentExpenses {
  department: string;
  current: number;
  budgeted: number;
  variance: number;
  utilizationRate: number;
  keyExpenses: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

interface ExpensesTrend {
  month: string;
  total: number;
  operational: number;
  medical: number;
  administrative: number;
  maintenance: number;
  budget: number;
}

interface ExpensesReportProps {
  onGoBack: () => void;
}

const ExpensesReport: React.FC<ExpensesReportProps> = ({ onGoBack }) => {
  const { t, language, isRTL } = useLanguage();
  const { effectiveTheme } = useTheme();

  // State management
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area' | 'pie'>('area');
  const [viewMode, setViewMode] = useState<'summary' | 'detailed' | 'budget' | 'trends'>('summary');
  const [sortBy, setSortBy] = useState<'amount' | 'variance' | 'name'>('amount');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Expense categories data
  const expenseCategories: ExpenseCategory[] = useMemo(() => [
    {
      id: 'salaries',
      name: language === 'ar' ? 'الرواتب والأجور' : 'Salaries & Wages',
      type: 'administrative',
      amount: 680000,
      budgeted: 650000,
      variance: 30000,
      percentage: 40.5,
      change: 5.2,
      trend: 'up',
      transactions: 247,
      averageValue: 2753,
      color: '#3b82f6',
      icon: <UserCheck className="h-5 w-5" />,
      priority: 'high'
    },
    {
      id: 'medical_supplies',
      name: language === 'ar' ? 'المستلزمات الطبية' : 'Medical Supplies',
      type: 'medical',
      amount: 320000,
      budgeted: 350000,
      variance: -30000,
      percentage: 19.0,
      change: -8.6,
      trend: 'down',
      transactions: 1247,
      averageValue: 257,
      color: '#10b981',
      icon: <Package className="h-5 w-5" />,
      priority: 'high'
    },
    {
      id: 'utilities',
      name: language === 'ar' ? 'المرافق والخدمات' : 'Utilities & Services',
      type: 'operational',
      amount: 150000,
      budgeted: 140000,
      variance: 10000,
      percentage: 8.9,
      change: 7.1,
      trend: 'up',
      transactions: 45,
      averageValue: 3333,
      color: '#f59e0b',
      icon: <Lightbulb className="h-5 w-5" />,
      priority: 'medium'
    },
    {
      id: 'maintenance',
      name: language === 'ar' ? 'الصيانة والإصلاح' : 'Maintenance & Repair',
      type: 'maintenance',
      amount: 120000,
      budgeted: 100000,
      variance: 20000,
      percentage: 7.1,
      change: 20.0,
      trend: 'up',
      transactions: 187,
      averageValue: 642,
      color: '#ef4444',
      icon: <Wrench className="h-5 w-5" />,
      priority: 'medium'
    },
    {
      id: 'pharmaceuticals',
      name: language === 'ar' ? 'الأدوية' : 'Pharmaceuticals',
      type: 'medical',
      amount: 200000,
      budgeted: 220000,
      variance: -20000,
      percentage: 11.9,
      change: -9.1,
      trend: 'down',
      transactions: 3247,
      averageValue: 62,
      color: '#8b5cf6',
      icon: <HeartHandshake className="h-5 w-5" />,
      priority: 'high'
    },
    {
      id: 'equipment',
      name: language === 'ar' ? 'المعدات والأجهزة' : 'Equipment & Devices',
      type: 'medical',
      amount: 80000,
      budgeted: 90000,
      variance: -10000,
      percentage: 4.8,
      change: -11.1,
      trend: 'down',
      transactions: 23,
      averageValue: 3478,
      color: '#06b6d4',
      icon: <Stethoscope className="h-5 w-5" />,
      priority: 'medium'
    },
    {
      id: 'insurance',
      name: language === 'ar' ? 'التأمين' : 'Insurance',
      type: 'administrative',
      amount: 45000,
      budgeted: 50000,
      variance: -5000,
      percentage: 2.7,
      change: -10.0,
      trend: 'down',
      transactions: 12,
      averageValue: 3750,
      color: '#14b8a6',
      icon: <Shield className="h-5 w-5" />,
      priority: 'low'
    },
    {
      id: 'transportation',
      name: language === 'ar' ? 'النقل والمواصلات' : 'Transportation',
      type: 'operational',
      amount: 35000,
      budgeted: 40000,
      variance: -5000,
      percentage: 2.1,
      change: -12.5,
      trend: 'down',
      transactions: 89,
      averageValue: 393,
      color: '#f97316',
      icon: <Truck className="h-5 w-5" />,
      priority: 'low'
    },
    {
      id: 'technology',
      name: language === 'ar' ? 'التكنولوجيا والاتصالات' : 'Technology & IT',
      type: 'operational',
      amount: 50000,
      budgeted: 45000,
      variance: 5000,
      percentage: 3.0,
      change: 11.1,
      trend: 'up',
      transactions: 67,
      averageValue: 746,
      color: '#6366f1',
      icon: <Wifi className="h-5 w-5" />,
      priority: 'medium'
    }
  ], [language]);

  // Department expenses data
  const departmentExpenses: DepartmentExpenses[] = useMemo(() => [
    {
      department: language === 'ar' ? 'الطوارئ' : 'Emergency',
      current: 280000,
      budgeted: 250000,
      variance: 30000,
      utilizationRate: 112,
      keyExpenses: [
        { category: language === 'ar' ? 'مستلزمات طبية' : 'Medical Supplies', amount: 120000, percentage: 42.9 },
        { category: language === 'ar' ? 'أدوية' : 'Pharmaceuticals', amount: 80000, percentage: 28.6 },
        { category: language === 'ar' ? 'رواتب' : 'Salaries', amount: 80000, percentage: 28.6 }
      ]
    },
    {
      department: language === 'ar' ? 'الأشعة' : 'Radiology',
      current: 195000,
      budgeted: 200000,
      variance: -5000,
      utilizationRate: 97.5,
      keyExpenses: [
        { category: language === 'ar' ? 'معدات' : 'Equipment', amount: 80000, percentage: 41.0 },
        { category: language === 'ar' ? 'رواتب' : 'Salaries', amount: 70000, percentage: 35.9 },
        { category: language === 'ar' ? 'صيانة' : 'Maintenance', amount: 45000, percentage: 23.1 }
      ]
    },
    {
      department: language === 'ar' ? 'المختبر' : 'Laboratory',
      current: 165000,
      budgeted: 170000,
      variance: -5000,
      utilizationRate: 97.1,
      keyExpenses: [
        { category: language === 'ar' ? 'مستلزمات' : 'Supplies', amount: 75000, percentage: 45.5 },
        { category: language === 'ar' ? 'رواتب' : 'Salaries', amount: 60000, percentage: 36.4 },
        { category: language === 'ar' ? 'معدات' : 'Equipment', amount: 30000, percentage: 18.2 }
      ]
    },
    {
      department: language === 'ar' ? 'الصيدلية' : 'Pharmacy',
      current: 140000,
      budgeted: 150000,
      variance: -10000,
      utilizationRate: 93.3,
      keyExpenses: [
        { category: language === 'ar' ? 'أدوية' : 'Pharmaceuticals', amount: 100000, percentage: 71.4 },
        { category: language === 'ar' ? 'رواتب' : 'Salaries', amount: 30000, percentage: 21.4 },
        { category: language === 'ar' ? 'تشغيل' : 'Operations', amount: 10000, percentage: 7.1 }
      ]
    }
  ], [language]);

  // Monthly expenses trend
  const expensesTrend: ExpensesTrend[] = useMemo(() => [
    { 
      month: language === 'ar' ? 'يناير' : 'Jan', 
      total: 1450000, 
      operational: 235000, 
      medical: 580000, 
      administrative: 520000, 
      maintenance: 115000,
      budget: 1500000 
    },
    { 
      month: language === 'ar' ? 'فبراير' : 'Feb', 
      total: 1520000, 
      operational: 245000, 
      medical: 610000, 
      administrative: 545000, 
      maintenance: 120000,
      budget: 1500000 
    },
    { 
      month: language === 'ar' ? 'مارس' : 'Mar', 
      total: 1480000, 
      operational: 240000, 
      medical: 595000, 
      administrative: 525000, 
      maintenance: 120000,
      budget: 1500000 
    },
    { 
      month: language === 'ar' ? 'أبريل' : 'Apr', 
      total: 1610000, 
      operational: 260000, 
      medical: 645000, 
      administrative: 570000, 
      maintenance: 135000,
      budget: 1600000 
    },
    { 
      month: language === 'ar' ? 'مايو' : 'May', 
      total: 1680000, 
      operational: 235000, 
      medical: 520000, 
      administrative: 725000, 
      maintenance: 200000,
      budget: 1650000 
    }
  ], [language]);

  // Calculate total expenses
  const totalExpenses = expenseCategories.reduce((sum, category) => sum + category.amount, 0);
  const totalBudgeted = expenseCategories.reduce((sum, category) => sum + category.budgeted, 0);
  const totalVariance = totalExpenses - totalBudgeted;
  const budgetUtilization = (totalExpenses / totalBudgeted) * 100;

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
    console.log(`Exporting expenses report as ${format}`);
  };

  // Sort expense categories
  const sortedExpenseCategories = useMemo(() => {
    return [...expenseCategories].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'variance':
          aValue = Math.abs(a.variance);
          bValue = Math.abs(b.variance);
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
  }, [expenseCategories, sortBy, sortOrder]);

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 dark:bg-red-950/20';
      case 'medium': return 'text-orange-600 bg-orange-50 dark:bg-orange-950/20';
      case 'low': return 'text-green-600 bg-green-50 dark:bg-green-950/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20';
    }
  };

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
              <CreditCard className="h-6 w-6" />
              {language === 'ar' ? 'تقرير المصروفات' : 'Expenses Report'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'ar' ? 'تحليل شامل لجميع المصروفات والتكاليف' : 'Comprehensive analysis of all expenses and costs'}
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {language === 'ar' ? 'ملخص' : 'Summary'}
            </TabsTrigger>
            <TabsTrigger value="detailed" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {language === 'ar' ? 'تفصيلي' : 'Detailed'}
            </TabsTrigger>
            <TabsTrigger value="budget" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              {language === 'ar' ? 'الميزانية' : 'Budget'}
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
                          {language === 'ar' ? 'إجمالي المصروفات' : 'Total Expenses'}
                        </p>
                        <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
                        <div className={cn("flex items-center gap-1", totalVariance > 0 ? 'text-red-600' : 'text-green-600')}>
                          {totalVariance > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                          <span className="text-sm">{formatCurrency(Math.abs(totalVariance))}</span>
                        </div>
                      </div>
                      <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-full">
                        <CreditCard className="h-6 w-6 text-red-600" />
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
                          {language === 'ar' ? 'الميزانية المخصصة' : 'Budgeted Amount'}
                        </p>
                        <p className="text-2xl font-bold">{formatCurrency(totalBudgeted)}</p>
                        <div className="text-sm text-muted-foreground">
                          {language === 'ar' ? 'للفترة الحالية' : 'Current Period'}
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
                          {language === 'ar' ? 'استخدام الميزانية' : 'Budget Utilization'}
                        </p>
                        <p className="text-2xl font-bold">{budgetUtilization.toFixed(1)}%</p>
                        <div className={cn("flex items-center gap-1", budgetUtilization > 100 ? 'text-red-600' : 'text-green-600')}>
                          {budgetUtilization > 100 ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          <span className="text-sm">
                            {budgetUtilization > 100 ? 
                              (language === 'ar' ? 'تجاوز الميزانية' : 'Over Budget') : 
                              (language === 'ar' ? 'ضمن الميزانية' : 'Within Budget')
                            }
                          </span>
                        </div>
                      </div>
                      <div className={cn("p-3 rounded-full", budgetUtilization > 100 ? 'bg-red-50 dark:bg-red-950/20' : 'bg-green-50 dark:bg-green-950/20')}>
                        {budgetUtilization > 100 ? 
                          <AlertCircle className="h-6 w-6 text-red-600" /> : 
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        }
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
                          {language === 'ar' ? 'الانحراف عن الميزانية' : 'Budget Variance'}
                        </p>
                        <p className={cn("text-2xl font-bold", totalVariance > 0 ? 'text-red-600' : 'text-green-600')}>
                          {totalVariance > 0 ? '+' : ''}{formatCurrency(totalVariance)}
                        </p>
                        <div className={cn("flex items-center gap-1", totalVariance > 0 ? 'text-red-600' : 'text-green-600')}>
                          {totalVariance > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                          <span className="text-sm">
                            {((Math.abs(totalVariance) / totalBudgeted) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className={cn("p-3 rounded-full", totalVariance > 0 ? 'bg-red-50 dark:bg-red-950/20' : 'bg-green-50 dark:bg-green-950/20')}>
                        <GrowthIcon className={cn("h-6 w-6", totalVariance > 0 ? 'text-red-600' : 'text-green-600')} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Expenses Breakdown Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {language === 'ar' ? 'تحليل المصروفات حسب الفئة' : 'Expenses Analysis by Category'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === 'pie' ? (
                        <PieChart>
                          <Pie
                            data={expenseCategories}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={120}
                            dataKey="amount"
                            label={({ name, percentage }) => `${name}: ${percentage}%`}
                          >
                            {expenseCategories.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                        </PieChart>
                      ) : chartType === 'bar' ? (
                        <BarChart data={expenseCategories}>
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
                            fill="#ef4444"
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar 
                            dataKey="budgeted" 
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                            opacity={0.7}
                          />
                        </BarChart>
                      ) : (
                        <AreaChart data={expensesTrend}>
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
                            dataKey="total"
                            stroke="#ef4444"
                            fill="url(#colorExpenses)"
                            fillOpacity={0.3}
                          />
                          <Line
                            type="monotone"
                            dataKey="budget"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                          />
                          <defs>
                            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                        </AreaChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Expense Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {language === 'ar' ? 'أعلى فئات المصروفات' : 'Top Expense Categories'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {expenseCategories.slice(0, 5).map((category, index) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className={cn("flex items-center gap-4", isRTL ? "flex-row-reverse" : "")}>
                          <div className="p-2 rounded-lg bg-background border">
                            <div className={category.color.replace('text-', 'text-')}>
                              {category.icon}
                            </div>
                          </div>
                          <div className={isRTL ? "text-right" : ""}>
                            <h3 className="font-medium">{category.name}</h3>
                            <p className="text-sm text-muted-foreground">{category.type}</p>
                          </div>
                        </div>
                        
                        <div className={cn("flex items-center gap-6", isRTL ? "flex-row-reverse" : "")}>
                          <div className={cn("text-center", isRTL ? "text-right" : "")}>
                            <p className="text-lg font-bold">{formatCurrency(category.amount)}</p>
                            <p className="text-sm text-muted-foreground">{category.percentage}%</p>
                          </div>
                          
                          <Badge className={getPriorityColor(category.priority)}>
                            {language === 'ar' ? 
                              (category.priority === 'high' ? 'عالي' : category.priority === 'medium' ? 'متوسط' : 'منخفض') :
                              category.priority
                            }
                          </Badge>
                          
                          <div className={cn("flex items-center gap-1", category.variance > 0 ? 'text-red-600' : 'text-green-600')}>
                            {category.variance > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                            <span className="text-sm font-medium">
                              {formatCurrency(Math.abs(category.variance))}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Detailed View */}
          <TabsContent value="detailed" className="space-y-6">
            {/* Expense Categories Table */}
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
                      {language === 'ar' ? 'فئات المصروفات التفصيلية' : 'Detailed Expense Categories'}
                    </CardTitle>
                    
                    <div className="flex items-center gap-2">
                      <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="amount">{language === 'ar' ? 'المبلغ' : 'Amount'}</SelectItem>
                          <SelectItem value="variance">{language === 'ar' ? 'الانحراف' : 'Variance'}</SelectItem>
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
                      {sortedExpenseCategories.map((category, index) => (
                        <motion.div
                          key={category.id}
                          initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="space-y-4">
                            <div className={cn("flex items-center justify-between", isRTL ? "flex-row-reverse" : "")}>
                              <div className={cn("flex items-center gap-4", isRTL ? "flex-row-reverse" : "")}>
                                <div className="p-2 rounded-lg bg-background border">
                                  <div style={{ color: category.color }}>
                                    {category.icon}
                                  </div>
                                </div>
                                <div className={isRTL ? "text-right" : ""}>
                                  <h3 className="font-medium">{category.name}</h3>
                                  <p className="text-sm text-muted-foreground">{category.type}</p>
                                </div>
                              </div>
                              
                              <Badge className={getPriorityColor(category.priority)}>
                                {language === 'ar' ? 
                                  (category.priority === 'high' ? 'عالي' : category.priority === 'medium' ? 'متوسط' : 'منخفض') :
                                  category.priority
                                }
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div className={cn("space-y-1", isRTL ? "text-right" : "")}>
                                <p className="text-muted-foreground">{language === 'ar' ? 'الفعلي' : 'Actual'}</p>
                                <p className="font-medium text-lg">{formatCurrency(category.amount)}</p>
                              </div>
                              
                              <div className={cn("space-y-1", isRTL ? "text-right" : "")}>
                                <p className="text-muted-foreground">{language === 'ar' ? 'المخطط' : 'Budgeted'}</p>
                                <p className="font-medium">{formatCurrency(category.budgeted)}</p>
                              </div>
                              
                              <div className={cn("space-y-1", isRTL ? "text-right" : "")}>
                                <p className="text-muted-foreground">{language === 'ar' ? 'الانحراف' : 'Variance'}</p>
                                <p className={cn("font-medium", category.variance > 0 ? 'text-red-600' : 'text-green-600')}>
                                  {category.variance > 0 ? '+' : ''}{formatCurrency(category.variance)}
                                </p>
                              </div>
                              
                              <div className={cn("space-y-1", isRTL ? "text-right" : "")}>
                                <p className="text-muted-foreground">{language === 'ar' ? 'النسبة' : 'Percentage'}</p>
                                <p className="font-medium">{category.percentage}%</p>
                              </div>
                            </div>
                            
                            <div className="pt-2">
                              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                <span>{language === 'ar' ? 'استخدام الميزانية' : 'Budget Utilization'}</span>
                                <span>{((category.amount / category.budgeted) * 100).toFixed(1)}%</span>
                              </div>
                              <Progress 
                                value={(category.amount / category.budgeted) * 100} 
                                className="h-2"
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Budget View */}
          <TabsContent value="budget" className="space-y-6">
            {/* Budget vs Actual Comparison */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {language === 'ar' ? 'مقارنة الميزانية مع الفعلي' : 'Budget vs Actual Comparison'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={expenseCategories}>
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
                        <Legend />
                        <Bar 
                          dataKey="budgeted" 
                          fill="#3b82f6" 
                          name={language === 'ar' ? 'المخطط' : 'Budgeted'}
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          dataKey="amount" 
                          fill="#ef4444" 
                          name={language === 'ar' ? 'الفعلي' : 'Actual'}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Department Budget Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    {language === 'ar' ? 'تحليل ميزانية الأقسام' : 'Department Budget Analysis'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {departmentExpenses.map((dept, index) => (
                      <motion.div
                        key={dept.department}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="p-4 border rounded-lg space-y-4"
                      >
                        <div className={cn("flex items-center justify-between", isRTL ? "flex-row-reverse" : "")}>
                          <h3 className="font-medium">{dept.department}</h3>
                          <Badge variant={dept.utilizationRate > 100 ? "destructive" : "default"}>
                            {dept.utilizationRate.toFixed(1)}%
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                            <span className="text-sm text-muted-foreground">{language === 'ar' ? 'المصروف الحالي' : 'Current Expense'}</span>
                            <span className="font-medium">{formatCurrency(dept.current)}</span>
                          </div>
                          
                          <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                            <span className="text-sm text-muted-foreground">{language === 'ar' ? 'الميزانية المخصصة' : 'Budgeted Amount'}</span>
                            <span className="font-medium">{formatCurrency(dept.budgeted)}</span>
                          </div>
                          
                          <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                            <span className="text-sm text-muted-foreground">{language === 'ar' ? 'الانحراف' : 'Variance'}</span>
                            <span className={cn("font-medium", dept.variance > 0 ? 'text-red-600' : 'text-green-600')}>
                              {dept.variance > 0 ? '+' : ''}{formatCurrency(dept.variance)}
                            </span>
                          </div>
                          
                          <div className="pt-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                              <span>{language === 'ar' ? 'استخدام الميزانية' : 'Budget Utilization'}</span>
                              <span>{dept.utilizationRate.toFixed(1)}%</span>
                            </div>
                            <Progress 
                              value={dept.utilizationRate} 
                              className="h-2"
                            />
                          </div>
                          
                          <div className="pt-2 space-y-2">
                            <h4 className="text-sm font-medium text-muted-foreground">
                              {language === 'ar' ? 'أهم المصروفات' : 'Key Expenses'}
                            </h4>
                            {dept.keyExpenses.map((expense, i) => (
                              <div key={i} className={cn("flex justify-between text-sm", isRTL ? "flex-row-reverse" : "")}>
                                <span>{expense.category}</span>
                                <span>{formatCurrency(expense.amount)} ({expense.percentage}%)</span>
                              </div>
                            ))}
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
                    {language === 'ar' ? 'اتجاهات المصروفات الشهرية' : 'Monthly Expenses Trends'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={expensesTrend}>
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
                          dataKey="operational" 
                          stroke="#f59e0b" 
                          strokeWidth={3}
                          name={language === 'ar' ? 'تشغيلية' : 'Operational'}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="medical" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          name={language === 'ar' ? 'طبية' : 'Medical'}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="administrative" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          name={language === 'ar' ? 'إدارية' : 'Administrative'}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="maintenance" 
                          stroke="#ef4444" 
                          strokeWidth={3}
                          name={language === 'ar' ? 'صيانة' : 'Maintenance'}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="budget" 
                          stroke="#6366f1" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name={language === 'ar' ? 'الميزانية' : 'Budget'}
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

export default ExpensesReport;