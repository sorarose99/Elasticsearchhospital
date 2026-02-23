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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart
} from 'recharts';
import { 
  Settings, 
  Users, 
  Clock,
  Target,
  TrendingUp,
  TrendingDown,
  Activity,
  Bed,
  UserCheck,
  Zap,
  Package,
  Wrench,
  Building,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Download,
  Printer,
  Share,
  FileText,
  BarChart3,
  Timer,
  Gauge
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';

interface OperationalReportsProps {
  userRole: string;
}

export default function OperationalReports({ userRole }: OperationalReportsProps) {
  const { language, t, isRTL } = useLanguage();
  const [reportCategory, setReportCategory] = useState('efficiency');
  const [timeFrame, setTimeFrame] = useState('monthly');

  // Operational efficiency metrics
  const efficiencyMetrics = useMemo(() => [
    {
      id: 'bed_turnover',
      title: language === 'ar' ? 'معدل دوران الأسرة' : 'Bed Turnover Rate',
      value: '2.3',
      change: '+0.2',
      trend: 'up',
      unit: language === 'ar' ? 'مرة/شهر' : 'times/month',
      target: 2.5,
      current: 2.3,
      icon: Bed,
      color: 'text-blue-600'
    },
    {
      id: 'staff_utilization',
      title: language === 'ar' ? 'استغلال الطاقم' : 'Staff Utilization',
      value: '87%',
      change: '+3%',
      trend: 'up',
      unit: '%',
      target: 90,
      current: 87,
      icon: UserCheck,
      color: 'text-green-600'
    },
    {
      id: 'equipment_uptime',
      title: language === 'ar' ? 'وقت تشغيل المعدات' : 'Equipment Uptime',
      value: '96.2%',
      change: '+1.5%',
      trend: 'up',
      unit: '%',
      target: 95,
      current: 96.2,
      icon: Wrench,
      color: 'text-purple-600'
    },
    {
      id: 'avg_wait_time',
      title: language === 'ar' ? 'متوسط وقت الانتظار' : 'Average Wait Time',
      value: '18 min',
      change: '-3 min',
      trend: 'down',
      unit: 'min',
      target: 20,
      current: 18,
      icon: Clock,
      color: 'text-orange-600'
    }
  ], [language]);

  // Department productivity data
  const departmentProductivity = useMemo(() => [
    {
      department: language === 'ar' ? 'الطوارئ' : 'Emergency',
      patients: 1250,
      capacity: 1400,
      utilization: 89.3,
      avgWait: 25,
      efficiency: 85,
      staff: 24
    },
    {
      department: language === 'ar' ? 'العيادات الخارجية' : 'Outpatient',
      patients: 2850,
      capacity: 3200,
      utilization: 89.1,
      avgWait: 15,
      efficiency: 92,
      staff: 32
    },
    {
      department: language === 'ar' ? 'الجراحة' : 'Surgery',
      patients: 280,
      capacity: 320,
      utilization: 87.5,
      avgWait: 45,
      efficiency: 94,
      staff: 18
    },
    {
      department: language === 'ar' ? 'الأشعة' : 'Radiology',
      patients: 1850,
      capacity: 2000,
      utilization: 92.5,
      avgWait: 12,
      efficiency: 88,
      staff: 16
    },
    {
      department: language === 'ar' ? 'المختبر' : 'Laboratory',
      patients: 3200,
      capacity: 3500,
      utilization: 91.4,
      avgWait: 8,
      efficiency: 95,
      staff: 14
    }
  ], [language]);

  // Resource utilization data
  const resourceUtilization = useMemo(() => [
    { 
      resource: language === 'ar' ? 'أسرة العناية المركزة' : 'ICU Beds', 
      total: 24, 
      occupied: 18, 
      utilization: 75,
      waitlist: 3
    },
    { 
      resource: language === 'ar' ? 'أسرة عامة' : 'General Beds', 
      total: 180, 
      occupied: 142, 
      utilization: 78.9,
      waitlist: 8
    },
    { 
      resource: language === 'ar' ? 'غرف العمليات' : 'Operating Rooms', 
      total: 12, 
      occupied: 9, 
      utilization: 75,
      waitlist: 5
    },
    { 
      resource: language === 'ar' ? 'أجهزة الأشعة' : 'Imaging Equipment', 
      total: 8, 
      occupied: 7, 
      utilization: 87.5,
      waitlist: 12
    }
  ], [language]);

  // Staff performance metrics
  const staffMetrics = useMemo(() => [
    {
      category: language === 'ar' ? 'الأطباء' : 'Physicians',
      total: 45,
      present: 42,
      productivity: 92,
      overtime: 8.5,
      satisfaction: 4.3
    },
    {
      category: language === 'ar' ? 'الممرضون' : 'Nurses',
      total: 120,
      present: 115,
      productivity: 89,
      overtime: 12.2,
      satisfaction: 4.1
    },
    {
      category: language === 'ar' ? 'الفنيون' : 'Technicians',
      total: 65,
      present: 58,
      productivity: 85,
      overtime: 6.8,
      satisfaction: 4.2
    },
    {
      category: language === 'ar' ? 'الإداريون' : 'Administrative',
      total: 35,
      present: 34,
      productivity: 88,
      overtime: 4.2,
      satisfaction: 4.4
    }
  ], [language]);

  // Monthly operational trends
  const operationalTrends = useMemo(() => [
    { 
      month: language === 'ar' ? 'يناير' : 'Jan', 
      bedOccupancy: 76, 
      staffUtilization: 84, 
      equipment: 94,
      waitTime: 22,
      efficiency: 83
    },
    { 
      month: language === 'ar' ? 'فبراير' : 'Feb', 
      bedOccupancy: 78, 
      staffUtilization: 86, 
      equipment: 95,
      waitTime: 20,
      efficiency: 85
    },
    { 
      month: language === 'ar' ? 'مارس' : 'Mar', 
      bedOccupancy: 81, 
      staffUtilization: 88, 
      equipment: 96,
      waitTime: 19,
      efficiency: 87
    },
    { 
      month: language === 'ar' ? 'أبريل' : 'Apr', 
      bedOccupancy: 79, 
      staffUtilization: 85, 
      equipment: 94,
      waitTime: 21,
      efficiency: 86
    },
    { 
      month: language === 'ar' ? 'مايو' : 'May', 
      bedOccupancy: 83, 
      staffUtilization: 89, 
      equipment: 97,
      waitTime: 18,
      efficiency: 89
    },
    { 
      month: language === 'ar' ? 'يونيو' : 'Jun', 
      bedOccupancy: 78, 
      staffUtilization: 87, 
      equipment: 96,
      waitTime: 18,
      efficiency: 88
    }
  ], [language]);

  // Equipment maintenance data
  const maintenanceData = useMemo(() => [
    {
      equipment: language === 'ar' ? 'أجهزة MRI' : 'MRI Machines',
      scheduled: 12,
      completed: 11,
      overdue: 1,
      cost: 45000,
      uptime: 96.5
    },
    {
      equipment: language === 'ar' ? 'أجهزة CT' : 'CT Scanners',
      scheduled: 8,
      completed: 8,
      overdue: 0,
      cost: 32000,
      uptime: 98.2
    },
    {
      equipment: language === 'ar' ? 'معدات المختبر' : 'Lab Equipment',
      scheduled: 24,
      completed: 22,
      overdue: 2,
      cost: 18500,
      uptime: 94.8
    },
    {
      equipment: language === 'ar' ? 'أجهزة التنفس' : 'Ventilators',
      scheduled: 16,
      completed: 15,
      overdue: 1,
      cost: 28000,
      uptime: 97.1
    }
  ], [language]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  const exportOperationalReport = () => {
    console.log('Exporting operational report...');
  };

  const printOperationalReport = () => {
    window.print();
  };

  const shareOperationalReport = () => {
    console.log('Sharing operational report...');
  };

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={reportCategory} onValueChange={setReportCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="efficiency">
                {language === 'ar' ? 'كفاءة العمليات' : 'Operational Efficiency'}
              </SelectItem>
              <SelectItem value="resources">
                {language === 'ar' ? 'استغلال الموارد' : 'Resource Utilization'}
              </SelectItem>
              <SelectItem value="staff-performance">
                {language === 'ar' ? 'أداء الطاقم' : 'Staff Performance'}
              </SelectItem>
              <SelectItem value="maintenance">
                {language === 'ar' ? 'الصيانة والمعدات' : 'Maintenance & Equipment'}
              </SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">
                {language === 'ar' ? 'أسبوعي' : 'Weekly'}
              </SelectItem>
              <SelectItem value="monthly">
                {language === 'ar' ? 'شهري' : 'Monthly'}
              </SelectItem>
              <SelectItem value="quarterly">
                {language === 'ar' ? 'ربع سنوي' : 'Quarterly'}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportOperationalReport} className="gap-2">
            <Download className="h-4 w-4" />
            {language === 'ar' ? 'تصدير' : 'Export'}
          </Button>
          <Button variant="outline" size="sm" onClick={printOperationalReport} className="gap-2">
            <Printer className="h-4 w-4" />
            {language === 'ar' ? 'طباعة' : 'Print'}
          </Button>
          <Button variant="outline" size="sm" onClick={shareOperationalReport} className="gap-2">
            <Share className="h-4 w-4" />
            {language === 'ar' ? 'مشاركة' : 'Share'}
          </Button>
        </div>
      </div>

      {/* Efficiency Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {efficiencyMetrics.map((metric) => (
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
                    {Math.round((metric.current / metric.target) * 100)}%
                  </span>
                </div>
                <Progress value={(metric.current / metric.target) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Operational Trends & Resource Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operational Trends */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'اتجاهات العمليات' : 'Operational Trends'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={operationalTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="bedOccupancy" 
                  stackId="1"
                  stroke="#8884d8" 
                  fill="#8884d8"
                  fillOpacity={0.6}
                  name={language === 'ar' ? 'إشغال الأسرة' : 'Bed Occupancy'}
                />
                <Line 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#82ca9d" 
                  strokeWidth={3}
                  name={language === 'ar' ? 'الكفاءة' : 'Efficiency'}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Resource Utilization */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'استغلال الموارد' : 'Resource Utilization'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resourceUtilization.map((resource, index) => (
                <div key={index} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">{resource.resource}</h4>
                    <Badge variant="outline">
                      {resource.occupied}/{resource.total}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {language === 'ar' ? 'الاستغلال' : 'Utilization'}
                      </span>
                      <span className="font-semibold">{resource.utilization}%</span>
                    </div>
                    <Progress value={resource.utilization} className="h-2" />
                    {resource.waitlist > 0 && (
                      <div className="flex items-center gap-1 text-xs text-orange-600">
                        <AlertTriangle className="h-3 w-3" />
                        {resource.waitlist} {language === 'ar' ? 'في الانتظار' : 'waiting'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Productivity */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            {language === 'ar' ? 'إنتاجية الأقسام' : 'Department Productivity'}
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
                    {language === 'ar' ? 'المرضى' : 'Patients'}
                  </th>
                  <th className="text-center p-2">
                    {language === 'ar' ? 'السعة' : 'Capacity'}
                  </th>
                  <th className="text-center p-2">
                    {language === 'ar' ? 'الاستغلال' : 'Utilization'}
                  </th>
                  <th className="text-center p-2">
                    {language === 'ar' ? 'وقت الانتظار' : 'Wait Time'}
                  </th>
                  <th className="text-center p-2">
                    {language === 'ar' ? 'الكفاءة' : 'Efficiency'}
                  </th>
                  <th className="text-center p-2">
                    {language === 'ar' ? 'الطاقم' : 'Staff'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {departmentProductivity.map((dept, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="p-2 font-medium">{dept.department}</td>
                    <td className="p-2 text-center">{dept.patients}</td>
                    <td className="p-2 text-center">{dept.capacity}</td>
                    <td className="p-2 text-center">
                      <Badge variant={dept.utilization > 85 ? 'default' : 'secondary'}>
                        {dept.utilization}%
                      </Badge>
                    </td>
                    <td className="p-2 text-center">{dept.avgWait} min</td>
                    <td className="p-2 text-center">
                      <Badge variant={dept.efficiency > 90 ? 'default' : 'secondary'}>
                        {dept.efficiency}%
                      </Badge>
                    </td>
                    <td className="p-2 text-center">{dept.staff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Staff Performance Metrics */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {language === 'ar' ? 'مقاييس أداء الطاقم' : 'Staff Performance Metrics'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {staffMetrics.map((staff, index) => (
              <div key={index} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-foreground">{staff.category}</h4>
                  <Badge variant="outline">
                    {staff.present}/{staff.total}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'الإنتاجية' : 'Productivity'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{staff.productivity}%</span>
                      <div className="w-20">
                        <Progress value={staff.productivity} className="h-2" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'الرضا الوظيفي' : 'Job Satisfaction'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{staff.satisfaction}/5.0</span>
                      <div className="w-20">
                        <Progress value={(staff.satisfaction / 5) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'ساعات إضافية' : 'Overtime Hours'}
                    </span>
                    <Badge 
                      variant={staff.overtime > 10 ? 'destructive' : 'default'}
                      className="text-xs"
                    >
                      {staff.overtime}%
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Equipment Maintenance Status */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            {language === 'ar' ? 'حالة صيانة المعدات' : 'Equipment Maintenance Status'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {maintenanceData.map((equipment, index) => (
              <div key={index} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-foreground">{equipment.equipment}</h4>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'وقت التشغيل:' : 'Uptime:'} {equipment.uptime}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      ${equipment.cost.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' ? 'تكلفة الصيانة' : 'Maintenance Cost'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-foreground">{equipment.scheduled}</div>
                    <div className="text-muted-foreground">
                      {language === 'ar' ? 'مجدولة' : 'Scheduled'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-600">{equipment.completed}</div>
                    <div className="text-muted-foreground">
                      {language === 'ar' ? 'مكتملة' : 'Completed'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`font-semibold ${equipment.overdue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {equipment.overdue}
                    </div>
                    <div className="text-muted-foreground">
                      {language === 'ar' ? 'متأخرة' : 'Overdue'}
                    </div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{language === 'ar' ? 'معدل الإنجاز' : 'Completion Rate'}</span>
                    <span>{Math.round((equipment.completed / equipment.scheduled) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(equipment.completed / equipment.scheduled) * 100} 
                    className="h-2" 
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Operational Report Summary */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {language === 'ar' ? 'ملخص التقرير التشغيلي' : 'Operational Report Summary'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none text-muted-foreground">
            {language === 'ar' ? (
              <div className="space-y-3">
                <p>
                  يُظهر التقرير التشغيلي كفاءة عالية في معظم مجالات المستشفى مع تحسينات ملحوظة في أوقات الانتظار
                  واستغلال الموارد. معدل دوران الأسرة 2.3 مرة شهرياً يقترب من الهدف المحدد، بينما وصل استغلال الطاقم إلى 87%.
                </p>
                <p>
                  تتميز أقسام المختبر والعيادات الخارجية بأعلى مستويات الكفاءة التشغيلية مع معدلات استغلال تتجاوز 90%.
                  قسم الطوارئ يحتاج إلى تحسين في إدارة أوقات الانتظار وتعزيز الكفاءة لتحقيق الأهداف المحددة.
                </p>
                <p>
                  حالة المعدات ممتازة مع وقت تشغيل يبلغ 96.2% ومعدلات صيانة منتظمة. يُنصح بمراقبة المعدات المتأخرة في الصيانة
                  وتطوير خطط وقائية أكثر شمولية لتجنب الأعطال المفاجئة وتحسين الكفاءة التشغيلية العامة.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p>
                  The operational report demonstrates high efficiency across most hospital areas with notable improvements in
                  wait times and resource utilization. Bed turnover rate of 2.3 times monthly approaches the target, while
                  staff utilization reached 87%.
                </p>
                <p>
                  Laboratory and Outpatient departments excel with the highest operational efficiency levels, achieving
                  utilization rates exceeding 90%. Emergency department needs improvement in wait time management and
                  efficiency enhancement to meet set targets.
                </p>
                <p>
                  Equipment status is excellent with 96.2% uptime and regular maintenance schedules. It's recommended to
                  monitor overdue maintenance equipment and develop more comprehensive preventive plans to avoid sudden
                  failures and improve overall operational efficiency.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}