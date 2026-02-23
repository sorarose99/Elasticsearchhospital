import React, { useState } from 'react';
import { Star, MoreHorizontal, Edit2, Trash2, ExternalLink, Clock, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '../ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useFavorites, FavoriteItem } from '../../services/FavoritesService';
import { useNavigation } from './NavigationContext';
import { useLanguage } from '../../services/LanguageService';

interface FavoritesPanelProps {
  language: 'en' | 'ar';
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FavoritesPanelComponent: React.FC<FavoritesPanelProps> = ({
  language,
  open,
  onOpenChange
}) => {
  const { 
    favorites, 
    recentlyAccessed, 
    mostUsed, 
    removeFromFavorites, 
    updateFavorite,
    recordAccess
  } = useFavorites();
  const { navigateTo } = useNavigation();
  const { t, isRTL } = useLanguage();
  
  const [editingFavorite, setEditingFavorite] = useState<FavoriteItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTitleAr, setEditTitleAr] = useState('');

  const handleFavoriteClick = (favorite: FavoriteItem) => {
    recordAccess(favorite.moduleId, favorite.viewId);
    navigateTo(favorite.moduleId, favorite.viewId);
    onOpenChange(false);
  };

  const handleEditFavorite = (favorite: FavoriteItem) => {
    setEditingFavorite(favorite);
    setEditTitle(favorite.customTitle || favorite.title);
    setEditTitleAr(favorite.customTitleAr || favorite.titleAr);
  };

  const handleSaveEdit = () => {
    if (editingFavorite) {
      updateFavorite(editingFavorite.id, {
        customTitle: editTitle,
        customTitleAr: editTitleAr
      });
      setEditingFavorite(null);
    }
  };

  const FavoriteCard = ({ favorite }: { favorite: FavoriteItem }) => (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div 
            className="flex-1 cursor-pointer"
            onClick={() => handleFavoriteClick(favorite)}
          >
            <div className={`flex items-center space-x-3 mb-2 ${isRTL ? 'space-x-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Star className="w-4 h-4 text-primary fill-current" />
              </div>
              <div className="flex-1">
                <h4 className={`text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                  {isRTL 
                    ? (favorite.customTitleAr || favorite.titleAr)
                    : (favorite.customTitle || favorite.title)
                  }
                </h4>
                <p className={`text-xs text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                  {favorite.url}
                </p>
              </div>
            </div>
            
            <div className={`flex items-center justify-between text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span>
                {language === 'ar' ? 'الوصول:' : 'Access:'} {favorite.accessCount}
              </span>
              <span>
                {new Date(favorite.lastAccessed).toLocaleDateString(
                  isRTL ? 'ar-SA' : 'en-US'
                )}
              </span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
              <DropdownMenuItem onClick={() => handleFavoriteClick(favorite)}>
                <ExternalLink className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {language === 'ar' ? 'فتح' : 'Open'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditFavorite(favorite)}>
                <Edit2 className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {language === 'ar' ? 'تعديل' : 'Edit'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => removeFromFavorites(favorite.id)}
                className="text-destructive"
              >
                <Trash2 className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {language === 'ar' ? 'حذف' : 'Delete'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={`max-w-4xl max-h-[80vh] overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader className={isRTL ? 'text-right' : 'text-left'}>
            <DialogTitle className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
              <Star className="w-5 h-5 text-yellow-500" />
              <span>{language === 'ar' ? 'المفضلة' : 'Favorites'}</span>
            </DialogTitle>
            <DialogDescription>
              {language === 'ar' 
                ? 'إدارة الصفحات المفضلة والصفحات الحديثة والأكثر استخداماً'
                : 'Manage your favorite pages, recent pages, and most used items'
              }
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="favorites" className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="favorites" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Star className="w-4 h-4" />
                {language === 'ar' ? 'المفضلة' : 'Favorites'}
                {favorites.length > 0 && (
                  <Badge variant="secondary" className={`${isRTL ? 'mr-2' : 'ml-2'}`}>
                    {favorites.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="recent" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Clock className="w-4 h-4" />
                {language === 'ar' ? 'الصفحات الحديثة' : 'Recent Pages'}
                {recentlyAccessed.length > 0 && (
                  <Badge variant="secondary" className={`${isRTL ? 'mr-2' : 'ml-2'}`}>
                    {recentlyAccessed.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="most-used" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <TrendingUp className="w-4 h-4" />
                {language === 'ar' ? 'الأكثر استخداماً' : 'Most Used'}
                {mostUsed.length > 0 && (
                  <Badge variant="secondary" className={`${isRTL ? 'mr-2' : 'ml-2'}`}>
                    {mostUsed.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="favorites" className="mt-4 space-y-4 max-h-96 overflow-y-auto">
              {favorites.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>{language === 'ar' ? 'لا توجد مفضلات بعد' : 'No favorites yet'}</p>
                  <p className="text-sm mt-1">
                    {language === 'ar' ? 'أضف صفحات إلى المفضلة للوصول السريع' : 'Add pages to favorites for quick access'}
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {favorites.map(favorite => (
                    <FavoriteCard key={favorite.id} favorite={favorite} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="recent" className="mt-4 space-y-4 max-h-96 overflow-y-auto">
              {recentlyAccessed.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>{language === 'ar' ? 'لا توجد صفحات حديثة' : 'No recent pages'}</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {recentlyAccessed.map(favorite => (
                    <FavoriteCard key={favorite.id} favorite={favorite} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="most-used" className="mt-4 space-y-4 max-h-96 overflow-y-auto">
              {mostUsed.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>{language === 'ar' ? 'لا توجد صفحات مستخدمة بكثرة بعد' : 'No frequently used pages yet'}</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {mostUsed.map(favorite => (
                    <FavoriteCard key={favorite.id} favorite={favorite} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Edit Favorite Dialog */}
      <Dialog open={!!editingFavorite} onOpenChange={() => setEditingFavorite(null)}>
        <DialogContent className={`${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader className={isRTL ? 'text-right' : 'text-left'}>
            <DialogTitle>
              {language === 'ar' ? 'تعديل المفضلة' : 'Edit Favorite'}
            </DialogTitle>
            <DialogDescription>
              {language === 'ar' 
                ? 'قم بتحرير اسم الصفحة المفضلة'
                : 'Edit the name of your favorite page'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">
                {language === 'ar' ? 'الاسم (English)' : 'Name (English)'}
              </Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder={editingFavorite?.title}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-title-ar">
                {language === 'ar' ? 'الاسم (العربية)' : 'Name (العربية)'}
              </Label>
              <Input
                id="edit-title-ar"
                value={editTitleAr}
                onChange={(e) => setEditTitleAr(e.target.value)}
                placeholder={editingFavorite?.titleAr}
              />
            </div>
            
            <div className={`flex justify-end space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
              <Button variant="outline" onClick={() => setEditingFavorite(null)}>
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button onClick={handleSaveEdit}>
                {language === 'ar' ? 'حفظ' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const FavoritesPanel = React.memo(FavoritesPanelComponent, (prevProps, nextProps) => {
  return (
    prevProps.language === nextProps.language &&
    prevProps.open === nextProps.open
  );
});