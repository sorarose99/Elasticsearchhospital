import React, { useState, useEffect } from 'react';
import { Search, Users, Calendar, TestTube, Pill, Camera, FileText, CreditCard } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { useNavigation } from './NavigationContext';
import { useLanguage } from '../../services/LanguageService';

interface SearchResult {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  type: 'patient' | 'appointment' | 'test' | 'prescription' | 'invoice' | 'user' | 'module';
  module: string;
  action: () => void;
  icon: any;
}

interface GlobalSearchProps {
  language: 'en' | 'ar';
  userRole: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  language,
  userRole,
  open,
  onOpenChange
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { navigateTo, addBreadcrumb } = useNavigation();
  const { t, isRTL } = useLanguage();

  // Mock search function - in real app, this would call an API
  const performSearch = async (searchQuery: string): Promise<SearchResult[]> => {
    if (!searchQuery.trim()) return [];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockResults: SearchResult[] = [
      // Patients
      {
        id: 'patient-1',
        title: 'Ahmed Hassan',
        titleAr: 'أحمد حسن',
        description: 'Patient ID: P001 | Age: 45 | Cardiology',
        descriptionAr: 'رقم المريض: P001 | العمر: 45 | أمراض القلب',
        type: 'patient',
        module: 'patients',
        icon: Users,
        action: () => {
          navigateTo('patients', 'emr');
          addBreadcrumb({ label: 'Ahmed Hassan', labelAr: 'أحمد حسن' });
        }
      },
      {
        id: 'patient-2',
        title: 'Sara Mohamed',
        titleAr: 'سارة محمد',
        description: 'Patient ID: P002 | Age: 32 | General Medicine',
        descriptionAr: 'رقم المريض: P002 | العمر: 32 | طب عام',
        type: 'patient',
        module: 'patients',
        icon: Users,
        action: () => {
          navigateTo('patients', 'emr');
          addBreadcrumb({ label: 'Sara Mohamed', labelAr: 'سارة محمد' });
        }
      },

      // Appointments
      {
        id: 'appointment-1',
        title: 'Dr. Ahmed - Cardiology',
        titleAr: 'د. أحمد - أمراض القلب',
        description: 'Today 10:00 AM | Patient: Omar Ali',
        descriptionAr: 'اليوم 10:00 ص | المريض: عمر علي',
        type: 'appointment',
        module: 'appointments',
        icon: Calendar,
        action: () => {
          navigateTo('appointments', 'today');
        }
      },

      // Lab Tests
      {
        id: 'lab-1',
        title: 'CBC Test',
        titleAr: 'تحليل صورة دم كاملة',
        description: 'Complete Blood Count | Patient: Ahmed Hassan',
        descriptionAr: 'تعداد الدم الكامل | المريض: أحمد حسن',
        type: 'test',
        module: 'laboratory',
        icon: TestTube,
        action: () => {
          navigateTo('laboratory', 'results');
        }
      },

      // Prescriptions
      {
        id: 'prescription-1',
        title: 'Prescription #12345',
        titleAr: 'وصفة رقم 12345',
        description: 'Dr. Layla | Patient: Sara Mohamed | 3 medications',
        descriptionAr: 'د. ليلى | المريض: سارة محمد | 3 أدوية',
        type: 'prescription',
        module: 'pharmacy',
        icon: Pill,
        action: () => {
          navigateTo('pharmacy', 'prescriptions');
        }
      },

      // Radiology
      {
        id: 'radiology-1',
        title: 'Chest X-Ray',
        titleAr: 'أشعة سينية للصدر',
        description: 'Patient: Ahmed Hassan | Status: Completed',
        descriptionAr: 'المريض: أحمد حسن | الحالة: مكتمل',
        type: 'prescription',
        module: 'radiology',
        icon: Camera,
        action: () => {
          navigateTo('radiology', 'images');
        }
      }
    ];

    // Filter results based on query and user role
    return mockResults.filter(result => {
      const titleMatch = result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        result.titleAr.includes(searchQuery);
      const descriptionMatch = result.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              result.descriptionAr.includes(searchQuery);
      
      return titleMatch || descriptionMatch;
    }).slice(0, 8); // Limit to 8 results
  };

  useEffect(() => {
    const searchWithDelay = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const searchResults = await performSearch(query);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchWithDelay, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    result.action();
    onOpenChange(false);
    setQuery('');
    setResults([]);
  };

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, { en: string; ar: string }> = {
      patient: { en: 'Patient', ar: 'مريض' },
      appointment: { en: 'Appointment', ar: 'موعد' },
      test: { en: 'Lab Test', ar: 'تحليل' },
      prescription: { en: 'Prescription', ar: 'وصفة' },
      invoice: { en: 'Invoice', ar: 'فاتورة' },
      user: { en: 'User', ar: 'مستخدم' },
      module: { en: 'Module', ar: 'وحدة' }
    };
    const mapping = typeMap[type] || { en: 'Item', ar: 'عنصر' };
    return language === 'ar' ? mapping.ar : mapping.en;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      patient: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      appointment: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      test: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      prescription: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      invoice: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      user: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
      module: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-2xl ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader className={isRTL ? 'text-right' : 'text-left'}>
          <DialogTitle>
            {language === 'ar' ? 'البحث الشامل' : 'Global Search'}
          </DialogTitle>
          <DialogDescription>
            {language === 'ar' 
              ? 'البحث في المرضى والمواعيد والمختبر والمزيد...'
              : 'Search for patients, appointments, lab tests, and more...'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 ${isRTL ? 'right-3' : 'left-3'}`} />
          <Input
            placeholder={language === 'ar' 
              ? 'البحث في المرضى والمواعيد والمختبر...'
              : 'Search patients, appointments, lab tests...'
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            autoFocus
          />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="max-h-96 overflow-y-auto">
            <div className="space-y-2">
              {results.map((result) => {
                const IconComponent = result.icon;
                return (
                  <Button
                    key={result.id}
                    variant="ghost"
                    className={`w-full h-auto p-4 justify-start hover:bg-gray-50 dark:hover:bg-gray-800 ${isRTL ? 'text-right' : 'text-left'}`}
                    onClick={() => handleResultClick(result)}
                  >
                    <div className={`flex items-start space-x-3 w-full ${isRTL ? 'space-x-reverse' : ''}`}>
                      <div className="flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </div>
                      
                      <div className="flex-1">
                        <div className={`flex items-center justify-between mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <h4 className="text-sm text-gray-900 dark:text-gray-100">
                            {isRTL ? result.titleAr : result.title}
                          </h4>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getTypeColor(result.type)}`}
                          >
                            {getTypeLabel(result.type)}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {isRTL ? result.descriptionAr : result.description}
                        </p>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {!loading && query.length >= 2 && results.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>{language === 'ar' ? 'لم يتم العثور على نتائج' : 'No results found'}</p>
            <p className="text-sm mt-1">
              {language === 'ar' ? 'جرب مصطلحات بحث مختلفة' : 'Try different search terms'}
            </p>
          </div>
        )}

        {query.length < 2 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-sm">
              {language === 'ar' ? 'اكتب حرفين على الأقل للبحث' : 'Type at least 2 characters to search'}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};