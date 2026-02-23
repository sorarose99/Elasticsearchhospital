import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { 
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Trash2,
  Calendar,
  Users,
  FileText,
  Settings,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  StopCircle,
  BarChart3,
  Download,
  Upload,
  Copy,
  Archive
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';

interface StudyOverview {
  id: string;
  title: string;
  phase: string;
  status: 'planning' | 'recruiting' | 'active' | 'completed' | 'suspended' | 'terminated';
  principalInvestigator: string;
  startDate: string;
  endDate?: string;
  totalParticipants: number;
  enrolledParticipants: number;
  targetEnrollment: number;
  completionRate: number;
  adverseEvents: number;
  lastUpdate: string;
  description?: string;
  sponsor?: string;
  therapeuticArea?: string;
  studyType?: string;
}

interface StudyManagementProps {
  studies: StudyOverview[];
  onCreateStudy: () => void;
  onEditStudy: (study: StudyOverview) => void;
  isDemoMode?: boolean;
}

interface NewStudyForm {
  title: string;
  description: string;
  phase: string;
  therapeuticArea: string;
  studyType: string;
  principalInvestigator: string;
  sponsor: string;
  targetEnrollment: number;
  startDate: string;
  estimatedEndDate: string;
  objectives: string;
  inclusionCriteria: string;
  exclusionCriteria: string;
}

const StudyManagement: React.FC<StudyManagementProps> = ({
  studies,
  onCreateStudy,
  onEditStudy,
  isDemoMode = false
}) => {
  const { t, language, isRTL } = useLanguage();
  const { effectiveTheme } = useTheme();

  const [activeView, setActiveView] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPhase, setFilterPhase] = useState('all');
  const [selectedStudy, setSelectedStudy] = useState<StudyOverview | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [newStudyForm, setNewStudyForm] = useState<NewStudyForm>({
    title: '',
    description: '',
    phase: '',
    therapeuticArea: '',
    studyType: '',
    principalInvestigator: '',
    sponsor: '',
    targetEnrollment: 0,
    startDate: '',
    estimatedEndDate: '',
    objectives: '',
    inclusionCriteria: '',
    exclusionCriteria: ''
  });

  // Extended studies data with additional details
  const extendedStudies = studies.map(study => ({
    ...study,
    description: study.description || 'Comprehensive clinical study to evaluate efficacy and safety.',
    sponsor: study.sponsor || 'Hospital Research Institute',
    therapeuticArea: study.therapeuticArea || getTherapeuticArea(study.title),
    studyType: study.studyType || 'Interventional'
  }));

  function getTherapeuticArea(title: string): string {
    if (title.toLowerCase().includes('cardiac') || title.toLowerCase().includes('heart')) return 'Cardiology';
    if (title.toLowerCase().includes('diabetes')) return 'Endocrinology';
    if (title.toLowerCase().includes('cancer') || title.toLowerCase().includes('oncology')) return 'Oncology';
    if (title.toLowerCase().includes('asthma') || title.toLowerCase().includes('respiratory')) return 'Respiratory';
    return 'General Medicine';
  }

  // Filter studies
  const filteredStudies = useMemo(() => {
    return extendedStudies.filter(study => {
      const matchesSearch = study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           study.principalInvestigator.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           study.therapeuticArea.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || study.status === filterStatus;
      const matchesPhase = filterPhase === 'all' || study.phase === filterPhase;
      return matchesSearch && matchesStatus && matchesPhase;
    });
  }, [extendedStudies, searchTerm, filterStatus, filterPhase]);

  // Status badge styling
  const getStatusBadge = (status: string) => {
    const styles = {
      planning: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      recruiting: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      completed: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      suspended: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      terminated: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  // Phase options
  const phaseOptions = [
    { value: 'preclinical', label: 'Preclinical' },
    { value: 'phase-i', label: 'Phase I' },
    { value: 'phase-ii', label: 'Phase II' },
    { value: 'phase-iii', label: 'Phase III' },
    { value: 'phase-iv', label: 'Phase IV' }
  ];

  // Therapeutic areas
  const therapeuticAreas = [
    'Cardiology', 'Endocrinology', 'Oncology', 'Neurology',
    'Respiratory', 'Gastroenterology', 'Infectious Diseases',
    'Psychiatry', 'Dermatology', 'Rheumatology'
  ];

  // Study types
  const studyTypes = [
    'Interventional', 'Observational', 'Registry',
    'Diagnostic', 'Prevention', 'Supportive Care'
  ];

  // Handle form input changes
  const handleFormChange = (field: keyof NewStudyForm, value: string | number) => {
    setNewStudyForm(prev => ({ ...prev, [field]: value }));
  };

  // Handle study creation
  const handleCreateStudy = () => {
    console.log('Creating new study:', newStudyForm);
    setShowCreateDialog(false);
    setNewStudyForm({
      title: '',
      description: '',
      phase: '',
      therapeuticArea: '',
      studyType: '',
      principalInvestigator: '',
      sponsor: '',
      targetEnrollment: 0,
      startDate: '',
      estimatedEndDate: '',
      objectives: '',
      inclusionCriteria: '',
      exclusionCriteria: ''
    });
  };

  // Handle study status change
  const handleStatusChange = (studyId: string, newStatus: string) => {
    console.log(`Changing study ${studyId} status to ${newStatus}`);
  };

  // Studies overview table
  const renderStudiesTable = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t('research.studiesOverview')}
            </CardTitle>
            <CardDescription>
              {t('research.manageAllClinicalStudies')}
            </CardDescription>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t('research.newStudy')}
          </Button>
        </div>

        {/* Search and filters */}
        <div className="flex gap-4 mt-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('research.searchStudies')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('research.status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('research.allStatuses')}</SelectItem>
              <SelectItem value="planning">{t('research.planning')}</SelectItem>
              <SelectItem value="recruiting">{t('research.recruiting')}</SelectItem>
              <SelectItem value="active">{t('research.active')}</SelectItem>
              <SelectItem value="completed">{t('research.completed')}</SelectItem>
              <SelectItem value="suspended">{t('research.suspended')}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPhase} onValueChange={setFilterPhase}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('research.phase')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('research.allPhases')}</SelectItem>
              {phaseOptions.map(phase => (
                <SelectItem key={phase.value} value={phase.value}>
                  {phase.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('research.studyTitle')}</TableHead>
                <TableHead>{t('research.phase')}</TableHead>
                <TableHead>{t('research.status')}</TableHead>
                <TableHead>{t('research.therapeuticArea')}</TableHead>
                <TableHead>{t('research.principalInvestigator')}</TableHead>
                <TableHead>{t('research.enrollment')}</TableHead>
                <TableHead>{t('research.timeline')}</TableHead>
                <TableHead>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudies.map((study) => (
                <TableRow key={study.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{study.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {study.studyType} • {study.sponsor}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{study.phase}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(study.status)}>
                      {t(`research.${study.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>{study.therapeuticArea}</TableCell>
                  <TableCell>{study.principalInvestigator}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {study.enrolledParticipants}/{study.targetEnrollment}
                        </span>
                        <Progress 
                          value={(study.enrolledParticipants / study.targetEnrollment) * 100} 
                          className="w-16 h-2"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {((study.enrolledParticipants / study.targetEnrollment) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{new Date(study.startDate).toLocaleDateString()}</p>
                      {study.endDate && (
                        <p className="text-muted-foreground">
                          - {new Date(study.endDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedStudy(study);
                          setShowDetailsDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditStudy(study)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
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

  // Study timeline view
  const renderTimelineView = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {t('research.studyTimeline')}
        </CardTitle>
        <CardDescription>
          {t('research.timelineViewOfAllStudies')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredStudies.map((study) => (
            <div key={study.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium">{study.title}</h3>
                  <Badge className={getStatusBadge(study.status)}>
                    {t(`research.${study.status}`)}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{study.phase}</span>
                  <span>{study.therapeuticArea}</span>
                  <span>{study.principalInvestigator}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-sm font-medium">{t('research.start')}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(study.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="w-32">
                  <Progress value={study.completionRate} className="h-2" />
                  <p className="text-xs text-center text-muted-foreground mt-1">
                    {study.completionRate}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{t('research.end')}</p>
                  <p className="text-xs text-muted-foreground">
                    {study.endDate ? new Date(study.endDate).toLocaleDateString() : 'TBD'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Study analytics view
  const renderAnalyticsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('research.studiesByPhase')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {phaseOptions.map(phase => {
              const count = filteredStudies.filter(s => s.phase === phase.label).length;
              const percentage = filteredStudies.length > 0 ? (count / filteredStudies.length) * 100 : 0;
              return (
                <div key={phase.value} className="flex items-center justify-between">
                  <span className="text-sm">{phase.label}</span>
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
          <CardTitle className="text-lg">{t('research.studiesByStatus')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {['planning', 'recruiting', 'active', 'completed', 'suspended'].map(status => {
              const count = filteredStudies.filter(s => s.status === status).length;
              const percentage = filteredStudies.length > 0 ? (count / filteredStudies.length) * 100 : 0;
              return (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm">{t(`research.${status}`)}</span>
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
          <CardTitle className="text-lg">{t('research.enrollmentProgress')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredStudies.slice(0, 5).map(study => {
              const percentage = (study.enrolledParticipants / study.targetEnrollment) * 100;
              return (
                <div key={study.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate">{study.title.substring(0, 20)}...</span>
                    <span>{study.enrolledParticipants}/{study.targetEnrollment}</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* View selector */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t('research.overview')}
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t('research.timeline')}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {t('research.analytics')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {renderStudiesTable()}
        </TabsContent>

        <TabsContent value="timeline">
          {renderTimelineView()}
        </TabsContent>

        <TabsContent value="analytics">
          {renderAnalyticsView()}
        </TabsContent>
      </Tabs>

      {/* Create Study Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('research.createNewStudy')}</DialogTitle>
            <DialogDescription>
              {t('research.fillOutStudyDetails')}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">{t('research.basicInfo')}</TabsTrigger>
              <TabsTrigger value="design">{t('research.studyDesign')}</TabsTrigger>
              <TabsTrigger value="criteria">{t('research.criteria')}</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t('research.studyTitle')}</Label>
                  <Input
                    id="title"
                    value={newStudyForm.title}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                    placeholder={t('research.enterStudyTitle')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phase">{t('research.phase')}</Label>
                  <Select value={newStudyForm.phase} onValueChange={(value) => handleFormChange('phase', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('research.selectPhase')} />
                    </SelectTrigger>
                    <SelectContent>
                      {phaseOptions.map(phase => (
                        <SelectItem key={phase.value} value={phase.value}>
                          {phase.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('research.description')}</Label>
                <Textarea
                  id="description"
                  value={newStudyForm.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder={t('research.enterStudyDescription')}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="therapeuticArea">{t('research.therapeuticArea')}</Label>
                  <Select 
                    value={newStudyForm.therapeuticArea} 
                    onValueChange={(value) => handleFormChange('therapeuticArea', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('research.selectTherapeuticArea')} />
                    </SelectTrigger>
                    <SelectContent>
                      {therapeuticAreas.map(area => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studyType">{t('research.studyType')}</Label>
                  <Select 
                    value={newStudyForm.studyType} 
                    onValueChange={(value) => handleFormChange('studyType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('research.selectStudyType')} />
                    </SelectTrigger>
                    <SelectContent>
                      {studyTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="principalInvestigator">{t('research.principalInvestigator')}</Label>
                  <Input
                    id="principalInvestigator"
                    value={newStudyForm.principalInvestigator}
                    onChange={(e) => handleFormChange('principalInvestigator', e.target.value)}
                    placeholder={t('research.enterPIName')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sponsor">{t('research.sponsor')}</Label>
                  <Input
                    id="sponsor"
                    value={newStudyForm.sponsor}
                    onChange={(e) => handleFormChange('sponsor', e.target.value)}
                    placeholder={t('research.enterSponsorName')}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="design" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetEnrollment">{t('research.targetEnrollment')}</Label>
                  <Input
                    id="targetEnrollment"
                    type="number"
                    value={newStudyForm.targetEnrollment}
                    onChange={(e) => handleFormChange('targetEnrollment', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">{t('research.startDate')}</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newStudyForm.startDate}
                    onChange={(e) => handleFormChange('startDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedEndDate">{t('research.estimatedEndDate')}</Label>
                  <Input
                    id="estimatedEndDate"
                    type="date"
                    value={newStudyForm.estimatedEndDate}
                    onChange={(e) => handleFormChange('estimatedEndDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="objectives">{t('research.objectives')}</Label>
                <Textarea
                  id="objectives"
                  value={newStudyForm.objectives}
                  onChange={(e) => handleFormChange('objectives', e.target.value)}
                  placeholder={t('research.enterStudyObjectives')}
                  rows={4}
                />
              </div>
            </TabsContent>

            <TabsContent value="criteria" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inclusionCriteria">{t('research.inclusionCriteria')}</Label>
                <Textarea
                  id="inclusionCriteria"
                  value={newStudyForm.inclusionCriteria}
                  onChange={(e) => handleFormChange('inclusionCriteria', e.target.value)}
                  placeholder={t('research.enterInclusionCriteria')}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exclusionCriteria">{t('research.exclusionCriteria')}</Label>
                <Textarea
                  id="exclusionCriteria"
                  value={newStudyForm.exclusionCriteria}
                  onChange={(e) => handleFormChange('exclusionCriteria', e.target.value)}
                  placeholder={t('research.enterExclusionCriteria')}
                  rows={4}
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleCreateStudy}>
              {t('research.createStudy')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Study Details Dialog */}
      {selectedStudy && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedStudy.title}</DialogTitle>
              <DialogDescription>
                {selectedStudy.phase} • {selectedStudy.therapeuticArea}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <Users className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                    <p className="text-2xl font-bold">{selectedStudy.enrolledParticipants}</p>
                    <p className="text-sm text-muted-foreground">{t('research.enrolled')}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <Target className="h-8 w-8 mx-auto text-green-600 mb-2" />
                    <p className="text-2xl font-bold">{selectedStudy.targetEnrollment}</p>
                    <p className="text-sm text-muted-foreground">{t('research.target')}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <BarChart3 className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                    <p className="text-2xl font-bold">{selectedStudy.completionRate}%</p>
                    <p className="text-sm text-muted-foreground">{t('research.completion')}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <AlertTriangle className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
                    <p className="text-2xl font-bold">{selectedStudy.adverseEvents}</p>
                    <p className="text-sm text-muted-foreground">{t('research.adverseEvents')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">{t('research.studyDetails')}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">{t('research.principalInvestigator')}:</span>
                    <span className="ml-2">{selectedStudy.principalInvestigator}</span>
                  </div>
                  <div>
                    <span className="font-medium">{t('research.sponsor')}:</span>
                    <span className="ml-2">{selectedStudy.sponsor}</span>
                  </div>
                  <div>
                    <span className="font-medium">{t('research.studyType')}:</span>
                    <span className="ml-2">{selectedStudy.studyType}</span>
                  </div>
                  <div>
                    <span className="font-medium">{t('research.status')}:</span>
                    <Badge className={`ml-2 ${getStatusBadge(selectedStudy.status)}`}>
                      {t(`research.${selectedStudy.status}`)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">{t('research.timeline')}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">{t('research.startDate')}:</span>
                    <span className="ml-2">{new Date(selectedStudy.startDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="font-medium">{t('research.endDate')}:</span>
                    <span className="ml-2">
                      {selectedStudy.endDate ? new Date(selectedStudy.endDate).toLocaleDateString() : 'TBD'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">{t('research.description')}</h3>
                <p className="text-sm text-muted-foreground">{selectedStudy.description}</p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                {t('common.close')}
              </Button>
              <Button onClick={() => onEditStudy(selectedStudy)}>
                {t('common.edit')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default StudyManagement;