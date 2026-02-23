/**
 * Safe access utilities to prevent undefined/null errors
 */

/**
 * Safely access array length
 */
export const safeLength = (arr: any[] | undefined | null): number => {
  return Array.isArray(arr) ? arr.length : 0;
};

/**
 * Safely check if array has items
 */
export const hasItems = (arr: any[] | undefined | null): boolean => {
  return Array.isArray(arr) && arr.length > 0;
};

/**
 * Safely check if array is empty
 */
export const isEmpty = (arr: any[] | undefined | null): boolean => {
  return !Array.isArray(arr) || arr.length === 0;
};

/**
 * Safely get array or empty array
 */
export const safeArray = <T>(arr: T[] | undefined | null): T[] => {
  return Array.isArray(arr) ? arr : [];
};

/**
 * Safely map over array
 */
export const safeMap = <T, R>(
  arr: T[] | undefined | null,
  fn: (item: T, index: number) => R
): R[] => {
  return safeArray(arr).map(fn);
};

/**
 * Safely filter array
 */
export const safeFilter = <T>(
  arr: T[] | undefined | null,
  fn: (item: T, index: number) => boolean
): T[] => {
  return safeArray(arr).filter(fn);
};

/**
 * Safely find in array
 */
export const safeFind = <T>(
  arr: T[] | undefined | null,
  fn: (item: T, index: number) => boolean
): T | undefined => {
  return safeArray(arr).find(fn);
};

/**
 * Safely slice array
 */
export const safeSlice = <T>(
  arr: T[] | undefined | null,
  start?: number,
  end?: number
): T[] => {
  return safeArray(arr).slice(start, end);
};

/**
 * Safely reduce array
 */
export const safeReduce = <T, R>(
  arr: T[] | undefined | null,
  fn: (acc: R, item: T, index: number) => R,
  initial: R
): R => {
  return safeArray(arr).reduce(fn, initial);
};

/**
 * Safely access object property
 */
export const safeProp = <T, K extends keyof T>(
  obj: T | undefined | null,
  key: K,
  defaultValue?: T[K]
): T[K] | undefined => {
  return obj?.[key] ?? defaultValue;
};

/**
 * Safely access nested property
 */
export const safeGet = (obj: any, path: string, defaultValue?: any): any => {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result == null) return defaultValue;
    result = result[key];
  }
  
  return result ?? defaultValue;
};
