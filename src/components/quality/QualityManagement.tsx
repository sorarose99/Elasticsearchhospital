import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { 
  Star, 
  BarChart3, 
  Activity, 
  Search, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  Clock,
  Shield,
  Award,
  Target,
  FileText,
  Calendar,
  Plus,
  Edit,
  Save,
  Eye,
  Download,
  Upload,
  Filter,
  RefreshCw,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Timer,
  ClipboardList,
  UserCheck,
  Settings,
  Zap,
  Heart,
  Brain,
  Stethoscope
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useNavigation } from '../navigation/NavigationContext';

interface QualityIndicator {
  id: string;
  name: string;
  nameAr: string;
  category: 'patient_safety' | 'clinical_effectiveness' | 'patient_experience' | 'efficiency' | 'staff_satisfaction' | 'financial_performance';
  currentValue: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'acceptable' | 'poor' | 'critical';
  lastUpdated: Date;
  description: string;
  descriptionAr: string;
  dataSource: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  benchmark?: number;
  historicalData: Array<{ date: Date; value: number }>;
  actionPlan?: string;
}

interface QualityAudit {
  id: string;
  title: string;
  titleAr: string;
  department: string;
  auditor: string;
  auditTeam: string[];
  date: Date;
  plannedDate?: Date;
  completionDate?: Date;
  status: 'planned' | 'in_progress' | 'completed' | 'follow_up_required' | 'cancelled';
  score: number;
  maxScore: number;
  findings: Array<{
    id: string;
    category: string;
    description: string;
    descriptionAr: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    evidence: string;
    recommendation: string;
    assignedTo?: string;
    dueDate?: Date;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
  }>;
  recommendations: Array<{
    id: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    assignedTo: string;
    dueDate: Date;
    status: 'pending' | 'in_progress' | 'completed';
    impact: string;
  }>;
  auditType: 'internal' | 'external' | 'regulatory' | 'accreditation';
  standards: string[];
  nextAuditDate?: Date;
}

interface QualityImprovement {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'proposed' | 'approved' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  assignee: string;
  team: string[];
  sponsor: string;
  startDate: Date;
  expectedCompletion: Date;
  actualCompletion?: Date;
  progress: number;
  impact: string;
  impactAr: string;
  category: 'process_improvement' | 'technology' | 'training' | 'policy' | 'infrastructure';
  budget?: number;
  roi?: number;
  kpis: Array<{
    name: string;
    baseline: number;
    target: number;
    current?: number;
    unit: string;
  }>;
  milestones: Array<{
    id: string;
    name: string;
    dueDate: Date;
    status: 'pending' | 'completed' | 'overdue';
    description: string;
  }>;
  risks: Array<{
    description: string;
    probability: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    mitigation: string;
  }>;
}

interface QualityEvent {
  id: string;
  type: 'incident' | 'near_miss' | 'complaint' | 'compliment' | 'suggestion';
  title: string;
  description: string;
  reportedBy: string;
  reportedDate: Date;
  department: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'investigating' | 'resolved' | 'closed';
  assignedTo?: string;
  rootCause?: string;
  correctiveActions: Array<{
    action: string;
    assignedTo: string;
    dueDate: Date;
    status: 'pending' | 'completed';
  }>;
  preventiveActions: Array<{
    action: string;
    assignedTo: string;
    dueDate: Date;
    status: 'pending' | 'completed';
  }>;
  followUpRequired: boolean;
  followUpDate?: Date;
}

const QualityManagement: React.FC = () => {
  const { language } = useLanguage();
  const { navigation } = useNavigation();
  const [indicators, setIndicators] = useState<QualityIndicator[]>([]);
  const [audits, setAudits] = useState<QualityAudit[]>([]);
  const [improvements, setImprovements] = useState<QualityImprovement[]>([]);
  const [qualityEvents, setQualityEvents] = useState<QualityEvent[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedIndicator, setSelectedIndicator] = useState<QualityIndicator | null>(null);
  const [selectedAudit, setSelectedAudit] = useState<QualityAudit | null>(null);
  const [selectedImprovement, setSelectedImprovement] = useState<QualityImprovement | null>(null);
  const [newAuditDialog, setNewAuditDialog] = useState(false);
  const [newImprovementDialog, setNewImprovementDialog] = useState(false);
  const [newEventDialog, setNewEventDialog] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    // Enhanced mock data with comprehensive quality management scenarios
    const mockIndicators: QualityIndicator[] = [
      {
        id: 'QI001',
        name: 'Patient Satisfaction Score',
        nameAr: 'نقاط رضا المرضى',
        category: 'patient_experience',
        currentValue: 4.2,
        target: 4.5,
        unit: '/5.0',
        trend: 'up',
        status: 'good',
        lastUpdated: new Date(),
        description: 'Average patient satisfaction rating based on post-discharge surveys',
        descriptionAr: 'متوسط تقييم رضا المرضى بناء على استطلاعات ما بعد الخروج',
        dataSource: 'Patient Survey System',
        frequency: 'monthly',
        benchmark: 4.3,
        historicalData: [
          { date: new Date(2024, 0, 1), value: 4.0 },
          { date: new Date(2024, 1, 1), value: 4.1 },
          { date: new Date(2024, 2, 1), value: 4.2 }
        ],
        actionPlan: 'Implement staff communication training program'
      },
      {
        id: 'QI002',
        name: 'Hospital-Acquired Infection Rate',
        nameAr: 'معدل العدوى المكتسبة في المستشفى',
        category: 'patient_safety',
        currentValue: 2.1,
        target: 2.0,
        unit: '%',
        trend: 'down',
        status: 'acceptable',
        lastUpdated: new Date(),
        description: 'Percentage of patients who develop infections during hospital stay',
        descriptionAr: 'نسبة المرضى الذين يصابون بعدوى أثناء الإقامة في المستشفى',
        dataSource: 'Infection Control Database',
        frequency: 'monthly',
        benchmark: 1.8,
        historicalData: [
          { date: new Date(2024, 0, 1), value: 2.5 },
          { date: new Date(2024, 1, 1), value: 2.3 },
          { date: new Date(2024, 2, 1), value: 2.1 }
        ],
        actionPlan: 'Enhanced hand hygiene compliance monitoring'
      },
      {
        id: 'QI003',
        name: 'Average Length of Stay',
        nameAr: 'متوسط مدة الإقامة',
        category: 'efficiency',
        currentValue: 3.8,
        target: 3.5,
        unit: 'days',
        trend: 'stable',
        status: 'acceptable',
        lastUpdated: new Date(),
        description: 'Average number of days patients stay in the hospital',
        descriptionAr: 'متوسط عدد الأيام التي يقضيها المرضى في المستشفى',
        dataSource: 'Hospital Information System',
        frequency: 'monthly',
        benchmark: 3.2,
        historicalData: [
          { date: new Date(2024, 0, 1), value: 3.9 },
          { date: new Date(2024, 1, 1), value: 3.8 },
          { date: new Date(2024, 2, 1), value: 3.8 }
        ]
      },
      {
        id: 'QI004',
        name: 'Medication Error Rate',
        nameAr: 'معدل أخطاء الأدوية',
        category: 'patient_safety',
        currentValue: 0.8,
        target: 0.5,
        unit: '%',
        trend: 'down',
        status: 'good',
        lastUpdated: new Date(),
        description: 'Percentage of medication administrations with errors',
        descriptionAr: 'نسبة إعطاء الأدوية التي تحتوي على أخطاء',
        dataSource: 'Pharmacy Management System',
        frequency: 'monthly',
        benchmark: 0.6,
        historicalData: [
          { date: new Date(2024, 0, 1), value: 1.2 },
          { date: new Date(2024, 1, 1), value: 1.0 },
          { date: new Date(2024, 2, 1), value: 0.8 }
        ],
        actionPlan: 'Implement barcode medication administration'
      },
      {
        id: 'QI005',
        name: 'Staff Satisfaction Index',
        nameAr: 'مؤشر رضا الموظفين',
        category: 'staff_satisfaction',
        currentValue: 3.9,
        target: 4.2,
        unit: '/5.0',
        trend: 'up',
        status: 'acceptable',
        lastUpdated: new Date(),
        description: 'Overall staff satisfaction based on annual survey',
        descriptionAr: 'رضا الموظفين الإجمالي بناء على الاستطلاع السنوي',
        dataSource: 'HR Survey System',
        frequency: 'quarterly',
        benchmark: 4.0,
        historicalData: [
          { date: new Date(2024, 0, 1), value: 3.7 },
          { date: new Date(2024, 1, 1), value: 3.8 },
          { date: new Date(2024, 2, 1), value: 3.9 }
        ]
      },
      {
        id: 'QI006',
        name: 'Revenue per Patient',
        nameAr: 'الإيرادات لكل مريض',
        category: 'financial_performance',
        currentValue: 2850,
        target: 3000,
        unit: '$',
        trend: 'up',
        status: 'good',
        lastUpdated: new Date(),
        description: 'Average revenue generated per patient admission',
        descriptionAr: 'متوسط الإيرادات المحققة لكل مريض',
        dataSource: 'Financial Management System',
        frequency: 'monthly',
        benchmark: 2900,
        historicalData: [
          { date: new Date(2024, 0, 1), value: 2750 },
          { date: new Date(2024, 1, 1), value: 2800 },
          { date: new Date(2024, 2, 1), value: 2850 }
        ]
      }
    ];

    const mockAudits: QualityAudit[] = [
      {
        id: 'QA001',
        title: 'Emergency Department Quality Audit',
        titleAr: 'مراجعة جودة قسم الطوارئ',
        department: 'Emergency Department',
        auditor: 'Dr. Sarah Ahmed',
        auditTeam: ['Dr. Sarah Ahmed', 'Nurse Manager Lisa', 'Quality Coordinator John'],
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        plannedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        completionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: 'completed',
        score: 85,
        maxScore: 100,
        auditType: 'internal',
        standards: ['Joint Commission', 'CMS Guidelines', 'Hospital Policy'],
        nextAuditDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        findings: [
          {
            id: 'F001',
            category: 'Documentation',
            description: 'Some patient charts missing required signatures',
            descriptionAr: 'بعض ملفات المرضى تفتقر للتوقيعات المطلوبة',
            severity: 'medium',
            evidence: '15% of charts reviewed lacked physician signatures',
            recommendation: 'Implement electronic signature system',
            assignedTo: 'IT Department',
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: 'in_progress'
          },
          {
            id: 'F002',
            category: 'Patient Care',
            description: 'Excellent triage protocols and patient flow',
            descriptionAr: 'بروتوكولات فرز ممتازة وتدفق المرضى',
            severity: 'low',
            evidence: 'Average wait time reduced by 20%',
            recommendation: 'Continue current triage training program',
            status: 'resolved'
          },
          {
            id: 'F003',
            category: 'Safety',
            description: 'Hand hygiene compliance below target',
            descriptionAr: 'امتثال نظافة اليدين أقل من المستهدف',
            severity: 'high',
            evidence: '78% compliance vs 95% target',
            recommendation: 'Increase monitoring and feedback',
            assignedTo: 'Infection Control Team',
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            status: 'open'
          }
        ],
        recommendations: [
          {
            id: 'R001',
            description: 'Implement electronic signature system',
            priority: 'high',
            assignedTo: 'IT Department',
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: 'in_progress',
            impact: 'Reduce documentation errors by 50%'
          },
          {
            id: 'R002',
            description: 'Continue current triage training program',
            priority: 'medium',
            assignedTo: 'Nursing Education',
            dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            status: 'pending',
            impact: 'Maintain excellent patient flow'
          },
          {
            id: 'R003',
            description: 'Enhance hand hygiene monitoring',
            priority: 'critical',
            assignedTo: 'Infection Control',
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            status: 'in_progress',
            impact: 'Achieve 95% compliance target'
          }
        ]
      },
      {
        id: 'QA002',
        title: 'Infection Control Audit',
        titleAr: 'مراجعة مكافحة العدوى',
        department: 'Infection Control',
        auditor: 'Infection Control Manager',
        auditTeam: ['Infection Control Manager', 'Epidemiologist', 'Quality Nurse'],
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        plannedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'planned',
        score: 0,
        maxScore: 100,
        auditType: 'regulatory',
        standards: ['CDC Guidelines', 'WHO Standards', 'Local Health Department'],
        findings: [],
        recommendations: []
      },
      {
        id: 'QA003',
        title: 'Medication Safety Review',
        titleAr: 'مراجعة سلامة الأدوية',
        department: 'Pharmacy',
        auditor: 'Chief Pharmacist',
        auditTeam: ['Chief Pharmacist', 'Clinical Pharmacist', 'Quality Coordinator'],
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        completionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        status: 'follow_up_required',
        score: 92,
        maxScore: 100,
        auditType: 'internal',
        standards: ['ISMP Guidelines', 'Hospital Medication Policy'],
        nextAuditDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        findings: [
          {
            id: 'F004',
            category: 'Medication Storage',
            description: 'Temperature monitoring gaps in refrigerated medications',
            descriptionAr: 'فجوات في مراقبة درجة حرارة الأدوية المبردة',
            severity: 'medium',
            evidence: '2 instances of temperature excursions',
            recommendation: 'Install continuous monitoring system',
            assignedTo: 'Pharmacy Manager',
            dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
            status: 'in_progress'
          }
        ],
        recommendations: [
          {
            id: 'R004',
            description: 'Install continuous temperature monitoring',
            priority: 'high',
            assignedTo: 'Pharmacy Manager',
            dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
            status: 'in_progress',
            impact: 'Ensure medication integrity and compliance'
          }
        ]
      }
    ];

    const mockImprovements: QualityImprovement[] = [
      {
        id: 'QIP001',
        title: 'Electronic Medical Records Enhancement',
        titleAr: 'تحسين السجلات الطبية الإلكترونية',
        description: 'Upgrade EMR system to improve efficiency and reduce errors',
        descriptionAr: 'ترقية نظام السجلات الطبية الإلكترونية لتحسين الكفاءة وتقليل الأخطاء',
        priority: 'high',
        status: 'in_progress',
        assignee: 'IT Department Head',
        team: ['IT Manager', 'Clinical Informaticist', 'Training Coordinator', 'Quality Analyst'],
        sponsor: 'Chief Medical Officer',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        expectedCompletion: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        progress: 65,
        impact: 'Reduce documentation errors by 30% and improve workflow efficiency',
        impactAr: 'تقليل أخطاء التوثيق بنسبة 30% وتحسين كفاءة سير العمل',
        category: 'technology',
        budget: 150000,
        roi: 250000,
        kpis: [
          { name: 'Documentation Errors', baseline: 5.2, target: 3.6, current: 4.1, unit: '%' },
          { name: 'Chart Completion Time', baseline: 45, target: 30, current: 35, unit: 'minutes' },
          { name: 'User Satisfaction', baseline: 3.2, target: 4.0, current: 3.6, unit: '/5.0' }
        ],
        milestones: [
          {
            id: 'M001',
            name: 'System Analysis Complete',
            dueDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
            status: 'completed',
            description: 'Complete analysis of current system and requirements'
          },
          {
            id: 'M002',
            name: 'Software Configuration',
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            status: 'pending',
            description: 'Configure new EMR modules and workflows'
          },
          {
            id: 'M003',
            name: 'Staff Training',
            dueDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
            status: 'pending',
            description: 'Train all clinical staff on new system'
          },
          {
            id: 'M004',
            name: 'Go-Live',
            dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            status: 'pending',
            description: 'Launch new EMR system hospital-wide'
          }
        ],
        risks: [
          {
            description: 'Staff resistance to change',
            probability: 'medium',
            impact: 'high',
            mitigation: 'Comprehensive training and change management program'
          },
          {
            description: 'Technical integration issues',
            probability: 'low',
            impact: 'high',
            mitigation: 'Extensive testing and phased rollout'
          }
        ]
      },
      {
        id: 'QIP002',
        title: 'Patient Communication Training',
        titleAr: 'تدريب التواصل مع المرضى',
        description: 'Implement comprehensive communication training for all staff',
        descriptionAr: 'تنفيذ تدريب شامل للتواصل لجميع الموظفين',
        priority: 'medium',
        status: 'approved',
        assignee: 'HR Director',
        team: ['Training Manager', 'Communication Specialist', 'Department Heads'],
        sponsor: 'Chief Nursing Officer',
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        expectedCompletion: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        progress: 0,
        impact: 'Improve patient satisfaction scores and reduce complaints',
        impactAr: 'تحسين نقاط رضا المرضى وتقليل الشكاوى',
        category: 'training',
        budget: 25000,
        kpis: [
          { name: 'Patient Satisfaction', baseline: 4.2, target: 4.5, unit: '/5.0' },
          { name: 'Communication Complaints', baseline: 12, target: 6, unit: 'per month' },
          { name: 'Staff Confidence', baseline: 3.5, target: 4.2, unit: '/5.0' }
        ],
        milestones: [
          {
            id: 'M005',
            name: 'Training Material Development',
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: 'pending',
            description: 'Develop comprehensive training materials'
          },
          {
            id: 'M006',
            name: 'Pilot Training Sessions',
            dueDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
            status: 'pending',
            description: 'Conduct pilot training with select departments'
          },
          {
            id: 'M007',
            name: 'Hospital-wide Rollout',
            dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            status: 'pending',
            description: 'Deploy training to all hospital staff'
          }
        ],
        risks: [
          {
            description: 'Low staff attendance',
            probability: 'medium',
            impact: 'medium',
            mitigation: 'Mandatory training with scheduling flexibility'
          }
        ]
      },
      {
        id: 'QIP003',
        title: 'Hand Hygiene Compliance Initiative',
        titleAr: 'مبادرة الامتثال لنظافة اليدين',
        description: 'Implement comprehensive hand hygiene monitoring and improvement program',
        descriptionAr: 'تنفيذ برنامج شامل لمراقبة وتحسين نظافة اليدين',
        priority: 'critical',
        status: 'in_progress',
        assignee: 'Infection Control Manager',
        team: ['Infection Control Team', 'Quality Nurses', 'Department Champions'],
        sponsor: 'Chief Quality Officer',
        startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        expectedCompletion: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        progress: 40,
        impact: 'Achieve 95% hand hygiene compliance and reduce HAIs',
        impactAr: 'تحقيق 95% امتثال لنظافة اليدين وتقليل العدوى المكتسبة',
        category: 'process_improvement',
        budget: 15000,
        kpis: [
          { name: 'Hand Hygiene Compliance', baseline: 78, target: 95, current: 85, unit: '%' },
          { name: 'HAI Rate', baseline: 2.1, target: 1.5, current: 1.8, unit: '%' },
          { name: 'Staff Awareness', baseline: 3.2, target: 4.5, current: 3.8, unit: '/5.0' }
        ],
        milestones: [
          {
            id: 'M008',
            name: 'Baseline Assessment',
            dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            status: 'completed',
            description: 'Complete baseline hand hygiene compliance assessment'
          },
          {
            id: 'M009',
            name: 'Education Campaign',
            dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            status: 'pending',
            description: 'Launch hospital-wide education campaign'
          },
          {
            id: 'M010',
            name: 'Monitoring System',
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: 'pending',
            description: 'Implement electronic monitoring system'
          }
        ],
        risks: [
          {
            description: 'Staff compliance fatigue',
            probability: 'medium',
            impact: 'medium',
            mitigation: 'Positive reinforcement and recognition program'
          }
        ]
      }
    ];

    const mockQualityEvents: QualityEvent[] = [
      {
        id: 'QE001',
        type: 'incident',
        title: 'Medication Administration Error',
        description: 'Wrong medication administered to patient in ICU',
        reportedBy: 'Nurse Sarah Johnson',
        reportedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        department: 'ICU',
        severity: 'high',
        status: 'investigating',
        assignedTo: 'Quality Manager',
        rootCause: 'Similar medication names and packaging',
        correctiveActions: [
          {
            action: 'Implement barcode scanning for medication administration',
            assignedTo: 'Pharmacy Manager',
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: 'pending'
          },
          {
            action: 'Separate storage of look-alike medications',
            assignedTo: 'ICU Manager',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            status: 'pending'
          }
        ],
        preventiveActions: [
          {
            action: 'Staff education on medication safety',
            assignedTo: 'Education Coordinator',
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            status: 'pending'
          }
        ],
        followUpRequired: true,
        followUpDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'QE002',
        type: 'complaint',
        title: 'Patient Complaint - Long Wait Time',
        description: 'Patient complained about 3-hour wait in emergency department',
        reportedBy: 'Patient Relations',
        reportedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        department: 'Emergency Department',
        severity: 'medium',
        status: 'resolved',
        assignedTo: 'ED Manager',
        rootCause: 'Staffing shortage during peak hours',
        correctiveActions: [
          {
            action: 'Adjust staffing schedule for peak hours',
            assignedTo: 'ED Manager',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            status: 'completed'
          }
        ],
        preventiveActions: [
          {
            action: 'Implement predictive staffing model',
            assignedTo: 'Operations Manager',
            dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            status: 'pending'
          }
        ],
        followUpRequired: false
      },
      {
        id: 'QE003',
        type: 'near_miss',
        title: 'Near Miss - Patient Fall Prevention',
        description: 'Patient almost fell but was caught by staff member',
        reportedBy: 'Nurse Michael Chen',
        reportedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        department: 'Medical Ward',
        severity: 'low',
        status: 'resolved',
        assignedTo: 'Unit Manager',
        rootCause: 'Wet floor not properly marked',
        correctiveActions: [
          {
            action: 'Improve floor marking procedures',
            assignedTo: 'Housekeeping Supervisor',
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            status: 'completed'
          }
        ],
        preventiveActions: [
          {
            action: 'Staff reminder on fall prevention protocols',
            assignedTo: 'Unit Manager',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            status: 'completed'
          }
        ],
        followUpRequired: false
      }
    ];

    setIndicators(mockIndicators);
    setAudits(mockAudits);
    setImprovements(mockImprovements);
    setQualityEvents(mockQualityEvents);
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'patient_safety': return 'text-red-600';
      case 'clinical_effectiveness': return 'text-blue-600';
      case 'patient_experience': return 'text-green-600';
      case 'efficiency': return 'text-purple-600';
      case 'staff_satisfaction': return 'text-orange-600';
      case 'financial_performance': return 'text-indigo-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'default';
      case 'good': return 'secondary';
      case 'acceptable': return 'outline';
      case 'poor': return 'destructive';
      case 'critical': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'stable': return <TrendingUp className="w-4 h-4 text-blue-600" />;
      default: return null;
    }
  };

  // New Audit Creation Form
  const NewAuditForm = () => {
    const [formData, setFormData] = useState({
      title: '',
      titleAr: '',
      department: '',
      auditType: 'internal',
      plannedDate: '',
      auditor: '',
      auditTeam: '',
      standards: '',
      scope: '',
      objectives: ''
    });

    const handleSubmit = () => {
      const newAudit: QualityAudit = {
        id: `QA${String(audits.length + 1).padStart(3, '0')}`,
        title: formData.title,
        titleAr: formData.titleAr,
        department: formData.department,
        auditor: formData.auditor,
        auditTeam: formData.auditTeam.split(',').map(name => name.trim()),
        date: new Date(formData.plannedDate),
        plannedDate: new Date(formData.plannedDate),
        status: 'planned',
        score: 0,
        maxScore: 100,
        auditType: formData.auditType as 'internal' | 'external' | 'regulatory' | 'accreditation',
        standards: formData.standards.split(',').map(std => std.trim()),
        findings: [],
        recommendations: []
      };

      setAudits([...audits, newAudit]);
      setNewAuditDialog(false);
      
      // Reset form
      setFormData({
        title: '', titleAr: '', department: '', auditType: 'internal',
        plannedDate: '', auditor: '', auditTeam: '', standards: '', scope: '', objectives: ''
      });
    };

    return (
      <div className="space-y-4 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{language === 'ar' ? 'عنوان المراجعة' : 'Audit Title'}</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={language === 'ar' ? 'عنوان المراجعة' : 'Audit Title'}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{language === 'ar' ? 'العنوان بالعربية' : 'Title in Arabic'}</label>
            <Input
              value={formData.titleAr}
              onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
              placeholder={language === 'ar' ? 'العنوان بالعربية' : 'Title in Arabic'}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{language === 'ar' ? 'القسم' : 'Department'}</label>
            <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'ar' ? 'اختر القسم' : 'Select Department'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Emergency Department">{language === 'ar' ? 'قسم الطوارئ' : 'Emergency Department'}</SelectItem>
                <SelectItem value="ICU">{language === 'ar' ? 'العناية المركزة' : 'ICU'}</SelectItem>
                <SelectItem value="Surgery">{language === 'ar' ? 'الجراحة' : 'Surgery'}</SelectItem>
                <SelectItem value="Pharmacy">{language === 'ar' ? 'الصيدلية' : 'Pharmacy'}</SelectItem>
                <SelectItem value="Laboratory">{language === 'ar' ? 'المختبر' : 'Laboratory'}</SelectItem>
                <SelectItem value="Radiology">{language === 'ar' ? 'الأشعة' : 'Radiology'}</SelectItem>
                <SelectItem value="Infection Control">{language === 'ar' ? 'مكافحة العدوى' : 'Infection Control'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{language === 'ar' ? 'نوع المراجعة' : 'Audit Type'}</label>
            <Select value={formData.auditType} onValueChange={(value) => setFormData({ ...formData, auditType: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="internal">{language === 'ar' ? 'داخلية' : 'Internal'}</SelectItem>
                <SelectItem value="external">{language === 'ar' ? 'خارجية' : 'External'}</SelectItem>
                <SelectItem value="regulatory">{language === 'ar' ? 'تنظيمية' : 'Regulatory'}</SelectItem>
                <SelectItem value="accreditation">{language === 'ar' ? 'اعتماد' : 'Accreditation'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{language === 'ar' ? 'التاريخ المخطط' : 'Planned Date'}</label>
            <Input
              type="date"
              value={formData.plannedDate}
              onChange={(e) => setFormData({ ...formData, plannedDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{language === 'ar' ? 'المراجع الرئيسي' : 'Lead Auditor'}</label>
            <Input
              value={formData.auditor}
              onChange={(e) => setFormData({ ...formData, auditor: e.target.value })}
              placeholder={language === 'ar' ? 'اسم المراجع الرئيسي' : 'Lead Auditor Name'}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{language === 'ar' ? 'فريق المراجعة' : 'Audit Team'}</label>
          <Input
            value={formData.auditTeam}
            onChange={(e) => setFormData({ ...formData, auditTeam: e.target.value })}
            placeholder={language === 'ar' ? 'أسماء أعضاء الفريق (مفصولة بفواصل)' : 'Team member names (comma separated)'}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{language === 'ar' ? 'المعايير المطبقة' : 'Applicable Standards'}</label>
          <Input
            value={formData.standards}
            onChange={(e) => setFormData({ ...formData, standards: e.target.value })}
            placeholder={language === 'ar' ? 'المعايير (مفصولة بفواصل)' : 'Standards (comma separated)'}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{language === 'ar' ? 'نطاق المراجعة' : 'Audit Scope'}</label>
          <Textarea
            value={formData.scope}
            onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
            placeholder={language === 'ar' ? 'وصف نطاق المراجعة' : 'Describe the audit scope'}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{language === 'ar' ? 'أهداف المراجعة' : 'Audit Objectives'}</label>
          <Textarea
            value={formData.objectives}
            onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
            placeholder={language === 'ar' ? 'أهداف المراجعة' : 'Audit objectives'}
            rows={3}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSubmit} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'جدولة المراجعة' : 'Schedule Audit'}
          </Button>
          <Button variant="outline" onClick={() => setNewAuditDialog(false)}>
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {language === 'ar' ? 'لوحة الجودة الشاملة' : 'Comprehensive Quality Dashboard'}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'تحديث البيانات' : 'Refresh Data'}
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'تقرير شامل' : 'Export Report'}
          </Button>
        </div>
      </div>

      {/* Overall Quality Score with Trend */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="w-6 h-6 mr-2 text-yellow-500" />
              {language === 'ar' ? 'نقاط الجودة الإجمالية' : 'Overall Quality Score'}
            </div>
            <Badge className="bg-green-100 text-green-800">
              <TrendingUp className="w-3 h-3 mr-1" />
              +5% {language === 'ar' ? 'من الشهر الماضي' : 'from last month'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-5xl font-bold text-blue-600">87</div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">{language === 'ar' ? 'الهدف' : 'Target'}</div>
              <div className="text-2xl font-semibold text-gray-600">90</div>
            </div>
          </div>
          <Progress value={87} className="mb-4 h-3" />
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium text-green-600">82</div>
              <div className="text-muted-foreground">{language === 'ar' ? 'الشهر الماضي' : 'Last Month'}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-blue-600">87</div>
              <div className="text-muted-foreground">{language === 'ar' ? 'الحالي' : 'Current'}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-purple-600">90</div>
              <div className="text-muted-foreground">{language === 'ar' ? 'الهدف' : 'Target'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Quality Categories with Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between text-red-600">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'سلامة المرضى' : 'Patient Safety'}
              </div>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 mb-2">92%</div>
            <Progress value={92} className="mb-2 h-2" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-green-600">+2% vs target</span>
              <span className="text-muted-foreground">Target: 90%</span>
            </div>
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>{language === 'ar' ? 'أخطاء الأدوية:' : 'Medication Errors:'}</span>
                <span className="text-green-600">0.8%</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'ar' ? 'العدوى المكتسبة:' : 'HAI Rate:'}</span>
                <span className="text-yellow-600">2.1%</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'ar' ? 'سقوط المرضى:' : 'Patient Falls:'}</span>
                <span className="text-green-600">0.3%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between text-blue-600">
              <div className="flex items-center">
                <Stethoscope className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'الفعالية السريرية' : 'Clinical Effectiveness'}
              </div>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">88%</div>
            <Progress value={88} className="mb-2 h-2" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-green-600">+1% vs target</span>
              <span className="text-muted-foreground">Target: 87%</span>
            </div>
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>{language === 'ar' ? 'معدل الشفاء:' : 'Recovery Rate:'}</span>
                <span className="text-green-600">94%</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'ar' ? 'إعادة الدخول:' : 'Readmission:'}</span>
                <span className="text-green-600">8.2%</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'ar' ? 'الامتثال للبروتوكول:' : 'Protocol Compliance:'}</span>
                <span className="text-green-600">91%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between text-green-600">
              <div className="flex items-center">
                <Heart className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'تجربة المرضى' : 'Patient Experience'}
              </div>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">84%</div>
            <Progress value={84} className="mb-2 h-2" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-yellow-600">-1% vs target</span>
              <span className="text-muted-foreground">Target: 85%</span>
            </div>
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>{language === 'ar' ? 'رضا المرضى:' : 'Satisfaction:'}</span>
                <span className="text-green-600">4.2/5</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'ar' ? 'الشكاوى:' : 'Complaints:'}</span>
                <span className="text-yellow-600">12/month</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'ar' ? 'التوصيات:' : 'Recommendations:'}</span>
                <span className="text-green-600">89%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between text-purple-600">
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'الكفاءة' : 'Efficiency'}
              </div>
              <TrendingDown className="w-4 h-4 text-red-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-2">85%</div>
            <Progress value={85} className="mb-2 h-2" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-red-600">-1% vs target</span>
              <span className="text-muted-foreground">Target: 86%</span>
            </div>
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>{language === 'ar' ? 'مدة الإقامة:' : 'Length of Stay:'}</span>
                <span className="text-yellow-600">3.8 days</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'ar' ? 'وقت الانتظار:' : 'Wait Time:'}</span>
                <span className="text-green-600">15 min</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'ar' ? 'استخدام الأسرة:' : 'Bed Utilization:'}</span>
                <span className="text-green-600">78%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between text-orange-600">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'رضا الموظفين' : 'Staff Satisfaction'}
              </div>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 mb-2">78%</div>
            <Progress value={78} className="mb-2 h-2" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-green-600">+3% vs target</span>
              <span className="text-muted-foreground">Target: 75%</span>
            </div>
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>{language === 'ar' ? 'رضا الموظفين:' : 'Staff Satisfaction:'}</span>
                <span className="text-green-600">3.9/5</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'ar' ? 'معدل الدوران:' : 'Turnover Rate:'}</span>
                <span className="text-green-600">12%</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'ar' ? 'التدريب:' : 'Training Hours:'}</span>
                <span className="text-green-600">40h/year</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-indigo-200 bg-indigo-50 dark:bg-indigo-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between text-indigo-600">
              <div className="flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'الأداء المالي' : 'Financial Performance'}
              </div>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600 mb-2">91%</div>
            <Progress value={91} className="mb-2 h-2" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-green-600">+6% vs target</span>
              <span className="text-muted-foreground">Target: 85%</span>
            </div>
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>{language === 'ar' ? 'الإيرادات/مريض:' : 'Revenue/Patient:'}</span>
                <span className="text-green-600">$2,850</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'ar' ? 'هامش الربح:' : 'Profit Margin:'}</span>
                <span className="text-green-600">18%</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'ar' ? 'كفاءة التكلفة:' : 'Cost Efficiency:'}</span>
                <span className="text-green-600">94%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Quality Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
            {language === 'ar' ? 'تنبيهات الجودة الفورية' : 'Real-time Quality Alerts'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {qualityEvents.filter(e => e.status !== 'closed').slice(0, 3).map((event) => (
              <Alert key={event.id} className={getSeverityColor(event.severity)}>
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <div>
                      <strong>{event.title}</strong>
                      <p className="text-sm mt-1">{event.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {event.department} • {event.reportedDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getSeverityColor(event.severity)}>
                        {event.severity.toUpperCase()}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" />
                        {language === 'ar' ? 'عرض' : 'View'}
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
            
            {qualityEvents.filter(e => e.status !== 'closed').length === 0 && (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  {language === 'ar' 
                    ? 'لا توجد تنبيهات جودة نشطة حاليًا'
                    : 'No active quality alerts at this time'
                  }
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                <span className="text-sm">{language === 'ar' ? 'جدولة مراجعة' : 'Schedule Audit'}</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <ClipboardList className="w-6 h-6 text-green-600" />
                <span className="text-sm">{language === 'ar' ? 'تقرير حادثة' : 'Report Incident'}</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Target className="w-6 h-6 text-purple-600" />
                <span className="text-sm">{language === 'ar' ? 'مشروع تحسين' : 'New Initiative'}</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <BarChart3 className="w-6 h-6 text-orange-600" />
                <span className="text-sm">{language === 'ar' ? 'تقرير شامل' : 'Generate Report'}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{language === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Audit completed: Emergency Department</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New improvement project approved</p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Quality indicator updated: Patient Satisfaction</p>
                  <p className="text-xs text-muted-foreground">6 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Incident reported: Medication error</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderIndicators = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        {language === 'ar' ? 'مؤشرات الجودة' : 'Quality Indicators'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {indicators.map((indicator) => (
          <Card key={indicator.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {language === 'ar' ? indicator.nameAr : indicator.name}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(indicator.trend)}
                  <Badge variant={getStatusColor(indicator.status)}>
                    {indicator.status}
                  </Badge>
                </div>
              </div>
              <CardDescription className={getCategoryColor(indicator.category)}>
                {indicator.category.replace('_', ' ').toUpperCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">
                    {indicator.currentValue}{indicator.unit}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'الهدف' : 'Target'}
                    </div>
                    <div className="text-lg font-semibold">
                      {indicator.target}{indicator.unit}
                    </div>
                  </div>
                </div>

                <Progress 
                  value={(indicator.currentValue / indicator.target) * 100} 
                  className="h-2"
                />

                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? indicator.descriptionAr : indicator.description}
                </p>

                <div className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'آخر تحديث:' : 'Last updated:'} {indicator.lastUpdated.toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAudits = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {language === 'ar' ? 'مراجعات الجودة' : 'Quality Audits'}
        </h2>
        <Button>
          <Calendar className="w-4 h-4 mr-2" />
          {language === 'ar' ? 'جدولة مراجعة' : 'Schedule Audit'}
        </Button>
      </div>

      <div className="space-y-4">
        {audits.map((audit) => (
          <Card key={audit.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{language === 'ar' ? audit.titleAr : audit.title}</CardTitle>
                <Badge variant={audit.status === 'completed' ? 'default' : 'secondary'}>
                  {audit.status === 'completed' 
                    ? (language === 'ar' ? 'مكتمل' : 'Completed')
                    : audit.status === 'planned'
                    ? (language === 'ar' ? 'مجدول' : 'Planned')
                    : (language === 'ar' ? 'قيد التنفيذ' : 'In Progress')
                  }
                </Badge>
              </div>
              <CardDescription>
                {audit.department} • {audit.auditor} • {audit.date.toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {audit.status === 'completed' && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl font-bold">{audit.score}/100</div>
                    <Progress value={audit.score} className="flex-1" />
                  </div>

                  {audit.findings.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">
                        {language === 'ar' ? 'النتائج' : 'Findings'}
                      </h4>
                      <div className="space-y-2">
                        {audit.findings.map((finding, index) => (
                          <div key={index} className="p-2 border rounded-md">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{finding.category}</span>
                              <Badge variant={finding.severity === 'high' ? 'destructive' : 'secondary'}>
                                {finding.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {finding.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {audit.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">
                        {language === 'ar' ? 'التوصيات' : 'Recommendations'}
                      </h4>
                      <ul className="text-sm space-y-1">
                        {audit.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderImprovements = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {language === 'ar' ? 'تحسينات الجودة' : 'Quality Improvements'}
        </h2>
        <Button>
          <Target className="w-4 h-4 mr-2" />
          {language === 'ar' ? 'مبادرة جديدة' : 'New Initiative'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {improvements.map((improvement) => (
          <Card key={improvement.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {language === 'ar' ? improvement.titleAr : improvement.title}
                </CardTitle>
                <Badge variant={improvement.priority === 'high' ? 'destructive' : 'secondary'}>
                  {improvement.priority}
                </Badge>
              </div>
              <CardDescription>{improvement.assignee}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">{improvement.description}</p>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      {language === 'ar' ? 'التقدم' : 'Progress'}
                    </span>
                    <span className="text-sm">{improvement.progress}%</span>
                  </div>
                  <Progress value={improvement.progress} />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">
                      {language === 'ar' ? 'بداية:' : 'Start:'}
                    </span>
                    <br />
                    {improvement.startDate.toLocaleDateString()}
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      {language === 'ar' ? 'الإكمال المتوقع:' : 'Expected:'}
                    </span>
                    <br />
                    {improvement.expectedCompletion.toLocaleDateString()}
                  </div>
                </div>

                <div className="p-2 bg-accent/50 rounded-md">
                  <span className="text-sm font-medium">
                    {language === 'ar' ? 'الأثر المتوقع:' : 'Expected Impact:'}
                  </span>
                  <p className="text-sm mt-1">{improvement.impact}</p>
                </div>

                <Badge variant="outline" className="w-fit">
                  {improvement.status === 'in_progress' 
                    ? (language === 'ar' ? 'قيد التنفيذ' : 'In Progress')
                    : improvement.status === 'approved'
                    ? (language === 'ar' ? 'موافق عليه' : 'Approved')
                    : (language === 'ar' ? 'مقترح' : 'Proposed')
                  }
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  if (!navigation.currentView || navigation.currentView === 'quality_dashboard') {
    return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>{language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</span>
          </TabsTrigger>
          <TabsTrigger value="indicators" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>{language === 'ar' ? 'المؤشرات' : 'Indicators'}</span>
          </TabsTrigger>
          <TabsTrigger value="audits" className="flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <span>{language === 'ar' ? 'المراجعات' : 'Audits'}</span>
          </TabsTrigger>
          <TabsTrigger value="improvements" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>{language === 'ar' ? 'التحسينات' : 'Improvements'}</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>{language === 'ar' ? 'الأحداث' : 'Events'}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          {renderDashboard()}
        </TabsContent>

        <TabsContent value="indicators" className="mt-6">
          {renderIndicators()}
        </TabsContent>

        <TabsContent value="audits" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {language === 'ar' ? 'مراجعات الجودة' : 'Quality Audits'}
              </h2>
              <div className="flex gap-2">
                <Dialog open={newAuditDialog} onOpenChange={setNewAuditDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      {language === 'ar' ? 'مراجعة جديدة' : 'New Audit'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>{language === 'ar' ? 'جدولة مراجعة جودة جديدة' : 'Schedule New Quality Audit'}</DialogTitle>
                      <DialogDescription>
                        {language === 'ar' 
                          ? 'املأ النموذج أدناه لجدولة مراجعة جودة جديدة'
                          : 'Fill out the form below to schedule a new quality audit'
                        }
                      </DialogDescription>
                    </DialogHeader>
                    <NewAuditForm />
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'تصفية' : 'Filter'}
                </Button>
                
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'تصدير' : 'Export'}
                </Button>
              </div>
            </div>
            {renderAudits()}
          </div>
        </TabsContent>

        <TabsContent value="improvements" className="mt-6">
          {renderImprovements()}
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {language === 'ar' ? 'أحداث الجودة' : 'Quality Events'}
              </h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'تقرير حدث' : 'Report Event'}
              </Button>
            </div>

            {/* Event Type Filter */}
            <div className="flex gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={language === 'ar' ? 'نوع الحدث' : 'Event Type'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'ar' ? 'جميع الأحداث' : 'All Events'}</SelectItem>
                  <SelectItem value="incident">{language === 'ar' ? 'حوادث' : 'Incidents'}</SelectItem>
                  <SelectItem value="near_miss">{language === 'ar' ? 'كاد أن يحدث' : 'Near Miss'}</SelectItem>
                  <SelectItem value="complaint">{language === 'ar' ? 'شكاوى' : 'Complaints'}</SelectItem>
                  <SelectItem value="compliment">{language === 'ar' ? 'إطراء' : 'Compliments'}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={language === 'ar' ? 'الحالة' : 'Status'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</SelectItem>
                  <SelectItem value="reported">{language === 'ar' ? 'مُبلغ عنه' : 'Reported'}</SelectItem>
                  <SelectItem value="investigating">{language === 'ar' ? 'قيد التحقيق' : 'Investigating'}</SelectItem>
                  <SelectItem value="resolved">{language === 'ar' ? 'محلول' : 'Resolved'}</SelectItem>
                  <SelectItem value="closed">{language === 'ar' ? 'مغلق' : 'Closed'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quality Events List */}
            <div className="space-y-4">
              {qualityEvents
                .filter(event => filterCategory === 'all' || event.type === filterCategory)
                .filter(event => filterStatus === 'all' || event.status === filterStatus)
                .map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getSeverityColor(event.severity)}>
                            {event.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {event.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge variant={event.status === 'resolved' ? 'default' : 'secondary'}>
                            {event.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        
                        <h3 className="font-semibold mb-1">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                        
                        <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                          <div>
                            <span className="font-medium">Department:</span> {event.department}
                          </div>
                          <div>
                            <span className="font-medium">Reported by:</span> {event.reportedBy}
                          </div>
                          <div>
                            <span className="font-medium">Date:</span> {event.reportedDate.toLocaleDateString()}
                          </div>
                        </div>

                        {event.rootCause && (
                          <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                            <div className="text-xs font-medium text-yellow-800 dark:text-yellow-200">
                              Root Cause: {event.rootCause}
                            </div>
                          </div>
                        )}

                        {event.correctiveActions.length > 0 && (
                          <div className="mt-3">
                            <div className="text-xs font-medium mb-1">Corrective Actions:</div>
                            <div className="space-y-1">
                              {event.correctiveActions.map((action, index) => (
                                <div key={index} className="flex items-center justify-between text-xs p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                                  <span>{action.action}</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-muted-foreground">{action.assignedTo}</span>
                                    <Badge variant={action.status === 'completed' ? 'default' : 'secondary'}>
                                      {action.status}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          {language === 'ar' ? 'عرض' : 'View'}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3 mr-1" />
                          {language === 'ar' ? 'تحديث' : 'Update'}
                        </Button>
                        {event.followUpRequired && (
                          <Button size="sm" variant="outline">
                            <Calendar className="w-3 h-3 mr-1" />
                            {language === 'ar' ? 'متابعة' : 'Follow-up'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    );
  }

  // Handle specific views
  switch (navigation.currentView) {
    case 'indicators':
      return renderIndicators();
    case 'audits':
      return renderAudits();
    case 'improvements':
      return renderImprovements();
    default:
      return renderDashboard();
  }
};

export default QualityManagement;