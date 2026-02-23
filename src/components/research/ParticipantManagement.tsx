import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Checkbox } from '../ui/checkbox';
import { 
  UserPlus,
  Users,
  Search,
  Filter,
  Eye,
  Edit,
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  BarChart3,
  Download,
  Upload,
  Settings,
  Heart,
  Activity,
  Stethoscope
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';
import { getClinicalResearchTranslations } from '../../services/LanguageServiceExtended';

interface StudyOverview {
  id: string;
  title: string;
  phase: string;
  status: string;
  principalInvestigator: string;
  targetEnrollment: number;
}

interface ParticipantData {
  id: string;
  participantId: string;
  studyId: string;
  studyTitle: string;
  enrollmentDate: string;
  status: 'screening' | 'enrolled' | 'active' | 'completed' | 'withdrawn' | 'discontinued';
  visitCompliance: number;
  lastVisit: string;
  nextVisit: string;
  adverseEvents: number;
  demographics?: {
    age: number;
    gender: string;
    ethnicity: string;
    weight: number;
    height: number;
  };
  contact?: {
    phone: string;
    email: string;
    address: string;
    emergencyContact: string;
  };
  medicalHistory?: string[];
  concomitantMeds?: string[];
}

interface ParticipantManagementProps {
  participants: ParticipantData[];
  studies: StudyOverview[];
  isDemoMode?: boolean;
}

interface NewParticipantForm {
  studyId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  ethnicity: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  medicalHistory: string;
  currentMedications: string;
  allergies: string;
  consentDate: string;
  randomizationGroup?: string;
}

const ParticipantManagement: React.FC<ParticipantManagementProps> = ({
  participants,
  studies,
  isDemoMode = false
}) => {
  const { t, language, isRTL } = useLanguage();
  const { effectiveTheme } = useTheme();

  const [activeView, setActiveView] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterStudy, setFilterStudy] = useState('all');
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantData | null>(null);
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [newParticipantForm, setNewParticipantForm] = useState<NewParticipantForm>({
    studyId: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    ethnicity: '',
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalHistory: '',
    currentMedications: '',
    allergies: '',
    consentDate: '',
    randomizationGroup: ''
  });

  // Extended participants with additional demo data
  const extendedParticipants = participants.map((participant, index) => ({
    ...participant,
    demographics: participant.demographics || {
      age: 45 + (index * 3),
      gender: index % 2 === 0 ? 'Male' : 'Female',
      ethnicity: ['Caucasian', 'Hispanic', 'African American', 'Asian'][index % 4],
      weight: 70 + (index * 2),
      height: 170 + (index * 1.5)
    },
    contact: participant.contact || {
      phone: `+966-50-${String(Math.floor(Math.random() * 9000000) + 1000000)}`,
      email: `participant${index + 1}@email.com`,
      address: `123 Study St, Research City, RC ${10000 + index}`,
      emergencyContact: `Emergency Contact ${index + 1}`
    },
    medicalHistory: participant.medicalHistory || ['Hypertension', 'Diabetes Type 2'],
    concomitantMeds: participant.concomitantMeds || ['Metformin', 'Lisinopril']
  }));

  // Filter participants
  const filteredParticipants = useMemo(() => {
    return extendedParticipants.filter(participant => {
      const matchesSearch = participant.participantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           participant.studyTitle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || participant.status === filterStatus;
      const matchesStudy = filterStudy === 'all' || participant.studyId === filterStudy;
      return matchesSearch && matchesStatus && matchesStudy;
    });
  }, [extendedParticipants, searchTerm, filterStatus, filterStudy]);

  // Participant status badge styling
  const getStatusBadge = (status: string) => {
    const styles = {
      screening: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      enrolled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      completed: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      withdrawn: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      discontinued: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  // Calculate participant metrics
  const participantMetrics = useMemo(() => {
    const total = filteredParticipants.length;
    const active = filteredParticipants.filter(p => p.status === 'active').length;
    const completed = filteredParticipants.filter(p => p.status === 'completed').length;
    const withdrawn = filteredParticipants.filter(p => p.status === 'withdrawn').length;
    const avgCompliance = filteredParticipants.reduce((sum, p) => sum + p.visitCompliance, 0) / total || 0;
    const totalAE = filteredParticipants.reduce((sum, p) => sum + p.adverseEvents, 0);
    
    return { total, active, completed, withdrawn, avgCompliance, totalAE };
  }, [filteredParticipants]);

  // Handle form changes
  const handleFormChange = (field: keyof NewParticipantForm, value: string) => {
    setNewParticipantForm(prev => ({ ...prev, [field]: value }));
  };

  // Handle participant enrollment
  const handleEnrollParticipant = () => {
    console.log('Enrolling new participant:', newParticipantForm);
    setShowEnrollDialog(false);
    // Reset form
    setNewParticipantForm({
      studyId: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      ethnicity: '',
      phone: '',
      email: '',
      address: '',
      emergencyContact: '',
      emergencyPhone: '',
      medicalHistory: '',
      currentMedications: '',
      allergies: '',
      consentDate: '',
      randomizationGroup: ''
    });
  };

  // Participants overview metrics
  const renderMetricsCards = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <Users className="h-8 w-8 mx-auto text-blue-600 mb-2" />
            <p className="text-2xl font-bold">{participantMetrics.total}</p>
            <p className="text-sm text-muted-foreground">{t('research.totalParticipants')}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <Activity className="h-8 w-8 mx-auto text-green-600 mb-2" />
            <p className="text-2xl font-bold">{participantMetrics.active}</p>
            <p className="text-sm text-muted-foreground">{t('research.active')}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <CheckCircle className="h-8 w-8 mx-auto text-cyan-600 mb-2" />
            <p className="text-2xl font-bold">{participantMetrics.completed}</p>
            <p className="text-sm text-muted-foreground">{t('research.completed')}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <XCircle className="h-8 w-8 mx-auto text-red-600 mb-2" />
            <p className="text-2xl font-bold">{participantMetrics.withdrawn}</p>
            <p className="text-sm text-muted-foreground">{t('research.withdrawn')}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <Heart className="h-8 w-8 mx-auto text-purple-600 mb-2" />
            <p className="text-2xl font-bold">{participantMetrics.avgCompliance.toFixed(1)}%</p>
            <p className="text-sm text-muted-foreground">{t('research.avgCompliance')}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
            <p className="text-2xl font-bold">{participantMetrics.totalAE}</p>
            <p className="text-sm text-muted-foreground">{t('research.adverseEvents')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Participants table
  const renderParticipantsTable = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t('research.participantRegistry')}
            </CardTitle>
            <CardDescription>
              {t('research.manageAllParticipants')}
            </CardDescription>
          </div>
          <Button onClick={() => setShowEnrollDialog(true)} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            {t('research.enrollParticipant')}
          </Button>
        </div>

        {/* Search and filters */}
        <div className="flex gap-4 mt-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('research.searchParticipants')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Select value={filterStudy} onValueChange={setFilterStudy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t('research.study')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('research.allStudies')}</SelectItem>
              {studies.map(study => (
                <SelectItem key={study.id} value={study.id}>
                  {study.title.substring(0, 30)}...
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('research.status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('research.allStatuses')}</SelectItem>
              <SelectItem value="screening">{t('research.screening')}</SelectItem>
              <SelectItem value="enrolled">{t('research.enrolled')}</SelectItem>
              <SelectItem value="active">{t('research.active')}</SelectItem>
              <SelectItem value="completed">{t('research.completed')}</SelectItem>
              <SelectItem value="withdrawn">{t('research.withdrawn')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('research.participantId')}</TableHead>
                <TableHead>{t('research.study')}</TableHead>
                <TableHead>{t('research.status')}</TableHead>
                <TableHead>{t('research.demographics')}</TableHead>
                <TableHead>{t('research.enrollment')}</TableHead>
                <TableHead>{t('research.compliance')}</TableHead>
                <TableHead>{t('research.nextVisit')}</TableHead>
                <TableHead>{t('research.adverseEvents')}</TableHead>
                <TableHead>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParticipants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{participant.participantId}</p>
                      <p className="text-sm text-muted-foreground">
                        {participant.demographics?.gender}, {participant.demographics?.age}y
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{participant.studyTitle.substring(0, 25)}...</p>
                      <p className="text-xs text-muted-foreground">ID: {participant.studyId}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(participant.status)}>
                      {t(`research.${participant.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{participant.demographics?.ethnicity}</p>
                      <p className="text-muted-foreground">
                        {participant.demographics?.weight}kg, {participant.demographics?.height}cm
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{new Date(participant.enrollmentDate).toLocaleDateString()}</p>
                      <p className="text-muted-foreground">
                        {Math.floor((new Date().getTime() - new Date(participant.enrollmentDate).getTime()) / (1000 * 60 * 60 * 24))} days
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={participant.visitCompliance} className="w-16 h-2" />
                      <span className="text-sm font-medium">{participant.visitCompliance}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {participant.nextVisit ? (
                        <>
                          <p>{new Date(participant.nextVisit).toLocaleDateString()}</p>
                          <p className="text-muted-foreground">
                            {Math.ceil((new Date(participant.nextVisit).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                          </p>
                        </>
                      ) : (
                        <span className="text-muted-foreground">No scheduled visit</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {participant.adverseEvents > 0 ? (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      <span>{participant.adverseEvents}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedParticipant(participant);
                          setShowDetailsDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  // Demographics analytics
  const renderDemographicsView = () => {
    const genderStats = filteredParticipants.reduce((acc, p) => {
      const gender = p.demographics?.gender || 'Unknown';
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const ethnicityStats = filteredParticipants.reduce((acc, p) => {
      const ethnicity = p.demographics?.ethnicity || 'Unknown';
      acc[ethnicity] = (acc[ethnicity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const ageGroups = filteredParticipants.reduce((acc, p) => {
      const age = p.demographics?.age || 0;
      let group = '18-30';
      if (age > 30 && age <= 50) group = '31-50';
      else if (age > 50 && age <= 70) group = '51-70';
      else if (age > 70) group = '71+';
      acc[group] = (acc[group] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('research.genderDistribution')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(genderStats).map(([gender, count]) => {
                const percentage = (count / filteredParticipants.length) * 100;
                return (
                  <div key={gender} className="flex items-center justify-between">
                    <span className="text-sm">{gender}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={percentage} className="w-16 h-2" />
                      <span className="text-sm font-medium w-8">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('research.ageGroups')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(ageGroups).map(([group, count]) => {
                const percentage = (count / filteredParticipants.length) * 100;
                return (
                  <div key={group} className="flex items-center justify-between">
                    <span className="text-sm">{group}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={percentage} className="w-16 h-2" />
                      <span className="text-sm font-medium w-8">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('research.ethnicity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(ethnicityStats).map(([ethnicity, count]) => {
                const percentage = (count / filteredParticipants.length) * 100;
                return (
                  <div key={ethnicity} className="flex items-center justify-between">
                    <span className="text-sm">{ethnicity}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={percentage} className="w-16 h-2" />
                      <span className="text-sm font-medium w-8">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      {renderMetricsCards()}

      {/* View Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t('research.overview')}
          </TabsTrigger>
          <TabsTrigger value="demographics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {t('research.demographics')}
          </TabsTrigger>
          <TabsTrigger value="visits" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t('research.visits')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {renderParticipantsTable()}
        </TabsContent>

        <TabsContent value="demographics">
          {renderDemographicsView()}
        </TabsContent>

        <TabsContent value="visits">
          <Card>
            <CardHeader>
              <CardTitle>{t('research.visitSchedule')}</CardTitle>
              <CardDescription>{t('research.upcomingVisitsAndScheduling')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                {t('research.visitSchedulingFeature')}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Enroll Participant Dialog */}
      <Dialog open={showEnrollDialog} onOpenChange={setShowEnrollDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('research.enrollNewParticipant')}</DialogTitle>
            <DialogDescription>
              {t('research.completeParticipantInformation')}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">{t('research.basicInfo')}</TabsTrigger>
              <TabsTrigger value="contact">{t('research.contact')}</TabsTrigger>
              <TabsTrigger value="medical">{t('research.medical')}</TabsTrigger>
              <TabsTrigger value="consent">{t('research.consent')}</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studyId">{t('research.study')}</Label>
                <Select value={newParticipantForm.studyId} onValueChange={(value) => handleFormChange('studyId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('research.selectStudy')} />
                  </SelectTrigger>
                  <SelectContent>
                    {studies.map(study => (
                      <SelectItem key={study.id} value={study.id}>
                        {study.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t('research.firstName')}</Label>
                  <Input
                    id="firstName"
                    value={newParticipantForm.firstName}
                    onChange={(e) => handleFormChange('firstName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('research.lastName')}</Label>
                  <Input
                    id="lastName"
                    value={newParticipantForm.lastName}
                    onChange={(e) => handleFormChange('lastName', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">{t('research.dateOfBirth')}</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={newParticipantForm.dateOfBirth}
                    onChange={(e) => handleFormChange('dateOfBirth', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">{t('research.gender')}</Label>
                  <Select value={newParticipantForm.gender} onValueChange={(value) => handleFormChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('research.selectGender')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{t('research.male')}</SelectItem>
                      <SelectItem value="female">{t('research.female')}</SelectItem>
                      <SelectItem value="other">{t('research.other')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ethnicity">{t('research.ethnicity')}</Label>
                  <Select value={newParticipantForm.ethnicity} onValueChange={(value) => handleFormChange('ethnicity', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('research.selectEthnicity')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="caucasian">Caucasian</SelectItem>
                      <SelectItem value="hispanic">Hispanic</SelectItem>
                      <SelectItem value="african_american">African American</SelectItem>
                      <SelectItem value="asian">Asian</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('research.phone')}</Label>
                  <Input
                    id="phone"
                    value={newParticipantForm.phone}
                    onChange={(e) => handleFormChange('phone', e.target.value)}
                    placeholder="+966-50-1234567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('research.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newParticipantForm.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">{t('research.address')}</Label>
                <Textarea
                  id="address"
                  value={newParticipantForm.address}
                  onChange={(e) => handleFormChange('address', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">{t('research.emergencyContact')}</Label>
                  <Input
                    id="emergencyContact"
                    value={newParticipantForm.emergencyContact}
                    onChange={(e) => handleFormChange('emergencyContact', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">{t('research.emergencyPhone')}</Label>
                  <Input
                    id="emergencyPhone"
                    value={newParticipantForm.emergencyPhone}
                    onChange={(e) => handleFormChange('emergencyPhone', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="medical" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="medicalHistory">{t('research.medicalHistory')}</Label>
                <Textarea
                  id="medicalHistory"
                  value={newParticipantForm.medicalHistory}
                  onChange={(e) => handleFormChange('medicalHistory', e.target.value)}
                  placeholder={t('research.enterMedicalHistory')}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentMedications">{t('research.currentMedications')}</Label>
                <Textarea
                  id="currentMedications"
                  value={newParticipantForm.currentMedications}
                  onChange={(e) => handleFormChange('currentMedications', e.target.value)}
                  placeholder={t('research.enterCurrentMedications')}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">{t('research.allergies')}</Label>
                <Textarea
                  id="allergies"
                  value={newParticipantForm.allergies}
                  onChange={(e) => handleFormChange('allergies', e.target.value)}
                  placeholder={t('research.enterAllergies')}
                  rows={2}
                />
              </div>
            </TabsContent>

            <TabsContent value="consent" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="consentDate">{t('research.consentDate')}</Label>
                <Input
                  id="consentDate"
                  type="date"
                  value={newParticipantForm.consentDate}
                  onChange={(e) => handleFormChange('consentDate', e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">{t('research.consentChecklist')}</h3>
                <div className="space-y-3">
                  {[
                    'Informed consent form signed',
                    'HIPAA authorization signed',
                    'Study procedures explained',
                    'Risks and benefits discussed',
                    'Right to withdraw explained',
                    'Contact information provided'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox id={`consent-${index}`} />
                      <Label htmlFor={`consent-${index}`} className="text-sm">
                        {item}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {newParticipantForm.studyId && (
                <div className="space-y-2">
                  <Label htmlFor="randomizationGroup">{t('research.randomizationGroup')}</Label>
                  <Select 
                    value={newParticipantForm.randomizationGroup} 
                    onValueChange={(value) => handleFormChange('randomizationGroup', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('research.selectGroup')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="treatment">{t('research.treatmentGroup')}</SelectItem>
                      <SelectItem value="control">{t('research.controlGroup')}</SelectItem>
                      <SelectItem value="placebo">{t('research.placeboGroup')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEnrollDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleEnrollParticipant}>
              {t('research.enrollParticipant')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Participant Details Dialog */}
      {selectedParticipant && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {t('research.participantDetails')} - {selectedParticipant.participantId}
              </DialogTitle>
              <DialogDescription>
                {selectedParticipant.studyTitle}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">{t('research.overview')}</TabsTrigger>
                <TabsTrigger value="demographics">{t('research.demographics')}</TabsTrigger>
                <TabsTrigger value="visits">{t('research.visits')}</TabsTrigger>
                <TabsTrigger value="medical">{t('research.medical')}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Calendar className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                      <p className="text-lg font-bold">
                        {Math.floor((new Date().getTime() - new Date(selectedParticipant.enrollmentDate).getTime()) / (1000 * 60 * 60 * 24))}
                      </p>
                      <p className="text-sm text-muted-foreground">{t('research.daysEnrolled')}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Heart className="h-8 w-8 mx-auto text-green-600 mb-2" />
                      <p className="text-lg font-bold">{selectedParticipant.visitCompliance}%</p>
                      <p className="text-sm text-muted-foreground">{t('research.compliance')}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <AlertTriangle className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
                      <p className="text-lg font-bold">{selectedParticipant.adverseEvents}</p>
                      <p className="text-sm text-muted-foreground">{t('research.adverseEvents')}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <CheckCircle className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                      <Badge className={getStatusBadge(selectedParticipant.status)}>
                        {t(`research.${selectedParticipant.status}`)}
                      </Badge>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">{t('research.contactInformation')}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedParticipant.contact?.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedParticipant.contact?.email}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span>{selectedParticipant.contact?.address}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">{t('research.studyInformation')}</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">{t('research.enrollmentDate')}:</span>
                        <span className="ml-2">{new Date(selectedParticipant.enrollmentDate).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="font-medium">{t('research.lastVisit')}:</span>
                        <span className="ml-2">{new Date(selectedParticipant.lastVisit).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="font-medium">{t('research.nextVisit')}:</span>
                        <span className="ml-2">
                          {selectedParticipant.nextVisit ? new Date(selectedParticipant.nextVisit).toLocaleDateString() : 'Not scheduled'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="demographics" className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">{t('research.basicDemographics')}</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">{t('research.age')}:</span>
                        <span className="ml-2">{selectedParticipant.demographics?.age} years</span>
                      </div>
                      <div>
                        <span className="font-medium">{t('research.gender')}:</span>
                        <span className="ml-2">{selectedParticipant.demographics?.gender}</span>
                      </div>
                      <div>
                        <span className="font-medium">{t('research.ethnicity')}:</span>
                        <span className="ml-2">{selectedParticipant.demographics?.ethnicity}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">{t('research.physicalMeasurements')}</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">{t('research.weight')}:</span>
                        <span className="ml-2">{selectedParticipant.demographics?.weight} kg</span>
                      </div>
                      <div>
                        <span className="font-medium">{t('research.height')}:</span>
                        <span className="ml-2">{selectedParticipant.demographics?.height} cm</span>
                      </div>
                      <div>
                        <span className="font-medium">BMI:</span>
                        <span className="ml-2">
                          {selectedParticipant.demographics?.weight && selectedParticipant.demographics?.height
                            ? (selectedParticipant.demographics.weight / Math.pow(selectedParticipant.demographics.height / 100, 2)).toFixed(1)
                            : 'N/A'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="visits" className="space-y-4">
                <p className="text-muted-foreground text-center py-8">
                  {t('research.visitHistoryAndScheduling')}
                </p>
              </TabsContent>

              <TabsContent value="medical" className="space-y-4">
                <div>
                  <h3 className="font-medium mb-3">{t('research.medicalHistory')}</h3>
                  <div className="space-y-2">
                    {selectedParticipant.medicalHistory?.map((condition, index) => (
                      <Badge key={index} variant="outline">{condition}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">{t('research.concomitantMedications')}</h3>
                  <div className="space-y-2">
                    {selectedParticipant.concomitantMeds?.map((med, index) => (
                      <Badge key={index} variant="secondary">{med}</Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                {t('common.close')}
              </Button>
              <Button>
                {t('common.edit')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ParticipantManagement;