import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  CreditCard, 
  Users, 
  FileBarChart,
  Download,
  Printer,
  Filter,
  RefreshCw,
  Eye,
  BarChart3,
  PieChart,
  LineChart,
  Calendar as CalendarIcon,
  Search,
  Settings,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Building,
  Stethoscope
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';
import { cn } from '../ui/utils';

// Report Types
type ReportType = 'revenue' | 'expenses' | 'profitability' | 'insurance' | 'patients' | 'monthly';

interface FinancialMetric {
  id: string;
  title: string;
  value: number;
  change: number;
  period: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
}

interface ReportConfig {
  type: ReportType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
}

interface FinancialReportsDashboardProps {
  onNavigateToReport: (reportType: ReportType | 'print-manager' | 'notifications' | 'tasks') => void;
}

// Import detailed report components
import RevenueReportDetailed from './RevenueReportDetailed';
import ExpensesReportDetailed from './ExpensesReportDetailed';
import ProfitabilityReportDetailed from './ProfitabilityReportDetailed';
import InsuranceReportDetailed from './InsuranceReportDetailed';

const FinancialReportsDashboard: React.FC<FinancialReportsDashboardProps> = ({
  onNavigateToReport
}) => {
  const { t, language, isRTL } = useLanguage();
  const { effectiveTheme } = useTheme();

  // State management
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState<ReportType | 'dashboard'>('dashboard');

  // Financial metrics data
  const financialMetrics: FinancialMetric[] = useMemo(() => [
    {
      id: 'totalRevenue',
      title: language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue',
      value: 2450000,
      change: 12.5,
      period: language === 'ar' ? 'هذا الشهر' : 'This Month',
      trend: 'up',
      icon: <DollarSign className="h-5 w-5" />,
      color: 'text-green-600'
    },
    {
      id: 'totalExpenses',
      title: language === 'ar' ? 'إجمالي المصروفات' : 'Total Expenses',
      value: 1680000,
      change: -8.2,
      period: language === 'ar' ? 'هذا الشهر' : 'This Month',
      trend: 'down',
      icon: <CreditCard className="h-5 w-5" />,
      color: 'text-red-600'
    },
    {
      id: 'netProfit',
      title: language === 'ar' ? 'صافي الربح' : 'Net Profit',
      value: 770000,
      change: 23.1,
      period: language === 'ar' ? 'هذا الشهر' : 'This Month',
      trend: 'up',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-blue-600'
    },
    {
      id: 'insuranceClaims',
      title: language === 'ar' ? 'مطالبات التأمين' : 'Insurance Claims',
      value: 1245000,
      change: 5.7,
      period: language === 'ar' ? 'هذا الشهر' : 'This Month',
      trend: 'up',
      icon: <Shield className="h-5 w-5" />,
      color: 'text-purple-600'
    },
    {
      id: 'patientRevenue',
      title: language === 'ar' ? 'إيرادات المرضى' : 'Patient Revenue',
      value: 1890000,
      change: 15.3,
      period: language === 'ar' ? 'هذا الشهر' : 'This Month',
      trend: 'up',
      icon: <Users className="h-5 w-5" />,
      color: 'text-indigo-600'
    },
    {
      id: 'operationalCosts',
      title: language === 'ar' ? 'التكاليف التشغيلية' : 'Operational Costs',
      value: 1350000,
      change: -3.4,
      period: language === 'ar' ? 'هذا الشهر' : 'This Month',
      trend: 'down',
      icon: <Building className="h-5 w-5" />,
      color: 'text-orange-600'
    }
  ], [language]);

  // Report configurations
  const reportConfigs: ReportConfig[] = useMemo(() => [
    {
      type: 'revenue',
      title: language === 'ar' ? 'تقرير الإيرادات' : 'Revenue Report',
      description: language === 'ar' ? 'تحليل تفصيلي لجميع مصادر الإيرادات' : 'Detailed analysis of all revenue sources',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'text-green-600',
      bgGradient: 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20'
    },
    {
      type: 'expenses',
      title: language === 'ar' ? 'تقرير المصروفات' : 'Expenses Report',
      description: language === 'ar' ? 'تحليل شامل لجميع المصروفات والتكاليف' : 'Comprehensive analysis of all expenses and costs',
      icon: <CreditCard className="h-6 w-6" />,
      color: 'text-red-600',
      bgGradient: 'from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20'
    },
    {
      type: 'profitability',
      title: language === 'ar' ? 'تحليل الربحية' : 'Profitability Analysis',
      description: language === 'ar' ? 'تحليل معدلات الربح والأداء المالي' : 'Analysis of profit margins and financial performance',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'text-blue-600',
      bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20'
    },
    {
      type: 'insurance',
      title: language === 'ar' ? 'تقرير التأمين' : 'Insurance Report',
      description: language === 'ar' ? 'تقرير مطالبات التأمين والمدفوعات' : 'Insurance claims and payments report',
      icon: <Shield className="h-6 w-6" />,
      color: 'text-purple-600',
      bgGradient: 'from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20'
    },
    {
      type: 'patients',
      title: language === 'ar' ? 'تقرير المرضى' : 'Patients Report',
      description: language === 'ar' ? 'تحليل إيرادات وتكاليف المرضى' : 'Patient revenue and cost analysis',
      icon: <Users className="h-6 w-6" />,
      color: 'text-indigo-600',
      bgGradient: 'from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20'
    },
    {
      type: 'monthly',
      title: language === 'ar' ? 'التقرير الشهري' : 'Monthly Report',
      description: language === 'ar' ? 'التقرير المالي الشامل الشهري' : 'Comprehensive monthly financial report',
      icon: <Calendar as CalendarIcon className="h-6 w-6" />,
      color: 'text-orange-600',
      bgGradient: 'from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20'
    }
  ], [language]);

  // Chart data for dashboard overview
  const chartData = useMemo(() => ({
    revenueVsExpenses: [
      { month: language === 'ar' ? 'يناير' : 'Jan', revenue: 2100000, expenses: 1450000 },
      { month: language === 'ar' ? 'فبراير' : 'Feb', revenue: 2250000, expenses: 1520000 },
      { month: language === 'ar' ? 'مارس' : 'Mar', revenue: 2180000, expenses: 1480000 },
      { month: language === 'ar' ? 'أبريل' : 'Apr', revenue: 2350000, expenses: 1610000 },
      { month: language === 'ar' ? 'مايو' : 'May', revenue: 2450000, expenses: 1680000 },
    ],
    departmentRevenue: [
      { name: language === 'ar' ? 'الطوارئ' : 'Emergency', value: 450000, color: '#ef4444' },
      { name: language === 'ar' ? 'الأشعة' : 'Radiology', value: 380000, color: '#3b82f6' },
      { name: language === 'ar' ? 'المختبر' : 'Laboratory', value: 320000, color: '#10b981' },
      { name: language === 'ar' ? 'الصيدلية' : 'Pharmacy', value: 280000, color: '#f59e0b' },
      { name: language === 'ar' ? 'العيادات' : 'Clinics', value: 1020000, color: '#8b5cf6' },
    ]
  }), [language]);

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

  // Handle refresh data
  const handleRefreshData = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
  };

  // Handle navigation to specific report
  const handleViewReport = (reportType: ReportType) => {
    setCurrentView(reportType);
    onNavigateToReport(reportType);
  };

  // Handle back to dashboard
  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  // Render specific report component
  const renderReportComponent = () => {
    switch (currentView) {
      case 'revenue':
        return <RevenueReportDetailed />;
      case 'expenses':
        return <ExpensesReportDetailed />;
      case 'profitability':
        return <ProfitabilityReportDetailed />;
      case 'insurance':
        return <InsuranceReportDetailed />;
      case 'patients':
        return <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">تقرير المرضى</h3>
          <p className="text-muted-foreground">قريباً...</p>
        </div>;
      case 'monthly':
        return <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">التقرير الشهري</h3>
          <p className="text-muted-foreground">قريباً...</p>
        </div>;
      default:
        return null;
    }
  };

  // If viewing a specific report, show that component
  if (currentView !== 'dashboard') {
    return (
      <div className="space-y-6">
        <Button 
          variant="outline" 
          onClick={handleBackToDashboard}
          className="mb-4"
        >
          <ArrowUpRight className="h-4 w-4 mr-2 rotate-180" />
          العودة إلى لوحة التقارير
        </Button>
        {renderReportComponent()}
      </div>
    );
  }

  return (
    <div className={cn("space-y-6 p-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4", isRTL ? "lg:flex-row-reverse" : "")}
      >
        <div className={isRTL ? "text-right" : ""}>
          <h1 className="text-3xl font-bold text-primary mb-2">
            {language === 'ar' ? 'التقارير والتحليلات المالية' : 'Financial Reports & Analytics'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'ar' ? 'نظرة شاملة على الأداء المالي للمستشفى' : 'Comprehensive overview of hospital financial performance'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshData}
            disabled={loading}
            className="hover-lift"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin", isRTL ? "ml-2" : "mr-2")} />
            {language === 'ar' ? 'تحديث' : 'Refresh'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="hover-lift"
          >
            <Filter className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
            {language === 'ar' ? 'فلترة' : 'Filter'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="hover-lift"
          >
            <Download className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
            {language === 'ar' ? 'تصدير' : 'Export'}
          </Button>
        </div>
      </motion.div>

      {/* Filters Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Date Range Selector */}
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">
                  {language === 'ar' ? 'الفترة الزمنية' : 'Time Period'}
                </label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">{language === 'ar' ? 'اليوم' : 'Today'}</SelectItem>
                    <SelectItem value="thisWeek">{language === 'ar' ? 'هذا الأسبوع' : 'This Week'}</SelectItem>
                    <SelectItem value="thisMonth">{language === 'ar' ? 'هذا الشهر' : 'This Month'}</SelectItem>
                    <SelectItem value="thisQuarter">{language === 'ar' ? 'هذا الربع' : 'This Quarter'}</SelectItem>
                    <SelectItem value="thisYear">{language === 'ar' ? 'هذا العام' : 'This Year'}</SelectItem>
                    <SelectItem value="custom">{language === 'ar' ? 'فترة مخصصة' : 'Custom Range'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Department Filter */}
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">
                  {language === 'ar' ? 'القسم' : 'Department'}
                </label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'ar' ? 'جميع الأقسام' : 'All Departments'}</SelectItem>
                    <SelectItem value="emergency">{language === 'ar' ? 'الطوارئ' : 'Emergency'}</SelectItem>
                    <SelectItem value="radiology">{language === 'ar' ? 'الأشعة' : 'Radiology'}</SelectItem>
                    <SelectItem value="laboratory">{language === 'ar' ? 'المختبر' : 'Laboratory'}</SelectItem>
                    <SelectItem value="pharmacy">{language === 'ar' ? 'الصيدلية' : 'Pharmacy'}</SelectItem>
                    <SelectItem value="clinics">{language === 'ar' ? 'العيادات' : 'Clinics'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search */}
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">
                  {language === 'ar' ? 'بحث' : 'Search'}
                </label>
                <div className="relative">
                  <Search className={cn("absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground", isRTL ? "right-3" : "left-3")} />
                  <Input
                    placeholder={language === 'ar' ? 'البحث في التقارير...' : 'Search reports...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={isRTL ? "pr-10" : "pl-10"}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Key Financial Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {financialMetrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ y: -4 }}
            className="group"
          >
            <Card className="hover:shadow-lg transition-all duration-300 card-animate">
              <CardContent className="p-6">
                <div className={cn("flex items-start justify-between", isRTL ? "flex-row-reverse" : "")}>
                  <div className={cn("space-y-2", isRTL ? "text-right" : "")}>
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">
                        {formatCurrency(metric.value)}
                      </span>
                      <div className={cn("flex items-center gap-1", metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-gray-600')}>
                        {metric.trend === 'up' ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : metric.trend === 'down' ? (
                          <ArrowDownRight className="h-4 w-4" />
                        ) : (
                          <div className="h-4 w-4" />
                        )}
                        <span className="text-xs font-medium">
                          {Math.abs(metric.change)}%
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {metric.period}
                    </p>
                  </div>
                  <div className={cn("p-3 rounded-full bg-gradient-to-br", metric.color === 'text-green-600' ? 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20' :
                    metric.color === 'text-red-600' ? 'from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20' :
                    metric.color === 'text-blue-600' ? 'from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20' :
                    metric.color === 'text-purple-600' ? 'from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20' :
                    metric.color === 'text-indigo-600' ? 'from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20' :
                    'from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20'
                  )}>
                    <div className={metric.color}>
                      {metric.icon}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Report Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {reportConfigs.map((report, index) => (
          <motion.div
            key={report.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group cursor-pointer"
            onClick={() => handleViewReport(report.type)}
          >
            <Card className={cn(
              "hover:shadow-xl transition-all duration-500 border-2 border-transparent group-hover:border-primary/20 overflow-hidden relative",
              "bg-gradient-to-br", report.bgGradient
            )}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="relative z-10">
                <div className={cn("flex items-center justify-between", isRTL ? "flex-row-reverse" : "")}>
                  <div className={cn("p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg", report.color)}>
                    {report.icon}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className={cn("space-y-2", isRTL ? "text-right" : "")}>
                  <CardTitle className="group-hover:text-primary transition-colors duration-300">
                    {report.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {report.description}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {language === 'ar' ? 'محدث حديثاً' : 'Recently updated'}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn("text-primary hover:text-primary/80 hover:bg-primary/10 transition-all duration-300 group-hover:scale-110", isRTL ? "flex-row-reverse" : "")}
                  >
                    {language === 'ar' ? 'عرض التقرير' : 'View Report'}
                    <ArrowUpRight className={cn("h-4 w-4 transition-transform duration-300 group-hover:scale-110", isRTL ? "mr-2" : "ml-2")} />
                  </Button>
                </div>
              </CardContent>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-125 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/5 to-transparent rounded-full translate-y-12 -translate-x-12 group-hover:scale-125 transition-transform duration-700" />
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className={cn("flex items-center gap-2", isRTL ? "flex-row-reverse" : "")}>
              <BarChart3 className="h-5 w-5" />
              {language === 'ar' ? 'ملخص الأداء المالي' : 'Financial Performance Summary'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className={cn("text-center space-y-2", isRTL ? "text-right" : "")}>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(770000)}</div>
                <div className="text-sm text-muted-foreground">{language === 'ar' ? 'صافي الربح' : 'Net Profit'}</div>
                <div className="flex items-center justify-center gap-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs">+23.1%</span>
                </div>
              </div>
              
              <div className={cn("text-center space-y-2", isRTL ? "text-right" : "")}>
                <div className="text-2xl font-bold text-blue-600">31.4%</div>
                <div className="text-sm text-muted-foreground">{language === 'ar' ? 'هامش الربح' : 'Profit Margin'}</div>
                <div className="flex items-center justify-center gap-1 text-blue-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs">+5.2%</span>
                </div>
              </div>
              
              <div className={cn("text-center space-y-2", isRTL ? "text-right" : "")}>
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(1245000)}</div>
                <div className="text-sm text-muted-foreground">{language === 'ar' ? 'مطالبات التأمين' : 'Insurance Claims'}</div>
                <div className="flex items-center justify-center gap-1 text-purple-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs">+5.7%</span>
                </div>
              </div>
              
              <div className={cn("text-center space-y-2", isRTL ? "text-right" : "")}>
                <div className="text-2xl font-bold text-indigo-600">1,247</div>
                <div className="text-sm text-muted-foreground">{language === 'ar' ? 'عدد المرضى' : 'Patient Count'}</div>
                <div className="flex items-center justify-center gap-1 text-indigo-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs">+8.9%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default FinancialReportsDashboard;