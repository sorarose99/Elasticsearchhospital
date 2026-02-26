import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Calendar, 
  Users, 
  FileText, 
  TestTube, 
  Pill,
  Clock,
  LogOut,
  Languages,
  Plus,
  Search
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import PatientEMR from '../medical/PatientEMR';
import AppointmentScheduler from '../medical/AppointmentScheduler';
import { useLanguage } from '../../services/LanguageService';
import { useNavigation } from '../navigation/NavigationContext';
import firebaseService from '../../services/FirebaseService';
import { toast } from 'sonner';
import { useAgentWrapper } from '../agent/withElasticsearchAgent';
import AgentInsightCard from '../agent/AgentInsightCard';
import AgentSmartBadge from '../agent/AgentSmartBadge';
import AgentQuickActions from '../agent/AgentQuickActions';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  specialization?: string;
  department?: string;
}

interface DoctorDashboardProps {
  user: User;
  onLogout: () => void;
  language: 'en' | 'ar';
  onLanguageChange: (lang: 'en' | 'ar') => void;
}

const translations = {
  en: {
    title: 'Doctor Dashboard',
    todaySchedule: "Today's Schedule",
    myPatients: 'My Patients',
    appointments: 'Appointments',
    emr: 'Electronic Medical Records',
    prescriptions: 'Prescriptions',
    labOrders: 'Lab Orders',
    searchPatients: 'Search patients...',
    upcomingAppointments: 'Upcoming Appointments',
    recentPatients: 'Recent Patients',
    pendingResults: 'Pending Lab Results',
    scheduledToday: 'Scheduled Today',
    completed: 'Completed',
    pending: 'Pending',
    urgent: 'Urgent',
    viewDetails: 'View Details',
    addPrescription: 'Add Prescription',
    orderLab: 'Order Lab Test',
    patientHistory: 'Patient History',
    loading: 'Loading...',
    noAppointments: 'No appointments scheduled for today',
    noPatients: 'No patients found',
  },
  ar: {
    title: 'لوحة تحكم الطبيب',
    todaySchedule: 'جدول اليوم',
    myPatients: 'مرضاي',
    appointments: 'المواعيد',
    emr: 'السجلات الطبية الإلكترونية',
    prescriptions: 'الوصفات الطبية',
    labOrders: 'طلبات المختبر',
    searchPatients: 'البحث عن المرضى...',
    upcomingAppointments: 'المواعيد القادمة',
    recentPatients: 'المرضى الأخيرون',
    pendingResults: 'نتائج مختبر معلقة',
    scheduledToday: 'مجدول اليوم',
    completed: 'مكتمل',
    pending: 'معلق',
    urgent: 'عاجل',
    viewDetails: 'عرض التفاصيل',
    addPrescription: 'إضافة وصفة',
    orderLab: 'طلب فحص مختبر',
    patientHistory: 'تاريخ المريض',
    loading: 'جاري التحميل...',
    noAppointments: 'لا توجد مواعيد مجدولة لليوم',
    noPatients: 'لم يتم العثور على مرضى',
  }
};

export default function DoctorDashboard({ user, onLogout, language, onLanguageChange }: DoctorDashboardProps) {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [labOrders, setLabOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('schedule');

  const { t } = useLanguage();
  const { navigateTo } = useNavigation();
  
  // Elasticsearch Agent Integration
  const { AgentComponents, updateContext } = useAgentWrapper('diagnostic', language);

  useEffect(() => {
    fetchDoctorData();
    
    // Subscribe to real-time updates
    const unsubscribeAppointments = firebaseService.subscribeToAppointments((updatedAppointments) => {
      const todayAppointments = updatedAppointments.filter((apt: any) => 
        apt.doctorId === user.id && apt.date === new Date().toISOString().split('T')[0]
      );
      setAppointments(todayAppointments);
    });
    
    const unsubscribePatients = firebaseService.subscribeToPatients((updatedPatients) => {
      setPatients(updatedPatients);
    });
    
    return () => {
      unsubscribeAppointments();
      unsubscribePatients();
    };
  }, [user.id]);

  const fetchDoctorData = async () => {
    try {
      setLoading(true);

      // Use Firebase instead of LocalApiService
      const appointmentsData = await firebaseService.getAppointmentsByDoctor(user.id);
      const todayAppointments = appointmentsData.filter((apt: any) => 
        apt.date === new Date().toISOString().split('T')[0]
      );
      setAppointments(todayAppointments);

      const patientsData = await firebaseService.getPatients();
      setPatients(patientsData || []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctor data:', error);
      toast.error('Failed to load data');
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter((patient: any) =>
    patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate AI Quick Actions for Doctor Dashboard
  const quickActions = [
    ...(appointments.filter((a: any) => a.status === 'pending').length > 0 ? [{
      id: 'review-appointments',
      label: t('reviewAppointments') || 'Review Pending Appointments',
      icon: Calendar,
      onClick: () => setActiveTab('schedule'),
      badge: String(appointments.filter((a: any) => a.status === 'pending').length),
      urgent: false
    }] : []),
    ...(labOrders.filter((o: any) => o.status === 'completed').length > 0 ? [{
      id: 'review-labs',
      label: t('reviewLabResults') || 'Review Lab Results',
      icon: TestTube,
      onClick: () => setActiveTab('lab'),
      badge: String(labOrders.filter((o: any) => o.status === 'completed').length),
      urgent: true
    }] : []),
    {
      id: 'ai-diagnosis',
      label: t('aiDiagnosticAssist') || 'AI Diagnostic Assist',
      icon: Stethoscope,
      onClick: () => toast.info('Opening AI diagnostic assistant...'),
      urgent: false
    }
  ];

  const AppointmentCard = ({ appointment }: any) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{appointment.patientName}</h3>
                {/* AI Smart Badges */}
                {appointment.urgent && (
                  <AgentSmartBadge
                    type="priority"
                    label={t('urgent') || 'Urgent'}
                    tooltip={t('urgentAppointment') || 'Urgent appointment flagged by AI'}
                    pulse={true}
                    size="sm"
                  />
                )}
              </div>
              <p className="text-sm text-gray-600">{appointment.type}</p>
              <p className="text-sm text-gray-500">{appointment.time}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={appointment.status === 'completed' ? 'default' : 'secondary'}>
              {appointment.status === 'completed' ? t('dashboard.completed') : t('dashboard.pending')}
            </Badge>
            <Button size="sm" variant="outline">
              {t('dashboard.viewDetails')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const PatientCard = ({ patient }: any) => (
    <Card className="mb-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setSelectedPatient(patient)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{patient.name}</h3>
                {/* AI Smart Badges */}
                {patient.riskLevel === 'high' && (
                  <AgentSmartBadge
                    type="risk"
                    label={t('highRisk') || 'High Risk'}
                    tooltip={t('aiDetectedRisk') || 'AI detected elevated risk factors'}
                    size="sm"
                  />
                )}
                {patient.followUpNeeded && (
                  <AgentSmartBadge
                    type="recommendation"
                    label={t('followUp') || 'Follow-up'}
                    tooltip={t('followUpRecommended') || 'Follow-up recommended by AI'}
                    size="sm"
                  />
                )}
              </div>
              <p className="text-sm text-gray-600">ID: {patient.id}</p>
              <p className="text-sm text-gray-500">Age: {patient.age} | {patient.gender}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              EMR
            </Button>
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

  if (selectedPatient) {
    return (
      <PatientEMR 
        patient={selectedPatient}
        doctor={user}
        language={language}
        onBack={() => setSelectedPatient(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-sm text-gray-600">
                Dr. {user.name} - {user.specialization || 'General Practice'}
              </p>
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
        {/* AI Quick Actions */}
        <AgentQuickActions 
          actions={quickActions}
          title={t('aiRecommendations') || 'AI Recommendations'}
        />

        {/* AI Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <AgentInsightCard
            type="insight"
            title={t('patientInsights') || 'Patient Insights'}
            description={t('highRiskPatients') || '3 patients show high-risk indicators requiring follow-up'}
            priority="high"
            action={{
              label: t('viewPatients') || 'View Patients',
              onClick: () => setActiveTab('patients')
            }}
            metrics={[
              {
                label: t('highRisk') || 'High Risk',
                value: '3',
                trend: 'up'
              }
            ]}
            compact={true}
          />
          
          <AgentInsightCard
            type="recommendation"
            title={t('scheduleOptimization') || 'Schedule Optimization'}
            description={t('rescheduleRecommendation') || 'Recommend rescheduling 2 appointments for better time management'}
            priority="medium"
            action={{
              label: t('optimize') || 'Optimize',
              onClick: () => toast.info('Optimizing schedule...')
            }}
            compact={true}
          />
          
          <AgentInsightCard
            type="success"
            title={t('treatmentSuccess') || 'Treatment Success'}
            description={t('treatmentSuccessRate') || '92% treatment success rate this month'}
            priority="low"
            metrics={[
              {
                label: t('successRate') || 'Success Rate',
                value: '92%',
                trend: 'up'
              }
            ]}
            compact={true}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="schedule">
              <Calendar className="w-4 h-4 mr-2" />
              {t.todaySchedule}
            </TabsTrigger>
            <TabsTrigger value="patients">
              <Users className="w-4 h-4 mr-2" />
              {t.myPatients}
            </TabsTrigger>
            <TabsTrigger value="appointments">
              <Clock className="w-4 h-4 mr-2" />
              {t.appointments}
            </TabsTrigger>
            <TabsTrigger value="prescriptions">
              <Pill className="w-4 h-4 mr-2" />
              {t.prescriptions}
            </TabsTrigger>
            <TabsTrigger value="lab">
              <TestTube className="w-4 h-4 mr-2" />
              {t.labOrders}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{t.upcomingAppointments}</CardTitle>
                    <Badge variant="outline">
                      {appointments.length} {t.scheduledToday}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    {appointments.length > 0 ? (
                      appointments.map((appointment: any, index) => (
                        <AppointmentCard key={index} appointment={appointment} />
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">{t.noAppointments}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t.pendingResults}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {labOrders.filter((order: any) => order.status === 'pending').slice(0, 5).map((order: any, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{order.patientName}</p>
                            <p className="text-xs text-gray-600">{order.testType}</p>
                          </div>
                          <Badge variant="secondary">{t.pending}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="patients" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t.myPatients}</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder={t.searchPatients}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('dashboard.addPatient')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient: any, index) => (
                    <PatientCard key={index} patient={patient} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">{t.noPatients}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentScheduler doctor={user} language={language} />
          </TabsContent>

          <TabsContent value="prescriptions">
            <Card>
              <CardHeader>
                <CardTitle>{t.prescriptions}</CardTitle>
                <CardDescription>Manage patient prescriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Button 
                    size="lg"
                    onClick={() => navigateTo('pharmacy', 'prescriptions')}
                    className="mx-auto"
                  >
                    <Pill className="w-4 h-4 mr-2" />
                    {t('pharmacy.prescriptions')}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    Manage patient prescriptions and medications
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lab">
            <Card>
              <CardHeader>
                <CardTitle>{t.labOrders}</CardTitle>
                <CardDescription>View and manage lab orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {labOrders.map((order: any, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{order.patientName}</p>
                        <p className="text-sm text-gray-600">{order.testType}</p>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                        {order.status === 'completed' ? t.completed : t.pending}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Elasticsearch Agent Integration */}
      <AgentComponents />
    </div>
  );
}