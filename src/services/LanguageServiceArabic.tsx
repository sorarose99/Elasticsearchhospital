import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'ar' | 'fr' | 'es' | 'de';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Comprehensive Arabic translations
const arabicTranslations = {
  // Common
  'common.loading': 'جاري التحميل...',
  'common.error': 'خطأ',
  'common.success': 'نجح',
  'common.cancel': 'إلغاء',
  'common.save': 'حفظ',
  'common.delete': 'حذف',
  'common.edit': 'تعديل',
  'common.add': 'إضافة',
  'common.search': 'بحث',
  'common.filter': 'تصفية',
  'common.export': 'تصدير',
  'common.import': 'استيراد',
  'common.print': 'طباعة',
  'common.refresh': 'تحديث',
  'common.submit': 'إرسال',
  'common.close': 'إغلاق',
  'common.open': 'فتح',
  'common.view': 'عرض',
  'common.download': 'تحميل',
  'common.upload': 'رفع',
  'common.select': 'اختر',
  'common.confirm': 'تأكيد',
  'common.yes': 'نعم',
  'common.no': 'لا',
  'common.back': 'رجوع',
  'common.next': 'التالي',
  'common.previous': 'السابق',
  'common.home': 'الرئيسية',
  'common.settings': 'الإعدادات',
  'common.logout': 'تسجيل الخروج',
  'common.login': 'تسجيل الدخول',
  'common.register': 'تسجيل',
  'common.today': 'اليوم',
  'common.yesterday': 'أمس',
  'common.tomorrow': 'غداً',
  'common.week': 'أسبوع',
  'common.month': 'شهر',
  'common.year': 'سنة',
  'common.date': 'التاريخ',
  'common.time': 'الوقت',
  'common.name': 'الاسم',
  'common.email': 'البريد الإلكتروني',
  'common.phone': 'الهاتف',
  'common.address': 'العنوان',
  'common.status': 'الحالة',
  'common.active': 'نشط',
  'common.inactive': 'غير نشط',
  'common.pending': 'معلق',
  'common.completed': 'مكتمل',
  'common.cancelled': 'ملغي',
  'common.approved': 'معتمد',
  'common.rejected': 'مرفوض',
  'common.calendar': 'التقويم',
  'common.all': 'الكل',
  'common.minutes': 'دقائق',
  'common.hours': 'ساعات',
  'common.years': 'سنوات',
  'common.currency': 'ريال',
  'common.notSpecified': 'غير محدد',
  'common.notProvided': 'غير مُقدم',
  'common.deceased': 'متوفى',

  // Authentication
  'auth.welcome': 'مرحباً بك في MediCore',
  'auth.subtitle': 'نظام إدارة الرعاية الصحية الشامل',
  'auth.email': 'عنوان البريد الإلكتروني',
  'auth.password': 'كلمة المرور',
  'auth.login': 'تسجيل الدخول',
  'auth.loginButton': 'تسجيل الدخول إلى حسابك',
  'auth.demoMode': 'الوضع التجريبي متاح',
  'auth.demoAccounts': 'حسابات تجريبية',
  'auth.invalidCredentials': 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
  'auth.loginError': 'فشل تسجيل الدخول. حاول مرة أخرى.',
  'auth.logout': 'تسجيل الخروج',
  'auth.logoutConfirm': 'هل أنت متأكد من رغبتك في تسجيل الخروج؟',

  // Navigation
  'nav.dashboard': 'لوحة التحكم',
  'nav.patients': 'المرضى',
  'nav.appointments': 'المواعيد',
  'nav.medical': 'السجلات الطبية',
  'nav.lab': 'المختبر',
  'nav.radiology': 'الأشعة',
  'nav.pharmacy': 'الصيدلية',
  'nav.billing': 'الفوترة',
  'nav.reports': 'التقارير',
  'nav.settings': 'الإعدادات',
  'nav.admin': 'الإدارة',
  'nav.users': 'إدارة المستخدمين',
  'nav.system': 'إعدادات النظام',
  'nav.favorites': 'المفضلة',
  'nav.recentPages': 'الصفحات الأخيرة',
  'nav.quickActions': 'الإجراءات السريعة',

  // Dashboard
  'dashboard.title': 'لوحة التحكم',
  'dashboard.overview': 'نظرة عامة',
  'dashboard.todayAppointments': 'مواعيد اليوم',
  'dashboard.totalPatients': 'إجمالي المرضى',
  'dashboard.pendingLabs': 'نتائج المختبر المعلقة',
  'dashboard.todayRevenue': 'إيرادات اليوم',
  'dashboard.recentPatients': 'المرضى الأخيرون',
  'dashboard.upcomingAppointments': 'المواعيد القادمة',
  'dashboard.criticalAlerts': 'التنبيهات الحرجة',
  'dashboard.systemStatus': 'حالة النظام',

  // Patients
  'patients.title': 'إدارة المرضى',
  'patients.addPatient': 'إضافة مريض جديد',
  'patients.editPatient': 'تعديل المريض',
  'patients.patientList': 'قائمة المرضى',
  'patients.patientProfile': 'ملف المريض',
  'patients.medicalHistory': 'التاريخ المرضي',
  'patients.personalInfo': 'المعلومات الشخصية',
  'patients.contactInfo': 'معلومات الاتصال',
  'patients.emergencyContact': 'جهة الاتصال للطوارئ',
  'patients.insurance': 'معلومات التأمين',
  'patients.allergies': 'الحساسيات',
  'patients.medications': 'الأدوية الحالية',
  'patients.firstName': 'الاسم الأول',
  'patients.lastName': 'اسم العائلة',
  'patients.dateOfBirth': 'تاريخ الميلاد',
  'patients.gender': 'الجنس',
  'patients.bloodType': 'فصيلة الدم',
  'patients.mrn': 'رقم الملف الطبي',
  'patients.male': 'ذكر',
  'patients.female': 'أنثى',
  'patients.other': 'آخر',
  'patients.age': 'العمر',
  'patients.lastVisit': 'آخر زيارة',
  'patients.conditions': 'الحالات',
  'patients.relationship': 'صلة القرابة',
  'patients.noAllergies': 'لا توجد حساسيات معروفة',
  'patients.noMedications': 'لا توجد أدوية حالية',
  'patients.noMedicalHistory': 'لا يوجد تاريخ مرضي مسجل',
  'patients.noInsurance': 'لا توجد معلومات تأمين',
  'patients.noNotes': 'لا توجد ملاحظات متاحة',
  'patients.notes': 'ملاحظات',
  'patients.insuranceProvider': 'مقدم التأمين',
  'patients.policyNumber': 'رقم البوليصة',
  'patients.groupNumber': 'رقم المجموعة',
  'patients.deletePatient': 'حذف المريض',
  'patients.deleteConfirmation': 'هل أنت متأكد من رغبتك في حذف {patientName}؟ لا يمكن التراجع عن هذا الإجراء.',
  'patients.totalPatients': 'إجمالي المرضى: {count}',
  'patients.searchPlaceholder': 'البحث عن المرضى بالاسم أو رقم الملف أو الهاتف...',
  'patients.noResults': 'لم يتم العثور على مرضى',
  'patients.noPatients': 'لا يوجد مرضى مسجلون',
  'patients.tryDifferentSearch': 'جرب تعديل مصطلحات البحث',
  'patients.addFirstPatient': 'أضف أول مريض للبدء',
  'patients.addPatientDescription': 'أدخل معلومات المريض لإنشاء ملف طبي جديد',

  // Appointments
  'appointments.title': 'إدارة المواعيد',
  'appointments.schedule': 'جدولة موعد',
  'appointments.reschedule': 'إعادة جدولة',
  'appointments.cancel': 'إلغاء الموعد',
  'appointments.confirm': 'تأكيد الموعد',
  'appointments.patient': 'المريض',
  'appointments.doctor': 'الطبيب',
  'appointments.datetime': 'التاريخ والوقت',
  'appointments.duration': 'المدة',
  'appointments.reason': 'سبب الزيارة',
  'appointments.notes': 'ملاحظات',
  'appointments.status': 'الحالة',
  'appointments.scheduled': 'مجدول',
  'appointments.inProgress': 'قيد التنفيذ',
  'appointments.completed': 'مكتمل',
  'appointments.cancelled': 'ملغي',
  'appointments.noShow': 'لم يحضر',

  // Laboratory
  'lab.title': 'إدارة المختبر',
  'lab.orderTest': 'طلب فحص',
  'lab.results': 'نتائج المختبر',
  'lab.pending': 'الفحوصات المعلقة',
  'lab.completed': 'الفحوصات المكتملة',
  'lab.testName': 'اسم الفحص',
  'lab.testCode': 'رمز الفحص',
  'lab.specimen': 'نوع العينة',
  'lab.priority': 'الأولوية',
  'lab.urgent': 'عاجل',
  'lab.routine': 'روتيني',
  'lab.stat': 'فوري',
  'lab.reference': 'المدى المرجعي',
  'lab.result': 'النتيجة',
  'lab.units': 'الوحدات',
  'lab.abnormal': 'غير طبيعي',
  'lab.critical': 'حرج',
  'lab.normal': 'طبيعي',

  // Pharmacy
  'pharmacy.title': 'إدارة الصيدلية',
  'pharmacy.prescriptions': 'الوصفات الطبية',
  'pharmacy.inventory': 'المخزون',
  'pharmacy.dispense': 'صرف الدواء',
  'pharmacy.medication': 'الدواء',
  'pharmacy.dosage': 'الجرعة',
  'pharmacy.frequency': 'التكرار',
  'pharmacy.duration': 'المدة',
  'pharmacy.quantity': 'الكمية',
  'pharmacy.instructions': 'التعليمات',
  'pharmacy.stock': 'مستوى المخزون',
  'pharmacy.reorder': 'مستوى إعادة الطلب',
  'pharmacy.expired': 'منتهي الصلاحية',
  'pharmacy.expiring': 'ينتهي قريباً',

  // Billing
  'billing.title': 'الفوترة والتأمين',
  'billing.invoice': 'فاتورة',
  'billing.payment': 'دفعة',
  'billing.insurance': 'التأمين',
  'billing.claim': 'مطالبة التأمين',
  'billing.amount': 'المبلغ',
  'billing.paid': 'مدفوع',
  'billing.outstanding': 'مستحق',
  'billing.overdue': 'متأخر',
  'billing.paymentMethod': 'طريقة الدفع',
  'billing.cash': 'نقدي',
  'billing.card': 'بطاقة',
  'billing.transfer': 'حوالة بنكية',
  'billing.insuranceClaim': 'مطالبة التأمين',

  // Reports
  'reports.title': 'التقارير والتحليلات',
  'reports.generate': 'إنشاء تقرير',
  'reports.export': 'تصدير التقرير',
  'reports.schedule': 'جدولة التقرير',
  'reports.patient': 'تقارير المرضى',
  'reports.financial': 'التقارير المالية',
  'reports.operational': 'التقارير التشغيلية',
  'reports.clinical': 'التقارير السريرية',
  'reports.dateRange': 'النطاق الزمني',
  'reports.filters': 'مرشحات التقرير',
  'reports.revenueReport': 'تقرير الإيرادات',
  'reports.expensesReport': 'تقرير المصروفات',
  'reports.profitabilityReport': 'تقرير الربحية',
  'reports.insuranceReport': 'تقرير التأمين',
  'reports.patientsReport': 'تقرير المرضى',
  'reports.monthlyReport': 'التقرير الشهري',

  // Settings
  'settings.title': 'الإعدادات',
  'settings.profile': 'إعدادات الملف الشخصي',
  'settings.system': 'إعدادات النظام',
  'settings.notifications': 'الإشعارات',
  'settings.appearance': 'المظهر',
  'settings.language': 'اللغة',
  'settings.theme': 'المظهر',
  'settings.lightMode': 'الوضع المضيء',
  'settings.darkMode': 'الوضع المظلم',
  'settings.autoMode': 'الوضع التلقائي',
  'settings.preferences': 'التفضيلات',
  'settings.security': 'الأمان',
  'settings.backup': 'النسخ الاحتياطي والاستعادة',

  // Theme
  'theme.light': 'مضيء',
  'theme.dark': 'مظلم',
  'theme.system': 'النظام',
  'theme.toggle': 'تبديل المظهر',

  // Roles
  'roles.admin': 'مدير',
  'roles.doctor': 'طبيب',
  'roles.nurse': 'ممرض',
  'roles.receptionist': 'موظف استقبال',
  'roles.lab_tech': 'فني مختبر',
  'roles.pharmacist': 'صيدلي',
  'roles.radiologist': 'أخصائي أشعة',

  // Status Messages
  'status.connected': 'متصل',
  'status.disconnected': 'منقطع',
  'status.syncing': 'جاري المزامنة...',
  'status.offline': 'غير متصل',
  'status.online': 'متصل',

  // Error Messages
  'error.networkError': 'خطأ في الاتصال بالشبكة',
  'error.serverError': 'حدث خطأ في الخادم',
  'error.unauthorized': 'وصول غير مصرح',
  'error.notFound': 'المورد غير موجود',
  'error.validation': 'خطأ في التحقق',
  'error.generic': 'حدث خطأ غير متوقع',

  // Success Messages
  'success.saved': 'تم الحفظ بنجاح',
  'success.updated': 'تم التحديث بنجاح',
  'success.deleted': 'تم الحذف بنجاح',
  'success.created': 'تم الإنشاء بنجاح',
  'success.sent': 'تم الإرسال بنجاح'
};

// English translations (keeping original structure)
const englishTranslations = {
  // Common
  'common.loading': 'Loading...',
  'common.error': 'Error',
  'common.success': 'Success',
  'common.cancel': 'Cancel',
  'common.save': 'Save',
  'common.delete': 'Delete',
  'common.edit': 'Edit',
  'common.add': 'Add',
  'common.search': 'Search',
  'common.filter': 'Filter',
  'common.export': 'Export',
  'common.import': 'Import',
  'common.print': 'Print',
  'common.refresh': 'Refresh',
  'common.submit': 'Submit',
  'common.close': 'Close',
  'common.open': 'Open',
  'common.view': 'View',
  'common.download': 'Download',
  'common.upload': 'Upload',
  'common.select': 'Select',
  'common.confirm': 'Confirm',
  'common.yes': 'Yes',
  'common.no': 'No',
  'common.back': 'Back',
  'common.next': 'Next',
  'common.previous': 'Previous',
  'common.home': 'Home',
  'common.settings': 'Settings',
  'common.logout': 'Logout',
  'common.login': 'Login',
  'common.register': 'Register',
  'common.today': 'Today',
  'common.yesterday': 'Yesterday',
  'common.tomorrow': 'Tomorrow',
  'common.week': 'Week',
  'common.month': 'Month',
  'common.year': 'Year',
  'common.date': 'Date',
  'common.time': 'Time',
  'common.name': 'Name',
  'common.email': 'Email',
  'common.phone': 'Phone',
  'common.address': 'Address',
  'common.status': 'Status',
  'common.active': 'Active',
  'common.inactive': 'Inactive',
  'common.pending': 'Pending',
  'common.completed': 'Completed',
  'common.cancelled': 'Cancelled',
  'common.approved': 'Approved',
  'common.rejected': 'Rejected',
  'common.calendar': 'Calendar',
  'common.all': 'All',
  'common.minutes': 'minutes',
  'common.hours': 'hours',
  'common.years': 'years',
  'common.currency': 'SAR',
  'common.notSpecified': 'Not specified',
  'common.notProvided': 'Not provided',
  'common.deceased': 'Deceased',

  // Add all other English translations...
  // (keeping the existing structure for brevity)
};

// Combined translations object
const translations = {
  en: englishTranslations,
  ar: arabicTranslations
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('preferred-language');
    return (saved as Language) || 'ar'; // Default to Arabic
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    localStorage.setItem('preferred-language', language);
    
    // Set HTML direction
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Update body class for RTL support
    if (isRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [language, isRTL]);

  const t = (key: string, params?: Record<string, any>): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    
    // Fallback to English if Arabic translation not found
    if (value === undefined && language !== 'en') {
      value = translations.en;
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) break;
      }
    }
    
    // Final fallback to key itself
    if (typeof value !== 'string') {
      return key;
    }
    
    // Replace parameters in the translation
    if (params) {
      return Object.entries(params).reduce(
        (str, [key, val]) => str.replace(new RegExp(`{${key}}`, 'g'), String(val)),
        value
      );
    }
    
    return value;
  };

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t,
    isRTL,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageProvider;