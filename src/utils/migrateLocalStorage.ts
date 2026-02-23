/**
 * Migrate old Supabase localStorage entries to Firebase
 * This runs automatically on app startup
 */

export const migrateLocalStorage = () => {
  try {
    console.log('🔄 Checking for old Supabase data to migrate...');

    // Migrate auth preference
    const authType = localStorage.getItem('preferredAuthType');
    if (authType === 'supabase') {
      console.log('✅ Migrating auth preference: supabase → firebase');
      localStorage.setItem('preferredAuthType', 'firebase');
    }

    // Migrate API service preference
    const apiService = localStorage.getItem('preferredApiService');
    if (apiService === 'supabase') {
      console.log('✅ Migrating API service preference: supabase → firebase');
      localStorage.setItem('preferredApiService', 'firebase');
    }

    // Remove old Supabase tokens
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
        keysToRemove.push(key);
      }
    }

    if (keysToRemove.length > 0) {
      console.log(`✅ Removing ${keysToRemove.length} old Supabase entries`);
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }

    console.log('✅ Migration complete');
  } catch (error) {
    console.warn('⚠️ Error during localStorage migration:', error);
  }
};

// Auto-run migration on import
if (typeof window !== 'undefined') {
  migrateLocalStorage();
}
