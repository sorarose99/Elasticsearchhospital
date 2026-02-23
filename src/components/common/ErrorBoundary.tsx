import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorType?: string;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Determine error type
    let errorType = 'general';
    if (error.message.includes('GoTrueClient') || error.message.includes('Multiple GoTrueClient instances')) {
      errorType = 'supabase_auth';
    } else if (error.message.includes('supabase') || error.message.includes('Supabase')) {
      errorType = 'supabase_general';
    }
    
    return { hasError: true, error, errorType };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
    
    // Enhanced logging for Supabase-related errors
    if (error.message.includes('GoTrueClient') || error.message.includes('supabase')) {
      console.error('🔴 Supabase-related error detected:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
      
      // Attempt to reset Supabase client if it's a GoTrueClient error
      if (error.message.includes('GoTrueClient')) {
        try {
          const { resetSupabaseClient } = require('../../utils/supabase/client');
          resetSupabaseClient();
          console.log('🔄 Attempted to reset Supabase client due to GoTrueClient error');
        } catch (resetError) {
          console.error('Failed to reset Supabase client:', resetError);
        }
      }
    }
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleClearDataAndRefresh = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn('Could not clear storage:', e);
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isSupabaseError = this.state.errorType?.includes('supabase');
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-white dark:from-red-900/20 dark:to-background flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 border-4 border-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-red-600 text-2xl">!</span>
            </div>
            <h1 className="text-xl mb-2 text-red-800 dark:text-red-400">
              {isSupabaseError ? 'Connection Error' : 'Something went wrong'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {isSupabaseError 
                ? 'There was an issue with the database connection. Please refresh the page to reconnect.'
                : 'The application encountered an error. Please refresh the page to try again.'
              }
            </p>
            <div className="space-y-2">
              <button
                onClick={this.handleRefresh}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Refresh Page
              </button>
              {isSupabaseError && (
                <button
                  onClick={this.handleClearDataAndRefresh}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Clear Data & Refresh
                </button>
              )}
            </div>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs text-left">
                <strong>Error:</strong> {this.state.error?.message}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}