import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

const AuthDiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState({
    localStorage: false,
    demoAccounts: false,
    authHooks: false,
    errors: [] as string[]
  });

  useEffect(() => {
    const runQuickDiagnostics = async () => {
      const results = {
        localStorage: false,
        demoAccounts: false,
        authHooks: false,
        errors: [] as string[]
      };

      // Test localStorage
      try {
        localStorage.setItem('test', 'value');
        localStorage.removeItem('test');
        results.localStorage = true;
      } catch (error) {
        results.errors.push('localStorage غير متاح');
      }

      // Test demo accounts
      try {
        const { demoAccounts } = await import('../../constants/demoAccounts');
        results.demoAccounts = Array.isArray(demoAccounts) && demoAccounts.length > 0;
        if (!results.demoAccounts) {
          results.errors.push('الحسابات التجريبية غير متاحة');
        }
      } catch (error) {
        results.errors.push('فشل تحميل الحسابات التجريبية');
      }

      // Test auth hooks
      try {
        const { useLocalAuth } = await import('../../hooks/useLocalAuth');
        results.authHooks = typeof useLocalAuth === 'function';
        if (!results.authHooks) {
          results.errors.push('hooks المصادقة غير متاحة');
        }
      } catch (error) {
        results.errors.push('فشل تحميل hooks المصادقة');
      }

      setDiagnostics(results);
    };

    runQuickDiagnostics();
  }, []);

  const allSystemsOk = diagnostics.localStorage && diagnostics.demoAccounts && diagnostics.authHooks;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          {allSystemsOk ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-500" />
              حالة النظام: جيدة
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              حالة النظام: تحتاج فحص
            </>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">localStorage</span>
            {diagnostics.localStorage ? (
              <Badge variant="outline" className="text-green-600 border-green-200">
                متاح
              </Badge>
            ) : (
              <Badge variant="destructive">
                غير متاح
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">الحسابات التجريبية</span>
            {diagnostics.demoAccounts ? (
              <Badge variant="outline" className="text-green-600 border-green-200">
                متاحة
              </Badge>
            ) : (
              <Badge variant="destructive">
                غير متاحة
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">نظام المصادقة</span>
            {diagnostics.authHooks ? (
              <Badge variant="outline" className="text-green-600 border-green-200">
                يعمل
              </Badge>
            ) : (
              <Badge variant="destructive">
                لا يعمل
              </Badge>
            )}
          </div>
        </div>

        {diagnostics.errors.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <div className="space-y-1">
                <div className="font-semibold">مشاكل مكتشفة:</div>
                {diagnostics.errors.map((error, index) => (
                  <div key={index} className="text-xs">• {error}</div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {allSystemsOk && (
          <Alert>
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-sm text-green-700">
              جميع الأنظمة تعمل بشكل طبيعي
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthDiagnostics;