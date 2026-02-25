import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Plus, Trash2, Edit, Save, X, Star, Heart, Clock, TrendingUp,
  Settings, Download, Upload, RefreshCw, Eye, EyeOff, 
  ArrowUp, ArrowDown, Grip, Search, Filter, MoreHorizontal,
  Zap, Target, Command, Keyboard, Sparkles, AlertTriangle,
  CheckCircle, Copy, Share2, Code, Palette, Users, Shield
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useQuickActions } from '../../services/QuickActionsService';
import { useLanguage } from '../../services/LanguageService';

// Icon options for custom actions
const iconOptions = [
  { name: 'Plus', component: Plus },
  { name: 'Settings', component: Settings },
  { name: 'Star', component: Star },
  { name: 'Heart', component: Heart },
  { name: 'Zap', component: Zap },
  { name: 'Target', component: Target },
  { name: 'CheckCircle', component: CheckCircle },
  { name: 'AlertTriangle', component: AlertTriangle },
  { name: 'Users', component: Users },
  { name: 'Shield', component: Shield }
];

// Action types
const actionTypes = [
  { value: 'navigate', label: 'Navigate to Page', labelAr: 'الانتقال إلى صفحة' },
  { value: 'modal', label: 'Open Modal', labelAr: 'فتح نافذة منبثقة' },
  { value: 'execute', label: 'Execute Function', labelAr: 'تنفيذ وظيفة' },
  { value: 'url', label: 'Open URL', labelAr: 'فتح رابط' }
];

interface QuickActionsManagerProps {
  userRole: string;
}

