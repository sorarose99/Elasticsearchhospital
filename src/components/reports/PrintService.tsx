import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Printer, Download, FileText, Eye, Layout, Settings, Zap, X, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { cn } from '../ui/utils';

// Import types and utilities
import { PrintOptions, PrintJobStatus } from './types';
import { DEFAULT_PRINT_OPTIONS, PRINT_SIZE_CLASSES, PRINT_MARGIN_STYLES } from './constants';
import { updateEstimates, getFormatIcon, getStatusColor } from './utils';

interface PrintServiceProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: 'revenue' | 'expenses' | 'patients' | 'monthly' | 'insurance' | 'profitability' | 'custom';
  reportTitle: string;
  reportData: any;
  reportComponent?: React.ReactNode;
}

export const PrintService: React.FC<PrintServiceProps> = ({
  isOpen,
  onClose,
  reportType,
  reportTitle,
  reportData,
  reportComponent
}) => {
  const { language, isRTL } = useLanguage();
  
  const [printOptions, setPrintOptions] = useState<PrintOptions>(DEFAULT_PRINT_OPTIONS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [printJobs, setPrintJobs] = useState<PrintJobStatus[]>([]);
  const [activeTab, setActiveTab] = useState<'options' | 'preview' | 'jobs'>('options');
  const [estimatedSize, setEstimatedSize] = useState('2.4 MB');
  const [estimatedPages, setEstimatedPages] = useState(12);

  const previewRef = useRef<HTMLDivElement>(null);

  // Update print options
  const updateOption = <K extends keyof PrintOptions>(key: K, value: PrintOptions[K]) => {
    const newOptions = { ...printOptions, [key]: value };
    setPrintOptions(newOptions);
    
    // Update estimates
    const estimates = updateEstimates(newOptions);
    setEstimatedSize(estimates.size);
    setEstimatedPages(estimates.pages);
  };

  // Generate print job
  const handlePrint = async () => {
    setIsProcessing(true);
    
    const jobId = `job_${Date.now()}`;
    const newJob: PrintJobStatus = {
      id: jobId,
      status: 'queued',
      progress: 0,
      filename: `${reportTitle.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.${printOptions.format}`,
      format: printOptions.format.toUpperCase(),
      size: estimatedSize,
      createdAt: new Date()
    };

    setPrintJobs(prev => [newJob, ...prev]);

    // Simulate print job processing
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setPrintJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { 
              ...job, 
              status: progress === 100 ? 'completed' : 'processing',
              progress,
              completedAt: progress === 100 ? new Date() : undefined,
              downloadUrl: progress === 100 ? `/downloads/${job.filename}` : undefined
            }
          : job
      ));
    }

    setIsProcessing(false);
  };

  // Handle download
  const handleDownload = (job: PrintJobStatus) => {
    if (job.downloadUrl) {
      console.log('Downloading:', job.downloadUrl);
      window.open(job.downloadUrl, '_blank');
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      case 'processing': return <Zap className="h-4 w-4 animate-pulse" />;
      case 'failed': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("max-w-6xl h-[90vh]", isRTL ? "rtl" : "ltr")} dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            {language === 'ar' ? 'نظام الطباعة المتقدم' : 'Advanced Print System'}
          </DialogTitle>
          <DialogDescription>
            {language === 'ar' ? `طباعة وتصدير ${reportTitle}` : `Print and export ${reportTitle}`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Print Options */}
          <div className="w-1/3 border-r p-6 space-y-6 overflow-y-auto">
            {/* Tab Selection */}
            <div className="flex gap-1 p-1 bg-muted rounded-lg">
              {[
                { id: 'options', label: language === 'ar' ? 'خيارات' : 'Options', icon: Settings },
                { id: 'preview', label: language === 'ar' ? 'معاينة' : 'Preview', icon: Eye },
                { id: 'jobs', label: language === 'ar' ? 'المهام' : 'Jobs', icon: FileText }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all",
                      activeTab === tab.id ? "bg-background shadow-sm" : "hover:bg-background/50"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Options Tab */}
            {activeTab === 'options' && (
              <div className="space-y-6">
                {/* Format Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    {language === 'ar' ? 'تنسيق الملف' : 'File Format'}
                  </Label>
                  <Select value={printOptions.format} onValueChange={(value: any) => updateOption('format', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="word">Word</SelectItem>
                      <SelectItem value="image">Image (PNG)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Layout and Size */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      {language === 'ar' ? 'الاتجاه' : 'Layout'}
                    </Label>
                    <Select value={printOptions.layout} onValueChange={(value: any) => updateOption('layout', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portrait">{language === 'ar' ? 'عمودي' : 'Portrait'}</SelectItem>
                        <SelectItem value="landscape">{language === 'ar' ? 'أفقي' : 'Landscape'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      {language === 'ar' ? 'الحجم' : 'Size'}
                    </Label>
                    <Select value={printOptions.size} onValueChange={(value: any) => updateOption('size', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a4">A4</SelectItem>
                        <SelectItem value="a3">A3</SelectItem>
                        <SelectItem value="letter">Letter</SelectItem>
                        <SelectItem value="legal">Legal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Include Options */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium">
                    {language === 'ar' ? 'تضمين المحتوى' : 'Include Content'}
                  </Label>
                  
                  <div className="space-y-3">
                    {[
                      { key: 'includeCharts', label: language === 'ar' ? 'الرسوم البيانية' : 'Charts' },
                      { key: 'includeData', label: language === 'ar' ? 'الجداول والبيانات' : 'Data Tables' },
                      { key: 'includeHeader', label: language === 'ar' ? 'رأس الصفحة' : 'Header' },
                      { key: 'includeFooter', label: language === 'ar' ? 'تذييل الصفحة' : 'Footer' },
                      { key: 'includeLogo', label: language === 'ar' ? 'الشعار' : 'Logo' },
                      { key: 'pageNumbers', label: language === 'ar' ? 'أرقام الصفحات' : 'Page Numbers' }
                    ].map(option => (
                      <div key={option.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={option.key}
                          checked={printOptions[option.key as keyof PrintOptions] as boolean}
                          onCheckedChange={(checked) => updateOption(option.key as keyof PrintOptions, checked as any)}
                        />
                        <Label htmlFor={option.key} className="text-sm cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Estimates */}
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <h4 className="font-medium text-sm">
                    {language === 'ar' ? 'تقديرات الملف' : 'File Estimates'}
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {language === 'ar' ? 'الحجم:' : 'Size:'}
                      </span>
                      <span className="font-medium">{estimatedSize}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Layout className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {language === 'ar' ? 'الصفحات:' : 'Pages:'}
                      </span>
                      <span className="font-medium">{estimatedPages}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Jobs Tab */}
            {activeTab === 'jobs' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    {language === 'ar' ? 'مهام الطباعة' : 'Print Jobs'}
                  </Label>
                  <Badge variant="secondary">{printJobs.length}</Badge>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {printJobs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Printer className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">
                        {language === 'ar' ? 'لا توجد مهام طباعة' : 'No print jobs'}
                      </p>
                    </div>
                  ) : (
                    printJobs.map((job) => (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 border rounded-lg space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm font-medium truncate">
                              {job.filename}
                            </span>
                          </div>
                          <Badge className={getStatusColor(job.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(job.status)}
                              <span className="text-xs">
                                {language === 'ar' ? 
                                  (job.status === 'completed' ? 'مكتمل' : 
                                   job.status === 'processing' ? 'جاري المعالجة' : 
                                   job.status === 'queued' ? 'في الانتظار' : 'فشل') :
                                  job.status
                                }
                              </span>
                            </div>
                          </Badge>
                        </div>

                        {job.status === 'processing' && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{language === 'ar' ? 'التقدم' : 'Progress'}</span>
                              <span>{job.progress}%</span>
                            </div>
                            <Progress value={job.progress} className="h-1.5" />
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span>{job.size}</span>
                            <span>
                              {job.createdAt.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>

                          {job.status === 'completed' && job.downloadUrl && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDownload(job)}
                              className="h-6 px-2"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              {language === 'ar' ? 'تحميل' : 'Download'}
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Main Content - Preview */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">
                    {activeTab === 'preview' ? 
                      (language === 'ar' ? 'معاينة المستند' : 'Document Preview') :
                      (language === 'ar' ? 'إعدادات الطباعة' : 'Print Settings')
                    }
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? `${reportTitle} - ${printOptions.format.toUpperCase()}` : 
                     `${reportTitle} - ${printOptions.format.toUpperCase()}`}
                  </p>
                </div>

                <Button
                  onClick={handlePrint}
                  disabled={isProcessing}
                  className="relative"
                >
                  {isProcessing ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-pulse" />
                      {language === 'ar' ? 'جاري المعالجة...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      <Printer className="h-4 w-4 mr-2" />
                      {language === 'ar' ? 'إنشاء المستند' : 'Generate Document'}
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <div className="h-full p-6 bg-gray-50 dark:bg-gray-900/20 overflow-auto">
                <div 
                  ref={previewRef}
                  className={cn(
                    "mx-auto bg-white dark:bg-gray-900 shadow-lg",
                    PRINT_SIZE_CLASSES[printOptions.size] || PRINT_SIZE_CLASSES.a4
                  )}
                  style={{
                    padding: PRINT_MARGIN_STYLES[printOptions.margin] || PRINT_MARGIN_STYLES.normal
                  }}
                >
                  {/* Preview Content */}
                  <div className="space-y-6">
                    {printOptions.includeHeader && (
                      <header className="flex items-center justify-between pb-6 border-b">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Printer className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h2 className="font-bold">Hospital Management</h2>
                            <p className="text-sm text-muted-foreground">
                              {language === 'ar' ? 'نظام إدارة المستشفيات' : 'Healthcare Excellence'}
                            </p>
                          </div>
                        </div>
                        
                        {printOptions.includeDate && (
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              {new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        )}
                      </header>
                    )}

                    <div className="space-y-4">
                      <h1 className="text-xl font-bold text-primary">
                        {reportTitle}
                      </h1>

                      {/* Sample content preview */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="p-4 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="h-4 w-4" />
                              <span className="text-sm font-medium">Metric {i}</span>
                            </div>
                            <p className="text-2xl font-bold">
                              {(Math.random() * 1000000).toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'SAR',
                                minimumFractionDigits: 0
                              })}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {printOptions.includeFooter && (
                      <footer className="pt-6 border-t text-center text-sm text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <div>
                            <p>Hospital Management System</p>
                            <p>{language === 'ar' ? 'نظام إدارة المستشفيات المتطور' : 'Advanced Healthcare Management'}</p>
                          </div>
                          {printOptions.pageNumbers && (
                            <div>
                              {language === 'ar' ? 'الصفحة' : 'Page'} 1 {language === 'ar' ? 'من' : 'of'} {estimatedPages}
                            </div>
                          )}
                        </div>
                      </footer>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrintService;