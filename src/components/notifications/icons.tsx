import React from 'react';
import { 
  Bell, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  User, 
  UserCheck, 
  MessageSquare, 
  Heart, 
  Pill, 
  FileText, 
  CreditCard, 
  Shield, 
  Zap, 
  TrendingUp,
  AlertTriangle,
  Info,
  Settings,
  Building,
  Stethoscope,
  Activity,
  Target,
  Briefcase,
  PhoneCall,
  Video,
  MapPin,
  Camera,
  Mic,
  Send,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  Timer,
  CalendarDays,
  ClockIcon
} from 'lucide-react';

// Icon helper functions
export const getTypeIcon = (type: string) => {
  switch (type) {
    case 'task': return <CheckCircle2 className="h-4 w-4" />;
    case 'appointment': return <Calendar className="h-4 w-4" />;
    case 'alert': return <AlertCircle className="h-4 w-4" />;
    case 'reminder': return <Clock className="h-4 w-4" />;
    case 'system': return <Settings className="h-4 w-4" />;
    case 'urgent': return <Zap className="h-4 w-4" />;
    case 'info': return <Info className="h-4 w-4" />;
    default: return <Bell className="h-4 w-4" />;
  }
};

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'medical': return <Stethoscope className="h-4 w-4" />;
    case 'administrative': return <Building className="h-4 w-4" />;
    case 'financial': return <CreditCard className="h-4 w-4" />;
    case 'technical': return <Settings className="h-4 w-4" />;
    case 'emergency': return <Zap className="h-4 w-4" />;
    case 'patient': return <User className="h-4 w-4" />;
    case 'staff': return <UserCheck className="h-4 w-4" />;
    case 'system': return <Settings className="h-4 w-4" />;
    case 'admin': return <Briefcase className="h-4 w-4" />;
    default: return <Briefcase className="h-4 w-4" />;
  }
};

export const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'critical': return <AlertTriangle className="h-4 w-4" />;
    case 'urgent': return <Zap className="h-4 w-4" />;
    case 'high': return <AlertCircle className="h-4 w-4" />;
    case 'medium': return <Info className="h-4 w-4" />;
    case 'low': return <CheckCircle2 className="h-4 w-4" />;
    default: return <Info className="h-4 w-4" />;
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return <CheckCircle2 className="h-4 w-4" />;
    case 'processing': return <Zap className="h-4 w-4 animate-pulse" />;
    case 'queued': return <Clock className="h-4 w-4" />;
    case 'failed': return <XCircle className="h-4 w-4" />;
    case 'cancelled': return <XCircle className="h-4 w-4" />;
    case 'in_progress': return <Activity className="h-4 w-4" />;
    case 'pending': return <Clock className="h-4 w-4" />;
    case 'overdue': return <AlertTriangle className="h-4 w-4" />;
    default: return <Clock className="h-4 w-4" />;
  }
};