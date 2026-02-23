import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { supabase } from '../../utils/supabase/client';
import { useLanguage } from '../../services/LanguageService';
import { CheckCircle, XCircle, RefreshCw, Database } from 'lucide-react';

const ConnectionTest: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const { t, isRTL } = useLanguage();

  const testConnection = async () => {
    setTesting(true);
    setResult(null);

    try {
      // Test 1: Basic client connection
      console.log('Testing Supabase connection...');
      console.log('URL:', supabase.supabaseUrl);
      console.log('Key:', supabase.supabaseKey.substring(0, 20) + '...');

      // Test 2: Auth test
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        console.error('Auth test failed:', authError);
      } else {
        console.log('Auth test passed:', !!session);
      }

      // Test 3: Try a simple query (this might fail if tables don't exist, but connection should work)
      const { data, error } = await supabase
        .from('_supabase_health_check')
        .select('*')
        .limit(1);

      if (error && !error.message.includes('relation') && !error.message.includes('does not exist')) {
        throw error;
      }

      // Connection successful
      setResult({
        success: true,
        message: t('status.connected'),
        details: {
          url: supabase.supabaseUrl,
          projectId: supabase.supabaseUrl.split('//')[1].split('.')[0],
          hasSession: !!session
        }
      });

    } catch (error: any) {
      console.error('Connection test failed:', error);
      setResult({
        success: false,
        message: error.message || t('error.networkError'),
        details: {
          url: supabase.supabaseUrl,
          error: error.message
        }
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Database className="h-5 w-5" />
          {t('status.connected')} {t('common.status')}
        </CardTitle>
        <CardDescription>
          {t('settings.system')} Supabase
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={testConnection}
          disabled={testing}
          className="w-full"
        >
          {testing ? (
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <CheckCircle className="h-4 w-4 mr-2" />
          )}
          {testing ? t('common.loading') : t('common.refresh')}
        </Button>

        {result && (
          <Alert className={result.success ? 'border-green-200 bg-green-50 dark:bg-green-900/20' : 'border-red-200 bg-red-50 dark:bg-red-900/20'}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {result.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <Badge variant={result.success ? 'default' : 'destructive'}>
                {result.success ? t('status.connected') : t('status.disconnected')}
              </Badge>
            </div>
            <AlertDescription className="mt-2">
              {result.message}
              {result.details && (
                <div className="mt-2 text-xs space-y-1">
                  <div><strong>URL:</strong> {result.details.url}</div>
                  {result.details.projectId && (
                    <div><strong>Project ID:</strong> {result.details.projectId}</div>
                  )}
                  {result.details.hasSession !== undefined && (
                    <div><strong>Session:</strong> {result.details.hasSession ? 'Active' : 'None'}</div>
                  )}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <div><strong>Current URL:</strong> {supabase.supabaseUrl}</div>
          <div><strong>Key:</strong> {supabase.supabaseKey.substring(0, 20)}...</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionTest;