import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { DatePicker } from '../ui/date-picker';
import { Progress } from '../ui/progress';
import { 
  User, Phone, Mail, MapPin, Heart, Shield, Pill, History,
  Plus, X, Upload, Camera, Calendar, AlertTriangle, 
  CheckCircle, Users, FileText, Save, ArrowLeft, ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';

interface PatientFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  arabicFirstName: string;
  arabicLastName: string;
  dateOfBirth: Date | undefined;
  gender: 'male' | 'female' | 'other' | '';
  nationalId: string;
  mrn: string;
  nationality: string;
  maritalStatus: string;
  
  // Contact Information
  phone: string;
  alternativePhone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  emergencyContactAddress: string;
  
  // Medical Information
  bloodType: string;
  height: string;
  weight: string;
  allergies: string[];
  medications: string[];
  medicalHistory: string[];
  familyHistory: string[];
  surgicalHistory: string[];
  chronicDiseases: string[];
  
  // Insurance Information
  hasInsurance: boolean;
  insuranceProvider: string;
  policyNumber: string;
  groupNumber: string;
  membershipNumber: string;
  insuranceClass: string;
  
  // Additional Information
  occupation: string;
  employer: string;
  preferredLanguage: string;
  smokingStatus: string;
  alcoholConsumption: string;
  notes: string;
  avatar: string | null;
}

interface AddPatientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PatientFormData) => void;
  isLoading?: boolean;
}

