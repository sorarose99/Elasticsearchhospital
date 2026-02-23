import React, { useState, useEffect } from 'react';
import { Stethoscope, Database, Wifi, WifiOff, Settings, AlertTriangle, CheckCircle, Loader2, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { supabase } from '../../utils/supabase/client';

interface AuthSwitcherProps {
  currentAuthType: 'local' | 'supabase';
  onSwitch: (type: 'local' | 'supabase') => void;
  onClose?: () => void;
}

interface ConnectionStatus {
  supabase: 'checking' | 'connected' | 'error';
  database: 'checking' | 'connected' | 'error';
  auth: 'checking' | 'connected' | 'error';
}

const AuthSwitcher = ({ currentAuthType, onSwitch, onClose }: AuthSwitcherProps) => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    supabase: 'checking',
    database: 'checking',
    auth: 'checking'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Test Supabase connections
  const testConnections = async () => {
    setIsLoading(true);
    setError('');
    
    setConnectionStatus({
      supabase: 'checking',
      database: 'checking',
      auth: 'checking'
    });

    // Test basic Supabase connection
    try {
      const { data, error: supabaseError } = await supabase.auth.getSession();
      
      if (supabaseError) {
        console.error('Supabase connection error:', supabaseError);
        setConnectionStatus(prev => ({ ...prev, supabase: 'error' }));
      } else {
        setConnectionStatus(prev => ({ ...prev, supabase: 'connected' }));
      }
    } catch (error) {
      console.error('Supabase test failed:', error);
      setConnectionStatus(prev => ({ ...prev, supabase: 'error' }));
    }

    // Test database connection
    try {
      const { data, error: dbError } = await supabase
        .from('_health_check')
        .select('*')
        .limit(1);
      
      if (dbError && dbError.code !== 'PGRST116') {
        console.error('Database connection error:', dbError);
        setConnectionStatus(prev => ({ ...prev, database: 'error' }));
      } else {
        setConnectionStatus(prev => ({ ...prev, database: 'connected' }));
      }
    } catch (error) {
      console.error('Database test failed:', error);
      setConnectionStatus(prev => ({ ...prev, database: 'error' }));
    }

    // Test auth service
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setConnectionStatus(prev => ({ ...prev, auth: 'connected' }));
    } catch (error) {
      console.error('Auth test failed:', error);
      setConnectionStatus(prev => ({ ...prev, auth: 'error' }));
    }

    setIsLoading(false);
  };

  useEffect(() => {
    testConnections();
  }, []);

  const handleAuthSwitch = (useSupabase: boolean) => {
    const newAuthType = useSupabase ? 'supabase' : 'local';
    
    if (newAuthType === 'supabase') {
      // Check if Supabase is ready
      const isSupabaseReady = connectionStatus.supabase === 'connected' && 
                              connectionStatus.auth === 'connected';
      
      if (!isSupabaseReady) {
        setError('Supabase connection is not ready. Please ensure your Supabase configuration is correct.');
        return;
      }
    }

    // Clear any existing auth data when switching
    if (newAuthType === 'local') {
      // Clear Supabase session
      supabase.auth.signOut();
      localStorage.removeItem('sb-access-token');
    } else {
      // Clear local auth data
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authType');
    }

    // Store the new auth type preference
    localStorage.setItem('preferredAuthType', newAuthType);
    
    onSwitch(newAuthType);
  };

  const getStatusIcon = (status: 'checking' | 'connected' | 'error') => {
    switch (status) {
      case 'checking':
        return <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />;
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: 'checking' | 'connected' | 'error') => {
    switch (status) {
      case 'checking':
        return 'text-yellow-600';
      case 'connected':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
    }
  };

  const isSupabaseReady = connectionStatus.supabase === 'connected' && 
                          connectionStatus.auth === 'connected';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Auth Selector */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-full p-4">
                <Settings className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl">اختيار نظام المصادقة</CardTitle>
              <CardDescription>
                اختر نظام تسجيل الدخول المناسب لك
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Current Status */}
            
            

            {/* Auth Type Selector */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="space-y-1">
                  <Label htmlFor="local-auth" className="text-base font-medium">
                    النظام المحلي (Local)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    يعمل بدون اتصال بالإنترنت مع حسابات تجريبية
                  </p>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <Badge variant="outline" className="text-green-700">
                      متاح دائماً
                    </Badge>
                  </div>
                </div>
                <Switch
                  id="local-auth"
                  checked={currentAuthType === 'local'}
                  onCheckedChange={(checked) => {
                    if (checked) handleAuthSwitch(false);
                  }}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="space-y-1">
                  <Label htmlFor="supabase-auth" className="text-base font-medium">
                    Supabase Database
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    قاعدة بيانات سحابية مع مميزات متقدمة
                  </p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(connectionStatus.supabase)}
                    <Badge variant={isSupabaseReady ? "outline" : "destructive"}>
                      {isSupabaseReady ? 'جاهز' : 'غير متاح'}
                    </Badge>
                  </div>
                </div>
                <Switch
                  id="supabase-auth"
                  checked={currentAuthType === 'supabase'}
                  onCheckedChange={(checked) => {
                    if (checked) handleAuthSwitch(true);
                  }}
                  disabled={!isSupabaseReady}
                />
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={testConnections}
                variant="outline"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    جارٍ الفحص...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    إعادة فحص الاتصال
                  </>
                )}
              </Button>
              {onClose && (
                <Button onClick={onClose} variant="secondary">
                  إغلاق
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Connection Status */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-6 h-6" />
              حالة الاتصال
            </CardTitle>
            <CardDescription>
              فحص الاتصال مع الخدمات المختلفة
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Supabase Connection */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {connectionStatus.supabase === 'connected' ? (
                  <Wifi className="w-5 h-5 text-green-500" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-500" />
                )}
                <div>
                  <div className="font-medium">Supabase Client</div>
                  <div className={`text-sm ${getStatusColor(connectionStatus.supabase)}`}>
                    {connectionStatus.supabase === 'checking' ? 'جارٍ الفحص...' :
                     connectionStatus.supabase === 'connected' ? 'متصل' : 'خطأ في الاتصال'}
                  </div>
                </div>
              </div>
              {getStatusIcon(connectionStatus.supabase)}
            </div>

            {/* Database Connection */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Database className={`w-5 h-5 ${
                  connectionStatus.database === 'connected' ? 'text-green-500' : 'text-red-500'
                }`} />
                <div>
                  <div className="font-medium">Database</div>
                  <div className={`text-sm ${getStatusColor(connectionStatus.database)}`}>
                    {connectionStatus.database === 'checking' ? 'جارٍ الفحص...' :
                     connectionStatus.database === 'connected' ? 'متصل' : 'خطأ في الاتصال'}
                  </div>
                </div>
              </div>
              {getStatusIcon(connectionStatus.database)}
            </div>

            {/* Auth Service */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Stethoscope className={`w-5 h-5 ${
                  connectionStatus.auth === 'connected' ? 'text-green-500' : 'text-red-500'
                }`} />
                <div>
                  <div className="font-medium">Authentication</div>
                  <div className={`text-sm ${getStatusColor(connectionStatus.auth)}`}>
                    {connectionStatus.auth === 'checking' ? 'جارٍ الفحص...' :
                     connectionStatus.auth === 'connected' ? 'متصل' : 'خطأ في الاتصال'}
                  </div>
                </div>
              </div>
              {getStatusIcon(connectionStatus.auth)}
            </div>

            {/* Configuration Info */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">معلومات التكوين</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div>Project ID: uszizembzrusjhpoeibm</div>
                <div>URL: https://uszizembzrusjhpoeibm.supabase.co</div>
                <div>Status: {isSupabaseReady ? '✅ جاهز' : '❌ غير جاهز'}</div>
              </div>
            </div>

            {/* Recommendations */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">التوصيات:</p>
                  <ul className="space-y-1 text-sm">
                    <li>• للبداية استخدم النظام المحلي (متاح دائماً)</li>
                    <li>• لاستخدام Supabase تأكد من إعداد قاعدة البيانات</li>
                    <li>• يمكن التبديل بين الأنظمة في أي وقت</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthSwitcher;