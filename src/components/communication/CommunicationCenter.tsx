import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Switch } from '../ui/switch';
import { 
  MessageSquare, Send, Phone, Video, Bell, Users, Calendar, Paperclip, 
  Search, Filter, Mic, MicOff, PhoneCall, PhoneOff, Star, Clock, 
  CheckCircle, Circle, AlertCircle, MoreVertical, Plus, X, Settings,
  VolumeX, Volume2, Minimize2, Maximize2, UserPlus, LogOut, Edit3,
  Download, Share2, Copy, Forward, Reply, Trash2, Pin, PinOff,
  Mute, Unmute, PhoneIncoming, PhoneOutgoing, PhoneMissed, VideoOff,
  Camera, CameraOff, ScreenShare, ScreenShareOff, Home, Building,
  Stethoscope, Activity, ShieldCheck, FileText, Archive, Eye, EyeOff
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { communicationTranslations } from './translations';

// Enhanced Interfaces
interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'audio' | 'video' | 'other';
  size: number;
  url: string;
  thumbnailUrl?: string;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  senderAvatar?: string;
  receiverId?: string;
  receiverName?: string;
  groupId?: string;
  content: string;
  type: 'text' | 'file' | 'image' | 'voice' | 'system';
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  isEncrypted: boolean;
  attachments?: Attachment[];
  replyTo?: Message;
  isEdited?: boolean;
  editedAt?: string;
  reactions?: Array<{
    emoji: string;
    users: string[];
    count: number;
  }>;
}

interface Participant {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away' | 'busy' | 'dnd';
  lastSeen?: string;
  isTyping?: boolean;
  permissions: {
    canCall: boolean;
    canVideo: boolean;
    canShare: boolean;
    canInvite: boolean;
  };
}

interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'channel' | 'emergency';
  name: string;
  description?: string;
  avatar?: string;
  participants: Participant[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isArchived: boolean;
  isEncrypted: boolean;
  createdAt: string;
  updatedAt: string;
  settings: {
    canAddMembers: boolean;
    canLeave: boolean;
    disappearingMessages: boolean;
    retentionDays: number;
  };
}

interface CallParticipant {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: 'connected' | 'connecting' | 'disconnected' | 'on-hold';
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  isScreenSharing: boolean;
  joinedAt: string;
}

interface Call {
  id: string;
  type: 'audio' | 'video' | 'conference' | 'emergency';
  status: 'incoming' | 'outgoing' | 'active' | 'ended' | 'missed' | 'rejected';
  participants: CallParticipant[];
  initiatorId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  isRecorded: boolean;
  recordingUrl?: string;
  notes?: string;
  tags: string[];
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

interface Notification {
  id: string;
  type: 'message' | 'call' | 'appointment' | 'emergency' | 'system' | 'reminder' | 'warning';
  title: string;
  content: string;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  timestamp: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  isRead: boolean;
  isSilent: boolean;
  actionUrl?: string;
  actionLabel?: string;
  category: string;
  expiresAt?: string;
  metadata?: Record<string, any>;
}

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4 }
  }
};

const messageVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2 }
  }
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const bounceVariants = {
  bounce: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const glowVariants = {
  glow: {
    boxShadow: [
      '0 0 5px rgba(59, 130, 246, 0.3)',
      '0 0 20px rgba(59, 130, 246, 0.5)',
      '0 0 5px rgba(59, 130, 246, 0.3)'
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const slideInFromRight = {
  hidden: { opacity: 0, x: 300 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const slideInFromLeft = {
  hidden: { opacity: 0, x: -300 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

export default function CommunicationCenter() {
  const { language, isRTL } = useLanguage();
  const t = (key: keyof typeof communicationTranslations) => 
    communicationTranslations[key]?.[language] || communicationTranslations[key]?.ar || key;

  // State Management
  const [activeScreen, setActiveScreen] = useState<'messages' | 'calls' | 'notifications'>('messages');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeCalls, setActiveCalls] = useState<Call[]>([]);
  
  // UI State
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [selectedCall, setSelectedCall] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showParticipantDetails, setShowParticipantDetails] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  // Filters and Views
  const [messagesFilter, setMessagesFilter] = useState<'all' | 'unread' | 'pinned' | 'archived'>('all');
  const [callsFilter, setCallsFilter] = useState<'all' | 'missed' | 'recent' | 'favorites'>('all');
  const [notificationsFilter, setNotificationsFilter] = useState<'all' | 'unread' | 'urgent' | 'today'>('all');

  // References
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const recordingTimer = useRef<NodeJS.Timeout | null>(null);
  const typingTimer = useRef<NodeJS.Timeout | null>(null);

  // Clean up draft when message is sent
  const cleanupDraft = useCallback((conversationId: string) => {
    try {
      const draftKey = `draft_${conversationId}`;
      localStorage.removeItem(draftKey);
    } catch (error) {
      console.warn('Failed to cleanup draft:', error);
    }
  }, []);

  // Message handling
  const sendMessage = useCallback(() => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'current-user',
      senderName: 'أنت',
      senderRole: 'nurse',
      content: newMessage,
      type: 'text',
      timestamp: new Date().toISOString(),
      status: 'sending',
      priority: 'normal',
      isEncrypted: true
    };

    setMessages(prev => [...prev, message]);
    const messageToSend = newMessage;
    setNewMessage('');
    
    // Clean up draft
    cleanupDraft(selectedConversation);
    
    // Simulate message delivery with realistic timing
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id ? { ...msg, status: 'sent' } : msg
        )
      );
    }, 500);
    
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id ? { ...msg, status: 'delivered' } : msg
        )
      );
    }, 1500);
    
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id ? { ...msg, status: 'read' } : msg
        )
      );
    }, 3000);

    // Update conversation last message and unread count
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation 
          ? { ...conv, lastMessage: message, updatedAt: new Date().toISOString() }
          : conv
      )
    );

    // Add haptic feedback if supported
    try {
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    } catch (error) {
      // Silently ignore vibration errors
    }
  }, [newMessage, selectedConversation, cleanupDraft]);

  // Load data on component mount
  useEffect(() => {
    loadCommunicationData();
    const cleanup = setupRealtimeListeners();
    
    // Keyboard shortcuts
    const handleKeyboard = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K for global search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        messageInputRef.current?.focus();
      }
      
      // Ctrl/Cmd + 1,2,3 for tab switching
      if ((e.ctrlKey || e.metaKey) && ['1', '2', '3'].includes(e.key)) {
        e.preventDefault();
        const tabs = ['messages', 'calls', 'notifications'];
        setActiveScreen(tabs[parseInt(e.key) - 1] as any);
      }
      
      // Escape to clear selection
      if (e.key === 'Escape') {
        setSelectedConversation(null);
        setSearchTerm('');
      }
      
      // Enter to send message when input is focused
      if (e.key === 'Enter' && !e.shiftKey && document.activeElement === messageInputRef.current) {
        e.preventDefault();
        sendMessage();
      }
    };
    
    document.addEventListener('keydown', handleKeyboard);
    
    return () => {
      cleanup?.();
      document.removeEventListener('keydown', handleKeyboard);
      if (recordingTimer.current) clearInterval(recordingTimer.current);
      if (typingTimer.current) clearTimeout(typingTimer.current);
    };
  }, [sendMessage]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  // Auto-save draft messages
  useEffect(() => {
    if (selectedConversation && newMessage.trim()) {
      const draftKey = `draft_${selectedConversation}`;
      localStorage.setItem(draftKey, newMessage);
    }
  }, [newMessage, selectedConversation]);

  // Load draft message when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      const draftKey = `draft_${selectedConversation}`;
      const draft = localStorage.getItem(draftKey);
      if (draft && draft !== newMessage) {
        setNewMessage(draft);
      }
    }
  }, [selectedConversation]);



  // Mock data loader
  const loadCommunicationData = async () => {
    // Sample conversations
    setConversations([
      {
        id: '1',
        type: 'direct',
        name: 'د. أحمد محمد',
        participants: [
          { 
            id: '1', 
            name: 'د. أحمد محمد', 
            role: 'doctor', 
            department: 'cardiology',
            status: 'online',
            permissions: { canCall: true, canVideo: true, canShare: true, canInvite: false }
          }
        ],
        unreadCount: 3,
        isPinned: true,
        isMuted: false,
        isArchived: false,
        isEncrypted: true,
        createdAt: '2024-01-15T08:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z',
        settings: {
          canAddMembers: false,
          canLeave: true,
          disappearingMessages: false,
          retentionDays: 30
        }
      },
      {
        id: '2',
        type: 'group',
        name: 'فريق الطوارئ',
        description: 'التنسيق السريع لحالات الطوارئ',
        participants: [
          { 
            id: '2', 
            name: 'سارة أحمد', 
            role: 'nurse', 
            department: 'emergency',
            status: 'online',
            permissions: { canCall: true, canVideo: true, canShare: true, canInvite: true }
          },
          { 
            id: '3', 
            name: 'محمد علي', 
            role: 'paramedic', 
            department: 'emergency',
            status: 'away',
            permissions: { canCall: true, canVideo: false, canShare: true, canInvite: false }
          }
        ],
        unreadCount: 0,
        isPinned: false,
        isMuted: false,
        isArchived: false,
        isEncrypted: true,
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-20T12:00:00Z',
        settings: {
          canAddMembers: true,
          canLeave: true,
          disappearingMessages: true,
          retentionDays: 7
        }
      },
      {
        id: '3',
        type: 'emergency',
        name: 'طوارئ - كود أحمر',
        description: 'قناة الطوارئ النشطة',
        participants: [
          { 
            id: '4', 
            name: 'د. فاطمة خان', 
            role: 'doctor', 
            department: 'emergency',
            status: 'busy',
            permissions: { canCall: true, canVideo: true, canShare: true, canInvite: true }
          }
        ],
        unreadCount: 5,
        isPinned: true,
        isMuted: false,
        isArchived: false,
        isEncrypted: true,
        createdAt: '2024-01-20T15:00:00Z',
        updatedAt: '2024-01-20T15:30:00Z',
        settings: {
          canAddMembers: true,
          canLeave: false,
          disappearingMessages: false,
          retentionDays: 90
        }
      }
    ]);

    // Sample messages
    setMessages([
      {
        id: '1',
        senderId: '1',
        senderName: 'د. أحمد محمد',
        senderRole: 'doctor',
        content: 'هل يمكنك مراجعة ملف المريض في الغرفة 201؟ الحالة تتطلب متابعة عاجلة.',
        type: 'text',
        timestamp: '2024-01-20T14:30:00Z',
        status: 'delivered',
        priority: 'high',
        isEncrypted: true
      },
      {
        id: '2',
        senderId: 'current-user',
        senderName: 'أنت',
        senderRole: 'nurse',
        content: 'بالطبع، سأراجعه فوراً وأرسل لك التقرير.',
        type: 'text',
        timestamp: '2024-01-20T14:31:00Z',
        status: 'read',
        priority: 'normal',
        isEncrypted: true
      },
      {
        id: '3',
        senderId: '1',
        senderName: 'د. أحمد محمد',
        senderRole: 'doctor',
        content: 'شكراً لك، أيضاً يرجى إحضار نتائج التحاليل الأخيرة.',
        type: 'text',
        timestamp: '2024-01-20T14:32:00Z',
        status: 'delivered',
        priority: 'normal',
        isEncrypted: true,
        reactions: [
          { emoji: '👍', users: ['current-user'], count: 1 }
        ]
      }
    ]);

    // Sample calls
    setCalls([
      {
        id: '1',
        type: 'video',
        status: 'ended',
        participants: [
          { 
            id: '1', 
            name: 'د. أحمد محمد', 
            role: 'doctor',
            status: 'connected',
            isAudioMuted: false,
            isVideoMuted: false,
            isScreenSharing: false,
            joinedAt: '2024-01-20T14:00:00Z'
          }
        ],
        initiatorId: 'current-user',
        startTime: '2024-01-20T14:00:00Z',
        endTime: '2024-01-20T14:05:00Z',
        duration: 300,
        quality: 'excellent',
        isRecorded: false,
        notes: 'مناقشة حالة المريض في الغرفة 201',
        tags: ['patient-consultation', 'cardiology'],
        priority: 'high'
      },
      {
        id: '2',
        type: 'emergency',
        status: 'missed',
        participants: [
          { 
            id: '4', 
            name: 'د. فاطمة خان', 
            role: 'doctor',
            status: 'disconnected',
            isAudioMuted: false,
            isVideoMuted: false,
            isScreenSharing: false,
            joinedAt: '2024-01-20T15:00:00Z'
          }
        ],
        initiatorId: '4',
        startTime: '2024-01-20T15:00:00Z',
        quality: 'good',
        isRecorded: false,
        tags: ['emergency'],
        priority: 'urgent'
      }
    ]);

    // Sample active calls
    setActiveCalls([
      {
        id: 'active-1',
        type: 'conference',
        status: 'active',
        participants: [
          { 
            id: '2', 
            name: 'سارة أحمد', 
            role: 'nurse',
            status: 'connected',
            isAudioMuted: false,
            isVideoMuted: true,
            isScreenSharing: false,
            joinedAt: '2024-01-20T15:15:00Z'
          },
          { 
            id: '3', 
            name: 'محمد علي', 
            role: 'paramedic',
            status: 'connected',
            isAudioMuted: true,
            isVideoMuted: true,
            isScreenSharing: false,
            joinedAt: '2024-01-20T15:16:00Z'
          }
        ],
        initiatorId: 'current-user',
        startTime: '2024-01-20T15:15:00Z',
        quality: 'good',
        isRecorded: true,
        tags: ['team-meeting'],
        priority: 'normal'
      }
    ]);

    // Sample notifications
    setNotifications([
      {
        id: '1',
        type: 'emergency',
        title: 'حالة طوارئ - كود أحمر',
        content: 'مريض جديد في قسم الطوارئ - حالة حرجة تتطلب تدخل فوري',
        senderName: 'نظام الطوارئ',
        timestamp: '2024-01-20T15:00:00Z',
        priority: 'urgent',
        isRead: false,
        isSilent: false,
        category: 'emergency',
        actionUrl: '/emergency',
        actionLabel: 'عرض التفاصيل'
      },
      {
        id: '2',
        type: 'appointment',
        title: 'موعد جديد محجوز',
        content: 'تم حجز موع�� جديد للمريض أحمد محمد غداً الساعة 10:00 صباحاً',
        senderName: 'نظام المواعيد',
        timestamp: '2024-01-20T14:45:00Z',
        priority: 'normal',
        isRead: true,
        isSilent: false,
        category: 'appointments',
        actionUrl: '/appointments',
        actionLabel: 'عرض المواعيد'
      },
      {
        id: '3',
        type: 'system',
        title: 'تحديث النظام',
        content: 'سيتم تطبيق تحديث النظام الليلة في الساعة 2:00 صباحاً لمدة 30 دقيقة',
        senderName: 'الإدارة التقنية',
        timestamp: '2024-01-20T13:00:00Z',
        priority: 'normal',
        isRead: false,
        isSilent: true,
        category: 'system',
        expiresAt: '2024-01-21T03:00:00Z'
      },
      {
        id: '4',
        type: 'call',
        title: 'مكالمة فائتة',
        content: 'مكالمة فائتة من د. فاطمة خان - قسم الطوارئ',
        senderName: 'د. فاطمة خان',
        senderAvatar: '',
        timestamp: '2024-01-20T15:00:00Z',
        priority: 'high',
        isRead: false,
        isSilent: false,
        category: 'calls',
        actionUrl: '/communication?tab=calls',
        actionLabel: 'إعادة الاتصال'
      }
    ]);
  };

  // Setup realtime listeners (mock implementation)
  const setupRealtimeListeners = () => {
    // Mock typing indicators
    const typingInterval = setInterval(() => {
      setConversations(prev => 
        prev.map(conv => ({
          ...conv,
          participants: conv.participants.map(p => ({
            ...p,
            isTyping: Math.random() < 0.1 // Random typing simulation
          }))
        }))
      );
    }, 3000);

    // Mock online status updates
    const statusInterval = setInterval(() => {
      setConversations(prev =>
        prev.map(conv => ({
          ...conv,
          participants: conv.participants.map(p => ({
            ...p,
            status: Math.random() < 0.8 ? p.status : 
              ['online', 'away', 'busy', 'offline'][Math.floor(Math.random() * 4)] as any
          }))
        }))
      );
    }, 30000);

    // Mock new notifications
    const notificationInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: ['message', 'call', 'system', 'appointment'][Math.floor(Math.random() * 4)] as any,
          title: 'إشعار جديد',
          content: 'تم إنشاء إشعار تجريبي جديد',
          senderName: 'النظام',
          timestamp: new Date().toISOString(),
          priority: 'normal',
          isRead: false,
          isSilent: false,
          category: 'system'
        };
        setNotifications(prev => [newNotification, ...prev]);
      }
    }, 45000);

    return () => {
      clearInterval(typingInterval);
      clearInterval(statusInterval);
      clearInterval(notificationInterval);
    };
  };

  // Utility functions
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return t('now');
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString(isRTL ? 'ar-SA' : 'en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 48) {
      return t('yesterday');
    } else {
      return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'normal': return 'bg-blue-500';
      case 'low': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-orange-500';
      case 'dnd': return 'bg-red-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'sending': return <Clock className="h-3 w-3 text-gray-400 animate-pulse" />;
      case 'sent': return <Circle className="h-3 w-3 text-gray-500" />;
      case 'delivered': return <CheckCircle className="h-3 w-3 text-blue-500" />;
      case 'read': return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'failed': return <X className="h-3 w-3 text-red-500" />;
      default: return <Circle className="h-3 w-3 text-gray-500" />;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'doctor': return <Stethoscope className="h-3 w-3" />;
      case 'nurse': return <Activity className="h-3 w-3" />;
      case 'admin': return <ShieldCheck className="h-3 w-3" />;
      case 'receptionist': return <Building className="h-3 w-3" />;
      default: return <Users className="h-3 w-3" />;
    }
  };

  // Typing indicator
  const handleTyping = (value: string) => {
    setNewMessage(value);
    
    if (!isTyping && value.trim()) {
      setIsTyping(true);
    }
    
    if (typingTimer.current) {
      clearTimeout(typingTimer.current);
    }
    
    typingTimer.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  // Voice recording
  const startRecording = () => {
    setIsRecording(true);
    setRecordingDuration(0);
    
    recordingTimer.current = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingTimer.current) {
      clearInterval(recordingTimer.current);
    }
    
    // Create voice message
    if (recordingDuration > 0) {
      const voiceMessage: Message = {
        id: Date.now().toString(),
        senderId: 'current-user',
        senderName: 'أنت',
        senderRole: 'nurse',
        content: `رسالة صوتية - ${formatDuration(recordingDuration)}`,
        type: 'voice',
        timestamp: new Date().toISOString(),
        status: 'sending',
        priority: 'normal',
        isEncrypted: true
      };
      
      setMessages(prev => [...prev, voiceMessage]);
    }
    
    setRecordingDuration(0);
  };

  // Call handling
  const initiateCall = (type: 'audio' | 'video', participantId: string) => {
    const participant = conversations
      .find(c => c.participants.some(p => p.id === participantId))
      ?.participants.find(p => p.id === participantId);
      
    if (!participant) return;

    const newCall: Call = {
      id: Date.now().toString(),
      type,
      status: 'outgoing',
      participants: [{
        id: participantId,
        name: participant.name,
        role: participant.role,
        status: 'connecting',
        isAudioMuted: false,
        isVideoMuted: type === 'audio',
        isScreenSharing: false,
        joinedAt: new Date().toISOString()
      }],
      initiatorId: 'current-user',
      startTime: new Date().toISOString(),
      quality: 'good',
      isRecorded: false,
      tags: [type === 'video' ? 'video-call' : 'audio-call'],
      priority: 'normal'
    };

    setActiveCalls(prev => [...prev, newCall]);
    setShowCallDialog(true);
    
    // Simulate call connection
    setTimeout(() => {
      setActiveCalls(prev => 
        prev.map(call => 
          call.id === newCall.id 
            ? { ...call, status: 'active', participants: call.participants.map(p => ({ ...p, status: 'connected' })) }
            : call
        )
      );
    }, 3000);
  };

  const endCall = (callId: string) => {
    const call = activeCalls.find(c => c.id === callId);
    if (!call) return;

    const endedCall: Call = {
      ...call,
      status: 'ended',
      endTime: new Date().toISOString(),
      duration: Math.floor((new Date().getTime() - new Date(call.startTime).getTime()) / 1000)
    };

    setCalls(prev => [endedCall, ...prev]);
    setActiveCalls(prev => prev.filter(c => c.id !== callId));
    setShowCallDialog(false);
  };

  // Notification handling
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // Filter functions
  const filteredConversations = useMemo(() => {
    return conversations.filter(conv => {
      const searchMatch = conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.participants.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      switch (messagesFilter) {
        case 'unread': return searchMatch && conv.unreadCount > 0;
        case 'pinned': return searchMatch && conv.isPinned;
        case 'archived': return searchMatch && conv.isArchived;
        default: return searchMatch && !conv.isArchived;
      }
    }).sort((a, b) => {
      // Sort by pinned first, then by update time
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [conversations, searchTerm, messagesFilter]);

  const filteredCalls = useMemo(() => {
    return calls.filter(call => {
      switch (callsFilter) {
        case 'missed': return call.status === 'missed';
        case 'recent': return new Date().getTime() - new Date(call.startTime).getTime() < 24 * 60 * 60 * 1000;
        default: return true;
      }
    });
  }, [calls, callsFilter]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notif => {
      switch (notificationsFilter) {
        case 'unread': return !notif.isRead;
        case 'urgent': return notif.priority === 'urgent';
        case 'today': return new Date().getTime() - new Date(notif.timestamp).getTime() < 24 * 60 * 60 * 1000;
        default: return true;
      }
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [notifications, notificationsFilter]);

  // Screen components
  const MessagesScreen = () => (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
      {/* Conversations List */}
      <motion.div 
        className="col-span-4 border-r border-border bg-card/50 rounded-lg"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">{t('messagesTitle')}</h3>
            </div>
            <Button size="sm" onClick={() => {/* New conversation logic */}}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('searchConversations')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setMessagesFilter('all')}>
                  {t('allConversations')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMessagesFilter('unread')}>
                  {t('unreadNotifications')} 
                  {conversations.filter(c => c.unreadCount > 0).length > 0 && 
                    <Badge className="ml-2">{conversations.filter(c => c.unreadCount > 0).length}</Badge>
                  }
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMessagesFilter('pinned')}>
                  {t('pinConversation')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMessagesFilter('archived')}>
                  {t('archived')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Conversations */}
        <ScrollArea className="h-full">
          <AnimatePresence>
            {filteredConversations.map((conversation) => (
              <motion.div
                key={conversation.id}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ scale: 1.02, x: isRTL ? -5 : 5 }}
                className={`p-4 border-b border-border cursor-pointer transition-all duration-200 ${
                  selectedConversation === conversation.id 
                    ? 'bg-primary/10 border-l-4 border-l-primary' 
                    : 'hover:bg-muted/30'
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20">
                        {conversation.type === 'group' || conversation.type === 'emergency' ? (
                          <Users className="h-4 w-4" />
                        ) : (
                          conversation.name.split(' ')[0][0]
                        )}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Status indicators */}
                    {conversation.type === 'direct' && (
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                        getStatusColor(conversation.participants[0]?.status || 'offline')
                      }`} />
                    )}
                    
                    {conversation.type === 'emergency' && (
                      <motion.div 
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center"
                        variants={pulseVariants}
                        animate="pulse"
                      >
                        <AlertCircle className="h-2 w-2 text-white" />
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">{conversation.name}</p>
                      <div className="flex items-center gap-1">
                        {conversation.isPinned && (
                          <Pin className="h-3 w-3 text-primary fill-current" />
                        )}
                        {conversation.isMuted && (
                          <VolumeX className="h-3 w-3 text-muted-foreground" />
                        )}
                        {conversation.isEncrypted && (
                          <ShieldCheck className="h-3 w-3 text-green-500" />
                        )}
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(
                          conversation.type === 'emergency' ? 'urgent' : 'normal'
                        )}`} />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground truncate flex-1">
                        {conversation.participants.some(p => p.isTyping) ? (
                          <motion.span 
                            className="text-primary flex items-center gap-1"
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                          >
                            <div className="flex gap-1">
                              <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                              <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                              <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                            </div>
                            يكتب...
                          </motion.span>
                        ) : (
                          conversation.lastMessage?.content || t('noMessages')
                        )}
                      </p>
                      {getRoleIcon(conversation.participants[0]?.role || 'user')}
                    </div>
                  </div>
                  
                  <div className="text-right flex flex-col items-end gap-1">
                    <p className="text-xs text-muted-foreground">
                      {formatTime(conversation.updatedAt)}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-primary text-primary-foreground text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
                      >
                        {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
      </motion.div>

      {/* Chat Area */}
      <motion.div 
        className="col-span-8 flex flex-col bg-card/30 rounded-lg"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-gradient-to-r from-secondary/10 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={conversations.find(c => c.id === selectedConversation)?.avatar} />
                    <AvatarFallback>
                      {conversations.find(c => c.id === selectedConversation)?.type === 'group' ? (
                        <Users className="h-4 w-4" />
                      ) : (
                        conversations.find(c => c.id === selectedConversation)?.name.split(' ')[0][0]
                      )}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {conversations.find(c => c.id === selectedConversation)?.name}
                      </p>
                      {conversations.find(c => c.id === selectedConversation)?.isEncrypted && (
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {conversations.find(c => c.id === selectedConversation)?.participants
                        .filter(p => p.status === 'online').length > 0 ? t('onlineNow') : t('lastSeen')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => initiateCall('audio', selectedConversation)}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => initiateCall('video', selectedConversation)}
                  >
                    <Video className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Users className="h-4 w-4 mr-2" />
                        {t('participants')}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        {t('settings')}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Search className="h-4 w-4 mr-2" />
                        {t('searchMessages')}
                      </DropdownMenuItem>
                      <Separator />
                      <DropdownMenuItem>
                        <Pin className="h-4 w-4 mr-2" />
                        {conversations.find(c => c.id === selectedConversation)?.isPinned 
                          ? t('unpinConversation') 
                          : t('pinConversation')
                        }
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <VolumeX className="h-4 w-4 mr-2" />
                        {conversations.find(c => c.id === selectedConversation)?.isMuted 
                          ? t('unmuteConversation') 
                          : t('muteConversation')
                        }
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t('deleteConversation')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={`flex mb-4 ${
                      message.senderId === 'current-user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg relative group ${
                        message.senderId === 'current-user'
                          ? 'bg-primary text-primary-foreground ml-12'
                          : 'bg-muted mr-12'
                      }`}
                    >
                      {/* Priority indicator */}
                      <div className={`absolute -top-1 -left-1 w-3 h-3 rounded-full ${
                        getPriorityColor(message.priority)
                      } ${message.priority !== 'normal' ? 'animate-pulse' : ''}`} />
                      
                      {/* Sender info */}
                      {message.senderId !== 'current-user' && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            {getRoleIcon(message.senderRole)}
                            <p className="text-xs font-medium opacity-75">{message.senderName}</p>
                          </div>
                          {message.isEncrypted && (
                            <ShieldCheck className="h-3 w-3 opacity-60" />
                          )}
                        </div>
                      )}
                      
                      {/* Message content */}
                      <div className="space-y-2">
                        {message.type === 'voice' ? (
                          <div className="flex items-center gap-2 bg-black/10 rounded p-2">
                            <Button size="sm" variant="ghost" className="p-1">
                              <Phone className="h-3 w-3" />
                            </Button>
                            <div className="flex-1 h-6 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded" />
                            <span className="text-xs opacity-75">{message.content.split(' - ')[1]}</span>
                          </div>
                        ) : (
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        )}
                        
                        {/* Reactions */}
                        {message.reactions && message.reactions.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {message.reactions.map((reaction, index) => (
                              <motion.div
                                key={index}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-black/10 rounded-full px-2 py-1 text-xs flex items-center gap-1"
                              >
                                <span>{reaction.emoji}</span>
                                <span className="opacity-75">{reaction.count}</span>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Message footer */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <p className="text-xs opacity-75">
                            {formatTime(message.timestamp)}
                          </p>
                          {message.isEdited && (
                            <span className="text-xs opacity-60">{t('edit')}</span>
                          )}
                        </div>
                        
                        {message.senderId === 'current-user' && (
                          <div className="flex items-center gap-1">
                            {getMessageStatusIcon(message.status)}
                          </div>
                        )}
                      </div>
                      
                      {/* Message actions (shown on hover) */}
                      <div className="absolute top-0 right-0 transform translate-x-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-background border rounded-lg shadow-lg p-1 flex gap-1">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <Reply className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <Forward className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <Copy className="h-3 w-3" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Star className="h-3 w-3 mr-2" />
                                {t('favorite')}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit3 className="h-3 w-3 mr-2" />
                                {t('edit')}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-3 w-3 mr-2" />
                                {t('delete')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border bg-background/50">
              <div className="flex items-end gap-2">
                <DropdownMenu open={showAttachmentMenu} onOpenChange={setShowAttachmentMenu}>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <FileText className="h-4 w-4 mr-2" />
                      {t('documentMessage')}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Camera className="h-4 w-4 mr-2" />
                      {t('imageMessage')}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Video className="h-4 w-4 mr-2" />
                      Video
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <div className="flex-1 relative">
                  <Input
                    ref={messageInputRef}
                    placeholder={t('typeMessage')}
                    value={newMessage}
                    onChange={(e) => handleTyping(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    className="pr-20 resize-none"
                    disabled={isRecording}
                  />
                  
                  {isRecording && (
                    <div className="absolute inset-0 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                      <motion.div 
                        className="flex items-center gap-2 text-red-600"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium">
                          {t('recording')} {formatDuration(recordingDuration)}
                        </span>
                      </motion.div>
                    </div>
                  )}
                </div>
                
                <Button
                  size="sm"
                  variant="outline"
                  onMouseDown={startRecording}
                  onMouseUp={stopRecording}
                  onMouseLeave={stopRecording}
                  className={isRecording ? 'bg-red-500 text-white' : ''}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                
                <Button 
                  size="sm" 
                  onClick={sendMessage}
                  disabled={!newMessage.trim() && !isRecording}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {isTyping && (
                <p className="text-xs text-muted-foreground mt-2 opacity-75">
                  {t('typing')}...
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <MessageSquare className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('selectConversation')}</h3>
              <p className="text-muted-foreground max-w-md">
                اختر محادثة من القائمة للبدء في التواصل مع الفريق الطبي
              </p>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );

  return (
    <motion.div 
      className="p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between"
        variants={itemVariants}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('pageTitle')}
            </h1>
            <p className="text-muted-foreground">{t('pageSubtitle')}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            {filteredNotifications.filter(n => !n.isRead).length} {t('unreadNotifications')}
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            {activeCalls.length} {t('activeCalls')}
          </Badge>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div 
        className="flex gap-1 bg-muted/30 p-1 rounded-lg w-fit"
        variants={itemVariants}
      >
        {[
          { key: 'messages', icon: MessageSquare, label: t('messages') },
          { key: 'calls', icon: Phone, label: t('calls') },
          { key: 'notifications', icon: Bell, label: t('notifications') }
        ].map((tab) => (
          <Button
            key={tab.key}
            variant={activeScreen === tab.key ? "default" : "ghost"}
            onClick={() => setActiveScreen(tab.key as any)}
            className={`px-6 py-2 transition-all duration-200 ${
              activeScreen === tab.key 
                ? 'shadow-lg' 
                : 'hover:bg-muted/50'
            }`}
          >
            <tab.icon className="h-4 w-4 mr-2" />
            {tab.label}
            {tab.key === 'notifications' && filteredNotifications.filter(n => !n.isRead).length > 0 && (
              <Badge className="ml-2 h-5 min-w-5 text-xs">
                {filteredNotifications.filter(n => !n.isRead).length}
              </Badge>
            )}
          </Button>
        ))}
      </motion.div>

      {/* Screen Content */}
      <AnimatePresence mode="wait">
        {activeScreen === 'messages' && <MessagesScreen key="messages" />}
        {activeScreen === 'calls' && (
          <motion.div
            key="calls"
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Active Calls Section */}
            {activeCalls.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-3 h-3 bg-green-500 rounded-full"
                    />
                    <h3 className="font-semibold text-green-800 dark:text-green-200">
                      {t('activeCalls')} ({activeCalls.length})
                    </h3>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShowCallDialog(true)}
                  >
                    <Maximize2 className="h-4 w-4 mr-2" />
                    {t('expand')}
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  {activeCalls.map((call) => (
                    <motion.div
                      key={call.id}
                      className="bg-white/60 dark:bg-background/60 rounded-lg p-4 border"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20">
                                {call.participants[0]?.name.split(' ')[0][0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            </div>
                          </div>
                          
                          <div>
                            <p className="font-medium">{call.participants[0]?.name}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              {call.type === 'video' ? (
                                <Video className="h-3 w-3" />
                              ) : call.type === 'conference' ? (
                                <Users className="h-3 w-3" />
                              ) : (
                                <Phone className="h-3 w-3" />
                              )}
                              <span>{formatDuration(Math.floor((new Date().getTime() - new Date(call.startTime).getTime()) / 1000))}</span>
                              <div className={`w-2 h-2 rounded-full ${
                                call.quality === 'excellent' ? 'bg-green-500' :
                                call.quality === 'good' ? 'bg-blue-500' :
                                call.quality === 'fair' ? 'bg-yellow-500' : 'bg-red-500'
                              }`} />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {/* Mute toggle logic */}}
                          >
                            {call.participants[0]?.isAudioMuted ? (
                              <MicOff className="h-4 w-4" />
                            ) : (
                              <Mic className="h-4 w-4" />
                            )}
                          </Button>
                          
                          {call.type !== 'audio' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {/* Video toggle logic */}}
                            >
                              {call.participants[0]?.isVideoMuted ? (
                                <VideoOff className="h-4 w-4" />
                              ) : (
                                <Video className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => endCall(call.id)}
                          >
                            <PhoneOff className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {call.type === 'conference' && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs text-muted-foreground mb-2">
                            {t('participants')} ({call.participants.length})
                          </p>
                          <div className="flex gap-2">
                            {call.participants.slice(0, 4).map((participant) => (
                              <Avatar key={participant.id} className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {participant.name.split(' ')[0][0]}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {call.participants.length > 4 && (
                              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">
                                +{call.participants.length - 4}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Main Calls Interface */}
            <div className="grid grid-cols-12 gap-6">
              {/* Quick Actions & Call Controls */}
              <motion.div 
                className="col-span-4 space-y-4"
                variants={itemVariants}
              >
                {/* Quick Dial */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <PhoneCall className="h-5 w-5 text-primary" />
                    {t('newCall')}
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Button className="h-12 flex-col gap-1" onClick={() => {/* Audio call logic */}}>
                        <Phone className="h-4 w-4" />
                        <span className="text-xs">{t('audioCall')}</span>
                      </Button>
                      <Button className="h-12 flex-col gap-1" variant="outline" onClick={() => {/* Video call logic */}}>
                        <Video className="h-4 w-4" />
                        <span className="text-xs">{t('videoCall')}</span>
                      </Button>
                    </div>
                    
                    <Button className="w-full h-12 flex-col gap-1" variant="outline" onClick={() => {/* Conference call logic */}}>
                      <Users className="h-4 w-4" />
                      <span className="text-xs">{t('conferenceCall')}</span>
                    </Button>
                    
                    <div className="pt-2 border-t">
                      <Button 
                        className="w-full h-12 flex-col gap-1 bg-red-500 hover:bg-red-600" 
                        onClick={() => {/* Emergency call logic */}}
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                        >
                          <AlertCircle className="h-4 w-4" />
                        </motion.div>
                        <span className="text-xs">{t('emergencyCall')}</span>
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Call Statistics */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">{t('callStatistics')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {calls.filter(c => c.status === 'ended').length}
                      </div>
                      <div className="text-xs text-muted-foreground">{t('completedCalls')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {calls.filter(c => c.status === 'missed').length}
                      </div>
                      <div className="text-xs text-muted-foreground">{t('missedCall')}</div>
                    </div>
                  </div>
                </Card>

                {/* Emergency Contacts */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    {t('emergencyContacts')}
                  </h3>
                  
                  <div className="space-y-2">
                    {[
                      { name: 'طوارئ المستشفى', number: '911', icon: Home },
                      { name: 'الأمن', number: '500', icon: ShieldCheck },
                      { name: 'الصيانة', number: '600', icon: Settings }
                    ].map((contact, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-between p-2 hover:bg-muted/50 rounded cursor-pointer"
                        whileHover={{ x: isRTL ? -5 : 5 }}
                        onClick={() => {/* Emergency call logic */}}
                      >
                        <div className="flex items-center gap-2">
                          <contact.icon className="h-4 w-4 text-red-500" />
                          <span className="text-sm">{contact.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {contact.number}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Call History & Management */}
              <motion.div 
                className="col-span-8 space-y-4"
                variants={itemVariants}
              >
                {/* Call History Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h3 className="text-xl font-semibold">{t('callHistory')}</h3>
                    <div className="flex gap-1">
                      {[
                        { key: 'all', label: t('allCalls'), count: calls.length },
                        { key: 'missed', label: t('missedCall'), count: calls.filter(c => c.status === 'missed').length },
                        { key: 'recent', label: t('recentCalls'), count: filteredCalls.length }
                      ].map((filter) => (
                        <Button
                          key={filter.key}
                          size="sm"
                          variant={callsFilter === filter.key ? "default" : "ghost"}
                          onClick={() => setCallsFilter(filter.key as any)}
                          className="gap-2"
                        >
                          {filter.label}
                          <Badge variant="secondary" className="text-xs">
                            {filter.count}
                          </Badge>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t('searchCalls')}
                        className="pl-9 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button size="sm" variant="outline">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Call List */}
                <Card>
                  <ScrollArea className="h-[600px]">
                    <div className="p-4">
                      <AnimatePresence>
                        {filteredCalls.map((call, index) => (
                          <motion.div
                            key={call.id}
                            variants={messageVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-muted/30 rounded-lg mb-2 group"
                          >
                            <div className="flex items-center gap-4">
                              {/* Call Type & Status Icon */}
                              <div className={`p-3 rounded-full relative ${
                                call.status === 'missed' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                                call.status === 'ended' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
                                call.status === 'rejected' ? 'bg-gray-100 text-gray-600 dark:bg-gray-900/30' :
                                'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
                              }`}>
                                {call.status === 'missed' ? (
                                  <PhoneMissed className="h-5 w-5" />
                                ) : call.status === 'outgoing' ? (
                                  <PhoneOutgoing className="h-5 w-5" />
                                ) : call.status === 'incoming' ? (
                                  <PhoneIncoming className="h-5 w-5" />
                                ) : call.type === 'video' ? (
                                  <Video className="h-5 w-5" />
                                ) : call.type === 'conference' ? (
                                  <Users className="h-5 w-5" />
                                ) : (
                                  <Phone className="h-5 w-5" />
                                )}
                                
                                {/* Priority indicator */}
                                {call.priority === 'urgent' && (
                                  <motion.div
                                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                  />
                                )}
                              </div>
                              
                              {/* Call Details */}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium">
                                    {call.participants.length === 1 
                                      ? call.participants[0].name
                                      : `${call.participants[0].name} +${call.participants.length - 1}`
                                    }
                                  </h4>
                                  
                                  {/* Call Tags */}
                                  <div className="flex gap-1">
                                    {call.tags.slice(0, 2).map((tag) => (
                                      <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                                        {tag}
                                      </Badge>
                                    ))}
                                    {call.isRecorded && (
                                      <Badge variant="outline" className="text-xs px-1 py-0">
                                        <div className="w-2 h-2 bg-red-500 rounded-full mr-1" />
                                        مسجل
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                  <span>{formatTime(call.startTime)}</span>
                                  {call.duration && (
                                    <>
                                      <span>•</span>
                                      <span>{formatDuration(call.duration)}</span>
                                    </>
                                  )}
                                  <span>•</span>
                                  <div className="flex items-center gap-1">
                                    <div className={`w-2 h-2 rounded-full ${
                                      call.quality === 'excellent' ? 'bg-green-500' :
                                      call.quality === 'good' ? 'bg-blue-500' :
                                      call.quality === 'fair' ? 'bg-yellow-500' : 'bg-red-500'
                                    }`} />
                                    <span className="capitalize">{call.quality}</span>
                                  </div>
                                  
                                  {call.participants[0]?.role && (
                                    <>
                                      <span>•</span>
                                      <div className="flex items-center gap-1">
                                        {getRoleIcon(call.participants[0].role)}
                                        <span>{t(call.participants[0].role as any)}</span>
                                      </div>
                                    </>
                                  )}
                                </div>
                                
                                {call.notes && (
                                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                    {call.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            {/* Call Actions */}
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => initiateCall('audio', call.participants[0].id)}
                              >
                                <Phone className="h-4 w-4" />
                              </Button>
                              
                              {call.participants[0]?.id && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => initiateCall('video', call.participants[0].id)}
                                >
                                  <Video className="h-4 w-4" />
                                </Button>
                              )}
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" />
                                    {t('viewDetails')}
                                  </DropdownMenuItem>
                                  {call.isRecorded && (
                                    <DropdownMenuItem>
                                      <Download className="h-4 w-4 mr-2" />
                                      {t('downloadRecording')}
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem>
                                    <Copy className="h-4 w-4 mr-2" />
                                    {t('copyDetails')}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Star className="h-4 w-4 mr-2" />
                                    {t('addToFavorites')}
                                  </DropdownMenuItem>
                                  <Separator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {t('delete')}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      
                      {filteredCalls.length === 0 && (
                        <motion.div 
                          className="text-center py-20"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <Phone className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                          <h3 className="text-lg font-semibold mb-2">{t('noCalls')}</h3>
                          <p className="text-muted-foreground">
                            {callsFilter === 'missed' ? 'لا توجد مكالمات فائتة' : 
                             callsFilter === 'recent' ? 'لا توجد مكالمات حديثة' :
                             'لم يتم إجراء أي مكالمات بعد'}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </ScrollArea>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}
        {activeScreen === 'notifications' && (
          <motion.div
            key="notifications"
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Urgent Notifications Banner */}
            {filteredNotifications.some(n => n.priority === 'urgent' && !n.isRead) && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800"
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <AlertCircle className="h-6 w-6 text-red-500" />
                  </motion.div>
                  <h3 className="font-semibold text-red-800 dark:text-red-200">
                    إشعارات عاجلة ({filteredNotifications.filter(n => n.priority === 'urgent' && !n.isRead).length})
                  </h3>
                </div>
                
                <div className="grid gap-3">
                  {filteredNotifications
                    .filter(n => n.priority === 'urgent' && !n.isRead)
                    .slice(0, 3)
                    .map((notification) => (
                      <motion.div
                        key={notification.id}
                        className="bg-white/60 dark:bg-background/60 rounded-lg p-3 border border-red-100 dark:border-red-800"
                        whileHover={{ scale: 1.01 }}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600">
                            {notification.type === 'emergency' && <AlertCircle className="h-4 w-4" />}
                            {notification.type === 'call' && <Phone className="h-4 w-4" />}
                            {notification.type === 'system' && <Settings className="h-4 w-4" />}
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-medium text-red-800 dark:text-red-200 mb-1">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-red-700 dark:text-red-300 line-clamp-2">
                              {notification.content}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-red-600 dark:text-red-400">
                                {formatTime(notification.timestamp)}
                              </span>
                              {notification.actionLabel && (
                                <Button size="sm" variant="outline" className="h-6 text-xs">
                                  {notification.actionLabel}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}

            {/* Main Notifications Interface */}
            <div className="grid grid-cols-12 gap-6">
              {/* Notification Controls & Statistics */}
              <motion.div 
                className="col-span-4 space-y-4"
                variants={itemVariants}
              >
                {/* Quick Actions */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    {t('quickActions')}
                  </h3>
                  
                  <div className="space-y-2">
                    <Button 
                      className="w-full justify-start gap-2" 
                      variant="outline"
                      onClick={markAllNotificationsAsRead}
                      disabled={filteredNotifications.filter(n => !n.isRead).length === 0}
                    >
                      <CheckCircle className="h-4 w-4" />
                      {t('markAllAsRead')} 
                      {filteredNotifications.filter(n => !n.isRead).length > 0 && 
                        <Badge className="ml-auto">{filteredNotifications.filter(n => !n.isRead).length}</Badge>
                      }
                    </Button>
                    
                    <Button 
                      className="w-full justify-start gap-2" 
                      variant="outline"
                      onClick={() => setShowNotificationSettings(true)}
                    >
                      <Settings className="h-4 w-4" />
                      {t('notificationSettings')}
                    </Button>
                    
                    <Button 
                      className="w-full justify-start gap-2" 
                      variant="outline"
                      onClick={() => {/* Archive all read logic */}}
                    >
                      <Archive className="h-4 w-4" />
                      {t('archiveRead')}
                    </Button>
                    
                    <Button 
                      className="w-full justify-start gap-2 text-destructive" 
                      variant="outline"
                      onClick={() => {/* Clear all logic */}}
                    >
                      <Trash2 className="h-4 w-4" />
                      {t('clearAll')}
                    </Button>
                  </div>
                </Card>

                {/* Notification Statistics */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">{t('notificationStatistics')}</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <span className="text-sm">{t('urgent')}</span>
                      </div>
                      <Badge variant="destructive">
                        {notifications.filter(n => n.priority === 'urgent').length}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full" />
                        <span className="text-sm">{t('high')}</span>
                      </div>
                      <Badge variant="outline">
                        {notifications.filter(n => n.priority === 'high').length}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        <span className="text-sm">{t('normal')}</span>
                      </div>
                      <Badge variant="outline">
                        {notifications.filter(n => n.priority === 'normal').length}
                      </Badge>
                    </div>
                  </div>
                </Card>

                {/* Notification Categories */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">{t('categories')}</h3>
                  <div className="space-y-2">
                    {[
                      { key: 'emergency', icon: AlertCircle, color: 'text-red-500', label: t('emergency') },
                      { key: 'appointments', icon: Calendar, color: 'text-blue-500', label: t('appointments') },
                      { key: 'calls', icon: Phone, color: 'text-green-500', label: t('calls') },
                      { key: 'system', icon: Settings, color: 'text-gray-500', label: t('systemNotification') },
                      { key: 'messages', icon: MessageSquare, color: 'text-purple-500', label: t('messages') }
                    ].map((category) => {
                      const count = notifications.filter(n => n.category === category.key).length;
                      return (
                        <motion.div
                          key={category.key}
                          className="flex items-center justify-between p-2 hover:bg-muted/50 rounded cursor-pointer"
                          whileHover={{ x: isRTL ? -5 : 5 }}
                          onClick={() => {/* Filter by category */}}
                        >
                          <div className="flex items-center gap-2">
                            <category.icon className={`h-4 w-4 ${category.color}`} />
                            <span className="text-sm">{category.label}</span>
                          </div>
                          {count > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {count}
                            </Badge>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </Card>

                {/* Do Not Disturb */}
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <VolumeX className="h-5 w-5" />
                      {t('doNotDisturb')}
                    </h3>
                    <Switch />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    إيقاف جميع الإشعارات ماعدا الطوارئ
                  </p>
                </Card>
              </motion.div>

              {/* Notifications List */}
              <motion.div 
                className="col-span-8 space-y-4"
                variants={itemVariants}
              >
                {/* Notifications Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h3 className="text-xl font-semibold">{t('notificationsTitle')}</h3>
                    <div className="flex gap-1">
                      {[
                        { key: 'all', label: t('allNotifications'), count: notifications.length },
                        { key: 'unread', label: t('unreadNotifications'), count: notifications.filter(n => !n.isRead).length },
                        { key: 'urgent', label: t('urgent'), count: notifications.filter(n => n.priority === 'urgent').length },
                        { key: 'today', label: t('today'), count: filteredNotifications.length }
                      ].map((filter) => (
                        <Button
                          key={filter.key}
                          size="sm"
                          variant={notificationsFilter === filter.key ? "default" : "ghost"}
                          onClick={() => setNotificationsFilter(filter.key as any)}
                          className="gap-2"
                        >
                          {filter.label}
                          <Badge variant="secondary" className="text-xs">
                            {filter.count}
                          </Badge>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Filter className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Notifications List */}
                <Card>
                  <ScrollArea className="h-[600px]">
                    <div className="p-4">
                      <AnimatePresence>
                        {filteredNotifications.map((notification, index) => (
                          <motion.div
                            key={notification.id}
                            variants={messageVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ delay: index * 0.05 }}
                            className={`p-4 border-b last:border-b-0 rounded-lg mb-2 cursor-pointer transition-all duration-200 ${
                              !notification.isRead 
                                ? 'bg-primary/5 border-l-4 border-l-primary hover:bg-primary/10' 
                                : 'hover:bg-muted/30'
                            }`}
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <div className="flex items-start gap-4">
                              {/* Notification Icon */}
                              <div className={`p-2 rounded-full relative ${
                                notification.type === 'emergency' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                                notification.type === 'message' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' :
                                notification.type === 'appointment' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
                                notification.type === 'call' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30' :
                                notification.type === 'system' ? 'bg-gray-100 text-gray-600 dark:bg-gray-900/30' :
                                'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30'
                              }`}>
                                {notification.type === 'emergency' && <AlertCircle className="h-5 w-5" />}
                                {notification.type === 'message' && <MessageSquare className="h-5 w-5" />}
                                {notification.type === 'appointment' && <Calendar className="h-5 w-5" />}
                                {notification.type === 'call' && <Phone className="h-5 w-5" />}
                                {notification.type === 'system' && <Settings className="h-5 w-5" />}
                                {notification.type === 'reminder' && <Bell className="h-5 w-5" />}
                                {notification.type === 'warning' && <AlertCircle className="h-5 w-5" />}
                                
                                {/* Priority pulse for urgent notifications */}
                                {notification.priority === 'urgent' && !notification.isRead && (
                                  <motion.div
                                    className="absolute -inset-1 rounded-full border-2 border-red-500"
                                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                  />
                                )}
                              </div>
                              
                              {/* Notification Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium line-clamp-1">{notification.title}</h4>
                                    
                                    {/* Priority indicator */}
                                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`} />
                                    
                                    {/* Status badges */}
                                    <div className="flex gap-1">
                                      {!notification.isRead && (
                                        <Badge className="bg-primary text-primary-foreground text-xs px-1 py-0">
                                          جديد
                                        </Badge>
                                      )}
                                      
                                      {notification.isSilent && (
                                        <Badge variant="outline" className="text-xs px-1 py-0">
                                          <VolumeX className="h-2 w-2 mr-1" />
                                          صامت
                                        </Badge>
                                      )}
                                      
                                      {notification.expiresAt && new Date(notification.expiresAt) > new Date() && (
                                        <Badge variant="outline" className="text-xs px-1 py-0">
                                          <Clock className="h-2 w-2 mr-1" />
                                          مؤقت
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Timestamp */}
                                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                                    {formatTime(notification.timestamp)}
                                  </span>
                                </div>
                                
                                {/* Notification message */}
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                  {notification.content}
                                </p>
                                
                                {/* Notification footer */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    {notification.senderAvatar ? (
                                      <Avatar className="h-5 w-5">
                                        <AvatarImage src={notification.senderAvatar} />
                                        <AvatarFallback className="text-xs">
                                          {notification.senderName?.split(' ')[0][0]}
                                        </AvatarFallback>
                                      </Avatar>
                                    ) : (
                                      <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                                        <Building className="h-3 w-3" />
                                      </div>
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                      {notification.senderName}
                                    </span>
                                    <span className="text-xs text-muted-foreground">•</span>
                                    <span className="text-xs text-muted-foreground">
                                      {notification.category}
                                    </span>
                                  </div>
                                  
                                  {/* Action buttons */}
                                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {notification.actionLabel && notification.actionUrl && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-6 text-xs"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Navigate to action URL
                                        }}
                                      >
                                        {notification.actionLabel}
                                      </Button>
                                    )}
                                    
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button 
                                          size="sm" 
                                          variant="ghost" 
                                          className="h-6 w-6 p-0"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <MoreVertical className="h-3 w-3" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent>
                                        <DropdownMenuItem
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            markNotificationAsRead(notification.id);
                                          }}
                                        >
                                          {notification.isRead ? (
                                            <>
                                              <EyeOff className="h-4 w-4 mr-2" />
                                              {t('markAsUnread')}
                                            </>
                                          ) : (
                                            <>
                                              <Eye className="h-4 w-4 mr-2" />
                                              {t('markAsRead')}
                                            </>
                                          )}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <Copy className="h-4 w-4 mr-2" />
                                          {t('copy')}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <Share2 className="h-4 w-4 mr-2" />
                                          {t('share')}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <Pin className="h-4 w-4 mr-2" />
                                          {t('pin')}
                                        </DropdownMenuItem>
                                        <Separator />
                                        <DropdownMenuItem 
                                          className="text-destructive"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            deleteNotification(notification.id);
                                          }}
                                        >
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          {t('delete')}
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      
                      {filteredNotifications.length === 0 && (
                        <motion.div 
                          className="text-center py-20"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                          <h3 className="text-lg font-semibold mb-2">{t('noNotifications')}</h3>
                          <p className="text-muted-foreground">
                            {notificationsFilter === 'unread' ? 'جميع الإشعارات مقروءة' : 
                             notificationsFilter === 'urgent' ? 'لا توجد إشعارات عاجلة' :
                             notificationsFilter === 'today' ? 'لا توجد إشعارات اليوم' :
                             'لم تتلق أي إشعارات بعد'}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </ScrollArea>
                </Card>
              </motion.div>
            </div>

            {/* Notification Settings Dialog */}
            <Dialog open={showNotificationSettings} onOpenChange={setShowNotificationSettings}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    {t('notificationSettings')}
                  </DialogTitle>
                  <DialogDescription>
                    تخصيص إعدادات الإشعارات حسب التفضيلات الشخصية
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  {/* Sound Settings */}
                  <div className="space-y-4">
                    <h4 className="font-medium">إعدادات الصوت</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{t('soundEnabled')}</p>
                          <p className="text-xs text-muted-foreground">تشغيل أصوات الإشعارات</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{t('vibrationEnabled')}</p>
                          <p className="text-xs text-muted-foreground">تفعيل الاهتزاز للإشعارات</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  {/* Notification Types */}
                  <div className="space-y-4">
                    <h4 className="font-medium">أنواع الإشعارات</h4>
                    <div className="space-y-3">
                      {[
                        { key: 'push', label: t('pushNotifications'), desc: 'إشعارات فورية على الجهاز' },
                        { key: 'email', label: t('emailNotifications'), desc: 'إشعارات عبر البريد الإلكتروني' },
                        { key: 'sms', label: t('smsNotifications'), desc: 'إشعارات عبر الرسائل النصية' }
                      ].map((setting) => (
                        <div key={setting.key} className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">{setting.label}</p>
                            <p className="text-xs text-muted-foreground">{setting.desc}</p>
                          </div>
                          <Switch defaultChecked={setting.key === 'push'} />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Priority Settings */}
                  <div className="space-y-4">
                    <h4 className="font-medium">إعدادات الأولوية</h4>
                    <div className="space-y-3">
                      {[
                        { priority: 'urgent', label: t('urgent'), color: 'bg-red-500' },
                        { priority: 'high', label: t('high'), color: 'bg-orange-500' },
                        { priority: 'normal', label: t('normal'), color: 'bg-blue-500' },
                        { priority: 'low', label: t('low'), color: 'bg-gray-500' }
                      ].map((level) => (
                        <div key={level.priority} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${level.color}`} />
                            <span className="text-sm font-medium">{level.label}</span>
                          </div>
                          <Switch defaultChecked={level.priority !== 'low'} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowNotificationSettings(false)}>
                    {t('cancel')}
                  </Button>
                  <Button onClick={() => setShowNotificationSettings(false)}>
                    {t('save')}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Call Overlay */}
      <AnimatePresence>
        {showCallDialog && activeCalls.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-xl p-8 max-w-md w-full mx-4"
            >
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                  <Phone className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {activeCalls[0].participants[0].name}
                </h3>
                <p className="text-muted-foreground mb-2">
                  {activeCalls[0].status === 'active' ? t('connected') : t('connecting')}
                </p>
                <div className="flex justify-center gap-4 mt-6">
                  <Button
                    size="lg"
                    variant="destructive"
                    onClick={() => endCall(activeCalls[0].id)}
                    className="rounded-full w-14 h-14 p-0"
                  >
                    <PhoneOff className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}