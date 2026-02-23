import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Users,
  CalendarDays,
  Timer,
  BarChart3,
  Filter,
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ClockIcon,
  UserCheck,
  CalendarCheck,
  Stethoscope
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';

// Import the individual components
import Schedule from './Schedule';
import TodaysAppointments from './TodaysAppointments';
import WaitingList from './WaitingList';
import AppointmentScheduler from './AppointmentScheduler';

interface AppointmentsDashboardProps {
  isDemoMode?: boolean;
}

const AppointmentsDashboard: React.FC<AppointmentsDashboardProps> = ({ isDemoMode = false }) => {
  const { t, language, isRTL } = useLanguage();
  const { effectiveTheme } = useTheme();

  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState({
    todayTotal: 12,
    todayCompleted: 8,
    todayPending: 3,
    todayCancelled: 1,
    waitingList: 7,
    avgWaitTime: 25,
    doctorsAvailable: 5,
    urgentCases: 2
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: '1',
      type: 'appointment_completed',
      message: 'تم إكمال موعد علي أحمد مع د. محمد السالم',
      time: '5 دقائق مضت',
      icon: CheckCircle2,
      color: 'text-green-600'
    },
    {
      id: '2',
      type: 'patient_arrived',
      message: 'وصلت فاطمة محمد وتنتظر د. سارة جونسون',
      time: '10 دقائق مضت',
      icon: UserCheck,
      color: 'text-blue-600'
    },
    {
      id: '3',
      type: 'urgent_case',
      message: 'حالة طوارئ جديدة - طفل يعاني من حمى عالية',
      time: '15 دقيقة مضت',
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      id: '4',
      type: 'appointment_scheduled',
      message: 'تم جدولة موعد جديد لمحمد علي غداً',
      time: '20 دقيقة مضت',
      icon: CalendarCheck,
      color: 'text-purple-600'
    }
  ]);

  const formatTime = () => {
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date());
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'overview': return <BarChart3 className="h-4 w-4" />;
      case 'schedule': return <Plus className="h-4 w-4" />;
      case 'today': return <CalendarDays className="h-4 w-4" />;
      case 'waiting': return <Users className="h-4 w-4" />;
      case 'all': return <CalendarIcon className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-primary">{t('appointments.management')}</h1>
          <p className="text-muted-foreground">{formatTime()}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setActiveTab('schedule')}
          >
            <Plus className="h-4 w-4" />
            {t('appointments.schedule')}
          </Button>
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <TabsList className="grid w-full grid-cols-5 lg:w-fit lg:grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              {getTabIcon('overview')}
              <span className="hidden sm:inline">{t('appointments.overview')}</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              {getTabIcon('schedule')}
              <span className="hidden sm:inline">{t('appointments.schedule')}</span>
            </TabsTrigger>
            <TabsTrigger value="today" className="flex items-center gap-2">
              {getTabIcon('today')}
              <span className="hidden sm:inline">{t('appointments.today')}</span>
            </TabsTrigger>
            <TabsTrigger value="waiting" className="flex items-center gap-2">
              {getTabIcon('waiting')}
              <span className="hidden sm:inline">{t('appointments.waitingList')}</span>
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              {getTabIcon('all')}
              <span className="hidden sm:inline">{t('appointments.allAppointments')}</span>
            </TabsTrigger>
          </TabsList>
        </motion.div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('appointments.todayTotal')}</p>
                      <p className="text-2xl font-bold text-blue-600">{dashboardStats.todayTotal}</p>
                    </div>
                    <CalendarDays className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('appointments.completed')}</p>
                      <p className="text-2xl font-bold text-green-600">{dashboardStats.todayCompleted}</p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('appointments.pending')}</p>
                      <p className="text-2xl font-bold text-yellow-600">{dashboardStats.todayPending}</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('appointments.cancelled')}</p>
                      <p className="text-2xl font-bold text-red-600">{dashboardStats.todayCancelled}</p>
                    </div>
                    <CalendarIcon className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('appointments.waitingList')}</p>
                      <p className="text-2xl font-bold text-purple-600">{dashboardStats.waitingList}</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('appointments.avgWait')}</p>
                      <p className="text-2xl font-bold text-orange-600">{dashboardStats.avgWaitTime}m</p>
                    </div>
                    <Timer className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('appointments.doctorsAvailable')}</p>
                      <p className="text-2xl font-bold text-cyan-600">{dashboardStats.doctorsAvailable}</p>
                    </div>
                    <Stethoscope className="h-8 w-8 text-cyan-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('appointments.urgent')}</p>
                      <p className="text-2xl font-bold text-red-700">{dashboardStats.urgentCases}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-700" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {t('appointments.quickActions')}
                  </CardTitle>
                  <CardDescription>
                    {t('appointments.quickActionsDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setActiveTab('schedule')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('appointments.scheduleNew')}
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setActiveTab('today')}
                    >
                      <CalendarDays className="h-4 w-4 mr-2" />
                      {t('appointments.viewToday')}
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setActiveTab('waiting')}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      {t('appointments.manageQueue')}
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setActiveTab('all')}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      {t('appointments.searchAll')}
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    {t('appointments.recentActivity')}
                  </CardTitle>
                  <CardDescription>
                    {t('appointments.recentActivityDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className={`p-2 rounded-full bg-background ${activity.color}`}>
                          <activity.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Today's Schedule Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClockIcon className="h-5 w-5" />
                  {t('appointments.todaySchedule')}
                </CardTitle>
                <CardDescription>
                  {t('appointments.upcomingAppointments')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Next 3 appointments preview */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-primary">09:30</span>
                      <Badge variant="outline" className="text-xs">متابعة</Badge>
                    </div>
                    <h4 className="font-medium">فاطمة محمد الخالد</h4>
                    <p className="text-sm text-muted-foreground">د. أحمد محمد السالم</p>
                    <p className="text-xs text-muted-foreground mt-1">عيادة 1 • 30 دقيقة</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-primary">10:00</span>
                      <Badge variant="outline" className="text-xs">استشارة</Badge>
                    </div>
                    <h4 className="font-medium">سارة عبدالله القحطاني</h4>
                    <p className="text-sm text-muted-foreground">Dr. Sarah Johnson</p>
                    <p className="text-xs text-muted-foreground mt-1">عيادة 2 • 30 دقيقة</p>
                  </div>

                  <div className="p-4 border rounded-lg border-red-200 bg-red-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-red-600">10:30</span>
                      <Badge variant="destructive" className="text-xs">طوارئ</Badge>
                    </div>
                    <h4 className="font-medium">أحمد محمد الأحمد</h4>
                    <p className="text-sm text-muted-foreground">Dr. Sarah Johnson</p>
                    <p className="text-xs text-muted-foreground mt-1">غرفة الطوارئ • 30 دقيقة</p>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('today')}
                    className="flex items-center gap-2"
                  >
                    <CalendarDays className="h-4 w-4" />
                    {t('appointments.viewAllToday')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule">
          <AnimatePresence mode="wait">
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Schedule isDemoMode={isDemoMode} />
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        {/* Today's Appointments Tab */}
        <TabsContent value="today">
          <AnimatePresence mode="wait">
            <motion.div
              key="today"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TodaysAppointments isDemoMode={isDemoMode} />
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        {/* Waiting List Tab */}
        <TabsContent value="waiting">
          <AnimatePresence mode="wait">
            <motion.div
              key="waiting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <WaitingList isDemoMode={isDemoMode} />
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        {/* All Appointments Tab */}
        <TabsContent value="all">
          <AnimatePresence mode="wait">
            <motion.div
              key="all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AppointmentScheduler isDemoMode={isDemoMode} />
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppointmentsDashboard;