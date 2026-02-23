/**
 * Supabase cleanup utilities to prevent multiple GoTrueClient instances
 */

export const cleanupSupabaseInstances = () => {
  try {
    // Clear any existing auth storage that might cause conflicts
    if (typeof window !== 'undefined') {
      // Clear all potential Supabase storage keys
      const keysToRemove = [
        'supabase.auth.token',
        'hospital-management-supabase-auth',
        'sb-auth-token'
      ];
      
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        } catch (e) {
          console.warn(`Could not remove storage key ${key}:`, e);
        }
      });
      
      // Clear any global Supabase references
      delete window.__HOSPITAL_SUPABASE_CLIENT__;
      delete window.__HOSPITAL_SUPABASE_INSTANCE_COUNT__;
      
      console.log('🧹 Cleaned up Supabase storage and global references');
    }
  } catch (error) {
    console.error('Error during Supabase cleanup:', error);
  }
};

export const preventMultipleSupabaseInstances = () => {
  if (typeof window !== 'undefined') {
    // Add a flag to track if we've already initialized
    if (window.__HOSPITAL_SUPABASE_INITIALIZED__) {
      console.warn('⚠️ Attempted to initialize Supabase multiple times - prevented');
      return false;
    }
    
    window.__HOSPITAL_SUPABASE_INITIALIZED__ = true;
    return true;
  }
  return true;
};

declare global {
  interface Window {
    __HOSPITAL_SUPABASE_INITIALIZED__?: boolean;
  }
}