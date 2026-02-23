import React, { createContext, useContext, useState, useEffect } from 'react';
import { localApiService } from './LocalApiService';
import { firebaseApiService } from './FirebaseApiService';

interface ApiContextType {
  apiService: any;
  isOnline: boolean;
  connectionStatus: 'online' | 'offline' | 'checking';
}

const ApiContext = createContext<ApiContextType>({
  apiService: localApiService,
  isOnline: false,
  connectionStatus: 'checking'
});

export const useApi = () => useContext(ApiContext);

interface ApiProviderProps {
  children: React.ReactNode;
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const [apiService, setApiService] = useState<any>(localApiService);
  const [isOnline, setIsOnline] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  useEffect(() => {
    const checkConnection = async () => {
      setConnectionStatus('checking');
      
      try {
        // Try to ping the Firebase service
        const response = await firebaseApiService.ping();
        
        if (response.pong) {
          console.log('✅ Firebase API is online');
          setApiService(firebaseApiService);
          setIsOnline(true);
          setConnectionStatus('online');
          
          // Store the connection preference
          localStorage.setItem('preferredApiService', 'firebase');
        } else {
          throw new Error('Invalid response from Firebase API');
        }
      } catch (error) {
        console.warn('⚠️ Firebase API unavailable, using local service:', error);
        setApiService(localApiService);
        setIsOnline(false);
        setConnectionStatus('offline');
        
        // Store the fallback preference
        localStorage.setItem('preferredApiService', 'local');
      }
    };

    // Check stored preference first
    let storedPreference = localStorage.getItem('preferredApiService');
    let authType = localStorage.getItem('preferredAuthType');
    
    // Migrate old 'supabase' preferences to 'firebase'
    if (storedPreference === 'supabase') {
      storedPreference = 'firebase';
      localStorage.setItem('preferredApiService', 'firebase');
    }
    if (authType === 'supabase') {
      authType = 'firebase';
      localStorage.setItem('preferredAuthType', 'firebase');
    }
    
    // If user prefers Firebase auth, try Firebase API
    if (authType === 'firebase' || storedPreference === 'firebase') {
      checkConnection();
    } else {
      // Default to local for now
      setApiService(localApiService);
      setIsOnline(false);
      setConnectionStatus('offline');
    }

    // Set up periodic connection checks
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Listen for auth type changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'preferredAuthType') {
        if (e.newValue === 'firebase') {
          // Switch to Firebase API if auth switched to Firebase
          checkConnection();
        } else if (e.newValue === 'local') {
          // Switch to local API if auth switched to local
          setApiService(localApiService);
          setIsOnline(false);
          setConnectionStatus('offline');
        }
      }
    };

    const checkConnection = async () => {
      try {
        await firebaseApiService.ping();
        setApiService(firebaseApiService);
        setIsOnline(true);
        setConnectionStatus('online');
      } catch {
        setApiService(localApiService);
        setIsOnline(false);
        setConnectionStatus('offline');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value = {
    apiService,
    isOnline,
    connectionStatus
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
};

export default ApiProvider;