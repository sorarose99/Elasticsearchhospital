import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Wifi, WifiOff, RefreshCw, Database, Server } from 'lucide-react';
import { useApi } from '../services/ApiProvider';
import { useAdaptiveAuth } from '../hooks/useAdaptiveAuth';

interface ConnectionStatusIndicatorProps {
  className?: string;
  compact?: boolean;
}

export const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({ 
  className = '', 
  compact = false 
}) => {
  const { apiService, isOnline, connectionStatus } = useApi();
  const { authType } = useAdaptiveAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'online':
        return 'bg-success';
      case 'offline':
        return 'bg-muted';
      case 'checking':
        return 'bg-warning';
      default:
        return 'bg-muted';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'online':
        return <Wifi className="w-4 h-4 text-success" />;
      case 'offline':
        return <WifiOff className="w-4 h-4 text-muted-foreground" />;
      case 'checking':
        return <RefreshCw className="w-4 h-4 text-warning animate-spin" />;
      default:
        return <WifiOff className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getApiServiceName = () => {
    // Check if apiService has a name property or check the constructor name
    const serviceName = apiService?.name || 'Unknown';
    return serviceName.includes('Firebase') ? 'Firebase' : 'Local';
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Force a connection check by reloading the page
      window.location.reload();
    } catch (error) {
      console.error('Failed to refresh connection:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1 rounded-lg bg-card border ${className}`}>
        {getStatusIcon()}
        <span className="text-sm">
          {connectionStatus === 'online' ? 'Online' : 'Offline'}
        </span>
      </div>
    );
  }

  return (
    <Card className={`${className} max-w-md`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Server className="w-5 h-5" />
          حالة الاتصال
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="font-medium">
              {connectionStatus === 'online' ? 'متصل' : 
               connectionStatus === 'offline' ? 'غير متصل' : 'جاري الفحص...'}
            </span>
          </div>
          <Badge variant={connectionStatus === 'online' ? 'default' : 'secondary'} className={getStatusColor()}>
            {connectionStatus === 'online' ? 'نشط' : 'متوقف'}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">نوع API:</span>
            <div className="flex items-center gap-1">
              <Database className="w-3 h-3" />
              <span>{getApiServiceName()}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">المصادقة:</span>
            <span className="capitalize">{authType}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">الوضع:</span>
            <span>
              {isOnline ? 'Production' : 'Local/Offline'}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t">
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            variant="outline" 
            size="sm" 
            className="w-full"
          >
            {isRefreshing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                جاري التحديث...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                تحديث الاتصال
              </>
            )}
          </Button>
        </div>

        {connectionStatus === 'offline' && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              النظام يعمل في الوضع المحلي. بعض الميزات قد تكون محدودة.
            </p>
          </div>
        )}

        {connectionStatus === 'online' && (
          <div className="p-3 bg-success/10 rounded-lg">
            <p className="text-sm text-success">
              متصل بخادم Supabase. جميع الميزات متاحة.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConnectionStatusIndicator;