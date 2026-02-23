import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Users, Activity, Clock, AlertTriangle, Heart,
  Stethoscope, Thermometer, BarChart3, Calendar,
  FileText, Shield, Bell, User, TrendingUp,
  Clock3, Plus, ChevronRight, ArrowUp, ArrowDown,
  CheckCircle2, XCircle, AlertCircle, Timer
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { motion } from 'motion/react';

interface DashboardStats {
  totalPatients: number;
  pendingTasks: number;
  emergencyCases: number;
  completedRounds: number;
  vitalsToday: number;
  overdueChecks: number;
  activeMedications: number;
  staffOnDuty: number;
}

interface RecentActivity {
  id: string;
  type: 'vital_signs' | 'medication' | 'assessment' | 'emergency';
  patient: string;
  description: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  status: 'completed' | 'pending' | 'overdue';
}

interface ShiftSummary {
  shift: 'morning' | 'afternoon' | 'night';
  startTime: string;
  endTime: string;
  patientsAssigned: number;
  tasksCompleted: number;
  totalTasks: number;
  vitalsRecorded: number;
  emergencyResponses: number;
}

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  patient: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export default function NursingDashboard() {
  const { t, isRTL } = useLanguage();
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    pendingTasks: 0,
    emergencyCases: 0,
    completedRounds: 0,
    vitalsToday: 0,
    overdueChecks: 0,
    activeMedications: 0,
    staffOnDuty: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [shiftSummary, setShiftSummary] = useState<ShiftSummary | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalPatients: 28,
        pendingTasks: 12,
        emergencyCases: 3,
        completedRounds: 8,
        vitalsToday: 45,
        overdueChecks: 2,
        activeMedications: 156,
        staffOnDuty: 15
      });

      setRecentActivities([
        {
          id: '1',
          type: 'vital_signs',
          patient: 'أحمد محمد علي',
          description: 'تم تسجيل العلامات الحيوية - ضغط الدم مرتفع',
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          priority: 'high',
          status: 'completed'
        },
        {
          id: '2',
          type: 'medication',
          patient: 'فاطمة أحمد',
          description: 'تم إعطاء جرعة الأنسولين',
          timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
          priority: 'medium',
          status: 'completed'
        },
        {
          id: '3',
          type: 'emergency',
          patient: 'عمر حسن',
          description: 'استجابة طوارئ - انخفاض مستوى الأكسجين',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          priority: 'high',
          status: 'pending'
        },
        {
          id: '4',
          type: 'assessment',
          patient: 'نورا سالم',
          description: 'تقييم عام للحالة الصحية',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          priority: 'low',
          status: 'completed'
        }
      ]);

      setShiftSummary({
        shift: 'morning',
        startTime: '06:00',
        endTime: '14:00',
        patientsAssigned: 8,
        tasksCompleted: 23,
        totalTasks: 28,
        vitalsRecorded: 12,
        emergencyResponses: 1
      });

      setAlerts([
        {
          id: '1',
          type: 'critical',
          patient: 'سعد الأحمد',
          message: 'انخفاض حاد في ضغط الدم - يتطلب تدخل فوري',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          isRead: false
        },
        {
          id: '2',
          type: 'warning',
          patient: 'ليلى محمود',
          message: 'تأخير في موعد الدواء - 30 دقيقة',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          isRead: false
        },
        {
          id: '3',
          type: 'info',
          patient: 'محمد السالم',
          message: 'طلب زيارة الطبيب النفسي',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          isRead: true
        }
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'vital_signs': return Heart;
      case 'medication': return FileText;
      case 'assessment': return Stethoscope;
      case 'emergency': return AlertTriangle;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'vital_signs': return 'text-blue-600';
      case 'medication': return 'text-green-600';
      case 'assessment': return 'text-purple-600';
      case 'emergency': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle2;
      case 'pending': return Timer;
      case 'overdue': return XCircle;
      default: return AlertCircle;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'warning': return 'border-yellow-500 bg-yellow-50';
      case 'info': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'الآن';
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
    const hours = Math.floor(diffInMinutes / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    return `منذ ${days} يوم`;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-xl">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">لوحة تحكم التمريض</h1>
            <p className="text-muted-foreground">
              نظرة شاملة على الأنشطة والمهام التمريضية
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            التقارير
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            إضافة مهمة
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي المرضى</p>
                <p className="text-3xl font-bold">{stats.totalPatients}</p>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +3 اليوم
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">المهام المعلقة</p>
                <p className="text-3xl font-bold">{stats.pendingTasks}</p>
                <div className="flex items-center text-sm text-yellow-600 mt-1">
                  <Timer className="h-3 w-3 mr-1" />
                  2 متأخرة
                </div>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">حالات الطوارئ</p>
                <p className="text-3xl font-bold">{stats.emergencyCases}</p>
                <div className="flex items-center text-sm text-red-600 mt-1">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  1 حرجة
                </div>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">القياسات اليوم</p>
                <p className="text-3xl font-bold">{stats.vitalsToday}</p>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <Heart className="h-3 w-3 mr-1" />
                  +12 جديدة
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  الأنشطة الحديثة
                </CardTitle>
                <Button variant="ghost" size="sm">
                  عرض الكل
                  <ChevronRight className="h-4 w-4 mr-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const IconComponent = getActivityIcon(activity.type);
                  const StatusIcon = getStatusIcon(activity.status);
                  
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className={`p-2 rounded-full bg-gray-100 ${getActivityColor(activity.type)}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium truncate">{activity.patient}</p>
                          <Badge className={getPriorityColor(activity.priority)} size="sm">
                            {activity.priority === 'high' ? 'عاجل' : 
                             activity.priority === 'medium' ? 'متوسط' : 'منخفض'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(activity.timestamp)}
                          </span>
                          <div className="flex items-center gap-1">
                            <StatusIcon className={`h-3 w-3 ${
                              activity.status === 'completed' ? 'text-green-600' :
                              activity.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                            }`} />
                            <span className="text-xs">
                              {activity.status === 'completed' ? 'مكتمل' :
                               activity.status === 'pending' ? 'معلق' : 'متأخر'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alerts and Shift Summary */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Critical Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                التنبيهات
                {alerts.filter(alert => !alert.isRead).length > 0 && (
                  <Badge variant="destructive" size="sm">
                    {alerts.filter(alert => !alert.isRead).length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.slice(0, 4).map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`p-3 rounded-lg border-l-4 ${getAlertColor(alert.type)} ${
                      !alert.isRead ? 'bg-opacity-100' : 'bg-opacity-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{alert.patient}</p>
                          {!alert.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatTimeAgo(alert.timestamp)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shift Summary */}
          {shiftSummary && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock3 className="h-5 w-5" />
                  ملخص الوردية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">الوردية الحالية</span>
                    <Badge variant="outline">
                      {shiftSummary.shift === 'morning' ? 'صباحية' :
                       shiftSummary.shift === 'afternoon' ? 'مسائية' : 'ليلية'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">البداية</p>
                      <p className="font-medium">{shiftSummary.startTime}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">النهاية</p>
                      <p className="font-medium">{shiftSummary.endTime}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>تقدم المهام</span>
                        <span>{shiftSummary.tasksCompleted}/{shiftSummary.totalTasks}</span>
                      </div>
                      <Progress 
                        value={(shiftSummary.tasksCompleted / shiftSummary.totalTasks) * 100}
                        className="h-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">المرضى المكلفين</p>
                        <p className="font-bold text-lg">{shiftSummary.patientsAssigned}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">القياسات المسجلة</p>
                        <p className="font-bold text-lg">{shiftSummary.vitalsRecorded}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-muted-foreground text-sm">استجابات الطوارئ</p>
                      <p className="font-bold text-lg">{shiftSummary.emergencyResponses}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Quick Stats Row */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.overdueChecks}</div>
          <div className="text-sm text-muted-foreground">فحوصات متأخرة</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-green-600">{stats.activeMedications}</div>
          <div className="text-sm text-muted-foreground">أدوية نشطة</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-purple-600">{stats.staffOnDuty}</div>
          <div className="text-sm text-muted-foreground">طاقم في الخدمة</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-orange-600">{stats.completedRounds}</div>
          <div className="text-sm text-muted-foreground">جولات مكتملة</div>
        </Card>
      </motion.div>
    </div>
  );
}