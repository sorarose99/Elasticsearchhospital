import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Users, Calendar, DollarSign, Activity, TrendingUp, 
  Clock, AlertCircle, CheckCircle, ArrowUp, ArrowDown, 
  Filter, Download, RefreshCw, Settings, Zap, Database,
  PieChart, LineChart, Target, Award, Heart, Brain,
  Stethoscope, UserCheck, BedDouble, TestTube, Pill
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Chart } from '../ui/chart';
import { useLanguage } from '../../services/LanguageService';

// Types for executive dashboard data
interface KPIMetric {
  id: string;
  label: string;
  labelAr: string;
  value: number;
  previousValue: number;
  target?: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  unit: string;
  icon: any;
  color: string;
  category: 'financial' | 'operational' | 'clinical' | 'patient';
}

interface PerformanceIndicator {
  id: string;
  name: string;
  nameAr: string;
  department: string;
  score: number;
  benchmark: number;
  status: 'excellent' | 'good' | 'average' | 'poor';
  trend: number[];
  lastUpdated: Date;
}

interface AlertItem {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  department: string;
  timestamp: Date;
  actionRequired: boolean;
  assignedTo?: string;
}

interface RevenueData {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  patientVolume: number;
}

interface OperationalData {
  metric: string;
  current: number;
  target: number;
  unit: string;
  trend: number;
}

const translations = {
  en: {
    title: "Executive Dashboard",
    subtitle: "Real-time hospital performance overview",
    tabs: {
      overview: "Overview",
      performance: "Performance",
      financial: "Financial",
      operational: "Operational",
      alerts: "Alerts"
    },
    kpis: {
      totalRevenue: "Total Revenue",
      patientSatisfaction: "Patient Satisfaction",
      bedOccupancy: "Bed Occupancy",
      avgWaitTime: "Avg Wait Time",
      staffUtilization: "Staff Utilization",
      emergencyResponse: "Emergency Response",
      readmissionRate: "Readmission Rate",
      operatingMargin: "Operating Margin"
    },
    departments: {
      emergency: "Emergency",
      surgery: "Surgery", 
      outpatient: "Outpatient",
      inpatient: "Inpatient",
      laboratory: "Laboratory",
      radiology: "Radiology",
      pharmacy: "Pharmacy",
      administration: "Administration"
    },
    status: {
      excellent: "Excellent",
      good: "Good", 
      average: "Average",
      poor: "Poor"
    },
    timeframes: {
      today: "Today",
      week: "This Week",
      month: "This Month",
      quarter: "This Quarter",
      year: "This Year"
    }
  },
  ar: {
    title: "لوحة التحكم التنفيذية",
    subtitle: "نظرة عامة مباشرة على أداء المستشفى",
    tabs: {
      overview: "نظرة عامة",
      performance: "الأداء",
      financial: "المالي",
      operational: "التشغيلي",
      alerts: "التنبيهات"
    },
    kpis: {
      totalRevenue: "إجمالي الإيرادات",
      patientSatisfaction: "رضا المرضى",
      bedOccupancy: "إشغال الأسرة",
      avgWaitTime: "متوسط وقت الانتظار",
      staffUtilization: "استخدام الطاقم",
      emergencyResponse: "استجابة الطوارئ",
      readmissionRate: "معدل الإعادة",
      operatingMargin: "هامش التشغيل"
    },
    departments: {
      emergency: "الطوارئ",
      surgery: "الجراحة",
      outpatient: "المرضى الخارجيين",
      inpatient: "المرضى الداخليين",
      laboratory: "المختبر",
      radiology: "الأشعة",
      pharmacy: "الصيدلية",
      administration: "الإدارة"
    },
    status: {
      excellent: "ممتاز",
      good: "جيد",
      average: "متوسط",
      poor: "ضعيف"
    },
    timeframes: {
      today: "اليوم",
      week: "هذا الأسبوع",
      month: "هذا الشهر",
      quarter: "هذا الربع",
      year: "هذا العام"
    }
  }
};

export default function ExecutiveDashboard() {
  const { language, t, isRTL } = useLanguage();
  const texts = translations[language as keyof typeof translations] || translations.en;

  // State management
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [kpiMetrics, setKpiMetrics] = useState<KPIMetric[]>([]);
  const [performanceIndicators, setPerformanceIndicators] = useState<PerformanceIndicator[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [operationalData, setOperationalData] = useState<OperationalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [selectedTimeframe]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    
    // Simulate API calls with sample data
    setTimeout(() => {
      setKpiMetrics(generateKPIMetrics());
      setPerformanceIndicators(generatePerformanceIndicators());
      setAlerts(generateAlerts());
      setRevenueData(generateRevenueData());
      setOperationalData(generateOperationalData());
      setIsLoading(false);
    }, 1000);
  };

  const generateKPIMetrics = (): KPIMetric[] => [
    {
      id: 'revenue',
      label: 'Total Revenue',
      labelAr: 'إجمالي الإيرادات',
      value: 2450000,
      previousValue: 2280000,
      target: 2500000,
      trend: 'up',
      trendPercentage: 7.5,
      unit: 'SAR',
      icon: DollarSign,
      color: 'text-green-600',
      category: 'financial'
    },
    {
      id: 'patient_satisfaction',
      label: 'Patient Satisfaction',
      labelAr: 'رضا المرضى',
      value: 94.2,
      previousValue: 92.1,
      target: 95,
      trend: 'up',
      trendPercentage: 2.3,
      unit: '%',
      icon: Heart,
      color: 'text-pink-600',
      category: 'patient'
    },
    {
      id: 'bed_occupancy',
      label: 'Bed Occupancy',
      labelAr: 'إشغال الأسرة',
      value: 87.5,
      previousValue: 89.2,
      target: 85,
      trend: 'down',
      trendPercentage: -1.9,
      unit: '%',
      icon: BedDouble,
      color: 'text-blue-600',
      category: 'operational'
    },
    {
      id: 'wait_time',
      label: 'Avg Wait Time',
      labelAr: 'متوسط وقت الانتظار',
      value: 23,
      previousValue: 28,
      target: 20,
      trend: 'up',
      trendPercentage: -17.9,
      unit: 'min',
      icon: Clock,
      color: 'text-orange-600',
      category: 'operational'
    },
    {
      id: 'staff_utilization',
      label: 'Staff Utilization',
      labelAr: 'استخدام الطاقم',
      value: 78.4,
      previousValue: 75.8,
      target: 80,
      trend: 'up',
      trendPercentage: 3.4,
      unit: '%',
      icon: Users,
      color: 'text-purple-600',
      category: 'operational'
    },
    {
      id: 'emergency_response',
      label: 'Emergency Response',
      labelAr: 'استجابة الطوارئ',
      value: 4.2,
      previousValue: 4.8,
      target: 4,
      trend: 'up',
      trendPercentage: -12.5,
      unit: 'min',
      icon: Zap,
      color: 'text-red-600',
      category: 'clinical'
    },
    {
      id: 'readmission_rate',
      label: 'Readmission Rate',
      labelAr: 'معدل الإعادة',
      value: 8.7,
      previousValue: 9.4,
      target: 8,
      trend: 'up',
      trendPercentage: -7.4,
      unit: '%',
      icon: UserCheck,
      color: 'text-indigo-600',
      category: 'clinical'
    },
    {
      id: 'operating_margin',
      label: 'Operating Margin',
      labelAr: 'هامش التشغيل',
      value: 12.8,
      previousValue: 11.9,
      target: 15,
      trend: 'up',
      trendPercentage: 7.6,
      unit: '%',
      icon: TrendingUp,
      color: 'text-teal-600',
      category: 'financial'
    }
  ];

  const generatePerformanceIndicators = (): PerformanceIndicator[] => [
    {
      id: 'emergency_dept',
      name: 'Emergency Department',
      nameAr: 'قسم الطوارئ',
      department: 'emergency',
      score: 92,
      benchmark: 85,
      status: 'excellent',
      trend: [78, 82, 85, 88, 90, 92],
      lastUpdated: new Date()
    },
    {
      id: 'surgery_dept',
      name: 'Surgery Department',
      nameAr: 'قسم الجراحة',
      department: 'surgery',
      score: 88,
      benchmark: 90,
      status: 'good',
      trend: [85, 86, 87, 89, 87, 88],
      lastUpdated: new Date()
    },
    {
      id: 'outpatient_clinic',
      name: 'Outpatient Clinic',
      nameAr: 'العيادات الخارجية',
      department: 'outpatient',
      score: 85,
      benchmark: 85,
      status: 'good',
      trend: [80, 82, 84, 83, 85, 85],
      lastUpdated: new Date()
    },
    {
      id: 'laboratory',
      name: 'Laboratory Services',
      nameAr: 'خدمات المختبر',
      department: 'laboratory',
      score: 94,
      benchmark: 88,
      status: 'excellent',
      trend: [88, 90, 91, 93, 94, 94],
      lastUpdated: new Date()
    }
  ];

  const generateAlerts = (): AlertItem[] => [
    {
      id: 'alert_1',
      type: 'critical',
      title: 'ICU Capacity Alert',
      titleAr: 'تنبيه سعة العناية المركزة',
      description: 'ICU capacity has reached 95%. Immediate action required.',
      descriptionAr: 'وصلت سعة العناية المركزة إلى 95%. مطلوب إجراء فوري.',
      department: 'ICU',
      timestamp: new Date(),
      actionRequired: true,
      assignedTo: 'Dr. Sarah Ahmed'
    },
    {
      id: 'alert_2',
      type: 'warning',
      title: 'Equipment Maintenance Due',
      titleAr: 'موعد صيانة المعدات',
      description: 'MRI Machine #2 requires scheduled maintenance.',
      descriptionAr: 'جهاز الرنين المغناطيسي #2 يتطلب صيانة مجدولة.',
      department: 'Radiology',
      timestamp: new Date(Date.now() - 3600000),
      actionRequired: true,
      assignedTo: 'Technical Team'
    },
    {
      id: 'alert_3',
      type: 'info',
      title: 'Staff Training Completed',
      titleAr: 'اكتمال تدريب الطاقم',
      description: 'Emergency response training completed for 95% of staff.',
      descriptionAr: 'اكتمل تدريب الاستجابة للطوارئ لـ 95% من الطاقم.',
      department: 'HR',
      timestamp: new Date(Date.now() - 7200000),
      actionRequired: false
    }
  ];

  const generateRevenueData = (): RevenueData[] => [
    { period: 'Jan', revenue: 2100000, expenses: 1800000, profit: 300000, patientVolume: 1250 },
    { period: 'Feb', revenue: 2200000, expenses: 1850000, profit: 350000, patientVolume: 1300 },
    { period: 'Mar', revenue: 2300000, expenses: 1900000, profit: 400000, patientVolume: 1380 },
    { period: 'Apr', revenue: 2450000, expenses: 1950000, profit: 500000, patientVolume: 1420 },
    { period: 'May', revenue: 2350000, expenses: 1920000, profit: 430000, patientVolume: 1390 },
    { period: 'Jun', revenue: 2500000, expenses: 2000000, profit: 500000, patientVolume: 1450 }
  ];

  const generateOperationalData = (): OperationalData[] => [
    { metric: 'Patient Throughput', current: 145, target: 150, unit: 'patients/day', trend: 2.3 },
    { metric: 'Surgery Success Rate', current: 98.5, target: 98, unit: '%', trend: 0.5 },
    { metric: 'Lab TAT', current: 45, target: 40, unit: 'minutes', trend: -5.2 },
    { metric: 'Patient Safety Score', current: 9.2, target: 9.5, unit: '/10', trend: 1.1 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'average': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'warning': return 'border-yellow-500 bg-yellow-50';
      case 'info': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart className="h-6 w-6" />
            {texts.title}
          </h1>
          <p className="text-muted-foreground mt-1">
            {texts.subtitle}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">{texts.timeframes.today}</SelectItem>
              <SelectItem value="week">{texts.timeframes.week}</SelectItem>
              <SelectItem value="month">{texts.timeframes.month}</SelectItem>
              <SelectItem value="quarter">{texts.timeframes.quarter}</SelectItem>
              <SelectItem value="year">{texts.timeframes.year}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            onClick={loadDashboardData}
            className="hover-lift"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button
            variant="outline"
            className="hover-lift"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">{texts.tabs.overview}</TabsTrigger>
          <TabsTrigger value="performance">{texts.tabs.performance}</TabsTrigger>
          <TabsTrigger value="financial">{texts.tabs.financial}</TabsTrigger>
          <TabsTrigger value="operational">{texts.tabs.operational}</TabsTrigger>
          <TabsTrigger value="alerts">
            {texts.tabs.alerts}
            {alerts.filter(a => a.actionRequired).length > 0 && (
              <Badge variant="destructive" className="ml-2 h-4 w-4 p-0 text-xs">
                {alerts.filter(a => a.actionRequired).length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiMetrics.map((metric, index) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${metric.color.replace('text-', 'bg-').replace('600', '100')}`}>
                          <metric.icon className={`h-5 w-5 ${metric.color}`} />
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.trend === 'up' ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )}
                        {Math.abs(metric.trendPercentage)}%
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <h3 className="text-2xl font-bold">
                        {metric.unit === 'SAR' ? 
                          `${(metric.value / 1000000).toFixed(1)}M` : 
                          `${metric.value}${metric.unit}`
                        }
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === 'ar' ? metric.labelAr : metric.label}
                      </p>
                      
                      {metric.target && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span>Target: {metric.target}{metric.unit}</span>
                            <span>
                              {((metric.value / metric.target) * 100).toFixed(0)}%
                            </span>
                          </div>
                          <Progress 
                            value={(metric.value / metric.target) * 100} 
                            className="h-1"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Revenue Trend
                </CardTitle>
                <CardDescription>
                  Monthly revenue, expenses, and profit overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {/* Chart would go here - using placeholder */}
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded">
                    <p className="text-muted-foreground">Revenue Chart Placeholder</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Department Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Department Performance
                </CardTitle>
                <CardDescription>
                  Key performance indicators by department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {performanceIndicators.slice(0, 4).map((indicator) => (
                    <div key={indicator.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{indicator.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Benchmark: {indicator.benchmark}%
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24">
                          <Progress value={indicator.score} className="h-2" />
                        </div>
                        <Badge className={getStatusColor(indicator.status)}>
                          {indicator.score}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {performanceIndicators.map((indicator) => (
              <Card key={indicator.id} className="hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{indicator.name}</span>
                    <Badge className={getStatusColor(indicator.status)}>
                      {texts.status[indicator.status]}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Last updated: {indicator.lastUpdated.toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{indicator.score}%</span>
                      <span className="text-sm text-muted-foreground">
                        Benchmark: {indicator.benchmark}%
                      </span>
                    </div>
                    
                    <Progress 
                      value={indicator.score} 
                      className="h-2"
                    />
                    
                    <div className="h-16">
                      {/* Mini trend chart placeholder */}
                      <div className="flex items-end justify-between h-full">
                        {indicator.trend.map((value, index) => (
                          <div
                            key={index}
                            className="bg-primary/20 w-4 rounded-t"
                            style={{ height: `${(value / 100) * 100}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {kpiMetrics.filter(m => m.category === 'financial').map((metric) => (
              <Card key={metric.id} className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${metric.color.replace('text-', 'bg-').replace('600', '100')}`}>
                      <metric.icon className={`h-6 w-6 ${metric.color}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">
                        {metric.unit === 'SAR' ? 
                          `${(metric.value / 1000000).toFixed(1)}M SAR` : 
                          `${metric.value}${metric.unit}`
                        }
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === 'ar' ? metric.labelAr : metric.label}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Financial Performance Overview</CardTitle>
              <CardDescription>Revenue, expenses, and profit trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <div className="flex items-center justify-center h-full bg-gray-50 rounded">
                  <p className="text-muted-foreground">Financial Chart Placeholder</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Operational Tab */}
        <TabsContent value="operational" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {operationalData.map((item, index) => (
              <motion.div
                key={item.metric}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">{item.metric}</h3>
                      <div className={`flex items-center gap-1 text-sm ${
                        item.trend > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.trend > 0 ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )}
                        {Math.abs(item.trend)}%
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">
                          {item.current}{item.unit}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Target: {item.target}{item.unit}
                        </span>
                      </div>
                      
                      <Progress 
                        value={(item.current / item.target) * 100} 
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiMetrics.filter(m => m.category === 'operational').map((metric) => (
              <Card key={metric.id} className="hover-lift">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <metric.icon className={`h-4 w-4 ${metric.color}`} />
                    <span className="text-sm font-medium">
                      {language === 'ar' ? metric.labelAr : metric.label}
                    </span>
                  </div>
                  <div className="text-xl font-bold">
                    {metric.value}{metric.unit}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Active Alerts</h3>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`border-l-4 ${getAlertTypeColor(alert.type)} hover-lift`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{alert.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {alert.department}
                          </Badge>
                          {alert.actionRequired && (
                            <Badge variant="destructive" className="text-xs">
                              Action Required
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {alert.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{alert.timestamp.toLocaleString()}</span>
                          {alert.assignedTo && (
                            <span>Assigned to: {alert.assignedTo}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {alert.type === 'critical' && (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                        {alert.type === 'warning' && (
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        )}
                        {alert.type === 'info' && (
                          <CheckCircle className="h-5 w-5 text-blue-500" />
                        )}
                        
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}