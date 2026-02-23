import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useLocalAuth } from '../../hooks/useLocalAuth';

const QuickLoginTest = () => {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [isRunning, setIsRunning] = useState(false);
  const { signIn, signOut } = useLocalAuth();

  const runQuickTest = async () => {
    setIsRunning(true);
    const results: Record<string, boolean> = {};

    try {
      // Test 1: Admin login
      console.log('🧪 Testing admin login...');
      const adminResult = await signIn('admin@clinic.com', 'admin123');
      results['admin'] = !adminResult.error;
      
      if (results['admin']) {
        // Test 2: Logout
        console.log('🧪 Testing logout...');
        const logoutResult = await signOut();
        results['logout'] = !logoutResult.error;
        
        // Test 3: Doctor login
        console.log('🧪 Testing doctor login...');
        const doctorResult = await signIn('doctor@clinic.com', 'doctor123');
        results['doctor'] = !doctorResult.error;
        
        if (results['doctor']) {
          // Test 4: Final logout
          await signOut();
        }
      }
    } catch (error) {
      console.error('Test error:', error);
    }

    setTestResults(results);
    setIsRunning(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-sm">اختبار سريع لتسجيل الدخول</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Button 
          onClick={runQuickTest} 
          disabled={isRunning}
          className="w-full"
          size="sm"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              جارٍ الاختبار...
            </>
          ) : (
            'تشغيل الاختبار السريع'
          )}
        </Button>

        {Object.keys(testResults).length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground">نتائج الاختبار:</div>
            
            {Object.entries(testResults).map(([test, success]) => (
              <div key={test} className="flex items-center justify-between">
                <span className="text-xs">
                  {test === 'admin' ? 'تسجيل دخول المدير' :
                   test === 'doctor' ? 'تسجيل دخول الطبيب' :
                   test === 'logout' ? 'تسجيل الخروج' :
                   test}
                </span>
                {success ? (
                  <Badge variant="outline" className="text-green-600 border-green-200 text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    نجح
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-xs">
                    <XCircle className="w-3 h-3 mr-1" />
                    فشل
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickLoginTest;