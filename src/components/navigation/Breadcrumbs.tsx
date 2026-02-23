import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigation } from './NavigationContext';
import { navigationModules } from './NavigationConfig';

interface BreadcrumbsProps {
  language: 'en' | 'ar';
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ language }) => {
  const { navigation, navigateTo } = useNavigation();

  const getCurrentModule = () => {
    return navigationModules.find(m => m.id === navigation.currentModule);
  };

  const getCurrentView = () => {
    const module = getCurrentModule();
    if (!module) return null;
    return module.views.find(v => v.id === navigation.currentView);
  };

  const module = getCurrentModule();
  const view = getCurrentView();

  if (!module) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigateTo('dashboard')}
        className="p-0 h-auto hover:text-foreground"
      >
        <Home className="w-4 h-4" />
      </Button>

      <ChevronRight className="w-4 h-4" />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigateTo(module.id)}
        className="p-0 h-auto hover:text-foreground"
      >
        {language === 'ar' ? module.labelAr : module.label}
      </Button>

      {view && view.id !== 'overview' && (
        <>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">
            {language === 'ar' ? view.labelAr : view.label}
          </span>
        </>
      )}

      {navigation.breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4" />
          {breadcrumb.path ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {/* Handle custom navigation */}}
              className="p-0 h-auto hover:text-foreground"
            >
              {language === 'ar' ? breadcrumb.labelAr : breadcrumb.label}
            </Button>
          ) : (
            <span className="text-foreground">
              {language === 'ar' ? breadcrumb.labelAr : breadcrumb.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};