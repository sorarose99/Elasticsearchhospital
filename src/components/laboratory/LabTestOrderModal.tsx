import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Search, 
  Plus, 
  Minus,
  Beaker, 
  Microscope, 
  AlertTriangle, 
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  User,
  Calendar,
  Activity,
  Target,
  Zap,
  X,
  ArrowLeft,
  ArrowRight,
  Save,
  Printer,
  Send,
  AlertCircle,
  Info,
  DollarSign,
  Timer,
  TestTube
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';
import { getInitials } from '../../utils/stringHelpers';

interface LabTest {
  id: string;
  code: string;
  name: string;
  category: string;
  specimen: 'blood' | 'urine' | 'stool' | 'sputum' | 'tissue' | 'other';
  processingTime: number;
  normalRange: {
    min?: number;
    max?: number;
    unit: string;
    text?: string;
  };
  price: number;
  preparation?: string;
  description?: string;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  phone: string;
  avatar?: string;
  medicalNumber: string;
  dateOfBirth: string;
  address?: string;
  insuranceId?: string;
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
}

interface SelectedTest {
  testId: string;
  test: LabTest;
  urgent: boolean;
  stat: boolean;
  fasting: boolean;
  notes: string;
}

interface LabTestOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableTests: LabTest[];
  patients?: Patient[];
  doctors?: Doctor[];
  onSubmit: (orderData: any) => void;
  isDemoMode?: boolean;
}

const LabTestOrderModal: React.FC<LabTestOrderModalProps> = ({
  isOpen,
  onClose,
  availableTests,
  patients = [],
  doctors = [],
  onSubmit,
  isDemoMode = false
}) => {
  const { t, language, isRTL } = useLanguage();
  const { effectiveTheme } = useTheme();

  // Form states
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTests, setSelectedTests] = useState<SelectedTest[]>([]);
  const [orderPriority, setOrderPriority] = useState<'routine' | 'urgent' | 'stat'>('routine');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [patientSearch, setPatientSearch] = useState('');
  const [testSearch, setTestSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [collectionDate, setCollectionDate] = useState(new Date().toISOString().split('T')[0]);
  const [urgentJustification, setUrgentJustification] = useState('');
  const [expectedDelivery, setExpectedDelivery] = useState('');

  // Demo data
  const demoPatients: Patient[] = useMemo(() => [
    {
      id: 'patient1',
      firstName: 'أحمد',
      lastName: 'محمد',
      age: 45,
      gender: 'male',
      phone: '+966501234567',
      medicalNumber: 'MED-001',
      dateOfBirth: '1979-01-15',
      address: 'الرياض، المملكة العربية السعودية',
      insuranceId: 'INS-001'
    },
    {
      id: 'patient2',
      firstName: 'فاطمة',
      lastName: 'علي',
      age: 32,
      gender: 'female',
      phone: '+966501234568',
      medicalNumber: 'MED-002',
      dateOfBirth: '1992-05-20',
      address: 'جدة، المملكة العربية السعودية',
      insuranceId: 'INS-002'
    },
    {
      id: 'patient3',
      firstName: 'علي',
      lastName: 'أحمد',
      age: 38,
      gender: 'male',
      phone: '+966501234569',
      medicalNumber: 'MED-003',
      dateOfBirth: '1986-03-10',
      address: 'الدمام، المملكة العربية السعودية'
    }
  ], []);

  const demoDoctors: Doctor[] = useMemo(() => [
    {
      id: 'doctor1',
      name: 'د. سارة أحمد',
      specialization: 'طب عام'
    },
    {
      id: 'doctor2',
      name: 'د. محمد حسن',
      specialization: 'النساء والولادة'
    },
    {
      id: 'doctor3',
      name: 'د. أحمد الطبيب',
      specialization: 'الباطنة'
    }
  ], []);

  const activePatients = isDemoMode ? demoPatients : patients;
  const activeDoctors = isDemoMode ? demoDoctors : doctors;

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSelectedPatient(null);
      setSelectedDoctor(null);
      setSelectedTests([]);
      setOrderPriority('routine');
      setClinicalNotes('');
      setPatientSearch('');
      setTestSearch('');
      setSelectedCategory('all');
      setShowPatientForm(false);
      setCollectionDate(new Date().toISOString().split('T')[0]);
      setUrgentJustification('');
      setExpectedDelivery('');
    }
  }, [isOpen]);

  // Filter functions
  const filteredPatients = useMemo(() => {
    return activePatients.filter(patient =>
      patient.firstName.toLowerCase().includes(patientSearch.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(patientSearch.toLowerCase()) ||
      patient.medicalNumber.toLowerCase().includes(patientSearch.toLowerCase()) ||
      patient.phone.includes(patientSearch)
    );
  }, [activePatients, patientSearch]);

  const filteredTests = useMemo(() => {
    return availableTests.filter(test => {
      const matchesSearch = testSearch === '' ||
        test.name.toLowerCase().includes(testSearch.toLowerCase()) ||
        test.code.toLowerCase().includes(testSearch.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [availableTests, testSearch, selectedCategory]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(availableTests.map(test => test.category))];
    return uniqueCategories;
  }, [availableTests]);

  // Calculate total cost and processing time
  const orderSummary = useMemo(() => {
    const totalCost = selectedTests.reduce((sum, item) => sum + item.test.price, 0);
    const maxProcessingTime = Math.max(...selectedTests.map(item => item.test.processingTime), 0);
    const urgentTests = selectedTests.filter(item => item.urgent || item.stat).length;
    
    return {
      totalCost,
      maxProcessingTime,
      urgentTests,
      totalTests: selectedTests.length
    };
  }, [selectedTests]);

  // Handle test selection
  const handleTestSelect = (test: LabTest, checked: boolean) => {
    if (checked) {
      setSelectedTests(prev => [...prev, {
        testId: test.id,
        test,
        urgent: false,
        stat: false,
        fasting: test.code === 'FBS' || test.preparation?.includes('فasting'),
        notes: ''
      }]);
    } else {
      setSelectedTests(prev => prev.filter(item => item.testId !== test.id));
    }
  };

  // Update test properties
  const updateTestProperty = (testId: string, property: keyof SelectedTest, value: any) => {
    setSelectedTests(prev => prev.map(item =>
      item.testId === testId ? { ...item, [property]: value } : item
    ));
  };

  // Calculate expected delivery date
  useEffect(() => {
    if (orderSummary.maxProcessingTime > 0) {
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + Math.ceil(orderSummary.maxProcessingTime / 24));
      setExpectedDelivery(deliveryDate.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US'));
    }
  }, [orderSummary.maxProcessingTime, language]);

  // Form validation
  const canProceedToStep = (step: number) => {
    switch (step) {
      case 1: return selectedPatient !== null;
      case 2: return selectedDoctor !== null;
      case 3: return selectedTests.length > 0;
      case 4: return true; // Review step
      default: return false;
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    const orderData = {
      patient: selectedPatient,
      doctor: selectedDoctor,
      tests: selectedTests,
      priority: orderPriority,
      clinicalNotes,
      collectionDate,
      urgentJustification,
      orderDate: new Date().toISOString(),
      expectedDelivery,
      totalCost: orderSummary.totalCost,
      estimatedProcessingTime: orderSummary.maxProcessingTime
    };

    onSubmit(orderData);
    onClose();
  };

  // Navigation functions
  const nextStep = () => {
    if (currentStep < 4 && canProceedToStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Step indicator component
  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              step === currentStep
                ? 'bg-primary text-primary-foreground'
                : step < currentStep
                ? 'bg-green-500 text-white'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {step < currentStep ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              step
            )}
          </div>
          {step < 4 && (
            <div
              className={`w-16 h-1 mx-2 rounded ${
                step < currentStep ? 'bg-green-500' : 'bg-muted'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed inset-0 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4">
          <div className="w-full max-w-6xl bg-background rounded-lg shadow-xl border">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TestTube className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">{t('lab.newOrder')}</h1>
                  <p className="text-sm text-muted-foreground">
                    {t('lab.createNewTestOrder')}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Step Indicator */}
            <div className="p-6 border-b">
              <StepIndicator />
              <div className="text-center">
                <h2 className="text-lg font-medium">
                  {currentStep === 1 && t('lab.selectPatient')}
                  {currentStep === 2 && t('lab.selectDoctor')}
                  {currentStep === 3 && t('lab.selectTests')}
                  {currentStep === 4 && t('lab.reviewOrder')}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('lab.step')} {currentStep} {t('lab.of')} 4
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="min-h-[500px]">
                {/* Step 1: Patient Selection */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={t('patients.searchPatients')}
                          value={patientSearch}
                          onChange={(e) => setPatientSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Button 
                        variant="outline"
                        onClick={() => setShowPatientForm(true)}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        {t('patients.addNew')}
                      </Button>
                    </div>

                    <ScrollArea className="h-[400px]">
                      <div className="grid gap-4">
                        {filteredPatients.map((patient) => (
                          <Card
                            key={patient.id}
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              selectedPatient?.id === patient.id
                                ? 'ring-2 ring-primary bg-primary/5'
                                : ''
                            }`}
                            onClick={() => setSelectedPatient(patient)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={patient.avatar} />
                                  <AvatarFallback>
                                    {getInitials(patient.firstName, patient.lastName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <h3 className="font-medium">
                                    {patient.firstName} {patient.lastName}
                                  </h3>
                                  <div className="text-sm text-muted-foreground space-y-1">
                                    <p>{t('patients.medicalNumber')}: {patient.medicalNumber}</p>
                                    <p>{t('patients.age')}: {patient.age} {t('patients.years')} • {t(`patients.${patient.gender}`)}</p>
                                    <p>{t('patients.phone')}: {patient.phone}</p>
                                    {patient.insuranceId && (
                                      <p>{t('patients.insurance')}: {patient.insuranceId}</p>
                                    )}
                                  </div>
                                </div>
                                {selectedPatient?.id === patient.id && (
                                  <CheckCircle className="h-5 w-5 text-primary" />
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}

                {/* Step 2: Doctor Selection */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <Card className="border-primary/20 bg-primary/5">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={selectedPatient?.avatar} />
                            <AvatarFallback>
                              {getInitials(selectedPatient?.firstName, selectedPatient?.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {selectedPatient?.firstName} {selectedPatient?.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {selectedPatient?.medicalNumber}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <ScrollArea className="h-[350px]">
                      <div className="grid gap-4">
                        {activeDoctors.map((doctor) => (
                          <Card
                            key={doctor.id}
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              selectedDoctor?.id === doctor.id
                                ? 'ring-2 ring-primary bg-primary/5'
                                : ''
                            }`}
                            onClick={() => setSelectedDoctor(doctor)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                  <User className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-medium">{doctor.name}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {doctor.specialization}
                                  </p>
                                </div>
                                {selectedDoctor?.id === doctor.id && (
                                  <CheckCircle className="h-5 w-5 text-primary" />
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}

                {/* Step 3: Test Selection */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    {/* Selected Patient & Doctor Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="border-primary/20 bg-primary/5">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={selectedPatient?.avatar} />
                              <AvatarFallback className="text-xs">
                                {getInitials(selectedPatient?.firstName, selectedPatient?.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {selectedPatient?.firstName} {selectedPatient?.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {selectedPatient?.medicalNumber}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-primary/20 bg-primary/5">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{selectedDoctor?.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {selectedDoctor?.specialization}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Test Search and Filters */}
                    <div className="flex gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={t('lab.searchTests')}
                          value={testSearch}
                          onChange={(e) => setTestSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder={t('lab.category')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('common.allCategories')}</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Selected Tests Summary */}
                    {selectedTests.length > 0 && (
                      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-green-800 dark:text-green-200">
                              {t('lab.selectedTests')} ({selectedTests.length})
                            </h4>
                            <div className="text-sm text-green-700 dark:text-green-300">
                              {t('lab.totalCost')}: {orderSummary.totalCost} {t('common.currency')}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {selectedTests.map((item) => (
                              <Badge 
                                key={item.testId}
                                variant="secondary"
                                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              >
                                {item.test.name} ({item.test.code})
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="ml-1 h-4 w-4 p-0 hover:bg-green-200 dark:hover:bg-green-800"
                                  onClick={() => handleTestSelect(item.test, false)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Available Tests */}
                    <ScrollArea className="h-[300px]">
                      <div className="grid gap-3">
                        {filteredTests.map((test) => {
                          const isSelected = selectedTests.some(item => item.testId === test.id);
                          return (
                            <Card
                              key={test.id}
                              className={`transition-all ${
                                isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:shadow-md'
                              }`}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={(checked) => 
                                      handleTestSelect(test, checked as boolean)
                                    }
                                    className="mt-1"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h4 className="font-medium">{test.name}</h4>
                                      <Badge variant="outline">{test.code}</Badge>
                                      <Badge variant="secondary" className="text-xs">
                                        {test.category}
                                      </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <TestTube className="h-3 w-3" />
                                        {t(`lab.specimen.${test.specimen}`)}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Timer className="h-3 w-3" />
                                        {test.processingTime}h
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <DollarSign className="h-3 w-3" />
                                        {test.price} {t('common.currency')}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Target className="h-3 w-3" />
                                        {test.normalRange.text || `${test.normalRange.min}-${test.normalRange.max} ${test.normalRange.unit}`}
                                      </div>
                                    </div>
                                    {test.preparation && (
                                      <div className="mt-2">
                                        <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-800 border-yellow-200">
                                          <AlertTriangle className="h-3 w-3 mr-1" />
                                          {test.preparation}
                                        </Badge>
                                      </div>
                                    )}
                                    {test.description && (
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {test.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </div>
                )}

                {/* Step 4: Review Order */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    {/* Order Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Patient & Doctor Info */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">{t('lab.orderDetails')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              {t('patients.patient')}
                            </Label>
                            <div className="flex items-center gap-3 mt-1">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={selectedPatient?.avatar} />
                                <AvatarFallback className="text-xs">
                                  {getInitials(selectedPatient?.firstName, selectedPatient?.lastName)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">
                                  {selectedPatient?.firstName} {selectedPatient?.lastName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {selectedPatient?.medicalNumber} • {selectedPatient?.age} {t('patients.years')}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              {t('appointments.doctor')}
                            </Label>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{selectedDoctor?.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {selectedDoctor?.specialization}
                                </p>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{t('lab.collectionDate')}:</span>
                              <span>{new Date(collectionDate).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>{t('lab.expectedDelivery')}:</span>
                              <span>{expectedDelivery}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>{t('lab.priority')}:</span>
                              <Badge variant={orderPriority === 'stat' ? 'destructive' : orderPriority === 'urgent' ? 'default' : 'secondary'}>
                                {t(`lab.${orderPriority}`)}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Order Summary */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">{t('lab.orderSummary')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                              <div className="text-lg font-semibold text-blue-600">
                                {orderSummary.totalTests}
                              </div>
                              <div className="text-xs text-blue-600">{t('lab.totalTests')}</div>
                            </div>
                            <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                              <div className="text-lg font-semibold text-green-600">
                                {orderSummary.totalCost}
                              </div>
                              <div className="text-xs text-green-600">{t('lab.totalCost')} ({t('common.currency')})</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                              <div className="text-lg font-semibold text-orange-600">
                                {orderSummary.maxProcessingTime}h
                              </div>
                              <div className="text-xs text-orange-600">{t('lab.processingTime')}</div>
                            </div>
                            <div className="text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                              <div className="text-lg font-semibold text-red-600">
                                {orderSummary.urgentTests}
                              </div>
                              <div className="text-xs text-red-600">{t('lab.urgentTests')}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Selected Tests List */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">
                          {t('lab.selectedTests')} ({selectedTests.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[200px]">
                          <div className="space-y-3">
                            {selectedTests.map((item, index) => (
                              <div
                                key={item.testId}
                                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-sm font-medium">{item.test.name}</h4>
                                    <Badge variant="outline" className="text-xs">
                                      {item.test.code}
                                    </Badge>
                                    {item.fasting && (
                                      <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-800 border-yellow-200">
                                        {t('lab.fasting')}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span>{t(`lab.specimen.${item.test.specimen}`)}</span>
                                    <span>{item.test.processingTime}h</span>
                                    <span>{item.test.price} {t('common.currency')}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>

                    {/* Order Settings */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">{t('lab.orderSettings')}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="collection-date">{t('lab.collectionDate')}</Label>
                            <Input
                              id="collection-date"
                              type="date"
                              value={collectionDate}
                              onChange={(e) => setCollectionDate(e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label>{t('lab.priority')}</Label>
                            <RadioGroup
                              value={orderPriority}
                              onValueChange={(value: 'routine' | 'urgent' | 'stat') => setOrderPriority(value)}
                              className="flex gap-6 mt-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="routine" id="routine" />
                                <Label htmlFor="routine" className="text-sm">{t('lab.routine')}</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="urgent" id="urgent" />
                                <Label htmlFor="urgent" className="text-sm">{t('lab.urgent')}</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="stat" id="stat" />
                                <Label htmlFor="stat" className="text-sm">{t('lab.stat')}</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>

                        {(orderPriority === 'urgent' || orderPriority === 'stat') && (
                          <div>
                            <Label htmlFor="urgent-justification">
                              {t('lab.urgentJustification')} *
                            </Label>
                            <Textarea
                              id="urgent-justification"
                              placeholder={t('lab.urgentJustificationPlaceholder')}
                              value={urgentJustification}
                              onChange={(e) => setUrgentJustification(e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        )}

                        <div>
                          <Label htmlFor="clinical-notes">{t('lab.clinicalNotes')}</Label>
                          <Textarea
                            id="clinical-notes"
                            placeholder={t('lab.clinicalNotesPlaceholder')}
                            value={clinicalNotes}
                            onChange={(e) => setClinicalNotes(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t bg-muted/20">
              <div className="flex items-center gap-4">
                {currentStep > 1 && (
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('common.previous')}
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={onClose}>
                  {t('common.cancel')}
                </Button>
                
                {currentStep < 4 ? (
                  <Button 
                    onClick={nextStep}
                    disabled={!canProceedToStep(currentStep)}
                    className="flex items-center gap-2"
                  >
                    {t('common.next')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {t('common.saveAsDraft')}
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      className="flex items-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      {t('lab.submitOrder')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabTestOrderModal;