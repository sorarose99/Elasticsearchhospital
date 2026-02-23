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
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Save, 
  User, 
  Stethoscope,
  MapPin,
  AlertCircle,
  CheckCircle,
  Info,
  Star,
  Phone,
  Mail,
  Clock3,
  CalendarCheck,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';
import { getInitials, getInitialsFromName } from '../../utils/stringHelpers';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  avatar?: string;
  rating: number;
  experience: number;
  consultationFee: number;
  availableDays: string[];
  timeSlots: {
    [key: string]: { start: string; end: string; booked: string[] };
  };
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  avatar?: string;
  medicalHistory?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
}

interface AppointmentFormData {
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  duration: number;
  type: 'consultation' | 'follow-up' | 'procedure' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reason: string;
  notes?: string;
  symptoms?: string;
  location: string;
}

interface ScheduleProps {
  isDemoMode?: boolean;
  onAppointmentScheduled?: (appointment: AppointmentFormData) => void;
}

const Schedule: React.FC<ScheduleProps> = ({ isDemoMode = false, onAppointmentScheduled }) => {
  const { t, language, isRTL } = useLanguage();
  const { effectiveTheme } = useTheme();

  const [step, setStep] = useState<'patient' | 'doctor' | 'datetime' | 'details' | 'confirm'>('patient');
  const [formData, setFormData] = useState<Partial<AppointmentFormData>>({});
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [newPatientData, setNewPatientData] = useState<Partial<Patient>>({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Demo data
  const demoDoctors: Doctor[] = useMemo(() => [
    {
      id: '1',
      name: 'د. أحمد محمد السالم',
      specialization: 'طب القلب والأوعية الدموية',
      rating: 4.9,
      experience: 15,
      consultationFee: 300,
      availableDays: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
      timeSlots: {
        sunday: { start: '09:00', end: '17:00', booked: ['10:00', '14:00'] },
        monday: { start: '09:00', end: '17:00', booked: ['11:00', '15:00'] },
        tuesday: { start: '09:00', end: '17:00', booked: [] },
        wednesday: { start: '09:00', end: '17:00', booked: ['09:30', '13:00'] },
        thursday: { start: '09:00', end: '15:00', booked: ['10:30'] },
      }
    },
    {
      id: '2',
      name: 'Dr. Sarah Johnson',
      specialization: 'Pediatrics & Child Health',
      rating: 4.8,
      experience: 12,
      consultationFee: 250,
      availableDays: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
      timeSlots: {
        sunday: { start: '08:00', end: '16:00', booked: ['09:00', '13:00'] },
        monday: { start: '08:00', end: '16:00', booked: ['10:00', '14:00'] },
        tuesday: { start: '08:00', end: '16:00', booked: [] },
        wednesday: { start: '08:00', end: '16:00', booked: ['11:00'] },
        thursday: { start: '08:00', end: '14:00', booked: ['08:30', '12:00'] },
      }
    },
    {
      id: '3',
      name: 'د. فاطمة الزهراء',
      specialization: 'طب النساء والولادة',
      rating: 4.9,
      experience: 18,
      consultationFee: 350,
      availableDays: ['sunday', 'monday', 'tuesday', 'wednesday'],
      timeSlots: {
        sunday: { start: '10:00', end: '18:00', booked: ['11:00', '15:00'] },
        monday: { start: '10:00', end: '18:00', booked: ['12:00', '16:00'] },
        tuesday: { start: '10:00', end: '18:00', booked: ['10:30'] },
        wednesday: { start: '10:00', end: '18:00', booked: ['14:00', '17:00'] },
      }
    }
  ], []);

  const demoPatients: Patient[] = useMemo(() => [
    {
      id: '1',
      firstName: 'علي',
      lastName: 'أحمد المالكي',
      phone: '+966501234567',
      email: 'ali.ahmed@email.com',
      dateOfBirth: '1985-03-15',
      gender: 'male',
      medicalHistory: ['ارتفاع ضغط الدم', 'السكري من النوع الثاني'],
      emergencyContact: {
        name: 'فاطمة المالكي',
        phone: '+966501234568',
        relation: 'زوجة'
      }
    },
    {
      id: '2',
      firstName: 'نورا',
      lastName: 'محمد الخالد',
      phone: '+966501234569',
      email: 'nora.mohamed@email.com',
      dateOfBirth: '1992-07-22',
      gender: 'female',
      medicalHistory: ['حساسية من البنسلين'],
      emergencyContact: {
        name: 'محمد الخالد',
        phone: '+966501234570',
        relation: 'والد'
      }
    },
    {
      id: '3',
      firstName: 'سارة',
      lastName: 'عبدالله القحطاني',
      phone: '+966501234571',
      email: 'sarah.abdullah@email.com',
      dateOfBirth: '1988-11-08',
      gender: 'female',
      medicalHistory: [],
      emergencyContact: {
        name: 'أحمد القحطاني',
        phone: '+966501234572',
        relation: 'زوج'
      }
    }
  ], []);

  useEffect(() => {
    if (isDemoMode) {
      setDoctors(demoDoctors);
      setPatients(demoPatients);
    }
  }, [isDemoMode, demoDoctors, demoPatients]);

  const generateTimeSlots = useCallback((doctor: Doctor, date: Date) => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const daySlots = doctor.timeSlots[dayName];
    
    if (!daySlots || !doctor.availableDays.includes(dayName)) {
      return [];
    }

    const slots = [];
    const [startHour, startMinute] = daySlots.start.split(':').map(Number);
    const [endHour, endMinute] = daySlots.end.split(':').map(Number);
    
    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;
    
    for (let time = start; time < end; time += 30) {
      const hour = Math.floor(time / 60);
      const minute = time % 60;
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      if (!daySlots.booked.includes(timeString)) {
        slots.push(timeString);
      }
    }
    
    return slots;
  }, []);

  useEffect(() => {
    if (formData.doctorId && selectedDate) {
      const doctor = doctors.find(d => d.id === formData.doctorId);
      if (doctor) {
        const slots = generateTimeSlots(doctor, selectedDate);
        setAvailableSlots(slots);
      }
    }
  }, [formData.doctorId, selectedDate, doctors, generateTimeSlots]);

  const filteredPatients = useMemo(() => {
    if (!searchTerm) return patients;
    return patients.filter(patient => 
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [patients, searchTerm]);

  const filteredDoctors = useMemo(() => {
    if (!searchTerm) return doctors;
    return doctors.filter(doctor => 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [doctors, searchTerm]);

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

  const handleSubmit = async () => {
    if (!formData.patientId || !formData.doctorId || !formData.date || !formData.time) {
      return;
    }

    setLoading(true);
    try {
      const appointmentData: AppointmentFormData = {
        patientId: formData.patientId!,
        doctorId: formData.doctorId!,
        date: formData.date!,
        time: formData.time!,
        duration: formData.duration || 30,
        type: formData.type || 'consultation',
        priority: formData.priority || 'medium',
        reason: formData.reason || '',
        notes: formData.notes,
        symptoms: formData.symptoms,
        location: formData.location || 'عيادة 1'
      };

      if (onAppointmentScheduled) {
        onAppointmentScheduled(appointmentData);
      }

      // Reset form
      setFormData({});
      setStep('patient');
      setSelectedDate(undefined);
      setIsNewPatient(false);
      setNewPatientData({});
      setSearchTerm('');
    } catch (error) {
      console.error('Error scheduling appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    switch (step) {
      case 'patient':
        setStep('doctor');
        break;
      case 'doctor':
        setStep('datetime');
        break;
      case 'datetime':
        setStep('details');
        break;
      case 'details':
        setStep('confirm');
        break;
    }
    setSearchTerm('');
  };

  const prevStep = () => {
    switch (step) {
      case 'doctor':
        setStep('patient');
        break;
      case 'datetime':
        setStep('doctor');
        break;
      case 'details':
        setStep('datetime');
        break;
      case 'confirm':
        setStep('details');
        break;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'patient':
        return formData.patientId || (isNewPatient && newPatientData.firstName && newPatientData.lastName && newPatientData.phone);
      case 'doctor':
        return formData.doctorId;
      case 'datetime':
        return formData.date && formData.time;
      case 'details':
        return formData.reason;
      default:
        return false;
    }
  };

  const getStepIcon = (currentStep: string) => {
    switch (currentStep) {
      case 'patient': return <User className="h-5 w-5" />;
      case 'doctor': return <Stethoscope className="h-5 w-5" />;
      case 'datetime': return <CalendarIcon className="h-5 w-5" />;
      case 'details': return <Info className="h-5 w-5" />;
      case 'confirm': return <CheckCircle className="h-5 w-5" />;
      default: return <div className="h-5 w-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-primary mb-2">
          {t('appointments.schedule')}
        </h1>
        <p className="text-muted-foreground">
          {t('appointments.scheduleDescription')}
        </p>
      </motion.div>

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {['patient', 'doctor', 'datetime', 'details', 'confirm'].map((stepName, index) => (
                <div key={stepName} className="flex items-center">
                  <motion.div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                      step === stepName
                        ? 'bg-primary text-primary-foreground border-primary'
                        : index < ['patient', 'doctor', 'datetime', 'details', 'confirm'].indexOf(step)
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-muted text-muted-foreground border-muted'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {getStepIcon(stepName)}
                  </motion.div>
                  {index < 4 && (
                    <div
                      className={`w-16 h-0.5 mx-2 transition-colors duration-300 ${
                        index < ['patient', 'doctor', 'datetime', 'details', 'confirm'].indexOf(step)
                          ? 'bg-green-500'
                          : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3">
              {['patient', 'doctor', 'datetime', 'details', 'confirm'].map((stepName) => (
                <div key={stepName} className="text-xs text-center w-10">
                  {t(`appointments.step.${stepName}`)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStepIcon(step)}
                {t(`appointments.step.${step}`)}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Patient Selection Step */}
              {step === 'patient' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        variant={!isNewPatient ? 'default' : 'outline'}
                        onClick={() => setIsNewPatient(false)}
                        className="flex items-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        {t('appointments.existingPatient')}
                      </Button>
                      <Button
                        variant={isNewPatient ? 'default' : 'outline'}
                        onClick={() => setIsNewPatient(true)}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        {t('appointments.newPatient')}
                      </Button>
                    </div>
                  </div>

                  {!isNewPatient ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <Input
                          placeholder={t('appointments.searchPatients')}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                      
                      <ScrollArea className="h-64">
                        <div className="grid gap-3">
                          {filteredPatients.map((patient) => (
                            <motion.div
                              key={patient.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Card
                                className={`cursor-pointer transition-all hover:shadow-md ${
                                  formData.patientId === patient.id ? 'ring-2 ring-primary' : ''
                                }`}
                                onClick={() => setFormData(prev => ({ ...prev, patientId: patient.id }))}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-3">
                                    <Avatar>
                                      <AvatarImage src={patient.avatar} />
                                      <AvatarFallback>
                                        {getInitials(patient.firstName, patient.lastName)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <h4 className="font-medium">
                                        {patient.firstName} {patient.lastName}
                                      </h4>
                                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                          <Phone className="h-3 w-3" />
                                          {patient.phone}
                                        </div>
                                        {patient.email && (
                                          <div className="flex items-center gap-1">
                                            <Mail className="h-3 w-3" />
                                            {patient.email}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">{t('patients.firstName')} *</Label>
                          <Input
                            id="firstName"
                            value={newPatientData.firstName || ''}
                            onChange={(e) => setNewPatientData(prev => ({ ...prev, firstName: e.target.value }))}
                            placeholder={t('patients.firstNamePlaceholder')}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">{t('patients.lastName')} *</Label>
                          <Input
                            id="lastName"
                            value={newPatientData.lastName || ''}
                            onChange={(e) => setNewPatientData(prev => ({ ...prev, lastName: e.target.value }))}
                            placeholder={t('patients.lastNamePlaceholder')}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">{t('patients.phone')} *</Label>
                          <Input
                            id="phone"
                            value={newPatientData.phone || ''}
                            onChange={(e) => setNewPatientData(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="+966501234567"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">{t('patients.email')}</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newPatientData.email || ''}
                            onChange={(e) => setNewPatientData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="patient@email.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="dateOfBirth">{t('patients.dateOfBirth')}</Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={newPatientData.dateOfBirth || ''}
                            onChange={(e) => setNewPatientData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="gender">{t('patients.gender')}</Label>
                          <Select
                            value={newPatientData.gender}
                            onValueChange={(value: 'male' | 'female') => setNewPatientData(prev => ({ ...prev, gender: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t('patients.selectGender')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">{t('patients.male')}</SelectItem>
                              <SelectItem value="female">{t('patients.female')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Doctor Selection Step */}
              {step === 'doctor' && (
                <div className="space-y-6">
                  <div className="relative">
                    <Input
                      placeholder={t('appointments.searchDoctors')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                    <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  
                  <ScrollArea className="h-80">
                    <div className="grid gap-4">
                      {filteredDoctors.map((doctor) => (
                        <motion.div
                          key={doctor.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              formData.doctorId === doctor.id ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => setFormData(prev => ({ ...prev, doctorId: doctor.id }))}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={doctor.avatar} />
                                  <AvatarFallback>
                                    {getInitialsFromName(doctor.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="font-medium text-lg">{doctor.name}</h4>
                                      <p className="text-muted-foreground">{doctor.specialization}</p>
                                    </div>
                                    <div className="text-right">
                                      <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        <span className="font-medium">{doctor.rating}</span>
                                      </div>
                                      <p className="text-sm text-muted-foreground">
                                        {doctor.experience} {t('appointments.yearsExp')}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between mt-2">
                                    <div className="text-sm text-muted-foreground">
                                      {t('appointments.consultationFee')}: {doctor.consultationFee} {t('common.currency')}
                                    </div>
                                    <Badge variant="outline">
                                      {doctor.availableDays.length} {t('appointments.daysAvailable')}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {/* Date and Time Selection Step */}
              {step === 'datetime' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-base font-medium">{t('appointments.selectDate')}</Label>
                    <div className="mt-2">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          if (date) {
                            setFormData(prev => ({ ...prev, date: date.toISOString().split('T')[0] }));
                          }
                        }}
                        disabled={(date) => {
                          if (!formData.doctorId) return true;
                          const doctor = doctors.find(d => d.id === formData.doctorId);
                          if (!doctor) return true;
                          
                          const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
                          return !doctor.availableDays.includes(dayName) || date < new Date();
                        }}
                        className="rounded-md border"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-base font-medium">{t('appointments.selectTime')}</Label>
                    <ScrollArea className="h-80 mt-2">
                      <div className="grid grid-cols-2 gap-2">
                        {availableSlots.map((slot) => (
                          <motion.div
                            key={slot}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant={formData.time === slot ? 'default' : 'outline'}
                              className="w-full h-12"
                              onClick={() => setFormData(prev => ({ ...prev, time: slot }))}
                            >
                              <Clock3 className="h-4 w-4 mr-2" />
                              {formatTime(slot)}
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              )}

              {/* Details Step */}
              {step === 'details' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">{t('appointments.type')} *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('appointments.selectType')} />
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
                      <Label htmlFor="priority">{t('appointments.priority')}</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('appointments.selectPriority')} />
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duration">{t('appointments.duration')} ({t('common.minutes')})</Label>
                      <Select
                        value={formData.duration?.toString()}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, duration: parseInt(value) }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="30" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 {t('common.minutes')}</SelectItem>
                          <SelectItem value="30">30 {t('common.minutes')}</SelectItem>
                          <SelectItem value="45">45 {t('common.minutes')}</SelectItem>
                          <SelectItem value="60">60 {t('common.minutes')}</SelectItem>
                          <SelectItem value="90">90 {t('common.minutes')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="location">{t('appointments.location')}</Label>
                      <Select
                        value={formData.location}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('appointments.selectLocation')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="عيادة 1">{t('appointments.clinic')} 1</SelectItem>
                          <SelectItem value="عيادة 2">{t('appointments.clinic')} 2</SelectItem>
                          <SelectItem value="عيادة 3">{t('appointments.clinic')} 3</SelectItem>
                          <SelectItem value="غرفة الطوارئ">{t('appointments.emergencyRoom')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="reason">{t('appointments.reason')} *</Label>
                    <Textarea
                      id="reason"
                      value={formData.reason || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder={t('appointments.reasonPlaceholder')}
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="symptoms">{t('appointments.symptoms')}</Label>
                    <Textarea
                      id="symptoms"
                      value={formData.symptoms || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                      placeholder={t('appointments.symptomsPlaceholder')}
                      className="min-h-[60px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">{t('appointments.notes')}</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder={t('appointments.notesPlaceholder')}
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              )}

              {/* Confirmation Step */}
              {step === 'confirm' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </motion.div>
                    <h3 className="text-xl font-semibold">{t('appointments.confirmAppointment')}</h3>
                    <p className="text-muted-foreground">{t('appointments.confirmDescription')}</p>
                  </div>

                  <div className="bg-muted rounded-lg p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">{t('appointments.patient')}</h4>
                        <p className="font-medium">
                          {isNewPatient 
                            ? `${newPatientData.firstName} ${newPatientData.lastName}`
                            : patients.find(p => p.id === formData.patientId)?.firstName + ' ' + 
                              patients.find(p => p.id === formData.patientId)?.lastName
                          }
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">{t('appointments.doctor')}</h4>
                        <p className="font-medium">
                          {doctors.find(d => d.id === formData.doctorId)?.name}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">{t('appointments.date')}</h4>
                        <p className="font-medium">
                          {formData.date && new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }).format(new Date(formData.date))}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">{t('appointments.time')}</h4>
                        <p className="font-medium">
                          {formData.time && formatTime(formData.time)}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">{t('appointments.type')}</h4>
                        <p className="font-medium">
                          {formData.type && t(`appointments.${formData.type}`)}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">{t('appointments.duration')}</h4>
                        <p className="font-medium">
                          {formData.duration} {t('common.minutes')}
                        </p>
                      </div>
                    </div>

                    {formData.reason && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">{t('appointments.reason')}</h4>
                          <p>{formData.reason}</p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">{t('appointments.importantInfo')}</h4>
                        <ul className="text-sm text-blue-800 mt-1 space-y-1">
                          <li>• {t('appointments.arriveEarly')}</li>
                          <li>• {t('appointments.bringDocuments')}</li>
                          <li>• {t('appointments.confirmationSent')}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={step === 'patient'}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          {t('common.previous')}
        </Button>

        <div className="flex items-center gap-2">
          {step === 'confirm' ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleSubmit}
                disabled={loading || !canProceed()}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('common.scheduling')}
                  </>
                ) : (
                  <>
                    <CalendarCheck className="h-4 w-4" />
                    {t('appointments.scheduleAppointment')}
                  </>
                )}
              </Button>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex items-center gap-2"
              >
                {t('common.next')}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Schedule;