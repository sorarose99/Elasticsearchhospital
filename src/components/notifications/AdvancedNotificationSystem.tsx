import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, X, Check, Clock, AlertTriangle, Info, CheckCircle,
  Settings, Filter, Search, Trash2, MoreVertical, Zap,
  Users, Calendar, Activity, Shield, Database, MessageSquare,
  ArrowRight, ExternalLink, Play, Pause, Volume2, VolumeX
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { toast } from 'sonner@2.0.3';
import { useLanguage } from '../../services/LanguageService';

interface AdvancedNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'emergency' | 'system';
  category: 'patient' | 'appointment' | 'medical' | 'system' | 'emergency' | 'communication';
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  sourceIcon?: any;
  metadata?: {
    patientId?: string;
    appointmentId?: string;
    actionRequired?: boolean;
    expiresAt?: Date;
    attachments?: string[];
    relatedUsers?: string[];
  };
  quickActions?: QuickNotificationAction[];
  autoActions?: AutoNotificationAction[];
  soundEnabled?: boolean;
  persistUntilAction?: boolean;
}

interface QuickNotificationAction {
  id: string;
  label: string;
  labelAr: string;
  action: string;
  variant: 'default' | 'destructive' | 'outline' | 'secondary';
  requiresConfirmation?: boolean;
}

interface AutoNotificationAction {
  id: string;
  trigger: 'time' | 'read' | 'click' | 'custom';
  delay: number; // in milliseconds
  action: string;
  condition?: string;
}

interface NotificationRule {
  id: string;
  name: string;
  nameAr: string;
  type: AdvancedNotification['type'];
  category: AdvancedNotification['category'];
  enabled: boolean;
  conditions: {
    users?: string[];
    roles?: string[];
    timeRange?: {
      start: string;
      end: string;
    };
    frequency?: 'immediate' | 'batched' | 'digest';
  };
  actions: {
    sound?: boolean;
    popup?: boolean;
    email?: boolean;
    sms?: boolean;
    push?: boolean;
  };
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: AdvancedNotification['type'];
  category: AdvancedNotification['category'];
  titleTemplate: string;
  messageTemplate: string;
  quickActions: QuickNotificationAction[];
  variables: string[];
}

const notificationTypeIcons = {
  info: Info,
  warning: AlertTriangle,
  error: AlertTriangle,
  success: CheckCircle,
  emergency: Shield,
  system: Settings
};

const categoryIcons = {
  patient: Users,
  appointment: Calendar,
  medical: Activity,
  system: Settings,
  emergency: Shield,
  communication: MessageSquare
};

const priorityColors = {
  low: 'text-blue-500 bg-blue-50 border-blue-200',
  medium: 'text-yellow-500 bg-yellow-50 border-yellow-200',
  high: 'text-orange-500 bg-orange-50 border-orange-200',
  critical: 'text-red-500 bg-red-50 border-red-200'
};

const translations = {
  en: {
    title: "Advanced Notification System",
    subtitle: "Manage notifications, rules, and quick actions",
    tabs: {
      notifications: "Notifications",
      rules: "Rules",
      templates: "Templates",
      settings: "Settings"
    },
    actions: {
      markRead: "Mark as Read",
      markUnread: "Mark as Unread", 
      delete: "Delete",
      archive: "Archive",
      respond: "Respond",
      execute: "Execute"
    },
    filters: {
      all: "All",
      unread: "Unread",
      high: "High Priority",
      today: "Today"
    },
    types: {
      info: "Information",
      warning: "Warning",
      error: "Error",
      success: "Success",
      emergency: "Emergency",
      system: "System"
    },
    categories: {
      patient: "Patient",
      appointment: "Appointment",
      medical: "Medical",
      system: "System",
      emergency: "Emergency",
      communication: "Communication"
    },
    priorities: {
      low: "Low",
      medium: "Medium",
      high: "High",
      critical: "Critical"
    }
  },
  ar: {
    title: "نظام الإشعارات المتقدم",
    subtitle: "إدارة الإشعارات والقواعد والإجراءات السريعة",
    tabs: {
      notifications: "الإشعارات",
      rules: "القواعد",
      templates: "القوالب",
      settings: "الإعدادات"
    },
    actions: {
      markRead: "تحديد كمقروء",
      markUnread: "تحديد كغير مقروء",
      delete: "حذف",
      archive: "أرشفة",
      respond: "رد",
      execute: "تنفيذ"
    },
    filters: {
      all: "الكل",
      unread: "غير مقروء",
      high: "أولوية عالية",
      today: "اليوم"
    },
    types: {
      info: "معلومات",
      warning: "تحذير",
      error: "خطأ",
      success: "نجح",
      emergency: "طوارئ",
      system: "النظام"
    },
    categories: {
      patient: "مريض",
      appointment: "موعد",
      medical: "طبي",
      system: "النظام",
      emergency: "طوارئ",
      communication: "تواصل"
    },
    priorities: {
      low: "منخفض",
      medium: "متوسط",
      high: "عالي",
      critical: "حرج"
    }
  }
};

export default function AdvancedNotificationSystem() {
  const { language, t, isRTL } = useLanguage();
  const texts = translations[language as keyof typeof translations] || translations.en;

  // State management
  const [notifications, setNotifications] = useState<AdvancedNotification[]>([]);
  const [rules, setRules] = useState<NotificationRule[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<AdvancedNotification | null>(null);
  const [activeTab, setActiveTab] = useState('notifications');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Audio refs for notification sounds
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadNotifications();
    loadRules();
    loadTemplates();
    
    if (autoRefresh) {
      const interval = setInterval(loadNotifications, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadNotifications = async () => {
    // In a real app, this would fetch from API
    const sampleNotifications: AdvancedNotification[] = [
      {
        id: '1',
        type: 'warning',
        category: 'patient',
        title: 'Lab Results Ready',
        titleAr: 'نتائج المختبر جاهزة',
        message: 'Lab results for Patient #12345 are ready for review',
        messageAr: 'نتائج المختبر للمريض #12345 جاهزة للمراجعة',
        timestamp: new Date(),
        isRead: false,
        priority: 'high',
        source: 'Laboratory System',
        quickActions: [
          {
            id: 'view-results',
            label: 'View Results',
            labelAr: 'عرض النتائج',
            action: 'navigate:lab/results/12345',
            variant: 'default'
          },
          {
            id: 'notify-doctor',
            label: 'Notify Doctor',
            labelAr: 'إشعار الطبيب',
            action: 'execute:notify-doctor',
            variant: 'outline'
          }
        ]
      },
      {
        id: '2',
        type: 'emergency',
        category: 'emergency',
        title: 'Code Blue - Room 204',
        titleAr: 'كود أزرق - غرفة 204',
        message: 'Emergency response required in Room 204',
        messageAr: 'مطلوب استجابة طارئة في الغرفة 204',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        isRead: false,
        priority: 'critical',
        source: 'Emergency System',
        persistUntilAction: true,
        quickActions: [
          {
            id: 'respond',
            label: 'Respond',
            labelAr: 'استجابة',
            action: 'navigate:emergency/respond',
            variant: 'destructive'
          },
          {
            id: 'call-team',
            label: 'Call Team',
            labelAr: 'استدعاء الفريق',
            action: 'execute:call-emergency-team',
            variant: 'default'
          }
        ]
      },
      {
        id: '3',
        type: 'info',
        category: 'appointment',
        title: 'Appointment Reminder',
        titleAr: 'تذكير موعد',
        message: 'Patient John Doe has an appointment in 30 minutes',
        messageAr: 'المريض جون دو لديه موعد خلال 30 دقيقة',
        timestamp: new Date(Date.now() - 600000), // 10 minutes ago
        isRead: true,
        priority: 'medium',
        source: 'Appointment System',
        quickActions: [
          {
            id: 'view-appointment',
            label: 'View Details',
            labelAr: 'عرض التفاصيل',
            action: 'navigate:appointments/details/123',
            variant: 'outline'
          }
        ]
      }
    ];
    
    setNotifications(sampleNotifications);
  };

  const loadRules = async () => {
    // Load notification rules
    const sampleRules: NotificationRule[] = [
      {
        id: 'lab-results',
        name: 'Lab Results Ready',
        nameAr: 'نتائج المختبر جاهزة',
        type: 'warning',
        category: 'patient',
        enabled: true,
        conditions: {
          roles: ['doctor', 'nurse'],
          frequency: 'immediate'
        },
        actions: {
          sound: true,
          popup: true,
          email: false
        }
      }
    ];
    setRules(sampleRules);
  };

  const loadTemplates = async () => {
    // Load notification templates
    const sampleTemplates: NotificationTemplate[] = [
      {
        id: 'appointment-reminder',
        name: 'Appointment Reminder',
        type: 'info',
        category: 'appointment',
        titleTemplate: 'Appointment Reminder - {{patientName}}',
        messageTemplate: 'Patient {{patientName}} has an appointment at {{time}}',
        variables: ['patientName', 'time'],
        quickActions: [
          {
            id: 'view-appointment',
            label: 'View Details',
            labelAr: 'عرض التفاصيل',
            action: 'navigate:appointments/{{appointmentId}}',
            variant: 'outline'
          }
        ]
      }
    ];
    setTemplates(sampleTemplates);
  };

  const playNotificationSound = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  }, [soundEnabled]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, isRead: true }
          : notif
      )
    );
  }, []);

  const markAsUnread = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, isRead: false }
          : notif
      )
    );
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    toast.success('Notification deleted');
  }, []);

  const executeQuickAction = useCallback(async (action: QuickNotificationAction, notification: AdvancedNotification) => {
    try {
      // Parse action
      const [type, target] = action.action.split(':');
      
      switch (type) {
        case 'navigate':
          // Handle navigation
          toast.success(`Navigating to ${target}`);
          break;
          
        case 'execute':
          // Execute system action
          await handleSystemAction(target, notification);
          break;
          
        case 'modal':
          // Open modal
          toast.info(`Opening ${target} modal`);
          break;
          
        default:
          toast.error(`Unknown action type: ${type}`);
      }
      
      // Auto-mark as read after action
      markAsRead(notification.id);
      
    } catch (error) {
      console.error('Error executing quick action:', error);
      toast.error('Failed to execute action');
    }
  }, [markAsRead]);

  const handleSystemAction = async (action: string, notification: AdvancedNotification) => {
    switch (action) {
      case 'notify-doctor':
        toast.loading('Notifying doctor...');
        setTimeout(() => {
          toast.success('Doctor notified successfully');
        }, 2000);
        break;
        
      case 'call-emergency-team':
        toast.loading('Calling emergency team...');
        setTimeout(() => {
          toast.success('Emergency team contacted');
        }, 1500);
        break;
        
      default:
        toast.info(`Executing: ${action}`);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!notification.title.toLowerCase().includes(query) &&
          !notification.message.toLowerCase().includes(query) &&
          !notification.source.toLowerCase().includes(query)) {
        return false;
      }
    }
    
    // Type filter
    switch (filterType) {
      case 'unread':
        return !notification.isRead;
      case 'high':
        return notification.priority === 'high' || notification.priority === 'critical';
      case 'today':
        const today = new Date();
        return notification.timestamp.toDateString() === today.toDateString();
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const criticalCount = notifications.filter(n => n.priority === 'critical').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6" />
            {texts.title}
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">
            {texts.subtitle}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="hover-scale"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="hover-scale"
          >
            {autoRefresh ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            onClick={loadNotifications}
            className="hover-lift"
          >
            <Bell className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Critical Notifications Banner */}
      {criticalCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500 text-white p-4 rounded-lg flex items-center justify-between animate-pulse-soft"
        >
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span className="font-medium">
              {criticalCount} Critical Notification{criticalCount > 1 ? 's' : ''} Require Immediate Attention
            </span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setFilterType('high')}
          >
            View All
          </Button>
        </motion.div>
      )}

      {/* Main Content */}
      <Card className="card-animate">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                {texts.tabs.notifications}
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="rules" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                {texts.tabs.rules}
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                {texts.tabs.templates}
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                {texts.tabs.settings}
              </TabsTrigger>
            </TabsList>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-4">
              {/* Filters and Search */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{texts.filters.all}</SelectItem>
                      <SelectItem value="unread">{texts.filters.unread}</SelectItem>
                      <SelectItem value="high">{texts.filters.high}</SelectItem>
                      <SelectItem value="today">{texts.filters.today}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Notifications List */}
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredNotifications.map((notification, index) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      index={index}
                      texts={texts}
                      onMarkAsRead={() => markAsRead(notification.id)}
                      onMarkAsUnread={() => markAsUnread(notification.id)}
                      onDelete={() => deleteNotification(notification.id)}
                      onQuickAction={(action) => executeQuickAction(action, notification)}
                      onClick={() => setSelectedNotification(notification)}
                    />
                  ))}
                </AnimatePresence>
                
                {filteredNotifications.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No notifications found</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Rules Tab */}
            <TabsContent value="rules" className="space-y-4">
              <NotificationRulesManager rules={rules} setRules={setRules} />
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-4">
              <NotificationTemplatesManager templates={templates} setTemplates={setTemplates} />
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <NotificationSettings 
                soundEnabled={soundEnabled}
                setSoundEnabled={setSoundEnabled}
                autoRefresh={autoRefresh}
                setAutoRefresh={setAutoRefresh}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Notification Detail Dialog */}
      <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
        <DialogContent className="max-w-2xl">
          {selectedNotification && (
            <NotificationDetail
              notification={selectedNotification}
              texts={texts}
              onClose={() => setSelectedNotification(null)}
              onQuickAction={(action) => executeQuickAction(action, selectedNotification)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Hidden audio element for notification sounds */}
      <audio
        ref={audioRef}
        preload="auto"
        src="/notification-sound.mp3" // You would add this sound file
      />
    </div>
  );
}

// Individual Notification Card Component
function NotificationCard({
  notification,
  index,
  texts,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
  onQuickAction,
  onClick
}: {
  notification: AdvancedNotification;
  index: number;
  texts: any;
  onMarkAsRead: () => void;
  onMarkAsUnread: () => void;
  onDelete: () => void;
  onQuickAction: (action: QuickNotificationAction) => void;
  onClick: () => void;
}) {
  const TypeIcon = notificationTypeIcons[notification.type];
  const CategoryIcon = categoryIcons[notification.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.01 }}
    >
      <Card 
        className={`cursor-pointer transition-all duration-200 hover-lift ${
          !notification.isRead ? 'border-primary/50 bg-primary/5' : ''
        } ${
          notification.priority === 'critical' ? 'border-red-500 bg-red-50' : ''
        }`}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              {/* Notification Icon */}
              <div className={`p-2 rounded-full ${
                notification.type === 'emergency' ? 'bg-red-100 text-red-600' :
                notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                notification.type === 'success' ? 'bg-green-100 text-green-600' :
                notification.type === 'error' ? 'bg-red-100 text-red-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                <TypeIcon className="h-5 w-5" />
              </div>

              {/* Notification Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-medium truncate ${
                    !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {notification.title}
                  </h3>
                  
                  <Badge variant="outline" className="text-xs">
                    <CategoryIcon className="h-3 w-3 mr-1" />
                    {texts.categories[notification.category]}
                  </Badge>
                  
                  <Badge className={`text-xs ${priorityColors[notification.priority]}`}>
                    {texts.priorities[notification.priority]}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {notification.message}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{notification.source}</span>
                  <span>{notification.timestamp.toLocaleTimeString()}</span>
                  {!notification.isRead && (
                    <Badge variant="secondary" className="text-xs">
                      New
                    </Badge>
                  )}
                </div>

                {/* Quick Actions */}
                {notification.quickActions && notification.quickActions.length > 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    {notification.quickActions.slice(0, 2).map((action) => (
                      <Button
                        key={action.id}
                        variant={action.variant as any}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickAction(action);
                        }}
                        className="text-xs h-7"
                      >
                        {action.label}
                      </Button>
                    ))}
                    {notification.quickActions.length > 2 && (
                      <span className="text-xs text-muted-foreground">
                        +{notification.quickActions.length - 2} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  className="h-8 w-8 p-0"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    notification.isRead ? onMarkAsUnread() : onMarkAsRead();
                  }}
                >
                  {notification.isRead ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      {texts.actions.markUnread}
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      {texts.actions.markRead}
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {texts.actions.delete}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Notification Detail Component
function NotificationDetail({
  notification,
  texts,
  onClose,
  onQuickAction
}: {
  notification: AdvancedNotification;
  texts: any;
  onClose: () => void;
  onQuickAction: (action: QuickNotificationAction) => void;
}) {
  const TypeIcon = notificationTypeIcons[notification.type];
  const CategoryIcon = categoryIcons[notification.category];

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <TypeIcon className="h-5 w-5" />
          {notification.title}
        </DialogTitle>
        <DialogDescription>
          {notification.source} • {notification.timestamp.toLocaleString()}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            <CategoryIcon className="h-3 w-3 mr-1" />
            {texts.categories[notification.category]}
          </Badge>
          <Badge className={priorityColors[notification.priority]}>
            {texts.priorities[notification.priority]}
          </Badge>
        </div>

        <div>
          <h4 className="font-medium mb-2">Message</h4>
          <p className="text-sm text-muted-foreground">
            {notification.message}
          </p>
        </div>

        {notification.quickActions && notification.quickActions.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Quick Actions</h4>
            <div className="flex flex-wrap gap-2">
              {notification.quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant={action.variant as any}
                  onClick={() => {
                    onQuickAction(action);
                    onClose();
                  }}
                  className="flex items-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Notification Rules Manager Component
function NotificationRulesManager({
  rules,
  setRules
}: {
  rules: NotificationRule[];
  setRules: React.Dispatch<React.SetStateAction<NotificationRule[]>>;
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Notification Rules</h3>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </div>

      <div className="grid gap-4">
        {rules.map((rule) => (
          <Card key={rule.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{rule.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {rule.type} • {rule.category}
                  </p>
                </div>
                <Switch
                  checked={rule.enabled}
                  onCheckedChange={(checked) => {
                    setRules(rules.map(r =>
                      r.id === rule.id ? { ...r, enabled: checked } : r
                    ));
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Notification Templates Manager Component
function NotificationTemplatesManager({
  templates,
  setTemplates
}: {
  templates: NotificationTemplate[];
  setTemplates: React.Dispatch<React.SetStateAction<NotificationTemplate[]>>;
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Notification Templates</h3>
        <Button>
          <MessageSquare className="h-4 w-4 mr-2" />
          Add Template
        </Button>
      </div>

      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardContent className="p-4">
              <h4 className="font-medium">{template.name}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {template.titleTemplate}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{template.type}</Badge>
                <Badge variant="outline">{template.category}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Notification Settings Component
function NotificationSettings({
  soundEnabled,
  setSoundEnabled,
  autoRefresh,
  setAutoRefresh
}: {
  soundEnabled: boolean;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  autoRefresh: boolean;
  setAutoRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Notification Settings</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Sound Notifications</h4>
            <p className="text-sm text-muted-foreground">
              Play sound when new notifications arrive
            </p>
          </div>
          <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Auto Refresh</h4>
            <p className="text-sm text-muted-foreground">
              Automatically refresh notifications every 30 seconds
            </p>
          </div>
          <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
        </div>
      </div>
    </div>
  );
}