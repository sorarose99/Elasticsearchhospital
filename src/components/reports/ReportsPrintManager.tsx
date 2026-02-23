import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { 
  Printer, Download, FileText, Settings, Clock, CheckCircle2, AlertTriangle,
  Calendar, DollarSign, Users, TrendingUp, Target, Shield, Activity, Plus
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { cn } from '../ui/utils';
import PrintService from './PrintService';

// Import types and utilities
import { ReportType, PrintJob } from './types';
import { formatDuration, getCategoryTranslation, getComplexityTranslation, getStatusTranslation } from './utils';

interface ReportsPrintManagerProps {
  className?: string;
}

export const ReportsPrintManager: React.FC<ReportsPrintManagerProps> = ({ className }) => {
  const { language, isRTL } = useLanguage();
  
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([]);
  const [activeTab, setActiveTab] = useState<'reports' | 'jobs' | 'templates'>('reports');

  // Available reports
  const availableReports: ReportType[] = [
    {
      id: 'revenue',
      title: language === 'ar' ? 'تقرير الإيرادات' : 'Revenue Report',
      description: language === 'ar' ? 'تحليل تفصيلي للإيرادات والنمو' : 'Detailed revenue and growth analysis',
      component: 'RevenueReportDetailed',
      icon: <DollarSign className="h-5 w-5" />,
      color: '#10b981',
      size: '2.4 MB',
      formats: ['pdf', 'excel', 'word'],
      estimatedTime: 45,
      complexity: 'complex',
      category: 'financial',
      lastGenerated: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 'expenses',
      title: language === 'ar' ? 'تقرير المصروفات' : 'Expenses Report',
      description: language === 'ar' ? 'تحليل المصروفات والتكاليف التشغيلية' : 'Operating expenses and cost analysis',
      component: 'ExpensesReportDetailed',
      icon: <TrendingUp className="h-5 w-5" />,
      color: '#ef4444',
      size: '1.8 MB',
      formats: ['pdf', 'excel'],
      estimatedTime: 30,
      complexity: 'medium',
      category: 'financial',
      lastGenerated: new Date(Date.now() - 4 * 60 * 60 * 1000)
    },
    {
      id: 'patients',
      title: language === 'ar' ? 'تقرير المرضى' : 'Patients Report',
      description: language === 'ar' ? 'إحصائيات المرضى والخدمات المقدمة' : 'Patient statistics and services provided',
      component: 'PatientsReport',
      icon: <Users className="h-5 w-5" />,
      color: '#3b82f6',
      size: '3.1 MB',
      formats: ['pdf', 'excel', 'word'],
      estimatedTime: 60,
      complexity: 'complex',
      category: 'operational',
      lastGenerated: new Date(Date.now() - 6 * 60 * 60 * 1000)
    },
    {
      id: 'monthly',
      title: language === 'ar' ? 'التقرير الشهري' : 'Monthly Report',
      description: language === 'ar' ? 'التقرير الشامل الشهري لجميع الأقسام' : 'Comprehensive monthly report for all departments',
      component: 'MonthlyReport',
      icon: <Calendar className="h-5 w-5" />,
      color: '#8b5cf6',
      size: '4.2 MB',
      formats: ['pdf', 'word'],
      estimatedTime: 90,
      complexity: 'complex',
      category: 'administrative'
    },
    {
      id: 'profitability',
      title: language === 'ar' ? 'تقرير الربحية' : 'Profitability Report',
      description: language === 'ar' ? 'تحليل الربحية وهوامش الربح' : 'Profitability analysis and profit margins',
      component: 'ProfitabilityReportDetailed',
      icon: <Target className="h-5 w-5" />,
      color: '#f59e0b',
      size: '2.7 MB',
      formats: ['pdf', 'excel'],
      estimatedTime: 40,
      complexity: 'medium',
      category: 'financial'
    },
    {
      id: 'insurance',
      title: language === 'ar' ? 'تقرير التأمين' : 'Insurance Report',
      description: language === 'ar' ? 'تقرير مطالبات التأمين والموافقات' : 'Insurance claims and approvals report',
      component: 'InsuranceReportDetailed',
      icon: <Shield className="h-5 w-5" />,
      color: '#14b8a6',
      size: '1.9 MB',
      formats: ['pdf', 'excel'],
      estimatedTime: 35,
      complexity: 'medium',
      category: 'financial'
    }
  ];

  // Handle print report
  const handlePrintReport = (report: ReportType) => {
    setSelectedReport(report);
    setShowPrintDialog(true);
  };

  // Handle quick print (PDF with default settings)
  const handleQuickPrint = (report: ReportType) => {
    const jobId = `job_${Date.now()}`;
    const newJob: PrintJob = {
      id: jobId,
      reportType: report.id,
      reportTitle: report.title,
      format: 'PDF',
      status: 'queued',
      progress: 0,
      startTime: new Date()
    };

    setPrintJobs(prev => [newJob, ...prev]);
    simulatePrintJob(jobId, report.estimatedTime);
  };

  // Simulate print job processing
  const simulatePrintJob = async (jobId: string, estimatedTime: number) => {
    const updateInterval = estimatedTime * 10;
    
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, updateInterval));
      
      setPrintJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { 
              ...job, 
              status: progress === 100 ? 'completed' : 'processing',
              progress,
              endTime: progress === 100 ? new Date() : undefined,
              fileSize: progress === 100 ? '2.4 MB' : undefined,
              downloadUrl: progress === 100 ? `/downloads/${job.reportTitle.replace(/\s+/g, '_').toLowerCase()}.pdf` : undefined
            }
          : job
      ));
    }
  };

  return (
    <>
      <div className={cn("space-y-6", className, isRTL ? "rtl" : "ltr")} dir={isRTL ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <Printer className="h-6 w-6" />
              {language === 'ar' ? 'مدير الطباعة والتقارير' : 'Reports Print Manager'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'ar' ? 'إدارة وطباعة جميع التقارير والوثائق' : 'Manage and print all reports and documents'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              {printJobs.filter(j => j.status === 'processing').length} {language === 'ar' ? 'جاري المعالجة' : 'Processing'}
            </Badge>
            
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              {printJobs.filter(j => j.status === 'completed').length} {language === 'ar' ? 'مكتمل' : 'Completed'}
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {language === 'ar' ? 'التقارير المتاحة' : 'Available Reports'}
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {language === 'ar' ? 'مهام الطباعة' : 'Print Jobs'}
              {printJobs.length > 0 && (
                <Badge className="ml-1">{printJobs.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              {language === 'ar' ? 'القوالب' : 'Templates'}
            </TabsTrigger>
          </TabsList>

          {/* Available Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 hover-lift">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${report.color}15`, color: report.color }}
                          >
                            {report.icon}
                          </div>
                          <div>
                            <CardTitle className="text-base">{report.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">
                                {getCategoryTranslation(report.category, language)}
                              </Badge>
                              <Badge variant="outline">
                                {getComplexityTranslation(report.complexity, language)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <CardDescription className="text-sm">
                        {report.description}
                      </CardDescription>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <FileText className="h-3 w-3" />
                            <span>{language === 'ar' ? 'الحجم:' : 'Size:'}</span>
                          </div>
                          <span className="font-medium">{report.size}</span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{language === 'ar' ? 'الوقت المقدر:' : 'Est. Time:'}</span>
                          </div>
                          <span className="font-medium">{formatDuration(report.estimatedTime)}</span>
                        </div>
                      </div>

                      {report.lastGenerated && (
                        <div className="text-xs text-muted-foreground">
                          {language === 'ar' ? 'آخر إنشاء:' : 'Last generated:'} {
                            report.lastGenerated.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          }
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        {report.formats.map(format => (
                          <Badge key={format} variant="outline" className="text-xs">
                            {format.toUpperCase()}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleQuickPrint(report)}
                          className="flex-1"
                          size="sm"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {language === 'ar' ? 'طباعة سريعة' : 'Quick Print'}
                        </Button>
                        
                        <Button
                          onClick={() => handlePrintReport(report)}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          {language === 'ar' ? 'إعدادات متقدمة' : 'Advanced'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Print Jobs Tab */}
          <TabsContent value="jobs" className="space-y-4">
            {printJobs.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <Printer className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="font-medium mb-2">
                      {language === 'ar' ? 'لا توجد مهام طباعة' : 'No Print Jobs'}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {language === 'ar' ? 'ستظهر مهام الطباعة الجديدة هنا' : 'New print jobs will appear here'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {printJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">{job.reportTitle}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{job.format}</span>
                                <span>•</span>
                                <span>
                                  {job.startTime.toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </span>
                                {job.fileSize && (
                                  <>
                                    <span>•</span>
                                    <span>{job.fileSize}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {getStatusTranslation(job.status, language)}
                            </Badge>

                            {job.status === 'completed' && job.downloadUrl && (
                              <Button
                                size="sm"
                                onClick={() => window.open(job.downloadUrl, '_blank')}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                {language === 'ar' ? 'تحميل' : 'Download'}
                              </Button>
                            )}
                          </div>
                        </div>

                        {job.status === 'processing' && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{language === 'ar' ? 'التقدم' : 'Progress'}</span>
                              <span>{job.progress}%</span>
                            </div>
                            <Progress value={job.progress} className="h-2" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {language === 'ar' ? 'قوالب التقارير' : 'Report Templates'}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'إدارة قوالب التقارير وإعدادات الطباعة الافتراضية' : 'Manage report templates and default print settings'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="font-medium mb-2">
                    {language === 'ar' ? 'قوالب التقارير' : 'Report Templates'}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {language === 'ar' ? 'ستتوفر إدارة القوالب قريباً' : 'Template management coming soon'}
                  </p>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    {language === 'ar' ? 'إنشاء قالب جديد' : 'Create New Template'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Print Service Dialog */}
      {selectedReport && (
        <PrintService
          isOpen={showPrintDialog}
          onClose={() => {
            setShowPrintDialog(false);
            setSelectedReport(null);
          }}
          reportType={selectedReport.id as any}
          reportTitle={selectedReport.title}
          reportData={{}}
        />
      )}
    </>
  );
};

export default ReportsPrintManager;