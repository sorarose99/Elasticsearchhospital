import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Stethoscope, AlertCircle, CheckCircle, Loader2, Building2, Camera } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { useLocalAuth } from '../../hooks/useLocalAuth';
import { localApiService } from '../../services/LocalApiService';
import { demoAccounts } from '../../constants/demoAccounts';
import BillingSystemTest from '../BillingSystemTest';
import QuickUserSetup from './QuickUserSetup';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [showSetup, setShowSetup] = useState(false);
  const [showQuickSetup, setShowQuickSetup] = useState(false);
  
  const { signIn, user, loading: authLoading } = useLocalAuth();

  // Test API connection on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🔍 Testing local API service connection...');
        const result = await localApiService.testConnection();
        if (result.success) {
          setConnectionStatus('connected');
          console.log('✅ Local API service connected:', result.data);
        } else {
          throw new Error(result.error || 'Connection test failed');
        }
      } catch (error) {
        console.error('❌ Local API connection test failed:', error);
        setConnectionStatus('error');
      }
    };

    testConnection();
  }, []);

  // Note: Redirect logic is handled by AppRouter, not here

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsLoading(true);

    try {
      if (!email || !password) {
        setFormError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
        return;
      }

      console.log('🔐 Attempting local sign in for:', email);
      const result = await signIn(email, password);
      
      if (result.error) {
        console.error('❌ Local sign in failed:', result.error);
        // Check if it's an invalid credentials error and suggest available accounts
        if (result.error.includes('Invalid login credentials') || result.error.includes('Invalid credentials')) {
          setFormError(`بيانات تسجيل الدخول غير صحيحة. يرجى استخدام أحد الحسابات التجريبية المعروضة أو إنشاء حساب جديد.`);
        } else {
          setFormError(result.error);
        }
        return;
      }

      console.log('✅ Local sign in successful for:', email);

      // Success - auth state change will handle redirect
    } catch (error: any) {
      console.error('Login error:', error);
      setFormError(error.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccountsForDisplay = demoAccounts.map((account, index) => ({
    email: account.email,
    password: account.password,
    role: account.user.role === 'admin' ? 'مدير النظام' :
          account.user.role === 'doctor' ? 'طبيب' :
          account.user.role === 'nurse' ? 'ممرضة' :
          account.user.role === 'receptionist' ? 'استقبال' :
          account.user.role === 'lab_tech' ? 'مختبر' :
          account.user.role === 'pharmacist' ? 'صيدلي' :
          account.user.role === 'radiologist' ? 'أشعة' :
          account.user.role === 'billing' ? 'فوترة' :
          account.user.role === 'hr_manager' ? 'موارد بشرية' :
          account.user.role === 'inventory_manager' ? 'مخازن' :
          account.user.role,
    name: account.user.name,
    icon: account.user.role === 'admin' ? Building2 :
          account.user.role === 'doctor' ? Stethoscope :
          account.user.role === 'nurse' ? Stethoscope :
          Building2
  }));

  const fillDemoAccount = (account: any) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setFormError('');
    setIsLoading(true);

    try {
      console.log('🎯 Attempting demo login for:', demoEmail);
      const result = await signIn(demoEmail, demoPassword);
      
      if (result.error) {
        console.error('❌ Demo login failed:', result.error);
        setFormError(`فشل تسجيل الدخول للحساب ${demoEmail}: ${result.error}`);
        return;
      }
      
      console.log('✅ Demo login successful for:', demoEmail);
    } catch (error: any) {
      console.error('Demo login error:', error);
      setFormError(error.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  // Show system setup if requested
  if (showSetup) {
    return <BillingSystemTest onClose={() => setShowSetup(false)} />;
  }

  // Show quick user setup if requested
  if (showQuickSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <QuickUserSetup 
          onComplete={() => {
            setShowQuickSetup(false);
            // Refresh the page to reload auth state
            window.location.reload();
          }}
          onClose={() => setShowQuickSetup(false)} 
        />
      </div>
    );
  }

  // Show loading if auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-medical-primary mx-auto" />
          <p className="text-muted-foreground">جارٍ تحميل النظام...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Login Form */}
        <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-medical-primary rounded-full p-4">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">نظام إدارة المستشفى</CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                مرحباً بك، يرجى تسجيل الدخول للمتابعة
              </CardDescription>
            </div>
            
            {/* Connection Status */}
            <div className="flex items-center justify-center space-x-2 space-x-reverse">
              {connectionStatus === 'checking' && (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
                  <span className="text-sm text-yellow-600">جارٍ فحص الاتصال...</span>
                </>
              )}
              {connectionStatus === 'connected' && (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">متصل بالخادم</span>
                </>
              )}
              {connectionStatus === 'error' && (
                <>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">خطأ في الاتصال بالخادم</span>
                </>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@hospital.com"
                  className="text-right"
                  required
                  disabled={isLoading || connectionStatus === 'error'}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="text-right pr-10"
                    required
                    disabled={isLoading || connectionStatus === 'error'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isLoading || connectionStatus === 'error'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {formError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <div>{formError}</div>
                      {(formError.includes('بيانات تسجيل الدخول غير صحيحة') || formError.includes('Invalid login credentials')) && (
                        <div className="flex gap-2 mt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setShowQuickSetup(true)}
                            className="flex-1"
                          >
                            إنشاء المستخدمين
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setShowSetup(true)}
                            className="flex-1"
                          >
                            إعداد النظام
                          </Button>
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-medical-primary hover:bg-medical-primary/90"
                disabled={isLoading || connectionStatus === 'error'}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جارٍ تسجيل الدخول...
                  </>
                ) : (
                  'تسجيل الدخول'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-sm">✨</span>
              </div>
              حسابات تجريبية
            </CardTitle>
            <CardDescription>
              اضغط على أي حساب للدخول مباشرة - نظام متكامل full stack
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {demoAccountsForDisplay.map((account, index) => {
                const Icon = account.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-between h-auto p-4 hover:bg-gray-50 transition-colors text-right"
                    onClick={() => handleDemoLogin(account.email, account.password)}
                    disabled={isLoading}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <div className="text-right">
                        <div className="font-medium">{account.name}</div>
                        <div className="text-sm text-muted-foreground">{account.role}</div>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-sm text-muted-foreground">{account.email}</div>
                      <div className="text-xs text-muted-foreground">{account.password}</div>
                    </div>
                  </Button>
                );
              })}
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 text-center">
                  نظام إدارة مستشفى متكامل - يعمل في الوضع المحلي مع بيانات تجريبية
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowQuickSetup(true)}
                  className="text-xs"
                >
                  إنشاء المستخدمين
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowSetup(true)}
                  className="text-xs"
                >
                  إعداد النظام
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="fixed bottom-4 w-full text-center text-sm text-muted-foreground">
        © 2024 نظام إدارة المستشفى - Local Demo Version. جميع الحقوق محفوظة.
      </div>
    </div>
  );
};

export default LoginPage;