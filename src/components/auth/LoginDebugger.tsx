import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, Database, User, Code } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { demoAccounts } from '../../constants/demoAccounts';
import SystemDebugPanel from '../debug/SystemDebugPanel';

interface DebugInfo {
  localStorage: boolean;
  sessionStorage: boolean;
  demoAccounts: boolean;
  authHooks: boolean;
  apiService: boolean;
  error: string | null;
}

const LoginDebugger = ({ onClose }: { onClose: () => void }) => {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    localStorage: false,
    sessionStorage: false,
    demoAccounts: false,
    authHooks: false,
    apiService: false,
    error: null
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [consoleErrors, setConsoleErrors] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    // Capture console errors
    const originalConsoleError = console.error;
    const errors: string[] = [];
    
    console.error = (...args) => {
      const errorMsg = args.map(arg => 
        typeof arg === 'string' ? arg : JSON.stringify(arg)
      ).join(' ');
      errors.push(errorMsg);
      setConsoleErrors(prev => [...prev, errorMsg].slice(-10)); // Keep last 10 errors
      originalConsoleError(...args);
    };

    runDiagnostics();

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  const runDiagnostics = async () => {
    setIsLoading(true);
    const diagnostics: DebugInfo = {
      localStorage: false,
      sessionStorage: false,
      demoAccounts: false,
      authHooks: false,
      apiService: false,
      error: null
    };

    try {
      // Test localStorage
      try {
        localStorage.setItem('test', 'value');
        const testValue = localStorage.getItem('test');
        localStorage.removeItem('test');
        diagnostics.localStorage = testValue === 'value';
      } catch (error) {
        console.error('localStorage test failed:', error);
        diagnostics.error = 'localStorage not available';
      }

      // Test sessionStorage
      try {
        sessionStorage.setItem('test', 'value');
        const testValue = sessionStorage.getItem('test');
        sessionStorage.removeItem('test');
        diagnostics.sessionStorage = testValue === 'value';
      } catch (error) {
        console.error('sessionStorage test failed:', error);
        diagnostics.error = diagnostics.error || 'sessionStorage not available';
      }

      // Test demo accounts
      try {
        diagnostics.demoAccounts = Array.isArray(demoAccounts) && demoAccounts.length > 0;
        if (!diagnostics.demoAccounts) {
          throw new Error('Demo accounts not loaded properly');
        }
      } catch (error) {
        console.error('Demo accounts test failed:', error);
        diagnostics.error = diagnostics.error || 'Demo accounts not available';
      }

      // Test auth hooks
      try {
        const { useLocalAuth } = await import('../../hooks/useLocalAuth');
        diagnostics.authHooks = typeof useLocalAuth === 'function';
      } catch (error) {
        console.error('Auth hooks test failed:', error);
        diagnostics.error = diagnostics.error || 'Auth hooks not available';
      }

      // Test API service
      try {
        const { localApiService } = await import('../../services/LocalApiService');
        const result = await localApiService.ping();
        diagnostics.apiService = result.success;
      } catch (error) {
        console.error('API service test failed:', error);
        diagnostics.error = diagnostics.error || 'API service not available';
      }

    } catch (globalError) {
      console.error('Global diagnostics error:', globalError);
      diagnostics.error = globalError instanceof Error ? globalError.message : 'Unknown error';
    }

    setDebugInfo(diagnostics);
    setIsLoading(false);
  };

  const clearAllData = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      console.log('All storage cleared');
      window.location.reload();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  };

  const testLoginFlow = async () => {
    try {
      const { useLocalAuth } = await import('../../hooks/useLocalAuth');
      const testEmail = 'admin@clinic.com';
      const testPassword = 'admin123';
      
      console.log('Testing login flow with:', testEmail);
      
      // This won't work in component context, but it will test the import
      console.log('useLocalAuth imported successfully');
      
    } catch (error) {
      console.error('Login flow test failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-6 h-6" />
            تشخيص مشاكل تسجيل الدخول
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Diagnostics Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Storage Tests */}
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Database className="w-4 h-4" />
                اختبار التخزين
              </h3>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {debugInfo.localStorage ? 
                    <CheckCircle className="w-4 h-4 text-green-500" /> : 
                    <XCircle className="w-4 h-4 text-red-500" />
                  }
                  <span className="text-sm">localStorage</span>
                </div>
                <div className="flex items-center gap-2">
                  {debugInfo.sessionStorage ? 
                    <CheckCircle className="w-4 h-4 text-green-500" /> : 
                    <XCircle className="w-4 h-4 text-red-500" />
                  }
                  <span className="text-sm">sessionStorage</span>
                </div>
              </div>
            </div>

            {/* Demo Accounts Test */}
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="w-4 h-4" />
                الحسابات التجريبية
              </h3>
              <div className="flex items-center gap-2">
                {debugInfo.demoAccounts ? 
                  <CheckCircle className="w-4 h-4 text-green-500" /> : 
                  <XCircle className="w-4 h-4 text-red-500" />
                }
                <span className="text-sm">
                  {debugInfo.demoAccounts ? 
                    `${demoAccounts.length} حساب متاح` : 
                    'غير متاح'
                  }
                </span>
              </div>
            </div>

            {/* System Tests */}
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Code className="w-4 h-4" />
                النظام
              </h3>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {debugInfo.authHooks ? 
                    <CheckCircle className="w-4 h-4 text-green-500" /> : 
                    <XCircle className="w-4 h-4 text-red-500" />
                  }
                  <span className="text-sm">Auth Hooks</span>
                </div>
                <div className="flex items-center gap-2">
                  {debugInfo.apiService ? 
                    <CheckCircle className="w-4 h-4 text-green-500" /> : 
                    <XCircle className="w-4 h-4 text-red-500" />
                  }
                  <span className="text-sm">API Service</span>
                </div>
              </div>
            </div>
          </div>

          {/* Error Information */}
          {debugInfo.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">خطأ مكتشف:</h4>
              <Badge variant="destructive" className="mb-2">
                {debugInfo.error}
              </Badge>
            </div>
          )}

          {/* Console Errors */}
          {consoleErrors.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">أخطاء وحدة التحكم:</h4>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {consoleErrors.map((error, index) => (
                  <div key={index} className="text-xs font-mono text-red-600 bg-white p-2 rounded border">
                    {error}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Demo Accounts List */}
          {debugInfo.demoAccounts && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">الحسابات التجريبية المتاحة:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {demoAccounts.map((account, index) => (
                  <div key={index} className="text-sm bg-white p-2 rounded border">
                    <div className="font-medium">{account.user.name}</div>
                    <div className="text-blue-600">{account.email}</div>
                    <div className="text-green-600">{account.password}</div>
                    <div className="text-gray-500">{account.user.role}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Browser Information */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">معلومات المتصفح:</h4>
            <div className="text-sm space-y-1">
              <div><strong>User Agent:</strong> {navigator.userAgent}</div>
              <div><strong>Language:</strong> {navigator.language}</div>
              <div><strong>Online:</strong> {navigator.onLine ? 'نعم' : 'لا'}</div>
              <div><strong>Cookies Enabled:</strong> {navigator.cookieEnabled ? 'نعم' : 'لا'}</div>
            </div>
          </div>

          {/* Storage Status */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">حالة التخزين:</h4>
            <div className="text-sm space-y-1">
              <div><strong>Current User:</strong> {localStorage.getItem('currentUser') ? 'موجود' : 'غير موجود'}</div>
              <div><strong>Auth Type:</strong> {localStorage.getItem('authType') || 'غير محدد'}</div>
              <div><strong>Preferred Auth:</strong> {localStorage.getItem('preferredAuthType') || 'غير محدد'}</div>
              <div><strong>Access Token:</strong> {localStorage.getItem('sb-access-token') ? 'موجود' : 'غير موجود'}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={runDiagnostics} 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  جارٍ الفحص...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  إعادة الفحص
                </>
              )}
            </Button>
            
            <Button 
              onClick={testLoginFlow}
              variant="outline"
              className="flex-1"
            >
              اختبار تسجيل الدخول
            </Button>
            
            <Button 
              onClick={clearAllData}
              variant="destructive"
              className="flex-1"
            >
              مسح جميع البيانات
            </Button>
            
            <Button 
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              إغلاق
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">تعليمات الإصلاح:</h4>
            <ol className="text-sm space-y-1 list-decimal list-inside text-blue-700">
              <li>تأكد من أن جميع الاختبارات تظهر علامة ✅ خضراء</li>
              <li>إذا كان localStorage غير متاح، تحقق من إعدادات المتصفح</li>
              <li>إذا كانت الحسابات التجريبية غير متاحة، تحقق من ملف constants/demoAccounts.ts</li>
              <li>إذا كان هناك أخطاء في وحدة التحكم، اقرأها بعناية لفهم السبب</li>
              <li>جرب مسح جميع البيانات إذا كانت هناك بيانات تالفة</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginDebugger;