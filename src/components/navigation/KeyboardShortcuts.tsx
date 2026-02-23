import React, { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Keyboard, Command, Search, Info, X, Check, AlertTriangle,
  Zap, Globe, Settings, HelpCircle, BookOpen, Target,
  ArrowRight, Plus, Minus, RotateCcw, Save, Copy
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useQuickActions } from '../../services/QuickActionsService';
import { useLanguage } from '../../services/LanguageService';

interface KeyboardShortcut {
  key: string;
  combination: string;
  action: string;
  description: string;
  descriptionAr: string;
  category: string;
  isGlobal: boolean;
  isCustom?: boolean;
}

const defaultShortcuts: KeyboardShortcut[] = [
  // Global shortcuts
  {
    key: 'search',
    combination: 'Ctrl+F',
    action: 'search',
    description: 'Global Search',
    descriptionAr: 'البحث العام',
    category: 'global',
    isGlobal: true
  },
  {
    key: 'help',
    combination: 'F1',
    action: 'help',
    description: 'Show Help',
    descriptionAr: 'إظهار المساعدة',
    category: 'global',
    isGlobal: true
  },
  {
    key: 'settings',
    combination: 'Ctrl+,',
    action: 'settings',
    description: 'Open Settings',
    descriptionAr: 'فتح الإعدادات',
    category: 'global',
    isGlobal: true
  },
  {
    key: 'save',
    combination: 'Ctrl+S',
    action: 'save',
    description: 'Save Changes',
    descriptionAr: 'حفظ التغييرات',
    category: 'global',
    isGlobal: true
  },
  {
    key: 'refresh',
    combination: 'F5',
    action: 'refresh',
    description: 'Refresh Page',
    descriptionAr: 'تحديث الصفحة',
    category: 'global',
    isGlobal: true
  },
  
  // Navigation shortcuts
  {
    key: 'dashboard',
    combination: 'Ctrl+D',
    action: 'navigate:dashboard',
    description: 'Go to Dashboard',
    descriptionAr: 'الذهاب للوحة التحكم',
    category: 'navigation',
    isGlobal: true
  },
  {
    key: 'patients',
    combination: 'Ctrl+P',
    action: 'navigate:patients',
    description: 'Go to Patients',
    descriptionAr: 'الذهاب للمرضى',
    category: 'navigation',
    isGlobal: true
  },
  {
    key: 'appointments',
    combination: 'Ctrl+A',
    action: 'navigate:appointments',
    description: 'Go to Appointments',
    descriptionAr: 'الذهاب للمواعيد',
    category: 'navigation',
    isGlobal: true
  },
  
  // Quick actions shortcuts
  {
    key: 'new-patient',
    combination: 'Ctrl+Shift+P',
    action: 'modal:new-patient',
    description: 'Add New Patient',
    descriptionAr: 'إضافة مريض جديد',
    category: 'quickActions',
    isGlobal: true
  },
  {
    key: 'new-appointment',
    combination: 'Ctrl+Shift+A',
    action: 'modal:new-appointment',
    description: 'Schedule Appointment',
    descriptionAr: 'جدولة موعد',
    category: 'quickActions',
    isGlobal: true
  },
  {
    key: 'emergency-alert',
    combination: 'Ctrl+Shift+E',
    action: 'execute:emergency-alert',
    description: 'Emergency Alert',
    descriptionAr: 'تنبيه طارئ',
    category: 'quickActions',
    isGlobal: true
  }
];

const shortcutCategories = [
  { id: 'global', label: 'Global', labelAr: 'عام', icon: Globe },
  { id: 'navigation', label: 'Navigation', labelAr: 'التنقل', icon: ArrowRight },
  { id: 'quickActions', label: 'Quick Actions', labelAr: 'الإجراءات السريعة', icon: Zap },
  { id: 'editing', label: 'Editing', labelAr: 'التحرير', icon: Settings }
];

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteAction?: (action: string) => void;
}

