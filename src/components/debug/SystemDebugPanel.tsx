import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Database, 
  Users, 
  Code, 
  RefreshCw, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  EyeOff 
} from 'lucide-react';

interface SystemInfo {
  localStorage: {
    available: boolean;
    items: Record<string, any>;
    quota: string;
  };
  sessionStorage: {
    available: boolean;
    items: Record<string, any>;
  };
  demoAccounts: {
    available: boolean;
    count: number;
    accounts: any[];
  };
  authSystem: {
    available: boolean;
    hooks: string[];
  };
  errors: string[];
}

const SystemDebugPanel = ({ onClose }: { onClose: () => void }) => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSensitive, setShowSensitive] = useState(false);

  const gatherSystemInfo = async () => {
    setIsLoading(true);
    const info: SystemInfo = {
      localStorage: { available: false, items: {}, quota: 'Unknown' },
      sessionStorage: { available: false, items: {} },
      demoAccounts: { available: false, count: 0, accounts: [] },
      authSystem: { available: false, hooks: [] },
      errors: []
    };

    // Test localStorage
    try {
      info.localStorage.available = typeof Storage !== "undefined" && !!window.localStorage;
      if (info.localStorage.available) {
        const items: Record<string, any> = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            try {
              const value = localStorage.getItem(key);
              items[key] = value ? JSON.parse(value) : value;
            } catch {
              items[key] = localStorage.getItem(key); // Raw value if not JSON
            }
          }
        }
        info.localStorage.items = items;

        // Get storage quota info
        if ('storage' in navigator && 'estimate' in navigator.storage) {
          const estimate = await navigator.storage.estimate();
          const used = estimate.usage || 0;
          const quota = estimate.quota || 0;
          info.localStorage.quota = `${Math.round(used / 1024)} KB / ${Math.round(quota / 1024 / 1024)} MB`;
        }
      }
    } catch (error) {
      info.errors.push(`localStorage error: ${error}`);
    }

    // Test sessionStorage
    try {
      info.sessionStorage.available = typeof Storage !== "undefined" && !!window.sessionStorage;
      if (info.sessionStorage.available) {
        const items: Record<string, any> = {};
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key) {
            try {
              const value = sessionStorage.getItem(key);
              items[key] = value ? JSON.parse(value) : value;
            } catch {
              items[key] = sessionStorage.getItem(key);
            }
          }
        }
        info.sessionStorage.items = items;
      }
    } catch (error) {
      info.errors.push(`sessionStorage error: ${error}`);
    }

    // Test demo accounts
    try {
      const { demoAccounts } = await import('../../constants/demoAccounts');
      info.demoAccounts.available = Array.isArray(demoAccounts);
      info.demoAccounts.count = demoAccounts?.length || 0;
      info.demoAccounts.accounts = demoAccounts || [];
    } catch (error) {
      info.errors.push(`Demo accounts error: ${error}`);
    }

    // Test auth system
    try {
      const authModule = await import('../../hooks/useLocalAuth');
      info.authSystem.available = typeof authModule.useLocalAuth === 'function';
      info.authSystem.hooks = Object.keys(authModule);
    } catch (error) {
      info.errors.push(`Auth system error: ${error}`);
    }

    setSystemInfo(info);
    setIsLoading(false);
  };

  useEffect(() => {
    gatherSystemInfo();
  }, []);

  const clearStorage = (type: 'local' | 'session' | 'both') => {
    try {
      if (type === 'local' || type === 'both') {
        localStorage.clear();
      }
      if (type === 'session' || type === 'both') {
        sessionStorage.clear();
      }
      gatherSystemInfo(); // Refresh info
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };

  const removeStorageItem = (storage: 'local' | 'session', key: string) => {
    try {
      if (storage === 'local') {
        localStorage.removeItem(key);
      } else {
        sessionStorage.removeItem(key);
      }
      gatherSystemInfo();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>جارٍ جمع معلومات النظام...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!systemInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-4" />
            <p>فشل في جمع معلومات النظام</p>
            <Button onClick={gatherSystemInfo} className="mt-4">
              إعادة المحاولة
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">لوحة تشخيص النظام</h1>
          <div className="space-x-2 space-x-reverse">
            <Button onClick={() => setShowSensitive(!showSensitive)} variant="outline" size="sm">
              {showSensitive ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showSensitive ? 'إخفاء' : 'إظهار'} البيانات الحساسة
            </Button>
            <Button onClick={gatherSystemInfo} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              تحديث
            </Button>
            <Button onClick={onClose} variant="outline" size="sm">
              إغلاق
            </Button>
          </div>
        </div>

        {/* Errors */}
        {systemInfo.errors.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              <div className="space-y-1">
                <strong>أخطاء مكتشفة:</strong>
                {systemInfo.errors.map((error, index) => (
                  <div key={index} className="text-sm">• {error}</div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Storage Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                حالة التخزين
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* localStorage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">localStorage</span>
                  {systemInfo.localStorage.available ? (
                    <Badge variant="outline" className="text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      متاح
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="w-3 h-3 mr-1" />
                      غير متاح
                    </Badge>
                  )}
                </div>
                
                {systemInfo.localStorage.available && (
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span>العناصر المحفوظة: {Object.keys(systemInfo.localStorage.items).length}</span>
                      <Button
                        onClick={() => clearStorage('local')}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        مسح الكل
                      </Button>
                    </div>
                    <div>استخدام التخزين: {systemInfo.localStorage.quota}</div>
                    
                    {Object.entries(systemInfo.localStorage.items).map(([key, value]) => (
                      <div key={key} className="mt-2 p-2 bg-white rounded border">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-mono text-xs text-blue-600">{key}</span>
                          <Button
                            onClick={() => removeStorageItem('local', key)}
                            variant="outline"
                            size="sm"
                            className="h-6 px-2 text-xs"
                          >
                            حذف
                          </Button>
                        </div>
                        {showSensitive && (
                          <pre className="text-xs text-gray-600 whitespace-pre-wrap bg-gray-100 p-2 rounded">
                            {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* sessionStorage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">sessionStorage</span>
                  {systemInfo.sessionStorage.available ? (
                    <Badge variant="outline" className="text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      متاح
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="w-3 h-3 mr-1" />
                      غير متاح
                    </Badge>
                  )}
                </div>
                
                {systemInfo.sessionStorage.available && Object.keys(systemInfo.sessionStorage.items).length > 0 && (
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span>العناصر المحفوظة: {Object.keys(systemInfo.sessionStorage.items).length}</span>
                      <Button
                        onClick={() => clearStorage('session')}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        مسح الكل
                      </Button>
                    </div>
                    
                    {Object.entries(systemInfo.sessionStorage.items).map(([key, value]) => (
                      <div key={key} className="mt-2 p-2 bg-white rounded border">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-mono text-xs text-blue-600">{key}</span>
                          <Button
                            onClick={() => removeStorageItem('session', key)}
                            variant="outline"
                            size="sm"
                            className="h-6 px-2 text-xs"
                          >
                            حذف
                          </Button>
                        </div>
                        {showSensitive && (
                          <pre className="text-xs text-gray-600 whitespace-pre-wrap bg-gray-100 p-2 rounded">
                            {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Demo Accounts & Auth System */}
          <div className="space-y-6">
            
            {/* Demo Accounts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  الحسابات التجريبية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span>حالة النظام:</span>
                  {systemInfo.demoAccounts.available ? (
                    <Badge variant="outline" className="text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      متاح ({systemInfo.demoAccounts.count} حساب)
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="w-3 h-3 mr-1" />
                      غير متاح
                    </Badge>
                  )}
                </div>

                {systemInfo.demoAccounts.available && showSensitive && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">قائمة الحسابات:</div>
                    {systemInfo.demoAccounts.accounts.map((account, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div><strong>الاسم:</strong> {account.user.name}</div>
                          <div><strong>الدور:</strong> {account.user.role}</div>
                          <div><strong>البريد:</strong> {account.email}</div>
                          <div><strong>كلمة المرور:</strong> {account.password}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Auth System */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  نظام المصادقة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span>حالة النظام:</span>
                  {systemInfo.authSystem.available ? (
                    <Badge variant="outline" className="text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      يعمل
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="w-3 h-3 mr-1" />
                      لا يعمل
                    </Badge>
                  )}
                </div>

                {systemInfo.authSystem.available && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Hooks المتاحة:</div>
                    <div className="bg-gray-50 p-3 rounded">
                      {systemInfo.authSystem.hooks.map((hook, index) => (
                        <Badge key={index} variant="outline" className="mr-2 mb-2">
                          {hook}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                onClick={() => clearStorage('both')}
                variant="outline"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                مسح جميع البيانات
              </Button>
              
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                تحديث الصفحة
              </Button>
              
              <Button
                onClick={() => {
                  clearStorage('both');
                  setTimeout(() => window.location.reload(), 100);
                }}
                variant="outline"
                className="text-orange-600 hover:text-orange-700"
              >
                إعادة تعيين كاملة
              </Button>
              
              <Button
                onClick={onClose}
                variant="outline"
              >
                العودة لتسجيل الدخول
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemDebugPanel;