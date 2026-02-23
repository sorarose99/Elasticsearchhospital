import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Calendar, 
  Users, 
  Phone,
  Clock,
  Search,
  Plus,
  LogOut,
  Languages,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { localApiService } from '../../services/LocalApiService';
import { toast } from 'sonner';
import firebaseService from '../../services/FirebaseService';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  specialization?: string;
  department?: string;
}

interface ReceptionDashboardProps {
  user: User;
  onLogout: () => void;
  language: 'en' | 'ar';
  onLanguageChange: (lang: 'en' | 'ar') => void;
}

const translations = {
  en: {
    title: 'Reception Dashboard',
    patientRegistration: 'Patient Registration',
    appointments: 'Appointments',
    todayVisits: "Today's Visits",
    patientSearch: 'Patient Search',
    registerNewPatient: 'Register New Patient',
    scheduleAppointment: 'Schedule Appointment',
    searchPatients: 'Search patients...',
    patientName: 'Patient Name',
    phoneNumber: 'Phone Number',
    email: 'Email',
    dateOfBirth: 'Date of Birth',
    gender: 'Gender',
    address: 'Address',
    insuranceProvider: 'Insurance Provider',
    insuranceNumber: 'Insurance Number',
    emergencyContact: 'Emergency Contact',
    male: 'Male',
    female: 'Female',
    save: 'Save',
    cancel: 'Cancel',
    doctor: 'Doctor',
    appointmentDate: 'Appointment Date',
    appointmentTime: 'Appointment Time',
    appointmentType: 'Appointment Type',
    consultation: 'Consultation',
    followUp: 'Follow-up',
    checkUp: 'Check-up',
    emergency: 'Emergency',
    schedule: 'Schedule',
    todayAppointments: "Today's Appointments",
    upcoming: 'Upcoming',
    completed: 'Completed',
    cancelled: 'Cancelled',
    pending: 'Pending',
    confirmed: 'Confirmed',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    patientRegistered: 'Patient registered successfully',
    appointmentScheduled: 'Appointment scheduled successfully',
    noPatients: 'No patients found',
    noAppointments: 'No appointments found',
  },
  ar: {
    title: 'لوحة تحكم الاستقبال',
    patientRegistration: 'تسجيل المرضى',
    appointments: 'المواعيد',
    todayVisits: 'زيارات اليوم',
    patientSearch: 'البحث عن المرضى',
    registerNewPatient: 'تسجيل مريض جديد',
    scheduleAppointment: 'جدولة موعد',
    searchPatients: 'البحث عن المرضى...',
    patientName: 'اسم المريض',
    phoneNumber: 'رقم الهاتف',
    email: 'البريد الإلكتروني',
    dateOfBirth: 'تاريخ الميلاد',
    gender: 'الجنس',
    address: 'العنوان',
    insuranceProvider: 'مقدم التأمين',
    insuranceNumber: 'رقم التأمين',
    emergencyContact: 'جهة اتصال الطوارئ',
    male: 'ذكر',
    female: 'أنثى',
    save: 'حفظ',
    cancel: 'إلغاء',
    doctor: 'الطبيب',
    appointmentDate: 'تاريخ الموعد',
    appointmentTime: 'وقت الموعد',
    appointmentType: 'نوع الموعد',
    consultation: 'استشارة',
    followUp: 'متابعة',
    checkUp: 'فحص',
    emergency: 'طوارئ',
    schedule: 'جدولة',
    todayAppointments: 'مواعيد اليوم',
    upcoming: 'قادم',
    completed: 'مكتمل',
    cancelled: 'ملغي',
    pending: 'معلق',
    confirmed: 'مؤكد',
    loading: 'جاري التحميل...',
    success: 'نجح',
    error: 'خطأ',
    patientRegistered: 'تم تسجيل المريض بنجاح',
    appointmentScheduled: 'تم جدولة الموعد بنجاح',
    noPatients: 'لم يتم العثور على مرضى',
    noAppointments: 'لم يتم العثور على مواعيد',
  }
};

export default function ReceptionDashboard({ user, onLogout, language, onLanguageChange }: ReceptionDashboardProps) {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPatientDialog, setShowPatientDialog] = useState(false);
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [newPatient, setNewPatient] = useState({
    name: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    insuranceProvider: '',
    insuranceNumber: '',
    emergencyContact: ''
  });
  const [newAppointment, setNewAppointment] = useState({
    patientId: '',
    patientName: '',
    doctorId: '',
    doctorName: '',
    date: '',
    time: '',
    type: '',
    notes: ''
  });

  const t = translations[language];

  useEffect(() => {
    fetchReceptionData();
  }, []);

  const fetchReceptionData = async () => {
    try {
      setLoading(true);
      
      // Use Firebase instead of LocalApiService
      const patientsData = await firebaseService.getPatients();
      setPatients(patientsData || []);

      const appointmentsData = await firebaseService.getAppointments();
      setAppointments(appointmentsData || []);

      // Get doctors from staff collection
      const staffData = await firebaseService.getStaffByRole('doctor');
      setDoctors(staffData.map((staff: any) => ({
        id: staff.id,
        name: staff.name || `Dr. ${staff.firstName} ${staff.lastName}`,
        specialization: staff.specialization || 'General Practice'
      })));

    } catch (error) {
      console.error('Error fetching reception data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handlePatientRegistration = async () => {
    try {
      // Use Firebase instead of LocalApiService
      const data = await firebaseService.createPatient(newPatient);
      setPatients([...patients, data]);
      setNewPatient({
        name: '',
        phone: '',
        email: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        insuranceProvider: '',
        insuranceNumber: '',
        emergencyContact: ''
      });
      setShowPatientDialog(false);
    } catch (error) {
      console.error('Error registering patient:', error);
    }
  };

  const handleAppointmentScheduling = async () => {
    try {
      // Use Firebase instead of LocalApiService
      const data = await firebaseService.createAppointment(newAppointment);
      setAppointments([...appointments, data]);
      setNewAppointment({
        patientId: '',
        patientName: '',
        doctorId: '',
        doctorName: '',
        date: '',
        time: '',
        type: '',
        notes: ''
      });
      setShowAppointmentDialog(false);
    } catch (error) {
      console.error('Error scheduling appointment:', error);
    }
  };

  const filteredPatients = patients.filter((patient: any) =>
    patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone?.includes(searchTerm) ||
    patient.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const todayAppointments = appointments.filter((apt: any) => 
    apt.date === new Date().toISOString().split('T')[0]
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
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-white" />
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
        <Tabs defaultValue="patients" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="patients">
              <Users className="w-4 h-4 mr-2" />
              {t.patientRegistration}
            </TabsTrigger>
            <TabsTrigger value="appointments">
              <Calendar className="w-4 h-4 mr-2" />
              {t.appointments}
            </TabsTrigger>
            <TabsTrigger value="today">
              <Clock className="w-4 h-4 mr-2" />
              {t.todayVisits}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t.patientSearch}</CardTitle>
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
                  <Dialog open={showPatientDialog} onOpenChange={setShowPatientDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        {t.registerNewPatient}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{t.registerNewPatient}</DialogTitle>
                        <DialogDescription>
                          Enter patient information to register them in the system
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{t.patientName}</Label>
                          <Input
                            value={newPatient.name}
                            onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                            placeholder={t.patientName}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t.phoneNumber}</Label>
                          <Input
                            value={newPatient.phone}
                            onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                            placeholder={t.phoneNumber}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t.email}</Label>
                          <Input
                            type="email"
                            value={newPatient.email}
                            onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                            placeholder={t.email}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t.dateOfBirth}</Label>
                          <Input
                            type="date"
                            value={newPatient.dateOfBirth}
                            onChange={(e) => setNewPatient({...newPatient, dateOfBirth: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t.gender}</Label>
                          <Select value={newPatient.gender} onValueChange={(value) => setNewPatient({...newPatient, gender: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder={t.gender} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">{t.male}</SelectItem>
                              <SelectItem value="female">{t.female}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>{t.insuranceProvider}</Label>
                          <Input
                            value={newPatient.insuranceProvider}
                            onChange={(e) => setNewPatient({...newPatient, insuranceProvider: e.target.value})}
                            placeholder={t.insuranceProvider}
                          />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label>{t.address}</Label>
                          <Input
                            value={newPatient.address}
                            onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
                            placeholder={t.address}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t.insuranceNumber}</Label>
                          <Input
                            value={newPatient.insuranceNumber}
                            onChange={(e) => setNewPatient({...newPatient, insuranceNumber: e.target.value})}
                            placeholder={t.insuranceNumber}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t.emergencyContact}</Label>
                          <Input
                            value={newPatient.emergencyContact}
                            onChange={(e) => setNewPatient({...newPatient, emergencyContact: e.target.value})}
                            placeholder={t.emergencyContact}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowPatientDialog(false)}>
                          {t.cancel}
                        </Button>
                        <Button onClick={handlePatientRegistration}>
                          {t.save}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient: any, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{patient.name}</h3>
                            <p className="text-sm text-gray-600">{patient.phone}</p>
                            <p className="text-sm text-gray-500">ID: {patient.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedPatient(patient);
                              setNewAppointment({...newAppointment, patientId: patient.id, patientName: patient.name});
                              setShowAppointmentDialog(true);
                            }}
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            {t.scheduleAppointment}
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">{t.noPatients}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t.appointments}</CardTitle>
                <Dialog open={showAppointmentDialog} onOpenChange={setShowAppointmentDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      {t.scheduleAppointment}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t.scheduleAppointment}</DialogTitle>
                      <DialogDescription>
                        Schedule a new appointment for a patient
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>{t.patientName}</Label>
                        <Select 
                          value={newAppointment.patientId} 
                          onValueChange={(value) => {
                            const patient = patients.find((p: any) => p.id === value);
                            setNewAppointment({
                              ...newAppointment, 
                              patientId: value,
                              patientName: patient?.name || ''
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select patient" />
                          </SelectTrigger>
                          <SelectContent>
                            {patients.map((patient: any, index) => (
                              <SelectItem key={index} value={patient.id}>
                                {patient.name} - {patient.phone}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>{t.doctor}</Label>
                        <Select 
                          value={newAppointment.doctorId} 
                          onValueChange={(value) => {
                            const doctor = doctors.find((d: any) => d.id === value);
                            setNewAppointment({
                              ...newAppointment, 
                              doctorId: value,
                              doctorName: doctor?.name || ''
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select doctor" />
                          </SelectTrigger>
                          <SelectContent>
                            {doctors.map((doctor: any, index) => (
                              <SelectItem key={index} value={doctor.id}>
                                {doctor.name} - {doctor.specialization}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{t.appointmentDate}</Label>
                          <Input
                            type="date"
                            value={newAppointment.date}
                            onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t.appointmentTime}</Label>
                          <Input
                            type="time"
                            value={newAppointment.time}
                            onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>{t.appointmentType}</Label>
                        <Select value={newAppointment.type} onValueChange={(value) => setNewAppointment({...newAppointment, type: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="consultation">{t.consultation}</SelectItem>
                            <SelectItem value="follow-up">{t.followUp}</SelectItem>
                            <SelectItem value="check-up">{t.checkUp}</SelectItem>
                            <SelectItem value="emergency">{t.emergency}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowAppointmentDialog(false)}>
                        {t.cancel}
                      </Button>
                      <Button onClick={handleAppointmentScheduling}>
                        {t.schedule}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.length > 0 ? (
                    appointments.map((appointment: any, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{appointment.patientName}</h3>
                            <p className="text-sm text-gray-600">{appointment.doctorName}</p>
                            <p className="text-sm text-gray-500">{appointment.date} at {appointment.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                            {appointment.status || t.pending}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">{t.noAppointments}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="today" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.todayAppointments}</CardTitle>
                <CardDescription>
                  {todayAppointments.length} appointments scheduled for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAppointments.length > 0 ? (
                    todayAppointments.map((appointment: any, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <Clock className="w-6 h-6 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{appointment.patientName}</h3>
                            <p className="text-sm text-gray-600">{appointment.doctorName}</p>
                            <p className="text-sm text-gray-500">{appointment.time} - {appointment.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={appointment.status === 'completed' ? 'default' : 'secondary'}>
                            {appointment.status === 'completed' ? 
                              <><CheckCircle className="w-3 h-3 mr-1" /> {t.completed}</> : 
                              <><AlertCircle className="w-3 h-3 mr-1" /> {t.pending}</>
                            }
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">{t.noAppointments}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}