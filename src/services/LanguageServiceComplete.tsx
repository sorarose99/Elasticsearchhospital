import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { extendedTranslations } from './LanguageServiceExtended';

export type Language = 'en' | 'ar' | 'fr' | 'es' | 'de';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Basic minimal translations for core functionality
const baseTranslations = {
  en: {
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.home': 'Home',
    'common.login': 'Login',
    'common.logout': 'Logout',
    'auth.welcome': 'Welcome to MediCore',
    'auth.subtitle': 'Complete Healthcare Management System',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.loginButton': 'Sign In to Your Account',
    'auth.demoAccounts': 'Demo Accounts',
    'auth.demoMode': 'Demo Mode Available',
    'roles.admin': 'Administrator',
    'roles.doctor': 'Doctor',
    'roles.nurse': 'Nurse',
    'roles.receptionist': 'Receptionist',
    'roles.lab_tech': 'Lab Technician',
    'roles.pharmacist': 'Pharmacist',
    'roles.radiologist': 'Radiologist'
  },
  ar: {
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.add': 'إضافة',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.home': 'الرئيسية',
    'common.login': 'تسجيل الدخول',
    'common.logout': 'تسجيل الخروج',
    'auth.welcome': 'مرحباً بك في ميديكور',
    'auth.subtitle': 'نظام إدارة الرعاية الصحية الشامل',
    'auth.email': 'عنوان البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.loginButton': 'تسجيل الدخول إلى حسابك',
    'auth.demoAccounts': 'حسابات تجريبية',
    'auth.demoMode': 'الوضع التجريبي متاح',
    'roles.admin': 'مدير النظام',
    'roles.doctor': 'طبيب',
    'roles.nurse': 'ممرض/ة',
    'roles.receptionist': 'موظف استقبال',
    'roles.lab_tech': 'فني مختبر',
    'roles.pharmacist': 'صيدلي',
    'roles.radiologist': 'أخصائي أشعة'
  }
};

// Merge base translations with extended translations
const mergeTranslations = (base: any, extended: any) => {
  const result = { ...base };
  for (const [lang, trans] of Object.entries(extended)) {
    result[lang] = { ...result[lang], ...trans };
  }
  return result;
};

// Complete translations with all extended features
const translations = mergeTranslations(baseTranslations, extendedTranslations);

// RTL languages
const rtlLanguages: Language[] = ['ar'];

// Translation function with parameter replacement
const translate = (language: Language, key: string, params?: Record<string, any>): string => {
  const langTranslations = translations[language] || translations.en;
  let translation = langTranslations[key] || key;
  
  // Replace parameters in translation
  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      translation = translation.replace(new RegExp(`{${param}}`, 'g'), String(value));
    });
  }
  
  return translation;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  
  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string, params?: Record<string, any>) => translate(language, key, params);
  
  const isRTL = rtlLanguages.includes(language);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    isRTL
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageProvider;