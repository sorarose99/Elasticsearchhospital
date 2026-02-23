import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from '../config/firebase';

export interface AuthUser {
  id: string;
  email: string | null;
  role?: string;
}

export const useFirebaseAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔐 Setting up Firebase auth listener...');
    
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        console.log('✅ User authenticated:', firebaseUser.email);
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          role: localStorage.getItem('userRole') || 'user'
        });
      } else {
        console.log('🔐 No user authenticated');
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      console.log('🔐 Signing in with Firebase...');
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Sign in successful');
      
      return { user: userCredential.user, error: null };
    } catch (err: any) {
      console.error('❌ Sign in error:', err);
      const errorMessage = err.message || 'Failed to sign in';
      setError(errorMessage);
      return { user: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      console.log('🔐 Creating new user with Firebase...');
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ User created successfully');
      
      return { user: userCredential.user, error: null };
    } catch (err: any) {
      console.error('❌ Sign up error:', err);
      const errorMessage = err.message || 'Failed to create account';
      setError(errorMessage);
      return { user: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      console.log('🔐 Signing out...');
      await firebaseSignOut(auth);
      localStorage.removeItem('userRole');
      console.log('✅ Sign out successful');
      return { error: null };
    } catch (err: any) {
      console.error('❌ Sign out error:', err);
      const errorMessage = err.message || 'Failed to sign out';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user
  };
};
