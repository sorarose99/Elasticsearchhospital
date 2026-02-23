import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area
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
  Target,
  Award,
  Download,
  Printer,
  Share
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';

interface ClinicalReportsProps {
  userRole: string;
}

export default function ClinicalReports({ userRole }: ClinicalReportsProps) {
  const { language, t, isRTL } = useLanguage();
  const [reportCategory, setReportCategory] = useState('quality-outcomes');
  const [timeFrame, setTimeFrame] = useState('quarterly');

  // Clinical quality metrics
  const qualityMetrics = useMemo(() => [
    {
      id: 'patient_satisfaction',
      title: language === 'ar' ? 'رضا المرضى' : 'Patient Satisfaction',
      value: '4.7/5.0',
      change: '+0.3',
      trend: 'up',
      target: 4.5,
      current: 4.7,
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      id: 'readmission_rate',
      title: language === 'ar' ? 'معدل إعادة الإدخال' : 'Readmission Rate',
      value: '8.2%',
      change: '-1.8%',
      trend: 'down',
      target: 10,
      current: 8.2,
      icon: Activity,
      color: 'text-green-600'
    },
    {
      id: 'mortality_rate',
      title: language === 'ar' ? 'معدل الوفيات' : 'Mortality Rate',
      value: '1.5%',
      change: '-0.3%',
      trend: 'down',
      target: 2.0,
      current: 1.5,
      icon: Heart,
      color: 'text-red-600'
    },
    {
      id: 'avg_length_stay',
      title: language === 'ar' ? 'متوسط مدة الإقامة' : 'Avg Length of Stay',
      value: '3.2 days',
      change: '-0.5 days',
      trend: 'down',
      target: 4.0,
      current: 3.2,
      icon: Bed,
      color: 'text-blue-600'
    }
  ], [language]);

  // Clinical outcomes by department
  const departmentOutcomes = useMemo(() => [
    {
      department: language === 'ar' ? 'القلب والأوعية' : 'Cardiology',
      satisfaction: 4.8,
      complications: 2.1,
      readmission: 6.5,
      mortality: 1.2,
      avgStay: 4.2,
      procedures: 145
    },
    {
      department: language === 'ar' ? 'الجراحة العامة' : 'General Surgery',
      satisfaction: 4.6,
      complications: 3.8,
      readmission: 8.9,
      mortality: 2.3,
      avgStay: 5.1,
      procedures: 198
    },
    {
      department: language === 'ar' ? 'الأعصاب' : 'Neurology',
      satisfaction: 4.5,
      complications: 4.2,
      readmission: 11.2,
      mortality: 3.1,
      avgStay: 6.8,
      procedures: 89
    },
    {
      department: language === 'ar' ? 'العظام' : 'Orthopedics',
      satisfaction: 4.9,
      complications: 1.8,
      readmission: 5.4,
      mortality: 0.5,
      avgStay: 2.9,
      procedures: 187
    },
    {
      department: language === 'ar' ? 'الطوارئ' : 'Emergency',
      satisfaction: 4.2,
      complications: 5.1,
      readmission: 15.8,
      mortality: 2.8,
      avgStay: 1.2,
      procedures: 1250
    }
  ], [language]);

  // Patient safety indicators
  const safetyIndicators = useMemo(() => [
    {
      indicator: language === 'ar' ? 'عدوى الجروح الجراحية' : 'Surgical Site Infections',
      rate: 1.2,
      benchmark: 2.0,
      trend: 'down',
      cases: 8
    },
    {
      indicator: language === 'ar' ? 'عدوى الدم المكتسبة' : 'Hospital-Acquired Bloodstream Infections',
      rate: 0.8,
      benchmark: 1.5,
      trend: 'down',
      cases: 3
    },
    {
      indicator: language === 'ar' ? 'السقوط مع إصابة' : 'Falls with Injury',
      rate: 2.1,
      benchmark: 3.0,
      trend: 'stable',
      cases: 12
    },
    {
      indicator: language === 'ar' ? 'أخطاء الأدوية' : 'Medication Errors',
      rate: 1.5,
      benchmark: 2.5,
      trend: 'up',
      cases: 9
    }
  ], [language]);

  // Treatment success rates
  const treatmentSuccess = useMemo(() => [
    {
      procedure: language === 'ar' ? 'جراحة القلب المفتوح' : 'Open Heart Surgery',
      success: 96.5,
      total: 145,
      complications: 3.5,
      mortality: 1.2
    },
    {
      procedure: language === 'ar' ? 'جراحة استبدال المفاصل' : 'Joint Replacement',
      success: 98.2,
      total: 289,
      complications: 1.8,
      mortality: 0.1
    },
    {
      procedure: language === 'ar' ? 'علاج السرطان' : 'Cancer Treatment',
      success: 89.7,
      total: 78,
      complications: 10.3,
      mortality: 4.2
    },
    {
      procedure: language === 'ar' ? 'جراحة الأعصاب' : 'Neurosurgery',
      success: 92.1,
      total: 56,
      complications: 7.9,
      mortality: 2.8
    }
  ], [language]);

  // Quality metrics radar chart data
  const qualityRadarData = useMemo(() => [
    {
      metric: language === 'ar' ? 'رضا المرضى' : 'Patient Satisfaction',
      current: 94,
      target: 90,
      benchmark: 85
    },
    {
      metric: language === 'ar' ? 'سلامة المرضى' : 'Patient Safety',
      current: 92,
      target: 95,
      benchmark: 88
    },
    {
      metric: language === 'ar' ? 'كفاءة الرعاية' : 'Care Efficiency',
      current: 88,
      target: 90,
      benchmark: 82
    },
    {
      metric: language === 'ar' ? 'جودة الرعاية' : 'Care Quality',
      current: 91,
      target: 93,
      benchmark: 87
    },
    {
      metric: language === 'ar' ? 'الامتثال' : 'Compliance',
      current: 96,
      target: 98,
      benchmark: 92
    }
  ], [language]);

  // Monthly clinical trends
  const clinicalTrends = useMemo(() => [
    { 
      month: language === 'ar' ? 'يناير' : 'Jan', 
      satisfaction: 4.5, 
      readmissions: 9.2, 
      infections: 1.8,
      mortality: 1.8 
    },
    { 
      month: language === 'ar' ? 'فبراير' : 'Feb', 
      satisfaction: 4.6, 
      readmissions: 8.8, 
      infections: 1.5,
      mortality: 1.6 
    },
    { 
      month: language === 'ar' ? 'مارس' : 'Mar', 
      satisfaction: 4.7, 
      readmissions: 8.5, 
      infections: 1.3,
      mortality: 1.4 
    },
    { 
      month: language === 'ar' ? 'أبريل' : 'Apr', 
      satisfaction: 4.6, 
      readmissions: 8.9, 
      infections: 1.6,
      mortality: 1.7 
    },
    { 
      month: language === 'ar' ? 'مايو' : 'May', 
      satisfaction: 4.8, 
      readmissions: 7.8, 
      infections: 1.2,
      mortality: 1.3 
    },
    { 
      month: language === 'ar' ? 'يونيو' : 'Jun', 
      satisfaction: 4.7, 
      readmissions: 8.2, 
      infections: 1.2,
      mortality: 1.5 
    }
  ], [language]);

  const exportClinicalReport = () => {
    console.log('Exporting clinical report...');
  };

  const printClinicalReport = () => {
    window.print();
  };

  const shareClinicalReport = () => {
    console.log('Sharing clinical report...');
  };

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={reportCategory} onValueChange={setReportCategory}>
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quality-outcomes">
                {language === 'ar' ? 'جودة النتائج' : 'Quality Outcomes'}
              </SelectItem>
              <SelectItem value="patient-safety">
                {language === 'ar' ? 'سلامة المرضى' : 'Patient Safety'}
              </SelectItem>
              <SelectItem value="clinical-indicators">
                {language === 'ar' ? 'المؤشرات السريرية' : 'Clinical Indicators'}
              </SelectItem>
              <SelectItem value="infection-control">
                {language === 'ar' ? 'مكافحة العدوى' : 'Infection Control'}
              </SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">
                {language === 'ar' ? 'شهري' : 'Monthly'}
              </SelectItem>
              <SelectItem value="quarterly">
                {language === 'ar' ? 'ربع سنوي' : 'Quarterly'}
              </SelectItem>
              <SelectItem value="annual">
                {language === 'ar' ? 'سنوي' : 'Annual'}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportClinicalReport} className="gap-2">
            <Download className="h-4 w-4" />
            {language === 'ar' ? 'تصدير' : 'Export'}
          </Button>
          <Button variant="outline" size="sm" onClick={printClinicalReport} className="gap-2">
            <Printer className="h-4 w-4" />
            {language === 'ar' ? 'طباعة' : 'Print'}
          </Button>
          <Button variant="outline" size="sm" onClick={shareClinicalReport} className="gap-2">
            <Share className="h-4 w-4" />
            {language === 'ar' ? 'مشاركة' : 'Share'}
          </Button>
        </div>
      </div>

      {/* Quality Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {qualityMetrics.map((metric) => (
          <Card key={metric.id} className="border border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg bg-muted`}>
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                </div>
                <Badge variant={metric.trend === 'up' ? 'default' : 'secondary'} className="text-xs">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {metric.change}
                </Badge>
              </div>
              <h3 className="text-sm text-muted-foreground mb-1">{metric.title}</h3>
              <div className="text-2xl font-semibold text-foreground mb-3">{metric.value}</div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{language === 'ar' ? 'الهدف' : 'Target'}</span>
                  <span>
                    {metric.id === 'readmission_rate' || metric.id === 'mortality_rate' 
                      ? Math.round((metric.target / metric.current) * 100)
                      : Math.round((metric.current / metric.target) * 100)
                    }%
                  </span>
                </div>
                <Progress 
                  value={
                    metric.id === 'readmission_rate' || metric.id === 'mortality_rate' 
                      ? (metric.target / metric.current) * 100
                      : (metric.current / metric.target) * 100
                  } 
                  className="h-2" 
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quality Metrics Radar & Clinical Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Metrics Radar Chart */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'مؤشرات الجودة الشاملة' : 'Overall Quality Metrics'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={qualityRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar
                  name={language === 'ar' ? 'الحالي' : 'Current'}
                  dataKey="current"
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
                <Radar
                  name={language === 'ar' ? 'المعيار' : 'Benchmark'}
                  dataKey="benchmark"
                  stroke="#ffc658"
                  fill="#ffc658"
                  fillOpacity={0.2}
                />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Clinical Trends */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'الاتجاهات السريرية' : 'Clinical Trends'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={clinicalTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="satisfaction" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name={language === 'ar' ? 'رضا المرضى' : 'Satisfaction'}
                />
                <Line 
                  type="monotone" 
                  dataKey="readmissions" 
                  stroke="#ff7300" 
                  strokeWidth={2}
                  name={language === 'ar' ? 'إعادة الإدخال' : 'Readmissions'}
                />
                <Line 
                  type="monotone" 
                  dataKey="infections" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name={language === 'ar' ? 'العدوى' : 'Infections'}
                />
              </LineChart>
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
              <div key={index} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-foreground">{treatment.procedure}</h4>
                    <p className="text-sm text-muted-foreground">
                      {treatment.total} {language === 'ar' ? 'حالة' : 'cases'} • 
                      {treatment.complications}% {language === 'ar' ? 'مضاعفات' : 'complications'} •
                      {treatment.mortality}% {language === 'ar' ? 'وفيات' : 'mortality'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-semibold text-green-600">
                      {treatment.success}%
                    </div>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {language === 'ar' ? 'نجاح' : 'Success'}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{language === 'ar' ? 'معدل النجاح' : 'Success Rate'}</span>
                    <span>{treatment.success}%</span>
                  </div>
                  <Progress value={treatment.success} className="h-3" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Department Clinical Outcomes */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            {language === 'ar' ? 'النتائج السريرية للأقسام' : 'Department Clinical Outcomes'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2">
                    {language === 'ar' ? 'القسم' : 'Department'}
                  </th>
                  <th className="text-center p-2">
                    {language === 'ar' ? 'رضا المرضى' : 'Satisfaction'}
                  </th>
                  <th className="text-center p-2">
                    {language === 'ar' ? 'المضاعفات' : 'Complications'}
                  </th>
                  <th className="text-center p-2">
                    {language === 'ar' ? 'إعادة الإدخال' : 'Readmission'}
                  </th>
                  <th className="text-center p-2">
                    {language === 'ar' ? 'الوفيات' : 'Mortality'}
                  </th>
                  <th className="text-center p-2">
                    {language === 'ar' ? 'مدة الإقامة' : 'Avg Stay'}
                  </th>
                  <th className="text-center p-2">
                    {language === 'ar' ? 'الإجراءات' : 'Procedures'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {departmentOutcomes.map((dept, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="p-2 font-medium">{dept.department}</td>
                    <td className="p-2 text-center">
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
                        {dept.satisfaction}/5.0
                      </Badge>
                    </td>
                    <td className="p-2 text-center">
                      <Badge variant={dept.complications < 3 ? 'default' : 'destructive'}>
                        {dept.complications}%
                      </Badge>
                    </td>
                    <td className="p-2 text-center">
                      <Badge variant={dept.readmission < 10 ? 'default' : 'destructive'}>
                        {dept.readmission}%
                      </Badge>
                    </td>
                    <td className="p-2 text-center">
                      <Badge variant={dept.mortality < 2 ? 'default' : 'destructive'}>
                        {dept.mortality}%
                      </Badge>
                    </td>
                    <td className="p-2 text-center">{dept.avgStay} days</td>
                    <td className="p-2 text-center">{dept.procedures}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Patient Safety Indicators */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {language === 'ar' ? 'مؤشرات سلامة المرضى' : 'Patient Safety Indicators'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {safetyIndicators.map((indicator, index) => (
              <div key={index} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground text-sm">{indicator.indicator}</h4>
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' ? 'المعيار:' : 'Benchmark:'} {indicator.benchmark}% • 
                      {indicator.cases} {language === 'ar' ? 'حالة' : 'cases'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-foreground">
                      {indicator.rate}%
                    </div>
                    <div className={`text-xs flex items-center gap-1 ${
                      indicator.trend === 'down' ? 'text-green-600' : 
                      indicator.trend === 'up' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {indicator.trend === 'down' && <TrendingDown className="h-3 w-3" />}
                      {indicator.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                      {indicator.trend === 'stable' && <Activity className="h-3 w-3" />}
                      {indicator.trend}
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{language === 'ar' ? 'مقابل المعيار' : 'vs Benchmark'}</span>
                    <span>
                      {indicator.rate < indicator.benchmark ? (
                        <span className="text-green-600">
                          -{((indicator.benchmark - indicator.rate) / indicator.benchmark * 100).toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-red-600">
                          +{((indicator.rate - indicator.benchmark) / indicator.benchmark * 100).toFixed(1)}%
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        indicator.rate < indicator.benchmark ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min((indicator.rate / indicator.benchmark) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Clinical Report Summary */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {language === 'ar' ? 'ملخص التقرير السريري' : 'Clinical Report Summary'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none text-muted-foreground">
            {language === 'ar' ? (
              <div className="space-y-3">
                <p>
                  يُظهر التقرير السريري تحسناً مستمراً في مؤشرات الجودة والسلامة عبر المستشفى.
                  ارتفع رضا المرضى إلى 4.7 من 5، بينما انخفض معدل إعادة الإدخال إلى 8.2% ومعدل الوفيات إلى 1.5%.
                </p>
                <p>
                  تتميز أقسام العظام والقلب بأفضل النتائج السريرية مع معدلات مضاعفات منخفضة ورضا مرضى عالي.
                  قسم الطوارئ يحتاج إلى تركيز إضافي على تقليل معدل إعادة الإدخال وتحسين رضا المرضى.
                </p>
                <p>
                  مؤشرات السلامة تُظهر أداءً جيداً مع انخفاض عدوى الجروح الجراحية وعدوى الدم تحت المعايير المرجعية.
                  يُنصح بمراقبة أخطاء الأدوية وتعزيز برامج التدريب للحد من هذه الحوادث.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p>
                  The clinical report shows continuous improvement in quality and safety indicators across the hospital.
                  Patient satisfaction increased to 4.7 out of 5, while readmission rate decreased to 8.2% and mortality rate to 1.5%.
                </p>
                <p>
                  Orthopedics and Cardiology departments excel with the best clinical outcomes, featuring low complication rates
                  and high patient satisfaction. Emergency department needs additional focus on reducing readmission rates and
                  improving patient satisfaction.
                </p>
                <p>
                  Safety indicators show good performance with surgical site infections and bloodstream infections below
                  benchmark standards. It's recommended to monitor medication errors and enhance training programs to
                  reduce these incidents.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}