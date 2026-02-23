import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Stethoscope, AlertCircle, CheckCircle, Loader2, Building2, User, UserCheck, Users, Heart, TestTube, Pill, Zap, CreditCard, UserCog, Package, HelpCircle, Database, RefreshCw, UserPlus } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { useLocalAuth } from '../../hooks/useLocalAuth';
import { localApiService } from '../../services/LocalApiService';
import { demoAccounts } from '../../constants/demoAccounts';
import BillingSystemTest from '../BillingSystemTest';
import QuickUserSetup from './QuickUserSetup';
import HelpPage from './HelpPage';
import AuthSwitcher from './AuthSwitcher';
import AuthDiagnostics from './AuthDiagnostics';
import QuickLoginTest from './QuickLoginTest';

const EnhancedLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [showSetup, setShowSetup] = useState(false);
  const [showQuickSetup, setShowQuickSetup] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showAuthSwitcher, setShowAuthSwitcher] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsLoading(true);

    try {
      if (!email || !password) {
        setFormError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
        return;
      }

      console.log('🔐 Form submission - attempting local sign in for:', email);
      console.log('📊 Current auth loading state:', authLoading);
      console.log('📊 Current connection status:', connectionStatus);
      
      // Check if auth hook is available
      if (!signIn || typeof signIn !== 'function') {
        console.error('❌ signIn function not available');
        setFormError('نظام المصادقة غير متاح. يرجى تحديث الصفحة والمحاولة مرة أخرى.');
        return;
      }

      const result = await signIn(email, password);
      console.log('📊 Sign in result:', result);
      
      if (result.error) {
        console.error('❌ Local sign in failed:', result.error);
        if (result.error.includes('Invalid login credentials') || result.error.includes('Invalid credentials')) {
          setFormError(`بيانات تسجيل الدخول غير صحيحة. يرجى استخدام أحد الحسابات التجريبية المعروضة أو إنشاء حساب جديد.`);
        } else if (result.error.includes('localStorage') || result.error.includes('storage')) {
          setFormError(`مشكلة في تخزين البيانات: ${result.error}. يرجى التحقق من إعدادات المتصفح.`);
        } else {
          setFormError(`خطأ في تسجيل الدخول: ${result.error}`);
        }
        return;
      }

      console.log('✅ Local sign in successful for:', email);
      console.log('📊 Result data:', result.data);
      
    } catch (error: any) {
      console.error('❌ Login error caught:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      let errorMessage = 'حدث خطأ أثناء تسجيل الدخول';
      
      if (error.message.includes('localStorage')) {
        errorMessage = 'مشكلة في تخزين البيانات. يرجى التحقق من إعدادات المتصفح وتفعيل localStorage.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'مشكلة في الاتصال. يرجى التحقق من اتصال الإنترنت.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setFormError(errorMessage);
    } finally {
      setIsLoading(false);
      console.log('📊 Form submission completed, isLoading set to false');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Building2;
      case 'doctor': return Stethoscope;
      case 'nurse': return Heart;
      case 'receptionist': return UserCheck;
      case 'lab_tech': return TestTube;
      case 'pharmacist': return Pill;
      case 'radiologist': return Zap;
      case 'billing': return CreditCard;
      case 'hr_manager': return UserCog;
      case 'inventory_manager': return Package;
      default: return User;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'from-purple-500 to-purple-600';
      case 'doctor': return 'from-blue-500 to-blue-600';
      case 'nurse': return 'from-pink-500 to-pink-600';
      case 'receptionist': return 'from-green-500 to-green-600';
      case 'lab_tech': return 'from-yellow-500 to-yellow-600';
      case 'pharmacist': return 'from-teal-500 to-teal-600';
      case 'radiologist': return 'from-indigo-500 to-indigo-600';
      case 'billing': return 'from-orange-500 to-orange-600';
      case 'hr_manager': return 'from-red-500 to-red-600';
      case 'inventory_manager': return 'from-gray-500 to-gray-600';
      default: return 'from-slate-500 to-slate-600';
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
    roleKey: account.user.role,
    icon: getRoleIcon(account.user.role),
    gradient: getRoleColor(account.user.role)
  }));

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setFormError('');
    setIsLoading(true);
    setSelectedAccount(demoEmail);

    try {
      console.log('🎯 Attempting demo login for:', demoEmail);
      console.log('🔍 Demo credentials:', { email: demoEmail, password: demoPassword });
      console.log('📊 Auth loading state:', authLoading);
      console.log('📊 signIn function available:', !!signIn);
      
      // Extra validation for demo login
      if (!signIn || typeof signIn !== 'function') {
        console.error('❌ signIn function not available for demo login');
        setFormError('نظام المصادقة غير متاح. يرجى تحديث الصفحة والمحاولة مرة أخرى.');
        return;
      }

      const result = await signIn(demoEmail, demoPassword);
      console.log('📊 Demo login result:', result);
      
      if (result.error) {
        console.error('❌ Demo login failed:', result.error);
        console.log('🔍 Failed demo login details:', {
          email: demoEmail,
          password: demoPassword,
          error: result.error
        });
        
        let errorMessage = `فشل تسجيل الدخول للحساب ${demoEmail}`;
        
        if (result.error.includes('localStorage') || result.error.includes('storage')) {
          errorMessage = 'مشكلة في تخزين البيانات. يرجى التحقق من إعدادات المتصفح.';
        } else if (result.error.includes('Invalid login credentials')) {
          errorMessage = 'بيانات الحساب التجريبي غير صحيحة. يرجى تحديث الصفحة والمحاولة مرة أخرى.';
        } else {
          errorMessage += `: ${result.error}`;
        }
        
        setFormError(errorMessage);
        return;
      }
      
      console.log('✅ Demo login successful for:', demoEmail);
      console.log('📊 Demo user data:', result.data);
      
    } catch (error: any) {
      console.error('❌ Demo login error caught:', error);
      console.error('Demo login error details:', {
        name: error.name,
        message: error.message,
        email: demoEmail,
        stack: error.stack
      });
      
      let errorMessage = 'حدث خطأ أثناء تسجيل الدخول للحساب التجريبي';
      
      if (error.message.includes('localStorage')) {
        errorMessage = 'مشكلة في تخزين البيانات. يرجى تفعيل localStorage في المتصفح.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setFormError(errorMessage);
    } finally {
      setIsLoading(false);
      setSelectedAccount(null);
      console.log('📊 Demo login completed, state reset');
    }
  };

  // Show system setup if requested
  if (showSetup) {
    return <BillingSystemTest onClose={() => setShowSetup(false)} />;
  }

  // Show help page if requested
  if (showHelp) {
    return (
      <HelpPage 
        onClose={() => setShowHelp(false)}
        onSelectAccount={(email, password) => {
          setShowHelp(false);
          handleDemoLogin(email, password);
        }}
      />
    );
  }

  // Show auth switcher if requested
  if (showAuthSwitcher) {
    return (
      <AuthSwitcher
        currentAuthType="local"
        onSwitch={(type) => {
          setShowAuthSwitcher(false);
          if (type === 'supabase') {
            // Reload the page to switch to Supabase auth
            window.location.reload();
          }
        }}
        onClose={() => setShowAuthSwitcher(false)}
      />
    );
  }

  // Show quick user setup if requested
  if (showQuickSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <QuickUserSetup 
          onComplete={() => {
            setShowQuickSetup(false);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4 relative">
      {/* Floating action buttons */}
      <div className="fixed top-4 left-4 z-40 space-y-2">
        <Button
          onClick={() => setShowHelp(true)}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg animate-pulse-soft"
          size="sm"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          مساعدة
        </Button>
        <Button
          onClick={() => setShowAuthSwitcher(true)}
          variant="outline"
          className="w-full bg-white/90 backdrop-blur-sm hover:bg-blue-50 border-blue-200"
          size="sm"
        >
          <Database className="w-4 h-4 mr-2" />
          تبديل قاعدة البيانات
        </Button>
      </div>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Login Form */}
        <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-full p-4 animate-pulse-soft">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                نظام إدارة المستشفى
              </CardTitle>
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
                  <span className="text-sm text-green-600">متصل بالخادم المحلي</span>
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
                  placeholder="admin@clinic.com"
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
                    placeholder="admin123"
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
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transform hover:scale-[1.02] transition-all duration-200"
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
              <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              حسابات تجريبية جاهزة
            </CardTitle>
            <CardDescription>
              <div className="space-y-2">
                <p>اضغط على أي حساب للدخول مباشرة - نظام متكامل full stack</p>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  ✅ 10 أدوار مختلفة متاحة
                </Badge>
              </div>
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Quick access notice */}
            <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-white text-xs">👆</span>
                </div>
                <span className="font-medium text-blue-800">دخول بضغطة واحدة!</span>
              </div>
              <p className="text-xs text-blue-700">
                لا حاجة لكتابة أي شيء - فقط اضغط على الحساب المطلوب
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto custom-scrollbar">
              {demoAccountsForDisplay.map((account, index) => {
                const Icon = account.icon;
                const isSelected = selectedAccount === account.email;
                
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className={`group relative overflow-hidden justify-between h-auto p-4 transition-all duration-300 transform hover:scale-[1.02] text-right border-2 hover:shadow-lg ${
                      isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => handleDemoLogin(account.email, account.password)}
                    disabled={isLoading}
                  >
                    {/* Background gradient on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${account.gradient} opacity-0 group-hover:opacity-90 transition-opacity duration-300`} />
                    
                    <div className="relative flex items-center gap-3 z-10">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${account.gradient} group-hover:bg-white group-hover:bg-none transition-all duration-300 group-hover:scale-110`}>
                        <Icon className={`w-5 h-5 text-white group-hover:text-blue-600 transition-all duration-300`} />
                      </div>
                      <div className="text-right">
                        <div className="font-bold group-hover:text-white transition-colors duration-300">{account.name}</div>
                        <div className="text-sm text-blue-600 group-hover:text-blue-100 transition-colors duration-300 font-medium">{account.role}</div>
                      </div>
                    </div>
                    
                    <div className="relative text-left bg-gray-50 group-hover:bg-white/20 p-2 rounded transition-all duration-300 z-10">
                      <div className="text-xs font-mono text-gray-600 group-hover:text-gray-100 transition-colors duration-300">{account.email}</div>
                      <div className="text-xs font-mono text-green-600 group-hover:text-green-200 transition-colors duration-300 font-medium">{account.password}</div>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 left-2 z-20">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      </div>
                    )}
                  </Button>
                );
              })}
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
                <p className="text-xs text-center font-medium">
                  <span className="text-blue-600">نظام إدارة مستشفى متكامل</span>
                  <br />
                  <span className="text-green-600">يعمل في الوضع المحلي مع بيانات تجريبية</span>
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowHelp(true)}
                  className="text-xs hover:bg-purple-50 col-span-3 mb-2"
                >
                  📖 دليل المساعدة الشامل
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowQuickSetup(true)}
                  className="text-xs hover:bg-green-50"
                >
                  إنشاء المستخدمين
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowSetup(true)}
                  className="text-xs hover:bg-blue-50"
                >
                  إعداد النظام
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowHelp(true)}
                  className="text-xs hover:bg-yellow-50"
                >
                   مساعدة
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

     
     
      </div>

 

      {/* Footer */}
      <div className="fixed bottom-4 w-full text-center text-sm text-muted-foreground">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 inline-block shadow-sm">
          © 2024 نظام إدارة المستشفى - Local Demo Version ✨ جميع الحقوق محفوظة
        </div>
      </div>
    </div>
  );
};

export default EnhancedLoginPage;