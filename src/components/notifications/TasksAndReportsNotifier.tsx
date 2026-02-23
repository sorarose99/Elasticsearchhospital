import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Bell, CheckCircle2, X, Play, Pause, User, MapPin, Timer
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { cn } from '../ui/utils';
import { toast } from 'sonner@2.0.3';

// Import types and utilities
import { TaskNotification } from './types';
import { 
  getPriorityColor, 
  getStatusColor, 
  formatTimeRemaining,
  getCategoryTranslation, 
  getPriorityTranslation, 
  getStatusTranslation
} from './utils';
import { getTypeIcon, getCategoryIcon } from './icons';
import { getSampleTaskNotifications } from './sampleData';

interface TasksAndReportsNotifierProps {
  className?: string;
}

export const TasksAndReportsNotifier: React.FC<TasksAndReportsNotifierProps> = ({ className }) => {
  const { language, isRTL } = useLanguage();
  
  const [notifications, setNotifications] = useState<TaskNotification[]>([]);
  const [filter, setFilter] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    assignedTo: 'all',
    search: ''
  });

  // Initialize with sample notifications
  useEffect(() => {
    setNotifications(getSampleTaskNotifications(language));
  }, [language]);

  // Auto-update overdue tasks
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications(prev => prev.map(notification => {
        const now = new Date();
        if (notification.dueDate < now && notification.status === 'pending') {
          return { ...notification, status: 'overdue' };
        }
        return notification;
      }));
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter.status !== 'all' && notification.status !== filter.status) return false;
    if (filter.priority !== 'all' && notification.priority !== filter.priority) return false;
    if (filter.category !== 'all' && notification.category !== filter.category) return false;
    if (filter.assignedTo !== 'all' && notification.assignedTo.id !== filter.assignedTo) return false;
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      return (
        notification.title.toLowerCase().includes(searchLower) ||
        notification.description.toLowerCase().includes(searchLower) ||
        notification.assignedTo.name.toLowerCase().includes(searchLower) ||
        notification.relatedPatient?.name.toLowerCase().includes(searchLower)
      );
    }
    return true;
  }).sort((a, b) => {
    // Sort by priority and due date
    const priorityOrder = { critical: 5, urgent: 4, high: 3, medium: 2, low: 1 };
    const statusOrder = { overdue: 4, pending: 3, in_progress: 2, completed: 1, cancelled: 0 };
    
    const statusDiff = statusOrder[b.status] - statusOrder[a.status];
    if (statusDiff !== 0) return statusDiff;
    
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    return a.dueDate.getTime() - b.dueDate.getTime();
  });

  // Handle status updates
  const updateStatus = (id: string, status: TaskNotification['status']) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id 
        ? { 
            ...notification, 
            status,
            progress: status === 'completed' ? 100 : 
                     status === 'in_progress' ? Math.max(notification.progress || 0, 10) :
                     notification.progress || 0
          }
        : notification
    ));
  };

  const pendingCount = notifications.filter(n => n.status === 'pending').length;
  const overdueCount = notifications.filter(n => n.status === 'overdue').length;
  const inProgressCount = notifications.filter(n => n.status === 'in_progress').length;

  return (
    <div className={cn("space-y-6", className, isRTL ? "rtl" : "ltr")} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header with Statistics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {language === 'ar' ? 'تنبيهات المهام والتقارير' : 'Tasks & Reports Notifier'}
              </CardTitle>
              <CardDescription>
                {language === 'ar' ? 'إدارة المهام والتنبيهات والتقارير المعلقة' : 'Manage tasks, notifications, and pending reports'}
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
                  <div className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'معلق' : 'Pending'}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
                  <div className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'متأخر' : 'Overdue'}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{inProgressCount}</div>
                  <div className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'جاري' : 'In Progress'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: language === 'ar' ? 'الكل' : 'All', count: notifications.length },
              { id: 'overdue', label: language === 'ar' ? 'متأخر' : 'Overdue', count: overdueCount },
              { id: 'pending', label: language === 'ar' ? 'معلق' : 'Pending', count: pendingCount },
              { id: 'in_progress', label: language === 'ar' ? 'جاري' : 'In Progress', count: inProgressCount },
              { id: 'critical', label: language === 'ar' ? 'حرج' : 'Critical', count: notifications.filter(n => n.priority === 'critical').length },
              { id: 'urgent', label: language === 'ar' ? 'مستعجل' : 'Urgent', count: notifications.filter(n => n.priority === 'urgent').length }
            ].map(filterOption => (
              <Button
                key={filterOption.id}
                variant={filter.status === filterOption.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(prev => ({ ...prev, status: filterOption.id === 'all' ? 'all' : filterOption.id }))}
                className="flex items-center gap-2"
              >
                <span>{filterOption.label}</span>
                <Badge variant="secondary" className="text-xs">
                  {filterOption.count}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="font-medium mb-2">
                    {language === 'ar' ? 'لا توجد مهام' : 'No Tasks'}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {language === 'ar' ? 'ستظهر المهام والتنبيهات الجديدة هنا' : 'New tasks and notifications will appear here'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: isRTL ? 100 : -100 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={cn(
                  "hover:shadow-lg transition-all duration-300",
                  notification.status === 'overdue' ? 'border-red-200 bg-red-50/30 dark:bg-red-950/10' : '',
                  notification.priority === 'critical' ? 'border-red-300 shadow-md' : '',
                  notification.priority === 'urgent' ? 'border-orange-300' : ''
                )}>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={cn("p-2 rounded-lg flex-shrink-0", getPriorityColor(notification.priority))}>
                            {getTypeIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-lg truncate">{notification.title}</h4>
                              
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <Badge className={getPriorityColor(notification.priority)}>
                                  {getPriorityTranslation(notification.priority, language)}
                                </Badge>
                                
                                <Badge className={getStatusColor(notification.status)}>
                                  {getStatusTranslation(notification.status, language)}
                                </Badge>
                                
                                <Badge variant="outline" className="flex items-center gap-1">
                                  {getCategoryIcon(notification.category)}
                                  <span className="text-xs">
                                    {getCategoryTranslation(notification.category, language)}
                                  </span>
                                </Badge>
                              </div>
                            </div>
                            
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                              {notification.description}
                            </p>
                            
                            {/* Assignee and Patient Info */}
                            <div className="flex items-center gap-4 mb-3">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={notification.assignedTo.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {notification.assignedTo.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="text-sm font-medium">{notification.assignedTo.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {notification.assignedTo.role} • {notification.assignedTo.department}
                                  </div>
                                </div>
                              </div>
                              
                              {notification.relatedPatient && (
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <div className="text-sm font-medium">{notification.relatedPatient.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {language === 'ar' ? 'العمر:' : 'Age:'} {notification.relatedPatient.age}
                                      {notification.relatedPatient.condition && ` • ${notification.relatedPatient.condition}`}
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {notification.location && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  <span>{notification.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Time and Actions */}
                        <div className="text-right flex-shrink-0">
                          <div className={cn(
                            "text-sm font-medium mb-1",
                            notification.status === 'overdue' ? 'text-red-600' : 'text-muted-foreground'
                          )}>
                            {formatTimeRemaining(notification.dueDate, language)}
                          </div>
                          
                          <div className="text-xs text-muted-foreground mb-2">
                            {language === 'ar' ? 'يستحق:' : 'Due:'} {
                              notification.dueDate.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            }
                          </div>
                          
                          {notification.estimatedDuration && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Timer className="h-3 w-3" />
                              <span>
                                {notification.estimatedDuration > 60 ? 
                                  `${Math.floor(notification.estimatedDuration / 60)}${language === 'ar' ? 'س' : 'h'} ${notification.estimatedDuration % 60}${language === 'ar' ? 'د' : 'm'}` :
                                  `${notification.estimatedDuration}${language === 'ar' ? 'د' : 'm'}`
                                }
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      {notification.progress !== undefined && notification.status !== 'completed' && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{language === 'ar' ? 'التقدم' : 'Progress'}</span>
                            <span>{notification.progress}%</span>
                          </div>
                          <Progress value={notification.progress} className="h-2" />
                        </div>
                      )}
                      
                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-2">
                          {notification.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => updateStatus(notification.id, 'in_progress')}
                            >
                              <Play className="h-4 w-4 mr-1" />
                              {language === 'ar' ? 'بدء' : 'Start'}
                            </Button>
                          )}
                          
                          {notification.status === 'in_progress' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateStatus(notification.id, 'completed')}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                {language === 'ar' ? 'إكمال' : 'Complete'}
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateStatus(notification.id, 'pending')}
                              >
                                <Pause className="h-4 w-4 mr-1" />
                                {language === 'ar' ? 'إيقاف' : 'Pause'}
                              </Button>
                            </>
                          )}
                          
                          {(notification.status === 'pending' || notification.status === 'in_progress') && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus(notification.id, 'cancelled')}
                            >
                              <X className="h-4 w-4 mr-1" />
                              {language === 'ar' ? 'إلغاء' : 'Cancel'}
                            </Button>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          {notification.assignedBy && (
                            <span>
                              {language === 'ar' ? 'بواسطة:' : 'By:'} {notification.assignedBy.name}
                            </span>
                          )}
                          <span>•</span>
                          <span>
                            {notification.createdAt.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TasksAndReportsNotifier;