export default function QuickActionsManager({ userRole }: QuickActionsManagerProps) {
  const { language, isRTL, t } = useLanguage();
  const {
    quickActions,
    categories,
    favoriteActions,
    toggleActionEnabled,
    updateActionOrder,
    addCustomAction,
    removeCustomAction,
    getActionUsageStats,
    exportSettings,
    importSettings
  } = useQuickActions();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAction, setEditingAction] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'usage' | 'order'>('order');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // New action form state
  const [newAction, setNewAction] = useState({
    label: '',
    labelAr: '',
    icon: 'Plus',
    category: '',
    action: '',
    actionType: 'navigate',
    shortcut: '',
    roles: [userRole],
    order: quickActions.length + 1,
    metadata: {}
  });

  const usageStats = getActionUsageStats();

  const filteredActions = quickActions
    .filter(action => {
      const matchesSearch = action.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           action.labelAr.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || action.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.label.localeCompare(b.label);
        case 'usage':
          return (usageStats[b.id] || 0) - (usageStats[a.id] || 0);
        case 'order':
        default:
          return a.order - b.order;
      }
    });

  const handleCreateAction = useCallback(async () => {
    if (!newAction.label || !newAction.labelAr || !newAction.action) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const actionString = newAction.actionType + ':' + newAction.action;
      const selectedIcon = iconOptions.find(icon => icon.name === newAction.icon);
      
      await addCustomAction({
        label: newAction.label,
        labelAr: newAction.labelAr,
        icon: selectedIcon?.component || Plus,
        category: newAction.category,
        action: actionString,
        shortcut: newAction.shortcut,
        roles: newAction.roles,
        order: newAction.order,
        isEnabled: true,
        metadata: newAction.metadata
      });

      setNewAction({
        label: '',
        labelAr: '',
        icon: 'Plus',
        category: '',
        action: '',
        actionType: 'navigate',
        shortcut: '',
        roles: [userRole],
        order: quickActions.length + 1,
        metadata: {}
      });
      setIsCreateModalOpen(false);
      toast.success('Custom action created successfully');
    } catch (error) {
      toast.error('Failed to create action');
    }
  }, [newAction, addCustomAction, userRole, quickActions.length]);

  const handleExportSettings = useCallback(() => {
    try {
      const settings = exportSettings();
      const blob = new Blob([settings], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'quick-actions-settings.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Settings exported successfully');
    } catch (error) {
      toast.error('Failed to export settings');
    }
  }, [exportSettings]);

  const handleImportSettings = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const settings = e.target?.result as string;
        await importSettings(settings);
        toast.success('Settings imported successfully');
      } catch (error) {
        toast.error('Failed to import settings');
      }
    };
    reader.readAsText(file);
  }, [importSettings]);

  const renderActionItem = (action: any, index: number) => {
    const ActionIcon = action.icon;
    const usage = usageStats[action.id] || 0;
    const isFavorite = favoriteActions.includes(action.id);

    return (
      <motion.div
        key={action.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group"
      >
        <Card className="transition-all hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 bg-muted rounded-lg">
                  <ActionIcon className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium truncate">
                      {language === 'ar' ? action.labelAr : action.label}
                    </h4>
                    {isFavorite && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                    {action.isCustom && <Badge variant="secondary" className="text-xs">Custom</Badge>}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span className="truncate">{action.action}</span>
                    {action.shortcut && (
                      <Badge variant="outline" className="text-xs">
                        {action.shortcut}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Category: {categories.find(cat => cat.id === action.category)?.[language === 'ar' ? 'labelAr' : 'label']}</span>
                    <Separator orientation="vertical" className="h-3" />
                    <span>Used: {usage} times</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <Switch
                  checked={action.isEnabled}
                  onCheckedChange={() => toggleActionEnabled(action.id)}
                  size="sm"
                />
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48" align="end">
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setEditingAction(action)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => updateActionOrder(action.id, action.order - 1)}
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-4 h-4 mr-2" />
                        Move Up
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => updateActionOrder(action.id, action.order + 1)}
                        disabled={index === filteredActions.length - 1}
                      >
                        <ArrowDown className="w-4 h-4 mr-2" />
                        Move Down
                      </Button>
                      
                      {action.isCustom && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-destructive"
                          onClick={() => removeCustomAction(action.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderCreateModal = () => (
    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Custom Action
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Create Custom Quick Action
          </DialogTitle>
          <DialogDescription>
            Create a custom quick action to streamline your workflow.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="font-medium">Basic Information</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="label">Label (English) *</Label>
                <Input
                  id="label"
                  value={newAction.label}
                  onChange={(e) => setNewAction(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="Enter action label"
                />
              </div>
              
              <div>
                <Label htmlFor="labelAr">Label (Arabic) *</Label>
                <Input
                  id="labelAr"
                  value={newAction.labelAr}
                  onChange={(e) => setNewAction(prev => ({ ...prev, labelAr: e.target.value }))}
                  placeholder="أدخل تسمية الإجراء"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="icon">Icon</Label>
                <Select
                  value={newAction.icon}
                  onValueChange={(value) => setNewAction(prev => ({ ...prev, icon: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map(icon => (
                      <SelectItem key={icon.name} value={icon.name}>
                        {icon.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newAction.category}
                  onValueChange={(value) => setNewAction(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {language === 'ar' ? category.labelAr : category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="shortcut">Keyboard Shortcut (Optional)</Label>
              <Input
                id="shortcut"
                value={newAction.shortcut}
                onChange={(e) => setNewAction(prev => ({ ...prev, shortcut: e.target.value }))}
                placeholder="e.g., Ctrl+Shift+N"
              />
            </div>
          </div>

          <Separator />

          {/* Action Configuration */}
          <div className="space-y-4">
            <h4 className="font-medium">Action Configuration</h4>
            
            <div>
              <Label htmlFor="actionType">Action Type *</Label>
              <Select
                value={newAction.actionType}
                onValueChange={(value) => setNewAction(prev => ({ ...prev, actionType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {language === 'ar' ? type.labelAr : type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="action">Action Target *</Label>
              <Input
                id="action"
                value={newAction.action}
                onChange={(e) => setNewAction(prev => ({ ...prev, action: e.target.value }))}
                placeholder={
                  newAction.actionType === 'navigate' ? 'patients/registration' :
                  newAction.actionType === 'modal' ? 'patient-search' :
                  newAction.actionType === 'execute' ? 'refresh-data' :
                  newAction.actionType === 'url' ? 'https://example.com' : ''
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                {newAction.actionType === 'navigate' && 'Enter the route path (e.g., patients/registration)'}
                {newAction.actionType === 'modal' && 'Enter the modal identifier (e.g., patient-search)'}
                {newAction.actionType === 'execute' && 'Enter the function name (e.g., refresh-data)'}
                {newAction.actionType === 'url' && 'Enter the full URL (e.g., https://example.com)'}
              </p>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Advanced Options</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showAdvanced ? 'Hide' : 'Show'}
              </Button>
            </div>

            {showAdvanced && (
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label htmlFor="order">Order Priority</Label>
                  <Input
                    id="order"
                    type="number"
                    value={newAction.order}
                    onChange={(e) => setNewAction(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                    min="1"
                  />
                </div>

                <div>
                  <Label>Metadata (JSON)</Label>
                  <Textarea
                    value={JSON.stringify(newAction.metadata, null, 2)}
                    onChange={(e) => {
                      try {
                        const metadata = JSON.parse(e.target.value);
                        setNewAction(prev => ({ ...prev, metadata }));
                      } catch (error) {
                        // Invalid JSON, ignore
                      }
                    }}
                    placeholder='{"description": "Custom metadata"}'
                    className="font-mono text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateAction}>
            <Save className="w-4 h-4 mr-2" />
            Create Action
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quick Actions Manager</h2>
          <p className="text-muted-foreground">
            Customize and manage your quick actions for faster workflow.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportSettings}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Button variant="outline" className="relative">
            <Upload className="w-4 h-4 mr-2" />
            Import
            <input
              type="file"
              accept=".json"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleImportSettings}
            />
          </Button>
          
          {renderCreateModal()}
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search actions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {language === 'ar' ? category.labelAr : category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={(value: 'name' | 'usage' | 'order') => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="order">Order</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="usage">Usage</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Actions</p>
                <p className="text-2xl font-bold">{quickActions.length}</p>
              </div>
              <Target className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Favorites</p>
                <p className="text-2xl font-bold">{favoriteActions.length}</p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Custom Actions</p>
                <p className="text-2xl font-bold">
                  {quickActions.filter(action => action.isCustom).length}
                </p>
              </div>
              <Sparkles className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Usage</p>
                <p className="text-2xl font-bold">
                  {Object.values(usageStats).reduce((total, count) => total + count, 0)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Quick Actions ({filteredActions.length})
          </CardTitle>
          <CardDescription>
            Manage your quick actions and customize their behavior.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {filteredActions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No actions found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filteredActions.map((action, index) => renderActionItem(action, index))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}