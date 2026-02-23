import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Calendar, FileText, Users, Stethoscope, TestTube, 
  Pill, CreditCard, BarChart3, Settings, Zap, ArrowRight,
  Clock, TrendingUp, Shield, Building, Activity, CheckCircle
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';
import { cn } from '../ui/utils';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'medical' | 'financial' | 'admin' | 'reports';
  priority: 'high' | 'medium' | 'low';
  color: string;
  bgGradient: string;
  onClick: () => void;
  badge?: string;
  count?: number;
}

interface QuickActionsEnhancedProps {
  onNavigateToModule: (module: string) => void;
  isDemoMode?: boolean;
}

const QuickActionsEnhanced: React.FC<QuickActionsEnhancedProps> = ({ 
  onNavigateToModule, 
  isDemoMode = false 
}) => {
  const { t, language, isRTL } = useLanguage();
  const { effectiveTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const quickActions: QuickAction[] = [
    // Medical Actions
    {
      id: 'add-patient',
      title: language === 'ar' ? 'إضافة مريض جديد' : 'Add New Patient',
      description: language === 'ar' ? 'تسجيل مريض جديد في النظام' : 'Register a new patient in the system',
      icon: <Users className="h-5 w-5" />,
      category: 'medical',
      priority: 'high',
      color: 'text-blue-600',
      bgGradient: 'from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20',
      onClick: () => onNavigateToModule('patients'),
      badge: language === 'ar' ? 'جديد' : 'New'
    },
    {
      id: 'schedule-appointment',
      title: language === 'ar' ? 'جدولة موعد' : 'Schedule Appointment',
      description: language === 'ar' ? 'حجز موعد جديد للمريض' : 'Book a new appointment for patient',
      icon: <Calendar className="h-5 w-5" />,
      category: 'medical',
      priority: 'high',
      color: 'text-green-600',
      bgGradient: 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20',
      onClick: () => onNavigateToModule('appointments'),
      count: 12
    },
    {
      id: 'order-lab-test',
      title: language === 'ar' ? 'طلب فحص مختبر' : 'Order Lab Test',
      description: language === 'ar' ? 'طلب فحص مختبري جديد' : 'Request new laboratory test',
      icon: <TestTube className="h-5 w-5" />,
      category: 'medical',
      priority: 'medium',
      color: 'text-purple-600',
      bgGradient: 'from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20',
      onClick: () => onNavigateToModule('lab'),
      count: 8
    },
    {
      id: 'prescribe-medication',
      title: language === 'ar' ? 'وصف دواء' : 'Prescribe Medication',
      description: language === 'ar' ? 'إنشاء وصفة طبية جديدة' : 'Create new medical prescription',
      icon: <Pill className="h-5 w-5" />,
      category: 'medical',
      priority: 'medium',
      color: 'text-orange-600',
      bgGradient: 'from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20',
      onClick: () => onNavigateToModule('pharmacy')
    },
    {
      id: 'medical-record',
      title: language === 'ar' ? 'ملف طبي' : 'Medical Record',
      description: language === 'ar' ? 'عرض أو تحديث الملف الطبي' : 'View or update medical record',
      icon: <FileText className="h-5 w-5" />,
      category: 'medical',
      priority: 'medium',
      color: 'text-indigo-600',
      bgGradient: 'from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20',
      onClick: () => onNavigateToModule('medical')
    },

    // Financial Actions
    {
      id: 'create-invoice',
      title: language === 'ar' ? 'إنشاء فاتورة' : 'Create Invoice',
      description: language === 'ar' ? 'إنشاء فاتورة جديدة للمريض' : 'Create new patient invoice',
      icon: <CreditCard className="h-5 w-5" />,
      category: 'financial',
      priority: 'high',
      color: 'text-emerald-600',
      bgGradient: 'from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20',
      onClick: () => onNavigateToModule('billing'),
      count: 5
    },
    {
      id: 'insurance-claim',
      title: language === 'ar' ? 'مطالبة تأمين' : 'Insurance Claim',
      description: language === 'ar' ? 'تقديم مطالبة تأمين جديدة' : 'Submit new insurance claim',
      icon: <Shield className="h-5 w-5" />,
      category: 'financial',
      priority: 'medium',
      color: 'text-cyan-600',
      bgGradient: 'from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20',
      onClick: () => onNavigateToModule('insurance'),
      badge: language === 'ar' ? 'عاجل' : 'Urgent'
    },
    {
      id: 'payment-record',
      title: language === 'ar' ? 'تسجيل دفعة' : 'Record Payment',
      description: language === 'ar' ? 'تسجيل دفعة مستلمة' : 'Record received payment',
      icon: <CheckCircle className="h-5 w-5" />,
      category: 'financial',
      priority: 'medium',
      color: 'text-lime-600',
      bgGradient: 'from-lime-50 to-green-50 dark:from-lime-950/20 dark:to-green-950/20',
      onClick: () => onNavigateToModule('billing')
    },

    // Reports Actions
    {
      id: 'revenue-report',
      title: language === 'ar' ? 'تقرير الإيرادات' : 'Revenue Report',
      description: language === 'ar' ? 'عرض تقرير الإيرادات التفصيلي' : 'View detailed revenue report',
      icon: <TrendingUp className="h-5 w-5" />,
      category: 'reports',
      priority: 'medium',
      color: 'text-green-600',
      bgGradient: 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20',
      onClick: () => onNavigateToModule('reports/revenue')
    },
    {
      id: 'expenses-report',
      title: language === 'ar' ? 'تقرير المصروفات' : 'Expenses Report',
      description: language === 'ar' ? 'عرض تقرير المصروفات والتكاليف' : 'View expenses and costs report',
      icon: <BarChart3 className="h-5 w-5" />,
      category: 'reports',
      priority: 'medium',
      color: 'text-red-600',
      bgGradient: 'from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20',
      onClick: () => onNavigateToModule('reports/expenses')
    },
    {
      id: 'profitability-report',
      title: language === 'ar' ? 'تقرير الربحية' : 'Profitability Report',
      description: language === 'ar' ? 'تحليل الربحية والأداء المالي' : 'Profitability and financial performance analysis',
      icon: <Activity className="h-5 w-5" />,
      category: 'reports',
      priority: 'medium',
      color: 'text-blue-600',
      bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20',
      onClick: () => onNavigateToModule('reports/profitability')
    },
    {
      id: 'insurance-report',
      title: language === 'ar' ? 'تقرير التأمين' : 'Insurance Report',
      description: language === 'ar' ? 'تقرير مطالبات التأمين' : 'Insurance claims report',
      icon: <Shield className="h-5 w-5" />,
      category: 'reports',
      priority: 'medium',
      color: 'text-purple-600',
      bgGradient: 'from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20',
      onClick: () => onNavigateToModule('reports/insurance')
    },

    // Admin Actions
    {
      id: 'system-settings',
      title: language === 'ar' ? 'إعدادات النظام' : 'System Settings',
      description: language === 'ar' ? 'إدارة إعدادات النظام' : 'Manage system settings',
      icon: <Settings className="h-5 w-5" />,
      category: 'admin',
      priority: 'low',
      color: 'text-gray-600',
      bgGradient: 'from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20',
      onClick: () => onNavigateToModule('settings')
    },
    {
      id: 'user-management',
      title: language === 'ar' ? 'إدارة المستخدمين' : 'User Management',
      description: language === 'ar' ? 'إدارة المستخدمين والصلاحيات' : 'Manage users and permissions',
      icon: <Building className="h-5 w-5" />,
      category: 'admin',
      priority: 'low',
      color: 'text-slate-600',
      bgGradient: 'from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20',
      onClick: () => onNavigateToModule('admin')
    }
  ];

  const categories = [
    { id: 'all', label: language === 'ar' ? 'الكل' : 'All', icon: <Zap className="h-4 w-4" /> },
    { id: 'medical', label: language === 'ar' ? 'طبي' : 'Medical', icon: <Stethoscope className="h-4 w-4" /> },
    { id: 'financial', label: language === 'ar' ? 'مالي' : 'Financial', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'reports', label: language === 'ar' ? 'تقارير' : 'Reports', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'admin', label: language === 'ar' ? 'إداري' : 'Admin', icon: <Settings className="h-4 w-4" /> }
  ];

  const filteredActions = selectedCategory === 'all' 
    ? quickActions 
    : quickActions.filter(action => action.category === selectedCategory);

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sortedActions = filteredActions.sort((a, b) => 
    priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return (
    <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", isRTL ? "sm:flex-row-reverse" : "")}
      >
        <div className={isRTL ? "text-right" : ""}>
          <h2 className="text-2xl font-bold text-primary">
            {language === 'ar' ? 'الإجراءات السريعة' : 'Quick Actions'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'ar' ? 'اختصارات سريعة للمهام الشائعة' : 'Quick shortcuts for common tasks'}
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {language === 'ar' ? 'محدث حديثاً' : 'Recently updated'}
        </Badge>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <Button
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "flex items-center gap-2 transition-all duration-300",
                      selectedCategory === category.id 
                        ? "shadow-md scale-105" 
                        : "hover:scale-105 hover:shadow-sm",
                      isRTL ? "flex-row-reverse" : ""
                    )}
                  >
                    {category.icon}
                    {category.label}
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {sortedActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group"
            >
              <Card className={cn(
                "cursor-pointer border-2 border-transparent transition-all duration-300 hover:shadow-lg overflow-hidden",
                "bg-gradient-to-br", action.bgGradient,
                "group-hover:border-primary/20"
              )}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <CardHeader className="relative z-10 pb-3">
                  <div className={cn("flex items-start justify-between", isRTL ? "flex-row-reverse" : "")}>
                    <div className={cn("p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm", action.color)}>
                      {action.icon}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {action.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {action.badge}
                        </Badge>
                      )}
                      {action.count && (
                        <Badge variant="outline" className="text-xs">
                          {action.count}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 pt-0 pb-4" onClick={action.onClick}>
                  <div className={cn("space-y-2", isRTL ? "text-right" : "")}>
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors duration-300">
                      {action.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {action.description}
                    </p>
                  </div>

                  <div className={cn("flex items-center justify-between mt-3", isRTL ? "flex-row-reverse" : "")}>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs capitalize",
                        action.priority === 'high' ? 'border-red-200 text-red-700' :
                        action.priority === 'medium' ? 'border-yellow-200 text-yellow-700' :
                        'border-gray-200 text-gray-700'
                      )}
                    >
                      {action.priority === 'high' ? (language === 'ar' ? 'عالي' : 'High') :
                       action.priority === 'medium' ? (language === 'ar' ? 'متوسط' : 'Medium') :
                       (language === 'ar' ? 'منخفض' : 'Low')}
                    </Badge>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRight className={cn("h-4 w-4 text-primary", isRTL && "rotate-180")} />
                    </div>
                  </div>
                </CardContent>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-10 translate-x-10 group-hover:scale-125 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-primary/5 to-transparent rounded-full translate-y-8 -translate-x-8 group-hover:scale-125 transition-transform duration-500" />
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {sortedActions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="text-6xl text-muted-foreground/30 mb-4">🔍</div>
          <h3 className="text-lg font-semibold mb-2">
            {language === 'ar' ? 'لا توجد إجراءات' : 'No Actions Found'}
          </h3>
          <p className="text-muted-foreground">
            {language === 'ar' ? 'لم يتم العثور على إجراءات في هذه الفئة' : 'No actions found in this category'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default QuickActionsEnhanced;