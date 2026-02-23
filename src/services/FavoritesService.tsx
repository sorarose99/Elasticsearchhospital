import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo, useRef } from 'react';
import { navigationModules } from '../components/navigation/NavigationConfig';

export interface FavoriteItem {
  id: string;
  moduleId: string;
  viewId: string;
  title: string;
  titleAr: string;
  icon: string;
  url: string;
  addedAt: number;
  accessCount: number;
  lastAccessed: number;
  color?: string;
  customTitle?: string;
  customTitleAr?: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  recentlyAccessed: FavoriteItem[];
  mostUsed: FavoriteItem[];
  addToFavorites: (moduleId: string, viewId: string, customTitle?: string, customTitleAr?: string) => void;
  removeFromFavorites: (favoriteId: string) => void;
  updateFavorite: (favoriteId: string, updates: Partial<FavoriteItem>) => void;
  isFavorite: (moduleId: string, viewId: string) => boolean;
  recordAccess: (moduleId: string, viewId: string) => void;
  reorderFavorites: (newOrder: string[]) => void;
  clearFavorites: () => void;
  exportFavorites: () => string;
  importFavorites: (data: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
  userId: string;
  userRole: string;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
  userId,
  userRole
}) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    let isMounted = true;
    
    const loadSavedFavorites = () => {
      const savedFavorites = localStorage.getItem(`favorites_${userId}`);
      if (savedFavorites && isMounted) {
        try {
          const parsed = JSON.parse(savedFavorites);
          setFavorites(parsed);
          initialLoadRef.current = true;
        } catch (error) {
          console.error('Failed to parse saved favorites:', error);
        }
      } else {
        initialLoadRef.current = true;
      }
    };
    
    loadSavedFavorites();
    
    return () => {
      isMounted = false;
    };
  }, [userId]);

  // Track if initial load is complete
  const initialLoadRef = useRef(false);
  
  // Save favorites to localStorage when they change (with debounce)
  useEffect(() => {
    // Don't save on initial load
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      return;
    }
    
    const timeoutId = setTimeout(() => {
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [favorites, userId]);

  const addToFavorites = useCallback((moduleId: string, viewId: string, customTitle?: string, customTitleAr?: string) => {
    const module = navigationModules.find(m => m.id === moduleId);
    const view = module?.views.find(v => v.id === viewId);
    
    if (!module || !view) return;

    const favoriteItem: FavoriteItem = {
      id: `${moduleId}_${viewId}_${Date.now()}`,
      moduleId,
      viewId,
      title: view.label,
      titleAr: view.labelAr,
      icon: view.icon?.name || module.icon.name,
      url: `${moduleId}/${viewId}`,
      addedAt: Date.now(),
      accessCount: 0,
      lastAccessed: Date.now(),
      customTitle,
      customTitleAr
    };

    setFavorites(prev => [favoriteItem, ...prev]);
  }, []);

  const removeFromFavorites = useCallback((favoriteId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
  }, []);

  const updateFavorite = useCallback((favoriteId: string, updates: Partial<FavoriteItem>) => {
    setFavorites(prev =>
      prev.map(fav =>
        fav.id === favoriteId ? { ...fav, ...updates } : fav
      )
    );
  }, []);

  const isFavorite = useCallback((moduleId: string, viewId: string) => {
    return favorites.some(fav => fav.moduleId === moduleId && fav.viewId === viewId);
  }, [favorites]);

  const recordAccess = useCallback((moduleId: string, viewId: string) => {
    setFavorites(prev =>
      prev.map(fav =>
        fav.moduleId === moduleId && fav.viewId === viewId
          ? {
              ...fav,
              accessCount: fav.accessCount + 1,
              lastAccessed: Date.now()
            }
          : fav
      )
    );
  }, []);

  const reorderFavorites = useCallback((newOrder: string[]) => {
    const reordered = newOrder
      .map(id => favorites.find(fav => fav.id === id))
      .filter(Boolean) as FavoriteItem[];
    
    setFavorites(reordered);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  const exportFavorites = useCallback(() => {
    return JSON.stringify({
      favorites,
      exportedAt: Date.now(),
      version: '1.0'
    });
  }, [favorites]);

  const importFavorites = useCallback((data: string) => {
    try {
      const imported = JSON.parse(data);
      if (imported.favorites && Array.isArray(imported.favorites)) {
        setFavorites(imported.favorites);
        return true;
      }
    } catch (error) {
      console.error('Failed to import favorites:', error);
    }
    return false;
  }, []);

  // Compute derived data
  const recentlyAccessed = useMemo(() => {
    return favorites
      .filter(fav => fav.lastAccessed > Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
      .sort((a, b) => b.lastAccessed - a.lastAccessed)
      .slice(0, 10);
  }, [favorites]);

  const mostUsed = useMemo(() => {
    return favorites
      .filter(fav => fav.accessCount > 0)
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, 10);
  }, [favorites]);

  const contextValue = useMemo(() => ({
    favorites,
    recentlyAccessed,
    mostUsed,
    addToFavorites,
    removeFromFavorites,
    updateFavorite,
    isFavorite,
    recordAccess,
    reorderFavorites,
    clearFavorites,
    exportFavorites,
    importFavorites
  }), [
    favorites,
    recentlyAccessed,
    mostUsed,
    addToFavorites,
    removeFromFavorites,
    updateFavorite,
    isFavorite,
    recordAccess,
    reorderFavorites,
    clearFavorites,
    exportFavorites,
    importFavorites
  ]);

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};