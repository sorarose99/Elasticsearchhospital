import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo, useRef } from 'react';

export interface NotificationData {
  id: string;
  type: 'appointment' | 'lab_result' | 'prescription' | 'emergency' | 'system' | 'patient_update';
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetRoles: string[];
  userId?: string;
  patientId?: string;
  appointmentId?: string;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
  actionData?: any;
}

interface WebSocketContextType {
  isConnected: boolean;
  notifications: NotificationData[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  sendNotification: (notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
  userId: string;
  userRole: string;
  isDemoMode?: boolean;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
  userId,
  userRole,
  isDemoMode = false
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const demoNotificationsLoadedRef = useRef(false);

  // Demo notification simulation - defined early to avoid hoisting issues
  const simulateDemoNotifications = useCallback(() => {
    // Prevent duplicate loading
    if (demoNotificationsLoadedRef.current) {
      return;
    }
    
    const demoNotifications: NotificationData[] = [
      {
        id: 'demo-1',
        type: 'appointment',
        title: 'New Appointment Booked',
        titleAr: 'تم حجز موعد جديد',
        message: 'Patient Ahmad Hassan booked an appointment for tomorrow at 10:00 AM',
        messageAr: 'المريض أحمد حسن حجز موعداً غداً في الساعة 10:00 صباحاً',
        priority: 'medium',
        targetRoles: ['doctor', 'receptionist', 'admin'],
        timestamp: Date.now() - 300000, // 5 minutes ago
        read: false,
        actionUrl: '/appointments/schedule'
      },
      {
        id: 'demo-2',
        type: 'lab_result',
        title: 'Lab Result Ready',
        titleAr: 'نتيجة المختبر جاهزة',
        message: 'CBC test result for Sara Mohamed is now available',
        messageAr: 'نتيجة فحص صورة الدم الكاملة للمريضة سارة محمد متاحة الآن',
        priority: 'high',
        targetRoles: ['doctor', 'lab_tech'],
        timestamp: Date.now() - 600000, // 10 minutes ago
        read: false,
        actionUrl: '/laboratory/results'
      },
      {
        id: 'demo-3',
        type: 'prescription',
        title: 'Prescription Ready',
        titleAr: 'الوصفة جاهزة',
        message: 'Prescription #12345 is ready for dispensing',
        messageAr: 'الوصفة رقم 12345 جاهزة للصرف',
        priority: 'medium',
        targetRoles: ['pharmacist'],
        timestamp: Date.now() - 900000, // 15 minutes ago
        read: true,
        actionUrl: '/pharmacy/prescriptions'
      }
    ];

    setNotifications(demoNotifications);
    demoNotificationsLoadedRef.current = true;
  }, []);

  // Load notifications from localStorage on mount
  useEffect(() => {
    let isMounted = true;
    
    const loadSavedNotifications = () => {
      const savedNotifications = localStorage.getItem(`notifications_${userId}`);
      if (savedNotifications && isMounted) {
        try {
          const parsed = JSON.parse(savedNotifications);
          setNotifications(parsed);
          initialLoadRef.current = true;
        } catch (error) {
          console.error('Failed to parse saved notifications:', error);
        }
      } else {
        initialLoadRef.current = true;
      }
    };
    
    loadSavedNotifications();
    
    return () => {
      isMounted = false;
    };
  }, [userId]);

  // Track if initial load is complete
  const initialLoadRef = useRef(false);
  
  // Save notifications to localStorage when they change (with debounce)
  useEffect(() => {
    // Don't save on initial load
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      return;
    }
    
    const timeoutId = setTimeout(() => {
      localStorage.setItem(`notifications_${userId}`, JSON.stringify(notifications));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [notifications, userId]);

  // WebSocket connection logic
  useEffect(() => {
    let reconnectTimeoutId: number;
    let isMounted = true;
    
    if (isDemoMode) {
      // In demo mode, simulate WebSocket connection and generate demo notifications
      setIsConnected(true);
      
      // Only load demo notifications if we don't have any existing ones
      const timer = setTimeout(() => {
        if (isMounted && !demoNotificationsLoadedRef.current) {
          // Check if we already have demo notifications from localStorage
          const hasDemoNotifications = notifications.some(n => n.id.startsWith('demo-'));
          if (!hasDemoNotifications) {
            simulateDemoNotifications();
          } else {
            demoNotificationsLoadedRef.current = true;
          }
        }
      }, 500); // Increased delay to prevent race conditions
      
      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    }

    // Real WebSocket connection - skip in demo mode
    const connectWebSocket = () => {
      // Don't connect WebSocket in demo mode
      if (isDemoMode) {
        console.log('WebSocket disabled in demo mode');
        return;
      }
      
      try {
        const wsUrl = `wss://your-websocket-server.com/ws?userId=${userId}&role=${userRole}`;
        const newSocket = new WebSocket(wsUrl);

        newSocket.onopen = () => {
          if (isMounted) {
            console.log('WebSocket connected');
            setIsConnected(true);
          }
        };

        newSocket.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const notification: NotificationData = JSON.parse(event.data);
            if (notification.targetRoles.includes(userRole) || notification.userId === userId) {
              addNotification(notification);
            }
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        newSocket.onclose = () => {
          if (isMounted) {
            console.log('WebSocket disconnected');
            setIsConnected(false);
            // Attempt to reconnect after 3 seconds
            reconnectTimeoutId = window.setTimeout(connectWebSocket, 3000);
          }
        };

        newSocket.onerror = (error) => {
          if (isMounted) {
            console.error('WebSocket error:', error);
            setIsConnected(false);
          }
        };

        setSocket(newSocket);
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
        // Retry connection after 5 seconds
        reconnectTimeoutId = window.setTimeout(connectWebSocket, 5000);
      }
    };

    connectWebSocket();

    return () => {
      isMounted = false;
      if (socket) {
        socket.close();
      }
      if (reconnectTimeoutId) {
        clearTimeout(reconnectTimeoutId);
      }
    };
  }, [userId, userRole, isDemoMode, simulateDemoNotifications]); // Removed notifications.length from dependencies

  const addNotification = useCallback((notification: NotificationData) => {
    setNotifications(prev => {
      // Prevent duplicate notifications
      if (prev.some(n => n.id === notification.id)) {
        return prev;
      }
      return [notification, ...prev].slice(0, 100); // Keep only last 100 notifications
    });
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const clearNotification = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const sendNotification = useCallback((notificationData: Omit<NotificationData, 'id' | 'timestamp' | 'read'>) => {
    const notification: NotificationData = {
      ...notificationData,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false
    };

    if (isDemoMode) {
      // In demo mode, just add to local notifications
      addNotification(notification);
    } else if (socket && isConnected) {
      // Send through WebSocket
      socket.send(JSON.stringify(notification));
    }
  }, [isDemoMode, socket, isConnected, addNotification]);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const contextValue = useMemo(() => ({
    isConnected,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    sendNotification
  }), [
    isConnected,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    sendNotification
  ]);

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Notification sound utility
export const playNotificationSound = (priority: NotificationData['priority']) => {
  if (typeof window !== 'undefined' && 'Audio' in window) {
    try {
      // Different sounds for different priorities
      const soundFiles = {
        low: '/sounds/notification-low.mp3',
        medium: '/sounds/notification-medium.mp3',
        high: '/sounds/notification-high.mp3',
        urgent: '/sounds/notification-urgent.mp3'
      };

      const audio = new Audio(soundFiles[priority] || soundFiles.medium);
      audio.volume = 0.3;
      audio.play().catch(error => {
        console.log('Could not play notification sound:', error);
      });
    } catch (error) {
      console.log('Audio not supported:', error);
    }
  }
};

// Browser notification utility
export const showBrowserNotification = (notification: NotificationData, language: 'en' | 'ar') => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const title = language === 'ar' ? notification.titleAr : notification.title;
    const message = language === 'ar' ? notification.messageAr : notification.message;

    new Notification(title, {
      body: message,
      icon: '/icons/notification-icon.png',
      badge: '/icons/notification-badge.png',
      tag: notification.id,
      requireInteraction: notification.priority === 'urgent',
      silent: notification.priority === 'low'
    });
  }
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission === 'default') {
    return await Notification.requestPermission();
  }
  return Notification.permission;
};