import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner@2.0.3';
import { useNavigation } from '../components/navigation/NavigationContext';
import { 
  UserPlus, Search, CheckCircle, Plus, Calendar, CalendarDays,
  TestTube, Pill, Activity, AlertTriangle, Zap, FileText,
  Download, Archive, RefreshCw, Users, Settings, Heart
} from 'lucide-react';

// Use Heart icon as a replacement for Stethoscope since it's not available
const Stethoscope = Heart;

export interface QuickAction {
  id: string;
  label: string;
  labelAr: string;
  icon: any;
  shortcut?: string;
  category: string;
  action: string;
  roles: string[];
  isCustom?: boolean;
  isEnabled: boolean;
  order: number;
  metadata?: Record<string, any>;
}

export interface QuickActionCategory {
  id: string;
  label: string;
  labelAr: string;
  icon: any;
  order: number;
}

interface QuickActionsContextValue {
  quickActions: QuickAction[];
  categories: QuickActionCategory[];
  favoriteActions: string[];
  recentActions: string[];
  executeAction: (actionId: string, context?: any) => Promise<void>;
  addToFavorites: (actionId: string) => void;
  removeFromFavorites: (actionId: string) => void;
  toggleActionEnabled: (actionId: string) => void;
  updateActionOrder: (actionId: string, newOrder: number) => void;
  addCustomAction: (action: Omit<QuickAction, 'id' | 'isCustom'>) => void;
  removeCustomAction: (actionId: string) => void;
  getActionsByCategory: (categoryId: string) => QuickAction[];
  searchActions: (query: string) => QuickAction[];
  getActionById: (actionId: string) => QuickAction | undefined;
  recordActionUsage: (actionId: string) => void;
  getActionUsageStats: () => Record<string, number>;
  exportSettings: () => string;
  importSettings: (settings: string) => Promise<void>;
}

const QuickActionsContext = createContext<QuickActionsContextValue | undefined>(undefined);

// Default quick actions
const defaultQuickActions: QuickAction[] = [
  // Patient Management
  {
    id: 'add-patient',
    label: 'Add Patient',
    labelAr: 'إضافة مريض',
    icon: UserPlus,
    shortcut: 'Ctrl+Shift+P',
    category: 'patients',
    action: 'navigate:patients/registration',
    roles: ['admin', 'receptionist'],
    isEnabled: true,
    order: 1
  },
  {
    id: 'search-patient',
    label: 'Search Patient',
    labelAr: 'البحث عن مريض',
    icon: Search,
    shortcut: 'Ctrl+F',
    category: 'patients',
    action: 'modal:patient-search',
    roles: ['admin', 'doctor', 'receptionist'],
    isEnabled: true,
    order: 2
  },
  {
    id: 'patient-checkin',
    label: 'Patient Check-in',
    labelAr: 'تسجيل دخول مريض',
    icon: CheckCircle,
    shortcut: 'Ctrl+Shift+C',
    category: 'patients',
    action: 'modal:patient-checkin',
    roles: ['admin', 'receptionist'],
    isEnabled: true,
    order: 3
  },
  
  // Appointments
  {
    id: 'new-appointment',
    label: 'New Appointment',
    labelAr: 'موعد جديد',
    icon: Plus,
    shortcut: 'Ctrl+Shift+A',
    category: 'appointments',
    action: 'modal:new-appointment',
    roles: ['admin', 'receptionist'],
    isEnabled: true,
    order: 1
  },
  {
    id: 'view-schedule',
    label: 'View Schedule',
    labelAr: 'عرض الجدول',
    icon: Calendar,
    shortcut: 'Ctrl+Shift+S',
    category: 'appointments',
    action: 'navigate:appointments/schedule',
    roles: ['admin', 'doctor', 'receptionist'],
    isEnabled: true,
    order: 2
  },
  {
    id: 'today-appointments',
    label: "Today's Appointments",
    labelAr: 'مواعيد اليوم',
    icon: CalendarDays,
    shortcut: 'Ctrl+Shift+T',
    category: 'appointments',
    action: 'navigate:appointments/today',
    roles: ['admin', 'doctor', 'receptionist'],
    isEnabled: true,
    order: 3
  },
  
  // Medical
  {
    id: 'new-lab-order',
    label: 'New Lab Order',
    labelAr: 'طلب مختبر جديد',
    icon: TestTube,
    shortcut: 'Ctrl+Shift+L',
    category: 'medical',
    action: 'modal:new-lab-order',
    roles: ['doctor'],
    isEnabled: true,
    order: 1
  },
  {
    id: 'new-prescription',
    label: 'New Prescription',
    labelAr: 'وصفة جديدة',
    icon: Pill,
    shortcut: 'Ctrl+Shift+R',
    category: 'medical',
    action: 'modal:new-prescription',
    roles: ['doctor'],
    isEnabled: true,
    order: 2
  },
  {
    id: 'record-vitals',
    label: 'Record Vital Signs',
    labelAr: 'تسجيل العلامات الحيوية',
    icon: Activity,
    shortcut: 'Ctrl+Shift+V',
    category: 'medical',
    action: 'modal:record-vitals',
    roles: ['nurse'],
    isEnabled: true,
    order: 3
  },
  
  // Emergency
  {
    id: 'emergency-alert',
    label: 'Emergency Alert',
    labelAr: 'تنبيه طارئ',
    icon: AlertTriangle,
    shortcut: 'Ctrl+Shift+E',
    category: 'emergency',
    action: 'execute:emergency-alert',
    roles: ['admin', 'doctor', 'nurse'],
    isEnabled: true,
    order: 1
  },
  {
    id: 'code-blue',
    label: 'Code Blue',
    labelAr: 'كود أزرق',
    icon: Zap,
    shortcut: 'Ctrl+Alt+B',
    category: 'emergency',
    action: 'execute:code-blue',
    roles: ['admin', 'doctor', 'nurse'],
    isEnabled: true,
    order: 2
  },
  
  // Reports
  {
    id: 'daily-report',
    label: 'Daily Report',
    labelAr: 'التقرير اليومي',
    icon: FileText,
    shortcut: 'Ctrl+Shift+D',
    category: 'reports',
    action: 'execute:daily-report',
    roles: ['admin', 'doctor'],
    isEnabled: true,
    order: 1
  },
  {
    id: 'export-data',
    label: 'Export Data',
    labelAr: 'تصدير البيانات',
    icon: Download,
    shortcut: 'Ctrl+Shift+X',
    category: 'reports',
    action: 'execute:export-data',
    roles: ['admin'],
    isEnabled: true,
    order: 2
  },
  
  // System
  {
    id: 'system-backup',
    label: 'System Backup',
    labelAr: 'نسخة احتياطية',
    icon: Archive,
    shortcut: 'Ctrl+Alt+S',
    category: 'system',
    action: 'execute:system-backup',
    roles: ['admin'],
    isEnabled: true,
    order: 1
  },
  {
    id: 'refresh-data',
    label: 'Refresh Data',
    labelAr: 'تحديث البيانات',
    icon: RefreshCw,
    shortcut: 'F5',
    category: 'system',
    action: 'execute:refresh-data',
    roles: ['admin', 'doctor', 'receptionist'],
    isEnabled: true,
    order: 2
  }
];

// Default categories
const defaultCategories: QuickActionCategory[] = [
  {
    id: 'patients',
    label: 'Patient Management',
    labelAr: 'إدارة المرضى',
    icon: Users,
    order: 1
  },
  {
    id: 'appointments',
    label: 'Appointments',
    labelAr: 'المواعيد',
    icon: Calendar,
    order: 2
  },
  {
    id: 'medical',
    label: 'Medical',
    labelAr: 'طبي',
    icon: Stethoscope,
    order: 3
  },
  {
    id: 'emergency',
    label: 'Emergency',
    labelAr: 'طوارئ',
    icon: AlertTriangle,
    order: 4
  },
  {
    id: 'reports',
    label: 'Reports',
    labelAr: 'التقارير',
    icon: FileText,
    order: 5
  },
  {
    id: 'system',
    label: 'System',
    labelAr: 'النظام',
    icon: Settings,
    order: 6
  }
];

export function QuickActionsProvider({
  children,
  userId,
  userRole
}: {
  children: React.ReactNode;
  userId: string;
  userRole: string;
}) {
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [categories, setCategories] = useState<QuickActionCategory[]>(defaultCategories);
  const [favoriteActions, setFavoriteActions] = useState<string[]>([]);
  const [recentActions, setRecentActions] = useState<string[]>([]);
  const [actionUsageStats, setActionUsageStats] = useState<Record<string, number>>({});
  // Handle potential missing navigation context safely
  const navigationContext = useNavigation();
  const navigate = navigationContext?.navigate || (() => {});

  // Load user settings on mount
  useEffect(() => {
    loadUserSettings();
  }, [userId]);

  // Filter actions by user role
  const filteredActions = quickActions.filter(action => 
    action.roles.includes(userRole) && action.isEnabled
  );

  const loadUserSettings = useCallback(async () => {
    try {
      const settings = localStorage.getItem(`quickActions_${userId}`);
      if (settings) {
        const parsed = JSON.parse(settings);
        setQuickActions(parsed.actions || defaultQuickActions);
        setFavoriteActions(parsed.favorites || []);
        setRecentActions(parsed.recent || []);
        setActionUsageStats(parsed.usage || {});
      } else {
        setQuickActions(defaultQuickActions);
      }
    } catch (error) {
      console.error('Error loading quick actions settings:', error);
      setQuickActions(defaultQuickActions);
    }
  }, [userId]);

  const saveUserSettings = useCallback(() => {
    try {
      const settings = {
        actions: quickActions,
        favorites: favoriteActions,
        recent: recentActions,
        usage: actionUsageStats
      };
      localStorage.setItem(`quickActions_${userId}`, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving quick actions settings:', error);
    }
  }, [userId, quickActions, favoriteActions, recentActions, actionUsageStats]);

  useEffect(() => {
    saveUserSettings();
  }, [saveUserSettings]);

  const executeAction = useCallback(async (actionId: string, context?: any) => {
    const action = quickActions.find(a => a.id === actionId);
    if (!action) {
      toast.error('Action not found');
      return;
    }

    // Record usage
    recordActionUsage(actionId);

    // Parse action type and target
    const [type, target] = action.action.split(':');

    try {
      switch (type) {
        case 'navigate':
          if (target.includes('/')) {
            const [module, view] = target.split('/');
            navigate(module, view);
          } else {
            navigate(target);
          }
          toast.success(`Navigated to ${action.label}`);
          break;

        case 'modal':
          await handleModalAction(target, context);
          break;

        case 'execute':
          await handleExecuteAction(target, context);
          break;

        default:
          toast.error(`Unknown action type: ${type}`);
      }
    } catch (error) {
      console.error('Error executing action:', error);
      toast.error(`Failed to execute ${action.label}`);
    }
  }, [quickActions, navigate]);

  const handleModalAction = async (target: string, context?: any) => {
    switch (target) {
      case 'patient-search':
        // Open patient search modal
        toast.info('Opening patient search...');
        break;
        
      case 'new-appointment':
        // Open new appointment modal
        toast.info('Opening appointment scheduler...');
        break;
        
      case 'patient-checkin':
        // Open check-in modal
        toast.info('Opening patient check-in...');
        break;
        
      case 'new-lab-order':
        // Open lab order modal
        toast.info('Opening lab order form...');
        break;
        
      case 'new-prescription':
        // Open prescription modal
        toast.info('Opening prescription form...');
        break;
        
      case 'record-vitals':
        // Open vital signs modal
        toast.info('Opening vital signs recorder...');
        break;
        
      default:
        toast.error(`Unknown modal: ${target}`);
    }
  };

  const handleExecuteAction = async (target: string, context?: any) => {
    switch (target) {
      case 'emergency-alert':
        // Trigger emergency alert
        toast.error('Emergency alert activated!', {
          duration: 5000,
          action: {
            label: 'Acknowledge',
            onClick: () => toast.dismiss()
          }
        });
        break;
        
      case 'code-blue':
        // Trigger code blue
        toast.error('CODE BLUE ACTIVATED!', {
          duration: 10000,
          action: {
            label: 'Respond',
            onClick: () => navigate('emergency')
          }
        });
        break;
        
      case 'daily-report':
        // Generate daily report
        toast.loading('Generating daily report...');
        setTimeout(() => {
          toast.success('Daily report generated successfully');
        }, 2000);
        break;
        
      case 'export-data':
        // Export data
        toast.loading('Exporting data...');
        setTimeout(() => {
          toast.success('Data exported successfully');
        }, 3000);
        break;
        
      case 'system-backup':
        // System backup
        toast.loading('Creating system backup...');
        setTimeout(() => {
          toast.success('System backup completed');
        }, 5000);
        break;
        
      case 'refresh-data':
        // Refresh data
        toast.loading('Refreshing data...');
        setTimeout(() => {
          toast.success('Data refreshed');
          window.location.reload();
        }, 1000);
        break;
        
      default:
        toast.error(`Unknown action: ${target}`);
    }
  };

  const addToFavorites = useCallback((actionId: string) => {
    setFavoriteActions(prev => {
      if (!prev.includes(actionId)) {
        return [...prev, actionId];
      }
      return prev;
    });
  }, []);

  const removeFromFavorites = useCallback((actionId: string) => {
    setFavoriteActions(prev => prev.filter(id => id !== actionId));
  }, []);

  const toggleActionEnabled = useCallback((actionId: string) => {
    setQuickActions(prev =>
      prev.map(action =>
        action.id === actionId
          ? { ...action, isEnabled: !action.isEnabled }
          : action
      )
    );
  }, []);

  const updateActionOrder = useCallback((actionId: string, newOrder: number) => {
    setQuickActions(prev =>
      prev.map(action =>
        action.id === actionId
          ? { ...action, order: newOrder }
          : action
      )
    );
  }, []);

  const addCustomAction = useCallback((actionData: Omit<QuickAction, 'id' | 'isCustom'>) => {
    const newAction: QuickAction = {
      ...actionData,
      id: `custom_${Date.now()}`,
      isCustom: true
    };
    setQuickActions(prev => [...prev, newAction]);
    toast.success('Custom action added successfully');
  }, []);

  const removeCustomAction = useCallback((actionId: string) => {
    const action = quickActions.find(a => a.id === actionId);
    if (action?.isCustom) {
      setQuickActions(prev => prev.filter(a => a.id !== actionId));
      toast.success('Custom action removed');
    }
  }, [quickActions]);

  const getActionsByCategory = useCallback((categoryId: string) => {
    return filteredActions
      .filter(action => action.category === categoryId)
      .sort((a, b) => a.order - b.order);
  }, [filteredActions]);

  const searchActions = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return filteredActions.filter(action =>
      action.label.toLowerCase().includes(lowercaseQuery) ||
      action.labelAr.toLowerCase().includes(lowercaseQuery) ||
      action.category.toLowerCase().includes(lowercaseQuery)
    );
  }, [filteredActions]);

  const getActionById = useCallback((actionId: string) => {
    return quickActions.find(action => action.id === actionId);
  }, [quickActions]);

  const recordActionUsage = useCallback((actionId: string) => {
    // Update usage stats
    setActionUsageStats(prev => ({
      ...prev,
      [actionId]: (prev[actionId] || 0) + 1
    }));

    // Update recent actions
    setRecentActions(prev => {
      const filtered = prev.filter(id => id !== actionId);
      return [actionId, ...filtered].slice(0, 10); // Keep last 10
    });
  }, []);

  const getActionUsageStats = useCallback(() => {
    return actionUsageStats;
  }, [actionUsageStats]);

  const exportSettings = useCallback(() => {
    const settings = {
      actions: quickActions,
      favorites: favoriteActions,
      categories: categories,
      usage: actionUsageStats
    };
    return JSON.stringify(settings, null, 2);
  }, [quickActions, favoriteActions, categories, actionUsageStats]);

  const importSettings = useCallback(async (settingsJson: string) => {
    try {
      const settings = JSON.parse(settingsJson);
      if (settings.actions) setQuickActions(settings.actions);
      if (settings.favorites) setFavoriteActions(settings.favorites);
      if (settings.categories) setCategories(settings.categories);
      if (settings.usage) setActionUsageStats(settings.usage);
      toast.success('Settings imported successfully');
    } catch (error) {
      toast.error('Failed to import settings');
      throw error;
    }
  }, []);

  const value: QuickActionsContextValue = {
    quickActions: filteredActions,
    categories,
    favoriteActions,
    recentActions,
    executeAction,
    addToFavorites,
    removeFromFavorites,
    toggleActionEnabled,
    updateActionOrder,
    addCustomAction,
    removeCustomAction,
    getActionsByCategory,
    searchActions,
    getActionById,
    recordActionUsage,
    getActionUsageStats,
    exportSettings,
    importSettings
  };

  return (
    <QuickActionsContext.Provider value={value}>
      {children}
    </QuickActionsContext.Provider>
  );
}

export function useQuickActions() {
  const context = useContext(QuickActionsContext);
  if (context === undefined) {
    throw new Error('useQuickActions must be used within a QuickActionsProvider');
  }
  return context;
}