/**
 * Browser polyfills and compatibility fixes
 * Ensures proper functioning across different environments
 */

// Fix for fetch compatibility issues
if (typeof globalThis === 'undefined') {
  // @ts-ignore
  var globalThis = typeof window !== 'undefined' ? window : global;
}

// Ensure fetch is available globally
if (typeof globalThis.fetch === 'undefined') {
  if (typeof window !== 'undefined') {
    // Browser environment - fetch should be available
    console.warn('Fetch not available in browser environment');
  } else {
    // Node environment - import node-fetch
    try {
      const { default: fetch, Headers, Request, Response } = require('node-fetch');
      globalThis.fetch = fetch;
      globalThis.Headers = Headers;
      globalThis.Request = Request;
      globalThis.Response = Response;
    } catch (error) {
      console.warn('Could not load node-fetch polyfill:', error);
    }
  }
}

// Fix for URL and URLSearchParams if needed
if (typeof globalThis.URL === 'undefined') {
  if (typeof window !== 'undefined') {
    globalThis.URL = window.URL;
    globalThis.URLSearchParams = window.URLSearchParams;
  }
}

// Fix for AbortController if needed
if (typeof globalThis.AbortController === 'undefined') {
  if (typeof window !== 'undefined' && window.AbortController) {
    globalThis.AbortController = window.AbortController;
    globalThis.AbortSignal = window.AbortSignal;
  }
}

// WebSocket polyfill for older browsers
if (typeof globalThis.WebSocket === 'undefined') {
  if (typeof window !== 'undefined' && window.WebSocket) {
    globalThis.WebSocket = window.WebSocket;
  }
}

// Storage polyfill for server-side rendering
if (typeof globalThis.localStorage === 'undefined') {
  if (typeof window !== 'undefined' && window.localStorage) {
    globalThis.localStorage = window.localStorage;
    globalThis.sessionStorage = window.sessionStorage;
  } else {
    // Minimal storage polyfill for SSR
    const storage = {
      getItem: (key: string) => null,
      setItem: (key: string, value: string) => {},
      removeItem: (key: string) => {},
      clear: () => {},
      length: 0,
      key: (index: number) => null
    };
    globalThis.localStorage = storage;
    globalThis.sessionStorage = storage;
  }
}

// Console polyfill for environments without console
if (typeof console === 'undefined') {
  const noop = () => {};
  globalThis.console = {
    log: noop,
    warn: noop,
    error: noop,
    info: noop,
    debug: noop,
    trace: noop,
    time: noop,
    timeEnd: noop,
    assert: noop,
    clear: noop,
    count: noop,
    dir: noop,
    dirxml: noop,
    group: noop,
    groupCollapsed: noop,
    groupEnd: noop,
    profile: noop,
    profileEnd: noop,
    table: noop
  };
}

export default {};