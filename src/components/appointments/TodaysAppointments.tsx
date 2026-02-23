import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
  Timer,
  Phone,
  Mail,
  MapPin,
  Edit,
  Eye,
  UserCheck,
  UserX,
  Play,
  Pause,
  StopCircle,
  RefreshCw,
  FileText,
  Stethoscope,
  Users,
  TrendingUp,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';
import { getInitials } from '../../utils/stringHelpers';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  avatar?: string;
  age: number;
  gender: 'male' | 'female';
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  avatar?: string;
}

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  duration: number;
  type: 'consultation' | 'follow-up' | 'procedure' | 'emergency';
  status: 'scheduled' | 'confirmed' | 'checked-in' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  reason: string;
  notes?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  location: string;
  patient?: Patient;
  doctor?: Doctor;
  checkedInAt?: string;
  startedAt?: string;
  completedAt?: string;
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
}

interface TodaysAppointmentsProps {
  isDemoMode?: boolean;
}

const TodaysAppointments: React.FC<TodaysAppointmentsProps> = ({ isDemoMode = false }) => {
  const { t, language, isRTL } = useLanguage();
  const { effectiveTheme } = useTheme();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');
  const [updateData, setUpdateData] = useState<Partial<Appointment>>({});

  // Demo data
  const demoAppointments: Appointment[] = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    return [
      {
        id: '1',
        patientId: '1',
        doctorId: '1',
        date: today,
        time: '09:00',
        duration: 30,
        type: 'consultation',
        status: 'checked-in',
        reason: 'فحص دوري للقلب',
        notes: 'مريض لديه تاريخ مع ارتفاع ضغط الدم',
        priority: 'medium',
        location: 'عيادة 1',
        symptoms: 'ألم في الصدر، ضيق تنفس',
        checkedInAt: '08:55',
        patient: {
          id: '1',
          firstName: 'علي',
          lastName: 'أحمد المالكي',
          phone: '+966501234567',
          email: 'ali.ahmed@email.com',
          age: 45,
          gender: 'male'
        },
        doctor: {
          id: '1',
          name: 'د. أحمد محمد السالم',
          specialization: 'طب القلب والأوعية الدموية'
        }
      },
      {
        id: '2',
        patientId: '2',
        doctorId: '1',
        date: today,
        time: '09:30',
        duration: 45,
        type: 'follow-up',
        status: 'confirmed',
        reason: 'متابعة نتائج التحاليل',
        priority: 'high',
        location: 'عيادة 1',
        symptoms: 'تحسن في الأعراض',
        patient: {
          id: '2',
          firstName: 'فاطمة',
          lastName: 'محمد الخالد',
          phone: '+966501234568',
          email: 'fatima.mohamed@email.com',
          age: 35,
          gender: 'female'
        },
        doctor: {
          id: '1',
          name: 'د. أحمد محمد السالم',
          specialization: 'طب القلب والأوعية الدموية'
        }
      },
      {
        id: '3',
        patientId: '3',
        doctorId: '2',
        date: today,
        time: '10:00',
        duration: 30,
        type: 'consultation',
        status: 'in-progress',
        reason: 'فحص طفل',
        notes: 'فحص دوري للنمو والتطور',
        priority: 'low',
        location: 'عيادة 2',
        symptoms: 'لا توجد أعراض - فحص وقائي',
        startedAt: '10:05',
        patient: {
          id: '3',
          firstName: 'سارة',
          lastName: 'عبدالله القحطاني',
          phone: '+966501234569',
          email: 'sarah.abdullah@email.com',
          age: 8,
          gender: 'female'
        },
        doctor: {
          id: '2',
          name: 'Dr. Sarah Johnson',
          specialization: 'Pediatrics & Child Health'
        }
      }
    ];
  }, []);

  useEffect(() => {
    if (isDemoMode) {
      setAppointments(demoAppointments);
    } else {
      loadTodaysAppointments();
    }
  }, [isDemoMode, demoAppointments]);

  const loadTodaysAppointments = useCallback(async () => {
    setLoading(true);
    try {
      // API call would go here
      // const response = await fetch('/api/appointments/today');
      // const data = await response.json();
      // setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const matchesSearch = !searchTerm || 
        appointment.patient?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.patient?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.doctor?.name.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || appointment.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [appointments, searchTerm, statusFilter, priorityFilter]);

  const appointmentStats = useMemo(() => {
    const total = appointments.length;
    const completed = appointments.filter(a => a.status === 'completed').length;
    const inProgress = appointments.filter(a => a.status === 'in-progress').length;
    const pending = appointments.filter(a => ['scheduled', 'confirmed', 'checked-in'].includes(a.status)).length;
    const noShow = appointments.filter(a => a.status === 'no-show').length;
    const cancelled = appointments.filter(a => a.status === 'cancelled').length;

    return { total, completed, inProgress, pending, noShow, cancelled };
  }, [appointments]);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'checked-in': return <UserCheck className="h-4 w-4" />;
      case 'in-progress': return <Timer className="h-4 w-4" />;
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'no-show': return <UserX className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'checked-in': return 'text-purple-600 bg-purple-100';
      case 'in-progress': return 'text-orange-600 bg-orange-100';
      case 'completed': return 'text-green-700 bg-green-200';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'no-show': return 'text-red-700 bg-red-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'border-l-green-500';
      case 'medium': return 'border-l-yellow-500';
      case 'high': return 'border-l-orange-500';
      case 'urgent': return 'border-l-red-500';
      default: return 'border-l-gray-300';
    }
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    if (isDemoMode) {
      setAppointments(prev => prev.map(app => 
        app.id === appointmentId 
          ? { 
              ...app, 
              status: newStatus as any,
              checkedInAt: newStatus === 'checked-in' ? new Date().toLocaleTimeString() : app.checkedInAt,
              startedAt: newStatus === 'in-progress' ? new Date().toLocaleTimeString() : app.startedAt,
              completedAt: newStatus === 'completed' ? new Date().toLocaleTimeString() : app.completedAt
            }
          : app
      ));
      return;
    }

    try {
      // API call would go here
      // await fetch(`/api/appointments/${appointmentId}/status`, {
      //   method: 'PUT',
      //   body: JSON.stringify({ status: newStatus })
      // });
      await loadTodaysAppointments();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getNextAction = (appointment: Appointment) => {
    switch (appointment.status) {
      case 'scheduled':
      case 'confirmed':
        return { action: 'check-in', label: 'Check In', icon: UserCheck };
      case 'checked-in':
        return { action: 'start', label: 'Start', icon: Play };
      case 'in-progress':
        return { action: 'complete', label: 'Complete', icon: CheckCircle2 };
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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-primary">Today's Appointments</h1>
          <p className="text-muted-foreground">
            {new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }).format(new Date())}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <Users className="h-4 w-4 mr-1" />
            List View
          </Button>
          <Button
            variant={viewMode === 'timeline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('timeline')}
          >
            <Clock3 className="h-4 w-4 mr-1" />
            Timeline View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={loadTodaysAppointments}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{appointmentStats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-blue-600">{appointmentStats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-orange-600">{appointmentStats.inProgress}</p>
              </div>
              <Timer className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{appointmentStats.completed}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">No Show</p>
                <p className="text-2xl font-bold text-red-600">{appointmentStats.noShow}</p>
              </div>
              <UserX className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cancelled</p>
                <p className="text-2xl font-bold text-gray-600">{appointmentStats.cancelled}</p>
              </div>
              <XCircle className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="checked-in">Checked In</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no-show">No Show</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Appointments List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading...</p>
            </CardContent>
          </Card>
        ) : filteredAppointments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No appointments today</h3>
              <p className="text-muted-foreground">There are no appointments scheduled for today.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAppointments
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((appointment, index) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <Card className={`hover:shadow-lg transition-all border-l-4 ${getPriorityColor(appointment.priority)}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          {/* Time */}
                          <div className="text-center min-w-[80px]">
                            <div className="text-xl font-bold text-primary">
                              {formatTime(appointment.time)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {appointment.duration}m
                            </div>
                          </div>

                          {/* Patient Info */}
                          <div className="flex items-start gap-3 flex-1">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={appointment.patient?.avatar} />
                              <AvatarFallback>
                                {getInitials(appointment.patient?.firstName, appointment.patient?.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold text-lg">
                                    {appointment.patient?.firstName} {appointment.patient?.lastName}
                                  </h4>
                                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Stethoscope className="h-3 w-3" />
                                    {appointment.doctor?.name}
                                  </p>
                                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                    <MapPin className="h-3 w-3" />
                                    {appointment.location}
                                  </p>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Badge className={`${getStatusColor(appointment.status)} flex items-center gap-1`}>
                                    {getStatusIcon(appointment.status)}
                                    {appointment.status}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {appointment.type}
                                  </Badge>
                                </div>
                              </div>

                              <div className="mt-3">
                                <p className="text-sm font-medium">{appointment.reason}</p>
                                {appointment.symptoms && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    <strong>Symptoms:</strong> {appointment.symptoms}
                                  </p>
                                )}
                                {appointment.notes && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    <strong>Notes:</strong> {appointment.notes}
                                  </p>
                                )}
                              </div>

                              {/* Contact Info */}
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {appointment.patient?.phone}
                                </div>
                                {appointment.patient?.email && (
                                  <div className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {appointment.patient?.email}
                                  </div>
                                )}
                                <div className="text-xs">
                                  {appointment.patient?.age} years • {appointment.patient?.gender}
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-2 mt-4">
                                {getNextAction(appointment) && (
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      const nextAction = getNextAction(appointment);
                                      if (nextAction) {
                                        handleStatusUpdate(appointment.id, nextAction.action);
                                      }
                                    }}
                                  >
                                    {React.createElement(getNextAction(appointment)!.icon, { className: "h-3 w-3 mr-1" })}
                                    {getNextAction(appointment)!.label}
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedAppointment(appointment);
                                    setIsDetailsDialogOpen(true);
                                  }}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View Details
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedAppointment(appointment);
                                    setIsUpdateDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>
        )}
      </motion.div>

      {/* Appointment Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Patient</Label>
                  <p className="font-medium">
                    {selectedAppointment.patient?.firstName} {selectedAppointment.patient?.lastName}
                  </p>
                </div>
                <div>
                  <Label>Doctor</Label>
                  <p className="font-medium">{selectedAppointment.doctor?.name}</p>
                </div>
                <div>
                  <Label>Time</Label>
                  <p className="font-medium">{formatTime(selectedAppointment.time)}</p>
                </div>
                <div>
                  <Label>Duration</Label>
                  <p className="font-medium">{selectedAppointment.duration} minutes</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedAppointment.status)}>
                    {selectedAppointment.status}
                  </Badge>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Badge variant="outline">{selectedAppointment.priority}</Badge>
                </div>
              </div>
              <div>
                <Label>Reason</Label>
                <p className="mt-1">{selectedAppointment.reason}</p>
              </div>
              {selectedAppointment.symptoms && (
                <div>
                  <Label>Symptoms</Label>
                  <p className="mt-1">{selectedAppointment.symptoms}</p>
                </div>
              )}
              {selectedAppointment.notes && (
                <div>
                  <Label>Notes</Label>
                  <p className="mt-1">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Appointment Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Appointment</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div>
                <Label>Status</Label>
                <Select 
                  value={updateData.status || selectedAppointment.status}
                  onValueChange={(value) => setUpdateData({...updateData, status: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="checked-in">Checked In</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no-show">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  value={updateData.notes || selectedAppointment.notes || ''}
                  onChange={(e) => setUpdateData({...updateData, notes: e.target.value})}
                  placeholder="Add notes..."
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (selectedAppointment) {
                handleStatusUpdate(selectedAppointment.id, updateData.status || selectedAppointment.status);
              }
              setIsUpdateDialogOpen(false);
              setUpdateData({});
            }}>
              Update Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TodaysAppointments;