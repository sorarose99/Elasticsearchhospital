import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Play, 
  MousePointer, 
  User, 
  ArrowRight, 
  CheckCircle,
  Building2,
  Stethoscope,
  Heart,
  UserCheck,
  TestTube,
  Pill,
  Zap,
  CreditCard,
  UserCog,
  Package
} from 'lucide-react';

interface QuickStartGuideProps {
  onSelectAccount: (email: string, password: string) => void;
  className?: string;
}

const QuickStartGuide: React.FC<QuickStartGuideProps> = ({ onSelectAccount, className = '' }) => {
  const popularAccounts = [
    {
      role: 'مدير النظام',
      email: 'admin@clinic.com',
      password: 'admin123',
      icon: Building2,
      color: 'purple',
      description: 'وصول كامل لجميع أجزاء النظام'
    },
    {
      role: 'طبيب',
      email: 'doctor@clinic.com',
      password: 'doctor123',
      icon: Stethoscope,
      color: 'blue',
      description: 'إدارة المرضى والملفات الطبية'
    },
    {
      role: 'استقبال',
      email: 'reception@clinic.com',
      password: 'reception123',
      icon: UserCheck,
      color: 'green',
      description: 'إدارة المواعيد واستقبال المرضى'
    }
  ];

  const handleAccountSelect = (email: string, password: string) => {
    onSelectAccount(email, password);
  };

  return (
    <Card className={`bg-white/95 backdrop-blur-sm border-2 border-blue-200 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-blue-800">
          <Play className="w-6 h-6" />
          البدء السريع
        </CardTitle>
        <Badge variant="outline" className="w-fit bg-green-50 text-green-700 border-green-200">
          جرب النظام في 10 ثوان!
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Step-by-step guide */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <MousePointer className="w-5 h-5 text-blue-600" />
            خطوات بسيطة للدخول:
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <span className="text-blue-800">اختر حساباً من الأحسابات التجريبية</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <span className="text-green-800">اضغط على زر الحساب للدخول فوراً</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <span className="text-purple-800">استكشف النظام واستمتع بالتجربة!</span>
            </div>
          </div>
        </div>

        {/* Popular accounts for quick start */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <User className="w-5 h-5 text-green-600" />
            الأكثر شيوعاً - ابدأ من هنا:
          </h3>
          
          <div className="space-y-2">
            {popularAccounts.map((account, index) => {
              const Icon = account.icon;
              const colorClasses = {
                purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
                blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
                green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
              };
              
              return (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full justify-start h-auto p-4 border-2 hover:border-transparent transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group bg-gradient-to-r hover:${colorClasses[account.color as keyof typeof colorClasses]} hover:text-white`}
                  onClick={() => handleAccountSelect(account.email, account.password)}
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className={`p-3 rounded-lg bg-${account.color}-100 group-hover:bg-white/20 transition-all duration-300`}>
                      <Icon className={`w-6 h-6 text-${account.color}-600 group-hover:text-white transition-all duration-300`} />
                    </div>
                    <div className="flex-1 text-right">
                      <div className="font-bold text-lg group-hover:text-white transition-colors duration-300">
                        {account.role}
                      </div>
                      <div className="text-sm text-gray-600 group-hover:text-white/80 transition-colors duration-300">
                        {account.description}
                      </div>
                      <div className="text-xs font-mono text-gray-500 group-hover:text-white/70 mt-1 transition-colors duration-300">
                        {account.email} | {account.password}
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-all duration-300 group-hover:translate-x-1" />
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* What to expect */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            ما الذي ستجده في النظام:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-green-700">لوحة تحكم شخصية لكل دور</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="text-blue-700">بيانات تجريبية واقعية</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span className="text-purple-700">جميع المميزات تعمل بكامل طاقتها</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              <span className="text-orange-700">واجهة عربية متكاملة</span>
            </div>
          </div>
        </div>

        {/* Fun fact */}
        <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="text-yellow-700 text-sm">
            💡 <strong>معلومة مفيدة:</strong> يمكنك التبديل بين الحسابات في أي وقت من خلال تسجيل الخروج والدخول بحساب آخر
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStartGuide;