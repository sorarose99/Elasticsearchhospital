import { NotificationItem, TaskNotification } from './types';

export const getSampleNotifications = (language: string): NotificationItem[] => [
  {
    id: '1',
    type: 'appointment',
    title: language === 'ar' ? 'موعد قادم' : 'Upcoming Appointment',
    message: language === 'ar' ? 'د. محمد أحمد - 10:30 صباحاً' : 'Dr. Mohammed Ahmed - 10:30 AM',
    timestamp: new Date(Date.now() + 30 * 60000),
    priority: 'high',
    status: 'unread',
    category: 'patient',
    metadata: {
      patientName: language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohammed',
      patientId: 'P001',
      appointmentId: 'A001',
      actionRequired: true
    },
    actions: [
      {
        id: 'confirm',
        label: language === 'ar' ? 'تأكيد' : 'Confirm',
        type: 'primary',
        action: () => console.log('Confirm appointment'),
        icon: undefined
      },
      {
        id: 'reschedule',
        label: language === 'ar' ? 'إعادة جدولة' : 'Reschedule',
        type: 'secondary',
        action: () => console.log('Reschedule appointment'),
        icon: undefined
      }
    ]
  },
  {
    id: '2',
    type: 'task',
    title: language === 'ar' ? 'مهمة معلقة' : 'Pending Task',
    message: language === 'ar' ? 'مراجعة نتائج فحص المختبر - مستعجل' : 'Review lab results - Urgent',
    timestamp: new Date(Date.now() - 15 * 60000),
    priority: 'urgent',
    status: 'unread',
    category: 'medical',
    metadata: {
      taskId: 'T001',
      patientName: language === 'ar' ? 'سارة أحمد' : 'Sara Ahmed',
      patientId: 'P002',
      actionRequired: true,
      dueDate: new Date(Date.now() + 2 * 60 * 60000)
    },
    isStarred: true,
    actions: [
      {
        id: 'review',
        label: language === 'ar' ? 'مراجعة' : 'Review',
        type: 'primary',
        action: () => console.log('Review task'),
        icon: undefined
      }
    ]
  },
  {
    id: '3',
    type: 'alert',
    title: language === 'ar' ? 'تنبيه نظام' : 'System Alert',
    message: language === 'ar' ? 'انخفاض في مخزون الأدوية الأساسية' : 'Low stock alert for essential medications',
    timestamp: new Date(Date.now() - 45 * 60000),
    priority: 'high',
    status: 'unread',
    category: 'system',
    metadata: {
      actionRequired: true,
      relatedItems: ['MED001', 'MED003', 'MED007']
    },
    actions: [
      {
        id: 'reorder',
        label: language === 'ar' ? 'إعادة الطلب' : 'Reorder',
        type: 'primary',
        action: () => console.log('Reorder inventory'),
        icon: undefined
      },
      {
        id: 'view_details',
        label: language === 'ar' ? 'عرض التفاصيل' : 'View Details',
        type: 'secondary',
        action: () => console.log('View details'),
        icon: undefined
      }
    ]
  }
];

export const getSampleTaskNotifications = (language: string): TaskNotification[] => [
  {
    id: '1',
    type: 'task',
    priority: 'urgent',
    title: language === 'ar' ? 'مراجعة نتائج فحص المختبر' : 'Review Lab Test Results',
    description: language === 'ar' ? 
      'مراجعة نتائج فحوصات الدم للمريض أحمد محمد وإعداد التقرير الطبي' : 
      'Review blood test results for patient Ahmed Mohammed and prepare medical report',
    assignedTo: {
      id: 'dr1',
      name: language === 'ar' ? 'د. سارة أحمد' : 'Dr. Sara Ahmed',
      role: language === 'ar' ? 'طبيب باطني' : 'Internal Medicine',
      avatar: '/avatars/dr-sara.jpg',
      department: language === 'ar' ? 'الطب الباطني' : 'Internal Medicine'
    },
    assignedBy: {
      id: 'admin1',
      name: language === 'ar' ? 'إدارة المختبر' : 'Lab Administration',
      role: language === 'ar' ? 'إداري' : 'Administrator'
    },
    dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    status: 'pending',
    category: 'medical',
    relatedPatient: {
      id: 'p001',
      name: language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohammed',
      age: 45,
      condition: language === 'ar' ? 'مرض السكري' : 'Diabetes'
    },
    progress: 0,
    estimatedDuration: 30,
    reminders: [
      { id: 'r1', time: 60, sent: false },
      { id: 'r2', time: 15, sent: false }
    ]
  },
  {
    id: '2',
    type: 'appointment',
    priority: 'high',
    title: language === 'ar' ? 'موعد عملية جراحية' : 'Surgery Appointment',
    description: language === 'ar' ? 
      'عملية جراحية لإزالة الزائدة الدودية للمريضة فاطمة علي' : 
      'Appendectomy surgery for patient Fatima Ali',
    assignedTo: {
      id: 'dr2',
      name: language === 'ar' ? 'د. محمد عبدالله' : 'Dr. Mohammed Abdullah',
      role: language === 'ar' ? 'جراح عام' : 'General Surgeon',
      department: language === 'ar' ? 'الجراحة العامة' : 'General Surgery'
    },
    dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'in_progress',
    category: 'medical',
    relatedPatient: {
      id: 'p002',
      name: language === 'ar' ? 'فاطمة علي' : 'Fatima Ali',
      age: 28,
      condition: language === 'ar' ? 'التهاب الزائدة الدودية' : 'Appendicitis'
    },
    location: language === 'ar' ? 'غرفة العمليات 3' : 'Operating Room 3',
    progress: 25,
    estimatedDuration: 180
  }
];