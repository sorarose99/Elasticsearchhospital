import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Pill,
  FileText,
  UserCheck,
  Heart,
  Stethoscope,
  Building,
  ShieldCheck,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  Download,
  Filter,
  Calendar as CalendarIcon,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';
import firebaseService from '../../services/FirebaseService';
import { toast } from 'sonner';

interface DashboardStats {
  patients: {
    total: number;
    new: number;
    active: number;
    change: number;
  };
  appointments: {
    today: number;
    upcoming: number;
    completed: number;
    cancelled: number;
    change: number;
  };
  revenue: {
    today: number;
    month: number;
    year: number;
    change: number;
  };
  pharmacy: {
    totalItems: number;
    lowStock: number;
    expired: number;
    prescriptions: number;
  };
  lab: {
    pending: number;
    completed: number;
    critical: number;
  };
  staff: {
    online: number;
    total: number;
    departments: { name: string; count: number; }[];
  };
}

interface RecentActivity {
  id: string;
  type: 'appointment' | 'patient' | 'lab' | 'prescription' | 'revenue';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
  user?: string;
  avatar?: string;
}

interface ComprehensiveDashboardProps {
  userRole: string;
}

const ComprehensiveDashboard: React.FC<ComprehensiveDashboardProps> = ({ 
  userRole
}) => {
  const { t, language, isRTL } = useLanguage();
  const { effectiveTheme, themeConfig } = useTheme();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('today');
  const [refreshing, setRefreshing] = useState(false);

  // Real-time data
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [labOrders, setLabOrders] = useState<any[]>([]);
  const [radiologyStudies, setRadiologyStudies] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();

    // Subscribe to real-time updates for all collections
    const unsubscribePatients = firebaseService.subscribeToPatients((data) => {
      setPatients(data);
      calculateStats(data, appointments, inventory, prescriptions, labOrders, radiologyStudies, invoices, staff);
    });

    const unsubscribeAppointments = firebaseService.subscribeToAppointments((data) => {
      setAppointments(data);
      calculateStats(patients, data, inventory, prescriptions, labOrders, radiologyStudies, invoices, staff);
    });

    const unsubscribeInventory = firebaseService.subscribeToCollection('inventory', (data: any[]) => {
      setInventory(data);
      calculateStats(patients, appointments, data, prescriptions, labOrders, radiologyStudies, invoices, staff);
    });

    const unsubscribePrescriptions = firebaseService.subscribeToCollection('prescriptions', (data: any[]) => {
      setPrescriptions(data);
      calculateStats(patients, appointments, inventory, data, labOrders, radiologyStudies, invoices, staff);
    });

    const unsubscribeLabOrders = firebaseService.subscribeToCollection('labOrders', (data: any[]) => {
      setLabOrders(data);
      calculateStats(patients, appointments, inventory, prescriptions, data, radiologyStudies, invoices, staff);
    });

    const unsubscribeRadiology = firebaseService.subscribeToCollection('radiologyStudies', (data: any[]) => {
      setRadiologyStudies(data);
      calculateStats(patients, appointments, inventory, prescriptions, labOrders, data, invoices, staff);
    });

    const unsubscribeInvoices = firebaseService.subscribeToCollection('invoices', (data: any[]) => {
      setInvoices(data);
      calculateStats(patients, appointments, inventory, prescriptions, labOrders, radiologyStudies, data, staff);
    });

    const unsubscribeStaff = firebaseService.subscribeToCollection('staff', (data: any[]) => {
      setStaff(data);
      calculateStats(patients, appointments, inventory, prescriptions, labOrders, radiologyStudies, invoices, data);
    });

    return () => {
      unsubscribePatients();
      unsubscribeAppointments();
      unsubscribeInventory();
      unsubscribePrescriptions();
      unsubscribeLabOrders();
      unsubscribeRadiology();
      unsubscribeInvoices();
      unsubscribeStaff();
    };
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [
        patientsData,
        appointmentsData,
        inventoryData,
        prescriptionsData,
        labOrdersData,
        radiologyData,
        invoicesData,
        staffData
      ] = await Promise.all([
        firebaseService.getPatients(),
        firebaseService.getAppointments(),
        firebaseService.getInventory(),
        firebaseService.getPrescriptions(),
        firebaseService.getLabOrders(),
        firebaseService.getRadiologyStudies(),
        firebaseService.getInvoices(),
        firebaseService.getStaff()
      ]);

      setPatients(patientsData);
      setAppointments(appointmentsData);
      setInventory(inventoryData);
      setPrescriptions(prescriptionsData);
      setLabOrders(labOrdersData);
      setRadiologyStudies(radiologyData);
      setInvoices(invoicesData);
      setStaff(staffData);

      calculateStats(patientsData, appointmentsData, inventoryData, prescriptionsData, labOrdersData, radiologyData, invoicesData, staffData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error(language === 'ar' ? 'خطأ في تحميل البيانات' : 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (
    patientsData: any[],
    appointmentsData: any[],
    inventoryData: any[],
    prescriptionsData: any[],
    labOrdersData: any[],
    radiologyData: any[],
    invoicesData: any[],
    staffData: any[]
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointmentsData.filter((apt: any) => apt.date === today);
    const completedToday = todayAppointments.filter((apt: any) => apt.status === 'completed');
    const cancelledToday = todayAppointments.filter((apt: any) => apt.status === 'cancelled');

    // Calculate revenue
    const todayInvoices = invoicesData.filter((inv: any) => 
      inv.createdAt?.toDate?.()?.toISOString().split('T')[0] === today
    );
    const todayRevenue = todayInvoices.reduce((sum: number, inv: any) => sum + (inv.totalAmount || 0), 0);

    // Calculate pharmacy stats
    const lowStockItems = inventoryData.filter((item: any) => 
      item.currentStock <= item.minimumStock
    );
    const expiredItems = inventoryData.filter((item: any) => {
      if (!item.expiryDate) return false;
      const expiryDate = item.expiryDate.toDate?.() || new Date(item.expiryDate);
      return expiryDate < new Date();
    });

    // Calculate lab stats
    const pendingLab = labOrdersData.filter((order: any) => order.status === 'pending');
    const completedLab = labOrdersData.filter((order: any) => order.status === 'completed');
    const criticalLab = labOrdersData.filter((order: any) => order.priority === 'critical' || order.urgent);

    // Calculate staff stats
    const activeStaff = staffData.filter((s: any) => s.status === 'active');
    
    // Group staff by department
    const departmentMap = new Map<string, number>();
    staffData.forEach((s: any) => {
      const dept = s.department || (language === 'ar' ? 'غير محدد' : 'Unassigned');
      departmentMap.set(dept, (departmentMap.get(dept) || 0) + 1);
    });
    const departments = Array.from(departmentMap.entries()).map(([name, count]) => ({ name, count }));

    // Calculate upcoming appointments
    const upcomingAppointments = appointmentsData.filter((apt: any) => 
      apt.date >= today && apt.status === 'scheduled'
    );

    const calculatedStats: DashboardStats = {
      patients: {
        total: patientsData.length,
        new: patientsData.filter((p: any) => {
          const regDate = p.registrationDate?.toDate?.() || new Date(p.createdAt);
          return regDate.toISOString().split('T')[0] === today;
        }).length,
        active: patientsData.filter((p: any) => p.status === 'active').length,
        change: 12.5 // TODO: Calculate actual change from historical data
      },
      appointments: {
        today: todayAppointments.length,
        upcoming: upcomingAppointments.length,
        completed: completedToday.length,
        cancelled: cancelledToday.length,
        change: 8.3 // TODO: Calculate actual change
      },
      revenue: {
        today: todayRevenue,
        month: invoicesData.reduce((sum: number, inv: any) => sum + (inv.totalAmount || 0), 0),
        year: invoicesData.reduce((sum: number, inv: any) => sum + (inv.totalAmount || 0), 0),
        change: 15.7 // TODO: Calculate actual change
      },
      pharmacy: {
        totalItems: inventoryData.length,
        lowStock: lowStockItems.length,
        expired: expiredItems.length,
        prescriptions: prescriptionsData.length
      },
      lab: {
        pending: pendingLab.length,
        completed: completedLab.length,
        critical: criticalLab.length
      },
      staff: {
        online: activeStaff.length,
        total: staffData.length,
        departments
      }
    };

    setStats(calculatedStats);
    generateRecentActivity(appointmentsData, patientsData, labOrdersData, prescriptionsData, invoicesData);
  };

  const generateRecentActivity = (
    appointmentsData: any[],
    patientsData: any[],
    labOrdersData: any[],
    prescriptionsData: any[],
    invoicesData: any[]
  ) => {
    const activities: RecentActivity[] = [];

    // Recent appointments
    appointmentsData.slice(0, 2).forEach((apt: any) => {
      const patient = patientsData.find((p: any) => p.id === apt.patientId);
      activities.push({
        id: apt.id,
        type: 'appointment',
        title: language === 'ar' ? 'موعد جديد محجوز' : 'New appointment booked',
        description: `${patient?.name || 'Unknown'} - ${apt.time}`,
        timestamp: apt.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        status: 'success',
        user: language === 'ar' ? 'موظف الاستقبال' : 'Receptionist'
      });
    });

    // Recent lab orders
    labOrdersData.filter((o: any) => o.priority === 'critical').slice(0, 1).forEach((order: any) => {
      const patient = patientsData.find((p: any) => p.id === order.patientId);
      activities.push({
        id: order.id,
        type: 'lab',
        title: language === 'ar' ? 'نتيجة مختبر حرجة' : 'Critical lab result',
        description: `${patient?.name || 'Unknown'} - ${order.testType}`,
        timestamp: order.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        status: 'warning',
        user: language === 'ar' ? 'فني المختبر' : 'Lab Technician'
      });
    });

    // Recent patients
    patientsData.slice(0, 1).forEach((patient: any) => {
      activities.push({
        id: patient.id,
        type: 'patient',
        title: language === 'ar' ? 'مريض جديد مسجل' : 'New patient registered',
        description: `${patient.name} - ${patient.age} ${language === 'ar' ? 'سنة' : 'years'}`,
        timestamp: patient.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        status: 'info',
        user: language === 'ar' ? 'موظف الاستقبال' : 'Receptionist'
      });
    });

    // Recent prescriptions
    prescriptionsData.filter((p: any) => p.status === 'dispensed').slice(0, 1).forEach((rx: any) => {
      const patient = patientsData.find((p: any) => p.id === rx.patientId);
      activities.push({
        id: rx.id,
        type: 'prescription',
        title: language === 'ar' ? 'وصفة طبية مصروفة' : 'Prescription dispensed',
        description: `${patient?.name || 'Unknown'} - ${rx.medications?.length || 0} ${language === 'ar' ? 'أدوية' : 'medications'}`,
        timestamp: rx.dispensedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        status: 'success',
        user: language === 'ar' ? 'الصيدلي' : 'Pharmacist'
      });
    });

    // Recent payments
    invoicesData.filter((i: any) => i.status === 'paid').slice(0, 1).forEach((invoice: any) => {
      const patient = patientsData.find((p: any) => p.id === invoice.patientId);
      activities.push({
        id: invoice.id,
        type: 'revenue',
        title: language === 'ar' ? 'دفعة مستلمة' : 'Payment received',
        description: `${formatCurrency(invoice.totalAmount)} - ${patient?.name || 'Unknown'}`,
        timestamp: invoice.paidAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        status: 'success',
        user: language === 'ar' ? 'موظف المحاسبة' : 'Accountant'
      });
    });

    // Sort by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setRecentActivity(activities.slice(0, 5));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US').format(number);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Calendar className="h-4 w-4" />;
      case 'patient': return <Users className="h-4 w-4" />;
      case 'lab': return <Activity className="h-4 w-4" />;
      case 'prescription': return <Pill className="h-4 w-4" />;
      case 'revenue': return <DollarSign className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'info': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <ArrowUpRight className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-red-600" />
    );
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{t('dashboard.title')}</h1>
            <p className="text-muted-foreground">{t('dashboard.overview')}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">{t('dashboard.overview')}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {t('common.refresh')}
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Patients */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('dashboard.totalPatients')}</p>
                <p className="text-2xl font-semibold">{formatNumber(stats.patients.total)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getChangeIcon(stats.patients.change)}
                  <span className={`text-sm ${getChangeColor(stats.patients.change)}`}>
                    {Math.abs(stats.patients.change)}% {t('common.fromLastMonth')}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('dashboard.todayAppointments')}</p>
                <p className="text-2xl font-semibold">{formatNumber(stats.appointments.today)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getChangeIcon(stats.appointments.change)}
                  <span className={`text-sm ${getChangeColor(stats.appointments.change)}`}>
                    {Math.abs(stats.appointments.change)}% {t('common.fromYesterday')}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('dashboard.todayRevenue')}</p>
                <p className="text-2xl font-semibold">{formatCurrency(stats.revenue.today)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getChangeIcon(stats.revenue.change)}
                  <span className={`text-sm ${getChangeColor(stats.revenue.change)}`}>
                    {Math.abs(stats.revenue.change)}% {t('common.fromLastWeek')}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('dashboard.systemStatus')}</p>
                <p className="text-2xl font-semibold text-green-600">{t('status.online')}</p>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">
                    {stats.staff.online}/{stats.staff.total} {t('dashboard.staffOnline')}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appointments Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t('appointments.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-blue-600">{stats.appointments.today}</p>
                  <p className="text-sm text-muted-foreground">{t('common.today')}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-green-600">{stats.appointments.upcoming}</p>
                  <p className="text-sm text-muted-foreground">{t('dashboard.upcoming')}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-purple-600">{stats.appointments.completed}</p>
                  <p className="text-sm text-muted-foreground">{t('common.completed')}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-red-600">{stats.appointments.cancelled}</p>
                  <p className="text-sm text-muted-foreground">{t('common.cancelled')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Department Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                {t('dashboard.departments')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.staff.departments.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="font-medium">{dept.name}</span>
                    </div>
                    <Badge variant="outline">{dept.count} {t('dashboard.staff')}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Critical Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                {t('dashboard.criticalAlerts')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                  <Pill className="h-5 w-5 text-yellow-600" />
                  <div className="flex-1">
                    <p className="font-medium">{stats.pharmacy.lowStock} {t('pharmacy.lowStock')}</p>
                    <p className="text-sm text-muted-foreground">{t('dashboard.medicationsNeedReorder')}</p>
                  </div>
                  <Button variant="outline" size="sm">{t('common.view')}</Button>
                </div>
                
                <div className="flex items-center gap-3 p-3 border border-red-200 rounded-lg bg-red-50">
                  <Clock className="h-5 w-5 text-red-600" />
                  <div className="flex-1">
                    <p className="font-medium">{stats.pharmacy.expired} {t('pharmacy.expired')}</p>
                    <p className="text-sm text-muted-foreground">{t('dashboard.expiredMedications')}</p>
                  </div>
                  <Button variant="outline" size="sm">{t('common.view')}</Button>
                </div>
                
                <div className="flex items-center gap-3 p-3 border border-orange-200 rounded-lg bg-orange-50">
                  <Activity className="h-5 w-5 text-orange-600" />
                  <div className="flex-1">
                    <p className="font-medium">{stats.lab.critical} {t('lab.critical')}</p>
                    <p className="text-sm text-muted-foreground">{t('dashboard.criticalLabResults')}</p>
                  </div>
                  <Button variant="outline" size="sm">{t('common.view')}</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{t('nav.quickActions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                {t('patients.addPatient')}
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                {t('appointments.schedule')}
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Pill className="h-4 w-4 mr-2" />
                {t('pharmacy.addMedication')}
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                {t('reports.generate')}
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getActivityColor(activity.status)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {formatTime(activity.timestamp)}
                        </span>
                        {activity.user && (
                          <>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{activity.user}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {t('dashboard.systemPerformance')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span>{t('dashboard.serverLoad')}</span>
                  <span>45%</span>
                </div>
                <Progress value={45} className="mt-1" />
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span>{t('dashboard.databaseUsage')}</span>
                  <span>72%</span>
                </div>
                <Progress value={72} className="mt-1" />
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span>{t('dashboard.storageUsage')}</span>
                  <span>38%</span>
                </div>
                <Progress value={38} className="mt-1" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveDashboard;