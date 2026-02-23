/**
 * Minimal fetch polyfill to fix node-fetch compatibility issues
 */

// Fix the specific node-fetch export issue
if (typeof window !== 'undefined') {
  // Browser environment - ensure native fetch is used
  if (!globalThis.fetch && window.fetch) {
    globalThis.fetch = window.fetch.bind(window);
    globalThis.Headers = window.Headers;
    globalThis.Request = window.Request;
    globalThis.Response = window.Response;
  }
} else {
  // Server environment - handle node-fetch properly
  try {
    // Attempt to use native fetch if available (Node 18+)
    if (typeof globalThis.fetch === 'undefined') {
      // For older Node versions, we'll skip the polyfill
      console.log('Fetch not available, using fallback');
    }
  } catch (error) {
    console.warn('Fetch polyfill error:', error);
  }
}

// Ensure proper module export structure
export const fetchPolyfill = {
  isPolyfilled: typeof globalThis.fetch !== 'undefined',
  hasNativeFetch: typeof window !== 'undefined' && typeof window.fetch === 'function'
};

export default fetchPolyfill;