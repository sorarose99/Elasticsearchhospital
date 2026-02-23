// Notification Service for sending appointment confirmations
// This service handles SMS, Email, and Push notifications

export interface NotificationRecipient {
  name: string;
  phone?: string;
  email?: string;
  role: 'patient' | 'doctor';
}

export interface AppointmentNotificationData {
  appointmentId: string;
  confirmationCode: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  reason: string;
  location: string;
  language: 'en' | 'ar';
}

export class NotificationService {
  private static instance: NotificationService;
  
  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async sendAppointmentConfirmation(
    recipients: NotificationRecipient[],
    appointmentData: AppointmentNotificationData,
    methods: ('sms' | 'email' | 'push')[] = ['sms', 'email']
  ): Promise<void> {
    const notifications = [];

    for (const recipient of recipients) {
      for (const method of methods) {
        switch (method) {
          case 'sms':
            if (recipient.phone) {
              notifications.push(this.sendSMS(recipient, appointmentData));
            }
            break;
          case 'email':
            if (recipient.email) {
              notifications.push(this.sendEmail(recipient, appointmentData));
            }
            break;
          case 'push':
            notifications.push(this.sendPushNotification(recipient, appointmentData));
            break;
        }
      }
    }

    try {
      await Promise.all(notifications);
      console.log('All notifications sent successfully');
    } catch (error) {
      console.error('Error sending notifications:', error);
      throw error;
    }
  }

  private async sendSMS(
    recipient: NotificationRecipient,
    data: AppointmentNotificationData
  ): Promise<void> {
    const message = this.formatSMSMessage(recipient, data);
    
    // Simulate SMS sending (in real implementation, use SMS service API)
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`SMS sent to ${recipient.name} (${recipient.phone}):`, message);
        resolve();
      }, 500);
    });
  }

  private async sendEmail(
    recipient: NotificationRecipient,
    data: AppointmentNotificationData
  ): Promise<void> {
    const emailContent = this.formatEmailMessage(recipient, data);
    
    // Simulate email sending (in real implementation, use email service API)
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Email sent to ${recipient.name} (${recipient.email}):`, emailContent);
        resolve();
      }, 800);
    });
  }

  private async sendPushNotification(
    recipient: NotificationRecipient,
    data: AppointmentNotificationData
  ): Promise<void> {
    const notification = this.formatPushNotification(recipient, data);
    
    // Simulate push notification (in real implementation, use push service)
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Push notification sent to ${recipient.name}:`, notification);
        resolve();
      }, 300);
    });
  }

  private formatSMSMessage(
    recipient: NotificationRecipient,
    data: AppointmentNotificationData
  ): string {
    const { language } = data;
    
    if (recipient.role === 'patient') {
      return language === 'ar' 
        ? `مرحباً ${recipient.name}, تم تأكيد موعدك مع ${data.doctorName} في ${data.date} الساعة ${data.time}. رقم التأكيد: ${data.confirmationCode}. يرجى الحضور قبل 15 دقيقة.`
        : `Hi ${recipient.name}, your appointment with ${data.doctorName} is confirmed for ${data.date} at ${data.time}. Confirmation code: ${data.confirmationCode}. Please arrive 15 minutes early.`;
    } else {
      return language === 'ar'
        ? `دكتور ${recipient.name}, لديك موعد جديد مع ${data.patientName} في ${data.date} الساعة ${data.time}. السبب: ${data.reason}. رقم التأكيد: ${data.confirmationCode}`
        : `Dr. ${recipient.name}, you have a new appointment with ${data.patientName} on ${data.date} at ${data.time}. Reason: ${data.reason}. Confirmation: ${data.confirmationCode}`;
    }
  }

  private formatEmailMessage(
    recipient: NotificationRecipient,
    data: AppointmentNotificationData
  ): { subject: string; body: string } {
    const { language } = data;
    
    if (recipient.role === 'patient') {
      const subject = language === 'ar' 
        ? `تأكيد موعد - ${data.confirmationCode}`
        : `Appointment Confirmation - ${data.confirmationCode}`;
      
      const body = language === 'ar' 
        ? `
عزيزي ${recipient.name}،

تم تأكيد موعدك بنجاح مع ${data.doctorName}.

تفاصيل الموعد:
📅 التاريخ: ${data.date}
🕐 الوقت: ${data.time}
📍 الموقع: ${data.location}
🔢 رقم التأكيد: ${data.confirmationCode}
📝 سبب الزيارة: ${data.reason}

ملاحظات مهمة:
• يرجى الحضور قبل 15 دقيقة من موعدك
• أحضر معك الهوية والأوراق الطبية
• في حالة عدم تمكنك من الحضور، يرجى الاتصال لإلغاء الموعد

شكراً لاختيارك مستشفى النور الطبي.
        `
        : `
Dear ${recipient.name},

Your appointment has been successfully confirmed with ${data.doctorName}.

Appointment Details:
📅 Date: ${data.date}
🕐 Time: ${data.time}
📍 Location: ${data.location}
🔢 Confirmation Code: ${data.confirmationCode}
📝 Reason: ${data.reason}

Important Notes:
• Please arrive 15 minutes before your appointment
• Bring your ID and medical documents
• If you cannot attend, please call to cancel

Thank you for choosing Al-Noor Medical Hospital.
        `;
      
      return { subject, body };
    } else {
      const subject = language === 'ar'
        ? `موعد جديد - ${data.confirmationCode}`
        : `New Appointment - ${data.confirmationCode}`;
      
      const body = language === 'ar'
        ? `
دكتور ${recipient.name}،

لديك موعد جديد مجدول:

تفاصيل المريض:
👤 اسم المريض: ${data.patientName}
📅 التاريخ: ${data.date}
🕐 الوقت: ${data.time}
📍 الموقع: ${data.location}
🔢 رقم التأكيد: ${data.confirmationCode}
📝 سبب الزيارة: ${data.reason}

تم إرسال تأكيد للمريض.
        `
        : `
Dr. ${recipient.name},

You have a new appointment scheduled:

Patient Details:
👤 Patient Name: ${data.patientName}
📅 Date: ${data.date}
🕐 Time: ${data.time}
📍 Location: ${data.location}
🔢 Confirmation Code: ${data.confirmationCode}
📝 Reason: ${data.reason}

Patient confirmation has been sent.
        `;
      
      return { subject, body };
    }
  }

  private formatPushNotification(
    recipient: NotificationRecipient,
    data: AppointmentNotificationData
  ): { title: string; body: string } {
    const { language } = data;
    
    if (recipient.role === 'patient') {
      return {
        title: language === 'ar' ? 'تأكيد موعد' : 'Appointment Confirmed',
        body: language === 'ar' 
          ? `موعدك مع ${data.doctorName} في ${data.date} الساعة ${data.time}`
          : `Your appointment with ${data.doctorName} on ${data.date} at ${data.time}`
      };
    } else {
      return {
        title: language === 'ar' ? 'موعد جديد' : 'New Appointment',
        body: language === 'ar'
          ? `موعد جديد مع ${data.patientName} في ${data.date} الساعة ${data.time}`
          : `New appointment with ${data.patientName} on ${data.date} at ${data.time}`
      };
    }
  }

  async sendAppointmentReminder(
    recipients: NotificationRecipient[],
    appointmentData: AppointmentNotificationData,
    reminderType: '24h' | '2h' | '30min' = '24h'
  ): Promise<void> {
    // Implementation for appointment reminders
    console.log(`Sending ${reminderType} reminder for appointment ${appointmentData.confirmationCode}`);
  }

  async sendAppointmentCancellation(
    recipients: NotificationRecipient[],
    appointmentData: AppointmentNotificationData,
    reason?: string
  ): Promise<void> {
    // Implementation for appointment cancellation notifications
    console.log(`Sending cancellation notification for appointment ${appointmentData.confirmationCode}`);
  }

  async sendAppointmentReschedule(
    recipients: NotificationRecipient[],
    oldAppointmentData: AppointmentNotificationData,
    newAppointmentData: AppointmentNotificationData
  ): Promise<void> {
    // Implementation for appointment reschedule notifications
    console.log(`Sending reschedule notification from ${oldAppointmentData.confirmationCode} to ${newAppointmentData.confirmationCode}`);
  }
}

export default NotificationService;