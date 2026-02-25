import React, { useState, useMemo, useCallback } from 'react';
import { ChevronDown, ChevronRight, Menu, X, Home, LogOut, Globe, Star, StarOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useNavigation } from './NavigationContext';
import { navigationModules, getModulesForRole, getViewsForModule } from './NavigationConfig';
import { useMenuCustomization } from '../../services/MenuCustomizationService';
import { useFavorites } from '../../services/FavoritesService';

interface SidebarProps {
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
}

const SidebarComponent: React.FC<SidebarProps> = ({
  user,
  language,
  onLanguageChange,
  onLogout,
  isDemoMode = false
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['dashboard']));
  const { navigation, navigateTo } = useNavigation();
  const menuCustomization = useMenuCustomization();
  const favoritesService = useFavorites();
  
  const { getVisibleMenuItems } = menuCustomization;
  const { addToFavorites, removeFromFavorites, isFavorite, recordAccess } = favoritesService;

  const visibleMenuItems = useMemo(() => getVisibleMenuItems(), [getVisibleMenuItems]);

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleViewClick = useCallback((moduleId: string, viewId: string) => {
    recordAccess(moduleId, viewId);
    navigateTo(moduleId, viewId);
  }, [recordAccess, navigateTo]);

  const handleToggleFavorite = useCallback((moduleId: string, viewId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite(moduleId, viewId)) {
      // Find the favorite and remove it
      const module = navigationModules.find(m => m.id === moduleId);
      const view = module?.views.find(v => v.id === viewId);
      if (module && view) {
        removeFromFavorites(`${moduleId}_${viewId}`);
      }
    } else {
      addToFavorites(moduleId, viewId);
    }
  }, [isFavorite, removeFromFavorites, addToFavorites]);

  const getRoleLabel = (role: string) => {
    const labels = {
      en: {
        admin: 'Administrator',
        doctor: 'Doctor',
        receptionist: 'Receptionist',
        lab_tech: 'Lab Technician',
        pharmacist: 'Pharmacist',
        radiologist: 'Radiologist',
        billing: 'Billing Specialist'
      },
      ar: {
        admin: 'مدير النظام',
        doctor: 'طبيب',
        receptionist: 'موظف استقبال',
        lab_tech: 'فني مختبر',
        pharmacist: 'صيدلي',
        radiologist: 'أخصائي أشعة',
        billing: 'أخصائي محاسبة'
      }
    };
    return labels[language][role as keyof typeof labels.en] || role;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className={`
      ${collapsed ? 'w-16' : 'w-72'} 
      transition-all duration-300 ease-in-out
      bg-sidebar border-r border-sidebar-border gradient-sidebar
      flex flex-col h-screen contrast-enhanced custom-scrollbar
      ${language === 'ar' ? 'border-l border-r-0' : ''}
    `} data-slot="sidebar">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className={`${collapsed ? 'hidden' : 'flex'} items-center space-x-3 ${language === 'ar' ? 'space-x-reverse' : ''}`}>
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sidebar-foreground text-sm font-medium">
                {language === 'ar' ? 'نظام إدارة العيادة' : 'Clinic Manager'}
              </h1>
              {isDemoMode && (
                <Badge variant="secondary" className="text-xs mt-1">
                  {language === 'ar' ? 'نسخة تجريبية' : 'Demo Mode'}
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-sidebar-border">
        <div className={`${collapsed ? 'justify-center' : 'space-x-3'} flex items-center ${language === 'ar' ? 'space-x-reverse' : ''}`}>
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-medium">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sidebar-foreground text-sm truncate font-medium">
                {user.name}
              </p>
              <p className="text-sidebar-foreground/60 text-xs truncate">
                {getRoleLabel(user.role)}
              </p>
              {user.specialization && (
                <p className="text-sidebar-foreground/40 text-xs truncate">
                  {user.specialization}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {visibleMenuItems.map((item) => {
            const module = navigationModules.find(m => m.id === item.moduleId);
            const ModuleIcon = module?.icon || Home;
            const isExpanded = expandedModules.has(item.id);
            const isActive = navigation.currentModule === item.moduleId;
            const moduleViews = item.children || [];

            return (
              <div key={item.id} className="mb-1">
                <div className="relative group">
                  <Button
                    data-testid={`nav-${item.moduleId}`}
                    variant={isActive ? "secondary" : "ghost"}
                    className={`
                      w-full justify-start h-9 px-2 navigation-item
                      ${collapsed ? 'justify-center px-0' : ''}
                      ${isActive ? 'active bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}
                    `}
                    onClick={() => {
                      if (moduleViews.length > 1) {
                        toggleModule(item.id);
                      } else {
                        const firstView = moduleViews[0];
                        handleViewClick(item.moduleId, firstView?.viewId || 'overview');
                      }
                    }}
                  >
                    <ModuleIcon className="w-4 h-4" />
                    {!collapsed && (
                      <>
                        <span className="ml-2 flex-1 text-left">
                          {language === 'ar' ? item.labelAr : item.label}
                        </span>
                        {moduleViews.length > 1 && (
                          <span className="ml-auto">
                            {isExpanded ? (
                              <ChevronDown className="w-3 h-3" />
                            ) : (
                              <ChevronRight className="w-3 h-3" />
                            )}
                          </span>
                        )}
                      </>
                    )}
                  </Button>

                  {/* Favorite toggle */}
                  {!collapsed && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-9 w-8 opacity-0 group-hover:opacity-100 transition-opacity p-0"
                      onClick={(e) => handleToggleFavorite(item.moduleId, moduleViews[0]?.viewId || 'overview', e)}
                    >
                      {isFavorite(item.moduleId, moduleViews[0]?.viewId || 'overview') ? (
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      ) : (
                        <StarOff className="w-3 h-3 text-muted-foreground" />
                      )}
                    </Button>
                  )}
                </div>

                {/* Sub-views */}
                {!collapsed && isExpanded && moduleViews.length > 1 && (
                  <div className="ml-6 mt-1 space-y-1">
                    {moduleViews.map((childItem) => {
                      const view = module?.views.find(v => v.id === childItem.viewId);
                      const ViewIcon = view?.icon;
                      const isViewActive = navigation.currentModule === item.moduleId && navigation.currentView === childItem.viewId;

                      return (
                        <div key={childItem.id} className="relative group">
                          <Button
                            data-testid={`nav-${item.moduleId}-${childItem.viewId}`}
                            variant={isViewActive ? "secondary" : "ghost"}
                            size="sm"
                            className={`
                              w-full justify-start h-8 px-2 navigation-item
                              ${isViewActive ? 'active bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}
                            `}
                            onClick={() => handleViewClick(item.moduleId, childItem.viewId || 'overview')}
                          >
                            {ViewIcon && <ViewIcon className="w-3 h-3" />}
                            <span className="ml-2 text-xs flex-1 text-left">
                              {language === 'ar' ? childItem.labelAr : childItem.label}
                            </span>
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-8 w-6 opacity-0 group-hover:opacity-100 transition-opacity p-0"
                            onClick={(e) => handleToggleFavorite(item.moduleId, childItem.viewId || 'overview', e)}
                          >
                            {isFavorite(item.moduleId, childItem.viewId || 'overview') ? (
                              <Star className="w-2 h-2 text-yellow-500 fill-current" />
                            ) : (
                              <StarOff className="w-2 h-2 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        {!collapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLanguageChange(language === 'en' ? 'ar' : 'en')}
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Globe className="w-4 h-4" />
            <span className="ml-2">
              {language === 'ar' ? 'English' : 'العربية'}
            </span>
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className={`
            ${collapsed ? 'justify-center px-0' : 'justify-start'} 
            w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
          `}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && (
            <span className="ml-2">
              {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const Sidebar = React.memo(SidebarComponent, (prevProps, nextProps) => {
  return (
    prevProps.user.id === nextProps.user.id &&
    prevProps.language === nextProps.language &&
    prevProps.isDemoMode === nextProps.isDemoMode
  );
});