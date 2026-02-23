import React, { useState, useEffect } from 'react';
import { 
  Camera, Eye, Download, Upload, Search, Filter, Calendar, User, FileImage,
  Monitor, PlusCircle, Edit, Trash2, CheckCircle, XCircle, Clock, AlertCircle,
  Stethoscope, Brain, Heart, Bone, Zap, RefreshCw, ArrowUpDown, Grid3X3,
  List, Settings, Share2, Printer, Save, MoreVertical, ChevronDown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Checkbox } from '../ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { DatePicker } from '../ui/date-picker';
import { toast } from 'sonner@2.0.3';

interface StudiesManagementProps {
  language: 'en' | 'ar';
  userRole: string;
}

const translations = {
  en: {
    title: 'Studies Management',
    newStudy: 'New Study',
    importStudy: 'Import Study',
    exportStudies: 'Export Studies',
    studyDetails: 'Study Details',
    patientInfo: 'Patient Information',
    studyInfo: 'Study Information',
    imageInfo: 'Image Information',
    
    // Columns
    studyId: 'Study ID',
    patientName: 'Patient Name',
    patientId: 'Patient ID',
    studyDate: 'Study Date',
    modality: 'Modality',
    bodyPart: 'Body Part',
    studyDescription: 'Description',
    status: 'Status',
    priority: 'Priority',
    images: 'Images',
    fileSize: 'File Size',
    technician: 'Technician',
    radiologist: 'Radiologist',
    actions: 'Actions',
    
    // Status
    scheduled: 'Scheduled',
    inProgress: 'In Progress',
    completed: 'Completed',
    reported: 'Reported',
    cancelled: 'Cancelled',
    
    // Priority
    routine: 'Routine',
    urgent: 'Urgent',
    stat: 'STAT',
    
    // Modalities
    xray: 'X-Ray',
    ct: 'CT Scan',
    mri: 'MRI',
    ultrasound: 'Ultrasound',
    mammography: 'Mammography',
    nuclear: 'Nuclear Medicine',
    
    // Actions
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
    download: 'Download',
    share: 'Share',
    print: 'Print',
    duplicate: 'Duplicate',
    archive: 'Archive',
    
    // Common
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    refresh: 'Refresh',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    
    // Messages
    studyCreated: 'Study created successfully',
    studyUpdated: 'Study updated successfully',
    studyDeleted: 'Study deleted successfully',
    studyArchived: 'Study archived successfully',
    
    // View modes
    listView: 'List View',
    gridView: 'Grid View',
    detailView: 'Detail View',
    
    // Filters
    allStatuses: 'All Statuses',
    allModalities: 'All Modalities',
    allPriorities: 'All Priorities',
    dateRange: 'Date Range',
    
    // Study details
    studyTime: 'Study Time',
    accessionNumber: 'Accession Number',
    studyInstanceUID: 'Study Instance UID',
    referringPhysician: 'Referring Physician',
    performingPhysician: 'Performing Physician',
    institutionName: 'Institution Name',
    studyComments: 'Study Comments'
  },
  ar: {
    title: 'إدارة الدراسات',
    newStudy: 'دراسة جديدة',
    importStudy: 'استيراد دراسة',
    exportStudies: 'تصدير الدراسات',
    studyDetails: 'تفاصيل الدراسة',
    patientInfo: 'معلومات المريض',
    studyInfo: 'معلومات الدراسة',
    imageInfo: 'معلومات الصورة',
    
    // Columns
    studyId: 'معرف الدراسة',
    patientName: 'اسم المريض',
    patientId: 'معرف المريض',
    studyDate: 'تاريخ الدراسة',
    modality: 'نوع الفحص',
    bodyPart: 'جزء الجسم',
    studyDescription: 'وصف الدراسة',
    status: 'الحالة',
    priority: 'الأولوية',
    images: 'الصور',
    fileSize: 'حجم الملف',
    technician: 'الفني',
    radiologist: 'أخصائي الأشعة',
    actions: 'الإجراءات',
    
    // Status
    scheduled: 'مجدول',
    inProgress: 'قيد التنفيذ',
    completed: 'مكتمل',
    reported: 'تم التقرير',
    cancelled: 'ملغي',
    
    // Priority
    routine: 'عادي',
    urgent: 'عاجل',
    stat: 'طارئ',
    
    // Modalities
    xray: 'أشعة سينية',
    ct: 'أشعة مقطعية',
    mri: 'رنين مغناطيسي',
    ultrasound: 'موجات فوق صوتية',
    mammography: 'تصوير الثدي',
    nuclear: 'الطب النووي',
    
    // Actions
    view: 'عرض',
    edit: 'تعديل',
    delete: 'حذف',
    download: 'تحميل',
    share: 'مشاركة',
    print: 'طباعة',
    duplicate: 'نسخ',
    archive: 'أرشفة',
    
    // Common
    search: 'بحث',
    filter: 'تصفية',
    sort: 'ترتيب',
    refresh: 'تحديث',
    save: 'حفظ',
    cancel: 'إلغاء',
    close: 'إغلاق',
    
    // Messages
    studyCreated: 'تم إنشاء الدراسة بنجاح',
    studyUpdated: 'تم تحديث الدراسة بنجاح',
    studyDeleted: 'تم حذف الدراسة بنجاح',
    studyArchived: 'تم أرشفة الدراسة بنجاح',
    
    // View modes
    listView: 'عرض القائمة',
    gridView: 'عرض الشبكة',
    detailView: 'عرض التفاصيل',
    
    // Filters
    allStatuses: 'جميع الحالات',
    allModalities: 'جميع أنواع الفحص',
    allPriorities: 'جميع الأولويات',
    dateRange: 'نطاق التاريخ',
    
    // Study details
    studyTime: 'وقت الدراسة',
    accessionNumber: 'رقم الإدخال',
    studyInstanceUID: 'معرف مثيل الدراسة',
    referringPhysician: 'الطبيب المحول',
    performingPhysician: 'الطبيب المنفذ',
    institutionName: 'اسم المؤسسة',
    studyComments: 'تعليقات الدراسة'
  }
};

