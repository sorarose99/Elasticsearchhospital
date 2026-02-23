import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { 
  Stethoscope, User, MapPin, Calendar, Clock, Heart,
  Activity, AlertTriangle, CheckCircle2, XCircle,
  Plus, Edit, Trash2, Save, X, Eye, FileText,
  Pill, Users, Bell, Target, TrendingUp, TrendingDown,
  Shield, Star, ChevronRight, BarChart3, Timer,
  ClipboardList, UserCheck, Award, Briefcase
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { motion, AnimatePresence } from 'motion/react';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  roomNumber: string;
  bedNumber: string;
  admissionDate: string;
  condition: 'stable' | 'critical' | 'improving' | 'declining' | 'monitoring';
  careLevel: 'intensive' | 'moderate' | 'minimal';
  allergies: string[];
  medications: string[];
  diagnosis: string;
  attendingPhysician: string;
  primaryNurse: string;
  lastAssessment: string;
  nextAssessment: string;
  vitalSignsFrequency: number; // hours
  notes: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
  };
  flags: string[];
  riskScore: number; // 1-10
}

interface CareTask {
  id: string;
  patientId: string;
  type: 'assessment' | 'medication' | 'vital_signs' | 'documentation' | 'education' | 'therapy';
  title: string;
  description: string;
  frequency: string;
  lastCompleted?: string;
  nextDue: string;
  assignedNurse: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  estimatedDuration: number; // minutes
  notes: string;
}

interface NursingAssessment {
  id: string;
  patientId: string;
  date: string;
  assessmentType: 'admission' | 'routine' | 'discharge' | 'emergency';
  generalCondition: string;
  mentalStatus: string;
  mobility: string;
  skinCondition: string;
  nutrition: string;
  pain: number;
  sleepPattern: string;
  socialSupport: string;
  nursingDiagnoses: string[];
  carePlans: string[];
  goals: string[];
  interventions: string[];
  evaluations: string[];
  nurseSignature: string;
  reviewed: boolean;
}

interface CareMetrics {
  totalPatients: number;
  criticalPatients: number;
  overdueTasks: number;
  completedAssessments: number;
  averageRiskScore: number;
  nurseWorkload: number;
  satisfactionScore: number;
  qualityIndicators: {
    medicationErrors: number;
    fallIncidents: number;
    pressureUlcers: number;
    infections: number;
  };
}

