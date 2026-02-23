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
  ClockIcon,
  Users,
  CalendarDays
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';
import { getInitials } from '../../utils/stringHelpers';

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
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  avatar?: string;
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

const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({ isDemoMode = false }) => {
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

  // Demo data
  const demoDoctors: Doctor[] = useMemo(() => [
    {
      id: '1',
      name: 'د. أحمد محمد',
      specialization: 'طب القلب',
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
      name: 'Dr. Sarah Johnson',
      specialization: 'Pediatrics',
      schedule: {
        '0': { start: '08:00', end: '16:00', slots: 3 },
        '1': { start: '08:00', end: '16:00', slots: 3 },
        '2': { start: '08:00', end: '16:00', slots: 3 },
        '3': { start: '08:00', end: '16:00', slots: 3 },
        '4': { start: '08:00', end: '14:00', slots: 3 },
      }
    }
  ], []);

  const demoPatients: Patient[] = useMemo(() => [
    {
      id: '1',
      firstName: 'علي',
      lastName: 'أحمد',
      phone: '+966501234567',
      email: 'ali.ahmed@email.com'
    },
    {
      id: '2',
      firstName: 'فاطمة',
      lastName: 'محمد',
      phone: '+966501234568',
      email: 'fatima.mohamed@email.com'
    },
    {
      id: '3',
      firstName: 'John',
      lastName: 'Smith',
      phone: '+1234567890',
      email: 'john.smith@email.com'
    }
  ], []);

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
        reason: 'فحص دوري للقلب',
        notes: 'مريض لديه تاريخ مع ارتفاع ضغط الدم',
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
        reason: 'متابعة نتائج التحاليل',
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
        reason: 'Annual checkup for child',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        priority: 'low',
        patient: demoPatients[2],
        doctor: demoDoctors[1]
      }
    ];
  }, [demoDoctors, demoPatients]);

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
      // const [appointmentsRes, doctorsRes, patientsRes] = await Promise.all([
      //   fetch('/api/appointments'),
      //   fetch('/api/doctors'),
      //   fetch('/api/patients')
      // ]);
      // setAppointments(await appointmentsRes.json());
      // setDoctors(await doctorsRes.json());
      // setPatients(await patientsRes.json());
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
      case 'consultation': return 'bg-blue-100 text-blue-800';
      case 'follow-up': return 'bg-green-100 text-green-800';
      case 'procedure': return 'bg-purple-100 text-purple-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
      // await fetch(`/api/appointments/${appointment.id}`, { method: 'DELETE' });
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

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
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
          >
            {t('appointments.dayView')}
          </Button>
          <Button
            variant={view === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('week')}
          >
            {t('appointments.weekView')}
          </Button>
          <Button
            variant={view === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('month')}
          >
            {t('appointments.monthView')}
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t('appointments.schedule')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t('appointments.schedule')}</DialogTitle>
                <DialogDescription>
                  {t('appointments.scheduleDescription')}
                </DialogDescription>
              </DialogHeader>
              {/* Add appointment form would go here */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patient">{t('appointments.patient')}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t('appointments.selectPatient')} />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map(patient => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.firstName} {patient.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="doctor">{t('appointments.doctor')}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t('appointments.selectDoctor')} />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map(doctor => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            {doctor.name} - {doctor.specialization}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* More form fields would go here */}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button>{t('appointments.schedule')}</Button>
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
          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('appointments.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appointments List/Calendar View */}
          {view === 'day' && (
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
                    <p className="text-muted-foreground">
                      {t('appointments.noAppointmentsDescription')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAppointments
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((appointment) => (
                        <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4">
                                <div className="text-center min-w-[60px]">
                                  <div className="text-lg font-semibold">
                                    {formatTime(appointment.time)}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {appointment.duration}m
                                  </div>
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={appointment.patient?.avatar} />
                                      <AvatarFallback>
                                        {getInitials(appointment.patient?.firstName, appointment.patient?.lastName)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h4 className="font-medium">
                                        {appointment.patient?.firstName} {appointment.patient?.lastName}
                                      </h4>
                                      <p className="text-sm text-muted-foreground">
                                        {t('appointments.with')} {appointment.doctor?.name}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-1">
                                    <p className="text-sm">{appointment.reason}</p>
                                    {appointment.notes && (
                                      <p className="text-xs text-muted-foreground">
                                        {appointment.notes}
                                      </p>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-2 mt-2">
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
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
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
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setAppointmentToDelete(appointment);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Appointment Details Dialog */}
      {selectedAppointment && (
        <Dialog open={!!selectedAppointment && !isEditDialogOpen} onOpenChange={() => setSelectedAppointment(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <CalendarIcon className="h-5 w-5" />
                {t('appointments.appointmentDetails')}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('appointments.patient')}</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={selectedAppointment.patient?.avatar} />
                      <AvatarFallback>
                        {getInitials(selectedAppointment.patient?.firstName, selectedAppointment.patient?.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {selectedAppointment.patient?.firstName} {selectedAppointment.patient?.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedAppointment.patient?.phone}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label>{t('appointments.doctor')}</Label>
                  <div className="mt-1">
                    <p className="font-medium">{selectedAppointment.doctor?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedAppointment.doctor?.specialization}
                    </p>
                  </div>
                </div>
                
                <div>
                  <Label>{t('appointments.datetime')}</Label>
                  <p className="text-sm mt-1">
                    {formatDate(selectedAppointment.date)} - {formatTime(selectedAppointment.time)}
                  </p>
                </div>
                
                <div>
                  <Label>{t('appointments.duration')}</Label>
                  <p className="text-sm mt-1">{selectedAppointment.duration} {t('common.minutes')}</p>
                </div>
                
                <div>
                  <Label>{t('appointments.type')}</Label>
                  <Badge className={`mt-1 ${getTypeColor(selectedAppointment.type)}`}>
                    {t(`appointments.${selectedAppointment.type}`)}
                  </Badge>
                </div>
                
                <div>
                  <Label>{t('common.status')}</Label>
                  <Badge 
                    variant={getStatusBadgeVariant(selectedAppointment.status)}
                    className="flex items-center gap-1 mt-1 w-fit"
                  >
                    {getStatusIcon(selectedAppointment.status)}
                    {t(`appointments.${selectedAppointment.status}`)}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label>{t('appointments.reason')}</Label>
                <p className="text-sm mt-1">{selectedAppointment.reason}</p>
              </div>
              
              {selectedAppointment.notes && (
                <div>
                  <Label>{t('appointments.notes')}</Label>
                  <p className="text-sm mt-1">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
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
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AppointmentScheduler;