import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Eye, 
  Download, 
  Upload, 
  Search, 
  Filter,
  Calendar,
  User,
  FileImage,
  Monitor,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Move,
  Maximize,
  Minimize,
  Settings,
  Share2,
  Printer,
  Save,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Grid3X3,
  Layers,
  Contrast,
  Sun,
  Moon,
  Ruler,
  CircleDot,
  Square,
  ArrowRight,
  Type,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Stethoscope,
  Brain,
  Heart,
  Bone,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { toast } from 'sonner';
import StudiesManagement from './StudiesManagement';
import WorklistManagement from './WorklistManagement';
import ReportsManagement from './ReportsManagement';
import { useLanguage } from '../../services/LanguageService';
import firebaseService from '../../services/FirebaseService';

interface RadiologyManagementProps {
  userRole: string;
}

// Mock data
const mockDashboardData = {
  totalStudies: 1247,
  pendingReports: 23,
  completedToday: 45,
  criticalFindings: 3,
  modalityData: [
    { modality: 'X-Ray', count: 450, percentage: 36 },
    { modality: 'CT', count: 320, percentage: 26 },
    { modality: 'MRI', count: 240, percentage: 19 },
    { modality: 'Ultrasound', count: 180, percentage: 14 },
    { modality: 'Mammography', count: 57, percentage: 5 }
  ]
};

const mockStudies = [
  {
    id: 'ST001',
    patientId: 'P001',
    patientName: 'أحمد محمد علي',
    studyDate: '2024-01-20',
    modality: 'CT',
    bodyPart: 'Chest',
    description: 'CT Chest with contrast',
    status: 'completed',
    images: 45,
    reportStatus: 'pending',
    priority: 'routine',
    technician: 'سارة أحمد',
    radiologist: 'د. محمد حسن'
  },
  {
    id: 'ST002',
    patientId: 'P002',
    patientName: 'فاطمة علي حسن',
    studyDate: '2024-01-20',
    modality: 'MRI',
    bodyPart: 'Brain',
    description: 'MRI Brain without contrast',
    status: 'inProgress',
    images: 0,
    reportStatus: 'not_started',
    priority: 'urgent',
    technician: 'أحمد محمود',
    radiologist: 'د. ليلى إبراهيم'
  },
  {
    id: 'ST003',
    patientId: 'P003',
    patientName: 'محمد سالم',
    studyDate: '2024-01-19',
    modality: 'X-Ray',
    bodyPart: 'Spine',
    description: 'X-Ray Lumbar Spine',
    status: 'reported',
    images: 2,
    reportStatus: 'completed',
    priority: 'routine',
    technician: 'نور الدين',
    radiologist: 'د. عمر السعيد'
  }
];

const mockImages = [
  { id: 1, instanceNumber: 1, url: '/placeholder-dicom-1.jpg' },
  { id: 2, instanceNumber: 2, url: '/placeholder-dicom-2.jpg' },
  { id: 3, instanceNumber: 3, url: '/placeholder-dicom-3.jpg' },
  { id: 4, instanceNumber: 4, url: '/placeholder-dicom-4.jpg' }
];

export default function RadiologyManagement({ userRole }: RadiologyManagementProps) {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalityFilter, setModalityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(mockDashboardData);

  // Load studies from Firebase
  useEffect(() => {
    loadStudies();
    
    // Subscribe to real-time updates
    const unsubscribe = firebaseService.subscribeToCollection('radiologyStudies', (updatedStudies) => {
      setStudies(updatedStudies);
      updateDashboardStats(updatedStudies);
    });
    
    return () => unsubscribe();
  }, []);

  const loadStudies = async () => {
    setLoading(true);
    try {
      const studiesData = await firebaseService.getRadiologyStudies();
      setStudies(studiesData);
      updateDashboardStats(studiesData);
    } catch (error) {
      console.error('Error loading radiology studies:', error);
      toast.error(language === 'ar' ? 'خطأ في تحميل البيانات' : 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const updateDashboardStats = (studiesData: any[]) => {
    const totalStudies = studiesData.length;
    const pendingReports = studiesData.filter(s => s.reportStatus === 'pending').length;
    const completedToday = studiesData.filter(s => {
      const today = new Date().toISOString().split('T')[0];
      return s.studyDate === today && s.status === 'completed';
    }).length;
    const criticalFindings = studiesData.filter(s => s.priority === 'stat').length;

    // Calculate modality breakdown
    const modalityCounts: any = {};
    studiesData.forEach(study => {
      modalityCounts[study.modality] = (modalityCounts[study.modality] || 0) + 1;
    });

    const modalityData = Object.entries(modalityCounts).map(([modality, count]: [string, any]) => ({
      modality,
      count,
      percentage: Math.round((count / totalStudies) * 100)
    }));

    setDashboardData({
      totalStudies,
      pendingReports,
      completedToday,
      criticalFindings,
      modalityData
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { color: 'bg-blue-100 text-blue-800', label: t('radiology.scheduled') },
      inProgress: { color: 'bg-yellow-100 text-yellow-800', label: t('radiology.inProgress') },
      completed: { color: 'bg-green-100 text-green-800', label: t('radiology.completed') },
      reported: { color: 'bg-purple-100 text-purple-800', label: t('radiology.reported') },
      cancelled: { color: 'bg-red-100 text-red-800', label: t('radiology.cancelled') }
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
      routine: { color: 'bg-gray-100 text-gray-800', label: t('radiology.routine') },
      urgent: { color: 'bg-orange-100 text-orange-800', label: t('radiology.urgent') },
      stat: { color: 'bg-red-100 text-red-800', label: t('radiology.stat') }
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

  const filteredStudies = studies.filter(study => {
    const matchesSearch = study.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         study.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         study.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModality = modalityFilter === 'all' || study.modality === modalityFilter;
    const matchesStatus = statusFilter === 'all' || study.status === statusFilter;
    return matchesSearch && matchesModality && matchesStatus;
  });

  const MetricCard = ({ title, value, change, icon: Icon, color }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change > 0 ? '+' : ''}{change}% {t('radiology.fromYesterday')}
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('radiology.title')}</h2>
        <div className="flex items-center gap-2">
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            {t('common.upload')}
          </Button>
          <Button variant="outline">
            <PlusCircle className="w-4 h-4 mr-2" />
            {t('radiology.newStudy')}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">{t('radiology.dashboard')}</TabsTrigger>
          <TabsTrigger value="studies">{t('radiology.studies')}</TabsTrigger>
          <TabsTrigger value="worklist">{t('radiology.worklist')}</TabsTrigger>
          <TabsTrigger value="reports">{t('radiology.reports')}</TabsTrigger>
          <TabsTrigger value="viewer">{t('radiology.viewer')}</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard
              title={t('radiology.totalStudies')}
              value={dashboardData.totalStudies.toLocaleString()}
              change={5.2}
              icon={FileImage}
              color="bg-blue-500"
            />
            <MetricCard
              title={t('radiology.pendingReports')}
              value={dashboardData.pendingReports}
              change={-12.5}
              icon={Clock}
              color="bg-yellow-500"
            />
            <MetricCard
              title={t('radiology.completedToday')}
              value={dashboardData.completedToday}
              change={18.7}
              icon={CheckCircle}
              color="bg-green-500"
            />
            <MetricCard
              title={t('radiology.criticalFindings')}
              value={dashboardData.criticalFindings}
              change={0}
              icon={AlertCircle}
              color="bg-red-500"
            />
          </div>

          {/* Modality Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('radiology.modalityBreakdown')}</CardTitle>
                <CardDescription>{t('radiology.modalityDistribution')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.modalityData.map((item) => (
                    <div key={item.modality} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getModalityIcon(item.modality)}
                        <span>{item.modality}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('radiology.recentStudies')}</CardTitle>
                <CardDescription>{t('radiology.latestAddedStudies')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studies.slice(0, 5).map((study) => (
                    <div key={study.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getModalityIcon(study.modality)}
                        <div>
                          <p className="font-medium">{study.patientName}</p>
                          <p className="text-sm text-muted-foreground">{study.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(study.status)}
                        <p className="text-sm text-muted-foreground mt-1">{study.studyDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="studies" className="space-y-6">
          <StudiesManagement language={language as 'en' | 'ar'} userRole={userRole} />
        </TabsContent>

        <TabsContent value="worklist" className="space-y-6">
          <WorklistManagement language={language as 'en' | 'ar'} userRole={userRole} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <ReportsManagement language={language as 'en' | 'ar'} userRole={userRole} />
        </TabsContent>

        <TabsContent value="viewer" className="space-y-6">
          <Card>
            <CardContent className="p-12 text-center">
              <Monitor className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">{t('radiology.advancedViewer')}</h3>
              <p className="text-muted-foreground mb-4">
                {t('radiology.selectStudyToView')}
              </p>
              <Button 
                onClick={() => setActiveTab('studies')}
                className="mr-2"
              >
                {t('radiology.goToStudies')}
              </Button>
              <Button 
                variant="outline"
                onClick={() => setActiveTab('worklist')}
              >
                {t('radiology.goToWorklist')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* DICOM Viewer Dialog */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{t('radiology.viewer')} - {selectedStudy?.patientName}</DialogTitle>
            <DialogDescription>{selectedStudy?.description}</DialogDescription>
          </DialogHeader>
          <DICOMViewer 
            imageData={null}
            patientInfo={{
              name: selectedStudy?.patientName,
              id: selectedStudy?.patientId,
              dateOfBirth: '1979-01-20',
              gender: 'M'
            }}
            studyInfo={{
              studyDate: selectedStudy?.studyDate,
              modality: selectedStudy?.modality,
              studyDescription: selectedStudy?.description,
              seriesNumber: '1'
            }}
            onClose={() => setIsViewerOpen(false)}
            language={language}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// DICOM Viewer Component
function DICOMViewer({ study, isDialog = false }: any) {
  const { t, language } = useLanguage();
  const [viewerTools, setViewerTools] = useState({
    zoom: 100,
    brightness: 50,
    contrast: 50,
    rotation: 0,
    pan: { x: 0, y: 0 },
    activeTool: 'pan',
    windowLevel: { width: 400, level: 40 },
    measurements: [],
    annotations: []
  });

  const [viewMode, setViewMode] = useState('single'); // single, grid, stack
  const [currentImage, setCurrentImage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const tools = [
    { id: 'pan', icon: Move, label: t('radiology.pan') },
    { id: 'zoom', icon: ZoomIn, label: t('radiology.zoom') },
    { id: 'rotate', icon: RotateCw, label: t('radiology.rotate') },
    { id: 'distance', icon: Ruler, label: t('radiology.distance') },
    { id: 'angle', icon: CircleDot, label: t('radiology.angle') },
    { id: 'rectangle', icon: Square, label: t('radiology.rectangle') },
    { id: 'circle', icon: CircleDot, label: t('radiology.circle') },
    { id: 'arrow', icon: ArrowRight, label: t('radiology.arrow') },
    { id: 'text', icon: Type, label: t('radiology.text') }
  ];

  const handleToolSelect = (toolId: string) => {
    setViewerTools(prev => ({ ...prev, activeTool: toolId }));
  };

  const handleZoomChange = (value: number[]) => {
    setViewerTools(prev => ({ ...prev, zoom: value[0] }));
  };

  const handleBrightnessChange = (value: number[]) => {
    setViewerTools(prev => ({ ...prev, brightness: value[0] }));
  };

  const handleContrastChange = (value: number[]) => {
    setViewerTools(prev => ({ ...prev, contrast: value[0] }));
  };

  const handleImageNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentImage > 0) {
      setCurrentImage(currentImage - 1);
    } else if (direction === 'next' && currentImage < mockImages.length - 1) {
      setCurrentImage(currentImage + 1);
    }
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && mockImages.length > 1) {
      interval = setInterval(() => {
        setCurrentImage(prev => (prev + 1) % mockImages.length);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, mockImages.length]);

  if (!study) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileImage className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">{t('radiology.noStudySelected')}</p>
          <p className="text-muted-foreground">{t('radiology.selectStudyFromList')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`flex ${isDialog ? 'h-[70vh]' : 'h-screen'} bg-black text-white`}>
      {/* Left Toolbar */}
      <div className="w-16 bg-gray-900 flex flex-col items-center py-4 space-y-2">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            size="sm"
            variant={viewerTools.activeTool === tool.id ? 'default' : 'ghost'}
            className="w-12 h-12 p-0"
            onClick={() => handleToolSelect(tool.id)}
            title={tool.label}
          >
            <tool.icon className="w-5 h-5" />
          </Button>
        ))}
      </div>

      {/* Main Viewer Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Controls */}
        <div className="h-12 bg-gray-800 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={() => handleImageNavigation('prev')}>
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={togglePlayback}>
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleImageNavigation('next')}>
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
            
            <span className="text-sm">
              {currentImage + 1} / {mockImages.length}
            </span>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={viewMode === 'single' ? 'default' : 'ghost'}
                onClick={() => setViewMode('single')}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'stack' ? 'default' : 'ghost'}
                onClick={() => setViewMode('stack')}
              >
                <Layers className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button size="sm" variant="ghost">
              <Save className="w-4 h-4 mr-2" />
              {t('common.save')}
            </Button>
            <Button size="sm" variant="ghost">
              <Printer className="w-4 h-4 mr-2" />
              {t('common.print')}
            </Button>
            <Button size="sm" variant="ghost">
              <Share2 className="w-4 h-4 mr-2" />
              {t('common.share')}
            </Button>
          </div>
        </div>

        {/* Viewer Canvas */}
        <div className="flex-1 relative bg-black overflow-hidden">
          {viewMode === 'single' && (
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={mockImages[currentImage]?.url}
                alt={`Image ${currentImage + 1}`}
                className="max-w-full max-h-full object-contain"
                style={{
                  transform: `scale(${viewerTools.zoom / 100}) rotate(${viewerTools.rotation}deg)`,
                  filter: `brightness(${viewerTools.brightness / 50}) contrast(${viewerTools.contrast / 50})`
                }}
              />
            </div>
          )}

          {viewMode === 'grid' && (
            <div className="grid grid-cols-4 gap-2 p-4 h-full overflow-auto">
              {mockImages.map((image, index) => (
                <div
                  key={image.id}
                  className={`aspect-square border-2 cursor-pointer ${
                    index === currentImage ? 'border-blue-400' : 'border-gray-600'
                  }`}
                  onClick={() => setCurrentImage(index)}
                >
                  <img
                    src={image.url}
                    alt={`Image ${image.instanceNumber}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Overlay Information */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-75 p-3 rounded">
            <p className="text-sm">{study.patientName}</p>
            <p className="text-xs text-gray-300">{study.description}</p>
            <p className="text-xs text-gray-300">{study.studyDate}</p>
          </div>

          <div className="absolute top-4 right-4 bg-black bg-opacity-75 p-3 rounded">
            <p className="text-xs text-gray-300">WL: {viewerTools.windowLevel.level}</p>
            <p className="text-xs text-gray-300">WW: {viewerTools.windowLevel.width}</p>
            <p className="text-xs text-gray-300">Zoom: {viewerTools.zoom}%</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-64 bg-gray-900 p-4 space-y-6">
        {/* Image Controls */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">{t('radiology.imageControl')}</h3>
          
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-gray-300">{t('radiology.zoom')}</Label>
              <Slider
                value={[viewerTools.zoom]}
                onValueChange={handleZoomChange}
                min={25}
                max={400}
                step={25}
                className="mt-1"
              />
              <span className="text-xs text-gray-400">{viewerTools.zoom}%</span>
            </div>

            <div>
              <Label className="text-xs text-gray-300">{t('radiology.brightness')}</Label>
              <Slider
                value={[viewerTools.brightness]}
                onValueChange={handleBrightnessChange}
                min={0}
                max={100}
                step={5}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs text-gray-300">{t('radiology.contrast')}</Label>
              <Slider
                value={[viewerTools.contrast]}
                onValueChange={handleContrastChange}
                min={0}
                max={100}
                step={5}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Window/Level */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">{t('radiology.windowLevel')}</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline">
              Soft Tissue
            </Button>
            <Button size="sm" variant="outline">
              Bone
            </Button>
            <Button size="sm" variant="outline">
              Lung
            </Button>
            <Button size="sm" variant="outline">
              Brain
            </Button>
          </div>
        </div>

        {/* Measurements */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">{t('radiology.measurements')}</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Distance 1:</span>
              <span>12.5 mm</span>
            </div>
            <div className="flex justify-between">
              <span>Angle 1:</span>
              <span>45°</span>
            </div>
            <div className="flex justify-between">
              <span>Area 1:</span>
              <span>156 mm²</span>
            </div>
          </div>
        </div>

        {/* Study Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">{t('radiology.studyInfo')}</h3>
          <div className="space-y-2 text-xs">
            <div>
              <p className="text-gray-400">{t('radiology.patient')}:</p>
              <p>{study.patientName}</p>
            </div>
            <div>
              <p className="text-gray-400">{t('radiology.date')}:</p>
              <p>{study.studyDate}</p>
            </div>
            <div>
              <p className="text-gray-400">{t('radiology.type')}:</p>
              <p>{study.modality}</p>
            </div>
            <div>
              <p className="text-gray-400">{t('radiology.part')}:</p>
              <p>{study.bodyPart}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}