/**
 * String Helper Utilities
 * Safe string manipulation functions that handle undefined/null values
 */

/**
 * Safely get initials from first and last name
 * @param firstName - First name (can be undefined)
 * @param lastName - Last name (can be undefined)
 * @param fallback - Fallback string if both names are missing
 * @returns Initials in uppercase
 */
export const getInitials = (
  firstName?: string | null,
  lastName?: string | null,
  fallback: string = '??'
): string => {
  if (!firstName && !lastName) return fallback;
  
  const first = firstName?.trim().charAt(0) || '';
  const last = lastName?.trim().charAt(0) || '';
  
  return (first + last).toUpperCase() || fallback;
};

/**
 * Safely get initials from full name
 * @param name - Full name (can be undefined)
 * @param fallback - Fallback string if name is missing
 * @returns Initials in uppercase
 */
export const getInitialsFromName = (
  name?: string | null,
  fallback: string = '??'
): string => {
  if (!name) return fallback;
  
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return fallback;
  
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Safely capitalize first letter of a string
 * @param str - String to capitalize
 * @param fallback - Fallback string if input is missing
 * @returns Capitalized string
 */
export const capitalizeFirst = (
  str?: string | null,
  fallback: string = ''
): string => {
  if (!str) return fallback;
  const trimmed = str.trim();
  if (trimmed.length === 0) return fallback;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

/**
 * Safely format a full name from first and last name
 * @param firstName - First name
 * @param lastName - Last name
 * @param fallback - Fallback string if both names are missing
 * @returns Formatted full name
 */
export const formatFullName = (
  firstName?: string | null,
  lastName?: string | null,
  fallback: string = 'Unknown'
): string => {
  const first = firstName?.trim() || '';
  const last = lastName?.trim() || '';
  
  if (!first && !last) return fallback;
  if (!first) return last;
  if (!last) return first;
  
  return `${first} ${last}`;
};

/**
 * Safely format date string
 * @param dateString - Date string to format
 * @param fallback - Fallback string if date is invalid
 * @returns Formatted date or fallback
 */
export const safeFormatDate = (
  dateString?: string | null,
  fallback: string = '-'
): string => {
  if (!dateString) return fallback;
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return fallback;
  
  return date.toLocaleDateString();
};
