import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
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
  Area
} from 'recharts';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  Heart,
  AlertTriangle,
  CheckCircle,
  Bed,
  UserCheck,
  Stethoscope,
  FileText,
  Star,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';

interface OverviewAnalyticsProps {
  userRole: string;
}

export default function OverviewAnalytics({ userRole }: OverviewAnalyticsProps) {
  const { language, t, isRTL } = useLanguage();

  // Sample data for charts
  const monthlyPatients = useMemo(() => [
    { month: language === 'ar' ? 'يناير' : 'Jan', patients: 240, appointments: 320, revenue: 45000 },
    { month: language === 'ar' ? 'فبراير' : 'Feb', patients: 280, appointments: 380, revenue: 52000 },
    { month: language === 'ar' ? 'مارس' : 'Mar', patients: 320, appointments: 450, revenue: 61000 },
    { month: language === 'ar' ? 'أبريل' : 'Apr', patients: 290, appointments: 420, revenue: 58000 },
    { month: language === 'ar' ? 'مايو' : 'May', patients: 350, appointments: 480, revenue: 68000 },
    { month: language === 'ar' ? 'يونيو' : 'Jun', patients: 380, appointments: 520, revenue: 75000 }
  ], [language]);

  const departmentStats = useMemo(() => [
    { 
      department: language === 'ar' ? 'القلب والأوعية' : 'Cardiology', 
      patients: 120, 
      revenue: 25000, 
      satisfaction: 4.8,
      color: '#8884d8' 
    },
    { 
      department: language === 'ar' ? 'الأعصاب' : 'Neurology', 
      patients: 95, 
      revenue: 22000, 
      satisfaction: 4.6,
      color: '#82ca9d' 
    },
    { 
      department: language === 'ar' ? 'الجراحة' : 'Surgery', 
      patients: 80, 
      revenue: 35000, 
      satisfaction: 4.9,
      color: '#ffc658' 
    },
    { 
      department: language === 'ar' ? 'الطوارئ' : 'Emergency', 
      patients: 200, 
      revenue: 18000, 
      satisfaction: 4.3,
      color: '#ff7300' 
    },
    { 
      department: language === 'ar' ? 'الأطفال' : 'Pediatrics', 
      patients: 150, 
      revenue: 20000, 
      satisfaction: 4.7,
      color: '#8dd1e1' 
    }
  ], [language]);

  const performanceMetrics = useMemo(() => [
    {
      id: 'patient-satisfaction',
      title: language === 'ar' ? 'رضا المرضى' : 'Patient Satisfaction',
      value: '4.7',
      unit: '/5',
      target: 4.5,
      current: 4.7,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      trend: 'up',
      change: '+0.2'
    },
    {
      id: 'avg-wait-time',
      title: language === 'ar' ? 'متوسط وقت الانتظار' : 'Average Wait Time',
      value: '12',
      unit: language === 'ar' ? ' دقيقة' : ' min',
      target: 15,
      current: 12,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: 'down',
      change: '-3 min'
    },
    {
      id: 'bed-occupancy',
      title: language === 'ar' ? 'نسبة إشغال الأسرة' : 'Bed Occupancy',
      value: '78',
      unit: '%',
      target: 80,
      current: 78,
      icon: Bed,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: 'up',
      change: '+5%'
    },
    {
      id: 'staff-utilization',
      title: language === 'ar' ? 'استغلال الطاقم' : 'Staff Utilization',
      value: '85',
      unit: '%',
      target: 90,
      current: 85,
      icon: UserCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: 'up',
      change: '+2%'
    }
  ], [language]);

  const recentActivities = useMemo(() => [
    {
      id: 1,
      type: 'appointment',
      title: language === 'ar' ? 'موعد جديد مع د. أحمد محمد' : 'New appointment with Dr. Ahmed Mohamed',
      time: '2 ' + (language === 'ar' ? 'دقائق مضت' : 'minutes ago'),
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'emergency',
      title: language === 'ar' ? 'حالة طوارئ جديدة في القسم' : 'New emergency case in department',
      time: '5 ' + (language === 'ar' ? 'دقائق مضت' : 'minutes ago'),
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      id: 3,
      type: 'discharge',
      title: language === 'ar' ? 'تم تخريج المريض محمد علي' : 'Patient Mohamed Ali discharged',
      time: '10 ' + (language === 'ar' ? 'دقائق مضت' : 'minutes ago'),
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 4,
      type: 'lab',
      title: language === 'ar' ? 'تحليل مختبري جديد جاهز' : 'New lab result ready',
      time: '15 ' + (language === 'ar' ? 'دقيقة مضت' : 'minutes ago'),
      icon: FileText,
      color: 'text-orange-600'
    }
  ], [language]);

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric) => (
          <Card key={metric.id} className="border border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
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
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-semibold text-foreground">{metric.value}</span>
                <span className="text-sm text-muted-foreground">{metric.unit}</span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{language === 'ar' ? 'التقدم' : 'Progress'}</span>
                  <span>{Math.round((metric.current / metric.target) * 100)}%</span>
                </div>
                <Progress 
                  value={(metric.current / metric.target) * 100} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'الاتجاهات الشهرية' : 'Monthly Trends'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyPatients}>
                <defs>
                  <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
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
                <Area 
                  type="monotone" 
                  dataKey="appointments" 
                  stroke="#82ca9d" 
                  fillOpacity={1} 
                  fill="url(#colorAppointments)"
                  name={language === 'ar' ? 'المواعيد' : 'Appointments'}
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
              <BarChart data={departmentStats}>
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
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Revenue Distribution */}
        <Card className="border border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'توزيع الإيرادات حسب القسم' : 'Revenue Distribution by Department'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentStats.map((dept, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: dept.color }}
                    />
                    <span className="font-medium">{dept.department}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      ${dept.revenue.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {dept.patients} {language === 'ar' ? 'مريض' : 'patients'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'الأنشطة الحديثة' : 'Recent Activities'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className={`p-1 rounded-full bg-muted`}>
                    <activity.icon className={`h-3 w-3 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-2 gap-2"
              >
                {language === 'ar' ? 'عرض الكل' : 'View All'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}