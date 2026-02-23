import React, { useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Search, Star, Clock, Settings, Plus, Grid3X3, List, Heart,
  TrendingUp, Filter, MoreHorizontal, Keyboard, Zap, Target,
  ChevronRight, Command, ArrowUpRight, BookOpen, Sparkles
} from 'lucide-react';
import { useNavigation } from './NavigationContext';
import { useQuickActions } from '../../services/QuickActionsService';
import { useLanguage } from '../../services/LanguageService';

interface QuickActionsProps {
  language: 'en' | 'ar';
  userRole: string;
  variant?: 'compact' | 'full' | 'panel';
  maxVisible?: number;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ 
  language, 
  userRole, 
  variant = 'compact',
  maxVisible = 6 
}) => {
  const { navigation } = useNavigation();
  const { isRTL, t } = useLanguage();
  const {
    quickActions,
    categories,
    favoriteActions,
    recentActions,
    executeAction,
    addToFavorites,
    removeFromFavorites,
    searchActions,
    getActionsByCategory,
    getActionUsageStats
  } = useQuickActions();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredActions, setFilteredActions] = useState(quickActions);

  // Filter actions based on search and category
  useEffect(() => {
    let actions = quickActions;

    if (searchQuery) {
      actions = searchActions(searchQuery);
    }

    if (selectedCategory !== 'all') {
      actions = getActionsByCategory(selectedCategory);
    }

    setFilteredActions(actions);
  }, [quickActions, searchQuery, selectedCategory, searchActions, getActionsByCategory]);

  const handleQuickAction = useCallback(async (actionId: string) => {
    try {
      await executeAction(actionId);
      setIsOpen(false);
    } catch (error) {
      console.error('Error executing quick action:', error);
    }
  }, [executeAction]);

  const handleToggleFavorite = useCallback((actionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favoriteActions.includes(actionId)) {
      removeFromFavorites(actionId);
    } else {
      addToFavorites(actionId);
    }
  }, [favoriteActions, addToFavorites, removeFromFavorites]);

  const getVisibleActions = () => {
    if (variant === 'compact') {
      return favoriteActions.length > 0 
        ? quickActions.filter(action => favoriteActions.includes(action.id)).slice(0, maxVisible)
        : quickActions.slice(0, maxVisible);
    }
    return filteredActions;
  };

  const getMostUsedActions = () => {
    const usage = getActionUsageStats();
    return quickActions
      .filter(action => usage[action.id] > 0)
      .sort((a, b) => (usage[b.id] || 0) - (usage[a.id] || 0))
      .slice(0, 5);
  };

  const getRecentActionsData = () => {
    return recentActions
      .map(id => quickActions.find(action => action.id === id))
      .filter(Boolean)
      .slice(0, 5);
  };

  const renderActionButton = (action: any, index: number = 0) => {
    // Safely handle icon - it might be a component or component reference
    const ActionIcon = typeof action.icon === 'function' ? action.icon : Settings;
    const isFavorite = favoriteActions.includes(action.id);

    return (
      <motion.div
        key={action.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative group"
      >
        {/* Favorite star overlay - moved outside of button */}
        <motion.div
          className="absolute -top-1 -right-1 z-20 p-1 rounded-full bg-background border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={(e) => handleToggleFavorite(action.id, e)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Star className={`h-3 w-3 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
        </motion.div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size={variant === 'compact' ? 'sm' : 'default'}
                onClick={() => handleQuickAction(action.id)}
                className={`
                  w-full transition-all duration-200 hover:shadow-md
                  ${variant === 'compact' 
                    ? 'flex items-center space-x-2 rtl:space-x-reverse' 
                    : viewMode === 'grid' 
                      ? 'h-20 flex-col gap-2' 
                      : 'justify-start'
                  }
                `}
              >
                <ActionIcon className={`${variant === 'compact' ? 'w-4 h-4' : 'w-6 h-6'}`} />
                
                <span className={`
                  ${variant === 'compact' 
                    ? 'hidden sm:inline' 
                    : viewMode === 'grid' 
                      ? 'text-xs text-center' 
                      : 'ml-2'
                  }
                `}>
                  {language === 'ar' ? action.labelAr : action.label}
                </span>

                {/* Keyboard shortcut indicator */}
                {action.shortcut && variant !== 'compact' && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {action.shortcut}
                  </Badge>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <div className="text-center">
                <p className="font-medium">{language === 'ar' ? action.labelAr : action.label}</p>
                {action.shortcut && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
                    <Keyboard className="w-3 h-3" />
                    {action.shortcut}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {categories.find(cat => cat.id === action.category)?.[language === 'ar' ? 'labelAr' : 'label']}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.div>
    );
  };

  const renderCategoryButton = (category: any) => {
    const CategoryIcon = typeof category.icon === 'function' ? category.icon : Settings;
    
    return (
      <Button
        key={category.id}
        variant={selectedCategory === category.id ? 'default' : 'ghost'}
        size="sm"
        className="w-full justify-start"
        onClick={() => setSelectedCategory(category.id)}
      >
        <CategoryIcon className="w-4 h-4 mr-2" />
        {language === 'ar' ? category.labelAr : category.label}
      </Button>
    );
  };

  const renderCompactView = () => {
    const visibleActions = getVisibleActions();
    
    if (visibleActions.length === 0) return null;

    return (
      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="flex items-center gap-2">
          {visibleActions.map((action, index) => renderActionButton(action, index))}
        </div>

        {quickActions.length > maxVisible && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <MoreHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">
                  +{quickActions.length - maxVisible}
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  {t('quickActions.title')}
                </DialogTitle>
                <DialogDescription>
                  {t('quickActions.description')}
                </DialogDescription>
              </DialogHeader>
              {renderFullPanel()}
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  };

  const renderFullPanel = () => {
    const mostUsed = getMostUsedActions();
    const recent = getRecentActionsData();

    return (
      <div className="space-y-4">
        {/* Search and filters */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('quickActions.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                {t('quickActions.category')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="space-y-2">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory('all')}
                >
                  {t('quickActions.allCategories')}
                </Button>
                {categories.map(category => renderCategoryButton(category))}
              </div>
            </PopoverContent>
          </Popover>

          <div className="flex border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="px-2"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="px-2"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">{t('quickActions.all')}</span>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">{t('quickActions.favorites')}</span>
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">{t('quickActions.recent')}</span>
            </TabsTrigger>
            <TabsTrigger value="popular" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">{t('quickActions.popular')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <ScrollArea className="h-96">
              <div className={`
                ${viewMode === 'grid' 
                  ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3' 
                  : 'space-y-2'
                }
              `}>
                <AnimatePresence>
                  {filteredActions.map((action, index) => renderActionButton(action, index))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="favorites" className="mt-4">
            <ScrollArea className="h-96">
              {favoriteActions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{t('quickActions.noFavorites')}</p>
                </div>
              ) : (
                <div className={`
                  ${viewMode === 'grid' 
                    ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3' 
                    : 'space-y-2'
                  }
                `}>
                  {quickActions
                    .filter(action => favoriteActions.includes(action.id))
                    .map((action, index) => renderActionButton(action, index))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="recent" className="mt-4">
            <ScrollArea className="h-96">
              {recent.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{t('quickActions.noRecent')}</p>
                </div>
              ) : (
                <div className={`
                  ${viewMode === 'grid' 
                    ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3' 
                    : 'space-y-2'
                  }
                `}>
                  {recent.map((action, index) => renderActionButton(action, index))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="popular" className="mt-4">
            <ScrollArea className="h-96">
              {mostUsed.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{t('quickActions.noPopular')}</p>
                </div>
              ) : (
                <div className={`
                  ${viewMode === 'grid' 
                    ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3' 
                    : 'space-y-2'
                  }
                `}>
                  {mostUsed.map((action, index) => renderActionButton(action, index))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Quick tips */}
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">{t('quickActions.tip')}</p>
              <p className="text-muted-foreground">
                {t('quickActions.tipDescription')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (variant === 'compact') {
    return renderCompactView();
  }

  if (variant === 'panel') {
    return (
      <div className="w-full max-w-sm">
        {renderFullPanel()}
      </div>
    );
  }

  return renderFullPanel();
};