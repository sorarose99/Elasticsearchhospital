import React, { useState, useEffect, useRef } from 'react';
import { WebSocketProvider } from '../../services/WebSocketService';
import { FavoritesProvider } from '../../services/FavoritesService';
import { MenuCustomizationProvider } from '../../services/MenuCustomizationService';
import { ApiProvider } from '../../services/ApiProvider';
import { useLanguage } from '../../services/LanguageService';

interface SafeServiceProviderProps {
  children: React.ReactNode;
  userId: string;
  userRole: string;
  isDemoMode: boolean;
}

export const SafeServiceProvider = React.memo<SafeServiceProviderProps>(({ 
  children, 
  userId, 
  userRole, 
  isDemoMode 
}) => {
  const [servicesReady, setServicesReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();
  const initRef = useRef(false);

  useEffect(() => {
    // Prevent double initialization
    if (initRef.current) return;
    initRef.current = true;

    // Delay service initialization to prevent race conditions
    const timer = setTimeout(() => {
      try {
        setServicesReady(true);
      } catch (err) {
        console.error('Service initialization error:', err);
        setError('Failed to initialize services');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900/20 dark:to-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 border-4 border-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-yellow-600 text-2xl">⚠</span>
          </div>
          <h1 className="text-xl mb-2 text-yellow-800 dark:text-yellow-400">Service Error</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  if (!servicesReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  try {
    return (
      <ApiProvider>
        <MenuCustomizationProvider userId={userId} userRole={userRole}>
          <FavoritesProvider userId={userId} userRole={userRole}>
            <WebSocketProvider userId={userId} userRole={userRole} isDemoMode={isDemoMode}>
              {children}
            </WebSocketProvider>
          </FavoritesProvider>
        </MenuCustomizationProvider>
      </ApiProvider>
    );
  } catch (providerError) {
    console.error('Provider initialization error:', providerError);
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white dark:from-red-900/20 dark:to-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 border-4 border-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-red-600 text-2xl">✕</span>
          </div>
          <h1 className="text-xl mb-2 text-red-800 dark:text-red-400">Provider Error</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Failed to initialize application providers.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Restart Application
          </button>
        </div>
      </div>
    );
  }
});