function KeyboardShortcuts({ 
  isOpen, 
  onClose, 
  onExecuteAction 
}: KeyboardShortcutsProps) {
  const { language, isRTL, t } = useLanguage();
  const { quickActions, executeAction } = useQuickActions();
  
  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>(defaultShortcuts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingFor, setRecordingFor] = useState<string | null>(null);
  const [activeShortcuts, setActiveShortcuts] = useState<Set<string>>(new Set());

  // Load shortcuts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('keyboard-shortcuts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setShortcuts([...defaultShortcuts, ...parsed.custom]);
      } catch (error) {
        console.error('Error loading shortcuts:', error);
      }
    }
  }, []);

  // Save shortcuts to localStorage
  const saveShortcuts = useCallback((newShortcuts: KeyboardShortcut[]) => {
    const custom = newShortcuts.filter(s => s.isCustom);
    localStorage.setItem('keyboard-shortcuts', JSON.stringify({ custom }));
  }, []);

  // Handle keyboard events
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (isRecording) {
      event.preventDefault();
      return;
    }

    const combination = getCombinationFromEvent(event);
    const shortcut = shortcuts.find(s => s.combination === combination);
    
    if (shortcut) {
      event.preventDefault();
      setActiveShortcuts(prev => new Set([...prev, shortcut.key]));
      
      // Execute the action
      if (shortcut.action.startsWith('navigate:')) {
        const target = shortcut.action.split(':')[1];
        onExecuteAction?.(shortcut.action);
      } else if (shortcut.action.startsWith('modal:') || shortcut.action.startsWith('execute:')) {
        if (executeAction) {
          executeAction(shortcut.key);
        } else {
          onExecuteAction?.(shortcut.action);
        }
      } else {
        handleGlobalAction(shortcut.action);
      }

      toast.success(`Executed: ${shortcut.description}`, { duration: 1500 });

      // Remove from active after animation
      setTimeout(() => {
        setActiveShortcuts(prev => {
          const next = new Set(prev);
          next.delete(shortcut.key);
          return next;
        });
      }, 200);
    }
  }, [shortcuts, isRecording, executeAction, onExecuteAction]);

  // Handle global actions
  const handleGlobalAction = useCallback((action: string) => {
    switch (action) {
      case 'search':
        // Focus search input if available
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
        break;
      case 'help':
        // Open help dialog
        break;
      case 'settings':
        // Navigate to settings
        onExecuteAction?.('navigate:settings');
        break;
      case 'save':
        // Trigger save action
        document.dispatchEvent(new CustomEvent('global-save'));
        break;
      case 'refresh':
        window.location.reload();
        break;
    }
  }, [onExecuteAction]);

  // Get key combination from keyboard event
  const getCombinationFromEvent = (event: KeyboardEvent): string => {
    const parts: string[] = [];
    
    if (event.ctrlKey) parts.push('Ctrl');
    if (event.altKey) parts.push('Alt');
    if (event.shiftKey) parts.push('Shift');
    if (event.metaKey) parts.push('Cmd');
    
    // Special keys
    if (event.key === 'F1' || event.key === 'F5') {
      parts.push(event.key);
    } else if (event.key.length === 1) {
      parts.push(event.key.toUpperCase());
    }
    
    return parts.join('+');
  };

  // Record new shortcut
  const startRecording = useCallback((shortcutKey: string) => {
    setIsRecording(true);
    setRecordingFor(shortcutKey);
    
    const handleRecordKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      const combination = getCombinationFromEvent(event);
      
      if (combination.includes('Escape')) {
        setIsRecording(false);
        setRecordingFor(null);
        document.removeEventListener('keydown', handleRecordKeyDown);
        return;
      }
      
      if (combination.length > 1) {
        // Check if combination is already used
        const existing = shortcuts.find(s => s.combination === combination);
        if (existing && existing.key !== shortcutKey) {
          toast.error(`Shortcut ${combination} is already used by ${existing.description}`);
          return;
        }
        
        // Update shortcut
        const updatedShortcuts = shortcuts.map(s => 
          s.key === shortcutKey ? { ...s, combination } : s
        );
        setShortcuts(updatedShortcuts);
        saveShortcuts(updatedShortcuts);
        
        toast.success(`Shortcut updated: ${combination}`);
        setIsRecording(false);
        setRecordingFor(null);
        document.removeEventListener('keydown', handleRecordKeyDown);
      }
    };
    
    document.addEventListener('keydown', handleRecordKeyDown);
    
    // Auto-cancel after 10 seconds
    setTimeout(() => {
      if (isRecording) {
        setIsRecording(false);
        setRecordingFor(null);
        document.removeEventListener('keydown', handleRecordKeyDown);
        toast.error('Recording cancelled');
      }
    }, 10000);
  }, [shortcuts, saveShortcuts, isRecording]);

  // Filter shortcuts
  const filteredShortcuts = shortcuts.filter(shortcut => {
    const matchesSearch = searchQuery === '' || 
      shortcut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shortcut.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shortcut.combination.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || shortcut.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Group shortcuts by category
  const groupedShortcuts = shortcutCategories.reduce((acc, category) => {
    acc[category.id] = filteredShortcuts.filter(s => s.category === category.id);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  // Add keyboard event listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  const renderShortcutItem = (shortcut: KeyboardShortcut) => {
    const isActive = activeShortcuts.has(shortcut.key);
    const isCurrentlyRecording = isRecording && recordingFor === shortcut.key;
    
    return (
      <motion.div
        key={shortcut.key}
        className={`
          flex items-center justify-between p-3 rounded-lg border transition-all
          ${isActive ? 'bg-primary/10 border-primary shadow-md' : 'hover:bg-muted/50'}
          ${isCurrentlyRecording ? 'bg-yellow-50 border-yellow-300' : ''}
        `}
        animate={isActive ? { scale: 1.02 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium">
              {language === 'ar' ? shortcut.descriptionAr : shortcut.description}
            </p>
            {shortcut.isGlobal && (
              <Badge variant="secondary" className="text-xs">
                {language === 'ar' ? 'عام' : 'Global'}
              </Badge>
            )}
            {shortcut.isCustom && (
              <Badge variant="outline" className="text-xs">
                {language === 'ar' ? 'مخصص' : 'Custom'}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{shortcut.action}</p>
        </div>
        
        <div className="flex items-center gap-2">
          {isCurrentlyRecording ? (
            <div className="flex items-center gap-2 text-yellow-600">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span className="text-xs">{language === 'ar' ? 'جاري التسجيل...' : 'Recording...'}</span>
            </div>
          ) : (
            <Badge variant="outline" className="font-mono">
              {shortcut.combination}
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => startRecording(shortcut.key)}
            disabled={isRecording}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            {language === 'ar' ? 'اختصارات لوحة المفاتيح' : 'Keyboard Shortcuts'}
          </DialogTitle>
          <DialogDescription>
            {language === 'ar' 
              ? 'عرض وإدارة اختصارات لوحة المفاتيح للوصول السريع للوظائف'
              : 'View and manage keyboard shortcuts for quick access to functions'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={language === 'ar' ? 'البحث في الاختصارات...' : 'Search shortcuts...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                {language === 'ar' ? 'الكل' : 'All'}
              </Button>
              {shortcutCategories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-1"
                >
                  <category.icon className="w-3 h-3" />
                  <span className="hidden sm:inline">
                    {language === 'ar' ? category.labelAr : category.label}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Recording indicator */}
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
            >
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
              <span className="font-medium text-yellow-800">
                {language === 'ar' 
                  ? 'اضغط على المفاتيح للاختصار الجديد... (Escape للإلغاء)'
                  : 'Press keys for new shortcut... (Escape to cancel)'
                }
              </span>
            </motion.div>
          )}

          {/* Shortcuts list */}
          <Tabs value={selectedCategory === 'all' ? 'overview' : selectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" onClick={() => setSelectedCategory('all')}>
                <Target className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'نظرة عامة' : 'Overview'}
              </TabsTrigger>
              {shortcutCategories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <category.icon className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">
                    {language === 'ar' ? category.labelAr : category.label}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <ScrollArea className="h-96">
                <div className="space-y-6">
                  {shortcutCategories.map(category => {
                    const categoryShortcuts = groupedShortcuts[category.id];
                    if (categoryShortcuts.length === 0) return null;
                    
                    return (
                      <div key={category.id}>
                        <div className="flex items-center gap-2 mb-3">
                          <category.icon className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold">
                            {language === 'ar' ? category.labelAr : category.label}
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            {categoryShortcuts.length}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {categoryShortcuts.map(renderShortcutItem)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            {shortcutCategories.map(category => (
              <TabsContent key={category.id} value={category.id} className="mt-6">
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {groupedShortcuts[category.id].length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Keyboard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>{language === 'ar' ? 'لا توجد اختصارات في هذه الفئة' : 'No shortcuts in this category'}</p>
                      </div>
                    ) : (
                      groupedShortcuts[category.id].map(renderShortcutItem)
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>

          {/* Help text */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm space-y-2">
                <p className="font-medium">
                  {language === 'ar' ? 'نصائح:' : 'Tips:'}
                </p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• {language === 'ar' ? 'انقر على أيقونة الإعدادات لتسجيل اختصار جديد' : 'Click the settings icon to record a new shortcut'}</li>
                  <li>• {language === 'ar' ? 'استخدم Escape لإلغاء التسجيل' : 'Use Escape to cancel recording'}</li>
                  <li>• {language === 'ar' ? 'الاختصارات العامة تعمل في جميع الصفحات' : 'Global shortcuts work on all pages'}</li>
                  <li>• {language === 'ar' ? 'بعض الاختصارات محجوزة للمتصفح' : 'Some shortcuts are reserved by the browser'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook for keyboard shortcuts
export function useKeyboardShortcuts() {
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const openShortcuts = useCallback(() => {
    setIsShortcutsOpen(true);
  }, []);

  const closeShortcuts = useCallback(() => {
    setIsShortcutsOpen(false);
  }, []);

  // Global shortcut to open shortcuts dialog
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === '?') {
        event.preventDefault();
        setIsShortcutsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isShortcutsOpen,
    openShortcuts,
    closeShortcuts
  };
}

// Default export
export default KeyboardShortcuts;