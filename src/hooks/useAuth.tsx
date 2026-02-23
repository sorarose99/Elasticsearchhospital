import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { demoAccounts } from '../constants/demoAccounts';
import { User } from '../types/User';

type AuthChangeEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED';
type Session = any;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  
  // Refs to track auth state and prevent duplicate listeners
  const authListenerRef = useRef<{ data: { subscription: any } } | null>(null);
  const mountedRef = useRef(true);

  // Memoize user object to prevent re-renders
  const memoizedUser = useMemo(() => {
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      specialization: user.specialization,
      department: user.department
    };
  }, [user?.id, user?.email, user?.name, user?.role, user?.specialization, user?.department]);

  // Callback to handle auth state changes
  const handleAuthStateChange = useCallback((event: AuthChangeEvent, session: Session | null) => {
    if (!mountedRef.current) return;
    
    try {
      if (session?.user && !isDemoMode) {
        const userData = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.email!,
          role: session.user.user_metadata?.role || 'user',
          specialization: session.user.user_metadata?.specialization,
          department: session.user.user_metadata?.department
        };
        setUser(userData);
      } else if (!isDemoMode) {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth state change error:', error);
    } finally {
      if (!authInitialized) {
        setAuthInitialized(true);
      }
      setLoading(false);
    }
  }, [isDemoMode, authInitialized]);

  useEffect(() => {
    // Mark component as mounted
    mountedRef.current = true;

    // Initialize auth only once with proper cleanup
    const initializeAuth = async () => {
      try {
        const supabase = supabaseClientRef.current;
        
        // Check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('Session check error:', error);
          setLoading(false);
          setAuthInitialized(true);
          return;
        }
        
        // Handle initial session
        handleAuthStateChange('INITIAL_SESSION', session);
        
        // Set up auth listener only if not already set up and component is mounted
        if (!authListenerRef.current && mountedRef.current) {
          authListenerRef.current = supabase.auth.onAuthStateChange(handleAuthStateChange);
        }
        
      } catch (error) {
        console.error('Auth initialization error:', error);
        setLoading(false);
        setAuthInitialized(true);
      }
    };

    initializeAuth();

    // Cleanup function
    return () => {
      mountedRef.current = false;
      
      // Clean up auth listener when component unmounts
      if (authListenerRef.current) {
        try {
          authListenerRef.current.data.subscription.unsubscribe();
          authListenerRef.current = null;
        } catch (error) {
          console.warn('Auth cleanup error:', error);
        }
      }
    };
  }, []); // Empty dependency array to run only once
  
  // Separate effect to handle demo mode changes
  useEffect(() => {
    if (isDemoMode && authListenerRef.current) {
      // Clean up Supabase auth when entering demo mode
      try {
        authListenerRef.current.data.subscription.unsubscribe();
        authListenerRef.current = null;
      } catch (error) {
        console.warn('Demo mode auth cleanup error:', error);
      }
    }
  }, [isDemoMode]);

  const handleLogin = useCallback(async (email: string, password: string) => {
    try {
      // Check if it's a demo account first
      const demoAccount = demoAccounts.find(account => 
        account.email === email && account.password === password
      );

      if (demoAccount) {
        // Demo login - set user directly without Supabase auth
        setIsDemoMode(true);
        setUser(demoAccount.user);
        setLoading(false);
        return { user: demoAccount.user };
      }

      // Regular Supabase authentication
      setLoading(true);
      const supabase = supabaseClientRef.current;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase auth error:', error);
        throw error;
      }

      setIsDemoMode(false);
      // Don't set user here - let the auth state change handler do it
      return data;
    } catch (error: any) {
      console.error('Login error:', error);
      setLoading(false);
      // Re-throw the error for the UI to handle
      throw new Error(error.message || 'Authentication failed');
    }
  }, []);

  const handleRegister = useCallback(async (userData: any) => {
    try {
      setLoading(true);
      const supabase = supabaseClientRef.current;
      
      // Create user account in Supabase
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: `${userData.firstName} ${userData.lastName}`,
            role: userData.role,
            specialization: userData.specialization,
            department: userData.department,
            licenseNumber: userData.licenseNumber,
            experience: userData.experience,
            phone: userData.phone,
            notes: userData.notes
          }
        }
      });

      if (error) {
        console.error('Supabase registration error:', error);
        throw error;
      }

      setIsDemoMode(false);
      // Don't set user here - let the auth state change handler do it
      return data;
    } catch (error: any) {
      console.error('Registration error:', error);
      setLoading(false);
      // Re-throw the error for the UI to handle
      throw new Error(error.message || 'Registration failed');
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      setLoading(true);
      
      if (isDemoMode) {
        // Demo logout - just clear user state
        setUser(null);
        setIsDemoMode(false);
        setLoading(false);
      } else {
        // Regular Supabase logout - don't set user to null here, let auth handler do it
        const supabase = supabaseClientRef.current;
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.warn('Logout error:', error);
          // Force logout even if there's an error
          setUser(null);
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      setUser(null);
      setIsDemoMode(false);
      setLoading(false);
    }
  }, [isDemoMode]);

  return {
    user: memoizedUser,
    loading,
    isDemoMode,
    authInitialized,
    handleLogin,
    handleRegister,
    handleLogout
  };
}