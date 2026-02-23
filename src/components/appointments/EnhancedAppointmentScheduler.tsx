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
  MapPin
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';
import { getInitials, getInitialsFromName } from '../../utils/stringHelpers';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  avatar?: string;
  schedule: {
    [key: string]: { // day of week
      start: string;
      end: string;
      slots: number; // appointments per hour
    };
  };
  experience: number;
  fee: number;
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
  duration: number; // in minutes
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
}

interface AppointmentSchedulerProps {
  isDemoMode?: boolean;
}

const EnhancedAppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({ isDemoMode = false }) => {
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
  const [formData, setFormData] = useState({
    patientType: 'existing',
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    type: 'consultation',
    reason: '',
    notes: '',
    location: 'clinic'
  });

  // Demo data with enhanced information
  const demoDoctors: Doctor[] = useMemo(() => [
    {
      id: '1',
      name: language === 'ar' ? 'د. أحمد محمد' : 'Dr. Ahmad Mohammad',
      specialization: language === 'ar' ? 'طب القلب' : 'Cardiology',
      experience: 15,
      fee: 500,
      schedule: {
        '0': { start: '09:00', end: '17:00', slots: 2 }, // Sunday
        '1': { start: '09:00', end: '17:00', slots: 2 }, // Monday
        '2': { start: '09:00', end: '17:00', slots: 2 }, // Tuesday
        '3': { start: '09:00', end: '17:00', slots: 2 }, // Wednesday
        '4': { start: '09:00', end: '15:00', slots: 2 }, // Thursday
      }
    },
    {
      id: '2',
      name: language === 'ar' ? 'د. سارة أحمد' : 'Dr. Sarah Johnson',
      specialization: language === 'ar' ? 'طب الأطفال' : 'Pediatrics',
      experience: 10,
      fee: 400,
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
      name: language === 'ar' ? 'د. محمد علي' : 'Dr. Mohammad Ali',
      specialization: language === 'ar' ? 'طب النساء والتوليد' : 'Obstetrics & Gynecology',
      experience: 20,
      fee: 600,
      schedule: {
        '0': { start: '10:00', end: '18:00', slots: 2 },
        '1': { start: '10:00', end: '18:00', slots: 2 },
        '2': { start: '10:00', end: '18:00', slots: 2 },
        '3': { start: '10:00', end: '18:00', slots: 2 },
        '4': { start: '10:00', end: '16:00', slots: 2 },
      }
    }
  ], [language]);

  const demoPatients: Patient[] = useMemo(() => [
    {
      id: '1',
      firstName: language === 'ar' ? 'علي' : 'Ali',
      lastName: language === 'ar' ? 'أحمد' : 'Ahmed',
      phone: '+966501234567',
      email: 'ali.ahmed@email.com',
      gender: 'male',
      age: 35,
      medicalNumber: 'MRN001'
    },
    {
      id: '2',
      firstName: language === 'ar' ? 'فاطمة' : 'Fatima',
      lastName: language === 'ar' ? 'محمد' : 'Mohammed',
      phone: '+966501234568',
      email: 'fatima.mohammed@email.com',
      gender: 'female',
      age: 28,
      medicalNumber: 'MRN002'
    },
    {
      id: '3',
      firstName: language === 'ar' ? 'خالد' : 'Khalid',
      lastName: language === 'ar' ? 'السعدي' : 'Al-Saadi',
      phone: '+966501234569',
      email: 'khalid.alsaadi@email.com',
      gender: 'male',
      age: 42,
      medicalNumber: 'MRN003'
    },
    {
      id: '4',
      firstName: language === 'ar' ? 'نورا' : 'Nora',
      lastName: language === 'ar' ? 'الغامدي' : 'Al-Ghamdi',
      phone: '+966501234570',
      email: 'nora.alghamdi@email.com',
      gender: 'female',
      age: 31,
      medicalNumber: 'MRN004'
    }
  ], [language]);

  const demoAppointments: Appointment[] = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return [
      {
        id: '1',
        patientId: '1',
        doctorId: '1',
        date: today.toISOString().split('T')[0],
        time: '09:00',
        duration: 30,
        type: 'consultation',
        status: 'scheduled',
        reason: language === 'ar' ? 'فحص دوري للقلب' : 'Routine cardiac checkup',
        notes: language === 'ar' ? 'مريض لديه تاريخ مع ارتفاع ضغط الدم' : 'Patient has history of hypertension',
        location: 'clinic',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        priority: 'medium',
        patient: demoPatients[0],
        doctor: demoDoctors[0]
      },
      {
        id: '2',
        patientId: '2',
        doctorId: '1',
        date: today.toISOString().split('T')[0],
        time: '10:00',
        duration: 45,
        type: 'follow-up',
        status: 'confirmed',
        reason: language === 'ar' ? 'متابعة نتائج التحاليل' : 'Follow-up on test results',
        location: 'clinic',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        priority: 'high',
        patient: demoPatients[1],
        doctor: demoDoctors[0]
      },
      {
        id: '3',
        patientId: '3',
        doctorId: '2',
        date: tomorrow.toISOString().split('T')[0],
        time: '11:00',
        duration: 30,
        type: 'consultation',
        status: 'scheduled',
        reason: language === 'ar' ? 'فحص سنوي للطفل' : 'Annual child checkup',
        location: 'clinic',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        priority: 'low',
        patient: demoPatients[2],
        doctor: demoDoctors[1]
      }
    ];
  }, [demoDoctors, demoPatients, language]);

  useEffect(() => {
    if (isDemoMode) {
      setDoctors(demoDoctors);
      setPatients(demoPatients);
      setAppointments(demoAppointments);
    } else {
      loadData();
    }
  }, [isDemoMode, demoDoctors, demoPatients, demoAppointments]);

  const loadData = useCallback(async () => {
    if (isDemoMode) return;
    
    setLoading(true);
    try {
      // Backend API calls would go here
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [isDemoMode]);

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

  const handleDeleteAppointment = async (appointment: Appointment) => {
    if (isDemoMode) {
      setAppointments(prev => prev.filter(a => a.id !== appointment.id));
      setIsDeleteDialogOpen(false);
      setAppointmentToDelete(null);
      return;
    }

    try {
      // Backend API call would go here
      await loadData();
      setIsDeleteDialogOpen(false);
      setAppointmentToDelete(null);
    } catch (error) {
      console.error('Error deleting appointment:', error);
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
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <User className="mx-auto h-12 w-12 text-primary mb-2" />
              <h3 className="text-lg font-semibold">{t('appointments.step.patient')}</h3>
              <p className="text-sm text-muted-foreground">{t('appointments.selectPatient')}</p>
            </div>

            <div className="flex gap-4 mb-4">
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

            {formData.patientType === 'existing' && (
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
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        formData.patientId === patient.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setFormData({...formData, patientId: patient.id})}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {getInitials(patient.firstName, patient.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">
                            {patient.firstName} {patient.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-4">
                            <span>{patient.medicalNumber}</span>
                            <span>{patient.age} {t('common.years')}</span>
                            <span>{t(`patients.${patient.gender}`)}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
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
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <Stethoscope className="mx-auto h-12 w-12 text-primary mb-2" />
              <h3 className="text-lg font-semibold">{t('appointments.step.doctor')}</h3>
              <p className="text-sm text-muted-foreground">{t('appointments.selectDoctor')}</p>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('appointments.searchDoctors')}
                className="pl-10"
              />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
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
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {getInitialsFromName(doctor.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{doctor.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {doctor.specialization}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{doctor.experience} {t('appointments.yearsExp')}</span>
                        <span>{doctor.fee} {t('common.currency')}</span>
                        <span className="text-green-600">
                          {Object.keys(doctor.schedule).length} {t('appointments.daysAvailable')}
                        </span>
                      </div>
                    </div>
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
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <CalendarIcon className="mx-auto h-12 w-12 text-primary mb-2" />
              <h3 className="text-lg font-semibold">{t('appointments.step.datetime')}</h3>
              <p className="text-sm text-muted-foreground">{t('appointments.selectDate')} & {t('appointments.selectTime')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{t('appointments.selectDate')}</Label>
                <Calendar
                  mode="single"
                  selected={formData.date ? new Date(formData.date) : undefined}
                  onSelect={(date) => date && setFormData({...formData, date: date.toISOString().split('T')[0]})}
                  className="rounded-md border"
                  disabled={(date) => date < new Date()}
                />
              </div>
              
              <div>
                <Label>{t('appointments.selectTime')}</Label>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto mt-2">
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
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <Edit className="mx-auto h-12 w-12 text-primary mb-2" />
              <h3 className="text-lg font-semibold">{t('appointments.step.details')}</h3>
              <p className="text-sm text-muted-foreground">{t('appointments.reason')}</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>{t('appointments.selectType')}</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">{t('appointments.consultation')}</SelectItem>
                    <SelectItem value="follow-up">{t('appointments.follow-up')}</SelectItem>
                    <SelectItem value="procedure">{t('appointments.procedure')}</SelectItem>
                    <SelectItem value="emergency">{t('appointments.emergency')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{t('appointments.reason')}</Label>
                <Textarea
                  placeholder={t('appointments.reasonPlaceholder')}
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                />
              </div>

              <div>
                <Label>{t('appointments.notes')}</Label>
                <Textarea
                  placeholder={t('appointments.notesPlaceholder')}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
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
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-2" />
              <h3 className="text-lg font-semibold">{t('appointments.step.confirm')}</h3>
              <p className="text-sm text-muted-foreground">{t('appointments.confirmDescription')}</p>
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
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {getInitials(selectedPatient.firstName, selectedPatient.lastName)}
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
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {getInitialsFromName(selectedDoctor.name)}
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('common.date')}</Label>
                    <div className="font-medium">{formData.date ? formatDate(formData.date) : ''}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('common.time')}</Label>
                    <div className="font-medium">{formData.time ? formatTime(formData.time) : ''}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('appointments.type')}</Label>
                    <div className="font-medium">{t(`appointments.${formData.type}`)}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('appointments.location')}</Label>
                    <div className="font-medium">{t(`appointments.${formData.location}`)}</div>
                  </div>
                </div>

                {formData.reason && (
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('appointments.reason')}</Label>
                    <div className="text-sm">{formData.reason}</div>
                  </div>
                )}

                {formData.notes && (
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('appointments.notes')}</Label>
                    <div className="text-sm">{formData.notes}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  {t('appointments.importantInfo')}
                </h4>
                <div className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <div>• {t('appointments.arriveEarly')}</div>
                  <div>• {t('appointments.bringDocuments')}</div>
                  <div>• {t('appointments.confirmationSent')}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}
      >
        <div className={isRTL ? 'text-right' : ''}>
          <h1 className="text-3xl font-bold text-primary">{t('appointments.title')}</h1>
          <p className="text-muted-foreground">
            {t('appointments.totalAppointments', { count: appointments.length })}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={view === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('day')}
            className="animate-fade-in"
          >
            {t('appointments.dayView')}
          </Button>
          <Button
            variant={view === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('week')}
            className="animate-fade-in"
          >
            {t('appointments.weekView')}
          </Button>
          <Button
            variant={view === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('month')}
            className="animate-fade-in"
          >
            {t('appointments.monthView')}
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 hover-lift btn-press">
                <Plus className="h-4 w-4" />
                {t('appointments.schedule')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
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
              <div className="flex items-center justify-center mb-6">
                {[1, 2, 3, 4, 5].map((step) => (
                  <React.Fragment key={step}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep === step 
                        ? 'bg-primary text-primary-foreground' 
                        : currentStep > step 
                          ? 'bg-green-600 text-white' 
                          : 'bg-muted text-muted-foreground'
                    }`}>
                      {currentStep > step ? <CheckCircle className="h-4 w-4" /> : step}
                    </div>
                    {step < 5 && (
                      <div className={`w-12 h-0.5 ${
                        currentStep > step ? 'bg-green-600' : 'bg-muted'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="min-h-[400px] overflow-y-auto">
                {renderStepContent()}
              </div>

              <DialogFooter className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {currentStep > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(currentStep - 1)}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
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
                      setFormData({
                        patientType: 'existing',
                        patientId: '',
                        doctorId: '',
                        date: '',
                        time: '',
                        type: 'consultation',
                        reason: '',
                        notes: '',
                        location: 'clinic'
                      });
                    }}
                  >
                    {t('common.cancel')}
                  </Button>
                  
                  {currentStep < 5 ? (
                    <Button 
                      onClick={() => setCurrentStep(currentStep + 1)}
                      disabled={
                        (currentStep === 1 && !formData.patientId) ||
                        (currentStep === 2 && !formData.doctorId) ||
                        (currentStep === 3 && (!formData.date || !formData.time)) ||
                        (currentStep === 4 && !formData.reason)
                      }
                    >
                      {t('common.next')}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => {
                        // Handle appointment creation
                        console.log('Creating appointment:', formData);
                        setIsAddDialogOpen(false);
                        setCurrentStep(1);
                        setFormData({
                          patientType: 'existing',
                          patientId: '',
                          doctorId: '',
                          date: '',
                          time: '',
                          type: 'consultation',
                          reason: '',
                          notes: '',
                          location: 'clinic'
                        });
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {t('appointments.scheduleAppointment')}
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
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="card-animate">
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
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('appointments.searchPlaceholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 focus-ring"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Appointments List/Calendar View */}
          {view === 'day' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="card-animate">
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
                        className="hover-scale"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDate(new Date())}
                        className="hover-scale"
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
                        className="hover-scale"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="spinner-medical w-8 h-8 border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent rounded-full mx-auto mb-4"></div>
                      <p>{t('common.loading')}</p>
                    </div>
                  ) : filteredAppointments.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        {t('appointments.noAppointments')}
                      </h3>
                      <p className="text-muted-foreground">
                        {t('appointments.noAppointmentsDescription')}
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-4 stagger-animation">
                      {filteredAppointments
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((appointment, index) => (
                          <motion.div
                            key={appointment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Card className="hover:shadow-md transition-all duration-200 hover-lift">
                              <CardContent className="p-4">
                                <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                                  <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <div className={`text-center min-w-[60px] ${isRTL ? 'text-right' : ''}`}>
                                      <div className="text-lg font-semibold">
                                        {formatTime(appointment.time)}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {appointment.duration}m
                                      </div>
                                    </div>
                                    
                                    <div className="flex-1">
                                      <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <Avatar className="h-8 w-8">
                                          <AvatarImage src={appointment.patient?.avatar} />
                                          <AvatarFallback>
                                            {getInitials(appointment.patient?.firstName, appointment.patient?.lastName)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div className={isRTL ? 'text-right' : ''}>
                                          <h4 className="font-medium">
                                            {appointment.patient?.firstName} {appointment.patient?.lastName}
                                          </h4>
                                          <p className="text-sm text-muted-foreground">
                                            {t('appointments.with')} {appointment.doctor?.name}
                                          </p>
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-1">
                                        <p className={`text-sm ${isRTL ? 'text-right' : ''}`}>
                                          {appointment.reason}
                                        </p>
                                        {appointment.notes && (
                                          <p className={`text-xs text-muted-foreground ${isRTL ? 'text-right' : ''}`}>
                                            {appointment.notes}
                                          </p>
                                        )}
                                      </div>
                                      
                                      <div className={`flex items-center gap-2 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <Badge 
                                          variant={getStatusBadgeVariant(appointment.status)}
                                          className="flex items-center gap-1 animate-fade-in"
                                        >
                                          {getStatusIcon(appointment.status)}
                                          {t(`appointments.${appointment.status}`)}
                                        </Badge>
                                        <Badge 
                                          variant="outline" 
                                          className={`text-xs ${getTypeColor(appointment.type)} animate-fade-in`}
                                        >
                                          {t(`appointments.${appointment.type}`)}
                                        </Badge>
                                        <div className={`text-xs font-medium ${getPriorityColor(appointment.priority)}`}>
                                          {t(`appointments.${appointment.priority}`)}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setSelectedAppointment(appointment)}
                                      className="hover-scale btn-press"
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
                                      className="hover-scale btn-press"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setAppointmentToDelete(appointment);
                                        setIsDeleteDialogOpen(true);
                                      }}
                                      className="hover-scale btn-press"
                                    >
                                      <Trash2 className="h-4 w-4" />
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
            </motion.div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="modal-content">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('appointments.deleteAppointment')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('appointments.deleteConfirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => appointmentToDelete && handleDeleteAppointment(appointmentToDelete)}
              className="bg-destructive hover:bg-destructive/90"
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EnhancedAppointmentScheduler;