import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Bell, Search, Settings, HelpCircle, Menu, Star, Wifi, WifiOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { GlobalSearch } from './GlobalSearch';
import KeyboardShortcuts, { useKeyboardShortcuts } from './KeyboardShortcuts';
import { NavigationHistoryButtons } from './NavigationHistory';
import { FavoritesPanel } from './FavoritesPanel';
import { useWebSocket, playNotificationSound, showBrowserNotification } from '../../services/WebSocketService';
import { useFavorites } from '../../services/FavoritesService';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';
import ThemeLanguageToggle from '../settings/ThemeLanguageToggle';

interface TopBarProps {
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

const TopBarComponent: React.FC<TopBarProps> = ({
  user,
  language,
  onLanguageChange,
  onLogout,
  isDemoMode = false
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const { isShortcutsOpen, openShortcuts, closeShortcuts } = useKeyboardShortcuts();
  
  // Use the new services
  const { t, isRTL } = useLanguage();
  const { effectiveTheme } = useTheme();
  
  // Memoize service hooks to prevent re-creation
  const webSocketData = useWebSocket();
  const favoritesData = useFavorites();
  
  // Stable references to prevent infinite re-renders
  const notifications = useMemo(() => webSocketData.notifications, [webSocketData.notifications]);
  const unreadCount = useMemo(() => webSocketData.unreadCount, [webSocketData.unreadCount]);
  const isConnected = useMemo(() => webSocketData.isConnected, [webSocketData.isConnected]);
  const favorites = useMemo(() => favoritesData.favorites, [favoritesData.favorites]);
  
  // Stable callback references
  const markAsRead = useCallback((id: string) => webSocketData.markAsRead(id), [webSocketData.markAsRead]);
  const markAllAsRead = useCallback(() => webSocketData.markAllAsRead(), [webSocketData.markAllAsRead]);

  // Handle real-time notifications - using a ref to track processed notifications
  const processedNotificationsRef = useRef(new Set<string>());
  const lastNotificationCountRef = useRef(0);

  useEffect(() => {
    // Only process if we have new notifications
    if (notifications.length === 0 || notifications.length <= lastNotificationCountRef.current) {
      lastNotificationCountRef.current = notifications.length;
      return;
    }
    
    const unprocessedNotifications = notifications.filter(
      notification => !notification.read && 
      !processedNotificationsRef.current.has(notification.id)
    );

    unprocessedNotifications.forEach(notification => {
      playNotificationSound(notification.priority);
      showBrowserNotification(notification, language);
      processedNotificationsRef.current.add(notification.id);
    });

    // Clean up old processed IDs (keep only last 50)
    if (processedNotificationsRef.current.size > 100) {
      const idsArray = Array.from(processedNotificationsRef.current);
      processedNotificationsRef.current = new Set(idsArray.slice(-50));
    }

    lastNotificationCountRef.current = notifications.length;
  }, [notifications.length, language]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <div className={`bg-topbar border-b border-border px-6 py-3 contrast-enhanced ${isRTL ? 'rtl' : 'ltr'}`} data-slot="topbar" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Left side - Mobile menu, navigation, and search */}
          <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
            >
              <Menu className="w-4 h-4" />
            </Button>

            {/* Navigation History Buttons */}
            <NavigationHistoryButtons language={language} />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchOpen(true)}
              className={`flex items-center space-x-2 text-muted-foreground hover:text-foreground ${isRTL ? 'space-x-reverse' : ''}`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">
                {language === 'ar' ? 'البحث...' : 'Search...'}
              </span>
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 text-[10px] text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>

          {/* Right side - Actions and user menu */}
          <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
            {/* Connection status */}
            <div className="flex items-center">
              {isConnected ? (
                <Wifi className="w-4 h-4 text-green-500" title={language === 'ar' ? 'متصل' : 'Connected'} />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" title={language === 'ar' ? 'غير متصل' : 'Disconnected'} />
              )}
            </div>

            {/* Favorites */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFavoritesOpen(true)}
              className="relative text-muted-foreground hover:text-foreground"
            >
              <Star className="w-4 h-4" />
              {favorites.length > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-yellow-500 text-white">
                  {favorites.length}
                </Badge>
              )}
            </Button>

            {/* Theme and Language Toggle */}
            <ThemeLanguageToggle variant="compact" showLabels={false} />

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative text-muted-foreground hover:text-foreground">
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="w-80">
                <DropdownMenuLabel>
                  {language === 'ar' ? 'الإشعارات' : 'Notifications'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.slice(0, 5).map((notification) => (
                  <DropdownMenuItem 
                    key={notification.id} 
                    className="p-3 cursor-pointer"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex-1">
                      <div className={`flex items-center justify-between mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <p className="text-sm text-foreground">
                          {isRTL ? notification.titleAr : notification.title}
                        </p>
                        <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                          <Badge 
                            variant={notification.priority === 'urgent' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {notification.priority === 'urgent' ? t('lab.urgent') : notification.priority}
                          </Badge>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {isRTL ? notification.messageAr : notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.timestamp).toLocaleString(
                          isRTL ? 'ar-SA' : 'en-US'
                        )}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center py-2" onClick={markAllAsRead}>
                  <span className="text-sm text-blue-600 hover:text-blue-800">
                    {language === 'ar' ? 'تم قراءة الكل' : 'Mark all as read'}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Help */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground"
              onClick={openShortcuts}
            >
              <HelpCircle className="w-4 h-4" />
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`flex items-center space-x-2 px-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <Avatar className="w-7 h-7">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`hidden md:block ${isRTL ? 'text-right' : 'text-left'}`}>
                    <p className="text-sm text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{t(`roles.${user.role}`)}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="w-56">
                <DropdownMenuLabel>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <p className="text-sm text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">{t(`roles.${user.role}`)}</p>
                    {user.specialization && (
                      <p className="text-xs text-muted-foreground">{user.specialization}</p>
                    )}
                    {isDemoMode && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        {t('auth.demoMode')}
                      </Badge>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem>
                  <Settings className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('settings.profile')}
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={onLogout} className="text-red-600 dark:text-red-400">
                  {t('auth.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Global Search Modal */}
      <GlobalSearch
        language={language}
        userRole={user.role}
        open={searchOpen}
        onOpenChange={setSearchOpen}
      />

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcuts
        isOpen={isShortcutsOpen}
        onClose={closeShortcuts}
        onExecuteAction={(action) => {
          if (action === 'search') {
            setSearchOpen(true);
          }
        }}
      />

      {/* Favorites Panel */}
      <FavoritesPanel
        language={language}
        open={favoritesOpen}
        onOpenChange={setFavoritesOpen}
      />
    </>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const TopBar = React.memo(TopBarComponent, (prevProps, nextProps) => {
  return (
    prevProps.user.id === nextProps.user.id &&
    prevProps.language === nextProps.language &&
    prevProps.isDemoMode === nextProps.isDemoMode
  );
});