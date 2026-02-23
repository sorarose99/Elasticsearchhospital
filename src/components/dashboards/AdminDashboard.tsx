import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  TestTube, 
  DollarSign, 
  Activity,
  Settings,
  BarChart3,
  Plus,
  LogOut,
  Languages
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import UserManagement from '../admin/UserManagement';
import SystemReports from '../admin/SystemReports';
import PatientOverview from '../admin/PatientOverview';
import AdvancedReports from '../analytics/AdvancedReports';
import { useLanguage } from '../../services/LanguageService';
import { useNavigation } from '../navigation/NavigationContext';
import firebaseService from '../../services/FirebaseService';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  specialization?: string;
  department?: string;
}

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  language: 'en' | 'ar';
  onLanguageChange: (lang: 'en' | 'ar') => void;
}

interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  pendingLabOrders: number;
  todayRevenue: number;
  recentPatients: any[];
  recentAppointments: any[];
}

const translations = {
  en: {
    title: 'Admin Dashboard',
    overview: 'System Overview',
    patients: 'Patients',
    appointments: 'Appointments',
    users: 'User Management',
    reports: 'Reports',
    analytics: 'Analytics',
    settings: 'Settings',
    totalPatients: 'Total Patients',
    todayAppointments: "Today's Appointments",
    pendingLab: 'Pending Lab Orders',
    todayRevenue: "Today's Revenue",
    recentPatients: 'Recent Patients',
    recentAppointments: 'Recent Appointments',
    viewAll: 'View All',
    addNew: 'Add New',
    systemActivity: 'System Activity',
    loading: 'Loading...',
    error: 'Error loading dashboard data',
  },
  ar: {
    title: 'لوحة تحكم المدير',
    overview: 'نظرة عامة على النظام',
    patients: 'المرضى',
    appointments: 'المواعيد',
    users: 'إدارة المستخدمين',
    reports: 'التقارير',
    analytics: 'التحليلات',
    settings: 'الإعدادات',
    totalPatients: 'إجمالي المرضى',
    todayAppointments: 'مواعيد اليوم',
    pendingLab: 'فحوصات مختبر معلقة',
    todayRevenue: 'إيرادات اليوم',
    recentPatients: 'المرضى الجدد',
    recentAppointments: 'المواعيد الأخيرة',
    viewAll: 'عرض الكل',
    addNew: 'إضافة جديد',
    systemActivity: 'نشاط النظام',
    loading: 'جاري التحميل...',
    error: 'خطأ في تحميل بيانات اللوحة',
  }
};

export default function AdminDashboard({ user, onLogout, language, onLanguageChange }: AdminDashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const { t } = useLanguage();
  const { navigateTo } = useNavigation();

  useEffect(() => {
    fetchDashboardStats();

    // Subscribe to real-time updates
    const unsubscribePatients = firebaseService.subscribeToPatients((data) => {
      if (stats) {
        setStats(prev => prev ? { ...prev, totalPatients: data.length, recentPatients: data.slice(0, 5) } : null);
      }
    });

    const unsubscribeAppointments = firebaseService.subscribeToAppointments((data) => {
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = data.filter((apt: any) => apt.date === today);
      if (stats) {
        setStats(prev => prev ? { ...prev, todayAppointments: todayAppointments.length, recentAppointments: data.slice(0, 5) } : null);
      }
    });

    const unsubscribeLabOrders = firebaseService.subscribeToCollection('labOrders', (data: any[]) => {
      const pending = data.filter((order: any) => order.status === 'pending');
      if (stats) {
        setStats(prev => prev ? { ...prev, pendingLabOrders: pending.length } : null);
      }
    });

    const unsubscribeInvoices = firebaseService.subscribeToCollection('invoices', (data: any[]) => {
      const today = new Date().toISOString().split('T')[0];
      const todayInvoices = data.filter((inv: any) => 
        inv.createdAt?.toDate?.()?.toISOString().split('T')[0] === today
      );
      const todayRevenue = todayInvoices.reduce((sum: number, inv: any) => sum + (inv.totalAmount || 0), 0);
      if (stats) {
        setStats(prev => prev ? { ...prev, todayRevenue } : null);
      }
    });

    return () => {
      unsubscribePatients();
      unsubscribeAppointments();
      unsubscribeLabOrders();
      unsubscribeInvoices();
    };
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      const [patients, appointments, labOrders, invoices] = await Promise.all([
        firebaseService.getPatients(),
        firebaseService.getAppointments(),
        firebaseService.getLabOrders(),
        firebaseService.getInvoices()
      ]);

      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = appointments.filter((apt: any) => apt.date === today);
      const pendingLabOrders = labOrders.filter((order: any) => order.status === 'pending');
      
      const todayInvoices = invoices.filter((inv: any) => 
        inv.createdAt?.toDate?.()?.toISOString().split('T')[0] === today
      );
      const todayRevenue = todayInvoices.reduce((sum: number, inv: any) => sum + (inv.totalAmount || 0), 0);

      setStats({
        totalPatients: patients.length,
        todayAppointments: todayAppointments.length,
        pendingLabOrders: pendingLabOrders.length,
        todayRevenue,
        recentPatients: patients.slice(0, 5),
        recentAppointments: appointments.slice(0, 5)
      });
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.message);
      toast.error(language === 'ar' ? 'خطأ في تحميل البيانات' : 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-sm text-gray-600">Welcome, {user.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onLanguageChange(language === 'en' ? 'ar' : 'en')}
            >
              <Languages className="w-4 h-4 mr-2" />
              {language === 'en' ? 'العربية' : 'English'}
            </Button>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">{t.overview}</TabsTrigger>
            <TabsTrigger value="patients">{t.patients}</TabsTrigger>
            <TabsTrigger value="users">{t.users}</TabsTrigger>
            <TabsTrigger value="reports">{t.reports}</TabsTrigger>
            <TabsTrigger value="analytics">{t.analytics}</TabsTrigger>
            <TabsTrigger value="settings">{t.settings}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {t.error}: {error}
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title={t.totalPatients}
                value={stats?.totalPatients || 0}
                icon={Users}
                color="bg-blue-500"
              />
              <StatCard
                title={t.todayAppointments}
                value={stats?.todayAppointments || 0}
                icon={Calendar}
                color="bg-green-500"
              />
              <StatCard
                title={t.pendingLab}
                value={stats?.pendingLabOrders || 0}
                icon={TestTube}
                color="bg-orange-500"
              />
              <StatCard
                title={t.todayRevenue}
                value={`$${stats?.todayRevenue || 0}`}
                icon={DollarSign}
                color="bg-purple-500"
              />
            </div>

            {/* Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{t.recentPatients}</CardTitle>
                  <Button variant="outline" size="sm">
                    {t.viewAll}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.recentPatients?.slice(0, 5).map((patient, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-gray-600">{patient.phone}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(patient.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{t.recentAppointments}</CardTitle>
                  <Button variant="outline" size="sm">
                    {t.viewAll}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.recentAppointments?.slice(0, 5).map((appointment, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{appointment.patientName}</p>
                          <p className="text-sm text-gray-600">{appointment.doctorName}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="patients">
            <PatientOverview language={language} />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement language={language} />
          </TabsContent>

          <TabsContent value="reports">
            <SystemReports language={language} />
          </TabsContent>

          <TabsContent value="analytics">
            <AdvancedReports language={language} />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>{t.settings}</CardTitle>
                <CardDescription>System configuration and settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-12">
                    <Button 
                      size="lg"
                      onClick={() => navigateTo('settings')}
                      className="mx-auto"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      {t('common.settings')}
                    </Button>
                    <p className="text-sm text-muted-foreground mt-4">
                      Configure system settings and preferences
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}