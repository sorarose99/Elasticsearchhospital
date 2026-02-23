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
  Users, 
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
  Pill
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';
import { cn } from '../ui/utils';

interface PatientDemographics {
  ageGroup: string;
  maleCount: number;
  femaleCount: number;
  totalCount: number;
  percentage: number;
  averageRevenue: number;
  totalRevenue: number;
  averageCost: number;
  totalCost: number;
  profitMargin: number;
}

interface PatientType {
  type: string;
  count: number;
  percentage: number;
  revenue: number;
  averageRevenue: number;
  visits: number;
  averageVisits: number;
  cost: number;
  profitability: number;
  icon: React.ReactNode;
  color: string;
}

interface DepartmentPatients {
  department: string;
  patientCount: number;
  newPatients: number;
  returningPatients: number;
  revenue: number;
  cost: number;
  averageRevenuePerPatient: number;
  averageCostPerPatient: number;
  profitMargin: number;
  visitFrequency: number;
  satisfaction: number;
  waitTime: number;
}

interface PatientConditions {
  condition: string;
  patientCount: number;
  percentage: number;
  averageTreatmentCost: number;
  averageRevenue: number;
  treatmentDuration: number;
  recurringRate: number;
  specialty: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface PatientsReportProps {
  onGoBack: () => void;
}

const PatientsReport: React.FC<PatientsReportProps> = ({ onGoBack }) => {
  const { t, language, isRTL } = useLanguage();
  const { effectiveTheme } = useTheme();

  // State management
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedPatientType, setSelectedPatientType] = useState('all');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area' | 'pie'>('composed');
  const [viewMode, setViewMode] = useState<'summary' | 'demographics' | 'departments' | 'conditions' | 'trends'>('summary');
  const [sortBy, setSortBy] = useState<'count' | 'revenue' | 'profit' | 'name'>('count');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Patient demographics data
  const patientDemographics: PatientDemographics[] = useMemo(() => [
    {
      ageGroup: '0-18',
      maleCount: 1247,
      femaleCount: 1156,
      totalCount: 2403,
      percentage: 18.5,
      averageRevenue: 847,
      totalRevenue: 2035641,
      averageCost: 623,
      totalCost: 1497069,
      profitMargin: 26.4
    },
    {
      ageGroup: '19-35',
      maleCount: 1834,
      femaleCount: 2156,
      totalCount: 3990,
      percentage: 30.8,
      averageRevenue: 1245,
      totalRevenue: 4967550,
      averageCost: 892,
      totalCost: 3559080,
      profitMargin: 28.4
    },
    {
      ageGroup: '36-50',
      maleCount: 1756,
      femaleCount: 1923,
      totalCount: 3679,
      percentage: 28.4,
      averageRevenue: 1647,
      totalRevenue: 6060913,
      averageCost: 1156,
      totalCost: 4252924,
      profitMargin: 29.8
    },
    {
      ageGroup: '51-65',
      maleCount: 1423,
      femaleCount: 1298,
      totalCount: 2721,
      percentage: 21.0,
      averageRevenue: 2134,
      totalRevenue: 5806614,
      averageCost: 1534,
      totalCost: 4174014,
      profitMargin: 28.1
    },
    {
      ageGroup: '65+',
      maleCount: 89,
      femaleCount: 78,
      totalCount: 167,
      percentage: 1.3,
      averageRevenue: 3245,
      totalRevenue: 541915,
      averageCost: 2456,
      totalCost: 410152,
      profitMargin: 24.3
    }
  ], [language]);

  // Patient types data
  const patientTypes: PatientType[] = useMemo(() => [
    {
      type: language === 'ar' ? 'مرضى خارجيون' : 'Outpatients',
      count: 8947,
      percentage: 68.9,
      revenue: 12450000,
      averageRevenue: 1391,
      visits: 15234,
      averageVisits: 1.7,
      cost: 8930000,
      profitability: 28.3,
      icon: <Users className="h-5 w-5" />,
      color: '#3b82f6'
    },
    {
      type: language === 'ar' ? 'مرضى داخليون' : 'Inpatients',
      count: 2847,
      percentage: 21.9,
      revenue: 8950000,
      averageRevenue: 3144,
      visits: 3245,
      averageVisits: 1.1,
      cost: 6780000,
      profitability: 24.2,
      icon: <Building className="h-5 w-5" />,
      color: '#10b981'
    },
    {
      type: language === 'ar' ? 'حالات طوارئ' : 'Emergency',
      count: 1198,
      percentage: 9.2,
      visits: 1847,
      averageVisits: 1.5,
      revenue: 2850000,
      averageRevenue: 2379,
      cost: 2340000,
      profitability: 17.9,
      icon: <AlertCircle className="h-5 w-5" />,
      color: '#ef4444'
    }
  ], [language]);

  // Department patients data
  const departmentPatients: DepartmentPatients[] = useMemo(() => [
    {
      department: language === 'ar' ? 'الطب الباطني' : 'Internal Medicine',
      patientCount: 3247,
      newPatients: 1245,
      returningPatients: 2002,
      revenue: 4850000,
      cost: 3420000,
      averageRevenuePerPatient: 1493,
      averageCostPerPatient: 1053,
      profitMargin: 29.5,
      visitFrequency: 2.3,
      satisfaction: 87.2,
      waitTime: 25
    },
    {
      department: language === 'ar' ? 'جراحة عامة' : 'General Surgery',
      patientCount: 847,
      newPatients: 623,
      returningPatients: 224,
      revenue: 3450000,
      cost: 2567000,
      averageRevenuePerPatient: 4071,
      averageCostPerPatient: 3030,
      profitMargin: 25.6,
      visitFrequency: 1.4,
      satisfaction: 91.5,
      waitTime: 45
    },
    {
      department: language === 'ar' ? 'أمراض القلب' : 'Cardiology',
      patientCount: 1456,
      newPatients: 834,
      returningPatients: 622,
      revenue: 2890000,
      cost: 1967000,
      averageRevenuePerPatient: 1985,
      averageCostPerPatient: 1351,
      profitMargin: 31.9,
      visitFrequency: 1.8,
      satisfaction: 89.7,
      waitTime: 32
    },
    {
      department: language === 'ar' ? 'الأطفال' : 'Pediatrics',
      patientCount: 2134,
      newPatients: 1345,
      returningPatients: 789,
      revenue: 2345000,
      cost: 1678000,
      averageRevenuePerPatient: 1099,
      averageCostPerPatient: 786,
      profitMargin: 28.4,
      visitFrequency: 2.1,
      satisfaction: 92.3,
      waitTime: 18
    },
    {
      department: language === 'ar' ? 'النساء والولادة' : 'Obstetrics & Gynecology',
      patientCount: 1823,
      newPatients: 1234,
      returningPatients: 589,
      revenue: 2150000,
      cost: 1456000,
      averageRevenuePerPatient: 1179,
      averageCostPerPatient: 799,
      profitMargin: 32.3,
      visitFrequency: 2.5,
      satisfaction: 88.9,
      waitTime: 28
    },
    {
      department: language === 'ar' ? 'العظام' : 'Orthopedics',
      patientCount: 987,
      newPatients: 756,
      returningPatients: 231,
      revenue: 1890000,
      cost: 1345000,
      averageRevenuePerPatient: 1915,
      averageCostPerPatient: 1363,
      profitMargin: 28.8,
      visitFrequency: 1.6,
      satisfaction: 86.4,
      waitTime: 35
    }
  ], [language]);

