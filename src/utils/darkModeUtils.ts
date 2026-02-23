/**
 * Dark Mode Utility Functions
 * Provides consistent styling helpers for dark mode across the application
 */

/**
 * Get consistent background color class for cards in dark mode
 */
export const getDarkCardBg = () => {
  return 'bg-white dark:bg-slate-900';
};

/**
 * Get consistent text color class for dark mode
 */
export const getDarkText = () => {
  return 'text-gray-900 dark:text-gray-100';
};

/**
 * Get consistent muted text color class for dark mode
 */
export const getDarkMutedText = () => {
  return 'text-gray-600 dark:text-gray-400';
};

/**
 * Get consistent border color class for dark mode
 */
export const getDarkBorder = () => {
  return 'border-gray-200 dark:border-gray-700';
};

/**
 * Get consistent hover background for dark mode
 */
export const getDarkHoverBg = () => {
  return 'hover:bg-gray-50 dark:hover:bg-slate-800';
};

/**
 * Get consistent input background for dark mode
 */
export const getDarkInputBg = () => {
  return 'bg-white dark:bg-slate-900 border-gray-300 dark:border-gray-600';
};

/**
 * Get consistent gradient background for dark mode
 */
export const getDarkGradientBg = (from: string = 'blue', to: string = 'indigo') => {
  return `bg-gradient-to-r from-${from}-50 to-${to}-50 dark:from-${from}-950/20 dark:to-${to}-950/20`;
};

/**
 * Get color-specific background with dark mode support
 */
export const getColorBg = (color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange' | 'cyan', shade: number = 50) => {
  const darkShade = 900;
  return `bg-${color}-${shade} dark:bg-${color}-${darkShade}/20`;
};

/**
 * Get color-specific text with dark mode support
 */
export const getColorText = (color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange' | 'cyan', shade: number = 600) => {
  const darkShade = Math.min(shade + 200, 400);
  return `text-${color}-${shade} dark:text-${color}-${darkShade}`;
};

/**
 * Get color-specific border with dark mode support
 */
export const getColorBorder = (color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange' | 'cyan', shade: number = 200) => {
  const darkShade = Math.min(shade + 600, 800);
  return `border-${color}-${shade} dark:border-${color}-${darkShade}`;
};

/**
 * Combine multiple dark mode classes
 */
export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Get consistent alert/notification background
 */
export const getAlertBg = (variant: 'info' | 'success' | 'warning' | 'error') => {
  const colorMap = {
    info: 'blue',
    success: 'green',
    warning: 'yellow',
    error: 'red'
  };
  return getColorBg(colorMap[variant]);
};

/**
 * Get consistent alert/notification text
 */
export const getAlertText = (variant: 'info' | 'success' | 'warning' | 'error') => {
  const colorMap = {
    info: 'blue',
    success: 'green',
    warning: 'yellow',
    error: 'red'
  };
  return getColorText(colorMap[variant], 800);
};

/**
 * Get consistent alert/notification border
 */
export const getAlertBorder = (variant: 'info' | 'success' | 'warning' | 'error') => {
  const colorMap = {
    info: 'blue',
    success: 'green',
    warning: 'yellow',
    error: 'red'
  };
  return getColorBorder(colorMap[variant]);
};

/**
 * Get consistent shadow for dark mode
 */
export const getDarkShadow = (size: 'sm' | 'md' | 'lg' = 'md') => {
  return `shadow-${size} dark:shadow-none dark:border dark:border-gray-700`;
};

/**
 * Get consistent table row styling
 */
export const getTableRowStyle = () => {
  return 'border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-800';
};

/**
 * Get consistent table header styling
 */
export const getTableHeaderStyle = () => {
  return 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-semibold';
};

/**
 * Get consistent badge styling
 */
export const getBadgeStyle = (variant: 'default' | 'secondary' | 'success' | 'warning' | 'error' = 'default') => {
  const styles = {
    default: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  };
  return styles[variant];
};

/**
 * Get consistent button styling
 */
export const getButtonStyle = (variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary') => {
  const styles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
    outline: 'border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-slate-800',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-slate-800'
  };
  return styles[variant];
};

/**
 * Get consistent modal/dialog background
 */
export const getModalBg = () => {
  return 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700';
};

/**
 * Get consistent dropdown/select background
 */
export const getDropdownBg = () => {
  return 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700';
};

/**
 * Get consistent progress bar styling
 */
export const getProgressBg = () => {
  return 'bg-gray-200 dark:bg-gray-700';
};

/**
 * Get consistent progress bar fill styling
 */
export const getProgressFill = (color: 'blue' | 'green' | 'red' | 'yellow' = 'blue') => {
  return `bg-${color}-600 dark:bg-${color}-500`;
};
