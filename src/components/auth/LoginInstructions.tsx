import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { CheckCircle, Users, Stethoscope, Building2, Heart, UserCheck, TestTube, Pill, Zap, CreditCard, UserCog, Package } from 'lucide-react';

interface LoginInstructionsProps {
  className?: string;
}

const LoginInstructions: React.FC<LoginInstructionsProps> = ({ className = '' }) => {
  const accounts = [
    { role: 'المدير', email: 'admin@clinic.com', password: 'admin123', icon: Building2, color: 'text-purple-600', description: 'إدارة النظام الكاملة' },
    { role: 'الطبيب', email: 'doctor@clinic.com', password: 'doctor123', icon: Stethoscope, color: 'text-blue-600', description: 'ملفات المرضى والتشخيص' },
    { role: 'الممرضة', email: 'nurse@clinic.com', password: 'nurse123', icon: Heart, color: 'text-pink-600', description: 'رعاية المرضى والعلامات الحيوية' },
    { role: 'الاستقبال', email: 'reception@clinic.com', password: 'reception123', icon: UserCheck, color: 'text-green-600', description: 'إدارة المواعيد والاستقبال' },
    { role: 'المختبر', email: 'lab@clinic.com', password: 'lab123', icon: TestTube, color: 'text-yellow-600', description: 'التحاليل والفحوصات' },
    { role: 'الصيدلية', email: 'pharmacy@clinic.com', password: 'pharmacy123', icon: Pill, color: 'text-teal-600', description: 'إدارة الأدوية والصرف' },
    { role: 'الأشعة', email: 'radiology@clinic.com', password: 'radiology123', icon: Zap, color: 'text-indigo-600', description: 'الصور الطبية والأشعة' },
    { role: 'الفوترة', email: 'billing@clinic.com', password: 'billing123', icon: CreditCard, color: 'text-orange-600', description: 'الفواتير والمدفوعات' },
    { role: 'الموارد البشرية', email: 'hr@clinic.com', password: 'hr123', icon: UserCog, color: 'text-red-600', description: 'إدارة الموظفين' },
    { role: 'المخازن', email: 'inventory@clinic.com', password: 'inventory123', icon: Package, color: 'text-gray-600', description: 'إدارة المخزون والمعدات' }
  ];

  return (
    <Card className={`bg-white/95 backdrop-blur-sm ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Users className="w-6 h-6 text-blue-600" />
          دليل الحسابات التجريبية
        </CardTitle>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            ✅ 10 أدوار مختلفة
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            🏥 نظام متكامل
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            📊 بيانات تجريبية حقيقية
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Quick start instructions */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
            <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              كيفية الدخول:
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• اختر أي حساب من القائمة</li>
              <li>• اضغط على زر الحساب للدخول المباشر</li>
              <li>• أو انسخ البريد الإلكتروني وكلمة المرور</li>
              <li>• استكشف النظام بكامل مميزاته!</li>
            </ul>
          </div>

          {/* Accounts grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {accounts.map((account, index) => {
              const Icon = account.icon;
              return (
                <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Icon className={`w-5 h-5 ${account.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{account.role}</div>
                      <div className="text-xs text-gray-600 mb-1">{account.description}</div>
                      <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                        {account.email}
                      </div>
                      <div className="text-xs font-mono text-green-600 font-medium mt-1">
                        {account.password}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* System features */}
          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <h3 className="font-bold text-green-800 mb-2">مميزات النظام:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-green-700">
              <div>• إدارة المرضى</div>
              <div>• نظام المواعيد</div>
              <div>• الملفات الطبية</div>
              <div>• إدارة المختبر</div>
              <div>• نظام الصيدلية</div>
              <div>• إدارة الأشعة</div>
              <div>• نظام الفوترة</div>
              <div>• التقارير المالية</div>
              <div>• إدارة المخازن</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginInstructions;