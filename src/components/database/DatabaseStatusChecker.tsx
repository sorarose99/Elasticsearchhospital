import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Database, 
  Server,
  Wifi,
  Settings,
  Play,
  Wrench
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';

interface DatabaseStatus {
  connected: boolean;
  error?: string;
  tables: Record<string, { exists: boolean; error?: string }>;
  subscription_plans: {
    available: boolean;
    source: 'database' | 'default' | 'fallback';
    count: number;
  };
}

interface DatabaseStatusCheckerProps {
  onClose?: () => void;
  autoRun?: boolean;
}

export const DatabaseStatusChecker: React.FC<DatabaseStatusCheckerProps> = ({ 
  onClose, 
  autoRun = false 
}) => {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [setupInProgress, setSetupInProgress] = useState(false);

  const projectId = 'uszizembzrusjhpoeibm'; // من ملف info.tsx
  const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-89df438c`;

  useEffect(() => {
    if (autoRun) {
      runDatabaseCheck();
    }
  }, [autoRun]);

  const runDatabaseCheck = async () => {
    setLoading(true);
    setProgress(0);
    
    try {
      // Test 1: Basic connection (public endpoint)
      setCurrentTest('Testing server connectivity...');
      setProgress(10);
      
      const pingResponse = await fetch(`${baseUrl}/ping`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!pingResponse.ok) {
        throw new Error(`Server ping failed: ${pingResponse.status}`);
      }
      
      // Test 2: Health check
      setCurrentTest('Checking server health...');
      setProgress(20);
      
      const serverHealthResponse = await fetch(`${baseUrl}/health`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const serverHealthData = await serverHealthResponse.json();
      
      // Test 3: Database connection (requires auth)
      setCurrentTest('Testing database connection...');
      setProgress(40);
      
      const connectionResponse = await fetch(`${baseUrl}/test-db`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sb-access-token') || 'anonymous'}`
        }
      });
      
      const connectionData = await connectionResponse.json();
      
      // Test 4: Check tables
      setCurrentTest('Checking database tables...');
      setProgress(60);
      
      const tablesResponse = await fetch(`${baseUrl}/check-tables`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const tablesData = await tablesResponse.json();
      
      // Test 5: Test subscription plans
      setCurrentTest('Testing subscription plans...');
      setProgress(70);
      
      const plansResponse = await fetch(`${baseUrl}/subscription-plans`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const plansData = await plansResponse.json();
      
      // Test 6: Final health check
      setCurrentTest('Running final health check...');
      setProgress(90);
      
      const finalHealthResponse = await fetch(`${baseUrl}/health`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const finalHealthData = await finalHealthResponse.json();
      
      setProgress(100);
      setCurrentTest('Complete!');
      
      // Compile results
      const finalStatus: DatabaseStatus = {
        connected: connectionResponse.ok && finalHealthResponse.ok,
        error: !connectionResponse.ok ? connectionData.error || 'Connection failed' : undefined,
        tables: tablesData.success ? tablesData.tables : {},
        subscription_plans: {
          available: plansResponse.ok && plansData.success,
          source: plansData.source || 'unknown',
          count: plansData.plans ? plansData.plans.length : 0
        }
      };
      
      setStatus(finalStatus);
      
    } catch (error) {
      console.error('Database check error:', error);
      setStatus({
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        tables: {},
        subscription_plans: {
          available: false,
          source: 'fallback',
          count: 0
        }
      });
    } finally {
      setLoading(false);
      setCurrentTest('');
    }
  };

  const setupDatabase = async () => {
    setSetupInProgress(true);
    
    try {
      // Use the new auto-fix endpoint
      setCurrentTest('Running auto-fix process...');
      
      const autoFixResponse = await fetch(`${baseUrl}/auto-fix`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const autoFixData = await autoFixResponse.json();
      
      if (autoFixResponse.ok) {
        setCurrentTest('Auto-fix completed! Running verification...');
        
        // Re-run tests to verify fixes
        await runDatabaseCheck();
        
        setCurrentTest('Setup complete!');
      } else {
        throw new Error(autoFixData.error || 'Auto-fix failed');
      }
      
    } catch (error) {
      console.error('Database setup error:', error);
      setCurrentTest('Setup failed - trying manual setup...');
      
      // Fallback to manual setup
      try {
        // Step 1: Setup database tables
        setCurrentTest('Creating database tables...');
        
        const setupResponse = await fetch(`${baseUrl}/setup-db`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        // Step 2: Setup demo users
        setCurrentTest('Setting up demo users...');
        
        const usersResponse = await fetch(`${baseUrl}/setup-demo-users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        setCurrentTest('Manual setup complete!');
        
        // Re-run tests
        await runDatabaseCheck();
        
      } catch (manualError) {
        console.error('Manual setup also failed:', manualError);
        setCurrentTest('Setup failed completely');
      }
    } finally {
      setSetupInProgress(false);
      setCurrentTest('');
    }
  };

  const getStatusIcon = (isOk: boolean, isWarning?: boolean) => {
    if (isWarning) return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    return isOk ? 
      <CheckCircle className="h-5 w-5 text-green-500" /> : 
      <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusBadge = (isOk: boolean, isWarning?: boolean) => {
    if (isWarning) return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Warning</Badge>;
    return isOk ? 
      <Badge variant="secondary" className="bg-green-100 text-green-800">OK</Badge> : 
      <Badge variant="destructive">Error</Badge>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto p-6"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle>Database Status Checker</CardTitle>
                <CardDescription>
                  Test database connectivity and setup status
                </CardDescription>
              </div>
            </div>
            {onClose && (
              <Button onClick={onClose} variant="ghost" size="sm">
                ✕
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="flex gap-3 flex-wrap">
            <Button 
              onClick={runDatabaseCheck} 
              disabled={loading || setupInProgress}
              className="flex items-center gap-2"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Run Tests
            </Button>
            
            <Button 
              onClick={setupDatabase} 
              disabled={loading || setupInProgress}
              variant="secondary"
              className="flex items-center gap-2"
            >
              {setupInProgress ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Wrench className="h-4 w-4" />
              )}
              Auto-Fix Issues
            </Button>
            
            {status && !status.connected && (
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reload Page
              </Button>
            )}
          </div>

          {/* Progress */}
          {(loading || setupInProgress) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{currentTest}</span>
                <span className="text-sm text-gray-500">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Results */}
          {status && (
            <div className="space-y-4">
              {/* Overall Status */}
              <Alert className={status.connected ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <div className="flex items-center gap-2">
                  {getStatusIcon(status.connected)}
                  <div>
                    <h4 className="font-medium">
                      Database Connection: {status.connected ? 'Connected' : 'Disconnected'}
                    </h4>
                    {status.error && (
                      <AlertDescription className="text-red-600">
                        {status.error}
                      </AlertDescription>
                    )}
                  </div>
                </div>
              </Alert>

              {/* Tables Status */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Database Tables
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(status.tables).map(([tableName, tableStatus]) => (
                      <div key={tableName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-mono text-sm">{tableName}</span>
                        {getStatusBadge(tableStatus.exists)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Subscription Plans Status */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Subscription Plans
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Plans Available:</span>
                      {getStatusBadge(status.subscription_plans.available, status.subscription_plans.source !== 'database')}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Source:</span>
                      <Badge variant="outline">
                        {status.subscription_plans.source}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Count:</span>
                      <span className="font-mono">{status.subscription_plans.count}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              {(!status.connected || status.subscription_plans.source === 'fallback') && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <div>
                    <h4 className="font-medium">Recommendations</h4>
                    <AlertDescription className="mt-1">
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {!status.connected && (
                          <li>Check your internet connection and Supabase configuration</li>
                        )}
                        {status.subscription_plans.source === 'fallback' && (
                          <li>Run database setup to create missing subscription_plans table</li>
                        )}
                        <li>Contact support if issues persist</li>
                      </ul>
                    </AlertDescription>
                  </div>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DatabaseStatusChecker;