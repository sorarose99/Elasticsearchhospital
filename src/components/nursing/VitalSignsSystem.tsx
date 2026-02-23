import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { 
  Heart, Thermometer, Activity, Droplets, Wind,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  Clock, User, MapPin, Calendar, Search, Filter,
  Plus, Edit, Trash2, Save, X, Eye, BarChart3,
  FileText, Download, Upload, RefreshCw, Bell
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface VitalSigns {
  id: string;
  patientId: string;
  patientName: string;
  roomNumber: string;
  temperature: number;
  temperatureUnit: 'C' | 'F';
  systolicBP: number;
  diastolicBP: number;
  heartRate: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  bloodGlucose?: number;
  pain?: number; // 1-10 scale
  consciousness: 'alert' | 'drowsy' | 'confused' | 'unconscious';
  timestamp: string;
  nurseId: string;
  nurseName: string;
  notes?: string;
  deviceUsed?: string;
  verified: boolean;
  flags: string[];
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  roomNumber: string;
  bedNumber: string;
  condition: string;
  admissionDate: string;
  lastVitals?: string;
}

interface VitalTrend {
  timestamp: string;
  temperature: number;
  heartRate: number;
  systolicBP: number;
  diastolicBP: number;
  oxygenSaturation: number;
}

interface NursingForm {
  patientId: string;
  temperature: string;
  temperatureUnit: 'C' | 'F';
  systolicBP: string;
  diastolicBP: string;
  heartRate: string;
  respiratoryRate: string;
  oxygenSaturation: string;
  bloodGlucose: string;
  pain: string;
  consciousness: string;
  notes: string;
  deviceUsed: string;
}

const initialForm: NursingForm = {
  patientId: '',
  temperature: '',
  temperatureUnit: 'C',
  systolicBP: '',
  diastolicBP: '',
  heartRate: '',
  respiratoryRate: '',
  oxygenSaturation: '',
  bloodGlucose: '',
  pain: '',
  consciousness: 'alert',
  notes: '',
  deviceUsed: ''
};

export default function VitalSignsSystem() {
  const { t, isRTL } = useLanguage();
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [form, setForm] = useState<NursingForm>(initialForm);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('list');
  const [trendData, setTrendData] = useState<VitalTrend[]>([]);
  const [showTrends, setShowTrends] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
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
          condition: 'مستقر',
          admissionDate: '2024-01-15',
          lastVitals: '2024-01-16T10:30:00'
        },
        {
          id: 'P002',
          name: 'فاطمة أحمد حسن',
          age: 32,
          gender: 'female',
          roomNumber: '203',
          bedNumber: 'B',
          condition: 'تحت المراقبة',
          admissionDate: '2024-01-14',
          lastVitals: '2024-01-16T09:15:00'
        },
        {
          id: 'P003',
          name: 'عمر سالم محمود',
          age: 67,
          gender: 'male',
          roomNumber: '205',
          bedNumber: 'A',
          condition: 'حرج',
          admissionDate: '2024-01-13',
          lastVitals: '2024-01-16T11:00:00'
        }
      ];

      const mockVitalSigns: VitalSigns[] = [
        {
          id: '1',
          patientId: 'P001',
          patientName: 'أحمد محمد علي',
          roomNumber: '201A',
          temperature: 37.2,
          temperatureUnit: 'C',
          systolicBP: 135,
          diastolicBP: 85,
          heartRate: 78,
          respiratoryRate: 18,
          oxygenSaturation: 97,
          bloodGlucose: 120,
          pain: 3,
          consciousness: 'alert',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          nurseId: 'N001',
          nurseName: 'سارة أحمد',
          notes: 'المريض يشعر بتحسن',
          deviceUsed: 'Philips Monitor PM-100',
          verified: true,
          flags: ['ضغط مرتفع قليلاً']
        },
        {
          id: '2',
          patientId: 'P002',
          patientName: 'فاطمة أحمد حسن',
          roomNumber: '203B',
          temperature: 36.8,
          temperatureUnit: 'C',
          systolicBP: 110,
          diastolicBP: 70,
          heartRate: 72,
          respiratoryRate: 16,
          oxygenSaturation: 99,
          bloodGlucose: 95,
          pain: 1,
          consciousness: 'alert',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          nurseId: 'N002',
          nurseName: 'محمد حسن',
          notes: 'حالة مستقرة',
          deviceUsed: 'Omron BP-789',
          verified: true,
          flags: []
        }
      ];

      // Generate trend data
      const mockTrendData: VitalTrend[] = [];
      for (let i = 7; i >= 0; i--) {
        const date = new Date();
        date.setHours(date.getHours() - i * 3);
        mockTrendData.push({
          timestamp: date.toISOString(),
          temperature: 36.5 + Math.random() * 1.5,
          heartRate: 70 + Math.random() * 20,
          systolicBP: 110 + Math.random() * 30,
          diastolicBP: 70 + Math.random() * 20,
          oxygenSaturation: 95 + Math.random() * 5
        });
      }

      setPatients(mockPatients);
      setVitalSigns(mockVitalSigns);
      setTrendData(mockTrendData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.patientId) newErrors.patientId = 'يرجى اختيار المريض';
    if (!form.temperature) newErrors.temperature = 'يرجى إدخال درجة الحرارة';
    if (!form.systolicBP) newErrors.systolicBP = 'يرجى إدخال الضغط الانقباضي';
    if (!form.diastolicBP) newErrors.diastolicBP = 'يرجى إدخال الضغط الانبساطي';
    if (!form.heartRate) newErrors.heartRate = 'يرجى إدخال معدل النبض';
    if (!form.respiratoryRate) newErrors.respiratoryRate = 'يرجى إدخال معدل التنفس';
    if (!form.oxygenSaturation) newErrors.oxygenSaturation = 'يرجى إدخال نسبة الأكسجين';

    // Validate ranges
    const temp = parseFloat(form.temperature);
    if (temp && (temp < 35 || temp > 42)) {
      newErrors.temperature = 'درجة الحرارة خارج النطاق الطبيعي';
    }

    const systolic = parseInt(form.systolicBP);
    if (systolic && (systolic < 70 || systolic > 250)) {
      newErrors.systolicBP = 'الضغط الانقباضي خارج النطاق الطبيعي';
    }

    const heartRate = parseInt(form.heartRate);
    if (heartRate && (heartRate < 40 || heartRate > 200)) {
      newErrors.heartRate = 'معدل النبض خارج النطاق الطبيعي';
    }

    const oxygenSat = parseInt(form.oxygenSaturation);
    if (oxygenSat && (oxygenSat < 70 || oxygenSat > 100)) {
      newErrors.oxygenSaturation = 'نسبة الأكسجين خارج النطاق الطبيعي';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateFlags = (vital: Partial<VitalSigns>): string[] => {
    const flags: string[] = [];
    
    if (vital.temperature && vital.temperature > 38.5) flags.push('حمى عالية');
    if (vital.temperature && vital.temperature < 36) flags.push('انخفاض درجة الحرارة');
    
    if (vital.systolicBP && vital.systolicBP > 140) flags.push('ارتفاع ضغط الدم');
    if (vital.systolicBP && vital.systolicBP < 90) flags.push('انخفاض ضغط الدم');
    
    if (vital.heartRate && vital.heartRate > 100) flags.push('تسارع النبض');
    if (vital.heartRate && vital.heartRate < 60) flags.push('بطء النبض');
    
    if (vital.oxygenSaturation && vital.oxygenSaturation < 95) flags.push('انخفاض الأكسجين');
    
    if (vital.respiratoryRate && vital.respiratoryRate > 20) flags.push('تسارع التنفس');
    if (vital.respiratoryRate && vital.respiratoryRate < 12) flags.push('بطء التنفس');

    return flags;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const patient = patients.find(p => p.id === form.patientId);
      if (!patient) {
        setErrors({ patientId: 'المريض غير موجود' });
        return;
      }

      const vitalData: VitalSigns = {
        id: isEditMode ? editingId! : `VS_${Date.now()}`,
        patientId: form.patientId,
        patientName: patient.name,
        roomNumber: `${patient.roomNumber}${patient.bedNumber}`,
        temperature: parseFloat(form.temperature),
        temperatureUnit: form.temperatureUnit,
        systolicBP: parseInt(form.systolicBP),
        diastolicBP: parseInt(form.diastolicBP),
        heartRate: parseInt(form.heartRate),
        respiratoryRate: parseInt(form.respiratoryRate),
        oxygenSaturation: parseInt(form.oxygenSaturation),
        bloodGlucose: form.bloodGlucose ? parseInt(form.bloodGlucose) : undefined,
        pain: form.pain ? parseInt(form.pain) : undefined,
        consciousness: form.consciousness as any,
        timestamp: new Date().toISOString(),
        nurseId: 'N001',
        nurseName: 'الممرضة الحالية',
        notes: form.notes,
        deviceUsed: form.deviceUsed,
        verified: false,
        flags: generateFlags({
          temperature: parseFloat(form.temperature),
          systolicBP: parseInt(form.systolicBP),
          diastolicBP: parseInt(form.diastolicBP),
          heartRate: parseInt(form.heartRate),
          respiratoryRate: parseInt(form.respiratoryRate),
          oxygenSaturation: parseInt(form.oxygenSaturation)
        })
      };

      if (isEditMode) {
        setVitalSigns(prev => prev.map(v => v.id === editingId ? vitalData : v));
      } else {
        setVitalSigns(prev => [vitalData, ...prev]);
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      resetForm();
      setIsAddDialogOpen(false);
      
    } catch (error) {
      console.error('Error saving vital signs:', error);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setIsEditMode(false);
    setEditingId(null);
    setErrors({});
    setSelectedPatient(null);
  };

  const handleEdit = (vital: VitalSigns) => {
    setForm({
      patientId: vital.patientId,
      temperature: vital.temperature.toString(),
      temperatureUnit: vital.temperatureUnit,
      systolicBP: vital.systolicBP.toString(),
      diastolicBP: vital.diastolicBP.toString(),
      heartRate: vital.heartRate.toString(),
      respiratoryRate: vital.respiratoryRate.toString(),
      oxygenSaturation: vital.oxygenSaturation.toString(),
      bloodGlucose: vital.bloodGlucose?.toString() || '',
      pain: vital.pain?.toString() || '',
      consciousness: vital.consciousness,
      notes: vital.notes || '',
      deviceUsed: vital.deviceUsed || ''
    });
    setSelectedPatient(patients.find(p => p.id === vital.patientId) || null);
    setIsEditMode(true);
    setEditingId(vital.id);
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه القراءة؟')) {
      setVitalSigns(prev => prev.filter(v => v.id !== id));
    }
  };

  const getVitalStatus = (vital: VitalSigns): 'normal' | 'warning' | 'critical' => {
    if (vital.flags.length === 0) return 'normal';
    
    const criticalFlags = ['حمى عالية', 'انخفاض ضغط الدم', 'انخفاض الأكسجين'];
    if (vital.flags.some(flag => criticalFlags.includes(flag))) return 'critical';
    
    return 'warning';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
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

  const filteredVitalSigns = vitalSigns.filter(vital => {
    const matchesSearch = vital.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vital.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    
    const status = getVitalStatus(vital);
    return matchesSearch && status === filterStatus;
  });

  return (
    <div className="p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-xl">
            <Heart className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">نظام العلامات الحيوية</h1>
            <p className="text-muted-foreground">
              متابعة وتسجيل العلامات الحيوية للمرضى
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowTrends(!showTrends)}>
            <BarChart3 className="h-4 w-4 mr-2" />
            {showTrends ? 'إخفاء المخططات' : 'عرض المخططات'}
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                إضافة قراءة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? 'تعديل العلامات الحيوية' : 'إضافة علامات حيوية جديدة'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Patient Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patient">المريض *</Label>
                    <Select 
                      value={form.patientId} 
                      onValueChange={(value) => {
                        setForm(prev => ({ ...prev, patientId: value }));
                        setSelectedPatient(patients.find(p => p.id === value) || null);
                        setErrors(prev => ({ ...prev, patientId: '' }));
                      }}
                    >
                      <SelectTrigger className={errors.patientId ? 'border-red-500' : ''}>
                        <SelectValue placeholder="اختر المريض" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            <div className="flex items-center gap-2">
                              <span>{patient.name}</span>
                              <Badge variant="outline">غرفة {patient.roomNumber}{patient.bedNumber}</Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.patientId && (
                      <p className="text-red-500 text-sm mt-1">{errors.patientId}</p>
                    )}
                  </div>

                  {selectedPatient && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">معلومات المريض</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-muted-foreground">العمر:</span> {selectedPatient.age} سنة</p>
                        <p><span className="text-muted-foreground">الغرفة:</span> {selectedPatient.roomNumber}{selectedPatient.bedNumber}</p>
                        <p><span className="text-muted-foreground">الحالة:</span> {selectedPatient.condition}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Vital Signs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Temperature */}
                  <div>
                    <Label htmlFor="temperature">درجة الحرارة *</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="36.5"
                        value={form.temperature}
                        onChange={(e) => {
                          setForm(prev => ({ ...prev, temperature: e.target.value }));
                          setErrors(prev => ({ ...prev, temperature: '' }));
                        }}
                        className={errors.temperature ? 'border-red-500' : ''}
                      />
                      <Select 
                        value={form.temperatureUnit} 
                        onValueChange={(value) => setForm(prev => ({ ...prev, temperatureUnit: value as 'C' | 'F' }))}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="C">°C</SelectItem>
                          <SelectItem value="F">°F</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {errors.temperature && (
                      <p className="text-red-500 text-sm mt-1">{errors.temperature}</p>
                    )}
                  </div>

                  {/* Blood Pressure */}
                  <div>
                    <Label>ضغط الدم *</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="120"
                        value={form.systolicBP}
                        onChange={(e) => {
                          setForm(prev => ({ ...prev, systolicBP: e.target.value }));
                          setErrors(prev => ({ ...prev, systolicBP: '' }));
                        }}
                        className={errors.systolicBP ? 'border-red-500' : ''}
                      />
                      <span className="flex items-center">/</span>
                      <Input
                        type="number"
                        placeholder="80"
                        value={form.diastolicBP}
                        onChange={(e) => {
                          setForm(prev => ({ ...prev, diastolicBP: e.target.value }));
                          setErrors(prev => ({ ...prev, diastolicBP: '' }));
                        }}
                        className={errors.diastolicBP ? 'border-red-500' : ''}
                      />
                    </div>
                    {(errors.systolicBP || errors.diastolicBP) && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.systolicBP || errors.diastolicBP}
                      </p>
                    )}
                  </div>

                  {/* Heart Rate */}
                  <div>
                    <Label htmlFor="heartRate">معدل النبض * (bpm)</Label>
                    <Input
                      type="number"
                      placeholder="72"
                      value={form.heartRate}
                      onChange={(e) => {
                        setForm(prev => ({ ...prev, heartRate: e.target.value }));
                        setErrors(prev => ({ ...prev, heartRate: '' }));
                      }}
                      className={errors.heartRate ? 'border-red-500' : ''}
                    />
                    {errors.heartRate && (
                      <p className="text-red-500 text-sm mt-1">{errors.heartRate}</p>
                    )}
                  </div>

                  {/* Respiratory Rate */}
                  <div>
                    <Label htmlFor="respiratoryRate">معدل التنفس * (/min)</Label>
                    <Input
                      type="number"
                      placeholder="16"
                      value={form.respiratoryRate}
                      onChange={(e) => {
                        setForm(prev => ({ ...prev, respiratoryRate: e.target.value }));
                        setErrors(prev => ({ ...prev, respiratoryRate: '' }));
                      }}
                      className={errors.respiratoryRate ? 'border-red-500' : ''}
                    />
                    {errors.respiratoryRate && (
                      <p className="text-red-500 text-sm mt-1">{errors.respiratoryRate}</p>
                    )}
                  </div>

                  {/* Oxygen Saturation */}
                  <div>
                    <Label htmlFor="oxygenSaturation">نسبة الأكسجين * (%)</Label>
                    <Input
                      type="number"
                      placeholder="98"
                      value={form.oxygenSaturation}
                      onChange={(e) => {
                        setForm(prev => ({ ...prev, oxygenSaturation: e.target.value }));
                        setErrors(prev => ({ ...prev, oxygenSaturation: '' }));
                      }}
                      className={errors.oxygenSaturation ? 'border-red-500' : ''}
                    />
                    {errors.oxygenSaturation && (
                      <p className="text-red-500 text-sm mt-1">{errors.oxygenSaturation}</p>
                    )}
                  </div>

                  {/* Blood Glucose */}
                  <div>
                    <Label htmlFor="bloodGlucose">سكر الدم (mg/dL)</Label>
                    <Input
                      type="number"
                      placeholder="110"
                      value={form.bloodGlucose}
                      onChange={(e) => setForm(prev => ({ ...prev, bloodGlucose: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Additional Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Pain Scale */}
                  <div>
                    <Label htmlFor="pain">مقياس الألم (1-10)</Label>
                    <Select 
                      value={form.pain} 
                      onValueChange={(value) => setForm(prev => ({ ...prev, pain: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر مستوى الألم" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(10)].map((_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1} - {i < 3 ? 'خفيف' : i < 7 ? 'متوسط' : 'شديد'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Consciousness */}
                  <div>
                    <Label htmlFor="consciousness">مستوى الوعي</Label>
                    <Select 
                      value={form.consciousness} 
                      onValueChange={(value) => setForm(prev => ({ ...prev, consciousness: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alert">متيقظ</SelectItem>
                        <SelectItem value="drowsy">نعسان</SelectItem>
                        <SelectItem value="confused">مشوش</SelectItem>
                        <SelectItem value="unconscious">فاقد الوعي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Device Used */}
                <div>
                  <Label htmlFor="deviceUsed">الجهاز المستخدم</Label>
                  <Input
                    placeholder="مثال: Philips Monitor PM-100"
                    value={form.deviceUsed}
                    onChange={(e) => setForm(prev => ({ ...prev, deviceUsed: e.target.value }))}
                  />
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes">ملاحظات إضافية</Label>
                  <Textarea
                    placeholder="أي ملاحظات حول حالة المريض أو القراءات..."
                    value={form.notes}
                    onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                    disabled={saving}
                  >
                    <X className="h-4 w-4 mr-2" />
                    إلغاء
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {isEditMode ? 'تحديث' : 'حفظ'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث في القراءات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع القراءات</SelectItem>
            <SelectItem value="normal">طبيعية</SelectItem>
            <SelectItem value="warning">تحتاج متابعة</SelectItem>
            <SelectItem value="critical">حرجة</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Trends Chart */}
      <AnimatePresence>
        {showTrends && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  اتجاهات العلامات الحيوية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={(value) => new Date(value).toLocaleTimeString('ar-EG')}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(value) => new Date(value).toLocaleString('ar-EG')}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="temperature" 
                        stroke="#ef4444" 
                        name="درجة الحرارة"
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="heartRate" 
                        stroke="#3b82f6" 
                        name="النبض"
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="systolicBP" 
                        stroke="#10b981" 
                        name="الضغط الانقباضي"
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="oxygenSaturation" 
                        stroke="#f59e0b" 
                        name="الأكسجين"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vital Signs List */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : filteredVitalSigns.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">لا توجد قراءات</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterStatus !== 'all' 
                  ? 'لا توجد قراءات تطابق البحث' 
                  : 'لم يتم تسجيل أي علامات حيوية بعد'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredVitalSigns.map((vital, index) => {
            const status = getVitalStatus(vital);
            return (
              <motion.div
                key={vital.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          status === 'critical' ? 'bg-red-100 text-red-600' :
                          status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          <Heart className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{vital.patientName}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>غرفة {vital.roomNumber}</span>
                            <Clock className="h-3 w-3 ml-2" />
                            <span>{formatTime(vital.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {vital.flags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {vital.flags.map((flag, i) => (
                              <Badge 
                                key={i} 
                                variant="destructive" 
                                className="text-xs"
                              >
                                <AlertTriangle className="h-2 w-2 mr-1" />
                                {flag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <Badge className={getStatusColor(status)}>
                          {status === 'normal' ? 'طبيعي' :
                           status === 'warning' ? 'تحتاج متابعة' : 'حرج'}
                        </Badge>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(vital)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(vital.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <Thermometer className="h-5 w-5 text-red-600 mx-auto mb-1" />
                        <p className="text-sm text-muted-foreground">درجة الحرارة</p>
                        <p className="font-bold text-lg">{vital.temperature}°{vital.temperatureUnit}</p>
                      </div>

                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Activity className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                        <p className="text-sm text-muted-foreground">ضغط الدم</p>
                        <p className="font-bold text-lg">{vital.systolicBP}/{vital.diastolicBP}</p>
                      </div>

                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <Heart className="h-5 w-5 text-green-600 mx-auto mb-1" />
                        <p className="text-sm text-muted-foreground">النبض</p>
                        <p className="font-bold text-lg">{vital.heartRate} bpm</p>
                      </div>

                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <Wind className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                        <p className="text-sm text-muted-foreground">التنفس</p>
                        <p className="font-bold text-lg">{vital.respiratoryRate}/min</p>
                      </div>

                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <Droplets className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
                        <p className="text-sm text-muted-foreground">الأكسجين</p>
                        <p className="font-bold text-lg">{vital.oxygenSaturation}%</p>
                      </div>

                      {vital.pain && (
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                          <p className="text-sm text-muted-foreground">الألم</p>
                          <p className="font-bold text-lg">{vital.pain}/10</p>
                        </div>
                      )}
                    </div>

                    {(vital.notes || vital.deviceUsed) && (
                      <div className="border-t pt-4">
                        {vital.notes && (
                          <p className="text-sm text-muted-foreground mb-2">
                            <strong>ملاحظات:</strong> {vital.notes}
                          </p>
                        )}
                        {vital.deviceUsed && (
                          <p className="text-sm text-muted-foreground">
                            <strong>الجهاز:</strong> {vital.deviceUsed}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-muted-foreground">
                            تم التسجيل بواسطة: {vital.nurseName}
                          </p>
                          {vital.verified ? (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              مُتحقق منه
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                              <Clock className="h-3 w-3 mr-1" />
                              في انتظار التحقق
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </div>
  );
}