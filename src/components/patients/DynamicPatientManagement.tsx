/**
 * Dynamic Patient Management Component
 * Integrated with real-time Supabase backend
 */

import React, { useState, useMemo, useCallback } from 'react';
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
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  Calendar, 
  Heart, 
  AlertTriangle, 
  FileText, 
  History, 
  User,
  RefreshCw,
  Download,
  Upload,
  Filter,
  Eye,
  EyeOff,
  Calendar as CalendarIcon,
  MapPin,
  Activity,
  Clock,
  UserPlus,
  ArrowUpDown,
  MoreHorizontal,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';
import { usePatients } from '../../hooks/useDynamicData';
import { Patient } from '../../services/DynamicApiService';
import AddPatientForm from './AddPatientForm';
import { toast } from 'sonner';

interface DynamicPatientManagementProps {
  isDemoMode?: boolean;
}

const DynamicPatientManagement: React.FC<DynamicPatientManagementProps> = ({ 
  isDemoMode = false 
}) => {
  const { t, language, isRTL } = useLanguage();
  const { effectiveTheme, themeConfig } = useTheme();

  // Dynamic data hooks
  const { 
    data: patients, 
    loading, 
    error, 
    refresh, 
    createPatient, 
    updatePatient,
    lastUpdated 
  } = usePatients();

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'mrn'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFilters, setSelectedFilters] = useState({
    gender: 'all',
    ageRange: 'all',
    hasInsurance: 'all'
  });

  // Computed values
  const filteredAndSortedPatients = useMemo(() => {
    if (!patients) return [];

    let filtered = patients.filter(patient => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm) ||
        (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Status filter
      const matchesStatus = filter === 'all' || patient.status === filter;
      
      // Gender filter
      const matchesGender = selectedFilters.gender === 'all' || patient.gender === selectedFilters.gender;
      
      // Insurance filter
      const matchesInsurance = selectedFilters.hasInsurance === 'all' || 
        (selectedFilters.hasInsurance === 'yes' && patient.insurance) ||
        (selectedFilters.hasInsurance === 'no' && !patient.insurance);

      // Age range filter
      let matchesAge = true;
      if (selectedFilters.ageRange !== 'all') {
        const age = getAgeFromDate(patient.dateOfBirth);
        switch (selectedFilters.ageRange) {
          case 'child':
            matchesAge = age < 18;
            break;
          case 'adult':
            matchesAge = age >= 18 && age < 65;
            break;
          case 'senior':
            matchesAge = age >= 65;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesGender && matchesInsurance && matchesAge;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
          break;
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'mrn':
          comparison = a.id.localeCompare(b.id);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [patients, searchTerm, filter, selectedFilters, sortBy, sortOrder]);

  // Utility functions
  const getPatientInitials = (patient: Patient) => {
    return `${patient.firstName.charAt(0)}${patient.lastName.charAt(0)}`.toUpperCase();
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-3 w-3" />;
      case 'inactive': return <XCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  // Event handlers
  const handleRefresh = async () => {
    try {
      await refresh();
      toast.success(t('common.dataRefreshed'));
    } catch (error) {
      toast.error(t('common.refreshError'));
      console.error('Refresh error:', error);
    }
  };

  const handleAddPatient = async (patientData: any) => {
    setIsSubmitting(true);
    try {
      const result = await createPatient({
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        dateOfBirth: patientData.dateOfBirth?.toISOString().split('T')[0] || '',
        gender: patientData.gender,
        phone: patientData.phone,
        email: patientData.email,
        address: patientData.address,
        bloodType: patientData.bloodType,
        emergencyContact: {
          name: patientData.emergencyContactName,
          phone: patientData.emergencyContactPhone,
          relationship: patientData.emergencyContactRelationship
        },
        insurance: patientData.hasInsurance ? {
          provider: patientData.insuranceProvider,
          policyNumber: patientData.policyNumber,
          coverageType: patientData.coverageType || 'basic'
        } : undefined,
        allergies: patientData.allergies || [],
        medications: patientData.medications || [],
        medicalHistory: patientData.medicalHistory || [],
        status: 'active'
      });

      if (result.success) {
        toast.success(t('patients.patientAdded'));
        setShowAddForm(false);
      } else {
        toast.error(result.error || t('patients.addError'));
      }
    } catch (error) {
      toast.error(t('patients.addError'));
      console.error('Error adding patient:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePatient = async (patientData: Partial<Patient>) => {
    if (!selectedPatient) return;

    setIsSubmitting(true);
    try {
      const result = await updatePatient(selectedPatient.id, patientData);

      if (result.success) {
        toast.success(t('patients.patientUpdated'));
        setIsEditDialogOpen(false);
        setSelectedPatient(null);
      } else {
        toast.error(result.error || t('patients.updateError'));
      }
    } catch (error) {
      toast.error(t('patients.updateError'));
      console.error('Error updating patient:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportPatients = async () => {
    try {
      const exportData = {
        patients: filteredAndSortedPatients,
        filters: { searchTerm, filter, selectedFilters },
        sort: { sortBy, sortOrder },
        timestamp: new Date().toISOString(),
        totalCount: patients?.length || 0,
        filteredCount: filteredAndSortedPatients.length
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `patients-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(t('patients.exportComplete'));
    } catch (error) {
      toast.error(t('patients.exportError'));
      console.error('Export error:', error);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilter('all');
    setSelectedFilters({
      gender: 'all',
      ageRange: 'all',
      hasInsurance: 'all'
    });
  };

  // Loading state
  if (loading && !patients) {
    return (
      <div className="space-y-6 p-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{t('patients.title')}</h1>
            <p className="text-muted-foreground">{t('common.loading')}</p>
          </div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="card-animate">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-muted rounded-full skeleton"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded w-1/3 skeleton mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2 skeleton"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error && !patients) {
    return (
      <div className="space-y-6 p-6">
        <Alert variant="destructive" className="error-shake">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {t('patients.loadError')}: {error}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="mt-2 ml-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('common.retry')}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalPatients = patients?.length || 0;
  const activePatients = patients?.filter(p => p.status === 'active').length || 0;
  const filteredCount = filteredAndSortedPatients.length;

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t('patients.title')}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>{t('patients.totalPatients', { count: totalPatients })}</span>
            <span>•</span>
            <span>{t('patients.activePatients', { count: activePatients })}</span>
            {lastUpdated && (
              <>
                <span>•</span>
                <span className="text-xs">
                  {t('dashboard.lastUpdated')}: {formatTime(lastUpdated.toISOString())}
                </span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 btn-press"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? t('common.refreshing') : t('common.refresh')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPatients}
            className="flex items-center gap-2 btn-press"
          >
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
          <Button 
            className="flex items-center gap-2 btn-press hover-scale"
            onClick={() => setShowAddForm(true)}
          >
            <UserPlus className="h-4 w-4" />
            {t('patients.addPatient')}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="card-animate">
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Search and Basic Filters */}
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
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder={t('common.status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all')}</SelectItem>
                  <SelectItem value="active">{t('common.active')}</SelectItem>
                  <SelectItem value="inactive">{t('common.inactive')}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder={t('common.sortBy')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">{t('common.name')}</SelectItem>
                  <SelectItem value="date">{t('common.date')}</SelectItem>
                  <SelectItem value="mrn">MRN</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-2"
              >
                <ArrowUpDown className="h-4 w-4" />
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>

            {/* Advanced Filters */}
            <div className="flex flex-wrap gap-4">
              <Select 
                value={selectedFilters.gender} 
                onValueChange={(value) => setSelectedFilters(prev => ({ ...prev, gender: value }))}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder={t('patients.gender')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.allGenders')}</SelectItem>
                  <SelectItem value="male">{t('patients.male')}</SelectItem>
                  <SelectItem value="female">{t('patients.female')}</SelectItem>
                  <SelectItem value="other">{t('patients.other')}</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                value={selectedFilters.ageRange} 
                onValueChange={(value) => setSelectedFilters(prev => ({ ...prev, ageRange: value }))}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder={t('patients.ageRange')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.allAges')}</SelectItem>
                  <SelectItem value="child">{t('patients.child')} (<18)</SelectItem>
                  <SelectItem value="adult">{t('patients.adult')} (18-65)</SelectItem>
                  <SelectItem value="senior">{t('patients.senior')} (65+)</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                value={selectedFilters.hasInsurance} 
                onValueChange={(value) => setSelectedFilters(prev => ({ ...prev, hasInsurance: value }))}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder={t('patients.insurance')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all')}</SelectItem>
                  <SelectItem value="yes">{t('patients.withInsurance')}</SelectItem>
                  <SelectItem value="no">{t('patients.withoutInsurance')}</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                {t('common.clearFilters')}
              </Button>
            </div>

            {/* Results Summary */}
            {(searchTerm || filter !== 'all' || Object.values(selectedFilters).some(v => v !== 'all')) && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span>
                  {t('patients.showingResults', { 
                    filtered: filteredCount, 
                    total: totalPatients 
                  })}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Patients List */}
      <div className="grid gap-4 stagger-animation">
        {filteredAndSortedPatients.length === 0 ? (
          <Card className="card-animate">
            <CardContent className="p-6 text-center">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchTerm || filter !== 'all' ? t('patients.noResults') : t('patients.noPatients')}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filter !== 'all' ? t('patients.tryDifferentSearch') : t('patients.addFirstPatient')}
              </p>
              {!searchTerm && filter === 'all' && (
                <Button onClick={() => setShowAddForm(true)} className="btn-press">
                  <UserPlus className="h-4 w-4 mr-2" />
                  {t('patients.addPatient')}
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedPatients.map((patient, index) => (
            <Card key={patient.id} className="card-animate hover-lift">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="avatar-enhanced">
                        {getPatientInitials(patient)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">
                          {patient.firstName} {patient.lastName}
                        </h3>
                        <Badge variant={getStatusBadgeVariant(patient.status)} className="flex items-center gap-1">
                          {getStatusIcon(patient.status)}
                          {t(`common.${patient.status}`)}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>ID: {patient.id}</p>
                        <p>
                          {t('patients.age')}: {getAgeFromDate(patient.dateOfBirth)} {t('common.years')} •{' '}
                          {t(`patients.${patient.gender}`)}
                        </p>
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
                      
                      <div className="mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {t('patients.registeredOn')}: {formatDate(patient.createdAt)}
                        </span>
                      </div>
                      
                      {/* Quick Info Tags */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {patient.bloodType && (
                          <Badge variant="outline" className="text-xs">
                            <Heart className="h-3 w-3 mr-1" />
                            {patient.bloodType}
                          </Badge>
                        )}
                        {patient.allergies && patient.allergies.length > 0 && (
                          <Badge variant="outline" className="text-xs text-yellow-600">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {patient.allergies.length} {t('patients.allergies')}
                          </Badge>
                        )}
                        {patient.medicalHistory && patient.medicalHistory.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <History className="h-3 w-3 mr-1" />
                            {patient.medicalHistory.length} {t('patients.conditions')}
                          </Badge>
                        )}
                        {patient.insurance && (
                          <Badge variant="outline" className="text-xs text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {t('patients.insured')}
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
                      className="btn-press hover-scale"
                    >
                      <Eye className="h-4 w-4" />
                      {t('common.view')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPatient(patient);
                        setIsEditDialogOpen(true);
                      }}
                      className="btn-press hover-scale"
                    >
                      <Edit className="h-4 w-4" />
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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto modal-content">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="avatar-enhanced">
                    {getPatientInitials(selectedPatient)}
                  </AvatarFallback>
                </Avatar>
                {selectedPatient.firstName} {selectedPatient.lastName}
                <Badge variant={getStatusBadgeVariant(selectedPatient.status)} className="flex items-center gap-1">
                  {getStatusIcon(selectedPatient.status)}
                  {t(`common.${selectedPatient.status}`)}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="personal" className="mt-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">{t('patients.personalInfo')}</TabsTrigger>
                <TabsTrigger value="medical">{t('patients.medicalHistory')}</TabsTrigger>
                <TabsTrigger value="insurance">{t('patients.insurance')}</TabsTrigger>
                <TabsTrigger value="activity">{t('patients.activity')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="space-y-4 tab-content-enter">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t('patients.patientId')}</Label>
                    <p className="text-sm font-mono">{selectedPatient.id}</p>
                  </div>
                  <div>
                    <Label>{t('patients.dateOfBirth')}</Label>
                    <p className="text-sm">
                      {formatDate(selectedPatient.dateOfBirth)} 
                      <span className="text-muted-foreground ml-2">
                        ({getAgeFromDate(selectedPatient.dateOfBirth)} {t('common.years')})
                      </span>
                    </p>
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
                    <p><strong>{t('common.name')}:</strong> {selectedPatient.emergencyContact?.name}</p>
                    <p><strong>{t('common.phone')}:</strong> {selectedPatient.emergencyContact?.phone}</p>
                    <p><strong>{t('patients.relationship')}:</strong> {selectedPatient.emergencyContact?.relationship}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="medical" className="space-y-4 tab-content-enter">
                <div>
                  <Label>{t('patients.allergies')}</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedPatient.allergies && selectedPatient.allergies.length > 0 ? (
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
                    {selectedPatient.medications && selectedPatient.medications.length > 0 ? (
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
                    {selectedPatient.medicalHistory && selectedPatient.medicalHistory.length > 0 ? (
                      selectedPatient.medicalHistory.map((condition, index) => (
                        <p key={index} className="text-sm">• {condition}</p>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">{t('patients.noMedicalHistory')}</p>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="insurance" className="space-y-4 tab-content-enter">
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
                    <div>
                      <Label>{t('patients.coverageType')}</Label>
                      <p className="text-sm">{selectedPatient.insurance.coverageType}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <XCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">{t('patients.noInsurance')}</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="activity" className="space-y-4 tab-content-enter">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{t('patients.patientRegistered')}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(selectedPatient.createdAt)} • {formatTime(selectedPatient.createdAt)}
                      </p>
                    </div>
                  </div>
                  {/* Add more activity items here when available */}
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
    </div>
  );
};

export default DynamicPatientManagement;