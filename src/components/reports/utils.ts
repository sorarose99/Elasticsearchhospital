import { PrintOptions } from './types';

// Print Service Utility Functions
export const updateEstimates = (options: PrintOptions) => {
  let baseSize = 1.5; // MB
  let basePages = 8;

  // Adjust for format
  if (options.format === 'excel') baseSize *= 0.6;
  else if (options.format === 'word') baseSize *= 0.8;
  else if (options.format === 'image') baseSize *= 1.5;

  // Adjust for quality
  if (options.quality === 'high') baseSize *= 1.8;
  else if (options.quality === 'print-ready') baseSize *= 2.5;
  else if (options.quality === 'draft') baseSize *= 0.5;

  // Adjust for inclusions
  if (options.includeCharts) baseSize *= 1.4;
  if (options.includeData) {
    baseSize *= 1.2;
    basePages += 4;
  }

  // Adjust for size
  if (options.size === 'a3') {
    baseSize *= 1.6;
    basePages = Math.ceil(basePages * 0.7);
  } else if (options.size === 'legal') {
    basePages = Math.ceil(basePages * 0.9);
  }

  // Apply compression
  if (options.compression === 'high') baseSize *= 0.4;
  else if (options.compression === 'medium') baseSize *= 0.6;
  else if (options.compression === 'low') baseSize *= 0.8;

  return {
    size: `${baseSize.toFixed(1)} MB`,
    pages: basePages
  };
};

export const getFormatIcon = (format: string) => {
  switch (format.toLowerCase()) {
    case 'pdf': return 'FileText';
    case 'excel': return 'FileSpreadsheet';
    case 'word': return 'FileText';
    case 'image': return 'FileImage';
    default: return 'FileText';
  }
};

export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'financial': return 'text-green-600 bg-green-50 dark:bg-green-950/20';
    case 'operational': return 'text-blue-600 bg-blue-50 dark:bg-blue-950/20';
    case 'clinical': return 'text-purple-600 bg-purple-50 dark:bg-purple-950/20';
    case 'administrative': return 'text-orange-600 bg-orange-50 dark:bg-orange-950/20';
    default: return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20';
  }
};

export const getComplexityColor = (complexity: string) => {
  switch (complexity) {
    case 'simple': return 'text-green-600 bg-green-50 dark:bg-green-950/20';
    case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20';
    case 'complex': return 'text-red-600 bg-red-50 dark:bg-red-950/20';
    default: return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20';
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'text-green-600 bg-green-50 dark:bg-green-950/20';
    case 'processing': return 'text-blue-600 bg-blue-50 dark:bg-blue-950/20';
    case 'queued': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20';
    case 'failed': return 'text-red-600 bg-red-50 dark:bg-red-950/20';
    case 'cancelled': return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20';
    default: return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20';
  }
};

export const formatDuration = (seconds: number) => {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

export const getCategoryTranslation = (category: string, language: string) => {
  const translations = {
    financial: language === 'ar' ? 'مالي' : 'Financial',
    operational: language === 'ar' ? 'تشغيلي' : 'Operational',
    clinical: language === 'ar' ? 'سريري' : 'Clinical',
    administrative: language === 'ar' ? 'إداري' : 'Administrative'
  };
  return translations[category as keyof typeof translations] || category;
};

export const getComplexityTranslation = (complexity: string, language: string) => {
  const translations = {
    simple: language === 'ar' ? 'بسيط' : 'Simple',
    medium: language === 'ar' ? 'متوسط' : 'Medium',
    complex: language === 'ar' ? 'معقد' : 'Complex'
  };
  return translations[complexity as keyof typeof translations] || complexity;
};

export const getStatusTranslation = (status: string, language: string) => {
  const translations = {
    completed: language === 'ar' ? 'مكتمل' : 'Completed',
    processing: language === 'ar' ? 'جاري المعالجة' : 'Processing',
    queued: language === 'ar' ? 'في الانتظار' : 'Queued',
    failed: language === 'ar' ? 'فشل' : 'Failed',
    cancelled: language === 'ar' ? 'ملغي' : 'Cancelled'
  };
  return translations[status as keyof typeof translations] || status;
};