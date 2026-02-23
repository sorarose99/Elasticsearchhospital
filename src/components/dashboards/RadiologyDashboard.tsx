import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Image, 
  FileImage, 
  Upload,
  Search,
  Calendar,
  User,
  Monitor,
  Zap,
  Film,
  LogOut,
  Languages,
  Play,
  Eye,
  Download
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import DICOMViewer from '../radiology/DICOMViewer';
import { useLanguage } from '../../services/LanguageService';
import { useNavigation } from '../navigation/NavigationContext';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  specialization?: string;
  department?: string;
}

interface RadiologyDashboardProps {
  user: User;
  onLogout: () => void;
  language: 'en' | 'ar';
  onLanguageChange: (lang: 'en' | 'ar') => void;
  isDemoMode?: boolean;
}

const translations = {
  en: {
    title: 'Radiology Dashboard',
    imagingOrders: 'Imaging Orders',
    studyLibrary: 'Study Library',
    workstation: 'Workstation',
    reports: 'Reports',
    pendingStudies: 'Pending Studies',
    completedToday: 'Completed Today',
    criticalFindings: 'Critical Findings',
    worklistItems: 'Worklist Items',
    searchStudies: 'Search studies...',
    patientName: 'Patient Name',
    studyDate: 'Study Date',
    modality: 'Modality',
    studyDescription: 'Study Description',
    status: 'Status',
    priority: 'Priority',
    actions: 'Actions',
    pending: 'Pending',
    inProgress: 'In Progress',
    completed: 'Completed',
    reported: 'Reported',
    normal: 'Normal',
    urgent: 'Urgent',
    stat: 'STAT',
    viewImages: 'View Images',
    createReport: 'Create Report',
    viewReport: 'View Report',
    uploadImages: 'Upload Images',
    ctScan: 'CT Scan',
    mriScan: 'MRI Scan',
    xray: 'X-Ray',
    ultrasound: 'Ultrasound',
    loading: 'Loading...',
    noStudies: 'No studies found',
    openDicomViewer: 'Open DICOM Viewer',
    studyInfo: 'Study Information',
    imageCount: 'Image Count',
    seriesCount: 'Series Count',
    bodyPart: 'Body Part',
    referringPhysician: 'Referring Physician',
  },
  ar: {
    title: 'لوحة تحكم الأشعة',
    imagingOrders: 'طلبات التصوير',
    studyLibrary: 'مكتبة الدراسات',
    workstation: 'محطة العمل',
    reports: 'التقارير',
    pendingStudies: 'دراسات معلقة',
    completedToday: 'مكتمل اليوم',
    criticalFindings: 'نتائج حرجة',
    worklistItems: 'عناصر قائمة العمل',
    searchStudies: 'البحث عن الدراسات...',
    patientName: 'اسم المريض',
    studyDate: 'تاريخ الدراسة',
    modality: 'طريقة التصوير',
    studyDescription: 'وصف الدراسة',
    status: 'الحالة',
    priority: 'الأولوية',
    actions: 'الإجراءات',
    pending: 'معلق',
    inProgress: 'قيد التنفيذ',
    completed: 'مكتمل',
    reported: 'تم الإبلاغ',
    normal: 'عادي',
    urgent: 'عاجل',
    stat: 'فوري',
    viewImages: 'عرض الصور',
    createReport: 'إنشاء تقرير',
    viewReport: 'عرض التقرير',
    uploadImages: 'رفع الصور',
    ctScan: 'الأشعة المقطعية',
    mriScan: 'الرنين المغناطيسي',
    xray: 'الأشعة السينية',
    ultrasound: 'الموجات فوق الصوتية',
    loading: 'جاري التحميل...',
    noStudies: 'لم يتم العثور على دراسات',
    openDicomViewer: 'فتح عارض DICOM',
    studyInfo: 'معلومات الدراسة',
    imageCount: 'عدد الصور',
    seriesCount: 'عدد السلاسل',
    bodyPart: 'جزء الجسم',
    referringPhysician: 'الطبيب المحول',
  }
};

