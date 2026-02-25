import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Users, Activity, Clock, AlertTriangle, Heart,
  Stethoscope, Thermometer, BarChart3, Calendar,
  FileText, Shield, Bell, User, Plus, Search,
  Monitor, Settings, TrendingUp, ClipboardList,
  UserCheck, Briefcase, Target, Award, Play,
  CheckCircle, Edit, Eye, UserPlus, Pill, RefreshCw, Printer
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { motion } from 'motion/react';
import NursingDashboard from './NursingDashboard';
import VitalSignsSystem from './VitalSignsSystem';
import PatientCareSystem from './PatientCareSystem';

interface VitalSigns {
  id: string;
  patientId: string;
  patientName: string;
  temperature: string;
  bloodPressure: string;
  heartRate: string;
  respiratoryRate: string;
  oxygenSaturation: string;
  timestamp: string;
  nurseId: string;
  nurseName: string;
}

interface NursingTask {
  id: string;
  patientId: string;
  patientName: string;
  task: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo: string;
  dueTime: string;
  notes?: string;
}

interface PatientCare {
  id: string;
  patientId: string;
  patientName: string;
  roomNumber: string;
  condition: string;
  careLevel: 'intensive' | 'moderate' | 'minimal';
  allergies: string[];
  medications: string[];
  lastRounds: string;
  nextAssessment: string;
}

function NursingManagement() {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>([]);
  const [nursingTasks, setNursingTasks] = useState<NursingTask[]>([]);
  const [patientCare, setPatientCare] = useState<PatientCare[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientCare | null>(null);
  const [showVitalSignsDialog, setShowVitalSignsDialog] = useState(false);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showPatientDialog, setShowPatientDialog] = useState(false);

  useEffect(() => {
    loadNursingData();
  }, []);

  const loadNursingData = async () => {
    // Enhanced sample data with more comprehensive information
    setVitalSigns([
      {
        id: '1',
        patientId: 'P001',
        patientName: 'أحمد محمد علي',
        temperature: '37.2°C',
        bloodPressure: '120/80',
        heartRate: '72',
        respiratoryRate: '16',
        oxygenSaturation: '98%',
        timestamp: new Date().toISOString(),
        nurseId: 'N001',
        nurseName: 'سارة أحمد'
      },
      {
        id: '2',
        patientId: 'P002',
        patientName: 'فاطمة حسن',
        temperature: '36.8°C',
        bloodPressure: '110/70',
        heartRate: '68',
        respiratoryRate: '14',
        oxygenSaturation: '99%',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        nurseId: 'N002',
        nurseName: 'محمد حسن'
      },
      {
        id: '3',
        patientId: 'P003',
        patientName: 'عمر سالم',
        temperature: '38.5°C',
        bloodPressure: '140/90',
        heartRate: '88',
        respiratoryRate: '20',
        oxygenSaturation: '95%',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        nurseId: 'N001',
        nurseName: 'سارة أحمد'
      }
    ]);

    setNursingTasks([
      {
        id: '1',
        patientId: 'P001',
        patientName: 'أحمد محمد علي',
        task: 'إعطاء دواء الضغط - ليسينوبريل 10mg',
        priority: 'high',
        status: 'pending',
        assignedTo: 'سارة أحمد',
        dueTime: '14:00',
        notes: 'تحقق من ضغط الدم قبل الإعطاء'
      },
      {
        id: '2',
        patientId: 'P002',
        patientName: 'فاطمة حسن',
        task: 'تغيير الضمادة الجراحية',
        priority: 'medium',
        status: 'in_progress',
        assignedTo: 'محمد حسن',
        dueTime: '15:30',
        notes: 'استخدام تقنية معقمة'
      },
      {
        id: '3',
        patientId: 'P003',
        patientName: 'عمر سالم',
        task: 'مراقبة العلامات الحيوية كل ساعة',
        priority: 'high',
        status: 'pending',
        assignedTo: 'سارة أحمد',
        dueTime: '13:00',
        notes: 'مريض في حالة حرجة - تنبيه فوري عند أي تغيير'
      },
      {
        id: '4',
        patientId: 'P001',
        patientName: 'أحمد محمد علي',
        task: 'تقييم الألم وإعطاء مسكن حسب الحاجة',
        priority: 'medium',
        status: 'completed',
        assignedTo: 'سارة أحمد',
        dueTime: '12:00',
        notes: 'تم إعطاء باراسيتامول 500mg - الألم انخفض من 7/10 إلى 3/10'
      }
    ]);

    setPatientCare([
      {
        id: '1',
        patientId: 'P001',
        patientName: 'أحمد محمد علي',
        roomNumber: '201A',
        condition: 'مستقر - تحسن تدريجي',
        careLevel: 'moderate',
        allergies: ['البنسلين', 'الأسبرين'],
        medications: ['ليسينوبريل 10mg', 'ميتفورمين 500mg', 'أتورفاستاتين 20mg'],
        lastRounds: '12:00',
        nextAssessment: '16:00'
      },
      {
        id: '2',
        patientId: 'P002',
        patientName: 'فاطمة حسن',
        roomNumber: '202B',
        condition: 'ما بعد الجراحة - شفاء طبيعي',
        careLevel: 'intensive',
        allergies: ['اللاتكس'],
        medications: ['مورفين 5mg', 'سيفالكسين 500mg', 'أوميبرازول 20mg'],
        lastRounds: '11:30',
        nextAssessment: '15:30'
      },
      {
        id: '3',
        patientId: 'P003',
        patientName: 'عمر سالم',
        roomNumber: '205A',
        condition: 'حرج - التهاب رئوي حاد',
        careLevel: 'intensive',
        allergies: ['السلفا'],
        medications: ['أزيثروميسين 500mg', 'بريدنيزولون 20mg', 'سالبوتامول'],
        lastRounds: '12:30',
        nextAssessment: '13:30'
      },
      {
        id: '4',
        patientId: 'P004',
        patientName: 'خديجة أحمد',
        roomNumber: '203C',
        condition: 'مستقر - مراقبة روتينية',
        careLevel: 'minimal',
        allergies: [],
        medications: ['فيتامين د', 'كالسيوم'],
        lastRounds: '10:00',
        nextAssessment: '18:00'
      }
    ]);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
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

  const getCriticalPatients = () => {
    return patientCare.filter(patient =>
      patient.careLevel === 'intensive' ||
      patient.condition.includes('حرج')
    );
  };

  const getPendingTasks = () => {
    return nursingTasks.filter(task => task.status === 'pending');
  };

  const getOverdueTasks = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    return nursingTasks.filter(task => {
      if (task.status !== 'pending') return false;
      const [hours, minutes] = task.dueTime.split(':').map(Number);
      const taskTime = hours * 60 + minutes;
      return taskTime < currentTime;
    });
  };

  const renderEnhancedDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">إجمالي المرضى</p>
                <p className="text-3xl font-bold text-blue-700">{patientCare.length}</p>
                <p className="text-xs text-blue-500 mt-1">
                  {getCriticalPatients().length} في حالة حرجة
                </p>
              </div>
              <Users className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">المهام المعلقة</p>
                <p className="text-3xl font-bold text-orange-700">{getPendingTasks().length}</p>
                <p className="text-xs text-orange-500 mt-1">
                  {getOverdueTasks().length} متأخرة
                </p>
              </div>
              <Clock className="h-10 w-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">حالات طوارئ</p>
                <p className="text-3xl font-bold text-red-700">{getCriticalPatients().length}</p>
                <p className="text-xs text-red-500 mt-1">تحتاج مراقبة مستمرة</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">معدل الإنجاز</p>
                <p className="text-3xl font-bold text-green-700">
                  {Math.round((nursingTasks.filter(t => t.status === 'completed').length / nursingTasks.length) * 100)}%
                </p>
                <p className="text-xs text-green-500 mt-1">
                  {nursingTasks.filter(t => t.status === 'completed').length} مهمة مكتملة
                </p>
              </div>
              <Activity className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {(getCriticalPatients().length > 0 || getOverdueTasks().length > 0) && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              تنبيهات عاجلة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getCriticalPatients().map(patient => (
                <div key={patient.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-medium text-red-800">{patient.patientName}</p>
                      <p className="text-sm text-red-600">غرفة {patient.roomNumber} - {patient.condition}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="border-red-300 text-red-700">
                    عرض التفاصيل
                  </Button>
                </div>
              ))}

              {getOverdueTasks().map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-medium text-orange-800">{task.task}</p>
                      <p className="text-sm text-orange-600">{task.patientName} - متأخر عن {task.dueTime}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="border-orange-300 text-orange-700">
                    تنفيذ الآن
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              آخر القياسات الحيوية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vitalSigns.slice(0, 3).map((vital) => (
                <div key={vital.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{vital.patientName}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                      <span>الحرارة: {vital.temperature}</span>
                      <span>الضغط: {vital.bloodPressure}</span>
                      <span>النبض: {vital.heartRate}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{vital.nurseName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(vital.timestamp).toLocaleTimeString('ar-SA', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => setActiveTab('vitals')}
            >
              عرض جميع القياسات
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-500" />
              المهام العاجلة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nursingTasks
                .filter(task => task.priority === 'high' && task.status === 'pending')
                .slice(0, 3)
                .map((task) => (
                <div key={task.id} className="flex items-start justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getPriorityColor(task.priority)}>عاجل</Badge>
                      <span className="text-sm text-muted-foreground">{task.dueTime}</span>
                    </div>
                    <p className="font-medium text-sm">{task.task}</p>
                    <p className="text-xs text-muted-foreground">{task.patientName}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    تنفيذ
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => setActiveTab('tasks')}
            >
              عرض جميع المهام
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderEnhancedVitalSigns = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              نظام العلامات الحيوية المتقدم
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowVitalSignsDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                قياس جديد
              </Button>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                التقارير
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vitalSigns.map((vital) => (
              <Card key={vital.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-lg">{vital.patientName}</h4>
                      <p className="text-sm text-muted-foreground">
                        تم القياس بواسطة {vital.nurseName} في {new Date(vital.timestamp).toLocaleString('ar-SA')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        الاتجاه
                      </Button>
                      <Button size="sm" variant="outline">
                        <Printer className="h-4 w-4 mr-1" />
                        طباعة
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <Thermometer className="h-6 w-6 text-red-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">درجة الحرارة</p>
                      <p className="text-lg font-bold text-red-600">{vital.temperature}</p>
                      <p className="text-xs text-muted-foreground">طبيعي: 36.1-37.2°C</p>
                    </div>

                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Heart className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">ضغط الدم</p>
                      <p className="text-lg font-bold text-blue-600">{vital.bloodPressure}</p>
                      <p className="text-xs text-muted-foreground">طبيعي: 120/80</p>
                    </div>

                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <Activity className="h-6 w-6 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">معدل النبض</p>
                      <p className="text-lg font-bold text-green-600">{vital.heartRate} bpm</p>
                      <p className="text-xs text-muted-foreground">طبيعي: 60-100</p>
                    </div>

                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <Activity className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">معدل التنفس</p>
                      <p className="text-lg font-bold text-purple-600">{vital.respiratoryRate}/min</p>
                      <p className="text-xs text-muted-foreground">طبيعي: 12-20</p>
                    </div>

                    <div className="text-center p-3 bg-cyan-50 rounded-lg">
                      <Activity className="h-6 w-6 text-cyan-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">تشبع الأكسجين</p>
                      <p className="text-lg font-bold text-cyan-600">{vital.oxygenSaturation}</p>
                      <p className="text-xs text-muted-foreground">طبيعي: &gt;95%</p>
                    </div>
                  </div>

                  {/* Alert indicators */}
                  <div className="mt-4 flex gap-2">
                    {parseFloat(vital.temperature.replace('°C', '')) > 37.5 && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        حمى
                      </Badge>
                    )}
                    {parseInt(vital.heartRate) > 100 && (
                      <Badge variant="destructive" className="text-xs">
                        <Heart className="h-3 w-3 mr-1" />
                        تسارع نبض
                      </Badge>
                    )}
                    {parseInt(vital.oxygenSaturation.replace('%', '')) < 95 && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        نقص أكسجين
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEnhancedTasks = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              إدارة مهام التمريض المتقدمة
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowTaskDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                مهمة جديدة
              </Button>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                جدولة
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {nursingTasks.map((task) => (
              <Card key={task.id} className={`border-l-4 ${
                task.priority === 'high' ? 'border-l-red-500' :
                task.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority === 'high' ? 'عاجل' :
                           task.priority === 'medium' ? 'متوسط' : 'منخفض'}
                        </Badge>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status === 'pending' ? 'معلق' :
                           task.status === 'in_progress' ? 'جاري التنفيذ' : 'مكتمل'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          موعد التنفيذ: {task.dueTime}
                        </span>
                      </div>

                      <h4 className="font-semibold text-lg mb-2">{task.task}</h4>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-muted-foreground">المريض: </span>
                          <span className="font-medium">{task.patientName}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">المكلف: </span>
                          <span className="font-medium">{task.assignedTo}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">الحالة: </span>
                          <span className="font-medium">
                            {task.status === 'pending' ? 'في الانتظار' :
                             task.status === 'in_progress' ? 'جاري التنفيذ' : 'مكتمل'}
                          </span>
                        </div>
                      </div>

                      {task.notes && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm"><strong>ملاحظات:</strong> {task.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {task.status === 'pending' && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Play className="h-4 w-4 mr-1" />
                          بدء التنفيذ
                        </Button>
                      )}
                      {task.status === 'in_progress' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          إكمال
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        تعديل
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-1" />
                        تفاصيل
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEnhancedPatientCare = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              نظام رعاية المرضى الشامل
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowPatientDialog(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                مريض جديد
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                تقرير الوردية
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {patientCare.map((patient) => (
              <Card key={patient.id} className={`border-l-4 ${
                patient.careLevel === 'intensive' ? 'border-l-red-500' :
                patient.careLevel === 'moderate' ? 'border-l-yellow-500' : 'border-l-green-500'
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold text-xl">{patient.patientName}</h4>
                        <Badge className="bg-blue-100 text-blue-800">
                          غرفة {patient.roomNumber}
                        </Badge>
                        <Badge variant="outline" className={
                          patient.careLevel === 'intensive' ? 'border-red-500 text-red-700' :
                          patient.careLevel === 'moderate' ? 'border-yellow-500 text-yellow-700' :
                          'border-green-500 text-green-700'
                        }>
                          {getCareLevel(patient.careLevel)}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        <strong>الحالة:</strong> {patient.condition}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        عرض الملف
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        تحديث
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h5 className="font-semibold mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        الحساسية والتحذيرات
                      </h5>
                      <div className="space-y-2">
                        {patient.allergies.length > 0 ? (
                          patient.allergies.map((allergy, index) => (
                            <Badge key={index} variant="destructive" className="mr-1 mb-1">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {allergy}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">لا توجد حساسية معروفة</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold mb-3 flex items-center gap-2">
                        <Pill className="h-4 w-4 text-blue-500" />
                        الأدوية الحالية
                      </h5>
                      <div className="space-y-2">
                        {patient.medications.map((med, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {med}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-500" />
                        جدول المراقبة
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">آخر جولة:</span>
                          <span className="font-medium">{patient.lastRounds}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">التقييم التالي:</span>
                          <span className="font-medium text-blue-600">{patient.nextAssessment}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions for Patient */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex gap-2 flex-wrap">
                      <Button size="sm" variant="outline">
                        <Heart className="h-4 w-4 mr-1" />
                        قياس العلامات الحيوية
                      </Button>
                      <Button size="sm" variant="outline">
                        <Pill className="h-4 w-4 mr-1" />
                        إعطاء دواء
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-1" />
                        إضافة ملاحظة
                      </Button>
                      <Button size="sm" variant="outline">
                        <Bell className="h-4 w-4 mr-1" />
                        تنبيه طبي
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderWorkflowManagement = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            سير العمل اليومي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { task: 'جولة صباحية', time: '07:00', status: 'completed', description: 'فحص جميع المرضى' },
              { task: 'توزيع الأدوية الصباحية', time: '08:00', status: 'completed', description: '24 مريض' },
              { task: 'قياس العلامات الحيوية', time: '09:00', status: 'in_progress', description: 'جاري التنفيذ' },
              { task: 'جولة الظهيرة', time: '12:00', status: 'pending', description: 'تقييم الحالات' },
              { task: 'توزيع أدوية الظهيرة', time: '13:00', status: 'pending', description: '18 مريض' },
              { task: 'تقارير الوردية', time: '15:00', status: 'pending', description: 'إعداد التقارير' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'completed' ? 'bg-green-500' :
                    item.status === 'in_progress' ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'
                  }`} />
                  <div>
                    <p className="font-medium">{item.task}</p>
                    <p className="text-sm text-muted-foreground">{item.time} - {item.description}</p>
                  </div>
                </div>
                <Badge variant={
                  item.status === 'completed' ? 'default' :
                  item.status === 'in_progress' ? 'secondary' : 'outline'
                }>
                  {item.status === 'completed' ? 'مكتمل' :
                   item.status === 'in_progress' ? 'جاري' : 'معلق'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            حالة الطاقم
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'سارة أحمد', role: 'ممرضة رئيسية', status: 'متاحة', patients: 8, shift: 'صباحي', experience: '5 سنوات' },
              { name: 'محمد حسن', role: 'ممرض', status: 'مشغول', patients: 6, shift: 'صباحي', experience: '3 سنوات' },
              { name: 'فاطمة علي', role: 'ممرضة', status: 'في راحة', patients: 0, shift: 'مسائي', experience: '7 سنوات' },
              { name: 'أحمد سالم', role: 'ممرض', status: 'متاح', patients: 5, shift: 'ليلي', experience: '2 سنة' }
            ].map((staff, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{staff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{staff.name}</p>
                    <p className="text-sm text-muted-foreground">{staff.role} - {staff.experience}</p>
                    <p className="text-xs text-muted-foreground">وردية {staff.shift}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={
                    staff.status === 'متاحة' || staff.status === 'متاح' ? 'default' :
                    staff.status === 'مشغول' ? 'secondary' : 'outline'
                  }>
                    {staff.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    {staff.patients} مرضى
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            إنجازات اليوم
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">95%</div>
              <div className="text-sm text-muted-foreground">معدل إكمال المهام</div>
              <div className="text-xs text-green-600 mt-1">
                {nursingTasks.filter(t => t.status === 'completed').length} من {nursingTasks.length} مهمة
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{vitalSigns.length}</div>
              <div className="text-sm text-muted-foreground">قياسات حيوية مكتملة</div>
              <div className="text-xs text-blue-600 mt-1">آخر قياس منذ ساعة واحدة</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">6</div>
              <div className="text-sm text-muted-foreground">جولات مرضى</div>
              <div className="text-xs text-purple-600 mt-1">جولة كل 4 ساعات</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">0</div>
              <div className="text-sm text-muted-foreground">حوادث سلامة</div>
              <div className="text-xs text-orange-600 mt-1">سجل ممتاز</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderQuickActions = () => {
    return (
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
          <UserPlus className="h-6 w-6" />
          <span>تسجيل مريض جديد</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
          <Activity className="h-6 w-6" />
          <span>قياس العلامات الحيوية</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
          <Pill className="h-6 w-6" />
          <span>إعطاء دواء</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
          <ClipboardList className="h-6 w-6" />
          <span>إضافة مهمة</span>
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl"
      >
        <div className="flex items-center gap-4">
          <div className="bg-primary p-3 rounded-xl text-white">
            <Shield className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">إدارة التمريض المتقدمة</h1>
            <p className="text-muted-foreground">
              نظام متكامل لإدارة الرعاية التمريضية والمرضى مع سير عمل شامل
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Dialog open={isQuickActionOpen} onOpenChange={setIsQuickActionOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Target className="h-4 w-4 mr-2" />
                إجراءات سريعة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>الإجراءات السريعة</DialogTitle>
              </DialogHeader>
              {renderQuickActions()}
            </DialogContent>
          </Dialog>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            إضافة ممرضة
          </Button>
        </div>
      </motion.div>

      {/* Global Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex gap-4 px-6"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث في السجلات والمرضى والمهام..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          إعدادات
        </Button>
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          تحديث
        </Button>
      </motion.div>

      {/* Enhanced Tabs */}
      <div className="px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">لوحة التحكم</span>
            </TabsTrigger>
            <TabsTrigger value="vitals" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">العلامات الحيوية</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">المهام</span>
            </TabsTrigger>
            <TabsTrigger value="care" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              <span className="hidden sm:inline">رعاية المرضى</span>
            </TabsTrigger>
            <TabsTrigger value="workflow" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">سير العمل</span>
            </TabsTrigger>
            <TabsTrigger value="monitor" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              <span className="hidden sm:inline">المراقبة</span>
            </TabsTrigger>
          </TabsList>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="dashboard" className="space-y-6 mt-0">
              {renderEnhancedDashboard()}
            </TabsContent>

            <TabsContent value="vitals" className="space-y-6 mt-0">
              {renderEnhancedVitalSigns()}
            </TabsContent>

            <TabsContent value="tasks" className="space-y-6 mt-0">
              {renderEnhancedTasks()}
            </TabsContent>

            <TabsContent value="care" className="space-y-6 mt-0">
              {renderEnhancedPatientCare()}
            </TabsContent>

            <TabsContent value="workflow" className="space-y-6 mt-0">
              {renderWorkflowManagement()}
            </TabsContent>

            <TabsContent value="monitor" className="space-y-6 mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-5 w-5" />
                      مراقبة المرضى الحرجين
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {getCriticalPatients().map((patient, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-red-50 border-red-200">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <div>
                              <p className="font-medium text-red-800">{patient.patientName}</p>
                              <p className="text-sm text-red-600">غرفة {patient.roomNumber} - {patient.condition}</p>
                              <p className="text-xs text-red-500">آخر تقييم: {patient.lastRounds}</p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Badge variant="destructive">حرج</Badge>
                            <Button size="sm" variant="outline" className="border-red-300 text-red-700">
                              عرض التفاصيل
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      إحصائيات الوردية المباشرة
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{patientCare.length}</div>
                          <div className="text-sm text-muted-foreground">مرضى نشطين</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {nursingTasks.filter(t => t.status === 'completed').length}
                          </div>
                          <div className="text-sm text-muted-foreground">مهام مكتملة</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <div className="text-2xl font-bold text-yellow-600">
                            {getPendingTasks().length}
                          </div>
                          <div className="text-sm text-muted-foreground">مهام معلقة</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">4</div>
                          <div className="text-sm text-muted-foreground">طاقم في الخدمة</div>
                        </div>
                      </div>

                      {/* Real-time alerts */}
                      <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <h4 className="font-semibold text-orange-800 mb-2">تنبيهات فورية</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span>مريض في غرفة 205A يحتاج مراقبة عاجلة</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span>موعد إعطاء دواء في غرفة 201A خلال 15 دقيقة</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </div>
  );
}

export default NursingManagement;
