// Global error handlers for the application

export function setupGlobalErrorHandlers() {
  // Handle unhandled promise rejections
  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Promise rejection details:', {
        reason: event.reason,
        promise: event.promise
      });
    }
  };

  // Handle global errors
  const handleError = (event: ErrorEvent) => {
    console.error('Global error:', event.error);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error details:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    }
  };

  // Register handlers
  window.addEventListener('unhandledrejection', handleUnhandledRejection);
  window.addEventListener('error', handleError);

  // Return cleanup function
  return () => {
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    window.removeEventListener('error', handleError);
  };
}

export function setupCleanup() {
  // Cleanup function to run on app unmount or page unload
  const handleBeforeUnload = () => {
    try {
      console.log('Cleaning up application resources...');
      // Add any cleanup logic here
    } catch (error) {
      console.warn('Cleanup error:', error);
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}
