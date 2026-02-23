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
  Clock, 
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  Edit,
  Eye,
  Play,
  AlertTriangle,
  CheckCircle2,
  Timer,
  Users,
  TrendingUp,
  Calendar,
  Stethoscope,
  Plus,
  Minus,
  RotateCcw,
  Bell,
  BellRing,
  PhoneCall,
  MessageSquare,
  ArrowRight,
  Star,
  Clock3
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';
import { getInitials, getInitialsFromName } from '../../utils/stringHelpers';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  avatar?: string;
  age: number;
  gender: 'male' | 'female';
  medicalRecord?: string;
  insurance?: string;
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  avatar?: string;
  currentPatient?: string;
  estimatedFinishTime?: string;
}

interface WaitingListItem {
  id: string;
  patientId: string;
  doctorId: string;
  requestedTime: string;
  estimatedWaitTime: number; // in minutes
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'walk-in' | 'emergency' | 'urgent-referral' | 'follow-up';
  reason: string;
  symptoms?: string;
  notes?: string;
  status: 'waiting' | 'called' | 'no-response' | 'seen';
  addedAt: string;
  calledAt?: string;
  position: number;
  patient?: Patient;
  doctor?: Doctor;
  vitals?: {
    bloodPressure?: string;
    temperature?: string;
    heartRate?: string;
    weight?: string;
  };
  triageNotes?: string;
  remindersSent: number;
}

interface WaitingListProps {
  isDemoMode?: boolean;
}

const WaitingList: React.FC<WaitingListProps> = ({ isDemoMode = false }) => {
  const { t, language, isRTL } = useLanguage();
  const { effectiveTheme } = useTheme();

  const [waitingList, setWaitingList] = useState<WaitingListItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<WaitingListItem | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [doctorFilter, setDoctorFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'position' | 'priority' | 'waitTime' | 'addedAt'>('position');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [newPatientData, setNewPatientData] = useState<Partial<Patient>>({});
  const [newWaitingItem, setNewWaitingItem] = useState<Partial<WaitingListItem>>({});

  // Demo data
  const demoWaitingList: WaitingListItem[] = useMemo(() => [
    {
      id: '1',
      patientId: '1',
      doctorId: '1',
      requestedTime: new Date().toISOString(),
      estimatedWaitTime: 15,
      priority: 'high',
      type: 'walk-in',
      reason: 'ألم في الصدر مفاجئ',
      symptoms: 'ألم حاد في الصدر، ضيق تنفس',
      status: 'waiting',
      addedAt: new Date(Date.now() - 45 * 60000).toISOString(),
      position: 1,
      remindersSent: 1,
      patient: {
        id: '1',
        firstName: 'خالد',
        lastName: 'أحمد المحمد',
        phone: '+966501234567',
        email: 'khalid.ahmed@email.com',
        age: 55,
        gender: 'male',
        medicalRecord: 'MR001234',
        insurance: 'BUPA'
      },
      doctor: {
        id: '1',
        name: 'د. أحمد محمد السالم',
        specialization: 'طب القلب والأوعية الدموية',
        currentPatient: 'علي محمد',
        estimatedFinishTime: '15:30'
      },
      vitals: {
        bloodPressure: '140/90',
        temperature: '37.2',
        heartRate: '88',
        weight: '75'
      },
      triageNotes: 'مريض يشكو من ألم في الصدر، يحتاج فحص عاجل'
    },
    {
      id: '2',
      patientId: '2',
      doctorId: '2',
      requestedTime: new Date().toISOString(),
      estimatedWaitTime: 30,
      priority: 'urgent',
      type: 'emergency',
      reason: 'حمى عالية عند الطفل',
      symptoms: 'حمى 39.5 درجة، قيء، خمول',
      status: 'called',
      addedAt: new Date(Date.now() - 60 * 60000).toISOString(),
      calledAt: new Date(Date.now() - 5 * 60000).toISOString(),
      position: 1,
      remindersSent: 2,
      patient: {
        id: '2',
        firstName: 'سارة',
        lastName: 'محمد الخالد',
        phone: '+966501234568',
        email: 'sarah.mohamed@email.com',
        age: 4,
        gender: 'female',
        medicalRecord: 'MR001235',
        insurance: 'التأمين الطبي'
      },
      doctor: {
        id: '2',
        name: 'Dr. Sarah Johnson',
        specialization: 'Pediatrics & Child Health',
        currentPatient: 'أحمد علي',
        estimatedFinishTime: '15:45'
      },
      vitals: {
        temperature: '39.5',
        heartRate: '120',
        weight: '16'
      },
      triageNotes: 'طفلة تعاني من حمى عالية، حالة طوارئ'
    },
    {
      id: '3',
      patientId: '3',
      doctorId: '1',
      requestedTime: new Date().toISOString(),
      estimatedWaitTime: 45,
      priority: 'medium',
      type: 'follow-up',
      reason: 'متابعة نتائج التحاليل',
      symptoms: 'لا توجد أعراض حادة',
      status: 'waiting',
      addedAt: new Date(Date.now() - 90 * 60000).toISOString(),
      position: 2,
      remindersSent: 0,
      patient: {
        id: '3',
        firstName: 'فاطمة',
        lastName: 'عبدالله الريس',
        phone: '+966501234569',
        email: 'fatima.abdullah@email.com',
        age: 42,
        gender: 'female',
        medicalRecord: 'MR001236',
        insurance: 'مدينة الملك فهد الطبية'
      },
      doctor: {
        id: '1',
        name: 'د. أحمد محمد السالم',
        specialization: 'طب القلب والأوعية الدموية',
        currentPatient: 'علي محمد',
        estimatedFinishTime: '15:30'
      },
      vitals: {
        bloodPressure: '120/80',
        temperature: '36.8',
        heartRate: '72'
      }
    },
    {
      id: '4',
      patientId: '4',
      doctorId: '3',
      requestedTime: new Date().toISOString(),
      estimatedWaitTime: 20,
      priority: 'low',
      type: 'walk-in',
      reason: 'استشارة عامة',
      symptoms: 'صداع خفيف، إرهاق',
      status: 'waiting',
      addedAt: new Date(Date.now() - 30 * 60000).toISOString(),
      position: 1,
      remindersSent: 0,
      patient: {
        id: '4',
        firstName: 'محمد',
        lastName: 'سالم القحطاني',
        phone: '+966501234570',
        age: 35,
        gender: 'male',
        medicalRecord: 'MR001237'
      },
      doctor: {
        id: '3',
        name: 'د. نورا أحمد',
        specialization: 'طب عام',
        estimatedFinishTime: '16:00'
      },
      vitals: {
        bloodPressure: '125/85',
        temperature: '36.9',
        heartRate: '76'
      }
    },
    {
      id: '5',
      patientId: '5',
      doctorId: '2',
      requestedTime: new Date().toISOString(),
      estimatedWaitTime: 60,
      priority: 'medium',
      type: 'urgent-referral',
      reason: 'إحالة عاجلة من طبيب آخر',
      symptoms: 'آلام في البطن، غثيان',
      status: 'no-response',
      addedAt: new Date(Date.now() - 120 * 60000).toISOString(),
      calledAt: new Date(Date.now() - 15 * 60000).toISOString(),
      position: 2,
      remindersSent: 3,
      patient: {
        id: '5',
        firstName: 'عائشة',
        lastName: 'علي الدوسري',
        phone: '+966501234571',
        email: 'aisha.ali@email.com',
        age: 28,
        gender: 'female',
        medicalRecord: 'MR001238',
        insurance: 'التأمين الصحي'
      },
      doctor: {
        id: '2',
        name: 'Dr. Sarah Johnson',
        specialization: 'Pediatrics & Child Health',
        currentPatient: 'أحمد علي',
        estimatedFinishTime: '15:45'
      },
      triageNotes: 'مريضة محالة من طبيب خارجي، تحتاج فحص سريع'
    }
  ], []);

  const doctors = useMemo(() => [
    { id: '1', name: 'د. أحمد محمد السالم', specialization: 'طب القلب والأوعية الدموية' },
    { id: '2', name: 'Dr. Sarah Johnson', specialization: 'Pediatrics & Child Health' },
    { id: '3', name: 'د. نورا أحمد', specialization: 'طب عام' }
  ], []);

  useEffect(() => {
    if (isDemoMode) {
      setWaitingList(demoWaitingList);
    } else {
      loadWaitingList();
    }
  }, [isDemoMode, demoWaitingList]);

  // Auto refresh every 30 seconds
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        if (!isDemoMode) {
          loadWaitingList();
        }
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, isDemoMode]);

  const loadWaitingList = useCallback(async () => {
    setLoading(true);
    try {
      // API call would go here
      // const response = await fetch('/api/waiting-list');
      // const data = await response.json();
      // setWaitingList(data);
    } catch (error) {
      console.error('Error loading waiting list:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredAndSortedList = useMemo(() => {
    let filtered = waitingList.filter(item => {
      const matchesSearch = !searchTerm || 
        item.patient?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.patient?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.patient?.phone.includes(searchTerm);
        
      const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
      const matchesDoctor = doctorFilter === 'all' || item.doctorId === doctorFilter;
      
      return matchesSearch && matchesPriority && matchesDoctor && item.status !== 'seen';
    });

    // Sort based on selected criteria
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'waitTime':
          return a.estimatedWaitTime - b.estimatedWaitTime;
        case 'addedAt':
          return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
        case 'position':
        default:
          return a.position - b.position;
      }
    });

    return filtered;
  }, [waitingList, searchTerm, priorityFilter, doctorFilter, sortBy]);

  const waitingStats = useMemo(() => {
    const total = waitingList.filter(item => item.status !== 'seen').length;
    const waiting = waitingList.filter(item => item.status === 'waiting').length;
    const called = waitingList.filter(item => item.status === 'called').length;
    const noResponse = waitingList.filter(item => item.status === 'no-response').length;
    const urgent = waitingList.filter(item => item.priority === 'urgent' && item.status !== 'seen').length;
    const avgWaitTime = total > 0 
      ? Math.round(waitingList.filter(item => item.status !== 'seen').reduce((sum, item) => sum + item.estimatedWaitTime, 0) / total)
      : 0;

    return { total, waiting, called, noResponse, urgent, avgWaitTime };
  }, [waitingList]);

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const getWaitingTime = (addedAt: string) => {
    const now = new Date();
    const added = new Date(addedAt);
    const diffMinutes = Math.floor((now.getTime() - added.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} ${t('common.minutes')}`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}${t('common.hours')} ${minutes}${t('common.minutes')}`;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-blue-100 text-blue-800';
      case 'called': return 'bg-purple-100 text-purple-800';
      case 'no-response': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'walk-in': return <Users className="h-4 w-4" />;
      case 'emergency': return <AlertTriangle className="h-4 w-4" />;
      case 'urgent-referral': return <ArrowRight className="h-4 w-4" />;
      case 'follow-up': return <RotateCcw className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = async (itemId: string, newStatus: string) => {
    if (isDemoMode) {
      setWaitingList(prev => prev.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              status: newStatus as any,
              calledAt: newStatus === 'called' ? new Date().toISOString() : item.calledAt
            }
          : item
      ));
      return;
    }

    try {
      // API call would go here
      await loadWaitingList();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handlePositionChange = async (itemId: string, direction: 'up' | 'down') => {
    if (isDemoMode) {
      setWaitingList(prev => {
        const items = [...prev];
        const index = items.findIndex(item => item.id === itemId);
        if (index === -1) return prev;

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= items.length) return prev;

        // Swap positions
        [items[index], items[newIndex]] = [items[newIndex], items[index]];
        
        // Update position numbers
        items.forEach((item, idx) => {
          item.position = idx + 1;
        });

        return items;
      });
      return;
    }

    try {
      // API call would go here
      await loadWaitingList();
    } catch (error) {
      console.error('Error updating position:', error);
    }
  };

  const handleSendReminder = async (itemId: string, type: 'sms' | 'call') => {
    if (isDemoMode) {
      setWaitingList(prev => prev.map(item => 
        item.id === itemId 
          ? { ...item, remindersSent: item.remindersSent + 1 }
          : item
      ));
      return;
    }

    try {
      // API call would go here
    } catch (error) {
      console.error('Error sending reminder:', error);
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
          <h1 className="text-3xl font-bold text-primary">{t('appointments.waitingList')}</h1>
          <p className="text-muted-foreground">
            {t('appointments.realTimeQueue')} • {t('appointments.lastUpdated')}: {formatTime(new Date().toISOString())}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="flex items-center gap-1"
          >
            <Timer className="h-4 w-4" />
            {t('appointments.autoRefresh')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            {t('appointments.addToQueue')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={loadWaitingList}
            disabled={loading}
          >
            <RotateCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
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
                <p className="text-sm text-muted-foreground">{t('appointments.totalWaiting')}</p>
                <p className="text-2xl font-bold text-blue-600">{waitingStats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('appointments.waiting')}</p>
                <p className="text-2xl font-bold text-yellow-600">{waitingStats.waiting}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('appointments.called')}</p>
                <p className="text-2xl font-bold text-purple-600">{waitingStats.called}</p>
              </div>
              <Bell className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('appointments.noResponse')}</p>
                <p className="text-2xl font-bold text-red-600">{waitingStats.noResponse}</p>
              </div>
              <BellRing className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('appointments.urgent')}</p>
                <p className="text-2xl font-bold text-red-700">{waitingStats.urgent}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-700" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('appointments.avgWait')}</p>
                <p className="text-2xl font-bold text-orange-600">{waitingStats.avgWaitTime}m</p>
              </div>
              <Timer className="h-8 w-8 text-orange-600" />
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
                  placeholder={t('appointments.searchWaitingList')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder={t('appointments.priority')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allPriorities')}</SelectItem>
                    <SelectItem value="urgent">{t('appointments.urgent')}</SelectItem>
                    <SelectItem value="high">{t('appointments.high')}</SelectItem>
                    <SelectItem value="medium">{t('appointments.medium')}</SelectItem>
                    <SelectItem value="low">{t('appointments.low')}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={doctorFilter} onValueChange={setDoctorFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={t('appointments.doctor')} />
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

                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder={t('appointments.sortBy')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="position">{t('appointments.position')}</SelectItem>
                    <SelectItem value="priority">{t('appointments.priority')}</SelectItem>
                    <SelectItem value="waitTime">{t('appointments.waitTime')}</SelectItem>
                    <SelectItem value="addedAt">{t('appointments.addedTime')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Waiting List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>{t('common.loading')}</p>
            </CardContent>
          </Card>
        ) : filteredAndSortedList.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">{t('appointments.noWaitingPatients')}</h3>
              <p className="text-muted-foreground">{t('appointments.waitingListEmpty')}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredAndSortedList.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  layout
                >
                  <Card className={`transition-all hover:shadow-lg ${
                    item.priority === 'urgent' ? 'ring-2 ring-red-500 ring-opacity-50' : ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Position & Priority */}
                        <div className="flex flex-col items-center min-w-[60px]">
                          <div className="text-2xl font-bold text-primary mb-1">
                            #{item.position}
                          </div>
                          <Badge className={`${getPriorityColor(item.priority)} text-xs`}>
                            {t(`appointments.${item.priority}`)}
                          </Badge>
                        </div>

                        {/* Patient Info */}
                        <div className="flex items-center gap-3 flex-1">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={item.patient?.avatar} />
                            <AvatarFallback>
                              {getInitials(item.patient?.firstName, item.patient?.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold">
                                  {item.patient?.firstName} {item.patient?.lastName}
                                </h4>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Stethoscope className="h-3 w-3" />
                                  {item.doctor?.name}
                                </p>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Badge className={`${getStatusColor(item.status)} flex items-center gap-1`}>
                                  {getTypeIcon(item.type)}
                                  {t(`appointments.${item.status}`)}
                                </Badge>
                              </div>
                            </div>

                            <div className="mt-2">
                              <p className="text-sm font-medium">{item.reason}</p>
                              {item.symptoms && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  <strong>{t('appointments.symptoms')}:</strong> {item.symptoms}
                                </p>
                              )}
                            </div>

                            {/* Vitals */}
                            {item.vitals && (
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                {item.vitals.bloodPressure && (
                                  <span>BP: {item.vitals.bloodPressure}</span>
                                )}
                                {item.vitals.temperature && (
                                  <span>T: {item.vitals.temperature}°C</span>
                                )}
                                {item.vitals.heartRate && (
                                  <span>HR: {item.vitals.heartRate}</span>
                                )}
                              </div>
                            )}

                            {/* Timing Info */}
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock3 className="h-3 w-3" />
                                {t('appointments.waiting')}: {getWaitingTime(item.addedAt)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Timer className="h-3 w-3" />
                                {t('appointments.estimated')}: {item.estimatedWaitTime}m
                              </div>
                              {item.remindersSent > 0 && (
                                <div className="flex items-center gap-1">
                                  <Bell className="h-3 w-3" />
                                  {item.remindersSent} {t('appointments.reminders')}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          {/* Position Controls */}
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePositionChange(item.id, 'up')}
                              disabled={item.position === 1}
                              className="h-6 w-6 p-0"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePositionChange(item.id, 'down')}
                              className="h-6 w-6 p-0"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Communication */}
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSendReminder(item.id, 'sms')}
                              className="h-6 w-8 p-0"
                              title={t('appointments.sendSMS')}
                            >
                              <MessageSquare className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSendReminder(item.id, 'call')}
                              className="h-6 w-8 p-0"
                              title={t('appointments.makeCall')}
                            >
                              <PhoneCall className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Status Actions */}
                          {item.status === 'waiting' && (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                size="sm"
                                onClick={() => handleStatusUpdate(item.id, 'called')}
                                className="flex items-center gap-1"
                              >
                                <Bell className="h-4 w-4" />
                                {t('appointments.call')}
                              </Button>
                            </motion.div>
                          )}

                          {item.status === 'called' && (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                size="sm"
                                onClick={() => handleStatusUpdate(item.id, 'seen')}
                                className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                {t('appointments.seen')}
                              </Button>
                            </motion.div>
                          )}

                          {item.status === 'no-response' && (
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusUpdate(item.id, 'called')}
                                className="flex items-center gap-1"
                              >
                                <Bell className="h-3 w-3" />
                                {t('appointments.recall')}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusUpdate(item.id, 'seen')}
                                className="flex items-center gap-1"
                              >
                                <CheckCircle2 className="h-3 w-3" />
                                {t('appointments.seen')}
                              </Button>
                            </div>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item);
                              setIsDetailsDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t('appointments.patientDetails')}
            </DialogTitle>
            <DialogDescription>
              {selectedItem && `Position #${selectedItem.position} - ${selectedItem.patient?.firstName} ${selectedItem.patient?.lastName}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-6">
              {/* Patient Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">{t('appointments.patient')}</h4>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedItem.patient?.avatar} />
                      <AvatarFallback>
                        {getInitials(selectedItem.patient?.firstName, selectedItem.patient?.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {selectedItem.patient?.firstName} {selectedItem.patient?.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedItem.patient?.age} {t('common.years')} • {t(`common.${selectedItem.patient?.gender}`)}
                      </p>
                      <div className="text-sm text-muted-foreground space-y-1 mt-1">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {selectedItem.patient?.phone}
                        </div>
                        {selectedItem.patient?.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {selectedItem.patient?.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">{t('appointments.doctor')}</h4>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedItem.doctor?.avatar} />
                      <AvatarFallback>
                        {getInitialsFromName(selectedItem.doctor?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedItem.doctor?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedItem.doctor?.specialization}
                      </p>
                      {selectedItem.doctor?.currentPatient && (
                        <p className="text-sm text-muted-foreground">
                          {t('appointments.currentPatient')}: {selectedItem.doctor.currentPatient}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Queue Details */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">{t('appointments.position')}</Label>
                  <p className="text-2xl font-bold text-primary">#{selectedItem.position}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">{t('appointments.waitingTime')}</Label>
                  <p className="text-lg font-medium">{getWaitingTime(selectedItem.addedAt)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">{t('appointments.estimatedWait')}</Label>
                  <p className="text-lg font-medium">{selectedItem.estimatedWaitTime} {t('common.minutes')}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">{t('appointments.priority')}</Label>
                  <Badge className={`${getPriorityColor(selectedItem.priority)} w-fit`}>
                    {t(`appointments.${selectedItem.priority}`)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">{t('appointments.type')}</Label>
                  <div className="flex items-center gap-1">
                    {getTypeIcon(selectedItem.type)}
                    <span>{t(`appointments.${selectedItem.type}`)}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">{t('appointments.status')}</Label>
                  <Badge className={`${getStatusColor(selectedItem.status)} w-fit`}>
                    {t(`appointments.${selectedItem.status}`)}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Medical Information */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">{t('appointments.reason')}</Label>
                  <p>{selectedItem.reason}</p>
                </div>
                
                {selectedItem.symptoms && (
                  <div>
                    <Label className="text-sm font-medium">{t('appointments.symptoms')}</Label>
                    <p>{selectedItem.symptoms}</p>
                  </div>
                )}

                {selectedItem.vitals && (
                  <div>
                    <Label className="text-sm font-medium">{t('appointments.vitals')}</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      {selectedItem.vitals.bloodPressure && (
                        <div>
                          <span className="text-sm text-muted-foreground">{t('appointments.bloodPressure')}:</span>
                          <span className="ml-2 font-medium">{selectedItem.vitals.bloodPressure}</span>
                        </div>
                      )}
                      {selectedItem.vitals.temperature && (
                        <div>
                          <span className="text-sm text-muted-foreground">{t('appointments.temperature')}:</span>
                          <span className="ml-2 font-medium">{selectedItem.vitals.temperature}°C</span>
                        </div>
                      )}
                      {selectedItem.vitals.heartRate && (
                        <div>
                          <span className="text-sm text-muted-foreground">{t('appointments.heartRate')}:</span>
                          <span className="ml-2 font-medium">{selectedItem.vitals.heartRate} BPM</span>
                        </div>
                      )}
                      {selectedItem.vitals.weight && (
                        <div>
                          <span className="text-sm text-muted-foreground">{t('appointments.weight')}:</span>
                          <span className="ml-2 font-medium">{selectedItem.vitals.weight} kg</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedItem.triageNotes && (
                  <div>
                    <Label className="text-sm font-medium">{t('appointments.triageNotes')}</Label>
                    <p>{selectedItem.triageNotes}</p>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div>
                <Label className="text-sm font-medium">{t('appointments.timeline')}</Label>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-blue-600" />
                    <span>{t('appointments.addedToQueue')}: {formatTime(selectedItem.addedAt)}</span>
                  </div>
                  {selectedItem.calledAt && (
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-purple-600" />
                      <span>{t('appointments.called')}: {formatTime(selectedItem.calledAt)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-orange-600" />
                    <span>{selectedItem.remindersSent} {t('appointments.remindersSent')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add to Queue Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('appointments.addToQueue')}</DialogTitle>
            <DialogDescription>
              {t('appointments.addToQueueDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Quick patient search or new patient form would go here */}
            <p className="text-sm text-muted-foreground">
              {t('appointments.addToQueueComingSoon')}
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button disabled>
              {t('appointments.addToQueue')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WaitingList;