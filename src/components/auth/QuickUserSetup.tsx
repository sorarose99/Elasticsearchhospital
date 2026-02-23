import React, { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';

interface QuickUserSetupProps {
  onComplete?: () => void;
  onClose?: () => void;
}

export const QuickUserSetup: React.FC<QuickUserSetupProps> = ({ onComplete, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const setupDemoUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://uszizembzrusjhpoeibm.supabase.co/functions/v1/make-server-89df438c/setup-demo-users`, {
        method: 'POST'
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        setResults(result.results);
        if (onComplete) {
          setTimeout(onComplete, 2000);
        }
      } else {
        setError(result.error || 'Failed to setup demo users');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const createdCount = results?.filter((r: any) => r.status === 'created').length || 0;
  const existingCount = results?.filter((r: any) => r.status === 'exists').length || 0;
  const errorCount = results?.filter((r: any) => r.status === 'error').length || 0;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 rounded-full p-3">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <CardTitle>إعداد المستخدمين التجريبيين</CardTitle>
        <CardDescription>
          إنشاء حسابات المستخدمين للنظام
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!results && !loading && (
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              سيتم إنشاء 8 مستخدمين تجريبيين مع أدوار مختلفة:
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• admin@clinic.com - مدير النظام</li>
              <li>• doctor@clinic.com - طبيب</li>
              <li>• nurse@clinic.com - ممرضة</li>
              <li>• reception@clinic.com - استقبال</li>
              <li>• lab@clinic.com - مختبر</li>
              <li>• pharmacy@clinic.com - صيدلية</li>
              <li>• radiology@clinic.com - أشعة</li>
              <li>• billing@clinic.com - فوترة</li>
            </ul>
            
            <Button 
              onClick={setupDemoUsers} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  جارٍ إنشاء المستخدمين...
                </>
              ) : (
                'إنشاء المستخدمين التجريبيين'
              )}
            </Button>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
            <p className="text-sm text-muted-foreground mt-2">
              جارٍ إنشاء المستخدمين...
            </p>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {results && (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                تم إكمال إعداد المستخدمين!
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{createdCount}</div>
                <div className="text-xs text-green-600">تم إنشاؤهم</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{existingCount}</div>
                <div className="text-xs text-blue-600">موجودين مسبقاً</div>
              </div>
              {errorCount > 0 && (
                <div className="bg-red-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                  <div className="text-xs text-red-600">أخطاء</div>
                </div>
              )}
            </div>

            <div className="text-center">
              <p className="text-sm text-green-600 mb-3">
                يمكنك الآن تسجيل الدخول باستخدام أي من الحسابات التجريبية
              </p>
              {onClose && (
                <Button onClick={onClose} variant="outline" className="w-full">
                  العودة لتسجيل الدخول
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickUserSetup;