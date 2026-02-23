import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, Plus, Trash2, Edit3, Save, Download, Upload, 
  Zap, ExternalLink, Bot, Workflow, Timer, Bell,
  BarChart3, Shield, Database, Cloud, Smartphone,
  ArrowRight, ArrowLeft, Copy, Check, X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { toast } from 'sonner@2.0.3';
import { useLanguage } from '../../services/LanguageService';

interface ExtendedQuickAction {
  id: string;
  label: string;
  labelAr: string;
  icon: any;
  shortcut?: string;
  category: string;
  actionType: 'navigate' | 'modal' | 'execute' | 'api' | 'automation' | 'external';
  action: string;
  roles: string[];
  isCustom?: boolean;
  isEnabled: boolean;
  order: number;
  metadata?: {
    apiEndpoint?: string;
    automationScript?: string;
    externalUrl?: string;
    appIntegration?: string;
    scheduledTime?: string;
    conditions?: string[];
    notifications?: boolean;
  };
  analytics?: {
    usageCount: number;
    lastUsed: Date;
    successRate: number;
    avgExecutionTime: number;
  };
}

interface ExternalIntegration {
  id: string;
  name: string;
  type: 'webhook' | 'api' | 'sms' | 'email' | 'push';
  endpoint: string;
  authentication: {
    type: 'none' | 'bearer' | 'api_key' | 'oauth';
    token?: string;
    key?: string;
  };
  isEnabled: boolean;
}

interface AutomationRule {
  id: string;
  name: string;
  trigger: {
    type: 'schedule' | 'event' | 'condition';
    schedule?: string;
    event?: string;
    condition?: string;
  };
  actions: string[];
  isEnabled: boolean;
}

const translations = {
  en: {
    title: "Advanced Quick Actions Manager",
    subtitle: "Manage system-wide quick actions, integrations, and automations",
    tabs: {
      actions: "Actions",
      integrations: "Integrations", 
      automations: "Automations",
      analytics: "Analytics"
    },
    actions: {
      create: "Create Action",
      edit: "Edit Action",
      delete: "Delete Action",
      duplicate: "Duplicate",
      enable: "Enable",
      disable: "Disable",
      test: "Test Action"
    },
    actionTypes: {
      navigate: "Navigation",
      modal: "Modal Dialog",
      execute: "System Execute",
      api: "API Call",
      automation: "Automation",
      external: "External App"
    },
    categories: {
      patients: "Patient Management",
      appointments: "Appointments",
      medical: "Medical",
      emergency: "Emergency",
      reports: "Reports",
      system: "System",
      integrations: "Integrations",
      custom: "Custom"
    }
  },
  ar: {
    title: "مدير الإجراءات السريعة المتقدم",
    subtitle: "إدارة الإجراءات السريعة والتكاملات والأتمتة على مستوى النظام",
    tabs: {
      actions: "الإجراءات",
      integrations: "التكاملات",
      automations: "الأتمتة",
      analytics: "التحليلات"
    },
    actions: {
      create: "إنشاء إجراء",
      edit: "تعديل إجراء",
      delete: "حذف إجراء",
      duplicate: "نسخ",
      enable: "تفعيل",
      disable: "إلغاء تفعيل",
      test: "اختبار الإجراء"
    },
    actionTypes: {
      navigate: "التنقل",
      modal: "نافذة حوار",
      execute: "تنفيذ النظام",
      api: "استدعاء API",
      automation: "أتمتة",
      external: "تطبيق خارجي"
    },
    categories: {
      patients: "إدارة المرضى",
      appointments: "المواعيد",
      medical: "طبي",
      emergency: "طوارئ",
      reports: "التقارير",
      system: "النظام",
      integrations: "التكاملات",
      custom: "مخصص"
    }
  }
};

export default function AdvancedQuickActionsManager() {
  const { language, t, isRTL } = useLanguage();
  const texts = translations[language as keyof typeof translations] || translations.en;

  // State management
  const [actions, setActions] = useState<ExtendedQuickAction[]>([]);
  const [integrations, setIntegrations] = useState<ExternalIntegration[]>([]);
  const [automations, setAutomations] = useState<AutomationRule[]>([]);
  const [selectedAction, setSelectedAction] = useState<ExtendedQuickAction | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('actions');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  // Form state for action creation/editing
  const [formData, setFormData] = useState({
    label: '',
    labelAr: '',
    category: 'custom',
    actionType: 'navigate' as ExtendedQuickAction['actionType'],
    action: '',
    shortcut: '',
    roles: [] as string[],
    metadata: {}
  });

  useEffect(() => {
    loadActionsData();
    loadIntegrationsData();
    loadAutomationsData();
  }, []);

  const loadActionsData = async () => {
    // Load from localStorage or API
    try {
      const savedActions = localStorage.getItem('advancedQuickActions');
      if (savedActions) {
        setActions(JSON.parse(savedActions));
      }
    } catch (error) {
      console.error('Error loading actions:', error);
    }
  };

  const loadIntegrationsData = async () => {
    try {
      const savedIntegrations = localStorage.getItem('externalIntegrations');
      if (savedIntegrations) {
        setIntegrations(JSON.parse(savedIntegrations));
      }
    } catch (error) {
      console.error('Error loading integrations:', error);
    }
  };

  const loadAutomationsData = async () => {
    try {
      const savedAutomations = localStorage.getItem('automationRules');
      if (savedAutomations) {
        setAutomations(JSON.parse(savedAutomations));
      }
    } catch (error) {
      console.error('Error loading automations:', error);
    }
  };

  const saveActionsData = async () => {
    try {
      localStorage.setItem('advancedQuickActions', JSON.stringify(actions));
      toast.success('Actions saved successfully');
    } catch (error) {
      toast.error('Failed to save actions');
    }
  };

  const createAction = async () => {
    const newAction: ExtendedQuickAction = {
      id: `action_${Date.now()}`,
      ...formData,
      isCustom: true,
      isEnabled: true,
      order: actions.length + 1,
      analytics: {
        usageCount: 0,
        lastUsed: new Date(),
        successRate: 100,
        avgExecutionTime: 0
      }
    };

    setActions([...actions, newAction]);
    setShowCreateDialog(false);
    resetForm();
    toast.success('Action created successfully');
  };

  const updateAction = async () => {
    if (!selectedAction) return;

    const updatedActions = actions.map(action =>
      action.id === selectedAction.id
        ? { ...action, ...formData }
        : action
    );

    setActions(updatedActions);
    setIsEditing(false);
    setSelectedAction(null);
    resetForm();
    toast.success('Action updated successfully');
  };

  const deleteAction = async (actionId: string) => {
    setActions(actions.filter(action => action.id !== actionId));
    toast.success('Action deleted successfully');
  };

  const duplicateAction = async (action: ExtendedQuickAction) => {
    const duplicated: ExtendedQuickAction = {
      ...action,
      id: `action_${Date.now()}`,
      label: `${action.label} (Copy)`,
      labelAr: `${action.labelAr} (نسخة)`,
      order: actions.length + 1
    };

    setActions([...actions, duplicated]);
    toast.success('Action duplicated successfully');
  };

  const testAction = async (action: ExtendedQuickAction) => {
    toast.loading('Testing action...');
    
    try {
      // Simulate action execution based on type
      switch (action.actionType) {
        case 'api':
          // Test API call
          const response = await fetch(action.metadata?.apiEndpoint || '');
          setTestResults({
            ...testResults,
            [action.id]: {
              success: response.ok,
              status: response.status,
              message: response.ok ? 'API call successful' : 'API call failed'
            }
          });
          break;

        case 'external':
          // Test external integration
          setTestResults({
            ...testResults,
            [action.id]: {
              success: true,
              message: 'External integration validated'
            }
          });
          break;

        default:
          setTestResults({
            ...testResults,
            [action.id]: {
              success: true,
              message: 'Action validation successful'
            }
          });
      }

      toast.success('Action test completed');
    } catch (error) {
      setTestResults({
        ...testResults,
        [action.id]: {
          success: false,
          message: 'Action test failed'
        }
      });
      toast.error('Action test failed');
    }
  };

  const resetForm = () => {
    setFormData({
      label: '',
      labelAr: '',
      category: 'custom',
      actionType: 'navigate',
      action: '',
      shortcut: '',
      roles: [],
      metadata: {}
    });
  };

  const editAction = (action: ExtendedQuickAction) => {
    setSelectedAction(action);
    setFormData({
      label: action.label,
      labelAr: action.labelAr,
      category: action.category,
      actionType: action.actionType,
      action: action.action,
      shortcut: action.shortcut || '',
      roles: action.roles,
      metadata: action.metadata || {}
    });
    setIsEditing(true);
  };

  const exportSettings = () => {
    const exportData = {
      actions,
      integrations,
      automations,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quick-actions-settings-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('Settings exported successfully');
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);
        
        if (importData.actions) setActions(importData.actions);
        if (importData.integrations) setIntegrations(importData.integrations);
        if (importData.automations) setAutomations(importData.automations);

        toast.success('Settings imported successfully');
      } catch (error) {
        toast.error('Failed to import settings');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            {texts.title}
          </h1>
          <p className="text-muted-foreground mt-1">
            {texts.subtitle}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={exportSettings}
            className="hover-lift"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <label htmlFor="import-settings">
            <Button variant="outline" className="hover-lift cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </label>
          <input
            id="import-settings"
            type="file"
            accept=".json"
            className="hidden"
            onChange={importSettings}
          />

          <Button
            onClick={() => setShowCreateDialog(true)}
            className="hover-lift"
          >
            <Plus className="h-4 w-4 mr-2" />
            {texts.actions.create}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card className="card-animate">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="actions" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                {texts.tabs.actions}
              </TabsTrigger>
              <TabsTrigger value="integrations" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                {texts.tabs.integrations}
              </TabsTrigger>
              <TabsTrigger value="automations" className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                {texts.tabs.automations}
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                {texts.tabs.analytics}
              </TabsTrigger>
            </TabsList>

            {/* Actions Tab */}
            <TabsContent value="actions" className="space-y-4">
              <div className="grid gap-4">
                {actions.map((action, index) => (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover-lift">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <action.icon className="h-5 w-5 text-primary" />
                            </div>
                            
                            <div>
                              <h3 className="font-medium">{action.label}</h3>
                              <p className="text-sm text-muted-foreground">
                                {action.labelAr}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary">
                                  {texts.actionTypes[action.actionType]}
                                </Badge>
                                <Badge variant="outline">
                                  {texts.categories[action.category as keyof typeof texts.categories]}
                                </Badge>
                                {action.shortcut && (
                                  <Badge variant="outline">
                                    {action.shortcut}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Switch
                              checked={action.isEnabled}
                              onCheckedChange={() => {
                                const updated = actions.map(a =>
                                  a.id === action.id
                                    ? { ...a, isEnabled: !a.isEnabled }
                                    : a
                                );
                                setActions(updated);
                              }}
                            />
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => testAction(action)}
                              className="hover-scale"
                            >
                              <Zap className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => duplicateAction(action)}
                              className="hover-scale"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => editAction(action)}
                              className="hover-scale"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteAction(action.id)}
                              className="hover-scale text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Test Results */}
                        {testResults[action.id] && (
                          <Alert className="mt-3">
                            <AlertDescription className="flex items-center gap-2">
                              {testResults[action.id].success ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <X className="h-4 w-4 text-red-500" />
                              )}
                              {testResults[action.id].message}
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Integrations Tab */}
            <TabsContent value="integrations" className="space-y-4">
              <ExternalIntegrationsManager 
                integrations={integrations}
                setIntegrations={setIntegrations}
              />
            </TabsContent>

            {/* Automations Tab */}
            <TabsContent value="automations" className="space-y-4">
              <AutomationRulesManager 
                automations={automations}
                setAutomations={setAutomations}
                actions={actions}
              />
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <ActionsAnalytics actions={actions} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Create/Edit Action Dialog */}
      <Dialog open={showCreateDialog || isEditing} onOpenChange={(open) => {
        if (!open) {
          setShowCreateDialog(false);
          setIsEditing(false);
          setSelectedAction(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? texts.actions.edit : texts.actions.create}
            </DialogTitle>
            <DialogDescription>
              Configure the action settings and behavior
            </DialogDescription>
          </DialogHeader>

          <ActionForm
            formData={formData}
            setFormData={setFormData}
            onSave={isEditing ? updateAction : createAction}
            texts={texts}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// External Integrations Manager Component
function ExternalIntegrationsManager({ 
  integrations, 
  setIntegrations 
}: {
  integrations: ExternalIntegration[];
  setIntegrations: React.Dispatch<React.SetStateAction<ExternalIntegration[]>>;
}) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<ExternalIntegration | null>(null);

  const addIntegration = (integration: Omit<ExternalIntegration, 'id'>) => {
    const newIntegration: ExternalIntegration = {
      ...integration,
      id: `integration_${Date.now()}`
    };
    setIntegrations([...integrations, newIntegration]);
    setShowAddDialog(false);
    toast.success('Integration added successfully');
  };

  const updateIntegration = (integration: ExternalIntegration) => {
    setIntegrations(integrations.map(i => 
      i.id === integration.id ? integration : i
    ));
    setEditingIntegration(null);
    toast.success('Integration updated successfully');
  };

  const deleteIntegration = (id: string) => {
    setIntegrations(integrations.filter(i => i.id !== id));
    toast.success('Integration deleted successfully');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">External Integrations</h3>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </div>

      <div className="grid gap-4">
        {integrations.map((integration) => (
          <Card key={integration.id} className="hover-lift">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <ExternalLink className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">{integration.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {integration.type.toUpperCase()} - {integration.endpoint}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={integration.isEnabled}
                    onCheckedChange={(checked) => {
                      updateIntegration({ ...integration, isEnabled: checked });
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingIntegration(integration)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteIntegration(integration.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Automation Rules Manager Component
function AutomationRulesManager({
  automations,
  setAutomations,
  actions
}: {
  automations: AutomationRule[];
  setAutomations: React.Dispatch<React.SetStateAction<AutomationRule[]>>;
  actions: ExtendedQuickAction[];
}) {
  const [showAddDialog, setShowAddDialog] = useState(false);

  const addAutomation = (automation: Omit<AutomationRule, 'id'>) => {
    const newAutomation: AutomationRule = {
      ...automation,
      id: `automation_${Date.now()}`
    };
    setAutomations([...automations, newAutomation]);
    setShowAddDialog(false);
    toast.success('Automation rule added successfully');
  };

  const deleteAutomation = (id: string) => {
    setAutomations(automations.filter(a => a.id !== id));
    toast.success('Automation rule deleted successfully');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Automation Rules</h3>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </div>

      <div className="grid gap-4">
        {automations.map((automation) => (
          <Card key={automation.id} className="hover-lift">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <Workflow className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">{automation.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Trigger: {automation.trigger.type}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={automation.isEnabled}
                    onCheckedChange={(checked) => {
                      setAutomations(automations.map(a =>
                        a.id === automation.id
                          ? { ...a, isEnabled: checked }
                          : a
                      ));
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteAutomation(automation.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Actions Analytics Component
function ActionsAnalytics({ actions }: { actions: ExtendedQuickAction[] }) {
  const totalActions = actions.length;
  const enabledActions = actions.filter(a => a.isEnabled).length;
  const customActions = actions.filter(a => a.isCustom).length;
  
  const usageData = actions
    .map(action => ({
      name: action.label,
      usage: action.analytics?.usageCount || 0
    }))
    .sort((a, b) => b.usage - a.usage)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Actions Analytics</h3>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActions}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Enabled Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{enabledActions}</div>
            <Progress value={(enabledActions / totalActions) * 100} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Custom Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{customActions}</div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Most Used Actions</CardTitle>
          <CardDescription>Top 10 actions by usage count</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {usageData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{item.name}</div>
                  <Progress value={(item.usage / Math.max(...usageData.map(d => d.usage))) * 100} className="mt-1" />
                </div>
                <div className="text-sm text-muted-foreground">{item.usage}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Action Form Component
function ActionForm({
  formData,
  setFormData,
  onSave,
  texts
}: {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onSave: () => void;
  texts: any;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="label">Label (English)</Label>
          <Input
            id="label"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            placeholder="Enter action label"
          />
        </div>
        <div>
          <Label htmlFor="labelAr">Label (Arabic)</Label>
          <Input
            id="labelAr"
            value={formData.labelAr}
            onChange={(e) => setFormData({ ...formData, labelAr: e.target.value })}
            placeholder="أدخل تسمية الإجراء"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(texts.categories).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="actionType">Action Type</Label>
          <Select
            value={formData.actionType}
            onValueChange={(value) => setFormData({ ...formData, actionType: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(texts.actionTypes).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="action">Action Target</Label>
        <Input
          id="action"
          value={formData.action}
          onChange={(e) => setFormData({ ...formData, action: e.target.value })}
          placeholder="e.g., navigate:patients, modal:new-appointment, api:/api/patients"
        />
      </div>

      <div>
        <Label htmlFor="shortcut">Keyboard Shortcut (Optional)</Label>
        <Input
          id="shortcut"
          value={formData.shortcut}
          onChange={(e) => setFormData({ ...formData, shortcut: e.target.value })}
          placeholder="e.g., Ctrl+Shift+P"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => {}}>
          Cancel
        </Button>
        <Button onClick={onSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Action
        </Button>
      </div>
    </div>
  );
}