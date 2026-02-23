import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface NavigationState {
  currentModule: string;
  currentView: string;
  breadcrumbs: BreadcrumbItem[];
  quickActions: QuickAction[];
}

interface BreadcrumbItem {
  label: string;
  labelAr: string;
  path?: string;
  icon?: string;
}

interface QuickAction {
  id: string; // إضافة معرف فريد
  label: string;
  labelAr: string;
  icon: any;
  action: string; // تغيير من function إلى string
  role?: string[];
  shortcut?: string; // إضافة الاختصار
}

interface NavigationContextType {
  navigation: NavigationState;
  updateNavigation: (update: Partial<NavigationState>) => void;
  navigateTo: (module: string, view?: string) => void;
  addBreadcrumb: (item: BreadcrumbItem) => void;
  clearBreadcrumbs: () => void;
  setQuickActions: (actions: QuickAction[]) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
  userRole: string;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ 
  children, 
  userRole 
}) => {
  const [navigation, setNavigation] = useState<NavigationState>(() => ({
    currentModule: getDefaultModule(userRole),
    currentView: 'dashboard',
    breadcrumbs: [],
    quickActions: []
  }));

  const updateNavigation = useCallback((update: Partial<NavigationState>) => {
    setNavigation(prev => ({ ...prev, ...update }));
  }, []);

  const navigateTo = useCallback((module: string, view: string = 'dashboard') => {
    setNavigation(prev => {
      // تجنب التحديث إذا كانت القيم مطابقة
      if (prev.currentModule === module && prev.currentView === view) {
        return prev;
      }
      return {
        ...prev,
        currentModule: module,
        currentView: view
      };
    });
  }, []);

  const addBreadcrumb = useCallback((item: BreadcrumbItem) => {
    setNavigation(prev => ({
      ...prev,
      breadcrumbs: [...prev.breadcrumbs, item]
    }));
  }, []);

  const clearBreadcrumbs = useCallback(() => {
    setNavigation(prev => ({
      ...prev,
      breadcrumbs: []
    }));
  }, []);

  const setQuickActions = useCallback((actions: QuickAction[]) => {
    const filteredActions = actions.filter(action => 
      !action.role || action.role.includes(userRole)
    );
    
    setNavigation(prev => {
      // تجنب التحديث إذا كانت الإجراءات السريعة متطابقة
      if (JSON.stringify(prev.quickActions) === JSON.stringify(filteredActions)) {
        return prev;
      }
      return {
        ...prev,
        quickActions: filteredActions
      };
    });
  }, [userRole]);

  return (
    <NavigationContext.Provider value={{
      navigation,
      updateNavigation,
      navigateTo,
      addBreadcrumb,
      clearBreadcrumbs,
      setQuickActions
    }}>
      {children}
    </NavigationContext.Provider>
  );
};

function getDefaultModule(role: string): string {
  switch (role) {
    case 'admin': return 'dashboard';
    case 'doctor': return 'dashboard';
    case 'receptionist': return 'dashboard';
    case 'lab_tech': return 'laboratory';
    case 'pharmacist': return 'pharmacy';
    case 'radiologist': return 'radiology';
    case 'billing': return 'billing';
    default: return 'dashboard';
  }
}