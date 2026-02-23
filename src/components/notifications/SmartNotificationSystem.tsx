import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Bell, X, ChevronDown, Filter, Star, Pin, Settings, Volume2, VolumeX 
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { cn } from '../ui/utils';
import { toast } from 'sonner@2.0.3';

// Import types and utilities
import { NotificationItem, NotificationSettings } from './types';
import { DEFAULT_NOTIFICATION_SETTINGS, PRIORITY_ORDER, STATUS_ORDER } from './constants';
import { 
  getPriorityColor, 
  getStatusColor, 
  formatTime, 
  getCategoryTranslation, 
  getPriorityTranslation, 
  getStatusTranslation,
  shouldPlaySound 
} from './utils';
import { getTypeIcon, getCategoryIcon, getPriorityIcon } from './icons';
import { getSampleNotifications } from './sampleData';

interface SmartNotificationSystemProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const SmartNotificationSystem: React.FC<SmartNotificationSystemProps> = ({
  isOpen,
  onClose,
  className
}) => {
  const { language, isRTL } = useLanguage();
  
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'starred' | 'settings'>('unread');
  const [filter, setFilter] = useState({
    priority: 'all',
    category: 'all',
    status: 'all',
    search: ''
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Initialize notifications
  useEffect(() => {
    setNotifications(getSampleNotifications(language));
  }, [language]);

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread' && notification.status !== 'unread') return false;
    if (activeTab === 'starred' && !notification.isStarred) return false;
    if (filter.priority !== 'all' && notification.priority !== filter.priority) return false;
    if (filter.category !== 'all' && notification.category !== filter.category) return false;
    if (filter.status !== 'all' && notification.status !== filter.status) return false;
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      return (
        notification.title.toLowerCase().includes(searchLower) ||
        notification.message.toLowerCase().includes(searchLower) ||
        notification.metadata?.patientName?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  }).sort((a, b) => {
    // Sort by priority and timestamp
    const priorityDiff = PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  // Notification actions
  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, status: 'read', readAt: new Date() } : n
    ));
  };

  const toggleStar = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isStarred: !n.isStarred } : n
    ));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, status: 'dismissed' } : n
    ));
  };

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  return (
    <>
      <audio ref={audioRef} preload="none" />
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -400 : 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRTL ? -400 : 400 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "fixed top-0 h-full bg-background border-l shadow-2xl z-50 flex flex-col",
              isRTL ? "left-0 border-r border-l-0" : "right-0",
              isCollapsed ? "w-16" : "w-96",
              className
            )}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {/* Header */}
            <div className="p-4 border-b bg-card">
              <div className="flex items-center justify-between">
                {!isCollapsed && (
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Bell className="h-6 w-6 text-primary" />
                      {unreadCount > 0 && (
                        <Badge 
                          className="absolute -top-2 -right-2 h-5 w-5 text-xs flex items-center justify-center p-0"
                          variant="destructive"
                        >
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                      )}
                    </div>
                    <div>
                      <h2 className="font-semibold">
                        {language === 'ar' ? 'الإشعارات الذكية' : 'Smart Notifications'}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {language === 'ar' ? `${unreadCount} غير مقروء` : `${unreadCount} unread`}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                  >
                    <ChevronDown 
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isCollapsed ? "rotate-180" : "",
                        isRTL && "rotate-180"
                      )} 
                    />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {!isCollapsed && (
                <>
                  {/* Tabs */}
                  <div className="flex gap-1 p-1 bg-muted rounded-lg mt-4">
                    {[
                      { id: 'unread', label: language === 'ar' ? 'غير مقروء' : 'Unread', count: unreadCount },
                      { id: 'starred', label: language === 'ar' ? 'مميز' : 'Starred', count: notifications.filter(n => n.isStarred).length },
                      { id: 'all', label: language === 'ar' ? 'الكل' : 'All', count: notifications.length },
                      { id: 'settings', label: language === 'ar' ? 'إعدادات' : 'Settings', count: 0 }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all",
                          activeTab === tab.id ? "bg-background shadow-sm" : "hover:bg-background/50"
                        )}
                      >
                        <span>{tab.label}</span>
                        {tab.count > 0 && tab.id !== 'settings' && (
                          <Badge className="text-xs h-4 px-1">{tab.count}</Badge>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Filters */}
                  {activeTab !== 'settings' && (
                    <div className="mt-3 space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
                          value={filter.search}
                          onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                          className="text-xs h-8"
                        />
                        <Button variant="outline" size="sm">
                          <Filter className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {isCollapsed ? (
                <div className="p-2 space-y-2">
                  {filteredNotifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center relative",
                        getPriorityColor(notification.priority)
                      )}
                      title={notification.title}
                    >
                      {getTypeIcon(notification.type)}
                      {notification.status === 'unread' && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-3">
                    <AnimatePresence>
                      {filteredNotifications.length === 0 ? (
                        <div className="text-center py-12">
                          <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                          <h3 className="font-medium mb-1">
                            {language === 'ar' ? 'لا توجد إشعارات' : 'No Notifications'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {language === 'ar' ? 'ستظهر الإشعارات الجديدة هنا' : 'New notifications will appear here'}
                          </p>
                        </div>
                      ) : (
                        filteredNotifications.map((notification, index) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: isRTL ? 100 : -100 }}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                              "p-3 border rounded-lg space-y-3 hover:shadow-md transition-all cursor-pointer relative",
                              notification.status === 'unread' ? 'border-primary/20 bg-primary/5' : '',
                              notification.isPinned ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/10' : ''
                            )}
                            onClick={() => {
                              if (notification.status === 'unread') {
                                markAsRead(notification.id);
                              }
                            }}
                          >
                            {/* Notification Content */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <div className={cn("p-2 rounded-lg flex-shrink-0", getPriorityColor(notification.priority))}>
                                  {getTypeIcon(notification.type)}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium text-sm truncate">{notification.title}</h4>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                      {notification.isPinned && <Pin className="h-3 w-3 text-yellow-600" />}
                                      {notification.isStarred && <Star className="h-3 w-3 text-yellow-600 fill-current" />}
                                    </div>
                                  </div>
                                  
                                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Badge className={cn("text-xs", getPriorityColor(notification.priority))}>
                                        {getPriorityIcon(notification.priority)}
                                        <span className="ml-1">
                                          {getPriorityTranslation(notification.priority, language)}
                                        </span>
                                      </Badge>
                                    </div>
                                    
                                    <span className="text-xs text-muted-foreground">
                                      {formatTime(notification.timestamp, language)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Actions */}
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleStar(notification.id);
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <Star className={cn(
                                    "h-3 w-3",
                                    notification.isStarred ? "text-yellow-600 fill-current" : "text-muted-foreground"
                                  )} />
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dismissNotification(notification.id);
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            
                            {/* Status indicator */}
                            {notification.status === 'unread' && (
                              <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                            )}
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SmartNotificationSystem;