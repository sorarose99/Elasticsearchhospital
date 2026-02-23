import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Settings
} from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface ServerHealth {
  status: 'healthy' | 'degraded' | 'unhealthy' | 'offline';
  timestamp: number;
  capabilities?: {
    database_operations: boolean;
    file_storage: boolean;
    subscription_management: boolean;
    offline_mode: boolean;
  };
  error?: string;
}

interface ConnectionStatusProps {
  onOpenDiagnostics?: () => void;
  className?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  onOpenDiagnostics, 
  className = '' 
}) => {
  const [serverHealth, setServerHealth] = useState<ServerHealth | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Check stored health status
    const checkStoredHealth = () => {
      try {
        const stored = localStorage.getItem('server-health');
        if (stored) {
          const health = JSON.parse(stored);
          setServerHealth(health);
          
          // Show if there are issues, if in debug mode, or if it's been more than 10 minutes
          const age = Date.now() - health.timestamp;
          const hasIssues = health.status !== 'healthy';
          const isDebugMode = health.mode === 'debug' || health.server_info?.debug_mode;
          const isStale = age > 10 * 60 * 1000;
          
          setIsVisible(hasIssues || isDebugMode || isStale);
        }
      } catch (error) {
        console.error('Error parsing server health:', error);
      }
    };

    // Check immediately
    checkStoredHealth();

    // Check periodically
    const interval = setInterval(checkStoredHealth, 30000); // Every 30 seconds

    // Listen for storage changes (when health is updated by other parts of the app)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'server-health') {
        checkStoredHealth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const getStatusIcon = () => {
    if (!serverHealth) return <RefreshCw className="h-4 w-4 animate-spin" />;
    
    switch (serverHealth.status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'unhealthy':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'offline':
        return <WifiOff className="h-4 w-4 text-gray-500" />;
      default:
        return <Wifi className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    if (!serverHealth) return 'bg-blue-100 border-blue-200';
    
    switch (serverHealth.status) {
      case 'healthy':
        return 'bg-green-100 border-green-200';
      case 'degraded':
        return 'bg-yellow-100 border-yellow-200';
      case 'unhealthy':
        return 'bg-red-100 border-red-200';
      case 'offline':
        return 'bg-gray-100 border-gray-200';
      default:
        return 'bg-blue-100 border-blue-200';
    }
  };

  const getStatusText = () => {
    if (!serverHealth) return 'Checking connection...';
    
    const age = Date.now() - serverHealth.timestamp;
    const minutes = Math.floor(age / 60000);
    
    let baseText = '';
    switch (serverHealth.status) {
      case 'healthy':
        baseText = 'System operational';
        break;
      case 'degraded':
        baseText = 'Limited functionality';
        break;
      case 'unhealthy':
        baseText = 'System issues detected';
        break;
      case 'offline':
        baseText = 'Working offline';
        break;
      default:
        baseText = 'Status unknown';
    }
    
    if (minutes > 5) {
      baseText += ` (${minutes}m ago)`;
    }
    
    return baseText;
  };

  const refreshStatus = async () => {
    const projectId = 'uszizembzrusjhpoeibm';
    
    try {
      // Try multiple endpoints in order of preference - all public, no auth needed
      const endpoints = [
        { url: `https://${projectId}.supabase.co/functions/v1/make-server-89df438c/ping`, name: 'ping' },
        { url: `https://${projectId}.supabase.co/functions/v1/make-server-89df438c/health`, name: 'health' },
        { url: `https://${projectId}.supabase.co/functions/v1/make-server-89df438c/info`, name: 'info' },
        { url: `https://${projectId}.supabase.co/functions/v1/make-server-89df438c/status`, name: 'status' }
      ];
      
      let lastError = null;
      
      for (const endpoint of endpoints) {
        try {
          console.log(`🔍 Testing ${endpoint.name} endpoint: ${endpoint.url}`);
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000);
          
          const response = await fetch(endpoint.url, {
            signal: controller.signal,
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            },
            mode: 'cors',
            credentials: 'omit' // Don't send any credentials for public endpoints
          });
          
          clearTimeout(timeoutId);
          
          console.log(`📡 ${endpoint.name} response status:`, response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log(`✅ ${endpoint.name} endpoint responded successfully:`, data);
            
            const newHealth = {
              status: data.status || data.overall || 'healthy',
              timestamp: Date.now(),
              capabilities: data.capabilities || {
                database_operations: data.supabase_config?.client_initialized || false,
                file_storage: true,
                subscription_management: true,
                offline_mode: false
              },
              endpoint_used: endpoint.name,
              server_info: {
                version: data.version,
                supabase_configured: data.supabase_config?.client_initialized || false
              }
            };
            
            localStorage.setItem('server-health', JSON.stringify(newHealth));
            setServerHealth(newHealth);
            return; // Success, exit the loop
          } else {
            // Try to get error details from response
            let errorDetails = `HTTP ${response.status}: ${response.statusText}`;
            try {
              const errorData = await response.json();
              errorDetails += ` - ${errorData.error || errorData.message || ''}`;
            } catch (e) {
              // Ignore JSON parse errors
            }
            lastError = errorDetails;
            console.warn(`⚠️ ${endpoint.name} failed:`, errorDetails);
          }
        } catch (endpointError) {
          lastError = endpointError.message;
          console.warn(`⚠️ ${endpoint.name} error:`, endpointError.message);
          continue; // Try next endpoint
        }
      }
      
      // If all endpoints failed
      throw new Error(lastError || 'All endpoints failed');
      
    } catch (error) {
      console.error('❌ All health checks failed:', error);
      
      const errorHealth = {
        status: 'offline' as const,
        timestamp: Date.now(),
        error: error.message || 'Connection failed',
        all_endpoints_failed: true
      };
      
      localStorage.setItem('server-health', JSON.stringify(errorHealth));
      setServerHealth(errorHealth);
    }
  };

  if (!isVisible || !serverHealth) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`${className}`}
      >
        <Alert className={`${getStatusColor()} cursor-pointer`} onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <AlertDescription className="font-medium">
                {getStatusText()}
              </AlertDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {serverHealth.status}
              </Badge>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  refreshStatus();
                }}
                className="h-6 w-6 p-0"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3 space-y-2"
              >
                {serverHealth.capabilities && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${serverHealth.capabilities.database_operations ? 'bg-green-500' : 'bg-red-500'}`} />
                      Database
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${serverHealth.capabilities.file_storage ? 'bg-green-500' : 'bg-red-500'}`} />
                      Storage
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${serverHealth.capabilities.subscription_management ? 'bg-green-500' : 'bg-red-500'}`} />
                      Billing
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${serverHealth.capabilities.offline_mode ? 'bg-yellow-500' : 'bg-green-500'}`} />
                      {serverHealth.capabilities.offline_mode ? 'Offline Mode' : 'Online'}
                    </div>
                  </div>
                )}
                
                {serverHealth.error && (
                  <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                    <strong>Error:</strong> {serverHealth.error}
                  </div>
                )}
                
                {onOpenDiagnostics && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDiagnostics();
                    }}
                    className="w-full mt-2"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Run Diagnostics
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Alert>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConnectionStatus;