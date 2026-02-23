import React, { useState, useEffect } from 'react';
import { 
  FileText, Search, Filter, Calendar, User, Eye, Edit, Trash2, Download,
  Printer, Share2, Clock, CheckCircle, AlertCircle, XCircle, PlusCircle,
  ArrowRight, ArrowLeft, MoreVertical, Settings, RefreshCw, Upload,
  Camera, Brain, Heart, Stethoscope, Zap, Bone, Save, Send, Undo2,
  FileImage, Mic, MicOff, Type, Image as ImageIcon, Table2, List,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Grid3X3, Layout, Maximize2, Minimize2
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { toast } from 'sonner@2.0.3';

interface ReportsManagementProps {
  language: 'en' | 'ar';
  userRole: string;
}

const translations = {
  en: {
    title: 'Reports Management',
    newReport: 'New Report',
    draftReports: 'Draft Reports',
    pendingReports: 'Pending Reports',
    completedReports: 'Completed Reports',
    signedReports: 'Signed Reports',
    
    // Report sections
    reportEditor: 'Report Editor',
    reportViewer: 'Report Viewer',
    reportTemplates: 'Report Templates',
    reportHistory: 'Report History',
    
    // Report status
    draft: 'Draft',
    pending: 'Pending',
    inReview: 'In Review',
    completed: 'Completed',
    signed: 'Signed',
    amended: 'Amended',
    
    // Report types
    preliminary: 'Preliminary',
    final: 'Final',
    addendum: 'Addendum',
    
    // Columns
    patientName: 'Patient Name',
    studyDate: 'Study Date',
    modality: 'Modality',
    bodyPart: 'Body Part',
    reportStatus: 'Report Status',
    reportType: 'Report Type',
    radiologist: 'Radiologist',
    createdDate: 'Created Date',
    signedDate: 'Signed Date',
    actions: 'Actions',
    
    // Editor features
    findings: 'Findings',
    impression: 'Impression',
    recommendation: 'Recommendation',
    technique: 'Technique',
    comparison: 'Comparison',
    clinicalHistory: 'Clinical History',
    
    // Actions
    viewReport: 'View Report',
    editReport: 'Edit Report',
    signReport: 'Sign Report',
    amendReport: 'Amend Report',
    deleteReport: 'Delete Report',
    duplicateReport: 'Duplicate Report',
    saveAsDraft: 'Save as Draft',
    submitForReview: 'Submit for Review',
    
    // Common
    search: 'Search',
    filter: 'Filter',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    print: 'Print',
    export: 'Export',
    share: 'Share',
    
    // Voice recognition
    startDictation: 'Start Dictation',
    stopDictation: 'Stop Dictation',
    
    // Templates
    normalTemplate: 'Normal Template',
    abnormalTemplate: 'Abnormal Template',
    customTemplate: 'Custom Template',
    
    // Messages
    reportSaved: 'Report saved successfully',
    reportSigned: 'Report signed successfully',
    reportDeleted: 'Report deleted successfully'
  },
  ar: {
    title: 'إدارة التقارير',
    newReport: 'تقرير جديد',
    draftReports: 'المسودات',
    pendingReports: 'التقارير المعلقة',
    completedReports: 'التقارير المكتملة',
    signedReports: 'التقارير الموقعة',
    
    // Report sections
    reportEditor: 'محرر التقارير',
    reportViewer: 'عارض التقارير',
    reportTemplates: 'قوالب التقارير',
    reportHistory: 'تاريخ التقارير',
    
    // Report status
    draft: 'مسودة',
    pending: 'معلق',
    inReview: 'قيد المراجعة',
    completed: 'مكتمل',
    signed: 'موقع',
    amended: 'معدل',
    
    // Report types
    preliminary: 'أولي',
    final: 'نهائي',
    addendum: 'ملحق',
    
    // Columns
    patientName: 'اسم المريض',
    studyDate: 'تاريخ الدراسة',
    modality: 'نوع الفحص',
    bodyPart: 'جزء الجسم',
    reportStatus: 'حالة التقرير',
    reportType: 'نوع التقرير',
    radiologist: 'أخصائي الأشعة',
    createdDate: 'تاريخ الإنشاء',
    signedDate: 'تاريخ التوقيع',
    actions: 'الإجراءات',
    
    // Editor features
    findings: 'النتائج',
    impression: 'الانطباع',
    recommendation: 'التوصيات',
    technique: 'التقنية',
    comparison: 'المقارنة',
    clinicalHistory: 'التاريخ المرضي',
    
    // Actions
    viewReport: 'عرض التقرير',
    editReport: 'تعديل التقرير',
    signReport: 'توقيع التقرير',
    amendReport: 'تعديل التقرير',
    deleteReport: 'حذف التقرير',
    duplicateReport: 'نسخ التقرير',
    saveAsDraft: 'حفظ كمسودة',
    submitForReview: 'إرسال للمراجعة',
    
    // Common
    search: 'بحث',
    filter: 'تصفية',
    save: 'حفظ',
    cancel: 'إلغاء',
    close: 'إغلاق',
    print: 'طباعة',
    export: 'تصدير',
    share: 'مشاركة',
    
    // Voice recognition
    startDictation: 'بدء الإملاء',
    stopDictation: 'إيقاف الإملاء',
    
    // Templates
    normalTemplate: 'قالب طبيعي',
    abnormalTemplate: 'قالب غير طبيعي',
    customTemplate: 'قالب مخصص',
    
    // Messages
    reportSaved: 'تم حفظ التقرير بنجاح',
    reportSigned: 'تم توقيع التقرير بنجاح',
    reportDeleted: 'تم حذف التقرير بنجاح'
  }
};

// Mock data for reports
const mockReports = [
  {
    id: 'RPT001',
    studyId: 'ST001',
    patientId: 'P001',
    patientName: 'أحمد محمد علي',
    studyDate: '2024-01-20',
    modality: 'CT',
    bodyPart: 'Chest',
    studyDescription: 'CT Chest with contrast',
    reportStatus: 'pending',
    reportType: 'preliminary',
    radiologist: 'د. محمد حسن',
    radiologistId: 'R001',
    createdDate: '2024-01-20',
    createdTime: '15:30:00',
    signedDate: null,
    signedTime: null,
    accessionNumber: 'ACC001',
    clinicalHistory: 'Chest pain, rule out pulmonary embolism',
    technique: 'Axial CT images of the chest were obtained with IV contrast',
    comparison: 'Previous CT chest dated 2023-12-15',
    findings: 'The lungs are clear bilaterally. No focal consolidation, pleural effusion, or pneumothorax. The heart size is normal. No pulmonary embolism is identified.',
    impression: 'Normal chest CT. No acute cardiopulmonary abnormality.',
    recommendation: 'No further imaging required at this time. Clinical correlation recommended.',
    isUrgent: false,
    lastModified: '2024-01-20T15:30:00'
  },
  {
    id: 'RPT002',
    studyId: 'ST002',
    patientId: 'P002',
    patientName: 'فاطمة علي حسن',
    studyDate: '2024-01-20',
    modality: 'MRI',
    bodyPart: 'Brain',
    studyDescription: 'MRI Brain without contrast',
    reportStatus: 'draft',
    reportType: 'preliminary',
    radiologist: 'د. ليلى إبراهيم',
    radiologistId: 'R002',
    createdDate: '2024-01-20',
    createdTime: '16:15:00',
    signedDate: null,
    signedTime: null,
    accessionNumber: 'ACC002',
    clinicalHistory: 'Severe headaches, rule out intracranial pathology',
    technique: 'Sagittal T1, axial T2, FLAIR, and DWI sequences were performed',
    comparison: 'None available',
    findings: 'The brain parenchyma shows normal signal intensity. No focal lesions identified. Ventricular system is normal in size and configuration.',
    impression: 'Normal brain MRI.',
    recommendation: 'Follow up clinically. Consider repeat imaging if symptoms persist.',
    isUrgent: true,
    lastModified: '2024-01-20T16:15:00'
  },
  {
    id: 'RPT003',
    studyId: 'ST003',
    patientId: 'P003',
    patientName: 'محمد سالم',
    studyDate: '2024-01-19',
    modality: 'X-Ray',
    bodyPart: 'Spine',
    studyDescription: 'X-Ray Lumbar Spine',
    reportStatus: 'signed',
    reportType: 'final',
    radiologist: 'د. عمر السعيد',
    radiologistId: 'R003',
    createdDate: '2024-01-19',
    createdTime: '17:45:00',
    signedDate: '2024-01-19',
    signedTime: '18:00:00',
    accessionNumber: 'ACC003',
    clinicalHistory: 'Lower back pain, rule out disc herniation',
    technique: 'AP and lateral views of the lumbar spine',
    comparison: 'Previous lumbar spine X-ray dated 2023-10-20',
    findings: 'Normal alignment of lumbar vertebrae. No acute fracture or dislocation. Mild degenerative changes at L4-L5 level.',
    impression: 'Mild degenerative changes at L4-L5. No acute abnormality.',
    recommendation: 'Conservative management. Consider MRI if symptoms persist.',
    isUrgent: false,
    lastModified: '2024-01-19T18:00:00'
  }
];

// Report templates
const reportTemplates = {
  normal: {
    technique: 'Standard imaging protocol was performed',
    findings: 'Normal study. No acute abnormalities identified.',
    impression: 'Normal examination.',
    recommendation: 'No further imaging required at this time. Clinical correlation recommended.'
  },
  abnormal: {
    technique: 'Standard imaging protocol was performed',
    findings: 'Abnormal findings identified as detailed below:',
    impression: 'Abnormal examination with findings as described.',
    recommendation: 'Clinical correlation and follow-up as clinically indicated.'
  }
};

export default function ReportsManagement({ language, userRole }: ReportsManagementProps) {
  const [activeTab, setActiveTab] = useState('pending');
  const [reports, setReports] = useState(mockReports);
  const [filteredReports, setFilteredReports] = useState(mockReports);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalityFilter, setModalityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [radiologistFilter, setRadiologistFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDictating, setIsDictating] = useState(false);
  const [reportViewMode, setReportViewMode] = useState<'viewer' | 'editor'>('viewer');

  const t = translations[language];

  // Filter reports based on tab and filters
  useEffect(() => {
    let filtered = reports.filter(report => {
      // Tab filtering
      if (activeTab === 'draft' && report.reportStatus !== 'draft') return false;
      if (activeTab === 'pending' && report.reportStatus !== 'pending') return false;
      if (activeTab === 'completed' && !['completed', 'signed'].includes(report.reportStatus)) return false;
      if (activeTab === 'signed' && report.reportStatus !== 'signed') return false;

      // Search filtering
      const matchesSearch = report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           report.accessionNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Other filters
      const matchesModality = modalityFilter === 'all' || report.modality === modalityFilter;
      const matchesStatus = statusFilter === 'all' || report.reportStatus === statusFilter;
      const matchesRadiologist = radiologistFilter === 'all' || report.radiologistId === radiologistFilter;

      return matchesSearch && matchesModality && matchesStatus && matchesRadiologist;
    });

    setFilteredReports(filtered);
  }, [activeTab, reports, searchTerm, modalityFilter, statusFilter, radiologistFilter]);

  // Get statistics
  const stats = {
    draft: reports.filter(r => r.reportStatus === 'draft').length,
    pending: reports.filter(r => r.reportStatus === 'pending').length,
    completed: reports.filter(r => ['completed', 'signed'].includes(r.reportStatus)).length,
    signed: reports.filter(r => r.reportStatus === 'signed').length
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', label: t.draft, icon: Edit },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: t.pending, icon: Clock },
      inReview: { color: 'bg-blue-100 text-blue-800', label: t.inReview, icon: Eye },
      completed: { color: 'bg-green-100 text-green-800', label: t.completed, icon: CheckCircle },
      signed: { color: 'bg-purple-100 text-purple-800', label: t.signed, icon: CheckCircle },
      amended: { color: 'bg-orange-100 text-orange-800', label: t.amended, icon: Edit }
    };

    const config = statusConfig[status] || statusConfig.draft;
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getReportTypeBadge = (type: string) => {
    const typeConfig = {
      preliminary: { color: 'bg-blue-100 text-blue-800', label: t.preliminary },
      final: { color: 'bg-green-100 text-green-800', label: t.final },
      addendum: { color: 'bg-orange-100 text-orange-800', label: t.addendum }
    };

    const config = typeConfig[type] || typeConfig.preliminary;
    
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

  const handleStatusChange = (reportId: string, newStatus: string) => {
    setReports(prev => 
      prev.map(report => 
        report.id === reportId 
          ? { 
              ...report, 
              reportStatus: newStatus,
              signedDate: newStatus === 'signed' ? new Date().toISOString().split('T')[0] : report.signedDate,
              signedTime: newStatus === 'signed' ? new Date().toTimeString().split(' ')[0] : report.signedTime,
              lastModified: new Date().toISOString()
            }
          : report
      )
    );

    // Show appropriate toast message
    switch (newStatus) {
      case 'signed':
        toast.success(t.reportSigned);
        break;
      case 'draft':
        toast.success(t.reportSaved);
        break;
      default:
        toast.success('تم تحديث حالة التقرير');
    }
  };

  const handleDeleteReport = (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
    toast.success(t.reportDeleted);
  };

  const applyTemplate = (templateType: string) => {
    if (!selectedReport) return;
    
    const template = reportTemplates[templateType];
    if (template) {
      setSelectedReport(prev => ({
        ...prev,
        ...template
      }));
    }
  };

  const toggleDictation = () => {
    setIsDictating(!isDictating);
    if (!isDictating) {
      toast.success('بدء الإملاء الصوتي');
    } else {
      toast.success('إيقاف الإملاء الصوتي');
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

  // Report Editor Component
  const ReportEditor = ({ report, onSave, onCancel }: any) => (
    <div className="space-y-6">
      {/* Editor Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={isDictating ? 'default' : 'outline'}
                onClick={toggleDictation}
              >
                {isDictating ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                {isDictating ? t.stopDictation : t.startDictation}
              </Button>
              
              <Separator orientation="vertical" className="h-6" />
              
              <Button size="sm" variant="outline">
                <Bold className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Italic className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Underline className="w-4 h-4" />
              </Button>
              
              <Separator orientation="vertical" className="h-6" />
              
              <Button size="sm" variant="outline">
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline">
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline">
                <AlignRight className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    القوالب
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => applyTemplate('normal')}>
                    {t.normalTemplate}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => applyTemplate('abnormal')}>
                    {t.abnormalTemplate}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {t.customTemplate}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button size="sm" variant="outline">
                <Save className="w-4 h-4 mr-2" />
                {t.saveAsDraft}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient and Study Info */}
        <Card>
          <CardHeader>
            <CardTitle>معلومات المريض والدراسة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>اسم المريض</Label>
                <p className="font-medium">{report.patientName}</p>
              </div>
              <div>
                <Label>معرف المريض</Label>
                <p className="font-medium">{report.patientId}</p>
              </div>
              <div>
                <Label>تاريخ الدراسة</Label>
                <p className="font-medium">{report.studyDate}</p>
              </div>
              <div>
                <Label>نوع الفحص</Label>
                <div className="flex items-center gap-2">
                  {getModalityIcon(report.modality)}
                  <span>{report.modality}</span>
                </div>
              </div>
            </div>
            <div>
              <Label>وصف الدراسة</Label>
              <p className="font-medium">{report.studyDescription}</p>
            </div>
            <div>
              <Label>التاريخ المرضي</Label>
              <Textarea 
                value={report.clinicalHistory}
                onChange={(e) => setSelectedReport(prev => ({ ...prev, clinicalHistory: e.target.value }))}
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Report Status */}
        <Card>
          <CardHeader>
            <CardTitle>حالة التقرير</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>حالة التقرير</Label>
                <div className="mt-2">{getStatusBadge(report.reportStatus)}</div>
              </div>
              <div>
                <Label>نوع التقرير</Label>
                <div className="mt-2">{getReportTypeBadge(report.reportType)}</div>
              </div>
              <div>
                <Label>أخصائي الأشعة</Label>
                <p className="font-medium">{report.radiologist}</p>
              </div>
              <div>
                <Label>تاريخ الإنشاء</Label>
                <p className="font-medium">{report.createdDate}</p>
              </div>
            </div>
            {report.isUrgent && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-800 font-medium">تقرير عاجل</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Report Sections */}
      <Tabs defaultValue="technique" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="technique">التقنية</TabsTrigger>
          <TabsTrigger value="comparison">المقارنة</TabsTrigger>
          <TabsTrigger value="findings">النتائج</TabsTrigger>
          <TabsTrigger value="impression">الانطباع</TabsTrigger>
          <TabsTrigger value="recommendation">التوصيات</TabsTrigger>
        </TabsList>

        <TabsContent value="technique">
          <Card>
            <CardHeader>
              <CardTitle>{t.technique}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={report.technique}
                onChange={(e) => setSelectedReport(prev => ({ ...prev, technique: e.target.value }))}
                className="min-h-[200px]"
                placeholder="وصف التقنية المستخدمة في الفحص..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>{t.comparison}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={report.comparison}
                onChange={(e) => setSelectedReport(prev => ({ ...prev, comparison: e.target.value }))}
                className="min-h-[200px]"
                placeholder="مقارنة مع الفحوصات السابقة..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="findings">
          <Card>
            <CardHeader>
              <CardTitle>{t.findings}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={report.findings}
                onChange={(e) => setSelectedReport(prev => ({ ...prev, findings: e.target.value }))}
                className="min-h-[300px]"
                placeholder="وصف تفصيلي للنتائج والموجودات..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impression">
          <Card>
            <CardHeader>
              <CardTitle>{t.impression}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={report.impression}
                onChange={(e) => setSelectedReport(prev => ({ ...prev, impression: e.target.value }))}
                className="min-h-[200px]"
                placeholder="الانطباع النهائي والتشخيص..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendation">
          <Card>
            <CardHeader>
              <CardTitle>{t.recommendation}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={report.recommendation}
                onChange={(e) => setSelectedReport(prev => ({ ...prev, recommendation: e.target.value }))}
                className="min-h-[200px]"
                placeholder="التوصيات والخطوات التالية..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          {t.cancel}
        </Button>
        <Button variant="outline" onClick={() => handleStatusChange(report.id, 'draft')}>
          {t.saveAsDraft}
        </Button>
        <Button onClick={() => handleStatusChange(report.id, 'pending')}>
          {t.submitForReview}
        </Button>
      </div>
    </div>
  );

  // Report Viewer Component
  const ReportViewer = ({ report }: any) => (
    <div className="space-y-6">
      {/* Report Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                تقرير الأشعة
              </CardTitle>
              <CardDescription>{report.studyDescription}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(report.reportStatus)}
              {getReportTypeBadge(report.reportType)}
              {report.isUrgent && (
                <Badge className="bg-red-100 text-red-800">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  عاجل
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">المريض</Label>
              <p className="font-medium">{report.patientName}</p>
              <p className="text-sm text-muted-foreground">{report.patientId}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">تاريخ الفحص</Label>
              <p className="font-medium">{report.studyDate}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">نوع الفحص</Label>
              <div className="flex items-center gap-2">
                {getModalityIcon(report.modality)}
                <span className="font-medium">{report.modality}</span>
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">أخصائي الأشعة</Label>
              <p className="font-medium">{report.radiologist}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>التاريخ المرضي</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{report.clinicalHistory}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>التقنية المستخدمة</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{report.technique}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>المقارنة</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{report.comparison}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>النتائج</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{report.findings}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الانطباع</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{report.impression}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>التوصيات</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{report.recommendation}</p>
          </CardContent>
        </Card>
      </div>

      {/* Signature Section */}
      {report.reportStatus === 'signed' && (
        <Card>
          <CardHeader>
            <CardTitle>التوقيع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{report.radiologist}</p>
                <p className="text-sm text-muted-foreground">أخصائي الأشعة</p>
              </div>
              <div className="text-right">
                <p className="font-medium">تم التوقيع في: {report.signedDate}</p>
                <p className="text-sm text-muted-foreground">{report.signedTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t.title}</h2>
          <p className="text-muted-foreground">{filteredReports.length} تقرير</p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            {t.newReport}
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            استيراد قوالب
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title={t.draftReports}
          value={stats.draft}
          icon={Edit}
          color="bg-gray-500"
          trend={-2.1}
        />
        <MetricCard
          title={t.pendingReports}
          value={stats.pending}
          icon={Clock}
          color="bg-yellow-500"
          trend={8.5}
        />
        <MetricCard
          title={t.completedReports}
          value={stats.completed}
          icon={CheckCircle}
          color="bg-green-500"
          trend={15.3}
        />
        <MetricCard
          title={t.signedReports}
          value={stats.signed}
          icon={FileText}
          color="bg-purple-500"
          trend={12.7}
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
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="draft">{t.draft}</SelectItem>
                  <SelectItem value="pending">{t.pending}</SelectItem>
                  <SelectItem value="completed">{t.completed}</SelectItem>
                  <SelectItem value="signed">{t.signed}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={radiologistFilter} onValueChange={setRadiologistFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأطباء</SelectItem>
                  <SelectItem value="R001">د. محمد حسن</SelectItem>
                  <SelectItem value="R002">د. ليلى إبراهيم</SelectItem>
                  <SelectItem value="R003">د. عمر السعيد</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="draft" className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            {t.draftReports}
            <Badge variant="secondary">{stats.draft}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {t.pendingReports}
            <Badge variant="secondary">{stats.pending}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {t.completedReports}
            <Badge variant="secondary">{stats.completed}</Badge>
          </TabsTrigger>
          <TabsTrigger value="signed" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {t.signedReports}
            <Badge variant="secondary">{stats.signed}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.patientName}</TableHead>
                    <TableHead>{t.studyDate}</TableHead>
                    <TableHead>{t.modality}</TableHead>
                    <TableHead>{t.bodyPart}</TableHead>
                    <TableHead>{t.reportStatus}</TableHead>
                    <TableHead>{t.reportType}</TableHead>
                    <TableHead>{t.radiologist}</TableHead>
                    <TableHead>{t.createdDate}</TableHead>
                    <TableHead>{t.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {report.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{report.patientName}</p>
                            <p className="text-sm text-muted-foreground">{report.patientId}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{report.studyDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getModalityIcon(report.modality)}
                          {report.modality}
                        </div>
                      </TableCell>
                      <TableCell>{report.bodyPart}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(report.reportStatus)}
                          {report.isUrgent && (
                            <Badge className="bg-red-100 text-red-800">
                              عاجل
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getReportTypeBadge(report.reportType)}</TableCell>
                      <TableCell>{report.radiologist}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{report.createdDate}</p>
                          <p className="text-sm text-muted-foreground">{report.createdTime}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedReport(report);
                              setReportViewMode('viewer');
                              setIsEditing(false);
                              setIsReportDialogOpen(true);
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
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedReport(report);
                                  setReportViewMode('editor');
                                  setIsEditing(true);
                                  setIsReportDialogOpen(true);
                                }}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                {t.editReport}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(report.id, 'signed')}
                                disabled={report.reportStatus === 'signed'}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                {t.signReport}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" />
                                {t.export}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Printer className="w-4 h-4 mr-2" />
                                {t.print}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share2 className="w-4 h-4 mr-2" />
                                {t.share}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteReport(report.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                {t.deleteReport}
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

      {/* Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>
                  {isEditing ? t.reportEditor : t.reportViewer}
                </DialogTitle>
                <DialogDescription>
                  {selectedReport?.patientName} - {selectedReport?.studyDescription}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={reportViewMode === 'viewer' ? 'default' : 'outline'}
                  onClick={() => {
                    setReportViewMode('viewer');
                    setIsEditing(false);
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  عارض
                </Button>
                <Button
                  size="sm"
                  variant={reportViewMode === 'editor' ? 'default' : 'outline'}
                  onClick={() => {
                    setReportViewMode('editor');
                    setIsEditing(true);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  محرر
                </Button>
                <Button size="sm" variant="outline">
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          {selectedReport && (
            reportViewMode === 'editor' ? (
              <ReportEditor 
                report={selectedReport}
                onSave={() => {
                  setIsReportDialogOpen(false);
                  toast.success(t.reportSaved);
                }}
                onCancel={() => setIsReportDialogOpen(false)}
              />
            ) : (
              <ReportViewer report={selectedReport} />
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}