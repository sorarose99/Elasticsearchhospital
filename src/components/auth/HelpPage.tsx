import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  HelpCircle,
  User,
  Settings,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  Info,
  Lightbulb,
  BookOpen,
  MessageCircle,
  Shield,
  Zap
} from 'lucide-react';

interface HelpPageProps {
  onClose: () => void;
  onSelectAccount?: (email: string, password: string) => void;
}

const HelpPage: React.FC<HelpPageProps> = ({ onClose, onSelectAccount }) => {
  const [activeTab, setActiveTab] = useState('quick-start');

  const quickStartAccounts = [
    { role: 'مدير النظام', email: 'admin@clinic.com', password: 'admin123', description: 'وصول كامل لإدارة النظام' },
    { role: 'طبيب', email: 'doctor@clinic.com', password: 'doctor123', description: 'إدارة المرضى والملفات الطبية' },
    { role: 'استقبال', email: 'reception@clinic.com', password: 'reception123', description: 'إدارة المواعيد والاستقبال' }
  ];

  const allAccounts = [
    { role: 'مدير النظام', email: 'admin@clinic.com', password: 'admin123', color: 'purple' },
    { role: 'طبيب', email: 'doctor@clinic.com', password: 'doctor123', color: 'blue' },
    { role: 'ممرضة', email: 'nurse@clinic.com', password: 'nurse123', color: 'pink' },
    { role: 'استقبال', email: 'reception@clinic.com', password: 'reception123', color: 'green' },
    { role: 'مختبر', email: 'lab@clinic.com', password: 'lab123', color: 'yellow' },
    { role: 'صيدلي', email: 'pharmacy@clinic.com', password: 'pharmacy123', color: 'teal' },
    { role: 'أشعة', email: 'radiology@clinic.com', password: 'radiology123', color: 'indigo' },
    { role: 'فوترة', email: 'billing@clinic.com', password: 'billing123', color: 'orange' },
    { role: 'موارد بشرية', email: 'hr@clinic.com', password: 'hr123', color: 'red' },
    { role: 'مخازن', email: 'inventory@clinic.com', password: 'inventory123', color: 'gray' }
  ];

  const systemFeatures = [
    'إدارة المرضى والملفات الطبية الإلكترونية',
    'نظام المواعيد والجدولة الذكية',
    'إدارة المختبر والتحاليل الطبية',
    'نظام الصيدلية وإدارة الأدوية',
    'إدارة الأشعة والصور الطبية',
    'نظام الفوترة والمحاسبة',
    'إدارة المخازن والمعدات',
    'تقارير مالية وإدارية شاملة',
    'نظام إدارة الموظفين',
    'لوحات تحكم مخصصة لكل دور'
  ];

  const troubleshooting = [
    {
      problem: 'لا أستطيع تسجيل الدخول',
      solution: 'تأكد من استخدام أحد الحسابات التجريبية المعروضة. انسخ البريد الإلكتروني وكلمة المرور بالضبط كما هي معروضة.'
    },
    {
      problem: 'الصفحة لا تحمل بشكل صحيح',
      solution: 'جرب إعادة تحميل الصفحة (F5) أو امسح ذاكرة التخزين المؤقت للمتصفح.'
    },
    {
      problem: 'النظام بطيء في الاستجابة',
      solution: 'النظام يعمل محلياً ويجب أن يكون سريعاً. جرب إغلاق علامات تبويب أخرى في المتصفح.'
    },
    {
      problem: 'لا أرى جميع الوظائف',
      solution: 'الوظائف المتاحة تعتمد على نوع الحساب. جرب تسجيل الدخول بحساب المدير للوصول الكامل.'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <HelpCircle className="w-6 h-6" />
              مساعدة نظام إدارة المستشفى
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              ✕
            </Button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary" className="bg-white/20 text-white">
              نظام تجريبي محلي
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white">
              10 أدوار مختلفة
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white">
              بيانات آمنة
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0 max-h-[calc(90vh-140px)] overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100">
              <TabsTrigger value="quick-start" className="flex items-center gap-2">
                <PlayCircle className="w-4 h-4" />
                البدء السريع
              </TabsTrigger>
              <TabsTrigger value="accounts" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                الحسابات
              </TabsTrigger>
              <TabsTrigger value="features" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                المميزات
              </TabsTrigger>
              <TabsTrigger value="help" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                استكشاف المشاكل
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="quick-start" className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">مرحباً بك في نظام إدارة المستشفى</h2>
                  <p className="text-gray-600">ابدأ تجربتك في أقل من دقيقة واحدة!</p>
                </div>

                {/* Step by step */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    خطوات البدء السريع:
                  </h3>
                  
                  <div className="space-y-3">
                    {[
                      'اختر أحد الحسابات التجريبية أدناه',
                      'اضغط على زر "دخول فوري" للحساب المطلوب',
                      'استكشف النظام واستمتع بجميع المميزات!'
                    ].map((step, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <span className="text-blue-800">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick access accounts */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    الحسابات الأكثر شيوعاً:
                  </h3>
                  
                  <div className="space-y-2">
                    {quickStartAccounts.map((account, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div>
                          <div className="font-medium text-gray-900">{account.role}</div>
                          <div className="text-sm text-gray-600">{account.description}</div>
                          <div className="text-xs font-mono text-gray-500 mt-1">
                            {account.email} | {account.password}
                          </div>
                        </div>
                        <Button 
                          onClick={() => onSelectAccount?.(account.email, account.password)}
                          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                        >
                          دخول فوري
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safety note */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">نظام آمن ومحلي</span>
                  </div>
                  <p className="text-sm text-green-700">
                    جميع البيانات تُخزن محلياً في متصفحك ولا تُرسل إلى أي خادم خارجي. آمن تماماً للاستخدام والتجريب.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="accounts" className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">جميع الحسابات التجريبية المتاحة</h2>
                  <p className="text-gray-600 mb-6">لدينا 10 أدوار مختلفة يمكنك تجربتها:</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allAccounts.map((account, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{account.role}</span>
                        <div className={`w-3 h-3 bg-${account.color}-500 rounded-full`}></div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                          {account.email}
                        </div>
                        <div className="text-sm font-mono text-green-600">
                          {account.password}
                        </div>
                      </div>
                      {onSelectAccount && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full mt-2"
                          onClick={() => onSelectAccount(account.email, account.password)}
                        >
                          استخدم هذا الحساب
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-800">ملاحظة مهمة</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    كل دور له واجهة مخصصة وصلاحيات مختلفة. جرب عدة حسابات لترى الفروقات في الوظائف المتاحة.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="features" className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">مميزات النظام</h2>
                  <p className="text-gray-600 mb-6">نظام إدارة مستشفى متكامل مع جميع الوحدات الأساسية:</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {systemFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-800">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">10</div>
                    <div className="text-sm text-blue-800">أدوار مختلفة</div>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">100%</div>
                    <div className="text-sm text-green-800">وظائف تعمل</div>
                  </div>
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">آمن</div>
                    <div className="text-sm text-purple-800">بيانات محلية</div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="help" className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">استكشاف الأخطاء وإصلاحها</h2>
                  <p className="text-gray-600 mb-6">حلول للمشاكل الشائعة:</p>
                </div>

                <div className="space-y-4">
                  {troubleshooting.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 mb-2">{item.problem}</div>
                          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                            {item.solution}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">نصائح للاستخدام الأمثل</span>
                  </div>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• استخدم حساب المدير للوصول إلى جميع الوظائف</li>
                    <li>• جرب حسابات مختلفة لترى الفروقات في الواجهات</li>
                    <li>• البيانات محفوظة محلياً ولن تفقدها عند إعادة تحميل الصفحة</li>
                    <li>• يمكنك تسجيل الخروج والدخول بحساب آخر في أي وقت</li>
                  </ul>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPage;