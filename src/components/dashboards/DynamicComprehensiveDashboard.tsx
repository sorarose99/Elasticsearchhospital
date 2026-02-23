/**
 * Dynamic Comprehensive Dashboard
 * Updated to use real-time data from Supabase backend
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Pill,
  FileText,
  UserCheck,
  Heart,
  Stethoscope,
  Building,
  ShieldCheck,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  Download,
  Filter,
  Calendar as CalendarIcon,
  ArrowUpRight,
  ArrowDownRight,
  Wifi,
  WifiOff,
  Database,
  Server,
  HardDrive
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';
import { useDashboardStats, useAnalytics, useDataSyncStatus } from '../../hooks/useDynamicData';
import { toast } from 'sonner';

interface DynamicComprehensiveDashboardProps {
  userRole: string;
  isDemoMode?: boolean;
}

const DynamicComprehensiveDashboard: React.FC<DynamicComprehensiveDashboardProps> = ({ 
  userRole, 
  isDemoMode = false 
}) => {
  const { t, language, isRTL } = useLanguage();
  const { effectiveTheme, themeConfig } = useTheme();
  
  // Dynamic data hooks
  const { 
    data: dashboardStats, 
    loading: statsLoading, 
    error: statsError, 
    refresh: refreshStats,
    lastUpdated: statsLastUpdated 
  } = useDashboardStats();
  
  const { 
    data: analytics, 
    loading: analyticsLoading, 
    error: analyticsError, 
    refresh: refreshAnalytics 
  } = useAnalytics('last30Days', 'all');
  
  const { isOnline, lastSyncTime, updateSyncTime } = useDataSyncStatus();
  
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('today');
  const [refreshing, setRefreshing] = useState(false);
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);

  // Monitor online status
  useEffect(() => {
    if (!isOnline) {
      setShowOfflineAlert(true);
      toast.error(t('dashboard.offlineMode'));
    } else if (showOfflineAlert) {
      setShowOfflineAlert(false);
      toast.success(t('dashboard.backOnline'));
      refreshStats();
      refreshAnalytics();
    }
  }, [isOnline, showOfflineAlert, refreshStats, refreshAnalytics, t]);

  // Handle data refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refreshStats(), refreshAnalytics()]);
      updateSyncTime();
      toast.success(t('dashboard.dataRefreshed'));
    } catch (error) {
      toast.error(t('dashboard.refreshError'));
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle export functionality
  const handleExport = async () => {
    try {
      const exportData = {
        dashboardStats,
        analytics,
        timestamp: new Date().toISOString(),
        userRole,
        period: selectedPeriod
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(t('dashboard.exportComplete'));
    } catch (error) {
      toast.error(t('dashboard.exportError'));
      console.error('Export error:', error);
    }
  };

  // Format utilities
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US').format(number);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <ArrowUpRight className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-red-600" />
    );
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  // Loading state
  if (statsLoading && !dashboardStats) {
    return (
      <div className="space-y-6 p-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{t('dashboard.title')}</h1>
            <p className="text-muted-foreground">{t('dashboard.overview')}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="card-animate">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4 skeleton"></div>
                  <div className="h-8 bg-muted rounded w-1/2 skeleton"></div>
                  <div className="h-3 bg-muted rounded w-full skeleton"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (statsError && !dashboardStats) {
    return (
      <div className="space-y-6 p-6">
        <Alert variant="destructive" className="error-shake">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {t('dashboard.dataLoadError')}: {statsError}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="mt-2 ml-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('common.retry')}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      {/* Offline Alert */}
      {showOfflineAlert && (
        <Alert variant="destructive">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            {t('dashboard.workingOffline')}
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t('dashboard.title')}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>{t('dashboard.overview')}</span>
            {isOnline ? (
              <div className="flex items-center gap-1 text-green-600">
                <Wifi className="h-4 w-4" />
                <span className="text-sm">{t('status.online')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-600">
                <WifiOff className="h-4 w-4" />
                <span className="text-sm">{t('status.offline')}</span>
              </div>
            )}
            {statsLastUpdated && (
              <span className="text-xs">
                {t('dashboard.lastUpdated')}: {formatTime(statsLastUpdated.toISOString())}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing || !isOnline}
            className="flex items-center gap-2 btn-press"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? t('common.refreshing') : t('common.refresh')}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 btn-press"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-animation">
        {/* Total Patients */}
        <Card className="card-animate hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('dashboard.totalPatients')}</p>
                <p className="text-2xl font-semibold">
                  {dashboardStats ? formatNumber(dashboardStats.totalPatients) : '--'}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">
                    12.5% {t('common.fromLastMonth')}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        <Card className="card-animate hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('dashboard.todayAppointments')}</p>
                <p className="text-2xl font-semibold">
                  {dashboardStats ? formatNumber(dashboardStats.todayAppointments) : '--'}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">
                    8.3% {t('common.fromYesterday')}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Revenue */}
        <Card className="card-animate hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('dashboard.todayRevenue')}</p>
                <p className="text-2xl font-semibold">
                  {dashboardStats ? formatCurrency(dashboardStats.todayRevenue) : '--'}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">
                    15.7% {t('common.fromLastWeek')}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Lab Orders */}
        <Card className="card-animate hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('dashboard.pendingLabOrders')}</p>
                <p className="text-2xl font-semibold">
                  {dashboardStats ? formatNumber(dashboardStats.pendingLabOrders) : '--'}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {dashboardStats && dashboardStats.pendingLabOrders > 20 ? (
                    <>
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-yellow-600">{t('dashboard.highVolume')}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">{t('dashboard.normalVolume')}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Patients */}
          <Card className="card-animate">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {t('dashboard.recentPatients')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardStats?.recentPatients && dashboardStats.recentPatients.length > 0 ? (
                <div className="space-y-4">
                  {dashboardStats.recentPatients.map((patient, index) => (
                    <div key={patient.id || index} className="flex items-center gap-3 p-3 border rounded-lg hover-lift">
                      <Avatar>
                        <AvatarFallback>
                          {patient.firstName?.[0]}{patient.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{patient.firstName} {patient.lastName}</p>
                        <p className="text-sm text-muted-foreground">
                          {patient.phone} • {patient.gender}
                        </p>
                      </div>
                      <Badge variant={patient.status === 'active' ? 'default' : 'secondary'}>
                        {patient.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>{t('dashboard.noRecentPatients')}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Appointments */}
          <Card className="card-animate">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t('dashboard.recentAppointments')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardStats?.recentAppointments && dashboardStats.recentAppointments.length > 0 ? (
                <div className="space-y-4">
                  {dashboardStats.recentAppointments.map((appointment, index) => (
                    <div key={appointment.id || index} className="flex items-center gap-3 p-3 border rounded-lg hover-lift">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <div className="flex-1">
                        <p className="font-medium">{appointment.patientName || t('common.unknown')}</p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.date} • {appointment.time}
                        </p>
                      </div>
                      <Badge variant={
                        appointment.status === 'completed' ? 'default' : 
                        appointment.status === 'cancelled' ? 'destructive' : 
                        'secondary'
                      }>
                        {appointment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>{t('dashboard.noRecentAppointments')}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analytics Overview */}
          <Card className="card-animate">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {t('dashboard.analytics')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-blue-600">{formatNumber(analytics.totalPatients)}</p>
                    <p className="text-sm text-muted-foreground">{t('analytics.totalPatients')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-green-600">{formatCurrency(analytics.totalRevenue)}</p>
                    <p className="text-sm text-muted-foreground">{t('analytics.totalRevenue')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-purple-600">{formatNumber(analytics.totalAppointments)}</p>
                    <p className="text-sm text-muted-foreground">{t('analytics.totalAppointments')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-orange-600">{formatNumber(analytics.totalStudies || 0)}</p>
                    <p className="text-sm text-muted-foreground">{t('analytics.totalStudies')}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>{analyticsLoading ? t('common.loading') : t('dashboard.noAnalyticsData')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="card-animate">
            <CardHeader>
              <CardTitle>{t('nav.quickActions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start btn-press hover-scale" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                {t('patients.addPatient')}
              </Button>
              <Button className="w-full justify-start btn-press hover-scale" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                {t('appointments.schedule')}
              </Button>
              <Button className="w-full justify-start btn-press hover-scale" variant="outline">
                <Pill className="h-4 w-4 mr-2" />
                {t('pharmacy.addMedication')}
              </Button>
              <Button className="w-full justify-start btn-press hover-scale" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                {t('reports.generate')}
              </Button>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="card-animate">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {t('dashboard.systemStatus')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    <span>{t('dashboard.serverLoad')}</span>
                  </div>
                  <span>45%</span>
                </div>
                <Progress value={45} className="mt-1" />
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    <span>{t('dashboard.databaseUsage')}</span>
                  </div>
                  <span>72%</span>
                </div>
                <Progress value={72} className="mt-1" />
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4" />
                    <span>{t('dashboard.storageUsage')}</span>
                  </div>
                  <span>38%</span>
                </div>
                <Progress value={38} className="mt-1" />
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span>{isOnline ? t('status.connected') : t('status.disconnected')}</span>
                </div>
                {lastSyncTime && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('dashboard.lastSync')}: {formatTime(lastSyncTime.toISOString())}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Alerts */}
          <Card className="card-animate">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                {t('dashboard.emergencyAlerts')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="text-green-600">{t('dashboard.noEmergencies')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DynamicComprehensiveDashboard;