const AddPatientForm: React.FC<AddPatientFormProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading = false 
}) => {
  const { t, language, isRTL } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  
  const [formData, setFormData] = useState<PatientFormData>({
    firstName: '',
    lastName: '',
    arabicFirstName: '',
    arabicLastName: '',
    dateOfBirth: undefined,
    gender: '',
    nationalId: '',
    mrn: '',
    nationality: 'السعودية',
    maritalStatus: '',
    
    phone: '',
    alternativePhone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    emergencyContactAddress: '',
    
    bloodType: '',
    height: '',
    weight: '',
    allergies: [],
    medications: [],
    medicalHistory: [],
    familyHistory: [],
    surgicalHistory: [],
    chronicDiseases: [],
    
    hasInsurance: false,
    insuranceProvider: '',
    policyNumber: '',
    groupNumber: '',
    membershipNumber: '',
    insuranceClass: '',
    
    occupation: '',
    employer: '',
    preferredLanguage: 'العربية',
    smokingStatus: '',
    alcoholConsumption: '',
    notes: '',
    avatar: null
  });

  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [newMedicalHistory, setNewMedicalHistory] = useState('');
  const [newFamilyHistory, setNewFamilyHistory] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Generate automatic MRN
  React.useEffect(() => {
    if (!formData.mrn) {
      const mrn = `MRN${Date.now().toString().slice(-6)}`;
      setFormData(prev => ({ ...prev, mrn }));
    }
  }, []);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1: // Personal Information
        if (!formData.firstName.trim()) newErrors.firstName = t('patient.form.error.firstName');
        if (!formData.lastName.trim()) newErrors.lastName = t('patient.form.error.lastName');
        if (!formData.dateOfBirth) newErrors.dateOfBirth = t('patient.form.error.dateOfBirth');
        if (!formData.gender) newErrors.gender = t('patient.form.error.gender');
        if (!formData.nationalId.trim()) newErrors.nationalId = t('patient.form.error.nationalId');
        break;
        
      case 2: // Contact Information
        if (!formData.phone.trim()) newErrors.phone = t('patient.form.error.phone');
        if (!formData.address.trim()) newErrors.address = t('patient.form.error.address');
        if (!formData.city.trim()) newErrors.city = t('patient.form.error.city');
        break;
        
      case 3: // Emergency Contact
        if (!formData.emergencyContactName.trim()) newErrors.emergencyContactName = t('patient.form.error.emergencyName');
        if (!formData.emergencyContactPhone.trim()) newErrors.emergencyContactPhone = t('patient.form.error.emergencyPhone');
        if (!formData.emergencyContactRelationship.trim()) newErrors.emergencyContactRelationship = t('patient.form.error.emergencyRelationship');
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onSubmit(formData);
    }
  };

  const addToList = (listName: keyof PatientFormData, value: string, setValue: (value: string) => void) => {
    if (value.trim()) {
      const currentList = formData[listName] as string[];
      setFormData(prev => ({
        ...prev,
        [listName]: [...currentList, value.trim()]
      }));
      setValue('');
    }
  };

  const removeFromList = (listName: keyof PatientFormData, index: number) => {
    const currentList = formData[listName] as string[];
    setFormData(prev => ({
      ...prev,
      [listName]: currentList.filter((_, i) => i !== index)
    }));
  };

  const getStepTitle = (step: number): string => {
    const titles = [
      '',
      t('patient.form.personalInfo'),
      t('patient.form.contactInfo'),
      t('patient.form.emergencyContact'),
      t('patient.form.medicalInfo'),
      t('patient.form.insuranceInfo')
    ];
    return titles[step] || '';
  };

  const progress = (currentStep / totalSteps) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-background rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{t('patient.form.title')}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{t('patient.form.step')} {currentStep} {t('patient.form.of')} {totalSteps}</span>
              <span>{getStepTitle(currentStep)}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {t('patient.form.basicInfo')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Profile Picture */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={formData.avatar || ''} />
                      <AvatarFallback>
                        <Camera className="h-8 w-8 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        {t('patient.form.uploadPhoto')}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('patient.form.optional')}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Names */}
                    <div>
                      <Label htmlFor="firstName">
                        {t('patient.form.firstName')} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="Ahmed"
                        className={errors.firstName ? 'border-red-500' : ''}
                      />
                      {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="lastName">
                        {t('patient.form.lastName')} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Mohamed"
                        className={errors.lastName ? 'border-red-500' : ''}
                      />
                      {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                    </div>

                    <div>
                      <Label htmlFor="arabicFirstName">{t('patient.form.arabicFirstName')}</Label>
                      <Input
                        id="arabicFirstName"
                        value={formData.arabicFirstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, arabicFirstName: e.target.value }))}
                        placeholder="أحمد"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="arabicLastName">{t('patient.form.arabicLastName')}</Label>
                      <Input
                        id="arabicLastName"
                        value={formData.arabicLastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, arabicLastName: e.target.value }))}
                        placeholder="محمد"
                      />
                    </div>

                    {/* Birth Date and Gender */}
                    <div>
                      <Label>
                        {t('patient.form.dateOfBirth')} <span className="text-red-500">*</span>
                      </Label>
                      <DatePicker 
                        date={formData.dateOfBirth}
                        onDateChange={(date) => setFormData(prev => ({ ...prev, dateOfBirth: date }))}
                        placeholder={t('patient.form.selectDate')}
                        className={errors.dateOfBirth ? 'border-red-500' : ''}
                      />
                      {errors.dateOfBirth && <p className="text-xs text-red-500 mt-1">{errors.dateOfBirth}</p>}
                    </div>

                    <div>
                      <Label>
                        {t('patient.form.gender')} <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={formData.gender} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value as any }))}
                      >
                        <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                          <SelectValue placeholder={t('patient.form.selectGender')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">{t('patient.form.male')}</SelectItem>
                          <SelectItem value="female">{t('patient.form.female')}</SelectItem>
                          <SelectItem value="other">{t('patient.form.other')}</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
                    </div>

                    {/* ID and MRN */}
                    <div>
                      <Label htmlFor="nationalId">
                        {t('patient.form.nationalId')} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="nationalId"
                        value={formData.nationalId}
                        onChange={(e) => setFormData(prev => ({ ...prev, nationalId: e.target.value }))}
                        placeholder="1234567890"
                        className={errors.nationalId ? 'border-red-500' : ''}
                      />
                      {errors.nationalId && <p className="text-xs text-red-500 mt-1">{errors.nationalId}</p>}
                    </div>

                    <div>
                      <Label htmlFor="mrn">{t('patient.form.mrn')}</Label>
                      <Input
                        id="mrn"
                        value={formData.mrn}
                        onChange={(e) => setFormData(prev => ({ ...prev, mrn: e.target.value }))}
                        placeholder={t('patient.form.autoGenerated')}
                        disabled
                      />
                    </div>

                    {/* Nationality and Marital Status */}
                    <div>
                      <Label>{t('patient.form.nationality')}</Label>
                      <Select 
                        value={formData.nationality} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, nationality: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="السعودية">السعودية</SelectItem>
                          <SelectItem value="الإمارات">الإمارات</SelectItem>
                          <SelectItem value="الكويت">الكويت</SelectItem>
                          <SelectItem value="قطر">قطر</SelectItem>
                          <SelectItem value="البحرين">البحرين</SelectItem>
                          <SelectItem value="عمان">عمان</SelectItem>
                          <SelectItem value="الأردن">الأردن</SelectItem>
                          <SelectItem value="لبنان">لبنان</SelectItem>
                          <SelectItem value="مصر">مصر</SelectItem>
                          <SelectItem value="أخرى">أخرى</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>{t('patient.form.maritalStatus')}</Label>
                      <Select 
                        value={formData.maritalStatus} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, maritalStatus: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('patient.form.selectMaritalStatus')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="أعزب">{t('patient.form.single')}</SelectItem>
                          <SelectItem value="متزوج">{t('patient.form.married')}</SelectItem>
                          <SelectItem value="مطلق">{t('patient.form.divorced')}</SelectItem>
                          <SelectItem value="أرمل">{t('patient.form.widowed')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    {t('patient.form.contactInfo')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">
                        {t('patient.form.phone')} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+966501234567"
                        className={errors.phone ? 'border-red-500' : ''}
                      />
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <Label htmlFor="alternativePhone">{t('patient.form.alternativePhone')}</Label>
                      <Input
                        id="alternativePhone"
                        value={formData.alternativePhone}
                        onChange={(e) => setFormData(prev => ({ ...prev, alternativePhone: e.target.value }))}
                        placeholder="+966501234567"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="email">{t('patient.form.email')}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="ahmed@example.com"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="address">
                        {t('patient.form.address')} <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder={t('patient.form.fullAddress')}
                        className={errors.address ? 'border-red-500' : ''}
                      />
                      {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                    </div>

                    <div>
                      <Label htmlFor="city">
                        {t('patient.form.city')} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        placeholder={language === 'ar' ? 'الرياض' : 'Riyadh'}
                        className={errors.city ? 'border-red-500' : ''}
                      />
                      {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <Label htmlFor="postalCode">{t('patient.form.postalCode')}</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                        placeholder="12345"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Emergency Contact */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {t('patient.form.emergencyContactTitle')}
                  </CardTitle>
                  <CardDescription>
                    {t('patient.form.emergencyContactDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergencyContactName">
                        {t('patient.form.fullName')} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="emergencyContactName"
                        value={formData.emergencyContactName}
                        onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactName: e.target.value }))}
                        placeholder={language === 'ar' ? 'فاطمة أحمد محمد' : 'Fatima Ahmed Mohamed'}
                        className={errors.emergencyContactName ? 'border-red-500' : ''}
                      />
                      {errors.emergencyContactName && <p className="text-xs text-red-500 mt-1">{errors.emergencyContactName}</p>}
                    </div>

                    <div>
                      <Label htmlFor="emergencyContactPhone">
                        {t('patient.form.phone')} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="emergencyContactPhone"
                        value={formData.emergencyContactPhone}
                        onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactPhone: e.target.value }))}
                        placeholder="+966501234567"
                        className={errors.emergencyContactPhone ? 'border-red-500' : ''}
                      />
                      {errors.emergencyContactPhone && <p className="text-xs text-red-500 mt-1">{errors.emergencyContactPhone}</p>}
                    </div>

                    <div>
                      <Label>
                        {t('patient.form.relationship')} <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={formData.emergencyContactRelationship} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, emergencyContactRelationship: value }))}
                      >
                        <SelectTrigger className={errors.emergencyContactRelationship ? 'border-red-500' : ''}>
                          <SelectValue placeholder={t('patient.form.selectRelationship')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={language === 'ar' ? 'زوج/زوجة' : 'Spouse'}>{t('patient.form.spouse')}</SelectItem>
                          <SelectItem value={language === 'ar' ? 'والد' : 'Father'}>{t('patient.form.father')}</SelectItem>
                          <SelectItem value={language === 'ar' ? 'والدة' : 'Mother'}>{t('patient.form.mother')}</SelectItem>
                          <SelectItem value={language === 'ar' ? 'أخ' : 'Brother'}>{t('patient.form.brother')}</SelectItem>
                          <SelectItem value={language === 'ar' ? 'أخت' : 'Sister'}>{t('patient.form.sister')}</SelectItem>
                          <SelectItem value={language === 'ar' ? 'ابن' : 'Son'}>{t('patient.form.son')}</SelectItem>
                          <SelectItem value={language === 'ar' ? 'ابنة' : 'Daughter'}>{t('patient.form.daughter')}</SelectItem>
                          <SelectItem value={language === 'ar' ? 'صديق' : 'Friend'}>{t('patient.form.friend')}</SelectItem>
                          <SelectItem value={language === 'ar' ? 'أخرى' : 'Other'}>{t('patient.form.other')}</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.emergencyContactRelationship && <p className="text-xs text-red-500 mt-1">{errors.emergencyContactRelationship}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="emergencyContactAddress">{t('patient.form.address')}</Label>
                      <Textarea
                        id="emergencyContactAddress"
                        value={formData.emergencyContactAddress}
                        onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactAddress: e.target.value }))}
                        placeholder={t('patient.form.fullAddress')}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Medical Information */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    {t('patient.form.medicalInfo')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Medical Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>فصيلة الدم</Label>
                      <Select 
                        value={formData.bloodType} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, bloodType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر فصيلة الدم" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="height">الطول (سم)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={formData.height}
                        onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                        placeholder="175"
                      />
                    </div>

                    <div>
                      <Label htmlFor="weight">الوزن (كغ)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={formData.weight}
                        onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                        placeholder="70"
                      />
                    </div>
                  </div>

                  {/* Allergies */}
                  <div>
                    <Label className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      الحساسيات
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newAllergy}
                        onChange={(e) => setNewAllergy(e.target.value)}
                        placeholder="أضف حساسية جديدة"
                        onKeyPress={(e) => e.key === 'Enter' && addToList('allergies', newAllergy, setNewAllergy)}
                      />
                      <Button 
                        type="button" 
                        onClick={() => addToList('allergies', newAllergy, setNewAllergy)}
                        size="sm"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.allergies.map((allergy, index) => (
                        <Badge key={index} variant="destructive" className="flex items-center gap-1">
                          {allergy}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeFromList('allergies', index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Current Medications */}
                  <div>
                    <Label className="flex items-center gap-2">
                      <Pill className="h-4 w-4" />
                      {t('patient.form.currentMedications')}
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newMedication}
                        onChange={(e) => setNewMedication(e.target.value)}
                        placeholder={t('patient.form.addMedication')}
                        onKeyPress={(e) => e.key === 'Enter' && addToList('medications', newMedication, setNewMedication)}
                      />
                      <Button 
                        type="button" 
                        onClick={() => addToList('medications', newMedication, setNewMedication)}
                        size="sm"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.medications.map((medication, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {medication}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeFromList('medications', index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Medical History */}
                  <div>
                    <Label className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      {t('patient.form.medicalHistory')}
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newMedicalHistory}
                        onChange={(e) => setNewMedicalHistory(e.target.value)}
                        placeholder={t('patient.form.addCondition')}
                        onKeyPress={(e) => e.key === 'Enter' && addToList('medicalHistory', newMedicalHistory, setNewMedicalHistory)}
                      />
                      <Button 
                        type="button" 
                        onClick={() => addToList('medicalHistory', newMedicalHistory, setNewMedicalHistory)}
                        size="sm"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.medicalHistory.map((condition, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {condition}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeFromList('medicalHistory', index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Lifestyle Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>{t('patient.form.smoking')}</Label>
                      <Select 
                        value={formData.smokingStatus} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, smokingStatus: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('patient.form.selectSmoking')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={language === 'ar' ? 'غير مدخن' : 'Non-smoker'}>{t('patient.form.nonSmoker')}</SelectItem>
                          <SelectItem value={language === 'ar' ? 'مدخن حالياً' : 'Current smoker'}>{t('patient.form.currentSmoker')}</SelectItem>
                          <SelectItem value={language === 'ar' ? 'مدخن سابق' : 'Former smoker'}>{t('patient.form.formerSmoker')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>{t('patient.form.alcohol')}</Label>
                      <Select 
                        value={formData.alcoholConsumption} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, alcoholConsumption: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('patient.form.selectAlcohol')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={language === 'ar' ? 'لا يتناول' : 'Does not consume'}>{t('patient.form.noAlcohol')}</SelectItem>
                          <SelectItem value={language === 'ar' ? 'أحياناً' : 'Occasionally'}>{t('patient.form.occasionally')}</SelectItem>
                          <SelectItem value={language === 'ar' ? 'بانتظام' : 'Regularly'}>{t('patient.form.regularly')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 5: Insurance and Additional Information */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    معلومات التأمين
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasInsurance"
                      checked={formData.hasInsurance}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasInsurance: checked as boolean }))}
                    />
                    <Label htmlFor="hasInsurance">{t('patient.form.hasInsurance')}</Label>
                  </div>

                  {formData.hasInsurance && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label>ش��كة التأمين</Label>
                        <Select 
                          value={formData.insuranceProvider} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, insuranceProvider: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('patient.form.selectInsurance')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="بوبا العربية">بوبا العربية</SelectItem>
                            <SelectItem value="التعاونية">التعاونية</SelectItem>
                            <SelectItem value="ولاء">ولاء</SelectItem>
                            <SelectItem value="ملاذ">ملاذ</SelectItem>
                            <SelectItem value="الأهلي توكالافا">الأهلي توكالافا</SelectItem>
                            <SelectItem value="أخرى">أخرى</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="policyNumber">{t('patient.form.policyNumber')}</Label>
                        <Input
                          id="policyNumber"
                          value={formData.policyNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, policyNumber: e.target.value }))}
                          placeholder="POL123456"
                        />
                      </div>

                      <div>
                        <Label htmlFor="membershipNumber">{t('patient.form.membershipNumber')}</Label>
                        <Input
                          id="membershipNumber"
                          value={formData.membershipNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, membershipNumber: e.target.value }))}
                          placeholder="MEM123456"
                        />
                      </div>

                      <div>
                        <Label>{t('patient.form.insuranceClass')}</Label>
                        <Select 
                          value={formData.insuranceClass} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, insuranceClass: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('patient.form.selectClass')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">{t('patient.form.classA')}</SelectItem>
                            <SelectItem value="B">{t('patient.form.classB')}</SelectItem>
                            <SelectItem value="C">{t('patient.form.classC')}</SelectItem>
                            <SelectItem value="VIP">{t('patient.form.classVIP')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {t('patient.form.additionalInfo')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="occupation">{t('patient.form.occupation')}</Label>
                      <Input
                        id="occupation"
                        value={formData.occupation}
                        onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
                        placeholder={language === 'ar' ? 'مهندس' : 'Engineer'}
                      />
                    </div>

                    <div>
                      <Label htmlFor="employer">{t('patient.form.employer')}</Label>
                      <Input
                        id="employer"
                        value={formData.employer}
                        onChange={(e) => setFormData(prev => ({ ...prev, employer: e.target.value }))}
                        placeholder={language === 'ar' ? 'شركة ABC' : 'ABC Company'}
                      />
                    </div>

                    <div>
                      <Label>{t('patient.form.preferredLanguage')}</Label>
                      <Select 
                        value={formData.preferredLanguage} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, preferredLanguage: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="العربية">العربية</SelectItem>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Français">Français</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">{t('patient.form.notes')}</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder={t('patient.form.notesPlaceholder')}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('patient.form.previous')}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose}>
                {t('patient.form.cancel')}
              </Button>
              
              {currentStep < totalSteps ? (
                <Button onClick={handleNext}>
                  {t('patient.form.next')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t('patient.form.saving')}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {t('patient.form.save')}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPatientForm;