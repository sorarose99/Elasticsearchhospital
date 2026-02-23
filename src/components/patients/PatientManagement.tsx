import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Search, Plus, Edit, Trash2, Phone, Mail, Calendar, Heart, AlertTriangle, FileText, History, User } from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';
import AddPatientForm from './AddPatientForm';
import firebaseService from '../../services/FirebaseService';
import { toast } from 'sonner';

interface Patient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodType?: string;
  phone: string;
  email?: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  insurance?: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
  };
  allergies: string[];
  medications: string[];
  medicalHistory: string[];
  status: 'active' | 'inactive' | 'deceased';
  createdAt: string;
  updatedAt: string;
  lastVisit?: string;
  avatar?: string;
  notes?: string;
}

interface PatientManagementProps {
  isDemoMode?: boolean;
}

const PatientManagement: React.FC<PatientManagementProps> = ({ isDemoMode = false }) => {
  const { t, language, isRTL } = useLanguage();
  const { effectiveTheme, themeConfig } = useTheme();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Demo patients data
  const demoPatients: Patient[] = useMemo(() => [
    {
      id: '1',
      mrn: 'MRN001',
      firstName: 'أحمد',
      lastName: 'محمد',
      dateOfBirth: '1985-05-15',
      gender: 'male',
      bloodType: 'A+',
      phone: '+966501234567',
      email: 'ahmed.mohamed@email.com',
      address: 'الرياض، المملكة العربية السعودية',
      emergencyContact: {
        name: 'فاطمة محمد',
        phone: '+966501234568',
        relationship: 'زوجة'
      },
      insurance: {
        provider: 'شركة التأمين الطبي',
        policyNumber: 'POL123456',
        groupNumber: 'GRP789'
      },
      allergies: ['البنسلين', 'المكسرات'],
      medications: ['أسبرين 81mg', 'ليزينوبريل 10mg'],
      medicalHistory: ['ارتفاع ضغط الدم', 'السكري النوع 2'],
      status: 'active',
      createdAt: '2023-01-15',
      updatedAt: '2024-01-15',
      lastVisit: '2024-01-10',
      notes: 'مريض منتظم في المواعيد'
    },
    {
      id: '2',
      mrn: 'MRN002',
      firstName: 'Sarah',
      lastName: 'Johnson',
      dateOfBirth: '1992-08-22',
      gender: 'female',
      bloodType: 'O-',
      phone: '+1234567890',
      email: 'sarah.johnson@email.com',
      address: 'New York, NY, USA',
      emergencyContact: {
        name: 'John Johnson',
        phone: '+1234567891',
        relationship: 'Husband'
      },
      insurance: {
        provider: 'Health Insurance Co.',
        policyNumber: 'POL654321',
        groupNumber: 'GRP987'
      },
      allergies: ['Latex'],
      medications: ['Birth Control Pill'],
      medicalHistory: ['Annual Checkup'],
      status: 'active',
      createdAt: '2023-03-20',
      updatedAt: '2024-01-12',
      lastVisit: '2024-01-08',
      notes: 'Regular patient, no major issues'
    },
    {
      id: '3',
      mrn: 'MRN003',
      firstName: 'علي',
      lastName: 'أحمد',
      dateOfBirth: '1978-12-10',
      gender: 'male',
      bloodType: 'B+',
      phone: '+966502345678',
      email: 'ali.ahmed@email.com',
      address: 'جدة، المملكة العربية السعودية',
      emergencyContact: {
        name: 'زينب أحمد',
        phone: '+966502345679',
        relationship: 'أخت'
      },
      allergies: [],
      medications: ['متفورمين 500mg'],
      medicalHistory: ['السكري النوع 2', 'ارتفاع الكوليسترول'],
      status: 'active',
      createdAt: '2022-11-05',
      updatedAt: '2024-01-14',
      lastVisit: '2024-01-05',
      notes: 'يحتاج متابعة دورية للسكري'
    }
  ], []);

  useEffect(() => {
    // Always load from Firebase
    loadPatients();
    
    // Subscribe to real-time updates
    const unsubscribe = firebaseService.subscribeToPatients((updatedPatients) => {
      setPatients(updatedPatients);
    });
    
    return () => unsubscribe();
  }, []);

  const loadPatients = useCallback(async () => {
    setLoading(true);
    try {
      const patientsData = await firebaseService.getPatients();
      setPatients(patientsData);
    } catch (error) {
      console.error('Error loading patients:', error);
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      const matchesSearch = searchTerm === '' || 
        patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm) ||
        (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = filter === 'all' || patient.status === filter;
      
      return matchesSearch && matchesFilter;
    });
  }, [patients, searchTerm, filter]);

  const getPatientInitials = (patient: Patient) => {
    const firstName = patient.firstName || patient.name?.split(' ')[0] || '';
    const lastName = patient.lastName || patient.name?.split(' ')[1] || '';
    if (!firstName && !lastName) return '??';
    return `${firstName.charAt(0) || ''}${lastName.charAt(0) || ''}`.toUpperCase() || '??';
  };

  const getAgeFromDate = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'deceased': return 'destructive';
      default: return 'outline';
    }
  };

  const handleDeletePatient = async (patient: Patient) => {
    try {
      await firebaseService.deletePatient(patient.id);
      setIsDeleteDialogOpen(false);
      setPatientToDelete(null);
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast.error('Failed to delete patient');
    }
  };

  const handleAddPatient = async (patientData: any) => {
    setIsSubmitting(true);
    try {
      const newPatient = {
        mrn: patientData.mrn,
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        dateOfBirth: patientData.dateOfBirth?.toISOString().split('T')[0] || '',
        gender: patientData.gender,
        bloodType: patientData.bloodType,
        phone: patientData.phone,
        email: patientData.email,
        address: patientData.address,
        emergencyContact: {
          name: patientData.emergencyContactName,
          phone: patientData.emergencyContactPhone,
          relationship: patientData.emergencyContactRelationship
        },
        insurance: patientData.hasInsurance ? {
          provider: patientData.insuranceProvider,
          policyNumber: patientData.policyNumber,
          groupNumber: patientData.groupNumber
        } : undefined,
        allergies: patientData.allergies,
        medications: patientData.medications,
        medicalHistory: patientData.medicalHistory,
        status: 'active',
        avatar: patientData.avatar,
        notes: patientData.notes
      };
      
      await firebaseService.createPatient(newPatient);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding patient:', error);
      toast.error('Failed to add patient');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t('patients.title')}</h1>
          <p className="text-muted-foreground">
            {t('patients.totalPatients', { count: patients.length })}
          </p>
        </div>
        
        <Button 
          className="flex items-center gap-2 animate-scale-in"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="h-4 w-4" />
          {t('patients.addPatient')}
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('patients.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t('common.filter')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="active">{t('common.active')}</SelectItem>
                <SelectItem value="inactive">{t('common.inactive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Patients List */}
      <div className="grid gap-4">
        {loading ? (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>{t('common.loading')}</p>
            </CardContent>
          </Card>
        ) : filteredPatients.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchTerm ? t('patients.noResults') : t('patients.noPatients')}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm ? t('patients.tryDifferentSearch') : t('patients.addFirstPatient')}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPatients.map((patient) => (
            <Card key={patient.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={patient.avatar} />
                      <AvatarFallback>{getPatientInitials(patient)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">
                          {patient.firstName} {patient.lastName}
                        </h3>
                        <Badge variant={getStatusBadgeVariant(patient.status)}>
                          {t(`common.${patient.status}`)}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>{t('patients.mrn')}: {patient.mrn}</p>
                        <p>{t('patients.age')}: {getAgeFromDate(patient.dateOfBirth)} {t('common.years')}</p>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {patient.phone}
                          </span>
                          {patient.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {patient.email}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {patient.lastVisit && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          {t('patients.lastVisit')}: {formatDate(patient.lastVisit)}
                        </div>
                      )}
                      
                      {/* Quick Info */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {patient.bloodType && (
                          <Badge variant="outline" className="text-xs">
                            <Heart className="h-3 w-3 mr-1" />
                            {patient.bloodType}
                          </Badge>
                        )}
                        {patient.allergies.length > 0 && (
                          <Badge variant="outline" className="text-xs text-yellow-600">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {patient.allergies.length} {t('patients.allergies')}
                          </Badge>
                        )}
                        {patient.medicalHistory.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <History className="h-3 w-3 mr-1" />
                            {patient.medicalHistory.length} {t('patients.conditions')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <FileText className="h-4 w-4" />
                      {t('common.view')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPatient(patient);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPatientToDelete(patient);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Patient Details Dialog */}
      {selectedPatient && (
        <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedPatient.avatar} />
                  <AvatarFallback>{getPatientInitials(selectedPatient)}</AvatarFallback>
                </Avatar>
                {selectedPatient.firstName} {selectedPatient.lastName}
                <Badge variant={getStatusBadgeVariant(selectedPatient.status)}>
                  {t(`common.${selectedPatient.status}`)}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="personal" className="mt-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">{t('patients.personalInfo')}</TabsTrigger>
                <TabsTrigger value="medical">{t('patients.medicalHistory')}</TabsTrigger>
                <TabsTrigger value="insurance">{t('patients.insurance')}</TabsTrigger>
                <TabsTrigger value="notes">{t('patients.notes')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t('patients.mrn')}</Label>
                    <p className="text-sm">{selectedPatient.mrn}</p>
                  </div>
                  <div>
                    <Label>{t('patients.dateOfBirth')}</Label>
                    <p className="text-sm">{formatDate(selectedPatient.dateOfBirth)} ({getAgeFromDate(selectedPatient.dateOfBirth)} {t('common.years')})</p>
                  </div>
                  <div>
                    <Label>{t('patients.gender')}</Label>
                    <p className="text-sm">{t(`patients.${selectedPatient.gender}`)}</p>
                  </div>
                  <div>
                    <Label>{t('patients.bloodType')}</Label>
                    <p className="text-sm">{selectedPatient.bloodType || t('common.notSpecified')}</p>
                  </div>
                  <div>
                    <Label>{t('common.phone')}</Label>
                    <p className="text-sm">{selectedPatient.phone}</p>
                  </div>
                  <div>
                    <Label>{t('common.email')}</Label>
                    <p className="text-sm">{selectedPatient.email || t('common.notProvided')}</p>
                  </div>
                </div>
                
                <div>
                  <Label>{t('common.address')}</Label>
                  <p className="text-sm">{selectedPatient.address}</p>
                </div>
                
                <div>
                  <Label>{t('patients.emergencyContact')}</Label>
                  <div className="text-sm space-y-1">
                    <p><strong>{t('common.name')}:</strong> {selectedPatient.emergencyContact.name}</p>
                    <p><strong>{t('common.phone')}:</strong> {selectedPatient.emergencyContact.phone}</p>
                    <p><strong>{t('patients.relationship')}:</strong> {selectedPatient.emergencyContact.relationship}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="medical" className="space-y-4">
                <div>
                  <Label>{t('patients.allergies')}</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedPatient.allergies.length > 0 ? (
                      selectedPatient.allergies.map((allergy, index) => (
                        <Badge key={index} variant="outline" className="text-yellow-600">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {allergy}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">{t('patients.noAllergies')}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label>{t('patients.medications')}</Label>
                  <div className="space-y-2 mt-2">
                    {selectedPatient.medications.length > 0 ? (
                      selectedPatient.medications.map((medication, index) => (
                        <p key={index} className="text-sm">• {medication}</p>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">{t('patients.noMedications')}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label>{t('patients.medicalHistory')}</Label>
                  <div className="space-y-2 mt-2">
                    {selectedPatient.medicalHistory.length > 0 ? (
                      selectedPatient.medicalHistory.map((condition, index) => (
                        <p key={index} className="text-sm">• {condition}</p>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">{t('patients.noMedicalHistory')}</p>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="insurance" className="space-y-4">
                {selectedPatient.insurance ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{t('patients.insuranceProvider')}</Label>
                      <p className="text-sm">{selectedPatient.insurance.provider}</p>
                    </div>
                    <div>
                      <Label>{t('patients.policyNumber')}</Label>
                      <p className="text-sm">{selectedPatient.insurance.policyNumber}</p>
                    </div>
                    {selectedPatient.insurance.groupNumber && (
                      <div>
                        <Label>{t('patients.groupNumber')}</Label>
                        <p className="text-sm">{selectedPatient.insurance.groupNumber}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{t('patients.noInsurance')}</p>
                )}
              </TabsContent>
              
              <TabsContent value="notes" className="space-y-4">
                <div>
                  <Label>{t('patients.notes')}</Label>
                  <p className="text-sm mt-2">
                    {selectedPatient.notes || t('patients.noNotes')}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Patient Form */}
      <AddPatientForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddPatient}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('patients.deletePatient')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('patients.deleteConfirmation', { 
                patientName: patientToDelete ? `${patientToDelete.firstName} ${patientToDelete.lastName}` : '' 
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => patientToDelete && handleDeletePatient(patientToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PatientManagement;