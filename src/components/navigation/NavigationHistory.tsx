import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface NavigationHistoryItem {
  module: string;
  view: string;
  timestamp: number;
  title: string;
  titleAr: string;
}

interface NavigationHistoryContextType {
  history: NavigationHistoryItem[];
  currentIndex: number;
  canGoBack: boolean;
  canGoForward: boolean;
  goBack: () => void;
  goForward: () => void;
  addToHistory: (item: Omit<NavigationHistoryItem, 'timestamp'>) => void;
  clearHistory: () => void;
}

const NavigationHistoryContext = createContext<NavigationHistoryContextType | undefined>(undefined);

export const useNavigationHistory = () => {
  const context = useContext(NavigationHistoryContext);
  if (!context) {
    throw new Error('useNavigationHistory must be used within NavigationHistoryProvider');
  }
  return context;
};

interface NavigationHistoryProviderProps {
  children: React.ReactNode;
  onNavigate: (module: string, view: string) => void;
}

export const NavigationHistoryProvider: React.FC<NavigationHistoryProviderProps> = ({
  children,
  onNavigate
}) => {
  const [history, setHistory] = useState<NavigationHistoryItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isNavigating, setIsNavigating] = useState(false);

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < history.length - 1;

  const goBack = useCallback(() => {
    if (canGoBack && !isNavigating) {
      setIsNavigating(true);
      const newIndex = currentIndex - 1;
      const item = history[newIndex];
      setCurrentIndex(newIndex);
      onNavigate(item.module, item.view);
      setTimeout(() => setIsNavigating(false), 100);
    }
  }, [canGoBack, currentIndex, history, onNavigate, isNavigating]);

  const goForward = useCallback(() => {
    if (canGoForward && !isNavigating) {
      setIsNavigating(true);
      const newIndex = currentIndex + 1;
      const item = history[newIndex];
      setCurrentIndex(newIndex);
      onNavigate(item.module, item.view);
      setTimeout(() => setIsNavigating(false), 100);
    }
  }, [canGoForward, currentIndex, history, onNavigate, isNavigating]);

  const addToHistory = useCallback((item: Omit<NavigationHistoryItem, 'timestamp'>) => {
    if (isNavigating) return; // تجنب الإضافة أثناء التنقل البرمجي

    const newItem: NavigationHistoryItem = {
      ...item,
      timestamp: Date.now()
    };

    setHistory(prev => {
      // إزالة التاريخ المستقبلي عند إضافة عنصر جديد
      const newHistory = prev.slice(0, currentIndex + 1);
      
      // عدم الإضافة إذا كان مطابقاً للعنصر الحالي
      const lastItem = newHistory[newHistory.length - 1];
      if (lastItem && lastItem.module === item.module && lastItem.view === item.view) {
        return newHistory;
      }

      // الاحتفاظ بآخر 50 عنصر فقط
      const updatedHistory = [...newHistory, newItem].slice(-50);
      
      // تحديث المؤشر
      setCurrentIndex(updatedHistory.length - 1);
      
      return updatedHistory;
    });
  }, [currentIndex, isNavigating]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  // تحميل التاريخ من localStorage عند البداية فقط
  useEffect(() => {
    const savedHistory = localStorage.getItem('navigation-history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        if (parsed.history && Array.isArray(parsed.history)) {
          setHistory(parsed.history);
          setCurrentIndex(parsed.currentIndex >= 0 ? parsed.currentIndex : parsed.history.length - 1);
        }
      } catch (error) {
        console.error('Failed to parse navigation history:', error);
        localStorage.removeItem('navigation-history');
      }
    }
  }, []);

  // حفظ التاريخ في localStorage
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('navigation-history', JSON.stringify({
        history,
        currentIndex
      }));
    }
  }, [history, currentIndex]);

  return (
    <NavigationHistoryContext.Provider value={{
      history,
      currentIndex,
      canGoBack,
      canGoForward,
      goBack,
      goForward,
      addToHistory,
      clearHistory
    }}>
      {children}
    </NavigationHistoryContext.Provider>
  );
};

// Navigation History Button Component
export const NavigationHistoryButtons: React.FC<{ language: 'en' | 'ar' }> = ({ language }) => {
  const { canGoBack, canGoForward, goBack, goForward } = useNavigationHistory();

  return (
    <div className="flex items-center space-x-1 rtl:space-x-reverse">
      <button
        onClick={goBack}
        disabled={!canGoBack}
        className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
          !canGoBack ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        title={language === 'ar' ? 'السابق' : 'Back'}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={goForward}
        disabled={!canGoForward}
        className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
          !canGoForward ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        title={language === 'ar' ? 'التالي' : 'Forward'}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};