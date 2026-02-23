import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  Settings, User, Palette, Bell, Globe, Shield, Monitor, Keyboard,
  Zap, Target, Sparkles, Sliders, Lock, Eye, Activity, Database,
  Cpu, Wifi, Smartphone, Layers, Command, Code, FileText
} from 'lucide-react';
import ThemeLanguageToggle from './ThemeLanguageToggle';
import { NotificationSettings } from './NotificationSettings';
import { MenuCustomizer } from './MenuCustomizer';
import { MenuTranslationRepair } from './MenuTranslationRepair';
import QuickActionsManager from './QuickActionsManager';
import SystemCustomization from './SystemCustomization';
import { QuickActionsProvider } from '../../services/QuickActionsService';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  specialization?: string;
  department?: string;
}

interface SettingsPageProps {
  user: User;
  language: 'en' | 'ar';
  onLanguageChange: (lang: 'en' | 'ar') => void;
}

const translations = {
  en: {
    title: 'Settings & Customization',
    subtitle: 'Personalize your workspace and configure system preferences',
    general: 'General',
    appearance: 'Appearance',
    quickActions: 'Quick Actions',
    customization: 'Customization',
    notifications: 'Notifications',
    privacy: 'Privacy',
    advanced: 'Advanced',
    profile: 'Profile',
    personalInfo: 'Personal Information',
    themeSettings: 'Theme & Language',
    menuCustomization: 'Menu Customization',
    quickActionsManager: 'Quick Actions Manager',
    systemCustomization: 'System Customization',
    notificationSettings: 'Notification Preferences',
    privacySettings: 'Privacy & Security',
    advancedSettings: 'Advanced Settings',
    accountSecurity: 'Account Security',
    dataManagement: 'Data Management',
    systemInfo: 'System Information',
    troubleshooting: 'Troubleshooting',
    about: 'About',
    version: 'Version',
    lastLogin: 'Last Login',
    accountCreated: 'Account Created',
    storageUsed: 'Storage Used',
    sessionInfo: 'Session Information',
    exportData: 'Export Data',
    importSettings: 'Import Settings',
    resetSettings: 'Reset Settings',
    clearCache: 'Clear Cache',
    diagnostics: 'Run Diagnostics'
  },
  ar: {
    title: 'الإعدادات والتخصيص',
    subtitle: 'خصص مساحة عملك وقم بتكوين تفضيلات النظام',
    general: 'عام',
    appearance: 'المظهر',
    quickActions: 'الإجراءات السريعة',
    customization: 'التخصيص',
    notifications: 'الإشعارات',
    privacy: 'الخصوصية',
    advanced: 'متقدم',
    profile: 'الملف الشخصي',
    personalInfo: 'المعلومات الشخصية',
    themeSettings: 'إعدادات السمة واللغة',
    menuCustomization: 'تخصيص القائمة',
    quickActionsManager: 'إدارة الإجراءات السريعة',
    systemCustomization: 'تخصيص النظام',
    notificationSettings: 'تفضيلات الإشعارات',
    privacySettings: 'الخصوصية والأمان',
    advancedSettings: 'الإعدادات المتقدمة',
    accountSecurity: 'أمان الحساب',
    dataManagement: 'إدارة البيانات',
    systemInfo: 'معلومات النظام',
    troubleshooting: 'استكشاف الأخطاء',
    about: 'حول',
    version: 'الإصدار',
    lastLogin: 'آخر تسجيل دخول',
    accountCreated: 'تاريخ إنشاء الحساب',
    storageUsed: 'المساحة المستخدمة',
    sessionInfo: 'معلومات الجلسة',
    exportData: 'تصدير البيانات',
    importSettings: 'استيراد الإعدادات',
    resetSettings: 'إعادة تعيين الإعدادات',
    clearCache: 'مسح التخزين المؤقت',
    diagnostics: 'تشغيل التشخيص'
  }
};

export const SettingsPage: React.FC<SettingsPageProps> = ({ 
  user, 
  language, 
  onLanguageChange 
}) => {
  const [activeTab, setActiveTab] = useState('general');
  const t = translations[language];
  const isRTL = language === 'ar';

  // Mock system info
  const systemInfo = {
    version: '2.1.0',
    buildDate: '2024-01-20',
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    accountCreated: '2023-08-15',
    storageUsed: '2.4 GB',
    sessionDuration: '2h 15m',
    browserInfo: navigator.userAgent.split('(')[0].trim(),
    ipAddress: '192.168.1.1'
  };

  const renderProfileSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {t.personalInfo}
          </CardTitle>
          <CardDescription>
            View and manage your profile information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Profile Summary */}
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{user.role}</Badge>
                  {user.department && <Badge variant="outline">{user.department}</Badge>}
                  {user.specialization && <Badge variant="outline">{user.specialization}</Badge>}
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-lg font-medium">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                  <p className="text-lg">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">User Role</label>
                  <p className="text-lg capitalize">{user.role.replace('_', ' ')}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {user.department && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Department</label>
                    <p className="text-lg">{user.department}</p>
                  </div>
                )}
                {user.specialization && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Specialization</label>
                    <p className="text-lg">{user.specialization}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">User ID</label>
                  <p className="text-lg font-mono">{user.id}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {t.accountSecurity}
          </CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Password</p>
                <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
              </div>
              <Button variant="outline" size="sm">Change Password</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm">Enable 2FA</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Active Sessions</p>
                <p className="text-sm text-muted-foreground">Manage your active sessions</p>
              </div>
              <Button variant="outline" size="sm">View Sessions</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderPrivacySettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            {t.privacySettings}
          </CardTitle>
          <CardDescription>
            Configure your privacy and data handling preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Data Collection</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Analytics Data</p>
                    <p className="text-sm text-muted-foreground">Help improve the application</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Usage Statistics</p>
                    <p className="text-sm text-muted-foreground">Track feature usage patterns</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Error Reporting</p>
                    <p className="text-sm text-muted-foreground">Send crash reports automatically</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Data Export & Deletion</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start">
                  <Database className="w-4 h-4 mr-2" />
                  {t.exportData}
                </Button>
                <Button variant="outline" className="justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Download My Data
                </Button>
                <Button variant="outline" className="justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Privacy Report
                </Button>
                <Button variant="destructive" className="justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderAdvancedSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            {t.systemInfo}
          </CardTitle>
          <CardDescription>
            View detailed system and session information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Application Version</label>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-mono">{systemInfo.version}</p>
                  <Badge variant="secondary">Latest</Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Build Date</label>
                <p className="text-lg">{systemInfo.buildDate}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Login</label>
                <p className="text-lg">{new Date(systemInfo.lastLogin).toLocaleString()}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Account Created</label>
                <p className="text-lg">{systemInfo.accountCreated}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Storage Used</label>
                <p className="text-lg">{systemInfo.storageUsed}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Session Duration</label>
                <p className="text-lg">{systemInfo.sessionDuration}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Browser</label>
                <p className="text-sm">{systemInfo.browserInfo}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">IP Address</label>
                <p className="text-lg font-mono">{systemInfo.ipAddress}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            System Tools
          </CardTitle>
          <CardDescription>
            Manage system performance and troubleshooting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4" />
                  <span className="font-medium">{t.clearCache}</span>
                </div>
                <p className="text-xs text-muted-foreground">Clear temporary data</p>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Cpu className="w-4 h-4" />
                  <span className="font-medium">{t.diagnostics}</span>
                </div>
                <p className="text-xs text-muted-foreground">Check system health</p>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Wifi className="w-4 h-4" />
                  <span className="font-medium">Connection Test</span>
                </div>
                <p className="text-xs text-muted-foreground">Test network connectivity</p>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Database className="w-4 h-4" />
                  <span className="font-medium">Sync Data</span>
                </div>
                <p className="text-xs text-muted-foreground">Force data synchronization</p>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Code className="w-4 h-4" />
                  <span className="font-medium">Debug Mode</span>
                </div>
                <p className="text-xs text-muted-foreground">Enable developer tools</p>
              </div>
            </Button>
            
            <Button variant="destructive" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Settings className="w-4 h-4" />
                  <span className="font-medium">{t.resetSettings}</span>
                </div>
                <p className="text-xs text-muted-foreground">Reset to defaults</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <QuickActionsProvider userId={user.id} userRole={user.role}>
      <div className={`container mx-auto p-6 space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{t.title}</h1>
              <p className="text-muted-foreground">{t.subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Pro Features
            </Badge>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{t.general}</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">{t.appearance}</span>
            </TabsTrigger>
            <TabsTrigger value="quickActions" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">{t.quickActions}</span>
            </TabsTrigger>
            <TabsTrigger value="customization" className="flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              <span className="hidden sm:inline">{t.customization}</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">{t.notifications}</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">{t.privacy}</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="general" className="space-y-6">
              {renderProfileSettings()}
              <ThemeLanguageToggle 
                language={language} 
                onLanguageChange={onLanguageChange} 
              />
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <MenuCustomizer language={language} userRole={user.role} />
              <MenuTranslationRepair language={language} />
            </TabsContent>

            <TabsContent value="quickActions" className="space-y-6">
              <QuickActionsManager userRole={user.role} />
            </TabsContent>

            <TabsContent value="customization" className="space-y-6">
              <SystemCustomization userId={user.id} userRole={user.role} />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <NotificationSettings 
                language={language}
                preferences={{
                  soundEnabled: true,
                  browserNotifications: true,
                  emailNotifications: true,
                  compactMode: false,
                  showQuickActions: true,
                  showBreadcrumbs: true,
                  autoSave: true,
                  theme: 'system'
                }}
                onPreferencesChange={() => {}}
                isConnected={true}
                onRequestPermission={() => {}}
              />
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              {renderPrivacySettings()}
              {user.role === 'admin' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="w-5 h-5" />
                      {t.advancedSettings}
                    </CardTitle>
                    <CardDescription>
                      Advanced system administration settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderAdvancedSettings()}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </QuickActionsProvider>
  );
};