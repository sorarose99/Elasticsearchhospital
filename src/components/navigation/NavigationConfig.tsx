import { 
  Home, 
  Users, 
  Calendar, 
  FileText, 
  TestTube, 
  Pill, 
  Camera, 
  CreditCard, 
  Settings, 
  BarChart3,
  UserPlus,
  ClipboardList,
  Stethoscope,
  Activity,
  Archive,
  Receipt,
  Shield,
  Bell,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  PrinterIcon as Print,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Package,
  Briefcase,
  MessageSquare,
  Heart,
  Building,
  Phone,
  Bed,
  Video,
  Star,
  AlertCircle,
  TestTube2,
  Palette,
  Brain,
  Smartphone,
  Monitor,
  Zap
} from 'lucide-react';

export interface NavigationModule {
  id: string;
  label: string;
  labelAr: string;
  icon: any;
  roles: string[];
  views: NavigationView[];
  quickActions?: QuickActionConfig[];
}

export interface NavigationView {
  id: string;
  label: string;
  labelAr: string;
  icon?: any;
  roles?: string[];
  component?: string;
  requiresData?: boolean;
}

export interface QuickActionConfig {
  id: string;
  label: string;
  labelAr: string;
  icon: any;
  roles: string[];
  action: string;
  shortcut?: string;
}

export const navigationModules: NavigationModule[] = [
  // Dashboard Module
  {
    id: 'dashboard',
    label: 'Dashboard',
    labelAr: 'لوحة التحكم',
    icon: Home,
    roles: ['admin', 'doctor', 'receptionist', 'lab_tech', 'pharmacist', 'radiologist', 'billing'],
    views: [
      {
        id: 'overview',
        label: 'Overview',
        labelAr: 'نظرة عامة',
        icon: BarChart3
      }
    ]
  },

  // Patient Management Module
  {
    id: 'patients',
    label: 'Patients',
    labelAr: 'المرضى',
    icon: Users,
    roles: ['admin', 'doctor', 'receptionist'],
    views: [
      {
        id: 'list',
        label: 'Patient List',
        labelAr: 'قائمة المرضى',
        icon: Users
      },
      {
        id: 'registration',
        label: 'New Registration',
        labelAr: 'تسجيل جديد',
        icon: UserPlus
      },
      {
        id: 'emr',
        label: 'Medical Records',
        labelAr: 'السجلات الطبية',
        icon: FileText
      }
    ],
    quickActions: [
      {
        id: 'add-patient',
        label: 'Add Patient',
        labelAr: 'إضافة مريض',
        icon: UserPlus,
        roles: ['admin', 'receptionist'],
        action: 'navigate:patients/registration',
        shortcut: 'Ctrl+N'
      },
      {
        id: 'search-patient',
        label: 'Search Patient',
        labelAr: 'البحث عن مريض',
        icon: Search,
        roles: ['admin', 'doctor', 'receptionist'],
        action: 'modal:patient-search',
        shortcut: 'Ctrl+F'
      }
    ]
  },

  // Appointments Module
  {
    id: 'appointments',
    label: 'Appointments',
    labelAr: 'المواعيد',
    icon: Calendar,
    roles: ['admin', 'doctor', 'receptionist'],
    views: [
      {
        id: 'schedule',
        label: 'Schedule',
        labelAr: 'الجدولة',
        icon: Calendar
      },
      {
        id: 'today',
        label: 'Today\'s Appointments',
        labelAr: 'مواعيد اليوم',
        icon: Clock
      },
      {
        id: 'waiting',
        label: 'Waiting List',
        labelAr: 'قائمة الانتظار',
        icon: ClipboardList
      }
    ],
    quickActions: [
      {
        id: 'new-appointment',
        label: 'New Appointment',
        labelAr: 'موعد جديد',
        icon: Plus,
        roles: ['admin', 'receptionist'],
        action: 'modal:new-appointment',
        shortcut: 'Ctrl+A'
      }
    ]
  },

  // Laboratory Module
  {
    id: 'laboratory',
    label: 'Laboratory',
    labelAr: 'المختبر',
    icon: TestTube,
    roles: ['admin', 'doctor', 'lab_tech'],
    views: [
      {
        id: 'orders',
        label: 'Lab Orders',
        labelAr: 'طلبات المختبر',
        icon: ClipboardList
      },
      {
        id: 'results',
        label: 'Results',
        labelAr: 'النتائج',
        icon: Activity
      },
      {
        id: 'hl7',
        label: 'HL7 Integration',
        labelAr: 'تكامل HL7',
        icon: RefreshCw,
        roles: ['admin', 'lab_tech']
      }
    ],
    quickActions: [
      {
        id: 'new-lab-order',
        label: 'New Lab Order',
        labelAr: 'طلب مختبر جديد',
        icon: TestTube,
        roles: ['doctor'],
        action: 'modal:new-lab-order'
      },
      {
        id: 'enter-results',
        label: 'Enter Results',
        labelAr: 'إدخال النتائج',
        icon: Edit,
        roles: ['lab_tech'],
        action: 'navigate:laboratory/results'
      }
    ]
  },

  // Pharmacy Module
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    labelAr: 'الصيدلية',
    icon: Pill,
    roles: ['admin', 'doctor', 'pharmacist'],
    views: [
      {
        id: 'prescriptions',
        label: 'Prescriptions',
        labelAr: 'الوصفات',
        icon: FileText
      },
      {
        id: 'inventory',
        label: 'Inventory',
        labelAr: 'المخزون',
        icon: Archive
      },
      {
        id: 'dispensing',
        label: 'Dispensing',
        labelAr: 'الصرف',
        icon: Pill,
        roles: ['pharmacist']
      }
    ],
    quickActions: [
      {
        id: 'new-prescription',
        label: 'New Prescription',
        labelAr: 'وصفة جديدة',
        icon: Plus,
        roles: ['doctor'],
        action: 'modal:new-prescription'
      },
      {
        id: 'check-stock',
        label: 'Check Stock',
        labelAr: 'فحص المخزون',
        icon: Search,
        roles: ['pharmacist'],
        action: 'modal:stock-check'
      }
    ]
  },

  // Radiology Module
  {
    id: 'radiology',
    label: 'Radiology',
    labelAr: 'الأشعة',
    icon: Camera,
    roles: ['admin', 'doctor', 'radiologist'],
    views: [
      {
        id: 'management',
        label: 'Radiology Management',
        labelAr: 'إدارة الأشعة',
        icon: Camera
      },
      {
        id: 'studies',
        label: 'Studies',
        labelAr: 'الدراسات',
        icon: ClipboardList
      },
      {
        id: 'dicom',
        label: 'DICOM Viewer',
        labelAr: 'عارض DICOM',
        icon: Eye,
        roles: ['radiologist']
      },
      {
        id: 'worklist',
        label: 'Worklist',
        labelAr: 'قائمة العمل',
        icon: CheckCircle,
        roles: ['radiologist']
      },
      {
        id: 'reports',
        label: 'Reports',
        labelAr: 'التقارير',
        icon: FileText
      }
    ],
    quickActions: [
      {
        id: 'new-study',
        label: 'New Study',
        labelAr: 'دراسة جديدة',
        icon: Plus,
        roles: ['doctor', 'radiologist'],
        action: 'modal:new-study'
      },
      {
        id: 'upload-images',
        label: 'Upload Images',
        labelAr: 'رفع الصور',
        icon: Upload,
        roles: ['radiologist'],
        action: 'modal:upload-images'
      }
    ]
  },

  // Billing Module
  {
    id: 'billing',
    label: 'Billing & Financial Management',
    labelAr: 'الفوترة والإدارة المالية',
    icon: CreditCard,
    roles: ['admin', 'billing', 'receptionist'],
    views: [
      {
        id: 'management',
        label: 'Billing Management',
        labelAr: 'إدارة الفوترة',
        icon: CreditCard
      },
      {
        id: 'invoices',
        label: 'Invoices',
        labelAr: 'الفواتير',
        icon: Receipt
      },
      {
        id: 'payments',
        label: 'Payments',
        labelAr: 'المدفوعات',
        icon: CreditCard
      },
      {
        id: 'insurance',
        label: 'Insurance Claims',
        labelAr: 'مطالبات التأمين',
        icon: Shield
      },
      {
        id: 'financial-reports',
        label: 'Financial Reports',
        labelAr: 'التقارير المالية',
        icon: BarChart3
      }
    ],
    quickActions: [
      {
        id: 'new-invoice',
        label: 'New Invoice',
        labelAr: 'فاتورة جديدة',
        icon: Plus,
        roles: ['admin', 'billing'],
        action: 'modal:new-invoice'
      },
      {
        id: 'record-payment',
        label: 'Record Payment',
        labelAr: 'تسجيل دفعة',
        icon: CreditCard,
        roles: ['admin', 'billing', 'receptionist'],
        action: 'modal:record-payment'
      }
    ]
  },

  // Analytics Dashboard Module
  {
    id: 'analytics',
    label: 'Analytics Dashboard',
    labelAr: 'لوحة التحليلات',
    icon: BarChart3,
    roles: ['admin', 'doctor', 'billing'],
    views: [
      {
        id: 'overview',
        label: 'Overview',
        labelAr: 'نظرة عامة',
        icon: Eye
      },
      {
        id: 'financial',
        label: 'Financial Analytics',
        labelAr: 'التحليلات المالية',
        icon: CreditCard
      },
      {
        id: 'clinical',
        label: 'Clinical Analytics',
        labelAr: 'التحليلات السريرية',
        icon: Stethoscope
      }
    ],
    quickActions: [
      {
        id: 'export-analytics',
        label: 'Export Analytics',
        labelAr: 'تصدير التحليلات',
        icon: Download,
        roles: ['admin', 'billing'],
        action: 'execute:export-analytics'
      },
      {
        id: 'refresh-data',
        label: 'Refresh Data',
        labelAr: 'تحديث البيانات',
        icon: RefreshCw,
        roles: ['admin', 'doctor', 'billing'],
        action: 'execute:refresh-data'
      }
    ]
  },

  // Reports & Analytics Module
  {
    id: 'reports',
    label: 'Advanced Reports & Analytics',
    labelAr: 'التقارير والتحليلات المتقدمة',
    icon: FileText,
    roles: ['admin', 'doctor', 'billing'],
    views: [
      {
        id: 'dashboard',
        label: 'Reports Dashboard',
        labelAr: 'لوحة التقارير',
        icon: BarChart3
      },
      {
        id: 'overview',
        label: 'Overview Reports',
        labelAr: 'تقارير النظرة العامة',
        icon: Eye
      },
      {
        id: 'financial',
        label: 'Financial Reports',
        labelAr: 'التقارير المالية',
        icon: CreditCard,
        roles: ['admin', 'billing']
      },
      {
        id: 'clinical',
        label: 'Clinical Reports',
        labelAr: 'التقارير السريرية',
        icon: Stethoscope,
        roles: ['admin', 'doctor']
      },
      {
        id: 'operational',
        label: 'Operational Reports',
        labelAr: 'التقارير التشغيلية',
        icon: Settings,
        roles: ['admin']
      }
    ],
    quickActions: [
      {
        id: 'generate-report',
        label: 'Generate Report',
        labelAr: 'إنشاء تقرير',
        icon: FileText,
        roles: ['admin', 'doctor', 'billing'],
        action: 'modal:generate-report'
      },
      {
        id: 'export-report',
        label: 'Export Report',
        labelAr: 'تصدير التقرير',
        icon: Download,
        roles: ['admin', 'doctor', 'billing'],
        action: 'execute:export-report'
      },
      {
        id: 'schedule-report',
        label: 'Schedule Report',
        labelAr: 'جدولة التقرير',
        icon: Calendar,
        roles: ['admin'],
        action: 'modal:schedule-report'
      }
    ]
  },

  // Administration Module
  {
    id: 'administration',
    label: 'Administration',
    labelAr: 'الإدارة',
    icon: Settings,
    roles: ['admin'],
    views: [
      {
        id: 'users',
        label: 'User Management',
        labelAr: 'إدارة المستخدمين',
        icon: Users
      },
      {
        id: 'system',
        label: 'System Settings',
        labelAr: 'إعدادات النظام',
        icon: Settings
      },
      {
        id: 'security',
        label: 'Security & Audit',
        labelAr: 'الأمان والمراجعة',
        icon: Shield
      },
      {
        id: 'backups',
        label: 'Backups',
        labelAr: 'النسخ الاحتياطية',
        icon: Archive
      }
    ],
    quickActions: [
      {
        id: 'add-user',
        label: 'Add User',
        labelAr: 'إضافة مستخدم',
        icon: UserPlus,
        roles: ['admin'],
        action: 'modal:add-user'
      },
      {
        id: 'system-backup',
        label: 'System Backup',
        labelAr: 'نسخة احتياطية',
        icon: Download,
        roles: ['admin'],
        action: 'execute:system-backup'
      }
    ]
  },

  // Nursing Management Module
  {
    id: 'nursing',
    label: 'Nursing Management',
    labelAr: 'إدارة التمريض',
    icon: Heart,
    roles: ['admin', 'nurse', 'doctor'],
    views: [
      {
        id: 'dashboard',
        label: 'Nursing Dashboard',
        labelAr: 'لوحة التمريض',
        icon: Heart
      },
      {
        id: 'vitals',
        label: 'Vital Signs',
        labelAr: 'العلامات الحيوية',
        icon: Activity
      },
      {
        id: 'tasks',
        label: 'Nursing Tasks',
        labelAr: 'مهام التمريض',
        icon: ClipboardList
      },
      {
        id: 'care',
        label: 'Patient Care',
        labelAr: 'رعاية المرضى',
        icon: Stethoscope
      }
    ],
    quickActions: [
      {
        id: 'record-vitals',
        label: 'Record Vital Signs',
        labelAr: 'تسجيل العلامات الحيوية',
        icon: Activity,
        roles: ['nurse'],
        action: 'modal:record-vitals'
      }
    ]
  },

  // Inventory Management Module
  {
    id: 'inventory',
    label: 'Inventory Management',
    labelAr: 'إدارة المخزون',
    icon: Package,
    roles: ['admin', 'pharmacist', 'inventory_manager'],
    views: [
      {
        id: 'dashboard',
        label: 'Inventory Dashboard',
        labelAr: 'لوحة المخزون',
        icon: Package
      },
      {
        id: 'items',
        label: 'Inventory Items',
        labelAr: 'أصناف المخزون',
        icon: Archive
      },
      {
        id: 'suppliers',
        label: 'Suppliers',
        labelAr: 'الموردين',
        icon: Building
      },
      {
        id: 'orders',
        label: 'Purchase Orders',
        labelAr: 'طلبات الشراء',
        icon: ClipboardList
      }
    ],
    quickActions: [
      {
        id: 'add-item',
        label: 'Add Item',
        labelAr: 'إضافة صنف',
        icon: Plus,
        roles: ['admin', 'inventory_manager'],
        action: 'modal:add-item'
      }
    ]
  },

  // Staff Management Module
  {
    id: 'staff',
    label: 'Staff Management',
    labelAr: 'إدارة الموظفين',
    icon: Briefcase,
    roles: ['admin', 'hr_manager'],
    views: [
      {
        id: 'dashboard',
        label: 'Staff Dashboard',
        labelAr: 'لوحة الموظفين',
        icon: Briefcase
      },
      {
        id: 'employees',
        label: 'Employees',
        labelAr: 'الموظفين',
        icon: Users
      },
      {
        id: 'attendance',
        label: 'Attendance',
        labelAr: 'الحضور والانصراف',
        icon: Clock
      },
      {
        id: 'leaves',
        label: 'Leaves',
        labelAr: 'الإجازات',
        icon: Calendar
      }
    ],
    quickActions: [
      {
        id: 'add-employee',
        label: 'Add Employee',
        labelAr: 'إضافة موظف',
        icon: UserPlus,
        roles: ['admin', 'hr_manager'],
        action: 'modal:add-employee'
      }
    ]
  },

  // Insurance Management Module
  {
    id: 'insurance',
    label: 'Insurance Management',
    labelAr: 'إدارة التأمين',
    icon: Shield,
    roles: ['admin', 'billing', 'insurance_coordinator'],
    views: [
      {
        id: 'dashboard',
        label: 'Insurance Dashboard',
        labelAr: 'لوحة التأمين',
        icon: Shield
      },
      {
        id: 'providers',
        label: 'Insurance Providers',
        labelAr: 'شركات التأمين',
        icon: Building
      },
      {
        id: 'claims',
        label: 'Claims',
        labelAr: 'المطالبات',
        icon: FileText
      },
      {
        id: 'patients',
        label: 'Patient Insurance',
        labelAr: 'تأمين المرضى',
        icon: Users
      }
    ],
    quickActions: [
      {
        id: 'submit-claim',
        label: 'Submit Claim',
        labelAr: 'تقديم مطالبة',
        icon: FileText,
        roles: ['admin', 'billing'],
        action: 'modal:submit-claim'
      }
    ]
  },

  // Communication Center Module
  {
    id: 'communication',
    label: 'Communication Center',
    labelAr: 'مركز الاتصالات',
    icon: MessageSquare,
    roles: ['admin', 'doctor', 'nurse', 'receptionist', 'lab_tech', 'pharmacist', 'radiologist'],
    views: [
      {
        id: 'messages',
        label: 'Messages',
        labelAr: 'الرسائل',
        icon: MessageSquare
      },
      {
        id: 'calls',
        label: 'Calls',
        labelAr: 'المكالمات',
        icon: Phone
      },
      {
        id: 'notifications',
        label: 'Notifications',
        labelAr: 'الإشعارات',
        icon: Bell
      }
    ],
    quickActions: [
      {
        id: 'send-message',
        label: 'Send Message',
        labelAr: 'إرسال رسالة',
        icon: MessageSquare,
        roles: ['admin', 'doctor', 'nurse', 'receptionist'],
        action: 'modal:send-message'
      }
    ]
  },

  // Emergency Management Module
  {
    id: 'emergency',
    label: 'Emergency Management',
    labelAr: 'إدارة الطوارئ',
    icon: AlertTriangle,
    roles: ['admin', 'doctor', 'nurse', 'emergency_tech'],
    views: [
      {
        id: 'triage',
        label: 'Triage Board',
        labelAr: 'لوحة الفرز',
        icon: AlertTriangle
      },
      {
        id: 'emergency_room',
        label: 'Emergency Rooms',
        labelAr: 'غرف الطوارئ',
        icon: Bed
      },
      {
        id: 'protocols',
        label: 'Emergency Protocols',
        labelAr: 'بروتوكولات الطوارئ',
        icon: FileText
      },
      {
        id: 'statistics',
        label: 'Emergency Statistics',
        labelAr: 'إحصائيات الطوارئ',
        icon: BarChart3
      }
    ],
    quickActions: [
      {
        id: 'new-emergency',
        label: 'New Emergency',
        labelAr: 'طارئ جديد',
        icon: AlertTriangle,
        roles: ['admin', 'doctor', 'nurse'],
        action: 'modal:new-emergency'
      },
      {
        id: 'activate-code',
        label: 'Activate Code',
        labelAr: 'تفعيل الرمز',
        icon: AlertCircle,
        roles: ['admin', 'doctor'],
        action: 'execute:activate-code'
      }
    ]
  },

  // Telemedicine Module
  {
    id: 'telemedicine',
    label: 'Telemedicine',
    labelAr: 'الطب عن بُعد',
    icon: Video,
    roles: ['admin', 'doctor', 'nurse', 'telehealth_coordinator'],
    views: [
      {
        id: 'consultations',
        label: 'Video Consultations',
        labelAr: 'الاستشارات المرئية',
        icon: Video
      },
      {
        id: 'waiting_room',
        label: 'Virtual Waiting Room',
        labelAr: 'غرفة الانتظار الافتراضية',
        icon: Users
      },
      {
        id: 'recordings',
        label: 'Session Recordings',
        labelAr: 'تسجيلات الجلسات',
        icon: Archive
      },
      {
        id: 'technical_support',
        label: 'Technical Support',
        labelAr: 'الدعم الفني',
        icon: Settings
      }
    ],
    quickActions: [
      {
        id: 'start-consultation',
        label: 'Start Consultation',
        labelAr: 'بدء الاستشارة',
        icon: Video,
        roles: ['doctor'],
        action: 'navigate:telemedicine/consultations'
      },
      {
        id: 'schedule-telehealth',
        label: 'Schedule Telehealth',
        labelAr: 'جدولة الطب عن بُعد',
        icon: Calendar,
        roles: ['admin', 'doctor'],
        action: 'modal:schedule-telehealth'
      }
    ]
  },

  // Patient Portal Module
  {
    id: 'patient_portal',
    label: 'Patient Portal',
    labelAr: 'بوابة المرضى',
    icon: Users,
    roles: ['admin', 'patient_coordinator', 'receptionist'],
    views: [
      {
        id: 'portal_dashboard',
        label: 'Portal Dashboard',
        labelAr: 'لوحة البوابة',
        icon: Home
      },
      {
        id: 'patient_access',
        label: 'Patient Access',
        labelAr: 'وصول المرضى',
        icon: Shield
      },
      {
        id: 'portal_settings',
        label: 'Portal Settings',
        labelAr: 'إعدادات البوابة',
        icon: Settings
      },
      {
        id: 'mobile_app',
        label: 'Mobile App',
        labelAr: 'التطبيق المحمول',
        icon: Phone
      }
    ],
    quickActions: [
      {
        id: 'patient-registration',
        label: 'Patient Registration',
        labelAr: 'تسجيل المريض',
        icon: UserPlus,
        roles: ['admin', 'receptionist'],
        action: 'modal:patient-registration'
      }
    ]
  },

  // Discharge Planning Module
  {
    id: 'discharge',
    label: 'Discharge Planning',
    labelAr: 'تخطيط الخروج',
    icon: CheckCircle,
    roles: ['admin', 'doctor', 'nurse', 'discharge_planner'],
    views: [
      {
        id: 'discharge_dashboard',
        label: 'Discharge Dashboard',
        labelAr: 'لوحة الخروج',
        icon: CheckCircle
      },
      {
        id: 'discharge_summary',
        label: 'Discharge Summary',
        labelAr: 'ملخص الخروج',
        icon: FileText
      },
      {
        id: 'follow_up_care',
        label: 'Follow-up Care',
        labelAr: 'الرعاية المتابعة',
        icon: Calendar
      },
      {
        id: 'patient_education',
        label: 'Patient Education',
        labelAr: 'تثقيف المريض',
        icon: Archive
      }
    ],
    quickActions: [
      {
        id: 'prepare-discharge',
        label: 'Prepare Discharge',
        labelAr: 'تحضير الخروج',
        icon: CheckCircle,
        roles: ['doctor', 'nurse'],
        action: 'modal:prepare-discharge'
      }
    ]
  },

  // Onboarding Module (Admin only)
  {
    id: 'onboarding',
    label: 'Hospital Setup',
    labelAr: 'إعداد المستشفى',
    icon: Building,
    roles: ['admin', 'super_admin'],
    views: [
      {
        id: 'setup_wizard',
        label: 'Setup Wizard',
        labelAr: 'معالج الإعداد',
        icon: Settings
      },
      {
        id: 'configuration',
        label: 'System Configuration',
        labelAr: 'تكوين النظام',
        icon: Settings
      },
      {
        id: 'data_migration',
        label: 'Data Migration',
        labelAr: 'ترحيل البيانات',
        icon: Upload
      },
      {
        id: 'training',
        label: 'Staff Training',
        labelAr: 'تدريب الموظفين',
        icon: Users
      }
    ],
    quickActions: [
      {
        id: 'run-setup',
        label: 'Run Setup Wizard',
        labelAr: 'تشغيل معالج الإعداد',
        icon: Settings,
        roles: ['admin', 'super_admin'],
        action: 'navigate:onboarding/setup_wizard'
      }
    ]
  },

  // Quality Management Module
  {
    id: 'quality',
    label: 'Quality Management',
    labelAr: 'إدارة الجودة',
    icon: Star,
    roles: ['admin', 'quality_manager', 'doctor'],
    views: [
      {
        id: 'quality_dashboard',
        label: 'Quality Dashboard',
        labelAr: 'لوحة الجودة',
        icon: BarChart3
      },
      {
        id: 'indicators',
        label: 'Quality Indicators',
        labelAr: 'مؤشرات الجودة',
        icon: Activity
      },
      {
        id: 'audits',
        label: 'Quality Audits',
        labelAr: 'مراجعات الجودة',
        icon: Search
      },
      {
        id: 'improvements',
        label: 'Quality Improvements',
        labelAr: 'تحسينات الجودة',
        icon: CheckCircle
      }
    ],
    quickActions: [
      {
        id: 'quality-audit',
        label: 'Start Quality Audit',
        labelAr: 'بدء مراجعة الجودة',
        icon: Search,
        roles: ['admin', 'quality_manager'],
        action: 'modal:quality-audit'
      }
    ]
  },

  // Research Module
  {
    id: 'research',
    label: 'Clinical Research',
    labelAr: 'البحث السريري',
    icon: Archive,
    roles: ['admin', 'researcher', 'doctor'],
    views: [
      {
        id: 'research_dashboard',
        label: 'Research Dashboard',
        labelAr: 'لوحة البحث',
        icon: BarChart3
      },
      {
        id: 'studies',
        label: 'Clinical Studies',
        labelAr: 'الدراسات السريرية',
        icon: FileText
      },
      {
        id: 'participants',
        label: 'Study Participants',
        labelAr: 'المشاركون في الدراسة',
        icon: Users
      },
      {
        id: 'data_collection',
        label: 'Data Collection',
        labelAr: 'جمع البيانات',
        icon: Archive
      }
    ],
    quickActions: [
      {
        id: 'new-study',
        label: 'New Study',
        labelAr: 'دراسة جديدة',
        icon: Plus,
        roles: ['admin', 'researcher'],
        action: 'modal:new-study'
      }
    ]
  },

  // Settings Module
  {
    id: 'settings',
    label: 'Settings & Customization',
    labelAr: 'الإعدادات والتخصيص',
    icon: Settings,
    roles: ['admin', 'doctor', 'receptionist', 'lab_tech', 'pharmacist', 'radiologist', 'billing'],
    views: [
      {
        id: 'overview',
        label: 'Settings Overview',
        labelAr: 'نظرة عامة على الإعدادات',
        icon: Settings
      }
    ]
  },

  // Medical Specializations Module
  {
    id: 'specializations',
    label: 'Medical Specializations',
    labelAr: 'التخصصات الطبية',
    icon: Stethoscope,
    roles: ['admin', 'doctor', 'receptionist'],
    views: [
      {
        id: 'overview',
        label: 'Specializations Overview',
        labelAr: 'نظرة عامة على التخصصات',
        icon: BarChart3
      },
      {
        id: 'management',
        label: 'Manage Specializations',
        labelAr: 'إدارة التخصصات',
        icon: Settings
      }
    ],
    quickActions: [
      {
        id: 'add-specialization',
        label: 'Add Specialization',
        labelAr: 'إضافة تخصص',
        icon: Plus,
        roles: ['admin'],
        action: 'modal:add-specialization'
      }
    ]
  },

  // Mobile Applications Module
  {
    id: 'mobile_apps',
    label: 'Mobile Applications',
    labelAr: 'تطبيقات الهاتف المحمول',
    icon: Smartphone,
    roles: ['admin', 'doctor', 'receptionist'],
    views: [
      {
        id: 'overview',
        label: 'Apps Overview',
        labelAr: 'نظرة عامة على التطبيقات',
        icon: Smartphone
      },
      {
        id: 'patient_app',
        label: 'Patient App',
        labelAr: 'تطبيق المرضى',
        icon: Users
      },
      {
        id: 'doctor_app',
        label: 'Doctor App',
        labelAr: 'تطبيق الأطباء',
        icon: Stethoscope
      }
    ],
    quickActions: [
      {
        id: 'download-app',
        label: 'Download App',
        labelAr: 'تحميل التطبيق',
        icon: Download,
        roles: ['admin', 'doctor', 'receptionist'],
        action: 'modal:download-app'
      }
    ]
  },

  // IoT Device Management Module
  {
    id: 'iot_devices',
    label: 'IoT Medical Devices',
    labelAr: 'الأجهزة الطبية الذكية',
    icon: Monitor,
    roles: ['admin', 'doctor', 'nurse', 'lab_tech'],
    views: [
      {
        id: 'overview',
        label: 'Device Overview',
        labelAr: 'نظرة عامة على الأجهزة',
        icon: Monitor
      },
      {
        id: 'monitoring',
        label: 'Real-time Monitoring',
        labelAr: 'المراقبة في الوقت الفعلي',
        icon: Activity
      },
      {
        id: 'alerts',
        label: 'Device Alerts',
        labelAr: 'تنبيهات الأجهزة',
        icon: Bell
      }
    ],
    quickActions: [
      {
        id: 'add-device',
        label: 'Add Device',
        labelAr: 'إضافة جهاز',
        icon: Plus,
        roles: ['admin'],
        action: 'modal:add-device'
      },
      {
        id: 'device-status',
        label: 'Check Status',
        labelAr: 'فحص الحالة',
        icon: Activity,
        roles: ['admin', 'doctor', 'nurse'],
        action: 'execute:check-device-status'
      }
    ]
  },

  // AI Diagnostic Assistant Module
  {
    id: 'ai_diagnostics',
    label: 'AI Diagnostic Assistant',
    labelAr: 'مساعد التشخيص الذكي',
    icon: Brain,
    roles: ['admin', 'doctor', 'nurse'],
    views: [
      {
        id: 'overview',
        label: 'AI Overview',
        labelAr: 'نظرة عامة على الذكاء الاصطناعي',
        icon: Brain
      },
      {
        id: 'models',
        label: 'AI Models',
        labelAr: 'نماذج الذكاء الاصطناعي',
        icon: Zap
      },
      {
        id: 'diagnostics',
        label: 'Diagnostic Cases',
        labelAr: 'حالات التشخيص',
        icon: FileText
      },
      {
        id: 'assistant',
        label: 'AI Assistant',
        labelAr: 'المساعد الذكي',
        icon: MessageSquare
      }
    ],
    quickActions: [
      {
        id: 'run-diagnosis',
        label: 'Run Diagnosis',
        labelAr: 'تشغيل التشخيص',
        icon: Zap,
        roles: ['doctor'],
        action: 'modal:run-diagnosis'
      },
      {
        id: 'ai-chat',
        label: 'Chat with AI',
        labelAr: 'محادثة مع الذكاء الاصطناعي',
        icon: MessageSquare,
        roles: ['admin', 'doctor'],
        action: 'navigate:ai_diagnostics/assistant'
      }
    ]
  },

  // Testing Module (Admin only)
  {
    id: 'testing',
    label: 'System Testing',
    labelAr: 'اختبار النظام',
    icon: TestTube2,
    roles: ['admin'],
    views: [
      {
        id: 'overview',
        label: 'Testing Overview',
        labelAr: 'نظرة عامة على الاختبارات',
        icon: TestTube2
      },
      {
        id: 'contrast',
        label: 'Color Contrast Test',
        labelAr: 'اختبار التباين',
        icon: Palette
      },
      {
        id: 'stability',
        label: 'Color Stability Test',
        labelAr: 'اختبار استقرار الألوان',
        icon: Activity
      }
    ],
    quickActions: [
      {
        id: 'run-contrast-test',
        label: 'Run Contrast Test',
        labelAr: 'تشغيل اختبار التباين',
        icon: Palette,
        roles: ['admin'],
        action: 'navigate:testing/contrast'
      },
      {
        id: 'run-stability-test',
        label: 'Run Stability Test',
        labelAr: 'تشغيل اختبار الاستقرار',
        icon: Activity,
        roles: ['admin'],
        action: 'navigate:testing/stability'
      }
    ]
  }
];

// Helper functions
export const getModulesForRole = (role: string): NavigationModule[] => {
  return navigationModules.filter(module => module.roles.includes(role));
};

export const getViewsForModule = (moduleId: string, role: string): NavigationView[] => {
  const module = navigationModules.find(m => m.id === moduleId);
  if (!module) return [];
  
  return module.views.filter(view => !view.roles || view.roles.includes(role));
};

export const getQuickActionsForModule = (moduleId: string, role: string): QuickActionConfig[] => {
  const module = navigationModules.find(m => m.id === moduleId);
  if (!module?.quickActions) return [];
  
  return module.quickActions.filter(action => action.roles.includes(role));
};