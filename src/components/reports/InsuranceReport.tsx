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
  Shield, 
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
  FileX
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';
import { cn } from '../ui/utils';

interface InsuranceProvider {
  id: string;
  name: string;
  claims: number;
  approvedClaims: number;
  rejectedClaims: number;
  pendingClaims: number;
  totalAmount: number;
  approvedAmount: number;
  rejectedAmount: number;
  averageProcessingTime: number;
  approvalRate: number;
  reimbursementRate: number;
  status: 'active' | 'inactive' | 'suspended';
  contractType: 'direct' | 'network' | 'government';
  color: string;
}

interface ClaimStatus {
  status: string;
  count: number;
  amount: number;
  percentage: number;
  averageTime: number;
  color: string;
  icon: React.ReactNode;
}

interface DepartmentInsurance {
  department: string;
  totalClaims: number;
  approvedClaims: number;
  claimsValue: number;
  approvedValue: number;
  approvalRate: number;
  averageClaimValue: number;
  processingTime: number;
  topInsurers: Array<{
    name: string;
    percentage: number;
    amount: number;
  }>;
}

interface InsuranceReportProps {
  onGoBack: () => void;
}

const InsuranceReport: React.FC<InsuranceReportProps> = ({ onGoBack }) => {
  const { t, language, isRTL } = useLanguage();
  const { effectiveTheme } = useTheme();

  // State management
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area' | 'pie'>('composed');
  const [viewMode, setViewMode] = useState<'summary' | 'providers' | 'claims' | 'departments' | 'trends'>('summary');
  const [sortBy, setSortBy] = useState<'claims' | 'amount' | 'approval' | 'name'>('claims');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Insurance providers data
  const insuranceProviders: InsuranceProvider[] = useMemo(() => [
    {
      id: 'bupa',
      name: language === 'ar' ? 'بوبا العربية' : 'Bupa Arabia',
      claims: 1247,
      approvedClaims: 1089,
      rejectedClaims: 98,
      pendingClaims: 60,
      totalAmount: 3450000,
      approvedAmount: 2980000,
      rejectedAmount: 385000,
      averageProcessingTime: 14,
      approvalRate: 87.3,
      reimbursementRate: 86.4,
      status: 'active',
      contractType: 'direct',
      color: '#0066cc'
    },
    {
      id: 'tawuniya',
      name: language === 'ar' ? 'شركة التعاونية' : 'Tawuniya',
      claims: 987,
      approvedClaims: 834,
      rejectedClaims: 123,
      pendingClaims: 30,
      totalAmount: 2850000,
      approvedAmount: 2410000,
      rejectedAmount: 385000,
      averageProcessingTime: 18,
      approvalRate: 84.5,
      reimbursementRate: 84.6,
      status: 'active',
      contractType: 'network',
      color: '#009639'
    },
    {
      id: 'malath',
      name: language === 'ar' ? 'ملاذ للتأمين' : 'Malath Insurance',
      claims: 756,
      approvedClaims: 623,
      rejectedClaims: 98,
      pendingClaims: 35,
      totalAmount: 2120000,
      approvedAmount: 1745000,
      rejectedAmount: 290000,
      averageProcessingTime: 21,
      approvalRate: 82.4,
      reimbursementRate: 82.3,
      status: 'active',
      contractType: 'network',
      color: '#d4af37'
    },
    {
      id: 'wataniya',
      name: language === 'ar' ? 'الوطنية للتأمين' : 'Wataniya Insurance',
      claims: 634,
      approvedClaims: 487,
      rejectedClaims: 89,
      pendingClaims: 58,
      totalAmount: 1890000,
      approvedAmount: 1456000,
      rejectedAmount: 298000,
      averageProcessingTime: 25,
      approvalRate: 76.8,
      reimbursementRate: 77.0,
      status: 'active',
      contractType: 'direct',
      color: '#800080'
    },
    {
      id: 'sanad',
      name: language === 'ar' ? 'سند للتأمين' : 'Sanad Insurance',
      claims: 423,
      approvedClaims: 298,
      rejectedClaims: 87,
      pendingClaims: 38,
      totalAmount: 1245000,
      approvedAmount: 876000,
      rejectedAmount: 287000,
      averageProcessingTime: 32,
      approvalRate: 70.4,
      reimbursementRate: 70.4,
      status: 'active',
      contractType: 'network',
      color: '#ff6600'
    },
    {
      id: 'government',
      name: language === 'ar' ? 'التأمين الحكومي' : 'Government Insurance',
      claims: 2156,
      approvedClaims: 1987,
      rejectedClaims: 89,
      pendingClaims: 80,
      totalAmount: 4850000,
      approvedAmount: 4520000,
      rejectedAmount: 245000,
      averageProcessingTime: 7,
      approvalRate: 92.1,
      reimbursementRate: 93.2,
      status: 'active',
      contractType: 'government',
      color: '#228b22'
    }
  ], [language]);

  // Claims status data
  const claimsStatus: ClaimStatus[] = useMemo(() => [
    {
      status: language === 'ar' ? 'معتمدة' : 'Approved',
      count: 6318,
      amount: 14987000,
      percentage: 82.4,
      averageTime: 12,
      color: '#10b981',
      icon: <CheckCircle className="h-5 w-5" />
    },
    {
      status: language === 'ar' ? 'مرفوضة' : 'Rejected',
      count: 584,
      amount: 1890000,
      percentage: 7.6,
      averageTime: 15,
      color: '#ef4444',
      icon: <XCircle className="h-5 w-5" />
    },
    {
      status: language === 'ar' ? 'قيد المراجعة' : 'Under Review',
      count: 301,
      amount: 985000,
      percentage: 3.9,
      averageTime: 8,
      color: '#f59e0b',
      icon: <FileClock className="h-5 w-5" />
    },
    {
      status: language === 'ar' ? 'مطلوبة مستندات' : 'Pending Documents',
      count: 203,
      amount: 578000,
      percentage: 2.6,
      averageTime: 25,
      color: '#8b5cf6',
      icon: <FileText className="h-5 w-5" />
    },
    {
      status: language === 'ar' ? 'محتجزة' : 'On Hold',
      count: 156,
      amount: 423000,
      percentage: 2.0,
      averageTime: 45,
      color: '#6b7280',
      icon: <PauseCircle className="h-5 w-5" />
    },
    {
      status: language === 'ar' ? 'ملغاة' : 'Cancelled',
      count: 112,
      amount: 287000,
      percentage: 1.5,
      averageTime: 3,
      color: '#dc2626',
      icon: <Ban className="h-5 w-5" />
    }
  ], [language]);

  // Department insurance data
  const departmentInsurance: DepartmentInsurance[] = useMemo(() => [
    {
      department: language === 'ar' ? 'الطوارئ' : 'Emergency',
      totalClaims: 2156,
      approvedClaims: 1987,
      claimsValue: 4850000,
      approvedValue: 4520000,
      approvalRate: 92.1,
      averageClaimValue: 2249,
      processingTime: 8,
      topInsurers: [
        { name: language === 'ar' ? 'التأمين الحكومي' : 'Government', percentage: 45.2, amount: 2192400 },
        { name: language === 'ar' ? 'بوبا' : 'Bupa', percentage: 28.7, amount: 1391800 },
        { name: language === 'ar' ? 'التعاونية' : 'Tawuniya', percentage: 16.1, amount: 780700 }
      ]
    },
    {
      department: language === 'ar' ? 'العيادات الخارجية' : 'Outpatient Clinics',
      totalClaims: 1847,
      approvedClaims: 1598,
      claimsValue: 3420000,
      approvedValue: 2890000,
      approvalRate: 86.5,
      averageClaimValue: 1852,
      processingTime: 12,
      topInsurers: [
        { name: language === 'ar' ? 'بوبا' : 'Bupa', percentage: 38.4, amount: 1313280 },
        { name: language === 'ar' ? 'التعاونية' : 'Tawuniya', percentage: 31.2, amount: 1067040 },
        { name: language === 'ar' ? 'ملاذ' : 'Malath', percentage: 20.3, amount: 694460 }
      ]
    },
    {
      department: language === 'ar' ? 'الجراحة' : 'Surgery',
      totalClaims: 298,
      approvedClaims: 267,
      claimsValue: 2850000,
      approvedValue: 2567000,
      approvalRate: 89.6,
      averageClaimValue: 9563,
      processingTime: 18,
      topInsurers: [
        { name: language === 'ar' ? 'بوبا' : 'Bupa', percentage: 42.1, amount: 1199700 },
        { name: language === 'ar' ? 'الوطنية' : 'Wataniya', percentage: 28.3, amount: 806550 },
        { name: language === 'ar' ? 'التعاونية' : 'Tawuniya', percentage: 19.6, amount: 558600 }
      ]
    },
    {
      department: language === 'ar' ? 'الأشعة' : 'Radiology',
      totalClaims: 1456,
      approvedClaims: 1234,
      claimsValue: 1890000,
      approvedValue: 1598000,
      approvalRate: 84.7,
      averageClaimValue: 1298,
      processingTime: 14,
      topInsurers: [
        { name: language === 'ar' ? 'بوبا' : 'Bupa', percentage: 35.7, amount: 674950 },
        { name: language === 'ar' ? 'التعاونية' : 'Tawuniya', percentage: 29.4, amount: 555620 },
        { name: language === 'ar' ? 'التأمين الحكومي' : 'Government', percentage: 24.9, amount: 470610 }
      ]
    },
    {
      department: language === 'ar' ? 'المختبر' : 'Laboratory',
      totalClaims: 2847,
      approvedClaims: 2456,
      claimsValue: 1456000,
      approvedValue: 1234000,
      approvalRate: 86.3,
      averageClaimValue: 511,
      processingTime: 10,
      topInsurers: [
        { name: language === 'ar' ? 'التأمين الحكومي' : 'Government', percentage: 41.2, amount: 599808 },
        { name: language === 'ar' ? 'بوبا' : 'Bupa', percentage: 32.7, amount: 475984 },
        { name: language === 'ar' ? 'التعاونية' : 'Tawuniya', percentage: 16.8, amount: 244544 }
      ]
    }
  ], [language]);

  // Monthly insurance trends
  const insuranceTrends = useMemo(() => [
    {
      month: language === 'ar' ? 'يناير' : 'Jan',
      totalClaims: 6245,
      approvedClaims: 5187,
      rejectedClaims: 623,
      pendingClaims: 435,
      claimsValue: 11450000,
      approvedValue: 9780000,
      rejectedValue: 1245000,
      approvalRate: 83.1,
      processingTime: 16
    },
    {
      month: language === 'ar' ? 'فبراير' : 'Feb',
      totalClaims: 6789,
      approvedClaims: 5634,
      rejectedClaims: 678,
      pendingClaims: 477,
      claimsValue: 12350000,
      approvedValue: 10560000,
      rejectedValue: 1346000,
      approvalRate: 83.0,
      processingTime: 15
    },
    {
      month: language === 'ar' ? 'مارس' : 'Mar',
      totalClaims: 7123,
      approvedClaims: 5987,
      rejectedClaims: 712,
      pendingClaims: 424,
      claimsValue: 13120000,
      approvedValue: 11245000,
      rejectedValue: 1423000,
      approvalRate: 84.1,
      processingTime: 14
    },
    {
      month: language === 'ar' ? 'أبريل' : 'Apr',
      totalClaims: 7456,
      approvedClaims: 6298,
      rejectedClaims: 745,
      pendingClaims: 413,
      claimsValue: 14230000,
      approvedValue: 12145000,
      rejectedValue: 1567000,
      approvalRate: 84.5,
      processingTime: 13
    },
    {
      month: language === 'ar' ? 'مايو' : 'May',
      totalClaims: 7674,
      approvedClaims: 6518,
      rejectedClaims: 584,
      pendingClaims: 572,
      claimsValue: 15150000,
      approvedValue: 12987000,
      rejectedValue: 1890000,
      approvalRate: 84.9,
      processingTime: 12
    }
  ], [language]);

  // Calculate summary metrics
  const totalClaims = insuranceProviders.reduce((sum, provider) => sum + provider.claims, 0);
  const totalApproved = insuranceProviders.reduce((sum, provider) => sum + provider.approvedClaims, 0);
  const totalAmount = insuranceProviders.reduce((sum, provider) => sum + provider.totalAmount, 0);
  const totalApprovedAmount = insuranceProviders.reduce((sum, provider) => sum + provider.approvedAmount, 0);
  const overallApprovalRate = (totalApproved / totalClaims) * 100;
  const overallReimbursementRate = (totalApprovedAmount / totalAmount) * 100;

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
      case 'active': return 'text-green-600 bg-green-50 dark:bg-green-950/20';
      case 'inactive': return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20';
      case 'suspended': return 'text-red-600 bg-red-50 dark:bg-red-950/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20';
    }
  };

  // Get contract type color
  const getContractTypeColor = (type: string) => {
    switch (type) {
      case 'direct': return 'text-blue-600 bg-blue-50 dark:bg-blue-950/20';
      case 'network': return 'text-purple-600 bg-purple-50 dark:bg-purple-950/20';
      case 'government': return 'text-green-600 bg-green-50 dark:bg-green-950/20';
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
                {entry.name}: {entry.dataKey?.includes('Rate') ? 
                  `${entry.value.toFixed(1)}%` : 
                  entry.dataKey?.includes('Time') ?
                  `${entry.value} ${language === 'ar' ? 'يوم' : 'days'}` :
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
    console.log(`Exporting insurance report as ${format}`);
  };

  // Sort providers
  const sortedProviders = useMemo(() => {
    return [...insuranceProviders].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'claims':
          aValue = a.claims;
          bValue = b.claims;
          break;
        case 'amount':
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        case 'approval':
          aValue = a.approvalRate;
          bValue = b.approvalRate;
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
  }, [insuranceProviders, sortBy, sortOrder]);

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
              <Shield className="h-6 w-6" />
              {language === 'ar' ? 'تقرير التأمين' : 'Insurance Report'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'ar' ? 'تقرير مطالبات التأمين والمدفوعات' : 'Insurance claims and payments report'}
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
            <TabsTrigger value="providers" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              {language === 'ar' ? 'المؤمنون' : 'Providers'}
            </TabsTrigger>
            <TabsTrigger value="claims" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {language === 'ar' ? 'المطالبات' : 'Claims'}
            </TabsTrigger>
            <TabsTrigger value="departments" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              {language === 'ar' ? 'الأقسام' : 'Departments'}
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
                          {language === 'ar' ? 'إجم��لي المطالبات' : 'Total Claims'}
                        </p>
                        <p className="text-2xl font-bold">{totalClaims.toLocaleString()}</p>
                        <div className="flex items-center gap-1 text-blue-600">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm">+8.9%</span>
                        </div>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-full">
                        <FileText className="h-6 w-6 text-blue-600" />
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
                          {language === 'ar' ? 'قيمة المطالبات' : 'Claims Value'}
                        </p>
                        <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm">+12.3%</span>
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
                          {language === 'ar' ? 'معدل الموافقة' : 'Approval Rate'}
                        </p>
                        <p className="text-2xl font-bold">{overallApprovalRate.toFixed(1)}%</p>
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">+2.1%</span>
                        </div>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-full">
                        <CheckCircle className="h-6 w-6 text-green-600" />
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
                          {language === 'ar' ? 'متوسط وقت المعالجة' : 'Avg Processing Time'}
                        </p>
                        <p className="text-2xl font-bold">14</p>
                        <div className="flex items-center gap-1 text-orange-600">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">{language === 'ar' ? 'يوم' : 'days'}</span>
                        </div>
                      </div>
                      <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-full">
                        <Clock className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Claims Status Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    {language === 'ar' ? 'توزيع حالة المطالبات' : 'Claims Status Distribution'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {claimsStatus.map((status, index) => (
                      <motion.div
                        key={status.status}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="p-4 border rounded-lg hover:shadow-md transition-all duration-300"
                      >
                        <div className="space-y-3">
                          <div className={cn("flex items-center gap-2", isRTL ? "flex-row-reverse" : "")}>
                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${status.color}15` }}>
                              <div style={{ color: status.color }}>
                                {status.icon}
                              </div>
                            </div>
                            <div className={isRTL ? "text-right" : ""}>
                              <h3 className="text-sm font-medium">{status.status}</h3>
                              <p className="text-xs text-muted-foreground">{status.percentage}%</p>
                            </div>
                          </div>
                          
                          <div className={cn("space-y-2", isRTL ? "text-right" : "")}>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">{language === 'ar' ? 'العدد:' : 'Count:'}</span>
                              <span className="font-medium">{status.count.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">{language === 'ar' ? 'القيمة:' : 'Value:'}</span>
                              <span className="font-medium">{formatCurrency(status.amount)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">{language === 'ar' ? 'الوقت:' : 'Time:'}</span>
                              <span className="font-medium">{status.averageTime} {language === 'ar' ? 'يوم' : 'days'}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Insurance Providers Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {language === 'ar' ? 'نظرة عامة على شركات التأمين' : 'Insurance Providers Overview'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={insuranceProviders}>
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
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar 
                          dataKey="claims" 
                          fill="#3b82f6"
                          name={language === 'ar' ? 'المطالبات' : 'Claims'}
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          dataKey="approvedClaims" 
                          fill="#10b981"
                          name={language === 'ar' ? 'المعتمدة' : 'Approved'}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Providers View */}
          <TabsContent value="providers" className="space-y-6">
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
                      {language === 'ar' ? 'شركات التأمين' : 'Insurance Providers'}
                    </CardTitle>
                    
                    <div className="flex items-center gap-2">
                      <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="claims">{language === 'ar' ? 'المطالبات' : 'Claims'}</SelectItem>
                          <SelectItem value="amount">{language === 'ar' ? 'المبلغ' : 'Amount'}</SelectItem>
                          <SelectItem value="approval">{language === 'ar' ? 'معدل الموافقة' : 'Approval Rate'}</SelectItem>
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
                      {sortedProviders.map((provider, index) => (
                        <motion.div
                          key={provider.id}
                          initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-6 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="space-y-4">
                            <div className={cn("flex items-center justify-between", isRTL ? "flex-row-reverse" : "")}>
                              <div className={cn("flex items-center gap-4", isRTL ? "flex-row-reverse" : "")}>
                                <div className="p-3 rounded-full" style={{ backgroundColor: `${provider.color}15` }}>
                                  <Shield className="h-6 w-6" style={{ color: provider.color }} />
                                </div>
                                <div className={isRTL ? "text-right" : ""}>
                                  <h3 className="text-lg font-semibold">{provider.name}</h3>
                                  <div className="flex items-center gap-2">
                                    <Badge className={getStatusColor(provider.status)}>
                                      {language === 'ar' ? 
                                        (provider.status === 'active' ? 'نشط' : provider.status === 'inactive' ? 'غير نشط' : 'معلق') :
                                        provider.status
                                      }
                                    </Badge>
                                    <Badge className={getContractTypeColor(provider.contractType)}>
                                      {language === 'ar' ? 
                                        (provider.contractType === 'direct' ? 'مباشر' : provider.contractType === 'network' ? 'شبكة' : 'حكومي') :
                                        provider.contractType
                                      }
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{provider.approvalRate.toFixed(1)}%</div>
                                <div className="text-sm text-muted-foreground">{language === 'ar' ? 'معدل الموافقة' : 'Approval Rate'}</div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className={cn("text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg", isRTL ? "text-right" : "")}>
                                <div className="text-lg font-semibold text-blue-600">{provider.claims.toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground">{language === 'ar' ? 'إجمالي المطالبات' : 'Total Claims'}</div>
                              </div>
                              
                              <div className={cn("text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg", isRTL ? "text-right" : "")}>
                                <div className="text-lg font-semibold text-green-600">{provider.approvedClaims.toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground">{language === 'ar' ? 'المعتمدة' : 'Approved'}</div>
                              </div>
                              
                              <div className={cn("text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg", isRTL ? "text-right" : "")}>
                                <div className="text-lg font-semibold text-red-600">{provider.rejectedClaims.toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground">{language === 'ar' ? 'المرفوضة' : 'Rejected'}</div>
                              </div>
                              
                              <div className={cn("text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg", isRTL ? "text-right" : "")}>
                                <div className="text-lg font-semibold text-orange-600">{provider.pendingClaims.toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground">{language === 'ar' ? 'قيد المراجعة' : 'Pending'}</div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm pt-2">
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'إجمالي القيمة:' : 'Total Amount:'}</span>
                                <span className="font-medium">{formatCurrency(provider.totalAmount)}</span>
                              </div>
                              
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'القيمة المعتمدة:' : 'Approved Amount:'}</span>
                                <span className="font-medium">{formatCurrency(provider.approvedAmount)}</span>
                              </div>
                              
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'وقت المعالجة:' : 'Processing Time:'}</span>
                                <span className="font-medium">{provider.averageProcessingTime} {language === 'ar' ? 'يوم' : 'days'}</span>
                              </div>
                            </div>
                            
                            <div className="pt-2 space-y-2">
                              <div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                  <span>{language === 'ar' ? 'معدل السداد' : 'Reimbursement Rate'}</span>
                                  <span>{provider.reimbursementRate.toFixed(1)}%</span>
                                </div>
                                <Progress 
                                  value={provider.reimbursementRate} 
                                  className="h-2"
                                />
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

          {/* Claims View */}
          <TabsContent value="claims" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {language === 'ar' ? 'تحليل المطالبات' : 'Claims Analysis'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={claimsStatus}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          dataKey="count"
                          label={({ status, percentage }) => `${status}: ${percentage}%`}
                        >
                          {claimsStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                      </PieChart>
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
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    {language === 'ar' ? 'أداء التأمين حسب القسم' : 'Insurance Performance by Department'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {departmentInsurance.map((dept, index) => (
                      <motion.div
                        key={dept.department}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 border rounded-lg hover:shadow-md transition-all duration-300"
                      >
                        <div className="space-y-4">
                          <div className={cn("flex items-center justify-between", isRTL ? "flex-row-reverse" : "")}>
                            <h3 className="text-lg font-semibold">{dept.department}</h3>
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              {dept.approvalRate.toFixed(1)}% {language === 'ar' ? 'معدل الموافقة' : 'Approval'}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className={cn("space-y-2", isRTL ? "text-right" : "")}>
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'إجمالي المطالبات:' : 'Total Claims:'}</span>
                                <span className="font-medium">{dept.totalClaims.toLocaleString()}</span>
                              </div>
                              
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'المعتمدة:' : 'Approved:'}</span>
                                <span className="font-medium">{dept.approvedClaims.toLocaleString()}</span>
                              </div>
                              
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'وقت المعالجة:' : 'Processing Time:'}</span>
                                <span className="font-medium">{dept.processingTime} {language === 'ar' ? 'يوم' : 'days'}</span>
                              </div>
                            </div>
                            
                            <div className={cn("space-y-2", isRTL ? "text-right" : "")}>
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'قيمة المطالبات:' : 'Claims Value:'}</span>
                                <span className="font-medium">{formatCurrency(dept.claimsValue)}</span>
                              </div>
                              
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'القيمة المعتمدة:' : 'Approved Value:'}</span>
                                <span className="font-medium">{formatCurrency(dept.approvedValue)}</span>
                              </div>
                              
                              <div className={cn("flex justify-between", isRTL ? "flex-row-reverse" : "")}>
                                <span className="text-muted-foreground">{language === 'ar' ? 'متوسط المطالبة:' : 'Avg Claim:'}</span>
                                <span className="font-medium">{formatCurrency(dept.averageClaimValue)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-3 space-y-3">
                            <h4 className="text-sm font-medium text-muted-foreground">
                              {language === 'ar' ? 'أهم شركات التأمين' : 'Top Insurers'}
                            </h4>
                            {dept.topInsurers.map((insurer, i) => (
                              <div key={i} className={cn("flex items-center justify-between text-sm", isRTL ? "flex-row-reverse" : "")}>
                                <span className="flex-1">{insurer.name}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">{insurer.percentage}%</span>
                                  <span className="font-medium">{formatCurrency(insurer.amount)}</span>
                                </div>
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
                    {language === 'ar' ? 'اتجاهات التأمين الشهرية' : 'Monthly Insurance Trends'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={insuranceTrends}>
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
                          dataKey="totalClaims" 
                          fill="#3b82f6" 
                          name={language === 'ar' ? 'إجمالي المطالبات' : 'Total Claims'}
                          opacity={0.7}
                        />
                        <Bar 
                          yAxisId="left"
                          dataKey="approvedClaims" 
                          fill="#10b981" 
                          name={language === 'ar' ? 'المعتمدة' : 'Approved'}
                          opacity={0.7}
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="approvalRate" 
                          stroke="#8b5cf6" 
                          strokeWidth={3}
                          name={language === 'ar' ? 'معدل الموافقة' : 'Approval Rate'}
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="processingTime" 
                          stroke="#f59e0b" 
                          strokeWidth={3}
                          name={language === 'ar' ? 'وقت المعالجة' : 'Processing Time'}
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

export default InsuranceReport;