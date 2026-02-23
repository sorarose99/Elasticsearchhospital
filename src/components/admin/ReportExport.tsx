import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Progress } from '../ui/progress';
import { 
  Download,
  FileText,
  File,
  FileSpreadsheet,
  FileCode,
  Settings,
  Calendar,
  Clock,
  Users,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { ReportData, ExportOptions } from '../../services/ReportService';
import ReportService from '../../services/ReportService';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';

interface ReportExportProps {
  reportData: ReportData | null;
  isOpen: boolean;
  onClose: () => void;
  onExport?: (options: ExportOptions) => void;
}

const ReportExport: React.FC<ReportExportProps> = ({
  reportData,
  isOpen,
  onClose,
  onExport
}) => {
  const { t, isRTL } = useLanguage();
  const { effectiveTheme } = useTheme();

  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    fileName: '',
    includeCharts: true,
    pageSize: 'a4',
    orientation: 'portrait'
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState<'idle' | 'preparing' | 'generating' | 'complete' | 'error'>('idle');
  const [scheduledExport, setScheduledExport] = useState({
    enabled: false,
    frequency: 'daily',
    time: '09:00',
    email: '',
    includeData: true,
    includeCharts: true
  });

  // Export format options
  const exportFormats = [
    {
      value: 'pdf',
      label: 'PDF',
      icon: <FileText className="h-4 w-4" />,
      description: t('reports.pdfDescription'),
      supports: ['charts', 'formatting', 'headers']
    },
    {
      value: 'excel',
      label: 'Excel',
      icon: <FileSpreadsheet className="h-4 w-4" />,
      description: t('reports.excelDescription'),
      supports: ['data', 'formulas', 'charts']
    },
    {
      value: 'csv',
      label: 'CSV',
      icon: <File className="h-4 w-4" />,
      description: t('reports.csvDescription'),
      supports: ['data', 'import']
    },
    {
      value: 'json',
      label: 'JSON',
      icon: <FileCode className="h-4 w-4" />,
      description: t('reports.jsonDescription'),
      supports: ['data', 'api']
    }
  ];

  // Page size options
  const pageSizes = [
    { value: 'a4', label: 'A4 (210×297mm)' },
    { value: 'a3', label: 'A3 (297×420mm)' },
    { value: 'letter', label: 'Letter (216×279mm)' }
  ];

  // Handle export option change
  const handleOptionChange = (key: keyof ExportOptions, value: any) => {
    setExportOptions(prev => ({ ...prev, [key]: value }));
  };

  // Generate default filename
  const generateFileName = () => {
    if (!reportData) return '';
    
    const date = new Date().toISOString().split('T')[0];
    const title = reportData.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    return `${title}_${date}`;
  };

  // Handle export execution
  const handleExport = async () => {
    if (!reportData) return;

    setIsExporting(true);
    setExportStatus('preparing');
    setExportProgress(0);

    try {
      // Simulate export progress
      const progressSteps = [
        { status: 'preparing', progress: 20, message: t('reports.preparingData') },
        { status: 'generating', progress: 60, message: t('reports.generatingReport') },
        { status: 'complete', progress: 100, message: t('reports.exportComplete') }
      ];

      for (const step of progressSteps) {
        setExportStatus(step.status as any);
        setExportProgress(step.progress);
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Prepare final export options
      const finalOptions: ExportOptions = {
        ...exportOptions,
        fileName: exportOptions.fileName || generateFileName()
      };

      // Call external export handler if provided
      if (onExport) {
        onExport(finalOptions);
      } else {
        // Use default service export
        await ReportService.exportReport(reportData, finalOptions);
      }

      setExportStatus('complete');
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus('error');
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setExportStatus('idle');
        setExportProgress(0);
        if (exportStatus !== 'error') {
          onClose();
        }
      }, 2000);
    }
  };

  // Handle scheduled export setup
  const handleScheduleExport = () => {
    console.log('Setting up scheduled export:', scheduledExport);
    // In real implementation, this would call a scheduling service
  };

  // Get format-specific options
  const getFormatOptions = () => {
    const format = exportFormats.find(f => f.value === exportOptions.format);
    if (!format) return null;

    switch (exportOptions.format) {
      case 'pdf':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('reports.pageSize')}</Label>
                <Select
                  value={exportOptions.pageSize}
                  onValueChange={(value: 'a4' | 'a3' | 'letter') => handleOptionChange('pageSize', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pageSizes.map(size => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('reports.orientation')}</Label>
                <RadioGroup
                  value={exportOptions.orientation}
                  onValueChange={(value: 'portrait' | 'landscape') => handleOptionChange('orientation', value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="portrait" id="portrait" />
                    <Label htmlFor="portrait">{t('reports.portrait')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="landscape" id="landscape" />
                    <Label htmlFor="landscape">{t('reports.landscape')}</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeCharts"
                checked={exportOptions.includeCharts}
                onCheckedChange={(checked) => handleOptionChange('includeCharts', checked)}
              />
              <Label htmlFor="includeCharts">{t('reports.includeCharts')}</Label>
            </div>
          </div>
        );

      case 'excel':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeChartsExcel"
                checked={exportOptions.includeCharts}
                onCheckedChange={(checked) => handleOptionChange('includeCharts', checked)}
              />
              <Label htmlFor="includeChartsExcel">{t('reports.includeCharts')}</Label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!reportData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            {t('reports.exportReport')}
          </DialogTitle>
          <DialogDescription>
            {t('reports.exportDescription')} - {reportData.title}
          </DialogDescription>
        </DialogHeader>

        {!isExporting ? (
          <div className="space-y-6">
            {/* Export Format Selection */}
            <div className="space-y-4">
              <Label className="text-base font-medium">{t('reports.selectFormat')}</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {exportFormats.map((format) => (
                  <Card
                    key={format.value}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      exportOptions.format === format.value
                        ? 'ring-2 ring-primary bg-primary/5'
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => handleOptionChange('format', format.value)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        {format.icon}
                        <div className="font-medium">{format.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {format.description}
                        </div>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {format.supports.map(support => (
                            <Badge key={support} variant="secondary" className="text-xs">
                              {t(`reports.${support}`)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* File Name */}
            <div className="space-y-2">
              <Label>{t('reports.fileName')}</Label>
              <Input
                value={exportOptions.fileName || generateFileName()}
                onChange={(e) => handleOptionChange('fileName', e.target.value)}
                placeholder={generateFileName()}
              />
            </div>

            {/* Format-Specific Options */}
            {getFormatOptions() && (
              <div className="space-y-4">
                <Label className="text-base font-medium">{t('reports.exportOptions')}</Label>
                {getFormatOptions()}
              </div>
            )}

            {/* Report Summary */}
            <div className="space-y-4">
              <Label className="text-base font-medium">{t('reports.reportSummary')}</Label>
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-muted-foreground">{t('reports.reportType')}</div>
                      <div className="capitalize">{reportData.type}</div>
                    </div>
                    <div>
                      <div className="font-medium text-muted-foreground">{t('reports.records')}</div>
                      <div>{reportData.metadata.totalRecords.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="font-medium text-muted-foreground">{t('reports.generatedAt')}</div>
                      <div>{new Date(reportData.metadata.generatedAt).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="font-medium text-muted-foreground">{t('reports.estimatedSize')}</div>
                      <div>
                        {exportOptions.format === 'pdf' ? '~2.5MB' :
                         exportOptions.format === 'excel' ? '~1.8MB' :
                         exportOptions.format === 'csv' ? '~0.5MB' :
                         '~0.3MB'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Scheduled Export */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t('reports.scheduledExport')}
                </Label>
                <Checkbox
                  checked={scheduledExport.enabled}
                  onCheckedChange={(checked) => setScheduledExport(prev => ({ ...prev, enabled: !!checked }))}
                />
              </div>

              {scheduledExport.enabled && (
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm">{t('reports.frequency')}</Label>
                        <Select
                          value={scheduledExport.frequency}
                          onValueChange={(value) => setScheduledExport(prev => ({ ...prev, frequency: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">{t('reports.daily')}</SelectItem>
                            <SelectItem value="weekly">{t('reports.weekly')}</SelectItem>
                            <SelectItem value="monthly">{t('reports.monthly')}</SelectItem>
                            <SelectItem value="quarterly">{t('reports.quarterly')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">{t('reports.time')}</Label>
                        <Input
                          type="time"
                          value={scheduledExport.time}
                          onChange={(e) => setScheduledExport(prev => ({ ...prev, time: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">{t('reports.emailTo')}</Label>
                        <Input
                          type="email"
                          placeholder="admin@hospital.com"
                          value={scheduledExport.email}
                          onChange={(e) => setScheduledExport(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="scheduleIncludeData"
                          checked={scheduledExport.includeData}
                          onCheckedChange={(checked) => setScheduledExport(prev => ({ ...prev, includeData: !!checked }))}
                        />
                        <Label htmlFor="scheduleIncludeData" className="text-sm">{t('reports.includeData')}</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="scheduleIncludeCharts"
                          checked={scheduledExport.includeCharts}
                          onCheckedChange={(checked) => setScheduledExport(prev => ({ ...prev, includeCharts: !!checked }))}
                        />
                        <Label htmlFor="scheduleIncludeCharts" className="text-sm">{t('reports.includeCharts')}</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          /* Export Progress */
          <div className="space-y-6 py-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-primary/10">
                {exportStatus === 'complete' ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : exportStatus === 'error' ? (
                  <AlertCircle className="h-8 w-8 text-red-600" />
                ) : (
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                )}
              </div>
              
              <h3 className="text-lg font-medium mb-2">
                {exportStatus === 'preparing' && t('reports.preparingExport')}
                {exportStatus === 'generating' && t('reports.generatingExport')}
                {exportStatus === 'complete' && t('reports.exportComplete')}
                {exportStatus === 'error' && t('reports.exportError')}
              </h3>
              
              <p className="text-muted-foreground mb-6">
                {exportStatus === 'preparing' && t('reports.preparingDescription')}
                {exportStatus === 'generating' && t('reports.generatingDescription')}
                {exportStatus === 'complete' && t('reports.completeDescription')}
                {exportStatus === 'error' && t('reports.errorDescription')}
              </p>

              {exportStatus !== 'complete' && exportStatus !== 'error' && (
                <div className="w-full max-w-sm mx-auto">
                  <Progress value={exportProgress} className="mb-2" />
                  <p className="text-sm text-muted-foreground">{exportProgress}%</p>
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            {isExporting ? t('common.close') : t('common.cancel')}
          </Button>
          
          {!isExporting && (
            <div className="flex gap-2">
              {scheduledExport.enabled && (
                <Button
                  variant="secondary"
                  onClick={handleScheduleExport}
                  className="flex items-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  {t('reports.scheduleExport')}
                </Button>
              )}
              
              <Button
                onClick={handleExport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {t('reports.exportNow')}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportExport;