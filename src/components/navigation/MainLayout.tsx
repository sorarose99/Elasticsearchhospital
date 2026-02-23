import React, { useEffect, useMemo } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Breadcrumbs } from './Breadcrumbs';
import { QuickActions } from './QuickActions';
import KeyboardShortcuts, { useKeyboardShortcuts } from './KeyboardShortcuts';
import { useNavigation } from './NavigationContext';
import { getQuickActionsForModule, navigationModules } from './NavigationConfig';
import { NavigationHistoryProvider, useNavigationHistory } from './NavigationHistory';
import { QuickActionsProvider } from '../../services/QuickActionsService';

interface MainLayoutProps {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    specialization?: string;
    department?: string;
  };
  language: 'en' | 'ar';
  onLanguageChange: (lang: 'en' | 'ar') => void;
  onLogout: () => void;
  isDemoMode?: boolean;
  children: React.ReactNode;
}

// Inner component that uses navigation history
const MainLayoutInner: React.FC<MainLayoutProps> = ({
  user,
  language,
  onLanguageChange,
  onLogout,
  isDemoMode = false,
  children
}) => {
  const { navigation, setQuickActions, navigate } = useNavigation();
  const { addToHistory } = useNavigationHistory();
  const { isShortcutsOpen, closeShortcuts } = useKeyboardShortcuts();

  // Memoize quick actions to prevent unnecessary re-renders
  const quickActions = useMemo(() => {
    const quickActionConfigs = getQuickActionsForModule(navigation.currentModule, user.role);
    return quickActionConfigs.map(config => ({
      id: config.id,
      label: config.label,
      labelAr: config.labelAr,
      icon: config.icon,
      action: config.action,
      role: config.roles,
      shortcut: config.shortcut
    }));
  }, [navigation.currentModule, user.role]);

  // Update quick actions when they change
  useEffect(() => {
    setQuickActions(quickActions);
  }, [quickActions, setQuickActions]);

  // Add to history when navigation changes (with memoized values)
  const historyEntry = useMemo(() => {
    const module = navigationModules.find(m => m.id === navigation.currentModule);
    const view = module?.views.find(v => v.id === navigation.currentView);
    
    if (!module) return null;
    
    return {
      module: navigation.currentModule,
      view: navigation.currentView,
      title: `${module.label}${view && view.id !== 'overview' ? ` - ${view.label}` : ''}`,
      titleAr: `${module.labelAr}${view && view.id !== 'overview' ? ` - ${view.labelAr}` : ''}`
    };
  }, [navigation.currentModule, navigation.currentView]);

  useEffect(() => {
    if (historyEntry) {
      addToHistory(historyEntry);
    }
  }, [historyEntry, addToHistory]);

  // Handle keyboard shortcut actions
  const handleShortcutAction = (action: string) => {
    if (action.startsWith('navigate:')) {
      const target = action.split(':')[1];
      if (target.includes('/')) {
        const [module, view] = target.split('/');
        navigate(module, view);
      } else {
        navigate(target);
      }
    }
  };

  return (
    <QuickActionsProvider userId={user.id} userRole={user.role}>
      <div className={`flex h-screen ${language === 'ar' ? 'rtl' : 'ltr'}`} data-slot="main-layout">
        <Sidebar
          user={user}
          language={language}
          onLanguageChange={onLanguageChange}
          onLogout={onLogout}
          isDemoMode={isDemoMode}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar
            user={user}
            language={language}
            onLanguageChange={onLanguageChange}
            onLogout={onLogout}
            isDemoMode={isDemoMode}
          />
          
          <main className="flex-1 overflow-y-auto bg-background custom-scrollbar contrast-enhanced">
            <div className="p-6">
              <Breadcrumbs language={language} />
              <QuickActions language={language} userRole={user.role} variant="compact" />
              <div className="space-y-6">
                {children}
              </div>
            </div>
          </main>
        </div>

        {/* Keyboard Shortcuts Dialog */}
        <KeyboardShortcuts
          isOpen={isShortcutsOpen}
          onClose={closeShortcuts}
          onExecuteAction={handleShortcutAction}
        />
      </div>
    </QuickActionsProvider>
  );
};

export const MainLayout: React.FC<MainLayoutProps> = (props) => {
  const { navigateTo } = useNavigation();
  
  return (
    <NavigationHistoryProvider onNavigate={navigateTo}>
      <MainLayoutInner {...props} />
    </NavigationHistoryProvider>
  );
};