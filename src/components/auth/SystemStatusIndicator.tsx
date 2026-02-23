import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { CheckCircle, AlertCircle, Loader2, Server, Database, Users, Wifi, WifiOff } from 'lucide-react';
import { localApiService } from '../../services/LocalApiService';

interface SystemStatusIndicatorProps {
  className?: string;
}

const SystemStatusIndicator: React.FC<SystemStatusIndicatorProps> = ({ className = '' }) => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        setStatus('checking');
        const result = await localApiService.testConnection();
        if (result.success) {
          setStatus('online');
        } else {
          setStatus('offline');
        }
        setLastCheck(new Date());
      } catch (error) {
        setStatus('offline');
        setLastCheck(new Date());
      }
    };

    // Check immediately
    checkStatus();

    // Check every 30 seconds
    const interval = setInterval(checkStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'checking': return 'text-yellow-600 bg-yellow-50';
      case 'online': return 'text-green-600 bg-green-50';
      case 'offline': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'checking': return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'online': return <CheckCircle className="w-4 h-4" />;
      case 'offline': return <AlertCircle className="w-4 h-4" />;
      default: return <Server className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking': return 'جارٍ فحص الحالة...';
      case 'online': return 'النظام يعمل بشكل طبيعي';
      case 'offline': return 'النظام غير متاح حالياً';
      default: return 'حالة غير معروفة';
    }
  };

  return (
    <Card className={`border-0 shadow-sm bg-white/80 backdrop-blur-sm ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getStatusColor()}`}>
              {getStatusIcon()}
            </div>
            <div>
              <div className="font-medium text-sm">حالة النظام</div>
              <div className="text-xs text-muted-foreground">
                {getStatusText()}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className={getStatusColor()}>
              {status === 'checking' && 'فحص الحالة'}
              {status === 'online' && 'متصل'}
              {status === 'offline' && 'غير متصل'}
            </Badge>
            {lastCheck && (
              <div className="text-xs text-muted-foreground">
                آخر فحص: {lastCheck.toLocaleTimeString('ar-SA')}
              </div>
            )}
          </div>
        </div>

        {/* System capabilities */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="flex items-center gap-1 text-xs">
            <Database className="w-3 h-3 text-green-600" />
            <span className="text-green-600">قاعدة البيانات</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Users className="w-3 h-3 text-blue-600" />
            <span className="text-blue-600">المصادقة</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Server className="w-3 h-3 text-purple-600" />
            <span className="text-purple-600">الخادم المحلي</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            {status === 'online' ? (
              <>
                <Wifi className="w-3 h-3 text-green-600" />
                <span className="text-green-600">متصل</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-red-600" />
                <span className="text-red-600">غير متصل</span>
              </>
            )}
          </div>
        </div>

        {/* Local mode indicator */}
        <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
          <div className="text-xs text-blue-700 text-center">
            🔒 يعمل النظام في الوضع المحلي مع بيانات تجريبية آمنة
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatusIndicator;