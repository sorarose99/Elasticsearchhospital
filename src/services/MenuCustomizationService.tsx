import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo, useRef } from 'react';
import { navigationModules, NavigationModule } from '../components/navigation/NavigationConfig';

export interface CustomMenuItem {
  id: string;
  moduleId: string;
  viewId?: string;
  label?: string;
  labelAr?: string;
  icon?: string;
  color?: string;
  visible: boolean;
  order: number;
  isCustom?: boolean;
  parentId?: string;
  children?: CustomMenuItem[];
}

export interface MenuTheme {
  id: string;
  name: string;
  nameAr: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  sidebarStyle: 'default' | 'compact' | 'minimal';
  iconStyle: 'outline' | 'filled' | 'duotone';
}

interface MenuCustomizationContextType {
  customMenuItems: CustomMenuItem[];
  currentTheme: MenuTheme;
  availableThemes: MenuTheme[];
  updateMenuItem: (itemId: string, updates: Partial<CustomMenuItem>) => void;
  reorderMenuItems: (newOrder: CustomMenuItem[]) => void;
  hideMenuItem: (itemId: string) => void;
  showMenuItem: (itemId: string) => void;
  addCustomMenuItem: (item: Omit<CustomMenuItem, 'id' | 'order'>) => void;
  removeCustomMenuItem: (itemId: string) => void;
  resetToDefault: () => void;
  changeTheme: (themeId: string) => void;
  exportCustomization: () => string;
  importCustomization: (data: string) => boolean;
  getVisibleMenuItems: () => CustomMenuItem[];
  repairMenuTranslations: () => void;
}

const MenuCustomizationContext = createContext<MenuCustomizationContextType | undefined>(undefined);

export const useMenuCustomization = () => {
  const context = useContext(MenuCustomizationContext);
  if (!context) {
    throw new Error('useMenuCustomization must be used within MenuCustomizationProvider');
  }
  return context;
};

// Default themes
const defaultThemes: MenuTheme[] = [
  {
    id: 'default',
    name: 'Default Blue',
    nameAr: 'الأزرق الافتراضي',
    primaryColor: '#030213',
    secondaryColor: '#f3f3f5',
    accentColor: '#e9ebef',
    sidebarStyle: 'default',
    iconStyle: 'outline'
  },
  {
    id: 'medical',
    name: 'Medical Green',
    nameAr: 'الأخضر الطبي',
    primaryColor: '#059669',
    secondaryColor: '#f0fdf4',
    accentColor: '#dcfce7',
    sidebarStyle: 'default',
    iconStyle: 'filled'
  },
  {
    id: 'dark',
    name: 'Professional Dark',
    nameAr: 'الداكن المهني',
    primaryColor: '#1f2937',
    secondaryColor: '#374151',
    accentColor: '#4b5563',
    sidebarStyle: 'minimal',
    iconStyle: 'outline'
  },
  {
    id: 'warm',
    name: 'Warm Orange',
    nameAr: 'البرتقالي الدافئ',
    primaryColor: '#ea580c',
    secondaryColor: '#fff7ed',
    accentColor: '#fed7aa',
    sidebarStyle: 'default',
    iconStyle: 'duotone'
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    nameAr: 'البنفسجي الملكي',
    primaryColor: '#7c3aed',
    secondaryColor: '#faf5ff',
    accentColor: '#e9d5ff',
    sidebarStyle: 'compact',
    iconStyle: 'filled'
  }
];

interface MenuCustomizationProviderProps {
  children: ReactNode;
  userId: string;
  userRole: string;
}

export const MenuCustomizationProvider: React.FC<MenuCustomizationProviderProps> = ({
  children,
  userId,
  userRole
}) => {
  const [customMenuItems, setCustomMenuItems] = useState<CustomMenuItem[]>([]);
  const [currentTheme, setCurrentTheme] = useState<MenuTheme>(defaultThemes[0]);
  
  // Track if initial load is complete - must be defined before useEffect
  const initialLoadRef = useRef(false);

  // Apply theme to CSS variables - defined early to avoid dependency issues
  const applyThemeToCSS = useCallback((theme: MenuTheme) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.style.setProperty('--sidebar-primary', theme.primaryColor);
    root.style.setProperty('--sidebar', theme.secondaryColor);
    root.style.setProperty('--sidebar-accent', theme.accentColor);
  }, []);

  // Initialize with default menu items based on user role
  useEffect(() => {
    let isMounted = true;
    
    const initializeMenuItems = () => {
      try {
        // Safe check for navigationModules
        if (!navigationModules || !Array.isArray(navigationModules)) {
          console.warn('navigationModules is not available or not an array');
          return [];
        }

        const roleBasedModules = navigationModules.filter(module => 
          module && module.roles && Array.isArray(module.roles) && module.roles.includes(userRole)
        );

        const defaultItems: CustomMenuItem[] = roleBasedModules.map((module, index) => ({
          id: module.id,
          moduleId: module.id,
          label: module.label || 'Unknown',
          labelAr: module.labelAr || 'غير معروف',
          icon: module.icon?.name || 'Settings',
          visible: true,
          order: index,
          children: (module.views || []).map((view, viewIndex) => ({
            id: `${module.id}_${view.id}`,
            moduleId: module.id,
            viewId: view.id,
            label: view.label || 'Unknown',
            labelAr: view.labelAr || 'غير معروف',
            icon: view.icon?.name || 'Settings',
            visible: true,
            order: viewIndex,
            parentId: module.id
          }))
        }));

        return defaultItems;
      } catch (error) {
        console.error('Error initializing menu items:', error);
        return [];
      }
    };

    const validateAndMergeMenuItems = (savedItems: CustomMenuItem[], defaultItems: CustomMenuItem[]): CustomMenuItem[] => {
      // Ensure all saved items have both label and labelAr
      // If missing, merge with default items to get the missing translations
      const defaultItemsMap = new Map(defaultItems.map(item => [item.id, item]));
      
      return savedItems.map(savedItem => {
        const defaultItem = defaultItemsMap.get(savedItem.id);
        
        // Merge saved item with default to ensure both labels exist
        const mergedItem: CustomMenuItem = {
          ...savedItem,
          label: savedItem.label || defaultItem?.label || 'Unknown',
          labelAr: savedItem.labelAr || defaultItem?.labelAr || 'غير معروف',
          children: savedItem.children?.map(savedChild => {
            const defaultChild = defaultItem?.children?.find(dc => dc.id === savedChild.id);
            return {
              ...savedChild,
              label: savedChild.label || defaultChild?.label || 'Unknown',
              labelAr: savedChild.labelAr || defaultChild?.labelAr || 'غير معروف'
            };
          })
        };
        
        return mergedItem;
      });
    };

    const loadMenuCustomization = () => {
      try {
        const defaultItems = initializeMenuItems();
        
        // Load customization from localStorage
        const savedCustomization = localStorage.getItem(`menu_customization_${userId}`);
        if (savedCustomization) {
          try {
            const parsed = JSON.parse(savedCustomization);
            if (isMounted) {
              // Validate and merge saved items with defaults to ensure bilingual support
              const menuItems = Array.isArray(parsed.menuItems) 
                ? validateAndMergeMenuItems(parsed.menuItems, defaultItems)
                : defaultItems;
              
              setCustomMenuItems(menuItems);
              initialLoadRef.current = true;
              
              if (parsed.themeId) {
                const savedTheme = defaultThemes.find(theme => theme.id === parsed.themeId);
                if (savedTheme) {
                  setCurrentTheme(savedTheme);
                  applyThemeToCSS(savedTheme);
                }
              }
            }
          } catch (parseError) {
            console.error('Failed to parse saved menu customization:', parseError);
            if (isMounted) {
              setCustomMenuItems(defaultItems);
              initialLoadRef.current = true;
            }
          }
        } else {
          if (isMounted) {
            setCustomMenuItems(defaultItems);
            initialLoadRef.current = true;
          }
        }
      } catch (error) {
        console.error('Error in loadMenuCustomization:', error);
        // Fallback to empty array if everything fails
        if (isMounted) {
          setCustomMenuItems([]);
          initialLoadRef.current = true;
        }
      }
    };
    
    loadMenuCustomization();
    
    return () => {
      isMounted = false;
    };
  }, [userId, userRole, applyThemeToCSS]);
  
  // Save customization to localStorage when it changes (with debounce)
  useEffect(() => {
    // Don't save on initial load
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      return;
    }
    
    const timeoutId = setTimeout(() => {
      const customizationData = {
        menuItems: customMenuItems,
        themeId: currentTheme.id,
        savedAt: Date.now()
      };
      
      localStorage.setItem(`menu_customization_${userId}`, JSON.stringify(customizationData));
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [customMenuItems, currentTheme.id, userId]);

  const updateMenuItem = (itemId: string, updates: Partial<CustomMenuItem>) => {
    setCustomMenuItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          return { ...item, ...updates };
        }
        if (item.children) {
          return {
            ...item,
            children: item.children.map(child =>
              child.id === itemId ? { ...child, ...updates } : child
            )
          };
        }
        return item;
      })
    );
  };

  const reorderMenuItems = (newOrder: CustomMenuItem[]) => {
    const reorderedItems = newOrder.map((item, index) => ({
      ...item,
      order: index
    }));
    
    setCustomMenuItems(reorderedItems);
  };

  const hideMenuItem = (itemId: string) => {
    updateMenuItem(itemId, { visible: false });
  };

  const showMenuItem = (itemId: string) => {
    updateMenuItem(itemId, { visible: true });
  };

  const addCustomMenuItem = (item: Omit<CustomMenuItem, 'id' | 'order'>) => {
    const newItem: CustomMenuItem = {
      ...item,
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      order: customMenuItems.length,
      isCustom: true
    };

    setCustomMenuItems(prev => [...prev, newItem]);
  };

  const removeCustomMenuItem = (itemId: string) => {
    setCustomMenuItems(prev =>
      prev.filter(item => item.id !== itemId)
        .map(item => ({
          ...item,
          children: item.children?.filter(child => child.id !== itemId)
        }))
    );
  };

  const resetToDefault = useCallback(() => {
    try {
      if (!navigationModules || !Array.isArray(navigationModules)) {
        console.warn('navigationModules is not available for reset');
        setCustomMenuItems([]);
        setCurrentTheme(defaultThemes[0]);
        return;
      }

      const roleBasedModules = navigationModules.filter(module => 
        module && module.roles && Array.isArray(module.roles) && module.roles.includes(userRole)
      );

      const defaultItems: CustomMenuItem[] = roleBasedModules.map((module, index) => ({
        id: module.id,
        moduleId: module.id,
        label: module.label || 'Unknown',
        labelAr: module.labelAr || 'غير معروف',
        icon: module.icon?.name || 'Settings',
        visible: true,
        order: index,
        children: (module.views || []).map((view, viewIndex) => ({
          id: `${module.id}_${view.id}`,
          moduleId: module.id,
          viewId: view.id,
          label: view.label || 'Unknown',
          labelAr: view.labelAr || 'غير معروف',
          icon: view.icon?.name || 'Settings',
          visible: true,
          order: viewIndex,
          parentId: module.id
        }))
      }));

      setCustomMenuItems(defaultItems);
      setCurrentTheme(defaultThemes[0]);
    } catch (error) {
      console.error('Error in resetToDefault:', error);
      setCustomMenuItems([]);
      setCurrentTheme(defaultThemes[0]);
    }
  }, [userRole, applyThemeToCSS]);

  const changeTheme = useCallback((themeId: string) => {
    const theme = defaultThemes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      // Apply theme to CSS variables
      applyThemeToCSS(theme);
    }
  }, [applyThemeToCSS]);

  const exportCustomization = () => {
    return JSON.stringify({
      menuItems: customMenuItems,
      theme: currentTheme,
      exportedAt: Date.now(),
      version: '1.0'
    });
  };

  const importCustomization = (data: string) => {
    try {
      const imported = JSON.parse(data);
      if (imported.menuItems && Array.isArray(imported.menuItems)) {
        setCustomMenuItems(imported.menuItems);
        
        if (imported.theme) {
          setCurrentTheme(imported.theme);
          applyThemeToCSS(imported.theme);
        }
        
        return true;
      }
    } catch (error) {
      console.error('Failed to import menu customization:', error);
    }
    return false;
  };

  const getVisibleMenuItems = useCallback(() => {
    return customMenuItems
      .filter(item => item.visible)
      .sort((a, b) => a.order - b.order)
      .map(item => ({
        ...item,
        children: item.children
          ?.filter(child => child.visible)
          .sort((a, b) => a.order - b.order)
      }));
  }, [customMenuItems]);

  const repairMenuTranslations = useCallback(() => {
    try {
      if (!navigationModules || !Array.isArray(navigationModules)) {
        console.warn('navigationModules is not available for repair');
        return;
      }

      const roleBasedModules = navigationModules.filter(module => 
        module && module.roles && Array.isArray(module.roles) && module.roles.includes(userRole)
      );

      // Create a map of default items for quick lookup
      const defaultItemsMap = new Map();
      roleBasedModules.forEach(module => {
        defaultItemsMap.set(module.id, {
          label: module.label,
          labelAr: module.labelAr
        });
        
        module.views?.forEach(view => {
          defaultItemsMap.set(`${module.id}_${view.id}`, {
            label: view.label,
            labelAr: view.labelAr
          });
        });
      });

      // Repair existing menu items by adding missing translations
      const repairedItems = customMenuItems.map(item => {
        const defaultLabels = defaultItemsMap.get(item.id);
        return {
          ...item,
          label: item.label || defaultLabels?.label || 'Unknown',
          labelAr: item.labelAr || defaultLabels?.labelAr || 'غير معروف',
          children: item.children?.map(child => {
            const defaultChildLabels = defaultItemsMap.get(child.id);
            return {
              ...child,
              label: child.label || defaultChildLabels?.label || 'Unknown',
              labelAr: child.labelAr || defaultChildLabels?.labelAr || 'غير معروف'
            };
          })
        };
      });

      setCustomMenuItems(repairedItems);
      console.log('Menu translations repaired successfully');
    } catch (error) {
      console.error('Error repairing menu translations:', error);
    }
  }, [customMenuItems, userRole]);

  const contextValue = useMemo(() => ({
    customMenuItems,
    currentTheme,
    availableThemes: defaultThemes,
    updateMenuItem,
    reorderMenuItems,
    hideMenuItem,
    showMenuItem,
    addCustomMenuItem,
    removeCustomMenuItem,
    resetToDefault,
    changeTheme,
    exportCustomization,
    importCustomization,
    getVisibleMenuItems,
    repairMenuTranslations
  }), [
    customMenuItems,
    currentTheme,
    updateMenuItem,
    reorderMenuItems,
    hideMenuItem,
    showMenuItem,
    addCustomMenuItem,
    removeCustomMenuItem,
    resetToDefault,
    changeTheme,
    exportCustomization,
    importCustomization,
    getVisibleMenuItems,
    repairMenuTranslations
  ]);

  return (
    <MenuCustomizationContext.Provider value={contextValue}>
      {children}
    </MenuCustomizationContext.Provider>
  );
};