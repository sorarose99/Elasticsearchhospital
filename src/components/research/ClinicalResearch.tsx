import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Progress } from '../ui/progress';
import { 
  TestTube,
  Users,
  FileText,
  BarChart3,
  Calendar,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Plus,
  Search,
  Filter,
  Settings,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  FileCheck,
  Target,
  TrendingUp,
  Award,
  BookOpen,
  Database,
  Activity,
  Stethoscope,
  ShieldCheck,
  ClipboardList
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';
import { getClinicalResearchTranslations } from '../../services/LanguageServiceExtended';
import { ResponsiveContainer, LineChart, BarChart, PieChart, Line, Bar, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Import sub-components
import StudyManagement from './StudyManagement';
import ParticipantManagement from './ParticipantManagement';
import DataCollection from './DataCollection';
import ProtocolManagement from './ProtocolManagement';
import RegulatoryCompliance from './RegulatoryCompliance';
import AdverseEvents from './AdverseEvents';
import DocumentManagement from './DocumentManagement';
import ResearchAnalytics from './ResearchAnalytics';

interface ClinicalResearchProps {
  isDemoMode?: boolean;
}

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
}

interface DashboardMetrics {
  totalStudies: number;
  activeStudies: number;
  completedStudies: number;
  totalParticipants: number;
  activeParticipants: number;
  enrollmentRate: number;
  completionRate: number;
  adverseEventRate: number;
  protocolDeviations: number;
  pendingApprovals: number;
}

const ClinicalResearch: React.FC<ClinicalResearchProps> = ({ isDemoMode = false }) => {
  const { t, language, isRTL } = useLanguage();
  const { effectiveTheme } = useTheme();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStudy, setSelectedStudy] = useState<StudyOverview | null>(null);
  const [showCreateStudy, setShowCreateStudy] = useState(false);

  // Demo data for dashboard metrics
  const dashboardMetrics: DashboardMetrics = {
    totalStudies: 24,
    activeStudies: 8,
    completedStudies: 12,
    totalParticipants: 1247,
    activeParticipants: 508,
    enrollmentRate: 85.2,
    completionRate: 76.8,
    adverseEventRate: 2.3,
    protocolDeviations: 12,
    pendingApprovals: 5
  };

  // Demo studies data
  const studiesData: StudyOverview[] = [
    {
      id: 'study-001',
      title: 'Efficacy of New Cardiac Drug in Heart Failure Patients',
      phase: 'Phase III',
      status: 'recruiting',
      principalInvestigator: 'Dr. Ahmed Hassan',
      startDate: '2024-01-15',
      endDate: '2025-12-31',
      totalParticipants: 200,
      enrolledParticipants: 156,
      targetEnrollment: 200,
      completionRate: 78.0,
      adverseEvents: 3,
      lastUpdate: '2024-12-28'
    },
    {
      id: 'study-002',
      title: 'Diabetes Management Mobile App Clinical Trial',
      phase: 'Phase II',
      status: 'active',
      principalInvestigator: 'Dr. Sara Mohamed',
      startDate: '2024-03-01',
      endDate: '2024-10-30',
      totalParticipants: 120,
      enrolledParticipants: 120,
      targetEnrollment: 120,
      completionRate: 92.5,
      adverseEvents: 1,
      lastUpdate: '2024-12-27'
    },
    {
      id: 'study-003',
      title: 'Cancer Immunotherapy Combination Study',
      phase: 'Phase I',
      status: 'planning',
      principalInvestigator: 'Dr. Omar Ali',
      startDate: '2025-02-01',
      totalParticipants: 0,
      enrolledParticipants: 0,
      targetEnrollment: 80,
      completionRate: 0,
      adverseEvents: 0,
      lastUpdate: '2024-12-25'
    },
    {
      id: 'study-004',
      title: 'Pediatric Asthma Prevention Study',
      phase: 'Phase II',
      status: 'completed',
      principalInvestigator: 'Dr. Fatima Khan',
      startDate: '2023-06-01',
      endDate: '2024-05-31',
      totalParticipants: 150,
      enrolledParticipants: 150,
      targetEnrollment: 150,
      completionRate: 94.7,
      adverseEvents: 2,
      lastUpdate: '2024-06-01'
    }
  ];

  // Demo participants data
  const participantsData: ParticipantData[] = [
    {
      id: 'part-001',
      participantId: 'CARD-001-156',
      studyId: 'study-001',
      studyTitle: 'Efficacy of New Cardiac Drug in Heart Failure Patients',
      enrollmentDate: '2024-08-15',
      status: 'active',
      visitCompliance: 95.2,
      lastVisit: '2024-12-20',
      nextVisit: '2025-01-10',
      adverseEvents: 0
    },
    {
      id: 'part-002',
      participantId: 'DIAB-002-089',
      studyId: 'study-002',
      studyTitle: 'Diabetes Management Mobile App Clinical Trial',
      enrollmentDate: '2024-06-10',
      status: 'completed',
      visitCompliance: 100.0,
      lastVisit: '2024-10-25',
      nextVisit: '',
      adverseEvents: 0
    },
    {
      id: 'part-003',
      participantId: 'CARD-001-067',
      studyId: 'study-001',
      studyTitle: 'Efficacy of New Cardiac Drug in Heart Failure Patients',
      enrollmentDate: '2024-05-22',
      status: 'withdrawn',
      visitCompliance: 67.3,
      lastVisit: '2024-11-15',
      nextVisit: '',
      adverseEvents: 1
    }
  ];

  // Chart data for dashboard
  const enrollmentTrendData = [
    { month: 'Jan', enrolled: 32, target: 40 },
    { month: 'Feb', enrolled: 45, target: 50 },
    { month: 'Mar', enrolled: 28, target: 35 },
    { month: 'Apr', enrolled: 62, target: 60 },
    { month: 'May', enrolled: 58, target: 65 },
    { month: 'Jun', enrolled: 71, target: 70 },
    { month: 'Jul', enrolled: 84, target: 80 },
    { month: 'Aug', enrolled: 76, target: 85 },
    { month: 'Sep', enrolled: 89, target: 90 },
    { month: 'Oct', enrolled: 95, target: 100 },
    { month: 'Nov', enrolled: 103, target: 110 },
    { month: 'Dec', enrolled: 87, target: 95 }
  ];

  const studyStatusData = [
    { name: 'Planning', value: 4, color: '#8b5cf6' },
    { name: 'Recruiting', value: 3, color: '#3b82f6' },
    { name: 'Active', value: 8, color: '#10b981' },
    { name: 'Completed', value: 12, color: '#06b6d4' },
    { name: 'Suspended', value: 2, color: '#f59e0b' },
    { name: 'Terminated', value: 1, color: '#ef4444' }
  ];

  const phaseDistributionData = [
    { phase: 'Phase I', count: 6 },
    { phase: 'Phase II', count: 10 },
    { phase: 'Phase III', count: 5 },
    { phase: 'Phase IV', count: 3 }
  ];

  // Filter functions
  const filteredStudies = useMemo(() => {
    return studiesData.filter(study => {
      const matchesSearch = study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           study.principalInvestigator.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || study.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus]);

  // Status badge styling
  const getStatusBadge = (status: string) => {
    const styles = {
      planning: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      recruiting: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      completed: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      suspended: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      terminated: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      screening: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      enrolled: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      withdrawn: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      discontinued: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  // Dashboard metrics cards
  const renderDashboardMetrics = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('research.totalStudies')}</p>
              <p className="text-2xl font-bold">{dashboardMetrics.totalStudies}</p>
            </div>
            <TestTube className="h-8 w-8 text-primary" />
          </div>
          <div className="flex items-center mt-2 text-sm">
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600">+12%</span>
            <span className="text-muted-foreground ml-1">{t('research.fromLastYear')}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('research.activeStudies')}</p>
              <p className="text-2xl font-bold">{dashboardMetrics.activeStudies}</p>
            </div>
            <Activity className="h-8 w-8 text-green-600" />
          </div>
          <div className="flex items-center mt-2 text-sm">
            <Clock className="h-4 w-4 text-blue-600 mr-1" />
            <span className="text-muted-foreground">{t('research.recruiting')}: 3</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('research.totalParticipants')}</p>
              <p className="text-2xl font-bold">{dashboardMetrics.totalParticipants.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <div className="flex items-center mt-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600">{dashboardMetrics.activeParticipants}</span>
            <span className="text-muted-foreground ml-1">{t('research.active')}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('research.enrollmentRate')}</p>
              <p className="text-2xl font-bold">{dashboardMetrics.enrollmentRate}%</p>
            </div>
            <Target className="h-8 w-8 text-yellow-600" />
          </div>
          <div className="flex items-center mt-2 text-sm">
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600">+5.2%</span>
            <span className="text-muted-foreground ml-1">{t('research.thisMonth')}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('research.completionRate')}</p>
              <p className="text-2xl font-bold">{dashboardMetrics.completionRate}%</p>
            </div>
            <Award className="h-8 w-8 text-purple-600" />
          </div>
          <div className="flex items-center mt-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-muted-foreground">{t('research.aboveTarget')}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Dashboard charts
  const renderDashboardCharts = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {t('research.enrollmentTrend')}
          </CardTitle>
          <CardDescription>{t('research.monthlyEnrollmentVsTarget')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enrollmentTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="enrolled" fill="#3b82f6" name={t('research.enrolled')} />
                <Bar dataKey="target" fill="#10b981" name={t('research.target')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {t('research.studyStatusDistribution')}
          </CardTitle>
          <CardDescription>{t('research.currentStudyStatuses')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={studyStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {studyStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Studies overview table
  const renderStudiesOverview = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t('research.recentStudies')}
            </CardTitle>
            <CardDescription>{t('research.overviewOfCurrentStudies')}</CardDescription>
          </div>
          <Button onClick={() => setShowCreateStudy(true)} className="flex items-center gap-2">
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
              <SelectValue />
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
                <TableHead>{t('research.principalInvestigator')}</TableHead>
                <TableHead>{t('research.enrollment')}</TableHead>
                <TableHead>{t('research.completion')}</TableHead>
                <TableHead>{t('research.adverseEvents')}</TableHead>
                <TableHead>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudies.map((study) => (
                <TableRow key={study.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{study.title}</p>
                      <p className="text-sm text-muted-foreground">ID: {study.id}</p>
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
                  <TableCell>{study.principalInvestigator}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{study.enrolledParticipants}/{study.targetEnrollment}</span>
                      <Progress 
                        value={(study.enrolledParticipants / study.targetEnrollment) * 100} 
                        className="w-16 h-2"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{study.completionRate}%</span>
                      <Progress 
                        value={study.completionRate} 
                        className="w-16 h-2"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {study.adverseEvents > 0 ? (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      <span>{study.adverseEvents}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedStudy(study)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
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

  // Quick actions panel
  const renderQuickActions = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          {t('research.quickActions')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
            <UserPlus className="h-6 w-6" />
            <span className="text-sm">{t('research.enrollParticipant')}</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
            <FileCheck className="h-6 w-6" />
            <span className="text-sm">{t('research.dataEntry')}</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            <span className="text-sm">{t('research.reportAE')}</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
            <BarChart3 className="h-6 w-6" />
            <span className="text-sm">{t('research.generateReport')}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Alerts and notifications
  const renderAlertsNotifications = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          {t('research.alertsNotifications')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800 dark:text-yellow-200">
                {t('research.protocolDeviation')}
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Study CARD-001: Participant missed scheduled visit. Action required.
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">2 hours ago</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-200">
                {t('research.upcomingVisits')}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                15 participants scheduled for visits this week.
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Today</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">
                {t('research.milestoneReached')}
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Study DIAB-002 reached 100% enrollment target.
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">Yesterday</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TestTube className="h-8 w-8 text-primary" />
            {t('research.clinicalResearch')}
          </h1>
          <p className="text-muted-foreground">
            {t('research.comprehensiveResearchManagement')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {t('research.exportData')}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            {t('research.newStudy')}
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">{t('research.dashboard')}</span>
          </TabsTrigger>
          <TabsTrigger value="studies" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            <span className="hidden sm:inline">{t('research.studies')}</span>
          </TabsTrigger>
          <TabsTrigger value="participants" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">{t('research.participants')}</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">{t('research.data')}</span>
          </TabsTrigger>
          <TabsTrigger value="protocols" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">{t('research.protocols')}</span>
          </TabsTrigger>
          <TabsTrigger value="regulatory" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span className="hidden sm:inline">{t('research.regulatory')}</span>
          </TabsTrigger>
          <TabsTrigger value="adverse" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">{t('research.adverseEvents')}</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">{t('research.documents')}</span>
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {renderDashboardMetrics()}
          {renderDashboardCharts()}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {renderStudiesOverview()}
            </div>
            <div className="space-y-6">
              {renderQuickActions()}
              {renderAlertsNotifications()}
            </div>
          </div>
        </TabsContent>

        {/* Studies Tab */}
        <TabsContent value="studies">
          <StudyManagement 
            studies={studiesData}
            onCreateStudy={() => setShowCreateStudy(true)}
            onEditStudy={(study) => setSelectedStudy(study)}
            isDemoMode={isDemoMode}
          />
        </TabsContent>

        {/* Participants Tab */}
        <TabsContent value="participants">
          <ParticipantManagement 
            participants={participantsData}
            studies={studiesData}
            isDemoMode={isDemoMode}
          />
        </TabsContent>

        {/* Data Collection Tab */}
        <TabsContent value="data">
          <DataCollection 
            studies={studiesData}
            participants={participantsData}
            isDemoMode={isDemoMode}
          />
        </TabsContent>

        {/* Protocols Tab */}
        <TabsContent value="protocols">
          <ProtocolManagement 
            studies={studiesData}
            isDemoMode={isDemoMode}
          />
        </TabsContent>

        {/* Regulatory Tab */}
        <TabsContent value="regulatory">
          <RegulatoryCompliance 
            studies={studiesData}
            isDemoMode={isDemoMode}
          />
        </TabsContent>

        {/* Adverse Events Tab */}
        <TabsContent value="adverse">
          <AdverseEvents 
            studies={studiesData}
            participants={participantsData}
            isDemoMode={isDemoMode}
          />
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <DocumentManagement 
            studies={studiesData}
            isDemoMode={isDemoMode}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClinicalResearch;