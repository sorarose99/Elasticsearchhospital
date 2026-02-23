import { useState, useEffect, useCallback } from 'react';
import { demoAccounts } from '../constants/demoAccounts';
import { User } from '../types/User';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export const useLocalAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem('currentUser');
        const savedAuthType = localStorage.getItem('authType');
        
        if (savedUser && savedAuthType) {
          const userData = JSON.parse(savedUser);
          console.log('✅ Restored user session:', userData.email);
          setAuthState({
            user: userData,
            loading: false,
            error: null,
            isAuthenticated: true,
          });
        } else {
          console.log('🔐 No existing session found');
          setAuthState(prev => ({
            ...prev,
            loading: false,
          }));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear corrupted data
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authType');
        setAuthState({
          user: null,
          loading: false,
          error: 'Session data corrupted',
          isAuthenticated: false,
        });
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

      console.log('🔐 Attempting local sign in for:', email);
      console.log('🔍 Available demo accounts:', demoAccounts.length);
      
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Debug: Log all available emails for comparison
      console.log('📋 Available emails:', demoAccounts.map(acc => acc.email));

      // Find matching demo account
      const matchingAccount = demoAccounts.find(
        account => account.email.toLowerCase() === email.toLowerCase() && account.password === password
      );

      if (!matchingAccount) {
        console.error('❌ Invalid login credentials for:', email);
        console.log('🔍 Searched for email:', email, 'password:', password);
        console.log('🔍 Available accounts:', demoAccounts.map(acc => ({
          email: acc.email,
          password: acc.password,
          role: acc.user.role
        })));
        throw new Error('Invalid login credentials');
      }

      console.log('✅ Found matching account:', matchingAccount.user.name, 'Role:', matchingAccount.user.role);

      // Test localStorage before using it
      try {
        localStorage.setItem('test', 'value');
        localStorage.removeItem('test');
      } catch (storageError) {
        console.error('❌ localStorage not available:', storageError);
        throw new Error('Browser storage not available. Please enable localStorage.');
      }

      // Create user session
      const user: User = {
        ...matchingAccount.user,
        lastLogin: new Date().toISOString(),
        isActive: true,
      };

      console.log('💾 Storing user session:', user);

      // Store in localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('authType', 'local');
      localStorage.setItem('sb-access-token', `local-token-${user.id}`);

      // Verify storage worked
      const storedUser = localStorage.getItem('currentUser');
      if (!storedUser) {
        throw new Error('Failed to store user session in localStorage');
      }

      console.log('✅ User session stored successfully');

      setAuthState({
        user,
        loading: false,
        error: null,
        isAuthenticated: true,
      });

      console.log('✅ Login successful for:', email, 'Auth state updated');
      return { data: { user }, error: null };

    } catch (error: any) {
      console.error('❌ Local sign in error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        email,
        demoAccountsAvailable: demoAccounts?.length || 0
      });
      
      const errorMessage = error.message || 'Sign in failed';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { data: null, error: errorMessage };
    }
  };

  const signUp = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    phone?: string;
    specialization?: string;
    department?: string;
  }) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

      console.log('📝 Local sign up for:', userData.email);

      // Check if email already exists
      const existingAccount = demoAccounts.find(account => account.email === userData.email);
      if (existingAccount) {
        throw new Error('Email already registered');
      }

      // Create new user (in a real app, this would be stored in database)
      const newUser: User = {
        id: `local-${Date.now()}`,
        email: userData.email,
        role: userData.role,
        name: `${userData.firstName} ${userData.lastName}`,
        specialization: userData.specialization,
        department: userData.department,
        isActive: true,
      };

      console.log('✅ Local registration successful for:', userData.email);

      // Store in localStorage
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      localStorage.setItem('authType', 'local');
      localStorage.setItem('sb-access-token', `local-token-${newUser.id}`);

      setAuthState({
        user: newUser,
        loading: false,
        error: null,
        isAuthenticated: true,
      });

      return { data: { user: newUser }, error: null };

    } catch (error: any) {
      console.error('Local sign up error:', error);
      const errorMessage = error.message || 'Registration failed';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { data: null, error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

      console.log('🚪 Local sign out');

      // Clear localStorage
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authType');
      localStorage.removeItem('sb-access-token');

      setAuthState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });

      return { error: null };

    } catch (error: any) {
      console.error('Local sign out error:', error);
      setAuthState(prev => ({ ...prev, loading: false, error: error.message }));
      return { error: error.message };
    }
  };

  const resetPassword = async (email: string) => {
    // In local mode, we can't reset passwords
    return { 
      error: 'Password reset not available in local mode. Use demo accounts or contact administrator.' 
    };
  };

  const updatePassword = async (newPassword: string) => {
    // In local mode, we can't update passwords
    return { 
      error: 'Password updates not available in local mode.' 
    };
  };

  const updateProfile = async (updates: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    specialization?: string;
    department?: string;
  }) => {
    try {
      if (!authState.user) throw new Error('No authenticated user');

      const updatedUser: User = {
        ...authState.user,
        name: updates.firstName && updates.lastName ? 
          `${updates.firstName} ${updates.lastName}` : authState.user.name,
        specialization: updates.specialization || authState.user.specialization,
        department: updates.department || authState.user.department,
      };

      // Update localStorage
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));

      return { error: null };

    } catch (error: any) {
      return { error: error.message };
    }
  };

  const refreshUser = useCallback(async () => {
    // In local mode, just return current user
    return authState.user;
  }, [authState.user]);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!authState.user) return false;
    if (authState.user.role === 'admin') return true;
    // In local mode, all users have basic permissions
    return true;
  }, [authState.user]);

  const isDoctor = useCallback((): boolean => {
    return authState.user?.role === 'doctor';
  }, [authState.user]);

  const isNurse = useCallback((): boolean => {
    return authState.user?.role === 'nurse';
  }, [authState.user]);

  const isAdmin = useCallback((): boolean => {
    return authState.user?.role === 'admin';
  }, [authState.user]);

  const isReceptionist = useCallback((): boolean => {
    return authState.user?.role === 'receptionist';
  }, [authState.user]);

  const isLabTechnician = useCallback((): boolean => {
    return authState.user?.role === 'lab_tech';
  }, [authState.user]);

  const isPharmacist = useCallback((): boolean => {
    return authState.user?.role === 'pharmacist';
  }, [authState.user]);

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    isAuthenticated: authState.isAuthenticated,
    session: authState.user ? { user: authState.user } : null,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    refreshUser,
    hasPermission,
    isDoctor,
    isNurse,
    isAdmin,
    isReceptionist,
    isLabTechnician,
    isPharmacist,
    // For compatibility with existing code
    supabase: null,
  };
};