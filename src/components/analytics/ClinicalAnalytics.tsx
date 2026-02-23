import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
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
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  Heart, 
  Activity, 
  Clock,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Stethoscope,
  Thermometer,
  Pill,
  Bed,
  Shield,
  Star,
  Users,
  FileText,
  Calendar,
  Timer,
  Target,
  Award,
  Zap
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';

interface ClinicalAnalyticsProps {
  userRole: string;
}

export default function ClinicalAnalytics({ userRole }: ClinicalAnalyticsProps) {
  const { language, t, isRTL } = useLanguage();
  const [timeRange, setTimeRange] = useState('month');

  // Clinical KPIs
  const clinicalKPIs = useMemo(() => [
    {
      id: 'patient-satisfaction',
      title: language === 'ar' ? 'رضا المرضى' : 'Patient Satisfaction',
      value: '4.7/5.0',
      change: '+0.3',
      trend: 'up',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      target: 4.5,
      current: 4.7
    },
    {
      id: 'readmission-rate',
      title: language === 'ar' ? 'معدل إعادة الإدخال' : 'Readmission Rate',
      value: '8.2%',
      change: '-1.5%',
      trend: 'down',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      target: 10,
      current: 8.2
    },
    {
      id: 'avg-los',
      title: language === 'ar' ? 'متوسط مدة الإقامة' : 'Average Length of Stay',
      value: '3.2 days',
      change: '-0.5',
      trend: 'down',
      icon: Bed,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      target: 4,
      current: 3.2
    },
    {
      id: 'mortality-rate',
      title: language === 'ar' ? 'معدل الوفيات' : 'Mortality Rate',
      value: '1.8%',
      change: '-0.2%',
      trend: 'down',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      target: 2.5,
      current: 1.8
    }
  ], [language]);

  // Quality metrics
  const qualityMetrics = useMemo(() => [
    {
      metric: language === 'ar' ? 'الامتثال للبروتوكولات' : 'Protocol Compliance',
      score: 92,
      target: 95,
      color: '#8884d8'
    },
    {
      metric: language === 'ar' ? 'سلامة المرضى' : 'Patient Safety',
      score: 96,
      target: 98,
      color: '#82ca9d'
    },
    {
      metric: language === 'ar' ? 'جودة الرعاية' : 'Care Quality',
      score: 89,
      target: 90,
      color: '#ffc658'
    },
    {
      metric: language === 'ar' ? 'كفاءة العمليات' : 'Operational Efficiency',
      score: 85,
      target: 88,
      color: '#ff7300'
    },
    {
      metric: language === 'ar' ? 'رضا الطاقم' : 'Staff Satisfaction',
      score: 87,
      target: 90,
      color: '#8dd1e1'
    }
  ], [language]);

  // Clinical outcomes by department
  const departmentOutcomes = useMemo(() => [
    {
      department: language === 'ar' ? 'القلب والأوعية' : 'Cardiology',
      satisfaction: 4.8,
      complications: 2.1,
      los: 4.2,
      readmission: 6.5,
      mortality: 1.2
    },
    {
      department: language === 'ar' ? 'الجراحة' : 'Surgery',
      satisfaction: 4.6,
      complications: 3.8,
      los: 5.1,
      readmission: 8.9,
      mortality: 2.3
    },
    {
      department: language === 'ar' ? 'الأعصاب' : 'Neurology',
      satisfaction: 4.5,
      complications: 4.2,
      los: 6.8,
      readmission: 11.2,
      mortality: 3.1
    },
    {
      department: language === 'ar' ? 'العظام' : 'Orthopedics',
      satisfaction: 4.9,
      complications: 1.8,
      los: 2.9,
      readmission: 5.4,
      mortality: 0.5
    },
    {
      department: language === 'ar' ? 'الطوارئ' : 'Emergency',
      satisfaction: 4.2,
      complications: 5.1,
      los: 1.2,
      readmission: 15.8,
      mortality: 2.8
    }
  ], [language]);

  // Patient flow data
  const patientFlow = useMemo(() => [
    { 
      day: language === 'ar' ? 'الأحد' : 'Sun', 
      admissions: 45, 
      discharges: 38, 
      transfers: 12,
      emergency: 28 
    },
    { 
      day: language === 'ar' ? 'الإثنين' : 'Mon', 
      admissions: 52, 
      discharges: 44, 
      transfers: 15,
      emergency: 35 
    },
    { 
      day: language === 'ar' ? 'الثلاثاء' : 'Tue', 
      admissions: 48, 
      discharges: 41, 
      transfers: 18,
      emergency: 31 
    },
    { 
      day: language === 'ar' ? 'الأربعاء' : 'Wed', 
      admissions: 55, 
      discharges: 47, 
      transfers: 14,
      emergency: 29 
    },
    { 
      day: language === 'ar' ? 'الخميس' : 'Thu', 
      admissions: 49, 
      discharges: 43, 
      transfers: 16,
      emergency: 33 
    },
    { 
      day: language === 'ar' ? 'الجمعة' : 'Fri', 
      admissions: 42, 
      discharges: 39, 
      transfers: 11,
      emergency: 25 
    },
    { 
      day: language === 'ar' ? 'السبت' : 'Sat', 
      admissions: 38, 
      discharges: 35, 
      transfers: 9,
      emergency: 22 
    }
  ], [language]);

  // Treatment success rates
  const treatmentSuccess = useMemo(() => [
    { 
      treatment: language === 'ar' ? 'جراحة القلب' : 'Cardiac Surgery', 
      success: 96.5, 
      total: 145,
      complications: 3.5 
    },
    { 
      treatment: language === 'ar' ? 'جراحة العظام' : 'Orthopedic Surgery', 
      success: 98.2, 
      total: 289,
      complications: 1.8 
    },
    { 
      treatment: language === 'ar' ? 'علاج السرطان' : 'Cancer Treatment', 
      success: 89.7, 
      total: 78,
      complications: 10.3 
    },
    { 
      treatment: language === 'ar' ? 'جراحة الأعصاب' : 'Neurosurgery', 
      success: 92.1, 
      total: 56,
      complications: 7.9 
    },
    { 
      treatment: language === 'ar' ? 'طب الطوارئ' : 'Emergency Medicine', 
      success: 94.8, 
      total: 456,
      complications: 5.2 
    }
  ], [language]);

  // Infection rates
  const infectionRates = useMemo(() => [
    {
      type: language === 'ar' ? 'عدوى الجروح الجراحية' : 'Surgical Site Infections',
      rate: 1.2,
      benchmark: 2.0,
      trend: 'down'
    },
    {
      type: language === 'ar' ? 'عدوى الدم' : 'Bloodstream Infections',
      rate: 0.8,
      benchmark: 1.5,
      trend: 'down'
    },
    {
      type: language === 'ar' ? 'عدوى المسالك البولية' : 'Urinary Tract Infections',
      rate: 2.1,
      benchmark: 3.0,
      trend: 'stable'
    },
    {
      type: language === 'ar' ? 'التهاب الرئة' : 'Pneumonia',
      rate: 1.5,
      benchmark: 2.5,
      trend: 'up'
    }
  ], [language]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  return (
    <div className="space-y-6">
      {/* Clinical KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {clinicalKPIs.map((kpi) => (
          <Card key={kpi.id} className="border border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
                <Badge variant={kpi.trend === 'down' ? 'default' : 'secondary'} className="text-xs">
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {kpi.change}
                </Badge>
              </div>
              <h3 className="text-sm text-muted-foreground mb-1">{kpi.title}</h3>
              <div className="text-2xl font-semibold text-foreground mb-3">{kpi.value}</div>
              {kpi.target && kpi.current && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{language === 'ar' ? 'الهدف' : 'Target'}</span>
                    <span>
                      {kpi.id === 'readmission-rate' || kpi.id === 'mortality-rate' 
                        ? Math.round((kpi.target / kpi.current) * 100)
                        : Math.round((kpi.current / kpi.target) * 100)
                      }%
                    </span>
                  </div>
                  <Progress 
                    value={
                      kpi.id === 'readmission-rate' || kpi.id === 'mortality-rate' 
                        ? (kpi.target / kpi.current) * 100
                        : (kpi.current / kpi.target) * 100
                    } 
                    className="h-2" 
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {language === 'ar' ? 'المؤشرات السريرية' : 'Clinical Indicators'}
        </h2>
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

      {/* Quality Metrics Radar & Patient Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Metrics Radar Chart */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'مؤشرات الجودة' : 'Quality Metrics'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={qualityMetrics}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar
                  name={language === 'ar' ? 'النتيجة الحالية' : 'Current Score'}
                  dataKey="score"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Radar
                  name={language === 'ar' ? 'الهدف' : 'Target'}
                  dataKey="target"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.3}
                />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Patient Flow */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'تدفق المرضى الأسبوعي' : 'Weekly Patient Flow'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={patientFlow}>
                <defs>
                  <linearGradient id="colorAdmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDischarges" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="admissions" 
                  stackId="1"
                  stroke="#8884d8" 
                  fill="url(#colorAdmissions)"
                  name={language === 'ar' ? 'الإدخال' : 'Admissions'}
                />
                <Area 
                  type="monotone" 
                  dataKey="discharges" 
                  stackId="2"
                  stroke="#82ca9d" 
                  fill="url(#colorDischarges)"
                  name={language === 'ar' ? 'التخريج' : 'Discharges'}
                />
                <Area 
                  type="monotone" 
                  dataKey="emergency" 
                  stackId="3"
                  stroke="#ff7300" 
                  fill="#ff7300"
                  name={language === 'ar' ? 'الطوارئ' : 'Emergency'}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Treatment Success Rates */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            {language === 'ar' ? 'معدلات نجاح العلاج' : 'Treatment Success Rates'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {treatmentSuccess.map((treatment, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <div className="font-medium text-foreground">{treatment.treatment}</div>
                  <div className="text-sm text-muted-foreground">
                    {treatment.total} {language === 'ar' ? 'حالة' : 'cases'} • 
                    {treatment.complications}% {language === 'ar' ? 'مضاعفات' : 'complications'}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold text-foreground text-xl">
                      {treatment.success}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'نجاح' : 'success'}
                    </div>
                  </div>
                  <div className="w-20">
                    <Progress value={treatment.success} className="h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Department Outcomes & Infection Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Clinical Outcomes */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'النتائج السريرية للأقسام' : 'Department Clinical Outcomes'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentOutcomes}>
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
                  dataKey="satisfaction" 
                  fill="#8884d8" 
                  name={language === 'ar' ? 'الرضا' : 'Satisfaction'}
                />
                <Bar 
                  dataKey="readmission" 
                  fill="#ff7300" 
                  name={language === 'ar' ? 'إعادة الإدخال' : 'Readmission'}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Infection Rates */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'معدلات العدوى' : 'Infection Rates'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {infectionRates.map((infection, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-foreground text-sm">{infection.type}</div>
                    <div className="text-xs text-muted-foreground">
                      {language === 'ar' ? 'المعيار:' : 'Benchmark:'} {infection.benchmark}%
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-semibold text-foreground">{infection.rate}%</div>
                      <div className={`text-xs flex items-center gap-1 ${
                        infection.trend === 'down' ? 'text-green-600' : 
                        infection.trend === 'up' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {infection.trend === 'down' && <TrendingDown className="h-3 w-3" />}
                        {infection.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                        {infection.trend === 'stable' && <Timer className="h-3 w-3" />}
                        {infection.trend}
                      </div>
                    </div>
                    <Badge 
                      variant={infection.rate < infection.benchmark ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {infection.rate < infection.benchmark ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 mr-1" />
                      )}
                      {infection.rate < infection.benchmark ? 
                        (language === 'ar' ? 'جيد' : 'Good') : 
                        (language === 'ar' ? 'يحتاج تحسين' : 'Needs Improvement')
                      }
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}