import { NotificationItem, TaskNotification } from './types';

// Utility Functions for Notifications
export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-950/20 border-red-200';
    case 'urgent': return 'text-orange-600 bg-orange-50 dark:bg-orange-950/20 border-orange-200';
    case 'high': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200';
    case 'medium': return 'text-blue-600 bg-blue-50 dark:bg-blue-950/20 border-blue-200';
    case 'low': return 'text-green-600 bg-green-50 dark:bg-green-950/20 border-green-200';
    default: return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20 border-gray-200';
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'text-green-600 bg-green-50 dark:bg-green-950/20';
    case 'in_progress': return 'text-blue-600 bg-blue-50 dark:bg-blue-950/20';
    case 'pending': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20';
    case 'overdue': return 'text-red-600 bg-red-50 dark:bg-red-950/20';
    case 'cancelled': return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20';
    case 'unread': return 'text-blue-600 bg-blue-50 dark:bg-blue-950/20';
    case 'read': return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20';
    case 'acknowledged': return 'text-green-600 bg-green-50 dark:bg-green-950/20';
    case 'dismissed': return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20';
    case 'snoozed': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20';
    default: return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20';
  }
};

export const formatTime = (date: Date, language: string) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) {
    return language === 'ar' ? 'الآن' : 'now';
  } else if (minutes < 60) {
    return language === 'ar' ? `${minutes} دقيقة` : `${minutes}m`;
  } else if (hours < 24) {
    return language === 'ar' ? `${hours} ساعة` : `${hours}h`;
  } else {
    return language === 'ar' ? `${days} يوم` : `${days}d`;
  }
};

export const formatTimeRemaining = (dueDate: Date, language: string) => {
  const now = new Date();
  const diff = dueDate.getTime() - now.getTime();
  
  if (diff <= 0) {
    const overdue = Math.abs(diff);
    const hours = Math.floor(overdue / (60 * 60 * 1000));
    const minutes = Math.floor((overdue % (60 * 60 * 1000)) / (60 * 1000));
    
    if (hours > 0) {
      return `${language === 'ar' ? 'متأخر' : 'Overdue'} ${hours}${language === 'ar' ? 'س' : 'h'} ${minutes}${language === 'ar' ? 'د' : 'm'}`;
    } else {
      return `${language === 'ar' ? 'متأخر' : 'Overdue'} ${minutes}${language === 'ar' ? 'د' : 'm'}`;
    }
  }
  
  const hours = Math.floor(diff / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}${language === 'ar' ? 'ي' : 'd'} ${hours % 24}${language === 'ar' ? 'س' : 'h'}`;
  } else if (hours > 0) {
    return `${hours}${language === 'ar' ? 'س' : 'h'} ${minutes}${language === 'ar' ? 'د' : 'm'}`;
  } else {
    return `${minutes}${language === 'ar' ? 'د' : 'm'}`;
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
    patient: language === 'ar' ? 'مريض' : 'Patient',
    staff: language === 'ar' ? 'طاقم' : 'Staff',
    system: language === 'ar' ? 'نظام' : 'System',
    financial: language === 'ar' ? 'مالي' : 'Financial',
    medical: language === 'ar' ? 'طبي' : 'Medical',
    admin: language === 'ar' ? 'إداري' : 'Admin',
    administrative: language === 'ar' ? 'إداري' : 'Administrative',
    technical: language === 'ar' ? 'تقني' : 'Technical',
    emergency: language === 'ar' ? 'طوارئ' : 'Emergency'
  };
  return translations[category as keyof typeof translations] || category;
};

export const getPriorityTranslation = (priority: string, language: string) => {
  const translations = {
    critical: language === 'ar' ? 'حرج' : 'Critical',
    urgent: language === 'ar' ? 'مستعجل' : 'Urgent',
    high: language === 'ar' ? 'عالي' : 'High',
    medium: language === 'ar' ? 'متوسط' : 'Medium',
    low: language === 'ar' ? 'منخفض' : 'Low'
  };
  return translations[priority as keyof typeof translations] || priority;
};

export const getStatusTranslation = (status: string, language: string) => {
  const translations = {
    completed: language === 'ar' ? 'مكتمل' : 'Completed',
    in_progress: language === 'ar' ? 'جاري' : 'In Progress',
    pending: language === 'ar' ? 'معلق' : 'Pending',
    overdue: language === 'ar' ? 'متأخر' : 'Overdue',
    cancelled: language === 'ar' ? 'ملغي' : 'Cancelled',
    unread: language === 'ar' ? 'غير مقروء' : 'Unread',
    read: language === 'ar' ? 'مقروء' : 'Read',
    acknowledged: language === 'ar' ? 'مؤكد' : 'Acknowledged',
    dismissed: language === 'ar' ? 'مُرفض' : 'Dismissed',
    snoozed: language === 'ar' ? 'مؤجل' : 'Snoozed'
  };
  return translations[status as keyof typeof translations] || status.replace('_', ' ');
};

export const isInQuietHours = (quietHours: { enabled: boolean; start: string; end: string }) => {
  if (!quietHours.enabled) return false;

  const now = new Date();
  const currentTime = now.getHours() * 100 + now.getMinutes();
  const startTime = parseInt(quietHours.start.replace(':', ''));
  const endTime = parseInt(quietHours.end.replace(':', ''));
  
  if (startTime > endTime) {
    // Overnight quiet hours
    return currentTime >= startTime || currentTime <= endTime;
  } else {
    // Same day quiet hours
    return currentTime >= startTime && currentTime <= endTime;
  }
};

export const shouldPlaySound = (
  notification: NotificationItem | TaskNotification,
  settings: any,
  soundEnabled: boolean
) => {
  if (!soundEnabled) return false;

  const categorySettings = settings.categories[notification.category];
  if (!categorySettings?.enabled) return false;

  // Check quiet hours
  if (isInQuietHours(settings.quietHours)) return false;

  return true;
};