import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { useLanguage } from '../../services/LanguageService';
import ThemeLanguageToggle from '../settings/ThemeLanguageToggle';
import { 
  Settings, 
  Database, 
  Shield, 
  Globe, 
  RefreshCw, 
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Server
} from 'lucide-react';

interface SystemSettingsProps {
  language?: 'en' | 'ar'; // Make optional since we're using the service
}

const SystemSettings: React.FC<SystemSettingsProps> = ({ language: legacyLanguage }) => {
  const [showKeys, setShowKeys] = useState(false);
  const [settings, setSettings] = useState({
    projectId: '',
    supabaseUrl: '',
    anonKey: '',
    serviceRoleKey: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const { t, isRTL } = useLanguage();

  useEffect(() => {
    // Load current settings
    loadCurrentSettings();
  }, []);

  const loadCurrentSettings = () => {
    // Get current project info from environment or defaults - using the correct project ID
    setSettings({
      projectId: 'uszizembzrusjhpoeibm',
      supabaseUrl: 'https://uszizembzrusjhpoeibm.supabase.co',
      anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzeml6ZW1ienJ1c2pocG9laWJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1OTYwODQsImV4cCI6MjA3MTE3MjA4NH0.RW-OXB8krIUGX3rz2qwAUtm0TGafTzmVIMR9P7h8jvU',
      serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzeml6ZW1ienJ1c2pocG9laWJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTU5NjA4NCwiZXhwIjoyMDcxMTcyMDg0fQ.tD5bBa_nSiJ-0M5KlhQF8gUOvFYCobqMDvLBKd8nNJ8'
    });
  };

  const testConnection = async () => {
    setLoading(true);
    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMessage({ type: 'success', text: t('status.connected') });
    } catch (error) {
      setMessage({ type: 'error', text: t('status.disconnected') });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would update environment variables
      // For now, just simulate saving
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: t('success.saved') });
    } catch (error) {
      setMessage({ type: 'error', text: t('error.generic') });
    } finally {
      setLoading(false);
    }
  };

  const maskKey = (key: string) => {
    if (!key || key.length < 8) return key;
    if (showKeys) return key;
    return `${key.substring(0, 8)}${'*'.repeat(Math.max(0, key.length - 16))}${key.substring(Math.max(8, key.length - 8))}`;
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Settings className="h-8 w-8 text-blue-600" />
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className="text-2xl font-bold">{t('settings.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('settings.system')}</p>
        </div>
        <div className="ml-auto">
          <ThemeLanguageToggle />
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20' : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'}>
          <AlertDescription className={message.type === 'error' ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="database" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="database" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Database className="h-4 w-4" />
            {t('settings.system')}
          </TabsTrigger>
          <TabsTrigger value="security" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Shield className="h-4 w-4" />
            {t('settings.security')}
          </TabsTrigger>
          <TabsTrigger value="general" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Globe className="h-4 w-4" />
            {t('settings.general')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="database" className="space-y-6">
          {/* Firebase Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Server className="h-5 w-5" />
                Firebase {t('common.settings')}
              </CardTitle>
              <CardDescription>
                {t('settings.system')} Firebase {t('common.settings')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Badge variant="outline">
                  {t('common.project')}: {settings.projectId}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowKeys(!showKeys)}
                  className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  {showKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showKeys ? t('common.hide') : t('common.show')}
                </Button>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectId">{t('common.project')} ID</Label>
                  <Input
                    id="projectId"
                    value={settings.projectId}
                    onChange={(e) => setSettings({...settings, projectId: e.target.value})}
                    placeholder="uszizembzrusjhpoeibm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supabaseUrl">Supabase URL</Label>
                  <Input
                    id="supabaseUrl"
                    value={settings.supabaseUrl}
                    onChange={(e) => setSettings({...settings, supabaseUrl: e.target.value})}
                    placeholder="https://your-project.supabase.co"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="anonKey">{t('common.public')} Key</Label>
                  <Input
                    id="anonKey"
                    type={showKeys ? "text" : "password"}
                    value={maskKey(settings.anonKey)}
                    onChange={(e) => setSettings({...settings, anonKey: e.target.value})}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceKey">Service Role Key</Label>
                  <Input
                    id="serviceKey"
                    type={showKeys ? "text" : "password"}
                    value={maskKey(settings.serviceRoleKey)}
                    onChange={(e) => setSettings({...settings, serviceRoleKey: e.target.value})}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  />
                </div>
              </div>

              <div className={`flex gap-3 pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button
                  onClick={testConnection}
                  disabled={loading}
                  variant="outline"
                  className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                  {loading ? t('common.loading') : t('common.test')}
                </Button>

                <Button
                  onClick={saveSettings}
                  disabled={loading}
                  className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {loading ? t('common.saving') : t('common.save')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Shield className="h-5 w-5" />
                {t('settings.security')}
              </CardTitle>
              <CardDescription>{t('settings.security')} {t('common.settings')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('settings.security')} {t('common.comingSoon')}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Globe className="h-5 w-5" />
                {t('settings.general')}
              </CardTitle>
              <CardDescription>{t('settings.general')} {t('common.settings')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('settings.general')} {t('common.comingSoon')}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;