  // Patient conditions data
  const patientConditions: PatientConditions[] = useMemo(() => [
    {
      condition: language === 'ar' ? 'أمراض القلب والأوعية الدموية' : 'Cardiovascular Disease',
      patientCount: 1456,
      percentage: 11.2,
      averageTreatmentCost: 3245,
      averageRevenue: 4568,
      treatmentDuration: 65,
      recurringRate: 78.4,
      specialty: language === 'ar' ? 'أمراض القلب' : 'Cardiology',
      severity: 'high'
    },
    {
      condition: language === 'ar' ? 'السكري' : 'Diabetes',
      patientCount: 1234,
      percentage: 9.5,
      averageTreatmentCost: 1567,
      averageRevenue: 2134,
      treatmentDuration: 90,
      recurringRate: 92.3,
      specialty: language === 'ar' ? 'الباطنة' : 'Internal Medicine',
      severity: 'medium'
    },
    {
      condition: language === 'ar' ? 'ارتفاع ضغط الدم' : 'Hypertension',
      patientCount: 1089,
      percentage: 8.4,
      averageTreatmentCost: 987,
      averageRevenue: 1345,
      treatmentDuration: 120,
      recurringRate: 89.6,
      specialty: language === 'ar' ? 'الباطنة' : 'Internal Medicine',
      severity: 'medium'
    },
    {
      condition: language === 'ar' ? 'أمراض الجهاز التنفسي' : 'Respiratory Diseases',
      patientCount: 967,
      percentage: 7.4,
      averageTreatmentCost: 1234,
      averageRevenue: 1789,
      treatmentDuration: 45,
      recurringRate: 45.7,
      specialty: language === 'ar' ? 'الصدر' : 'Pulmonology',
      severity: 'medium'
    },
    {
      condition: language === 'ar' ? 'أمراض الكلى' : 'Kidney Disease',
      patientCount: 834,
      percentage: 6.4,
      averageTreatmentCost: 2789,
      averageRevenue: 3567,
      treatmentDuration: 180,
      recurringRate: 87.2,
      specialty: language === 'ar' ? 'الكلى' : 'Nephrology',
      severity: 'high'
    },
    {
      condition: language === 'ar' ? 'الإصابات والكسور' : 'Injuries & Fractures',
      patientCount: 756,
      percentage: 5.8,
      averageTreatmentCost: 3456,
      averageRevenue: 4789,
      treatmentDuration: 35,
      recurringRate: 12.4,
      specialty: language === 'ar' ? 'العظام' : 'Orthopedics',
      severity: 'medium'
    },
    {
      condition: language === 'ar' ? 'أمراض الجهاز الهضمي' : 'Gastrointestinal Disorders',
      patientCount: 687,
      percentage: 5.3,
      averageTreatmentCost: 1678,
      averageRevenue: 2234,
      treatmentDuration: 28,
      recurringRate: 34.6,
      specialty: language === 'ar' ? 'الجهاز الهضمي' : 'Gastroenterology',
      severity: 'low'
    },
    {
      condition: language === 'ar' ? 'أمراض الأعصاب' : 'Neurological Disorders',
      patientCount: 623,
      percentage: 4.8,
      averageTreatmentCost: 4567,
      averageRevenue: 6234,
      treatmentDuration: 120,
      recurringRate: 76.8,
      specialty: language === 'ar' ? 'الأعصاب' : 'Neurology',
      severity: 'high'
    }
  ], [language]);

  // Monthly patient trends
  const patientTrends = useMemo(() => [
    {
      month: language === 'ar' ? 'يناير' : 'Jan',
      totalPatients: 11450,
      newPatients: 3245,
      returningPatients: 8205,
      outpatients: 7890,
      inpatients: 2456,
      emergency: 1104,
      revenue: 18450000,
      cost: 13240000,
      satisfaction: 86.2,
      waitTime: 28
    },
    {
      month: language === 'ar' ? 'فبراير' : 'Feb',
      totalPatients: 12234,
      newPatients: 3567,
      returningPatients: 8667,
      outpatients: 8456,
      inpatients: 2634,
      emergency: 1144,
      revenue: 19650000,
      cost: 14120000,
      satisfaction: 87.1,
      waitTime: 26
    },
    {
      month: language === 'ar' ? 'مارس' : 'Mar',
      totalPatients: 11890,
      newPatients: 3234,
      returningPatients: 8656,
      outpatients: 8234,
      inpatients: 2567,
      emergency: 1089,
      revenue: 19120000,
      cost: 13780000,
      satisfaction: 87.8,
      waitTime: 27
    },
    {
      month: language === 'ar' ? 'أبريل' : 'Apr',
      totalPatients: 12756,
      newPatients: 3789,
      returningPatients: 8967,
      outpatients: 8834,
      inpatients: 2734,
      emergency: 1188,
      revenue: 20450000,
      cost: 14690000,
      satisfaction: 88.4,
      waitTime: 25
    },
    {
      month: language === 'ar' ? 'مايو' : 'May',
      totalPatients: 12992,
      newPatients: 3894,
      returningPatients: 9098,
      outpatients: 8947,
      inpatients: 2847,
      emergency: 1198,
      revenue: 21150000,
      cost: 15230000,
      satisfaction: 88.9,
      waitTime: 24
    }
  ], [language]);

  // Calculate summary metrics
  const totalPatients = patientTypes.reduce((sum, type) => sum + type.count, 0);
  const totalRevenue = patientTypes.reduce((sum, type) => sum + type.revenue, 0);
  const totalCosts = patientTypes.reduce((sum, type) => sum + type.cost, 0);
  const overallProfitability = ((totalRevenue - totalCosts) / totalRevenue) * 100;
  const averageRevenuePerPatient = totalRevenue / totalPatients;

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

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-950/20';
      case 'high': return 'text-orange-600 bg-orange-50 dark:bg-orange-950/20';
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20';
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
                {entry.name}: {entry.dataKey?.includes('Rate') || entry.dataKey?.includes('satisfaction') ? 
                  `${entry.value.toFixed(1)}%` : 
                  entry.dataKey?.includes('Time') || entry.dataKey?.includes('waitTime') ?
                  `${entry.value} ${language === 'ar' ? 'دقيقة' : 'min'}` :
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
  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exporting patients report as ${format}`);
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
              <Users className="h-6 w-6" />
              {language === 'ar' ? 'تقرير المرضى' : 'Patients Report'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'ar' ? 'تحليل إيرادات وتكاليف المرضى' : 'Patient revenue and cost analysis'}
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {language === 'ar' ? 'ملخص' : 'Summary'}
            </TabsTrigger>
            <TabsTrigger value="demographics" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {language === 'ar' ? 'التركيبة السكانية' : 'Demographics'}
            </TabsTrigger>
            <TabsTrigger value="departments" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              {language === 'ar' ? 'الأقسام' : 'Departments'}
            </TabsTrigger>
            <TabsTrigger value="conditions" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              {language === 'ar' ? 'الحالات المرضية' : 'Conditions'}
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
                          {language === 'ar' ? 'إجمالي المرضى' : 'Total Patients'}
                        </p>
                        <p className="text-2xl font-bold">{totalPatients.toLocaleString()}</p>
                        <div className="flex items-center gap-1 text-blue-600">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm">+13.5%</span>
                        </div>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-full">
                        <Users className="h-6 w-6 text-blue-600" />
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
                          {language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}
                        </p>
                        <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm">+18.7%</span>
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
                transition={{ delay: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className={cn("flex items-center justify-between", isRTL ? "flex-row-reverse" : "")}>
                      <div className={isRTL ? "text-right" : ""}>
                        <p className="text-sm text-muted-foreground mb-1">
                          {language === 'ar' ? 'متوسط الإيراد للمريض' : 'Avg Revenue/Patient'}
                        </p>
                        <p className="text-2xl font-bold">{formatCurrency(averageRevenuePerPatient)}</p>
                        <div className="flex items-center gap-1 text-purple-600">
                          <Target className="h-4 w-4" />
                          <span className="text-sm">+4.2%</span>
                        </div>
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-full">
                        <Calculator className="h-6 w-6 text-purple-600" />
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
                          {language === 'ar' ? 'هامش الربح الإجمالي' : 'Overall Profitability'}
                        </p>
                        <p className="text-2xl font-bold">{overallProfitability.toFixed(1)}%</p>
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm">+2.8%</span>
                        </div>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-full">
                        <Award className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Patient Types Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    {language === 'ar' ? 'توزيع أنواع المرضى' : 'Patient Types Distribution'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {patientTypes.map((type, index) => (
                      <motion.div
                        key={type.type}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="p-6 border rounded-lg hover:shadow-md transition-all duration-300"
                      >
                        <div className="space-y-4">
                          <div className={cn("flex items-center gap-3", isRTL ? "flex-row-reverse" : "")}>
                            <div className="p-3 rounded-full" style={{ backgroundColor: `${type.color}15` }}>
                              <div style={{ color: type.color }}>
                                {type.icon}
                              </div>
                            </div>
                            <div className={isRTL ? "text-right" : ""}>
                              <h3 className="text-lg font-semibold">{type.type}</h3>
                              <p className="text-sm text-muted-foreground">{type.percentage}% of total</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className={cn("space-y-2", isRTL ? "text-right" : "")}>
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'العدد:' : 'Count:'}</span>
                                <span className="font-medium">{type.count.toLocaleString()}</span>
                              </div>
                              
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'الزيارات:' : 'Visits:'}</span>
                                <span className="font-medium">{type.visits.toLocaleString()}</span>
                              </div>
                              
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'متوسط/مريض:' : 'Avg/Patient:'}</span>
                                <span className="font-medium">{type.averageVisits}</span>
                              </div>
                            </div>
                            
                            <div className={cn("space-y-2", isRTL ? "text-right" : "")}>
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'الإيرادات:' : 'Revenue:'}</span>
                                <span className="font-medium">{formatCurrency(type.revenue)}</span>
                              </div>
                              
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'متوسط الإيراد:' : 'Avg Revenue:'}</span>
                                <span className="font-medium">{formatCurrency(type.averageRevenue)}</span>
                              </div>
                              
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'الربحية:' : 'Profitability:'}</span>
                                <span className="font-medium text-green-600">{type.profitability.toFixed(1)}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Revenue by Patient Type Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {language === 'ar' ? 'الإيرادات حسب نوع المريض' : 'Revenue by Patient Type'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={patientTypes}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="type" 
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
                          dataKey="revenue" 
                          name={language === 'ar' ? 'الإيرادات' : 'Revenue'}
                          radius={[4, 4, 0, 0]}
                        >
                          {patientTypes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Demographics View */}
          <TabsContent value="demographics" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {language === 'ar' ? 'التركيبة السكانية للمرضى' : 'Patient Demographics'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {patientDemographics.map((demo, index) => (
                      <motion.div
                        key={demo.ageGroup}
                        initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="space-y-4">
                          <div className={cn("flex items-center justify-between", isRTL ? "flex-row-reverse" : "")}>
                            <div className={cn("flex items-center gap-4", isRTL ? "flex-row-reverse" : "")}>
                              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-full">
                                <Users className="h-6 w-6 text-blue-600" />
                              </div>
                              <div className={isRTL ? "text-right" : ""}>
                                <h3 className="text-lg font-semibold">
                                  {language === 'ar' ? `الفئة العمرية: ${demo.ageGroup}` : `Age Group: ${demo.ageGroup}`}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {demo.percentage}% {language === 'ar' ? 'من إجمالي المرضى' : 'of total patients'}
                                </p>
                              </div>
                            </div>
                            
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">{demo.profitMargin.toFixed(1)}%</div>
                              <div className="text-sm text-muted-foreground">{language === 'ar' ? 'هامش الربح' : 'Profit Margin'}</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className={cn("text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg", isRTL ? "text-right" : "")}>
                              <div className="text-lg font-semibold text-blue-600">{demo.totalCount.toLocaleString()}</div>
                              <div className="text-xs text-muted-foreground">{language === 'ar' ? 'إجمالي المرضى' : 'Total Patients'}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {language === 'ar' ? `ذكور: ${demo.maleCount} | إناث: ${demo.femaleCount}` : `M: ${demo.maleCount} | F: ${demo.femaleCount}`}
                              </div>
                            </div>
                            
                            <div className={cn("text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg", isRTL ? "text-right" : "")}>
                              <div className="text-lg font-semibold text-green-600">{formatCurrency(demo.totalRevenue)}</div>
                              <div className="text-xs text-muted-foreground">{language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {language === 'ar' ? `متوسط: ${formatCurrency(demo.averageRevenue)}` : `Avg: ${formatCurrency(demo.averageRevenue)}`}
                              </div>
                            </div>
                            
                            <div className={cn("text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg", isRTL ? "text-right" : "")}>
                              <div className="text-lg font-semibold text-red-600">{formatCurrency(demo.totalCost)}</div>
                              <div className="text-xs text-muted-foreground">{language === 'ar' ? 'إجمالي التكاليف' : 'Total Costs'}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {language === 'ar' ? `متوسط: ${formatCurrency(demo.averageCost)}` : `Avg: ${formatCurrency(demo.averageCost)}`}
                              </div>
                            </div>
                            
                            <div className={cn("text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg", isRTL ? "text-right" : "")}>
                              <div className="text-lg font-semibold text-purple-600">{formatCurrency(demo.totalRevenue - demo.totalCost)}</div>
                              <div className="text-xs text-muted-foreground">{language === 'ar' ? 'صافي الربح' : 'Net Profit'}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {language === 'ar' ? `متوسط: ${formatCurrency(demo.averageRevenue - demo.averageCost)}` : `Avg: ${formatCurrency(demo.averageRevenue - demo.averageCost)}`}
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                              <span>{language === 'ar' ? 'الأداء مقارنة بالمتوسط' : 'Performance vs Average'}</span>
                              <span>{demo.profitMargin.toFixed(1)}%</span>
                            </div>
                            <Progress 
                              value={demo.profitMargin > 0 ? Math.min(demo.profitMargin * 2, 100) : 0} 
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

          {/* Departments View */}
          <TabsContent value="departments" className="space-y-6">
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
                      {departmentPatients.map((dept, index) => (
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
                                  <Stethoscope className="h-5 w-5 text-primary" />
                                </div>
                                <div className={isRTL ? "text-right" : ""}>
                                  <h3 className="text-lg font-semibold">{dept.department}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {dept.patientCount.toLocaleString()} {language === 'ar' ? 'مريض' : 'patients'}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{dept.profitMargin.toFixed(1)}%</div>
                                <div className="text-sm text-muted-foreground">{language === 'ar' ? 'هامش الربح' : 'Profit Margin'}</div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div className={cn("space-y-2", isRTL ? "text-right" : "")}>
                                <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                  <span className="text-muted-foreground">{language === 'ar' ? 'مرضى جدد:' : 'New Patients:'}</span>
                                  <span className="font-medium text-blue-600">{dept.newPatients.toLocaleString()}</span>
                                </div>
                                
                                <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                  <span className="text-muted-foreground">{language === 'ar' ? 'مرضى عائدون:' : 'Returning:'}</span>
                                  <span className="font-medium text-green-600">{dept.returningPatients.toLocaleString()}</span>
                                </div>
                              </div>
                              
                              <div className={cn("space-y-2", isRTL ? "text-right" : "")}>
                                <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                  <span className="text-muted-foreground">{language === 'ar' ? 'الإيرادات:' : 'Revenue:'}</span>
                                  <span className="font-medium">{formatCurrency(dept.revenue)}</span>
                                </div>
                                
                                <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                  <span className="text-muted-foreground">{language === 'ar' ? 'التكاليف:' : 'Costs:'}</span>
                                  <span className="font-medium">{formatCurrency(dept.cost)}</span>
                                </div>
                              </div>
                              
                              <div className={cn("space-y-2", isRTL ? "text-right" : "")}>
                                <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                  <span className="text-muted-foreground">{language === 'ar' ? 'متوسط إيراد/مريض:' : 'Avg Revenue/Patient:'}</span>
                                  <span className="font-medium">{formatCurrency(dept.averageRevenuePerPatient)}</span>
                                </div>
                                
                                <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                  <span className="text-muted-foreground">{language === 'ar' ? 'متوسط تكلفة/مريض:' : 'Avg Cost/Patient:'}</span>
                                  <span className="font-medium">{formatCurrency(dept.averageCostPerPatient)}</span>
                                </div>
                              </div>
                              
                              <div className={cn("space-y-2", isRTL ? "text-right" : "")}>
                                <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                  <span className="text-muted-foreground">{language === 'ar' ? 'تكرار الزيارة:' : 'Visit Frequency:'}</span>
                                  <span className="font-medium">{dept.visitFrequency}</span>
                                </div>
                                
                                <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                  <span className="text-muted-foreground">{language === 'ar' ? 'الرضا:' : 'Satisfaction:'}</span>
                                  <span className="font-medium text-green-600">{dept.satisfaction}%</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="pt-2 space-y-2">
                              <div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                  <span>{language === 'ar' ? 'مستوى الرضا' : 'Satisfaction Level'}</span>
                                  <span>{dept.satisfaction.toFixed(1)}%</span>
                                </div>
                                <Progress 
                                  value={dept.satisfaction} 
                                  className="h-2"
                                />
                              </div>
                              
                              <div className={cn("flex justify-between text-xs", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'متوسط وقت الانتظار:' : 'Avg Wait Time:'}</span>
                                <span>{dept.waitTime} {language === 'ar' ? 'دقيقة' : 'minutes'}</span>
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

          {/* Conditions View */}
          <TabsContent value="conditions" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    {language === 'ar' ? 'الحالات المرضية الأكثر شيوعاً' : 'Most Common Medical Conditions'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {patientConditions.map((condition, index) => (
                      <motion.div
                        key={condition.condition}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 border rounded-lg hover:shadow-md transition-all duration-300"
                      >
                        <div className="space-y-4">
                          <div className={cn("flex items-center justify-between", isRTL ? "flex-row-reverse" : "")}>
                            <div className={isRTL ? "text-right" : ""}>
                              <h3 className="text-lg font-semibold">{condition.condition}</h3>
                              <p className="text-sm text-muted-foreground">{condition.specialty}</p>
                            </div>
                            <Badge className={getSeverityColor(condition.severity)}>
                              {language === 'ar' ? 
                                (condition.severity === 'critical' ? 'خطير' : condition.severity === 'high' ? 'عالي' : condition.severity === 'medium' ? 'متوسط' : 'منخفض') :
                                condition.severity
                              }
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className={cn("space-y-2", isRTL ? "text-right" : "")}>
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'عدد المرضى:' : 'Patient Count:'}</span>
                                <span className="font-medium">{condition.patientCount.toLocaleString()}</span>
                              </div>
                              
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'النسبة المئوية:' : 'Percentage:'}</span>
                                <span className="font-medium">{condition.percentage}%</span>
                              </div>
                              
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'معدل العودة:' : 'Recurring Rate:'}</span>
                                <span className="font-medium text-orange-600">{condition.recurringRate}%</span>
                              </div>
                            </div>
                            
                            <div className={cn("space-y-2", isRTL ? "text-right" : "")}>
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'متوسط التكلفة:' : 'Avg Treatment Cost:'}</span>
                                <span className="font-medium">{formatCurrency(condition.averageTreatmentCost)}</span>
                              </div>
                              
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'متوسط الإيراد:' : 'Avg Revenue:'}</span>
                                <span className="font-medium">{formatCurrency(condition.averageRevenue)}</span>
                              </div>
                              
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'مدة العلاج:' : 'Treatment Duration:'}</span>
                                <span className="font-medium">{condition.treatmentDuration} {language === 'ar' ? 'يوم' : 'days'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                              <span>{language === 'ar' ? 'هامش الربح' : 'Profit Margin'}</span>
                              <span>{(((condition.averageRevenue - condition.averageTreatmentCost) / condition.averageRevenue) * 100).toFixed(1)}%</span>
                            </div>
                            <Progress 
                              value={((condition.averageRevenue - condition.averageTreatmentCost) / condition.averageRevenue) * 100} 
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
                    {language === 'ar' ? 'اتجاهات المرضى الشهرية' : 'Monthly Patient Trends'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={patientTrends}>
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
                          dataKey="totalPatients" 
                          fill="#3b82f6" 
                          name={language === 'ar' ? 'إجمالي المرضى' : 'Total Patients'}
                          opacity={0.7}
                        />
                        <Bar 
                          yAxisId="left"
                          dataKey="newPatients" 
                          fill="#10b981" 
                          name={language === 'ar' ? 'مرضى جدد' : 'New Patients'}
                          opacity={0.7}
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="satisfaction" 
                          stroke="#8b5cf6" 
                          strokeWidth={3}
                          name={language === 'ar' ? 'مستوى الرضا' : 'Satisfaction'}
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="waitTime" 
                          stroke="#f59e0b" 
                          strokeWidth={3}
                          name={language === 'ar' ? 'وقت الانتظار' : 'Wait Time'}
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

export default PatientsReport;