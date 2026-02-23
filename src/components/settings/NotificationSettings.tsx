import React from 'react';
import { Bell, Volume2, VolumeX, Smartphone, Mail, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface NotificationSettingsProps {
  language: 'en' | 'ar';
  preferences: {
    soundEnabled: boolean;
    browserNotifications: boolean;
    emailNotifications: boolean;
    compactMode: boolean;
    showQuickActions: boolean;
    showBreadcrumbs: boolean;
    autoSave: boolean;
    theme: string;
  };
  onPreferencesChange: (preferences: any) => void;
  isConnected: boolean;
  onRequestPermission: () => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  language,
  preferences,
  onPreferencesChange,
  isConnected,
  onRequestPermission
}) => {
  const [soundVolume, setSoundVolume] = React.useState([30]);
  const [notificationTypes, setNotificationTypes] = React.useState({
    appointments: true,
    labResults: true,
    prescriptions: true,
    emergencies: true,
    system: false,
    patientUpdates: true
  });

  const notificationTypesList = [
    {
      key: 'appointments',
      label: language === 'ar' ? 'المواعيد' : 'Appointments',
      description: language === 'ar' ? 'إشعارات المواعيد الجديدة والتغييرات' : 'New appointments and changes',
      icon: Bell,
      priority: 'medium'
    },
    {
      key: 'labResults',
      label: language === 'ar' ? 'نتائج المختبر' : 'Lab Results',
      description: language === 'ar' ? 'نتائج التحاليل الجاهزة' : 'Ready lab test results',
      icon: CheckCircle,
      priority: 'high'
    },
    {
      key: 'prescriptions',
      label: language === 'ar' ? 'الوصفات' : 'Prescriptions',
      description: language === 'ar' ? 'الوصفات الجاهزة للصرف' : 'Prescriptions ready for dispensing',
      icon: Info,
      priority: 'medium'
    },
    {
      key: 'emergencies',
      label: language === 'ar' ? 'الطوارئ' : 'Emergencies',
      description: language === 'ar' ? 'حالات الطوارئ العاجلة' : 'Urgent emergency cases',
      icon: AlertTriangle,
      priority: 'urgent'
    },
    {
      key: 'system',
      label: language === 'ar' ? 'النظام' : 'System',
      description: language === 'ar' ? 'تحديثات وصيانة النظام' : 'System updates and maintenance',
      icon: Info,
      priority: 'low'
    },
    {
      key: 'patientUpdates',
      label: language === 'ar' ? 'تحديثات المرضى' : 'Patient Updates',
      description: language === 'ar' ? 'تحديثات بيانات المرضى' : 'Patient data updates',
      icon: Info,
      priority: 'medium'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleNotificationTypeChange = (key: string, enabled: boolean) => {
    setNotificationTypes(prev => ({
      ...prev,
      [key]: enabled
    }));
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{language === 'ar' ? 'حالة الاتصال' : 'Connection Status'}</span>
            <Badge variant={isConnected ? 'default' : 'secondary'}>
              {isConnected 
                ? (language === 'ar' ? 'متصل' : 'Connected')
                : (language === 'ar' ? 'غير متصل' : 'Disconnected')
              }
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-muted-foreground">
              {isConnected
                ? (language === 'ar' ? 'متصل بخادم الإشعارات' : 'Connected to notification server')
                : (language === 'ar' ? 'غير متصل بخادم الإشعارات' : 'Disconnected from notification server')
              }
            </span>
          </div>
        </CardContent>
      </Card>

      {/* General Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'ar' ? 'إعدادات الإشعارات العامة' : 'General Notification Settings'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label>{language === 'ar' ? 'إشعارات المتصفح' : 'Browser Notifications'}</Label>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' 
                    ? 'عرض إشعارات في نظام التشغيل'
                    : 'Show notifications in your operating system'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={preferences.browserNotifications}
                onCheckedChange={(checked) =>
                  onPreferencesChange({ ...preferences, browserNotifications: checked })
                }
              />
              {Notification.permission !== 'granted' && (
                <Button size="sm" variant="outline" onClick={onRequestPermission}>
                  {language === 'ar' ? 'السماح' : 'Allow'}
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label>{language === 'ar' ? 'إشعارات البريد الإلكتروني' : 'Email Notifications'}</Label>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' 
                    ? 'إرسال إشعارات عبر البريد الإلكتروني'
                    : 'Send notifications via email'
                  }
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.emailNotifications}
              onCheckedChange={(checked) =>
                onPreferencesChange({ ...preferences, emailNotifications: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {preferences.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-muted-foreground" />
              ) : (
                <VolumeX className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <Label>{language === 'ar' ? 'الأصوات' : 'Sound Notifications'}</Label>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' 
                    ? 'تشغيل أصوات عند وصول الإشعارات'
                    : 'Play sounds when notifications arrive'
                  }
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.soundEnabled}
              onCheckedChange={(checked) =>
                onPreferencesChange({ ...preferences, soundEnabled: checked })
              }
            />
          </div>

          {preferences.soundEnabled && (
            <div className="ml-8 space-y-3">
              <div>
                <Label className="mb-2 block">
                  {language === 'ar' ? 'مستوى الصوت' : 'Sound Volume'}
                </Label>
                <Slider
                  value={soundVolume}
                  onValueChange={setSoundVolume}
                  max={100}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0%</span>
                  <span>{soundVolume[0]}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'ar' ? 'أنواع الإشعارات' : 'Notification Types'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationTypesList.map((notificationType, index) => {
            const IconComponent = notificationType.icon;
            return (
              <div key={notificationType.key}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Label>{notificationType.label}</Label>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(notificationType.priority)}`}
                        >
                          {language === 'ar' 
                            ? (notificationType.priority === 'urgent' ? 'عاجل' :
                               notificationType.priority === 'high' ? 'عالي' :
                               notificationType.priority === 'medium' ? 'متوسط' : 'منخفض')
                            : notificationType.priority
                          }
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notificationType.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationTypes[notificationType.key as keyof typeof notificationTypes]}
                    onCheckedChange={(checked) =>
                      handleNotificationTypeChange(notificationType.key, checked)
                    }
                  />
                </div>
                {index < notificationTypesList.length - 1 && <Separator className="mt-4" />}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'ar' ? 'إعدادات متقدمة' : 'Advanced Settings'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="mb-2 block">
              {language === 'ar' ? 'وقت عدم الإزعاج' : 'Do Not Disturb Hours'}
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'من' : 'From'}
                </Label>
                <Select defaultValue="22:00">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                        {`${i.toString().padStart(2, '0')}:00`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'إلى' : 'To'}
                </Label>
                <Select defaultValue="08:00">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                        {`${i.toString().padStart(2, '0')}:00`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <Label className="mb-2 block">
              {language === 'ar' ? 'تأخير الإشعارات العاجلة' : 'Urgent Notification Delay'}
            </Label>
            <Select defaultValue="immediate">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">
                  {language === 'ar' ? 'فوري' : 'Immediate'}
                </SelectItem>
                <SelectItem value="1min">
                  {language === 'ar' ? 'دقيقة واحدة' : '1 minute'}
                </SelectItem>
                <SelectItem value="5min">
                  {language === 'ar' ? '5 دقائق' : '5 minutes'}
                </SelectItem>
                <SelectItem value="15min">
                  {language === 'ar' ? '15 دقيقة' : '15 minutes'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};