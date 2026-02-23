import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';
import { cn } from '../ui/utils';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Printer, Bell, Settings } from 'lucide-react';

// Import all report components
import FinancialReportsDashboard from './FinancialReportsDashboard';
import RevenueReport from './RevenueReport';
import ExpensesReport from './ExpensesReport';
import ProfitabilityReport from './ProfitabilityReport';
import InsuranceReport from './InsuranceReport';
import PatientsReport from './PatientsReport';
import MonthlyReport from './MonthlyReport';

// Import new advanced components
import ReportsPrintManager from './ReportsPrintManager';
import SmartNotificationSystem from '../notifications/SmartNotificationSystem';
import TasksAndReportsNotifier from '../notifications/TasksAndReportsNotifier';

type ReportType = 
  | 'dashboard'
  | 'revenue' 
  | 'expenses' 
  | 'profitability' 
  | 'insurance' 
  | 'patients' 
  | 'monthly'
  | 'print-manager'
  | 'notifications'
  | 'tasks';

interface ReportsMainProps {
  initialReport?: ReportType;
  onReportChange?: (reportType: ReportType) => void;
}

const ReportsMain: React.FC<ReportsMainProps> = ({ 
  initialReport = 'dashboard',
  onReportChange 
}) => {
  const { language, isRTL } = useLanguage();
  const { effectiveTheme } = useTheme();
  
  const [currentReport, setCurrentReport] = useState<ReportType>(initialReport);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(7);

  // Handle report navigation
  const handleNavigateToReport = async (reportType: ReportType) => {
    setIsTransitioning(true);
    
    // Add a small delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 200));
    
    setCurrentReport(reportType);
    onReportChange?.(reportType);
    
    setIsTransitioning(false);
  };

  // Handle back navigation
  const handleGoBack = () => {
    handleNavigateToReport('dashboard');
  };

  // Animation variants for page transitions
  const pageVariants = {
    initial: {
      opacity: 0,
      x: isRTL ? -50 : 50,
      scale: 0.95
    },
    in: {
      opacity: 1,
      x: 0,
      scale: 1
    },
    out: {
      opacity: 0,
      x: isRTL ? 50 : -50,
      scale: 0.95
    }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  };

  // Loading overlay component
  const LoadingOverlay = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"
        />
        <p className="text-sm text-muted-foreground">
          {language === 'ar' ? 'جاري تحميل التقرير...' : 'Loading report...'}
        </p>
      </div>
    </motion.div>
  );

  // Render the appropriate report component
  const renderReportComponent = () => {
    const componentProps = {
      onGoBack: handleGoBack
    };

    switch (currentReport) {
      case 'dashboard':
        return (
          <FinancialReportsDashboard
            onNavigateToReport={handleNavigateToReport}
          />
        );
      case 'revenue':
        return <RevenueReport {...componentProps} />;
      case 'expenses':
        return <ExpensesReport {...componentProps} />;
      case 'profitability':
        return <ProfitabilityReport {...componentProps} />;
      case 'insurance':
        return <InsuranceReport {...componentProps} />;
      case 'patients':
        return <PatientsReport {...componentProps} />;
      case 'monthly':
        return <MonthlyReport {...componentProps} />;
      case 'print-manager':
        return (
          <div className="p-6">
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={handleGoBack}
                className="mb-4"
              >
                ← {language === 'ar' ? 'رجوع للتقارير' : 'Back to Reports'}
              </Button>
            </div>
            <ReportsPrintManager />
          </div>
        );
      case 'notifications':
        return (
          <div className="p-6">
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={handleGoBack}
                className="mb-4"
              >
                ← {language === 'ar' ? 'رجوع للتقارير' : 'Back to Reports'}
              </Button>
            </div>
            <SmartNotificationSystem 
              isOpen={true}
              onClose={() => {}}
              className="relative"
            />
          </div>
        );
      case 'tasks':
        return (
          <div className="p-6">
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={handleGoBack}
                className="mb-4"
              >
                ← {language === 'ar' ? 'رجوع للتقارير' : 'Back to Reports'}
              </Button>
            </div>
            <TasksAndReportsNotifier />
          </div>
        );
      default:
        return (
          <FinancialReportsDashboard
            onNavigateToReport={handleNavigateToReport}
          />
        );
    }
  };

  return (
    <div className={cn("min-h-screen bg-background", isRTL ? "rtl" : "ltr")} dir={isRTL ? "rtl" : "ltr"}>
      {/* Loading Overlay */}
      <AnimatePresence>
        {isTransitioning && <LoadingOverlay />}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentReport}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="w-full"
        >
          {renderReportComponent()}
        </motion.div>
      </AnimatePresence>

      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute top-0 left-0 w-full h-full">
          <svg className="absolute top-0 left-0 w-full h-full opacity-5" viewBox="0 0 100 100">
            <defs>
              <pattern id="reports-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="5" cy="5" r="0.5" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#reports-grid)" />
          </svg>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -30, 0],
            opacity: [0.1, 0.4, 0.1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-1/2 right-1/3 w-24 h-24 bg-gradient-to-br from-orange-400/10 to-red-400/10 rounded-full blur-xl"
        />
      </div>

      {/* Floating Action Buttons */}
      <div className={cn("fixed top-4 z-40 flex items-center gap-3", isRTL ? "left-4" : "right-4")}>
        {/* Print Manager Button */}
        <Button
          onClick={() => handleNavigateToReport('print-manager')}
          size="sm"
          variant="outline"
          className="shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Printer className="h-4 w-4 mr-2" />
          {language === 'ar' ? 'الطباعة' : 'Print'}
        </Button>

        {/* Tasks & Reports Button */}
        <Button
          onClick={() => handleNavigateToReport('tasks')}
          size="sm"
          variant="outline"
          className="shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Settings className="h-4 w-4 mr-2" />
          {language === 'ar' ? 'المهام' : 'Tasks'}
        </Button>

        {/* Notifications Button */}
        <Button
          onClick={() => setShowNotifications(!showNotifications)}
          size="sm"
          variant="outline"
          className="shadow-lg hover:shadow-xl transition-all duration-300 relative"
        >
          <Bell className="h-4 w-4 mr-2" />
          {language === 'ar' ? 'التنبيهات' : 'Alerts'}
          {notificationCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 text-xs flex items-center justify-center p-0">
              {notificationCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Smart Notification System */}
      <SmartNotificationSystem 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* Navigation Breadcrumb (Hidden for now, can be implemented later) */}
      <div className="fixed top-4 left-4 z-40 opacity-0 pointer-events-none">
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: currentReport !== 'dashboard' ? 1 : 0, y: 0 }}
          className="flex items-center space-x-2 text-sm text-muted-foreground bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 border"
        >
          <span>{language === 'ar' ? 'التقارير المالية' : 'Financial Reports'}</span>
          {currentReport !== 'dashboard' && (
            <>
              <span>/</span>
              <span className="text-foreground font-medium">
                {currentReport === 'revenue' && (language === 'ar' ? 'تقرير الإيرادات' : 'Revenue Report')}
                {currentReport === 'expenses' && (language === 'ar' ? 'تقرير المصروفات' : 'Expenses Report')}
                {currentReport === 'profitability' && (language === 'ar' ? 'تحليل الربحية' : 'Profitability Analysis')}
                {currentReport === 'insurance' && (language === 'ar' ? 'تقرير التأمين' : 'Insurance Report')}
                {currentReport === 'patients' && (language === 'ar' ? 'تقرير المرضى' : 'Patients Report')}
                {currentReport === 'monthly' && (language === 'ar' ? 'التقرير الشهري' : 'Monthly Report')}
              </span>
            </>
          )}
        </motion.nav>
      </div>

      {/* Keyboard Shortcuts Helper (Hidden, can be toggled) */}
      <div className="fixed bottom-4 right-4 z-40 opacity-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0, scale: 1 }}
          className="bg-background/90 backdrop-blur-sm border rounded-lg p-3 text-xs text-muted-foreground max-w-xs"
        >
          <div className="font-medium mb-2">
            {language === 'ar' ? 'اختصارات لوحة المفاتيح:' : 'Keyboard Shortcuts:'}
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>ESC</span>
              <span>{language === 'ar' ? 'العودة للوحة الرئيسية' : 'Back to Dashboard'}</span>
            </div>
            <div className="flex justify-between">
              <span>R</span>
              <span>{language === 'ar' ? 'تحديث البيانات' : 'Refresh Data'}</span>
            </div>
            <div className="flex justify-between">
              <span>E</span>
              <span>{language === 'ar' ? 'تصدير التقرير' : 'Export Report'}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportsMain;