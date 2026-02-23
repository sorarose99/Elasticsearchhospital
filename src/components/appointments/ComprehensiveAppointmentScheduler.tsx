import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Calendar } from '../ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  User, 
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
  Timer,
  Users,
  CalendarDays,
  Stethoscope,
  UserCheck,
  MapPin,
  QrCode,
  MessageSquare,
  Bell,
  Send,
  Download,
  Printer,
  Share2,
  Smartphone,
  ArrowRight,
  ArrowLeft,
  Check,
  Info,
  Star
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';
import { toast } from 'sonner@2.0.3';
import { generateAppointmentQRCode, generateAppointmentPDF, shareAppointment, type AppointmentQRData } from '../../utils/qrCode';
import NotificationService, { type NotificationRecipient, type AppointmentNotificationData } from '../../services/NotificationService';
import firebaseService from '../../services/FirebaseService';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  avatar?: string;
  schedule: {
    [key: string]: {
      start: string;
      end: string;
      slots: number;
    };
  };
  experience: number;
  fee: number;
  rating: number;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  avatar?: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  medicalNumber: string;
}

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  duration: number;
  type: 'consultation' | 'follow-up' | 'procedure' | 'emergency';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  reason: string;
  notes?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  patient?: Patient;
  doctor?: Doctor;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reminderSent?: boolean;
  qrCode?: string;
  confirmationCode?: string;
}

interface AppointmentSchedulerProps {
  // No props needed - always uses Firebase
}

const ComprehensiveAppointmentScheduler: React.FC<AppointmentSchedulerProps> = () => {
  const { t, language, isRTL } = useLanguage();
  const { effectiveTheme, themeConfig } = useTheme();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentStep, setCurrentStep] = useState(1);
  const [showQRCode, setShowQRCode] = useState(false);
  const [scheduledAppointment, setScheduledAppointment] = useState<Appointment | null>(null);
  
  const [formData, setFormData] = useState({
    patientType: 'existing',
    patientId: '',
    patientFirstName: '',
    patientLastName: '',
    patientPhone: '',
    patientEmail: '',
    patientAge: '',
    patientGender: 'male',
    doctorId: '',
    date: '',
    time: '',
    type: 'consultation',
    reason: '',
    notes: '',
    location: 'clinic',
    priority: 'medium'
  });

  // Enhanced demo data
  const demoDoctors: Doctor[] = useMemo(() => [
    {
      id: '1',
      name: language === 'ar' ? 'د. أحمد محمد العلي' : 'Dr. Ahmad Mohammad Al-Ali',
      specialization: language === 'ar' ? 'طب القلب والأوعية الدموية' : 'Cardiology & Vascular Medicine',
      experience: 15,
      fee: 500,
      rating: 4.8,
      schedule: {
        '0': { start: '09:00', end: '17:00', slots: 2 },
        '1': { start: '09:00', end: '17:00', slots: 2 },
        '2': { start: '09:00', end: '17:00', slots: 2 },
        '3': { start: '09:00', end: '17:00', slots: 2 },
        '4': { start: '09:00', end: '15:00', slots: 2 },
      }
    },
    {
      id: '2',
      name: language === 'ar' ? 'د. سارة أحمد الغامدي' : 'Dr. Sarah Ahmad Al-Ghamdi',
      specialization: language === 'ar' ? 'طب الأطفال والمراهقين' : 'Pediatrics & Adolescent Medicine',
      experience: 10,
      fee: 400,
      rating: 4.9,
      schedule: {
        '0': { start: '08:00', end: '16:00', slots: 3 },
        '1': { start: '08:00', end: '16:00', slots: 3 },
        '2': { start: '08:00', end: '16:00', slots: 3 },
        '3': { start: '08:00', end: '16:00', slots: 3 },
        '4': { start: '08:00', end: '14:00', slots: 3 },
      }
    },
    {
      id: '3',
      name: language === 'ar' ? 'د. محمد علي السعدي' : 'Dr. Mohammad Ali Al-Saadi',
      specialization: language === 'ar' ? 'طب النساء والتوليد' : 'Obstetrics & Gynecology',
      experience: 20,
      fee: 600,
      rating: 4.7,
      schedule: {
        '0': { start: '10:00', end: '18:00', slots: 2 },
        '1': { start: '10:00', end: '18:00', slots: 2 },
        '2': { start: '10:00', end: '18:00', slots: 2 },
        '3': { start: '10:00', end: '18:00', slots: 2 },
        '4': { start: '10:00', end: '16:00', slots: 2 },
      }
    },
    {
      id: '4',
      name: language === 'ar' ? 'د. فهد حسام الدوسري' : 'Dr. Fahad Hussam Al-Dosari',
      specialization: language === 'ar' ? 'طب العيون والبصريات' : 'Ophthalmology & Optometry',
      experience: 12,
      fee: 450,
      rating: 4.6,
      schedule: {
        '0': { start: '08:30', end: '16:30', slots: 4 },
        '1': { start: '08:30', end: '16:30', slots: 4 },
        '2': { start: '08:30', end: '16:30', slots: 4 },
        '3': { start: '08:30', end: '16:30', slots: 4 },
        '4': { start: '08:30', end: '14:30', slots: 4 },
      }
    }
  ], [language]);

  const demoPatients: Patient[] = useMemo(() => [
    {
      id: '1',
      firstName: language === 'ar' ? 'علي' : 'Ali',
      lastName: language === 'ar' ? 'أحمد الخالدي' : 'Ahmad Al-Khalidi',
      phone: '+966501234567',
      email: 'ali.ahmed@email.com',
      gender: 'male',
      age: 35,
      medicalNumber: 'MRN001'
    },
    {
      id: '2',
      firstName: language === 'ar' ? 'فاطمة' : 'Fatima',
      lastName: language === 'ar' ? 'محمد السالم' : 'Mohammed Al-Salem',
      phone: '+966501234568',
      email: 'fatima.mohammed@email.com',
      gender: 'female',
      age: 28,
      medicalNumber: 'MRN002'
    },
    {
      id: '3',
      firstName: language === 'ar' ? 'خالد' : 'Khalid',
      lastName: language === 'ar' ? 'عبدالله الزهراني' : 'Abdullah Al-Zahrani',
      phone: '+966501234569',
      email: 'khalid.zahrani@email.com',
      gender: 'male',
      age: 42,
      medicalNumber: 'MRN003'
    },
    {
      id: '4',
      firstName: language === 'ar' ? 'نورا' : 'Nora',
      lastName: language === 'ar' ? 'سعد الغامدي' : 'Saad Al-Ghamdi',
      phone: '+966501234570',
      email: 'nora.alghamdi@email.com',
      gender: 'female',
      age: 31,
      medicalNumber: 'MRN004'
    }
  ], [language]);

  useEffect(() => {
    // Always load from Firebase
    loadData();
    
    // Subscribe to real-time updates
    const unsubscribeAppointments = firebaseService.subscribeToAppointments((updatedAppointments) => {
      setAppointments(updatedAppointments);
    });
    
    const unsubscribePatients = firebaseService.subscribeToCollection('patients', (updatedPatients) => {
      setPatients(updatedPatients);
    });
    
    return () => {
      unsubscribeAppointments();
      unsubscribePatients();
    };
  }, [demoDoctors, demoPatients]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Load appointments, patients, and doctors from Firebase
      const [appointmentsData, patientsData] = await Promise.all([
        firebaseService.getAppointments(),
        firebaseService.getPatients()
      ]);
      
      // Use demo doctors for now (can be replaced with Firebase later)
      setDoctors(demoDoctors);
      
      // Enrich appointments with patient and doctor data
      const enrichedAppointments = appointmentsData.map((apt: any) => ({
        ...apt,
        patient: patientsData.find((p: any) => p.id === apt.patientId),
        doctor: demoDoctors.find((d: any) => d.id === apt.doctorId)
      }));
      
      setAppointments(enrichedAppointments);
      setPatients(patientsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error(language === 'ar' ? 'خطأ في تحميل البيانات' : 'Error loading data');
    } finally {
      setLoading(false);
    }
  }, [demoDoctors, language]);

  const generateQRCode = (appointment: Appointment) => {
    const qrData: AppointmentQRData = {
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      date: appointment.date,
      time: appointment.time,
      confirmationCode: appointment.confirmationCode || 'N/A',
      hospitalName: language === 'ar' ? 'مستشفى النور الطبي' : 'Al-Noor Medical Hospital'
    };
    
    return generateAppointmentQRCode(qrData);
  };

  const sendNotification = async (appointment: Appointment, methods: ('sms' | 'email' | 'push')[] = ['sms', 'email']) => {
    const patient = appointment.patient;
    const doctor = appointment.doctor;
    
    if (!patient || !doctor) return;

    const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
    const formattedDate = appointmentDateTime.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = appointmentDateTime.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const recipients: NotificationRecipient[] = [
      {
        name: `${patient.firstName} ${patient.lastName}`,
        phone: patient.phone,
        email: patient.email,
        role: 'patient'
      },
      {
        name: doctor.name,
        phone: '+966501234567', // Demo doctor phone
        email: 'doctor@hospital.com', // Demo doctor email
        role: 'doctor'
      }
    ];

    const notificationData: AppointmentNotificationData = {
      appointmentId: appointment.id,
      confirmationCode: appointment.confirmationCode || 'N/A',
      patientName: `${patient.firstName} ${patient.lastName}`,
      doctorName: doctor.name,
      date: formattedDate,
      time: formattedTime,
      reason: appointment.reason,
      location: appointment.location || 'Main Clinic',
      language
    };

    try {
      const notificationService = NotificationService.getInstance();
      await notificationService.sendAppointmentConfirmation(recipients, notificationData, methods);
      
      toast.success(language === 'ar' 
        ? 'تم إرسال الإشعارات بنجاح للمريض والطبيب'
        : 'Notifications sent successfully to patient and doctor'
      );
    } catch (error) {
      console.error('Error sending notifications:', error);
      toast.error(language === 'ar' 
        ? 'خطأ في إرسال الإشعارات'
        : 'Error sending notifications'
      );
    }
  };

  const handleScheduleAppointment = async () => {
    if (!formData.patientId || !formData.doctorId || !formData.date || !formData.time || !formData.reason) {
      toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const confirmationCode = `APT${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      const appointmentData = {
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        date: formData.date,
        time: formData.time,
        duration: formData.type === 'procedure' ? 60 : 30,
        type: formData.type,
        status: 'scheduled',
        reason: formData.reason,
        notes: formData.notes,
        location: formData.location,
        priority: formData.priority,
        confirmationCode,
        qrCode: 'generated-qr-code'
      };
      
      // Create appointment in Firebase
      const createdAppointment = await firebaseService.createAppointment(appointmentData);
      
      // Enrich with patient and doctor data
      const enrichedAppointment = {
        ...createdAppointment,
        patient: patients.find(p => p.id === formData.patientId),
        doctor: doctors.find(d => d.id === formData.doctorId)
      };
      
      setScheduledAppointment(enrichedAppointment);
      
      // Send notifications
      await sendNotification(enrichedAppointment);

      // Reset form and show QR code
      setFormData({
        patientType: 'existing',
        patientId: '',
        patientFirstName: '',
        patientLastName: '',
        patientPhone: '',
        patientEmail: '',
        patientAge: '',
        patientGender: 'male',
        doctorId: '',
        date: '',
        time: '',
        type: 'consultation',
        reason: '',
        notes: '',
        location: 'clinic',
        priority: 'medium'
      });

      setCurrentStep(1);
      setIsAddDialogOpen(false);
      setShowQRCode(true);

    } catch (error) {
      console.error('Error scheduling appointment:', error);
      toast.error(language === 'ar' ? 'حدث خطأ في حجز الموعد' : 'Error scheduling appointment');
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = useMemo(() => {
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    
    return appointments.filter(appointment => {
      const matchesDate = view === 'day' ? appointment.date === selectedDateStr : true;
      const matchesDoctor = selectedDoctor === 'all' || appointment.doctorId === selectedDoctor;
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
      const matchesSearch = searchTerm === '' || 
        appointment.patient?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.patient?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.doctor?.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesDate && matchesDoctor && matchesStatus && matchesSearch;
    });
  }, [appointments, selectedDate, selectedDoctor, statusFilter, searchTerm, view]);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'scheduled': return 'outline';
      case 'confirmed': return 'default';
      case 'in-progress': return 'secondary';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      case 'no-show': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-3 w-3" />;
      case 'confirmed': return <CheckCircle className="h-3 w-3" />;
      case 'in-progress': return <Timer className="h-3 w-3" />;
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      case 'cancelled': return <XCircle className="h-3 w-3" />;
      case 'no-show': return <AlertCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'urgent': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'follow-up': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'procedure': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'emergency': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <User className="mx-auto h-16 w-16 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('appointments.step.patient')}</h3>
              <p className="text-muted-foreground">{t('appointments.selectPatient')}</p>
            </div>

            <div className="flex gap-4 mb-6">
              <Button
                variant={formData.patientType === 'existing' ? 'default' : 'outline'}
                onClick={() => setFormData({...formData, patientType: 'existing'})}
                className="flex-1"
              >
                <UserCheck className="mr-2 h-4 w-4" />
                {t('appointments.existingPatient')}
              </Button>
              <Button
                variant={formData.patientType === 'new' ? 'default' : 'outline'}
                onClick={() => setFormData({...formData, patientType: 'new'})}
                className="flex-1"
              >
                <Plus className="mr-2 h-4 w-4" />
                {t('appointments.newPatient')}
              </Button>
            </div>

            {formData.patientType === 'existing' ? (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('appointments.searchPatients')}
                    className="pl-10"
                  />
                </div>
                
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {patients.map(patient => (
                    <motion.div
                      key={patient.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        formData.patientId === patient.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setFormData({...formData, patientId: patient.id})}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>
                            {(patient.firstName || patient.name?.split(' ')[0] || '?').charAt(0)}
                            {(patient.lastName || patient.name?.split(' ')[1] || '?').charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">
                            {patient.firstName || patient.name} {patient.lastName || ''}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-4">
                            <span>{patient.medicalNumber}</span>
                            <span>{patient.age} {t('common.years')}</span>
                            <span>{t(`common.${patient.gender}`)}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {patient.phone} • {patient.email}
                          </div>
                        </div>
                        {formData.patientId === patient.id && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t('patients.firstName')}</Label>
                    <Input
                      value={formData.patientFirstName}
                      onChange={(e) => setFormData({...formData, patientFirstName: e.target.value})}
                      placeholder={t('patients.enterFirstName')}
                    />
                  </div>
                  <div>
                    <Label>{t('patients.lastName')}</Label>
                    <Input
                      value={formData.patientLastName}
                      onChange={(e) => setFormData({...formData, patientLastName: e.target.value})}
                      placeholder={t('patients.enterLastName')}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t('patients.phone')}</Label>
                    <Input
                      value={formData.patientPhone}
                      onChange={(e) => setFormData({...formData, patientPhone: e.target.value})}
                      placeholder={t('patients.enterPhone')}
                    />
                  </div>
                  <div>
                    <Label>{t('patients.email')}</Label>
                    <Input
                      type="email"
                      value={formData.patientEmail}
                      onChange={(e) => setFormData({...formData, patientEmail: e.target.value})}
                      placeholder={t('patients.enterEmail')}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t('patients.age')}</Label>
                    <Input
                      type="number"
                      value={formData.patientAge}
                      onChange={(e) => setFormData({...formData, patientAge: e.target.value})}
                      placeholder={t('patients.enterAge')}
                    />
                  </div>
                  <div>
                    <Label>{t('patients.gender')}</Label>
                    <Select value={formData.patientGender} onValueChange={(value) => setFormData({...formData, patientGender: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">{t('common.male')}</SelectItem>
                        <SelectItem value="female">{t('common.female')}</SelectItem>
                        <SelectItem value="other">{t('common.other')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        );

      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <Stethoscope className="mx-auto h-16 w-16 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('appointments.step.doctor')}</h3>
              <p className="text-muted-foreground">{t('appointments.selectDoctor')}</p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('appointments.searchDoctors')}
                className="pl-10"
              />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-3">
              {doctors.map(doctor => (
                <motion.div
                  key={doctor.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    formData.doctorId === doctor.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setFormData({...formData, doctorId: doctor.id})}
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback>
                        {doctor.name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-lg">{doctor.name}</div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {doctor.specialization}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {doctor.rating}
                        </span>
                        <span>{doctor.experience} {t('appointments.yearsExp')}</span>
                        <span className="font-medium text-primary">
                          {doctor.fee} {t('common.currency')}
                        </span>
                        <span className="text-green-600">
                          {Object.keys(doctor.schedule).length} {t('appointments.daysAvailable')}
                        </span>
                      </div>
                    </div>
                    {formData.doctorId === doctor.id && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <CalendarIcon className="mx-auto h-16 w-16 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('appointments.step.datetime')}</h3>
              <p className="text-muted-foreground">{t('appointments.selectDate')} & {t('appointments.selectTime')}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-medium">{t('appointments.selectDate')}</Label>
                <Calendar
                  mode="single"
                  selected={formData.date ? new Date(formData.date) : undefined}
                  onSelect={(date) => date && setFormData({...formData, date: date.toISOString().split('T')[0]})}
                  className="rounded-md border w-full mt-2"
                  disabled={(date) => date < new Date()}
                />
              </div>
              
              <div>
                <Label className="text-base font-medium">{t('appointments.selectTime')}</Label>
                <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto mt-2 p-2 border rounded-lg">
                  {timeSlots.map(time => (
                    <Button
                      key={time}
                      variant={formData.time === time ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFormData({...formData, time})}
                      className="justify-center"
                    >
                      {formatTime(time)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <Edit className="mx-auto h-16 w-16 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('appointments.step.details')}</h3>
              <p className="text-muted-foreground">{t('appointments.enterDetails')}</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('appointments.selectType')}</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">{t('appointments.consultation')}</SelectItem>
                      <SelectItem value="follow-up">{t('appointments.followUp')}</SelectItem>
                      <SelectItem value="procedure">{t('appointments.procedure')}</SelectItem>
                      <SelectItem value="emergency">{t('appointments.emergency')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{t('appointments.priority')}</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">{t('appointments.low')}</SelectItem>
                      <SelectItem value="medium">{t('appointments.medium')}</SelectItem>
                      <SelectItem value="high">{t('appointments.high')}</SelectItem>
                      <SelectItem value="urgent">{t('appointments.urgent')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>{t('appointments.reason')} *</Label>
                <Textarea
                  placeholder={t('appointments.reasonPlaceholder')}
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  rows={3}
                />
              </div>

              <div>
                <Label>{t('appointments.notes')}</Label>
                <Textarea
                  placeholder={t('appointments.notesPlaceholder')}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                />
              </div>

              <div>
                <Label>{t('appointments.location')}</Label>
                <Select value={formData.location} onValueChange={(value) => setFormData({...formData, location: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clinic">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {t('appointments.clinic')}
                      </div>
                    </SelectItem>
                    <SelectItem value="emergency">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {t('appointments.emergencyRoom')}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        );

      case 5:
        const selectedPatient = patients.find(p => p.id === formData.patientId);
        const selectedDoctor = doctors.find(d => d.id === formData.doctorId);
        
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('appointments.step.confirm')}</h3>
              <p className="text-muted-foreground">{t('appointments.confirmDescription')}</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {t('appointments.appointmentDetails')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPatient && (
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {selectedPatient.firstName.charAt(0)}{selectedPatient.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {selectedPatient.firstName} {selectedPatient.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedPatient.medicalNumber} • {selectedPatient.age} {t('common.years')}
                      </div>
                    </div>
                  </div>
                )}

                {selectedDoctor && (
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {selectedDoctor.name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{selectedDoctor.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedDoctor.specialization}
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">{t('appointments.date')}</div>
                    <div className="font-medium">{formData.date && formatDate(formData.date)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{t('appointments.time')}</div>
                    <div className="font-medium">{formData.time && formatTime(formData.time)}</div>
                  </div>
                </div>

                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">{t('appointments.reason')}</div>
                  <div className="font-medium">{formData.reason}</div>
                  {formData.notes && (
                    <>
                      <div className="text-sm text-muted-foreground mt-2 mb-1">{t('appointments.notes')}</div>
                      <div className="text-sm">{formData.notes}</div>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Info className="h-4 w-4 text-blue-600" />
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    {t('appointments.importantInfo')}: {t('appointments.arriveEarly')}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.patientType === 'existing' ? formData.patientId !== '' : 
               formData.patientFirstName && formData.patientLastName && formData.patientPhone;
      case 2:
        return formData.doctorId !== '';
      case 3:
        return formData.date !== '' && formData.time !== '';
      case 4:
        return formData.reason.trim() !== '';
      case 5:
        return true;
      default:
        return false;
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
          <p className="text-muted-foreground">
            {t('appointments.totalAppointments')} {appointments.length}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={view === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('day')}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {t('appointments.dayView')}
          </Button>
          <Button
            variant={view === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('week')}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            {t('appointments.weekView')}
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t('appointments.schedule')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {t('appointments.schedule')}
                </DialogTitle>
                <DialogDescription>
                  {t('appointments.scheduleDescription')}
                </DialogDescription>
              </DialogHeader>

              {/* Progress Indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{t('appointments.step')} {currentStep} {t('common.of')} 5</span>
                  <span className="text-sm text-muted-foreground">{Math.round((currentStep / 5) * 100)}%</span>
                </div>
                <Progress value={(currentStep / 5) * 100} className="h-2" />
              </div>

              {/* Step Content */}
              <div className="min-h-[400px]">
                {renderStepContent()}
              </div>

              <DialogFooter className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {currentStep > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(currentStep - 1)}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      {t('common.back')}
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      setCurrentStep(1);
                    }}
                  >
                    {t('common.cancel')}
                  </Button>
                  {currentStep < 5 ? (
                    <Button
                      onClick={() => setCurrentStep(currentStep + 1)}
                      disabled={!isStepValid()}
                    >
                      {t('common.next')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleScheduleAppointment}
                      disabled={loading || !isStepValid()}
                      className="relative"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {t('common.scheduling')}
                        </>
                      ) : (
                        <>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {t('appointments.scheduleAppointment')}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {t('common.calendar')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
              
              {/* Filters */}
              <div className="mt-4 space-y-3">
                <div>
                  <Label>{t('appointments.doctor')}</Label>
                  <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('common.allDoctors')}</SelectItem>
                      {doctors.map(doctor => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>{t('common.status')}</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('common.allStatuses')}</SelectItem>
                      <SelectItem value="scheduled">{t('appointments.scheduled')}</SelectItem>
                      <SelectItem value="confirmed">{t('appointments.confirmed')}</SelectItem>
                      <SelectItem value="in-progress">{t('appointments.inProgress')}</SelectItem>
                      <SelectItem value="completed">{t('appointments.completed')}</SelectItem>
                      <SelectItem value="cancelled">{t('appointments.cancelled')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('appointments.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Appointments List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {formatDate(selectedDate.toISOString().split('T')[0])}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const yesterday = new Date(selectedDate);
                      yesterday.setDate(yesterday.getDate() - 1);
                      setSelectedDate(yesterday);
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDate(new Date())}
                  >
                    {t('common.today')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const tomorrow = new Date(selectedDate);
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      setSelectedDate(tomorrow);
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>{t('common.loading')}</p>
                </div>
              ) : filteredAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {t('appointments.noAppointments')}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {t('appointments.noAppointmentsDescription')}
                  </p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('appointments.schedule')}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAppointments
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((appointment, index) => (
                      <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="hover:shadow-lg transition-all duration-300 hover-lift border-l-4 border-l-primary/20 hover:border-l-primary">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4">
                                <motion.div 
                                  className="text-center min-w-[80px] p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20"
                                  whileHover={{ scale: 1.05 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                >
                                  <div className="text-lg font-bold text-primary">
                                    {formatTime(appointment.time)}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {appointment.duration}m
                                  </div>
                                  <div className="w-2 h-2 bg-primary rounded-full mx-auto mt-1 animate-pulse"></div>
                                </motion.div>
                                
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-3">
                                    <Avatar className="h-10 w-10">
                                      <AvatarImage src={appointment.patient?.avatar} />
                                      <AvatarFallback>
                                        {appointment.patient?.firstName.charAt(0)}
                                        {appointment.patient?.lastName.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h4 className="font-semibold">
                                        {appointment.patient?.firstName} {appointment.patient?.lastName}
                                      </h4>
                                      <p className="text-sm text-muted-foreground">
                                        {t('appointments.with')} {appointment.doctor?.name}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <p className="text-sm font-medium">{appointment.reason}</p>
                                    {appointment.notes && (
                                      <p className="text-xs text-muted-foreground">
                                        {appointment.notes}
                                      </p>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-2 mt-3">
                                    <Badge 
                                      variant={getStatusBadgeVariant(appointment.status)}
                                      className="flex items-center gap-1"
                                    >
                                      {getStatusIcon(appointment.status)}
                                      {t(`appointments.${appointment.status}`)}
                                    </Badge>
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs ${getTypeColor(appointment.type)}`}
                                    >
                                      {t(`appointments.${appointment.type}`)}
                                    </Badge>
                                    <div className={`text-xs font-medium ${getPriorityColor(appointment.priority)}`}>
                                      {t(`appointments.${appointment.priority}`)}
                                    </div>
                                    {appointment.confirmationCode && (
                                      <Badge variant="secondary" className="text-xs">
                                        {appointment.confirmationCode}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedAppointment(appointment);
                                    setShowQRCode(true);
                                  }}
                                >
                                  <QrCode className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedAppointment(appointment)}
                                >
                                  {t('common.view')}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedAppointment(appointment);
                                    setIsEditDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* QR Code Dialog */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              {t('appointments.appointmentQR')}
            </DialogTitle>
            <DialogDescription>
              {t('appointments.qrDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="text-center space-y-4">
            {(scheduledAppointment || selectedAppointment) && (
              <>
                <div className="bg-white p-4 rounded-lg border inline-block">
                  <img 
                    src={generateQRCode(scheduledAppointment || selectedAppointment)} 
                    alt="Appointment QR Code" 
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="text-lg font-semibold">
                    {(scheduledAppointment || selectedAppointment)?.confirmationCode}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('appointments.confirmationCode')}
                  </div>
                  
                  <div className="p-3 bg-muted/30 rounded-lg text-sm">
                    <div className="font-medium">
                      {(scheduledAppointment || selectedAppointment)?.patient?.firstName} {(scheduledAppointment || selectedAppointment)?.patient?.lastName}
                    </div>
                    <div className="text-muted-foreground">
                      {(scheduledAppointment || selectedAppointment)?.date && formatDate((scheduledAppointment || selectedAppointment)!.date)} - {(scheduledAppointment || selectedAppointment)?.time && formatTime((scheduledAppointment || selectedAppointment)!.time)}
                    </div>
                    <div className="text-muted-foreground">
                      {t('appointments.with')} {(scheduledAppointment || selectedAppointment)?.doctor?.name}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 justify-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const appointment = scheduledAppointment || selectedAppointment;
                      if (appointment) {
                        const qrData: AppointmentQRData = {
                          appointmentId: appointment.id,
                          patientId: appointment.patientId,
                          doctorId: appointment.doctorId,
                          date: appointment.date,
                          time: appointment.time,
                          confirmationCode: appointment.confirmationCode || 'N/A',
                          hospitalName: language === 'ar' ? 'مستشفى النور الطبي' : 'Al-Noor Medical Hospital'
                        };
                        const pdfData = generateAppointmentPDF(qrData);
                        const link = document.createElement('a');
                        link.href = pdfData;
                        link.download = `appointment-${appointment.confirmationCode}.txt`;
                        link.click();
                      }
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {t('common.download')}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      window.print();
                    }}
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    {t('common.print')}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const appointment = scheduledAppointment || selectedAppointment;
                      if (appointment) {
                        const qrData: AppointmentQRData = {
                          appointmentId: appointment.id,
                          patientId: appointment.patientId,
                          doctorId: appointment.doctorId,
                          date: appointment.date,
                          time: appointment.time,
                          confirmationCode: appointment.confirmationCode || 'N/A',
                          hospitalName: language === 'ar' ? 'مستشفى النور الطبي' : 'Al-Noor Medical Hospital'
                        };
                        shareAppointment(qrData);
                        toast.success(language === 'ar' ? 'تم نسخ تفاصيل الموعد' : 'Appointment details copied');
                      }
                    }}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    {t('common.share')}
                  </Button>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                >
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400 text-sm">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Bell className="h-4 w-4" />
                    </motion.div>
                    {t('appointments.notificationsSent')}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Check className="h-4 w-4 text-green-600" />
                    </motion.div>
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-500 mt-1">
                    {t('appointments.smsEmailSent')}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-green-600 dark:text-green-500">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      SMS ✓
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      Email ✓
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => {
                setShowQRCode(false);
                setScheduledAppointment(null);
                setSelectedAppointment(null);
              }}
            >
              {t('common.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComprehensiveAppointmentScheduler;