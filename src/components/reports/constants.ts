// Print Service Constants
export const DEFAULT_PRINT_OPTIONS = {
  format: 'pdf' as const,
  layout: 'portrait' as const,
  size: 'a4' as const,
  quality: 'high' as const,
  includeCharts: true,
  includeData: true,
  includeHeader: true,
  includeFooter: true,
  includeLogo: true,
  includeDate: true,
  includeSignature: false,
  watermark: 'none' as const,
  colorMode: 'color' as const,
  margin: 'normal' as const,
  fontSize: 'normal' as const,
  pageNumbers: true,
  compression: 'medium' as const
};

export const PRINT_SIZE_CLASSES = {
  a4: "w-[210mm] min-h-[297mm]",
  a3: "w-[297mm] min-h-[420mm]",
  letter: "w-[8.5in] min-h-[11in]",
  legal: "w-[8.5in] min-h-[14in]"
};

export const PRINT_MARGIN_STYLES = {
  narrow: '0.5in',
  normal: '1in',
  wide: '1.5in'
};

export const FORMAT_ICONS = {
  pdf: 'FileText',
  excel: 'FileSpreadsheet', 
  word: 'FileText',
  image: 'FileImage',
  html: 'Code'
};

export const CATEGORY_COLORS = {
  financial: 'text-green-600 bg-green-50 dark:bg-green-950/20',
  operational: 'text-blue-600 bg-blue-50 dark:bg-blue-950/20',
  clinical: 'text-purple-600 bg-purple-50 dark:bg-purple-950/20',
  administrative: 'text-orange-600 bg-orange-50 dark:bg-orange-950/20'
};

export const COMPLEXITY_COLORS = {
  simple: 'text-green-600 bg-green-50 dark:bg-green-950/20',
  medium: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20',
  complex: 'text-red-600 bg-red-50 dark:bg-red-950/20'
};

export const STATUS_COLORS = {
  completed: 'text-green-600 bg-green-50 dark:bg-green-950/20',
  processing: 'text-blue-600 bg-blue-50 dark:bg-blue-950/20',
  queued: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20',
  failed: 'text-red-600 bg-red-50 dark:bg-red-950/20',
  cancelled: 'text-gray-600 bg-gray-50 dark:bg-gray-950/20'
};