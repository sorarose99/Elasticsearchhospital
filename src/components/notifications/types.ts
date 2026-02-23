// Notification Types and Interfaces
export interface NotificationItem {
  id: string;
  type: 'appointment' | 'task' | 'alert' | 'reminder' | 'system' | 'urgent' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent' | 'critical';
  status: 'unread' | 'read' | 'acknowledged' | 'dismissed' | 'snoozed';
  category: 'patient' | 'staff' | 'system' | 'financial' | 'medical' | 'admin';
  metadata?: {
    patientName?: string;
    patientId?: string;
    departmentId?: string;
    departmentName?: string;
    appointmentId?: string;
    taskId?: string;
    userId?: string;
    userName?: string;
    dueDate?: Date;
    actionRequired?: boolean;
    actionUrl?: string;
    relatedItems?: string[];
  };
  actions?: NotificationAction[];
  snoozeUntil?: Date;
  readAt?: Date;
  acknowledgedAt?: Date;
  isStarred?: boolean;
  isPinned?: boolean;
}

export interface NotificationAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'destructive';
  action: () => void;
  icon?: React.ReactNode;
}

export interface NotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  categories: {
    [key: string]: {
      enabled: boolean;
      priority: 'low' | 'medium' | 'high';
      sound: string;
      methods: ('push' | 'email' | 'sms')[];
    };
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  autoSnooze: {
    enabled: boolean;
    duration: number; // minutes
  };
}

export interface TaskNotification {
  id: string;
  type: 'task' | 'appointment' | 'report' | 'alert' | 'reminder';
  priority: 'low' | 'medium' | 'high' | 'urgent' | 'critical';
  title: string;
  description: string;
  assignedTo: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
    department: string;
  };
  assignedBy?: {
    id: string;
    name: string;
    role: string;
  };
  dueDate: Date;
  createdAt: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
  category: 'medical' | 'administrative' | 'financial' | 'technical' | 'emergency';
  relatedPatient?: {
    id: string;
    name: string;
    age: number;
    condition?: string;
  };
  relatedReport?: {
    id: string;
    type: string;
    name: string;
    dueDate: Date;
  };
  progress?: number;
  estimatedDuration?: number; // in minutes
  dependencies?: string[]; // Task IDs that must be completed first
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
  comments?: {
    id: string;
    author: string;
    message: string;
    timestamp: Date;
  }[];
  location?: string;
  isRecurring?: boolean;
  recurrencePattern?: string;
  reminders?: {
    id: string;
    time: number; // minutes before due date
    sent: boolean;
  }[];
}