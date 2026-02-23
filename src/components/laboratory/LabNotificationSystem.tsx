import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { 
  Bell, 
  Mail,
  MessageSquare,
  Phone,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Settings,
  Send,
  Eye,
  Download,
  Smartphone,
  Monitor,
  Calendar,
  Filter,
  Search,
  RefreshCw,
  X
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';
import { toast } from 'sonner@2.0.3';

interface LabResult {
  id: string;
  orderId: string;
  testId: string;
  testName: string;
  testCode: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    medicalNumber: string;
  };
  doctor: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  result: {
    value: string | number;
    unit: string;
    normalRange: string;
    flag: 'normal' | 'low' | 'high' | 'critical';
    comments?: string;
  };
  status: 'pending' | 'completed' | 'reviewed' | 'notified';
  completedAt: string;
  reportedBy: string;
  priority: 'routine' | 'urgent' | 'stat';
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push' | 'in_app';
  subject: string;
  message: string;
  enabled: boolean;
  recipients: ('patient' | 'doctor' | 'lab_staff')[];
  conditions: {
    priority?: ('routine' | 'urgent' | 'stat')[];
    resultFlag?: ('normal' | 'low' | 'high' | 'critical')[];
    testTypes?: string[];
  };
}

interface NotificationHistory {
  id: string;
  resultId: string;
  type: 'email' | 'sms' | 'push' | 'in_app';
  recipient: string;
  recipientType: 'patient' | 'doctor' | 'lab_staff';
  subject: string;
  message: string;
  sentAt: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  deliveryAttempts: number;
}

interface LabNotificationSystemProps {
  results?: LabResult[];
  onSendNotification?: (notification: any) => void;
  isDemoMode?: boolean;
}

const LabNotificationSystem: React.FC<LabNotificationSystemProps> = ({
  results = [],
  onSendNotification,
  isDemoMode = false
}) => {
  const { t, language, isRTL } = useLanguage();
  const { effectiveTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'pending' | 'templates' | 'history' | 'settings'>('pending');
  const [pendingResults, setPendingResults] = useState<LabResult[]>([]);
  const [notificationTemplates, setNotificationTemplates] = useState<NotificationTemplate[]>([]);
  const [notificationHistory, setNotificationHistory] = useState<NotificationHistory[]>([]);
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoNotificationEnabled, setAutoNotificationEnabled] = useState(true);
  const [notificationDelay, setNotificationDelay] = useState(0); // minutes

  // Demo data for notification templates
  const demoTemplates: NotificationTemplate[] = [
    {
      id: 'template-1',
      name: 'Normal Result - Patient',
      type: 'email',
      subject: 'Lab Results Available - {{testName}}',
      message: `Dear {{patientName}},

Your lab results for {{testName}} are now available.

Test Result: {{resultValue}} {{resultUnit}}
Status: Normal
Reference Range: {{normalRange}}

Please contact your doctor for interpretation of these results.

Best regards,
MediCore Hospital Laboratory`,
      enabled: true,
      recipients: ['patient'],
      conditions: {
        resultFlag: ['normal']
      }
    },
    {
      id: 'template-2',
      name: 'Abnormal Result - Doctor Alert',
      type: 'email',
      subject: 'URGENT: Abnormal Lab Result - {{patientName}}',
      message: `Dr. {{doctorName}},

An abnormal lab result requires your attention:

Patient: {{patientName}} ({{medicalNumber}})
Test: {{testName}} ({{testCode}})
Result: {{resultValue}} {{resultUnit}} ({{resultFlag}})
Normal Range: {{normalRange}}
Priority: {{priority}}

{{comments}}

Please review and contact the patient as necessary.

Laboratory Team`,
      enabled: true,
      recipients: ['doctor'],
      conditions: {
        resultFlag: ['low', 'high', 'critical']
      }
    },
    {
      id: 'template-3',
      name: 'Critical Result - Immediate Alert',
      type: 'sms',
      subject: 'CRITICAL LAB RESULT',
      message: 'CRITICAL: {{testName}} result for {{patientName}} is {{resultValue}} {{resultUnit}}. Contact patient immediately. Order ID: {{orderId}}',
      enabled: true,
      recipients: ['doctor', 'lab_staff'],
      conditions: {
        resultFlag: ['critical']
      }
    }
  ];

  // Demo pending results
  const demoPendingResults: LabResult[] = [
    {
      id: 'result-1',
      orderId: 'LAB-001',
      testId: 'test-1',
      testName: 'Complete Blood Count',
      testCode: 'CBC',
      patient: {
        id: 'patient-1',
        firstName: 'أحمد',
        lastName: 'محمد',
        email: 'ahmed@example.com',
        phone: '+966501234567',
        medicalNumber: 'MED-001'
      },
      doctor: {
        id: 'doctor-1',
        name: 'د. سارة أحمد',
        email: 'dr.sara@example.com',
        phone: '+966501234568'
      },
      result: {
        value: 'Normal',
        unit: '',
        normalRange: 'See individual components',
        flag: 'normal',
        comments: 'All values within normal limits'
      },
      status: 'completed',
      completedAt: new Date().toISOString(),
      reportedBy: 'Lab Tech Ahmad',
      priority: 'routine'
    },
    {
      id: 'result-2',
      orderId: 'LAB-002',
      testId: 'test-2',
      testName: 'Thyroid Stimulating Hormone',
      testCode: 'TSH',
      patient: {
        id: 'patient-2',
        firstName: 'فاطمة',
        lastName: 'علي',
        email: 'fatima@example.com',
        phone: '+966501234569',
        medicalNumber: 'MED-002'
      },
      doctor: {
        id: 'doctor-2',
        name: 'د. محمد حسن',
        email: 'dr.mohamed@example.com',
        phone: '+966501234570'
      },
      result: {
        value: 12.5,
        unit: 'mIU/L',
        normalRange: '0.4-4.0 mIU/L',
        flag: 'high',
        comments: 'Elevated TSH suggests hypothyroidism'
      },
      status: 'completed',
      completedAt: new Date().toISOString(),
      reportedBy: 'Lab Tech Sara',
      priority: 'urgent'
    }
  ];

  useEffect(() => {
    if (isDemoMode) {
      setPendingResults(demoPendingResults);
      setNotificationTemplates(demoTemplates);
    } else {
      setPendingResults(results.filter(r => r.status === 'completed'));
    }
  }, [results, isDemoMode]);

  // Auto-notification effect
  useEffect(() => {
    if (autoNotificationEnabled && pendingResults.length > 0) {
      const timer = setTimeout(() => {
        processAutoNotifications();
      }, notificationDelay * 60 * 1000);

      return () => clearTimeout(timer);
    }
  }, [pendingResults, autoNotificationEnabled, notificationDelay]);

  // Process automatic notifications
  const processAutoNotifications = useCallback(async () => {
    const unnotifiedResults = pendingResults.filter(result => result.status === 'completed');
    
    for (const result of unnotifiedResults) {
      await sendNotificationsForResult(result);
      // Update result status to 'notified'
      setPendingResults(prev => prev.map(r => 
        r.id === result.id ? { ...r, status: 'notified' } : r
      ));
    }
  }, [pendingResults]);

  // Send notifications for a specific result
  const sendNotificationsForResult = async (result: LabResult) => {
    const applicableTemplates = notificationTemplates.filter(template => {
      if (!template.enabled) return false;
      
      const { conditions } = template;
      
      // Check result flag condition
      if (conditions.resultFlag && !conditions.resultFlag.includes(result.result.flag)) {
        return false;
      }
      
      // Check priority condition
      if (conditions.priority && !conditions.priority.includes(result.priority)) {
        return false;
      }
      
      return true;
    });

    for (const template of applicableTemplates) {
      for (const recipientType of template.recipients) {
        await sendNotification(result, template, recipientType);
      }
    }
  };

  // Send individual notification
  const sendNotification = async (
    result: LabResult, 
    template: NotificationTemplate, 
    recipientType: 'patient' | 'doctor' | 'lab_staff'
  ) => {
    const recipient = recipientType === 'patient' ? result.patient : 
                     recipientType === 'doctor' ? result.doctor : 
                     { name: 'Lab Staff', email: 'lab@medicore.com' };

    // Replace template variables
    const subject = template.subject
      .replace('{{testName}}', result.testName)
      .replace('{{patientName}}', `${result.patient.firstName} ${result.patient.lastName}`)
      .replace('{{doctorName}}', result.doctor.name);

    const message = template.message
      .replace('{{testName}}', result.testName)
      .replace('{{testCode}}', result.testCode)
      .replace('{{patientName}}', `${result.patient.firstName} ${result.patient.lastName}`)
      .replace('{{medicalNumber}}', result.patient.medicalNumber)
      .replace('{{doctorName}}', result.doctor.name)
      .replace('{{resultValue}}', String(result.result.value))
      .replace('{{resultUnit}}', result.result.unit)
      .replace('{{resultFlag}}', result.result.flag.toUpperCase())
      .replace('{{normalRange}}', result.result.normalRange)
      .replace('{{priority}}', result.priority.toUpperCase())
      .replace('{{orderId}}', result.orderId)
      .replace('{{comments}}', result.result.comments || '');

    const notification = {
      id: `notification-${Date.now()}-${Math.random()}`,
      resultId: result.id,
      type: template.type,
      recipient: recipientType === 'patient' ? result.patient.email : 
                 recipientType === 'doctor' ? result.doctor.email : 'lab@medicore.com',
      recipientType,
      subject,
      message,
      sentAt: new Date().toISOString(),
      status: 'sent' as const,
      deliveryAttempts: 1
    };

    // Add to history
    setNotificationHistory(prev => [notification, ...prev]);

    // Call external handler if provided
    if (onSendNotification) {
      onSendNotification(notification);
    }

    // Show toast notification
    toast.success(
      `${template.type.toUpperCase()} notification sent to ${recipientType}`,
      {
        description: `${result.testName} result for ${result.patient.firstName} ${result.patient.lastName}`
      }
    );

    console.log('Notification sent:', notification);
  };

  // Send notifications for selected results
  const handleSendSelectedNotifications = async () => {
    setIsProcessing(true);
    try {
      const selectedResultsData = pendingResults.filter(r => selectedResults.includes(r.id));
      
      for (const result of selectedResultsData) {
        await sendNotificationsForResult(result);
      }
      
      setSelectedResults([]);
      toast.success(t('lab.notificationsSent'), {
        description: `${selectedResultsData.length} ${t('lab.notifications')} ${t('lab.sent')}`
      });
    } catch (error) {
      toast.error(t('lab.notificationError'));
      console.error('Notification error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter results
  const filteredResults = pendingResults.filter(result => {
    const matchesSearch = searchTerm === '' ||
      result.patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || result.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || result.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Get result flag icon and color
  const getResultFlagDisplay = (flag: string) => {
    switch (flag) {
      case 'normal':
        return { icon: <CheckCircle className="h-4 w-4" />, color: 'text-green-600', bg: 'bg-green-50' };
      case 'low':
      case 'high':
        return { icon: <AlertCircle className="h-4 w-4" />, color: 'text-orange-600', bg: 'bg-orange-50' };
      case 'critical':
        return { icon: <AlertCircle className="h-4 w-4" />, color: 'text-red-600', bg: 'bg-red-50' };
      default:
        return { icon: <Clock className="h-4 w-4" />, color: 'text-gray-600', bg: 'bg-gray-50' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{t('lab.notificationSystem')}</h2>
          <p className="text-muted-foreground">
            {t('lab.notificationSystemDescription')}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Switch
              checked={autoNotificationEnabled}
              onCheckedChange={setAutoNotificationEnabled}
            />
            <Label className="text-sm">{t('lab.autoNotifications')}</Label>
          </div>
          
          <Button
            onClick={() => processAutoNotifications()}
            disabled={isProcessing}
            className="flex items-center gap-2"
          >
            {isProcessing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {t('lab.sendPendingNotifications')}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'pending', name: t('lab.pendingNotifications'), icon: <Bell className="h-4 w-4" /> },
            { id: 'templates', name: t('lab.notificationTemplates'), icon: <Mail className="h-4 w-4" /> },
            { id: 'history', name: t('lab.notificationHistory'), icon: <Clock className="h-4 w-4" /> },
            { id: 'settings', name: t('common.settings'), icon: <Settings className="h-4 w-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.icon}
              {tab.name}
              {tab.id === 'pending' && filteredResults.filter(r => r.status === 'completed').length > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {filteredResults.filter(r => r.status === 'completed').length}
                </Badge>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Pending Notifications Tab */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {/* Filters and Actions */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('lab.searchResults')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder={t('common.status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allStatuses')}</SelectItem>
                    <SelectItem value="completed">{t('lab.completed')}</SelectItem>
                    <SelectItem value="notified">{t('lab.notified')}</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder={t('lab.priority')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allPriorities')}</SelectItem>
                    <SelectItem value="routine">{t('lab.routine')}</SelectItem>
                    <SelectItem value="urgent">{t('lab.urgent')}</SelectItem>
                    <SelectItem value="stat">{t('lab.stat')}</SelectItem>
                  </SelectContent>
                </Select>
                
                {selectedResults.length > 0 && (
                  <Button
                    onClick={handleSendSelectedNotifications}
                    disabled={isProcessing}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {t('lab.sendSelected')} ({selectedResults.length})
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results List */}
          <div className="grid gap-4">
            {filteredResults.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">{t('lab.noPendingNotifications')}</h3>
                  <p className="text-muted-foreground">{t('lab.noPendingNotificationsDescription')}</p>
                </CardContent>
              </Card>
            ) : (
              filteredResults.map((result) => {
                const flagDisplay = getResultFlagDisplay(result.result.flag);
                return (
                  <Card key={result.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedResults.includes(result.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedResults(prev => [...prev, result.id]);
                              } else {
                                setSelectedResults(prev => prev.filter(id => id !== result.id));
                              }
                            }}
                            className="rounded"
                          />
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">
                              {result.testName} ({result.testCode})
                            </h3>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`${flagDisplay.color} ${flagDisplay.bg}`}
                              >
                                {flagDisplay.icon}
                                {t(`lab.${result.result.flag}`)}
                              </Badge>
                              <Badge
                                variant={result.priority === 'stat' ? 'destructive' : 
                                        result.priority === 'urgent' ? 'default' : 'secondary'}
                              >
                                {t(`lab.${result.priority}`)}
                              </Badge>
                              <Badge
                                variant={result.status === 'notified' ? 'default' : 'outline'}
                              >
                                {t(`lab.${result.status}`)}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p><strong>{t('patients.patient')}:</strong> {result.patient.firstName} {result.patient.lastName}</p>
                              <p><strong>{t('patients.medicalNumber')}:</strong> {result.patient.medicalNumber}</p>
                              <p><strong>{t('lab.orderId')}:</strong> {result.orderId}</p>
                            </div>
                            <div>
                              <p><strong>{t('appointments.doctor')}:</strong> {result.doctor.name}</p>
                              <p><strong>{t('lab.result')}:</strong> {result.result.value} {result.result.unit}</p>
                              <p><strong>{t('lab.completedAt')}:</strong> {new Date(result.completedAt).toLocaleString()}</p>
                            </div>
                          </div>
                          
                          {result.result.comments && (
                            <div className="bg-muted p-2 rounded text-sm">
                              <strong>{t('lab.comments')}:</strong> {result.result.comments}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendNotificationsForResult(result)}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="grid gap-4">
            {notificationTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={template.enabled ? 'default' : 'secondary'}>
                        {template.enabled ? t('common.enabled') : t('common.disabled')}
                      </Badge>
                      <Badge variant="outline">
                        {template.type.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs font-medium">{t('billing.subject')}</Label>
                      <p className="text-sm bg-muted p-2 rounded">{template.subject}</p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium">{t('common.message')}</Label>
                      <p className="text-sm bg-muted p-2 rounded whitespace-pre-wrap">{template.message.substring(0, 200)}...</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-medium">{t('lab.recipients')}:</Label>
                      {template.recipients.map(recipient => (
                        <Badge key={recipient} variant="outline" className="text-xs">
                          {t(`lab.${recipient}`)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="grid gap-4">
            {notificationHistory.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">{t('lab.noNotificationHistory')}</h3>
                  <p className="text-muted-foreground">{t('lab.noNotificationHistoryDescription')}</p>
                </CardContent>
              </Card>
            ) : (
              notificationHistory.map((notification) => (
                <Card key={notification.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{notification.subject}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {notification.type.toUpperCase()}
                        </Badge>
                        <Badge
                          variant={notification.status === 'delivered' ? 'default' : 
                                  notification.status === 'sent' ? 'secondary' : 'destructive'}
                        >
                          {t(`lab.${notification.status}`)}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>{t('lab.recipient')}:</strong> {notification.recipient}</p>
                        <p><strong>{t('lab.recipientType')}:</strong> {t(`lab.${notification.recipientType}`)}</p>
                      </div>
                      <div>
                        <p><strong>{t('lab.sentAt')}:</strong> {new Date(notification.sentAt).toLocaleString()}</p>
                        <p><strong>{t('lab.deliveryAttempts')}:</strong> {notification.deliveryAttempts}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('lab.autoNotificationSettings')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('lab.enableAutoNotifications')}</Label>
                  <p className="text-sm text-muted-foreground">{t('lab.autoNotificationDescription')}</p>
                </div>
                <Switch
                  checked={autoNotificationEnabled}
                  onCheckedChange={setAutoNotificationEnabled}
                />
              </div>
              
              <div>
                <Label>{t('lab.notificationDelay')} ({t('common.minutes')})</Label>
                <Input
                  type="number"
                  min="0"
                  value={notificationDelay}
                  onChange={(e) => setNotificationDelay(parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {t('lab.notificationDelayDescription')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LabNotificationSystem;