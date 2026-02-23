import React, { useState } from 'react';
import { Building2, Stethoscope, Camera, UserPlus, Heart, Plus, TestTube, Pill, User, Shield, Crown } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';
import { useAdaptiveAuth } from '../../hooks/useAdaptiveAuth';
import ThemeLanguageToggle from '../settings/ThemeLanguageToggle';

interface RegisterPageProps {
  onRegister?: (userData: any) => Promise<any>;
  onBackToLogin: () => void;
  language?: 'en' | 'ar';
  onLanguageChange?: (lang: 'en' | 'ar') => void;
}

const roles = [
  { 
    value: 'admin', 
    icon: Crown, 
    nameKey: 'roles.admin',
    descKey: 'register.roleDescriptions.admin',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    category: 'management'
  },
  { 
    value: 'doctor', 
    icon: Stethoscope, 
    nameKey: 'roles.doctor',
    descKey: 'register.roleDescriptions.doctor',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    category: 'medical'
  },
  { 
    value: 'nurse', 
    icon: Heart, 
    nameKey: 'roles.nurse',
    descKey: 'register.roleDescriptions.nurse',
    color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    category: 'medical'
  },
  { 
    value: 'receptionist', 
    icon: User, 
    nameKey: 'roles.receptionist',
    descKey: 'register.roleDescriptions.receptionist',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    category: 'administration'
  },
  { 
    value: 'lab_tech', 
    icon: TestTube, 
    nameKey: 'roles.lab_tech',
    descKey: 'register.roleDescriptions.lab_tech',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    category: 'technical'
  },
  { 
    value: 'pharmacist', 
    icon: Pill, 
    nameKey: 'roles.pharmacist',
    descKey: 'register.roleDescriptions.pharmacist',
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    category: 'medical'
  },
  { 
    value: 'radiologist', 
    icon: Camera, 
    nameKey: 'roles.radiologist',
    descKey: 'register.roleDescriptions.radiologist',
    color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
    category: 'technical'
  },
];

const specializationsByRole = {
  doctor: [
    'general_practice', 'internal_medicine', 'cardiology', 'neurology', 
    'orthopedics', 'dermatology', 'pediatrics', 'gynecology', 'surgery'
  ],
  nurse: [
    'general_nursing', 'icu_nursing', 'er_nursing', 'surgical_nursing',
    'pediatric_nursing', 'geriatric_nursing'
  ],
  lab_tech: [
    'clinical_chemistry', 'hematology', 'microbiology', 'pathology'
  ],
  radiologist: [
    'diagnostic_radiology', 'interventional_radiology', 'nuclear_medicine'
  ]
};

export default function RegisterPage({ onRegister, onBackToLogin, language, onLanguageChange }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    specialization: '',
    licenseNumber: '',
    experience: '',
    department: '',
    phone: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const { t, isRTL } = useLanguage();
  const { effectiveTheme } = useTheme();
  const { signUp } = useAdaptiveAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'role') {
      setFormData(prev => ({ ...prev, specialization: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError(t('register.passwordMismatch'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Use the provided onRegister if available, otherwise use auth hook
      if (onRegister) {
        await onRegister(formData);
      } else {
        const result = await signUp(formData.email, formData.password);
        if (result.error) {
          throw new Error(result.error);
        }
        // Store user role and info in localStorage
        localStorage.setItem('userRole', formData.role);
        localStorage.setItem('userName', `${formData.firstName} ${formData.lastName}`);
        // Redirect to login or dashboard
        onBackToLogin();
      }
    } catch (err: any) {
      setError(err.message || t('register.error'));
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = roles.find(role => role.value === formData.role);
  const availableSpecializations = formData.role ? specializationsByRole[formData.role as keyof typeof specializationsByRole] || [] : [];

  const categoryGroups = {
    management: roles.filter(r => r.category === 'management'),
    medical: roles.filter(r => r.category === 'medical'),
    technical: roles.filter(r => r.category === 'technical'),
    administration: roles.filter(r => r.category === 'administration')
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-background flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Theme and Language Toggle */}
      <div className="fixed top-4 left-4 z-50">
        <ThemeLanguageToggle variant="compact" showLabels={false} />
      </div>

      {/* Back to Login Button */}
      <div className="fixed top-4 right-4 z-50">
        <Button variant="outline" onClick={onBackToLogin} className="animate-fade-in">
          {t('register.backToLogin')}
        </Button>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-300 ${
                  step >= stepNum 
                    ? 'bg-green-600 text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                    step > stepNum ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <h3 className="text-lg font-semibold">
              {step === 1 && t('register.step1Title')}
              {step === 2 && t('register.step2Title')}
              {step === 3 && t('register.step3Title')}
            </h3>
            <p className="text-muted-foreground">
              {step === 1 && t('register.step1Desc')}
              {step === 2 && t('register.step2Desc')}
              {step === 3 && t('register.step3Desc')}
            </p>
          </div>
        </div>

        <Card className="animate-fade-in">
          <CardHeader className="text-center">
            <div className={`flex items-center justify-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                  <UserPlus className="w-7 h-7 text-white" />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                    {t('register.title')}
                  </CardTitle>
                </div>
              </div>
            </div>
            <CardDescription className="text-lg">
              {t('register.subtitle')}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="animate-slide-in-down">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Step 1: Basic Information */}
              {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('register.firstName')}</label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder={t('register.firstName')}
                        required
                        className="h-11"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('register.lastName')}</label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder={t('register.lastName')}
                        required
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('register.email')}</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder={t('register.email')}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('register.phone')}</label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder={t('register.phone')}
                      className="h-11"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('register.password')}</label>
                      <Input
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder={t('register.password')}
                        required
                        className="h-11"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('register.confirmPassword')}</label>
                      <Input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder={t('register.confirmPassword')}
                        required
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Role Selection */}
              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">{t('register.selectRole')}</h3>
                    <p className="text-muted-foreground">{t('register.roleHelp')}</p>
                  </div>

                  {Object.entries(categoryGroups).map(([category, categoryRoles]) => (
                    <div key={category} className="space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        {t(`register.categories.${category}`)}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {categoryRoles.map((role) => {
                          const Icon = role.icon;
                          const isSelected = formData.role === role.value;
                          return (
                            <Card
                              key={role.value}
                              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                                isSelected 
                                  ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20' 
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                              }`}
                              onClick={() => handleInputChange('role', role.value)}
                            >
                              <CardContent className="p-4">
                                <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                    isSelected ? 'bg-green-100 dark:bg-green-900/50' : 'bg-gray-100 dark:bg-gray-800'
                                  }`}>
                                    <Icon className={`w-5 h-5 ${isSelected ? 'text-green-600' : 'text-gray-600'}`} />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-medium">{t(role.nameKey)}</h4>
                                      <Badge variant="secondary" className={role.color}>
                                        {t(`register.categories.${category}`)}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {t(role.descKey)}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 3: Professional Details */}
              {step === 3 && (
                <div className="space-y-4 animate-fade-in">
                  {selectedRole && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <selectedRole.icon className="w-6 h-6 text-green-600" />
                      <div>
                        <h4 className="font-medium">{t(selectedRole.nameKey)}</h4>
                        <p className="text-sm text-muted-foreground">{t(selectedRole.descKey)}</p>
                      </div>
                    </div>
                  )}

                  {availableSpecializations.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('register.specialization')}</label>
                      <Select value={formData.specialization} onValueChange={(value) => handleInputChange('specialization', value)}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder={t('register.selectSpecialization')} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSpecializations.map((spec) => (
                            <SelectItem key={spec} value={spec}>
                              {t(`specializations.${spec}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('register.licenseNumber')}</label>
                      <Input
                        value={formData.licenseNumber}
                        onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                        placeholder={t('register.licenseNumber')}
                        className="h-11"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('register.experience')}</label>
                      <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder={t('register.selectExperience')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-1">{t('register.experience01')}</SelectItem>
                          <SelectItem value="2-5">{t('register.experience25')}</SelectItem>
                          <SelectItem value="6-10">{t('register.experience610')}</SelectItem>
                          <SelectItem value="10+">{t('register.experience10plus')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('register.department')}</label>
                    <Input
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      placeholder={t('register.department')}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('register.notes')}</label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder={t('register.notesPlaceholder')}
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={step === 1}
                  className="hover-lift"
                >
                  {t('common.previous')}
                </Button>

                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    disabled={
                      (step === 1 && (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword)) ||
                      (step === 2 && !formData.role)
                    }
                    className="bg-green-600 hover:bg-green-700 hover-lift"
                  >
                    {t('common.next')}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 hover-lift"
                  >
                    {loading ? t('common.loading') : t('register.createAccount')}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}