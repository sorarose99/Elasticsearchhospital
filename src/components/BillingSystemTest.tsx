import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import billingService from '../services/BillingService';

interface BillingSystemTestProps {
  onClose?: () => void;
}

export const BillingSystemTest: React.FC<BillingSystemTestProps> = ({ onClose }) => {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [setupLoading, setSetupLoading] = useState(false);
  const [usersSetupLoading, setUsersSetupLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results: any = {
      database: { status: 'pending', message: 'Testing database connection...' },
      tables: { status: 'pending', message: 'Checking database tables...' },
      connection: { status: 'pending', message: 'Testing API connection...' },
      plans: { status: 'pending', message: 'Loading plans...' },
      paddle: { status: 'pending', message: 'Checking Paddle integration...' }
    };
    
    setTestResults({ ...results });

    try {
      // Test 1: Database connection
      try {
        const response = await fetch(`https://uszizembzrusjhpoeibm.supabase.co/functions/v1/make-server-89df438c/test-db`);
        const dbTest = await response.json();
        results.database = {
          status: dbTest.status === 'success' ? 'success' : 'error',
          message: dbTest.message,
          details: dbTest
        };
      } catch (error) {
        results.database = {
          status: 'error',
          message: `Database test failed: ${error.message}`,
          details: error
        };
      }
      setTestResults({ ...results });

      // Test 2: Check tables
      try {
        const response = await fetch(`https://uszizembzrusjhpoeibm.supabase.co/functions/v1/make-server-89df438c/check-tables`);
        const tablesTest = await response.json();
        const missingTables = Object.entries(tablesTest.tables || {}).filter(([_, info]: [string, any]) => !info.exists);
        
        results.tables = {
          status: missingTables.length === 0 ? 'success' : 'warning',
          message: missingTables.length === 0 ? 'All tables exist' : `${missingTables.length} tables missing`,
          details: tablesTest.tables,
          missingTables: missingTables.map(([name]) => name)
        };
      } catch (error) {
        results.tables = {
          status: 'error',
          message: `Tables check failed: ${error.message}`,
          details: error
        };
      }
      setTestResults({ ...results });

      // Test 3: API Connection test
      try {
        const connectionTest = await billingService.testConnection();
        results.connection = {
          status: 'success',
          message: 'API connection successful',
          details: connectionTest
        };
      } catch (error) {
        results.connection = {
          status: 'error',
          message: `API connection failed: ${error.message}`,
          details: error
        };
      }
      setTestResults({ ...results });

      // Test 4: Plans loading
      try {
        const plansData = await billingService.getSubscriptionPlans();
        setPlans(plansData);
        results.plans = {
          status: 'success',
          message: `Loaded ${plansData.length} subscription plans`,
          details: plansData
        };
      } catch (error) {
        results.plans = {
          status: 'error',
          message: `Failed to load plans: ${error.message}`,
          details: error
        };
      }
      setTestResults({ ...results });

      // Test 5: Paddle integration
      try {
        const connectionData = results.connection.details;
        if (connectionData?.status?.paddle === 'configured') {
          results.paddle = {
            status: 'success',
            message: 'Paddle integration configured',
            details: connectionData.status
          };
        } else {
          results.paddle = {
            status: 'warning',
            message: 'Paddle not configured (demo mode)',
            details: connectionData?.status || {}
          };
        }
      } catch (error) {
        results.paddle = {
          status: 'error',
          message: `Paddle test failed: ${error.message}`,
          details: error
        };
      }
      setTestResults({ ...results });

    } catch (error) {
      console.error('Test suite failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupDatabase = async () => {
    setSetupLoading(true);
    try {
      const response = await fetch(`https://uszizembzrusjhpoeibm.supabase.co/functions/v1/make-server-89df438c/setup-db`, {
        method: 'POST'
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        alert('Database setup completed successfully! Running tests again...');
        await runTests();
      } else {
        alert(`Database setup failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert(`Database setup error: ${error.message}`);
    } finally {
      setSetupLoading(false);
    }
  };

  const setupDemoUsers = async () => {
    setUsersSetupLoading(true);
    try {
      const response = await fetch(`https://uszizembzrusjhpoeibm.supabase.co/functions/v1/make-server-89df438c/setup-demo-users`, {
        method: 'POST'
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        const createdUsers = result.results.filter((r: any) => r.status === 'created').length;
        const existingUsers = result.results.filter((r: any) => r.status === 'exists').length;
        const errorUsers = result.results.filter((r: any) => r.status === 'error').length;
        
        alert(`Demo users setup completed!\nCreated: ${createdUsers}\nExisting: ${existingUsers}\nErrors: ${errorUsers}`);
      } else {
        alert(`Demo users setup failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert(`Demo users setup error: ${error.message}`);
    } finally {
      setUsersSetupLoading(false);
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'default',
      error: 'destructive',
      warning: 'secondary',
      pending: 'outline'
    };
    return variants[status as keyof typeof variants] || 'outline';
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Billing System Test</h2>
          <p className="text-gray-600">Check the status of the billing and subscription system</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={runTests} disabled={loading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Run Tests
          </Button>
          <Button 
            onClick={setupDatabase} 
            disabled={setupLoading} 
            variant="default"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${setupLoading ? 'animate-spin' : ''}`} />
            Setup Database
          </Button>
          <Button 
            onClick={setupDemoUsers} 
            disabled={usersSetupLoading} 
            variant="default"
            className="bg-green-600 hover:bg-green-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${usersSetupLoading ? 'animate-spin' : ''}`} />
            Create Demo Users
          </Button>
          {onClose && (
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          )}
        </div>
      </div>

      {testResults && (
        <div className="space-y-4">
          {Object.entries(testResults).map(([testName, result]: [string, any]) => (
            <Card key={testName}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(result.status)}
                  <span className="capitalize">{testName} Test</span>
                  <Badge variant={getStatusBadge(result.status)}>
                    {result.status}
                  </Badge>
                </CardTitle>
                <CardDescription>{result.message}</CardDescription>
              </CardHeader>
              {result.details && (
                <CardContent>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {plans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Available Subscription Plans</CardTitle>
            <CardDescription>Currently loaded plans in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div key={plan.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold">{plan.name}</h3>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                  <div className="mt-2">
                    <span className="text-lg font-bold">${plan.price}</span>
                    <span className="text-sm text-gray-500">/{plan.billing_cycle}</span>
                  </div>
                  <div className="mt-2 text-xs">
                    <div>Users: {plan.max_users}</div>
                    <div>Patients: {plan.max_patients}</div>
                    <div>Features: {Object.keys(plan.features || {}).length}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {testResults && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>System Status</AlertTitle>
          <AlertDescription>
            {testResults.database?.status === 'success' 
              ? 'Database connection is working. '
              : 'Database connection has issues. '}
            {testResults.tables?.status === 'warning' 
              ? `Missing tables detected: ${testResults.tables.missingTables?.join(', ')}. Click "Setup Database" to create them. `
              : testResults.tables?.status === 'success'
              ? 'All database tables exist. '
              : 'Database tables check failed. '}
            {testResults.paddle?.status === 'warning' 
              ? 'Running in demo mode - Paddle payments not configured.'
              : testResults.paddle?.status === 'success'
              ? 'Payment processing is fully operational.'
              : 'Payment processing has issues.'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default BillingSystemTest;