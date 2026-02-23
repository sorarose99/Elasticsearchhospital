import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { 
  AlertTriangle, 
  Bed, 
  FileText, 
  BarChart3, 
  Plus, 
  AlertCircle,
  Clock,
  User,
  Activity,
  Heart,
  Thermometer,
  Users,
  Shield,
  Edit,
  Save,
  Phone,
  Ambulance,
  Stethoscope,
  Siren,
  Timer,
  UserCheck,
  ClipboardList,
  TrendingUp,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Eye,
  History
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useNavigation } from '../navigation/NavigationContext';

interface EmergencyCase {
  id: string;
  patientName: string;
  patientNameAr: string;
  age: number;
  gender: 'M' | 'F';
  severity: 'critical' | 'urgent' | 'moderate' | 'low';
  complaint: string;
  complaintAr: string;
  arrivalTime: Date;
  room?: string;
  assignedDoctor?: string;
  assignedNurse?: string;
  status: 'waiting' | 'in_progress' | 'completed' | 'discharged' | 'transferred';
  vitals?: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    oxygenSaturation: number;
    respiratoryRate: number;
    painLevel: number;
  };
  triageNotes?: string;
  treatmentPlan?: string;
  medications?: string[];
  procedures?: string[];
  disposition?: 'discharge' | 'admit' | 'transfer' | 'observe';
  estimatedWaitTime?: number;
  priority: number; // 1-5 scale
}

interface EmergencyRoom {
  id: string;
  name: string;
  nameAr: string;
  capacity: number;
  occupied: number;
  status: 'available' | 'full' | 'maintenance' | 'cleaning';
  equipment: string[];
  currentPatients: string[];
  roomType: 'trauma' | 'cardiac' | 'pediatric' | 'general' | 'isolation';
}

interface EmergencyProtocol {
  id: string;
  name: string;
  nameAr: string;
  category: 'cardiac' | 'trauma' | 'pediatric' | 'poisoning' | 'respiratory' | 'neurological';
  steps: Array<{
    step: number;
    action: string;
    actionAr: string;
    timeLimit?: number; // minutes
    critical: boolean;
  }>;
  medications?: string[];
  equipment?: string[];
  specialistRequired?: string[];
}

interface TriageAssessment {
  id: string;
  patientId: string;
  assessedBy: string;
  assessmentTime: Date;
  chiefComplaint: string;
  vitalSigns: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    oxygenSaturation: number;
    respiratoryRate: number;
    painLevel: number;
  };
  mentalStatus: 'alert' | 'confused' | 'unconscious' | 'agitated';
  triageLevel: 1 | 2 | 3 | 4 | 5; // ESI levels
  redFlags: string[];
  interventions: string[];
  reassessmentTime?: Date;
}

const EmergencyManagement: React.FC = () => {
  const { language } = useLanguage();
  const { navigation } = useNavigation();
  const [emergencyCases, setEmergencyCases] = useState<EmergencyCase[]>([]);
  const [emergencyRooms, setEmergencyRooms] = useState<EmergencyRoom[]>([]);
  const [protocols, setProtocols] = useState<EmergencyProtocol[]>([]);
  const [activeTab, setActiveTab] = useState('triage');
  const [selectedCase, setSelectedCase] = useState<EmergencyCase | null>(null);
  const [newCaseDialog, setNewCaseDialog] = useState(false);
  const [triageDialog, setTriageDialog] = useState(false);
  const [protocolDialog, setProtocolDialog] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState<EmergencyProtocol | null>(null);

  // Enhanced mock data with more realistic emergency scenarios
  useEffect(() => {
    const mockCases: EmergencyCase[] = [
      {
        id: 'ER001',
        patientName: 'Ahmed Hassan',
        patientNameAr: 'أحمد حسن',
        age: 45,
        gender: 'M',
        severity: 'critical',
        complaint: 'Chest pain and shortness of breath',
        complaintAr: 'ألم في الصدر وضيق في التنفس',
        arrivalTime: new Date(Date.now() - 30 * 60 * 1000),
        room: 'ER-1',
        assignedDoctor: 'Dr. Sarah Ahmed',
        assignedNurse: 'Nurse Maria',
        status: 'in_progress',
        priority: 1,
        estimatedWaitTime: 0,
        vitals: {
          bloodPressure: '180/95',
          heartRate: 110,
          temperature: 37.2,
          oxygenSaturation: 92,
          respiratoryRate: 24,
          painLevel: 8
        },
        triageNotes: 'Possible MI, ECG shows ST elevation',
        treatmentPlan: 'Cardiac catheterization, thrombolytics',
        medications: ['Aspirin 325mg', 'Nitroglycerin SL', 'Morphine 2mg IV'],
        procedures: ['12-lead ECG', 'Chest X-ray', 'Cardiac enzymes'],
        disposition: 'admit'
      },
      {
        id: 'ER002',
        patientName: 'Fatima Ali',
        patientNameAr: 'فاطمة علي',
        age: 28,
        gender: 'F',
        severity: 'urgent',
        complaint: 'Severe abdominal pain',
        complaintAr: 'ألم شديد في البطن',
        arrivalTime: new Date(Date.now() - 15 * 60 * 1000),
        status: 'waiting',
        priority: 2,
        estimatedWaitTime: 20,
        vitals: {
          bloodPressure: '120/80',
          heartRate: 95,
          temperature: 38.1,
          oxygenSaturation: 98,
          respiratoryRate: 18,
          painLevel: 7
        },
        triageNotes: 'RLQ pain, possible appendicitis',
        treatmentPlan: 'CT abdomen, surgical consult'
      },
      {
        id: 'ER003',
        patientName: 'Omar Mohammad',
        patientNameAr: 'عمر محمد',
        age: 8,
        gender: 'M',
        severity: 'moderate',
        complaint: 'High fever and vomiting',
        complaintAr: 'حمى عالية وقيء',
        arrivalTime: new Date(Date.now() - 45 * 60 * 1000),
        room: 'PED-1',
        assignedNurse: 'Nurse Jennifer',
        status: 'in_progress',
        priority: 3,
        estimatedWaitTime: 15,
        vitals: {
          bloodPressure: '90/60',
          heartRate: 120,
          temperature: 39.5,
          oxygenSaturation: 97,
          respiratoryRate: 22,
          painLevel: 4
        },
        triageNotes: 'Dehydration, viral syndrome likely',
        treatmentPlan: 'IV fluids, antipyretics, observation'
      },
      {
        id: 'ER004',
        patientName: 'Sarah Johnson',
        patientNameAr: 'سارة جونسون',
        age: 35,
        gender: 'F',
        severity: 'low',
        complaint: 'Minor laceration on hand',
        complaintAr: 'جرح بسيط في اليد',
        arrivalTime: new Date(Date.now() - 60 * 60 * 1000),
        status: 'waiting',
        priority: 4,
        estimatedWaitTime: 45,
        vitals: {
          bloodPressure: '118/75',
          heartRate: 78,
          temperature: 36.8,
          oxygenSaturation: 99,
          respiratoryRate: 16,
          painLevel: 3
        },
        triageNotes: 'Clean laceration, needs sutures',
        treatmentPlan: 'Wound cleaning, sutures, tetanus shot'
      }
    ];

    const mockRooms: EmergencyRoom[] = [
      {
        id: 'ER-1',
        name: 'Critical Care Bay 1',
        nameAr: 'وحدة العناية الحرجة 1',
        capacity: 2,
        occupied: 1,
        status: 'available',
        equipment: ['Defibrillator', 'Ventilator', 'Cardiac Monitor', 'Crash Cart'],
        currentPatients: ['ER001'],
        roomType: 'cardiac'
      },
      {
        id: 'ER-2',
        name: 'Trauma Room',
        nameAr: 'غرفة الإصابات',
        capacity: 3,
        occupied: 0,
        status: 'available',
        equipment: ['X-Ray', 'Ultrasound', 'Surgical Equipment', 'Blood Warmer'],
        currentPatients: [],
        roomType: 'trauma'
      },
      {
        id: 'PED-1',
        name: 'Pediatric Emergency',
        nameAr: 'طوارئ الأطفال',
        capacity: 4,
        occupied: 1,
        status: 'available',
        equipment: ['Pediatric Equipment', 'Incubator', 'Monitors', 'Toys'],
        currentPatients: ['ER003'],
        roomType: 'pediatric'
      },
      {
        id: 'ISO-1',
        name: 'Isolation Room',
        nameAr: 'غرفة العزل',
        capacity: 1,
        occupied: 0,
        status: 'available',
        equipment: ['Negative Pressure', 'PPE Station', 'HEPA Filter'],
        currentPatients: [],
        roomType: 'isolation'
      }
    ];

    const mockProtocols: EmergencyProtocol[] = [
      {
        id: 'PROTO-001',
        name: 'Cardiac Arrest Protocol',
        nameAr: 'بروتوكول توقف القلب',
        category: 'cardiac',
        steps: [
          { step: 1, action: 'Check responsiveness and pulse', actionAr: 'فحص الاستجابة والنبض', timeLimit: 1, critical: true },
          { step: 2, action: 'Call for help and get AED/defibrillator', actionAr: 'طلب المساعدة وإحضار جهاز الصدمات', timeLimit: 1, critical: true },
          { step: 3, action: 'Begin CPR - 30 compressions, 2 breaths', actionAr: 'بدء الإنعاش القلبي الرئوي', timeLimit: 2, critical: true },
          { step: 4, action: 'Attach defibrillator and analyze rhythm', actionAr: 'توصيل جهاز الصدمات وتحليل النظم', timeLimit: 1, critical: true },
          { step: 5, action: 'Deliver shock if indicated', actionAr: 'إعطاء الصدمة إذا لزم الأمر', timeLimit: 1, critical: true },
          { step: 6, action: 'Continue CPR for 2 minutes', actionAr: 'متابعة الإنعاش لمدة دقيقتين', timeLimit: 2, critical: true }
        ],
        medications: ['Epinephrine 1mg IV', 'Amiodarone 300mg IV', 'Atropine 1mg IV'],
        equipment: ['Defibrillator', 'Bag-mask ventilation', 'IV access', 'Cardiac monitor'],
        specialistRequired: ['Cardiologist', 'Intensivist']
      },
      {
        id: 'PROTO-002',
        name: 'Trauma Assessment Protocol',
        nameAr: 'بروتوكول تقييم الإصابات',
        category: 'trauma',
        steps: [
          { step: 1, action: 'Primary survey - ABCDE', actionAr: 'المسح الأولي - ABCDE', timeLimit: 5, critical: true },
          { step: 2, action: 'Secure airway with C-spine protection', actionAr: 'تأمين مجرى الهواء مع حماية العمود الفقري', timeLimit: 3, critical: true },
          { step: 3, action: 'Assess breathing and ventilation', actionAr: 'تقييم التنفس والتهوية', timeLimit: 2, critical: true },
          { step: 4, action: 'Control hemorrhage and assess circulation', actionAr: 'السيطرة على النزيف وتقييم الدورة الدموية', timeLimit: 3, critical: true },
          { step: 5, action: 'Neurological assessment', actionAr: 'التقييم العصبي', timeLimit: 2, critical: false },
          { step: 6, action: 'Expose and examine for injuries', actionAr: 'الكشف وفحص الإصابات', timeLimit: 5, critical: false }
        ],
        medications: ['Normal Saline', 'Blood products', 'Pain medication'],
        equipment: ['Cervical collar', 'Backboard', 'Ultrasound', 'X-ray'],
        specialistRequired: ['Trauma surgeon', 'Orthopedist', 'Neurosurgeon']
      }
    ];

    setEmergencyCases(mockCases);
    setEmergencyRooms(mockRooms);
    setProtocols(mockProtocols);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'urgent': return 'destructive';
      case 'moderate': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertCircle className="w-4 h-4" />;
      case 'urgent': return <AlertTriangle className="w-4 h-4" />;
      case 'moderate': return <Clock className="w-4 h-4" />;
      case 'low': return <User className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-blue-500';
      case 5: return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getWaitTimeColor = (minutes: number) => {
    if (minutes <= 15) return 'text-green-600';
    if (minutes <= 30) return 'text-yellow-600';
    if (minutes <= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  // New Case Registration Form
  const NewCaseForm = () => {
    const [formData, setFormData] = useState({
      patientName: '',
      patientNameAr: '',
      age: '',
      gender: '',
      complaint: '',
      complaintAr: '',
      severity: '',
      arrivalMode: 'walk-in',
      triageNotes: '',
      vitals: {
        bloodPressure: '',
        heartRate: '',
        temperature: '',
        oxygenSaturation: '',
        respiratoryRate: '',
        painLevel: ''
      }
    });

    const handleSubmit = () => {
      const newCase: EmergencyCase = {
        id: `ER${String(emergencyCases.length + 1).padStart(3, '0')}`,
        patientName: formData.patientName,
        patientNameAr: formData.patientNameAr,
        age: parseInt(formData.age),
        gender: formData.gender as 'M' | 'F',
        severity: formData.severity as 'critical' | 'urgent' | 'moderate' | 'low',
        complaint: formData.complaint,
        complaintAr: formData.complaintAr,
        arrivalTime: new Date(),
        status: 'waiting',
        priority: formData.severity === 'critical' ? 1 : formData.severity === 'urgent' ? 2 : formData.severity === 'moderate' ? 3 : 4,
        estimatedWaitTime: formData.severity === 'critical' ? 0 : formData.severity === 'urgent' ? 15 : formData.severity === 'moderate' ? 30 : 60,
        vitals: {
          bloodPressure: formData.vitals.bloodPressure,
          heartRate: parseInt(formData.vitals.heartRate),
          temperature: parseFloat(formData.vitals.temperature),
          oxygenSaturation: parseInt(formData.vitals.oxygenSaturation),
          respiratoryRate: parseInt(formData.vitals.respiratoryRate),
          painLevel: parseInt(formData.vitals.painLevel)
        },
        triageNotes: formData.triageNotes
      };

      setEmergencyCases([...emergencyCases, newCase]);
      setNewCaseDialog(false);
      
      // Reset form
      setFormData({
        patientName: '', patientNameAr: '', age: '', gender: '', complaint: '', complaintAr: '',
        severity: '', arrivalMode: 'walk-in', triageNotes: '',
        vitals: { bloodPressure: '', heartRate: '', temperature: '', oxygenSaturation: '', respiratoryRate: '', painLevel: '' }
      });
    };

    return (
      <div className="space-y-4 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{language === 'ar' ? 'اسم المريض' : 'Patient Name'}</label>
            <Input
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              placeholder={language === 'ar' ? 'اسم المريض' : 'Patient Name'}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{language === 'ar' ? 'الاسم بالعربية' : 'Name in Arabic'}</label>
            <Input
              value={formData.patientNameAr}
              onChange={(e) => setFormData({ ...formData, patientNameAr: e.target.value })}
              placeholder={language === 'ar' ? 'الاسم بالعربية' : 'Name in Arabic'}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{language === 'ar' ? 'العمر' : 'Age'}</label>
            <Input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              placeholder={language === 'ar' ? 'العمر' : 'Age'}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{language === 'ar' ? 'الجنس' : 'Gender'}</label>
            <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'ar' ? 'اختر الجنس' : 'Select Gender'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">{language === 'ar' ? 'ذكر' : 'Male'}</SelectItem>
                <SelectItem value="F">{language === 'ar' ? 'أنثى' : 'Female'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{language === 'ar' ? 'الشكوى الرئيسية' : 'Chief Complaint'}</label>
          <Textarea
            value={formData.complaint}
            onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
            placeholder={language === 'ar' ? 'وصف الشكوى الرئيسية' : 'Describe chief complaint'}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{language === 'ar' ? 'الشكوى بالعربية' : 'Complaint in Arabic'}</label>
          <Textarea
            value={formData.complaintAr}
            onChange={(e) => setFormData({ ...formData, complaintAr: e.target.value })}
            placeholder={language === 'ar' ? 'الشكوى بالعربية' : 'Complaint in Arabic'}
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{language === 'ar' ? 'مستوى الخطورة' : 'Severity Level'}</label>
            <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value })}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'ar' ? 'اختر مستوى الخطورة' : 'Select Severity'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">{language === 'ar' ? 'حرجة' : 'Critical'}</SelectItem>
                <SelectItem value="urgent">{language === 'ar' ? 'عاجلة' : 'Urgent'}</SelectItem>
                <SelectItem value="moderate">{language === 'ar' ? 'متوسطة' : 'Moderate'}</SelectItem>
                <SelectItem value="low">{language === 'ar' ? 'منخفضة' : 'Low'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{language === 'ar' ? 'طريقة الوصول' : 'Arrival Mode'}</label>
            <Select value={formData.arrivalMode} onValueChange={(value) => setFormData({ ...formData, arrivalMode: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="walk-in">{language === 'ar' ? 'مشي' : 'Walk-in'}</SelectItem>
                <SelectItem value="ambulance">{language === 'ar' ? 'إسعاف' : 'Ambulance'}</SelectItem>
                <SelectItem value="wheelchair">{language === 'ar' ? 'كرسي متحرك' : 'Wheelchair'}</SelectItem>
                <SelectItem value="stretcher">{language === 'ar' ? 'نقالة' : 'Stretcher'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">{language === 'ar' ? 'العلامات الحيوية' : 'Vital Signs'}</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm">{language === 'ar' ? 'ضغط الدم' : 'Blood Pressure'}</label>
              <Input
                value={formData.vitals.bloodPressure}
                onChange={(e) => setFormData({ ...formData, vitals: { ...formData.vitals, bloodPressure: e.target.value } })}
                placeholder="120/80"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">{language === 'ar' ? 'معدل النبض' : 'Heart Rate'}</label>
              <Input
                type="number"
                value={formData.vitals.heartRate}
                onChange={(e) => setFormData({ ...formData, vitals: { ...formData.vitals, heartRate: e.target.value } })}
                placeholder="80"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">{language === 'ar' ? 'درجة الحرارة' : 'Temperature'}</label>
              <Input
                type="number"
                step="0.1"
                value={formData.vitals.temperature}
                onChange={(e) => setFormData({ ...formData, vitals: { ...formData.vitals, temperature: e.target.value } })}
                placeholder="37.0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">{language === 'ar' ? 'تشبع الأكسجين' : 'O2 Saturation'}</label>
              <Input
                type="number"
                value={formData.vitals.oxygenSaturation}
                onChange={(e) => setFormData({ ...formData, vitals: { ...formData.vitals, oxygenSaturation: e.target.value } })}
                placeholder="98"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">{language === 'ar' ? 'معدل التنفس' : 'Respiratory Rate'}</label>
              <Input
                type="number"
                value={formData.vitals.respiratoryRate}
                onChange={(e) => setFormData({ ...formData, vitals: { ...formData.vitals, respiratoryRate: e.target.value } })}
                placeholder="16"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">{language === 'ar' ? 'مستوى الألم' : 'Pain Level (1-10)'}</label>
              <Input
                type="number"
                min="0"
                max="10"
                value={formData.vitals.painLevel}
                onChange={(e) => setFormData({ ...formData, vitals: { ...formData.vitals, painLevel: e.target.value } })}
                placeholder="5"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{language === 'ar' ? 'ملاحظات الفرز' : 'Triage Notes'}</label>
          <Textarea
            value={formData.triageNotes}
            onChange={(e) => setFormData({ ...formData, triageNotes: e.target.value })}
            placeholder={language === 'ar' ? 'ملاحظات إضافية' : 'Additional notes'}
            rows={3}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSubmit} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'حفظ الحالة' : 'Save Case'}
          </Button>
          <Button variant="outline" onClick={() => setNewCaseDialog(false)}>
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
        </div>
      </div>
    );
  };

  const renderTriageBoard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {language === 'ar' ? 'لوحة الفرز' : 'Triage Board'}
        </h2>
        <div className="flex gap-2">
          <Dialog open={newCaseDialog} onOpenChange={setNewCaseDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'حالة جديدة' : 'New Case'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{language === 'ar' ? 'تسجيل حالة طوارئ جديدة' : 'Register New Emergency Case'}</DialogTitle>
                <DialogDescription>
                  {language === 'ar' 
                    ? 'املأ النموذج أدناه لتسجيل حالة طوارئ جديدة في النظام'
                    : 'Fill out the form below to register a new emergency case in the system'
                  }
                </DialogDescription>
              </DialogHeader>
              <NewCaseForm />
            </DialogContent>
          </Dialog>
          
          <Button variant="outline">
            <Ambulance className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'استدعاء إسعاف' : 'Call Ambulance'}
          </Button>
          
          <Button variant="outline">
            <Siren className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'تنبيه عام' : 'General Alert'}
          </Button>
        </div>
      </div>

      {/* Enhanced Priority Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center text-red-600">
              <AlertCircle className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'حرجة (مستوى 1)' : 'Critical (Level 1)'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {emergencyCases.filter(c => c.priority === 1).length}
            </div>
            <p className="text-xs text-red-600/70">
              {language === 'ar' ? 'فوري' : 'Immediate'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center text-orange-600">
              <AlertTriangle className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'عاجلة (مستوى 2)' : 'Urgent (Level 2)'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {emergencyCases.filter(c => c.priority === 2).length}
            </div>
            <p className="text-xs text-orange-600/70">
              {language === 'ar' ? '< 15 دقيقة' : '< 15 min'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center text-yellow-600">
              <Clock className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'متوسطة (مستوى 3)' : 'Moderate (Level 3)'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {emergencyCases.filter(c => c.priority === 3).length}
            </div>
            <p className="text-xs text-yellow-600/70">
              {language === 'ar' ? '< 30 دقيقة' : '< 30 min'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center text-blue-600">
              <User className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'منخفضة (مستوى 4)' : 'Low (Level 4)'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {emergencyCases.filter(c => c.priority === 4).length}
            </div>
            <p className="text-xs text-blue-600/70">
              {language === 'ar' ? '< 60 دقيقة' : '< 60 min'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center text-green-600">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'مكتملة' : 'Completed'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {emergencyCases.filter(c => c.status === 'completed' || c.status === 'discharged').length}
            </div>
            <p className="text-xs text-green-600/70">
              {language === 'ar' ? 'اليوم' : 'Today'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Alerts */}
      <div className="space-y-2">
        {emergencyCases.filter(c => c.priority === 1 && c.status !== 'completed').length > 0 && (
          <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <Siren className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              {language === 'ar' 
                ? `تنبيه: يوجد ${emergencyCases.filter(c => c.priority === 1 && c.status !== 'completed').length} حالة حرجة تتطلب اهتمامًا فوريًا`
                : `Alert: ${emergencyCases.filter(c => c.priority === 1 && c.status !== 'completed').length} critical case(s) requiring immediate attention`
              }
            </AlertDescription>
          </Alert>
        )}
        
        {emergencyCases.filter(c => c.estimatedWaitTime && c.estimatedWaitTime > 60).length > 0 && (
          <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
            <Timer className="w-4 h-4 text-orange-600" />
            <AlertDescription className="text-orange-800 dark:text-orange-200">
              {language === 'ar' 
                ? `تحذير: ${emergencyCases.filter(c => c.estimatedWaitTime && c.estimatedWaitTime > 60).length} حالة تنتظر أكثر من ساعة`
                : `Warning: ${emergencyCases.filter(c => c.estimatedWaitTime && c.estimatedWaitTime > 60).length} case(s) waiting over 1 hour`
              }
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Enhanced Case List */}
      <div className="space-y-4">
        {emergencyCases
          .sort((a, b) => a.priority - b.priority || new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime())
          .map((case_) => (
          <Card key={case_.id} className="cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4" 
                style={{ borderLeftColor: case_.priority === 1 ? '#ef4444' : case_.priority === 2 ? '#f97316' : case_.priority === 3 ? '#eab308' : '#3b82f6' }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-center space-y-1">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(case_.priority)}`}></div>
                    <span className="text-xs font-medium">P{case_.priority}</span>
                  </div>
                  
                  <Badge variant={getSeverityColor(case_.severity)} className="flex items-center space-x-1">
                    {getSeverityIcon(case_.severity)}
                    <span>{case_.severity.toUpperCase()}</span>
                  </Badge>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">
                        {language === 'ar' ? case_.patientNameAr : case_.patientName}
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        ({case_.age}y, {case_.gender})
                      </span>
                      {case_.room && (
                        <Badge variant="outline" className="text-xs">
                          {case_.room}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {language === 'ar' ? case_.complaintAr : case_.complaint}
                    </p>
                    {case_.triageNotes && (
                      <p className="text-xs text-blue-600 mt-1">
                        📝 {case_.triageNotes}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Status and Assignment */}
                  <div className="text-center">
                    <Badge variant={case_.status === 'in_progress' ? 'default' : case_.status === 'waiting' ? 'secondary' : 'outline'}>
                      {case_.status === 'in_progress' 
                        ? (language === 'ar' ? 'قيد العلاج' : 'In Progress')
                        : case_.status === 'waiting'
                        ? (language === 'ar' ? 'في الانتظار' : 'Waiting')
                        : case_.status === 'completed'
                        ? (language === 'ar' ? 'مكتمل' : 'Completed')
                        : (language === 'ar' ? 'خرج' : 'Discharged')
                      }
                    </Badge>
                    {case_.assignedDoctor && (
                      <p className="text-xs text-muted-foreground mt-1">
                        👨‍⚕️ {case_.assignedDoctor}
                      </p>
                    )}
                    {case_.assignedNurse && (
                      <p className="text-xs text-muted-foreground">
                        👩‍⚕️ {case_.assignedNurse}
                      </p>
                    )}
                  </div>

                  {/* Wait Time */}
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'وقت الوصول' : 'Arrival'}
                    </div>
                    <div className="text-sm font-medium">
                      {case_.arrivalTime.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                    {case_.estimatedWaitTime !== undefined && case_.status === 'waiting' && (
                      <div className={`text-xs ${getWaitTimeColor(case_.estimatedWaitTime)}`}>
                        {language === 'ar' ? 'انتظار:' : 'Wait:'} {case_.estimatedWaitTime}m
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-1">
                    <Button size="sm" variant="outline" onClick={() => setSelectedCase(case_)}>
                      <Eye className="w-3 h-3 mr-1" />
                      {language === 'ar' ? 'عرض' : 'View'}
                    </Button>
                    
                    {case_.status === 'waiting' && (
                      <Button size="sm" variant="outline">
                        <UserCheck className="w-3 h-3 mr-1" />
                        {language === 'ar' ? 'تعيين' : 'Assign'}
                      </Button>
                    )}
                    
                    <Button size="sm" variant="outline">
                      <Edit className="w-3 h-3 mr-1" />
                      {language === 'ar' ? 'تحديث' : 'Update'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Vital Signs Display */}
              {case_.vitals && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-4 text-sm border-t pt-3">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>{case_.vitals.heartRate} bpm</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span>{case_.vitals.bloodPressure}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Thermometer className="w-4 h-4 text-orange-500" />
                    <span>{case_.vitals.temperature}°C</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>{case_.vitals.oxygenSaturation}%</span>
                  </div>
                  {case_.vitals.respiratoryRate && (
                    <div className="flex items-center space-x-1">
                      <Activity className="w-4 h-4 text-purple-500" />
                      <span>{case_.vitals.respiratoryRate} /min</span>
                    </div>
                  )}
                  {case_.vitals.painLevel && (
                    <div className="flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      <span>Pain: {case_.vitals.painLevel}/10</span>
                    </div>
                  )}
                </div>
              )}

              {/* Treatment Progress */}
              {case_.status === 'in_progress' && (case_.medications || case_.procedures) && (
                <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <div className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">
                    {language === 'ar' ? 'العلاج الحالي:' : 'Current Treatment:'}
                  </div>
                  {case_.medications && (
                    <div className="text-xs text-blue-700 dark:text-blue-300">
                      💊 {case_.medications.join(', ')}
                    </div>
                  )}
                  {case_.procedures && (
                    <div className="text-xs text-blue-700 dark:text-blue-300">
                      🔬 {case_.procedures.join(', ')}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderEmergencyRooms = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {language === 'ar' ? 'غرف الطوارئ' : 'Emergency Rooms'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {emergencyRooms.map((room) => (
          <Card key={room.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {language === 'ar' ? room.nameAr : room.name}
                </CardTitle>
                <Badge variant={room.status === 'available' ? 'default' : 'destructive'}>
                  {room.status === 'available' 
                    ? (language === 'ar' ? 'متاح' : 'Available')
                    : (language === 'ar' ? 'مشغول' : 'Occupied')
                  }
                </Badge>
              </div>
              <CardDescription>
                {language === 'ar' ? 'السعة' : 'Capacity'}: {room.occupied}/{room.capacity}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Bed className="w-4 h-4" />
                  <span className="text-sm">
                    {language === 'ar' 
                      ? `${room.capacity - room.occupied} أسرة متاحة`
                      : `${room.capacity - room.occupied} beds available`
                    }
                  </span>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    {language === 'ar' ? 'المعدات' : 'Equipment'}
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {room.equipment.map((eq, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {eq}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderProtocols = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        {language === 'ar' ? 'بروتوكولات الطوارئ' : 'Emergency Protocols'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-red-600">
              {language === 'ar' ? 'بروتوكول القلب' : 'Cardiac Protocol'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-sm">
              <li>1. {language === 'ar' ? 'تقييم سريع للعلامات الحيوية' : 'Rapid vital signs assessment'}</li>
              <li>2. {language === 'ar' ? 'تخطيط القلب فوري' : 'Immediate ECG'}</li>
              <li>3. {language === 'ar' ? 'إعطاء الأكسجين' : 'Oxygen administration'}</li>
              <li>4. {language === 'ar' ? 'استدعاء أخصائي القلب' : 'Call cardiologist'}</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-orange-600">
              {language === 'ar' ? 'بروتوكول الصدمة' : 'Trauma Protocol'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-sm">
              <li>1. {language === 'ar' ? 'تأمين مجرى الهواء' : 'Secure airway'}</li>
              <li>2. {language === 'ar' ? 'السيطرة على النزيف' : 'Control bleeding'}</li>
              <li>3. {language === 'ar' ? 'تقييم الحالة العصبية' : 'Neurological assessment'}</li>
              <li>4. {language === 'ar' ? 'أشعة عاجلة' : 'Emergency imaging'}</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-blue-600">
              {language === 'ar' ? 'بروتوكول الأطفال' : 'Pediatric Protocol'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-sm">
              <li>1. {language === 'ar' ? 'تهدئة الطفل والوالدين' : 'Calm child and parents'}</li>
              <li>2. {language === 'ar' ? 'تقييم حسب العمر' : 'Age-appropriate assessment'}</li>
              <li>3. {language === 'ar' ? 'جرعات محسوبة حسب الوزن' : 'Weight-based dosing'}</li>
              <li>4. {language === 'ar' ? 'استدعاء طبيب الأطفال' : 'Pediatrician consultation'}</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-purple-600">
              {language === 'ar' ? 'بروتوكول التسمم' : 'Poisoning Protocol'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-sm">
              <li>1. {language === 'ar' ? 'تحديد نوع السم' : 'Identify poison type'}</li>
              <li>2. {language === 'ar' ? 'الاتصال بمركز السموم' : 'Contact poison control'}</li>
              <li>3. {language === 'ar' ? 'إزالة التلوث' : 'Decontamination'}</li>
              <li>4. {language === 'ar' ? 'مضاد السموم إن وجد' : 'Antidote if available'}</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderStatistics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        {language === 'ar' ? 'إحصائيات الطوارئ' : 'Emergency Statistics'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              {language === 'ar' ? 'اليوم' : 'Today'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              {language === 'ar' ? 'حالة' : 'cases'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              {language === 'ar' ? 'متوسط وقت الانتظار' : 'Avg Wait Time'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              {language === 'ar' ? 'دقيقة' : 'minutes'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              {language === 'ar' ? 'نسبة الإشغال' : 'Occupancy Rate'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              {language === 'ar' ? 'من السعة' : 'capacity'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              {language === 'ar' ? 'حالات حرجة' : 'Critical Cases'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <p className="text-xs text-muted-foreground">
              {language === 'ar' ? 'نشطة' : 'active'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <AlertTriangle className="w-4 h-4" />
        <AlertDescription>
          {language === 'ar' 
            ? 'يوجد حاليًا 3 حالات حرجة تتطلب اهتمامًا فوريًا'
            : 'There are currently 3 critical cases requiring immediate attention'
          }
        </AlertDescription>
      </Alert>
    </div>
  );

  if (!navigation.currentView || navigation.currentView === 'triage') {
    return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="triage" className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>{language === 'ar' ? 'الفرز' : 'Triage'}</span>
          </TabsTrigger>
          <TabsTrigger value="rooms" className="flex items-center space-x-2">
            <Bed className="w-4 h-4" />
            <span>{language === 'ar' ? 'الغرف' : 'Rooms'}</span>
          </TabsTrigger>
          <TabsTrigger value="protocols" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>{language === 'ar' ? 'البروتوكولات' : 'Protocols'}</span>
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>{language === 'ar' ? 'الإحصائيات' : 'Statistics'}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="triage" className="mt-6">
          {renderTriageBoard()}
        </TabsContent>

        <TabsContent value="rooms" className="mt-6">
          {renderEmergencyRooms()}
        </TabsContent>

        <TabsContent value="protocols" className="mt-6">
          {renderProtocols()}
        </TabsContent>

        <TabsContent value="statistics" className="mt-6">
          {renderStatistics()}
        </TabsContent>
      </Tabs>
    );
  }

  // Handle specific views
  switch (navigation.currentView) {
    case 'emergency_room':
      return renderEmergencyRooms();
    case 'protocols':
      return renderProtocols();
    case 'statistics':
      return renderStatistics();
    default:
      return renderTriageBoard();
  }
};

export default EmergencyManagement;