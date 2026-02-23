/**
 * Safe Supabase client with error handling for fetch compatibility issues
 */

import { projectId, publicAnonKey } from './info';

// Singleton instance holder
let supabaseInstance: any = null;
let initializationPromise: Promise<any> | null = null;

// Function to get Supabase URL
const getUrl = () => {
  return `https://${projectId}.supabase.co`;
};

// Function to get the anon key
const getAnonKey = () => {
  if (typeof window !== 'undefined') {
    return publicAnonKey;
  }
  
  if (typeof process !== 'undefined' && process.env) {
    return process.env.NEW_SUPABASE_ANON_KEY || publicAnonKey;
  }
  
  if (typeof Deno !== 'undefined') {
    return Deno.env.get('NEW_SUPABASE_ANON_KEY') || publicAnonKey;
  }
  
  return publicAnonKey;
};

// Async function to create Supabase client with proper error handling
const createSupabaseClientSafe = async () => {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      // Dynamic import to handle potential fetch issues
      const { createClient } = await import('@supabase/supabase-js');
      
      supabaseInstance = createClient(
        getUrl(),
        getAnonKey(),
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            flowType: 'pkce',
            storage: typeof window !== 'undefined' ? window.localStorage : undefined,
            storageKey: 'supabase.auth.token'
          },
          global: {
            headers: {
              'X-Client-Info': 'hospital-management-system'
            }
          },
          realtime: {
            params: {
              eventsPerSecond: 10
            }
          }
        }
      );

      if (process.env.NODE_ENV === 'development') {
        console.log('✓ Supabase client created successfully (safe mode)');
      }

      return supabaseInstance;
    } catch (error) {
      console.error('Failed to create Supabase client:', error);
      
      // Return a mock client for development/testing
      const mockClient = {
        auth: {
          getSession: () => Promise.resolve({ data: { session: null }, error: null }),
          signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase not available') }),
          signOut: () => Promise.resolve({ error: null }),
          onAuthStateChange: () => ({
            data: { subscription: { unsubscribe: () => {} } }
          }),
          getUser: () => Promise.resolve({ data: { user: null }, error: null })
        },
        from: () => ({
          select: () => ({ limit: () => Promise.resolve({ data: [], error: null }) })
        }),
        channel: () => ({
          on: () => ({ subscribe: () => ({}) }),
          subscribe: () => ({})
        }),
        removeAllChannels: () => {}
      };

      supabaseInstance = mockClient;
      return mockClient;
    }
  })();

  return initializationPromise;
};

// Export a promise-based client
export const getSupabaseClient = async () => {
  return await createSupabaseClientSafe();
};

// Create a proxy that handles async initialization
export const supabase = new Proxy({} as any, {
  get(target, prop) {
    // Return a function that waits for client initialization
    return async (...args: any[]) => {
      const client = await createSupabaseClientSafe();
      const method = client[prop];
      
      if (typeof method === 'function') {
        return method.apply(client, args);
      }
      
      return method;
    };
  }
});

// For compatibility, also export synchronous version with fallback
export const supabaseSync = (() => {
  try {
    // Try to create synchronously
    const { createClient } = require('@supabase/supabase-js');
    return createClient(getUrl(), getAnonKey(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  } catch (error) {
    console.warn('Synchronous Supabase client creation failed, using async version');
    // Return the async version
    return supabase;
  }
})();

export default supabase;