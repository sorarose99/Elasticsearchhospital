import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  Palette, Monitor, Bell, Keyboard, Layout, Zap, Settings, Save, 
  RefreshCw, Download, Upload, Eye, EyeOff, Moon, Sun, Contrast,
  Volume2, VolumeX, Timer, Clock, Calendar, Users, Shield, Lock,
  Globe, Smartphone, Tablet, Laptop, Gamepad2, MousePointer,
  Type, Image, Video, Music, FileText, Code, Database, Wifi,
  Battery, Cpu, HardDrive, Memory, Thermometer, Activity,
  TrendingUp, BarChart3, PieChart, LineChart, Sparkles,
  Paintbrush, Brush, Droplets, Layers, Filter, Sliders,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useTheme } from '../../services/ThemeService';
import { useLanguage } from '../../services/LanguageService';

interface CustomizationSettings {
  appearance: {
    theme: 'light' | 'dark' | 'system';
    accentColor: string;
    borderRadius: number;
    fontSize: number;
    fontFamily: string;
    animations: boolean;
    reducedMotion: boolean;
    highContrast: boolean;
    compactMode: boolean;
  };
  layout: {
    sidebarWidth: number;
    sidebarPosition: 'left' | 'right';
    sidebarCollapsed: boolean;
    headerHeight: number;
    contentPadding: number;
    gridSpacing: number;
    cardStyle: 'elevated' | 'outlined' | 'filled';
  };
  behavior: {
    autoSave: boolean;
    autoRefresh: boolean;
    refreshInterval: number;
    confirmActions: boolean;
    tooltips: boolean;
    notifications: boolean;
    sounds: boolean;
    vibration: boolean;
  };
  accessibility: {
    screenReader: boolean;
    keyboardNav: boolean;
    focusVisible: boolean;
    skipLinks: boolean;
    altText: boolean;
    captions: boolean;
    textToSpeech: boolean;
  };
  performance: {
    lazyLoading: boolean;
    imageOptimization: boolean;
    caching: boolean;
    prefetch: boolean;
    compression: boolean;
    analytics: boolean;
  };
  security: {
    sessionTimeout: number;
    autoLock: boolean;
    biometric: boolean;
    twoFactor: boolean;
    auditLog: boolean;
    encryptLocal: boolean;
  };
}

const defaultSettings: CustomizationSettings = {
  appearance: {
    theme: 'system',
    accentColor: '#1e40af',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'system',
    animations: true,
    reducedMotion: false,
    highContrast: false,
    compactMode: false
  },
  layout: {
    sidebarWidth: 280,
    sidebarPosition: 'left',
    sidebarCollapsed: false,
    headerHeight: 60,
    contentPadding: 24,
    gridSpacing: 16,
    cardStyle: 'elevated'
  },
  behavior: {
    autoSave: true,
    autoRefresh: false,
    refreshInterval: 300,
    confirmActions: true,
    tooltips: true,
    notifications: true,
    sounds: false,
    vibration: false
  },
  accessibility: {
    screenReader: false,
    keyboardNav: true,
    focusVisible: true,
    skipLinks: false,
    altText: true,
    captions: false,
    textToSpeech: false
  },
  performance: {
    lazyLoading: true,
    imageOptimization: true,
    caching: true,
    prefetch: false,
    compression: true,
    analytics: true
  },
  security: {
    sessionTimeout: 30,
    autoLock: false,
    biometric: false,
    twoFactor: false,
    auditLog: true,
    encryptLocal: false
  }
};

const accentColors = [
  { name: 'Blue', value: '#1e40af', gradient: 'from-blue-500 to-blue-600' },
  { name: 'Green', value: '#059669', gradient: 'from-green-500 to-green-600' },
  { name: 'Purple', value: '#7c3aed', gradient: 'from-purple-500 to-purple-600' },
  { name: 'Red', value: '#dc2626', gradient: 'from-red-500 to-red-600' },
  { name: 'Orange', value: '#ea580c', gradient: 'from-orange-500 to-orange-600' },
  { name: 'Pink', value: '#db2777', gradient: 'from-pink-500 to-pink-600' },
  { name: 'Indigo', value: '#4f46e5', gradient: 'from-indigo-500 to-indigo-600' },
  { name: 'Teal', value: '#0d9488', gradient: 'from-teal-500 to-teal-600' }
];

const fontFamilies = [
  { name: 'System', value: 'system' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Helvetica', value: 'Helvetica, sans-serif' },
  { name: 'Times', value: 'Times, serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Courier', value: 'Courier, monospace' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Open Sans', value: 'Open Sans, sans-serif' }
];

interface SystemCustomizationProps {
  userId: string;
  userRole: string;
}

export default function SystemCustomization({ userId, userRole }: SystemCustomizationProps) {
  const { language, isRTL, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  
  const [settings, setSettings] = useState<CustomizationSettings>(defaultSettings);
  const [previewMode, setPreviewMode] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, [userId]);

  // Track changes
  useEffect(() => {
    setUnsavedChanges(true);
  }, [settings]);

  const loadSettings = useCallback(async () => {
    try {
      const saved = localStorage.getItem(`customization_${userId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error('Error loading customization settings:', error);
      toast.error('Failed to load settings');
    }
  }, [userId]);

  const saveSettings = useCallback(async () => {
    try {
      localStorage.setItem(`customization_${userId}`, JSON.stringify(settings));
      setUnsavedChanges(false);
      toast.success('Settings saved successfully');
      
      // Apply settings immediately
      applySettings();
    } catch (error) {
      console.error('Error saving customization settings:', error);
      toast.error('Failed to save settings');
    }
  }, [userId, settings]);

  const applySettings = useCallback(() => {
    const root = document.documentElement;
    
    // Apply CSS custom properties
    root.style.setProperty('--accent-color', settings.appearance.accentColor);
    root.style.setProperty('--border-radius', `${settings.appearance.borderRadius}px`);
    root.style.setProperty('--font-size', `${settings.appearance.fontSize}px`);
    root.style.setProperty('--sidebar-width', `${settings.layout.sidebarWidth}px`);
    root.style.setProperty('--header-height', `${settings.layout.headerHeight}px`);
    root.style.setProperty('--content-padding', `${settings.layout.contentPadding}px`);
    root.style.setProperty('--grid-spacing', `${settings.layout.gridSpacing}px`);
    
    // Apply font family
    if (settings.appearance.fontFamily !== 'system') {
      root.style.setProperty('--font-family', settings.appearance.fontFamily);
    }
    
    // Apply theme
    if (settings.appearance.theme !== 'system') {
      setTheme(settings.appearance.theme);
    }
    
    // Apply accessibility settings
    if (settings.accessibility.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    
    if (settings.appearance.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    if (settings.appearance.compactMode) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }
    
    toast.success('Settings applied successfully');
  }, [settings, setTheme]);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    setUnsavedChanges(true);
    toast.success('Settings reset to defaults');
  }, []);

  const exportSettings = useCallback(() => {
    try {
      const exported = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        userId,
        settings
      };
      
      const blob = new Blob([JSON.stringify(exported, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customization-settings-${userId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Settings exported successfully');
      setExportModalOpen(false);
    } catch (error) {
      toast.error('Failed to export settings');
    }
  }, [userId, settings]);

  const importSettings = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (imported.settings) {
          setSettings({ ...defaultSettings, ...imported.settings });
          setUnsavedChanges(true);
          toast.success('Settings imported successfully');
          setImportModalOpen(false);
        } else {
          toast.error('Invalid settings file');
        }
      } catch (error) {
        toast.error('Failed to import settings');
      }
    };
    reader.readAsText(file);
  }, []);

  const updateSetting = useCallback((category: keyof CustomizationSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  }, []);

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Theme & Colors
          </CardTitle>
          <CardDescription>Customize the visual appearance of the application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Selection */}
          <div>
            <Label className="text-base font-medium">Theme</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {[
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'dark', label: 'Dark', icon: Moon },
                { value: 'system', label: 'System', icon: Monitor }
              ].map(({ value, label, icon: Icon }) => (
                <Button
                  key={value}
                  variant={settings.appearance.theme === value ? 'default' : 'outline'}
                  className="justify-start h-12"
                  onClick={() => updateSetting('appearance', 'theme', value)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <Label className="text-base font-medium">Accent Color</Label>
            <div className="grid grid-cols-4 gap-3 mt-2">
              {accentColors.map(color => (
                <motion.button
                  key={color.value}
                  className={`
                    relative h-12 rounded-lg bg-gradient-to-br ${color.gradient}
                    ${settings.appearance.accentColor === color.value ? 'ring-2 ring-offset-2 ring-current' : ''}
                  `}
                  onClick={() => updateSetting('appearance', 'accentColor', color.value)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {settings.appearance.accentColor === color.value && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-current rounded-full" />
                      </div>
                    </div>
                  )}
                  <span className="sr-only">{color.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="fontSize" className="text-base font-medium">Font Size</Label>
              <div className="space-y-2 mt-2">
                <Slider
                  id="fontSize"
                  min={12}
                  max={20}
                  step={1}
                  value={[settings.appearance.fontSize]}
                  onValueChange={([value]) => updateSetting('appearance', 'fontSize', value)}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>12px</span>
                  <span>{settings.appearance.fontSize}px</span>
                  <span>20px</span>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="fontFamily" className="text-base font-medium">Font Family</Label>
              <Select
                value={settings.appearance.fontFamily}
                onValueChange={(value) => updateSetting('appearance', 'fontFamily', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontFamilies.map(font => (
                    <SelectItem key={font.value} value={font.value}>
                      <span style={{ fontFamily: font.value }}>{font.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Visual Options */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="borderRadius" className="text-base font-medium">Border Radius</Label>
              <div className="space-y-2 mt-2">
                <Slider
                  id="borderRadius"
                  min={0}
                  max={16}
                  step={1}
                  value={[settings.appearance.borderRadius]}
                  onValueChange={([value]) => updateSetting('appearance', 'borderRadius', value)}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>0px</span>
                  <span>{settings.appearance.borderRadius}px</span>
                  <span>16px</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="animations" className="text-sm font-medium">Animations</Label>
                <Switch
                  id="animations"
                  checked={settings.appearance.animations}
                  onCheckedChange={(checked) => updateSetting('appearance', 'animations', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="highContrast" className="text-sm font-medium">High Contrast</Label>
                <Switch
                  id="highContrast"
                  checked={settings.appearance.highContrast}
                  onCheckedChange={(checked) => updateSetting('appearance', 'highContrast', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="compactMode" className="text-sm font-medium">Compact Mode</Label>
                <Switch
                  id="compactMode"
                  checked={settings.appearance.compactMode}
                  onCheckedChange={(checked) => updateSetting('appearance', 'compactMode', checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLayoutSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="w-5 h-5" />
            Layout & Spacing
          </CardTitle>
          <CardDescription>Configure the layout and spacing of interface elements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sidebar Settings */}
          <div>
            <Label className="text-base font-medium">Sidebar Configuration</Label>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <Label htmlFor="sidebarWidth" className="text-sm">Width (px)</Label>
                <div className="space-y-2 mt-2">
                  <Slider
                    id="sidebarWidth"
                    min={200}
                    max={400}
                    step={10}
                    value={[settings.layout.sidebarWidth]}
                    onValueChange={([value]) => updateSetting('layout', 'sidebarWidth', value)}
                  />
                  <div className="text-center text-sm text-muted-foreground">
                    {settings.layout.sidebarWidth}px
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm">Position</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button
                    variant={settings.layout.sidebarPosition === 'left' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSetting('layout', 'sidebarPosition', 'left')}
                  >
                    Left
                  </Button>
                  <Button
                    variant={settings.layout.sidebarPosition === 'right' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSetting('layout', 'sidebarPosition', 'right')}
                  >
                    Right
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Spacing Settings */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <Label htmlFor="headerHeight" className="text-sm font-medium">Header Height</Label>
              <div className="space-y-2 mt-2">
                <Slider
                  id="headerHeight"
                  min={48}
                  max={80}
                  step={4}
                  value={[settings.layout.headerHeight]}
                  onValueChange={([value]) => updateSetting('layout', 'headerHeight', value)}
                />
                <div className="text-center text-xs text-muted-foreground">
                  {settings.layout.headerHeight}px
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="contentPadding" className="text-sm font-medium">Content Padding</Label>
              <div className="space-y-2 mt-2">
                <Slider
                  id="contentPadding"
                  min={12}
                  max={48}
                  step={4}
                  value={[settings.layout.contentPadding]}
                  onValueChange={([value]) => updateSetting('layout', 'contentPadding', value)}
                />
                <div className="text-center text-xs text-muted-foreground">
                  {settings.layout.contentPadding}px
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="gridSpacing" className="text-sm font-medium">Grid Spacing</Label>
              <div className="space-y-2 mt-2">
                <Slider
                  id="gridSpacing"
                  min={8}
                  max={32}
                  step={4}
                  value={[settings.layout.gridSpacing]}
                  onValueChange={([value]) => updateSetting('layout', 'gridSpacing', value)}
                />
                <div className="text-center text-xs text-muted-foreground">
                  {settings.layout.gridSpacing}px
                </div>
              </div>
            </div>
          </div>

          {/* Card Style */}
          <div>
            <Label className="text-base font-medium">Card Style</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {[
                { value: 'elevated', label: 'Elevated' },
                { value: 'outlined', label: 'Outlined' },
                { value: 'filled', label: 'Filled' }
              ].map(({ value, label }) => (
                <Button
                  key={value}
                  variant={settings.layout.cardStyle === value ? 'default' : 'outline'}
                  onClick={() => updateSetting('layout', 'cardStyle', value)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBehaviorSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Behavior & Interactions
          </CardTitle>
          <CardDescription>Configure how the application behaves and responds</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Auto Save</Label>
                  <p className="text-xs text-muted-foreground">Automatically save changes</p>
                </div>
                <Switch
                  checked={settings.behavior.autoSave}
                  onCheckedChange={(checked) => updateSetting('behavior', 'autoSave', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Auto Refresh</Label>
                  <p className="text-xs text-muted-foreground">Automatically refresh data</p>
                </div>
                <Switch
                  checked={settings.behavior.autoRefresh}
                  onCheckedChange={(checked) => updateSetting('behavior', 'autoRefresh', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Confirm Actions</Label>
                  <p className="text-xs text-muted-foreground">Ask for confirmation on important actions</p>
                </div>
                <Switch
                  checked={settings.behavior.confirmActions}
                  onCheckedChange={(checked) => updateSetting('behavior', 'confirmActions', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Tooltips</Label>
                  <p className="text-xs text-muted-foreground">Show helpful tooltips</p>
                </div>
                <Switch
                  checked={settings.behavior.tooltips}
                  onCheckedChange={(checked) => updateSetting('behavior', 'tooltips', checked)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Notifications</Label>
                  <p className="text-xs text-muted-foreground">Show push notifications</p>
                </div>
                <Switch
                  checked={settings.behavior.notifications}
                  onCheckedChange={(checked) => updateSetting('behavior', 'notifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Sounds</Label>
                  <p className="text-xs text-muted-foreground">Play notification sounds</p>
                </div>
                <Switch
                  checked={settings.behavior.sounds}
                  onCheckedChange={(checked) => updateSetting('behavior', 'sounds', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Vibration</Label>
                  <p className="text-xs text-muted-foreground">Haptic feedback on mobile</p>
                </div>
                <Switch
                  checked={settings.behavior.vibration}
                  onCheckedChange={(checked) => updateSetting('behavior', 'vibration', checked)}
                />
              </div>

              {settings.behavior.autoRefresh && (
                <div>
                  <Label htmlFor="refreshInterval" className="text-sm font-medium">
                    Refresh Interval (seconds)
                  </Label>
                  <div className="space-y-2 mt-2">
                    <Slider
                      id="refreshInterval"
                      min={60}
                      max={600}
                      step={30}
                      value={[settings.behavior.refreshInterval]}
                      onValueChange={([value]) => updateSetting('behavior', 'refreshInterval', value)}
                    />
                    <div className="text-center text-xs text-muted-foreground">
                      {settings.behavior.refreshInterval}s
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAccessibilitySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Accessibility
          </CardTitle>
          <CardDescription>Configure accessibility features for better usability</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Screen Reader Support</Label>
                  <p className="text-xs text-muted-foreground">Enhanced screen reader compatibility</p>
                </div>
                <Switch
                  checked={settings.accessibility.screenReader}
                  onCheckedChange={(checked) => updateSetting('accessibility', 'screenReader', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Keyboard Navigation</Label>
                  <p className="text-xs text-muted-foreground">Enhanced keyboard support</p>
                </div>
                <Switch
                  checked={settings.accessibility.keyboardNav}
                  onCheckedChange={(checked) => updateSetting('accessibility', 'keyboardNav', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Focus Indicators</Label>
                  <p className="text-xs text-muted-foreground">Visible focus outlines</p>
                </div>
                <Switch
                  checked={settings.accessibility.focusVisible}
                  onCheckedChange={(checked) => updateSetting('accessibility', 'focusVisible', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Skip Links</Label>
                  <p className="text-xs text-muted-foreground">Quick navigation links</p>
                </div>
                <Switch
                  checked={settings.accessibility.skipLinks}
                  onCheckedChange={(checked) => updateSetting('accessibility', 'skipLinks', checked)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Alt Text</Label>
                  <p className="text-xs text-muted-foreground">Image descriptions</p>
                </div>
                <Switch
                  checked={settings.accessibility.altText}
                  onCheckedChange={(checked) => updateSetting('accessibility', 'altText', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Captions</Label>
                  <p className="text-xs text-muted-foreground">Video and audio captions</p>
                </div>
                <Switch
                  checked={settings.accessibility.captions}
                  onCheckedChange={(checked) => updateSetting('accessibility', 'captions', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Text to Speech</Label>
                  <p className="text-xs text-muted-foreground">Read content aloud</p>
                </div>
                <Switch
                  checked={settings.accessibility.textToSpeech}
                  onCheckedChange={(checked) => updateSetting('accessibility', 'textToSpeech', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Reduced Motion</Label>
                  <p className="text-xs text-muted-foreground">Minimize animations</p>
                </div>
                <Switch
                  checked={settings.appearance.reducedMotion}
                  onCheckedChange={(checked) => updateSetting('appearance', 'reducedMotion', checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">System Customization</h2>
          <p className="text-muted-foreground">
            Personalize your workspace with advanced customization options.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {unsavedChanges && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Unsaved Changes
            </Badge>
          )}
          
          <Button variant="outline" onClick={resetSettings}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          
          <Button variant="outline" onClick={exportSettings}>
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
              onChange={importSettings}
            />
          </Button>
          
          <Button onClick={saveSettings}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Preview Mode Toggle */}
      <Alert>
        <Sparkles className="w-4 h-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Changes are applied in real-time. Save to make them permanent.</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {previewMode ? 'Exit Preview' : 'Preview Mode'}
          </Button>
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="w-4 h-4" />
            <span className="hidden sm:inline">Layout</span>
          </TabsTrigger>
          <TabsTrigger value="behavior" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span className="hidden sm:inline">Behavior</span>
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Accessibility</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="mt-6">
          {renderAppearanceSettings()}
        </TabsContent>

        <TabsContent value="layout" className="mt-6">
          {renderLayoutSettings()}
        </TabsContent>

        <TabsContent value="behavior" className="mt-6">
          {renderBehaviorSettings()}
        </TabsContent>

        <TabsContent value="accessibility" className="mt-6">
          {renderAccessibilitySettings()}
        </TabsContent>
      </Tabs>
    </div>
  );
}