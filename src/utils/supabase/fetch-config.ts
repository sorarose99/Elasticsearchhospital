/**
 * Custom fetch configuration for Supabase client
 * Handles compatibility issues with different environments
 */

// Create a custom fetch function that works in all environments
export const createCustomFetch = () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
    // Use native browser fetch
    return (url: RequestInfo | URL, options?: RequestInit) => {
      return window.fetch(url, options);
    };
  }

  // For server-side or environments without native fetch
  if (typeof globalThis.fetch === 'function') {
    return globalThis.fetch;
  }

  // Fallback for older environments
  return async (url: RequestInfo | URL, options?: RequestInit) => {
    try {
      // Dynamic import to avoid issues with bundlers
      const fetchModule = await import('node-fetch');
      const fetch = fetchModule.default || fetchModule;
      
      // Type assertion for compatibility
      return fetch(url as any, options as any) as Promise<Response>;
    } catch (error) {
      console.error('Failed to load fetch implementation:', error);
      throw new Error('Fetch not available in this environment');
    }
  };
};

// Custom Headers implementation
export const createCustomHeaders = () => {
  if (typeof window !== 'undefined' && window.Headers) {
    return window.Headers;
  }
  
  if (typeof globalThis.Headers !== 'undefined') {
    return globalThis.Headers;
  }

  // Minimal Headers polyfill
  return class Headers {
    private headers: Record<string, string> = {};

    constructor(init?: HeadersInit) {
      if (init) {
        if (Array.isArray(init)) {
          init.forEach(([key, value]) => {
            this.headers[key.toLowerCase()] = value;
          });
        } else if (typeof init === 'object') {
          Object.entries(init).forEach(([key, value]) => {
            this.headers[key.toLowerCase()] = value;
          });
        }
      }
    }

    append(name: string, value: string) {
      const existing = this.headers[name.toLowerCase()];
      this.headers[name.toLowerCase()] = existing ? `${existing}, ${value}` : value;
    }

    delete(name: string) {
      delete this.headers[name.toLowerCase()];
    }

    get(name: string) {
      return this.headers[name.toLowerCase()] || null;
    }

    has(name: string) {
      return name.toLowerCase() in this.headers;
    }

    set(name: string, value: string) {
      this.headers[name.toLowerCase()] = value;
    }

    forEach(callback: (value: string, key: string) => void) {
      Object.entries(this.headers).forEach(([key, value]) => {
        callback(value, key);
      });
    }

    *[Symbol.iterator]() {
      for (const [key, value] of Object.entries(this.headers)) {
        yield [key, value] as [string, string];
      }
    }
  };
};

// Configure global fetch for Supabase
export const configureSupabaseFetch = () => {
  const customFetch = createCustomFetch();
  const CustomHeaders = createCustomHeaders();

  // Set up globals if they don't exist
  if (typeof globalThis.fetch === 'undefined') {
    globalThis.fetch = customFetch;
  }

  if (typeof globalThis.Headers === 'undefined') {
    globalThis.Headers = CustomHeaders as any;
  }

  return {
    fetch: customFetch,
    Headers: CustomHeaders
  };
};

export default configureSupabaseFetch;