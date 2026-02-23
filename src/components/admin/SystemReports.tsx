import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { 
  FileBarChart,
  Users,
  DollarSign,
  Activity,
  TrendingUp,
  Download,
  RefreshCw,
  Settings,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Filter,
  Search,
  Plus,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle,
  Target,
  Zap
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';
import ReportService, { ReportData, ReportFilter, ExportOptions } from '../../services/ReportService';
import ReportChart from './ReportChart';
import ReportFilters from './ReportFilters';
import ReportExport from './ReportExport';

interface SystemReportsProps {
  isDemoMode?: boolean;
}

const SystemReports: React.FC<SystemReportsProps> = ({ isDemoMode = false }) => {
  const { t, language, isRTL } = useLanguage();
  const { effectiveTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'system' | 'patient' | 'financial' | 'staff' | 'operational'>('system');
  const [currentReport, setCurrentReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<ReportFilter>({
    dateRange: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      to: new Date().toISOString()
    }
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);

  // Report tabs configuration
  const reportTabs = [
    {
      id: 'system',
      label: t('reports.systemReports'),
      icon: <Activity className="h-4 w-4" />,
      description: t('reports.systemReportsDesc'),
      color: 'text-blue-600'
    },
    {
      id: 'patient',
      label: t('reports.patientReports'),
      icon: <Users className="h-4 w-4" />,
      description: t('reports.patientReportsDesc'),
      color: 'text-green-600'
    },
    {
      id: 'financial',
      label: t('reports.financialReports'),
      icon: <DollarSign className="h-4 w-4" />,
      description: t('reports.financialReportsDesc'),
      color: 'text-yellow-600'
    },
    {
      id: 'staff',
      label: t('reports.staffReports'),
      icon: <Users className="h-4 w-4" />,
      description: t('reports.staffReportsDesc'),
      color: 'text-purple-600'
    },
    {
      id: 'operational',
      label: t('reports.operationalReports'),
      icon: <Target className="h-4 w-4" />,
      description: t('reports.operationalReportsDesc'),
      color: 'text-orange-600'
    }
  ];

  // Load report data based on active tab and filters
  const loadReportData = useCallback(async () => {
    setIsLoading(true);
    try {
      let reportData: ReportData;
      
      switch (activeTab) {
        case 'system':
          reportData = ReportService.generateSystemReport(filters, isDemoMode);
          break;
        case 'patient':
          reportData = ReportService.generatePatientReport(filters, isDemoMode);
          break;
        case 'financial':
          reportData = ReportService.generateFinancialReport(filters, isDemoMode);
          break;
        case 'staff':
          reportData = ReportService.generateStaffReport(filters, isDemoMode);
          break;
        case 'operational':
          reportData = ReportService.generateOperationalReport(filters, isDemoMode);
          break;
        default:
          throw new Error('Invalid report type');
      }

      setCurrentReport(reportData);
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, filters, isDemoMode]);

  // Load data on component mount and tab/filter changes
  useEffect(() => {
    loadReportData();
  }, [loadReportData]);

  // Auto-refresh functionality
  useEffect(() => {
    if (refreshInterval) {
      const interval = setInterval(loadReportData, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, loadReportData]);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: ReportFilter) => {
    setFilters(newFilters);
  }, []);

  // Handle export
  const handleExport = useCallback(async (options: ExportOptions) => {
    if (!currentReport) return;
    
    try {
      await ReportService.exportReport(currentReport, options);
    } catch (error) {
      console.error('Export error:', error);
    }
  }, [currentReport]);

  // Get summary statistics for current report
  const getSummaryStats = () => {
    if (!currentReport) return [];

    const summary = currentReport.metadata.summary;
    
    switch (activeTab) {
      case 'system':
        return [
          { label: t('reports.totalUsers'), value: summary.totalUsers, trend: '+12%', color: 'text-blue-600' },
          { label: t('reports.activeUsers'), value: summary.activeUsers, trend: '+8%', color: 'text-green-600' },
          { label: t('reports.averageUptime'), value: `${summary.averageUptime}%`, trend: '+0.2%', color: 'text-yellow-600' },
          { label: t('reports.totalErrors'), value: summary.totalErrors, trend: '-15%', color: 'text-red-600' }
        ];
      case 'patient':
        return [
          { label: t('reports.totalNewPatients'), value: summary.totalNewPatients, trend: '+18%', color: 'text-blue-600' },
          { label: t('reports.totalVisits'), value: summary.totalVisits, trend: '+22%', color: 'text-green-600' },
          { label: t('reports.averageSatisfaction'), value: `${summary.averageSatisfaction}/5`, trend: '+0.3', color: 'text-yellow-600' },
          { label: t('reports.readmissionRate'), value: `${summary.readmissionRate}%`, trend: '-0.2%', color: 'text-purple-600' }
        ];
      case 'financial':
        return [
          { label: t('reports.totalRevenue'), value: `${summary.totalRevenue?.toLocaleString()} ${t('common.currency')}`, trend: '+15%', color: 'text-green-600' },
          { label: t('reports.totalProfit'), value: `${summary.totalProfit?.toLocaleString()} ${t('common.currency')}`, trend: '+12%', color: 'text-blue-600' },
          { label: t('reports.profitMargin'), value: `${summary.profitMargin}%`, trend: '+2.1%', color: 'text-yellow-600' },
          { label: t('reports.collectionRate'), value: `${summary.collectionRate}%`, trend: '+1.2%', color: 'text-purple-600' }
        ];
      case 'staff':
        return [
          { label: t('reports.totalStaff'), value: summary.totalStaff, trend: '+5%', color: 'text-blue-600' },
          { label: t('reports.averageProductivity'), value: `${summary.averageProductivity}%`, trend: '+3%', color: 'text-green-600' },
          { label: t('reports.averageSatisfaction'), value: `${summary.averageSatisfaction}/5`, trend: '+0.2', color: 'text-yellow-600' },
          { label: t('reports.trainingCompletion'), value: `${summary.trainingCompletion}%`, trend: '+8%', color: 'text-purple-600' }
        ];
      case 'operational':
        return [
          { label: t('reports.targetsMet'), value: `${summary.targetsMet}/${summary.totalKPIs}`, trend: '+2', color: 'text-green-600' },
          { label: t('reports.overallPerformance'), value: `${summary.overallPerformance}%`, trend: '+5%', color: 'text-blue-600' },
          { label: t('reports.warningKPIs'), value: summary.warningKPIs, trend: '-1', color: 'text-yellow-600' },
          { label: t('reports.criticalKPIs'), value: summary.criticalKPIs, trend: '0', color: 'text-red-600' }
        ];
      default:
        return [];
    }
  };

  // Get chart configurations for current report type
  const getChartConfigs = () => {
    return ReportService.getChartConfigs(activeTab);
  };

  // Render data table for current report
  const renderDataTable = () => {
    if (!currentReport || !currentReport.data.length) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          {t('reports.noData')}
        </div>
      );
    }

    const data = currentReport.data;
    const columns = Object.keys(data[0] || {});

    return (
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column} className="font-medium">
                  {t(`reports.${column}`) || column.charAt(0).toUpperCase() + column.slice(1)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column}>
                    {typeof row[column] === 'object' && row[column] !== null
                      ? JSON.stringify(row[column])
                      : String(row[column])
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  // Get status indicator for metrics
  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'critical':
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <FileBarChart className="h-6 w-6" />
            {t('reports.systemReports')}
          </h1>
          <p className="text-muted-foreground">
            {t('reports.systemReportsDescription')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {t('reports.filters')}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={loadReportData}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {t('common.refresh')}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExportDialog(true)}
            disabled={!currentReport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {t('reports.export')}
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <ReportFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          reportType={activeTab}
          onApplyFilters={loadReportData}
          onResetFilters={() => {
            setFilters({
              dateRange: {
                from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                to: new Date().toISOString()
              }
            });
          }}
        />
      )}

      {/* Summary Statistics */}
      {currentReport && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {getSummaryStats().map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`text-sm font-medium ${stat.color}`}>
                    {stat.trend}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Main Report Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-5">
            {reportTabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <span className={tab.color}>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {reportTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className={tab.color}>{tab.icon}</span>
                  {tab.label}
                </CardTitle>
                <CardDescription>{tab.description}</CardDescription>
              </CardHeader>
            </Card>

            {isLoading ? (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center space-y-4">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                      <p className="text-muted-foreground">{t('reports.loadingReport')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Charts Section */}
                {currentReport && getChartConfigs().length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {getChartConfigs().map((chartConfig, index) => (
                      <ReportChart
                        key={index}
                        data={currentReport.data}
                        config={chartConfig}
                      />
                    ))}
                  </div>
                )}

                {/* Data Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      {t('reports.detailedData')}
                    </CardTitle>
                    <CardDescription>
                      {currentReport
                        ? t('reports.showingRecords', { count: currentReport.metadata.totalRecords })
                        : t('reports.noData')
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] w-full">
                      {renderDataTable()}
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Report-Specific Additional Info */}
                {activeTab === 'operational' && currentReport && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        {t('reports.kpiPerformance')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {currentReport.data.map((kpi, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              {getStatusIndicator(kpi.status)}
                              <div>
                                <p className="font-medium">{kpi.metric}</p>
                                <p className="text-sm text-muted-foreground">
                                  {kpi.department} • Target: {kpi.target} {kpi.unit}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold">{kpi.value} {kpi.unit}</p>
                              <p className={`text-sm ${kpi.trend.startsWith('+') ? 'text-green-600' : kpi.trend.startsWith('-') ? 'text-red-600' : 'text-gray-600'}`}>
                                {kpi.trend}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Financial Report Breakdown */}
                {activeTab === 'financial' && currentReport && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>{t('reports.revenueBreakdown')}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {currentReport.data.slice(0, 3).map((month, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>{month.month}</span>
                                <span className="font-medium">{month.revenue?.toLocaleString()} {t('common.currency')}</span>
                              </div>
                              <Progress value={(month.revenue / Math.max(...currentReport.data.map(d => d.revenue))) * 100} />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>{t('reports.paymentMethods')}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">{t('billing.insurance')}</span>
                            <Badge variant="secondary">65%</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">{t('billing.cash')}</span>
                            <Badge variant="secondary">25%</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">{t('billing.creditCard')}</span>
                            <Badge variant="secondary">10%</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Export Dialog */}
      <ReportExport
        reportData={currentReport}
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={handleExport}
      />
    </div>
  );
};

export default SystemReports;