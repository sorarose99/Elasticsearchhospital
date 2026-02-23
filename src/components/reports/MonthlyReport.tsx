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
  ResponsiveContainer,
  ComposedChart,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown,
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
  Briefcase,
  Calculator,
  Award,
  Star,
  Percent,
  Activity,
  CreditCard,
  Ban,
  AlertTriangle,
  XCircle,
  PlayCircle,
  PauseCircle,
  FileCheck,
  FileClock,
  FileX,
  UserPlus,
  UserMinus,
  User,
  Baby,
  Heart,
  Brain,
  Bone,
  Microscope,
  Pill,
  BookOpen,
  Clipboard,
  FileSpreadsheet,
  Database,
  Globe,
  Smartphone,
  Mail,
  Phone,
  MapPin,
  Camera
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';
import { cn } from '../ui/utils';

interface ExecutiveSummary {
  metric: string;
  currentValue: number;
  previousValue: number;
  target: number;
  unit: 'currency' | 'percentage' | 'number' | 'days';
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'warning' | 'critical';
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface DepartmentSummary {
  department: string;
  patients: number;
  revenue: number;
  expenses: number;
  profitMargin: number;
  growth: number;
  efficiency: number;
  satisfaction: number;
  keyMetrics: {
    newPatients: number;
    procedures: number;
    averageStay: number;
    occupancyRate: number;
  };
}

interface FinancialHighlight {
  category: string;
  actual: number;
  budget: number;
  variance: number;
  percentageOfTotal: number;
  trend: number;
  priority: 'high' | 'medium' | 'low';
}

interface QualityIndicator {
  indicator: string;
  value: number;
  benchmark: number;
  status: 'excellent' | 'good' | 'needs_improvement' | 'critical';
  trend: number;
  impact: string;
}

interface MonthlyReportProps {
  onGoBack: () => void;
}

const MonthlyReport: React.FC<MonthlyReportProps> = ({ onGoBack }) => {
  const { t, language, isRTL } = useLanguage();
  const { effectiveTheme } = useTheme();

  // State management
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('may2024');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [reportFormat, setReportFormat] = useState<'summary' | 'detailed' | 'executive'>('summary');
  const [viewMode, setViewMode] = useState<'overview' | 'financial' | 'operational' | 'quality' | 'comparison'>('overview');

  // Executive Summary Data
  const executiveSummary: ExecutiveSummary[] = useMemo(() => [
    {
      metric: language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue',
      currentValue: 24500000,
      previousValue: 21890000,
      target: 25000000,
      unit: 'currency',
      trend: 'up',
      status: 'good',
      icon: <DollarSign className="h-5 w-5" />,
      color: '#10b981',
      description: language === 'ar' ? 'نمو بنسبة 11.9% مقارنة بالشهر السابق' : '11.9% growth compared to previous month'
    },
    {
      metric: language === 'ar' ? 'صافي الربح' : 'Net Profit',
      currentValue: 6200000,
      previousValue: 5450000,
      target: 6500000,
      unit: 'currency',
      trend: 'up',
      status: 'good',
      icon: <TrendingUp className="h-5 w-5" />,
      color: '#3b82f6',
      description: language === 'ar' ? 'تحسن في هامش الربح بنسبة 2.3%' : '2.3% improvement in profit margin'
    },
    {
      metric: language === 'ar' ? 'عدد المرضى' : 'Patient Count',
      currentValue: 12992,
      previousValue: 12756,
      target: 13500,
      unit: 'number',
      trend: 'up',
      status: 'good',
      icon: <Users className="h-5 w-5" />,
      color: '#8b5cf6',
      description: language === 'ar' ? 'زيادة بنسبة 1.9% في عدد المرضى' : '1.9% increase in patient volume'
    },
    {
      metric: language === 'ar' ? 'معدل رضا المرضى' : 'Patient Satisfaction',
      currentValue: 88.9,
      previousValue: 88.4,
      target: 90.0,
      unit: 'percentage',
      trend: 'up',
      status: 'good',
      icon: <Heart className="h-5 w-5" />,
      color: '#f59e0b',
      description: language === 'ar' ? 'تحسن طفيف في مستوى رضا المرضى' : 'Slight improvement in patient satisfaction'
    },
    {
      metric: language === 'ar' ? 'معدل إشغال الأسرة' : 'Bed Occupancy Rate',
      currentValue: 78.2,
      previousValue: 82.1,
      target: 80.0,
      unit: 'percentage',
      trend: 'down',
      status: 'warning',
      icon: <Building className="h-5 w-5" />,
      color: '#ef4444',
      description: language === 'ar' ? 'انخفاض في معدل إشغال الأسرة' : 'Decrease in bed occupancy rate'
    },
    {
      metric: language === 'ar' ? 'متوسط وقت الانتظار' : 'Average Wait Time',
      currentValue: 24,
      previousValue: 25,
      target: 20,
      unit: 'days',
      trend: 'up',
      status: 'warning',
      icon: <Clock className="h-5 w-5" />,
      color: '#06b6d4',
      description: language === 'ar' ? 'تحسن بسيط في أوقات الانتظار' : 'Slight improvement in wait times'
    },
    {
      metric: language === 'ar' ? 'معدل الموافقة على التأمين' : 'Insurance Approval Rate',
      currentValue: 84.9,
      previousValue: 84.5,
      target: 90.0,
      unit: 'percentage',
      trend: 'up',
      status: 'good',
      icon: <Shield className="h-5 w-5" />,
      color: '#14b8a6',
      description: language === 'ar' ? 'تحسن في معدلات موافقة التأمين' : 'Improvement in insurance approval rates'
    },
    {
      metric: language === 'ar' ? 'معدل دوران الموظفين' : 'Staff Turnover Rate',
      currentValue: 3.2,
      previousValue: 4.1,
      target: 3.0,
      unit: 'percentage',
      trend: 'up',
      status: 'good',
      icon: <UserCheck className="h-5 w-5" />,
      color: '#84cc16',
      description: language === 'ar' ? 'انخفاض في معدل دوران الموظفين' : 'Decrease in staff turnover rate'
    }
  ], [language]);

  // Department Summary Data
  const departmentSummary: DepartmentSummary[] = useMemo(() => [
    {
      department: language === 'ar' ? 'الطوارئ' : 'Emergency Department',
      patients: 2156,
      revenue: 4850000,
      expenses: 3420000,
      profitMargin: 29.5,
      growth: 15.3,
      efficiency: 87.2,
      satisfaction: 85.7,
      keyMetrics: {
        newPatients: 1847,
        procedures: 3245,
        averageStay: 0.5,
        occupancyRate: 92.1
      }
    },
    {
      department: language === 'ar' ? 'الطب الباطني' : 'Internal Medicine',
      patients: 3247,
      revenue: 6200000,
      expenses: 4180000,
      profitMargin: 32.6,
      growth: 8.7,
      efficiency: 91.4,
      satisfaction: 89.2,
      keyMetrics: {
        newPatients: 1245,
        procedures: 2890,
        averageStay: 3.2,
        occupancyRate: 85.4
      }
    },
    {
      department: language === 'ar' ? 'الجراحة العامة' : 'General Surgery',
      patients: 847,
      revenue: 3450000,
      expenses: 2567000,
      profitMargin: 25.6,
      growth: 4.1,
      efficiency: 88.7,
      satisfaction: 91.5,
      keyMetrics: {
        newPatients: 623,
        procedures: 1156,
        averageStay: 4.8,
        occupancyRate: 78.3
      }
    },
    {
      department: language === 'ar' ? 'أمراض القلب' : 'Cardiology',
      patients: 1456,
      revenue: 2890000,
      expenses: 1967000,
      profitMargin: 31.9,
      growth: 11.5,
      efficiency: 89.7,
      satisfaction: 90.1,
      keyMetrics: {
        newPatients: 834,
        procedures: 1789,
        averageStay: 2.1,
        occupancyRate: 82.7
      }
    },
    {
      department: language === 'ar' ? 'الأطفال' : 'Pediatrics',
      patients: 2134,
      revenue: 2345000,
      expenses: 1678000,
      profitMargin: 28.4,
      growth: 6.8,
      efficiency: 86.3,
      satisfaction: 92.3,
      keyMetrics: {
        newPatients: 1345,
        procedures: 1890,
        averageStay: 1.8,
        occupancyRate: 75.6
      }
    },
    {
      department: language === 'ar' ? 'الأشعة' : 'Radiology',
      patients: 1890,
      revenue: 1950000,
      expenses: 1345000,
      profitMargin: 31.0,
      growth: 12.3,
      efficiency: 94.2,
      satisfaction: 87.8,
      keyMetrics: {
        newPatients: 756,
        procedures: 4567,
        averageStay: 0.2,
        occupancyRate: 88.9
      }
    }
  ], [language]);

  // Financial Highlights
  const financialHighlights: FinancialHighlight[] = useMemo(() => [
    {
      category: language === 'ar' ? 'الرواتب والأجور' : 'Salaries & Benefits',
      actual: 8450000,
      budget: 8200000,
      variance: 250000,
      percentageOfTotal: 34.5,
      trend: 3.0,
      priority: 'high'
    },
    {
      category: language === 'ar' ? 'المستلزمات الطبية' : 'Medical Supplies',
      actual: 4650000,
      budget: 5000000,
      variance: -350000,
      percentageOfTotal: 19.0,
      trend: -7.0,
      priority: 'medium'
    },
    {
      category: language === 'ar' ? 'المعدات والصيانة' : 'Equipment & Maintenance',
      actual: 2890000,
      budget: 2750000,
      variance: 140000,
      percentageOfTotal: 11.8,
      trend: 5.1,
      priority: 'medium'
    },
    {
      category: language === 'ar' ? 'الأدوية' : 'Pharmaceuticals',
      actual: 3450000,
      budget: 3600000,
      variance: -150000,
      percentageOfTotal: 14.1,
      trend: -4.2,
      priority: 'low'
    },
    {
      category: language === 'ar' ? 'المرافق والخدمات' : 'Utilities & Services',
      actual: 1890000,
      budget: 1800000,
      variance: 90000,
      percentageOfTotal: 7.7,
      trend: 5.0,
      priority: 'low'
    }
  ], [language]);

  // Quality Indicators
  const qualityIndicators: QualityIndicator[] = useMemo(() => [
    {
      indicator: language === 'ar' ? 'معدل الوفيات' : 'Mortality Rate',
      value: 1.2,
      benchmark: 1.5,
      status: 'excellent',
      trend: -0.2,
      impact: language === 'ar' ? 'أداء ممتاز في معدلات الوفيات' : 'Excellent performance in mortality rates'
    },
    {
      indicator: language === 'ar' ? 'معدل العدوى المكتسبة' : 'Hospital-Acquired Infection Rate',
      value: 2.1,
      benchmark: 2.5,
      status: 'good',
      trend: -0.3,
      impact: language === 'ar' ? 'تحسن في مكافحة العدوى' : 'Improvement in infection control'
    },
    {
      indicator: language === 'ar' ? 'معدل إعادة الإدخال' : 'Readmission Rate',
      value: 8.7,
      benchmark: 8.0,
      status: 'needs_improvement',
      trend: 0.4,
      impact: language === 'ar' ? 'يحتاج لتحسين في معدل إعادة الإدخال' : 'Needs improvement in readmission rates'
    },
    {
      indicator: language === 'ar' ? 'معدل السقوط' : 'Fall Rate',
      value: 1.8,
      benchmark: 2.0,
      status: 'good',
      trend: -0.1,
      impact: language === 'ar' ? 'أداء جيد في منع السقوط' : 'Good performance in fall prevention'
    },
    {
      indicator: language === 'ar' ? 'معدل رضا الأطباء' : 'Physician Satisfaction',
      value: 82.5,
      benchmark: 85.0,
      status: 'needs_improvement',
      trend: 1.2,
      impact: language === 'ar' ? 'تحسن طفيف في رضا الأطباء' : 'Slight improvement in physician satisfaction'
    }
  ], [language]);

  // Monthly comparison data
  const monthlyComparison = useMemo(() => [
    {
      month: language === 'ar' ? 'يناير' : 'Jan',
      revenue: 21000000,
      expenses: 15400000,
      patients: 11450,
      satisfaction: 86.2,
      profitMargin: 26.7
    },
    {
      month: language === 'ar' ? 'فبراير' : 'Feb',
      revenue: 22500000,
      expenses: 16200000,
      patients: 12234,
      satisfaction: 87.1,
      profitMargin: 28.0
    },
    {
      month: language === 'ar' ? 'مارس' : 'Mar',
      revenue: 21800000,
      expenses: 15800000,
      patients: 11890,
      satisfaction: 87.8,
      profitMargin: 27.5
    },
    {
      month: language === 'ar' ? 'أبريل' : 'Apr',
      revenue: 23500000,
      expenses: 17100000,
      patients: 12756,
      satisfaction: 88.4,
      profitMargin: 27.2
    },
    {
      month: language === 'ar' ? 'مايو' : 'May',
      revenue: 24500000,
      expenses: 18300000,
      patients: 12992,
      satisfaction: 88.9,
      profitMargin: 25.3
    }
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

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50 dark:bg-green-950/20';
      case 'good': return 'text-blue-600 bg-blue-50 dark:bg-blue-950/20';
      case 'warning': return 'text-orange-600 bg-orange-50 dark:bg-orange-950/20';
      case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-950/20';
      case 'needs_improvement': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20';
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 dark:bg-red-950/20';
      case 'medium': return 'text-orange-600 bg-orange-50 dark:bg-orange-950/20';
      case 'low': return 'text-green-600 bg-green-50 dark:bg-green-950/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20';
    }
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
              <span>
                {entry.name}: {entry.dataKey?.includes('Margin') || entry.dataKey?.includes('satisfaction') ? 
                  `${entry.value.toFixed(1)}%` : 
                  typeof entry.value === 'number' && entry.value > 1000 ?
                  formatCurrency(entry.value) :
                  entry.value.toLocaleString()
                }
              </span>
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
  const handleExport = (format: 'pdf' | 'excel' | 'powerpoint') => {
    console.log(`Exporting monthly report as ${format}`);
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
              <Calendar className="h-6 w-6" />
              {language === 'ar' ? 'التقرير المالي الشامل - مايو 2024' : 'Comprehensive Monthly Report - May 2024'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'ar' ? 'التقرير المالي الشامل الشهري' : 'Comprehensive monthly financial report'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="may2024">{language === 'ar' ? 'مايو 2024' : 'May 2024'}</SelectItem>
              <SelectItem value="apr2024">{language === 'ar' ? 'أبريل 2024' : 'April 2024'}</SelectItem>
              <SelectItem value="mar2024">{language === 'ar' ? 'مارس 2024' : 'March 2024'}</SelectItem>
            </SelectContent>
          </Select>

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

          <Select onValueChange={(value) => handleExport(value as any)}>
            <SelectTrigger className="w-32">
              <Download className="h-4 w-4 mr-2" />
              <SelectValue placeholder={language === 'ar' ? 'تصدير' : 'Export'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="powerpoint">PowerPoint</SelectItem>
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {language === 'ar' ? 'نظرة عامة' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              {language === 'ar' ? 'مالي' : 'Financial'}
            </TabsTrigger>
            <TabsTrigger value="operational" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              {language === 'ar' ? 'تشغيلي' : 'Operational'}
            </TabsTrigger>
            <TabsTrigger value="quality" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              {language === 'ar' ? 'الجودة' : 'Quality'}
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {language === 'ar' ? 'مقارنة' : 'Comparison'}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Executive Summary Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    {language === 'ar' ? 'الملخص التنفيذي' : 'Executive Summary'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'ar' ? 'أهم المؤشرات والنتائج للشهر الحالي' : 'Key metrics and results for the current month'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {executiveSummary.slice(0, 4).map((metric, index) => (
                      <motion.div
                        key={metric.metric}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="p-4 border rounded-lg hover:shadow-md transition-all duration-300"
                      >
                        <div className="space-y-3">
                          <div className={cn("flex items-center gap-3", isRTL ? "flex-row-reverse" : "")}>
                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${metric.color}15` }}>
                              <div style={{ color: metric.color }}>
                                {metric.icon}
                              </div>
                            </div>
                            <Badge className={getStatusColor(metric.status)}>
                              {language === 'ar' ? 
                                (metric.status === 'excellent' ? 'ممتاز' : 
                                 metric.status === 'good' ? 'جيد' : 
                                 metric.status === 'warning' ? 'تحذير' : 'حرج') :
                                metric.status
                              }
                            </Badge>
                          </div>
                          
                          <div className={isRTL ? "text-right" : ""}>
                            <h3 className="text-sm font-medium text-muted-foreground">{metric.metric}</h3>
                            <div className="flex items-baseline gap-2 mt-1">
                              <span className="text-xl font-bold">
                                {metric.unit === 'currency' ? 
                                  formatCurrency(metric.currentValue) : 
                                  metric.unit === 'percentage' ? 
                                  `${metric.currentValue}%` :
                                  metric.unit === 'days' ?
                                  `${metric.currentValue} ${language === 'ar' ? 'يوم' : 'days'}` :
                                  metric.currentValue.toLocaleString()
                                }
                              </span>
                              <div className={cn("flex items-center gap-1", 
                                metric.trend === 'up' ? 'text-green-600' : 
                                metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                              )}>
                                {metric.trend === 'up' ? (
                                  <ArrowUpRight className="h-3 w-3" />
                                ) : metric.trend === 'down' ? (
                                  <ArrowDownRight className="h-3 w-3" />
                                ) : (
                                  <div className="h-3 w-3" />
                                )}
                                <span className="text-xs">
                                  {Math.abs(((metric.currentValue - metric.previousValue) / metric.previousValue) * 100).toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                              <span>{language === 'ar' ? 'الهدف' : 'Target'}</span>
                              <span>
                                {((metric.currentValue / metric.target) * 100).toFixed(0)}%
                              </span>
                            </div>
                            <Progress 
                              value={(metric.currentValue / metric.target) * 100} 
                              className="h-1.5"
                            />
                          </div>
                          
                          <p className="text-xs text-muted-foreground">{metric.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Key Performance Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    {language === 'ar' ? 'لوحة الأداء الرئيسية' : 'Key Performance Dashboard'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={monthlyComparison}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="month" 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis 
                          yAxisId="left"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickFormatter={(value) => formatCurrency(value)}
                        />
                        <YAxis 
                          yAxisId="right"
                          orientation="right"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        
                        <Bar 
                          yAxisId="left"
                          dataKey="revenue" 
                          fill="#10b981" 
                          name={language === 'ar' ? 'الإيرادات' : 'Revenue'}
                          opacity={0.8}
                        />
                        <Bar 
                          yAxisId="left"
                          dataKey="expenses" 
                          fill="#ef4444" 
                          name={language === 'ar' ? 'المصروفات' : 'Expenses'}
                          opacity={0.8}
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="profitMargin" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          name={language === 'ar' ? 'هامش الربح' : 'Profit Margin'}
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="satisfaction" 
                          stroke="#8b5cf6" 
                          strokeWidth={3}
                          name={language === 'ar' ? 'رضا المرضى' : 'Patient Satisfaction'}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Monthly Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    {language === 'ar' ? 'أبرز أحداث الشهر' : 'Monthly Highlights'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className={cn("flex items-center gap-2 mb-2", isRTL ? "flex-row-reverse" : "")}>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold text-green-800 dark:text-green-200">
                          {language === 'ar' ? 'إنجازات مميزة' : 'Key Achievements'}
                        </h3>
                      </div>
                      <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
                        <li>• {language === 'ar' ? 'تجاوز هدف الإيرادات بنسبة 98%' : 'Achieved 98% of revenue target'}</li>
                        <li>• {language === 'ar' ? 'تحسن رضا المرضى إلى 88.9%' : 'Patient satisfaction improved to 88.9%'}</li>
                        <li>• {language === 'ar' ? 'انخفاض معدل دوران الموظفين' : 'Reduced staff turnover rate'}</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className={cn("flex items-center gap-2 mb-2", isRTL ? "flex-row-reverse" : "")}>
                        <Info className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                          {language === 'ar' ? 'مشاريع جديدة' : 'New Initiatives'}
                        </h3>
                      </div>
                      <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                        <li>• {language === 'ar' ? 'تطبيق نظام إدارة جديد' : 'Implemented new management system'}</li>
                        <li>• {language === 'ar' ? 'افتتاح وحدة عناية مركزة جديدة' : 'Opened new ICU unit'}</li>
                        <li>• {language === 'ar' ? 'برنامج تدريب متقدم للموظفين' : 'Advanced staff training program'}</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <div className={cn("flex items-center gap-2 mb-2", isRTL ? "flex-row-reverse" : "")}>
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        <h3 className="font-semibold text-orange-800 dark:text-orange-200">
                          {language === 'ar' ? 'نقاط التحسين' : 'Areas for Improvement'}
                        </h3>
                      </div>
                      <ul className="space-y-1 text-sm text-orange-700 dark:text-orange-300">
                        <li>• {language === 'ar' ? 'تحسين معدل إشغال الأسرة' : 'Improve bed occupancy rate'}</li>
                        <li>• {language === 'ar' ? 'تقليل أوقات الانتظار' : 'Reduce waiting times'}</li>
                        <li>• {language === 'ar' ? 'تحسين معدل إعادة الإدخال' : 'Improve readmission rates'}</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6">
            {/* Financial Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    {language === 'ar' ? 'الملخص المالي' : 'Financial Summary'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {executiveSummary.filter(metric => 
                      metric.metric.includes('Revenue') || 
                      metric.metric.includes('Profit') || 
                      metric.metric.includes('الإيرادات') || 
                      metric.metric.includes('الربح')
                    ).map((metric, index) => (
                      <motion.div
                        key={metric.metric}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="p-4 border rounded-lg"
                      >
                        <div className="space-y-2">
                          <div className={cn("flex items-center gap-2", isRTL ? "flex-row-reverse" : "")}>
                            <div style={{ color: metric.color }}>
                              {metric.icon}
                            </div>
                            <h3 className="text-sm font-medium">{metric.metric}</h3>
                          </div>
                          <div className="text-2xl font-bold">
                            {metric.unit === 'currency' ? 
                              formatCurrency(metric.currentValue) : 
                              `${metric.currentValue}%`
                            }
                          </div>
                          <div className={cn("flex items-center gap-1", 
                            metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                          )}>
                            {metric.trend === 'up' ? (
                              <ArrowUpRight className="h-4 w-4" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4" />
                            )}
                            <span className="text-sm">
                              {Math.abs(((metric.currentValue - metric.previousValue) / metric.previousValue) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Budget vs Actual */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {language === 'ar' ? 'الميزانية مقابل الفعلي' : 'Budget vs Actual'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {financialHighlights.map((item, index) => (
                      <motion.div
                        key={item.category}
                        initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="p-4 border rounded-lg"
                      >
                        <div className="space-y-3">
                          <div className={cn("flex items-center justify-between", isRTL ? "flex-row-reverse" : "")}>
                            <h3 className="font-semibold">{item.category}</h3>
                            <Badge className={getPriorityColor(item.priority)}>
                              {language === 'ar' ? 
                                (item.priority === 'high' ? 'عالي' : item.priority === 'medium' ? 'متوسط' : 'منخفض') :
                                item.priority
                              }
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">{language === 'ar' ? 'الفعلي:' : 'Actual:'}</span>
                              <div className="font-semibold">{formatCurrency(item.actual)}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">{language === 'ar' ? 'الميزانية:' : 'Budget:'}</span>
                              <div className="font-semibold">{formatCurrency(item.budget)}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">{language === 'ar' ? 'الانحراف:' : 'Variance:'}</span>
                              <div className={cn("font-semibold", item.variance > 0 ? 'text-red-600' : 'text-green-600')}>
                                {item.variance > 0 ? '+' : ''}{formatCurrency(item.variance)}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">{language === 'ar' ? '% من الإجمالي:' : '% of Total:'}</span>
                              <div className="font-semibold">{item.percentageOfTotal}%</div>
                            </div>
                          </div>
                          
                          <div className="pt-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                              <span>{language === 'ar' ? 'استخدام الميزانية' : 'Budget Utilization'}</span>
                              <span>{((item.actual / item.budget) * 100).toFixed(1)}%</span>
                            </div>
                            <Progress 
                              value={(item.actual / item.budget) * 100} 
                              className="h-2"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Operational Tab */}
          <TabsContent value="operational" className="space-y-6">
            {/* Department Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    {language === 'ar' ? 'أداء الأقسام' : 'Department Performance'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {departmentSummary.map((dept, index) => (
                        <motion.div
                          key={dept.department}
                          initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-6 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="space-y-4">
                            <div className={cn("flex items-center justify-between", isRTL ? "flex-row-reverse" : "")}>
                              <h3 className="text-lg font-semibold">{dept.department}</h3>
                              <div className="text-center">
                                <div className="text-xl font-bold text-green-600">{dept.profitMargin.toFixed(1)}%</div>
                                <div className="text-sm text-muted-foreground">{language === 'ar' ? 'هامش الربح' : 'Profit Margin'}</div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                                <div className="text-lg font-semibold text-blue-600">{dept.patients.toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground">{language === 'ar' ? 'المرضى' : 'Patients'}</div>
                              </div>
                              
                              <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                                <div className="text-lg font-semibold text-green-600">{formatCurrency(dept.revenue)}</div>
                                <div className="text-xs text-muted-foreground">{language === 'ar' ? 'الإيرادات' : 'Revenue'}</div>
                              </div>
                              
                              <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                                <div className="text-lg font-semibold text-purple-600">{dept.efficiency.toFixed(1)}%</div>
                                <div className="text-xs text-muted-foreground">{language === 'ar' ? 'الكفاءة' : 'Efficiency'}</div>
                              </div>
                              
                              <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                                <div className="text-lg font-semibold text-orange-600">{dept.satisfaction.toFixed(1)}%</div>
                                <div className="text-xs text-muted-foreground">{language === 'ar' ? 'الرضا' : 'Satisfaction'}</div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'مرضى جدد:' : 'New Patients:'}</span>
                                <span>{dept.keyMetrics.newPatients.toLocaleString()}</span>
                              </div>
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'إجراءات:' : 'Procedures:'}</span>
                                <span>{dept.keyMetrics.procedures.toLocaleString()}</span>
                              </div>
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'متوسط الإقامة:' : 'Avg Stay:'}</span>
                                <span>{dept.keyMetrics.averageStay} {language === 'ar' ? 'يوم' : 'days'}</span>
                              </div>
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'معدل الإشغال:' : 'Occupancy:'}</span>
                                <span>{dept.keyMetrics.occupancyRate}%</span>
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
          </TabsContent>

          {/* Quality Tab */}
          <TabsContent value="quality" className="space-y-6">
            {/* Quality Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    {language === 'ar' ? 'مؤشرات الجودة' : 'Quality Indicators'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {qualityIndicators.map((indicator, index) => (
                      <motion.div
                        key={indicator.indicator}
                        initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border rounded-lg"
                      >
                        <div className="space-y-3">
                          <div className={cn("flex items-center justify-between", isRTL ? "flex-row-reverse" : "")}>
                            <h3 className="font-semibold">{indicator.indicator}</h3>
                            <Badge className={getStatusColor(indicator.status)}>
                              {language === 'ar' ? 
                                (indicator.status === 'excellent' ? 'ممت��ز' : 
                                 indicator.status === 'good' ? 'جيد' : 
                                 indicator.status === 'needs_improvement' ? 'يحتاج تحسين' : 'حرج') :
                                indicator.status.replace('_', ' ')
                              }
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">{language === 'ar' ? 'القيمة الحالية:' : 'Current Value:'}</span>
                              <div className="font-semibold">{indicator.value}%</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">{language === 'ar' ? 'المعيار:' : 'Benchmark:'}</span>
                              <div className="font-semibold">{indicator.benchmark}%</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">{language === 'ar' ? 'الاتجاه:' : 'Trend:'}</span>
                              <div className={cn("font-semibold flex items-center gap-1", 
                                indicator.trend > 0 ? 'text-green-600' : 'text-red-600'
                              )}>
                                {indicator.trend > 0 ? (
                                  <ArrowUpRight className="h-3 w-3" />
                                ) : (
                                  <ArrowDownRight className="h-3 w-3" />
                                )}
                                {Math.abs(indicator.trend)}%
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                              <span>{language === 'ar' ? 'الأداء مقارنة بالمعيار' : 'Performance vs Benchmark'}</span>
                              <span>{((indicator.value / indicator.benchmark) * 100).toFixed(1)}%</span>
                            </div>
                            <Progress 
                              value={(indicator.value / indicator.benchmark) * 100} 
                              className="h-2"
                            />
                          </div>
                          
                          <p className="text-xs text-muted-foreground">{indicator.impact}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {language === 'ar' ? 'مقارنة الأداء على مدار 5 أشهر' : '5-Month Performance Comparison'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={monthlyComparison}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="month" 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis 
                          yAxisId="left"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickFormatter={(value) => formatCurrency(value)}
                        />
                        <YAxis 
                          yAxisId="right"
                          orientation="right"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey="revenue"
                          stackId="1"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.6}
                          name={language === 'ar' ? 'الإيرادات' : 'Revenue'}
                        />
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey="expenses"
                          stackId="2"
                          stroke="#ef4444"
                          fill="#ef4444"
                          fillOpacity={0.6}
                          name={language === 'ar' ? 'المصروفات' : 'Expenses'}
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="profitMargin" 
                          stroke="#3b82f6" 
                          strokeWidth={4}
                          name={language === 'ar' ? 'هامش الربح' : 'Profit Margin'}
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="satisfaction" 
                          stroke="#8b5cf6" 
                          strokeWidth={4}
                          strokeDasharray="5 5"
                          name={language === 'ar' ? 'رضا المرضى' : 'Patient Satisfaction'}
                        />
                      </ComposedChart>
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

export default MonthlyReport;