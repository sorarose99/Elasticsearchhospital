// Notification Constants and Default Settings
export const DEFAULT_NOTIFICATION_SETTINGS = {
  enabled: true,
  soundEnabled: true,
  pushEnabled: true,
  emailEnabled: false,
  smsEnabled: false,
  categories: {
    patient: { enabled: true, priority: 'high' as const, sound: 'gentle', methods: ['push' as const] },
    staff: { enabled: true, priority: 'medium' as const, sound: 'alert', methods: ['push' as const] },
    system: { enabled: true, priority: 'low' as const, sound: 'notification', methods: ['push' as const] },
    financial: { enabled: true, priority: 'medium' as const, sound: 'alert', methods: ['push' as const, 'email' as const] },
    medical: { enabled: true, priority: 'high' as const, sound: 'urgent', methods: ['push' as const, 'sms' as const] },
    admin: { enabled: true, priority: 'medium' as const, sound: 'notification', methods: ['push' as const] }
  },
  quietHours: {
    enabled: true,
    start: '22:00',
    end: '08:00'
  },
  autoSnooze: {
    enabled: false,
    duration: 30
  }
};

export const PRIORITY_ORDER = { 
  critical: 5, 
  urgent: 4, 
  high: 3, 
  medium: 2, 
  low: 1 
};

export const STATUS_ORDER = { 
  overdue: 4, 
  pending: 3, 
  in_progress: 2, 
  completed: 1, 
  cancelled: 0 
};

export const SOUND_MAP = {
  critical: 'data:audio/wav;base64,UklGRrYKAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YZIKAACBhYqFb...',
  urgent: 'data:audio/wav;base64,UklGRrYKAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YZIKAACBhYqFb...',
  high: 'data:audio/wav;base64,UklGRrYKAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YZIKAACBhYqFb...',
  medium: 'data:audio/wav;base64,UklGRrYKAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YZIKAACBhYqFb...',
  low: 'data:audio/wav;base64,UklGRrYKAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YZIKAACBhYqFb...'
};