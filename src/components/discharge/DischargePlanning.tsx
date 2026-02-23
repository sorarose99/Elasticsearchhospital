import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  CheckCircle, 
  FileText, 
  Calendar, 
  Archive,
  User,
  Clock,
  MapPin,
  Phone,
  Printer,
  Download,
  AlertTriangle,
  Heart,
  Pill,
  Activity
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useNavigation } from '../navigation/NavigationContext';

interface DischargePatient {
  id: string;
  name: string;
  nameAr: string;
  age: number;
  gender: 'M' | 'F';
  admissionDate: Date;
  expectedDischargeDate: Date;
  room: string;
  diagnosis: string;
  diagnosisAr: string;
  attendingPhysician: string;
  dischargeStatus: 'pending' | 'ready' | 'completed' | 'delayed';
  condition: 'stable' | 'improving' | 'critical';
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  followUpAppointments: Array<{
    department: string;
    date: Date;
    doctor: string;
  }>;
  homeCarePlan?: {
    wound_care: boolean;
    physiotherapy: boolean;
    nursing_visits: boolean;
    medical_equipment: string[];
  };
}

interface DischargeSummary {
  patientId: string;
  admissionReason: string;
  treatmentProvided: string;
  finalDiagnosis: string;
  dischargeMedications: Array<{
    name: string;
    dosage: string;
    instructions: string;
  }>;
  followUpInstructions: string;
  warningsSigns: string[];
  emergencyContact: string;
  dischargeInstructions: string;
}

const DischargePlanning: React.FC = () => {
  const { language } = useLanguage();
  const { navigation } = useNavigation();
  const [patients, setPatients] = useState<DischargePatient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<DischargePatient | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Simulate discharge patients data
    const mockPatients: DischargePatient[] = [
      {
        id: 'P001',
        name: 'Ahmed Hassan',
        nameAr: 'أحمد حسن',
        age: 65,
        gender: 'M',
        admissionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        expectedDischargeDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        room: 'ICU-201',
        diagnosis: 'Post-operative cardiac surgery recovery',
        diagnosisAr: 'تعافي ما بعد جراحة القلب',
        attendingPhysician: 'Dr. Sarah Ahmed',
        dischargeStatus: 'ready',
        condition: 'stable',
        medications: [
          { name: 'Aspirin', dosage: '75mg', frequency: 'Once daily', duration: '6 months' },
          { name: 'Metoprolol', dosage: '50mg', frequency: 'Twice daily', duration: '3 months' }
        ],
        followUpAppointments: [
          { department: 'Cardiology', date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), doctor: 'Dr. Sarah Ahmed' }
        ],
        homeCarePlan: {
          wound_care: true,
          physiotherapy: false,
          nursing_visits: true,
          medical_equipment: ['Blood pressure monitor']
        }
      },
      {
        id: 'P002',
        name: 'Fatima Ali',
        nameAr: 'فاطمة علي',
        age: 45,
        gender: 'F',
        admissionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        expectedDischargeDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        room: 'Ward-105',
        diagnosis: 'Diabetes management and education',
        diagnosisAr: 'إدارة وتعليم مرض السكري',
        attendingPhysician: 'Dr. Omar Khan',
        dischargeStatus: 'pending',
        condition: 'improving',
        medications: [
          { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: 'Long-term' },
          { name: 'Insulin', dosage: '10 units', frequency: 'Before meals', duration: 'As needed' }
        ],
        followUpAppointments: [
          { department: 'Endocrinology', date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), doctor: 'Dr. Omar Khan' }
        ],
        homeCarePlan: {
          wound_care: false,
          physiotherapy: false,
          nursing_visits: false,
          medical_equipment: ['Glucometer', 'Insulin pen']
        }
      }
    ];

    setPatients(mockPatients);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'default';
      case 'pending': return 'secondary';
      case 'completed': return 'outline';
      case 'delayed': return 'destructive';
      default: return 'secondary';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'stable': return 'default';
      case 'improving': return 'outline';
      case 'critical': return 'destructive';
      default: return 'secondary';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {language === 'ar' ? 'لوحة الخروج' : 'Discharge Dashboard'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              {language === 'ar' ? 'جاهز للخروج' : 'Ready for Discharge'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {patients.filter(p => p.dischargeStatus === 'ready').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              {language === 'ar' ? 'قيد الانتظار' : 'Pending'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {patients.filter(p => p.dischargeStatus === 'pending').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              {language === 'ar' ? 'مؤجل' : 'Delayed'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {patients.filter(p => p.dischargeStatus === 'delayed').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              {language === 'ar' ? 'مكتمل' : 'Completed Today'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">8</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{language === 'ar' ? 'المرضى المجدولين للخروج' : 'Patients Scheduled for Discharge'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {patients.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer"
                   onClick={() => setSelectedPatient(patient)}>
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-semibold">
                      {language === 'ar' ? patient.nameAr : patient.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {patient.room} • {language === 'ar' ? patient.diagnosisAr : patient.diagnosis}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' ? 'الطبيب المعالج:' : 'Attending:'} {patient.attendingPhysician}
                    </p>
                  </div>
                </div>

                <div className="text-right space-y-2">
                  <Badge variant={getStatusColor(patient.dischargeStatus)}>
                    {patient.dischargeStatus === 'ready' 
                      ? (language === 'ar' ? 'جاهز' : 'Ready')
                      : patient.dischargeStatus === 'pending'
                      ? (language === 'ar' ? 'قيد الانتظار' : 'Pending')
                      : (language === 'ar' ? 'مؤجل' : 'Delayed')
                    }
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'خروج متوقع:' : 'Expected:'} {patient.expectedDischargeDate.toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDischargeSummary = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {language === 'ar' ? 'ملخص الخروج' : 'Discharge Summary'}
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'طباعة' : 'Print'}
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'تحميل' : 'Download'}
          </Button>
        </div>
      </div>

      {selectedPatient ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'ar' ? 'ملخص خروج المريض' : 'Patient Discharge Summary'}
            </CardTitle>
            <CardDescription>
              {language === 'ar' ? selectedPatient.nameAr : selectedPatient.name} - {selectedPatient.room}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>{language === 'ar' ? 'تاريخ الدخول' : 'Admission Date'}</Label>
                <Input value={selectedPatient.admissionDate.toLocaleDateString()} readOnly />
              </div>
              <div>
                <Label>{language === 'ar' ? 'تاريخ الخروج المتوقع' : 'Expected Discharge'}</Label>
                <Input value={selectedPatient.expectedDischargeDate.toLocaleDateString()} readOnly />
              </div>
            </div>

            <div>
              <Label>{language === 'ar' ? 'التشخيص النهائي' : 'Final Diagnosis'}</Label>
              <Textarea 
                value={language === 'ar' ? selectedPatient.diagnosisAr : selectedPatient.diagnosis}
                readOnly 
              />
            </div>

            <div>
              <Label>{language === 'ar' ? 'الأدوية عند الخروج' : 'Discharge Medications'}</Label>
              <div className="space-y-2">
                {selectedPatient.medications.map((med, index) => (
                  <div key={index} className="p-3 border rounded-md">
                    <div className="font-medium">{med.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {med.dosage} - {med.frequency} - {med.duration}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>{language === 'ar' ? 'تعليمات الخروج' : 'Discharge Instructions'}</Label>
              <Textarea 
                placeholder={language === 'ar' 
                  ? 'اكتب تعليمات الخروج...'
                  : 'Enter discharge instructions...'
                }
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Alert>
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            {language === 'ar' 
              ? 'يرجى اختيار مريض من لوحة الخروج لإنشاء ملخص الخروج'
              : 'Please select a patient from the discharge dashboard to create a discharge summary'
            }
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderFollowUpCare = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        {language === 'ar' ? 'الرعاية المتابعة' : 'Follow-up Care'}
      </h2>

      {selectedPatient ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                {language === 'ar' ? 'مواعيد المتابعة' : 'Follow-up Appointments'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedPatient.followUpAppointments.map((apt, index) => (
                  <div key={index} className="p-3 border rounded-md">
                    <div className="font-medium">{apt.department}</div>
                    <div className="text-sm text-muted-foreground">
                      {apt.doctor} • {apt.date.toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                {language === 'ar' ? 'خطة الرعاية المنزلية' : 'Home Care Plan'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedPatient.homeCarePlan && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={selectedPatient.homeCarePlan.wound_care}
                      readOnly
                    />
                    <span>{language === 'ar' ? 'العناية بالجروح' : 'Wound Care'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={selectedPatient.homeCarePlan.physiotherapy}
                      readOnly
                    />
                    <span>{language === 'ar' ? 'العلاج الطبيعي' : 'Physiotherapy'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={selectedPatient.homeCarePlan.nursing_visits}
                      readOnly
                    />
                    <span>{language === 'ar' ? 'زيارات التمريض' : 'Nursing Visits'}</span>
                  </div>
                  
                  {selectedPatient.homeCarePlan.medical_equipment.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">
                        {language === 'ar' ? 'المعدات الطبية المطلوبة' : 'Required Medical Equipment'}
                      </Label>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedPatient.homeCarePlan.medical_equipment.map((eq, index) => (
                          <Badge key={index} variant="outline">
                            {eq}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Alert>
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            {language === 'ar' 
              ? 'يرجى اختيار مريض لعرض خطة الرعاية المتابعة'
              : 'Please select a patient to view follow-up care plan'
            }
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderPatientEducation = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        {language === 'ar' ? 'تثقيف المريض' : 'Patient Education'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Pill className="w-5 h-5 mr-2 text-blue-600" />
              {language === 'ar' ? 'إدارة الأدوية' : 'Medication Management'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              <li>• {language === 'ar' ? 'خذ الأدوية في الوقت المحدد' : 'Take medications on time'}</li>
              <li>• {language === 'ar' ? 'لا تتوقف عن الدواء دون استشارة الطبيب' : 'Don\'t stop without consulting doctor'}</li>
              <li>• {language === 'ar' ? 'احتفظ بقائمة الأدوية محدثة' : 'Keep updated medication list'}</li>
              <li>• {language === 'ar' ? 'أبلغ عن أي آثار جانبية' : 'Report any side effects'}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-600" />
              {language === 'ar' ? 'النشاط البدني' : 'Physical Activity'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              <li>• {language === 'ar' ? 'ابدأ بتمارين خفيفة' : 'Start with light exercises'}</li>
              <li>• {language === 'ar' ? 'زد النشاط تدريجياً' : 'Gradually increase activity'}</li>
              <li>• {language === 'ar' ? 'تجنب الرفع الثقيل' : 'Avoid heavy lifting'}</li>
              <li>• {language === 'ar' ? 'استمع لجسمك' : 'Listen to your body'}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
              {language === 'ar' ? 'علامات التحذير' : 'Warning Signs'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              <li>• {language === 'ar' ? 'ألم في الصدر' : 'Chest pain'}</li>
              <li>• {language === 'ar' ? 'ضيق في التنفس' : 'Shortness of breath'}</li>
              <li>• {language === 'ar' ? 'حمى عالية' : 'High fever'}</li>
              <li>• {language === 'ar' ? 'نزيف غير طبيعي' : 'Unusual bleeding'}</li>
            </ul>
            <Alert className="mt-4">
              <Phone className="w-4 h-4" />
              <AlertDescription>
                {language === 'ar' 
                  ? 'اتصل بالطوارئ فوراً عند ظهور أي من هذه العلامات'
                  : 'Call emergency immediately if any of these signs appear'
                }
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (!navigation.currentView || navigation.currentView === 'discharge_dashboard') {
    return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>{language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</span>
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>{language === 'ar' ? 'الملخص' : 'Summary'}</span>
          </TabsTrigger>
          <TabsTrigger value="followup" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{language === 'ar' ? 'المتابعة' : 'Follow-up'}</span>
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center space-x-2">
            <Archive className="w-4 h-4" />
            <span>{language === 'ar' ? 'التثقيف' : 'Education'}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          {renderDashboard()}
        </TabsContent>

        <TabsContent value="summary" className="mt-6">
          {renderDischargeSummary()}
        </TabsContent>

        <TabsContent value="followup" className="mt-6">
          {renderFollowUpCare()}
        </TabsContent>

        <TabsContent value="education" className="mt-6">
          {renderPatientEducation()}
        </TabsContent>
      </Tabs>
    );
  }

  // Handle specific views
  switch (navigation.currentView) {
    case 'discharge_summary':
      return renderDischargeSummary();
    case 'follow_up_care':
      return renderFollowUpCare();
    case 'patient_education':
      return renderPatientEducation();
    default:
      return renderDashboard();
  }
};

export default DischargePlanning;