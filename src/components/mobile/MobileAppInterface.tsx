import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Smartphone,
  Download,
  QrCode,
  Bell,
  Calendar,
  User,
  Heart,
  Activity,
  MessageSquare,
  Video,
  Pill,
  FileText,
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  Search,
  Menu,
  X,
  Home,
  Settings,
  HelpCircle,
  Shield,
  Wifi,
  Battery,
  Signal,
  Camera,
  Fingerprint,
  Lock,
  Globe,
  Zap,
  Bluetooth,
  Share2,
  BookOpen,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  PlayCircle,
  Pause,
  SkipForward
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';

interface MobileFeature {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: any;
  category: string;
  categoryAr: string;
  status: 'available' | 'coming-soon' | 'beta';
  platforms: ('ios' | 'android' | 'web')[];
  screenshots: string[];
  downloadStats: {
    ios: number;
    android: number;
    web: number;
  };
  rating: number;
  reviews: number;
  version: string;
  size: string;
  lastUpdated: string;
  features: string[];
  featuresAr: string[];
}

interface NotificationItem {
  id: string;
  type: 'appointment' | 'medication' | 'result' | 'emergency' | 'general';
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  time: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionable: boolean;
  actionText?: string;
  actionTextAr?: string;
}

interface MobileAppInterfaceProps {
  isDemoMode?: boolean;
}

const MobileAppInterface: React.FC<MobileAppInterfaceProps> = ({ 
  isDemoMode = false 
}) => {
  const { t, language, isRTL } = useLanguage();
  const { effectiveTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [isOnline, setIsOnline] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Demo mobile app features
  const [mobileFeatures, setMobileFeatures] = useState<MobileFeature[]>([
    {
      id: '1',
      name: 'Patient Portal Mobile',
      nameAr: 'بوابة المرضى المحمولة',
      description: 'Complete patient portal with appointment booking, medical records access, and telemedicine',
      descriptionAr: 'بوابة مرضى شاملة مع حجز المواعيد والوصول للسجلات الطبية والطب عن بُعد',
      icon: User,
      category: 'Patient Care',
      categoryAr: 'رعاية المرضى',
      status: 'available',
      platforms: ['ios', 'android', 'web'],
      screenshots: [],
      downloadStats: { ios: 25000, android: 45000, web: 15000 },
      rating: 4.8,
      reviews: 1250,
      version: '2.1.0',
      size: '45 MB',
      lastUpdated: '2024-01-15',
      features: [
        'Book and manage appointments',
        'View medical records and test results',
        'Video consultations with doctors',
        'Medication reminders and tracking',
        'Health metrics tracking',
        'Emergency contact and services',
        'Prescription management',
        'Insurance information and claims'
      ],
      featuresAr: [
        'حجز وإدارة المواعيد',
        'عرض السجلات الطبية ونتائج الفحوصات',
        'استشارات مرئية مع الأطباء',
        'تذكيرات الأدوية والمتابعة',
        'تتبع المؤشرات الصحية',
        'خدمات ومراسلة الطوارئ',
        'إدارة الوصفات الطبية',
        'معلومات التأمين والمطالبات'
      ]
    },
    {
      id: '2',
      name: 'Doctor Mobile Suite',
      nameAr: 'مجموعة الطبيب المحمولة',
      description: 'Professional mobile app for doctors with patient management, scheduling, and clinical tools',
      descriptionAr: 'تطبيق محمول احترافي للأطباء مع إدارة المرضى والجدولة والأدوات السريرية',
      icon: Heart,
      category: 'Healthcare Professionals',
      categoryAr: 'المهنيين الصحيين',
      status: 'available',
      platforms: ['ios', 'android'],
      screenshots: [],
      downloadStats: { ios: 8500, android: 12000, web: 0 },
      rating: 4.9,
      reviews: 456,
      version: '1.8.2',
      size: '38 MB',
      lastUpdated: '2024-01-20',
      features: [
        'Patient management and EMR access',
        'Appointment scheduling and management',
        'Clinical decision support tools',
        'Prescription writing and e-prescribing',
        'Lab results and imaging review',
        'Secure messaging with patients',
        'Medical reference and drug information',
        'Billing and insurance management'
      ],
      featuresAr: [
        'إدارة المرضى والوصول للسجلات الإلكترونية',
        'جدولة وإدارة المواعيد',
        'أدوات دعم القرار السريري',
        'كتابة الوصفات والوصف الإلكتروني',
        'مراجعة نتائج المختبر والتصوير',
        'المراسلة الآمنة مع المرضى',
        'المرجع الطبي ومعلومات الأدوية',
        'إدارة الفوترة والتأمين'
      ]
    },
    {
      id: '3',
      name: 'Emergency Response App',
      nameAr: 'تطبيق الاستجابة للطوارئ',
      description: 'Emergency services app with GPS location, medical alert, and first responder communication',
      descriptionAr: 'تطبيق خدمات الطوارئ مع موقع GPS والتنبيهات الطبية والتواصل مع المسعفين',
      icon: Zap,
      category: 'Emergency Services',
      categoryAr: 'خدمات الطوارئ',
      status: 'beta',
      platforms: ['ios', 'android'],
      screenshots: [],
      downloadStats: { ios: 2800, android: 3500, web: 0 },
      rating: 4.6,
      reviews: 125,
      version: '0.9.1-beta',
      size: '25 MB',
      lastUpdated: '2024-01-25',
      features: [
        'One-tap emergency activation',
        'GPS location sharing with responders',
        'Medical information and allergies alert',
        'Voice-activated emergency calls',
        'Real-time ambulance tracking',
        'Emergency contacts notification',
        'Offline emergency information',
        'Integration with local emergency services'
      ],
      featuresAr: [
        'تفعيل الطوارئ بنقرة واحدة',
        'مشاركة موقع GPS مع المستجيبين',
        'تنبيه المعلومات الطبية والحساسية',
        'مكالمات الطوارئ المفعلة بالصوت',
        'تتبع الإسعاف في الوقت الفعلي',
        'إشعار جهات الاتصال الطارئة',
        'معلومات الطوارئ غير المتصلة',
        'التكامل مع خدمات الطوارئ المحلية'
      ]
    },
    {
      id: '4',
      name: 'Health Monitoring Companion',
      nameAr: 'رفيق مراقبة الصحة',
      description: 'IoT device integration for continuous health monitoring and wearable device connectivity',
      descriptionAr: 'تكامل أجهزة إنترنت الأشياء للمراقبة الصحية المستمرة وربط الأجهزة القابلة للارتداء',
      icon: Activity,
      category: 'Health Monitoring',
      categoryAr: 'مراقبة الصحة',
      status: 'coming-soon',
      platforms: ['ios', 'android', 'web'],
      screenshots: [],
      downloadStats: { ios: 0, android: 0, web: 0 },
      rating: 0,
      reviews: 0,
      version: '1.0.0-rc',
      size: '32 MB',
      lastUpdated: '2024-02-01',
      features: [
        'Wearable device integration (Apple Watch, Fitbit, etc.)',
        'Continuous vital signs monitoring',
        'Blood glucose tracking for diabetics',
        'Heart rate and ECG monitoring',
        'Sleep pattern analysis',
        'Activity and fitness tracking',
        'Medication adherence monitoring',
        'AI-powered health insights'
      ],
      featuresAr: [
        'تكامل الأجهزة القابلة للارتداء (Apple Watch، Fitbit، إلخ)',
        'مراقبة العلامات الحيوية المستمرة',
        'تتبع الجلوكوز في الدم لمرضى السكري',
        'مراقبة معدل ضربات القلب وتخطيط القلب',
        'تحليل أنماط النوم',
        'تتبع النشاط واللياقة البدنية',
        'مراقبة الالتزام بالأدوية',
        'رؤى صحية مدعومة بالذكاء الاصطناعي'
      ]
    }
  ]);

  // Demo notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'appointment',
      title: 'Upcoming Appointment',
      titleAr: 'موعد قادم',
      message: 'Appointment with Dr. Ahmed Hassan tomorrow at 10:00 AM',
      messageAr: 'موعد مع د. أحمد حسن غداً الساعة 10:00 صباحاً',
      time: '2 hours ago',
      isRead: false,
      priority: 'high',
      actionable: true,
      actionText: 'Reschedule',
      actionTextAr: 'إعادة جدولة'
    },
    {
      id: '2',
      type: 'medication',
      title: 'Medication Reminder',
      titleAr: 'تذكير الدواء',
      message: 'Time to take your blood pressure medication',
      messageAr: 'حان وقت تناول دواء ضغط الدم',
      time: '30 minutes ago',
      isRead: false,
      priority: 'urgent',
      actionable: true,
      actionText: 'Mark as Taken',
      actionTextAr: 'تم التناول'
    },
    {
      id: '3',
      type: 'result',
      title: 'Lab Results Ready',
      titleAr: 'نتائج المختبر جاهزة',
      message: 'Your blood test results are now available',
      messageAr: 'نتائج فحص الدم متاحة الآن',
      time: '1 day ago',
      isRead: true,
      priority: 'medium',
      actionable: true,
      actionText: 'View Results',
      actionTextAr: 'عرض النتائج'
    }
  ]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'beta': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'coming-soon': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
      case 'low': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
    }
  };

  const MobilePreview = () => (
    <div className="relative mx-auto w-80 h-[640px] bg-black rounded-[2.5rem] shadow-2xl">
      {/* Phone Frame */}
      <div className="absolute inset-2 bg-background rounded-[2rem] overflow-hidden">
        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-primary/5 text-xs">
          <div className="flex items-center gap-1">
            <span className="font-medium">{formatTime(currentTime)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Signal className="h-3 w-3" />
            <Wifi className="h-3 w-3" />
            <Battery className="h-3 w-3" />
            <span className="text-xs">{batteryLevel}%</span>
          </div>
        </div>

        {/* App Content */}
        <div className="h-full pb-20">
          {currentView === 'home' && (
            <div className="p-4 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {language === 'ar' ? 'مرحباً، أحمد' : 'Hello, Ahmed'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'كيف حالك اليوم؟' : 'How are you feeling today?'}
                  </p>
                </div>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <Calendar className="h-5 w-5" />
                  <span className="text-xs">
                    {language === 'ar' ? 'المواعيد' : 'Appointments'}
                  </span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <FileText className="h-5 w-5" />
                  <span className="text-xs">
                    {language === 'ar' ? 'السجلات' : 'Records'}
                  </span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <Video className="h-5 w-5" />
                  <span className="text-xs">
                    {language === 'ar' ? 'استشارة مرئية' : 'Video Call'}
                  </span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <Pill className="h-5 w-5" />
                  <span className="text-xs">
                    {language === 'ar' ? 'الأدوية' : 'Medications'}
                  </span>
                </Button>
              </div>

              {/* Health Metrics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    {language === 'ar' ? 'المؤشرات الصحية اليوم' : 'Today\'s Health Metrics'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <Heart className="h-5 w-5 mx-auto mb-1 text-red-500" />
                      <p className="text-sm font-semibold">72</p>
                      <p className="text-xs text-muted-foreground">BPM</p>
                    </div>
                    <div className="text-center">
                      <Activity className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                      <p className="text-sm font-semibold">8,432</p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'ar' ? 'خطوة' : 'Steps'}
                      </p>
                    </div>
                    <div className="text-center">
                      <Clock className="h-5 w-5 mx-auto mb-1 text-green-500" />
                      <p className="text-sm font-semibold">7h 45m</p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'ar' ? 'نوم' : 'Sleep'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Notifications */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    {language === 'ar' ? 'الإشعارات الأخيرة' : 'Recent Notifications'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {notifications.slice(0, 2).map((notif) => (
                      <div key={notif.id} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                        <div className={`p-1 rounded-full ${getPriorityColor(notif.priority)}`}>
                          {notif.type === 'appointment' && <Calendar className="h-3 w-3" />}
                          {notif.type === 'medication' && <Pill className="h-3 w-3" />}
                          {notif.type === 'result' && <FileText className="h-3 w-3" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium">
                            {language === 'ar' ? notif.titleAr : notif.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {language === 'ar' ? notif.messageAr : notif.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-background border-t">
          <div className="flex items-center justify-around py-2">
            <Button 
              variant={currentView === 'home' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setCurrentView('home')}
              className="flex flex-col gap-1 h-12"
            >
              <Home className="h-4 w-4" />
              <span className="text-xs">
                {language === 'ar' ? 'الرئيسية' : 'Home'}
              </span>
            </Button>
            <Button 
              variant={currentView === 'appointments' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setCurrentView('appointments')}
              className="flex flex-col gap-1 h-12"
            >
              <Calendar className="h-4 w-4" />
              <span className="text-xs">
                {language === 'ar' ? 'المواعيد' : 'Appointments'}
              </span>
            </Button>
            <Button 
              variant={currentView === 'messages' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setCurrentView('messages')}
              className="flex flex-col gap-1 h-12"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">
                {language === 'ar' ? 'الرسائل' : 'Messages'}
              </span>
            </Button>
            <Button 
              variant={currentView === 'profile' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setCurrentView('profile')}
              className="flex flex-col gap-1 h-12"
            >
              <User className="h-4 w-4" />
              <span className="text-xs">
                {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full"></div>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-primary">
            {language === 'ar' ? 'تطبيقات الهاتف المحمول' : 'Mobile Applications'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'ar' 
              ? 'تطبيقات محمولة متطورة للمرضى والمهنيين الصحيين'
              : 'Advanced mobile applications for patients and healthcare professionals'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowMobilePreview(!showMobilePreview)}
            className="flex items-center gap-2"
          >
            <Smartphone className="h-4 w-4" />
            {language === 'ar' ? 'معاينة التطبيق' : 'App Preview'}
          </Button>
          <Button className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            {language === 'ar' ? 'رمز QR للتحميل' : 'Download QR'}
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* App Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'إجمالي التحميلات' : 'Total Downloads'}
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {mobileFeatures.reduce((total, app) => 
                        total + app.downloadStats.ios + app.downloadStats.android + app.downloadStats.web, 0
                      ).toLocaleString()}
                    </p>
                  </div>
                  <Download className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'متوسط التقييم' : 'Average Rating'}
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {(mobileFeatures.reduce((sum, app) => sum + app.rating, 0) / mobileFeatures.length).toFixed(1)}
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'التطبيقات النشطة' : 'Active Apps'}
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {mobileFeatures.filter(app => app.status === 'available').length}
                    </p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'قريباً' : 'Coming Soon'}
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {mobileFeatures.filter(app => app.status === 'coming-soon').length}
                    </p>
                  </div>
                  <PlayCircle className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Mobile Apps Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">
              {language === 'ar' ? 'التطبيقات المتاحة' : 'Available Applications'}
            </h3>
            
            <div className="grid gap-4">
              {mobileFeatures.map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                        onClick={() => setSelectedFeature(selectedFeature === app.id ? null : app.id)}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                          <app.icon className="h-8 w-8 text-primary" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-lg">
                                {language === 'ar' ? app.nameAr : app.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {language === 'ar' ? app.categoryAr : app.category}
                              </p>
                            </div>
                            <Badge className={getStatusColor(app.status)}>
                              {app.status === 'available' && (language === 'ar' ? 'متا��' : 'Available')}
                              {app.status === 'beta' && (language === 'ar' ? 'تجريبي' : 'Beta')}
                              {app.status === 'coming-soon' && (language === 'ar' ? 'قريباً' : 'Coming Soon')}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {language === 'ar' ? app.descriptionAr : app.description}
                          </p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                {language === 'ar' ? 'التقييم' : 'Rating'}
                              </p>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500" />
                                <span className="text-sm font-medium">{app.rating}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({app.reviews})
                                </span>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                {language === 'ar' ? 'الحجم' : 'Size'}
                              </p>
                              <p className="text-sm font-medium">{app.size}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                {language === 'ar' ? 'الإصدار' : 'Version'}
                              </p>
                              <p className="text-sm font-medium">{app.version}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                {language === 'ar' ? 'التحديث الأخير' : 'Last Updated'}
                              </p>
                              <p className="text-sm font-medium">{app.lastUpdated}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {app.platforms.includes('ios') && (
                                <Badge variant="outline" className="text-xs">iOS</Badge>
                              )}
                              {app.platforms.includes('android') && (
                                <Badge variant="outline" className="text-xs">Android</Badge>
                              )}
                              {app.platforms.includes('web') && (
                                <Badge variant="outline" className="text-xs">Web</Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {app.status === 'available' && (
                                <Button size="sm">
                                  <Download className="h-3 w-3 mr-1" />
                                  {language === 'ar' ? 'تحميل' : 'Download'}
                                </Button>
                              )}
                              {app.status === 'coming-soon' && (
                                <Button size="sm" variant="outline">
                                  <Bell className="h-3 w-3 mr-1" />
                                  {language === 'ar' ? 'تنبيه عند التوفر' : 'Notify Me'}
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Expanded Features */}
                          <AnimatePresence>
                            {selectedFeature === app.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t"
                              >
                                <h5 className="font-medium mb-2">
                                  {language === 'ar' ? 'المميزات الرئيسية:' : 'Key Features:'}
                                </h5>
                                <div className="grid gap-2">
                                  {(language === 'ar' ? app.featuresAr : app.features).map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                                      <span>{feature}</span>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Mobile Preview Sidebar */}
        <AnimatePresence>
          {showMobilePreview && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    {language === 'ar' ? 'معاينة التطبيق' : 'App Preview'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'ar' 
                      ? 'واجهة تفاعلية للتطبيق المحمول'
                      : 'Interactive mobile app interface'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <MobilePreview />
                </CardContent>
              </Card>

              {/* Download Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    {language === 'ar' ? 'روابط التحميل' : 'Download Links'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Smartphone className="h-4 w-4 mr-2" />
                    {language === 'ar' ? 'App Store' : 'Download from App Store'}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Smartphone className="h-4 w-4 mr-2" />
                    {language === 'ar' ? 'Google Play' : 'Get it on Google Play'}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Globe className="h-4 w-4 mr-2" />
                    {language === 'ar' ? 'تطبيق الويب' : 'Open Web App'}
                  </Button>
                </CardContent>
              </Card>

              {/* QR Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    {language === 'ar' ? 'رمز الاستجابة السريعة' : 'QR Code'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-32 h-32 mx-auto bg-muted rounded-lg flex items-center justify-center">
                    <QrCode className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <p className="text-center text-xs text-muted-foreground mt-2">
                    {language === 'ar' 
                      ? 'امسح للتحميل المباشر'
                      : 'Scan to download directly'
                    }
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MobileAppInterface;