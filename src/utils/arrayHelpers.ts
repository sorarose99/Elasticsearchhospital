/**
 * Safe array utilities to prevent "Cannot read properties of undefined" errors
 */

/**
 * Safely get an array, returning empty array if undefined/null
 */
export function safeArray<T>(arr: T[] | undefined | null): T[] {
  return Array.isArray(arr) ? arr : [];
}

/**
 * Safely map over an array
 */
export function safeMap<T, U>(
  arr: T[] | undefined | null,
  callback: (item: T, index: number, array: T[]) => U
): U[] {
  return safeArray(arr).map(callback);
}

/**
 * Safely filter an array
 */
export function safeFilter<T>(
  arr: T[] | undefined | null,
  callback: (item: T, index: number, array: T[]) => boolean
): T[] {
  return safeArray(arr).filter(callback);
}

/**
 * Safely get array length
 */
export function safeLength(arr: any[] | undefined | null): number {
  return safeArray(arr).length;
}

/**
 * Safely slice an array
 */
export function safeSlice<T>(
  arr: T[] | undefined | null,
  start?: number,
  end?: number
): T[] {
  return safeArray(arr).slice(start, end);
}

/**
 * Safely check if array has items
 */
export function hasItems(arr: any[] | undefined | null): boolean {
  return safeLength(arr) > 0;
}
