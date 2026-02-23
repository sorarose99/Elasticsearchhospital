// Stub file - Supabase has been replaced with Firebase
// This file is kept for backward compatibility

console.warn('⚠️ Supabase client is deprecated. Please use Firebase instead.');

export const getSupabaseClient = () => {
  throw new Error('Supabase has been replaced with Firebase. Please use Firebase services instead.');
};

export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signOut: () => Promise.resolve({ error: null })
  }
};