export default function PatientCareSystem() {
  const { t, isRTL } = useLanguage();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [careTasks, setCareTasks] = useState<CareTask[]>([]);
  const [assessments, setAssessments] = useState<NursingAssessment[]>([]);
  const [metrics, setMetrics] = useState<CareMetrics | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCondition, setFilterCondition] = useState('all');
  const [filterCareLevel, setFilterCareLevel] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isPatientDialogOpen, setIsPatientDialogOpen] = useState(false);
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false);

  useEffect(() => {
    loadPatientData();
  }, []);

  const loadPatientData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPatients: Patient[] = [
        {
          id: 'P001',
          name: 'أحمد محمد علي',
          age: 45,
          gender: 'male',
          roomNumber: '201',
          bedNumber: 'A',
          admissionDate: '2024-01-15',
          condition: 'stable',
          careLevel: 'moderate',
          allergies: ['البنسلين', 'الأسبرين'],
          medications: ['ليسينوبريل 10mg', 'ميتفورمين 500mg', 'أتورفاستاتين 20mg'],
          diagnosis: 'ارتفاع ضغط الدم، السكري النوع الثاني',
          attendingPhysician: 'د. سعد الأحمد',
          primaryNurse: 'سارة محمد',
          lastAssessment: '2024-01-16T08:00:00',
          nextAssessment: '2024-01-16T20:00:00',
          vitalSignsFrequency: 4,
          notes: 'يحتاج مراقبة مستوى السكر كل 6 ساعات',
          emergencyContact: {
            name: 'فاطمة علي',
            relationship: 'زوجة',
            phone: '+966501234567'
          },
          insurance: {
            provider: 'شركة التأمين الطبي',
            policyNumber: 'INS123456',
            expiryDate: '2024-12-31'
          },
          flags: ['سكري', 'ضغط'],
          riskScore: 6
        },
        {
          id: 'P002',
          name: 'فاطمة أحمد حسن',
          age: 32,
          gender: 'female',
          roomNumber: '203',
          bedNumber: 'B',
          admissionDate: '2024-01-14',
          condition: 'monitoring',
          careLevel: 'moderate',
          allergies: ['البنسلين'],
          medications: ['باراسيتامول 500mg', 'أوميبرازول 20mg'],
          diagnosis: 'التهاب المعدة الحاد',
          attendingPhysician: 'د. نورا سالم',
          primaryNurse: 'ليلى أحمد',
          lastAssessment: '2024-01-16T06:00:00',
          nextAssessment: '2024-01-16T18:00:00',
          vitalSignsFrequency: 6,
          notes: 'تحسن في الأعراض، يمكن النظر في الخروج غداً',
          emergencyContact: {
            name: 'محمد حسن',
            relationship: 'زوج',
            phone: '+966501234568'
          },
          insurance: {
            provider: 'شركة التأمين الوطني',
            policyNumber: 'INS123457',
            expiryDate: '2024-11-30'
          },
          flags: ['تحسن'],
          riskScore: 3
        },
        {
          id: 'P003',
          name: 'عمر سالم محمود',
          age: 67,
          gender: 'male',
          roomNumber: '205',
          bedNumber: 'A',
          admissionDate: '2024-01-13',
          condition: 'critical',
          careLevel: 'intensive',
          allergies: ['السلفا', 'الأسبرين'],
          medications: ['نورإبينفرين', 'فانكومايسين', 'هيبارين'],
          diagnosis: 'قصور القلب الحاد، التهاب رئوي',
          attendingPhysician: 'د. خالد محمد',
          primaryNurse: 'أمل حسن',
          lastAssessment: '2024-01-16T12:00:00',
          nextAssessment: '2024-01-16T16:00:00',
          vitalSignsFrequency: 1,
          notes: 'يحتاج مراقبة مستمرة، عائلة تم إبلاغها بالحالة',
          emergencyContact: {
            name: 'سالم محمود',
            relationship: 'ابن',
            phone: '+966501234569'
          },
          insurance: {
            provider: 'شركة التأمين التعاوني',
            policyNumber: 'INS123458',
            expiryDate: '2024-10-31'
          },
          flags: ['حرج', 'مراقبة مستمرة', 'عائلة مبلغة'],
          riskScore: 9
        }
      ];

      const mockCareTasks: CareTask[] = [
        {
          id: 'CT001',
          patientId: 'P001',
          type: 'vital_signs',
          title: 'قياس العلامات الحيوية',
          description: 'قياس الضغط، النبض، الحرارة، التنفس',
          frequency: 'كل 4 ساعات',
          lastCompleted: '2024-01-16T12:00:00',
          nextDue: '2024-01-16T16:00:00',
          assignedNurse: 'سارة محمد',
          priority: 'medium',
          status: 'pending',
          estimatedDuration: 15,
          notes: 'التركيز على مراقبة ضغط الدم'
        },
        {
          id: 'CT002',
          patientId: 'P003',
          type: 'assessment',
          title: 'تقييم الحالة العامة',
          description: 'تقييم شامل للأنظمة الحيوية',
          frequency: 'كل ساعة',
          lastCompleted: '2024-01-16T13:00:00',
          nextDue: '2024-01-16T14:00:00',
          assignedNurse: 'أمل حسن',
          priority: 'urgent',
          status: 'overdue',
          estimatedDuration: 30,
          notes: 'مراقبة حالة التنفس والوعي'
        }
      ];

      const mockMetrics: CareMetrics = {
        totalPatients: 28,
        criticalPatients: 4,
        overdueTasks: 8,
        completedAssessments: 156,
        averageRiskScore: 5.2,
        nurseWorkload: 7.8,
        satisfactionScore: 8.5,
        qualityIndicators: {
          medicationErrors: 0,
          fallIncidents: 1,
          pressureUlcers: 0,
          infections: 2
        }
      };

      setPatients(mockPatients);
      setCareTasks(mockCareTasks);
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Error loading patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'stable': return 'bg-green-100 text-green-800 border-green-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'improving': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'declining': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'monitoring': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCareLevel = (level: string) => {
    switch (level) {
      case 'intensive': return 'عناية مركزة';
      case 'moderate': return 'عناية متوسطة';
      case 'minimal': return 'عناية أساسية';
      default: return level;
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'stable': return 'مستقر';
      case 'critical': return 'حرج';
      case 'improving': return 'متحسن';
      case 'declining': return 'متدهور';
      case 'monitoring': return 'تحت المراقبة';
      default: return condition;
    }
  };

  const getRiskColor = (score: number) => {
    if (score <= 3) return 'text-green-600';
    if (score <= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    });
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCondition = filterCondition === 'all' || patient.condition === filterCondition;
    const matchesCareLevel = filterCareLevel === 'all' || patient.careLevel === filterCareLevel;
    
    return matchesSearch && matchesCondition && matchesCareLevel;
  });

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-3 rounded-xl">
            <Stethoscope className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">نظام رعاية المرضى</h1>
            <p className="text-muted-foreground">
              إدارة شاملة لرعاية وتقييم المرضى
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            تقارير الجودة
          </Button>
          <Dialog open={isPatientDialogOpen} onOpenChange={setIsPatientDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                إضافة مريض
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>إضافة مريض جديد</DialogTitle>
              </DialogHeader>
              {/* Patient form would go here */}
              <div className="p-4 text-center text-muted-foreground">
                نموذج إضافة المريض سيكون هنا
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Metrics Cards */}
      {metrics && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4"
        >
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{metrics.totalPatients}</div>
              <div className="text-sm text-muted-foreground">إجمالي المرضى</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{metrics.criticalPatients}</div>
              <div className="text-sm text-muted-foreground">حالات حرجة</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{metrics.overdueTasks}</div>
              <div className="text-sm text-muted-foreground">مهام متأخرة</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{metrics.completedAssessments}</div>
              <div className="text-sm text-muted-foreground">تقييمات مكتملة</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{metrics.averageRiskScore.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">متوسط المخاطر</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-indigo-600">{metrics.nurseWorkload.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">عبء العمل</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{metrics.satisfactionScore.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">رضا المرضى</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{metrics.qualityIndicators.medicationErrors}</div>
              <div className="text-sm text-muted-foreground">أخطاء دوائية</div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Input
          placeholder="البحث عن المرضى..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Select value={filterCondition} onValueChange={setFilterCondition}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="تصفية حسب الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="stable">مستقر</SelectItem>
            <SelectItem value="critical">حرج</SelectItem>
            <SelectItem value="improving">متحسن</SelectItem>
            <SelectItem value="declining">متدهور</SelectItem>
            <SelectItem value="monitoring">تحت المراقبة</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCareLevel} onValueChange={setFilterCareLevel}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="تصفية حسب مستوى الرعاية" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المستويات</SelectItem>
            <SelectItem value="intensive">عناية مركزة</SelectItem>
            <SelectItem value="moderate">عناية متوسطة</SelectItem>
            <SelectItem value="minimal">عناية أساسية</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Patient Cards */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {filteredPatients.map((patient, index) => (
          <motion.div
            key={patient.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="hover-lift cursor-pointer h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{patient.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>غرفة {patient.roomNumber}{patient.bedNumber}</span>
                        <span>•</span>
                        <span>{patient.age} سنة</span>
                      </div>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${getRiskColor(patient.riskScore)}`}>
                    {patient.riskScore}/10
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getConditionColor(patient.condition)}>
                    {getConditionText(patient.condition)}
                  </Badge>
                  <Badge variant="outline">
                    {getCareLevel(patient.careLevel)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">التشخيص:</span>
                    <span className="font-medium text-right max-w-48 truncate">{patient.diagnosis}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">الطبيب المعالج:</span>
                    <span className="font-medium">{patient.attendingPhysician}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">الممرضة المسؤولة:</span>
                    <span className="font-medium">{patient.primaryNurse}</span>
                  </div>
                </div>

                {patient.allergies.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">الحساسية:</p>
                    <div className="flex flex-wrap gap-1">
                      {patient.allergies.map((allergy, i) => (
                        <Badge key={i} variant="destructive" className="text-xs">
                          <AlertTriangle className="h-2 w-2 mr-1" />
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {patient.flags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {patient.flags.map((flag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {flag}
                      </Badge>
                    ))}
                  </div>
                )}

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">آخر تقييم</p>
                    <p className="font-medium">{formatTime(patient.lastAssessment)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">التقييم التالي</p>
                    <p className="font-medium">{formatTime(patient.nextAssessment)}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    عرض التفاصيل
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Patient Detail Dialog */}
      <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          {selectedPatient && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  {selectedPatient.name}
                  <Badge className={getConditionColor(selectedPatient.condition)}>
                    {getConditionText(selectedPatient.condition)}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                  <TabsTrigger value="medical">المعلومات الطبية</TabsTrigger>
                  <TabsTrigger value="care">خطة الرعاية</TabsTrigger>
                  <TabsTrigger value="history">التاريخ الطبي</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">المعلومات الأساسية</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">العمر</p>
                            <p className="font-medium">{selectedPatient.age} سنة</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">الجنس</p>
                            <p className="font-medium">{selectedPatient.gender === 'male' ? 'ذكر' : 'أنثى'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">الغرفة</p>
                            <p className="font-medium">{selectedPatient.roomNumber}{selectedPatient.bedNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">تاريخ الدخول</p>
                            <p className="font-medium">{new Date(selectedPatient.admissionDate).toLocaleDateString('ar-EG')}</p>
                          </div>
                        </div>
                        <Separator />
                        <div>
                          <p className="text-sm text-muted-foreground">التشخيص</p>
                          <p className="font-medium">{selectedPatient.diagnosis}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">الطبيب المعالج</p>
                          <p className="font-medium">{selectedPatient.attendingPhysician}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">الممرضة المسؤولة</p>
                          <p className="font-medium">{selectedPatient.primaryNurse}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">حالة المريض</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <div className={`text-4xl font-bold ${getRiskColor(selectedPatient.riskScore)} mb-2`}>
                            {selectedPatient.riskScore}/10
                          </div>
                          <p className="text-sm text-muted-foreground">نقاط المخاطر</p>
                        </div>
                        <Separator />
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">مستوى الرعاية</p>
                          <Badge className="w-full justify-center p-2">
                            {getCareLevel(selectedPatient.careLevel)}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">تكرار القياسات</p>
                          <p className="font-medium text-center">كل {selectedPatient.vitalSignsFrequency} ساعات</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">جهة الاتصال في الطوارئ</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">الاسم</p>
                          <p className="font-medium">{selectedPatient.emergencyContact.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">صلة القرابة</p>
                          <p className="font-medium">{selectedPatient.emergencyContact.relationship}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">رقم الهاتف</p>
                          <p className="font-medium">{selectedPatient.emergencyContact.phone}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="medical" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          الحساسية
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedPatient.allergies.map((allergy, i) => (
                            <Badge key={i} variant="destructive" className="mr-2">
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Pill className="h-5 w-5 text-blue-500" />
                          الأدوية الحالية
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedPatient.medications.map((medication, i) => (
                            <div key={i} className="p-2 bg-blue-50 rounded">
                              <p className="font-medium text-sm">{medication}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">معلومات التأمين</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">مقدم الخدمة</p>
                          <p className="font-medium">{selectedPatient.insurance.provider}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">رقم الوثيقة</p>
                          <p className="font-medium">{selectedPatient.insurance.policyNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">تاريخ الانتهاء</p>
                          <p className="font-medium">{new Date(selectedPatient.insurance.expiryDate).toLocaleDateString('ar-EG')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="care" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">المهام المطلوبة</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {careTasks.filter(task => task.patientId === selectedPatient.id).map((task) => (
                          <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{task.title}</h4>
                                <Badge className={getPriorityColor(task.priority)}>
                                  {task.priority === 'urgent' ? 'عاجل' :
                                   task.priority === 'high' ? 'عالي' :
                                   task.priority === 'medium' ? 'متوسط' : 'منخفض'}
                                </Badge>
                                <Badge className={getTaskStatusColor(task.status)}>
                                  {task.status === 'pending' ? 'معلق' :
                                   task.status === 'in_progress' ? 'جاري' :
                                   task.status === 'completed' ? 'مكتمل' : 'متأخر'}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{task.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                الموعد: {formatTime(task.nextDue)} | المدة المقدرة: {task.estimatedDuration} دقيقة
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm">
                                <CheckCircle2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">سجل التقييمات</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-muted-foreground">
                        سيتم عرض سجل التقييمات والتاريخ الطبي هنا
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}