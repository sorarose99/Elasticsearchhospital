import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  FileText, 
  Users, 
  DollarSign, 
  Activity,
  TrendingUp,
  Calendar,
  Download,
  Printer,
  Share,
  BarChart3,
  PieChart as PieChartIcon,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap,
  Building,
  Stethoscope
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';

interface OverviewReportsProps {
  userRole: string;
}

export default function OverviewReports({ userRole }: OverviewReportsProps) {
  const { language, t, isRTL } = useLanguage();
  const [reportType, setReportType] = useState('summary');
  const [timeRange, setTimeRange] = useState('month');

  // Hospital overview metrics
  const overviewMetrics = useMemo(() => [
    {
      id: 'patient_visits',
      title: language === 'ar' ? 'زيارات المرضى' : 'Patient Visits',
      value: '2,847',
      change: '+15.3%',
      trend: 'up',
      target: 3000,
      current: 2847,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      id: 'revenue',
      title: language === 'ar' ? 'الإيرادات' : 'Revenue',
      value: '$324,580',
      change: '+12.8%',
      trend: 'up',
      target: 350000,
      current: 324580,
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      id: 'bed_occupancy',
      title: language === 'ar' ? 'إشغال الأسرة' : 'Bed Occupancy',
      value: '78%',
      change: '+5.2%',
      trend: 'up',
      target: 85,
      current: 78,
      icon: Building,
      color: 'text-purple-600'
    },
    {
      id: 'staff_productivity',
      title: language === 'ar' ? 'إنتاجية الطاقم' : 'Staff Productivity',
      value: '92%',
      change: '+3.1%',
      trend: 'up',
      target: 95,
      current: 92,
      icon: Target,
      color: 'text-orange-600'
    }
  ], [language]);

  // Monthly performance data
  const monthlyData = useMemo(() => [
    { 
      month: language === 'ar' ? 'يناير' : 'Jan', 
      patients: 2140, 
      revenue: 285000, 
      admissions: 125,
      occupancy: 72 
    },
    { 
      month: language === 'ar' ? 'فبراير' : 'Feb', 
      patients: 2380, 
      revenue: 310000, 
      admissions: 138,
      occupancy: 75 
    },
    { 
      month: language === 'ar' ? 'مارس' : 'Mar', 
      patients: 2620, 
      revenue: 340000, 
      admissions: 152,
      occupancy: 78 
    },
    { 
      month: language === 'ar' ? 'أبريل' : 'Apr', 
      patients: 2450, 
      revenue: 325000, 
      admissions: 145,
      occupancy: 76 
    },
    { 
      month: language === 'ar' ? 'مايو' : 'May', 
      patients: 2750, 
      revenue: 365000, 
      admissions: 165,
      occupancy: 82 
    },
    { 
      month: language === 'ar' ? 'يونيو' : 'Jun', 
      patients: 2847, 
      revenue: 380000, 
      admissions: 172,
      occupancy: 78 
    }
  ], [language]);

  // Department performance
  const departmentData = useMemo(() => [
    {
      department: language === 'ar' ? 'الطوارئ' : 'Emergency',
      patients: 450,
      revenue: 85000,
      satisfaction: 4.2,
      efficiency: 88
    },
    {
      department: language === 'ar' ? 'الجراحة' : 'Surgery',
      patients: 180,
      revenue: 145000,
      satisfaction: 4.8,
      efficiency: 95
    },
    {
      department: language === 'ar' ? 'القلب والأوعية' : 'Cardiology',
      patients: 220,
      revenue: 125000,
      satisfaction: 4.7,
      efficiency: 92
    },
    {
      department: language === 'ar' ? 'الأعصاب' : 'Neurology',
      patients: 165,
      revenue: 110000,
      satisfaction: 4.5,
      efficiency: 89
    },
    {
      department: language === 'ar' ? 'الأطفال' : 'Pediatrics',
      patients: 380,
      revenue: 95000,
      satisfaction: 4.6,
      efficiency: 91
    }
  ], [language]);

  // Patient demographics
  const patientDemographics = useMemo(() => [
    { age: '0-18', count: 425, percentage: 15 },
    { age: '19-35', count: 710, percentage: 25 },
    { age: '36-50', count: 852, percentage: 30 },
    { age: '51-65', count: 568, percentage: 20 },
    { age: '65+', count: 285, percentage: 10 }
  ], []);

  // Key performance indicators
  const kpiData = useMemo(() => [
    {
      id: 'patient_satisfaction',
      title: language === 'ar' ? 'رضا المرضى' : 'Patient Satisfaction',
      value: '4.6/5.0',
      target: 4.5,
      current: 4.6,
      status: 'good',
      icon: CheckCircle
    },
    {
      id: 'avg_wait_time',
      title: language === 'ar' ? 'متوسط وقت الانتظار' : 'Average Wait Time',
      value: '15 min',
      target: 20,
      current: 15,
      status: 'good',
      icon: Clock
    },
    {
      id: 'readmission_rate',
      title: language === 'ar' ? 'معدل إعادة الإدخال' : 'Readmission Rate',
      value: '8.2%',
      target: 10,
      current: 8.2,
      status: 'good',
      icon: Activity
    },
    {
      id: 'staff_turnover',
      title: language === 'ar' ? 'معدل دوران الموظفين' : 'Staff Turnover',
      value: '12%',
      target: 15,
      current: 12,
      status: 'warning',
      icon: Users
    }
  ], [language]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  const generateReport = () => {
    console.log('Generating overview report...');
  };

  const exportReport = () => {
    console.log('Exporting overview report...');
  };

  const shareReport = () => {
    console.log('Sharing overview report...');
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="summary">
                {language === 'ar' ? 'تقرير موجز' : 'Summary Report'}
              </SelectItem>
              <SelectItem value="detailed">
                {language === 'ar' ? 'تقرير مفصل' : 'Detailed Report'}
              </SelectItem>
              <SelectItem value="executive">
                {language === 'ar' ? 'تقرير تنفيذي' : 'Executive Summary'}
              </SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">
                {language === 'ar' ? 'الأسبوع' : 'This Week'}
              </SelectItem>
              <SelectItem value="month">
                {language === 'ar' ? 'الشهر' : 'This Month'}
              </SelectItem>
              <SelectItem value="quarter">
                {language === 'ar' ? 'الربع' : 'This Quarter'}
              </SelectItem>
              <SelectItem value="year">
                {language === 'ar' ? 'السنة' : 'This Year'}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={generateReport} className="gap-2">
            <Zap className="h-4 w-4" />
            {language === 'ar' ? 'إنشاء تقرير' : 'Generate Report'}
          </Button>
          <Button variant="outline" size="sm" onClick={exportReport} className="gap-2">
            <Download className="h-4 w-4" />
            {language === 'ar' ? 'تصدير' : 'Export'}
          </Button>
          <Button variant="outline" size="sm" onClick={printReport} className="gap-2">
            <Printer className="h-4 w-4" />
            {language === 'ar' ? 'طباعة' : 'Print'}
          </Button>
          <Button variant="outline" size="sm" onClick={shareReport} className="gap-2">
            <Share className="h-4 w-4" />
            {language === 'ar' ? 'مشاركة' : 'Share'}
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewMetrics.map((metric) => (
          <Card key={metric.id} className="border border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg bg-muted`}>
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                </div>
                <Badge variant={metric.trend === 'up' ? 'default' : 'secondary'} className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {metric.change}
                </Badge>
              </div>
              <h3 className="text-sm text-muted-foreground mb-1">{metric.title}</h3>
              <div className="text-2xl font-semibold text-foreground mb-3">{metric.value}</div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{language === 'ar' ? 'الهدف' : 'Target'}</span>
                  <span>{Math.round((metric.current / metric.target) * 100)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((metric.current / metric.target) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance Trend */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'اتجاه الأداء الشهري' : 'Monthly Performance Trend'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="patients" 
                  stroke="#8884d8" 
                  fillOpacity={1} 
                  fill="url(#colorPatients)"
                  name={language === 'ar' ? 'المرضى' : 'Patients'}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'أداء الأقسام' : 'Department Performance'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="department" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="patients" 
                  fill="#8884d8" 
                  name={language === 'ar' ? 'المرضى' : 'Patients'}
                />
                <Bar 
                  dataKey="satisfaction" 
                  fill="#82ca9d" 
                  name={language === 'ar' ? 'الرضا' : 'Satisfaction'}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* KPI Summary & Patient Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Performance Indicators */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'مؤشرات الأداء الرئيسية' : 'Key Performance Indicators'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {kpiData.map((kpi, index) => (
                <div key={kpi.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${kpi.status === 'good' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                      <kpi.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{kpi.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === 'ar' ? 'الهدف:' : 'Target:'} {kpi.target}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{kpi.value}</p>
                    <Badge 
                      variant={kpi.status === 'good' ? 'default' : 'secondary'}
                      className={kpi.status === 'good' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                    >
                      {kpi.status === 'good' ? (
                        language === 'ar' ? 'جيد' : 'Good'
                      ) : (
                        language === 'ar' ? 'تحذير' : 'Warning'
                      )}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Patient Demographics */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'التركيبة السكانية للمرضى' : 'Patient Demographics'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={patientDemographics}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ age, percentage }) => `${age}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {patientDemographics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Report Summary */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {language === 'ar' ? 'ملخص التقرير' : 'Report Summary'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none text-muted-foreground">
            {language === 'ar' ? (
              <div className="space-y-3">
                <p>
                  يُظهر تقرير النظرة العامة للمستشفى أداءً قوياً عبر جميع المؤشرات الرئيسية خلال الفترة المحددة.
                  ارتفع عدد زيارات المرضى بنسبة 15.3% مقارنة بالفترة السابقة، مما يعكس نمواً مستداماً في الخدمات المقدمة.
                </p>
                <p>
                  سجلت الإيرادات نمواً إيجابياً بنسبة 12.8%، مع تحقيق معظم الأقسام لأهدافها المالية.
                  قسم الجراحة يتصدر الأداء من حيث الكفاءة ورضا المرضى، بينما يحتاج قسم الطوارئ إلى تحسينات في أوقات الانتظار.
                </p>
                <p>
                  تشير مؤشرات الجودة إلى التزام المستشفى بمعايير الرعاية العالية، مع معدل رضا المرضى 4.6 من 5.
                  يُنصح بمراقبة معدل دوران الموظفين واتخاذ إجراءات لتعزيز الاحتفاظ بالكوادر المتميزة.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p>
                  The hospital overview report demonstrates strong performance across all key metrics during the specified period.
                  Patient visits increased by 15.3% compared to the previous period, reflecting sustained growth in service delivery.
                </p>
                <p>
                  Revenue showed positive growth of 12.8%, with most departments achieving their financial targets.
                  The Surgery department leads in efficiency and patient satisfaction, while Emergency needs improvements in wait times.
                </p>
                <p>
                  Quality indicators reflect the hospital's commitment to high care standards, with patient satisfaction at 4.6 out of 5.
                  It's recommended to monitor staff turnover rates and implement measures to enhance talent retention.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}