// Mock radiology data
const mockStudies = [
  {
    id: 'STU001',
    patientName: 'Ahmed Hassan',
    patientId: 'PAT001',
    studyDate: '2024-12-01',
    modality: 'CT',
    studyDescription: 'CT Chest with Contrast',
    status: 'pending',
    priority: 'normal',
    bodyPart: 'Chest',
    referringPhysician: 'Dr. Sara Mohamed',
    imageCount: 150,
    seriesCount: 3,
    studyTime: '14:30',
    accessionNumber: 'ACC20241201001'
  },
  {
    id: 'STU002',
    patientName: 'Fatima Ali',
    patientId: 'PAT002',
    studyDate: '2024-12-01',
    modality: 'MRI',
    studyDescription: 'MRI Brain without Contrast',
    status: 'completed',
    priority: 'urgent',
    bodyPart: 'Head',
    referringPhysician: 'Dr. Omar Khan',
    imageCount: 200,
    seriesCount: 5,
    studyTime: '10:15',
    accessionNumber: 'ACC20241201002'
  },
  {
    id: 'STU003',
    patientName: 'Mohamed Salah',
    patientId: 'PAT003',
    studyDate: '2024-12-01',
    modality: 'XR',
    studyDescription: 'Chest X-Ray 2 Views',
    status: 'reported',
    priority: 'stat',
    bodyPart: 'Chest',
    referringPhysician: 'Dr. Ahmed Hassan',
    imageCount: 2,
    seriesCount: 1,
    studyTime: '09:45',
    accessionNumber: 'ACC20241201003'
  }
];

export default function RadiologyDashboard({ user, onLogout, language, onLanguageChange, isDemoMode = false }: RadiologyDashboardProps) {
  const [studies, setStudies] = useState(mockStudies);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudy, setSelectedStudy] = useState<any>(null);
  const [showDICOMViewer, setShowDICOMViewer] = useState(false);

  const { t } = useLanguage();
  const { navigateTo } = useNavigation();

  const filteredStudies = studies.filter((study: any) =>
    study.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    study.studyDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    study.modality?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    study.accessionNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingStudies = studies.filter(study => study.status === 'pending');
  const completedToday = studies.filter(study => 
    study.status === 'completed' && study.studyDate === new Date().toISOString().split('T')[0]
  );
  const criticalFindings = studies.filter(study => study.priority === 'stat');

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-500',
      'in_progress': 'bg-blue-500',
      completed: 'bg-green-500',
      reported: 'bg-purple-500'
    };
    return (
      <Badge className={`${statusColors[status as keyof typeof statusColors] || 'bg-gray-500'} text-white`}>
        {t[status as keyof typeof t] || status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityColors = {
      normal: 'bg-green-500',
      urgent: 'bg-orange-500',
      stat: 'bg-red-500'
    };
    return (
      <Badge className={`${priorityColors[priority as keyof typeof priorityColors] || 'bg-gray-500'} text-white`}>
        {t[priority as keyof typeof t] || priority}
      </Badge>
    );
  };

  const getModalityIcon = (modality: string) => {
    switch (modality) {
      case 'CT': return <Monitor className="w-5 h-5" />;
      case 'MRI': return <Zap className="w-5 h-5" />;
      case 'XR': return <Image className="w-5 h-5" />;
      case 'US': return <Film className="w-5 h-5" />;
      default: return <Camera className="w-5 h-5" />;
    }
  };

  const handleViewImages = (study: any) => {
    setSelectedStudy(study);
    setShowDICOMViewer(true);
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="w-6 h-6 text-white" />
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-sm text-gray-600">
                {user.name} - {user.specialization || 'Radiologist'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isDemoMode && (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                Demo Mode
              </Badge>
            )}
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

      {/* Stats Cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatCard
            title={t.pendingStudies}
            value={pendingStudies.length}
            icon={Camera}
            color="bg-yellow-500"
          />
          <StatCard
            title={t.completedToday}
            value={completedToday.length}
            icon={FileImage}
            color="bg-green-500"
          />
          <StatCard
            title={t.criticalFindings}
            value={criticalFindings.length}
            icon={Zap}
            color="bg-red-500"
          />
          <StatCard
            title={t.worklistItems}
            value={studies.length}
            icon={Film}
            color="bg-blue-500"
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="worklist" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="worklist">
              <Image className="w-4 h-4 mr-2" />
              {t.imagingOrders}
            </TabsTrigger>
            <TabsTrigger value="library">
              <FileImage className="w-4 h-4 mr-2" />
              {t.studyLibrary}
            </TabsTrigger>
            <TabsTrigger value="workstation">
              <Monitor className="w-4 h-4 mr-2" />
              {t.workstation}
            </TabsTrigger>
            <TabsTrigger value="reports">
              <Film className="w-4 h-4 mr-2" />
              {t.reports}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="worklist" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Radiology Worklist</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder={t.searchStudies}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    {t.uploadImages}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredStudies.length > 0 ? (
                    filteredStudies.map((study, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            {getModalityIcon(study.modality)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{study.patientName}</h3>
                            <p className="text-sm text-gray-600">{study.studyDescription}</p>
                            <p className="text-sm text-gray-500">
                              {study.studyDate} {study.studyTime} | {study.modality} | {study.accessionNumber}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">
                                {study.imageCount} images, {study.seriesCount} series
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right space-y-1">
                            <div>{getPriorityBadge(study.priority)}</div>
                            <div>{getStatusBadge(study.status)}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewImages(study)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              {t.viewImages}
                            </Button>
                            <Button size="sm">
                              {study.status === 'reported' ? t.viewReport : t.createReport}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">{t.noStudies}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="library">
            <Card>
              <CardHeader>
                <CardTitle>{t.studyLibrary}</CardTitle>
                <CardDescription>Browse and search completed studies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Button 
                    size="lg"
                    onClick={() => navigateTo('radiology', 'studies')}
                    className="mx-auto"
                  >
                    <FileImage className="w-4 h-4 mr-2" />
                    {t('radiology.studies')}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    Manage imaging studies and DICOM files
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workstation">
            <Card>
              <CardHeader>
                <CardTitle>{t.workstation}</CardTitle>
                <CardDescription>Advanced image viewing and reporting workstation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Button 
                    size="lg"
                    onClick={() => navigateTo('radiology', 'studies')}
                    className="mx-auto"
                  >
                    <Monitor className="w-4 h-4 mr-2" />
                    {t('radiology.studies')}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    Manage imaging studies and DICOM files
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>{t.reports}</CardTitle>
                <CardDescription>Create and manage radiology reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Button 
                    size="lg"
                    onClick={() => navigateTo('reports', 'radiology')}
                    className="mx-auto"
                  >
                    <Film className="w-4 h-4 mr-2" />
                    {t('radiology.reports')}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    Radiology reports and findings
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* DICOM Viewer Modal */}
        {showDICOMViewer && selectedStudy && (
          <DICOMViewer
            imageData={null}
            patientInfo={{
              name: selectedStudy.patientName,
              id: selectedStudy.patientId,
              dateOfBirth: '1985-05-15',
              gender: 'Male'
            }}
            studyInfo={{
              studyDate: selectedStudy.studyDate,
              modality: selectedStudy.modality,
              studyDescription: selectedStudy.studyDescription,
              seriesNumber: selectedStudy.seriesCount,
              accessionNumber: selectedStudy.accessionNumber
            }}
            onClose={() => setShowDICOMViewer(false)}
            language={language}
          />
        )}
      </div>
    </div>
  );
}