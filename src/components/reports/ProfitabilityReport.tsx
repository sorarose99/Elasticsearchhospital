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
  ComposedChart
} from 'recharts';
import { 
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
  Briefcase,
  Calculator,
  Award,
  Star,
  Percent,
  Activity
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';
import { cn } from '../ui/utils';

interface ProfitabilityMetric {
  id: string;
  name: string;
  current: number;
  previous: number;
  target: number;
  unit: 'currency' | 'percentage' | 'ratio';
  trend: 'up' | 'down' | 'stable';
  performance: 'excellent' | 'good' | 'average' | 'poor';
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface DepartmentProfitability {
  department: string;
  revenue: number;
  expenses: number;
  grossProfit: number;
  margin: number;
  growth: number;
  patientCount: number;
  revenuePerPatient: number;
  efficiency: number;
  ranking: number;
}

interface ServiceLineProfitability {
  service: string;
  revenue: number;
  directCosts: number;
  indirectCosts: number;
  grossMargin: number;
  netMargin: number;
  volume: number;
  unitPrice: number;
  roi: number;
}

interface ProfitabilityReportProps {
  onGoBack: () => void;
}

const ProfitabilityReport: React.FC<ProfitabilityReportProps> = ({ onGoBack }) => {
  const { t, language, isRTL } = useLanguage();
  const { effectiveTheme } = useTheme();

  // State management
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area' | 'composed'>('composed');
  const [viewMode, setViewMode] = useState<'summary' | 'departments' | 'services' | 'trends'>('summary');
  const [sortBy, setSortBy] = useState<'margin' | 'revenue' | 'growth'>('margin');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Key profitability metrics
  const profitabilityMetrics: ProfitabilityMetric[] = useMemo(() => [
    {
      id: 'grossMargin',
      name: language === 'ar' ? 'هامش الربح الإجمالي' : 'Gross Profit Margin',
      current: 31.4,
      previous: 28.7,
      target: 35.0,
      unit: 'percentage',
      trend: 'up',
      performance: 'good',
      icon: <Calculator className="h-5 w-5" />,
      color: '#10b981',
      description: language === 'ar' ? 'نسبة الربح الإجمالي من الإيرادات' : 'Gross profit as percentage of revenue'
    },
    {
      id: 'netMargin',
      name: language === 'ar' ? 'هامش الربح الصافي' : 'Net Profit Margin',
      current: 18.2,
      previous: 16.5,
      target: 20.0,
      unit: 'percentage',
      trend: 'up',
      performance: 'good',
      icon: <Target className="h-5 w-5" />,
      color: '#3b82f6',
      description: language === 'ar' ? 'نسبة الربح الصافي من الإيرادات' : 'Net profit as percentage of revenue'
    },
    {
      id: 'roi',
      name: language === 'ar' ? 'العائد على الاستثمار' : 'Return on Investment',
      current: 24.7,
      previous: 22.1,
      target: 25.0,
      unit: 'percentage',
      trend: 'up',
      performance: 'excellent',
      icon: <TrendingUp className="h-5 w-5" />,
      color: '#8b5cf6',
      description: language === 'ar' ? 'العائد على رأس المال المستثمر' : 'Return on invested capital'
    },
    {
      id: 'ebitda',
      name: language === 'ar' ? 'الأرباح قبل الفوائد والضرائب' : 'EBITDA Margin',
      current: 22.8,
      previous: 20.3,
      target: 25.0,
      unit: 'percentage',
      trend: 'up',
      performance: 'good',
      icon: <BarChart3 className="h-5 w-5" />,
      color: '#f59e0b',
      description: language === 'ar' ? 'الأرباح قبل الفوائد والضرائب والإهلاك' : 'Earnings before interest, taxes, depreciation'
    },
    {
      id: 'revenueGrowth',
      name: language === 'ar' ? 'نمو الإيرادات' : 'Revenue Growth Rate',
      current: 12.5,
      previous: 8.9,
      target: 15.0,
      unit: 'percentage',
      trend: 'up',
      performance: 'good',
      icon: <GrowthIcon className="h-5 w-5" />,
      color: '#06b6d4',
      description: language === 'ar' ? 'معدل نمو الإيرادات مقارنة بالفترة السابقة' : 'Revenue growth compared to previous period'
    },
    {
      id: 'costEfficiency',
      name: language === 'ar' ? 'كفاءة التكاليف' : 'Cost Efficiency',
      current: 76.2,
      previous: 78.5,
      target: 75.0,
      unit: 'percentage',
      trend: 'up',
      performance: 'good',
      icon: <Zap className="h-5 w-5" />,
      color: '#14b8a6',
      description: language === 'ar' ? 'نسبة التكاليف التشغيلية إلى الإيرادات' : 'Operating costs as percentage of revenue'
    }
  ], [language]);

  // Department profitability data
  const departmentProfitability: DepartmentProfitability[] = useMemo(() => [
    {
      department: language === 'ar' ? 'جراحة القلب' : 'Cardiac Surgery',
      revenue: 650000,
      expenses: 420000,
      grossProfit: 230000,
      margin: 35.4,
      growth: 18.7,
      patientCount: 89,
      revenuePerPatient: 7303,
      efficiency: 92.3,
      ranking: 1
    },
    {
      department: language === 'ar' ? 'الأشعة التداخلية' : 'Interventional Radiology',
      revenue: 480000,
      expenses: 285000,
      grossProfit: 195000,
      margin: 40.6,
      growth: 22.1,
      patientCount: 156,
      revenuePerPatient: 3077,
      efficiency: 89.7,
      ranking: 2
    },
    {
      department: language === 'ar' ? 'العيادات الخارجية' : 'Outpatient Clinics',
      revenue: 420000,
      expenses: 298000,
      grossProfit: 122000,
      margin: 29.0,
      growth: 8.5,
      patientCount: 1247,
      revenuePerPatient: 337,
      efficiency: 85.2,
      ranking: 3
    },
    {
      department: language === 'ar' ? 'الطوارئ' : 'Emergency Department',
      revenue: 380000,
      expenses: 285000,
      grossProfit: 95000,
      margin: 25.0,
      growth: 15.3,
      patientCount: 2156,
      revenuePerPatient: 176,
      efficiency: 78.9,
      ranking: 4
    },
    {
      department: language === 'ar' ? 'المختبر' : 'Laboratory',
      revenue: 280000,
      expenses: 198000,
      grossProfit: 82000,
      margin: 29.3,
      growth: 5.7,
      patientCount: 3247,
      revenuePerPatient: 86,
      efficiency: 88.1,
      ranking: 5
    },
    {
      department: language === 'ar' ? 'الصيدلية' : 'Pharmacy',
      revenue: 240000,
      expenses: 189000,
      grossProfit: 51000,
      margin: 21.3,
      growth: -2.1,
      patientCount: 4832,
      revenuePerPatient: 50,
      efficiency: 82.4,
      ranking: 6
    }
  ], [language]);

  // Service line profitability
  const serviceLineProfitability: ServiceLineProfitability[] = useMemo(() => [
    {
      service: language === 'ar' ? 'جراحة القلب المفتوح' : 'Open Heart Surgery',
      revenue: 450000,
      directCosts: 280000,
      indirectCosts: 85000,
      grossMargin: 37.8,
      netMargin: 18.9,
      volume: 45,
      unitPrice: 10000,
      roi: 23.4
    },
    {
      service: language === 'ar' ? 'القسطرة القلبية' : 'Cardiac Catheterization',
      revenue: 320000,
      directCosts: 185000,
      indirectCosts: 58000,
      grossMargin: 42.2,
      netMargin: 24.1,
      volume: 128,
      unitPrice: 2500,
      roi: 31.6
    },
    {
      service: language === 'ar' ? 'التصوير بالرنين المغناطيسي' : 'MRI Imaging',
      revenue: 280000,
      directCosts: 145000,
      indirectCosts: 75000,
      grossMargin: 48.2,
      netMargin: 21.4,
      volume: 560,
      unitPrice: 500,
      roi: 27.3
    },
    {
      service: language === 'ar' ? 'التحاليل المتخصصة' : 'Specialized Lab Tests',
      revenue: 180000,
      directCosts: 95000,
      indirectCosts: 35000,
      grossMargin: 47.2,
      netMargin: 27.8,
      volume: 1850,
      unitPrice: 97,
      roi: 38.5
    }
  ], [language]);

  // Profitability trends over time
  const profitabilityTrends = useMemo(() => [
    {
      month: language === 'ar' ? 'يناير' : 'Jan',
      revenue: 2100000,
      expenses: 1450000,
      grossProfit: 650000,
      netProfit: 520000,
      grossMargin: 31.0,
      netMargin: 24.8,
      roi: 22.1
    },
    {
      month: language === 'ar' ? 'فبراير' : 'Feb',
      revenue: 2250000,
      expenses: 1520000,
      grossProfit: 730000,
      netProfit: 580000,
      grossMargin: 32.4,
      netMargin: 25.8,
      roi: 23.5
    },
    {
      month: language === 'ar' ? 'مارس' : 'Mar',
      revenue: 2180000,
      expenses: 1480000,
      grossProfit: 700000,
      netProfit: 560000,
      grossMargin: 32.1,
      netMargin: 25.7,
      roi: 22.8
    },
    {
      month: language === 'ar' ? 'أبريل' : 'Apr',
      revenue: 2350000,
      expenses: 1610000,
      grossProfit: 740000,
      netProfit: 590000,
      grossMargin: 31.5,
      netMargin: 25.1,
      roi: 24.2
    },
    {
      month: language === 'ar' ? 'مايو' : 'May',
      revenue: 2450000,
      expenses: 1680000,
      grossProfit: 770000,
      netProfit: 620000,
      grossMargin: 31.4,
      netMargin: 25.3,
      roi: 24.7
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

  // Get performance color
  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-green-600 bg-green-50 dark:bg-green-950/20';
      case 'good': return 'text-blue-600 bg-blue-50 dark:bg-blue-950/20';
      case 'average': return 'text-orange-600 bg-orange-50 dark:bg-orange-950/20';
      case 'poor': return 'text-red-600 bg-red-50 dark:bg-red-950/20';
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
                {entry.name}: {entry.dataKey?.includes('Margin') || entry.dataKey?.includes('roi') ? 
                  `${entry.value.toFixed(1)}%` : 
                  formatCurrency(entry.value)
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
  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exporting profitability report as ${format}`);
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
              <TrendingUp className="h-6 w-6" />
              {language === 'ar' ? 'تحليل الربحية' : 'Profitability Analysis'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'ar' ? 'تحليل معدلات الربح والأداء المالي' : 'Analysis of profit margins and financial performance'}
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
              <SelectItem value="composed">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  {language === 'ar' ? 'مركب' : 'Composed'}
                </div>
              </SelectItem>
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
            <TabsTrigger value="departments" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              {language === 'ar' ? 'الأقسام' : 'Departments'}
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              {language === 'ar' ? 'الخدمات' : 'Services'}
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <GrowthIcon className="h-4 w-4" />
              {language === 'ar' ? 'الاتجاهات' : 'Trends'}
            </TabsTrigger>
          </TabsList>

          {/* Summary View */}
          <TabsContent value="summary" className="space-y-6">
            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profitabilityMetrics.map((metric, index) => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className={cn("flex items-center justify-between", isRTL ? "flex-row-reverse" : "")}>
                          <div className="p-3 rounded-full" style={{ backgroundColor: `${metric.color}15` }}>
                            <div style={{ color: metric.color }}>
                              {metric.icon}
                            </div>
                          </div>
                          <Badge className={getPerformanceColor(metric.performance)}>
                            {language === 'ar' ? 
                              (metric.performance === 'excellent' ? 'ممتاز' : 
                               metric.performance === 'good' ? 'جيد' : 
                               metric.performance === 'average' ? 'متوسط' : 'ضعيف') :
                              metric.performance
                            }
                          </Badge>
                        </div>
                        
                        <div className={isRTL ? "text-right" : ""}>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">{metric.name}</h3>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold">
                              {metric.unit === 'currency' ? 
                                formatCurrency(metric.current) : 
                                `${metric.current.toFixed(1)}%`
                              }
                            </span>
                            <div className={cn("flex items-center gap-1", 
                              metric.current > metric.previous ? 'text-green-600' : 
                              metric.current < metric.previous ? 'text-red-600' : 'text-gray-600'
                            )}>
                              {metric.current > metric.previous ? 
                                <ArrowUpRight className="h-4 w-4" /> : 
                                metric.current < metric.previous ? 
                                <ArrowDownRight className="h-4 w-4" /> : 
                                <div className="h-4 w-4" />
                              }
                              <span className="text-sm">
                                {Math.abs(((metric.current - metric.previous) / metric.previous) * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{language === 'ar' ? 'الهدف' : 'Target'}: {metric.target}%</span>
                            <span>{((metric.current / metric.target) * 100).toFixed(0)}%</span>
                          </div>
                          <Progress 
                            value={(metric.current / metric.target) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Profitability Overview Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {language === 'ar' ? 'نظرة عامة على الربحية' : 'Profitability Overview'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={profitabilityTrends}>
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
                          fill="#3b82f6" 
                          name={language === 'ar' ? 'الإيرادات' : 'Revenue'}
                          opacity={0.7}
                        />
                        <Bar 
                          yAxisId="left"
                          dataKey="expenses" 
                          fill="#ef4444" 
                          name={language === 'ar' ? 'المصروفات' : 'Expenses'}
                          opacity={0.7}
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="grossMargin" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          name={language === 'ar' ? 'هامش الربح الإجمالي' : 'Gross Margin'}
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="netMargin" 
                          stroke="#8b5cf6" 
                          strokeWidth={3}
                          name={language === 'ar' ? 'هامش الربح الصافي' : 'Net Margin'}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Departments View */}
          <TabsContent value="departments" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className={cn("flex items-center justify-between", isRTL ? "flex-row-reverse" : "")}>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      {language === 'ar' ? 'ربحية الأقسام' : 'Department Profitability'}
                    </CardTitle>
                    
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="margin">{language === 'ar' ? 'هامش الربح' : 'Margin'}</SelectItem>
                        <SelectItem value="revenue">{language === 'ar' ? 'الإيرادات' : 'Revenue'}</SelectItem>
                        <SelectItem value="growth">{language === 'ar' ? 'النمو' : 'Growth'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {departmentProfitability.map((dept, index) => (
                        <motion.div
                          key={dept.department}
                          initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-6 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="space-y-4">
                            <div className={cn("flex items-center justify-between", isRTL ? "flex-row-reverse" : "")}>
                              <div className={cn("flex items-center gap-4", isRTL ? "flex-row-reverse" : "")}>
                                <div className="p-3 bg-primary/10 rounded-full">
                                  <Building className="h-5 w-5 text-primary" />
                                </div>
                                <div className={isRTL ? "text-right" : ""}>
                                  <h3 className="text-lg font-semibold">{dept.department}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {language === 'ar' ? `الترتيب: ${dept.ranking}` : `Rank: ${dept.ranking}`}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{dept.margin.toFixed(1)}%</div>
                                <div className="text-sm text-muted-foreground">{language === 'ar' ? 'هامش الربح' : 'Profit Margin'}</div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className={cn("text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg", isRTL ? "text-right" : "")}>
                                <div className="text-lg font-semibold text-blue-600">{formatCurrency(dept.revenue)}</div>
                                <div className="text-xs text-muted-foreground">{language === 'ar' ? 'الإيرادات' : 'Revenue'}</div>
                              </div>
                              
                              <div className={cn("text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg", isRTL ? "text-right" : "")}>
                                <div className="text-lg font-semibold text-red-600">{formatCurrency(dept.expenses)}</div>
                                <div className="text-xs text-muted-foreground">{language === 'ar' ? 'المصروفات' : 'Expenses'}</div>
                              </div>
                              
                              <div className={cn("text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg", isRTL ? "text-right" : "")}>
                                <div className="text-lg font-semibold text-green-600">{formatCurrency(dept.grossProfit)}</div>
                                <div className="text-xs text-muted-foreground">{language === 'ar' ? 'الربح الإجمالي' : 'Gross Profit'}</div>
                              </div>
                              
                              <div className={cn("text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg", isRTL ? "text-right" : "")}>
                                <div className={cn("text-lg font-semibold", dept.growth > 0 ? 'text-green-600' : 'text-red-600')}>
                                  {dept.growth > 0 ? '+' : ''}{dept.growth.toFixed(1)}%
                                </div>
                                <div className="text-xs text-muted-foreground">{language === 'ar' ? 'النمو' : 'Growth'}</div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'عدد المرضى:' : 'Patients:'}</span>
                                <span className="font-medium">{dept.patientCount.toLocaleString()}</span>
                              </div>
                              
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'إيراد/مريض:' : 'Revenue/Patient:'}</span>
                                <span className="font-medium">{formatCurrency(dept.revenuePerPatient)}</span>
                              </div>
                              
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'الكفاءة:' : 'Efficiency:'}</span>
                                <span className="font-medium">{dept.efficiency.toFixed(1)}%</span>
                              </div>
                            </div>
                            
                            <div className="pt-2">
                              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                <span>{language === 'ar' ? 'الأداء مقارنة بالمتوسط' : 'Performance vs Average'}</span>
                                <span>{dept.efficiency.toFixed(1)}%</span>
                              </div>
                              <Progress 
                                value={dept.efficiency} 
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

          {/* Services View */}
          <TabsContent value="services" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    {language === 'ar' ? 'ربحية خطوط الخدمة' : 'Service Line Profitability'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {serviceLineProfitability.map((service, index) => (
                      <motion.div
                        key={service.service}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 border rounded-lg hover:shadow-md transition-all duration-300"
                      >
                        <div className="space-y-4">
                          <div className={cn("flex items-center justify-between", isRTL ? "flex-row-reverse" : "")}>
                            <h3 className="text-lg font-semibold">{service.service}</h3>
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              ROI: {service.roi.toFixed(1)}%
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className={cn("space-y-2", isRTL ? "text-right" : "")}>
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'الإيرادات:' : 'Revenue:'}</span>
                                <span className="font-medium">{formatCurrency(service.revenue)}</span>
                              </div>
                              
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'التكاليف المباشرة:' : 'Direct Costs:'}</span>
                                <span className="font-medium">{formatCurrency(service.directCosts)}</span>
                              </div>
                              
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'التكاليف غير المباشرة:' : 'Indirect Costs:'}</span>
                                <span className="font-medium">{formatCurrency(service.indirectCosts)}</span>
                              </div>
                            </div>
                            
                            <div className={cn("space-y-2", isRTL ? "text-right" : "")}>
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'الحجم:' : 'Volume:'}</span>
                                <span className="font-medium">{service.volume.toLocaleString()}</span>
                              </div>
                              
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'سعر الوحدة:' : 'Unit Price:'}</span>
                                <span className="font-medium">{formatCurrency(service.unitPrice)}</span>
                              </div>
                              
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'الهامش الإجمالي:' : 'Gross Margin:'}</span>
                                <span className="font-medium text-green-600">{service.grossMargin.toFixed(1)}%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-3 space-y-3">
                            <div>
                              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                <span>{language === 'ar' ? 'الهامش الإجمالي' : 'Gross Margin'}</span>
                                <span>{service.grossMargin.toFixed(1)}%</span>
                              </div>
                              <Progress 
                                value={service.grossMargin} 
                                className="h-2"
                              />
                            </div>
                            
                            <div>
                              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                <span>{language === 'ar' ? 'الهامش الصافي' : 'Net Margin'}</span>
                                <span>{service.netMargin.toFixed(1)}%</span>
                              </div>
                              <Progress 
                                value={service.netMargin} 
                                className="h-2"
                              />
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
                    {language === 'ar' ? 'اتجاهات الربحية' : 'Profitability Trends'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={profitabilityTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="month" 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="grossMargin" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          name={language === 'ar' ? 'هامش الربح الإجمالي' : 'Gross Margin'}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="netMargin" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          name={language === 'ar' ? 'هامش الربح الصافي' : 'Net Margin'}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="roi" 
                          stroke="#8b5cf6" 
                          strokeWidth={3}
                          name={language === 'ar' ? 'العائد على الاستثمار' : 'ROI'}
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

export default ProfitabilityReport;