// Mock data with more comprehensive study information
const mockStudies = [
  {
    id: 'ST001',
    patientId: 'P001',
    patientName: 'أحمد محمد علي',
    patientAge: 45,
    patientGender: 'M',
    studyDate: '2024-01-20',
    studyTime: '14:30:00',
    modality: 'CT',
    bodyPart: 'Chest',
    description: 'CT Chest with contrast',
    status: 'completed',
    priority: 'routine',
    images: 45,
    fileSize: '124 MB',
    technician: 'سارة أحمد',
    radiologist: 'د. محمد حسن',
    accessionNumber: 'ACC001',
    studyInstanceUID: '1.2.840.113619.2.5.1762583153.215519.978957063.78',
    referringPhysician: 'د. أحمد سالم',
    performingPhysician: 'د. محمد حسن',
    institutionName: 'مستشفى الملك فيصل',
    studyComments: 'Routine chest CT for follow-up',
    reportStatus: 'pending'
  },
  {
    id: 'ST002',
    patientId: 'P002',
    patientName: 'فاطمة علي حسن',
    patientAge: 32,
    patientGender: 'F',
    studyDate: '2024-01-20',
    studyTime: '15:45:00',
    modality: 'MRI',
    bodyPart: 'Brain',
    description: 'MRI Brain without contrast',
    status: 'inProgress',
    priority: 'urgent',
    images: 0,
    fileSize: '0 MB',
    technician: 'أحمد محمود',
    radiologist: 'د. ليلى إبراهيم',
    accessionNumber: 'ACC002',
    studyInstanceUID: '1.2.840.113619.2.5.1762583153.215519.978957063.79',
    referringPhysician: 'د. سالم محمد',
    performingPhysician: 'د. ليلى إبراهيم',
    institutionName: 'مستشفى الملك فيصل',
    studyComments: 'Urgent brain MRI for headache evaluation',
    reportStatus: 'not_started'
  },
  {
    id: 'ST003',
    patientId: 'P003',
    patientName: 'محمد سالم',
    patientAge: 28,
    patientGender: 'M',
    studyDate: '2024-01-19',
    studyTime: '10:15:00',
    modality: 'X-Ray',
    bodyPart: 'Spine',
    description: 'X-Ray Lumbar Spine',
    status: 'reported',
    priority: 'routine',
    images: 2,
    fileSize: '8 MB',
    technician: 'نور الدين',
    radiologist: 'د. عمر السعيد',
    accessionNumber: 'ACC003',
    studyInstanceUID: '1.2.840.113619.2.5.1762583153.215519.978957063.80',
    referringPhysician: 'د. نادية حسن',
    performingPhysician: 'د. عمر السعيد',
    institutionName: 'مستشفى الملك فيصل',
    studyComments: 'Lower back pain evaluation',
    reportStatus: 'completed'
  },
  {
    id: 'ST004',
    patientId: 'P004',
    patientName: 'نادية حسن أحمد',
    patientAge: 38,
    patientGender: 'F',
    studyDate: '2024-01-19',
    studyTime: '16:20:00',
    modality: 'Ultrasound',
    bodyPart: 'Abdomen',
    description: 'Abdominal Ultrasound',
    status: 'completed',
    priority: 'routine',
    images: 12,
    fileSize: '15 MB',
    technician: 'مريم سالم',
    radiologist: 'د. خالد عمر',
    accessionNumber: 'ACC004',
    studyInstanceUID: '1.2.840.113619.2.5.1762583153.215519.978957063.81',
    referringPhysician: 'د. فاطمة محمد',
    performingPhysician: 'د. خالد عمر',
    institutionName: 'مستشفى الملك فيصل',
    studyComments: 'Abdominal pain workup',
    reportStatus: 'pending'
  }
];

export default function StudiesManagement({ language, userRole }: StudiesManagementProps) {
  const [studies, setStudies] = useState(mockStudies);
  const [filteredStudies, setFilteredStudies] = useState(mockStudies);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalityFilter, setModalityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'detail'>('list');
  const [sortBy, setSortBy] = useState('studyDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedStudies, setSelectedStudies] = useState<string[]>([]);
  const [selectedStudy, setSelectedStudy] = useState<any>(null);
  const [isNewStudyDialogOpen, setIsNewStudyDialogOpen] = useState(false);
  const [isStudyDetailsDialogOpen, setIsStudyDetailsDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const t = translations[language];

  // Filter and sort functions
  useEffect(() => {
    let filtered = studies.filter(study => {
      const matchesSearch = study.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           study.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           study.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           study.patientId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesModality = modalityFilter === 'all' || study.modality === modalityFilter;
      const matchesStatus = statusFilter === 'all' || study.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || study.priority === priorityFilter;
      
      return matchesSearch && matchesModality && matchesStatus && matchesPriority;
    });

    // Sort studies
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'studyDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredStudies(filtered);
  }, [studies, searchTerm, modalityFilter, statusFilter, priorityFilter, sortBy, sortOrder]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { color: 'bg-blue-100 text-blue-800', label: t.scheduled },
      inProgress: { color: 'bg-yellow-100 text-yellow-800', label: t.inProgress },
      completed: { color: 'bg-green-100 text-green-800', label: t.completed },
      reported: { color: 'bg-purple-100 text-purple-800', label: t.reported },
      cancelled: { color: 'bg-red-100 text-red-800', label: t.cancelled }
    };

    const config = statusConfig[status] || statusConfig.scheduled;
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      routine: { color: 'bg-gray-100 text-gray-800', label: t.routine },
      urgent: { color: 'bg-orange-100 text-orange-800', label: t.urgent },
      stat: { color: 'bg-red-100 text-red-800', label: t.stat }
    };

    const config = priorityConfig[priority] || priorityConfig.routine;
    
    return (
      <Badge className={config.color}>
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

  const handleStudySelect = (studyId: string) => {
    setSelectedStudies(prev => 
      prev.includes(studyId) 
        ? prev.filter(id => id !== studyId)
        : [...prev, studyId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudies.length === filteredStudies.length) {
      setSelectedStudies([]);
    } else {
      setSelectedStudies(filteredStudies.map(s => s.id));
    }
  };

  const handleDeleteStudy = (studyId: string) => {
    setStudies(prev => prev.filter(s => s.id !== studyId));
    toast.success(t.studyDeleted);
  };

  const handleBulkAction = (action: string) => {
    switch (action) {
      case 'delete':
        setStudies(prev => prev.filter(s => !selectedStudies.includes(s.id)));
        setSelectedStudies([]);
        toast.success(`${selectedStudies.length} دراسة محذوفة`);
        break;
      case 'archive':
        // Archive logic here
        setSelectedStudies([]);
        toast.success(`${selectedStudies.length} دراسة مؤرشفة`);
        break;
      default:
        break;
    }
  };

  // Render list view
  const renderListView = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription>{filteredStudies.length} دراسة</CardDescription>
          </div>
          {selectedStudies.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{selectedStudies.length} محدد</span>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('delete')}>
                <Trash2 className="w-4 h-4 mr-2" />
                حذف المحدد
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('archive')}>
                أرشفة المحدد
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedStudies.length === filteredStudies.length && filteredStudies.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>{t.studyId}</TableHead>
              <TableHead>{t.patientName}</TableHead>
              <TableHead>{t.studyDate}</TableHead>
              <TableHead>{t.modality}</TableHead>
              <TableHead>{t.bodyPart}</TableHead>
              <TableHead>{t.status}</TableHead>
              <TableHead>{t.priority}</TableHead>
              <TableHead>{t.images}</TableHead>
              <TableHead>{t.fileSize}</TableHead>
              <TableHead>{t.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudies.map((study) => (
              <TableRow key={study.id}>
                <TableCell>
                  <Checkbox 
                    checked={selectedStudies.includes(study.id)}
                    onCheckedChange={() => handleStudySelect(study.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{study.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{study.patientName}</p>
                    <p className="text-sm text-muted-foreground">{study.patientId}</p>
                  </div>
                </TableCell>
                <TableCell>{study.studyDate}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getModalityIcon(study.modality)}
                    {study.modality}
                  </div>
                </TableCell>
                <TableCell>{study.bodyPart}</TableCell>
                <TableCell>{getStatusBadge(study.status)}</TableCell>
                <TableCell>{getPriorityBadge(study.priority)}</TableCell>
                <TableCell>{study.images}</TableCell>
                <TableCell>{study.fileSize}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedStudy(study);
                        setIsStudyDetailsDialogOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          {t.edit}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          {t.download}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="w-4 h-4 mr-2" />
                          {t.share}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Printer className="w-4 h-4 mr-2" />
                          {t.print}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteStudy(study.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {t.delete}
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
  );

  // Render grid view
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredStudies.map((study) => (
        <Card key={study.id} className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getModalityIcon(study.modality)}
                <span className="font-medium">{study.modality}</span>
              </div>
              <Checkbox 
                checked={selectedStudies.includes(study.id)}
                onCheckedChange={() => handleStudySelect(study.id)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="font-medium">{study.patientName}</p>
                <p className="text-sm text-muted-foreground">{study.patientId}</p>
              </div>
              <p className="text-sm">{study.description}</p>
              <div className="flex items-center justify-between">
                {getStatusBadge(study.status)}
                {getPriorityBadge(study.priority)}
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{study.studyDate}</span>
                <span>{study.images} صورة</span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    setSelectedStudy(study);
                    setIsStudyDetailsDialogOpen(true);
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {t.view}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      {t.edit}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="w-4 h-4 mr-2" />
                      {t.download}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => handleDeleteStudy(study.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t.delete}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t.title}</h2>
          <p className="text-muted-foreground">{filteredStudies.length} من {studies.length} دراسة</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsNewStudyDialogOpen(true)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            {t.newStudy}
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            {t.importStudy}
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            {t.exportStudies}
          </Button>
        </div>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
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
            
            {/* Filters */}
            <div className="flex items-center gap-2">
              <Select value={modalityFilter} onValueChange={setModalityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allModalities}</SelectItem>
                  <SelectItem value="X-Ray">{t.xray}</SelectItem>
                  <SelectItem value="CT">{t.ct}</SelectItem>
                  <SelectItem value="MRI">{t.mri}</SelectItem>
                  <SelectItem value="Ultrasound">{t.ultrasound}</SelectItem>
                  <SelectItem value="Mammography">{t.mammography}</SelectItem>
                  <SelectItem value="Nuclear">{t.nuclear}</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allStatuses}</SelectItem>
                  <SelectItem value="scheduled">{t.scheduled}</SelectItem>
                  <SelectItem value="inProgress">{t.inProgress}</SelectItem>
                  <SelectItem value="completed">{t.completed}</SelectItem>
                  <SelectItem value="reported">{t.reported}</SelectItem>
                  <SelectItem value="cancelled">{t.cancelled}</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allPriorities}</SelectItem>
                  <SelectItem value="routine">{t.routine}</SelectItem>
                  <SelectItem value="urgent">{t.urgent}</SelectItem>
                  <SelectItem value="stat">{t.stat}</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex items-center border rounded-lg">
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('list')}
                  className="rounded-r-none"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                  className="rounded-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </div>

              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {viewMode === 'list' ? renderListView() : renderGridView()}

      {/* Study Details Dialog */}
      <Dialog open={isStudyDetailsDialogOpen} onOpenChange={setIsStudyDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.studyDetails}</DialogTitle>
            <DialogDescription>
              {selectedStudy?.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedStudy && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t.patientInfo}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm text-muted-foreground">{t.patientName}</Label>
                    <p className="font-medium">{selectedStudy.patientName}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">{t.patientId}</Label>
                    <p className="font-medium">{selectedStudy.patientId}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">العمر</Label>
                      <p className="font-medium">{selectedStudy.patientAge} سنة</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">الجنس</Label>
                      <p className="font-medium">{selectedStudy.patientGender === 'M' ? 'ذكر' : 'أنثى'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Study Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t.studyInfo}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm text-muted-foreground">{t.studyId}</Label>
                    <p className="font-medium">{selectedStudy.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">{t.accessionNumber}</Label>
                    <p className="font-medium">{selectedStudy.accessionNumber}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">{t.studyDate}</Label>
                      <p className="font-medium">{selectedStudy.studyDate}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">{t.studyTime}</Label>
                      <p className="font-medium">{selectedStudy.studyTime}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">{t.modality}</Label>
                    <div className="flex items-center gap-2 mt-1">
                      {getModalityIcon(selectedStudy.modality)}
                      <span className="font-medium">{selectedStudy.modality}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">{t.bodyPart}</Label>
                    <p className="font-medium">{selectedStudy.bodyPart}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">{t.status}</Label>
                      <div className="mt-1">{getStatusBadge(selectedStudy.status)}</div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">{t.priority}</Label>
                      <div className="mt-1">{getPriorityBadge(selectedStudy.priority)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Image Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t.imageInfo}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">{t.images}</Label>
                      <p className="font-medium">{selectedStudy.images}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">{t.fileSize}</Label>
                      <p className="font-medium">{selectedStudy.fileSize}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">{t.studyInstanceUID}</Label>
                    <p className="font-mono text-sm break-all">{selectedStudy.studyInstanceUID}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Personnel Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">معلومات الموظفين</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm text-muted-foreground">{t.referringPhysician}</Label>
                    <p className="font-medium">{selectedStudy.referringPhysician}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">{t.performingPhysician}</Label>
                    <p className="font-medium">{selectedStudy.performingPhysician}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">{t.technician}</Label>
                    <p className="font-medium">{selectedStudy.technician}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">{t.institutionName}</Label>
                    <p className="font-medium">{selectedStudy.institutionName}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Study Comments */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">{t.studyComments}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{selectedStudy.studyComments}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Study Dialog */}
      <Dialog open={isNewStudyDialogOpen} onOpenChange={setIsNewStudyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t.newStudy}</DialogTitle>
            <DialogDescription>
              إضافة دراسة جديدة إلى النظام
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t.patientId}</Label>
              <Input placeholder="P001" />
            </div>
            <div>
              <Label>{t.patientName}</Label>
              <Input placeholder="اسم المريض" />
            </div>
            <div>
              <Label>{t.modality}</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="X-Ray">{t.xray}</SelectItem>
                  <SelectItem value="CT">{t.ct}</SelectItem>
                  <SelectItem value="MRI">{t.mri}</SelectItem>
                  <SelectItem value="Ultrasound">{t.ultrasound}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t.bodyPart}</Label>
              <Input placeholder="جزء الجسم" />
            </div>
            <div>
              <Label>{t.priority}</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">{t.routine}</SelectItem>
                  <SelectItem value="urgent">{t.urgent}</SelectItem>
                  <SelectItem value="stat">{t.stat}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t.referringPhysician}</Label>
              <Input placeholder="الطبيب المحول" />
            </div>
            <div className="col-span-2">
              <Label>{t.studyDescription}</Label>
              <Textarea placeholder="وصف الدراسة" />
            </div>
            <div className="col-span-2">
              <Label>{t.studyComments}</Label>
              <Textarea placeholder="تعليقات إضافية" />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsNewStudyDialogOpen(false)}>
              {t.cancel}
            </Button>
            <Button onClick={() => {
              setIsNewStudyDialogOpen(false);
              toast.success(t.studyCreated);
            }}>
              {t.save}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}