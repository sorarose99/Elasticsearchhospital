import { useState, useEffect } from 'react';
import { useLocalAuth } from './useLocalAuth';
import { useFirebaseAuth } from './useFirebaseAuth';

// Unified auth hook that can switch between local and Firebase auth
export const useAdaptiveAuth = () => {
  const [authType, setAuthType] = useState<'local' | 'firebase'>('local');
  const [isInitialized, setIsInitialized] = useState(false);

  const localAuth = useLocalAuth();
  const firebaseAuth = useFirebaseAuth();

  // Initialize auth type from preferences or auto-detect
  useEffect(() => {
    const initializeAuthType = async () => {
      try {
        // Check for stored preference
        let storedAuthType = localStorage.getItem('preferredAuthType') as 'local' | 'firebase' | 'supabase' | null;
        
        // Migrate old 'supabase' preference to 'firebase'
        if (storedAuthType === 'supabase') {
          console.log('🔄 Migrating auth preference from supabase to firebase');
          storedAuthType = 'firebase';
          localStorage.setItem('preferredAuthType', 'firebase');
        }
        
        if (storedAuthType && (storedAuthType === 'local' || storedAuthType === 'firebase')) {
          console.log('🔧 Using stored auth preference:', storedAuthType);
          setAuthType(storedAuthType);
          setIsInitialized(true);
          return;
        }

        // Auto-detect based on existing sessions
        const hasLocalSession = localStorage.getItem('currentUser') !== null;
        const hasFirebaseSession = localStorage.getItem('firebase:authUser') !== null;

        if (hasFirebaseSession) {
          console.log('🔧 Detected existing Firebase session, using Firebase auth');
          setAuthType('firebase');
          localStorage.setItem('preferredAuthType', 'firebase');
        } else if (hasLocalSession) {
          console.log('🔧 Detected existing local session, using local auth');
          setAuthType('local');
          localStorage.setItem('preferredAuthType', 'local');
        } else {
          // Default to local auth for new users
          console.log('🔧 No existing session found, defaulting to local auth');
          setAuthType('local');
          localStorage.setItem('preferredAuthType', 'local');
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing auth type:', error);
        // Fallback to local auth
        setAuthType('local');
        localStorage.setItem('preferredAuthType', 'local');
        setIsInitialized(true);
      }
    };

    initializeAuthType();
  }, []);

  // Switch auth type
  const switchAuthType = (newType: 'local' | 'firebase') => {
    console.log('🔄 Switching auth type from', authType, 'to', newType);
    
    // Store preference
    localStorage.setItem('preferredAuthType', newType);
    
    // Clear existing sessions when switching
    if (newType === 'local' && authType === 'firebase') {
      // Switching to local - clear Firebase session
      firebaseAuth.signOut();
    } else if (newType === 'firebase' && authType === 'local') {
      // Switching to Firebase - clear local session
      localAuth.signOut();
    }
    
    setAuthType(newType);
  };

  // Return the appropriate auth hook based on current type
  const currentAuth = authType === 'firebase' ? firebaseAuth : localAuth;

  // Enhanced loading state - wait for initialization
  const isLoading = !isInitialized || currentAuth.loading;

  return {
    ...currentAuth,
    loading: isLoading,
    authType,
    switchAuthType,
    isInitialized,
    // Additional info for debugging
    localAuth: {
      user: localAuth.user,
      loading: localAuth.loading,
      isAuthenticated: localAuth.user !== null
    },
    firebaseAuth: {
      user: firebaseAuth.user,
      loading: firebaseAuth.loading,
      isAuthenticated: firebaseAuth.user !== null
    }
  };
};
