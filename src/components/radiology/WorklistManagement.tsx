import React, { useState, useEffect } from 'react';
import { 
  Clock, PlayCircle, PauseCircle, CheckCircle, AlertCircle, User, Calendar,
  Filter, Search, RefreshCw, MoreVertical, Eye, Edit, Trash2, Camera, Brain,
  Heart, Stethoscope, Zap, Bone, ArrowRight, ArrowLeft, Timer, Hourglass,
  UserCheck, Settings, Flag, MapPin, Phone, Mail, FileText
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { toast } from 'sonner@2.0.3';

interface WorklistManagementProps {
  language: 'en' | 'ar';
  userRole: string;
}

const translations = {
  en: {
    title: 'Worklist Management',
    scheduledExams: 'Scheduled Exams',
    inProgressExams: 'In Progress Exams',
    waitingPatients: 'Waiting Patients',
    completedToday: 'Completed Today',
    
    // Tabs
    scheduled: 'Scheduled',
    inProgress: 'In Progress',
    waiting: 'Waiting',
    completed: 'Completed',
    
    // Status
    ready: 'Ready',
    preparing: 'Preparing',
    scanning: 'Scanning',
    processing: 'Processing',
    reviewing: 'Reviewing',
    reported: 'Reported',
    cancelled: 'Cancelled',
    
    // Priority
    routine: 'Routine',
    urgent: 'Urgent',
    stat: 'STAT',
    emergency: 'Emergency',
    
    // Actions
    startExam: 'Start Exam',
    continueExam: 'Continue Exam',
    pauseExam: 'Pause Exam',
    completeExam: 'Complete Exam',
    cancelExam: 'Cancel Exam',
    reschedule: 'Reschedule',
    viewDetails: 'View Details',
    
    // Columns
    patientName: 'Patient Name',
    examType: 'Exam Type',
    scheduledTime: 'Scheduled Time',
    estimatedDuration: 'Duration',
    room: 'Room',
    technician: 'Technician',
    status: 'Status',
    priority: 'Priority',
    actions: 'Actions',
    
    // Details
    patientDetails: 'Patient Details',
    examDetails: 'Exam Details',
    schedulingInfo: 'Scheduling Information',
    
    // Common
    search: 'Search',
    filter: 'Filter',
    refresh: 'Refresh',
    today: 'Today',
    thisWeek: 'This Week',
    all: 'All',
    
    // Messages
    examStarted: 'Exam started successfully',
    examCompleted: 'Exam completed successfully',
    examCancelled: 'Exam cancelled successfully',
    examPaused: 'Exam paused successfully'
  },
  ar: {
    title: 'إدارة قائمة العمل',
    scheduledExams: 'الفحوصات المجدولة',
    inProgressExams: 'الفحوصات الجارية',
    waitingPatients: 'المرضى في الانتظار',
    completedToday: 'المكتمل اليوم',
    
    // Tabs
    scheduled: 'مجدول',
    inProgress: 'قيد التنفيذ',
    waiting: 'في الانتظار',
    completed: 'مكتمل',
    
    // Status
    ready: 'جاهز',
    preparing: 'تجهيز',
    scanning: 'مسح ضوئي',
    processing: 'معالجة',
    reviewing: 'مراجعة',
    reported: 'تم التقرير',
    cancelled: 'ملغي',
    
    // Priority
    routine: 'عادي',
    urgent: 'عاجل',
    stat: 'طارئ',
    emergency: 'إسعافي',
    
    // Actions
    startExam: 'بدء الفحص',
    continueExam: 'متابعة الفحص',
    pauseExam: 'إيقاف مؤقت',
    completeExam: 'إكمال الفحص',
    cancelExam: 'إلغاء الفحص',
    reschedule: 'إعادة جدولة',
    viewDetails: 'عرض التفاصيل',
    
    // Columns
    patientName: 'اسم المريض',
    examType: 'نوع الفحص',
    scheduledTime: 'الوقت المجدول',
    estimatedDuration: 'المدة المقدرة',
    room: 'الغرفة',
    technician: 'الفني',
    status: 'الحالة',
    priority: 'الأولوية',
    actions: 'الإجراءات',
    
    // Details
    patientDetails: 'تفاصيل المريض',
    examDetails: 'تفاصيل الفحص',
    schedulingInfo: 'معلومات الجدولة',
    
    // Common
    search: 'بحث',
    filter: 'تصفية',
    refresh: 'تحديث',
    today: 'اليوم',
    thisWeek: 'هذا الأسبوع',
    all: 'الكل',
    
    // Messages
    examStarted: 'تم بدء الفحص بنجاح',
    examCompleted: 'تم إكمال الفحص بنجاح',
    examCancelled: 'تم إلغاء الفحص بنجاح',
    examPaused: 'تم إيقاف الفحص مؤقتاً بنجاح'
  }
};

// Mock data for worklist
const mockWorklistItems = [
  {
    id: 'WL001',
    patientId: 'P001',
    patientName: 'أحمد محمد علي',
    patientAge: 45,
    patientGender: 'M',
    patientPhone: '0501234567',
    patientEmail: 'ahmed@email.com',
    examType: 'CT',
    examDescription: 'CT Chest with contrast',
    bodyPart: 'Chest',
    scheduledDate: '2024-01-20',
    scheduledTime: '14:30',
    estimatedDuration: 45,
    actualStartTime: null,
    actualEndTime: null,
    room: 'CT-1',
    technician: 'سارة أحمد',
    technicianId: 'T001',
    radiologist: 'د. محمد حسن',
    status: 'ready',
    priority: 'routine',
    studyInstanceUID: '1.2.840.113619.2.5.1762583153.215519.978957063.78',
    accessionNumber: 'ACC001',
    referringPhysician: 'د. أحمد سالم',
    clinicalHistory: 'Chest pain, rule out pulmonary embolism',
    preparations: 'NPO 4 hours, IV contrast',
    notes: 'Patient has contrast allergy - use premedication',
    progress: 0
  },
  {
    id: 'WL002',
    patientId: 'P002',
    patientName: 'فاطمة علي حسن',
    patientAge: 32,
    patientGender: 'F',
    patientPhone: '0507654321',
    patientEmail: 'fatima@email.com',
    examType: 'MRI',
    examDescription: 'MRI Brain without contrast',
    bodyPart: 'Brain',
    scheduledDate: '2024-01-20',
    scheduledTime: '15:45',
    estimatedDuration: 60,
    actualStartTime: '15:50',
    actualEndTime: null,
    room: 'MRI-1',
    technician: 'أحمد محمود',
    technicianId: 'T002',
    radiologist: 'د. ليلى إبراهيم',
    status: 'scanning',
    priority: 'urgent',
    studyInstanceUID: '1.2.840.113619.2.5.1762583153.215519.978957063.79',
    accessionNumber: 'ACC002',
    referringPhysician: 'د. سالم محمد',
    clinicalHistory: 'Severe headaches, rule out intracranial pathology',
    preparations: 'Remove all metal objects, hearing protection',
    notes: 'Patient has claustrophobia - may need sedation',
    progress: 65
  },
  {
    id: 'WL003',
    patientId: 'P003',
    patientName: 'محمد سالم',
    patientAge: 28,
    patientGender: 'M',
    patientPhone: '0509876543',
    patientEmail: 'mohamed@email.com',
    examType: 'X-Ray',
    examDescription: 'X-Ray Lumbar Spine',
    bodyPart: 'Spine',
    scheduledDate: '2024-01-20',
    scheduledTime: '16:15',
    estimatedDuration: 15,
    actualStartTime: '16:20',
    actualEndTime: '16:30',
    room: 'XR-2',
    technician: 'نور الدين',
    technicianId: 'T003',
    radiologist: 'د. عمر السعيد',
    status: 'completed',
    priority: 'routine',
    studyInstanceUID: '1.2.840.113619.2.5.1762583153.215519.978957063.80',
    accessionNumber: 'ACC003',
    referringPhysician: 'د. نادية حسن',
    clinicalHistory: 'Lower back pain, rule out disc herniation',
    preparations: 'No specific preparations required',
    notes: 'Standard lumbar spine protocol',
    progress: 100
  },
  {
    id: 'WL004',
    patientId: 'P004',
    patientName: 'نادية حسن أحمد',
    patientAge: 38,
    patientGender: 'F',
    patientPhone: '0502345678',
    patientEmail: 'nadia@email.com',
    examType: 'Ultrasound',
    examDescription: 'Abdominal Ultrasound',
    bodyPart: 'Abdomen',
    scheduledDate: '2024-01-20',
    scheduledTime: '17:00',
    estimatedDuration: 30,
    actualStartTime: null,
    actualEndTime: null,
    room: 'US-1',
    technician: 'مريم سالم',
    technicianId: 'T004',
    radiologist: 'د. خالد عمر',
    status: 'waiting',
    priority: 'routine',
    studyInstanceUID: '1.2.840.113619.2.5.1762583153.215519.978957063.81',
    accessionNumber: 'ACC004',
    referringPhysician: 'د. فاطمة محمد',
    clinicalHistory: 'Abdominal pain, rule out gallbladder disease',
    preparations: 'NPO 8 hours before exam',
    notes: 'Patient is pregnant - use minimal scanning time',
    progress: 0
  },
  {
    id: 'WL005',
    patientId: 'P005',
    patientName: 'خالد عبدالله',
    patientAge: 55,
    patientGender: 'M',
    patientPhone: '0506789012',
    patientEmail: 'khalid@email.com',
    examType: 'CT',
    examDescription: 'CT Abdomen/Pelvis',
    bodyPart: 'Abdomen',
    scheduledDate: '2024-01-20',
    scheduledTime: '18:30',
    estimatedDuration: 30,
    actualStartTime: '18:35',
    actualEndTime: null,
    room: 'CT-2',
    technician: 'عبدالله محمد',
    technicianId: 'T005',
    radiologist: 'د. سلمى أحمد',
    status: 'processing',
    priority: 'stat',
    studyInstanceUID: '1.2.840.113619.2.5.1762583153.215519.978957063.82',
    accessionNumber: 'ACC005',
    referringPhysician: 'د. محمود علي',
    clinicalHistory: 'Trauma patient, rule out internal injuries',
    preparations: 'Emergency protocol - no prep time',
    notes: 'STAT exam - priority processing required',
    progress: 85
  }
];

export default function WorklistManagement({ language, userRole }: WorklistManagementProps) {
  const [activeTab, setActiveTab] = useState('scheduled');
  const [worklistItems, setWorklistItems] = useState(mockWorklistItems);
  const [filteredItems, setFilteredItems] = useState(mockWorklistItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalityFilter, setModalityFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [technicianFilter, setTechnicianFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const t = translations[language];

  // Filter items based on tab and filters
  useEffect(() => {
    let filtered = worklistItems.filter(item => {
      // Tab filtering
      if (activeTab === 'scheduled' && item.status !== 'ready') return false;
      if (activeTab === 'inProgress' && !['preparing', 'scanning', 'processing'].includes(item.status)) return false;
      if (activeTab === 'waiting' && item.status !== 'waiting') return false;
      if (activeTab === 'completed' && !['completed', 'reported'].includes(item.status)) return false;

      // Search filtering
      const matchesSearch = item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.examDescription.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Other filters
      const matchesModality = modalityFilter === 'all' || item.examType === modalityFilter;
      const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
      const matchesTechnician = technicianFilter === 'all' || item.technicianId === technicianFilter;

      return matchesSearch && matchesModality && matchesPriority && matchesTechnician;
    });

    setFilteredItems(filtered);
  }, [activeTab, worklistItems, searchTerm, modalityFilter, priorityFilter, technicianFilter]);

  // Get statistics
  const stats = {
    scheduled: worklistItems.filter(item => item.status === 'ready').length,
    inProgress: worklistItems.filter(item => ['preparing', 'scanning', 'processing'].includes(item.status)).length,
    waiting: worklistItems.filter(item => item.status === 'waiting').length,
    completed: worklistItems.filter(item => ['completed', 'reported'].includes(item.status)).length
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ready: { color: 'bg-blue-100 text-blue-800', label: t.ready, icon: Clock },
      preparing: { color: 'bg-yellow-100 text-yellow-800', label: t.preparing, icon: Hourglass },
      scanning: { color: 'bg-green-100 text-green-800', label: t.scanning, icon: PlayCircle },
      processing: { color: 'bg-orange-100 text-orange-800', label: t.processing, icon: Timer },
      reviewing: { color: 'bg-purple-100 text-purple-800', label: t.reviewing, icon: Eye },
      completed: { color: 'bg-green-100 text-green-800', label: t.completed, icon: CheckCircle },
      reported: { color: 'bg-purple-100 text-purple-800', label: t.reported, icon: FileText },
      cancelled: { color: 'bg-red-100 text-red-800', label: t.cancelled, icon: AlertCircle },
      waiting: { color: 'bg-gray-100 text-gray-800', label: t.waiting, icon: Clock }
    };

    const config = statusConfig[status] || statusConfig.ready;
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      routine: { color: 'bg-gray-100 text-gray-800', label: t.routine },
      urgent: { color: 'bg-orange-100 text-orange-800', label: t.urgent },
      stat: { color: 'bg-red-100 text-red-800', label: t.stat },
      emergency: { color: 'bg-red-200 text-red-900', label: t.emergency }
    };

    const config = priorityConfig[priority] || priorityConfig.routine;
    
    return (
      <Badge className={config.color}>
        <Flag className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getModalityIcon = (modality: string) => {
    const icons = {
      'X-Ray': Camera,
      'CT': Brain,
      'MRI': Brain,
      'Ultrasound': Heart,
      'Mammography': Zap,
      'Nuclear': Stethoscope
    };

    const Icon = icons[modality] || Camera;
    return <Icon className="w-4 h-4" />;
  };

  const handleStatusChange = (itemId: string, newStatus: string) => {
    setWorklistItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              status: newStatus,
              actualStartTime: newStatus === 'scanning' && !item.actualStartTime 
                ? new Date().toLocaleTimeString() 
                : item.actualStartTime,
              actualEndTime: newStatus === 'completed' 
                ? new Date().toLocaleTimeString() 
                : item.actualEndTime,
              progress: newStatus === 'completed' ? 100 : item.progress
            }
          : item
      )
    );

    // Show appropriate toast message
    switch (newStatus) {
      case 'scanning':
        toast.success(t.examStarted);
        break;
      case 'completed':
        toast.success(t.examCompleted);
        break;
      case 'cancelled':
        toast.success(t.examCancelled);
        break;
      case 'preparing':
        toast.success(t.examPaused);
        break;
    }
  };

  const getActionButton = (item: any) => {
    switch (item.status) {
      case 'ready':
        return (
          <Button 
            size="sm"
            onClick={() => handleStatusChange(item.id, 'scanning')}
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            {t.startExam}
          </Button>
        );
      case 'scanning':
        return (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleStatusChange(item.id, 'preparing')}
            >
              <PauseCircle className="w-4 h-4 mr-2" />
              {t.pauseExam}
            </Button>
            <Button 
              size="sm"
              onClick={() => handleStatusChange(item.id, 'completed')}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {t.completeExam}
            </Button>
          </div>
        );
      case 'preparing':
        return (
          <Button 
            size="sm"
            onClick={() => handleStatusChange(item.id, 'scanning')}
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            {t.continueExam}
          </Button>
        );
      default:
        return (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => {
              setSelectedItem(item);
              setIsDetailsDialogOpen(true);
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            {t.viewDetails}
          </Button>
        );
    }
  };

  const MetricCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <p className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? '+' : ''}{trend}% من أمس
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t.title}</h2>
          <p className="text-muted-foreground">{filteredItems.length} عنصر في قائمة العمل</p>
        </div>
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          {t.refresh}
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title={t.scheduledExams}
          value={stats.scheduled}
          icon={Calendar}
          color="bg-blue-500"
          trend={5.2}
        />
        <MetricCard
          title={t.inProgressExams}
          value={stats.inProgress}
          icon={PlayCircle}
          color="bg-green-500"
          trend={12.5}
        />
        <MetricCard
          title={t.waitingPatients}
          value={stats.waiting}
          icon={Clock}
          color="bg-yellow-500"
          trend={-8.1}
        />
        <MetricCard
          title={t.completedToday}
          value={stats.completed}
          icon={CheckCircle}
          color="bg-purple-500"
          trend={18.7}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t.search + "..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={modalityFilter} onValueChange={setModalityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  <SelectItem value="X-Ray">أشعة سينية</SelectItem>
                  <SelectItem value="CT">أشعة مقطعية</SelectItem>
                  <SelectItem value="MRI">رنين مغناطيسي</SelectItem>
                  <SelectItem value="Ultrasound">موجات فوق صوتية</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأولويات</SelectItem>
                  <SelectItem value="routine">{t.routine}</SelectItem>
                  <SelectItem value="urgent">{t.urgent}</SelectItem>
                  <SelectItem value="stat">{t.stat}</SelectItem>
                  <SelectItem value="emergency">{t.emergency}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={technicianFilter} onValueChange={setTechnicianFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الفنيين</SelectItem>
                  <SelectItem value="T001">سارة أحمد</SelectItem>
                  <SelectItem value="T002">أحمد محمود</SelectItem>
                  <SelectItem value="T003">نور الدين</SelectItem>
                  <SelectItem value="T004">مريم سالم</SelectItem>
                  <SelectItem value="T005">عبدالله محمد</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scheduled" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {t.scheduled}
            <Badge variant="secondary">{stats.scheduled}</Badge>
          </TabsTrigger>
          <TabsTrigger value="inProgress" className="flex items-center gap-2">
            <PlayCircle className="w-4 h-4" />
            {t.inProgress}
            <Badge variant="secondary">{stats.inProgress}</Badge>
          </TabsTrigger>
          <TabsTrigger value="waiting" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {t.waiting}
            <Badge variant="secondary">{stats.waiting}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {t.completed}
            <Badge variant="secondary">{stats.completed}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.patientName}</TableHead>
                    <TableHead>{t.examType}</TableHead>
                    <TableHead>{t.scheduledTime}</TableHead>
                    <TableHead>{t.estimatedDuration}</TableHead>
                    <TableHead>{t.room}</TableHead>
                    <TableHead>{t.technician}</TableHead>
                    <TableHead>{t.status}</TableHead>
                    <TableHead>{t.priority}</TableHead>
                    {activeTab === 'inProgress' && <TableHead>التقدم</TableHead>}
                    <TableHead>{t.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {item.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{item.patientName}</p>
                            <p className="text-sm text-muted-foreground">{item.patientId}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getModalityIcon(item.examType)}
                          <div>
                            <p className="font-medium">{item.examType}</p>
                            <p className="text-sm text-muted-foreground">{item.bodyPart}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.scheduledTime}</p>
                          <p className="text-sm text-muted-foreground">{item.scheduledDate}</p>
                        </div>
                      </TableCell>
                      <TableCell>{item.estimatedDuration} دقيقة</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          <MapPin className="w-3 h-3 mr-1" />
                          {item.room}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4" />
                          {item.technician}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                      {activeTab === 'inProgress' && (
                        <TableCell>
                          <div className="space-y-2">
                            <Progress value={item.progress} className="w-16" />
                            <span className="text-xs text-muted-foreground">{item.progress}%</span>
                          </div>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActionButton(item)}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedItem(item);
                                  setIsDetailsDialogOpen(true);
                                }}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                {t.viewDetails}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                تعديل
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Calendar className="w-4 h-4 mr-2" />
                                {t.reschedule}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleStatusChange(item.id, 'cancelled')}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                {t.cancelExam}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.viewDetails}</DialogTitle>
            <DialogDescription>
              {selectedItem?.examDescription}
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <Tabs defaultValue="patient" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="patient">{t.patientDetails}</TabsTrigger>
                <TabsTrigger value="exam">{t.examDetails}</TabsTrigger>
                <TabsTrigger value="scheduling">{t.schedulingInfo}</TabsTrigger>
              </TabsList>

              <TabsContent value="patient" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      معلومات المريض
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">اسم المريض</Label>
                        <p className="font-medium">{selectedItem.patientName}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">معرف المريض</Label>
                        <p className="font-medium">{selectedItem.patientId}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">العمر</Label>
                        <p className="font-medium">{selectedItem.patientAge} سنة</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">الجنس</Label>
                        <p className="font-medium">{selectedItem.patientGender === 'M' ? 'ذكر' : 'أنثى'}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">رقم الهاتف</Label>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <p className="font-medium">{selectedItem.patientPhone}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">البريد الإلكتروني</Label>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <p className="font-medium">{selectedItem.patientEmail}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">التاريخ المرضي</Label>
                      <p className="font-medium">{selectedItem.clinicalHistory}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="exam" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getModalityIcon(selectedItem.examType)}
                      تفاصيل الفحص
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">نوع الفحص</Label>
                        <p className="font-medium">{selectedItem.examType}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">جزء الجسم</Label>
                        <p className="font-medium">{selectedItem.bodyPart}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">رقم الإدخال</Label>
                        <p className="font-medium">{selectedItem.accessionNumber}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">الغرفة</Label>
                        <Badge variant="outline">
                          <MapPin className="w-3 h-3 mr-1" />
                          {selectedItem.room}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">الحالة</Label>
                        <div className="mt-1">{getStatusBadge(selectedItem.status)}</div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">الأولوية</Label>
                        <div className="mt-1">{getPriorityBadge(selectedItem.priority)}</div>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <Label className="text-sm text-muted-foreground">وصف الفحص</Label>
                      <p className="font-medium">{selectedItem.examDescription}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">التحضيرات المطلوبة</Label>
                      <p className="font-medium">{selectedItem.preparations}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">ملاحظات</Label>
                      <p className="font-medium text-orange-600">{selectedItem.notes}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">معرف مثيل الدراسة</Label>
                      <p className="font-mono text-sm break-all">{selectedItem.studyInstanceUID}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="scheduling" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      معلومات الجدولة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">التاريخ المجدول</Label>
                        <p className="font-medium">{selectedItem.scheduledDate}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">الوقت المجدول</Label>
                        <p className="font-medium">{selectedItem.scheduledTime}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">المدة المقدرة</Label>
                        <p className="font-medium">{selectedItem.estimatedDuration} دقيقة</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">وقت البداية الفعلي</Label>
                        <p className="font-medium">{selectedItem.actualStartTime || 'لم يبدأ بعد'}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">وقت الانتهاء الفعلي</Label>
                        <p className="font-medium">{selectedItem.actualEndTime || 'لم ينته بعد'}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">التقدم</Label>
                        <div className="flex items-center gap-2">
                          <Progress value={selectedItem.progress} className="flex-1" />
                          <span className="text-sm font-medium">{selectedItem.progress}%</span>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">الطبيب المحول</Label>
                        <p className="font-medium">{selectedItem.referringPhysician}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">أخصائي الأشعة</Label>
                        <p className="font-medium">{selectedItem.radiologist}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">الفني المسؤول</Label>
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4" />
                          <p className="font-medium">{selectedItem.technician}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}